-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS scopus_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE scopus_db;

CREATE TABLE IF NOT EXISTS institutions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    institution_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_title VARCHAR(500) NOT NULL,
    abstract TEXT,
    authors JSON,
    keywords JSON,
    institution JSON,
    funding JSON,
    language VARCHAR(50) DEFAULT 'Español',
    issn VARCHAR(20),
    coden VARCHAR(20),
    doi VARCHAR(100),
    `references` JSON,  -- Palabra reservada escapada
    coderence VARCHAR(100),
    chemical_name VARCHAR(200),
    cas_number VARCHAR(50),
    orcid VARCHAR(100),
    publication_date DATE,
    cites_count INT DEFAULT 0,
    document_type VARCHAR(100),
    content JSON,
    subject_areas JSON,
    source_title VARCHAR(300),
    publisher VARCHAR(200),
    year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fulltext_index TEXT,
    
    INDEX idx_title (article_title),
    INDEX idx_year (year),
    INDEX idx_document_type (document_type),
    INDEX idx_source_title (source_title),
    INDEX idx_publisher (publisher),
    FULLTEXT idx_fulltext (article_title, abstract, fulltext_index)
);
