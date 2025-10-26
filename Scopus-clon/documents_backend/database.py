# documents_backend/database.py
import chromadb
from typing import List, Dict, Any
import json
import logging
import time
import os
from config import config

class VectorDatabase:
    def __init__(self):
        self.max_retries = 5
        self.retry_delay = 3
        self.client = None
        self.collection = None
        self.collection_name = "research_documents"
        
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
                
                try:
                    self.collection = self.client.get_collection(self.collection_name)
                    logging.info(f"✅ Colección '{self.collection_name}' cargada")
                except Exception as e:
                    logging.warning(f"⚠️ Colección no encontrada, creando nueva: {e}")
                    self.collection = self.client.create_collection(
                        name=self.collection_name,
                        metadata={"description": "Document embeddings for semantic search"}
                    )
                    logging.info(f"✅ Nueva colección '{self.collection_name}' creada")
                
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

    def get_all_documents_metadata(self) -> List[Dict[str, Any]]:
        """Obtener todos los documentos con sus metadatos completos"""
        try:
            if self.collection is None:
                self._connect()
                if self.collection is None:
                    return []
            
            # Obtener todos los documentos
            all_docs = self.collection.get(
                include=['metadatas']
            )
            
            documents = []
            for i, metadata in enumerate(all_docs['metadatas']):
                doc_id = int(all_docs['ids'][i])
                documents.append({
                    'id': doc_id,
                    'metadata': metadata
                })
            
            logging.info(f"📄 Obtenidos {len(documents)} documentos de ChromaDB")
            return documents
            
        except Exception as e:
            logging.error(f"❌ Error obteniendo documentos de ChromaDB: {e}")
            return []

    def search_similar(self, query: str, n_results: int = 10, max_distance: float = 2.0) -> List[Dict[str, Any]]:
        """Busca documentos similares usando embeddings semánticos"""
        try:
            if self.collection is None:
                self._connect()
                if self.collection is None:
                    return []
            
            logging.info(f"🔍 Ejecutando búsqueda semántica: '{query}' (n_results: {n_results}, max_distance: {max_distance})")
            
            # Obtener el número total de documentos
            total_docs = self.collection.count()
            
            # Ajustar n_results si es mayor que el total de documentos
            actual_n_results = min(n_results, total_docs)
            
            results = self.collection.query(
                query_texts=[query],
                n_results=actual_n_results,
                include=['metadatas', 'distances', 'documents']
            )
            
            formatted_results = []
            for i, (metadata, distance, document_text) in enumerate(zip(
                results['metadatas'][0],
                results['distances'][0],
                results['documents'][0]
            )):
                # Solo incluir resultados que cumplan con la distancia máxima
                if distance <= max_distance:
                    formatted_results.append({
                        'id': int(results['ids'][0][i]),
                        'metadata': metadata,
                        'distance': float(distance),
                        'document_text': document_text
                    })
            
            # Ordenar por distancia ascendente (menor distancia primero)
            formatted_results.sort(key=lambda x: x['distance'])
            
            logging.info(f"✅ Búsqueda semántica encontró {len(formatted_results)} resultados para: '{query}'")
            
            # Debug: mostrar primeros resultados con distancias
            if formatted_results:
                for i, result in enumerate(formatted_results[:3]):
                    logging.debug(f"Resultado {i+1}: ID={result['id']}, Distance={result['distance']:.4f}")
            
            return formatted_results
            
        except Exception as e:
            logging.error(f"❌ Error en búsqueda semántica: {e}")
            return []

    def get_document_by_id(self, doc_id: int) -> Dict[str, Any]:
        """Obtener un documento específico por ID"""
        try:
            if self.collection is None:
                self._connect()
                if self.collection is None:
                    return None
            
            result = self.collection.get(
                ids=[str(doc_id)],
                include=['metadatas', 'documents']
            )
            
            if not result['ids']:
                return None
            
            metadata = result['metadatas'][0]
            document_text = result['documents'][0]
            
            return {
                'id': doc_id,
                'metadata': metadata,
                'document_text': document_text
            }
            
        except Exception as e:
            logging.error(f"❌ Error obteniendo documento {doc_id}: {e}")
            return None