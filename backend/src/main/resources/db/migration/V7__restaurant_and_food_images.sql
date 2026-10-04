-- photos live in the frontend under public/images, so these are plain site-relative paths.
-- restaurants never had an image column, menu_items already did.
-- nullable on purpose: restaurants that sign up later wont have one until they upload something.
alter table restaurants add column image_url varchar(500);

update restaurants set image_url = '/images/restaurants/tandoor-and-vine.jpg' where id = '11111111-1111-1111-1111-111111111102';
update restaurants set image_url = '/images/restaurants/bella-cucina.jpg' where id = '22222222-2222-2222-2222-222222222202';
update restaurants set image_url = '/images/restaurants/dosa-junction.jpg' where id = '66666666-6666-6666-6666-666666666602';
update restaurants set image_url = '/images/restaurants/wok-and-roll.jpg' where id = '77777777-7777-7777-7777-777777777702';
update restaurants set image_url = '/images/restaurants/smokehouse-burgers.jpg' where id = '88888888-8888-8888-8888-888888888802';
update restaurants set image_url = '/images/restaurants/sugar-and-spice.jpg' where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02';

-- menu item photos
update menu_items as m set image_url = '/images/food/' || v.slug || '.jpg'
from (values
    -- Tandoor & Vine
    ('11111111-1111-1111-1111-111111111105'::uuid, 'samosa'),
    ('11111111-1111-1111-1111-111111111106'::uuid, 'chicken-tikka'),
    ('11111111-1111-1111-1111-111111111107'::uuid, 'butter-chicken'),
    ('11111111-1111-1111-1111-111111111108'::uuid, 'paneer-tikka-masala'),
    ('11111111-1111-1111-1111-11111111111a'::uuid, 'butter-naan'),
    ('11111111-1111-1111-1111-11111111111b'::uuid, 'garlic-naan'),
    ('11111111-1111-1111-1111-11111111111c'::uuid, 'tandoori-roti'),
    ('11111111-1111-1111-1111-11111111111d'::uuid, 'sweet-lassi'),
    ('11111111-1111-1111-1111-11111111111e'::uuid, 'gulab-jamun'),
    -- Bella Cucina
    ('22222222-2222-2222-2222-222222222205'::uuid, 'bruschetta'),
    ('22222222-2222-2222-2222-222222222206'::uuid, 'caprese-salad'),
    ('22222222-2222-2222-2222-222222222207'::uuid, 'spaghetti-carbonara'),
    ('22222222-2222-2222-2222-222222222208'::uuid, 'pappardelle-funghi'),
    ('22222222-2222-2222-2222-22222222221a'::uuid, 'margherita'),
    ('22222222-2222-2222-2222-22222222221b'::uuid, 'diavola'),
    ('22222222-2222-2222-2222-22222222221c'::uuid, 'quattro-formaggi'),
    ('22222222-2222-2222-2222-22222222221d'::uuid, 'tiramisu'),
    ('22222222-2222-2222-2222-22222222221e'::uuid, 'panna-cotta'),
    -- Dosa Junction
    ('66666666-6666-6666-6666-666666666611'::uuid, 'masala-dosa'),
    ('66666666-6666-6666-6666-666666666612'::uuid, 'mysore-masala-dosa'),
    ('66666666-6666-6666-6666-666666666613'::uuid, 'paneer-dosa'),
    ('66666666-6666-6666-6666-666666666614'::uuid, 'rava-onion-dosa'),
    ('66666666-6666-6666-6666-666666666615'::uuid, 'idli'),
    ('66666666-6666-6666-6666-666666666616'::uuid, 'medu-vada'),
    ('66666666-6666-6666-6666-666666666617'::uuid, 'sambar-vada'),
    ('66666666-6666-6666-6666-666666666618'::uuid, 'filter-coffee'),
    ('66666666-6666-6666-6666-666666666619'::uuid, 'masala-chai'),
    -- Wok & Roll
    ('77777777-7777-7777-7777-777777777711'::uuid, 'veg-manchurian'),
    ('77777777-7777-7777-7777-777777777712'::uuid, 'chilli-chicken'),
    ('77777777-7777-7777-7777-777777777713'::uuid, 'veg-spring-rolls'),
    ('77777777-7777-7777-7777-777777777714'::uuid, 'hakka-noodles'),
    ('77777777-7777-7777-7777-777777777715'::uuid, 'schezwan-noodles'),
    ('77777777-7777-7777-7777-777777777716'::uuid, 'chicken-fried-rice'),
    -- Smokehouse Burgers
    ('88888888-8888-8888-8888-888888888811'::uuid, 'classic-smash-burger'),
    ('88888888-8888-8888-8888-888888888812'::uuid, 'spicy-chicken-burger'),
    ('88888888-8888-8888-8888-888888888813'::uuid, 'veggie-crunch-burger'),
    ('88888888-8888-8888-8888-888888888814'::uuid, 'peri-peri-fries'),
    ('88888888-8888-8888-8888-888888888815'::uuid, 'chocolate-shake'),
    -- Sugar & Spice
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa11'::uuid, 'chocolate-truffle-pastry'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa12'::uuid, 'red-velvet-slice'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa13'::uuid, 'blueberry-cheesecake'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa14'::uuid, 'gulab-jamun'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa15'::uuid, 'rasmalai')
) as v(id, slug)
where m.id = v.id;
