from redis import Redis

from core.config import REDIS_URL

def create_cache() -> Redis:
    return Redis.from_url(
        REDIS_URL,
        decode_responses=True,
        socket_connect_timeout=0.5,
        socket_timeout=0.5,
        health_check_interval=30,
    )