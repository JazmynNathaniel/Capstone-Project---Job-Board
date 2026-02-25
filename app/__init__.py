import os
from flask import Flask, app, jsonify, request, send_from_directory
from sqlalchemy import event
from sqlalchemy.engine import Engine
from sqlite3 import Connection as SQLite3Connection
from .extensions import db, migrate, ma, jwt, cors
from config import Config
from . import models

def create_app():
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    dist_dir = os.path.join(project_root, "frontend", "dist")
    app = Flask(__name__, static_folder=dist_dir, static_url_path="/")
    app.config.from_object(Config)
    print("DB URI =", app.config.get("SQLALCHEMY_DATABASE_URI"))


    db.init_app(app)
    @event.listens_for(Engine, "connect")
    def _set_sqlite_pragma(dbapi_connection, connection_record):
        if isinstance(dbapi_connection, SQLite3Connection):
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.close()
    from . import models
    jwt.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)

    cors.init_app(
        app,
        resources={r"/*": {"origins": app.config.get("CORS_ORIGINS", ["*"])}},
        supports_credentials=True
    )
    with app.app_context():
        from . import models
        db.create_all() #this creates the tables in the database based on the models defined in app/models.py.
    # register blueprints
    from .routes import auth_bp, jobs_bp, applications_bp, profiles_bp, employers_bp, users_bp, adzuna_bp, saved_jobs_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(jobs_bp, url_prefix="/jobs")
    app.register_blueprint(applications_bp, url_prefix="/applications")
    app.register_blueprint(profiles_bp, url_prefix="/profiles")
    app.register_blueprint(employers_bp, url_prefix="/employers")
    app.register_blueprint(users_bp, url_prefix="/users")
    app.register_blueprint(adzuna_bp, url_prefix="/adzuna")
    app.register_blueprint(saved_jobs_bp, url_prefix="/saved-jobs")

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"}), 200

    if os.path.exists(dist_dir):
        @app.get("/")
        def serve_index():
            return send_from_directory(dist_dir, "index.html")

        @app.get("/<path:path>")
        def serve_static(path):
            file_path = os.path.join(dist_dir, path)
            if os.path.exists(file_path):
                return send_from_directory(dist_dir, path)
            return send_from_directory(dist_dir, "index.html")

        @app.errorhandler(404)
        def spa_fallback(_):
            api_prefixes = (
                "/auth",
                "/jobs",
                "/applications",
                "/profiles",
                "/employers",
                "/users",
                "/adzuna",
                "/saved-jobs",
                "/health",
            )
            if request.path.startswith(api_prefixes) or request.path.startswith("/assets"):
                return jsonify({"error": "Not found"}), 404
            return send_from_directory(dist_dir, "index.html")
    else:
        @app.get("/")
        def api_root():
            return jsonify({
                "message": "Frontend build not found. Run `npm run build` in frontend/.",
                "health": "/health",
                "jobs": "/jobs/"
            }), 200

    return app
