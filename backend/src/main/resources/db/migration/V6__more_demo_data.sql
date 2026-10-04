-- more demo data so the app doesnt look empty on a fresh clone: four more restaurants,
-- bigger menus for the first two, and a demo customer with some past orders so the order
-- history, the restaurant queue and the rider screen have something in them.
-- prices are rupees from the start this time. local/exhibition only.

insert into users (id, email, name, role, status, terms_accepted_at, created_at, updated_at) values
    ('66666666-6666-6666-6666-666666666601', 'owner@dosajunction.relish.local', 'Dosa Junction Owner', 'RESTAURANT_ADMIN', 'ACTIVE', now(), now(), now()),
    ('77777777-7777-7777-7777-777777777701', 'owner@wokandroll.relish.local', 'Wok & Roll Owner', 'RESTAURANT_ADMIN', 'ACTIVE', now(), now(), now()),
    ('88888888-8888-8888-8888-888888888801', 'owner@smokehouse.relish.local', 'Smokehouse Owner', 'RESTAURANT_ADMIN', 'ACTIVE', now(), now(), now()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', 'owner@sugarandspice.relish.local', 'Sugar & Spice Owner', 'RESTAURANT_ADMIN', 'ACTIVE', now(), now(), now()),
    ('cccccccc-cccc-cccc-cccc-cccccccccc01', 'demo@relish.local', 'Demo Customer', 'CUSTOMER', 'ACTIVE', now() - interval '20 days', now() - interval '20 days', now() - interval '20 days');

insert into restaurants (id, owner_user_id, name, description, cuisine_tags, address_line, city, status, opens_at, closes_at, created_at, updated_at) values
    ('66666666-6666-6666-6666-666666666602', '66666666-6666-6666-6666-666666666601',
     'Dosa Junction', 'Crisp dosas and soft idlis, the way a South Indian breakfast is meant to be.', 'South Indian',
     '21 Temple Road', 'Springfield', 'APPROVED', '07:30', '21:30', now(), now()),
    ('77777777-7777-7777-7777-777777777702', '77777777-7777-7777-7777-777777777701',
     'Wok & Roll', 'Indo-Chinese street food, fast and a little too spicy.', 'Indo-Chinese',
     '8 Lantern Lane', 'Springfield', 'APPROVED', '12:00', '23:30', now(), now()),
    ('88888888-8888-8888-8888-888888888802', '88888888-8888-8888-8888-888888888801',
     'Smokehouse Burgers', 'Smashed patties, toasted buns, proper fries.', 'American, Burgers',
     '5 Harbour Street', 'Springfield', 'APPROVED', '11:00', '23:30', now(), now()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01',
     'Sugar & Spice', 'Small bakery. Cakes, pastries and the mithai your family keeps asking for.', 'Bakery, Desserts',
     '17 Baker Row', 'Springfield', 'APPROVED', '09:00', '21:00', now(), now());

-- extra categories for the two restaurants from V2
insert into menu_categories (id, restaurant_id, name, sort_order, created_at, updated_at) values
    ('11111111-1111-1111-1111-111111111109', '11111111-1111-1111-1111-111111111102', 'Breads', 2, now(), now()),
    ('11111111-1111-1111-1111-11111111110a', '11111111-1111-1111-1111-111111111102', 'Drinks & Desserts', 3, now(), now()),
    ('22222222-2222-2222-2222-222222222209', '22222222-2222-2222-2222-222222222202', 'Pizza', 2, now(), now()),
    ('22222222-2222-2222-2222-22222222220a', '22222222-2222-2222-2222-222222222202', 'Dolci', 3, now(), now()),
    ('66666666-6666-6666-6666-666666666603', '66666666-6666-6666-6666-666666666602', 'Dosas', 0, now(), now()),
    ('66666666-6666-6666-6666-666666666604', '66666666-6666-6666-6666-666666666602', 'Idli & Vada', 1, now(), now()),
    ('66666666-6666-6666-6666-666666666605', '66666666-6666-6666-6666-666666666602', 'Beverages', 2, now(), now()),
    ('77777777-7777-7777-7777-777777777703', '77777777-7777-7777-7777-777777777702', 'Starters', 0, now(), now()),
    ('77777777-7777-7777-7777-777777777704', '77777777-7777-7777-7777-777777777702', 'Noodles & Rice', 1, now(), now()),
    ('88888888-8888-8888-8888-888888888803', '88888888-8888-8888-8888-888888888802', 'Burgers', 0, now(), now()),
    ('88888888-8888-8888-8888-888888888804', '88888888-8888-8888-8888-888888888802', 'Sides & Shakes', 1, now(), now()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', 'Cakes & Pastries', 0, now(), now()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa04', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', 'Mithai', 1, now(), now());

insert into menu_items (id, category_id, name, description, price, is_veg, is_available, created_at, updated_at) values
    -- Tandoor & Vine
    ('11111111-1111-1111-1111-11111111111a', '11111111-1111-1111-1111-111111111109', 'Butter Naan', 'Soft tandoor-baked bread, brushed with butter.', 60.00, true, true, now(), now()),
    ('11111111-1111-1111-1111-11111111111b', '11111111-1111-1111-1111-111111111109', 'Garlic Naan', 'Naan with roasted garlic and coriander.', 70.00, true, true, now(), now()),
    ('11111111-1111-1111-1111-11111111111c', '11111111-1111-1111-1111-111111111109', 'Tandoori Roti', 'Whole wheat, straight from the clay oven.', 40.00, true, true, now(), now()),
    ('11111111-1111-1111-1111-11111111111d', '11111111-1111-1111-1111-11111111110a', 'Sweet Lassi', 'Thick, chilled, topped with a little malai.', 90.00, true, true, now(), now()),
    ('11111111-1111-1111-1111-11111111111e', '11111111-1111-1111-1111-11111111110a', 'Gulab Jamun', 'Two warm dumplings in cardamom syrup.', 100.00, true, true, now(), now()),
    -- Bella Cucina
    ('22222222-2222-2222-2222-22222222221a', '22222222-2222-2222-2222-222222222209', 'Margherita', 'Tomato, mozzarella, basil, a good crust.', 320.00, true, true, now(), now()),
    ('22222222-2222-2222-2222-22222222221b', '22222222-2222-2222-2222-222222222209', 'Diavola', 'Spicy salami, chilli oil, mozzarella.', 380.00, false, true, now(), now()),
    ('22222222-2222-2222-2222-22222222221c', '22222222-2222-2222-2222-222222222209', 'Quattro Formaggi', 'Mozzarella, gorgonzola, parmesan, fontina.', 400.00, true, true, now(), now()),
    ('22222222-2222-2222-2222-22222222221d', '22222222-2222-2222-2222-22222222220a', 'Tiramisu', 'Espresso-soaked sponge, mascarpone, cocoa.', 240.00, true, true, now(), now()),
    ('22222222-2222-2222-2222-22222222221e', '22222222-2222-2222-2222-22222222220a', 'Panna Cotta', 'Vanilla cream with a berry compote.', 200.00, true, true, now(), now()),
    -- Dosa Junction
    ('66666666-6666-6666-6666-666666666611', '66666666-6666-6666-6666-666666666603', 'Masala Dosa', 'Crisp rice crepe, spiced potato filling.', 140.00, true, true, now(), now()),
    ('66666666-6666-6666-6666-666666666612', '66666666-6666-6666-6666-666666666603', 'Mysore Masala Dosa', 'Red chutney spread inside, extra crisp.', 160.00, true, true, now(), now()),
    ('66666666-6666-6666-6666-666666666613', '66666666-6666-6666-6666-666666666603', 'Paneer Dosa', 'Dosa stuffed with spiced paneer bhurji.', 180.00, true, true, now(), now()),
    ('66666666-6666-6666-6666-666666666614', '66666666-6666-6666-6666-666666666603', 'Rava Onion Dosa', 'Lacy semolina dosa with onions and green chilli.', 150.00, true, true, now(), now()),
    ('66666666-6666-6666-6666-666666666615', '66666666-6666-6666-6666-666666666604', 'Idli (2 pcs)', 'Steamed rice cakes with sambar and chutneys.', 80.00, true, true, now(), now()),
    ('66666666-6666-6666-6666-666666666616', '66666666-6666-6666-6666-666666666604', 'Medu Vada (2 pcs)', 'Crisp outside, soft inside, with sambar.', 90.00, true, true, now(), now()),
    ('66666666-6666-6666-6666-666666666617', '66666666-6666-6666-6666-666666666604', 'Sambar Vada', 'Vada soaked in hot sambar, finished with onion.', 110.00, true, true, now(), now()),
    ('66666666-6666-6666-6666-666666666618', '66666666-6666-6666-6666-666666666605', 'Filter Coffee', 'Strong decoction, hot milk, brass tumbler vibes.', 60.00, true, true, now(), now()),
    ('66666666-6666-6666-6666-666666666619', '66666666-6666-6666-6666-666666666605', 'Masala Chai', 'Ginger and cardamom, properly stewed.', 50.00, true, true, now(), now()),
    -- Wok & Roll
    ('77777777-7777-7777-7777-777777777711', '77777777-7777-7777-7777-777777777703', 'Veg Manchurian', 'Crisp vegetable dumplings in a garlicky soy gravy.', 190.00, true, true, now(), now()),
    ('77777777-7777-7777-7777-777777777712', '77777777-7777-7777-7777-777777777703', 'Chilli Chicken', 'Wok-tossed chicken, peppers, green chilli.', 240.00, false, true, now(), now()),
    ('77777777-7777-7777-7777-777777777713', '77777777-7777-7777-7777-777777777703', 'Veg Spring Rolls', 'Crunchy rolls with a sweet chilli dip.', 160.00, true, true, now(), now()),
    ('77777777-7777-7777-7777-777777777714', '77777777-7777-7777-7777-777777777704', 'Hakka Noodles', 'Thin noodles, cabbage, carrot, spring onion.', 200.00, true, true, now(), now()),
    ('77777777-7777-7777-7777-777777777715', '77777777-7777-7777-7777-777777777704', 'Schezwan Noodles', 'Same noodles, a lot more heat.', 220.00, true, true, now(), now()),
    ('77777777-7777-7777-7777-777777777716', '77777777-7777-7777-7777-777777777704', 'Chicken Fried Rice', 'Egg, chicken, wok hei, nothing fancy.', 260.00, false, true, now(), now()),
    -- Smokehouse Burgers
    ('88888888-8888-8888-8888-888888888811', '88888888-8888-8888-8888-888888888803', 'Classic Smash Burger', 'Two smashed patties, cheddar, pickles, house sauce.', 249.00, false, true, now(), now()),
    ('88888888-8888-8888-8888-888888888812', '88888888-8888-8888-8888-888888888803', 'Spicy Chicken Burger', 'Crispy chicken thigh, jalapeno slaw, sriracha mayo.', 279.00, false, true, now(), now()),
    ('88888888-8888-8888-8888-888888888813', '88888888-8888-8888-8888-888888888803', 'Veggie Crunch Burger', 'Potato and corn patty, lettuce, tomato, mint mayo.', 219.00, true, true, now(), now()),
    ('88888888-8888-8888-8888-888888888814', '88888888-8888-8888-8888-888888888804', 'Peri Peri Fries', 'Skin-on fries tossed in peri peri salt.', 129.00, true, true, now(), now()),
    ('88888888-8888-8888-8888-888888888815', '88888888-8888-8888-8888-888888888804', 'Chocolate Shake', 'Thick, cold, made with real ice cream.', 169.00, true, true, now(), now()),
    -- Sugar & Spice
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa11', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03', 'Chocolate Truffle Pastry', 'Dark chocolate ganache, soft sponge.', 130.00, true, true, now(), now()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa12', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03', 'Red Velvet Slice', 'Cream cheese frosting, not too sweet.', 150.00, true, true, now(), now()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa13', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03', 'Blueberry Cheesecake', 'Baked, creamy, blueberry compote on top.', 190.00, true, true, now(), now()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa14', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa04', 'Gulab Jamun (2 pcs)', 'Warm, soft, soaked through.', 90.00, true, true, now(), now()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa15', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa04', 'Rasmalai (2 pcs)', 'Chilled paneer discs in saffron milk.', 120.00, true, true, now(), now());

-- demo customer's addresses
insert into addresses (id, user_id, label, line1, line2, city, is_default, created_at, updated_at) values
    ('cccccccc-cccc-cccc-cccc-cccccccccc02', 'cccccccc-cccc-cccc-cccc-cccccccccc01', 'Home', '12 Orchard Avenue', 'Apt 4B', 'Springfield', true, now() - interval '20 days', now() - interval '20 days'),
    ('cccccccc-cccc-cccc-cccc-cccccccccc03', 'cccccccc-cccc-cccc-cccc-cccccccccc01', 'Work', '88 Tech Park Road', 'Block C', 'Springfield', false, now() - interval '20 days', now() - interval '20 days');

-- four past orders for the demo customer. totals are subtotal + the flat 49.00 delivery fee.
-- three delivered by Sam Rider, one that the restaurant rejected.
insert into orders (id, customer_id, restaurant_id, delivery_address_id, status, subtotal, delivery_fee, total, created_at, updated_at) values
    ('dddddddd-dddd-dddd-dddd-dddddddddd01', 'cccccccc-cccc-cccc-cccc-cccccccccc01', '11111111-1111-1111-1111-111111111102', 'cccccccc-cccc-cccc-cccc-cccccccccc02',
     'DELIVERED', 440.00, 49.00, 489.00, now() - interval '12 days' + interval '19 hours 20 minutes', now() - interval '12 days' + interval '20 hours 25 minutes'),
    ('dddddddd-dddd-dddd-dddd-dddddddddd02', 'cccccccc-cccc-cccc-cccc-cccccccccc01', '88888888-8888-8888-8888-888888888802', 'cccccccc-cccc-cccc-cccc-cccccccccc02',
     'REJECTED', 378.00, 49.00, 427.00, now() - interval '9 days' + interval '13 hours 5 minutes', now() - interval '9 days' + interval '13 hours 9 minutes'),
    ('dddddddd-dddd-dddd-dddd-dddddddddd03', 'cccccccc-cccc-cccc-cccc-cccccccccc01', '22222222-2222-2222-2222-222222222202', 'cccccccc-cccc-cccc-cccc-cccccccccc02',
     'DELIVERED', 560.00, 49.00, 609.00, now() - interval '6 days' + interval '20 hours 10 minutes', now() - interval '6 days' + interval '21 hours 15 minutes'),
    ('dddddddd-dddd-dddd-dddd-dddddddddd04', 'cccccccc-cccc-cccc-cccc-cccccccccc01', '66666666-6666-6666-6666-666666666602', 'cccccccc-cccc-cccc-cccc-cccccccccc03',
     'DELIVERED', 400.00, 49.00, 449.00, now() - interval '2 days' + interval '12 hours 40 minutes', now() - interval '2 days' + interval '13 hours 45 minutes');

insert into order_items (id, order_id, menu_item_id, quantity, unit_price, notes, created_at, updated_at) values
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'dddddddd-dddd-dddd-dddd-dddddddddd01', '11111111-1111-1111-1111-111111111107', 1, 320.00, null, now() - interval '12 days' + interval '19 hours 20 minutes', now() - interval '12 days' + interval '19 hours 20 minutes'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'dddddddd-dddd-dddd-dddd-dddddddddd01', '11111111-1111-1111-1111-11111111111a', 2, 60.00, null, now() - interval '12 days' + interval '19 hours 20 minutes', now() - interval '12 days' + interval '19 hours 20 minutes'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03', 'dddddddd-dddd-dddd-dddd-dddddddddd02', '88888888-8888-8888-8888-888888888811', 1, 249.00, null, now() - interval '9 days' + interval '13 hours 5 minutes', now() - interval '9 days' + interval '13 hours 5 minutes'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee04', 'dddddddd-dddd-dddd-dddd-dddddddddd02', '88888888-8888-8888-8888-888888888814', 1, 129.00, null, now() - interval '9 days' + interval '13 hours 5 minutes', now() - interval '9 days' + interval '13 hours 5 minutes'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee05', 'dddddddd-dddd-dddd-dddd-dddddddddd03', '22222222-2222-2222-2222-22222222221a', 1, 320.00, 'light on the basil', now() - interval '6 days' + interval '20 hours 10 minutes', now() - interval '6 days' + interval '20 hours 10 minutes'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee06', 'dddddddd-dddd-dddd-dddd-dddddddddd03', '22222222-2222-2222-2222-22222222221d', 1, 240.00, null, now() - interval '6 days' + interval '20 hours 10 minutes', now() - interval '6 days' + interval '20 hours 10 minutes'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee07', 'dddddddd-dddd-dddd-dddd-dddddddddd04', '66666666-6666-6666-6666-666666666611', 2, 140.00, 'extra crisp please', now() - interval '2 days' + interval '12 hours 40 minutes', now() - interval '2 days' + interval '12 hours 40 minutes'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee08', 'dddddddd-dddd-dddd-dddd-dddddddddd04', '66666666-6666-6666-6666-666666666618', 2, 60.00, null, now() - interval '2 days' + interval '12 hours 40 minutes', now() - interval '2 days' + interval '12 hours 40 minutes');

-- status history. the customer places it, the restaurant owner moves it along, and the
-- last two steps (out for delivery, delivered) come from the rider so changed_by stays null,
-- same as what the app does.
insert into order_status_events (id, order_id, status, changed_by_user_id, created_at, updated_at)
select gen_random_uuid(), o.id, e.status, e.actor, o.created_at + e.after, o.created_at + e.after
from orders o
join (values
    ('PLACED',           'cccccccc-cccc-cccc-cccc-cccccccccc01'::uuid, interval '0 minutes'),
    ('ACCEPTED',         '11111111-1111-1111-1111-111111111101'::uuid, interval '3 minutes'),
    ('PREPARING',        '11111111-1111-1111-1111-111111111101'::uuid, interval '6 minutes'),
    ('READY_FOR_PICKUP', '11111111-1111-1111-1111-111111111101'::uuid, interval '28 minutes'),
    ('OUT_FOR_DELIVERY', null::uuid,                                   interval '40 minutes'),
    ('DELIVERED',        null::uuid,                                   interval '62 minutes')
) as e(status, actor, after) on true
where o.id = 'dddddddd-dddd-dddd-dddd-dddddddddd01';

insert into order_status_events (id, order_id, status, changed_by_user_id, created_at, updated_at)
select gen_random_uuid(), o.id, e.status, e.actor, o.created_at + e.after, o.created_at + e.after
from orders o
join (values
    ('PLACED',   'cccccccc-cccc-cccc-cccc-cccccccccc01'::uuid, interval '0 minutes'),
    ('REJECTED', '88888888-8888-8888-8888-888888888801'::uuid, interval '4 minutes')
) as e(status, actor, after) on true
where o.id = 'dddddddd-dddd-dddd-dddd-dddddddddd02';

insert into order_status_events (id, order_id, status, changed_by_user_id, created_at, updated_at)
select gen_random_uuid(), o.id, e.status, e.actor, o.created_at + e.after, o.created_at + e.after
from orders o
join (values
    ('PLACED',           'cccccccc-cccc-cccc-cccc-cccccccccc01'::uuid, interval '0 minutes'),
    ('ACCEPTED',         '22222222-2222-2222-2222-222222222201'::uuid, interval '2 minutes'),
    ('PREPARING',        '22222222-2222-2222-2222-222222222201'::uuid, interval '5 minutes'),
    ('READY_FOR_PICKUP', '22222222-2222-2222-2222-222222222201'::uuid, interval '30 minutes'),
    ('OUT_FOR_DELIVERY', null::uuid,                                   interval '41 minutes'),
    ('DELIVERED',        null::uuid,                                   interval '65 minutes')
) as e(status, actor, after) on true
where o.id = 'dddddddd-dddd-dddd-dddd-dddddddddd03';

insert into order_status_events (id, order_id, status, changed_by_user_id, created_at, updated_at)
select gen_random_uuid(), o.id, e.status, e.actor, o.created_at + e.after, o.created_at + e.after
from orders o
join (values
    ('PLACED',           'cccccccc-cccc-cccc-cccc-cccccccccc01'::uuid, interval '0 minutes'),
    ('ACCEPTED',         '66666666-6666-6666-6666-666666666601'::uuid, interval '2 minutes'),
    ('PREPARING',        '66666666-6666-6666-6666-666666666601'::uuid, interval '4 minutes'),
    ('READY_FOR_PICKUP', '66666666-6666-6666-6666-666666666601'::uuid, interval '24 minutes'),
    ('OUT_FOR_DELIVERY', null::uuid,                                   interval '35 minutes'),
    ('DELIVERED',        null::uuid,                                   interval '58 minutes')
) as e(status, actor, after) on true
where o.id = 'dddddddd-dddd-dddd-dddd-dddddddddd04';

insert into delivery_assignments (id, order_id, delivery_partner_id, status, picked_up_at, delivered_at, created_at, updated_at)
select gen_random_uuid(), o.id, '44444444-4444-4444-4444-444444444401', 'DELIVERED',
       o.created_at + interval '40 minutes', o.created_at + interval '62 minutes',
       o.created_at + interval '28 minutes', o.created_at + interval '62 minutes'
from orders o
where o.id in ('dddddddd-dddd-dddd-dddd-dddddddddd01', 'dddddddd-dddd-dddd-dddd-dddddddddd03', 'dddddddd-dddd-dddd-dddd-dddddddddd04');
