from __future__ import annotations

from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.db.models import ExpenseCategory, ExpenseCode
from app.db.session import get_db
from app.modules.expenses.codes.schemas import CodeCreate, CodeOut

from . import service as categories_service
from .schemas import CategoryCreate, CategoryOut, CategoryUpdate

router = APIRouter(tags=["categories"])

MAX_CATEGORY_NAME_LEN = 120
MAX_CODE_LEN = 64


@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)) -> list[ExpenseCategory]:
    return categories_service.list_categories(db)


@router.post("/categories", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db)) -> ExpenseCategory:
    if len(payload.name) > MAX_CATEGORY_NAME_LEN:
        raise HTTPException(status_code=422, detail="name too long")
    return categories_service.create_category(db, payload)


@router.put("/categories/{id}", response_model=CategoryOut)
def update_category(id: int, payload: CategoryUpdate, db: Session = Depends(get_db)) -> ExpenseCategory:
    if payload.name is not None and len(payload.name) > MAX_CATEGORY_NAME_LEN:
        raise HTTPException(
            status_code=422,
            detail=[{
                "loc": ["body", "name"],
                "msg": f"String should have at most {MAX_CATEGORY_NAME_LEN} characters",
                "type": "string_too_long",
            }],
        )
    return categories_service.update_category(db, id, payload)


@router.get("/categories/{id}/codes", response_model=list[CodeOut])
def list_codes_for_category(id: int, db: Session = Depends(get_db)) -> list[ExpenseCode]:
    return categories_service.list_codes_for_category(db, id)


@router.post("/categories/{id}/codes", response_model=CodeOut, status_code=status.HTTP_201_CREATED)
def create_code_for_category(id: int, payload: CodeCreate, db: Session = Depends(get_db)) -> ExpenseCode:
    if len(payload.code) > MAX_CODE_LEN:
        raise HTTPException(
            status_code=422,
            detail=[{
                "loc": ["body", "code"],
                "msg": f"String should have at most {MAX_CODE_LEN} characters",
                "type": "string_too_long",
            }],
        )
    return categories_service.create_code_for_category(db, id, payload)
