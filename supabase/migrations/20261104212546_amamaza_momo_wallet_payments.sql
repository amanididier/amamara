-- Amamaza MTN Collections + wallet ledger migration.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

create table public.wallet_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance_rwf bigint not null default 0 check (balance_rwf >= 0),
  sandbox_balance_rwf bigint not null default 0 check (sandbox_balance_rwf >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ad_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  service_type text not null check (service_type in ('video','flyer','banner','template')),
  details jsonb not null default '{}'::jsonb,
  amount_rwf bigint not null check (amount_rwf > 0 and amount_rwf < 5000000),
  status text not null default 'pending_payment' check (status in ('pending_payment','paid','paid_test','failed','cancelled')),
  is_test boolean not null default true,
  idempotency_key text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index ad_orders_user_created_idx on public.ad_orders(user_id,created_at desc);
create unique index ad_orders_user_idempotency_unique on public.ad_orders(user_id,idempotency_key) where idempotency_key is not null;

create table public.momo_payments (
  id uuid primary key default gen_random_uuid(),
  reference_id uuid not null unique,
  user_id uuid not null references auth.users(id) on delete restrict,
  order_id uuid references public.ad_orders(id) on delete restrict,
  kind text not null check (kind in ('wallet_topup','ad_order')),
  phone text not null check (phone ~ '^2507[0-9]{8}$'),
  amount_rwf bigint not null check (amount_rwf > 0 and amount_rwf < 5000000),
  mtn_amount numeric(12,2) not null check (mtn_amount > 0),
  currency text not null check (currency in ('EUR','RWF')),
  fee_rwf bigint not null default 0 check (fee_rwf >= 0),
  environment text not null check (environment in ('sandbox','production')),
  is_test boolean not null default true,
  status text not null default 'pending' check (status in ('pending','accepted','successful','failed','rejected','expired')),
  mtn_status text,
  external_id text not null unique,
  financial_transaction_id text,
  idempotency_key text,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  finalized_at timestamptz,
  constraint momo_payments_order_kind_check check (
    (kind='wallet_topup' and order_id is null) or (kind='ad_order' and order_id is not null)
  ),
  constraint momo_payments_idempotency_unique unique(user_id,idempotency_key)
);
create index momo_payments_user_created_idx on public.momo_payments(user_id,created_at desc);
create index momo_payments_pending_idx on public.momo_payments(status,created_at) where status in ('pending','accepted');
create index momo_payments_order_idx on public.momo_payments(order_id);

create table public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  payment_id uuid unique references public.momo_payments(id) on delete restrict,
  order_id uuid references public.ad_orders(id) on delete restrict,
  amount_rwf bigint not null check (amount_rwf <> 0),
  balance_after_rwf bigint,
  sandbox_balance_after_rwf bigint,
  is_test boolean not null default false,
  description text not null,
  created_at timestamptz not null default now(),
  constraint wallet_transactions_source_check check (
    (payment_id is not null and order_id is null) or (payment_id is null and order_id is not null)
  )
);
create unique index wallet_transactions_order_unique on public.wallet_transactions(order_id) where order_id is not null;
create index wallet_transactions_user_created_idx on public.wallet_transactions(user_id,created_at desc);

alter table public.wallet_accounts enable row level security;
alter table public.ad_orders enable row level security;
alter table public.momo_payments enable row level security;
alter table public.wallet_transactions enable row level security;
grant select on public.wallet_accounts,public.ad_orders,public.momo_payments,public.wallet_transactions to authenticated;
grant all on public.wallet_accounts,public.ad_orders,public.momo_payments,public.wallet_transactions to service_role;
create policy "Users can read their own wallet" on public.wallet_accounts for select to authenticated using ((select auth.uid())=user_id);
create policy "Users can read their own orders" on public.ad_orders for select to authenticated using ((select auth.uid())=user_id);
create policy "Users can read their own MoMo payments" on public.momo_payments for select to authenticated using ((select auth.uid())=user_id);
create policy "Users can read their own wallet transactions" on public.wallet_transactions for select to authenticated using ((select auth.uid())=user_id);

create or replace function private.finalize_momo_payment(p_reference_id uuid,p_mtn_status text,p_financial_transaction_id text default null)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_payment public.momo_payments%rowtype; v_balance bigint; v_test_balance bigint;
begin
  select * into v_payment from public.momo_payments where reference_id=p_reference_id for update;
  if not found then raise exception 'Payment not found'; end if;
  if v_payment.finalized_at is not null then return jsonb_build_object('ok',true,'already_finalized',true,'status',v_payment.status); end if;
  if upper(coalesce(p_mtn_status,''))='SUCCESSFUL' then
    if v_payment.kind='wallet_topup' then
      insert into public.wallet_accounts(user_id) values(v_payment.user_id) on conflict(user_id) do nothing;
      if v_payment.is_test then
        update public.wallet_accounts set sandbox_balance_rwf=sandbox_balance_rwf+v_payment.amount_rwf,updated_at=now()
        where user_id=v_payment.user_id returning sandbox_balance_rwf into v_test_balance;
        insert into public.wallet_transactions(user_id,payment_id,amount_rwf,sandbox_balance_after_rwf,is_test,description)
        values(v_payment.user_id,v_payment.id,v_payment.amount_rwf,v_test_balance,true,'MTN sandbox wallet top-up') on conflict(payment_id) do nothing;
      else
        update public.wallet_accounts set balance_rwf=balance_rwf+v_payment.amount_rwf,updated_at=now()
        where user_id=v_payment.user_id returning balance_rwf into v_balance;
        insert into public.wallet_transactions(user_id,payment_id,amount_rwf,balance_after_rwf,is_test,description)
        values(v_payment.user_id,v_payment.id,v_payment.amount_rwf,v_balance,false,'MTN wallet top-up') on conflict(payment_id) do nothing;
      end if;
    else
      update public.ad_orders set status=case when v_payment.is_test then 'paid_test' else 'paid' end,paid_at=now()
      where id=v_payment.order_id and user_id=v_payment.user_id;
      if not found then raise exception 'Related advertising order not found'; end if;
    end if;
    update public.momo_payments set status='successful',mtn_status='SUCCESSFUL',
      financial_transaction_id=coalesce(p_financial_transaction_id,financial_transaction_id),
      completed_at=now(),finalized_at=now(),updated_at=now(),failure_reason=null where id=v_payment.id;
    return jsonb_build_object('ok',true,'status','successful','is_test',v_payment.is_test);
  elsif upper(coalesce(p_mtn_status,'')) in ('FAILED','REJECTED','EXPIRED') then
    update public.momo_payments set status=case when upper(p_mtn_status)='EXPIRED' then 'expired' else 'failed' end,
      mtn_status=upper(p_mtn_status),completed_at=now(),finalized_at=now(),updated_at=now() where id=v_payment.id;
    if v_payment.order_id is not null then update public.ad_orders set status='failed'
      where id=v_payment.order_id and user_id=v_payment.user_id and status='pending_payment'; end if;
    return jsonb_build_object('ok',true,'status',lower(p_mtn_status));
  else
    update public.momo_payments set status='pending',mtn_status=upper(coalesce(p_mtn_status,'PENDING')),updated_at=now()
    where id=v_payment.id;
    return jsonb_build_object('ok',true,'status','pending');
  end if;
end;
$$;

create or replace function private.debit_wallet_for_order(p_user_id uuid,p_order_id uuid)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_order public.ad_orders%rowtype; v_balance bigint; v_test_balance bigint;
begin
  select * into v_order from public.ad_orders where id=p_order_id and user_id=p_user_id for update;
  if not found or v_order.status<>'pending_payment' then raise exception 'Order not available for wallet payment'; end if;
  insert into public.wallet_accounts(user_id) values(p_user_id) on conflict(user_id) do nothing;
  if v_order.is_test then
    update public.wallet_accounts set sandbox_balance_rwf=sandbox_balance_rwf-v_order.amount_rwf,updated_at=now()
      where user_id=p_user_id and sandbox_balance_rwf>=v_order.amount_rwf returning sandbox_balance_rwf into v_test_balance;
    if not found then raise exception 'Insufficient wallet balance'; end if;
    insert into public.wallet_transactions(user_id,order_id,amount_rwf,sandbox_balance_after_rwf,is_test,description)
      values(p_user_id,p_order_id,-v_order.amount_rwf,v_test_balance,true,'Sandbox advertising order paid from sandbox wallet')
      on conflict(order_id) where order_id is not null do nothing;
    update public.ad_orders set status='paid_test',paid_at=now() where id=p_order_id and user_id=p_user_id;
    return jsonb_build_object('ok',true,'status','paid_test','sandbox_balance_rwf',v_test_balance);
  else
    update public.wallet_accounts set balance_rwf=balance_rwf-v_order.amount_rwf,updated_at=now()
      where user_id=p_user_id and balance_rwf>=v_order.amount_rwf returning balance_rwf into v_balance;
    if not found then raise exception 'Insufficient wallet balance'; end if;
    insert into public.wallet_transactions(user_id,order_id,amount_rwf,balance_after_rwf,is_test,description)
      values(p_user_id,p_order_id,-v_order.amount_rwf,v_balance,false,'Advertising order paid from wallet')
      on conflict(order_id) where order_id is not null do nothing;
    update public.ad_orders set status='paid',paid_at=now() where id=p_order_id and user_id=p_user_id;
    return jsonb_build_object('ok',true,'status','paid','balance_rwf',v_balance);
  end if;
end;
$$;

create or replace function public.finalize_momo_payment(p_reference_id uuid,p_mtn_status text,p_financial_transaction_id text default null)
returns jsonb language sql security definer set search_path=''
as $$ select private.finalize_momo_payment(p_reference_id,p_mtn_status,p_financial_transaction_id); $$;
create or replace function public.debit_wallet_for_order(p_user_id uuid,p_order_id uuid)
returns jsonb language sql security definer set search_path=''
as $$ select private.debit_wallet_for_order(p_user_id,p_order_id); $$;

revoke all on function private.finalize_momo_payment(uuid,text,text) from public,anon,authenticated;
revoke all on function private.debit_wallet_for_order(uuid,uuid) from public,anon,authenticated;
revoke all on function public.finalize_momo_payment(uuid,text,text) from public,anon,authenticated;
revoke all on function public.debit_wallet_for_order(uuid,uuid) from public,anon,authenticated;
grant execute on function private.finalize_momo_payment(uuid,text,text) to service_role;
grant execute on function private.debit_wallet_for_order(uuid,uuid) to service_role;
grant execute on function public.finalize_momo_payment(uuid,text,text) to service_role;
grant execute on function public.debit_wallet_for_order(uuid,uuid) to service_role;
