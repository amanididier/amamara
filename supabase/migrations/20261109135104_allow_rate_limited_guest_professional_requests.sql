alter table public.professional_requests alter column user_id drop not null;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table if not exists private.professional_request_rate_limits (
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists professional_request_rate_limits_lookup
  on private.professional_request_rate_limits (ip_hash, created_at desc);
revoke all on private.professional_request_rate_limits from public, anon, authenticated;
create or replace function public.submit_professional_request(
  p_brief jsonb,
  p_campaign jsonb default '{}'::jsonb,
  p_job_id uuid default null,
  p_assets jsonb default '[]'::jsonb,
  p_honeypot text default ''
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_method text;
  v_detail text;
  v_ip text;
  v_ip_hash text;
  v_count integer;
  v_row public.professional_requests;
  v_duration integer;
  v_assets jsonb := coalesce(p_assets, '[]'::jsonb);
  v_campaign jsonb := coalesce(p_campaign, '{}'::jsonb);
begin
  if coalesce(p_honeypot, '') <> '' then raise exception 'Unable to submit this request.'; end if;
  if p_brief is null or jsonb_typeof(p_brief) <> 'object' then raise exception 'Please complete your creative brief.'; end if;
  if octet_length(p_brief::text) > 16000 or octet_length(v_campaign::text) > 12000 then raise exception 'Your brief is too large. Please shorten it and try again.'; end if;
  if jsonb_typeof(v_assets) <> 'array' or jsonb_array_length(v_assets) > 8 then raise exception 'Please use up to eight reference images.'; end if;
  if length(trim(coalesce(p_brief->>'customerName',''))) not between 1 and 150
     or length(trim(coalesce(p_brief->>'business',''))) not between 1 and 4000
     or length(trim(coalesce(p_brief->>'objective',''))) not between 1 and 4000
     or length(trim(coalesce(p_brief->>'audience',''))) not between 1 and 4000
     or length(trim(coalesce(p_brief->>'message',''))) not between 1 and 4000
     or length(trim(coalesce(p_brief->>'scenes',''))) not between 1 and 4000
     or length(trim(coalesce(p_brief->>'style',''))) not between 1 and 4000
     or length(trim(coalesce(p_brief->>'deadline',''))) not between 1 and 100
     or length(trim(coalesce(p_brief->>'contactDetail',''))) not between 1 and 200 then raise exception 'Please complete all required fields.'; end if;
  if coalesce(p_brief->>'adType','') not in ('ugc','product','cinematic','flyer','banner','other')
     or coalesce(p_brief->>'duration','') not in ('10','15','30','60') then raise exception 'The selected advertisement format is not supported.'; end if;
  v_duration := (p_brief->>'duration')::integer;
  v_method := p_brief->>'contactMethod';
  v_detail := trim(p_brief->>'contactDetail');
  if v_method not in ('phone','whatsapp','email','instagram') then raise exception 'Choose a valid contact method.'; end if;
  if v_method = 'email' and v_detail !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' then raise exception 'Enter a valid email address.';
  elsif v_method in ('phone','whatsapp') and v_detail !~ '^\+?[0-9 ()-]{8,25}$' then raise exception 'Enter a valid phone number.';
  elsif v_method = 'instagram' and v_detail !~ '^@?[A-Za-z0-9_.]{1,30}$' then raise exception 'Enter a valid Instagram username.';
  end if;
  if jsonb_typeof(p_brief->'platforms') <> 'array'
     or jsonb_array_length(p_brief->'platforms') < 1
     or jsonb_array_length(p_brief->'platforms') > 10 then raise exception 'Choose at least one advertising platform.'; end if;
  if exists (select 1 from jsonb_array_elements(p_brief->'platforms') e where jsonb_typeof(e) <> 'string' or length(e#>>'{}') > 60) then raise exception 'One of the selected platforms is invalid.'; end if;
  if exists (select 1 from jsonb_array_elements(v_assets) a where
    v_user_id is null or coalesce(a->>'path','') not like v_user_id::text || '/%'
    or lower(coalesce(a->>'name','')) !~ '\.(jpg|jpeg|png|webp)$'
    or length(coalesce(a->>'name','')) > 200) then raise exception 'Reference images must belong to your signed-in account.'; end if;
  if p_job_id is not null then
    if v_user_id is null or not exists (select 1 from public.video_jobs j where j.id=p_job_id and j.user_id=v_user_id) then raise exception 'The linked video is not available to this account.'; end if;
  end if;
  v_ip := split_part(coalesce(current_setting('request.headers', true)::json->>'x-forwarded-for','unknown'), ',', 1);
  v_ip_hash := md5(coalesce(nullif(trim(v_ip),''),'unknown'));
  perform pg_advisory_xact_lock(hashtext(v_ip_hash));
  select count(*) into v_count from private.professional_request_rate_limits where ip_hash=v_ip_hash and created_at > now()-interval '10 minutes';
  if v_count >= 5 then raise exception 'Too many requests. Please try again in a little while.'; end if;
  insert into private.professional_request_rate_limits(ip_hash) values(v_ip_hash);
  insert into public.professional_requests (
    user_id, customer_name, ad_type, duration, contact_method, contact_detail,
    answers, campaign, related_job_id, assets, creative_brief
  ) values (
    v_user_id, trim(p_brief->>'customerName'), p_brief->>'adType', v_duration, v_method, v_detail,
    p_brief, v_campaign, p_job_id, v_assets,
    format(E'# Amamara creative brief\n\nCustomer: %s\nContact: %s (%s)\nBusiness: %s\nObjective: %s\nAudience: %s\nFormat: %s / %ss\nMessage: %s\nScenes: %s\nStyle: %s\nPlatforms: %s\nDeadline: %s\nAdditional direction: %s\nReferences: %s',
      trim(p_brief->>'customerName'),v_detail,v_method,trim(p_brief->>'business'),
      trim(p_brief->>'objective'),trim(p_brief->>'audience'),p_brief->>'adType',v_duration,
      trim(p_brief->>'message'),trim(p_brief->>'scenes'),trim(p_brief->>'style'),
      array_to_string(array(select jsonb_array_elements_text(p_brief->'platforms')),', '),
      trim(p_brief->>'deadline'),coalesce(p_brief->>'instructions',''),coalesce(p_brief->>'references',''))
  ) returning * into v_row;
  return jsonb_build_object('id',v_row.id,'reference',v_row.reference,'ad_type',v_row.ad_type,'duration',v_row.duration,'contact_method',v_row.contact_method,'created_at',v_row.created_at,'status',v_row.status);
end;
$$;
revoke all on function public.submit_professional_request(jsonb,jsonb,uuid,jsonb,text) from public;
grant execute on function public.submit_professional_request(jsonb,jsonb,uuid,jsonb,text) to anon, authenticated;