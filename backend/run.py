import asyncio

import uvicorn

from app.core.config import settings
from app.core.database import upgrade_database_with_retry

if __name__ == "__main__":
    asyncio.run(upgrade_database_with_retry(max_retries=5, initial_delay=1))
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
        ws_max_size=settings.WEBSOCKET_MAX_MESSAGE_SIZE,
    )
