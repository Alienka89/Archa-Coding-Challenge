from __future__ import annotations

from collections.abc import Callable
from typing import Any

from sqlalchemy.orm import Session


class UnitOfWork:
    """A tiny Unit of Work for a single SQLAlchemy session.

    - Commits on successful exit
    - Rolls back on exceptions
    """

    def __init__(self, session_factory: Callable[[], Session]):
        self._session_factory = session_factory
        self.session: Session | None = None

    def __enter__(self) -> "UnitOfWork":
        self.session = self._session_factory()
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        tb: Any,
    ) -> None:
        assert self.session is not None
        try:
            if exc_type is None:
                self.session.commit()
            else:
                self.session.rollback()
        finally:
            self.session.close()
