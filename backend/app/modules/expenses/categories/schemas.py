from __future__ import annotations

from typing_extensions import Annotated
from pydantic import BaseModel, ConfigDict
from pydantic.types import StringConstraints, StrictBool

CategoryName = Annotated[str, StringConstraints(min_length=1, max_length=120)]

class CategoryBase(BaseModel):
    name: CategoryName

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: CategoryName | None = None
    is_active: StrictBool | None = None

class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    is_active: bool
