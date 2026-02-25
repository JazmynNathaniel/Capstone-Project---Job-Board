from .auth import auth_bp
from .jobs import jobs_bp
from .applications import applications_bp
from .profiles import profiles_bp
from .employers import employers_bp
from .users import users_bp
from .adzuna import adzuna_bp
from .saved_jobs import saved_jobs_bp

__all__ = [
    "auth_bp",
    "jobs_bp",
    "applications_bp",
    "profiles_bp",
    "employers_bp",
    "users_bp",
    "adzuna_bp",
    "saved_jobs_bp",
]
