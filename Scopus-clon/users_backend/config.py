import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask Configuration
    FLASK_ENV = os.environ.get('FLASK_ENV', 'production')
    DEBUG = os.environ.get('FLASK_DEBUG', '1') == '1'
    
    # Security
    SECRET_KEY = os.environ.get('SECRET_KEY', 'fallback-secret-key')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'fallback-jwt-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # Database Configuration
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_USER = os.environ.get('DB_USER', 'scopus_user')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', 'scopus_password_2024')
    DB_NAME = os.environ.get('DB_NAME', 'scopus_db')
    
    # AES Encryption key (32 bytes for AES-256)
    AES_KEY = os.environ.get('AES_KEY', 'fallback-32-byte-aes-key-here!!')
    
    # CORS Configuration
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:4200').split(',')