alter table public.ad_orders add column if not exists idempotency_key text;
create unique index if not exists ad_orders_user_idempotency_unique
  on public.ad_orders(user_id,idempotency_key) where idempotency_key is not null;
