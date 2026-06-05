-- ============================================================================
-- Intelet Enterprise — World Cup Sale support
-- Adds price_old (the "was" price) so product cards can show a strikethrough
-- alongside the promo price. Idempotent: safe to run repeatedly.
-- ============================================================================

alter table public.products
  add column if not exists price_old numeric(12,2);

comment on column public.products.price_old is
  'Original / retail price. When set and greater than price, UI shows a strikethrough sale.';
