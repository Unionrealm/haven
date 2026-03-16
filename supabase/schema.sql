-- Haven Database Schema

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Users table
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text not null unique,
  role text not null default 'organizer' check (role in ('organizer', 'attendee')),
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

create policy "Public can view user profiles" on public.users
  for select using (true);

-- Events table
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  organizer_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text not null default '',
  cover_image text,
  date timestamptz not null,
  end_date timestamptz,
  venue text not null,
  address text not null default '',
  location text not null check (location in ('홍대', '이태원', '성수', '대학로', '강남', '신촌', '합정', '을지로', '종로', '기타')),
  category text not null check (category in ('공연/콘서트', '네트워킹', '원데이클래스', '파티', '기타')),
  status text not null default 'draft' check (status in ('draft', 'published', 'cancelled', 'completed')),
  slug text not null unique,
  map_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "Organizers can manage own events" on public.events
  for all using (auth.uid() = organizer_id);

create policy "Public can view published events" on public.events
  for select using (status = 'published');

-- Ticket types table
create table public.ticket_types (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  name text not null,
  description text,
  price integer not null default 0 check (price >= 0),
  quantity integer not null check (quantity > 0),
  quantity_sold integer not null default 0 check (quantity_sold >= 0),
  created_at timestamptz not null default now()
);

alter table public.ticket_types enable row level security;

create policy "Organizers can manage ticket types" on public.ticket_types
  for all using (
    exists (
      select 1 from public.events
      where events.id = ticket_types.event_id
      and events.organizer_id = auth.uid()
    )
  );

create policy "Public can view ticket types" on public.ticket_types
  for select using (
    exists (
      select 1 from public.events
      where events.id = ticket_types.event_id
      and events.status = 'published'
    )
  );

-- Tickets table
create table public.tickets (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  ticket_type_id uuid references public.ticket_types(id) on delete cascade not null,
  attendee_name text not null,
  attendee_phone text not null,
  attendee_email text,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'refunded', 'cancelled')),
  qr_code text not null,
  checked_in boolean not null default false,
  checked_in_at timestamptz,
  purchase_price integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.tickets enable row level security;

create policy "Organizers can view event tickets" on public.tickets
  for select using (
    exists (
      select 1 from public.events
      where events.id = tickets.event_id
      and events.organizer_id = auth.uid()
    )
  );

create policy "Organizers can update ticket check-in" on public.tickets
  for update using (
    exists (
      select 1 from public.events
      where events.id = tickets.event_id
      and events.organizer_id = auth.uid()
    )
  );

create policy "Anyone can insert tickets" on public.tickets
  for insert with check (true);

create policy "Attendees can view own tickets by qr" on public.tickets
  for select using (true);

-- Payouts table
create table public.payouts (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  amount integer not null,
  fee integer not null,
  net_amount integer not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.payouts enable row level security;

create policy "Organizers can view own payouts" on public.payouts
  for select using (
    exists (
      select 1 from public.events
      where events.id = payouts.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- Functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'organizer'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update quantity_sold
create or replace function public.increment_ticket_sold()
returns trigger as $$
begin
  if new.payment_status = 'paid' and (old is null or old.payment_status != 'paid') then
    update public.ticket_types
    set quantity_sold = quantity_sold + 1
    where id = new.ticket_type_id;
  end if;
  if old is not null and old.payment_status = 'paid' and new.payment_status in ('refunded', 'cancelled') then
    update public.ticket_types
    set quantity_sold = greatest(quantity_sold - 1, 0)
    where id = new.ticket_type_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_ticket_payment_status_change
  after insert or update on public.tickets
  for each row execute procedure public.increment_ticket_sold();

-- Indexes
create index events_organizer_id_idx on public.events(organizer_id);
create index events_status_idx on public.events(status);
create index events_date_idx on public.events(date);
create index events_slug_idx on public.events(slug);
create index tickets_event_id_idx on public.tickets(event_id);
create index tickets_qr_code_idx on public.tickets(qr_code);
