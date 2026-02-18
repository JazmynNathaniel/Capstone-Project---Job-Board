import os
from dotenv import load_dotenv
# Load environment variables from .env file 
load_dotenv()
class Config:
    # Flask configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'KEVINKEVIN71150%WHITE')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'KevinKevin71150%ORANGELEVEL10')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///somedeed.db')
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000')
    CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    
#My configuration file was initially in the wrong directory, which prevented Flask from resolving imports. 
# Once I moved config.py to the project root,
# the app factory could properly load environment settings and initialize extensions 
# like SQLAlchemy, JWT, and Marshmallow.