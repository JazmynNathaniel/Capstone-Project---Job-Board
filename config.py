import os
from dotenv import load_dotenv
# Load environment variables from .env file
load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DEFAULT_DB_PATH = os.path.join(BASE_DIR, "instance", "somedeed.db")

def _normalize_db_url(raw_url: str) -> str:
    if not raw_url:
        return f"sqlite:///{DEFAULT_DB_PATH}"
    if raw_url.startswith("sqlite:///"):
        tail = raw_url.replace("sqlite:///", "", 1)
        if not os.path.isabs(tail):
            return f"sqlite:///{os.path.join(BASE_DIR, tail)}"
    return raw_url


class Config:
    # Flask configuration
    SECRET_KEY = os.getenv("SECRET_KEY", "KEVINKEVIN71150%WHITE")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "KevinKevin71150%ORANGELEVEL10")
    SQLALCHEMY_DATABASE_URI = _normalize_db_url(os.getenv("DATABASE_URL"))
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")
    CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    
#My configuration file was initially in the wrong directory, which prevented Flask from resolving imports. 
# Once I moved config.py to the project root,
# the app factory could properly load environment settings and initialize extensions 
# like SQLAlchemy, JWT, and Marshmallow.
