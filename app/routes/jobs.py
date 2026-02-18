from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import Job

jobs_bp = Blueprint("jobs", __name__)

def _parse_int(value, field):
    try:
        return int(value), None
    except (TypeError, ValueError):
        return None, f"Invalid {field}"


def _parse_float(value, field):
    try:
        return float(value), None
    except (TypeError, ValueError):
        return None, f"Invalid {field}"


def _job_to_dict(job):
    return {
        "id": job.id,
        "title": job.title,
        "description": job.description,
        "location": job.location,
        "salary": job.salary,
        "employer_id": job.employer_id,
        "created_at": job.created_at.isoformat() if job.created_at else None,
    }


@jobs_bp.route("/", methods=["GET"])
def list_jobs():
    jobs = Job.query.all()
    return jsonify([_job_to_dict(j) for j in jobs]), 200


@jobs_bp.route("/", methods=["POST"])
def create_job():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    required = ["title", "description", "location", "salary", "employer_id"]
    if any(k not in data or data.get(k) in (None, "") for k in required):
        return jsonify({"error": "Missing fields"}), 400

    salary, err = _parse_float(data.get("salary"), "salary")
    if err:
        return jsonify({"error": err}), 400
    employer_id, err = _parse_int(data.get("employer_id"), "employer_id")
    if err:
        return jsonify({"error": err}), 400

    # Use constructor args; bare `title=...` lines would be no-op tuple expressions.
    job = Job(
        title=data["title"],
        description=data["description"],
        location=data["location"],
        salary=salary,
        employer_id=employer_id,
    )
    db.session.add(job)
    db.session.commit()
    return jsonify(_job_to_dict(job)), 201


@jobs_bp.route("/<int:job_id>", methods=["GET"])
def get_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Not found"}), 404
    return jsonify(_job_to_dict(job)), 200


@jobs_bp.route("/<int:job_id>", methods=["PUT"])
def update_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    for field in ["title", "description", "location", "salary", "employer_id"]:
        if field in data:
            value = data[field]
            if value in (None, ""):
                return jsonify({"error": f"Invalid {field}"}), 400
            if field == "salary":
                value, err = _parse_float(value, "salary")
                if err:
                    return jsonify({"error": err}), 400
            if field == "employer_id":
                value, err = _parse_int(value, "employer_id")
                if err:
                    return jsonify({"error": err}), 400
            setattr(job, field, value)

    db.session.commit()
    return jsonify(_job_to_dict(job)), 200


@jobs_bp.route("/<int:job_id>", methods=["DELETE"])
def delete_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200
