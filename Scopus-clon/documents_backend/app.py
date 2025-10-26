# documents_backend/app.py
from flask import Flask
from flask_cors import CORS
from documents import documents_bp
from config import config
import os

def create_app():
    app = Flask(__name__)
    
    # Configuración
    app.config.from_object(config['default'])
    
    # Inicializar extensiones
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Registrar blueprints
    app.register_blueprint(documents_bp, url_prefix='/api')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5001, debug=app.config['DEBUG'])