"""fix applications job fk

Revision ID: 6d2f3d2f7b1a
Revises: 551560bdfedd
Create Date: 2026-02-18 16:35:00.000000

"""
from alembic import op


# revision identifiers, used by Alembic.
revision = '6d2f3d2f7b1a'
down_revision = '551560bdfedd'
branch_labels = None
depends_on = None


def upgrade():
    # Rebuild applications table so job_id FK points to jobs (not _jobs_old).
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

    op.execute("PRAGMA foreign_keys=ON")


def downgrade():
    # No-op: keep corrected FK on downgrade.
    pass
