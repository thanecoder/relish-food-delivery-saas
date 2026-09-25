-- demo data so the customer flow has something to actually browse. local/exhibition only.

insert into users (id, email, name, role, status, terms_accepted_at, created_at, updated_at) values
    ('11111111-1111-1111-1111-111111111101', 'owner@tandoorandvine.relish.local', 'Tandoor & Vine Owner', 'RESTAURANT_ADMIN', 'ACTIVE', now(), now(), now()),
    ('22222222-2222-2222-2222-222222222201', 'owner@bellacucina.relish.local', 'Bella Cucina Owner', 'RESTAURANT_ADMIN', 'ACTIVE', now(), now(), now()),
    ('33333333-3333-3333-3333-333333333301', 'admin@relish.local', 'Platform Admin', 'PLATFORM_ADMIN', 'ACTIVE', now(), now(), now());

insert into restaurants (id, owner_user_id, name, description, cuisine_tags, address_line, city, status, created_at, updated_at) values
    ('11111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111101',
     'Tandoor & Vine', 'North Indian classics, cooked in a real clay tandoor.', 'North Indian',
     '14 Curry Lane', 'Springfield', 'APPROVED', now(), now()),
    ('22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222201',
     'Bella Cucina', 'Family-run Italian, fresh pasta made daily.', 'Italian',
     '92 Trattoria Street', 'Springfield', 'APPROVED', now(), now());

insert into menu_categories (id, restaurant_id, name, sort_order, created_at, updated_at) values
    ('11111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111102', 'Starters', 0, now(), now()),
    ('11111111-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111102', 'Mains', 1, now(), now()),
    ('22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222202', 'Antipasti', 0, now(), now()),
    ('22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222202', 'Pasta', 1, now(), now());

insert into menu_items (id, category_id, name, description, price, is_veg, is_available, created_at, updated_at) values
    ('11111111-1111-1111-1111-111111111105', '11111111-1111-1111-1111-111111111103', 'Vegetable Samosa', 'Crisp pastry, spiced potato and pea filling.', 5.50, true, true, now(), now()),
    ('11111111-1111-1111-1111-111111111106', '11111111-1111-1111-1111-111111111103', 'Chicken Tikka', 'Marinated chicken, char-grilled in the tandoor.', 8.00, false, true, now(), now()),
    ('11111111-1111-1111-1111-111111111107', '11111111-1111-1111-1111-111111111104', 'Butter Chicken', 'Tomato and butter gravy, served with rice.', 14.50, false, true, now(), now()),
    ('11111111-1111-1111-1111-111111111108', '11111111-1111-1111-1111-111111111104', 'Paneer Tikka Masala', 'Grilled paneer in a spiced tomato gravy.', 13.00, true, true, now(), now()),
    ('22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222203', 'Bruschetta', 'Grilled bread, tomato, basil, olive oil.', 6.50, true, true, now(), now()),
    ('22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222203', 'Caprese Salad', 'Buffalo mozzarella, tomato, basil.', 8.50, true, true, now(), now()),
    ('22222222-2222-2222-2222-222222222207', '22222222-2222-2222-2222-222222222204', 'Spaghetti Carbonara', 'Egg, pecorino, guanciale, black pepper.', 15.00, false, true, now(), now()),
    ('22222222-2222-2222-2222-222222222208', '22222222-2222-2222-2222-222222222204', 'Pappardelle al Funghi', 'Wide ribbon pasta, wild mushroom sauce.', 14.00, true, true, now(), now());
