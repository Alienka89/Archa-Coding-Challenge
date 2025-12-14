from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from .schemas import CodeOut, CodeUpdate
from . import service as codes_service

router = APIRouter(tags=["codes"])

@router.put("/codes/{id}", response_model=CodeOut)
def update_code(id: int, payload: CodeUpdate, db: Session = Depends(get_db)) -> CodeOut:
    obj = codes_service.update_code(db, id, payload)
    return CodeOut.model_validate(obj)
