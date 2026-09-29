import logging
from typing import Any

from redis import Redis
from redis.exceptions import RedisError

logger = logging.getLogger(__name__)

def get_cached_value(cache: Redis, key: str) -> str | None:
    try:
        return cache.get(key)
    except RedisError:
        logger.warning("Redis read failed for key %s", key, exc_info=True)
        return None

def delete_cached_values(cache: Redis, *keys: str) -> None:
    try:
        if keys:
            cache.delete(*keys)
    except RedisError:
        logger.warning("Redis invalidation failed", exc_info=True)

def user_profile_key(prefix: str, user_id: Any) -> str:
    return f"{prefix}:{{{user_id}}}:profile"


def task_list_key(prefix: str, user_id: Any) -> str:
    return f"{prefix}:{{{user_id}}}:tasks"


def task_key(prefix: str, user_id: Any, task_id: Any) -> str:
    return f"{prefix}:{{{user_id}}}:task:{task_id}"
