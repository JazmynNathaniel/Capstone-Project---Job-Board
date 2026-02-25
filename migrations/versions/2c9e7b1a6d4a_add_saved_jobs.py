"""add saved jobs

Revision ID: 2c9e7b1a6d4a
Revises: 7c0b2a8a9c4b
Create Date: 2026-02-25 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text
from sqlalchemy.exc import OperationalError


# revision identifiers, used by Alembic.
revision = '2c9e7b1a6d4a'
down_revision = '7c0b2a8a9c4b'
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()

    def _table_exists(name):
        if bind.dialect.name == "sqlite":
            rows = bind.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name=:n"), {"n": name}).fetchall()
            return len(rows) > 0
        rows = bind.execute(
            text("SELECT table_name FROM information_schema.tables WHERE table_name = :n"),
            {"n": name}
        ).fetchall()
        return len(rows) > 0

    if _table_exists("saved_jobs"):
        return

    try:
        op.create_table(
            'saved_jobs',
            sa.Column('id', sa.Integer(), primary_key=True),
            sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
            sa.Column('job_id', sa.Integer(), sa.ForeignKey('jobs.id', ondelete='CASCADE'), nullable=False),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.UniqueConstraint('user_id', 'job_id', name='uq_saved_jobs_user_job')
        )
    except OperationalError as exc:
        if "already exists" not in str(exc):
            raise


def downgrade():
    op.drop_table('saved_jobs')
