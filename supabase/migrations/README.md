# Tritech — Sales & Invoice System Setup

Two one-time steps to activate the Sales & Invoice features in the admin panel.

## 1. Run the schema migration

Open the Supabase dashboard → **SQL Editor** → paste and run:

1. `20260417_sales_system.sql` — creates `user_roles`, `invoices`, `invoice_items`, `product_watches`, `watch_alerts`, `expenses`, `audit_log` + RLS policies + triggers.
2. `20260417_seed_dummy_sales.sql` — seeds ~1000 demo invoices + line items + expenses spread across the last 3 years (idempotent — re-running is safe).

## 2. Assign roles to your users

After the first user signs up via `/admin/login`, grant their role in SQL:

```sql
-- Give yourself boss access
insert into public.user_roles (user_id, role)
select id, 'boss' from auth.users where email = 'you@example.com';

-- Or a cashier
insert into public.user_roles (user_id, role)
select id, 'cashier' from auth.users where email = 'cashier@example.com';
```

Roles:
- `boss` / `admin` — full dashboard, invoices, alerts, products, audit log
- `cashier` — can only create new invoices and see invoices they created

## Rate limiting

Supabase enforces auth rate limits at the gateway — no frontend changes needed.
See Dashboard → Authentication → Rate Limits if you need to tune.

## Session timeout

Auto sign-out after 30 minutes of no mouse/keyboard activity (`useIdleSignOut(30)` in `src/app/admin/page.tsx`).
