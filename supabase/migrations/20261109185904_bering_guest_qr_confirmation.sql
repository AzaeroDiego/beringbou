alter table bering_private.eventos
  add column dni text check (dni ~ '^[0-9]{8}$'),
  add column chat_reference bigint generated always as identity unique,
  add column confirmed_at timestamptz,
  add column confirmed_by uuid,
  add constraint eventos_date_dni_key unique (event_date, dni),
  add constraint eventos_date_phone_key unique (event_date, phone);

create table bering_private.guest_event_settings (
  event_date date primary key check (extract(isodow from event_date) = 6),
  require_confirmation boolean not null
);
alter table bering_private.guest_event_settings enable row level security;
revoke all on bering_private.guest_event_settings from public, anon, authenticated;

create function bering_private.guest_qr_result(guest bering_private.eventos) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'code', 'BB1:' || guest.id,
    'reference', 'BB-' || guest.chat_reference,
    'event_date', guest.event_date,
    'status', case
      when guest.confirmed_at is not null then 'confirmed'
      when coalesce((select require_confirmation from bering_private.guest_event_settings where event_date = guest.event_date), true)
        then 'pending'
      else 'active'
    end
  );
$$;
revoke all on function bering_private.guest_qr_result(bering_private.eventos) from public, anon, authenticated;

create function bering_private.register_guest_qr(
  p_name text, p_birth_date date, p_phone text, p_dni text, p_expected_date date, p_request_id uuid, p_consent boolean
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  today date := (now() at time zone 'America/Lima')::date;
  saturday date := today + (6 - extract(dow from today)::integer);
  guest_name text := btrim(p_name);
  saved bering_private.eventos%rowtype;
begin
  if p_expected_date is distinct from saturday then raise exception 'guest_date_changed'; end if;
  if p_consent is distinct from true or p_request_id is null or guest_name is null
    or char_length(guest_name) not between 1 and 80 or p_phone is null or p_phone !~ '^9[0-9]{8}$'
    or p_dni is null or p_dni !~ '^[0-9]{8}$'
    or p_birth_date is null or not isfinite(p_birth_date) then raise exception 'guest_invalid_data'; end if;
  if extract(year from age(today, p_birth_date)) < 18 then raise exception 'guest_underage'; end if;

  insert into bering_private.eventos (request_id, event_date, full_name, birth_date, phone, dni)
  values (p_request_id, saturday, guest_name, p_birth_date, p_phone, p_dni)
  on conflict do nothing returning * into saved;
  if not found then
    select * into saved from bering_private.eventos where request_id = p_request_id;
    if not found or (saved.event_date, saved.full_name, saved.birth_date, saved.phone, saved.dni)
      is distinct from (saturday, guest_name, p_birth_date, p_phone, p_dni) then
      raise exception 'guest_duplicate';
    end if;
  end if;
  return bering_private.guest_qr_result(saved);
end;
$$;

create function bering_private.recover_guest_qr(p_receipt uuid) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  saved bering_private.eventos%rowtype;
  today date := (now() at time zone 'America/Lima')::date;
begin
  select * into saved from bering_private.eventos
  where request_id = p_receipt and event_date >= today - 1;
  if not found then raise exception 'guest_receipt_missing'; end if;
  return bering_private.guest_qr_result(saved);
end;
$$;

create function bering_private.admin_guest_qrs(
  p_date date, p_required boolean, p_confirm uuid
) returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  if not bering_private.is_admin() then raise exception 'not_authorized'; end if;
  if p_date is null or extract(isodow from p_date) is distinct from 6::numeric then
    raise exception 'guest_invalid_event_date';
  end if;
  if p_required is not null then
    insert into bering_private.guest_event_settings (event_date, require_confirmation)
    values (p_date, p_required)
    on conflict (event_date) do update set require_confirmation = excluded.require_confirmation;
  end if;
  if p_confirm is not null then
    update bering_private.eventos
    set confirmed_at = coalesce(confirmed_at, now()), confirmed_by = coalesce(confirmed_by, auth.uid())
    where id = p_confirm and event_date = p_date;
    if not found then raise exception 'guest_receipt_missing'; end if;
  end if;
  return jsonb_build_object(
    'required', coalesce((select require_confirmation from bering_private.guest_event_settings where event_date = p_date), true),
    'guests', coalesce((select jsonb_agg(
      bering_private.guest_qr_result(e) || jsonb_build_object('id', e.id, 'name', e.full_name, 'phone', e.phone)
      order by e.created_at desc
    ) from bering_private.eventos e where e.event_date = p_date), '[]'::jsonb)
  );
end;
$$;

create function public.bering_register_guest_qr(
  p_name text, p_birth_date date, p_phone text, p_dni text, p_expected_date date, p_request_id uuid, p_consent boolean
) returns jsonb language sql set search_path = '' as $$
  select bering_private.register_guest_qr(p_name, p_birth_date, p_phone, p_dni, p_expected_date, p_request_id, p_consent);
$$;

create function public.bering_recover_guest_qr(p_receipt uuid) returns jsonb
language sql stable set search_path = '' as $$
  select bering_private.recover_guest_qr(p_receipt);
$$;

create function public.bering_admin_guest_qrs(p_date date, p_required boolean, p_confirm uuid)
returns jsonb language sql set search_path = '' as $$
  select bering_private.admin_guest_qrs(p_date, p_required, p_confirm);
$$;

revoke all on function
  bering_private.create_guest_qr(text,date,text,date,uuid,boolean),
  public.bering_create_guest_qr(text,date,text,date,uuid,boolean),
  bering_private.register_guest_qr(text,date,text,text,date,uuid,boolean),
  public.bering_register_guest_qr(text,date,text,text,date,uuid,boolean),
  bering_private.recover_guest_qr(uuid), public.bering_recover_guest_qr(uuid),
  bering_private.admin_guest_qrs(date,boolean,uuid), public.bering_admin_guest_qrs(date,boolean,uuid)
from public, anon, authenticated;
grant execute on function
  bering_private.register_guest_qr(text,date,text,text,date,uuid,boolean),
  public.bering_register_guest_qr(text,date,text,text,date,uuid,boolean),
  bering_private.recover_guest_qr(uuid), public.bering_recover_guest_qr(uuid)
to anon, authenticated;
grant execute on function bering_private.admin_guest_qrs(date,boolean,uuid), public.bering_admin_guest_qrs(date,boolean,uuid)
to authenticated;
notify pgrst, 'reload schema';
