from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.errors import register_error_handlers
from app.core.logging import configure_logging
from app.db.models import Base
from app.db.seed import seed_if_empty
from app.db.session import engine
from app.modules.expenses.categories.router import router as categories_router
from app.modules.expenses.codes.router import router as codes_router


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # For the coding challenge, creating tables on startup is acceptable.
    Base.metadata.create_all(bind=engine)
    seed_if_empty()
    yield


def create_app() -> FastAPI:
    configure_logging()

    application = FastAPI(
        title="Archa Coding Challenge API",
        version="0.1.0",
        lifespan=lifespan,
    )

    # CORS (dev-friendly defaults)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_error_handlers(application)

    application.include_router(categories_router)
    application.include_router(codes_router)

    @application.get("/health")
    def health():
        return {"status": "ok"}

    return application


app = create_app()
