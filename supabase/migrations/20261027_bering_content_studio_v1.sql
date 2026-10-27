begin;
create table public.bering_content_posts (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 created_by uuid not null default auth.uid(),
 title text not null check(length(btrim(title)) between 1 and 120),
 caption text not null default '' check(length(caption)<=5000),
 channel text not null check(channel in ('facebook','instagram','tiktok')),
 format text not null check(format in ('post','story','reel','video','carousel')),
 media_url text check(media_url is null or (length(media_url)<=1000 and media_url ~ '^https://')),
 planned_at timestamptz,
 status text not null default 'draft' check(status in ('draft','ready','planned','published','cancelled')),
 constraint bering_content_planned_time check(status<>'planned' or planned_at is not null)
);
create index bering_content_posts_planned on public.bering_content_posts(planned_at desc);
alter table public.bering_content_posts enable row level security;
revoke all on public.bering_content_posts from public,anon,authenticated;
grant select,insert,update,delete on public.bering_content_posts to authenticated;
create policy bering_content_admin_select on public.bering_content_posts for select to authenticated using ((select bering_private.is_admin()));
create policy bering_content_admin_insert on public.bering_content_posts for insert to authenticated with check ((select bering_private.is_admin()) and created_by=auth.uid());
create policy bering_content_admin_update on public.bering_content_posts for update to authenticated using ((select bering_private.is_admin())) with check ((select bering_private.is_admin()));
create policy bering_content_admin_delete on public.bering_content_posts for delete to authenticated using ((select bering_private.is_admin()));
comment on table public.bering_content_posts is 'Borradores y calendario editorial: planned no equivale a publicación automática.';
notify pgrst,'reload schema';
commit;