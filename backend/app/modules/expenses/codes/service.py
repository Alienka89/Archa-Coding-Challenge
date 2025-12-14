from __future__ import annotations

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.errors import DatabaseError, NotFoundError
from app.db.models import ExpenseCode

from . import repo as codes_repo
from .schemas import CodeUpdate


def update_code(db: Session, code_id: int, payload: CodeUpdate) -> ExpenseCode:
    obj = codes_repo.get(db, code_id)
    if obj is None:
        raise NotFoundError("not_found", "Expense code not found.")

    if payload.description is not None:
        obj.description = payload.description
    if payload.is_active is not None:
        obj.is_active = payload.is_active

    try:
        db.flush()
    except SQLAlchemyError:
        raise DatabaseError("db_error", "Database error.")

    return obj
