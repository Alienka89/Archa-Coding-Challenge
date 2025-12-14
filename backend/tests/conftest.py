from __future__ import annotations

from collections.abc import Iterator

import sys
from pathlib import Path

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    # Ensure `import app...` works when tests are executed via plain `pytest`
    # without an explicit PYTHONPATH.
    sys.path.insert(0, str(ROOT_DIR))

from app.core.errors import register_error_handlers
from app.db.models import Base
from app.db.session import get_db
from app.modules.expenses.categories.router import router as categories_router
from app.modules.expenses.codes.router import router as codes_router


@pytest.fixture()
def client() -> Iterator[TestClient]:
    """FastAPI TestClient wired to an in-memory SQLite DB.

    Tests expect transactional isolation and deterministic data, so each test gets
    its own database.
    """

    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(
        bind=engine,
        autoflush=False,
        autocommit=False,
        expire_on_commit=False,
    )

    Base.metadata.create_all(bind=engine)

    def override_get_db() -> Iterator[Session]:
        db = TestingSessionLocal()
        try:
            yield db
            db.commit()
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    app = FastAPI()
    register_error_handlers(app)
    app.dependency_overrides[get_db] = override_get_db

    app.include_router(categories_router)
    app.include_router(codes_router)

    with TestClient(app) as c:
        yield c
