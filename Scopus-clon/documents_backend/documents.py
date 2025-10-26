# documents_backend/documents.py
from flask import Blueprint, request, jsonify
from database import VectorDatabase
import json
import logging

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

@documents_bp.route('/search', methods=['GET'])
def search_documents():
    """Busca documentos por texto usando embeddings semánticos - SOLO ChromaDB"""
    query = request.args.get('q', '')
    search_type = request.args.get('type', 'semantic')
    limit = int(request.args.get('limit', 10))
    offset = int(request.args.get('offset', 0))
    max_distance = float(request.args.get('max_distance', 2.0))
    
    if not query:
        return jsonify({'error': 'Query parameter "q" is required'}), 400
    
    try:
        if search_type == 'semantic':
            # Primero obtener TODOS los resultados para calcular total
            all_vector_results = vector_db.search_similar(query, n_results=1000, max_distance=max_distance)  # Número alto para obtener todos
            
            # Aplicar paginación
            start_idx = offset
            end_idx = offset + limit
            paginated_results = all_vector_results[start_idx:end_idx]
            
            logging.info(f"🔍 Búsqueda: '{query}' - {len(all_vector_results)} total, mostrando {len(paginated_results)} (offset: {offset}, limit: {limit})")
            
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
            
        else:
            # Búsqueda por keywords - también usando ChromaDB
            all_docs = vector_db.get_all_documents_metadata()
            keyword_results = []
            
            query_lower = query.lower()
            for doc in all_docs:
                metadata = doc['metadata']
                title = metadata.get('title', '').lower()
                abstract = metadata.get('abstract', '').lower()
                keywords = ' '.join(json.loads(metadata.get('keywords', '[]'))).lower()
                
                # Buscar en título, abstract y keywords
                if (query_lower in title or 
                    query_lower in abstract or 
                    query_lower in keywords):
                    
                    formatted_doc = format_document_from_metadata(doc['id'], metadata, 0.0)
                    if formatted_doc:
                        keyword_results.append(formatted_doc)
            
            # Aplicar paginación
            start_idx = offset
            end_idx = offset + limit
            results = keyword_results[start_idx:end_idx]
            
            logging.info(f"🔍 Búsqueda keyword: '{query}' - {len(keyword_results)} total, mostrando {len(results)} (offset: {offset}, limit: {limit})")
        
        return jsonify({
            'query': query,
            'search_type': search_type,
            'max_distance': max_distance,
            'total_results': len(all_vector_results) if search_type == 'semantic' else len(keyword_results),
            'offset': offset,
            'limit': limit,
            'results': results
        })
        
    except Exception as e:
        logging.error(f'❌ Búsqueda falló: {str(e)}')
        return jsonify({'error': f'Search failed: {str(e)}'}), 500

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