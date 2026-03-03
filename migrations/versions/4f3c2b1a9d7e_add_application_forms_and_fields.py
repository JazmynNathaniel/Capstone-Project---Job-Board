"""add application forms and applicant fields

Revision ID: 4f3c2b1a9d7e
Revises: 2c9e7b1a6d4a
Create Date: 2026-03-03 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text
from sqlalchemy.exc import OperationalError


# revision identifiers, used by Alembic.
revision = '4f3c2b1a9d7e'
down_revision = '2c9e7b1a6d4a'
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()

    def _table_exists(name):
        if bind.dialect.name == "sqlite":
            rows = bind.execute(
                text("SELECT name FROM sqlite_master WHERE type='table' AND name=:n"),
                {"n": name}
            ).fetchall()
            return len(rows) > 0
        rows = bind.execute(
            text("SELECT table_name FROM information_schema.tables WHERE table_name = :n"),
            {"n": name}
        ).fetchall()
        return len(rows) > 0

    def _column_exists(table, column):
        if bind.dialect.name == "sqlite":
            rows = bind.execute(text(f"PRAGMA table_info({table})")).fetchall()
            return any(r[1] == column for r in rows)
        rows = bind.execute(
            text(
                "SELECT column_name FROM information_schema.columns "
                "WHERE table_name = :t AND column_name = :c"
            ),
            {"t": table, "c": column}
        ).fetchall()
        return len(rows) > 0

    def _index_exists(table, name):
        if bind.dialect.name == "sqlite":
            rows = bind.execute(text(f"PRAGMA index_list({table})")).fetchall()
            return any(r[1] == name for r in rows)
        rows = bind.execute(
            text(
                "SELECT indexname FROM pg_indexes "
                "WHERE tablename = :t AND indexname = :n"
            ),
            {"t": table, "n": name}
        ).fetchall()
        return len(rows) > 0

    if not _table_exists("application_forms"):
        try:
            op.create_table(
                'application_forms',
                sa.Column('id', sa.Integer(), primary_key=True),
                sa.Column('job_id', sa.Integer(), sa.ForeignKey('jobs.id', ondelete='CASCADE'), nullable=False, unique=True),
                sa.Column('created_at', sa.DateTime(), nullable=True),
            )
        except OperationalError as exc:
            if "already exists" not in str(exc):
                raise

    with op.batch_alter_table("applications") as batch:
        if not _column_exists("applications", "full_name"):
            batch.add_column(sa.Column("full_name", sa.String(length=120), nullable=False, server_default=""))
        if not _column_exists("applications", "email"):
            batch.add_column(sa.Column("email", sa.String(length=120), nullable=False, server_default=""))
        if not _column_exists("applications", "phone"):
            batch.add_column(sa.Column("phone", sa.String(length=40), nullable=False, server_default=""))
        if not _column_exists("applications", "resume_url"):
            batch.add_column(sa.Column("resume_url", sa.String(length=255), nullable=True))
        if not _column_exists("applications", "cover_letter"):
            batch.add_column(sa.Column("cover_letter", sa.Text(), nullable=True))

    if not _index_exists("applications", "uq_applications_user_job"):
        try:
            op.create_index(
                "uq_applications_user_job",
                "applications",
                ["user_id", "job_id"],
                unique=True
            )
        except OperationalError:
            pass

    if _table_exists("application_forms"):
        try:
            bind.execute(text(
                "INSERT INTO application_forms (job_id, created_at) "
                "SELECT id, CURRENT_TIMESTAMP FROM jobs "
                "WHERE id NOT IN (SELECT job_id FROM application_forms)"
            ))
        except OperationalError:
            pass


def downgrade():
    try:
        op.drop_index("uq_applications_user_job", table_name="applications")
    except OperationalError:
        pass

    with op.batch_alter_table("applications") as batch:
        for column in ["cover_letter", "resume_url", "phone", "email", "full_name"]:
            try:
                batch.drop_column(column)
            except OperationalError:
                pass

    op.drop_table('application_forms')
