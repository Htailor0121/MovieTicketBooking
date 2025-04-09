-- Create database if not exists
CREATE DATABASE IF NOT EXISTS movie_booking;

USE movie_booking;

-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT,
    release_date DATE,
    genre VARCHAR(100),
    rating FLOAT,
    image_url TEXT,
    price DECIMAL(10, 2) DEFAULT 300.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 