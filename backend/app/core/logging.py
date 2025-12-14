from __future__ import annotations

import logging


def configure_logging() -> None:
    """Minimal logging configuration.

    Keep it simple for the coding challenge; extend with structlog / json logs later.
    """

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )
