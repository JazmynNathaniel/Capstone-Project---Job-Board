from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import Application

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
def list_applications():
    applications = Application.query.all()
    return jsonify([_application_to_dict(a) for a in applications]), 200


@applications_bp.route("/", methods=["POST"])
def create_application():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    required = ["user_id", "job_id"]
    if any(k not in data or data.get(k) in (None, "") for k in required):
        return jsonify({"error": "Missing fields"}), 400

    application = Application(
        user_id=int(data["user_id"]),
        job_id=int(data["job_id"]),
        status=data.get("status", "pending"),
    )

    db.session.add(application)
    db.session.commit()
    return jsonify(_application_to_dict(application)), 201


@applications_bp.route("/<int:application_id>", methods=["GET"])
def get_application(application_id):
    application = Application.query.get(application_id)
    if not application:
        return jsonify({"error": "Not found"}), 404
    return jsonify(_application_to_dict(application)), 200


@applications_bp.route("/<int:application_id>", methods=["PUT"])
def update_application(application_id):
    application = Application.query.get(application_id)
    if not application:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    for field in ["user_id", "job_id", "status"]:
        if field in data:
            value = data[field]
            if value in (None, ""):
                return jsonify({"error": f"Invalid {field}"}), 400
            if field in ["user_id", "job_id"]:
                value = int(value)
            setattr(application, field, value)

    db.session.commit()
    return jsonify(_application_to_dict(application)), 200


@applications_bp.route("/<int:application_id>", methods=["DELETE"])
def delete_application(application_id):
    application = Application.query.get(application_id)
    if not application:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(application)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200
