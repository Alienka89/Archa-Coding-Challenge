# backend/app/schemas/code.py
from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field, StrictBool

class CodeBase(BaseModel):
    code: str = Field(..., min_length=1, max_length=64)
    description: str | None = None


class CodeCreate(CodeBase):
    pass


class CodeUpdate(BaseModel):
    description: str | None = None
    is_active: StrictBool | None = None


class CodeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category_id: int
    code: str
    description: str | None
    is_active: bool
