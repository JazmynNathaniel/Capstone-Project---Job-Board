from datetime import datetime  #this savesthe current date and time a user was c
from .extensions import db

#this imports the database instance from extensions.py, which is where I defined it. and then I can use it to define my models.


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    role = db.Column(db.String(20), nullable=False)
    
    def __repr__(self):
        return f'<User {self.username}>'
    
class Employer(db.Model):
    __tablename__ = 'employers'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    company_name = db.Column(db.String(120), nullable=False)
    contact_person = db.Column(db.String(120), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship(
        "User",
        backref=db.backref("employer_profile", uselist=False, cascade="all, delete-orphan"),
        passive_deletes=True
    )
    
    #backef lets me do a reverse lookup from the User model to the Employer model, 
    # so I can do user.employer_profile to get the employer profile associated with a user. 
    # uselist=False means that there is a one-to-one relationship between User and Employer, 
    # so each user can only have one employer profile.
    
    def __repr__(self):
        return f'<Employer {self.name}>'#this is a string representation of the Employer object, 
                                       #which will be useful for debugging and logging purposes.
                                       
class Job(db.Model):
    __tablename__ = 'jobs'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(120), nullable=False)
    salary = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    employer_id = db.Column(db.Integer, db.ForeignKey('employers.id', ondelete='CASCADE'), nullable=False)
    employer = db.relationship(
        "Employer",
        backref=db.backref("jobs", lazy=True, cascade="all, delete-orphan"),
        passive_deletes=True
    )
    
    def __repr__(self):
        return f'<Job {self.title}>'
    
class Application(db.Model):
    __tablename__ = 'applications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id', ondelete='CASCADE'), nullable=False)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship(
        "User",
        backref=db.backref("applications", lazy=True, cascade="all, delete-orphan"),
        passive_deletes=True
    )
    job = db.relationship(
        "Job",
        backref=db.backref("applications", lazy=True, cascade="all, delete-orphan"),
        passive_deletes=True
    )
    
    def __repr__(self):
        return f'<Application {self.id} - User {self.user_id} - Job {self.job_id}>'
    #this is a string representation of the Application object, which will be useful for debugging and logging purposes. 
    # It includes the application ID, the user ID, and the job ID associated with the application.

class Profile(db.Model):
    __tablename__ = 'profiles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship(
        "User",
        backref=db.backref("profile", uselist=False, cascade="all, delete-orphan"),
        passive_deletes=True
    )
    
    def __repr__(self):
        return f'<Profile {self.full_name}>'
