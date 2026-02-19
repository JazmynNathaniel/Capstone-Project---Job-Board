from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import Application, Job, Employer, User

applications_bp = Blueprint("applications", __name__)


def _application_to_dict(application):
    return {
        "id": application.id,
        "user_id": application.user_id,
        "job_id": application.job_id,
        "status": application.status,
        "created_at": application.created_at.isoformat() if application.created_at else None,
    }


@applications_bp.route("/", methods=["GET"])
@jwt_required()
def list_applications():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role == "user":
        applications = Application.query.filter_by(user_id=user.id).all()
    elif user.role == "employer":
        employer = Employer.query.filter_by(user_id=user.id).first()
        if not employer:
            return jsonify([]), 200
        job_ids = [j.id for j in Job.query.filter_by(employer_id=employer.id).all()]
        applications = Application.query.filter(Application.job_id.in_(job_ids)).all()
    elif user.role == "admin":
        applications = Application.query.all()
    else:
        return jsonify({"error": "Forbidden"}), 403
    return jsonify([_application_to_dict(a) for a in applications]), 200


@applications_bp.route("/", methods=["POST"])
@jwt_required()
def create_application():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    required = ["user_id", "job_id"]
    if any(k not in data or data.get(k) in (None, "") for k in required):
        return jsonify({"error": "Missing fields"}), 400

    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role != "user":
        return jsonify({"error": "Forbidden"}), 403

    user_id = int(data["user_id"])
    if user_id != user.id:
        return jsonify({"error": "Forbidden"}), 403

    application = Application(
        user_id=user_id,
        job_id=int(data["job_id"]),
        status="pending",
    )

    db.session.add(application)
    db.session.commit()
    return jsonify(_application_to_dict(application)), 201


@applications_bp.route("/<int:application_id>", methods=["GET"])
@jwt_required()
def get_application(application_id):
    application = Application.query.get(application_id)
    if not application:
        return jsonify({"error": "Not found"}), 404
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role == "user" and application.user_id != user.id:
        return jsonify({"error": "Forbidden"}), 403
    if user.role == "employer":
        employer = Employer.query.filter_by(user_id=user.id).first()
        if not employer:
            return jsonify({"error": "Forbidden"}), 403
        job_ids = [j.id for j in Job.query.filter_by(employer_id=employer.id).all()]
        if application.job_id not in job_ids:
            return jsonify({"error": "Forbidden"}), 403
    if user.role not in {"user", "employer", "admin"}:
        return jsonify({"error": "Forbidden"}), 403
    return jsonify(_application_to_dict(application)), 200


@applications_bp.route("/<int:application_id>", methods=["PUT"])
@jwt_required()
def update_application(application_id):
    application = Application.query.get(application_id)
    if not application:
        return jsonify({"error": "Not found"}), 404
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role == "employer":
        employer = Employer.query.filter_by(user_id=user.id).first()
        if not employer:
            return jsonify({"error": "Forbidden"}), 403
        job_ids = [j.id for j in Job.query.filter_by(employer_id=employer.id).all()]
        if application.job_id not in job_ids:
            return jsonify({"error": "Forbidden"}), 403
    elif user.role != "admin":
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    if "status" in data:
        status = data["status"]
        if status not in {"pending", "accepted", "rejected"}:
            return jsonify({"error": "Invalid status"}), 400
        application.status = status

    db.session.commit()
    return jsonify(_application_to_dict(application)), 200


@applications_bp.route("/<int:application_id>", methods=["DELETE"])
@jwt_required()
def delete_application(application_id):
    application = Application.query.get(application_id)
    if not application:
        return jsonify({"error": "Not found"}), 404
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role != "admin":
        return jsonify({"error": "Forbidden"}), 403
    db.session.delete(application)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200
