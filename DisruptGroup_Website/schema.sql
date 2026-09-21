-- Disrupt Group Database Schema

CREATE DATABASE IF NOT EXISTS disrupt_group;
USE disrupt_group;

CREATE TABLE IF NOT EXISTS consultation_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    subsidiary_interest VARCHAR(100) DEFAULT 'Disrupt Group (All)',
    project_type VARCHAR(100),
    budget_range VARCHAR(100),
    timeline VARCHAR(100),
    selected_services JSON,
    total_estimated_value VARCHAR(100),
    synergy_discount_applied VARCHAR(100),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blueprint_quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference_code VARCHAR(50) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    blueprint_data JSON NOT NULL,
    total_estimate VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
