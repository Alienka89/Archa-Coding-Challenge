from __future__ import annotations

from collections.abc import Iterator
from contextlib import contextmanager

from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

from .uow import UnitOfWork

DATABASE_URL = settings.database_url

is_sqlite = DATABASE_URL.startswith("sqlite")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if is_sqlite else {},
)

# Enable FK constraints for SQLite (required for ON DELETE CASCADE).
if is_sqlite:

    @event.listens_for(engine, "connect")
    def _set_sqlite_pragma(dbapi_connection, _connection_record) -> None:  # type: ignore[no-redef]
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)


def get_db() -> Iterator[Session]:
    """FastAPI dependency: one transaction per request."""

    with UnitOfWork(SessionLocal) as uow:
        assert uow.session is not None
        yield uow.session


@contextmanager
def db_session() -> Iterator[Session]:
    """Helper for scripts / seeding."""

    with UnitOfWork(SessionLocal) as uow:
        assert uow.session is not None
        yield uow.session
