-- inserts.sql
-- Datos de ejemplo para empresas recién registradas y productos disponibles

-- Primero, insertar las categorías específicas
INSERT INTO categories (name, description) VALUES 
('supermarket', 'Supermercado y productos de consumo'),
('tech', 'Tecnología y electrónica'),
('pharmacy', 'Farmacia y productos de salud'),
('electronics', 'Electrodomésticos y línea blanca'),
('home', 'Hogar, muebles y fitness'),
('beauty', 'Belleza y cuidado personal'),
('toys', 'Juegos y juguetes'),
('automotive', 'Accesorios para vehículos')
ON CONFLICT (name) DO NOTHING;

-- Insertar usuarios/vendedores (2 por cada categoría)
INSERT INTO users (name, email, cedula, phone, password, avatar_url, bio, rating, total_sales, is_verified, address, social_links) VALUES
-- Categoría: Supermercado (2 usuarios)
(
    'SuperMarket Express',
    'ventas@supermarketexpress.co',
    '12345678901',
    '+57 1 2345678',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=150&h=150&fit=crop&crop=face',
    'Tu supermercado de confianza con los mejores precios y calidad garantizada.',
    0.0,
    0,
    true,
    '{"street": "Calle 100 #15-20", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110111", "country": "Colombia"}',
    '{"website": "https://supermarketexpress.co", "facebook": "supermarketexpress"}'
),
(
    'Mercado Fresco',
    'info@mercadofresco.co',
    '12345678902',
    '+57 1 2345679',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'Productos frescos y de calidad directo a tu hogar. La mejor selección alimenticia.',
    0.0,
    0,
    true,
    '{"street": "Carrera 15 #85-25", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110221", "country": "Colombia"}',
    '{"website": "https://mercadofresco.co", "instagram": "mercadofresco_co"}'
),

-- Categoría: Tecnología (2 usuarios)
(
    'TecnoShop Colombia',
    'ventas@tecnoshop.co',
    '12345678903',
    '+57 1 3456789',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=150&h=150&fit=crop&crop=face',
    'Tu tienda de confianza para tecnología de última generación. Especialistas en smartphones, laptops y gadgets.',
    0.0,
    0,
    true,
    '{"street": "Calle 72 #12-45", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110311", "country": "Colombia"}',
    '{"website": "https://tecnoshop.co", "facebook": "tecnoshopcol", "instagram": "tecnoshop_col"}'
),
(
    'Digital World',
    'contacto@digitalworld.co',
    '12345678904',
    '+57 1 3456790',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'Lo último en tecnología y gadgets. Innovación y calidad en cada producto.',
    0.0,
    0,
    true,
    '{"street": "Carrera 7 #40-50", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110321", "country": "Colombia"}',
    '{"website": "https://digitalworld.co", "instagram": "digitalworld_co"}'
),

-- Categoría: Farmacia (2 usuarios)
(
    'FarmaSalud Total',
    'ventas@farmaciasalud.co',
    '12345678905',
    '+57 1 4567890',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    'Tu farmacia de confianza con los mejores productos para tu salud y bienestar.',
    0.0,
    0,
    true,
    '{"street": "Calle 85 #15-30", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110221", "country": "Colombia"}',
    '{"website": "https://farmaciasalud.co", "facebook": "farmaciasalud"}'
),
(
    'MediCare Express',
    'info@medicareexpress.co',
    '12345678906',
    '+57 1 4567891',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    'Cuidamos de tu salud con productos farmacéuticos de calidad y asesoramiento profesional.',
    0.0,
    0,
    true,
    '{"street": "Carrera 11 #93-40", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110231", "country": "Colombia"}',
    '{"website": "https://medicareexpress.co", "instagram": "medicareexpress_co"}'
),

-- Categoría: Electrodomésticos (2 usuarios)
(
    'ElectroHogar Premium',
    'ventas@electrohogar.co',
    '12345678907',
    '+57 1 5678901',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=150&h=150&fit=crop&crop=face',
    'Los mejores electrodomésticos para tu hogar. Calidad, eficiencia y garantía.',
    0.0,
    0,
    true,
    '{"street": "Calle 53 #14-65", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110311", "country": "Colombia"}',
    '{"website": "https://electrohogar.co", "facebook": "electrohogar"}'
),
(
    'Casa Inteligente',
    'contacto@casainteligente.co',
    '12345678908',
    '+57 1 5678902',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'Hacemos tu hogar más inteligente con electrodomésticos de última generación.',
    0.0,
    0,
    true,
    '{"street": "Carrera 45 #26-85", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110321", "country": "Colombia"}',
    '{"website": "https://casainteligente.co", "instagram": "casainteligente_co"}'
),

-- Categoría: Hogar y Fitness (2 usuarios)
(
    'Hogar y Vida Sana',
    'ventas@hogaryvida.co',
    '12345678909',
    '+57 1 6789012',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    'Todo para tu hogar y tu bienestar. Muebles, decoración y equipos fitness.',
    0.0,
    0,
    true,
    '{"street": "Calle 142 #15-70", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110141", "country": "Colombia"}',
    '{"website": "https://hogaryvida.co", "facebook": "hogaryvida"}'
),
(
    'Fitness Home',
    'info@fitnesshome.co',
    '12345678910',
    '+57 1 6789013',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    'Equipos fitness y artículos para hogar. Calidad y diseño en cada producto.',
    0.0,
    0,
    true,
    '{"street": "Carrera 19 #124-35", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110131", "country": "Colombia"}',
    '{"website": "https://fitnesshome.co", "instagram": "fitnesshome_co"}'
),

-- Categoría: Belleza y Cuidado Personal (2 usuarios)
(
    'BeautyLab Colombia',
    'hola@beautylab.co',
    '12345678911',
    '+57 1 7890123',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1596075780740-95f43d1a026c?w=150&h=150&fit=crop&crop=face',
    'Productos de belleza y cuidado personal. Marcas reconocidas y productos naturales.',
    0.0,
    0,
    true,
    '{"street": "Carrera 37 #8-43", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110321", "country": "Colombia"}',
    '{"website": "https://beautylab.co", "instagram": "beautylab_col"}'
),
(
    'Glamour Shop',
    'contacto@glamourshop.co',
    '12345678912',
    '+57 1 7890124',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    'Todo en belleza y cuidado personal. Productos premium y asesoría especializada.',
    0.0,
    0,
    true,
    '{"street": "Calle 82 #11-25", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110221", "country": "Colombia"}',
    '{"website": "https://glamourshop.co", "instagram": "glamourshop_co"}'
),

-- Categoría: Juegos y Juguetes (2 usuarios)
(
    'MundoJuguete',
    'info@mundojuguete.co',
    '12345678913',
    '+57 1 8901234',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1534452203293-4945fdd95353?w=150&h=150&fit=crop&crop=face',
    'Juguetes educativos y de entretenimiento para todas las edades. Calidad y diversión garantizada.',
    0.0,
    0,
    true,
    '{"street": "Calle 72 #23-15", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110311", "country": "Colombia"}',
    '{"website": "https://mundojuguete.co", "facebook": "mundojuguete"}'
),
(
    'Juguetes Educativos CO',
    'ventas@jugueteseducativos.co',
    '12345678914',
    '+57 1 8901235',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&h=150&fit=crop&crop=face',
    'Juguetes que educan y entretienen. Desarrollo y aprendizaje para los más pequeños.',
    0.0,
    0,
    true,
    '{"street": "Carrera 15 #88-35", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110221", "country": "Colombia"}',
    '{"website": "https://jugueteseducativos.co", "instagram": "jugueteseducativos_co"}'
),

-- Categoría: Accesorios para Vehículos (2 usuarios)
(
    'AutoParts CO',
    'ventas@autoparts.co',
    '12345678915',
    '+57 1 9012345',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=150&h=150&fit=crop&crop=face',
    'Repuestos y accesorios para vehículos. Calidad y garantía en cada producto.',
    0.0,
    0,
    true,
    '{"street": "Carrera 30 #45-67", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110311", "country": "Colombia"}',
    '{"website": "https://autoparts.co", "instagram": "autoparts_co"}'
),
(
    'CarStyle Accesorios',
    'info@carstyle.co',
    '12345678916',
    '+57 1 9012346',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'Accesorios y styling para tu vehículo. Personalización y calidad premium.',
    0.0,
    0,
    true,
    '{"street": "Calle 100 #19-55", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110221", "country": "Colombia"}',
    '{"website": "https://carstyle.co", "instagram": "carstyle_co"}'
);

-- Insertar productos disponibles para venta (2 productos por cada usuario)
INSERT INTO products (name, price, discount, seller_id, stock, images, condition, tags, description, category_id, features) VALUES
-- Categoría: Supermercado (Usuario 1 - SuperMarket Express)
(
    'Café Premium Colombiano 500g',
    28500,
    15,
    1,
    50,
    '["https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&h=400&fit=crop"]',
    'new',
    '["cafe", "colombiano", "premium", "gourmet", "alimentos"]',
    'Café colombiano premium tostado medio. Notas dulces y aroma intenso. Paquete de 500g.',
    1,
    '{
        "marca": "Café Premium",
        "origen": "Colombia",
        "tostion": "Medio",
        "peso": "500g",
        "tipo": "Molido"
    }'
),
(
    'Aceite de Oliva Extra Virgen 1L',
    42500,
    10,
    1,
    30,
    '["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop"]',
    'new',
    '["aceite", "oliva", "extra virgen", "saludable", "cocina"]',
    'Aceite de oliva extra virgen de primera calidad. Ideal para ensaladas y cocina.',
    1,
    '{
        "marca": "Oliva Premium",
        "capacidad": "1 Litro",
        "tipo": "Extra Virgen",
        "origen": "España",
        "acidez": "0.4%"
    }'
),

-- Categoría: Supermercado (Usuario 2 - Mercado Fresco)
(
    'Miel Pura de Abeja 500g',
    18500,
    5,
    2,
    40,
    '["https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=600&h=400&fit=crop"]',
    'new',
    '["miel", "natural", "abeja", "salud", "endulzante"]',
    'Miel 100% pura de abeja. Natural y sin conservantes. Botella de 500g.',
    1,
    '{
        "marca": "Miel Natural",
        "peso": "500g",
        "origen": "Colombia",
        "tipo": "Pura",
        "beneficios": "Antioxidante natural"
    }'
),
(
    'Granola con Frutos Secos 400g',
    12500,
    8,
    2,
    35,
    '["https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop"]',
    'new',
    '["granola", "frutos secos", "saludable", "desayuno", "cereal"]',
    'Granola crocante con frutos secos y miel. Perfecta para desayunos saludables.',
    1,
    '{
        "marca": "Granola Natural",
        "peso": "400g",
        "ingredientes": ["avena", "miel", "almendras", "nueces"],
        "tipo": "Saludable"
    }'
),

-- Categoría: Tecnología (Usuario 3 - TecnoShop Colombia)
(
    'iPhone 15 Pro 256GB',
    4599000,
    10,
    3,
    15,
    '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop"]',
    'new',
    '["apple", "iphone", "smartphone", "5g", "premium"]',
    'iPhone 15 Pro con Dynamic Island, cámara de 48MP y chip A17 Pro. Color Titanio Natural.',
    2,
    '{
        "pantalla": "6.1 pulgadas Super Retina XDR",
        "almacenamiento": "256GB",
        "ram": "8GB",
        "camara": "48MP + 12MP + 12MP",
        "bateria": "3650 mAh"
    }'
),
(
    'Laptop Dell XPS 13',
    3899000,
    15,
    3,
    8,
    '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop"]',
    'new',
    '["laptop", "dell", "xps", "ultrabook", "portatil"]',
    'Laptop ultradelgada Dell XPS 13 con procesador Intel i7, 16GB RAM y SSD 512GB.',
    2,
    '{
        "procesador": "Intel Core i7-1250U",
        "ram": "16GB LPDDR5",
        "almacenamiento": "512GB SSD",
        "pantalla": "13.4 FHD+"
    }'
),

-- Categoría: Tecnología (Usuario 4 - Digital World)
(
    'Samsung Galaxy S24 Ultra',
    3799000,
    8,
    4,
    12,
    '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop"]',
    'new',
    '["samsung", "android", "smartphone", "5g", "s-pen"]',
    'Samsung Galaxy S24 Ultra con S-Pen integrado, cámara de 200MP y pantalla Dynamic AMOLED.',
    2,
    '{
        "pantalla": "6.8 pulgadas Dynamic AMOLED",
        "almacenamiento": "512GB",
        "ram": "12GB",
        "camara": "200MP + 50MP + 12MP + 10MP"
    }'
),
(
    'Tablet iPad Air 10.9"',
    2250000,
    12,
    4,
    10,
    '["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop"]',
    'new',
    '["ipad", "tablet", "apple", "procesador m1", "entretenimiento"]',
    'iPad Air con chip M1, pantalla Liquid Retina de 10.9" y compatibilidad con Apple Pencil.',
    2,
    '{
        "pantalla": "10.9 pulgadas Liquid Retina",
        "almacenamiento": "64GB",
        "procesador": "Apple M1",
        "conectividad": "WiFi + Cellular"
    }'
),

-- Categoría: Farmacia (Usuario 5 - FarmaSalud Total)
(
    'Vitamina C 1000mg - 60 Tabletas',
    45000,
    15,
    5,
    60,
    '["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=400&fit=crop"]',
    'new',
    '["vitamina c", "suplemento", "salud", "antioxidante", "immunidad"]',
    'Suplemento de Vitamina C 1000mg. Fortalece el sistema inmunológico y es antioxidante.',
    3,
    '{
        "marca": "NatureMade",
        "contenido": "60 tabletas",
        "dosis": "1000mg por tableta",
        "beneficios": "Sistema inmunológico, piel sana"
    }'
),
(
    'Jabón Antibacterial Líquido 500ml',
    12500,
    5,
    5,
    80,
    '["https://images.unsplash.com/photo-1600857062244-5c0071b0336a?w=600&h=400&fit=crop"]',
    'new',
    '["jabon", "antibacterial", "higiene", "manos", "salud"]',
    'Jabón líquido antibacterial con aroma suave. Elimina el 99.9% de bacterias.',
    3,
    '{
        "marca": "Protect Plus",
        "capacidad": "500ml",
        "aroma": "Manzana verde",
        "efectividad": "99.9% antibacterial"
    }'
),

-- Categoría: Farmacia (Usuario 6 - MediCare Express)
(
    'Termómetro Digital Infrarrojo',
    85000,
    10,
    6,
    25,
    '["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop"]',
    'new',
    '["termometro", "digital", "infrarrojo", "salud", "fiebre"]',
    'Termómetro digital infrarrojo sin contacto. Medición rápida y precisa en 1 segundo.',
    3,
    '{
        "marca": "MediTemp",
        "tipo": "Infrarrojo sin contacto",
        "precision": "±0.2°C",
        "rango": "32°C - 43°C",
        "pantalla": "LCD digital"
    }'
),
(
    'Kit Primeros Auxilios Familiar',
    125000,
    8,
    6,
    15,
    '["https://images.unsplash.com/photo-1584467735871-8db9ac8e5e3a?w=600&h=400&fit=crop"]',
    'new',
    '["primeros auxilios", "botiquin", "emergencia", "salud", "familiar"]',
    'Kit completo de primeros auxilios para el hogar. Incluye 45 elementos esenciales.',
    3,
    '{
        "marca": "SafeCare",
        "elementos": "45 piezas",
        "uso": "Hogar, auto, viajes",
        "incluye": "Vendas, gasas, antisépticos"
    }'
),

-- Categoría: Electrodomésticos (Usuario 7 - ElectroHogar Premium)
(
    'Nevera No Frost 450L',
    2850000,
    20,
    7,
    5,
    '["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=400&fit=crop"]',
    'new',
    '["nevera", "no frost", "electrodomestico", "hogar", "congelador"]',
    'Nevera No Frost de 450 litros con tecnología inverter. Ahorro energético y diseño moderno.',
    4,
    '{
        "marca": "Samsung",
        "capacidad": "450 Litros",
        "tecnologia": "No Frost, Inverter",
        "color": "Acero inoxidable",
        "consumo": "A++"
    }'
),
(
    'Lavadora Carga Frontal 18kg',
    1890000,
    15,
    7,
    4,
    '["https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=400&fit=crop"]',
    'new',
    '["lavadora", "carga frontal", "electrodomestico", "hogar", "lavado"]',
    'Lavadora de carga frontal 18kg con tecnología steam wash y motor digital inverter.',
    4,
    '{
        "marca": "LG",
        "capacidad": "18 kg",
        "tecnologia": "Steam Wash, Inverter",
        "eficiencia": "A+++",
        "programas": "14 programas"
    }'
),

-- Categoría: Electrodomésticos (Usuario 8 - Casa Inteligente)
(
    'Microondas Grill 30L',
    450000,
    12,
    8,
    12,
    '["https://images.unsplash.com/photo-1616627561834-5d7c0f8b9b5d?w=600&h=400&fit=crop"]',
    'new',
    '["microondas", "grill", "electrodomestico", "cocina", "digital"]',
    'Microondas con función grill de 30 litros. Panel digital y 5 niveles de potencia.',
    4,
    '{
        "marca": "Panasonic",
        "capacidad": "30 Litros",
        "funciones": ["Microondas", "Grill", "Convección"],
        "potencia": "900W",
        "panel": "Digital táctil"
    }'
),
(
    'Aspiradora Robot Inteligente',
    750000,
    18,
    8,
    8,
    '["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop"]',
    'new',
    '["aspiradora", "robot", "inteligente", "limpieza", "hogar"]',
    'Aspiradora robot inteligente con navegación láser y app control. Programación automática.',
    4,
    '{
        "marca": "Xiaomi",
        "tecnologia": "Navegación láser",
        "conexion": "WiFi, App control",
        "bateria": "150 minutos",
        "funciones": "Mapeo inteligente"
    }'
),

-- Categoría: Hogar y Fitness (Usuario 9 - Hogar y Vida Sana)
(
    'Mesa de Centro Madera Sólida',
    450000,
    25,
    9,
    6,
    '["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop"]',
    'new',
    '["mesa", "centro", "madera", "hogar", "decoracion"]',
    'Mesa de centro de madera sólida con diseño moderno. Acabado natural y resistente.',
    5,
    '{
        "material": "Madera de teca sólida",
        "dimensiones": "100x50x45 cm",
        "color": "Natural",
        "estilo": "Moderno",
        "acabado": "Barniz protector"
    }'
),
(
    'Bicicleta Elíptica Plegable',
    650000,
    15,
    9,
    5,
    '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop"]',
    'new',
    '["bicicleta", "eliptica", "fitness", "ejercicio", "plegable"]',
    'Bicicleta elíptica plegable para ejercicio cardiovascular en casa. 8 niveles de resistencia.',
    5,
    '{
        "marca": "FitMaster",
        "tipo": "Eliptica plegable",
        "resistencias": "8 niveles",
        "pantalla": "LCD monitor",
        "peso_maximo": "120 kg"
    }'
),

-- Categoría: Hogar y Fitness (Usuario 10 - Fitness Home)
(
    'Set de Pesas Ajustables 20kg',
    320000,
    10,
    10,
    15,
    '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop"]',
    'new',
    '["pesas", "ajustables", "fitness", "ejercicio", "musculacion"]',
    'Set de pesas ajustables de 20kg para entrenamiento en casa. Incluye barra y discos.',
    5,
    '{
        "peso_total": "20 kg",
        "material": "Acero recubierto",
        "incluye": "Barra + discos",
        "tipo": "Ajustable",
        "uso": "Interior/Exterior"
    }'
),
(
    'Sofá Cama 3 Plazas',
    850000,
    20,
    10,
    3,
    '["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop"]',
    'new',
    '["sofa", "cama", "hogar", "multifuncional", "sala"]',
    'Sofá cama de 3 plazas con mecanismo fácil. Ideal para espacios pequeños y visitas.',
    5,
    '{
        "material": "Tela poliéster",
        "dimensiones": "190x90x85 cm",
        "color": "Gris oscuro",
        "funcion": "Sofá + Cama",
        "capacidad_cama": "2 personas"
    }'
),

-- Categoría: Belleza y Cuidado Personal (Usuario 11 - BeautyLab Colombia)
(
    'Kit Maquillaje Profesional 12 Piezas',
    189000,
    18,
    11,
    30,
    '["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop"]',
    'new',
    '["maquillaje", "belleza", "cosmetica", "profesional", "kit"]',
    'Kit completo de maquillaje profesional con 12 sombras y brochas incluidas.',
    6,
    '{
        "marca": "Maybelline",
        "productos_incluidos": "12 sombras + brochas + base",
        "tipo_piel": "Todo tipo",
        "duracion": "12 horas",
        "origen": "Importado"
    }'
),
(
    'Secador de Cabello Profesional 2000W',
    185000,
    12,
    11,
    18,
    '["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop"]',
    'new',
    '["secador", "cabello", "profesional", "belleza", "estilismo"]',
    'Secador de cabello profesional 2000W con tecnología iónica. 3 temperaturas y 2 velocidades.',
    6,
    '{
        "marca": "Revlon",
        "potencia": "2000W",
        "tecnologia": "Iónica",
        "temperaturas": "3 niveles",
        "velocidades": "2 velocidades"
    }'
),

-- Categoría: Belleza y Cuidado Personal (Usuario 12 - Glamour Shop)
(
    'Crema Facial Anti-Edad 50ml',
    85000,
    15,
    12,
    25,
    '["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop"]',
    'new',
    '["crema", "facial", "anti-edad", "belleza", "cuidado"]',
    'Crema facial anti-edad con colágeno y ácido hialurónico. Hidratación profunda y rejuvenecimiento.',
    6,
    '{
        "marca": "LOreal",
        "capacidad": "50 ml",
        "ingredientes": ["Colágeno", "Ácido Hialurónico", "Vitamina E"],
        "tipo_piel": "Todos los tipos",
        "beneficios": "Hidratación, anti-arrugas"
    }'
),
(
    'Perfume Eau de Parfum 100ml',
    285000,
    8,
    12,
    20,
    '["https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=400&fit=crop"]',
    'new',
    '["perfume", "fragancia", "belleza", "elegante", "duracion"]',
    'Perfume Eau de Parfum de larga duración. Notas amaderadas y cítricas. Elegante y sofisticado.',
    6,
    '{
        "marca": "Chanel",
        "capacidad": "100 ml",
        "tipo": "Eau de Parfum",
        "duracion": "8-10 horas",
        "notas": "Cítricas, amaderadas"
    }'
),

-- Categoría: Juegos y Juguetes (Usuario 13 - MundoJuguete)
(
    'Lego Star Wars Millennium Falcon',
    650000,
    22,
    13,
    6,
    '["https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop"]',
    'new',
    '["lego", "star wars", "millennium falcon", "juguete", "educativo"]',
    'Set LEGO Star Wars Millennium Falcon con 1350 piezas. Para mayores de 9 años.',
    7,
    '{
        "marca": "LEGO",
        "piezas": "1350",
        "edad_recomendada": "9+ años",
        "tema": "Star Wars",
        "tipo": "Construcción"
    }'
),
(
    'Muñeca Barbie Dreamhouse',
    450000,
    18,
    13,
    8,
    '["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop"]',
    'new',
    '["barbie", "dreamhouse", "muneca", "juguete", "casa"]',
    'Casa de muñecas Barbie Dreamhouse con 3 pisos y accesorios incluidos. Diversión garantizada.',
    7,
    '{
        "marca": "Mattel",
        "pisos": "3 niveles",
        "accesorios": "Muebles, electrodomésticos",
        "edad_recomendada": "3+ años",
        "dimensiones": "80x30x60 cm"
    }'
),

-- Categoría: Juegos y Juguetes (Usuario 14 - Juguetes Educativos CO)
(
    'Tablet Educativa para Niños',
    285000,
    15,
    14,
    12,
    '["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop"]',
    'new',
    '["tablet", "educativa", "niños", "aprendizaje", "juguete"]',
    'Tablet educativa con 50 actividades de aprendizaje. Ideal para niños de 3 a 8 años.',
    7,
    '{
        "marca": "VTech",
        "actividades": "50 modos de juego",
        "edad_recomendada": "3-8 años",
        "contenido": "Matemáticas, ciencias, idiomas",
        "bateria": "Recargable"
    }'
),
(
    'Set de Química para Niños',
    125000,
    10,
    14,
    15,
    '["https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=400&fit=crop"]',
    'new',
    '["quimica", "educativo", "ciencia", "experimentos", "niños"]',
    'Set de química seguro para niños. 25 experimentos educativos y divertidos.',
    7,
    '{
        "marca": "Science4You",
        "experimentos": "25 actividades",
        "edad_recomendada": "8+ años",
        "materiales": "Seguros y no tóxicos",
        "aprendizaje": "Ciencias básicas"
    }'
),

-- Categoría: Accesorios para Vehículos (Usuario 15 - AutoParts CO)
(
    'Llantas Deportivas 17 Pulgadas',
    1280000,
    8,
    15,
    10,
    '["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop"]',
    'new',
    '["llantas", "deportivas", "auto", "accesorios", "17"]',
    'Juego de 4 llantas deportivas de aleación 17 pulgadas. Diseño moderno y resistente.',
    8,
    '{
        "diametro": "17 pulgadas",
        "material": "Aleación de aluminio",
        "tornillos": "5x114.3",
        "color": "Negro mate",
        "garantia": "2 años"
    }'
),
(
    'Kit Herramientas Mecánicas 150 Piezas',
    285000,
    12,
    15,
    20,
    '["https://images.unsplash.com/photo-1572981779307-38f8b0456222?w=600&h=400&fit=crop"]',
    'new',
    '["herramientas", "mecanica", "auto", "reparacion", "kit"]',
    'Kit completo de herramientas mecánicas 150 piezas. Calidad profesional para taller y hogar.',
    8,
    '{
        "piezas": "150 unidades",
        "material": "Acero al cromo vanadio",
        "incluye": "Llaves, destornilladores, sockets",
        "estuche": "Organizador profesional",
        "garantia": "Vitalicia"
    }'
),
-- Categoría: Accesorios para Vehículos (Usuario 16 - CarStyle Accesorios)
(
    'Cámara de Reversa con Pantalla LCD',
    185000,
    15,
    16,
    12,
    '["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop"]',
    'new',
    '["camara", "reversa", "seguridad", "auto", "pantalla"]',
    'Sistema de cámara de reversa con pantalla LCD 4.3". Fácil instalación y visión nocturna.',
    8,
    '{
        "pantalla": "4.3 pulgadas LCD",
        "resolucion": "720p",
        "vision_nocturna": "Sí",
        "angulo": "170 grados",
        "resistencia": "IP67"
    }'
),
(
    'Cubre Asientos de Cuero Sintético',
    285000,
    10,
    16,
    15,
    '["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop"]',
    'new',
    '["asientos", "cuero", "auto", "proteccion", "comodidad"]',
    'Juego de cubre asientos de cuero sintético. Universal, fácil instalación y resistente.',
    8,
    '{
        "material": "Cuero sintético premium",
        "compatibilidad": "Universal",
        "color": "Negro con costuras rojas",
        "proteccion": "Antimanchas, antidesgaste",
        "limpieza": "Fácil"
    }'
);