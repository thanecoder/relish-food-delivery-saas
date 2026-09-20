-- Baseline schema for all 11 entities in the architecture doc's Core Data Model.
-- Once this has run anywhere real, it is never edited — every later change is a new V2__, V3__... file.

create table users (
    id              uuid primary key,
    email           varchar(255) not null unique,
    phone           varchar(32),
    name            varchar(255) not null,
    role            varchar(32) not null check (role in ('CUSTOMER', 'RESTAURANT_ADMIN', 'DELIVERY_PARTNER', 'PLATFORM_ADMIN')),
    status          varchar(16) not null check (status in ('PENDING', 'ACTIVE', 'SUSPENDED')),
    created_at      timestamptz not null,
    updated_at      timestamptz not null
);

create table addresses (
    id              uuid primary key,
    user_id         uuid not null references users (id),
    label           varchar(64) not null,
    line1           varchar(255) not null,
    line2           varchar(255),
    city            varchar(120) not null,
    lat             double precision,
    lng             double precision,
    is_default      boolean not null default false,
    created_at      timestamptz not null,
    updated_at      timestamptz not null
);
create index idx_addresses_user_id on addresses (user_id);

create table restaurants (
    id              uuid primary key,
    owner_user_id   uuid not null unique references users (id),
    name            varchar(255) not null,
    description     varchar(1000),
    cuisine_tags    varchar(255),
    address_line    varchar(255) not null,
    city            varchar(120) not null,
    status          varchar(16) not null check (status in ('PENDING', 'APPROVED', 'SUSPENDED')),
    created_at      timestamptz not null,
    updated_at      timestamptz not null
);

create table menu_categories (
    id              uuid primary key,
    restaurant_id   uuid not null references restaurants (id),
    name            varchar(255) not null,
    sort_order      integer not null default 0,
    created_at      timestamptz not null,
    updated_at      timestamptz not null
);
create index idx_menu_categories_restaurant_id on menu_categories (restaurant_id);

create table menu_items (
    id              uuid primary key,
    category_id     uuid not null references menu_categories (id),
    name            varchar(255) not null,
    description     varchar(1000),
    price           numeric(10, 2) not null,
    is_veg          boolean not null default false,
    is_available    boolean not null default true,
    image_url       varchar(500),
    created_at      timestamptz not null,
    updated_at      timestamptz not null
);
create index idx_menu_items_category_id on menu_items (category_id);

create table orders (
    id                    uuid primary key,
    customer_id           uuid not null references users (id),
    restaurant_id         uuid not null references restaurants (id),
    delivery_address_id   uuid not null references addresses (id),
    status                varchar(32) not null check (status in
        ('PLACED', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REJECTED')),
    subtotal              numeric(10, 2) not null,
    delivery_fee          numeric(10, 2) not null,
    total                 numeric(10, 2) not null,
    created_at            timestamptz not null,
    updated_at            timestamptz not null
);
create index idx_orders_customer_id on orders (customer_id);
create index idx_orders_restaurant_id on orders (restaurant_id);

create table order_items (
    id              uuid primary key,
    order_id        uuid not null references orders (id),
    menu_item_id    uuid not null references menu_items (id),
    quantity        integer not null check (quantity > 0),
    unit_price      numeric(10, 2) not null,
    notes           varchar(500),
    created_at      timestamptz not null,
    updated_at      timestamptz not null
);
create index idx_order_items_order_id on order_items (order_id);

create table order_status_events (
    id                    uuid primary key,
    order_id              uuid not null references orders (id),
    status                varchar(32) not null,
    changed_by_user_id    uuid references users (id),
    created_at            timestamptz not null,
    updated_at            timestamptz not null
);
create index idx_order_status_events_order_id on order_status_events (order_id);

create table delivery_assignments (
    id                      uuid primary key,
    order_id                uuid not null unique references orders (id),
    delivery_partner_id     uuid not null references users (id),
    status                  varchar(16) not null check (status in ('ASSIGNED', 'PICKED_UP', 'DELIVERED')),
    picked_up_at            timestamptz,
    delivered_at            timestamptz,
    created_at              timestamptz not null,
    updated_at              timestamptz not null
);
create index idx_delivery_assignments_partner_id on delivery_assignments (delivery_partner_id);

create table otp_challenges (
    id              uuid primary key,
    identifier      varchar(255) not null,
    code_hash       varchar(255) not null,
    expires_at      timestamptz not null,
    attempts        integer not null default 0,
    consumed_at     timestamptz,
    requested_ip    varchar(64),
    created_at      timestamptz not null,
    updated_at      timestamptz not null
);
create index idx_otp_challenges_identifier on otp_challenges (identifier);

create table notifications (
    id              uuid primary key,
    user_id         uuid not null references users (id),
    type            varchar(64) not null,
    payload         varchar(2000),
    read_at         timestamptz,
    created_at      timestamptz not null,
    updated_at      timestamptz not null
);
create index idx_notifications_user_id on notifications (user_id);
