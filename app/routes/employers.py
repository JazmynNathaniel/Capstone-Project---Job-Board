from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import Employer

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
def list_employers():
    employers = Employer.query.all()
    return jsonify([_employer_to_dict(e) for e in employers]), 200


@employers_bp.route("/", methods=["POST"])
def create_employer():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    required = ["user_id", "name", "email", "company_name", "contact_person", "password_hash"]
    if any(not data.get(k) for k in required):
        return jsonify({"error": "Missing fields"}), 400

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
def get_employer(employer_id):
    employer = Employer.query.get(employer_id)
    if not employer:
        return jsonify({"error": "Not found"}), 404
    return jsonify(_employer_to_dict(employer)), 200


@employers_bp.route("/<int:employer_id>", methods=["PUT"])
def update_employer(employer_id):
    employer = Employer.query.get(employer_id)
    if not employer:
        return jsonify({"error": "Not found"}), 404

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
def delete_employer(employer_id):
    employer = Employer.query.get(employer_id)
    if not employer:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(employer)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200
