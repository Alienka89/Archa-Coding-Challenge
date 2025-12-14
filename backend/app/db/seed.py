from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import ExpenseCategory, ExpenseCode

from .session import db_session


def seed_if_empty() -> None:
    """Populate DB with initial values, only if it is empty."""

    with db_session() as db:
        _seed_if_empty(db)


def _seed_if_empty(db: Session) -> None:
    has_any = db.execute(select(ExpenseCategory.id).limit(1)).first() is not None
    if has_any:
        return

    travel = ExpenseCategory(name="Travel", is_active=True)
    meals = ExpenseCategory(name="Meals", is_active=True)
    office = ExpenseCategory(name="Office", is_active=False)

    db.add_all([travel, meals, office])
    db.flush()  # obtain category ids

    db.add_all(
        [
            ExpenseCode(category_id=travel.id, code="FLIGHT", description="Air travel", is_active=True),
            ExpenseCode(category_id=travel.id, code="HOTEL", description="Accommodation", is_active=True),
            ExpenseCode(category_id=meals.id, code="LUNCH", description="Lunch with client", is_active=True),
            ExpenseCode(category_id=office.id, code="SUPPLIES", description="Office supplies", is_active=False),
        ]
    )
