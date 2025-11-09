# documents_backend/documents.py
from flask import Blueprint, request, jsonify
from database import VectorDatabase
import json
import logging
import time

documents_bp = Blueprint('documents', __name__)

# Inicializar la base de datos vectorial
vector_db = VectorDatabase()

def format_document_from_metadata(doc_id: int, metadata: dict, distance: float = None) -> dict:
    """Formatear un documento completo desde los metadatos de ChromaDB"""
    try:
        # Parsear campos JSON
        authors = json.loads(metadata.get('authors', '[]'))
        keywords = json.loads(metadata.get('keywords', '[]'))
        subject_areas = json.loads(metadata.get('subject_areas', '[]'))
        institution = json.loads(metadata.get('institution', '{}'))
        funding = json.loads(metadata.get('funding', '{}'))
        references = json.loads(metadata.get('references', '[]'))
        content = json.loads(metadata.get('content', '{"sections": []}'))
        
        # Construir documento completo
        document = {
            'id': doc_id,
            'article_title': metadata.get('title', ''),
            'abstract': metadata.get('abstract', ''),
            'authors': authors,
            'keywords': keywords,
            'institution': institution,
            'funding': funding,
            'language': metadata.get('language', 'Español'),
            'issn': metadata.get('issn', ''),
            'coden': metadata.get('coden', ''),
            'doi': metadata.get('doi', ''),
            'references': references,
            'coderence': metadata.get('coderence', ''),
            'chemical_name': metadata.get('chemical_name', 'N/A'),
            'cas_number': metadata.get('cas_number', 'N/A'),
            'orcid': metadata.get('orcid', ''),
            'publication_date': metadata.get('publication_date', ''),
            'cites_count': metadata.get('cites_count', 0),
            'document_type': metadata.get('document_type', ''),
            'content': content,
            'subject_areas': subject_areas,
            'source_title': metadata.get('source_title', ''),
            'publisher': metadata.get('publisher', ''),
            'year': metadata.get('year', '')
        }
        
        # Agregar distancia si está disponible
        if distance is not None:
            document['distance'] = distance
            
        return document
        
    except Exception as e:
        logging.error(f"❌ Error formateando documento {doc_id}: {e}")
        return None
    

def format_document_from_metadata(doc_id: int, metadata: dict, distance: float = None) -> dict:
    """Formatear un documento completo desde los metadatos de ChromaDB"""
    try:
        # Parsear campos JSON
        authors = json.loads(metadata.get('authors', '[]'))
        keywords = json.loads(metadata.get('keywords', '[]'))
        subject_areas = json.loads(metadata.get('subject_areas', '[]'))
        institution = json.loads(metadata.get('institution', '{}'))
        funding = json.loads(metadata.get('funding', '{}'))
        references = json.loads(metadata.get('references', '[]'))
        content = json.loads(metadata.get('content', '{"sections": []}'))
        
        # Construir documento completo
        document = {
            'id': doc_id,
            'article_title': metadata.get('title', ''),
            'abstract': metadata.get('abstract', ''),
            'authors': authors,
            'keywords': keywords,
            'institution': institution,
            'funding': funding,
            'language': metadata.get('language', 'Español'),
            'issn': metadata.get('issn', ''),
            'coden': metadata.get('coden', ''),
            'doi': metadata.get('doi', ''),
            'references': references,
            'coderence': metadata.get('coderence', ''),
            'chemical_name': metadata.get('chemical_name', 'N/A'),
            'cas_number': metadata.get('cas_number', 'N/A'),
            'orcid': metadata.get('orcid', ''),
            'publication_date': metadata.get('publication_date', ''),
            'cites_count': metadata.get('cites_count', 0),
            'document_type': metadata.get('document_type', ''),
            'content': content,
            'subject_areas': subject_areas,
            'source_title': metadata.get('source_title', ''),
            'publisher': metadata.get('publisher', ''),
            'year': metadata.get('year', '')
        }
        
        # Agregar distancia si está disponible
        if distance is not None:
            document['distance'] = distance
            
        return document
        
    except Exception as e:
        logging.error(f"❌ Error formateando documento {doc_id}: {e}")
        return None

@documents_bp.route('/search', methods=['GET'])
def search_documents():
    """Busca documentos por texto usando embeddings semánticos - CORREGIDO"""
    query = request.args.get('q', '')
    search_type = request.args.get('type', 'semantic')
    search_within = request.args.get('searchWithin', 'all-fields')
    limit = int(request.args.get('limit', 10))
    offset = int(request.args.get('offset', 0))
    max_distance = float(request.args.get('max_distance', 2.0))
    hnsw_config = request.args.get('hnsw_config', 'balanced')
    
    if not query:
        return jsonify({'error': 'Query parameter "q" is required'}), 400
    
    try:
        # Construir filtro where - CORREGIDO: ChromaDB no soporta $contains
        where_filter = None
        if search_within != 'all-fields' and search_within != 'title and abstract and keywords':
            # Para búsqueda semántica, no podemos usar filtros de texto con ChromaDB
            # ChromaDB solo soporta: $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin
            # Para búsqueda por texto específico, mejor usar keyword search
            logging.warning(f"⚠️ Filtro por campo específico '{search_within}' no soportado en búsqueda semántica")
            # No aplicamos filtro where para campos de texto
        
        if search_type == 'semantic':
            # Usar el nuevo método que incluye tiempos
            start_time = time.time()
            
            search_result = vector_db.search_similar_with_config(
                query=query,
                n_results=1000,  # Obtener muchos resultados para paginación
                max_distance=max_distance,
                where=where_filter,  # Este será None para campos de texto
                hnsw_config=hnsw_config
            )
            
            total_search_time = time.time() - start_time
            
            all_results = search_result['results']
            config_search_time = search_result['search_time']
            
            # Aplicar paginación
            start_idx = offset
            end_idx = offset + limit
            paginated_results = all_results[start_idx:end_idx]
            
            # Formatear resultados paginados
            results = []
            for result in paginated_results:
                formatted_doc = format_document_from_metadata(
                    result['id'], 
                    result['metadata'], 
                    result['distance']
                )
                if formatted_doc:
                    results.append(formatted_doc)
            
            logging.info(f"🔍 Búsqueda semántica: '{query}' - config: {hnsw_config} - {len(all_results)} total, tiempo: {config_search_time:.3f}s")
            
            return jsonify({
                'query': query,
                'search_type': search_type,
                'search_within': search_within,
                'max_distance': max_distance,
                'total_results': len(all_results),
                'offset': offset,
                'limit': limit,
                'search_time': config_search_time,
                'search_config': hnsw_config,
                'results': results
            })
            
        else:
            # Búsqueda por keywords (código existente)
            all_docs = vector_db.get_all_documents_metadata()
            keyword_results = []
            
            query_lower = query.lower()
            for doc in all_docs:
                metadata = doc['metadata']
                
                if search_within == 'all-fields' or search_within == 'title and abstract and keywords':
                    title = metadata.get('title', '').lower()
                    abstract = metadata.get('abstract', '').lower()
                    keywords = ' '.join(json.loads(metadata.get('keywords', '[]'))).lower()
                    
                    if (query_lower in title or 
                        query_lower in abstract or 
                        query_lower in keywords):
                        formatted_doc = format_document_from_metadata(doc['id'], metadata, 0.0)
                        if formatted_doc:
                            keyword_results.append(formatted_doc)
                else:
                    # Para búsqueda keyword por campo específico
                    field_mapping = {
                        'article_title': 'title',
                        'abstract': 'abstract', 
                        'keywords': 'keywords',
                        'authors': 'authors',
                        'institution': 'institution',
                        'funding': 'funding',
                        'language': 'language',
                        'issn': 'issn',
                        'coden': 'coden',
                        'doi': 'doi',
                        'references': 'references',
                        'coderence': 'coderence',
                        'chemical_name': 'chemical_name',
                        'cas_number': 'cas_number',
                        'orcid': 'orcid',
                        'publication_date': 'publication_date',
                        'document_type': 'document_type',
                        'content': 'content',
                        'subject_areas': 'subject_areas',
                        'source_title': 'source_title',
                        'publisher': 'publisher'
                    }
                    field_name = field_mapping.get(search_within, search_within)
                    field_value = metadata.get(field_name, '').lower()
                    if query_lower in field_value:
                        formatted_doc = format_document_from_metadata(doc['id'], metadata, 0.0)
                        if formatted_doc:
                            keyword_results.append(formatted_doc)
            
            # Aplicar paginación
            start_idx = offset
            end_idx = offset + limit
            results = keyword_results[start_idx:end_idx]
            
            logging.info(f"🔍 Búsqueda keyword: '{query}' - within: {search_within} - {len(keyword_results)} total")
            
            return jsonify({
                'query': query,
                'search_type': search_type,
                'search_within': search_within,
                'max_distance': max_distance,
                'total_results': len(keyword_results),
                'offset': offset,
                'limit': limit,
                'search_time': 0.0,  # Para búsqueda keyword
                'results': results
            })
        
    except Exception as e:
        logging.error(f'❌ Búsqueda falló: {str(e)}')
        return jsonify({'error': f'Search failed: {str(e)}'}), 500

@documents_bp.route('/search/compare-hnsw', methods=['GET'])
def compare_hnsw_configs():
    """Comparar todas las configuraciones HNSW - CORREGIDO"""
    query = request.args.get('q', '')
    search_within = request.args.get('searchWithin', 'all-fields')
    limit = int(request.args.get('limit', 10))
    max_distance = float(request.args.get('max_distance', 2.0))
    
    if not query:
        return jsonify({'error': 'Query parameter "q" is required'}), 400
    
    try:
        # Construir filtro where
        where_filter = None
        if search_within != 'all-fields' and search_within != 'title and abstract and keywords':
            field_mapping = {
                'article_title': 'title',
                'abstract': 'abstract', 
                'keywords': 'keywords',
                'authors': 'authors',
                'institution': 'institution',
                'funding': 'funding',
                'language': 'language',
                'issn': 'issn',
                'coden': 'coden',
                'doi': 'doi',
                'references': 'references',
                'coderence': 'coderence',
                'chemical_name': 'chemical_name',
                'cas_number': 'cas_number',
                'orcid': 'orcid',
                'publication_date': 'publication_date',
                'document_type': 'document_type',
                'content': 'content',
                'subject_areas': 'subject_areas',
                'source_title': 'source_title',
                'publisher': 'publisher'
            }
            field_name = field_mapping.get(search_within, search_within)
            where_filter = {field_name: {"$contains": query}}
        
        comparison_results = vector_db.search_similar_comparative(
            query=query,
            n_results=limit,
            max_distance=max_distance,
            where=where_filter
        )
        
        # Formatear resultados para cada configuración
        formatted_comparison = {}
        for config_name, result in comparison_results.items():
            formatted_results = []
            for doc_result in result['results']:
                formatted_doc = format_document_from_metadata(
                    doc_result['id'], 
                    doc_result['metadata'], 
                    doc_result['distance']
                )
                if formatted_doc:
                    formatted_results.append(formatted_doc)
            
            formatted_comparison[config_name] = {
                'results': formatted_results,
                'search_time': result['search_time'],
                'total_results': result['total_results'],  # Corregido: era total_found
                'description': result.get('config_description', config_name)
            }
        
        return jsonify({
            'query': query,
            'search_within': search_within,
            'max_distance': max_distance,
            'limit': limit,
            'comparison': formatted_comparison
        })
        
    except Exception as e:
        logging.error(f'❌ Comparación HNSW falló: {str(e)}')
        return jsonify({'error': f'Comparison failed: {str(e)}'}), 500

def apply_metadata_filter(metadata: dict, where_filter: dict) -> bool:
    """Aplicar filtro a metadatos para búsqueda keyword"""
    if not where_filter:
        return True
        
    for field, condition in where_filter.items():
        field_value = metadata.get(field, '')
        if condition.get('$ne') == '' and field_value == '':
            return False
            
    return True

@documents_bp.route('/documents/<int:doc_id>', methods=['GET'])
def get_document(doc_id):
    """Obtener un documento específico por ID - SOLO ChromaDB"""
    try:
        result = vector_db.get_document_by_id(doc_id)
        
        if not result:
            return jsonify({'error': 'Document not found'}), 404
        
        # Formatear documento completo
        document = format_document_from_metadata(doc_id, result['metadata'])
        
        if not document:
            return jsonify({'error': 'Error formatting document'}), 500
            
        return jsonify(document)
        
    except Exception as e:
        logging.error(f'❌ Error obteniendo documento {doc_id}: {str(e)}')
        return jsonify({'error': f'Failed to get document: {str(e)}'}), 500

@documents_bp.route('/documents/batch', methods=['GET'])
def get_documents_batch():
    """Obtener múltiples documentos por IDs - SOLO ChromaDB"""
    try:
        ids_param = request.args.get('ids', '')
        if not ids_param:
            return jsonify({'error': 'IDs parameter is required'}), 400
        
        doc_ids = [int(id_str) for id_str in ids_param.split(',')]
        documents = []
        
        for doc_id in doc_ids:
            result = vector_db.get_document_by_id(doc_id)
            if result:
                document = format_document_from_metadata(doc_id, result['metadata'])
                if document:
                    documents.append(document)
        
        return jsonify(documents)
        
    except Exception as e:
        logging.error(f'❌ Error obteniendo documentos batch: {str(e)}')
        return jsonify({'error': f'Failed to get documents: {str(e)}'}), 500

@documents_bp.route('/search/benchmark', methods=['GET'])
def benchmark_search():
    """Endpoint para comparar configuraciones HNSW"""
    query = request.args.get('q', '')
    n_results = int(request.args.get('limit', 10))
    max_distance = float(request.args.get('max_distance', 2.0))
    
    if not query:
        return jsonify({'error': 'Query parameter "q" is required'}), 400
    
    try:
        comparison_results = vector_db.search_similar_comparative(
            query=query,
            n_results=n_results,
            max_distance=max_distance,
            compare_configs=True
        )
        
        return jsonify({
            'query': query,
            'comparison': comparison_results
        })
        
    except Exception as e:
        logging.error(f'❌ Benchmark falló: {str(e)}')
        return jsonify({'error': f'Benchmark failed: {str(e)}'}), 500

@documents_bp.route('/hnsw/configs', methods=['GET'])
def get_hnsw_configs():
    """Obtener las configuraciones HNSW disponibles"""
    return jsonify({
        'available_configurations': vector_db.hnsw_configs,
        'current_config': 'balanced'
    })

@documents_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Verificar conexión a ChromaDB
        count = vector_db.collection.count()
        return jsonify({
            'status': 'healthy', 
            'service': 'documents',
            'chromadb': 'connected',
            'document_count': count
        })
    except Exception as e:
        return jsonify({
            'status': 'degraded', 
            'service': 'documents',
            'chromadb': 'disconnected',
            'error': str(e)
        }), 500