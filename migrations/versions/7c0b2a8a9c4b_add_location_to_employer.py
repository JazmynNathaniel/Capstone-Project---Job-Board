"""add location to employer

Revision ID: 7c0b2a8a9c4b
Revises: 3b7f5a9a1d2c
Create Date: 2026-02-25 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7c0b2a8a9c4b'
down_revision = '3b7f5a9a1d2c'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('employers', schema=None) as batch_op:
        batch_op.add_column(sa.Column('location', sa.String(length=120), nullable=True))


def downgrade():
    with op.batch_alter_table('employers', schema=None) as batch_op:
        batch_op.drop_column('location')
