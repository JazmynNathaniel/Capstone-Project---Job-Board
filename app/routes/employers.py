from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from ..extensions import db
from ..models import Employer, User

employers_bp = Blueprint("employers", __name__)


def _employer_to_dict(employer):
    return {
        "id": employer.id,
        "user_id": employer.user_id,
        "name": employer.name,
        "email": employer.email,
        "company_name": employer.company_name,
        "contact_person": employer.contact_person,
        "created_at": employer.created_at.isoformat() if employer.created_at else None,
    }

@employers_bp.route("/", methods=["GET"])
@jwt_required()
def list_employers():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role == "admin":
        employers = Employer.query.all()
    elif user.role == "employer":
        employers = Employer.query.filter_by(user_id=user.id).all()
    else:
        return jsonify({"error": "Forbidden"}), 403
    return jsonify([_employer_to_dict(e) for e in employers]), 200


@employers_bp.route("/", methods=["POST"])
@jwt_required()
def create_employer():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    required = ["user_id", "name", "email", "company_name", "contact_person", "password_hash"]
    if any(not data.get(k) for k in required):
        return jsonify({"error": "Missing fields"}), 400

    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role == "employer" and int(data["user_id"]) != user.id:
        return jsonify({"error": "Forbidden"}), 403
    if user.role not in {"employer", "admin"}:
        return jsonify({"error": "Forbidden"}), 403

    employer = Employer(
        user_id=int(data["user_id"]),
        name=data["name"],
        email=data["email"],
        company_name=data["company_name"],
        contact_person=data["contact_person"],
        password_hash=data["password_hash"],
    )
    db.session.add(employer)
    db.session.commit()
    return jsonify(_employer_to_dict(employer)), 201


@employers_bp.route("/<int:employer_id>", methods=["GET"])
@jwt_required()
def get_employer(employer_id):
    employer = Employer.query.get(employer_id)
    if not employer:
        return jsonify({"error": "Not found"}), 404
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role == "admin":
        return jsonify(_employer_to_dict(employer)), 200
    if user.role == "employer" and employer.user_id == user.id:
        return jsonify(_employer_to_dict(employer)), 200
    return jsonify({"error": "Forbidden"}), 403
    return jsonify(_employer_to_dict(employer)), 200


@employers_bp.route("/<int:employer_id>", methods=["PUT"])
@jwt_required()
def update_employer(employer_id):
    employer = Employer.query.get(employer_id)
    if not employer:
        return jsonify({"error": "Not found"}), 404
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role == "admin":
        pass
    elif user.role == "employer" and employer.user_id == user.id:
        pass
    else:
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    for field in ["user_id", "name", "email", "company_name", "contact_person", "password_hash"]:
        if field in data:
            value = data[field]
            if field == "user_id":
                value = int(value)
            setattr(employer, field, value)

    db.session.commit()
    return jsonify(_employer_to_dict(employer)), 200

@employers_bp.route("/<int:employer_id>", methods=["DELETE"])
@jwt_required()
def delete_employer(employer_id):
    employer = Employer.query.get(employer_id)
    if not employer:
        return jsonify({"error": "Not found"}), 404
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role != "admin":
        return jsonify({"error": "Forbidden"}), 403

    try:
        db.session.delete(employer)
        db.session.commit()
        return jsonify({"message": "Deleted"}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "error": "Cannot delete employer because it has related records (jobs/applications). Delete those first."
        }), 409

