-- SoinsConnect - Script SQL de création de la base de données

-- Exécuter ce script avant la première migration Prisma si la base n'existe pas



CREATE DATABASE IF NOT EXISTS siteweb_soinsconnect

  CHARACTER SET utf8mb4

  COLLATE utf8mb4_unicode_ci;



USE siteweb_soinsconnect;



-- La table care_requests est créée automatiquement par Prisma Migrate.

-- Script de référence (équivalent à la migration init) :



CREATE TABLE IF NOT EXISTS care_requests (

  id INT AUTO_INCREMENT PRIMARY KEY,

  full_name VARCHAR(255) NOT NULL,

  phone VARCHAR(50) NOT NULL,

  email VARCHAR(255) NULL,

  address TEXT NOT NULL,

  care_type VARCHAR(100) NOT NULL,

  description TEXT NULL,

  requested_date DATE NOT NULL,

  requested_time VARCHAR(10) NOT NULL,

  is_urgent BOOLEAN NOT NULL DEFAULT FALSE,

  status VARCHAR(50) NOT NULL DEFAULT 'pending',

  admin_notes TEXT NULL,

  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  updated_at DATETIME(3) NOT NULL,

  INDEX idx_status (status),

  INDEX idx_created_at (created_at),

  INDEX idx_is_urgent (is_urgent)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- Table admins (créée par Prisma Migrate) :



CREATE TABLE IF NOT EXISTS admins (

  id INT AUTO_INCREMENT PRIMARY KEY,

  first_name VARCHAR(100) NOT NULL,

  last_name VARCHAR(100) NOT NULL,

  email VARCHAR(255) NOT NULL UNIQUE,

  password VARCHAR(255) NOT NULL,

  role VARCHAR(50) NOT NULL,

  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  last_login DATETIME(3) NULL,

  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  updated_at DATETIME(3) NOT NULL

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


