-- inserts.sql
-- Datos de ejemplo para empresas recién registradas y productos disponibles

-- Insertar usuarios/vendedores (empresas recién registradas)
INSERT INTO users (name, email, cedula, phone, password, avatar_url, bio, rating, total_sales, is_verified, address, social_links) VALUES
-- Vendedor 1: Tienda de Tecnología (recién registrada)
(
    'TecnoShop Colombia',
    'ventas@tecnoshop.co',
    '12345678901',
    '+57 1 2345678',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u', -- Contraseña en texto plano (se hasheará en la app)
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=150&h=150&fit=crop&crop=face',
    'Tu tienda de confianza para tecnología de última generación. Especialistas en smartphones, laptops y gadgets.',
    0.0, -- Rating inicial 0
    0,   -- Ventas iniciales 0
    true,
    '{"street": "Calle 100 #15-20", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110111", "country": "Colombia"}',
    '{"website": "https://tecnoshop.co", "facebook": "tecnoshopcol", "instagram": "tecnoshop_col"}'
),

-- Vendedor 2: Moda y Estilo (recién registrada)
(
    'FashionStyle CO',
    'contacto@fashionstyle.co',
    '12345678902',
    '+57 4 5678901',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    'Las últimas tendencias en moda colombiana. Ropa, calzado y accesorios para toda la familia.',
    0.0,
    0,
    true,
    '{"street": "Carrera 43A #7-50", "city": "Medellín", "state": "Antioquia", "zipCode": "050001", "country": "Colombia"}',
    '{"website": "https://fashionstyle.co", "instagram": "fashionstyle_co", "twitter": "fashionstyleco"}'
),

-- Vendedor 3: Hogar y Decoración (recién registrada)
(
    'HogarExpress',
    'info@hogarexpress.co',
    '12345678903',
    '+57 5 6789012',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'Todo para tu hogar. Muebles, decoración, electrodomésticos y más. Calidad y estilo para tu casa.',
    0.0,
    0,
    true,
    '{"street": "Avenida 4N #10-45", "city": "Cali", "state": "Valle del Cauca", "zipCode": "760001", "country": "Colombia"}',
    '{"website": "https://hogarexpress.co", "facebook": "hogarexpressco"}'
),

-- Vendedor 4: Deportes y Aventura (recién registrada)
(
    'DeportesTotal',
    'ventas@deportestotal.co',
    '12345678904',
    '+57 2 7890123',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop&crop=face',
    'Equipamiento deportivo para todos. Desde profesional hasta amateur. ¡Vive el deporte!',
    0.0,
    0,
    true,
    '{"street": "Calle 53 #45-25", "city": "Barranquilla", "state": "Atlántico", "zipCode": "080001", "country": "Colombia"}',
    '{"website": "https://deportestotal.co", "instagram": "deportestotal_co"}'
),

-- Vendedor 5: Libros y Cultura (recién registrada)
(
    'Librería Cultural',
    'contacto@libreriacultural.co',
    '12345678905',
    '+57 1 8901234',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&h=150&fit=crop&crop=face',
    'Tu librería de confianza. Libros, material educativo y cultural para todos los gustos.',
    0.0,
    0,
    true,
    '{"street": "Carrera 11 #85-32", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110221", "country": "Colombia"}',
    '{"website": "https://libreriacultural.co", "facebook": "libreriaculturalco"}'
),

-- Vendedor 6: Belleza y Cuidado (recién registrada)
(
    'BeautyLab Colombia',
    'hola@beautylab.co',
    '12345678906',
    '+57 4 9012345',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1596075780740-95f43d1a026c?w=150&h=150&fit=crop&crop=face',
    'Productos de belleza y cuidado personal. Marcas reconocidas y productos naturales.',
    0.0,
    0,
    true,
    '{"street": "Carrera 37 #8-43", "city": "Medellín", "state": "Antioquia", "zipCode": "050015", "country": "Colombia"}',
    '{"website": "https://beautylab.co", "instagram": "beautylab_col"}'
),

-- Vendedor 7: Juguetes y Diversión (recién registrada)
(
    'MundoJuguete',
    'info@mundojuguete.co',
    '12345678907',
    '+57 5 0123456',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1534452203293-4945fdd95353?w=150&h=150&fit=crop&crop=face',
    'Juguetes educativos y de entretenimiento para todas las edades. Calidad y diversión garantizada.',
    0.0,
    0,
    true,
    '{"street": "Calle 72 #23-15", "city": "Cartagena", "state": "Bolívar", "zipCode": "130001", "country": "Colombia"}',
    '{"website": "https://mundojuguete.co", "facebook": "mundojuguete"}'
),

-- Vendedor 8: Automotriz (recién registrada)
(
    'AutoParts CO',
    'ventas@autoparts.co',
    '12345678908',
    '+57 1 3456789',
    '$2a$12$4zCKAig81IK1JN5LZSMGo.Zp9LdhLSOMOI8QEPjMC82apUGCZQI/u',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=150&h=150&fit=crop&crop=face',
    'Repuestos y accesorios para vehículos. Calidad y garantía en cada producto.',
    0.0,
    0,
    true,
    '{"street": "Carrera 30 #45-67", "city": "Bogotá", "state": "Cundinamarca", "zipCode": "110311", "country": "Colombia"}',
    '{"website": "https://autoparts.co", "instagram": "autoparts_co"}'
);

-- Insertar productos disponibles para venta (sin compras ni favoritos)
INSERT INTO products (name, price, discount, seller_id, stock, images, condition, tags, description, category_id, features) VALUES
-- Productos de Tecnología (Vendedor 1)
(
    'iPhone 15 Pro 256GB',
    4599000,
    10,
    1,
    15,
    '[
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop"
    ]',
    'new',
    '["apple", "iphone", "smartphone", "5g", "premium"]',
    'iPhone 15 Pro con Dynamic Island, cámara de 48MP y chip A17 Pro. Color Titanio Natural.',
    1,
    '{
        "pantalla": "6.1 pulgadas Super Retina XDR",
        "almacenamiento": "256GB",
        "ram": "8GB",
        "camara": "48MP + 12MP + 12MP",
        "bateria": "3650 mAh",
        "sistema_operativo": "iOS 17",
        "conectividad": ["5G", "WiFi 6", "Bluetooth 5.3"]
    }'
),
(
    'Laptop Dell XPS 13',
    3899000,
    15,
    1,
    8,
    '[
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop"
    ]',
    'new',
    '["laptop", "dell", "xps", "ultrabook", "portatil"]',
    'Laptop ultradelgada Dell XPS 13 con procesador Intel i7, 16GB RAM y SSD 512GB.',
    1,
    '{
        "procesador": "Intel Core i7-1250U",
        "ram": "16GB LPDDR5",
        "almacenamiento": "512GB SSD",
        "pantalla": "13.4 FHD+",
        "graficos": "Intel Iris Xe",
        "sistema_operativo": "Windows 11"
    }'
),
(
    'Samsung Galaxy S24 Ultra',
    3799000,
    8,
    1,
    12,
    '[
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop"
    ]',
    'new',
    '["samsung", "android", "smartphone", "5g", "s-pen"]',
    'Samsung Galaxy S24 Ultra con S-Pen integrado, cámara de 200MP y pantalla Dynamic AMOLED.',
    1,
    '{
        "pantalla": "6.8 pulgadas Dynamic AMOLED",
        "almacenamiento": "512GB",
        "ram": "12GB",
        "camara": "200MP + 50MP + 12MP + 10MP",
        "bateria": "5000 mAh",
        "sistema_operativo": "Android 14"
    }'
),

-- Productos de Moda (Vendedor 2)
(
    'Zapatos Casuales Cuero Hombre',
    289000,
    20,
    2,
    25,
    '[
        "https://images.unsplash.com/photo-1542280756-74b2f55e73ab?w=600&h=400&fit=crop"
    ]',
    'new',
    '["zapatos", "cuero", "hombre", "casual", "moda"]',
    'Zapatos casuales de cuero genuino para hombre. Comodidad y estilo para el día a día.',
    2,
    '{
        "material": "Cuero genuino",
        "color": "Café",
        "tallas": "38-45",
        "tipo_suela": "Goma antideslizante",
        "ocasion": "Casual"
    }'
),
(
    'Vestido Elegante Negro',
    185000,
    25,
    2,
    18,
    '[
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=400&fit=crop"
    ]',
    'new',
    '["vestido", "mujer", "elegante", "negro", "fiesta"]',
    'Vestido elegante negro para ocasiones especiales. Tela suave y cómoda.',
    2,
    '{
        "material": "Poliéster",
        "color": "Negro",
        "tallas": "XS, S, M, L, XL",
        "largo": "Mid-calf",
        "ocasion": "Fiesta/Noche"
    }'
),

-- Productos de Hogar (Vendedor 3)
(
    'Sofá Seccional 3 Plazas',
    1899000,
    30,
    3,
    5,
    '[
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop"
    ]',
    'new',
    '["sofa", "seccional", "sala", "hogar", "comodo"]',
    'Sofá seccional moderno de 3 plazas. Tela resistente y cómoda para tu sala.',
    3,
    '{
        "material": "Tela poliéster",
        "color": "Gris",
        "dimensiones": "220x90x85 cm",
        "capacidad": "3 personas",
        "incluye": "Cojines decorativos"
    }'
),
(
    'Juego de Comedor 6 Sillas',
    2350000,
    15,
    3,
    3,
    '[
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop"
    ]',
    'new',
    '["comedor", "mesa", "sillas", "madera", "hogar"]',
    'Juego de comedor con mesa y 6 sillas. Madera sólida y diseño moderno.',
    3,
    '{
        "material": "Madera de pino",
        "color": "Natural",
        "dimensiones_mesa": "160x90x75 cm",
        "sillas": "6 unidades",
        "estilo": "Moderno"
    }'
),

-- Productos Deportivos (Vendedor 4)
(
    'Bicicleta Montaña Shimano',
    1250000,
    12,
    4,
    7,
    '[
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&h=400&fit=crop"
    ]',
    'new',
    '["bicicleta", "montaña", "shimano", "deporte", "exterior"]',
    'Bicicleta de montaña profesional con cambios Shimano y suspensión delantera.',
    4,
    '{
        "marca": "Trek",
        "tamaño_ruedas": "29 pulgadas",
        "velocidades": "21",
        "suspension": "Delantera",
        "material_cuadro": "Aluminio"
    }'
),
(
    'Set Pesas Ajustables 20kg',
    450000,
    10,
    4,
    15,
    '[
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop"
    ]',
    'new',
    '["pesas", "gimnasio", "fitness", "ejercicio", "musculacion"]',
    'Set de pesas ajustables de 20kg para entrenamiento en casa. Incluye barra y discos.',
    4,
    '{
        "peso_total": "20 kg",
        "material": "Acero recubierto",
        "incluye": "Barra + discos",
        "tipo": "Ajustable",
        "uso": "Interior/Exterior"
    }'
),

-- Productos de Libros (Vendedor 5)
(
    'Colección Harry Potter 7 Libros',
    285000,
    5,
    5,
    22,
    '[
        "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=600&h=400&fit=crop"
    ]',
    'new',
    '["harry potter", "fantasia", "coleccion", "libros", "best-seller"]',
    'Colección completa de Harry Potter - 7 libros en edición especial.',
    5,
    '{
        "autor": "J.K. Rowling",
        "editorial": "Salamandra",
        "idioma": "Español",
        "paginas": "3500 aprox.",
        "tapa": "Dura"
    }'
),

-- Productos de Belleza (Vendedor 6)
(
    'Kit Maquillaje Profesional',
    189000,
    18,
    6,
    30,
    '[
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop"
    ]',
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

-- Productos de Juguetes (Vendedor 7)
(
    'Lego Star Wars Millennium Falcon',
    650000,
    22,
    7,
    6,
    '[
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop"
    ]',
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

-- Productos Automotrices (Vendedor 8)
(
    'Llantas Deportivas 17 Pulgadas',
    1280000,
    8,
    8,
    10,
    '[
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop"
    ]',
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
);

-- NOTA: No insertamos datos en user_favorites, orders u order_items
-- ya que estas empresas y productos son nuevos, sin historial de ventas