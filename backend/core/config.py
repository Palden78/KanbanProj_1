import os
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET")
if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET is not set in environment variables or .env file.")

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

DB_URL = os.getenv("DATABASE_URL")

REDIS_URL = os.getenv(
    "REDIS_URL"
)

CACHE_KEY_PREFIX = os.getenv(
    "CACHE_KEY_PREFIX"
)

CACHE_USER_TTL_SECONDS = os.getenv(
    "CACHE_USER_TTL_SECONDS"
)
CACHE_TASK_LIST_TTL_SECONDS = os.getenv(
    "CACHE_TASK_LIST_TTL_SECONDS"
)
CACHE_TASK_TTL_SECONDS = os.getenv(
    "CACHE_TASK_TTL_SECONDS"
)
