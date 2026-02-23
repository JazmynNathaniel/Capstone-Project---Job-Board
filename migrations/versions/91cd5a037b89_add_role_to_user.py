"""add role to user

Revision ID: 91cd5a037b89
Revises: 
Create Date: 2026-02-18 09:19:15.426737

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '91cd5a037b89'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Add role with a server default to avoid non-null errors on existing rows.
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('role', sa.String(length=20), nullable=False, server_default='user'))

    # Add user_id to employers. Keep nullable to avoid failures on existing rows.
    with op.batch_alter_table('employers', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=True))
        bind = op.get_bind()
        if bind.dialect.name != "sqlite":
            batch_op.create_foreign_key('fk_employers_user_id_users', 'users', ['user_id'], ['id'])


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('role')

    with op.batch_alter_table('employers', schema=None) as batch_op:
        bind = op.get_bind()
        if bind.dialect.name != "sqlite":
            batch_op.drop_constraint('fk_employers_user_id_users', type_='foreignkey')
        batch_op.drop_column('user_id')
