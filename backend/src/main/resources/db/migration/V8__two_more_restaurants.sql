-- two more so the restaurant list fills out two full rows of four. keep the approved count
-- even, a half empty last row looks broken. photos already exist under frontend/public/images.
-- local/exhibition only.

insert into users (id, email, name, role, status, terms_accepted_at, created_at, updated_at) values
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'owner@biryanihouse.relish.local', 'Biryani House Owner', 'RESTAURANT_ADMIN', 'ACTIVE', now(), now(), now()),
    ('cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd01', 'owner@casatacos.relish.local', 'Casa Tacos Owner', 'RESTAURANT_ADMIN', 'ACTIVE', now(), now(), now());

insert into restaurants (id, owner_user_id, name, description, cuisine_tags, address_line, city, status, opens_at, closes_at, image_url, created_at, updated_at) values
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01',
     'Biryani House', 'Dum biryani sealed and slow cooked, the Hyderabadi way.', 'Hyderabadi, Biryani',
     '33 Nizam Street', 'Springfield', 'APPROVED', '12:00', '23:00', '/images/restaurants/biryani-house.jpg', now(), now()),
    ('cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd02', 'cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd01',
     'Casa Tacos', 'Street style tacos, loud flavours, nothing fussy.', 'Mexican',
     '61 Plaza Road', 'Springfield', 'APPROVED', '12:00', '23:00', '/images/restaurants/casa-tacos.jpg', now(), now());

insert into menu_categories (id, restaurant_id, name, sort_order, created_at, updated_at) values
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'Biryani', 0, now(), now()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb04', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'Kebabs & Sides', 1, now(), now()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb05', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'Dessert', 2, now(), now()),
    ('cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd03', 'cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd02', 'Tacos & Wraps', 0, now(), now()),
    ('cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd04', 'cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd02', 'Nachos & Quesadillas', 1, now(), now()),
    ('cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd05', 'cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd02', 'Dessert', 2, now(), now());

insert into menu_items (id, category_id, name, description, price, is_veg, is_available, image_url, created_at, updated_at) values
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb11', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03', 'Hyderabadi Chicken Biryani', 'Long grain rice and chicken sealed in the pot and cooked on dum.', 340.00, false, true, '/images/food/hyderabadi-chicken-biryani.jpg', now(), now()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb12', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03', 'Veg Dum Biryani', 'Seasonal vegetables, saffron rice, fried onions.', 280.00, true, true, '/images/food/veg-dum-biryani.jpg', now(), now()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb13', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb04', 'Seekh Kebab', 'Minced meat, green chilli and herbs, grilled on skewers.', 260.00, false, true, '/images/food/seekh-kebab.jpg', now(), now()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb14', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb04', 'Boondi Raita', 'Cool yoghurt with crisp boondi, cumin and chilli.', 70.00, true, true, '/images/food/boondi-raita.jpg', now(), now()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb15', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb05', 'Kulfi', 'Dense, slow frozen milk dessert with pistachio.', 110.00, true, true, '/images/food/kulfi.jpg', now(), now()),
    ('cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd11', 'cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd03', 'Street Tacos', 'Three soft tortillas, grilled meat, onion, coriander and lime.', 240.00, false, true, '/images/food/street-tacos.jpg', now(), now()),
    ('cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd12', 'cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd03', 'Chicken Burrito', 'Grilled chicken, peppers and rice rolled up tight.', 290.00, false, true, '/images/food/chicken-burrito.jpg', now(), now()),
    ('cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd13', 'cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd04', 'Loaded Nachos', 'Crisp chips, cheese, jalapenos, olives, salsa.', 220.00, true, true, '/images/food/loaded-nachos.jpg', now(), now()),
    ('cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd14', 'cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd04', 'Cheese Quesadilla', 'Toasted tortilla, melted cheese, a little heat.', 210.00, true, true, '/images/food/cheese-quesadilla.jpg', now(), now()),
    ('cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd15', 'cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcd05', 'Churros with Chocolate', 'Cinnamon sugar churros and a cup of thick chocolate.', 160.00, true, true, '/images/food/churros-chocolate.jpg', now(), now());
