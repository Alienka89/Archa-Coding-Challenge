from __future__ import annotations

from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


class AppError(Exception):
    __slots__ = ("code", "message")

    def __init__(self, code: str, message: str) -> None:
        super().__init__(code, message)
        self.code = code
        self.message = message

    def as_detail(self) -> dict[str, str]:
        return {"code": self.code, "message": self.message}


class ValidationError(AppError):
    pass


class NotFoundError(AppError):
    pass


class ConflictError(AppError):
    pass


class DatabaseError(AppError):
    pass


def register_error_handlers(app: FastAPI) -> None:
    """Register JSON error handlers to keep a consistent error format."""

    def _response(status_code: int, *, code: str, message: str, **extra: Any) -> JSONResponse:
        detail: dict[str, Any] = {"code": code, "message": message}
        if extra:
            detail.update(extra)
        return JSONResponse(status_code=status_code, content={"detail": detail})

    # --- FastAPI / Pydantic validation (422) -> same envelope format ---
    @app.exception_handler(RequestValidationError)
    async def _request_validation_error_handler(_request: Request, exc: RequestValidationError) -> JSONResponse:
        # exc.errors() -> list of validation issues from Pydantic
        return _response(
            422,
            code="validation_error",
            message="Request validation failed.",
            errors=exc.errors(),
        )

    # --- HTTPException (e.g. raised manually in routers) -> same envelope format ---
    @app.exception_handler(HTTPException)
    async def _http_exception_handler(_request: Request, exc: HTTPException) -> JSONResponse:
        # If someone already raised our envelope, keep it.
        if isinstance(exc.detail, dict) and "code" in exc.detail and "message" in exc.detail:
            return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

        # Otherwise normalise into our envelope.
        return _response(exc.status_code, code="http_error", message=str(exc.detail))

    # --- Domain errors ---
    @app.exception_handler(ValidationError)
    async def _validation_error_handler(_request: Request, exc: ValidationError) -> JSONResponse:
        return JSONResponse(status_code=400, content={"detail": exc.as_detail()})

    @app.exception_handler(ConflictError)
    async def _conflict_error_handler(_request: Request, exc: ConflictError) -> JSONResponse:
        return JSONResponse(status_code=400, content={"detail": exc.as_detail()})

    @app.exception_handler(NotFoundError)
    async def _not_found_error_handler(_request: Request, exc: NotFoundError) -> JSONResponse:
        return JSONResponse(status_code=404, content={"detail": exc.as_detail()})

    @app.exception_handler(DatabaseError)
    async def _db_error_handler(_request: Request, exc: DatabaseError) -> JSONResponse:
        return JSONResponse(status_code=500, content={"detail": exc.as_detail()})
