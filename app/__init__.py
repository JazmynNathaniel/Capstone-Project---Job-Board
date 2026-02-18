from flask import Flask, app, jsonify, request
from .extensions import db, migrate, ma, jwt, cors
from config import Config
from . import models

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    print("DB URI =", app.config.get("SQLALCHEMY_DATABASE_URI"))


    db.init_app(app)
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
    from .routes import auth_bp, jobs_bp, applications_bp, profiles_bp, employers_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(jobs_bp, url_prefix="/jobs")
    app.register_blueprint(applications_bp, url_prefix="/applications")
    app.register_blueprint(profiles_bp, url_prefix="/profiles")
    app.register_blueprint(employers_bp, url_prefix="/employers")

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"}), 200

    return app
