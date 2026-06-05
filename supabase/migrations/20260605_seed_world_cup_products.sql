-- ============================================================================
-- Intelet Enterprise — World Cup Promo product seed (May 2026)
-- Run AFTER 20260605_world_cup_sale.sql (needs products.price_old).
--
-- Idempotent: products are upserted on a generated slug. Re-running refreshes
-- prices/titles without creating duplicates. Images are added separately in
-- batches (left empty here so the card shows the placeholder until verified
-- official photos are attached).
--
--   price     = PROMO (World Cup) price
--   price_old = RETAIL price (shown struck-through)
-- ============================================================================

create temporary table _seed (
  brand        text,
  category_id  text,
  model_number text,
  title        text,
  price        numeric(12,2),
  price_old    numeric(12,2)
) on commit drop;

-- ─────────────────────────────────────────────────────────────────────────
-- SAMSUNG
-- ─────────────────────────────────────────────────────────────────────────
insert into _seed (brand, category_id, model_number, title, price, price_old) values
-- LED FHD
('Samsung','televisions','UA32H5000FUXGH','Samsung 32" FHD LED TV',2799,3399),
('Samsung','televisions','UA43F6000FUXGH','Samsung 43" FHD LED TV',3999,5299),
-- UHD Smart 4K
('Samsung','televisions','UA43U8000FUXGH','Samsung 43" UHD Smart 4K TV',5299,6599),
('Samsung','televisions','UA50U8000FUXGH','Samsung 50" UHD Smart 4K TV',5999,7499),
('Samsung','televisions','UA55U8000FUXGH','Samsung 55" UHD Smart 4K TV',6899,8499),
('Samsung','televisions','UA65U8000FUXGH','Samsung 65" UHD Smart 4K TV',8999,13099),
('Samsung','televisions','UA75U8000FUXGH','Samsung 75" UHD Smart 4K TV',14499,21799),
('Samsung','televisions','UA85U8000FUXGH','Samsung 85" UHD Smart 4K TV',23999,31999),
('Samsung','televisions','UA98DU9000UXGH','Samsung 98" UHD Smart 4K TV',54999,86999),
-- QLED Flat 4K
('Samsung','televisions','QA55Q6FAAUXGH','Samsung 55" QLED 4K TV',8999,13999),
('Samsung','televisions','QA55Q7FAAUXGH','Samsung 55" QLED 4K TV',9999,13999),
('Samsung','televisions','QA65Q7FAAUXGH','Samsung 65" QLED 4K TV',11999,17499),
('Samsung','televisions','QA65Q6FAAUXGH','Samsung 65" QLED 4K TV',10499,15999),
('Samsung','televisions','QA75Q6FAAUXGH','Samsung 75" QLED 4K TV',18999,24999),
('Samsung','televisions','QA75Q7FAAUXGH','Samsung 75" QLED 4K TV',19999,25999),
('Samsung','televisions','QA85Q7FAAUXGH','Samsung 85" QLED 4K TV',32999,44999),
-- Neo QLED 4K
('Samsung','televisions','QA65QN85DBUXGH','Samsung 65" Neo QLED 4K TV',17999,24999),
('Samsung','televisions','QA75QN85DBUXGH','Samsung 75" Neo QLED 4K TV',23999,34999),
('Samsung','televisions','QA100QN80FUXGH','Samsung 100" Neo QLED 4K TV',99999,129999),
-- Neo QLED 8K
('Samsung','televisions','QA85QN800CUXZN','Samsung 85" Neo QLED 8K TV',99999,130499),
('Samsung','televisions','QA85QN900FUXGH','Samsung 85" Neo QLED 8K TV',99999,130499),
('Samsung','televisions','QA75QN800DUXKE','Samsung 75" Neo QLED 8K TV',39999,49999),
('Samsung','televisions','QA65QN800DUXKE','Samsung 65" Neo QLED 8K TV',32999,44999),
-- Sound Tower / Sound Bar
('Samsung','small-appliances','MX-ST40F/ZN','Samsung 160W Sound Tower',4899,5999),
('Samsung','small-appliances','MX-ST50F/ZN','Samsung 240W Sound Tower',5499,6999),
('Samsung','small-appliances','HW-B450F/KE','Samsung 200W Soundbar',2899,3899),
('Samsung','small-appliances','HW-Q600F/KE','Samsung 360W Soundbar',5499,6899),
-- Refrigerators — Duracool Top Mount Freezer
('Samsung','refrigerators','RT20HAR2DSA','Samsung 203L Top-Mount Refrigerator',5499,6899),
('Samsung','refrigerators','RT26HAR2DSA','Samsung 203L Top-Mount Refrigerator',5499,6899),
('Samsung','refrigerators','RT22HAR4DSA/GH','Samsung 234L Top-Mount Refrigerator',5999,7299),
('Samsung','refrigerators','RT28HAR4DSA','Samsung 234L Top-Mount Refrigerator',5999,7299),
-- Refrigerators — Duracool Twin Cooling Plus
('Samsung','refrigerators','RT31CG5421S9GH','Samsung 301L Twin Cooling Refrigerator',7999,9999),
('Samsung','refrigerators','RT35CG5421S9GH','Samsung 345L Twin Cooling Refrigerator',8999,10999),
('Samsung','refrigerators','RT44CG5421S9GH','Samsung 345L Twin Cooling Refrigerator',9499,12299),
('Samsung','refrigerators','RT38CG6421S9GH','Samsung 388L Twin Cooling Refrigerator',9999,12999),
('Samsung','refrigerators','RT49CG6421S9GH','Samsung 388L Twin Cooling Refrigerator',9999,12999),
('Samsung','refrigerators','RT42CG6621S9GH','Samsung 411L Twin Cooling Refrigerator',10499,13499),
('Samsung','refrigerators','RT47CG6631B1UT','Samsung 460L Twin Cooling Refrigerator',10999,14999),
('Samsung','refrigerators','RT53DG7B60B1UT','Samsung 525L Twin Cooling Refrigerator',15999,19999),
-- Refrigerators — Side by Side
('Samsung','refrigerators','RS57DG4000B4GH','Samsung 583L Side-by-Side Refrigerator',14999,18999),
('Samsung','refrigerators','RS57DG4100B4GH','Samsung 578L Side-by-Side Refrigerator',15999,19999),
('Samsung','refrigerators','RS70F65K4TGH','Samsung 635L Side-by-Side Refrigerator',19999,28799),
('Samsung','refrigerators','RS80F65G4FGH','Samsung 635L Side-by-Side Refrigerator',25999,33099),
-- Refrigerators — 4 Doors
('Samsung','refrigerators','RF65DB970E22','Samsung 650L 4-Door Refrigerator',39999,52199),
('Samsung','refrigerators','RF65DB960E22EF','Samsung 650L 4-Door Refrigerator',39999,52199),
('Samsung','refrigerators','RF65DG9H0EB1EU','Samsung 632L Family Hub 4-Door Refrigerator',44999,59999),
('Samsung','refrigerators','RF48A4000M9/GH','Samsung 468L French Door Refrigerator',14999,18999),
-- Chest Freezer
('Samsung','chest-freezers','RI70F20V1GAGH','Samsung 198L Chest Freezer (Grey)',4999,6499),
('Samsung','chest-freezers','RI70F29V1GAGH','Samsung 287L Chest Freezer (Grey)',5999,7999),
('Samsung','chest-freezers','RI70F37V1GAGH','Samsung 371L Chest Freezer (Grey)',6999,8999),
-- Gas Cooker
('Samsung','small-appliances','NX24BG45411VGH','Samsung Gas Cooker 50x60cm',5999,7899),
-- Split ACs — R410
('Samsung','air-conditioners','AR09CRHGAWK/AF','Samsung 1.0HP R410 Split AC',3999,5299),
('Samsung','air-conditioners','AR12CRHGAWK/AF','Samsung 1.5HP R410 Split AC',4599,6599),
('Samsung','air-conditioners','AR18CRHGAWK/AF','Samsung 2.0HP R410 Split AC',6999,8799),
('Samsung','air-conditioners','AR24CRHGAWK/AF','Samsung 2.5HP R410 Split AC',9999,12299),
-- Split ACs — Inverter R32
('Samsung','air-conditioners','AR40F12D0AG/AF','Samsung 1.5HP Inverter Split AC (R32)',5999,8999),
('Samsung','air-conditioners','AR40F18D0AG/AF','Samsung 2.0HP Inverter Split AC (R32)',7999,14999),
('Samsung','air-conditioners','AR40F24D0AG/AF','Samsung 2.5HP Inverter Split AC (R32)',9999,17499),
-- Floor Standing ACs
('Samsung','air-conditioners','AC036TNPPEH/AC036TXQREH','Samsung 36,000 BTU Floor Standing AC',29999,36999),
('Samsung','air-conditioners','AC048TNPPEH/AC048TXQREH','Samsung 48,000 BTU Floor Standing AC',39999,49999),
-- Washing Machines — Twin Top Semi
('Samsung','washing-machines','WT60H2500','Samsung 6kg Twin Tub Washing Machine',2799,3499),
('Samsung','washing-machines','WT90H3230MG','Samsung 9kg Twin Tub Washing Machine',3499,4299),
('Samsung','washing-machines','WT12J4200MR','Samsung 12kg Twin Tub Washing Machine',4999,6399),
-- Washing Machines — Top Load Active Wash
('Samsung','washing-machines','WA80F19S8BNQ','Samsung 19kg Top Load Washing Machine',9999,13399),
('Samsung','washing-machines','WA80F17S8CNQ','Samsung 17kg Top Load Washing Machine',8999,10999),
('Samsung','washing-machines','WA80F13S5CNQ','Samsung 13kg Top Load Washing Machine',7499,9499),
('Samsung','washing-machines','WA80CG4240BWNQ','Samsung 8kg Top Load Washing Machine',4499,5699),
-- Washing Machines — Front Load Full Auto
('Samsung','washing-machines','WF90F26ADSNQ','Samsung 9kg Front Load Washing Machine',19999,24999),
('Samsung','washing-machines','WW11CGC04DABSG','Samsung 11kg Front Load Washing Machine',9499,13999),
('Samsung','washing-machines','WW10DG6U94LBNQ','Samsung 10.1kg Front Load Washing Machine',8999,12999),
('Samsung','washing-machines','WW80T3040BS/NQ','Samsung 8kg Front Load Washing Machine',5999,9199),
('Samsung','washing-machines','WW70T3010BS/NQ','Samsung 7kg Front Load Washing Machine',4999,7499),
-- Washer & Dryer
('Samsung','washing-machines','WD90F22BCSNQ','Samsung 9kg Wash / 6kg Dry Washer Dryer',22999,29999),
('Samsung','washing-machines','WD21T6300GV/NQ','Samsung 21kg Wash / 12kg Dry Washer Dryer',18999,25299),
('Samsung','washing-machines','WD17T6300GP/SP','Samsung 17kg Wash / 10kg Dry Washer Dryer',16999,21799);

-- ─────────────────────────────────────────────────────────────────────────
-- NASCO  (World Cup Promo — May 2026)
-- ─────────────────────────────────────────────────────────────────────────
insert into _seed (brand, category_id, model_number, title, price, price_old) values
-- LED Flat
('NASCO','televisions','NAS-J24FB','NASCO 24" LED TV',699,999),
('NASCO','televisions','NAS-B24FB-A','NASCO 24" LED TV',649,949),
('NASCO','televisions','NAS-J32FBFL','NASCO 32" LED TV',999,1499),
('NASCO','televisions','NAS-B32FBFL','NASCO 32" LED TV',999,1499),
('NASCO','televisions','NAS-B43FBFL','NASCO 43" LED TV',1999,2699),
('NASCO','televisions','NAS-J43FBFL','NASCO 43" LED TV',1999,2699),
('NASCO','televisions','NAS-J50FBFL','NASCO 50" LED TV',3199,3999),
('NASCO','televisions','NAS-J50FBFL-G','NASCO 50" FHD Smart TV',3799,4999),
-- Split AC — R410 Gas Golden
('NASCO','air-conditioners','NAS-J12-N1-ECO','NASCO 1.0HP R410 Split AC (12,000 BTU)',2899,3499),
('NASCO','air-conditioners','NAS-T18N1','NASCO 2.0HP R410 Split AC (18,000 BTU)',4999,6549),
('NASCO','air-conditioners','NAS-T24N1','NASCO 2.5HP R410 Split AC (24,000 BTU)',6999,9599),
-- Split AC — R410 Dual Inverter
('NASCO','air-conditioners','NAS-M12V1','NASCO 1.0HP Dual Inverter Split AC (12,000 BTU)',3499,4999),
('NASCO','air-conditioners','NAS-M18V1','NASCO 2.0HP Dual Inverter Split AC (18,000 BTU)',5499,6999),
('NASCO','air-conditioners','NAS-M24V1','NASCO 2.5HP Dual Inverter Split AC (24,000 BTU)',7499,9499),
-- Split AC — Inverter R32
('NASCO','air-conditioners','NAS-A12INV-X-R32','NASCO 1.0HP Inverter Split AC (R32, 12,000 BTU)',3299,4299),
('NASCO','air-conditioners','NAS-A18INV-X-R32','NASCO 2.0HP Inverter Split AC (R32, 18,000 BTU)',5299,6999),
('NASCO','air-conditioners','NAS-A24INV-X-R32','NASCO 2.5HP Inverter Split AC (R32, 24,000 BTU)',7199,8999),
-- Floor Standing ACs
('NASCO','air-conditioners','NAS-JFS-18N1','NASCO 2.0HP Floor Standing AC (18,000 BTU)',6999,9899),
('NASCO','air-conditioners','NAS-MFSC36MN1','NASCO 36,000 BTU Floor Standing AC',14499,18999),
('NASCO','air-conditioners','NAS-MFSC48MN1','NASCO 48,000 BTU Floor Standing AC',18499,24999),
('NASCO','air-conditioners','NAS-TFSI-18N1','NASCO 18,000 BTU Round Floor Standing Inverter AC',5999,7999),
-- Refrigerators — French Door / Side by Side
('NASCO','refrigerators','NASF2-400FDR','NASCO 360L French Door Refrigerator',6999,8999),
('NASCO','refrigerators','NASF2-55SK','NASCO 425L Side-by-Side Refrigerator',7999,10799),
('NASCO','refrigerators','NASF2-400SBSF','NASCO 360L Side-by-Side Refrigerator',5999,7999),
('NASCO','refrigerators','NASF2-66.1FF','NASCO 400L Side-by-Side Refrigerator',6999,9999),
-- Refrigerators — Top Mount No Frost
('NASCO','refrigerators','NASF2-500WD','NASCO 401L Top-Mount No Frost Refrigerator',7999,9999),
('NASCO','refrigerators','NASF2-600WD','NASCO 430L Top-Mount No Frost Refrigerator',8499,10999),
-- Refrigerators — Top Mount Freezer
('NASCO','refrigerators','NASF2-45','NASCO 320L Top-Mount Refrigerator',4499,6599),
('NASCO','refrigerators','NASF2-320FLD','NASCO 280L Top-Mount Refrigerator',3999,4999),
('NASCO','refrigerators','NASF2-320FL-B','NASCO 280L Top-Mount Refrigerator',3799,4899),
('NASCO','refrigerators','NASF2-250FLD','NASCO 210L Top-Mount Refrigerator',3799,4899),
('NASCO','refrigerators','NASF2-30','NASCO 207L Top-Mount Refrigerator',3299,4299),
('NASCO','refrigerators','NASF2-22','NASCO 166L Top-Mount Refrigerator',2899,4349),
('NASCO','refrigerators','NASF2-15S','NASCO 118L Top-Mount Refrigerator',1999,2899),
('NASCO','refrigerators','NASF2-12S','NASCO 95L Top-Mount Refrigerator',1849,2349),
-- Refrigerators — Bottom Freezer
('NASCO','refrigerators','DD2-20','NASCO 147L Bottom-Freezer Refrigerator',2899,3799),
('NASCO','refrigerators','NASD2-23-SK','NASCO 170L Bottom-Freezer Refrigerator',2999,3799),
('NASCO','refrigerators','NASD2-29SK','NASCO 251L Bottom-Freezer Refrigerator',4499,5699),
('NASCO','refrigerators','NASD2-30','NASCO 258L Bottom-Freezer Refrigerator',4499,5849),
('NASCO','refrigerators','NASD2-44','NASCO 287L Bottom-Freezer Refrigerator',5199,7149),
('NASCO','refrigerators','NASD2-40WD','NASCO 307L Bottom-Freezer Refrigerator',4999,8299),
-- Bed Side / Table Top Fridges
('NASCO','refrigerators','NASF1-06','NASCO 41L Bed Side Fridge',1299,1699),
('NASCO','refrigerators','NASF1-95FL','NASCO 76L Table Top Fridge',1199,1799),
('NASCO','refrigerators','NASF1-110FL-B','NASCO 92L Table Top Fridge',1299,1899),
('NASCO','refrigerators','NASF1-11S','NASCO 91L Table Top Fridge',1399,1899),
-- Mirror Top Freezer
('NASCO','refrigerators','NASF2-11FL-B-MIRROR','NASCO 86L Mirror Top-Freezer Refrigerator',1799,2299),
('NASCO','refrigerators','NASF2-12FL-B','NASCO 102L Mirror Top-Freezer Refrigerator',1899,2399),
-- Retro / New Models Top Freezer
('NASCO','refrigerators','NASF2-110RT','NASCO 86L Retro Table Top Fridge',2299,2999),
('NASCO','refrigerators','NASF2-130','NASCO 110L Top-Freezer Refrigerator',1749,2349),
('NASCO','refrigerators','NASF2-13FL','NASCO 112L Top-Freezer Refrigerator',1799,2649),
('NASCO','refrigerators','NASF2-16FL','NASCO 138L Top-Freezer Refrigerator',1999,2999),
('NASCO','refrigerators','NASF2-18FL','NASCO 158L Top-Freezer Refrigerator',2099,3249),
-- New Models Bottom Freezer
('NASCO','refrigerators','NASD2-10FL','NASCO 106L Bottom-Freezer Refrigerator',1899,2649),
('NASCO','refrigerators','NASD2-10FL-B','NASCO 106L Bottom-Freezer Refrigerator',1899,2649),
('NASCO','refrigerators','NASD2-14FL','NASCO 116L Bottom-Freezer Refrigerator',2099,2799),
('NASCO','refrigerators','NASD2-18FI-G','NASCO 136L Bottom-Freezer Refrigerator',2399,3249),
('NASCO','refrigerators','NASD2-20FL','NASCO 158L Bottom-Freezer Refrigerator',2699,3449),
('NASCO','refrigerators','NASD2-24FL','NASCO 196L Bottom-Freezer Refrigerator',3499,4499),
-- Standing Freezer
('NASCO','chest-freezers','NASD1-225FL','NASCO 150L Standing Freezer',2999,3799),
('NASCO','chest-freezers','NASD1-200SK','NASCO 166L Standing Freezer',3499,4499),
('NASCO','chest-freezers','DD1-33','NASCO 225L Standing Freezer',4899,6849),
-- Display Fridges
('NASCO','refrigerators','NAS-FL110SC','NASCO 110L Display Fridge',1999,2999),
('NASCO','refrigerators','NAS-FL350-1DR','NASCO 288L Display Fridge (1 Door)',4499,6149),
('NASCO','refrigerators','NAS-FL360-1DR','NASCO 298L Display Fridge (1 Door)',4799,6699),
('NASCO','refrigerators','NAS-FL400-1DR','NASCO 358L Display Fridge (1 Door)',5699,7149),
('NASCO','refrigerators','NAS-37SDFG','NASCO 350L Display Fridge',5999,7499),
('NASCO','refrigerators','NAS-FL850-2DR','NASCO 728L Display Fridge (2 Door)',11999,14999),
('NASCO','refrigerators','NAS-FL1300-2DR','NASCO 1080L Display Fridge (2 Door)',15999,19999),
('NASCO','refrigerators','NAS-FL1400-3DR','NASCO 1200L Display Fridge (3 Door)',17999,23999),
-- Chest Freezers
('NASCO','chest-freezers','NAS-150FL-G','NASCO 100L Chest Freezer',1799,2249),
('NASCO','chest-freezers','NAS-200SK','NASCO 142L Chest Freezer',2199,3149),
('NASCO','chest-freezers','NAS-200FL-G','NASCO 150L Chest Freezer',1999,3149),
('NASCO','chest-freezers','NAS-160','NASCO 145L Chest Freezer',2099,3099),
('NASCO','chest-freezers','NAS-210','NASCO 200L Chest Freezer',2799,3899),
('NASCO','chest-freezers','NAS-230SK','NASCO 198L Chest Freezer',2899,3799),
('NASCO','chest-freezers','NAS-250FL','NASCO 200L Chest Freezer',2799,3599),
('NASCO','chest-freezers','NAS-350FL','NASCO 250L Chest Freezer',3199,4599),
('NASCO','chest-freezers','NAS-380SK','NASCO 244L Chest Freezer',3199,4449),
('NASCO','chest-freezers','NAS-400FL-G','NASCO 288L Chest Freezer',3799,5049),
('NASCO','chest-freezers','NAS-370-SK','NASCO 270L Chest Freezer',3999,4999),
('NASCO','chest-freezers','NAS-360-SK','NASCO 335L Chest Freezer',4199,5399),
('NASCO','chest-freezers','NAS-420S-SK','NASCO 392L Chest Freezer',4699,6499),
('NASCO','chest-freezers','NAS-475FL-B','NASCO 400L Chest Freezer',5299,6799),
('NASCO','chest-freezers','NAS-500FL-DD','NASCO 425L Chest Freezer (Double Door)',5499,7149),
('NASCO','chest-freezers','NAS-800FL-DD','NASCO 545L Chest Freezer (Double Door)',7999,9999),
('NASCO','chest-freezers','NAS-850FL-DD','NASCO 600L Chest Freezer (Double Door)',8499,10999),
('NASCO','chest-freezers','NAS-1200FL-DD','NASCO 800L Chest Freezer (Double Door)',9999,12999),
('NASCO','chest-freezers','NAS-FS305FL','NASCO 239L Display Chest Freezer',4999,6699),
('NASCO','chest-freezers','NAS-FS405FL','NASCO 360L Display Chest Freezer',5499,7499),
-- Water Dispenser / Microwaves
('NASCO','small-appliances','NAS-YD200-W','NASCO Water Dispenser',999,1299),
('NASCO','small-appliances','EG92SEFF','NASCO 25L Grill Microwave',1499,1999),
('NASCO','small-appliances','AG036AFK','NASCO 36L Grill Microwave',1799,2399),
('NASCO','small-appliances','MWO20NAS-2LV-B','NASCO 20L Solo Microwave',679,999),
-- Washing Machines — Twin Top
('NASCO','washing-machines','NAS-05-TW','NASCO 5kg Twin Tub Washing Machine',999,1649),
('NASCO','washing-machines','NAS-07-TW','NASCO 7kg Twin Tub Washing Machine',1699,2199),
('NASCO','washing-machines','NASTT-JS80','NASCO 8kg Twin Tub Washing Machine',1999,2499),
('NASCO','washing-machines','NASTT-JS110','NASCO 8kg Twin Tub Washing Machine',2099,2599),
('NASCO','washing-machines','NAS-15-TW','NASCO 15kg Twin Tub Washing Machine',3399,3899),
-- Washing Machines — Top Load
('NASCO','washing-machines','NASTL-B120FL','NASCO 12kg Top Load Washing Machine',3799,4999),
('NASCO','washing-machines','NASTL-B80','NASCO 8kg Top Load Washing Machine',2799,3999),
-- Washing Machines — Front Load
('NASCO','washing-machines','NASFL-JS12KG-S','NASCO 12kg Front Load Washing Machine',4999,6499),
('NASCO','washing-machines','NASFL-JS10KG-S','NASCO 10kg Front Load Washing Machine',4299,5499),
('NASCO','washing-machines','NASFL-J8KG-S','NASCO 8kg Front Load Washing Machine',3399,4599),
('NASCO','washing-machines','NASFL-J6KG-S','NASCO 6kg Front Load Washing Machine',2999,3799),
-- Gas Cookers
('NASCO','small-appliances','NASGC-SNIPER50TB','NASCO 4-Burner Gas Cooker (Sniper 50)',1499,2099),
('NASCO','small-appliances','NASGC-SNIPER50TB-G','NASCO 4-Burner Gas Cooker (Sniper 50)',1699,2499),
('NASCO','small-appliances','NASGC-SNIPER60B','NASCO 4-Burner Gas Cooker (Sniper 60)',2399,3149),
('NASCO','small-appliances','NASGC-SNIPER60S','NASCO 4-Burner Gas Cooker (Sniper 60)',2499,3249),
('NASCO','small-appliances','NASGC-LME60I','NASCO 5-Burner Gas Cooker',3499,4499),
('NASCO','small-appliances','NASGC-LME90I','NASCO 5-Burner Gas Cooker',5199,8199),
('NASCO','small-appliances','NASGC-LME90B','NASCO 5-Burner Gas Cooker',7999,7849),
('NASCO','small-appliances','NASGC-AMG80S','NASCO 5-Burner Gas Cooker',3799,5249),
('NASCO','small-appliances','NAS-DM4H109','NASCO 4-Hob Electric Cooker',2999,4599),
-- Kettles / Ice Maker / Voltage Regulators
('NASCO','small-appliances','KEC-1798A','NASCO Electric Kettle',129,159),
('NASCO','small-appliances','KES4116-GS','NASCO 1.7L Electric Kettle',149,149),
('NASCO','small-appliances','IMB100B-GS','NASCO 26lb Ice Maker (Black)',999,1299),
('NASCO','small-appliances','NAS-AVR-2000','NASCO 2000VA Voltage Regulator',399,599),
('NASCO','small-appliances','NAS-AVR-5000','NASCO 5000VA Voltage Regulator',999,1499),
('NASCO','small-appliances','NAS-AVR-3000WM','NASCO 3000VA Wall-Mount Voltage Regulator',999,1299),
('NASCO','small-appliances','NAS-AVR-5000WM','NASCO 5000VA Wall-Mount Voltage Regulator',1099,1499),
('NASCO','small-appliances','NAS-SG10A','NASCO 10A Surge Guard',149,199),
('NASCO','small-appliances','NAS-SG16A','NASCO 16A Surge Guard',169,239);

-- ─────────────────────────────────────────────────────────────────────────
-- MIDEA  (World Cup Promo — May 2026)
-- ─────────────────────────────────────────────────────────────────────────
insert into _seed (brand, category_id, model_number, title, price, price_old) values
-- Split ACs (sheet mislabels these as "Fans")
('Midea','air-conditioners','MSAF24B-12CRDN1','Midea 1.5HP Inverter Split AC (R410)',4399,5999),
('Midea','air-conditioners','MSAG-12CRDN8','Midea 1.5HP Inverter Split AC (R32 Black Mirror)',5199,6299),
('Midea','air-conditioners','MSAG-18CRDN8','Midea 2.0HP Inverter Split AC (R32 Black Mirror)',7499,8999),
('Midea','air-conditioners','MSAG-24CRDN8','Midea 2.5HP Inverter Split AC (R32 Black Mirror)',11799,14299),
('Midea','air-conditioners','MSAF24C-12CRDN1-R32','Midea 1.5HP Inverter Split AC (R32 Unicool+)',4999,6399),
('Midea','air-conditioners','MSAF24C-18CRDN1-R32','Midea 2.0HP Inverter Split AC (R32 Unicool+)',6999,8399),
('Midea','air-conditioners','MSAF-24CRDN1-R32','Midea 2.5HP Inverter Split AC (R32 Unicool+)',9999,12999),
('Midea','air-conditioners','MSAGBU-12HRFN7','Midea 1.5HP Inverter Split AC (R290)',5499,6999),
('Midea','air-conditioners','MSAFB-12CRDN8-QD2','Midea 1.5HP Inverter Split AC (R32)',4799,6199),
('Midea','air-conditioners','MSAFC-17CRDN8/MOX230','Midea 2.0HP Inverter Split AC (R32)',6799,8799),
('Midea','air-conditioners','MSAF-22CRFN8/MOX330-22CFN8-Q','Midea 2.5HP Inverter Split AC (R32)',8999,10999),
('Midea','air-conditioners','MSCB1B-12CRFN8','Midea 1.5HP Breezeless Inverter Split AC (R32)',5999,7299),
('Midea','air-conditioners','MSCB1CU-18HRFN8','Midea 2.0HP Breezeless Inverter Split AC (R32)',8499,10299),
('Midea','air-conditioners','MSCB1DU-24HRFN8','Midea 2.5HP Breezeless Inverter Split AC (R32)',10999,14199),
('Midea','air-conditioners','MFTJ-36CRN1','Midea 36,000 BTU Floor Standing AC (R410)',17999,21999),
('Midea','air-conditioners','MJ2-48CRN1','Midea 48,000 BTU Floor Standing AC (R410)',22999,27899),
('Midea','air-conditioners','MFPA400-48HRFN1','Midea 48,000 BTU Floor Standing Inverter AC (R410)',26999,36499),
('Midea','air-conditioners','MFPA-18CRDN1','Midea 18,000 BTU Floor Standing Inverter AC (R410)',9999,13999),
-- Fans
('Midea','small-appliances','FS40-19K','Midea 16" Standing Fan',399,499),
('Midea','small-appliances','FS40-21M','Midea 16" Standing Fan',249,349),
('Midea','small-appliances','FC-56','Midea 16" Ceiling Fan',399,549),
('Midea','small-appliances','FS45-23MRD','Midea 18" Rechargeable Fan',999,1399),
-- Refrigerators
('Midea','refrigerators','MDRD142FGN50','Midea 93L Table Top Fridge',1999,2899),
('Midea','refrigerators','MDRT134FGN50','Midea 87L Table Top Fridge',1699,2499),
('Midea','refrigerators','MDRB424FGF02','Midea 302L Refrigerator',7999,10799),
('Midea','refrigerators','MDRT241FTGN50','Midea 174L Bottom-Freezer Refrigerator',3299,4899),
('Midea','refrigerators','MDRT645MTN46','Midea 463L Top-Freezer Refrigerator',7999,11399),
('Midea','refrigerators','MDRT489MTN46','Midea 360L Top-Freezer Refrigerator',6999,9199),
('Midea','refrigerators','MDRT294FGN28','Midea 207L Top-Freezer Refrigerator',3499,4599),
('Midea','refrigerators','MDRT187FGG28','Midea 128L Top-Freezer Refrigerator',2499,3599),
('Midea','refrigerators','MDRD302F2G21','Midea 211L Single Door Display Fridge',4999,7099),
('Midea','refrigerators','MDRZ432FZG21','Midea 316L Single Door Display Fridge',5999,8999),
('Midea','refrigerators','MDRS710FGF46D','Midea 548L Side-by-Side Refrigerator',9999,14999),
-- Freezers
('Midea','chest-freezers','MDRC193FZG43D','Midea 99L Chest Freezer',2099,2599),
('Midea','chest-freezers','MDRC265FZG43D','Midea 143L Chest Freezer',2599,3299),
('Midea','chest-freezers','MDRC362FZG43D','Midea 198L Chest Freezer',2999,3999),
('Midea','chest-freezers','MDRC407FZN43D','Midea 294L Inverter Chest Freezer',4499,5399),
-- Washing Machines
('Midea','washing-machines','MF110W80B/T','Midea 8kg Front Load Washing Machine',4999,6399),
('Midea','washing-machines','MF110W70/T','Midea 7kg Front Load Washing Machine',3999,5499),
('Midea','washing-machines','MFA06D80B/W','Midea 8kg Wash / 6kg Dry Built-in Washer Dryer',6999,8999),
-- Water Dispensers
('Midea','small-appliances','YL1674S-B','Midea Water Dispenser',2199,2699),
('Midea','small-appliances','YL2037S-W','Midea Water Dispenser',1799,2299),
('Midea','small-appliances','YL1638S-W','Midea Water Dispenser',1999,2499),
('Midea','small-appliances','YL2037S-B','Midea Water Dispenser',2299,2899),
('Midea','small-appliances','YL2381S-B','Midea Water Dispenser',1999,2499),
-- Gas Cookers
('Midea','small-appliances','SP5055T082-B','Midea 4-Burner Gas Cooker (Black)',1499,1999),
('Midea','small-appliances','SP5055T082-S','Midea 4-Burner Gas Cooker (Silver)',1599,2199),
('Midea','small-appliances','SP5055T082-BG','Midea 4-Burner Gas Cooker',1699,2299),
('Midea','small-appliances','SP5055T082-SGH','Midea 4-Burner Gas Cooker',1799,2499),
('Midea','small-appliances','24TMG4G081-S','Midea 4-Burner Gas Cooker (Silver)',2799,3799),
('Midea','small-appliances','24TMG4G081-B','Midea 4-Burner Gas Cooker (Black)',2699,3699),
('Midea','small-appliances','24TMG4G081-WD','Midea 4-Burner Gas Cooker',2999,3999),
('Midea','small-appliances','36LMGSG080V','Midea 5-Burner Gas Cooker',6499,8999),
('Midea','small-appliances','VESTA-P48C','Midea 5-Burner Gas Cooker',9999,13399),
-- Microwaves
('Midea','small-appliances','EG925EFF','Midea 25L Grill Microwave',1699,2299),
('Midea','small-appliances','EG9P032MX-S','Midea 30L Grill Microwave',1799,2499),
('Midea','small-appliances','MM7P012MZ-B','Midea 20L Solo Microwave',699,999),
('Midea','small-appliances','EM9P032MO-S','Midea 30L Solo Microwave (Silver)',1499,1999),
('Midea','small-appliances','EM9P032MO-B','Midea 30L Solo Microwave (Black)',1399,1899),
('Midea','small-appliances','EM034A2MO-B','Midea 34L Solo Microwave (Black)',1799,2499),
('Midea','small-appliances','EM142A2MI-B','Midea 42L Solo Microwave (White)',1999,2999),
-- Built-in / Oven
('Midea','refrigerators','MDRE353FGN01','Midea 238L Built-in Refrigerator',8999,11999),
('Midea','small-appliances','MC68ABA','Midea 68L Electric Oven',1799,2399),
-- Small Appliances — Air Fryers
('Midea','small-appliances','MF-CN40E2','Midea 4L Air Fryer (Black)',599,799),
('Midea','small-appliances','MF-CN45WK','Midea 4.5L Air Fryer (Black)',699,899),
('Midea','small-appliances','MF-CY55WK','Midea 6L Air Fryer (Black)',749,999),
('Midea','small-appliances','MF-CY70K','Midea 7L Air Fryer (Black)',1099,1499),
('Midea','small-appliances','MF-CY85WK','Midea 7L Air Fryer (Black)',1199,1599),
-- Small Appliances — Juicer / Kettle / Mixer / Blenders / Rice Cooker
('Midea','small-appliances','JE2802','Midea 0.5L Juicer',399,599),
('Midea','small-appliances','MK-17S32A2','Midea 1.7L Electric Kettle',199,299),
('Midea','small-appliances','MK-17G02A2','Midea 1.7L Electric Kettle',279,399),
('Midea','small-appliances','HM0293A','Midea 2L Stand Mixer',499,599),
('Midea','small-appliances','BL2518','Midea 1.5L Table Blender (Black)',249,349),
('Midea','small-appliances','MJ-BL40G1','Midea 1.5L Table Blender (White)',449,549),
('Midea','small-appliances','MJ-BL2516CEE-MP01S','Midea 1.5L Table Blender (White)',299,449),
('Midea','small-appliances','MJ-BH6001W','Midea 1.5L Stand Blender (Black)',399,499),
('Midea','small-appliances','MJ-BL6008BW','Midea 1L Stand Blender (Black)',299,399),
('Midea','small-appliances','MJ-FP8003W','Midea 800W Food Processor (White)',599,799),
('Midea','small-appliances','YJ308J','Midea 1L Rice Cooker (Gold)',349,449),
('Midea','small-appliances','YJ508J','Midea 1.8L Rice Cooker (Gold)',399,499),
-- Small Appliances — Pressure Cooker / Sandwich Grill / Steam Iron
('Midea','small-appliances','MY-CS6037WP2','Midea 1000W Electric Pressure Cooker',899,1099),
('Midea','small-appliances','MY-CS8037WP2','Midea 1000W Electric Pressure Cooker',999,1399),
('Midea','small-appliances','MC-JK2313P','Midea 1500W Contact Sandwich Grill',179,249),
('Midea','small-appliances','YPJ20A1W','Midea Steam Iron',279,399),
('Midea','small-appliances','YPJ26A1W','Midea Steam Iron',379,499);

-- ─────────────────────────────────────────────────────────────────────────
-- TCL  (World Cup Promo — May 2026)
-- ─────────────────────────────────────────────────────────────────────────
insert into _seed (brand, category_id, model_number, title, price, price_old) values
-- TVs — QLED FHD Smart Android
('TCL','televisions','32S5K','TCL 32" QLED FHD Smart Android TV',2299,2799),
('TCL','televisions','43S5K','TCL 43" QLED FHD Smart Android TV',2999,4199),
('TCL','televisions','50S5K','TCL 50" QLED FHD Smart Android TV',3999,4999),
-- TVs — UHD 4K Smart Android
('TCL','televisions','55P6L','TCL 55" UHD 4K Smart Android TV',5999,7099),
('TCL','televisions','65P7SS','TCL 65" UHD 4K Smart Android TV',7999,10499),
('TCL','televisions','65P6L','TCL 65" UHD 4K Smart Android TV',7999,10499),
('TCL','televisions','75P6L','TCL 75" UHD 4K Smart Android TV',9999,16599),
-- TVs — QLED Pro 4K Smart Android
('TCL','televisions','55T6D','TCL 55" QLED Pro 4K Smart Android TV',6799,9699),
('TCL','televisions','65T6D','TCL 65" QLED Pro 4K Smart Android TV',8999,12299),
('TCL','televisions','75P7K','TCL 75" QLED Pro 4K Smart Android TV',11999,19199),
('TCL','televisions','85P7L','TCL 85" QLED Pro 4K Smart Android TV',19999,28799),
('TCL','televisions','98P8K','TCL 98" QLED Pro 4K Smart Android TV',29999,39999),
-- TVs — QD-Mini LED 4K
('TCL','televisions','65C6K','TCL 65" QD-Mini LED 4K TV',10999,15799),
('TCL','televisions','75C6K','TCL 75" QD-Mini LED 4K TV',14999,24999),
('TCL','televisions','85C6K','TCL 85" QD-Mini LED 4K TV',24999,37499),
('TCL','televisions','98C6K','TCL 98" QD-Mini LED 4K TV',39999,59999),
('TCL','televisions','115C7K','TCL 115" QD-Mini LED 4K TV',199999,299999),
-- Monitors — Curved Gaming
('TCL','televisions','27R73Q','TCL 27" Curved Gaming Monitor',7999,11699),
('TCL','televisions','34R83Q','TCL 34" Curved Gaming Monitor',11999,16599),
-- Audio — Sound Bars
('TCL','small-appliances','S45H','TCL 100W Soundbar',1399,1799),
('TCL','small-appliances','S55H','TCL 220W Soundbar',2199,2699),
('TCL','small-appliances','Q65H','TCL 580W Soundbar',4299,5399),
('TCL','small-appliances','Q75H','TCL 620W Soundbar',6999,8999),
('TCL','small-appliances','Q85H','TCL 860W Soundbar',8999,10799),
('TCL','small-appliances','TP200K','TCL 220W Sound Tower',3499,4499),
('TCL','small-appliances','TP300K','TCL 340W Sound Tower',5499,6999),
-- Water Dispensers
('TCL','small-appliances','TY-LYR47W','TCL 2-Tap Water Dispenser (Compressor Cooling)',1399,1899),
('TCL','small-appliances','TY-LWYR109W','TCL 3-Tap Water Dispenser (Compressor Cooling)',1599,2099),
('TCL','small-appliances','TY-LWYR107T','TCL 3-Tap Water Dispenser (Compressor Cooling)',2199,2699),
-- ACs — Split On/Off R32
('TCL','air-conditioners','TAC-12CSD/ZG11','TCL 1.5HP Split AC (R32)',3499,4199),
('TCL','air-conditioners','TAC-18CSD/ZG11','TCL 2.0HP Split AC (R32)',5499,5999),
('TCL','air-conditioners','TAC-24CSD/ZG11','TCL 2.5HP Split AC (R32)',7999,9999),
-- ACs — Split Inverter R32
('TCL','air-conditioners','TAC-12CSD/ZG21I','TCL 1.5HP Inverter Split AC (R32)',3999,5499),
('TCL','air-conditioners','TAC-18CSD/ZG21I','TCL 2.0HP Inverter Split AC (R32)',5999,8299),
('TCL','air-conditioners','TAC-24CSD/ZG21I','TCL 2.5HP Inverter Split AC (R32)',7499,11399),
('TCL','air-conditioners','TAC-12CSD/ZG41I','TCL 1.5HP Inverter Split AC (R32)',4199,5799),
('TCL','air-conditioners','TAC-18CSD/ZG41I','TCL 2.0HP Inverter Split AC (R32)',6199,8999),
('TCL','air-conditioners','TAC-24CSD/ZG41I','TCL 2.5HP Inverter Split AC (R32)',7999,11999),
-- ACs — Split Inverter R410 Black Mirror
('TCL','air-conditioners','TAC-12CSA/XA82I','TCL 1.5HP Inverter Split AC (R410 Black Mirror)',4999,7099),
('TCL','air-conditioners','TAC-18CSA/XA82I','TCL 2.0HP Inverter Split AC (R410 Black Mirror)',6999,9699),
('TCL','air-conditioners','TAC-24CSA/XA82I','TCL 2.5HP Inverter Split AC (R410 Black Mirror)',8999,11799),
-- ACs — Split FreshIn Inverter R32 Silver
('TCL','air-conditioners','TAC-12CSD/FCI','TCL 1.5HP FreshIn Inverter Split AC (R32)',6799,7999),
('TCL','air-conditioners','TAC-18CSD/FCI','TCL 2.0HP FreshIn Inverter Split AC (R32)',7799,9499),
-- ACs — Split Inverter R410 Breeze In White
('TCL','air-conditioners','TAC-12CSA/TPH11I','TCL 1.5HP Inverter Split AC (R410 Breeze In)',3999,5499),
('TCL','air-conditioners','TAC-18CSA/TPH11I','TCL 2.0HP Inverter Split AC (R410 Breeze In)',5999,8299),
('TCL','air-conditioners','TAC-24CSA/TPH11I','TCL 2.5HP Inverter Split AC (R410 Breeze In)',7499,9999),
-- ACs — Floor Standing
('TCL','air-conditioners','TAC-18CFD/MCI','TCL 2.0HP Round Floor Standing Inverter AC',9999,12699),
('TCL','air-conditioners','TAC-24CFD/V7I','TCL 2.5HP Floor Standing Inverter AC (R32)',11999,14999),
('TCL','air-conditioners','TAC-36CFA/C','TCL 3.5HP Floor Standing AC (R410)',17999,22699),
('TCL','air-conditioners','TAC-48CFA/C','TCL 5.0HP Floor Standing AC (R410)',21999,28799),
('TCL','air-conditioners','TAC-36CFA/FHI','TCL 3.5HP Floor Standing Inverter AC (R410)',19999,23999),
('TCL','air-conditioners','TAC-48CHFA/FHI','TCL 5.0HP Floor Standing Inverter AC (R410)',22999,29999),
('TCL','air-conditioners','TAC-60CHRA/FDI','TCL 6.0HP Floor Standing Inverter AC (R410)',32999,39999),
('TCL','air-conditioners','TCC-36ZHRA/DV(02)','TCL 3.5HP Ceiling & Floor AC (R410, White)',14999,17999),
-- Refrigerators — Single Door
('TCL','refrigerators','F117SDS','TCL 90L Single Door Refrigerator',1899,2299),
('TCL','refrigerators','F216TMS','TCL 165L Single Door Refrigerator',2999,3999),
-- Refrigerators — Top Mount
('TCL','refrigerators','P540TMGWD','TCL 413L Top-Mount Refrigerator',7999,9499),
('TCL','refrigerators','P540TMG','TCL 415L Top-Mount Refrigerator',7499,8999),
('TCL','refrigerators','P624TMN','TCL 480L Top-Mount Refrigerator',9499,11499),
('TCL','refrigerators','P624TMG','TCL 480L Top-Mount Refrigerator',9499,11499),
('TCL','refrigerators','P826TMN','TCL 635L Top-Mount Refrigerator',10999,13999),
('TCL','refrigerators','P826TMG','TCL 635L Top-Mount Refrigerator',10999,13999),
-- Refrigerators — Bottom Mount
('TCL','refrigerators','F141BFS','TCL 108L Bottom-Mount Refrigerator',2599,2999),
('TCL','refrigerators','F185BFG','TCL 142L Bottom-Mount Refrigerator',2999,3699),
('TCL','refrigerators','F410BFS','TCL 309L Bottom-Mount Refrigerator',5199,7499),
('TCL','refrigerators','F410BFG','TCL 309L Bottom-Mount Refrigerator',5199,7499),
-- Refrigerators — Side by Side / French
('TCL','refrigerators','P575SBGWD','TCL 433L Side-by-Side Refrigerator',9999,12999),
('TCL','refrigerators','P692SBNWD','TCL 529L Side-by-Side Refrigerator',9999,12999),
('TCL','refrigerators','P692SBBG','TCL 529L Side-by-Side Refrigerator',10999,13999),
('TCL','refrigerators','P547FDBG','TCL 421L French Door Refrigerator',11999,14999),
-- Freezers
('TCL','chest-freezers','F208SDS','TCL 168L Standing Freezer',3499,4499),
('TCL','chest-freezers','F131CFSL','TCL 98L Chest Freezer',2299,2799),
('TCL','chest-freezers','F188CFSL','TCL 145L Chest Freezer',2599,3299),
('TCL','chest-freezers','F326CFSL','TCL 251L Chest Freezer',3699,4499),
('TCL','chest-freezers','F378CFSL','TCL 290L Chest Freezer',3999,4999),
('TCL','chest-freezers','F494CFSL','TCL 380L Chest Freezer',4999,6499),
('TCL','chest-freezers','F920CFSL','TCL 708L Chest Freezer',8499,11999),
-- Washing Machines
('TCL','washing-machines','F709TL','TCL 9kg Top Load Washing Machine',3499,4899),
('TCL','washing-machines','F711TL','TCL 10.5kg Top Load Washing Machine',3999,5699),
('TCL','washing-machines','P607FL','TCL 7kg Front Load Washing Machine',3499,4499),
('TCL','washing-machines','P1108FLG','TCL 8kg Front Load Inverter Washing Machine',5999,7299),
('TCL','washing-machines','P1109FLG','TCL 9kg Front Load Inverter Washing Machine',6499,7999),
('TCL','washing-machines','P211FLG','TCL 10.5kg Front Load Inverter Washing Machine',6999,8499),
('TCL','washing-machines','C211WDG','TCL 10.5kg Wash / 6kg Dry Washer Dryer Combo',7999,9699);

-- ─────────────────────────────────────────────────────────────────────────
-- BRUHM / TAMASHI / HAIER / BEKO / PHILIPS  (World Cup Promo — May 2026)
-- NULL price_old = item had a single ("Now") price only.
-- ─────────────────────────────────────────────────────────────────────────
insert into _seed (brand, category_id, model_number, title, price, price_old) values
-- Televisions
('Tamashi','televisions','NTX32','Tamashi 32" LED TV',1380,1800),
('Bruhm','televisions','BTF-32S','Bruhm 32" LED TV',1900,2500),
('Bruhm','televisions','BTF-43S','Bruhm 43" Digital Satellite TV',2499,3000),
('Bruhm','televisions','BTF-43V','Bruhm 43" Smart TV',2999,3999),
('Haier','televisions','H50K800UX','Haier 50" Smart TV',5999,7000),
('Haier','televisions','H55K800UX','Haier 55" Smart TV',7299,8500),
('Bruhm','televisions','BTF-50V','Bruhm 50" Smart TV',3899,4999),
('Bruhm','televisions','BTF-55V','Bruhm 55" Smart TV',4999,5999),
('Bruhm','televisions','BTF-65W','Bruhm 65" QLED Smart 4K UHD TV',9000,11000),
-- Air Conditioners
('Bruhm','air-conditioners','BAS-12RC1W','Bruhm 1.5HP Split AC',3500,4200),
('Bruhm','air-conditioners','BAS-12ICPS','Bruhm 1.5HP Inverter Split AC',4999,5999),
('Bruhm','air-conditioners','BAS-12ICPS-MB','Bruhm 1.5HP WiFi Smart Inverter AC (Mirror Black)',4480,6000),
('Haier','air-conditioners','HSU-12RASR1H','Haier 1.5HP Inverter Split AC',4399,5500),
('Bruhm','air-conditioners','BAS-18ICXW','Bruhm 2.0HP Inverter Split AC',6999,7999),
('Bruhm','air-conditioners','BAS-18ICWW','Bruhm 2.0HP WiFi Smart Inverter AC',6480,7999),
('Bruhm','air-conditioners','BAS-24ICPS','Bruhm 2.5HP WiFi Smart Inverter AC (Mirror Black)',10000,11000),
('Tamashi','air-conditioners','IAX2420','Tamashi 2.5HP Inverter Split AC',7499,8499),
-- Refrigerators
('Bruhm','refrigerators','BFS-100MD','Bruhm 100L Table Top Fridge',1499,1999),
('Bruhm','refrigerators','BBS-200E','Bruhm 178L Display Fridge',4000,4999),
('Bruhm','refrigerators','BBS-209M','Bruhm 211L Display Fridge',6599,9400),
('Bruhm','refrigerators','BBS-300E','Bruhm 258L Display Fridge',5499,6699),
('Bruhm','refrigerators','BFD-225MD','Bruhm 208L Top-Mount Fridge',3999,4999),
('Bruhm','refrigerators','BFD-135MD','Bruhm 118L Top-Mount Fridge',2900,3900),
('Bruhm','refrigerators','BFD-145MD','Bruhm 132L Top-Mount Fridge',2999,3600),
('Bruhm','refrigerators','BFD-275MD','Bruhm 275L Top-Mount Fridge',4499,5500),
('Bruhm','refrigerators','BFD-350MN','Bruhm 330L Top-Mount Fridge with Dispenser',6999,8999),
('Bruhm','refrigerators','IRX500A','Bruhm 408L 4-Door Refrigerator',9500,13000),
('Bruhm','refrigerators','BBD-500E','Bruhm 487L Display Beverage Cooler',13000,16000),
-- Chest Freezers
('Tamashi','chest-freezers','NCX200G','Tamashi 200L Chest Freezer',3499,4200),
('Tamashi','chest-freezers','NCX300G','Tamashi 300L Chest Freezer',3999,5500),
('Tamashi','chest-freezers','NCX250G','Tamashi 250L Chest Freezer',3499,4200),
('Bruhm','chest-freezers','BCS-160MR','Bruhm 160L Chest Freezer',2899,3499),
('Bruhm','chest-freezers','BCS-210MR','Bruhm 210L Chest Freezer',3499,4000),
('Bruhm','chest-freezers','BCS-260MR','Bruhm 250L Chest Freezer',3999,5000),
('Bruhm','chest-freezers','BCD-310MR','Bruhm 310L Chest Freezer',4499,5500),
('Bruhm','chest-freezers','BCD-510E','Bruhm 510L Chest Freezer',8999,10000),
('Bruhm','chest-freezers','BCD-610MR','Bruhm 600L Chest Freezer',10000,12499),
-- Gas Cookers
('Bruhm','small-appliances','BGC-5540IS','Bruhm 4-Burner Gas Cooker 50x50',2500,3000),
('Bruhm','small-appliances','BGC-5640IB','Bruhm 4-Burner Gas Cooker 50x50',1799,2699),
('Tamashi','small-appliances','NG6640G','Tamashi 4-Burner Gas Cooker 60x60',2899,3799),
('Bruhm','small-appliances','BGC-6631IS','Bruhm 3-Gas + 1 Hot Plate Cooker with Double Oven Grill 60x60',4499,5999),
('Bruhm','small-appliances','BGC-96421S-4GAS','Bruhm 4-Gas + 2 Hot Plate Cooker 90x60',7399,9900),
('Beko','small-appliances','BGGS900UK-4','Beko 5-Gas Cooker 90x60',8900,10000),
-- Washing Machines
('Tamashi','washing-machines','TAMASHI-TT-10KG','Tamashi 10kg Twin Tub Washing Machine',2300,2999),
('Bruhm','washing-machines','BWA-080G','Bruhm 8kg Top Load Fully Automatic Washing Machine',2999,3999),
('Bruhm','washing-machines','BWA-100G','Bruhm 10kg Top Load Fully Automatic Washing Machine',3999,4999),
('Bruhm','washing-machines','BWA-120G','Bruhm 12kg Top Load Washing Machine',4999,5500),
('Bruhm','washing-machines','BWF-120G','Bruhm 12kg Front Load Inverter Washing Machine',6499,7499),
('Bruhm','washing-machines','BWT-140G','Bruhm 14kg Twin Tub Washing Machine',3799,4499),
('Bruhm','washing-machines','BWT-120G','Bruhm 12kg Twin Tub Washing Machine',3199,3899),
-- Microwaves
('Bruhm','small-appliances','BME-20GW','Bruhm 20L Grill Microwave',1499,NULL),
('Bruhm','small-appliances','BMM-20MW','Bruhm 20L Solo Microwave (White)',1200,NULL),
-- Blenders
('Bruhm','small-appliances','BBP-15400PPB','Bruhm 1.5L Blender',450,NULL),
('Bruhm','small-appliances','BBP-15500PSM','Bruhm 1.5L Blender',500,NULL),
('Bruhm','small-appliances','BBP-07600PPM','Bruhm 3-in-1 Hand Blender',350,450),
('Philips','small-appliances','HR2141/90','Philips 2L Blender',750,NULL),
-- Irons
('Bruhm','small-appliances','BIS-2400NP','Bruhm Steam Iron',450,600),
('Bruhm','small-appliances','BIS-2000NU','Bruhm Dry Iron',500,NULL),
('Philips','small-appliances','DST1020','Philips Steam Iron',500,NULL),
('Philips','small-appliances','STH3000/26','Philips Handheld Garment Steamer',650,800),
-- Mixers
('Philips','small-appliances','HR3740','Philips 400W Hand Mixer',600,900),
-- Kettles
('Bruhm','small-appliances','BKW-17GM','Bruhm 1.5L Glass Kettle',399,NULL),
('Bruhm','small-appliances','BKN-15DCG','Bruhm 1.5L Electric Kettle',250,NULL),
-- Water Dispensers
('Bruhm','small-appliances','BDS-HNC109','Bruhm Water Dispenser',1299,1699),
('Bruhm','small-appliances','BDS-HNC98','Bruhm Water Dispenser',1499,2000);

-- ─────────────────────────────────────────────────────────────────────────
-- UPSERT into products (slug auto-generated from brand + model)
-- ─────────────────────────────────────────────────────────────────────────
insert into public.products (title, slug, model_number, brand, price, price_old, category_id, in_stock)
select
  s.title,
  trim(both '-' from lower(regexp_replace(s.brand || '-' || s.model_number, '[^a-zA-Z0-9]+', '-', 'g'))),
  s.model_number,
  s.brand,
  s.price,
  s.price_old,
  s.category_id,
  true
from _seed s
on conflict (slug) do update set
  title        = excluded.title,
  model_number = excluded.model_number,
  brand        = excluded.brand,
  price        = excluded.price,
  price_old    = excluded.price_old,
  category_id  = excluded.category_id;
