-- 1. USERS TABLE
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `role` enum('CLIENT','ADMIN') DEFAULT 'CLIENT',
  `status` enum('ACTIVE','BLOCKED','PENDING') DEFAULT 'PENDING',
  `email_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 2. PRODUCTS TABLE
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `rate` decimal(2,1) DEFAULT '0.0',
  `category` enum('VETEMENT','ELECTRONIQUE','MEUBLE','Shorts') NOT NULL,
  `stock` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `taille` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. CARTS TABLE
DROP TABLE IF EXISTS `carts`;
CREATE TABLE `carts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4. CART_ITEMS TABLE
DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE `cart_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cart_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `quantity` int NOT NULL,
  `size` varchar(10) NOT NULL,
  `color` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`),
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 5. ORDERS TABLE
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `status` enum('PENDING','PAID','SHIPPED','DELIVERED') DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 6. ORDER_ITEMS TABLE
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 7. EMAIL_VERIFICATION_CODES TABLE
DROP TABLE IF EXISTS `email_verification_codes`;
CREATE TABLE `email_verification_codes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `code` varchar(10) DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `email_verification_codes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;