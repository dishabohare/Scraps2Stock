-- ============================================================
-- Scraps2Stock seed data
-- Uses ON CONFLICT DO NOTHING so real registered users are
-- NEVER wiped when the backend restarts.
-- ============================================================

-- Normalize any existing lowercase roles left over from before the fix.
-- This is the key statement that unblocks the 403 for existing accounts.
UPDATE users SET role = UPPER(role) WHERE role != UPPER(role);

-- Seed demo suppliers (skipped if the row already exists)
-- Password for all demo accounts: password123
INSERT INTO users (id, name, email, password, role, phone) VALUES
(101, 'Fresh Farms Produce',  'freshfarms@gmail.com',        '$2a$10$wE/.7L3h08qB4E3Y0jR5lO5hOqM8P5c8zJg/D0rT3g1L8W2oZ8N1e', 'SUPPLIER', '+91-9876543210'),
(102, 'Punjab Cold Storage',  'punjabcoldstorage@gmail.com', '$2a$10$wE/.7L3h08qB4E3Y0jR5lO5hOqM8P5c8zJg/D0rT3g1L8W2oZ8N1e', 'SUPPLIER', '+91-9876543211'),
(103, 'Premium Greens',       'premium.greens@fssai.in',     '$2a$10$wE/.7L3h08qB4E3Y0jR5lO5hOqM8P5c8zJg/D0rT3g1L8W2oZ8N1e', 'SUPPLIER', '+91-9876543212'),
(104, 'Organic Mumbai',       'organic.mumbai@outlook.com',  '$2a$10$wE/.7L3h08qB4E3Y0jR5lO5hOqM8P5c8zJg/D0rT3g1L8W2oZ8N1e', 'SUPPLIER', '+91-9876543213'),
(105, 'Delhi Mandi Traders',  'delhimandi@yahoo.in',         '$2a$10$wE/.7L3h08qB4E3Y0jR5lO5hOqM8P5c8zJg/D0rT3g1L8W2oZ8N1e', 'SUPPLIER', '+91-9876543214'),
(106, 'Quality Agro',         'quality.agro@domain.com',     '$2a$10$wE/.7L3h08qB4E3Y0jR5lO5hOqM8P5c8zJg/D0rT3g1L8W2oZ8N1e', 'SUPPLIER', '+91-9876543215'),
(201, 'Rajesh Street Foods',  'rajesh.vendor@gmail.com',     '$2a$10$wE/.7L3h08qB4E3Y0jR5lO5hOqM8P5c8zJg/D0rT3g1L8W2oZ8N1e', 'VENDOR',   '+91-9876500001'),
(202, 'Indore Chaat Bhandar', 'indore.chaat@gmail.com',      '$2a$10$wE/.7L3h08qB4E3Y0jR5lO5hOqM8P5c8zJg/D0rT3g1L8W2oZ8N1e', 'VENDOR',   '+91-9876500002'),
(203, 'Mumbai Vada Pav Co',   'mumbai.vadapav@yahoo.in',     '$2a$10$wE/.7L3h08qB4E3Y0jR5lO5hOqM8P5c8zJg/D0rT3g1L8W2oZ8N1e', 'VENDOR',   '+91-9876500003'),
(204, 'Local Cafe Corner',    'localcafe@outlook.com',        '$2a$10$wE/.7L3h08qB4E3Y0jR5lO5hOqM8P5c8zJg/D0rT3g1L8W2oZ8N1e', 'VENDOR',   '+91-9876500004')
ON CONFLICT (id) DO NOTHING;

-- Seed demo inventory (skipped if already present)
INSERT INTO inventory (id, product_name, category, quantity, price, location, expiry_date, supplier_name, supplier_email, status, supplier_phone) VALUES
(301, 'Red Tomatoes',            'Vegetables', 450,  18.50, 'Nashik Farms',         CURRENT_DATE + INTERVAL '4 days',  'Fresh Farms Produce', 'freshfarms@gmail.com',        'AVAILABLE', '+91-9876543210'),
(302, 'Nashik Onions (Surplus)', 'Vegetables', 1200, 14.00, 'Nashik Cold Storage',  CURRENT_DATE + INTERVAL '14 days', 'Premium Greens',      'premium.greens@fssai.in',     'AVAILABLE', '+91-9876543212'),
(303, 'Kufri Potatoes',          'Vegetables', 850,  12.00, 'Punjab Cold Storage',  CURRENT_DATE + INTERVAL '30 days', 'Punjab Cold Storage', 'punjabcoldstorage@gmail.com', 'AVAILABLE', '+91-9876543211'),
(304, 'Fresh Coriander',         'Vegetables', 50,   25.00, 'Azadpur Mandi, Delhi', CURRENT_DATE + INTERVAL '2 days',  'Delhi Mandi Traders', 'delhimandi@yahoo.in',         'AVAILABLE', '+91-9876543214'),
(305, 'Green Cabbage',           'Vegetables', 300,  10.00, 'Pune Farm Belt',        CURRENT_DATE + INTERVAL '5 days',  'Organic Mumbai',      'organic.mumbai@outlook.com',  'AVAILABLE', '+91-9876543213'),
(306, 'Juicy Lemons',            'Fruits',     120,  45.00, 'Nagpur Orchards',       CURRENT_DATE + INTERVAL '10 days', 'Quality Agro',        'quality.agro@domain.com',     'AVAILABLE', '+91-9876543215'),
(307, 'Green Chillies',          'Vegetables', 80,   22.00, 'Azadpur Mandi, Delhi', CURRENT_DATE + INTERVAL '4 days',  'Delhi Mandi Traders', 'delhimandi@yahoo.in',         'AVAILABLE', '+91-9876543214')
ON CONFLICT (id) DO NOTHING;

-- Seed demo bid requests (skipped if already present)
INSERT INTO bid_request (id, product_name, quantity, max_price, vendor_email, status, accepted_supplier_email) VALUES
(401, 'Bulk Tomatoes',          100, 20.00, 'rajesh.vendor@gmail.com', 'OPEN',   NULL),
(402, 'Potatoes for Samosas',   250, 15.00, 'indore.chaat@gmail.com',  'OPEN',   NULL),
(403, 'Fresh Coriander Leaves',  20, 30.00, 'mumbai.vadapav@yahoo.in', 'CLOSED', 'delhimandi@yahoo.in')
ON CONFLICT (id) DO NOTHING;

-- Seed demo bid offers (skipped if already present)
INSERT INTO bid_offer (id, bid_request_id, supplier_email, offered_price, status) VALUES
(501, 401, 'freshfarms@gmail.com',        19.00, 'PENDING'),
(502, 401, 'premium.greens@fssai.in',     18.50, 'PENDING'),
(503, 402, 'punjabcoldstorage@gmail.com', 12.50, 'PENDING'),
(504, 402, 'organic.mumbai@outlook.com',  14.00, 'PENDING'),
(505, 403, 'delhimandi@yahoo.in',         28.00, 'ACCEPTED')
ON CONFLICT (id) DO NOTHING;

-- Seed demo orders (skipped if already present)
INSERT INTO orders (id, product_name, quantity, price, vendor_email, supplier_email, status, created_at, order_date) VALUES
(601, 'Red Tomatoes',           50, 18.50, 'rajesh.vendor@gmail.com', 'freshfarms@gmail.com',        'DELIVERED', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(602, 'Kufri Potatoes',        100, 12.00, 'indore.chaat@gmail.com',  'punjabcoldstorage@gmail.com', 'PLACED',    CURRENT_TIMESTAMP,                     CURRENT_TIMESTAMP),
(603, 'Fresh Coriander Leaves', 20, 28.00, 'mumbai.vadapav@yahoo.in', 'delhimandi@yahoo.in',         'SHIPPED',   CURRENT_TIMESTAMP - INTERVAL '1 day',  CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Fix auto-increment sequences after manual ID inserts
SELECT setval(pg_get_serial_sequence('users',       'id'), COALESCE(MAX(id), 1)) FROM users;
SELECT setval(pg_get_serial_sequence('inventory',   'id'), COALESCE(MAX(id), 1)) FROM inventory;
SELECT setval(pg_get_serial_sequence('bid_request', 'id'), COALESCE(MAX(id), 1)) FROM bid_request;
SELECT setval(pg_get_serial_sequence('bid_offer',   'id'), COALESCE(MAX(id), 1)) FROM bid_offer;
SELECT setval(pg_get_serial_sequence('orders',      'id'), COALESCE(MAX(id), 1)) FROM orders;
