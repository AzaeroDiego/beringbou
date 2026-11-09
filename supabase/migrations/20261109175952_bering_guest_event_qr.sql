create schema if not exists bering_private;
revoke all on schema bering_private from public;
grant usage on schema bering_private to anon, authenticated;

create table bering_private.eventos (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  event_date date not null check (extract(isodow from event_date) = 6),
  full_name text not null check (char_length(full_name) between 1 and 80),
  birth_date date not null,
  phone text not null check (phone ~ '^9[0-9]{8}$'),
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table bering_private.eventos enable row level security;
revoke all on table bering_private.eventos from public, anon, authenticated;
create index eventos_phone_created_idx on bering_private.eventos (phone, created_at);
create index eventos_event_date_idx on bering_private.eventos (event_date);

create function bering_private.create_guest_qr(
  p_name text, p_birth_date date, p_phone text, p_expected_date date, p_request_id uuid, p_consent boolean
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  today date := (now() at time zone 'America/Lima')::date;
  saturday date := today + (6 - extract(dow from today)::integer);
  guest_name text := btrim(p_name);
  saved bering_private.eventos%rowtype;
begin
  if p_expected_date is distinct from saturday then
    raise exception 'guest_date_changed';
  end if;
  if p_consent is distinct from true or p_request_id is null or guest_name is null
    or char_length(guest_name) not between 1 and 80 or p_phone is null or p_phone !~ '^9[0-9]{8}$'
    or p_birth_date is null or not isfinite(p_birth_date) then
    raise exception 'guest_invalid_data';
  end if;
  if extract(year from age(today, p_birth_date)) < 18 then
    raise exception 'guest_underage';
  end if;

  perform pg_advisory_xact_lock(8291, hashtext(p_request_id::text));
  select * into saved from bering_private.eventos where request_id = p_request_id;
  if found then
    if (saved.full_name, saved.birth_date, saved.phone, saved.event_date)
      is distinct from (guest_name, p_birth_date, p_phone, saturday) then
      raise exception 'guest_invalid_data';
    end if;
  else
    perform pg_advisory_xact_lock(8292, hashtext(p_phone));
    if (select count(*) from bering_private.eventos where phone = p_phone and created_at > now() - interval '1 hour') >= 5 then
      raise exception 'rate_limit';
    end if;
    insert into bering_private.eventos (request_id, event_date, full_name, birth_date, phone)
    values (p_request_id, saturday, guest_name, p_birth_date, p_phone)
    returning * into saved;
  end if;

  return jsonb_build_object('code', 'BB1:' || saved.id::text, 'event_date', saved.event_date);
end;
$$;

create function public.bering_create_guest_qr(
  p_name text, p_birth_date date, p_phone text, p_expected_date date, p_request_id uuid, p_consent boolean
) returns jsonb
language sql
security invoker
set search_path = ''
as $$
  select bering_private.create_guest_qr(p_name, p_birth_date, p_phone, p_expected_date, p_request_id, p_consent);
$$;

revoke all on function bering_private.create_guest_qr(text,date,text,date,uuid,boolean),
  public.bering_create_guest_qr(text,date,text,date,uuid,boolean) from public, anon, authenticated;
grant execute on function bering_private.create_guest_qr(text,date,text,date,uuid,boolean),
  public.bering_create_guest_qr(text,date,text,date,uuid,boolean) to anon, authenticated;

notify pgrst, 'reload schema';
