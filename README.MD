## Opción 1: Base de datos distribuida para una tienda en línea con alta demanda
- **Contexto**: Un e-commerce regional tiene problemas de lentitud y caídas de servicio en eventos	
de alto tráfico (Black Friday, lanzamientos). El sistema actual usa MySQL/PostgreSQL en un solo
servidor.
- **Reto**: Proponer una arquitectura con una base de datos moderna que mejore escalabilidad,
alta disponibilidad y tiempos de respuesta. Puede incluir Redis, MongoDB o Cassandra.
- **Componentes esperados**:
    * Comparación técnica entre el sistema actual y el propuesto
    * Modelo de datos actualizado (relacional y/o NoSQL)
    * Simulación de carga o diseño para escalabilidad
    * Despliegue parcial en una nube (Firebase, AWS, etc.)
- **Tecnologías**:
    * Utilizar java para el backend
    * Utilizar spring boot para el framework
    * Utilizar redis, mongodb y cassandra
    * Utilizar firebase para el despliegue parcial en la nube
- **Flujo de trabajo**:
    * Crear modelo relacional del sistema actual de la tienda (Mercado Libre, eBay, Amazon tipo de tienda)
    * Crear modelo NoSQL (MongoDB) para almacenar datos de productos, usuarios y transacciones.
    * Utilizar Redis para caché de productos y sesiones de usuario.
    * Utilizar Cassandra para almacenar datos de transacciones y análisis.
    * Utilizar Firebase para el despliegue parcial en la nube.
- **Lógica de Negocio**:
    * Modulo de productos (scroll infinito)
        * Categorias, Ofertas, favoritos, recien vistos, recomendaciones, comentarios
    * Módulo usurio (CRUD)
        * Carrito, Compras, Historial, Vender, Ventas
    * Pasarela de pago.
