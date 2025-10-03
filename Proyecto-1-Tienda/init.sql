-- init.sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    -- Nuevos campos para sellers
    avatar_url VARCHAR(255),
    bio TEXT,
    rating DECIMAL(3,2) DEFAULT 5.0,
    total_sales INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    address JSONB,
    social_links JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(5,2) DEFAULT 0,
    seller_id INT NOT NULL,
    stock INT DEFAULT 0,
    images JSONB,
    condition VARCHAR(50),
    tags JSONB,
    description TEXT,
    category_id INT,
    features JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_seller
        FOREIGN KEY (seller_id) 
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_category
        FOREIGN KEY (category_id) 
        REFERENCES categories(id)
        ON DELETE SET NULL
);

-- NUEVAS TABLAS PARA FAVORITOS, COMPRAS, ETC.
CREATE TABLE IF NOT EXISTS user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_favorites_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_favorites_product 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address JSONB,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_order_items_order 
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_cedula ON users(cedula);
CREATE INDEX IF NOT EXISTS idx_users_rating ON users(rating);
CREATE INDEX IF NOT EXISTS idx_users_total_sales ON users(total_sales);

-- Índices para products
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_condition ON products(condition);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_features ON products USING GIN(features);

-- Índices para las nuevas tablas
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_product_id ON user_favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_products_category_id_price ON products(category_id, price);
CREATE INDEX IF NOT EXISTS idx_products_category_id_created_at ON products(category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category_id_discount ON products(category_id, discount DESC);

-- Índice para búsqueda por nombre de categoría
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Función para búsqueda optimizada por categoría
CREATE OR REPLACE FUNCTION get_products_by_category_name(category_name_param VARCHAR)
RETURNS TABLE (
    id INT,
    name VARCHAR,
    price DECIMAL,
    discount DECIMAL,
    seller_id INT,
    stock INT,
    images JSONB,
    condition VARCHAR,
    tags JSONB,
    description TEXT,
    category_id INT,
    features JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    seller_name VARCHAR,
    seller_rating DECIMAL,
    seller_total_sales INT,
    seller_avatar_url VARCHAR,
    seller_is_verified BOOLEAN,
    category_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.*,
        u.name as seller_name,
        u.rating as seller_rating,
        u.total_sales as seller_total_sales,
        u.avatar_url as seller_avatar_url,
        u.is_verified as seller_is_verified,
        c.name as category_name
    FROM products p
    JOIN users u ON p.seller_id = u.id
    JOIN categories c ON p.category_id = c.id
    WHERE c.name ILIKE '%' || category_name_param || '%'
    ORDER BY 
        p.discount DESC NULLS LAST,
        p.created_at DESC
    LIMIT 100;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener marcas únicas por categoría
CREATE OR REPLACE FUNCTION get_brands_by_category(category_id_param INT)
RETURNS TABLE (brand VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT features->>'marca' as brand
    FROM products 
    WHERE category_id = category_id_param 
      AND features->>'marca' IS NOT NULL 
      AND features->>'marca' != ''
    ORDER BY brand
    LIMIT 12;
END;
$$ LANGUAGE plpgsql;