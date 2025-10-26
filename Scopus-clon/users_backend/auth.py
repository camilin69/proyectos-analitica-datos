import bcrypt
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import os
from config import Config

class AuthUtils:
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using bcrypt"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')

    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

class AESEncryption:
    def __init__(self):
        # Derive a proper Fernet key from the AES key
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=b'fixed_salt_for_derivation',  # In production, use a random salt
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(Config.AES_KEY.encode()))
        self.fernet = Fernet(key)

    def encrypt(self, data: str) -> str:
        """Encrypt data using AES"""
        return self.fernet.encrypt(data.encode()).decode()

    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt data using AES"""
        return self.fernet.decrypt(encrypted_data.encode()).decode()

# Global instances
auth_utils = AuthUtils()
aes_encryption = AESEncryption()