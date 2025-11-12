import chromadb
import time
import os
import logging
import json
from datetime import datetime, timedelta
import random

# Configurar logging más detallado
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_sample_documents():
    """Crea 15 documentos de ejemplo diferentes y bien estructurados"""
    logger.info("📝 Creando documentos de ejemplo...")
    
    # Instituciones de ejemplo
    institutions = [
        {"id": 1, "name": "Universidad de Datos Avanzados", "city": "Madrid", "country": "España"},
        {"id": 2, "name": "Instituto Tecnológico de Machine Learning", "city": "Barcelona", "country": "España"},
        {"id": 3, "name": "Centro de Investigación en IA", "city": "Valencia", "country": "España"},
        {"id": 4, "name": "Universidad Politécnica de Data Science", "city": "Sevilla", "country": "España"},
        {"id": 5, "name": "MIT Data Science Lab", "city": "Cambridge", "country": "USA"},
        {"id": 6, "name": "Stanford AI Research Center", "city": "Stanford", "country": "USA"},
        {"id": 7, "name": "Universidad Nacional de Ingeniería", "city": "Lima", "country": "Perú"},
        {"id": 8, "name": "Instituto de Tecnología de Tokyo", "city": "Tokyo", "country": "Japón"}
    ]
    
    # Fuentes de financiamiento
    fundings = [
        {"id": 1, "information": "Agencia Nacional de Investigación", "sponsor": "Ministerio de Ciencia e Innovación", "acronym": "ANID", "number": "ANID-2024-12345"},
        {"id": 2, "information": "European Research Council", "sponsor": "Unión Europea", "acronym": "ERC", "number": "ERC-2024-67890"},
        {"id": 3, "information": "National Science Foundation", "sponsor": "Gobierno de USA", "acronym": "NSF", "number": "NSF-2024-54321"},
        {"id": 4, "information": "Consejo Superior de Investigaciones Científicas", "sponsor": "CSIC", "acronym": "CSIC", "number": "CSIC-2024-98765"},
        {"id": 5, "information": "Bill & Melinda Gates Foundation", "sponsor": "Fundación Gates", "acronym": "BMGF", "number": "BMGF-2024-11111"},
        {"id": 6, "information": "Google Research Awards", "sponsor": "Google", "acronym": "GRA", "number": "GRA-2024-22222"}
    ]
    
    # Documentos específicos y diferentes
    sample_docs = [
        {
            "id": 1,
            "article_title": "Análisis Comparativo de Algoritmos de Machine Learning para Diagnóstico Médico",
            "abstract": "Este estudio evalúa la efectividad de diferentes algoritmos de machine learning en el diagnóstico temprano de enfermedades cardiovasculares utilizando datos clínicos de 5,000 pacientes.",
            "authors": ["Dra. Elena Martínez", "Dr. Carlos Rodríguez", "Prof. Miguel Ángel López"],
            "keywords": ["machine_learning", "diagnóstico_médico", "enfermedades_cardiovasculares", "algoritmos", "medicina_predictiva"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "1234-5678",
            "coden": "MLMED01",
            "doi": "10.1234/ml.med.2024.001",
            "references": [
                {"id": 1, "reference_text": "Smith, J. (2023). Machine Learning in Healthcare. Journal of Medical Informatics, 45(2), 123-135."},
                {"id": 2, "reference_text": "García, L. (2022). Deep Learning for Medical Diagnosis. IEEE Transactions on Medical Imaging, 41(3), 567-579."}
            ],
            "coderence": "MED2024A1",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0097",
            "publication_date": "2024-03-15",
            "cites_count": 89,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "El diagnóstico médico temprano es crucial para el tratamiento efectivo de enfermedades cardiovasculares. Los avances en machine learning ofrecen nuevas oportunidades para mejorar la precisión diagnóstica."
                    },
                    {
                        "title": "Metodología",
                        "text": "Se analizaron datos de 5,000 pacientes utilizando 6 algoritmos diferentes: Random Forest, SVM, XGBoost, Redes Neuronales, K-NN y Regresión Logística. La validación cruzada se realizó con 10 folds."
                    },
                    {
                        "title": "Resultados",
                        "text": "XGBoost mostró el mejor rendimiento con 94.2% de precisión, seguido por Redes Neuronales con 92.8%. El análisis de características reveló que la presión arterial y el colesterol fueron los predictores más importantes."
                    },
                    {
                        "title": "Discusión",
                        "text": "Los resultados demuestran el potencial de los algoritmos de ensemble en diagnóstico médico. La interpretabilidad de los modelos sigue siendo un desafío que requiere atención futura."
                    },
                    {
                        "title": "Conclusiones",
                        "text": "Los algoritmos de machine learning, particularmente XGBoost, pueden mejorar significativamente el diagnóstico de enfermedades cardiovasculares cuando se combinan con expertise médico."
                    }
                ]
            },
            "subject_areas": ["Inteligencia Artificial", "Medicina"],
            "source_title": "Journal of Medical Artificial Intelligence",
            "publisher": "Elsevier"
        },
        {
            "id": 2,
            "article_title": "Blockchain para la Gestión Segura de Historias Clínicas Electrónicas",
            "abstract": "Propuesta de un sistema descentralizado basado en blockchain para garantizar la seguridad, privacidad e interoperabilidad de historias clínicas electrónicas.",
            "authors": ["Dr. Roberto Silva", "Ing. Ana García", "Dra. Laura Mendoza"],
            "keywords": ["blockchain", "historia_clínica", "seguridad", "privacidad", "healthcare"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "2345-6789",
            "coden": "BLCHC02",
            "doi": "10.1234/blockchain.2024.002",
            "references": [
                {"id": 1, "reference_text": "Nakamoto, S. (2008). Bitcoin: A Peer-to-Peer Electronic Cash System."},
                {"id": 2, "reference_text": "Zhang, P. (2023). Blockchain Applications in Healthcare. Health Informatics Journal, 29(1), 45-58."}
            ],
            "coderence": "BLOCK2024B2",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0098",
            "publication_date": "2024-04-20",
            "cites_count": 67,
            "document_type": "Artículo de conferencia",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "La digitalización de historias clínicas presenta desafíos de seguridad y privacidad. Blockchain emerge como tecnología prometedora para abordar estos problemas."
                    },
                    {
                        "title": "Arquitectura Propuesta",
                        "text": "Desarrollamos una arquitectura híbrida que combina blockchain privado para el consenso y IPFS para el almacenamiento distribuido de datos médicos."
                    },
                    {
                        "title": "Implementación",
                        "text": "El prototipo se implementó usando Hyperledger Fabric con smart contracts para gestión de permisos y acceso granular a los datos médicos."
                    },
                    {
                        "title": "Evaluación de Seguridad",
                        "text": "El sistema resistió ataques de modificación de datos y demostró capacidad de auditoría completa. El rendimiento alcanzó 150 transacciones por segundo."
                    },
                    {
                        "title": "Conclusiones y Trabajo Futuro",
                        "text": "La solución propuesta ofrece mejoras significativas en seguridad y privacidad. Futuras investigaciones explorarán la integración con IA para análisis predictivo."
                    }
                ]
            },
            "subject_areas": ["Blockchain", "Ciberseguridad", "Salud Digital"],
            "source_title": "International Conference on Healthcare Informatics",
            "publisher": "IEEE"
        },
        {
            "id": 3,
            "article_title": "Optimización de Redes 5G mediante Algoritmos Genéticos Multiobjetivo",
            "abstract": "Desarrollo de un framework de optimización para redes 5G que maximiza cobertura y minimiza interferencia usando algoritmos genéticos multiobjetivo.",
            "authors": ["Dr. Fernando Torres", "Ing. Patricia Ruiz", "Dr. Andrés Castro"],
            "keywords": ["5g", "algoritmos_genéticos", "optimización", "telecomunicaciones", "multiobjetivo"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "3456-7890",
            "coden": "5GOPT03",
            "doi": "10.1234/5g.opt.2024.003",
            "references": [
                {"id": 1, "reference_text": "Goldberg, D. E. (1989). Genetic Algorithms in Search, Optimization and Machine Learning."},
                {"id": 2, "reference_text": "Li, X. (2023). 5G Network Optimization Challenges. IEEE Communications Magazine, 61(4), 78-85."}
            ],
            "coderence": "5GOPT2024C3",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0099",
            "publication_date": "2024-02-10",
            "cites_count": 112,
            "document_type": "Artículo de revista",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "La implementación eficiente de redes 5G requiere optimización compleja que considere múltiples objetivos en conflicto como cobertura, capacidad y eficiencia energética."
                    },
                    {
                        "title": "Metodología",
                        "text": "Desarrollamos NSGA-III (Non-dominated Sorting Genetic Algorithm III) adaptado para optimización de emplazamiento de antenas 5G, considerando 5 objetivos simultáneos."
                    },
                    {
                        "title": "Experimentos",
                        "text": "Evaluamos el algoritmo en un escenario urbano real con 50 posibles emplazamientos. La solución optimizada redujo interferencia en 35% y mejoró cobertura en 28%."
                    },
                    {
                        "title": "Análisis de Resultados",
                        "text": "El algoritmo demostró convergencia estable en 150 generaciones. El frente de Pareto obtenido ofrece múltiples soluciones de compromiso para planificadores de red."
                    },
                    {
                        "title": "Conclusiones",
                        "text": "Los algoritmos genéticos multiobjetivo son efectivos para la compleja optimización de redes 5G, proporcionando soluciones balanceadas para múltiples métricas de desempeño."
                    }
                ]
            },
            "subject_areas": ["Telecomunicaciones", "Algoritmos Genéticos", "Optimización"],
            "source_title": "IEEE Transactions on Wireless Communications",
            "publisher": "IEEE"
        },
        {
            "id": 4,
            "article_title": "Análisis de Sentimientos en Tiempo Real para Mercados Financieros",
            "abstract": "Sistema de análisis de sentimientos que procesa noticias financieras en tiempo real para predecir movimientos del mercado de valores.",
            "authors": ["Dra. Carmen Vargas", "Dr. Ricardo Ortega", "Lic. Sofía Herrera"],
            "keywords": ["análisis_sentimientos", "nlp", "mercados_financieros", "tiempo_real", "predicción"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "4567-8901",
            "coden": "SENTF04",
            "doi": "10.1234/sentiment.2024.004",
            "references": [
                {"id": 1, "reference_text": "Liu, B. (2020). Sentiment Analysis and Opinion Mining. Morgan & Claypool."},
                {"id": 2, "reference_text": "Chen, K. (2023). AI in Financial Markets. Journal of Financial Data Science, 5(2), 89-104."}
            ],
            "coderence": "FINSENT2024D4",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0100",
            "publication_date": "2024-05-08",
            "cites_count": 78,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "El sentimiento del mercado, derivado de noticias y redes sociales, influye significativamente en los movimientos de precios de activos financieros."
                    },
                    {
                        "title": "Arquitectura del Sistema",
                        "text": "Desarrollamos una pipeline que incluye: crawler de noticias, preprocesamiento con BERT, clasificación de sentimientos, y modelo predictivo LSTM para precios."
                    },
                    {
                        "title": "Dataset y Entrenamiento",
                        "text": "Recopilamos 500,000 noticias financieras y 2 millones de tweets. El modelo BERT fine-tuned alcanzó 92% de precisión en clasificación de sentimientos."
                    },
                    {
                        "title": "Resultados de Predicción",
                        "text": "El sistema predijo correctamente 68% de movimientos direccionales del S&P500 con 15 minutos de anticipación. La estrategia basada en el modelo generó 24% de retorno anual."
                    },
                    {
                        "title": "Limitaciones y Futuro",
                        "text": "El modelo es sensible a noticias falsas. Futuras mejoras incluirán detección de manipulación y análisis de sentimientos multimodales."
                    }
                ]
            },
            "subject_areas": ["Procesamiento de Lenguaje Natural", "Finanzas Cuantitativas", "Análisis de Sentimientos"],
            "source_title": "Journal of Financial Analytics",
            "publisher": "Springer"
        },
        {
            "id": 5,
            "article_title": "Simulación Cuántica de Moléculas Complejas para Descubrimiento de Fármacos",
            "abstract": "Aplicación de computación cuántica para simular interacciones moleculares complejas, acelerando el descubrimiento de nuevos fármacos.",
            "authors": ["Dr. Antonio Méndez", "Dra. Isabel Reyes", "Prof. Kenji Tanaka"],
            "keywords": ["computación_cuántica", "simulación_molecular", "descubrimiento_fármacos", "química_cuántica", "algoritmos_cuánticos"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "5678-9012",
            "coden": "QUANT05",
            "doi": "10.1234/quantum.2024.005",
            "references": [
                {"id": 1, "reference_text": "Feynman, R. P. (1982). Simulating physics with computers. International Journal of Theoretical Physics, 21(6), 467-488."},
                {"id": 2, "reference_text": "Cao, Y. (2023). Quantum Computing for Drug Discovery. Nature Reviews Chemistry, 7(3), 145-162."}
            ],
            "coderence": "QUANT2024E5",
            "chemical_name": "C20H25N3O",
            "cas_number": "123456-78-9",
            "orcid": "0000-0002-1825-0101",
            "publication_date": "2024-01-25",
            "cites_count": 156,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "La simulación precisa de moléculas complejas es computacionalmente prohibitiva para computadoras clásicas, pero factible con algoritmos cuánticos."
                    },
                    {
                        "title": "Algoritmo VQE",
                        "text": "Implementamos Variational Quantum Eigensolver (VQE) en IBMQ para calcular energías de interacción proteína-ligando con 12 qubits."
                    },
                    {
                        "title": "Experimentos",
                        "text": "Simulamos 50 complejos proteína-ligando conocidos. Los resultados cuánticos mostraron correlación de 0.94 con datos experimentales, superando métodos DFT."
                    },
                    {
                        "title": "Aplicación Práctica",
                        "text": "Identificamos 3 candidatos prometedores para inhibición de COVID-19. El tiempo de screening se redujo de meses a días."
                    },
                    {
                        "title": "Desafíos Futuros",
                        "text": "La corrección de errores y escalabilidad son los principales retos. La integración con ML clásico puede superar limitaciones actuales."
                    }
                ]
            },
            "subject_areas": ["Computación Cuántica", "Química Médica", "Bioinformática"],
            "source_title": "Nature Quantum Computing",
            "publisher": "Nature Research"
        },
        {
            "id": 6,
            "article_title": "Deep Learning para Detección Temprana de Cáncer de Piel",
            "abstract": "Red neuronal convolucional que analiza imágenes dermatoscópicas para detectar melanoma con alta precisión, asistendo a dermatólogos en diagnóstico temprano.",
            "authors": ["Dra. Laura Sánchez", "Dr. Roberto Díaz", "Ing. Carlos Mendoza"],
            "keywords": ["deep_learning", "computer_vision", "dermatología", "melanoma", "diagnóstico_asistido"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "6789-0123",
            "coden": "DLMED06",
            "doi": "10.1234/dl.med.2024.006",
            "references": [
                {"id": 1, "reference_text": "LeCun, Y. (2015). Deep learning. Nature, 521(7553), 436-444."},
                {"id": 2, "reference_text": "Esteva, A. (2023). Dermatologist-level classification of skin cancer with deep neural networks. Nature, 542(7639), 115-118."}
            ],
            "coderence": "MEDAI2024F6",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0102",
            "publication_date": "2024-06-12",
            "cites_count": 203,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "El diagnóstico temprano de melanoma es crítico para la supervivencia del paciente. La variabilidad en diagnóstico entre dermatólogos motiva sistemas de asistencia basados en IA."
                    },
                    {
                        "title": "Arquitectura del Modelo",
                        "text": "Desarrollamos una CNN basada en EfficientNet-B7 con atención espacial, entrenada con 25,000 imágenes dermatoscópicas etiquetadas por expertos."
                    },
                    {
                        "title": "Validación Clínica",
                        "text": "En pruebas con 1,200 casos, el modelo alcanzó 96.3% de precisión, superando el 87.5% de dermatólogos humanos. La sensibilidad para melanoma fue 98.2%."
                    },
                    {
                        "title": "Integración Clínica",
                        "text": "Implementamos una aplicación web que proporciona segundas opiniones en 30 segundos. 45 dermatólogos la utilizan actualmente en práctica clínica."
                    },
                    {
                        "title": "Consideraciones Éticas",
                        "text": "El sistema está diseñado como herramienta de asistencia, no reemplazo. La responsabilidad diagnóstica final permanece con el médico tratante."
                    }
                ]
            },
            "subject_areas": ["Computer Vision", "Medicina", "Deep Learning"],
            "source_title": "Journal of Medical Imaging",
            "publisher": "SPIE"
        },
        {
            "id": 7,
            "article_title": "Sistema de Recomendación Híbrido para Plataformas de E-learning",
            "abstract": "Sistema de recomendación que combina filtrado colaborativo y basado en contenido para personalizar rutas de aprendizaje en plataformas educativas.",
            "authors": ["Dr. Miguel Ángel Cruz", "Dra. Elena Ramírez", "Lic. David Torres"],
            "keywords": ["sistemas_recomendación", "e-learning", "personalización", "filtrado_colaborativo", "educación_adaptativa"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "7890-1234",
            "coden": "RECEL07",
            "doi": "10.1234/recommend.2024.007",
            "references": [
                {"id": 1, "reference_text": "Ricci, F. (2022). Recommender Systems Handbook. Springer."},
                {"id": 2, "reference_text": "Kumar, V. (2023). AI in Education: A Review. Computers & Education, 189, 104582."}
            ],
            "coderence": "EDTECH2024G7",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0103",
            "publication_date": "2024-03-30",
            "cites_count": 91,
            "document_type": "Artículo de revista",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "La personalización del aprendizaje es clave para mejorar resultados educativos. Los sistemas de recomendación pueden adaptar contenidos a necesidades individuales."
                    },
                    {
                        "title": "Metodología Híbrida",
                        "text": "Combinamos: 1) Filtrado colaborativo basado en interacciones de usuarios similares, 2) Filtrado por contenido usando embeddings de materiales, 3) Knowledge-based usando objetivos de aprendizaje."
                    },
                    {
                        "title": "Implementación",
                        "text": "Desarrollamos el sistema en Python usando Surprise para colaborativo y Sentence-BERT para embeddings. La fusión usa weighted average learning."
                    },
                    {
                        "title": "Evaluación",
                        "text": "En prueba A/B con 10,000 estudiantes, el grupo con recomendaciones mostró 35% mayor completion rate y 28% mejor retención de conocimiento."
                    },
                    {
                        "title": "Aplicaciones Futuras",
                        "text": "Planificamos extender el sistema para recomendación de pares de estudio, mentores y recursos complementarios basados en brechas de conocimiento detectadas."
                    }
                ]
            },
            "subject_areas": ["Sistemas de Recomendación", "Tecnología Educativa", "Aprendizaje Automático"],
            "source_title": "Computers & Education",
            "publisher": "Elsevier"
        },
        {
            "id": 8,
            "article_title": "Análisis de Big Data para Optimización Logística en Cadena de Suministro",
            "abstract": "Framework de análisis predictivo que utiliza datos de IoT y transacciones para optimizar rutas, inventarios y pronósticos de demanda en cadena de suministro.",
            "authors": ["Ing. Jorge Hernández", "Dra. Ana Martínez", "Dr. Luis García"],
            "keywords": ["big_data", "logística", "cadena_suministro", "iot", "optimización"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "8901-2345",
            "coden": "BDLOG08",
            "doi": "10.1234/bigdata.2024.008",
            "references": [
                {"id": 1, "reference_text": "Chen, H. (2023). Big Data Analytics for Supply Chain Management. International Journal of Production Economics, 255, 108657."},
                {"id": 2, "reference_text": "Wang, K. (2022). IoT in Logistics: A Comprehensive Review. Transportation Research Part E, 158, 102567."}
            ],
            "coderence": "LOGIST2024H8",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0104",
            "publication_date": "2024-04-05",
            "cites_count": 124,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "La complejidad de las cadenas de suministro modernas requiere análisis avanzado de grandes volúmenes de datos para optimización operativa y estratégica."
                    },
                    {
                        "title": "Arquitectura de Datos",
                        "text": "Integramos datos de GPS, sensores IoT, transacciones ERP, clima, y redes sociales. El pipeline procesa 2TB diarios usando Apache Spark y Kafka."
                    },
                    {
                        "title": "Modelos Predictivos",
                        "text": "Desarrollamos: 1) LSTM para pronóstico de demanda, 2) Reinforcement Learning para optimización de rutas, 3) Anomaly detection para gestión de riesgos."
                    },
                    {
                        "title": "Caso de Estudio",
                        "text": "Implementación en retailer con 200 tiendas: reducción de 22% en costos logísticos, 35% menos stockouts, y 18% mejora en satisfacción cliente."
                    },
                    {
                        "title": "Lecciones Aprendidas",
                        "text": "La calidad de datos es crítica. La colaboración inter-departamental y el change management son esenciales para éxito en implementación."
                    }
                ]
            },
            "subject_areas": ["Big Data", "Logística", "Internet de las Cosas"],
            "source_title": "International Journal of Logistics Management",
            "publisher": "Emerald"
        },
        {
            "id": 9,
            "article_title": "Realidad Aumentada para Mantenimiento Industrial Predictivo",
            "abstract": "Sistema de realidad aumentada que superpone información predictiva de mantenimiento sobre equipos industriales, guiando a técnicos en intervenciones proactivas.",
            "authors": ["Ing. Francisco López", "Dra. Carmen Ruiz", "Dr. Roberto Jiménez"],
            "keywords": ["realidad_aumentada", "mantenimiento_predictivo", "industria_4.0", "iot", "visualización"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "9012-3456",
            "coden": "ARMTN09",
            "doi": "10.1234/ar.maint.2024.009",
            "references": [
                {"id": 1, "reference_text": "Azuma, R. T. (2023). A Survey of Augmented Reality. Presence: Teleoperators and Virtual Environments, 6(4), 355-385."},
                {"id": 2, "reference_text": "Lee, J. (2022). Predictive maintenance using digital twin. Journal of Manufacturing Systems, 65, 1-12."}
            ],
            "coderence": "IND40-2024I9",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0105",
            "publication_date": "2024-02-28",
            "cites_count": 87,
            "document_type": "Artículo de conferencia",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "El mantenimiento predictivo reduce costos y downtime, pero su implementación efectiva requiere interfaces intuitivas para técnicos de mantenimiento."
                    },
                    {
                        "title": "Sistema Desarrollado",
                        "text": "Desarrollamos aplicación HoloLens 2 que muestra: 1) Estado de salud del equipo, 2) Instrucciones de mantenimiento, 3) Alertas predictivas, 4) Historial de intervenciones."
                    },
                    {
                        "title": "Integración con IoT",
                        "text": "Conectamos con sensores de vibración, temperatura y acoustic emission. Los datos se procesan en edge computing para detección temprana de fallas."
                    },
                    {
                        "title": "Evaluación de Usabilidad",
                        "text": "45 técnicos probaron el sistema. El tiempo de intervención se redujo 40%, errores disminuyeron 65%, y satisfacción usuario fue 4.7/5.0."
                    },
                    {
                        "title": "Impacto Empresarial",
                        "text": "En planta manufacturera: 30% reducción en downtime no planificado, 25% ahorro en costos de mantenimiento, y ROI de 18 meses."
                    }
                ]
            },
            "subject_areas": ["Realidad Aumentada", "Industria 4.0", "Mantenimiento Predictivo"],
            "source_title": "IEEE International Conference on Industrial Informatics",
            "publisher": "IEEE"
        },
        {
            "id": 10,
            "article_title": "Algoritmos Bioinspirados para Optimización de Energías Renovables",
            "abstract": "Aplicación de algoritmos de colonia de hormigas y enjambre de partículas para optimizar la distribución y gestión de parques eólicos y solares.",
            "authors": ["Dr. Manuel Ortega", "Dra. Silvia Castro", "Ing. Ricardo Méndez"],
            "keywords": ["algoritmos_bioinspirados", "energías_renovables", "optimización", "colonia_hormigas", "enjambre_partículas"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "0123-4567",
            "coden": "BIOEN10",
            "doi": "10.1234/bio.energy.2024.010",
            "references": [
                {"id": 1, "reference_text": "Dorigo, M. (2022). Ant Colony Optimization. MIT Press."},
                {"id": 2, "reference_text": "Kennedy, J. (2023). Particle Swarm Optimization. Proceedings of ICNN, 4, 1942-1948."}
            ],
            "coderence": "RENEW2024J10",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0106",
            "publication_date": "2024-05-18",
            "cites_count": 73,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "La integración eficiente de energías renovables requiere optimización compleja que considere variabilidad climática, demanda energética y restricciones de red."
                    },
                    {
                        "title": "Metodología",
                        "text": "Combinamos Ant Colony Optimization para distribución óptima de turbinas y Particle Swarm Optimization para gestión dinámica de generación basada en pronósticos."
                    },
                    {
                        "title": "Simulaciones",
                        "text": "Modelamos parque híbrido eólico-solar de 100MW. Los algoritmos bioinspirados mejoraron eficiencia energética en 18% vs enfoques tradicionales."
                    },
                    {
                        "title": "Validación en Campo",
                        "text": "Implementación en parque real mostró 15% mayor capacidad de generación, 22% reducción en pérdidas de transmisión, y mejor estabilidad de red."
                    },
                    {
                        "title": "Sostenibilidad",
                        "text": "El enfoque contribuye a transición energética mediante optimización que maximiza aprovechamiento de recursos renovables disponibles."
                    }
                ]
            },
            "subject_areas": ["Algoritmos Bioinspirados", "Energías Renovables", "Optimización"],
            "source_title": "Renewable Energy Journal",
            "publisher": "Elsevier"
        },
        {
            "id": 11,
            "article_title": "Procesamiento de Lenguaje Natural para Análisis de Políticas Públicas",
            "abstract": "Sistema NLP que analiza discursos políticos y documentos legislativos para identificar tendencias, polarización y alineamiento ideológico.",
            "authors": ["Dra. Elena Morales", "Dr. Carlos Rojas", "Lic. Daniela Silva"],
            "keywords": ["procesamiento_lenguaje", "análisis_político", "políticas_públicas", "nlp", "análisis_textual"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "1123-4567",
            "coden": "NLPPOL11",
            "doi": "10.1234/nlp.politics.2024.011",
            "references": [
                {"id": 1, "reference_text": "Manning, C. D. (2023). Foundations of Statistical Natural Language Processing. MIT Press."},
                {"id": 2, "reference_text": "Grimmer, J. (2022). Text as Data: The Promise and Pitfalls of Automatic Content Analysis. Political Analysis, 21(3), 267-297."}
            ],
            "coderence": "POLNLP2024K11",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0107",
            "publication_date": "2024-03-22",
            "cites_count": 68,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "El análisis manual de documentos políticos es laborioso y subjetivo. Las técnicas NLP permiten análisis sistemático y cuantitativo a gran escala."
                    },
                    {
                        "title": "Metodología",
                        "text": "Desarrollamos pipeline con: 1) Topic Modeling (LDA) para identificar temas, 2) Análisis de sentimientos para polaridad, 3) Embeddings para similitud semántica, 4) Network analysis para alianzas."
                    },
                    {
                        "title": "Dataset",
                        "text": "Recopilamos 50,000 discursos parlamentarios, 5,000 proyectos de ley, y 200,000 tweets de políticos de 10 países durante 5 años."
                    },
                    {
                        "title": "Hallazgos",
                        "text": "Identificamos aumento de polarización del 35% en década reciente. Los temas de clima y tecnología muestran mayor consenso transpartidario."
                    },
                    {
                        "title": "Aplicaciones",
                        "text": "Herramienta utilizada por medios de comunicación, ONGs y academia para análisis objetivo de tendencias políticas y evaluación de cumplimiento de promesas."
                    }
                ]
            },
            "subject_areas": ["Procesamiento de Lenguaje Natural", "Ciencia Política", "Análisis de Datos"],
            "source_title": "Political Analysis Journal",
            "publisher": "Cambridge University Press"
        },
        {
            "id": 12,
            "article_title": "Computer Vision para Monitoreo de Biodiversidad en Reservas Naturales",
            "abstract": "Sistema automatizado que utiliza cámaras trampa y drones con computer vision para monitorear especies animales y detectar amenazas en áreas protegidas.",
            "authors": ["Dr. Roberto Sánchez", "Biól. Laura Mendoza", "Ing. Carlos Herrera"],
            "keywords": ["computer_vision", "biodiversidad", "conservación", "drones", "monitoreo_ambiental"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "2234-5678",
            "coden": "CVBIO12",
            "doi": "10.1234/cv.bio.2024.012",
            "references": [
                {"id": 1, "reference_text": "Norouzzadeh, M. S. (2023). Automatically identifying, counting, and describing wild animals in camera-trap images with deep learning. Proceedings of the National Academy of Sciences, 115(25), E5716-E5725."},
                {"id": 2, "reference_text": "Koh, L. P. (2022). Conservation drones for monitoring biodiversity. Trends in Ecology & Evolution, 29(3), 153-154."}
            ],
            "coderence": "CONSERV2024L12",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0108",
            "publication_date": "2024-04-14",
            "cites_count": 95,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "El monitoreo manual de biodiversidad es costoso y limitado en cobertura. La automatización mediante computer vision permite monitoreo continuo y a gran escala."
                    },
                    {
                        "title": "Sistema Integrado",
                        "text": "Combinamos: 1) Cámaras trampa con detección en edge, 2) Drones para cobertura aérea, 3) Modelos YOLOv7 para detección de especies, 4) Sistema de alertas para amenazas."
                    },
                    {
                        "title": "Implementación",
                        "text": "Desplegamos 200 cámaras en reserva de 50,000 hectáreas. El sistema procesa 5,000 imágenes diarias, identificando 45 especies con 96% de precisión."
                    },
                    {
                        "title": "Resultados de Conservación",
                        "text": "Detección temprana de 12 eventos de caza furtiva, monitoreo de población de jaguares en peligro, y mapeo de corredores biológicos críticos."
                    },
                    {
                        "title": "Impacto",
                        "text": "Reducción de 75% en costos de monitoreo, datos en tiempo real para guardaparques, y herramienta científica para estudios de ecología y comportamiento animal."
                    }
                ]
            },
            "subject_areas": ["Computer Vision", "Biología de la Conservación", "Tecnología Ambiental"],
            "source_title": "Conservation Biology",
            "publisher": "Wiley"
        },
        {
            "id": 13,
            "article_title": "Federated Learning para Diagnóstico Médico Colaborativo entre Hospitales",
            "abstract": "Framework de federated learning que permite entrenar modelos de diagnóstico médico colaborativamente sin compartir datos sensibles entre instituciones.",
            "authors": ["Dra. Ana López", "Dr. Miguel Torres", "Ing. Sofía Ramírez"],
            "keywords": ["federated_learning", "privacidad_datos", "diagnóstico_médico", "colaboración", "seguridad"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "3345-6789",
            "coden": "FLMED13",
            "doi": "10.1234/fl.med.2024.013",
            "references": [
                {"id": 1, "reference_text": "Konečný, J. (2023). Federated Learning: Strategies for Improving Communication Efficiency. arXiv preprint arXiv:1610.05492."},
                {"id": 2, "reference_text": "Li, T. (2022). Federated Learning: Challenges, Methods, and Future Directions. IEEE Signal Processing Magazine, 37(3), 50-60."}
            ],
            "coderence": "FEDMED2024M13",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0109",
            "publication_date": "2024-06-05",
            "cites_count": 118,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "La colaboración entre hospitales mejora modelos de diagnóstico, pero las regulaciones de privacidad limitan el intercambio de datos médicos sensibles."
                    },
                    {
                        "title": "Arquitectura Federada",
                        "text": "Implementamos framework donde cada hospital entrena modelos localmente y solo comparte actualizaciones de parámetros, nunca datos crudos. Usamos differential privacy adicional."
                    },
                    {
                        "title": "Experimento Multi-institucional",
                        "text": "5 hospitales colaboraron en modelo de detección de cáncer de pulmón en CT scans. El modelo federado superó a modelos individuales en 15-25% de precisión."
                    },
                    {
                        "title": "Evaluación de Seguridad",
                        "text": "Auditoría externa confirmó imposibilidad de reconstruir datos originales desde actualizaciones compartidas. Cumple con GDPR y HIPAA."
                    },
                    {
                        "title": "Escalabilidad",
                        "text": "El framework soporta hasta 50 instituciones concurrentes. El overhead de comunicación es manejable con compresión y agregación eficiente."
                    }
                ]
            },
            "subject_areas": ["Federated Learning", "Privacidad de Datos", "Medicina"],
            "source_title": "Nature Medicine",
            "publisher": "Nature Research"
        },
        {
            "id": 14,
            "article_title": "Análisis de Grafos para Detección de Fraude Financiero en Tiempo Real",
            "abstract": "Sistema basado en teoría de grafos que analiza transacciones financieras en tiempo real para detectar patrones complejos de fraude y lavado de dinero.",
            "authors": ["Dr. Javier Mendoza", "Dra. Patricia Castro", "Lic. Ricardo López"],
            "keywords": ["análisis_grafos", "detección_fraude", "finanzas", "tiempo_real", "network_analysis"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "4456-7890",
            "coden": "GFRAD14",
            "doi": "10.1234/graph.fraud.2024.014",
            "references": [
                {"id": 1, "reference_text": "Newman, M. E. J. (2023). Networks: An Introduction. Oxford University Press."},
                {"id": 2, "reference_text": "Savage, D. (2022). Anomaly Detection in Financial Networks. ACM Computing Surveys, 55(1), 1-35."}
            ],
            "coderence": "FINFRA2024N14",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0110",
            "publication_date": "2024-01-30",
            "cites_count": 142,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "Los esquemas modernos de fraude financiero involucran redes complejas de transacciones que son difíciles de detectar con métodos tradicionales basados en reglas."
                    },
                    {
                        "title": "Metodología de Grafos",
                        "text": "Modelamos transacciones como grafo dinámico donde nodos son cuentas y aristas son transacciones. Aplicamos: Community detection, Centrality analysis, y Anomaly detection en subgrafos temporales."
                    },
                    {
                        "title": "Implementación",
                        "text": "Usamos Apache Flink para procesamiento en tiempo real y Neo4j para almacenamiento de grafos. El sistema procesa 1M+ transacciones/hora con latencia <100ms."
                    },
                    {
                        "title": "Resultados",
                        "text": "En banco con 5M clientes: detección de 3 redes de lavado previamente desconocidas, reducción de 40% en fraudes no detectados, y 85% menos falsos positivos vs sistemas legacy."
                    },
                    {
                        "title": "Aplicaciones Regulatorias",
                        "text": "El sistema ayuda a instituciones financieras a cumplir con regulaciones AML/CFT mediante monitoreo proactivo y reportes automáticos a autoridades."
                    }
                ]
            },
            "subject_areas": ["Análisis de Grafos", "Finanzas", "Detección de Anomalías"],
            "source_title": "Journal of Financial Crime",
            "publisher": "Emerald"
        },
        {
            "id": 15,
            "article_title": "Digital Twins para Gestión Inteligente de Ciudades",
            "abstract": "Plataforma de gemelos digitales que simula y optimiza operaciones urbanas en tiempo real, incluyendo tráfico, energía, residuos y servicios públicos.",
            "authors": ["Ing. Carlos Rodríguez", "Dra. Elena Martín", "Dr. Roberto Silva"],
            "keywords": ["digital_twins", "ciudades_inteligentes", "iot", "simulación", "gestión_urbana"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "5567-8901",
            "coden": "DTCIU15",
            "doi": "10.1234/dt.cities.2024.015",
            "references": [
                {"id": 1, "reference_text": "Grieves, M. (2023). Digital Twin: Manufacturing Excellence through Virtual Factory Replication. White Paper."},
                {"id": 2, "reference_text": "Batty, M. (2022). Digital twins. Environment and Planning B: Urban Analytics and City Science, 45(5), 817-820."}
            ],
            "coderence": "SMART2024O15",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0111",
            "publication_date": "2024-05-25",
            "cites_count": 176,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "La complejidad de las ciudades modernas requiere herramientas avanzadas para simulación y optimización que integren múltiples sistemas urbanos interdependientes."
                    },
                    {
                        "title": "Arquitectura del Gemelo Digital",
                        "text": "Desarrollamos plataforma que integra: 1) Datos en tiempo real de 10,000 sensores IoT, 2) Modelos de simulación multi-agente, 3) Dashboard de visualización 3D, 4) Módulo de optimización con reinforcement learning."
                    },
                    {
                        "title": "Casos de Uso",
                        "text": "Optimización de semáforos redujo congestión 25%, gestión predictiva de residuos ahorró 18% en costos, y simulación de emergencias mejoró respuesta 40%."
                    },
                    {
                        "title": "Implementación",
                        "text": "Desplegado en ciudad de 1.5M habitantes. La plataforma procesa 5TB diarios y proporciona 150 indicadores de desempeño urbano en tiempo real."
                    },
                    {
                        "title": "Gobernanza y Participación",
                        "text": "Interfaz ciudadana permite participación en planificación urbana. Los datos abiertos promueven transparencia y colaboración con academia y sector privado."
                    }
                ]
            },
            "subject_areas": ["Gemelos Digitales", "Ciudades Inteligentes", "Internet de las Cosas"],
            "source_title": "Sustainable Cities and Society",
            "publisher": "Elsevier"
        },
        {
            "id": 16,
            "article_title": "Redes Neuronales Convolucionales para Diagnóstico de Enfermedades Oculares",
            "abstract": "Sistema de deep learning que analiza imágenes de retina para detectar retinopatía diabética y glaucoma con precisión clínica.",
            "authors": ["Dra. María González", "Dr. Javier López", "Ing. Ana Martínez"],
            "keywords": ["deep_learning", "oftalmología", "retinopatía_diabética", "glaucoma", "diagnóstico_asistido"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "6678-9012",
            "coden": "DLOPH16",
            "doi": "10.1234/dl.oph.2024.016",
            "references": [
                {"id": 1, "reference_text": "Gulshan, V. (2023). Development and Validation of a Deep Learning Algorithm for Detection of Diabetic Retinopathy in Retinal Fundus Photographs. JAMA, 316(22), 2402-2410."},
                {"id": 2, "reference_text": "Ting, D. S. W. (2022). Artificial intelligence and deep learning in ophthalmology. British Journal of Ophthalmology, 103(2), 167-175."}
            ],
            "coderence": "OPHTHA2024P16",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0112",
            "publication_date": "2024-07-10",
            "cites_count": 134,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "Las enfermedades oculares como la retinopatía diabética son causas principales de ceguera evitable. El diagnóstico temprano mediante screening automatizado puede salvar la visión de millones."
                    },
                    {
                        "title": "Metodología",
                        "text": "Entrenamos una CNN en 100,000 imágenes de fondo de ojo etiquetadas por oftalmólogos. Utilizamos transfer learning con ResNet-152 y fine-tuning para adaptación específica."
                    },
                    {
                        "title": "Validación",
                        "text": "En dataset independiente de 15,000 imágenes, el modelo alcanzó 98.2% de sensibilidad y 96.8% de especificidad, superando a 4 de 5 oftalmólogos humanos en el estudio."
                    },
                    {
                        "title": "Implementación Clínica",
                        "text": "El sistema se implementó en 10 centros de salud primaria, permitiendo screening a población rural con acceso limitado a especialistas."
                    },
                    {
                        "title": "Impacto",
                        "text": "Detección temprana de 450 casos de retinopatía diabética en fase tratable. Reducción del 60% en referencia innecesaria a especialistas."
                    }
                ]
            },
            "subject_areas": ["Deep Learning", "Oftalmología", "Diagnóstico Médico"],
            "source_title": "Ophthalmology Journal",
            "publisher": "Elsevier"
        },
        {
            "id": 17,
            "article_title": "Algoritmos de Compresión de Datos para IoT de Bajo Consumo",
            "abstract": "Nuevos algoritmos de compresión lossless optimizados para dispositivos IoT con recursos computacionales y energéticos limitados.",
            "authors": ["Dr. Carlos Ruiz", "Ing. Laura Díaz", "Dr. Miguel Sánchez"],
            "keywords": ["compresión_datos", "iot", "eficiencia_energética", "edge_computing", "algoritmos"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "7789-0123",
            "coden": "COMPI17",
            "doi": "10.1234/comp.iot.2024.017",
            "references": [
                {"id": 1, "reference_text": "Ziv, J. (2023). A universal algorithm for sequential data compression. IEEE Transactions on Information Theory, 23(3), 337-343."},
                {"id": 2, "reference_text": "Wang, Y. (2022). Energy-efficient data compression for IoT devices. IEEE Internet of Things Journal, 9(4), 2456-2468."}
            ],
            "coderence": "IOTCOM2024Q17",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0113",
            "publication_date": "2024-08-15",
            "cites_count": 89,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "Los dispositivos IoT generan grandes volúmenes de datos pero tienen limitaciones severas de energía y ancho de banda. La compresión eficiente es esencial para su viabilidad."
                    },
                    {
                        "title": "Algoritmo Propuesto",
                        "text": "Desarrollamos LZ-Adaptive, variante de Lempel-Ziv optimizada para sensores IoT. Incluye predicción contextual y codificación adaptativa basada en patrones de datos de sensores."
                    },
                    {
                        "title": "Evaluación",
                        "text": "Comparado con gzip y LZ4, nuestro algoritmo reduce 45% el consumo energético manteniendo tasas de compresión similares. Eficiente en microcontroladores ARM Cortex-M0+."
                    },
                    {
                        "title": "Aplicaciones",
                        "text": "Implementado en redes de sensores ambientales, wearables médicos y agricultura de precisión. Extiende vida de batería de 30 días a 45 días en casos típicos."
                    },
                    {
                        "title": "Futuro",
                        "text": "Trabajamos en versión hardware del algoritmo para mayor eficiencia energética e integración directa en chips IoT."
                    }
                ]
            },
            "subject_areas": ["Compresión de Datos", "Internet de las Cosas", "Algoritmos"],
            "source_title": "IEEE Internet of Things Journal",
            "publisher": "IEEE"
        },
        {
            "id": 18,
            "article_title": "Sistemas Multiagente para Gestión de Tráfico Urbano Inteligente",
            "abstract": "Arquitectura multiagente que optimiza flujo vehicular mediante coordinación descentralizada de semáforos y gestión dinámica de carriles.",
            "authors": ["Dr. Andrés Morales", "Ing. Patricia López", "Dra. Carmen Ruiz"],
            "keywords": ["sistemas_multiagente", "tráfico_urbano", "optimización", "movilidad", "ciudades_inteligentes"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "8890-1234",
            "coden": "SMATR18",
            "doi": "10.1234/sma.traffic.2024.018",
            "references": [
                {"id": 1, "reference_text": "Wooldridge, M. (2023). An Introduction to MultiAgent Systems. John Wiley & Sons."},
                {"id": 2, "reference_text": "Chen, B. (2022). Intelligent traffic control using multi-agent reinforcement learning. Transportation Research Part C, 124, 102893."}
            ],
            "coderence": "TRAFFI2024R18",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0114",
            "publication_date": "2024-09-05",
            "cites_count": 112,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "La congestión vehicular en ciudades causa pérdidas económicas masivas y contaminación. Enfoques centralizados son incapaces de manejar la complejidad del tráfico en tiempo real."
                    },
                    {
                        "title": "Arquitectura Multiagente",
                        "text": "Cada intersección es controlada por un agente autónomo que negocia con agentes vecinos. Los agentes de vehículos comunican destinos para routing predictivo."
                    },
                    {
                        "title": "Algoritmo de Coordinación",
                        "text": "Usamos Q-learning multiagente con transferencia de conocimiento entre agentes. Cada agente aprende políticas óptimas basadas en tráfico local y global."
                    },
                    {
                        "title": "Simulaciones",
                        "text": "En simulación de ciudad de 500 intersecciones, redujimos tiempo promedio de viaje en 32% y emisiones CO2 en 18% vs sistemas tradicionales."
                    },
                    {
                        "title": "Despliegue Piloto",
                        "text": "Implementado en distrito de 25 intersecciones. Resultados preliminares muestran 25% reducción congestión en horas pico y 40% menos paradas por vehículo."
                    }
                ]
            },
            "subject_areas": ["Sistemas Multiagente", "Transporte", "Inteligencia Artificial"],
            "source_title": "Transportation Research Part C",
            "publisher": "Elsevier"
        },
        {
            "id": 19,
            "article_title": "Machine Learning para Predicción de Fallas en Turbinas Eólicas",
            "abstract": "Sistema predictivo que combina datos SCADA y vibración para anticipar fallas en componentes críticos de turbinas eólicas, reduciendo downtime.",
            "authors": ["Ing. Roberto Castro", "Dra. Elena Mendoza", "Dr. Carlos Ortega"],
            "keywords": ["predictive_maintenance", "energía_eólica", "machine_learning", "análisis_vibraciones", "SCADA"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "9901-2345",
            "coden": "MLWIND19",
            "doi": "10.1234/ml.wind.2024.019",
            "references": [
                {"id": 1, "reference_text": "Tchakoua, P. (2023). A review of concepts and methods for wind turbines condition monitoring. Wind Energy, 22(4), 465-495."},
                {"id": 2, "reference_text": "Lei, Y. (2022). Machinery health prognostics: A systematic review from data acquisition to RUL prediction. Mechanical Systems and Signal Processing, 104, 799-834."}
            ],
            "coderence": "WINDPR2024S19",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0115",
            "publication_date": "2024-10-12",
            "cites_count": 156,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "Las fallas en turbinas eólicas causan downtime costoso y pérdida de producción energética. El mantenimiento predictivo puede anticipar problemas semanas antes de la falla catastrófica."
                    },
                    {
                        "title": "Metodología",
                        "text": "Combinamos 150 parámetros SCADA con datos de vibración de 20 sensores por turbina. Usamos XGBoost para clasificación y LSTM para predicción de RUL (Remaining Useful Life)."
                    },
                    {
                        "title": "Dataset",
                        "text": "Datos de 200 turbinas durante 5 años, incluyendo 45 fallas documentadas de rodamientos, engranajes y palas. Total de 2.5TB de datos temporales."
                    },
                    {
                        "title": "Resultados",
                        "text": "El sistema predice fallas de rodamientos con 94% de precisión y 30 días de anticipación. Falsos positivos reducidos a 3% mediante ensemble de modelos."
                    },
                    {
                        "title": "Impacto Económico",
                        "text": "Implementación en parque eólico de 50 turbinas: ahorro estimado de $2.5M anuales por reducción de downtime y mantenimiento preventivo optimizado."
                    }
                ]
            },
            "subject_areas": ["Machine Learning", "Energía Eólica", "Mantenimiento Predictivo"],
            "source_title": "Renewable Energy Focus",
            "publisher": "Elsevier"
        },
        {
            "id": 20,
            "article_title": "Blockchain para Trazabilidad de Cadena Alimentaria",
            "abstract": "Sistema blockchain que garantiza trazabilidad completa desde productor hasta consumidor en cadena de suministro alimentario, mejorando seguridad y transparencia.",
            "authors": ["Dra. Sofía Herrera", "Ing. Javier Ramírez", "Dr. Antonio López"],
            "keywords": ["blockchain", "trazabilidad", "cadena_alimentaria", "seguridad_alimentaria", "supply_chain"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "1012-3456",
            "coden": "BLFOOD20",
            "doi": "10.1234/block.food.2024.020",
            "references": [
                {"id": 1, "reference_text": "Tian, F. (2023). A blockchain-based food supply chain traceability system. Business Process Management Journal, 26(5), 1257-1274."},
                {"id": 2, "reference_text": "Kamilaris, A. (2022). The rise of blockchain technology in agriculture and food supply chains. Trends in Food Science & Technology, 91, 640-652."}
            ],
            "coderence": "FOODTR2024T20",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0116",
            "publication_date": "2024-11-08",
            "cites_count": 178,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "Los recientes escándalos de seguridad alimentaria demuestran la necesidad de sistemas de trazabilidad confiables e inmutables. Blockchain ofrece solución ideal para este problema."
                    },
                    {
                        "title": "Arquitectura",
                        "text": "Implementamos blockchain permissioned con Hyperledger Fabric. Cada participante (agricultor, procesador, distribuidor, minorista) tiene nodo validador. IoT sensors capturan datos automáticamente."
                    },
                    {
                        "title": "Protocolo de Consenso",
                        "text": "Practical Byzantine Fault Tolerance (PBFT) optimizado para alta throughput (1000+ transacciones/segundo) con latencia menor a 2 segundos."
                    },
                    {
                        "title": "Caso de Estudio",
                        "text": "Implementado en cadena de suministro de carne vacuna. Tiempo de trazabilidad reducido de 7 días a 2 segundos. Detección inmediata de lote contaminado en prueba controlada."
                    },
                    {
                        "title": "Adopción",
                        "text": "15 empresas alimentarias ya utilizan el sistema. Certificación orgánica automatizada y reducción de 85% en reclamos por calidad."
                    }
                ]
            },
            "subject_areas": ["Blockchain", "Seguridad Alimentaria", "Trazabilidad"],
            "source_title": "Food Control",
            "publisher": "Elsevier"
        },
        {
            "id": 21,
            "article_title": "Computer Vision para Inspección Automatizada de Calidad en Manufactura",
            "abstract": "Sistema de visión artificial que detecta defectos en piezas manufacturadas con precisión superior a inspectores humanos, operando en líneas de producción en tiempo real.",
            "authors": ["Ing. Carlos Díaz", "Dra. Laura Martínez", "Dr. Ricardo Sánchez"],
            "keywords": ["computer_vision", "control_calidad", "manufactura", "detección_defectos", "automation"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "1123-4567",
            "coden": "CVQUAL21",
            "doi": "10.1234/cv.qual.2024.021",
            "references": [
                {"id": 1, "reference_text": "Wang, J. (2023). Deep learning for smart manufacturing: Methods and applications. Journal of Manufacturing Systems, 48, 144-156."},
                {"id": 2, "reference_text": "Luo, Q. (2022). A survey of surface defect inspection methods based on deep learning. Acta Automatica Sinica, 48(1), 1-18."}
            ],
            "coderence": "QUALCV2024U21",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0117",
            "publication_date": "2024-12-15",
            "cites_count": 203,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "La inspección visual manual en manufactura es costosa, subjetiva y propensa a errores. La automatización mediante computer vision mejora calidad y reduce costos."
                    },
                    {
                        "title": "Sistema Desarrollado",
                        "text": "Arquitectura con múltiples cámaras de alta resolución, iluminación controlada y modelo YOLOv5 customizado. Procesamiento a 120 frames/segundo en GPU edge."
                    },
                    {
                        "title": "Tipos de Defectos",
                        "text": "Detecta 15 categorías de defectos: rayaduras, abolladuras, descoloramiento, inclusiones, porosidad, dimensiones fuera de tolerancia, etc."
                    },
                    {
                        "title": "Rendimiento",
                        "text": "Precisión: 99.7%, Recall: 98.9%, F1-score: 99.3%. Supera a inspectores humanos que promedian 92% de precisión con fatiga decreciente."
                    },
                    {
                        "title": "ROI",
                        "text": "En fábrica de componentes automotrices: retorno de inversión en 8 meses, reducción de 95% en productos defectuosos enviados a cliente."
                    }
                ]
            },
            "subject_areas": ["Computer Vision", "Manufactura", "Control de Calidad"],
            "source_title": "Journal of Manufacturing Systems",
            "publisher": "Elsevier"
        },
        {
            "id": 22,
            "article_title": "Análisis de Datos Genómicos para Medicina Personalizada",
            "abstract": "Pipeline de análisis que integra datos genómicos, transcriptómicos y clínicos para predecir respuesta a tratamientos y riesgo de enfermedades.",
            "authors": ["Dra. Ana Rodríguez", "Dr. Miguel Castro", "Bioinf. Laura Hernández"],
            "keywords": ["bioinformática", "genómica", "medicina_personalizada", "análisis_genético", "salud_precision"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "2234-5678",
            "coden": "GENMED22",
            "doi": "10.1234/gen.med.2024.022",
            "references": [
                {"id": 1, "reference_text": "Collins, F. S. (2023). The Human Genome Project: lessons from large-scale biology. Science, 300(5617), 286-290."},
                {"id": 2, "reference_text": "Hasin, Y. (2022). Multi-omics approaches to disease. Genome Biology, 18(1), 1-15."}
            ],
            "coderence": "GENOMI2024V22",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0118",
            "publication_date": "2024-01-20",
            "cites_count": 267,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "La medicina personalizada utiliza información genética para adaptar tratamientos a características individuales del paciente, mejorando eficacia y reduciendo efectos secundarios."
                    },
                    {
                        "title": "Metodología",
                        "text": "Desarrollamos pipeline que integra: secuenciación WGS, RNA-seq, datos clínicos EMR. Usamos ML para identificar biomarkers predictivos y agrupar pacientes por subtipos moleculares."
                    },
                    {
                        "title": "Aplicación en Oncología",
                        "text": "Analizamos 2,000 pacientes con cáncer. Identificamos 15 firmas genéticas predictivas de respuesta a inmunoterapia. Precisión de 89% en predicción de supervivencia."
                    },
                    {
                        "title": "Implementación Clínica",
                        "text": "Sistema utilizado en 5 hospitales para guiar decisiones de tratamiento en cáncer de pulmón, mama y colon. Reducción de 35% en tratamientos inefectivos."
                    },
                    {
                        "title": "Desafíos Éticos",
                        "text": "Desarrollamos framework para consentimiento informado dinámico y gestión segura de datos genéticos sensibles, cumpliendo GDPR y HIPAA."
                    }
                ]
            },
            "subject_areas": ["Bioinformática", "Genómica", "Medicina Personalizada"],
            "source_title": "Nature Medicine",
            "publisher": "Nature Research"
        },
        {
            "id": 23,
            "article_title": "Reinforcement Learning para Control de Procesos Industriales",
            "abstract": "Aplicación de deep reinforcement learning para control óptimo de procesos químicos complejos, superando a controladores PID tradicionales.",
            "authors": ["Ing. Jorge Martínez", "Dr. Carlos Ruiz", "Dra. Elena López"],
            "keywords": ["reinforcement_learning", "control_procesos", "industria_química", "automatización", "IA_industrial"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "3345-6789",
            "coden": "RLIND23",
            "doi": "10.1234/rl.ind.2024.023",
            "references": [
                {"id": 1, "reference_text": "Sutton, R. S. (2023). Reinforcement Learning: An Introduction. MIT Press."},
                {"id": 2, "reference_text": "Shin, J. (2022). Process control with deep reinforcement learning. Industrial & Engineering Chemistry Research, 59(24), 11235-11249."}
            ],
            "coderence": "INDCON2024W23",
            "chemical_name": "C6H12O6",
            "cas_number": "50-99-7",
            "orcid": "0000-0002-1825-0119",
            "publication_date": "2024-02-14",
            "cites_count": 145,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "Los procesos químicos industriales son altamente no lineales y multivariables. Los controladores PID tradicionales no alcanzan optimalidad en condiciones dinámicas."
                    },
                    {
                        "title": "Algoritmo Propuesto",
                        "text": "Deep Deterministic Policy Gradient (DDPG) adaptado para entornos industriales. Incluye safety constraints y transfer learning entre procesos similares."
                    },
                    {
                        "title": "Aplicación en Reactor Químico",
                        "text": "Control de temperatura, presión y flujos en reactor de polimerización. El agente DRL mantiene parámetros dentro de rango óptimo con 68% menos variación que PID."
                    },
                    {
                        "title": "Resultados",
                        "text": "Aumento de 12% en yield del producto, reducción de 25% en consumo energético, y 40% menos productos fuera de especificación."
                    },
                    {
                        "title": "Robustez",
                        "text": "El sistema maneja perturbaciones y cambios en materias primas mejor que controladores adaptativos tradicionales. Auto-calibración en 15 minutos vs 8 horas manuales."
                    }
                ]
            },
            "subject_areas": ["Reinforcement Learning", "Control de Procesos", "Industria Química"],
            "source_title": "Industrial & Engineering Chemistry Research",
            "publisher": "ACS"
        },
        {
            "id": 24,
            "article_title": "NLP para Análisis de Satisfacción Cliente en Grandes Volúmenes de Texto",
            "abstract": "Sistema que procesa automáticamente reseñas, quejas y comentarios de clientes para identificar tendencias, sentimientos y áreas de mejora.",
            "authors": ["Dra. Patricia Morales", "Lic. David Herrera", "Dr. Roberto Díaz"],
            "keywords": ["nlp", "satisfacción_cliente", "análisis_sentimientos", "text_mining", "CX"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "4456-7890",
            "coden": "NLPCUS24",
            "doi": "10.1234/nlp.cx.2024.024",
            "references": [
                {"id": 1, "reference_text": "Liu, B. (2023). Sentiment Analysis: Mining Opinions, Sentiments, and Emotions. Cambridge University Press."},
                {"id": 2, "reference_text": "Hutto, C. J. (2022). VADER: A Parsimonious Rule-Based Model for Sentiment Analysis of Social Media Text. Proceedings of ICWSM, 8(1), 216-225."}
            ],
            "coderence": "CUSTEX2024X24",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0120",
            "publication_date": "2024-03-18",
            "cites_count": 98,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "Las empresas reciben millones de comentarios de clientes en múltiples canales. El análisis manual es imposible, perdiéndose insights valiosos para mejorar productos y servicios."
                    },
                    {
                        "title": "Arquitectura",
                        "text": "Pipeline que procesa texto de reseñas, emails, redes sociales y surveys. Incluye: limpieza de texto, análisis de sentimientos, topic modeling, extracción de aspectos y detección de urgencia."
                    },
                    {
                        "title": "Modelos",
                        "text": "BERT fine-tuned para español con dataset de 500,000 reseñas etiquetadas. Precisión de 94% en clasificación de sentimiento y 89% en identificación de temas."
                    },
                    {
                        "title": "Dashboard Ejecutivo",
                        "text": "Visualización en tiempo real de NPS, tendencias de quejas, temas emergentes y alertas tempranas de crisis de reputación."
                    },
                    {
                        "title": "Caso de Éxito",
                        "text": "En retail, identificamos problema con nuevo empaque que causaba 23% de quejas. Corrección rápida ahorró $2.3M en pérdidas potenciales."
                    }
                ]
            },
            "subject_areas": ["Procesamiento de Lenguaje Natural", "Marketing", "Experiencia de Cliente"],
            "source_title": "Journal of Consumer Research",
            "publisher": "Oxford University Press"
        },
        {
            "id": 25,
            "article_title": "Computación en la Nube para Análisis Científico a Gran Escala",
            "abstract": "Arquitectura cloud-native que permite ejecutar simulaciones científicas y análisis de big data usando recursos escalables bajo demanda.",
            "authors": ["Ing. Ricardo Castro", "Dr. Laura Mendoza", "Ing. Carlos Ortega"],
            "keywords": ["cloud_computing", "HPC", "big_data", "escalabilidad", "computación_científica"],
            "institution": random.choice(institutions),
            "funding": random.choice(fundings),
            "language": "Español",
            "issn": "5567-8901",
            "coden": "CLOUD25",
            "doi": "10.1234/cloud.sci.2024.025",
            "references": [
                {"id": 1, "reference_text": "Armbrust, M. (2023). A view of cloud computing. Communications of the ACM, 53(4), 50-58."},
                {"id": 2, "reference_text": "Foster, I. (2022). Cloud computing and grid computing 360-degree compared. Grid Computing Environments Workshop, 1-10."}
            ],
            "coderence": "CLOUDC2024Y25",
            "chemical_name": "N/A",
            "cas_number": "N/A",
            "orcid": "0000-0002-1825-0121",
            "publication_date": "2024-04-22",
            "cites_count": 167,
            "document_type": "Artículo de investigación",
            "content": {
                "sections": [
                    {
                        "title": "Introducción",
                        "text": "La investigación científica moderna requiere capacidades computacionales masivas que superan los recursos de centros de datos tradicionales. La nube ofrece escalabilidad ilimitada bajo demanda."
                    },
                    {
                        "title": "Arquitectura",
                        "text": "Kubernetes + Apache Spark + Dask en AWS/Azure. Auto-scaling desde 10 a 10,000 cores según carga. Storage distribuido con S3 para petabytes de datos."
                    },
                    {
                        "title": "Optimización de Costos",
                        "text": "Algoritmo que mezcla spot instances, reserved instances y on-demand para minimizar costos manteniendo performance. Ahorro promedio de 65% vs HPC tradicional."
                    },
                    {
                        "title": "Casos de Uso",
                        "text": "Simulación climática (100TB de datos), análisis genómico (1M de genomas), modelado de materiales (10,000 estructuras simultáneas)."
                    },
                    {
                        "title": "Impacto en Investigación",
                        "text": "Democratiza acceso a supercomputación. Pequeñas universidades y startups pueden ejecutar proyectos que antes requerían inversiones millonarias en infraestructura."
                    }
                ]
            },
            "subject_areas": ["Computación en la Nube", "HPC", "Big Data"],
            "source_title": "Future Generation Computer Systems",
            "publisher": "Elsevier"
        }
    ]
    
    logger.info(f"✅ Creados {len(sample_docs)} documentos de ejemplo diferentes y estructurados")
    return sample_docs

def add_sample_documents(collection):
    """Agrega documentos de ejemplo a la colección ChromaDB"""
    sample_docs = create_sample_documents()
    
    logger.info(f"📝 Agregando {len(sample_docs)} documentos de ejemplo a ChromaDB...")
    
    documents = []
    metadatas = []
    ids = []
    
    for doc in sample_docs:
        # Generar texto para embeddings combinando campos relevantes
        embedding_text = (
            f"Title: {doc['article_title']}. "
            f"Abstract: {doc['abstract']}. "
            f"Keywords: {', '.join(doc['keywords'])}. "
            f"Subject Areas: {', '.join(doc['subject_areas'])}. "
            f"Content: {' '.join([section['text'] for section in doc['content']['sections']])}"
        )
        
        # Crear metadata COMPLETA con todos los campos
        metadata = {
            'title': doc['article_title'],
            'abstract': doc.get('abstract', ''),
            'authors': json.dumps(doc.get('authors', [])),
            'publication_date': str(doc.get('publication_date', '')),
            'document_type': doc.get('document_type', ''),
            'source_title': doc.get('source_title', ''),
            'cites_count': doc.get('cites_count', 0),
            'year': doc.get('publication_date', '')[:4] if doc.get('publication_date') else '',
            'has_abstract': bool(doc.get('abstract')),
            'subject_areas': json.dumps(doc.get('subject_areas', [])),
            'keywords': json.dumps(doc.get('keywords', [])),
            'publisher': doc.get('publisher', ''),
            'institution': json.dumps(doc.get('institution', {})),
            'funding': json.dumps(doc.get('funding', {})),
            'references': json.dumps(doc.get('references', [])),
            'content': json.dumps(doc.get('content', {})),
            'language': doc.get('language', 'Español'),
            'issn': doc.get('issn', ''),
            'coden': doc.get('coden', ''),
            'doi': doc.get('doi', ''),
            'orcid': doc.get('orcid', ''),
            'chemical_name': doc.get('chemical_name', 'N/A'),
            'cas_number': doc.get('cas_number', 'N/A'),
            'coderence': doc.get('coderence', '')
        }
        
        documents.append(embedding_text)
        metadatas.append(metadata)
        ids.append(str(doc['id']))
    
    # Agregar todos los documentos de una vez
    try:
        collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        logger.info(f"✅ {len(sample_docs)} documentos de ejemplo agregados exitosamente a ChromaDB")
        
        # Verificar que se guardaron todos los metadatos
        for i, doc in enumerate(sample_docs):
            stored_doc = collection.get(ids=[str(doc['id'])], include=['metadatas'])
            if stored_doc['metadatas']:
                stored_metadata = stored_doc['metadatas'][0]
                logger.debug(f"📄 Documento {doc['id']} - Metadatos guardados: {list(stored_metadata.keys())}")
        
        return True
    except Exception as e:
        logger.error(f"❌ Error agregando documentos a ChromaDB: {str(e)}")
        return False


# El resto del código (initialize_chroma y main) permanece igual
def initialize_chroma():
    max_retries = 10
    retry_delay = 5
    
    # Verificar que el symlink funciona
    if os.path.islink('/root/.cache/chroma'):
        link_target = os.readlink('/root/.cache/chroma')
        logger.info(f"✅ Symlink activo: /root/.cache/chroma -> {link_target}")
    
    # Verificar si el modelo está disponible
    model_path = '/shared_model_cache/onnx_models/all-MiniLM-L6-v2/onnx.tar.gz'
    if os.path.exists(model_path):
        logger.info(f"✅ Modelo pre-descargado encontrado en cache compartido")
    else:
        logger.warning(f"⚠️ Modelo no encontrado en cache compartido, se descargará automáticamente")
    
    for attempt in range(max_retries):
        try:
            logger.info(f"🔄 Intentando conectar con ChromaDB (Intento {attempt + 1}/{max_retries})...")
            
            chroma_client = chromadb.HttpClient(
                host=os.getenv('CHROMA_HOST', 'chromadb'),
                port=int(os.getenv('CHROMA_PORT', 8000))
            )
            
            heartbeat = chroma_client.heartbeat()
            logger.info(f"✅ Heartbeat recibido: {heartbeat}")
            
            # Crear o obtener la colección
            collection_name = "research_documents"
            
            # SIEMPRE eliminar la colección existente y crear una nueva
            try:
                chroma_client.delete_collection(collection_name)
                logger.info(f"🗑️ Colección '{collection_name}' eliminada")
            except Exception as e:
                logger.info(f"ℹ️ No existía la colección '{collection_name}' para eliminar: {e}")
            
            # Crear nueva colección
            collection = chroma_client.create_collection(
                name=collection_name,
                metadata={
                    "description": "Research documents and papers",
                    "embedding_model": "all-MiniLM-L6-v2 (default)"
                }
            )
            logger.info(f"✅ Colección '{collection_name}' creada exitosamente")
            
            # Agregar documentos
            success = add_sample_documents(collection)
            if not success:
                logger.warning("⚠️ No se pudieron agregar documentos de ejemplo")
            
            # Verificar el resultado
            final_count = collection.count()
            logger.info(f"📊 Colección finalizada con {final_count} documentos")
            
            logger.info("🎉 ChromaDB inicializado y funcionando correctamente")
            return True
            
        except Exception as e:
            logger.warning(f"⚠️ Intento {attempt + 1} falló: {str(e)}")
            if attempt < max_retries - 1:
                logger.info(f"⏳ Reintentando en {retry_delay} segundos...")
                time.sleep(retry_delay)
            else:
                logger.error(f"❌ Todos los intentos fallaron: {str(e)}")
                return False
    
    return False

if __name__ == "__main__":
    logger.info("🚀 Iniciando inicialización de ChromaDB...")
    success = initialize_chroma()
    if success:
        logger.info("🎉 Inicialización de ChromaDB completada exitosamente")
        exit(0)
    else:
        logger.error("💥 Inicialización de ChromaDB falló")
        exit(1)