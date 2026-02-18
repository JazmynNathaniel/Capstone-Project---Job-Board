from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()
migrate = Migrate()
ma = Marshmallow()

#This file holds my extensionns in one place, 
# so I can import them in my app/__init__.py without having to worry about circular imports.
# circular imports are when two or more modules import each other, 
# which can cause problems in Python. 
# By defining my extensions in a separate file, 
# I can avoid this issue and keep my code organized.
