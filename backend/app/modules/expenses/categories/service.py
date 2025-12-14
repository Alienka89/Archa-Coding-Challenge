from __future__ import annotations

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.errors import ConflictError, NotFoundError, ValidationError
from app.db.models import ExpenseCategory, ExpenseCode

from . import repo as categories_repo
from ..codes import repo as codes_repo
from .schemas import CategoryCreate, CategoryUpdate
from ..codes.schemas import CodeCreate


def list_categories(db: Session) -> list[ExpenseCategory]:
    return categories_repo.list(db)


def create_category(db: Session, payload: CategoryCreate) -> ExpenseCategory:
    name = payload.name.strip()
    if not name:
        raise ValidationError("empty_name", "Category name must not be empty.")

    obj = categories_repo.create(db, name=name, is_active=True)

    try:
        db.flush()
    except IntegrityError:
        raise ConflictError("duplicate_name", "Category name must be unique.")

    return obj


def update_category(db: Session, category_id: int, payload: CategoryUpdate) -> ExpenseCategory:
    obj = categories_repo.get(db, category_id)
    if obj is None:
        raise NotFoundError("not_found", "Category not found.")

    if payload.name is not None:
        name = payload.name.strip()
        if not name:
            raise ValidationError("empty_name", "Category name must not be empty.")
        obj.name = name

    if payload.is_active is not None:
        obj.is_active = payload.is_active

    try:
        db.flush()
    except IntegrityError:
        raise ConflictError("duplicate_name", "Category name must be unique.")

    return obj


def list_codes_for_category(db: Session, category_id: int) -> list[ExpenseCode]:
    if categories_repo.get(db, category_id) is None:
        raise NotFoundError("not_found", "Category not found.")

    return codes_repo.list_by_category(db, category_id)


def create_code_for_category(db: Session, category_id: int, payload: CodeCreate) -> ExpenseCode:
    if categories_repo.get(db, category_id) is None:
        raise NotFoundError("not_found", "Category not found.")

    code_value = payload.code.strip()
    if not code_value:
        raise ValidationError("empty_code", "Expense code must not be empty.")

    obj = codes_repo.create(
        db,
        category_id=category_id,
        code=code_value,
        description=payload.description,
        is_active=True,
    )

    try:
        db.flush()
    except IntegrityError:
        raise ConflictError(
            "duplicate_code",
            "Expense code must be unique within category.",
        )

    return obj
