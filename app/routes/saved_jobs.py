from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from ..extensions import db
from ..models import SavedJob, Job, User

saved_jobs_bp = Blueprint("saved_jobs", __name__)


def _saved_job_to_dict(saved):
    return {
        "id": saved.id,
        "user_id": saved.user_id,
        "job_id": saved.job_id,
        "created_at": saved.created_at.isoformat() if saved.created_at else None,
    }


@saved_jobs_bp.route("/", methods=["GET"])
@jwt_required()
def list_saved_jobs():
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role != "user":
        return jsonify({"error": "Forbidden"}), 403
    saved = SavedJob.query.filter_by(user_id=user.id).all()
    return jsonify([_saved_job_to_dict(s) for s in saved]), 200


@saved_jobs_bp.route("/", methods=["POST"])
@jwt_required()
def save_job():
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role != "user":
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json()
    if not data or not data.get("job_id"):
        return jsonify({"error": "Missing job_id"}), 400

    job = Job.query.get(int(data["job_id"]))
    if not job:
        return jsonify({"error": "Job not found"}), 404

    saved = SavedJob(user_id=user.id, job_id=job.id)
    try:
        db.session.add(saved)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Already saved"}), 200

    return jsonify(_saved_job_to_dict(saved)), 201


@saved_jobs_bp.route("/<int:job_id>", methods=["DELETE"])
@jwt_required()
def unsave_job(job_id):
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role != "user":
        return jsonify({"error": "Forbidden"}), 403

    saved = SavedJob.query.filter_by(user_id=user.id, job_id=job_id).first()
    if not saved:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(saved)
    db.session.commit()
    return jsonify({"message": "Removed"}), 200
