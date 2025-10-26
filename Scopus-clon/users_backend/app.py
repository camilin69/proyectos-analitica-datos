from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import json
import time
import pymysql
import logging
from config import Config
from models import User
from auth import auth_utils, aes_encryption

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config.from_object(Config)

# Configurar Flask para desarrollo
app.config['DEBUG'] = True
app.config['ENV'] = 'development'

# Deshabilitar el recargador de Flask en Docker
app.config['USE_RELOADER'] = False

# Initialize extensions
CORS(app, origins=Config.CORS_ORIGINS)
jwt = JWTManager(app)

def wait_for_db(max_retries=30, delay=2):
    """Wait for database to be ready"""
    logger.info("🔍 Starting database connection check...")
    for i in range(max_retries):
        try:
            conn = pymysql.connect(
                host=Config.DB_HOST,
                user=Config.DB_USER,
                password=Config.DB_PASSWORD,
                database=Config.DB_NAME,
                charset='utf8mb4'
            )
            conn.close()
            logger.info("✅ Database connection successful!")
            return True
        except Exception as e:
            logger.warning(f"⏳ Waiting for database... (Attempt {i+1}/{max_retries}) - {str(e)}")
            time.sleep(delay)
    logger.error("❌ Failed to connect to database after multiple attempts")
    return False

# Verificar conexión a la base de datos al iniciar
logger.info("🚀 Flask application starting up...")
if not wait_for_db():
    logger.error("❌ Failed to connect to database. Exiting...")
    exit(1)

@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Test database connection
        conn = pymysql.connect(
            host=Config.DB_HOST,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME,
            charset='utf8mb4'
        )
        conn.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    logger.info("✅ Health check - Service is healthy")
    return jsonify({
        'status': 'healthy', 
        'service': 'scopus-auth-api',
        'database': db_status,
        'environment': 'development'
    })

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        logger.info(f"📝 Registration attempt for: {data.get('email')}")
        
        # Validate required fields
        required_fields = ['firstName', 'lastName', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                logger.warning(f"❌ Missing required field: {field}")
                return jsonify({'error': f'Field {field} is required'}), 400
        
        # Check if user already exists
        existing_user = User.find_by_email(data['email'])
        if existing_user:
            logger.warning(f"❌ User already exists: {data['email']}")
            return jsonify({'error': 'User already exists with this email'}), 409
        
        # Hash password
        hashed_password = auth_utils.hash_password(data['password'])
        
        # Create user
        user_id = User.create_user(
            first_name=data['firstName'],
            last_name=data['lastName'],
            email=data['email'],
            password=hashed_password,
            institution_id=data.get('institutionId')
        )
        
        # Get the created user
        user_data = User.find_by_id(user_id)
        
        if not user_data:
            logger.error(f"❌ Failed to retrieve created user: {user_id}")
            return jsonify({'error': 'Failed to create user'}), 500
        
        # Create JWT token
        access_token = create_access_token(identity=user_id)
        
        # Prepare response
        response_data = {
            'id': user_data['id'],
            'firstName': user_data['first_name'],
            'lastName': user_data['last_name'],
            'email': user_data['email'],
            'institution': {
                'id': user_data['institution_id'],
                'name': user_data.get('institution_name'),
                'city': user_data.get('institution_city'),
                'country': user_data.get('institution_country')
            } if user_data['institution_id'] else None,
            'accessToken': access_token
        }
        
        logger.info(f"✅ User registered successfully: {data['email']}")
        return jsonify(response_data), 201
        
    except Exception as e:
        logger.error(f"❌ Registration error: {str(e)}", exc_info=True)
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        logger.info(f"🔐 Login attempt for: {data.get('email')}")
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            logger.warning("❌ Missing email or password")
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user
        user_data = User.find_by_email(data['email'])
        if not user_data:
            logger.warning(f"❌ User not found: {data['email']}")
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Verify password
        if not auth_utils.verify_password(data['password'], user_data['password']):
            logger.warning(f"❌ Invalid password for: {data['email']}")
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create JWT token
        access_token = create_access_token(identity=user_data['id'])
        
        # Prepare response
        response_data = {
            'id': user_data['id'],
            'firstName': user_data['first_name'],
            'lastName': user_data['last_name'],
            'email': user_data['email'],
            'institution': {
                'id': user_data['institution_id'],
                'name': user_data.get('institution_name'),
                'city': user_data.get('institution_city'),
                'country': user_data.get('institution_country')
            } if user_data['institution_id'] else None,
            'accessToken': access_token
        }
        
        logger.info(f"✅ User logged in successfully: {data['email']}")
        return jsonify(response_data), 200
        
    except Exception as e:
        logger.error(f"❌ Login error: {str(e)}", exc_info=True)
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

if __name__ == '__main__':
    logger.info("🚀 Starting Flask development server...")
    # Usar 0.0.0.0 para que sea accesible desde fuera del contenedor
    # y deshabilitar el reloader en Docker
    app.run(
        host='0.0.0.0', 
        port=5000, 
        debug=True, 
        use_reloader=False
    )