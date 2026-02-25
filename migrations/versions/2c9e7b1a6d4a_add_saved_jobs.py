"""add saved jobs

Revision ID: 2c9e7b1a6d4a
Revises: 7c0b2a8a9c4b
Create Date: 2026-02-25 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2c9e7b1a6d4a'
down_revision = '7c0b2a8a9c4b'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'saved_jobs',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('job_id', sa.Integer(), sa.ForeignKey('jobs.id', ondelete='CASCADE'), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.UniqueConstraint('user_id', 'job_id', name='uq_saved_jobs_user_job')
    )


def downgrade():
    op.drop_table('saved_jobs')
