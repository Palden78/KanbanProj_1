import os
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET")
if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET is not set in environment variables or .env file.")

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

DB_URL = os.getenv("DATABASE_URL")


def _positive_int_setting(name: str, default: int) -> int:
    raw_value = os.getenv(name)
    if raw_value is None or not raw_value.strip():
        return default

    try:
        value = int(raw_value)
    except ValueError as exc:
        raise RuntimeError(f"{name} must be a positive integer.") from exc

    if value <= 0:
        raise RuntimeError(f"{name} must be a positive integer.")

    return value


REDIS_URL = os.getenv("REDIS_URL", "redis://127.0.0.1:6379/0").strip()
CACHE_KEY_PREFIX = os.getenv("CACHE_KEY_PREFIX", "kanban:v1").strip()
CACHE_TASK_LIST_TTL_SECONDS = _positive_int_setting(
    "CACHE_TASK_LIST_TTL_SECONDS",
    30,
)

if not REDIS_URL:
    raise RuntimeError("REDIS_URL cannot be empty.")
if not CACHE_KEY_PREFIX:
    raise RuntimeError("CACHE_KEY_PREFIX cannot be empty.")
