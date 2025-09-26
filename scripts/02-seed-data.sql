-- Insert stores
INSERT INTO stores (name, email, description, website, phone, logo_url) VALUES
('ALO', 'support@aloyoga.com', 'Mindful movement. It''s at the core of why we do what we do at Alo—it''s our calling.', 'https://aloyoga.com', '+1-800-ALO-YOGA', '/placeholder-logo.png'),
('VUORI', 'support@vuori.com', 'Performance clothing for the versatile lifestyle.', 'https://vuori.com', '+1-800-VUORI', '/placeholder-logo.png'),
('NIKE', 'support@nike.com', 'Just Do It. Bringing inspiration and innovation to every athlete in the world.', 'https://nike.com', '+1-800-NIKE', '/placeholder-logo.png'),
('SKIMS', 'support@skims.com', 'Solutions for every body. Underwear, loungewear and shapewear.', 'https://skims.com', '+1-800-SKIMS', '/placeholder-logo.png'),
('NEW BALANCE', 'support@newbalance.com', 'Fearlessly Independent Since 1906. Athletic footwear and apparel.', 'https://newbalance.com', '+1-800-NB-SHOES', '/placeholder-logo.png'),
('LEVI', 'support@levi.com', 'The original jean. Quality never goes out of style.', 'https://levi.com', '+1-800-LEVIS', '/placeholder-logo.png'),
('BANANA REPUBLIC', 'support@bananarepublic.com', 'Modern, versatile clothing for work and life.', 'https://bananarepublic.com', '+1-800-BANANA', '/placeholder-logo.png'),
('GAP', 'support@gap.com', 'Casual clothing and accessories for the whole family.', 'https://gap.com', '+1-800-GAP-STYLE', '/placeholder-logo.png');

-- Insert customers
INSERT INTO customers (name, email, phone, status, company, location, notes, avatar_url) VALUES
('Sarah Chen', 'sarah@example.com', '+1234567890', 'gold', 'Creative Agency', 'Los Angeles, CA', 'Fashion enthusiast - loves athleisure', '/customer-profile-.jpg'),
('Emma Johnson', 'emma@example.com', '+1234567891', 'silver', 'Tech Startup', 'San Francisco, CA', 'Minimalist style, prefers neutral colors', '/placeholder-user.jpg'),
('Michael Brown', 'michael@example.com', '+1234567892', 'bronze', 'Finance', 'New York, NY', 'Business casual, needs professional attire', '/placeholder-user.jpg'),
('Lisa Davis', 'lisa@example.com', '+1234567893', 'vip', 'Fashion Designer', 'Miami, FL', 'High-end fashion, luxury brands only', '/placeholder-user.jpg');

-- Insert memberships
INSERT INTO memberships (customer_id, store_id, status) VALUES
(1, 1, 'gold'), (1, 2, 'silver'), (1, 3, 'vip'), (1, 4, 'bronze'), (1, 5, 'silver'),
(2, 1, 'silver'), (2, 3, 'bronze'), (2, 6, 'gold'),
(3, 2, 'bronze'), (3, 7, 'silver'), (3, 8, 'bronze'),
(4, 1, 'vip'), (4, 4, 'vip'), (4, 6, 'gold');

-- Insert purchases
INSERT INTO purchases (customer_id, store_id, item_name, price, image_url, purchase_date) VALUES
(1, 1, 'High-Waist Shine Leggings', 88.00, '/black-athletic-leggings.jpg', '2024-01-15'),
(1, 3, 'Air Max 270', 150.00, '/white-nike-sneakers.png', '2024-01-20'),
(1, 2, 'Ponto Performance Pant', 89.00, '/gray-athletic-pants.jpg', '2024-02-01'),
(2, 1, '7/8 High-Waist Leggings', 78.00, '/alo-yoga-leggings.jpg', '2024-01-25'),
(3, 2, 'Performance Shorts', 65.00, '/placeholder.jpg', '2024-02-10'),
(4, 1, 'Luxury Leggings', 120.00, '/placeholder.jpg', '2024-02-15');

-- Insert messages
INSERT INTO messages (customer_id, store_id, sender_type, message_text, is_read) VALUES
(1, 1, 'customer', 'Hi! I''m interested in your new leggings collection.', true),
(1, 1, 'store', 'Hello Sarah! We''d love to help you find the perfect pair. What style are you looking for?', true),
(1, 3, 'customer', 'Do you have the Air Max 270 in white, size 8?', true),
(1, 3, 'store', 'Yes! We have that in stock. Would you like me to hold a pair for you?', true),
(1, 2, 'customer', 'I love the Ponto pants! Any new colors coming soon?', true),
(1, 2, 'store', 'Great choice! We''re launching sage green and dusty rose next week. I can notify you when they''re available.', true),
(1, 4, 'customer', 'Hi! I''m coming in at 1 PM today and want to try on the Cotton Rib Tank and Fits Everybody Bodysuit in size M.', true),
(1, 4, 'store', 'Perfect! We''ll have fitting room 3 ready for you at 1 PM with both items in size M. I''ve also pulled some additional pieces you might like - the Cotton Jersey T-Shirt and Fits Everybody Square Neck Bra in similar tones. See you soon! 💕', true),
(1, 4, 'customer', 'Amazing, thank you! Can''t wait to try everything on.', true),
(1, 5, 'store', '🔥 FLASH SALE ALERT! 25% off all Fresh Foam sneakers today only! Plus, as a Silver member, you get an additional 10% off. Use code: FRESHSTART25', false),
(1, 5, 'customer', 'This is perfect timing! I''ve been eyeing the Fresh Foam X 1080v12. Is it included in the sale?', false),
(1, 5, 'store', 'The 1080v12 is included. With your Silver member discount, you''ll save 35% total. I''m coming in at 1 PM to try them on - can you have a pair ready in size 8?', false),
(1, 5, 'customer', 'Yes! I''m coming in at 1 PM to try them on - can you have a pair ready in size 8?', false),
(1, 5, 'store', 'Done! I''ll have the Fresh Foam X 1080v12 in size 8 ready for you at 1 PM, along with some other Fresh Foam styles you might like. We''ll also have your member pricing already applied. Looking forward to seeing you! 👟', false);

-- Insert user profiles (with hashed passwords - in production, use proper password hashing)
INSERT INTO user_profiles (email, password_hash, user_type, customer_id, store_id) VALUES
('sarah@example.com', '$2b$10$example_hash_customer', 'customer', 1, NULL),
('emma@example.com', '$2b$10$example_hash_customer', 'customer', 2, NULL),
('michael@example.com', '$2b$10$example_hash_customer', 'customer', 3, NULL),
('lisa@example.com', '$2b$10$example_hash_customer', 'customer', 4, NULL),
('support@aloyoga.com', '$2b$10$example_hash_store', 'store', NULL, 1),
('support@vuori.com', '$2b$10$example_hash_store', 'store', NULL, 2),
('support@nike.com', '$2b$10$example_hash_store', 'store', NULL, 3),
('support@skims.com', '$2b$10$example_hash_store', 'store', NULL, 4),
('support@newbalance.com', '$2b$10$example_hash_store', 'store', NULL, 5),
('support@levi.com', '$2b$10$example_hash_store', 'store', NULL, 6),
('support@bananarepublic.com', '$2b$10$example_hash_store', 'store', NULL, 7),
('support@gap.com', '$2b$10$example_hash_store', 'store', NULL, 8);