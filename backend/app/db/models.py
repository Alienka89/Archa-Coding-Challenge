# backend/app/models.py
from __future__ import annotations

from sqlalchemy import Boolean, ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class ExpenseCategory(Base):
    __tablename__ = "expense_categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    # one-to-many
    codes: Mapped[list["ExpenseCode"]] = relationship(
        back_populates="category",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    __table_args__ = (
        UniqueConstraint("name", name="uq_expense_categories_name"),
        Index("ix_expense_categories_is_active", "is_active"),
    )


class ExpenseCode(Base):
    __tablename__ = "expense_codes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    category_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("expense_categories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    code: Mapped[str] = mapped_column(String(64), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    category: Mapped["ExpenseCategory"] = relationship(back_populates="codes")

    __table_args__ = (
        UniqueConstraint("category_id", "code", name="uq_expense_codes_category_id_code"),
        Index("ix_expense_codes_category_id_is_active", "category_id", "is_active"),
        Index("ix_expense_codes_code", "code"),
    )
