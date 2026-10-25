begin;
create schema if not exists bering_private;
revoke all on schema bering_private from public;
grant usage on schema bering_private to anon, authenticated;

create table public.bering_analytics_events (
 id uuid primary key, session_id uuid not null, occurred_at timestamptz not null default now(),
 name text not null check (name in ('page_view','section_view','box_select','form_start','request_submitted','whatsapp_click','scroll_depth')),
 page text not null check (page in ('/','/cumple/')),
 source text not null check (source in ('direct','facebook','instagram','whatsapp','google','other')),
 campaign text check (campaign ~ '^[a-zA-Z0-9_-]{1,64}$'),
 event_slug text check (event_slug is null or event_slug = 'halloween-2026'),
 section text check (section in ('inicio','evento','boxes','cumple','visitanos')),
 box_id smallint check (box_id between 1 and 10), depth smallint check (depth in (25,50,75,100))
);
create index bering_analytics_time on public.bering_analytics_events (occurred_at desc);
create index bering_analytics_session_time on public.bering_analytics_events (session_id, occurred_at desc);

create table public.bering_events (
 slug text primary key, title text not null, event_date date not null, active boolean not null default true
);
insert into public.bering_events values ('halloween-2026','Los cuentos de la cripta · El Chombo','2026-10-31',true);
create table public.bering_boxes (
 id smallint primary key check (id between 1 and 10), package text not null check (package in ('red','black')),
 price integer not null check (price > 0)
);
insert into public.bering_boxes select n, case when n in (1,2,6,7) then 'black' else 'red' end, case when n in (1,2,6,7) then 320 else 270 end from generate_series(1,10) n;
create table public.bering_requests (
 id uuid primary key, session_id uuid not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 kind text not null check (kind in ('box','birthday')), event_slug text references public.bering_events(slug),
 box_id smallint references public.bering_boxes(id), celebration_date date not null,
 name text not null check (length(btrim(name)) between 1 and 80), phone text not null check (phone ~ '^9[0-9]{8}$'),
 guests smallint not null check (guests between 1 and 100),
 status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
 privacy_version text not null default '2026-10-25',
 check ((kind = 'box' and event_slug is not null and box_id is not null) or (kind = 'birthday' and event_slug is null and box_id is null))
);
create index bering_requests_created on public.bering_requests (created_at desc);
create index bering_requests_session_created on public.bering_requests (session_id, created_at desc);
create index bering_requests_box on public.bering_requests (box_id);
create unique index bering_one_confirmed_box on public.bering_requests(event_slug,box_id) where status='confirmed' and box_id is not null;
create table bering_private.admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table bering_private.admins enable row level security;
revoke all on table bering_private.admins from public,anon,authenticated;

alter table public.bering_analytics_events enable row level security;
alter table public.bering_requests enable row level security;
alter table public.bering_events enable row level security;
alter table public.bering_boxes enable row level security;
revoke all on table public.bering_analytics_events,public.bering_requests,public.bering_events,public.bering_boxes from anon,authenticated;
-- Public reads are restricted to catalogues, never names, phones or analytics.
grant select on public.bering_events,public.bering_boxes to anon,authenticated;
create policy bering_events_public_read on public.bering_events for select to anon,authenticated using (true);
create policy bering_boxes_public_read on public.bering_boxes for select to anon,authenticated using (true);

create function bering_private.is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from bering_private.admins where user_id=auth.uid());
$$;
revoke all on function bering_private.is_admin() from public,anon,authenticated;
grant execute on function bering_private.is_admin() to authenticated;
create policy bering_admin_read_analytics on public.bering_analytics_events for select to authenticated using ((select bering_private.is_admin()));
create policy bering_admin_read_requests on public.bering_requests for select to authenticated using ((select bering_private.is_admin()));
grant select on public.bering_analytics_events,public.bering_requests to authenticated;

create function bering_private.track_event(p_event jsonb) returns void language plpgsql security definer set search_path='' as $$
declare sid uuid; eid uuid;
begin
 if p_event is null or octet_length(p_event::text)>1800 then raise exception 'invalid_event'; end if;
 sid := (p_event->>'session_id')::uuid; eid := (p_event->>'id')::uuid;
 if sid is null or eid is null then raise exception 'invalid_event'; end if;
 perform pg_advisory_xact_lock(hashtextextended('analytics:'||sid::text,0));
 if exists(select 1 from public.bering_analytics_events where id=eid) then return; end if;
 if (select count(*) from public.bering_analytics_events where session_id=sid and occurred_at>now()-interval '1 minute')>=60 then raise exception 'rate_limit'; end if;
 insert into public.bering_analytics_events(id,session_id,name,page,source,campaign,event_slug,section,box_id,depth)
 values(eid,sid,p_event->>'name',p_event->>'page',p_event->>'source',p_event->>'campaign',p_event->>'event_slug',p_event->>'section',(p_event->>'box_id')::smallint,(p_event->>'depth')::smallint);
end; $$;
create function public.bering_track_event(p_event jsonb) returns void language sql security invoker set search_path='' as $$ select bering_private.track_event(p_event); $$;
revoke all on function bering_private.track_event(jsonb),public.bering_track_event(jsonb) from public,anon,authenticated;
grant execute on function bering_private.track_event(jsonb),public.bering_track_event(jsonb) to anon,authenticated;

create function bering_private.create_request(p_request jsonb) returns uuid language plpgsql security definer set search_path='' as $$
declare rid uuid; sid uuid; d date; ev public.bering_events%rowtype; b smallint; k text; n text; ph text; g smallint; existing public.bering_requests%rowtype;
begin
 if p_request is null or octet_length(p_request::text)>2000 then raise exception 'invalid_request'; end if;
 rid:=(p_request->>'id')::uuid; sid:=(p_request->>'session_id')::uuid;
 d:=(p_request->>'date')::date; k:=p_request->>'kind'; b:=(p_request->>'box_id')::smallint;
 n:=btrim(p_request->>'name'); ph:=p_request->>'phone'; g:=(p_request->>'guests')::smallint;
 if rid is null or sid is null or d is null or k is null or n is null or length(n) not between 1 and 80 or ph is null or ph !~ '^9[0-9]{8}$' or g is null or g not between 1 and 100 or (p_request->>'privacy') is distinct from 'true' then raise exception 'invalid_request'; end if;
 if d < (now() at time zone 'America/Lima')::date or d > (now() at time zone 'America/Lima')::date+366 then raise exception 'invalid_date'; end if;
 perform pg_advisory_xact_lock(hashtextextended('request:'||sid::text,0));
 select * into existing from public.bering_requests where id=rid;
 if found then
  if existing.session_id is distinct from sid then raise exception 'invalid_request'; end if;
  return rid;
 end if;
 if (select count(*) from public.bering_requests where session_id=sid and created_at>now()-interval '1 hour')>=5 then raise exception 'rate_limit'; end if;
 if k='box' then
  select * into ev from public.bering_events where slug=p_request->>'event_slug';
  if not found or not ev.active or ev.event_date<>d then raise exception 'event_closed'; end if;
  if b is null or not exists(select 1 from public.bering_boxes where id=b) then raise exception 'invalid_box'; end if;
  perform pg_advisory_xact_lock(hashtextextended('box:'||ev.slug||':'||b::text,0));
  if exists(select 1 from public.bering_requests where event_slug=ev.slug and box_id=b and status='confirmed') then raise exception 'box_unavailable'; end if;
 elsif k='birthday' then
  if b is not null or p_request->>'event_slug' is not null then raise exception 'invalid_request'; end if;
 else raise exception 'invalid_request'; end if;
 insert into public.bering_requests(id,session_id,kind,event_slug,box_id,celebration_date,name,phone,guests)
 values(rid,sid,k,case when k='box' then ev.slug else null end,b,d,n,ph,g);
 return rid;
end; $$;
create function public.bering_create_request(p_request jsonb) returns uuid language sql security invoker set search_path='' as $$ select bering_private.create_request(p_request); $$;
revoke all on function bering_private.create_request(jsonb),public.bering_create_request(jsonb) from public,anon,authenticated;
grant execute on function bering_private.create_request(jsonb),public.bering_create_request(jsonb) to anon,authenticated;

create function bering_private.availability(p_event_slug text) returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object('active', coalesce((select active and event_date >= (now() at time zone 'America/Lima')::date from public.bering_events where slug=p_event_slug),false),
 'taken',coalesce((select jsonb_agg(box_id) from public.bering_requests where event_slug=p_event_slug and status='confirmed' and box_id is not null),'[]'::jsonb));
$$;
create function public.bering_availability(p_event_slug text) returns jsonb language sql stable security invoker set search_path='' as $$ select bering_private.availability(p_event_slug); $$;
revoke all on function bering_private.availability(text),public.bering_availability(text) from public,anon,authenticated;
grant execute on function bering_private.availability(text),public.bering_availability(text) to anon,authenticated;

create function bering_private.set_status(p_id uuid,p_status text) returns void language plpgsql security definer set search_path='' as $$
declare req public.bering_requests%rowtype;
begin
 if not bering_private.is_admin() then raise exception 'not_authorized'; end if;
 if p_status not in ('pending','confirmed','cancelled') or p_status is null then raise exception 'invalid_status'; end if;
 select * into strict req from public.bering_requests where id=p_id for update;
 if req.box_id is not null then perform pg_advisory_xact_lock(hashtextextended('box:'||req.event_slug||':'||req.box_id::text,0)); end if;
 update public.bering_requests set status=p_status,updated_at=now() where id=p_id;
end; $$;
create function public.bering_set_status(p_id uuid,p_status text) returns void language sql security invoker set search_path='' as $$ select bering_private.set_status(p_id,p_status); $$;
revoke all on function bering_private.set_status(uuid,text),public.bering_set_status(uuid,text) from public,anon,authenticated;
grant execute on function bering_private.set_status(uuid,text),public.bering_set_status(uuid,text) to authenticated;

create function bering_private.dashboard(p_from date,p_to date) returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb; start_at timestamptz; end_at timestamptz;
begin
 if not bering_private.is_admin() then raise exception 'not_authorized'; end if;
 if p_from is null or p_to is null or p_to<p_from or p_to-p_from>366 then raise exception 'invalid_range'; end if;
 start_at:=p_from::timestamp at time zone 'America/Lima'; end_at:=(p_to+1)::timestamp at time zone 'America/Lima';
 select jsonb_build_object(
 'visits',(select count(*) from public.bering_analytics_events where occurred_at>=start_at and occurred_at<end_at and name='page_view'),
 'sessions',(select count(distinct session_id) from public.bering_analytics_events where occurred_at>=start_at and occurred_at<end_at and name='page_view'),
 'requests',(select count(*) from public.bering_requests where created_at>=start_at and created_at<end_at),
 'confirmed',(select count(*) from public.bering_requests where created_at>=start_at and created_at<end_at and status='confirmed'),
 'events',(select coalesce(jsonb_agg(t),'[]'::jsonb) from (select name,count(*) as total,count(distinct session_id) as sessions from public.bering_analytics_events where occurred_at>=start_at and occurred_at<end_at group by name order by total desc) t),
 'sources',(select coalesce(jsonb_agg(t),'[]'::jsonb) from (select source,count(*) as visits,count(distinct session_id) as sessions from public.bering_analytics_events where occurred_at>=start_at and occurred_at<end_at and name='page_view' group by source order by visits desc) t),
 'boxes',(select coalesce(jsonb_agg(t),'[]'::jsonb) from (select box_id,count(*) as clicks,count(distinct session_id) as sessions from public.bering_analytics_events where occurred_at>=start_at and occurred_at<end_at and name='box_select' group by box_id order by clicks desc) t),
 'days',(select coalesce(jsonb_agg(t),'[]'::jsonb) from (select (occurred_at at time zone 'America/Lima')::date as day,count(*) as visits from public.bering_analytics_events where occurred_at>=start_at and occurred_at<end_at and name='page_view' group by day order by day) t),
 'campaigns',(select coalesce(jsonb_agg(t),'[]'::jsonb) from (select coalesce(campaign,'sin campaña') as campaign,count(*) as visits from public.bering_analytics_events where occurred_at>=start_at and occurred_at<end_at and name='page_view' group by campaign order by visits desc) t),
 'leads',(select coalesce(jsonb_agg(t),'[]'::jsonb) from (select id,created_at,kind,event_slug,box_id,celebration_date,name,phone,guests,status from public.bering_requests where created_at>=start_at and created_at<end_at order by created_at desc limit 500) t)
 ) into result;
 return result;
end; $$;
create function public.bering_dashboard(p_from date,p_to date) returns jsonb language sql security invoker set search_path='' as $$ select bering_private.dashboard(p_from,p_to); $$;
revoke all on function bering_private.dashboard(date,date),public.bering_dashboard(date,date) from public,anon,authenticated;
grant execute on function bering_private.dashboard(date,date),public.bering_dashboard(date,date) to authenticated;
comment on table public.bering_analytics_events is 'Interacciones consentidas. Sin nombres, teléfonos, IP, URL completa ni grabaciones de sesión.';
comment on table public.bering_requests is 'Solicitudes pendientes; una solicitud NO separa un box. Solo administrador confirma.';
notify pgrst,'reload schema';
commit;
