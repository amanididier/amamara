revoke all privileges on table public.wallet_accounts, public.wallet_transactions, public.momo_payments, public.ad_orders from anon, authenticated;
grant select on table public.wallet_accounts, public.wallet_transactions, public.momo_payments, public.ad_orders to authenticated;
grant all privileges on table public.wallet_accounts, public.wallet_transactions, public.momo_payments, public.ad_orders to service_role;
