-- Demo data so you can SEE the app working immediately,
-- without needing Postman or creating anything by hand.
--
-- Run AFTER schema.sql:
--   psql -d ar_menu -f backend/src/db/seed.sql

-- A demo restaurant (slug = "demo" → visit /menu/demo)
INSERT INTO restaurants (name, slug, is_active)
VALUES ('Demo Bistro', 'demo', true)
ON CONFLICT (slug) DO NOTHING;

-- Three menu items linked to that restaurant
INSERT INTO menu_items (restaurant_id, name, description, price, image_url, model_url, sort_order)
SELECT
  r.id,
  v.name,
  v.description,
  v.price,
  v.image_url,
  v.model_url,
  v.sort_order
FROM restaurants r
CROSS JOIN (VALUES
  ('Grilled Salmon', 'Fresh Atlantic salmon with lemon butter.', 24.00,
   'https://modelviewer.dev/shared-assets/models/Astronaut.webp',
   'https://modelviewer.dev/shared-assets/models/Astronaut.glb', 0),
  ('Wagyu Burger', '200g wagyu patty, truffle mayo, brioche bun.', 18.00,
   'https://modelviewer.dev/shared-assets/models/reflective-sphere.webp',
   'https://modelviewer.dev/shared-assets/models/reflective-sphere.glb', 1),
  ('Margherita Pizza', 'San Marzano tomato, fresh mozzarella, basil.', 16.00,
   'https://modelviewer.dev/shared-assets/models/Astronaut.webp',
   'https://modelviewer.dev/shared-assets/models/Astronaut.glb', 2)
) AS v(name, description, price, image_url, model_url, sort_order)
WHERE r.slug = 'demo'
ON CONFLICT DO NOTHING;
