-- ============================================================
-- AL HAIDER FAST FOOD — Row Level Security Policies
-- Migration: 002_rls.sql
-- ============================================================

-- ──────────────────────────────────────
-- Helper: is admin?
-- ──────────────────────────────────────
create or replace function is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from admin_users where id = auth.uid()
  );
$$;

-- ──────────────────────────────────────
-- CATEGORIES — public read, admin write
-- ──────────────────────────────────────
alter table categories enable row level security;

create policy "Public read categories"
  on categories for select using (active = true);

create policy "Admin full access categories"
  on categories for all using (is_admin());

-- ──────────────────────────────────────
-- PRODUCTS — public read active, admin all
-- ──────────────────────────────────────
alter table products enable row level security;

create policy "Public read active products"
  on products for select using (active = true);

create policy "Admin full access products"
  on products for all using (is_admin());

-- ──────────────────────────────────────
-- PRODUCT VARIANTS — public read, admin write
-- ──────────────────────────────────────
alter table product_variants enable row level security;

create policy "Public read variants"
  on product_variants for select using (true);

create policy "Admin full access variants"
  on product_variants for all using (is_admin());

-- ──────────────────────────────────────
-- SETTINGS — public read, admin write
-- ──────────────────────────────────────
alter table settings enable row level security;

create policy "Public read settings"
  on settings for select using (true);

create policy "Admin write settings"
  on settings for all using (is_admin());

-- ──────────────────────────────────────
-- ORDERS — customers insert their own,
--           customers select by reference,
--           admins see all
-- ──────────────────────────────────────
alter table orders enable row level security;

-- Anyone can insert a new order (placing an order)
create policy "Anyone can place order"
  on orders for insert with check (true);

-- Anyone can read an order by reference (for tracking)
-- This relies on the customer knowing their reference
create policy "Read own order by reference"
  on orders for select using (true);
  -- Note: In production, restrict further with a shared secret or auth

-- Only admins can update order status
create policy "Admin update order status"
  on orders for update using (is_admin());

-- Admins can delete (soft delete via status preferred)
create policy "Admin delete order"
  on orders for delete using (is_admin());

-- ──────────────────────────────────────
-- ORDER ITEMS — follow order access
-- ──────────────────────────────────────
alter table order_items enable row level security;

create policy "Anyone can insert order items"
  on order_items for insert with check (true);

create policy "Read order items"
  on order_items for select using (true);

create policy "Admin manage order items"
  on order_items for all using (is_admin());

-- ──────────────────────────────────────
-- ADMIN USERS — admin-only
-- ──────────────────────────────────────
alter table admin_users enable row level security;

create policy "Admin manage admin_users"
  on admin_users for all using (is_admin());

-- ──────────────────────────────────────
-- Enable realtime for orders (for live tracking)
-- ──────────────────────────────────────
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table orders;
commit;
