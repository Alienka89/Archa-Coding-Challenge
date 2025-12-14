from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import ExpenseCategory


def list(db: Session) -> list[ExpenseCategory]:
    return db.execute(select(ExpenseCategory).order_by(ExpenseCategory.id)).scalars().all()


def get(db: Session, category_id: int) -> ExpenseCategory | None:
    return db.get(ExpenseCategory, category_id)


def create(db: Session, *, name: str, is_active: bool = True) -> ExpenseCategory:
    obj = ExpenseCategory(name=name, is_active=is_active)
    db.add(obj)
    return obj
