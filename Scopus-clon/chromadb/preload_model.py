import os
import logging
import chromadb
from chromadb.config import Settings

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def preload_model():
    """Pre-descarga el modelo de embeddings durante el build"""
    logger.info("📥 Pre-descargando modelo all-MiniLM-L6-v2...")
    
    try:
        # Forzar el directorio de cache
        os.makedirs('/shared_model_cache/onnx_models', exist_ok=True)
        
        # Configuración sin autenticación
        settings = Settings(
            chroma_client_auth_provider=None,  # Deshabilitar autenticación
            anonymized_telemetry=False
        )
        
        # Cliente efímero para pre-cargar modelo
        client = chromadb.EphemeralClient(settings=settings)
        collection = client.create_collection('temp_preload')
        
        # Agregar un documento para activar el embedding
        collection.add(
            documents=['test document to trigger model download during build'],
            metadatas=[{'type': 'test'}],
            ids=['test1']
        )
        
        # Hacer una consulta para asegurar que el modelo se carga
        results = collection.query(query_texts=['test query'], n_results=1)
        logger.info('✅ Modelo all-MiniLM-L6-v2 pre-descargado exitosamente')
        
        # Verificar dónde se descargó el modelo
        shared_cache_path = '/shared_model_cache/onnx_models/all-MiniLM-L6-v2'
        if os.path.exists(shared_cache_path):
            logger.info(f'✅ Modelo guardado en cache compartido: {shared_cache_path}')
            # Listar archivos descargados
            for root, dirs, files in os.walk(shared_cache_path):
                for file in files:
                    logger.info(f'   📄 {os.path.join(root, file)}')
        else:
            logger.warning('⚠️ Modelo no encontrado en cache compartido')
            
        # Verificar symlink
        if os.path.islink('/root/.cache/chroma'):
            link_target = os.readlink('/root/.cache/chroma')
            logger.info(f'✅ Symlink activo: /root/.cache/chroma -> {link_target}')
        
        return True
        
    except Exception as e:
        logger.error(f'❌ Error pre-descargando modelo: {e}')
        return False

if __name__ == '__main__':
    success = preload_model()
    exit(0 if success else 1)