"""
Alembic Migration Environment
=============================
This file configures how Alembic runs database migrations.

Team: Everyone should understand this file as it controls your database schema changes.
"""

from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
import os
import sys

# Add the parent directory to path so we can import our app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# TODO: Import your Base model and all models here
# WHY: Alembic needs to know about all your models to detect schema changes
# APPROACH: Import the Base class from your database module and all model files

# This is the Alembic Config object
config = context.config

# Set up logging from the config file
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# TODO: Set target_metadata to your Base.metadata
# WHY: This tells Alembic what your desired database schema looks like
# APPROACH: After importing Base, assign Base.metadata to target_metadata
target_metadata = None

# TODO: Override sqlalchemy.url with your DATABASE_URL from environment
# WHY: Keeps database credentials out of alembic.ini and in your .env file
# APPROACH: Read DATABASE_URL from environment and set it in the config
# SECURITY: Never hardcode database credentials


def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.
    
    This generates SQL scripts without connecting to the database.
    Useful for reviewing migrations before applying them.
    """
    # TODO: Get the database URL from configuration
    # WHY: Need to know which database dialect to generate SQL for
    # APPROACH: Use config.get_main_option to retrieve the URL
    
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.
    
    This connects to the database and applies migrations directly.
    Used during development and deployment.
    """
    # TODO: Create a database engine from the configuration
    # WHY: Need an active database connection to apply migrations
    # APPROACH: Use engine_from_config with your settings
    
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

