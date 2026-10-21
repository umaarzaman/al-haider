-- ============================================================
-- AL HAIDER FAST FOOD — Supabase Database Schema
-- Migration: 001_schema.sql
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ──────────────────────────────────────
-- CATEGORIES
-- ──────────────────────────────────────
create table if not exists categories (
  id          text primary key,
  name        text not null,
  slug        text not null unique,
  icon        text not null default '🍽️',
  display_order int not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ──────────────────────────────────────
-- PRODUCTS
-- ──────────────────────────────────────
create table if not exists products (
  id           text primary key,
  category_id  text not null references categories(id) on delete restrict,
  name         text not null,
  slug         text not null unique,
  description  text,
  image_url    text,
  active       boolean not null default true,
  needs_review boolean not null default false,
  tags         text[] default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ──────────────────────────────────────
-- PRODUCT VARIANTS (sizes, piece counts)
-- ──────────────────────────────────────
create table if not exists product_variants (
  id          text primary key,
  product_id  text not null references products(id) on delete cascade,
  label       text not null,    -- 'Small', 'Medium', 'Large', '5 Pieces', etc.
  price       int not null check (price >= 0),   -- price in PKR
  is_default  boolean not null default false,
  sort_order  int not null default 0
);

-- ──────────────────────────────────────
-- SETTINGS (delivery charge, hours, etc.)
-- ──────────────────────────────────────
create table if not exists settings (
  key   text primary key,
  value text not null
);

insert into settings (key, value) values
  ('delivery_charge', 'confirm_with_restaurant'),
  ('min_order', '0'),
  ('delivery_areas', 'To be confirmed'),
  ('opening_hours', 'To be confirmed'),
  ('phone', 'To be confirmed'),
  ('address', 'To be confirmed')
on conflict (key) do nothing;

-- ──────────────────────────────────────
-- ORDERS
-- ──────────────────────────────────────
create table if not exists orders (
  id              uuid primary key default uuid_generate_v4(),
  reference       text not null unique,
  customer_name   text not null,
  phone           text not null,
  address         text not null,
  landmark        text,
  instructions    text,
  order_type      text not null default 'delivery' check (order_type in ('delivery', 'pickup')),
  status          text not null default 'pending' check (
                    status in ('pending','confirmed','preparing','ready','out_for_delivery','delivered','cancelled')
                  ),
  payment_method  text not null default 'cash_on_delivery',
  subtotal        int not null check (subtotal >= 0),
  delivery_charge int,
  total           int not null check (total >= 0),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ──────────────────────────────────────
-- ORDER ITEMS
-- ──────────────────────────────────────
create table if not exists order_items (
  id            uuid primary key default uuid_generate_v4(),
  order_id      uuid not null references orders(id) on delete cascade,
  product_id    text not null,
  variant_id    text not null,
  name          text not null,
  variant_label text not null,
  unit_price    int not null check (unit_price >= 0),
  quantity      int not null check (quantity > 0),
  line_total    int not null check (line_total >= 0)
);

-- ──────────────────────────────────────
-- ADMIN USERS (links to auth.users)
-- ──────────────────────────────────────
create table if not exists admin_users (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- ──────────────────────────────────────
-- INDEXES
-- ──────────────────────────────────────
create index if not exists orders_reference_idx on orders(reference);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_created_at_idx on orders(created_at desc);
create index if not exists order_items_order_id_idx on order_items(order_id);
create index if not exists products_category_id_idx on products(category_id);

-- ──────────────────────────────────────
-- UPDATED_AT trigger
-- ──────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger orders_updated_at before update on orders
  for each row execute function update_updated_at();

create trigger products_updated_at before update on products
  for each row execute function update_updated_at();
