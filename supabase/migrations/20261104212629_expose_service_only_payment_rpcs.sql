create or replace function public.finalize_momo_payment(p_reference_id uuid,p_mtn_status text,p_financial_transaction_id text default null)
returns jsonb language sql security definer set search_path=''
as $$ select private.finalize_momo_payment(p_reference_id,p_mtn_status,p_financial_transaction_id); $$;
create or replace function public.debit_wallet_for_order(p_user_id uuid,p_order_id uuid)
returns jsonb language sql security definer set search_path=''
as $$ select private.debit_wallet_for_order(p_user_id,p_order_id); $$;
revoke all on function public.finalize_momo_payment(uuid,text,text) from public,anon,authenticated;
revoke all on function public.debit_wallet_for_order(uuid,uuid) from public,anon,authenticated;
grant execute on function public.finalize_momo_payment(uuid,text,text) to service_role;
grant execute on function public.debit_wallet_for_order(uuid,uuid) to service_role;
