import pymysql
import time
from config import Config

def get_db_connection():
    for attempt in range(3):
        try:
            conn = pymysql.connect(
                host=Config.DB_HOST,
                user=Config.DB_USER,
                password=Config.DB_PASSWORD,
                database=Config.DB_NAME,
                charset='utf8mb4',
                autocommit=True
            )
            return conn
        except pymysql.OperationalError as e:
            if attempt < 2:
                print(f"Database connection failed, retrying... ({attempt + 1}/3)")
                time.sleep(2)
            else:
                raise e

def dict_cursor(conn):
    """Create a dictionary cursor manually"""
    return conn.cursor(pymysql.cursors.DictCursor)