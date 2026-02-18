from . import models
from .extensions import ma

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.User
        load_instance = True
        include_fk = True
        
class EmployerSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Employer
        load_instance = True
        include_fk = True
        
class JobSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Job
        load_instance = True
        include_fk = True
        
class ApplicationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Application
        load_instance = True
        include_fk = True
        
