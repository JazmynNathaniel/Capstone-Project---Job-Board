"""add phone to employer

Revision ID: 8f2c1f7b9a3a
Revises: 6d2f3d2f7b1a
Create Date: 2026-02-23 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8f2c1f7b9a3a'
down_revision = '6d2f3d2f7b1a'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('employers', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column('phone', sa.String(length=40), nullable=False, server_default='')
        )


def downgrade():
    with op.batch_alter_table('employers', schema=None) as batch_op:
        batch_op.drop_column('phone')
