import pymysql
import json
import time
from config import Config
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

class Document:
    @staticmethod
    def search_documents(query, search_within='all-fields', limit=10, offset=0):
        """
        Búsqueda tradicional en MySQL - CORREGIDO
        """
        conn = get_db_connection()
        cursor = dict_cursor(conn)
        
        try:
            # Consulta base corregida
            base_query = '''
                SELECT 
                    id, article_title, abstract, 
                    authors, keywords, institution, funding,
                    language, issn, coden, doi, `references`, coderence,
                    chemical_name, cas_number, orcid, publication_date,
                    cites_count, document_type, content, subject_areas,
                    source_title, publisher, year
                FROM documents 
                WHERE 1=1
            '''
            params = []
            
            # Construir condiciones de búsqueda según search_within
            search_term = f'%{query}%'
            
            if search_within == 'all-fields' or search_within == 'title and abstract and keywords':
                base_query += '''
                    AND (article_title LIKE %s 
                    OR abstract LIKE %s 
                    OR fulltext_index LIKE %s
                    OR keywords LIKE %s)
                '''
                params = [search_term, search_term, search_term, search_term]
            elif search_within == 'article_title':
                base_query += ' AND article_title LIKE %s'
                params = [search_term]
            elif search_within == 'abstract':
                base_query += ' AND abstract LIKE %s'
                params = [search_term]
            elif search_within == 'keywords':
                base_query += ' AND keywords LIKE %s'
                params = [search_term]
            elif search_within == 'authors':
                base_query += ' AND authors LIKE %s'
                params = [search_term]
            elif search_within == 'subject_areas':
                base_query += ' AND subject_areas LIKE %s'
                params = [search_term]
            elif search_within == 'source_title':
                base_query += ' AND source_title LIKE %s'
                params = [search_term]
            elif search_within == 'publisher':
                base_query += ' AND publisher LIKE %s'
                params = [search_term]
            else:
                # Búsqueda por defecto en todos los campos
                base_query += '''
                    AND (article_title LIKE %s 
                    OR abstract LIKE %s 
                    OR fulltext_index LIKE %s)
                '''
                params = [search_term, search_term, search_term]
            
            # Agregar límite y offset
            base_query += ' LIMIT %s OFFSET %s'
            params.extend([limit, offset])
            
            # Query para contar total
            count_query = '''
                SELECT COUNT(*) as total 
                FROM documents 
                WHERE 1=1
            ''' + base_query.split('WHERE 1=1')[1].split('LIMIT')[0]
            count_params = params[:-2]  # Remover limit y offset
            
            print(f"🔍 Executing MySQL query: {base_query}")
            print(f"🔍 With params: {params}")
            
            # Ejecutar búsqueda
            cursor.execute(base_query, params)
            documents = cursor.fetchall()
            
            print(f"🔍 Found {len(documents)} documents")
            
            # Ejecutar count
            cursor.execute(count_query, count_params)
            total_result = cursor.fetchone()
            total_count = total_result['total'] if total_result else 0
            
            # Procesar documentos para parsear campos JSON
            processed_docs = []
            for doc in documents:
                try:
                    processed_doc = {
                        'id': doc['id'],
                        'article_title': doc['article_title'],
                        'abstract': doc['abstract'],
                        'authors': json.loads(doc['authors']) if doc['authors'] else [],
                        'keywords': json.loads(doc['keywords']) if doc['keywords'] else [],
                        'institution': json.loads(doc['institution']) if doc['institution'] else {},
                        'funding': json.loads(doc['funding']) if doc['funding'] else {},
                        'language': doc['language'],
                        'issn': doc['issn'],
                        'coden': doc['coden'],
                        'doi': doc['doi'],
                        'references': json.loads(doc['references']) if doc.get('references') else [],
                        'coderence': doc['coderence'],
                        'chemical_name': doc['chemical_name'],
                        'cas_number': doc['cas_number'],
                        'orcid': doc['orcid'],
                        'publication_date': str(doc['publication_date']) if doc['publication_date'] else None,
                        'cites_count': doc['cites_count'],
                        'document_type': doc['document_type'],
                        'content': json.loads(doc['content']) if doc['content'] else {},
                        'subject_areas': json.loads(doc['subject_areas']) if doc['subject_areas'] else [],
                        'source_title': doc['source_title'],
                        'publisher': doc['publisher'],
                        'year': doc['year']
                    }
                    processed_docs.append(processed_doc)
                except Exception as e:
                    print(f"❌ Error processing document {doc.get('id')}: {e}")
                    continue
            
            print(f"✅ Successfully processed {len(processed_docs)} documents")
            
            return {
                'documents': processed_docs,
                'total_count': total_count
            }
            
        except Exception as e:
            print(f"❌ Error in MySQL search: {e}")
            raise e
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def get_document_by_id(doc_id):
        """
        Obtener un documento específico por ID
        """
        conn = get_db_connection()
        cursor = dict_cursor(conn)
        
        try:
            cursor.execute('''
                SELECT * FROM documents WHERE id = %s
            ''', (doc_id,))
            
            doc = cursor.fetchone()
            if not doc:
                return None
            
            # Procesar campos JSON
            processed_doc = {
                'id': doc['id'],
                'article_title': doc['article_title'],
                'abstract': doc['abstract'],
                'authors': json.loads(doc['authors']) if doc['authors'] else [],
                'keywords': json.loads(doc['keywords']) if doc['keywords'] else [],
                'institution': json.loads(doc['institution']) if doc['institution'] else {},
                'funding': json.loads(doc['funding']) if doc['funding'] else {},
                'language': doc['language'],
                'issn': doc['issn'],
                'coden': doc['coden'],
                'doi': doc['doi'],
                'references': json.loads(doc['references']) if doc.get('references') else [],
                'coderence': doc['coderence'],
                'chemical_name': doc['chemical_name'],
                'cas_number': doc['cas_number'],
                'orcid': doc['orcid'],
                'publication_date': str(doc['publication_date']) if doc['publication_date'] else None,
                'cites_count': doc['cites_count'],
                'document_type': doc['document_type'],
                'content': json.loads(doc['content']) if doc['content'] else {},
                'subject_areas': json.loads(doc['subject_areas']) if doc['subject_areas'] else [],
                'source_title': doc['source_title'],
                'publisher': doc['publisher'],
                'year': doc['year']
            }
            
            return processed_doc
            
        except Exception as e:
            raise e
        finally:
            cursor.close()
            conn.close()