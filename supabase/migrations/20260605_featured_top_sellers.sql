-- ============================================================================
-- Intelet Enterprise — Featured / Top Sellers for the home page
-- Populates the home page "Featured Products" section (featured = true).
-- Bruhm is the headline top seller; mixed with a couple of items that already
-- have real photos so the section looks great immediately.
-- Run AFTER the seed migration.
-- ============================================================================

-- Clean slate so re-running gives a predictable set.
update public.products set featured = false where featured = true;

update public.products set featured = true where slug in (
  -- Bruhm top sellers (headline)
  'bruhm-btf-65w',      -- 65" QLED 4K UHD TV
  'bruhm-bwa-120g',     -- 12kg Top Load Washer
  'bruhm-bcd-310mr',    -- 310L Chest Freezer
  'bruhm-bas-12icps',   -- 1.5HP Inverter Split AC
  -- Flagship items with verified photos
  'samsung-ua55u8000fuxgh',  -- Samsung 55" UHD TV
  'tcl-55p6l'                 -- TCL 55" 4K TV
);
