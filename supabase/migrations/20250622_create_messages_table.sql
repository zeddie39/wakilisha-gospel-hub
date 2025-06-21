-- Contact messages table for storing website contact form submissions
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  content text not null,
  sender_email text not null,
  sender_name text,
  phone text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Index for sorting by creation date
grant select, insert, update, delete on table messages to anon, authenticated;
