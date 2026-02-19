from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import Profile, User

profiles_bp = Blueprint("profiles", __name__)


def _parse_int(value, field):
    try:
        return int(value), None
    except (TypeError, ValueError):
        return None, f"Invalid {field}"


def _profile_to_dict(profile):
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "full_name": profile.full_name,
        "bio": profile.bio,
        "created_at": profile.created_at.isoformat() if profile.created_at else None,
    }


@profiles_bp.route("/", methods=["GET"])
@jwt_required()
def list_profiles():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role != "admin":
        return jsonify({"error": "Forbidden"}), 403
    profiles = Profile.query.all()
    return jsonify([_profile_to_dict(p) for p in profiles]), 200


@profiles_bp.route("/", methods=["POST"])
@jwt_required()
def create_profile():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    required = ["user_id", "full_name"]
    if any(k not in data or data.get(k) in (None, "") for k in required):
        return jsonify({"error": "Missing fields"}), 400

    user_id, err = _parse_int(data.get("user_id"), "user_id")
    if err:
        return jsonify({"error": err}), 400

    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role == "user" and user_id != user.id:
        return jsonify({"error": "Forbidden"}), 403
    if user.role not in {"user", "admin"}:
        return jsonify({"error": "Forbidden"}), 403

    profile = Profile()
    profile.user_id = user_id
    profile.full_name = data["full_name"]
    profile.bio = data.get("bio")

    db.session.add(profile)
    db.session.commit()
    return jsonify(_profile_to_dict(profile)), 201


@profiles_bp.route("/<int:profile_id>", methods=["GET"])
@jwt_required()
def get_profile(profile_id):
    profile = Profile.query.get(profile_id)
    if not profile:
        return jsonify({"error": "Not found"}), 404
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role == "admin":
        return jsonify(_profile_to_dict(profile)), 200
    if user.role == "user" and profile.user_id == user.id:
        return jsonify(_profile_to_dict(profile)), 200
    return jsonify({"error": "Forbidden"}), 403


@profiles_bp.route("/<int:profile_id>", methods=["PUT"])
@jwt_required()
def update_profile(profile_id):
    profile = Profile.query.get(profile_id)
    if not profile:
        return jsonify({"error": "Not found"}), 404
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role == "admin":
        pass
    elif user.role == "user" and profile.user_id == user.id:
        pass
    else:
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    for field in ["user_id", "full_name", "bio"]:
        if field in data:
            value = data[field]
            if field == "user_id":
                value, err = _parse_int(value, "user_id")
                if err:
                    return jsonify({"error": err}), 400
            setattr(profile, field, value)

    db.session.commit()
    return jsonify(_profile_to_dict(profile)), 200


@profiles_bp.route("/<int:profile_id>", methods=["DELETE"])
@jwt_required()
def delete_profile(profile_id):
    profile = Profile.query.get(profile_id)
    if not profile:
        return jsonify({"error": "Not found"}), 404
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role == "admin":
        pass
    elif user.role == "user" and profile.user_id == user.id:
        pass
    else:
        return jsonify({"error": "Forbidden"}), 403
    db.session.delete(profile)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200


@profiles_bp.route("/me", methods=["GET"])
@jwt_required()
def get_my_profile():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role != "user":
        return jsonify({"error": "Forbidden"}), 403
    profile = Profile.query.filter_by(user_id=user.id).first()
    if not profile:
        return jsonify({"error": "Not found"}), 404
    return jsonify(_profile_to_dict(profile)), 200


@profiles_bp.route("/me", methods=["POST"])
@jwt_required()
def create_my_profile():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role != "user":
        return jsonify({"error": "Forbidden"}), 403

    existing = Profile.query.filter_by(user_id=user.id).first()
    if existing:
        return jsonify({"error": "Profile already exists"}), 400

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    full_name = data.get("full_name")
    if not full_name:
        return jsonify({"error": "Missing full_name"}), 400

    profile = Profile(user_id=user.id, full_name=full_name, bio=data.get("bio"))
    db.session.add(profile)
    db.session.commit()
    return jsonify(_profile_to_dict(profile)), 201


@profiles_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_my_profile():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role != "user":
        return jsonify({"error": "Forbidden"}), 403
    profile = Profile.query.filter_by(user_id=user.id).first()
    if not profile:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    for field in ["full_name", "bio"]:
        if field in data:
            value = data[field]
            if value in (None, ""):
                return jsonify({"error": f"Invalid {field}"}), 400
            setattr(profile, field, value)

    db.session.commit()
    return jsonify(_profile_to_dict(profile)), 200


@profiles_bp.route("/me", methods=["DELETE"])
@jwt_required()
def delete_my_profile():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role != "user":
        return jsonify({"error": "Forbidden"}), 403
    profile = Profile.query.filter_by(user_id=user.id).first()
    if not profile:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(profile)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200
