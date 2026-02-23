from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db
from ..models import User

users_bp = Blueprint("users", __name__)


def _user_to_dict(user):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }


@users_bp.route("/", methods=["GET"])
@jwt_required()
def list_users():
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role != "admin":
        return jsonify({"error": "Forbidden"}), 403
    users = User.query.order_by(User.id.asc()).all()
    return jsonify([_user_to_dict(u) for u in users]), 200


@users_bp.route("/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if user.role != "admin":
        return jsonify({"error": "Forbidden"}), 403
    if user.id == user_id:
        return jsonify({"error": "Cannot delete your own admin account"}), 400

    target = User.query.get(user_id)
    if not target:
        return jsonify({"error": "Not found"}), 404

    db.session.delete(target)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200
