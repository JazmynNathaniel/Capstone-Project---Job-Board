"""add profile experience fields

Revision ID: 3b7f5a9a1d2c
Revises: 8f2c1f7b9a3a
Create Date: 2026-02-23 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3b7f5a9a1d2c'
down_revision = '8f2c1f7b9a3a'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('profiles', schema=None) as batch_op:
        batch_op.add_column(sa.Column('job_experience', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('current_position', sa.String(length=120), nullable=True))
        batch_op.add_column(sa.Column('current_position_start', sa.String(length=20), nullable=True))
        batch_op.add_column(sa.Column('last_position', sa.String(length=120), nullable=True))
        batch_op.add_column(sa.Column('last_position_start', sa.String(length=20), nullable=True))
        batch_op.add_column(sa.Column('last_position_end', sa.String(length=20), nullable=True))
        batch_op.add_column(sa.Column('skills', sa.Text(), nullable=True))


def downgrade():
    with op.batch_alter_table('profiles', schema=None) as batch_op:
        batch_op.drop_column('skills')
        batch_op.drop_column('last_position_end')
        batch_op.drop_column('last_position_start')
        batch_op.drop_column('last_position')
        batch_op.drop_column('current_position_start')
        batch_op.drop_column('current_position')
        batch_op.drop_column('job_experience')
