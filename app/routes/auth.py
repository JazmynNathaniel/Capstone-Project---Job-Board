from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

from ..extensions import db
from ..models import User
from ..schemas import UserSchema

auth_bp = Blueprint("auth", __name__)


# REGISTER
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not username or not email or not password or not role:
        return jsonify({"error": "Missing fields"}), 400
    if "@" not in email:
        return jsonify({"error": "Invalid email"}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400
    if role not in {"user", "employer", "admin"}:
        return jsonify({"error": "Invalid role"}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"error": "Email already exists"}), 400

    hashed = generate_password_hash(password)

    user = User()
    user.username = username
    user.email = email
    user.password_hash = hashed
    user.role = role
    
    


    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created"}), 201


# LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing fields"}), 400
    if "@" not in email:
        return jsonify({"error": "Invalid email"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=user.id)

    return jsonify({
        "token": token,
        "user_id": user.id,
        "role": user.role
    })


# LOGOUT
@auth_bp.route("/logout", methods=["POST"])
def logout():
    # In a real application, you would handle token revocation here.
    return jsonify({"message": "Logged out"}), 200

