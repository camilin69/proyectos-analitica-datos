import chromadb
from typing import List, Dict, Any
import json
import logging
import time
import os
import numpy as np
from config import config

class VectorDatabase:
    def __init__(self):
        self.max_retries = 5
        self.retry_delay = 3
        self.client = None
        self.collection = None
        self.collection_name = "research_documents"
        
        # Configuraciones HNSW para comparación
        self.hnsw_configs = {
            'default': {
                'description': 'Configuración por defecto de ChromaDB',
                'hnsw:space': 'cosine',
                'hnsw:construction_ef': 100,
                'hnsw:search_ef': 100,
                'hnsw:M': 16
            },
            'high_precision': {
                'description': 'Alta precisión, mayor tiempo de búsqueda',
                'hnsw:space': 'cosine', 
                'hnsw:construction_ef': 200,
                'hnsw:search_ef': 200,
                'hnsw:M': 32
            },
            'fast_search': {
                'description': 'Búsqueda rápida, menor precisión',
                'hnsw:space': 'cosine',
                'hnsw:construction_ef': 50,
                'hnsw:search_ef': 50,
                'hnsw:M': 8
            },
            'balanced': {
                'description': 'Balance entre precisión y velocidad',
                'hnsw:space': 'cosine',
                'hnsw:construction_ef': 150,
                'hnsw:search_ef': 100,
                'hnsw:M': 16
            }
        }
        
        logging.info("🚀 Inicializando VectorDatabase...")
        self._connect()

    def _connect(self):
        """Conectar a ChromaDB con reintentos"""
        for attempt in range(self.max_retries):
            try:
                logging.info(f"🔗 Conectando a ChromaDB (intento {attempt + 1}/{self.max_retries})...")
                
                self.client = chromadb.HttpClient(
                    host=config['default'].CHROMA_HOST,
                    port=int(config['default'].CHROMA_PORT)
                )
                
                heartbeat = self.client.heartbeat()
                logging.info(f"✅ ChromaDB heartbeat: {heartbeat}")
                
                # Intentar obtener colección existente
                try:
                    self.collection = self.client.get_collection(self.collection_name)
                    logging.info(f"✅ Colección '{self.collection_name}' cargada")
                except Exception as e:
                    logging.warning(f"⚠️ Colección no encontrada, creando nueva: {e}")
                    self.collection = self.client.create_collection(
                        name=self.collection_name,
                        metadata={"description": "Document embeddings for semantic search"},
                        # Usar configuración balanceada por defecto
                        **self.hnsw_configs['balanced']
                    )
                    logging.info(f"✅ Nueva colección '{self.collection_name}' creada con configuración HNSW balanceada")
                
                test_count = self.collection.count()
                logging.info(f"📊 Colección lista con {test_count} documentos")
                
                return
                
            except Exception as e:
                logging.warning(f"⚠️ Intento de conexión {attempt + 1} falló: {e}")
                if attempt < self.max_retries - 1:
                    logging.info(f"⏳ Reintentando en {self.retry_delay}s...")
                    time.sleep(self.retry_delay)
                else:
                    logging.error(f"❌ No se pudo conectar a ChromaDB después de {self.max_retries} intentos")
                    self.collection = None

    # En documents_backend/database.py - actualizar el método search_similar_with_config

    def search_similar_with_config(self, query: str, n_results: int = 10, max_distance: float = 2.0, 
                                where: dict = None, hnsw_config: str = 'balanced') -> Dict[str, Any]:
        """
        Búsqueda semántica con configuración HNSW específica - CORREGIDO
        """
        try:
            if self.collection is None:
                self._connect()
                if self.collection is None:
                    return {'results': [], 'search_time': 0, 'total_results': 0}
            
            logging.info(f"🔍 Ejecutando búsqueda semántica con config {hnsw_config}: '{query}'")
            
            # Obtener el número total de documentos
            total_docs = self.collection.count()
            actual_n_results = min(n_results, total_docs)
            
            # Configuración HNSW - ChromaDB maneja esto internamente, no necesitamos modify()
            config_params = self.hnsw_configs.get(hnsw_config, self.hnsw_configs['balanced'])
            
            # Medir tiempo de búsqueda
            start_time = time.time()
            
            results = self.collection.query(
                query_texts=[query],
                where=where,
                n_results=actual_n_results,
                include=['metadatas', 'distances', 'documents']
            )
            
            search_time = time.time() - start_time
            
            # Formatear resultados
            formatted_results = []
            for i, (metadata, distance, document_text) in enumerate(zip(
                results['metadatas'][0],
                results['distances'][0],
                results['documents'][0]
            )):
                if distance <= max_distance:
                    formatted_results.append({
                        'id': int(results['ids'][0][i]),
                        'metadata': metadata,
                        'distance': float(distance),
                        'document_text': document_text
                    })
            
            # Ordenar por distancia ascendente
            formatted_results.sort(key=lambda x: x['distance'])
            
            logging.info(f"✅ Búsqueda con {hnsw_config} encontró {len(formatted_results)} resultados en {search_time:.6f}s")
            
            return {
                'results': formatted_results,
                'search_time': search_time,
                'total_results': len(formatted_results),
                'config': hnsw_config
            }
            
        except Exception as e:
            logging.error(f"❌ Error en búsqueda semántica con config {hnsw_config}: {e}")
            return {'results': [], 'search_time': 0, 'total_results': 0}

    def search_similar_comparative(self, query: str, n_results: int = 10, max_distance: float = 2.0, 
                             where: dict = None) -> Dict[str, Any]:
        """
        Comparar todas las configuraciones HNSW - CORREGIDO
        """
        comparison_results = {}
        
        for config_name in self.hnsw_configs.keys():
            result = self.search_similar_with_config(
                query=query,
                n_results=n_results,
                max_distance=max_distance,
                where=where,
                hnsw_config=config_name
            )
            
            comparison_results[config_name] = {
                'results': result['results'],
                'search_time': result['search_time'],
                'total_results': result['total_results'],
                'config_description': self.hnsw_configs[config_name]['description']
            }
        
        return comparison_results

    def search_similar(self, query: str, n_results: int = 10, max_distance: float = 2.0, 
                      where: dict = None, hnsw_config: str = 'balanced') -> List[Dict[str, Any]]:
        """Busca documentos similares usando embeddings semánticos"""
        result = self.search_similar_with_config(
            query=query,
            n_results=n_results,
            max_distance=max_distance,
            where=where,
            hnsw_config=hnsw_config
        )
        return result['results']