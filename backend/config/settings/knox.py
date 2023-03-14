from datetime import timedelta


REST_KNOX = {
    'SECURE_HASH_ALGORITHM': 'cryptography.hazmat.primitives.hashes.SHA512',
    'AUTH_TOKEN_CHARACTER_LENGTH': 64,
    'TOKEN_TTL': timedelta(days=30),
    'TOKEN_LIMIT_PER_USER': None,
    'AUTO_REFRESH': True,
    'MIN_REFRESH_INTERVAL': 60 * 60 * 24,  # 1 day in seconds
}
