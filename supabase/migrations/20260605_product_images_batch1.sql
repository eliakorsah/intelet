-- ============================================================================
-- Intelet Enterprise — Product images, Batch 1 (verified official photos)
-- Run AFTER the seed migration. Images live in /public/products/ and are
-- referenced by relative path (served same-origin, no remotePatterns needed).
-- Matched by the slug auto-generated in the seed: lower(brand-model).
-- ============================================================================

update public.products set images = array['/products/samsung-rt28har4dsa.png']
  where slug = 'samsung-rt28har4dsa';

update public.products set images = array['/products/samsung-ua55u8000fuxgh.png']
  where slug = 'samsung-ua55u8000fuxgh';

update public.products set images = array['/products/samsung-wa80f17s8cnq.png']
  where slug = 'samsung-wa80f17s8cnq';

update public.products set images = array['/products/samsung-ua65u8000fuxgh.png']
  where slug = 'samsung-ua65u8000fuxgh';

update public.products set images = array['/products/samsung-ua43u8000fuxgh.png']
  where slug = 'samsung-ua43u8000fuxgh';

update public.products set images = array['/products/samsung-ua50u8000fuxgh.png']
  where slug = 'samsung-ua50u8000fuxgh';

update public.products set images = array['/products/tcl-55p6l.png']
  where slug = 'tcl-55p6l';
