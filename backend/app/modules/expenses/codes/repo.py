from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import ExpenseCode


def get(db: Session, code_id: int) -> ExpenseCode | None:
    return db.get(ExpenseCode, code_id)


def list_by_category(db: Session, category_id: int) -> list[ExpenseCode]:
    stmt = select(ExpenseCode).where(ExpenseCode.category_id == category_id).order_by(ExpenseCode.id)
    return db.execute(stmt).scalars().all()


def create(
    db: Session,
    *,
    category_id: int,
    code: str,
    description: str | None,
    is_active: bool = True,
) -> ExpenseCode:
    obj = ExpenseCode(
        category_id=category_id,
        code=code,
        description=description,
        is_active=is_active,
    )
    db.add(obj)
    return obj
