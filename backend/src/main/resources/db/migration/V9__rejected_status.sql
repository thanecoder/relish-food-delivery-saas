-- the approvals screen needs a "no" as well as a "yes", so restaurants and accounts can now be
-- REJECTED. the checks from V1 only knew the other three, so they get replaced.
alter table restaurants drop constraint restaurants_status_check;
alter table restaurants add constraint restaurants_status_check
    check (status in ('PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED'));

alter table users drop constraint users_status_check;
alter table users add constraint users_status_check
    check (status in ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'));

-- one rejected restaurant and one rejected rider so the history part of the screen has something
-- in it. the rejected restaurant stays out of the customer list like the pending one.
insert into users (id, email, name, role, status, terms_accepted_at, created_at, updated_at) values
    ('f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f001', 'owner@midnightmomos.relish.local', 'Midnight Momos Owner', 'RESTAURANT_ADMIN', 'REJECTED', now(), now(), now()),
    ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f101', 'chris.late@relish.local', 'Chris Latewalker', 'DELIVERY_PARTNER', 'REJECTED', now(), now(), now());

insert into restaurants (id, owner_user_id, name, description, cuisine_tags, address_line, city, status, created_at, updated_at) values
    ('f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f002', 'f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f001',
     'Midnight Momos', 'Dumplings out of a home kitchen, late night only.', 'Tibetan, Momos',
     '4 Back Alley', 'Springfield', 'REJECTED', now(), now());
