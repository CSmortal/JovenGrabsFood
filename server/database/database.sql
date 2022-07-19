CREATE DATABASE JovenGrabsFood;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE Users (
    user_id uuid DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_type VARCHAR(255) NOT NULL
);