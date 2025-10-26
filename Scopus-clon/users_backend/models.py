from database import get_db_connection, dict_cursor

class User:
    def __init__(self, id, first_name, last_name, email, password, institution_id, created_at=None):
        self.id = id
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password
        self.institution_id = institution_id
        self.created_at = created_at

    @staticmethod
    def create_user(first_name, last_name, email, password, institution_id=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                'INSERT INTO users (first_name, last_name, email, password, institution_id) VALUES (%s, %s, %s, %s, %s)',
                (first_name, last_name, email, password, institution_id)
            )
            
            user_id = cursor.lastrowid
            conn.commit()
            return user_id
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def find_by_email(email):
        conn = get_db_connection()
        cursor = dict_cursor(conn)
        
        try:
            cursor.execute('''
                SELECT u.*, i.name as institution_name, i.city as institution_city, i.country as institution_country 
                FROM users u 
                LEFT JOIN institutions i ON u.institution_id = i.id 
                WHERE u.email = %s
            ''', (email,))
            
            user = cursor.fetchone()
            return user
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def find_by_id(user_id):
        conn = get_db_connection()
        cursor = dict_cursor(conn)
        
        try:
            cursor.execute('''
                SELECT u.*, i.name as institution_name, i.city as institution_city, i.country as institution_country  
                FROM users u 
                LEFT JOIN institutions i ON u.institution_id = i.id 
                WHERE u.id = %s
            ''', (user_id,))
            
            user = cursor.fetchone()
            return user
        finally:
            cursor.close()
            conn.close()