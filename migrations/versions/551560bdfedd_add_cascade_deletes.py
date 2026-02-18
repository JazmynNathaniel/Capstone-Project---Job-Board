"""add cascade deletes

Revision ID: 551560bdfedd
Revises: 91cd5a037b89
Create Date: 2026-02-18 14:06:45.926984

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '551560bdfedd'
down_revision = '91cd5a037b89'
branch_labels = None
depends_on = None


def upgrade():
    # SQLite does not name foreign keys by default; rebuild tables to add ON DELETE CASCADE.
    op.execute("PRAGMA foreign_keys=OFF")

    op.execute("ALTER TABLE applications RENAME TO _applications_old")
    op.execute(
        "CREATE TABLE applications ("
        "id INTEGER NOT NULL PRIMARY KEY, "
        "user_id INTEGER NOT NULL, "
        "job_id INTEGER NOT NULL, "
        "status VARCHAR(20), "
        "created_at DATETIME, "
        "FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE, "
        "FOREIGN KEY(job_id) REFERENCES jobs (id) ON DELETE CASCADE"
        ")"
    )
    op.execute(
        "INSERT INTO applications (id, user_id, job_id, status, created_at) "
        "SELECT id, user_id, job_id, status, created_at FROM _applications_old"
    )
    op.execute("DROP TABLE _applications_old")

    op.execute("ALTER TABLE employers RENAME TO _employers_old")
    op.execute(
        "CREATE TABLE employers ("
        "id INTEGER NOT NULL PRIMARY KEY, "
        "user_id INTEGER NOT NULL, "
        "name VARCHAR(120) NOT NULL, "
        "email VARCHAR(120) NOT NULL, "
        "company_name VARCHAR(120) NOT NULL, "
        "contact_person VARCHAR(120) NOT NULL, "
        "password_hash VARCHAR(128) NOT NULL, "
        "created_at DATETIME, "
        "FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE"
        ")"
    )
    op.execute(
        "INSERT INTO employers (id, user_id, name, email, company_name, contact_person, password_hash, created_at) "
        "SELECT id, user_id, name, email, company_name, contact_person, password_hash, created_at FROM _employers_old"
    )
    op.execute("DROP TABLE _employers_old")

    op.execute("ALTER TABLE jobs RENAME TO _jobs_old")
    op.execute(
        "CREATE TABLE jobs ("
        "id INTEGER NOT NULL PRIMARY KEY, "
        "title VARCHAR(120) NOT NULL, "
        "description TEXT NOT NULL, "
        "location VARCHAR(120) NOT NULL, "
        "salary FLOAT NOT NULL, "
        "created_at DATETIME, "
        "employer_id INTEGER NOT NULL, "
        "FOREIGN KEY(employer_id) REFERENCES employers (id) ON DELETE CASCADE"
        ")"
    )
    op.execute(
        "INSERT INTO jobs (id, title, description, location, salary, created_at, employer_id) "
        "SELECT id, title, description, location, salary, created_at, employer_id FROM _jobs_old"
    )
    op.execute("DROP TABLE _jobs_old")

    op.execute("ALTER TABLE profiles RENAME TO _profiles_old")
    op.execute(
        "CREATE TABLE profiles ("
        "id INTEGER NOT NULL PRIMARY KEY, "
        "user_id INTEGER NOT NULL, "
        "full_name VARCHAR(120) NOT NULL, "
        "bio TEXT, "
        "created_at DATETIME, "
        "FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE"
        ")"
    )
    op.execute(
        "INSERT INTO profiles (id, user_id, full_name, bio, created_at) "
        "SELECT id, user_id, full_name, bio, created_at FROM _profiles_old"
    )
    op.execute("DROP TABLE _profiles_old")

    op.execute("PRAGMA foreign_keys=ON")


def downgrade():
    # Remove ON DELETE CASCADE by rebuilding tables without it.
    op.execute("PRAGMA foreign_keys=OFF")

    op.execute("ALTER TABLE applications RENAME TO _applications_old")
    op.execute(
        "CREATE TABLE applications ("
        "id INTEGER NOT NULL PRIMARY KEY, "
        "user_id INTEGER NOT NULL, "
        "job_id INTEGER NOT NULL, "
        "status VARCHAR(20), "
        "created_at DATETIME, "
        "FOREIGN KEY(user_id) REFERENCES users (id), "
        "FOREIGN KEY(job_id) REFERENCES jobs (id)"
        ")"
    )
    op.execute(
        "INSERT INTO applications (id, user_id, job_id, status, created_at) "
        "SELECT id, user_id, job_id, status, created_at FROM _applications_old"
    )
    op.execute("DROP TABLE _applications_old")

    op.execute("ALTER TABLE employers RENAME TO _employers_old")
    op.execute(
        "CREATE TABLE employers ("
        "id INTEGER NOT NULL PRIMARY KEY, "
        "user_id INTEGER NOT NULL, "
        "name VARCHAR(120) NOT NULL, "
        "email VARCHAR(120) NOT NULL, "
        "company_name VARCHAR(120) NOT NULL, "
        "contact_person VARCHAR(120) NOT NULL, "
        "password_hash VARCHAR(128) NOT NULL, "
        "created_at DATETIME, "
        "FOREIGN KEY(user_id) REFERENCES users (id)"
        ")"
    )
    op.execute(
        "INSERT INTO employers (id, user_id, name, email, company_name, contact_person, password_hash, created_at) "
        "SELECT id, user_id, name, email, company_name, contact_person, password_hash, created_at FROM _employers_old"
    )
    op.execute("DROP TABLE _employers_old")

    op.execute("ALTER TABLE jobs RENAME TO _jobs_old")
    op.execute(
        "CREATE TABLE jobs ("
        "id INTEGER NOT NULL PRIMARY KEY, "
        "title VARCHAR(120) NOT NULL, "
        "description TEXT NOT NULL, "
        "location VARCHAR(120) NOT NULL, "
        "salary FLOAT NOT NULL, "
        "created_at DATETIME, "
        "employer_id INTEGER NOT NULL, "
        "FOREIGN KEY(employer_id) REFERENCES employers (id)"
        ")"
    )
    op.execute(
        "INSERT INTO jobs (id, title, description, location, salary, created_at, employer_id) "
        "SELECT id, title, description, location, salary, created_at, employer_id FROM _jobs_old"
    )
    op.execute("DROP TABLE _jobs_old")

    op.execute("ALTER TABLE profiles RENAME TO _profiles_old")
    op.execute(
        "CREATE TABLE profiles ("
        "id INTEGER NOT NULL PRIMARY KEY, "
        "user_id INTEGER NOT NULL, "
        "full_name VARCHAR(120) NOT NULL, "
        "bio TEXT, "
        "created_at DATETIME, "
        "FOREIGN KEY(user_id) REFERENCES users (id)"
        ")"
    )
    op.execute(
        "INSERT INTO profiles (id, user_id, full_name, bio, created_at) "
        "SELECT id, user_id, full_name, bio, created_at FROM _profiles_old"
    )
    op.execute("DROP TABLE _profiles_old")

    op.execute("PRAGMA foreign_keys=ON")
