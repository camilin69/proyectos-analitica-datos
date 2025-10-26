-- Usar la base de datos
USE scopus_db;

-- Insertar instituciones
INSERT IGNORE INTO institutions (id, name, city, country) VALUES
(1, 'Universidad Pedagógica y Tecnológica de Colombia', 'Tunja', 'Colombia'),
(2, 'Universidad Nacional de Colombia', 'Bogotá', 'Colombia'),
(3, 'Universidad de los Andes', 'Bogotá', 'Colombia'),
(4, 'Massachusetts Institute of Technology (MIT)', 'Cambridge', 'USA'),
(5, 'Stanford University', 'California', 'USA');