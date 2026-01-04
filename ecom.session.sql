SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM orders;
SELECT * FROM order_items;
SELECT * FROM cart_items;

--@block
DELETE FROM users WHERE email = "walidchemat@gmail.com";

--@block
SELECT * FROM wilaya;
SELECT * FROM commune;

--@block
UPDATE users SET status = 'active' WHERE email = "root";

--@block
INSERT INTO users (name, email, password, status, role)
VALUES ('John Doe', 'john.doe@example.com', 'password123', 'active', 'customer');


--@block
UPDATE users SET is_verified = 1 WHERE email = 'john.doe@example.com';