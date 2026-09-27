-- accounts for the login states V2 doesnt cover, otherwise theres no way to actually
-- see what a pending or suspended login does. local/exhibition only.

insert into users (id, email, name, role, status, terms_accepted_at, created_at, updated_at) values
    ('44444444-4444-4444-4444-444444444401', 'rider@relish.local', 'Sam Rider', 'DELIVERY_PARTNER', 'ACTIVE', now(), now(), now()),
    ('44444444-4444-4444-4444-444444444402', 'newrider@relish.local', 'Alex Waiting', 'DELIVERY_PARTNER', 'PENDING', now(), now(), now()),
    ('55555555-5555-5555-5555-555555555501', 'owner@spicegarden.relish.local', 'Spice Garden Owner', 'RESTAURANT_ADMIN', 'PENDING', now(), now(), now()),
    ('55555555-5555-5555-5555-555555555502', 'owner@closedkitchen.relish.local', 'Closed Kitchen Owner', 'RESTAURANT_ADMIN', 'SUSPENDED', now(), now(), now());

-- the pending owner's restaurant is waiting on approval too, so it stays out of the customer list
insert into restaurants (id, owner_user_id, name, description, cuisine_tags, address_line, city, status, created_at, updated_at) values
    ('55555555-5555-5555-5555-555555555503', '55555555-5555-5555-5555-555555555501',
     'Spice Garden', 'Sri Lankan home cooking, still getting set up.', 'Sri Lankan',
     '3 Cinnamon Road', 'Springfield', 'PENDING', now(), now());
