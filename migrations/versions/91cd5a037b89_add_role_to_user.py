"""add role to user

Revision ID: 91cd5a037b89
Revises: 
Create Date: 2026-02-18 09:19:15.426737

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text
from sqlalchemy.exc import OperationalError


# revision identifiers, used by Alembic.
revision = '91cd5a037b89'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()

    def _has_column(table, column):
        if bind.dialect.name == "sqlite":
            rows = bind.execute(text(f"PRAGMA table_info({table})")).fetchall()
            return any(r[1] == column for r in rows)
        rows = bind.execute(
            text("SELECT column_name FROM information_schema.columns WHERE table_name = :t")
            , {"t": table}
        ).fetchall()
        return any(r[0] == column for r in rows)

    if not _has_column("users", "role"):
        # Add role with a server default to avoid non-null errors on existing rows.
        try:
            with op.batch_alter_table('users', schema=None) as batch_op:
                batch_op.add_column(sa.Column('role', sa.String(length=20), nullable=False, server_default='user'))
        except OperationalError as exc:
            if "duplicate column name: role" not in str(exc):
                raise

    # Add user_id to employers. Keep nullable to avoid failures on existing rows.
    if not _has_column("employers", "user_id"):
        try:
            with op.batch_alter_table('employers', schema=None) as batch_op:
                batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=True))
                if bind.dialect.name != "sqlite":
                    batch_op.create_foreign_key('fk_employers_user_id_users', 'users', ['user_id'], ['id'])
        except OperationalError as exc:
            if "duplicate column name: user_id" not in str(exc):
                raise


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('role')

    with op.batch_alter_table('employers', schema=None) as batch_op:
        bind = op.get_bind()
        if bind.dialect.name != "sqlite":
            batch_op.drop_constraint('fk_employers_user_id_users', type_='foreignkey')
        batch_op.drop_column('user_id')
