CREATE DATABASE JovenGrabsFood;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE Users (
    user_id uuid DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL, -- we might want to make this unique only for merchants, using a trigger
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_type VARCHAR(255) NOT NULL,
    user_address VARCHAR(255) -- do we need trigger to check if the user_type is not deliverer?
    PRIMARY KEY (user_id)
);

CREATE TABLE FoodItem (
    item_id BIGSERIAL,
    user_id uuid REFERENCES Users,
    item_price NUMERIC NOT NULL check (item_price > 0),
    item_name VARCHAR(255) NOT NULL,
    item_image_url VARCHAR(255) NOT NULL,
    item_category VARCHAR(255) NOT NULL, 
    PRIMARY KEY(item_id)
);

CREATE TABLE FoodItemSections (
    item_id BIGSERIAL REFERENCES FoodItem,
    item_section_name VARCHAR(255) NOT NULL,
    option_description VARCHAR(255) NOT NULL,
    option_price_change NUMERIC NOT NULL,
    -- item_section_name is the title of a section that contains options
    PRIMARY KEY (item_id, item_section_name, option_description) 
    -- Options are unique within a section
);

CREATE TABLE FoodCategory (
    category_id SERIAL,
    category_description VARCHAR(255) NOT NULL,
    PRIMARY KEY (category_id)
);

INSERT INTO FoodCategory VALUES
    (DEFAULT, 'Western'),
    (DEFAULT, 'Japanese'),
    (DEFAULT, 'Halal'),
    (DEFAULT, 'Chinese'),
    (DEFAULT, 'Local'),
    (DEFAULT, 'Beverages'),
    (DEFAULT, 'Indian'),
    (DEFAULT, 'Dessert'),
    (DEFAULT, 'Fast Food'),
    (DEFAULT, 'Seafood');