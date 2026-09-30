import logging
from typing import Any
from uuid import uuid4

from redis import Redis
from redis.exceptions import RedisError

logger = logging.getLogger(__name__)


def get_cached_value(cache: Redis, key: str) -> str | None:
    try:
        return cache.get(key)
    except (RedisError, UnicodeDecodeError):
        logger.warning("Redis read failed for key %s", key, exc_info=True)
        return None


def set_cached_value(
    cache: Redis,
    key: str,
    value: str,
    ttl_seconds: int,
) -> None:
    try:
        cache.set(key, value, ex=ttl_seconds)
    except RedisError:
        logger.warning("Redis write failed for key %s", key, exc_info=True)


def delete_cached_values(cache: Redis, *keys: str) -> None:
    try:
        if keys:
            cache.delete(*keys)
    except RedisError:
        logger.warning("Redis invalidation failed", exc_info=True)


def task_list_generation_key(prefix: str, user_id: Any) -> str:
    return f"{prefix}:{{{user_id}}}:tasks:generation"


def task_list_key(prefix: str, user_id: Any, generation: str) -> str:
    return f"{prefix}:{{{user_id}}}:tasks:{generation}"


def get_or_create_task_list_generation(
    cache: Redis,
    prefix: str,
    user_id: Any,
) -> str | None:
    key = task_list_generation_key(prefix, user_id)

    try:
        generation = cache.get(key)
        if generation is not None:
            return generation

        candidate = uuid4().hex
        if cache.set(key, candidate, nx=True):
            return candidate

        return cache.get(key)
    except (RedisError, UnicodeDecodeError):
        logger.warning(
            "Redis task-list generation read failed for user %s",
            user_id,
            exc_info=True,
        )
        return None


def rotate_task_list_generation(
    cache: Redis,
    prefix: str,
    user_id: Any,
) -> None:
    key = task_list_generation_key(prefix, user_id)

    try:
        cache.set(key, uuid4().hex)
    except RedisError:
        logger.warning(
            "Redis task-list invalidation failed for user %s",
            user_id,
            exc_info=True,
        )
