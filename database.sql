-- 1. USERS
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(20),
  `address` TEXT,
  `role` VARCHAR(20) DEFAULT 'USER', -- 'USER' or 'ADMIN'
  `status` VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'ACTIVE', 'BLOCKED'
  `is_verified` BOOLEAN DEFAULT FALSE,
  `verification_code` VARCHAR(10),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PRODUCTS
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10,2) NOT NULL,
  `old_price` DECIMAL(10,2) DEFAULT 0.00,
  `stock` INT DEFAULT 0,
  `category` VARCHAR(50),
  `rate` DECIMAL(2,1) DEFAULT 0.0,
  `number_of_reviews` INT DEFAULT 0,
  `image` VARCHAR(255),
  `sizes` VARCHAR(255),  -- Stores "S,M,L" as string
  `colors` VARCHAR(255), -- Stores "Red,Blue" as string
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CART ITEMS
DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE `cart_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT DEFAULT 1,
  `size` VARCHAR(20),
  `color` VARCHAR(50),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
);

-- 4. ORDERS
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  `status` VARCHAR(20) DEFAULT 'PENDING', -- PENDING, PAID, SHIPPED
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

-- 5. ORDER ITEMS
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
);


CREATE TABLE `wilaya`(
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL
);

CREATE TABLE `commune`(
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `wilaya_id` INT,
  FOREIGN KEY (`wilaya_id`) REFERENCES `wilaya`(`id`)
);