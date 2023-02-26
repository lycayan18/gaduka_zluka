import binascii
import hashlib


def generate_token(login: str, password: str) -> str:
    """Хеширование пароля"""
    h = hashlib.pbkdf2_hmac(hash_name='sha512',
                            password=f'{login}{password}'.encode('utf-8'),
                            salt=b'beautiful_salt',
                            iterations=100000)

    result = binascii.hexlify(h).decode('utf-8')
    return result
