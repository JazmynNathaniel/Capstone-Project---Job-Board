from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import Profile

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
def list_profiles():
    profiles = Profile.query.all()
    return jsonify([_profile_to_dict(p) for p in profiles]), 200


@profiles_bp.route("/", methods=["POST"])
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

    profile = Profile()
    profile.user_id = user_id
    profile.full_name = data["full_name"]
    profile.bio = data.get("bio")

    db.session.add(profile)
    db.session.commit()
    return jsonify(_profile_to_dict(profile)), 201


@profiles_bp.route("/<int:profile_id>", methods=["GET"])
def get_profile(profile_id):
    profile = Profile.query.get(profile_id)
    if not profile:
        return jsonify({"error": "Not found"}), 404
    return jsonify(_profile_to_dict(profile)), 200


@profiles_bp.route("/<int:profile_id>", methods=["PUT"])
def update_profile(profile_id):
    profile = Profile.query.get(profile_id)
    if not profile:
        return jsonify({"error": "Not found"}), 404

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
def delete_profile(profile_id):
    profile = Profile.query.get(profile_id)
    if not profile:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(profile)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200
