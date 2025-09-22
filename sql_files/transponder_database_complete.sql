-- Supabase Transponder Database - Complete Data Population
-- No NULL values in critical fields, all data properly normalized

BEGIN;

-- Clear existing data
TRUNCATE TABLE entry_note CASCADE;
TRUNCATE TABLE entry_oem_key CASCADE;
TRUNCATE TABLE entry_cross_ref CASCADE;
TRUNCATE TABLE entry CASCADE;
TRUNCATE TABLE vehicle_range CASCADE;
TRUNCATE TABLE model CASCADE;
TRUNCATE TABLE transponder_detail CASCADE;
TRUNCATE TABLE note CASCADE;
TRUNCATE TABLE oem_key CASCADE;
TRUNCATE TABLE cross_ref CASCADE;
TRUNCATE TABLE transponder_family CASCADE;
TRUNCATE TABLE system_type CASCADE;

-- System Types
INSERT INTO system_type (id, name) VALUES (1, 'Non-Transponder Key') ON CONFLICT (name) DO NOTHING;
INSERT INTO system_type (id, name) VALUES (2, 'Not Specified') ON CONFLICT (name) DO NOTHING;
INSERT INTO system_type (id, name) VALUES (3, 'PassKey 3+ Anti Theft System') ON CONFLICT (name) DO NOTHING;
INSERT INTO system_type (id, name) VALUES (4, 'PassLock Anti Theft System') ON CONFLICT (name) DO NOTHING;
INSERT INTO system_type (id, name) VALUES (5, 'VATS / PassKey System') ON CONFLICT (name) DO NOTHING;

-- Transponder Families
INSERT INTO transponder_family (id, name) VALUES (1, 'Hitag AES') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (2, 'Hitag Ext VAG') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (3, 'Hitag Pro') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (4, 'Hitag2 Extended / \~ID46, ID46E') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (5, 'Hitag2 Extended / \~ID46E') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (6, 'Megamos 13 / ID13') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (7, 'Megamos 13 / ID13 OR Temic 11 / ID11') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (8, 'Megamos AES / ID88') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (9, 'Megamos AES / ID88 OR Philips Crypto 3 / Hitag 3 / ID49') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (10, 'Megamos Crypto 48 / ID48') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (11, 'Megamos Crypto 48 / ID48 OR Philips Crypto 2 / Hitag2 / ID46') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (12, 'Megamos Crypto AES (“VAG MQB”) ID49') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (13, 'Megamos Crypto ID48 (precoded dealer key)') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (14, 'Megamos ID13') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (15, 'Philips 33 / ID33 OR Megamos 13 / ID13') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (16, 'Philips Crypto / ID40') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (17, 'Philips Crypto 2 / Hitag2 / ID46') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (18, 'Philips Crypto 2 / Hitag2+ / ID46') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (19, 'Philips Crypto 2 ID46 OR NXP Hitag-3 / ID49') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (20, 'Philips Crypto 3 / Hitag3 / ID49') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (21, 'Philips Crypto ID40') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (22, 'Philips ID46 – Hitag2') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (23, 'Sokymat Crypto 8E – Audi ID8E') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (24, 'Standard Key') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (25, 'Temic 11 / ID11') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (26, 'Temic 11 / ID11 OR Megamos 13 / ID13') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (27, 'Texas Crypto 4D / 4D64') ON CONFLICT (name) DO NOTHING;
INSERT INTO transponder_family (id, name) VALUES (28, 'Texas Crypto 4D / ID4D60') ON CONFLICT (name) DO NOTHING;

-- Transponder Details
INSERT INTO transponder_detail (id, detail) VALUES (1, 'NCF2951V, NCF2952V') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (2, 'NXP PCF7937E, NCF2951E') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (3, 'NXP PCF7937E, PCF7941E') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (4, 'NXP PCF7952A') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (5, 'NXP PCF7952E') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (6, 'NXP PCF7952E, PCF7937E') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (7, 'NXP PCF7952E, PCF7941E') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (8, 'NXP PCF7952E, PCF7961E') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (9, 'NXP PCF7961E, PCF7941E') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (10, 'OR Megamos 13 / ID13') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (11, 'PCF7935 precoded') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (12, 'PCF7936') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (13, 'PCF7937E, NCF2951E') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (14, 'PCF7937E, PCF7941E') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (15, 'PCF7937E, PCF7952E') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (16, 'PCF7941') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (17, 'PCF7945 / PCF7953') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (18, 'PCF7945AC (precoded dealer key)') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (19, 'PCF7946') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (20, 'PCF7946 / PCF7936 / Silca T14 / JMA TP12') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (21, 'PCF7961M') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (22, 'Silca 13 / JMA TP05') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (23, 'Silca ID88') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (24, 'Standard chip') ON CONFLICT (detail) DO NOTHING;
INSERT INTO transponder_detail (id, detail) VALUES (25, 'glass chip / MCU') ON CONFLICT (detail) DO NOTHING;

-- Cross References
INSERT INTO cross_ref (id, label) VALUES (1, 'Consult manual') ON CONFLICT (label) DO NOTHING;
INSERT INTO cross_ref (id, label) VALUES (2, 'JMA TP05 / SILCA T5') ON CONFLICT (label) DO NOTHING;
INSERT INTO cross_ref (id, label) VALUES (3, 'JMA TP05, Silca 13') ON CONFLICT (label) DO NOTHING;
INSERT INTO cross_ref (id, label) VALUES (4, 'JMA TP08 / KD48 / CN6') ON CONFLICT (label) DO NOTHING;
INSERT INTO cross_ref (id, label) VALUES (5, 'JMA TP08 / Silca T6') ON CONFLICT (label) DO NOTHING;
INSERT INTO cross_ref (id, label) VALUES (6, 'JMA TP08, Silca T6') ON CONFLICT (label) DO NOTHING;
INSERT INTO cross_ref (id, label) VALUES (7, 'JMA TP08, Silca T6, JMA TP05, Silca 13') ON CONFLICT (label) DO NOTHING;
INSERT INTO cross_ref (id, label) VALUES (8, 'JMA TP12 / SILCA GTI / K-JMD') ON CONFLICT (label) DO NOTHING;
INSERT INTO cross_ref (id, label) VALUES (9, 'JMA TP12 / SILCA T14 / CN3') ON CONFLICT (label) DO NOTHING;
INSERT INTO cross_ref (id, label) VALUES (10, 'JMA TP12 / XT27 / K-JMD') ON CONFLICT (label) DO NOTHING;
INSERT INTO cross_ref (id, label) VALUES (11, 'JMA TP19, XT27A66, K-JMD') ON CONFLICT (label) DO NOTHING;
INSERT INTO cross_ref (id, label) VALUES (12, 'JMA TP25 / SILCA A2') ON CONFLICT (label) DO NOTHING;
INSERT INTO cross_ref (id, label) VALUES (13, 'JMA TPX2 / JMA TP21 / SILCA GTI / YS-01 / K-JMD / XT27') ON CONFLICT (label) DO NOTHING;
INSERT INTO cross_ref (id, label) VALUES (14, 'PCF7935 / JMA TP12 / XT27 / K-JMD') ON CONFLICT (label) DO NOTHING;
INSERT INTO cross_ref (id, label) VALUES (15, 'PCF7936 / JMA TP12 / SILCA GTI / K-JMD') ON CONFLICT (label) DO NOTHING;
INSERT INTO cross_ref (id, label) VALUES (16, 'PCF7936, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD') ON CONFLICT (label) DO NOTHING;
INSERT INTO cross_ref (id, label) VALUES (17, 'PCF7936, JMA TP12GM, SILCA T14, CN3, XT27A66, K-JMD') ON CONFLICT (label) DO NOTHING;
INSERT INTO cross_ref (id, label) VALUES (18, 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD') ON CONFLICT (label) DO NOTHING;

-- OEM Keys
INSERT INTO oem_key (id, code) VALUES (1, '13500218, 13504196') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (2, '13500318, 5921872, 5927057, OHT05918179') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (3, '13529661, 13529660, 13584504, 13508771') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (4, '13530752, HYQ4AA 13529664, 13585722') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (5, '13541559, 13541561, 13541565, 13537962') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (6, '13541561, 13541565, 13537962') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (7, '23465955, 23465951, NBGGD9C04') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (8, '4E0837220M, 4E0837220N') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (9, '4F0837220AF, 4F0837220AJ') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (10, '4F0837220AG, 4F0837220Q') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (11, '4F0837220AK, 4F0837220R') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (12, '4G0959754BP, 4G0959754DC') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (13, '4G0959754K, 4G0959754G') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (14, '4H0959754DD, 4H0959754DB') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (15, '4H0959754K, 4H0959754BM') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (16, '56046681AE, M3N-40821302') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (17, '5912545, OHT01060512, 23465184, 13500221') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (18, '6000627330, 6000628569, 6000631468') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (19, '6000628443, 71749374, 71776098') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (20, '71749374, 71776098, 6000626799') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (21, '71752197, 6000626708, 6000626710') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (22, '71765697, 6000629617') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (23, '71778806, 6000626702') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (24, '81A837220, 81A837220E') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (25, '82A837220H, 82A837220E') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (26, '8K0959754BR, 8K0959754BP') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (27, '8K0959754D, 8T0959754F') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (28, '8P0837220D, 8P0837220G') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (29, '8S0959754H, 8S0959754AL') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (30, '8T0959754A, 8T0959754D') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (31, '8V0837220D, 8V0837220F') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (32, '8X0837220, 8X0837220A') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (33, '8X0837220R, 8X0837220C') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (34, '92271667') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (35, '96458347') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (36, 'EMU470102, ACJ932U01') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (37, 'H0561-C993A, CWTWB1U751') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (38, 'HYQ1AA 13529634, HYQ1EA 13508282, 84540864') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (39, 'HYQ1AA 13580802, HYQ1EA 13508282, M3N32337100') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (40, 'HYQ1EA 13508398, 13529632') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (41, 'HYQ4AA 13529664, 13508767, 13585722') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (42, 'HYQ4AA 13529665, 13585723, 13584498, 13529650') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (43, 'HYQ4EA 13508780, 13594573, 13529653, 13508771') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (44, 'HYQ4EA 13519177, 13598815, 13519188') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (45, 'HYQ4EA 13529638, 13598815, 13585728') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (46, 'HYQ4EA 13584514, 13506669, 13519188') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (47, 'KR55WK50073, 13575177') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (48, 'M3N32337100, 84540865, 13577770, 22881480') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (49, 'M3N5WY7777A 25926479, 25926480') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (50, 'OHT01060512 13504200, 23335583, 5912543') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (51, 'OHT01060512, 20873621, 5913598') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (52, 'OHT01060512, 5913598, 20873621') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (53, 'OHT05918179, 22923862, 22755321, 5920157') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (54, 'See dealer') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (55, 'YG0G20TB1 13538853, 13538852') ON CONFLICT (code) DO NOTHING;
INSERT INTO oem_key (id, code) VALUES (56, 'YG0G21TB2 13548437') ON CONFLICT (code) DO NOTHING;

-- Notes
INSERT INTO note (id, text) VALUES (1, 'No additional notes') ON CONFLICT (content) DO NOTHING;

-- Makes (existing ones preserved)
INSERT INTO make (name) VALUES ('Audi') ON CONFLICT (name) DO NOTHING;
INSERT INTO make (name) VALUES ('Chevrolet') ON CONFLICT (name) DO NOTHING;
INSERT INTO make (name) VALUES ('Fiat') ON CONFLICT (name) DO NOTHING;
INSERT INTO make (name) VALUES ('Isuzu') ON CONFLICT (name) DO NOTHING;

-- Models
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), '80') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'A1') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'A2') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'A3') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'A4 / S4') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'A5 / S5') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'A6 / S6') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'A6 / S6 (C6 4F)') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'A6 / S6 (C7 4G)') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'A7 / S7') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'A8 / S8') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'A8 / S8 (D4)') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'Allroad') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'Allroad (C6 4F)') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'Allroad (C7 4G)') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'Cabrio') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'Coupe') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'Coupe S2') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'Q2') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'Q3') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'Q5') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'Q7 (4L)') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'TT') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Audi'), 'TT / TTS') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Agile') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Astra') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Astro Van') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Avalanche') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Aveo') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Blazer') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Bolt') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Camaro') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Caprice') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Caprice/PPV') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Captiva') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Cavalier') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'City Express') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Cobalt') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Colorado') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Corvette') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Cruze') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Epica') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Equinox') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Espero') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Evanda') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Express') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'HHR') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Impala') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Lumina') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Malibu') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Monte Carlo') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Optra') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Orlando') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'S10 Blazer') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'S10 Pickup') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Silverado') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Sonic') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Spark') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Suburban') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Tahoe') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Trailblazer') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Traverse') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Uplander') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Venture') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Vivant') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Chevrolet'), 'Volt') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), '500') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), '500L') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), '500X') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Albea') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Barchetta') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Brava') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Bravo') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Cinquecento') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Coupe') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Croma') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Doblo') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Doblo (S.A.)') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Ducato') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Egea') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Fiorino') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Fiorino (S.A.)') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Freemont') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Fullback') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Grand Siena') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Grande Punto') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Idea') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Idea (S.A.)') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Linea') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Marea') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Marengo') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Mille') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Multipla') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Palio') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Panda') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Punto') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Punto Evo') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Qubo') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Scudo') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Sedici (diesel)') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Sedici (petrol)') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Seicento') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Siena') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Stilo') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Tempra') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Tipo') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Ulysse') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Fiat'), 'Viaggio') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Isuzu'), 'Ascender') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Isuzu'), 'Aska') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Isuzu'), 'Axiom') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Isuzu'), 'Big Horn') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Isuzu'), 'D-Max') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Isuzu'), 'ELF') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Isuzu'), 'Fargo') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Isuzu'), 'MU-X') ON CONFLICT (make_id, name) DO NOTHING;
INSERT INTO model (make_id, name) VALUES ((SELECT id FROM make WHERE name = 'Isuzu'), 'Trooper') ON CONFLICT (make_id, name) DO NOTHING;

-- Vehicle Ranges and Entries
INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (1, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Agile'), 
        2009, NULL, '2009+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (1, 1, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (1, (SELECT id FROM cross_ref WHERE label = 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (1, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (1, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (2, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Astra'), 
        2000, '2007', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (2, 2, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto ID40'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7935 precoded'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (2, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (2, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (2, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (3, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Astra'), 
        2007, NULL, '2007+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (3, 3, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (3, (SELECT id FROM cross_ref WHERE label = 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (3, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (3, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (4, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Astro Van'), 
        1998, '2005', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (4, 4, 
        (SELECT id FROM system_type WHERE name = 'PassLock Anti Theft System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (4, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (4, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (4, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (5, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Avalanche'), 
        2007, '2013', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (5, 5, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (5, (SELECT id FROM cross_ref WHERE label = 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (5, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (5, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (6, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Aveo'), 
        2004, '2011', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (6, 6, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'OR Megamos 13 / ID13'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (6, (SELECT id FROM cross_ref WHERE label = 'JMA TP08, Silca T6, JMA TP05, Silca 13'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (6, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (6, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (7, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Aveo'), 
        2012, NULL, '2012+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (7, 7, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7937E, NCF2951E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (7, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (7, (SELECT id FROM oem_key WHERE code = '13500218, 13504196'));
INSERT INTO entry_note (entry_id, note_id) VALUES (7, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (8, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Blazer'), 
        1998, '2005', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (8, 8, 
        (SELECT id FROM system_type WHERE name = 'PassLock Anti Theft System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (8, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (8, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (8, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (9, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Blazer'), 
        2019, NULL, '2019+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (9, 9, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7937E, PCF7941E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (9, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (9, (SELECT id FROM oem_key WHERE code = 'HYQ4EA 13584514, 13506669, 13519188'));
INSERT INTO entry_note (entry_id, note_id) VALUES (9, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (10, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Bolt'), 
        2016, '2020', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (10, 10, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7952E, PCF7937E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (10, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (10, (SELECT id FROM oem_key WHERE code = 'HYQ4AA 13529664, 13508767, 13585722'));
INSERT INTO entry_note (entry_id, note_id) VALUES (10, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (11, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Camaro'), 
        1988, '2002', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (11, 11, 
        (SELECT id FROM system_type WHERE name = 'VATS / PassKey System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (11, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (11, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (11, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (12, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Camaro'), 
        2010, '2015', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (12, 12, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7937E, NCF2951E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (12, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (12, (SELECT id FROM oem_key WHERE code = '5912545, OHT01060512, 23465184, 13500221'));
INSERT INTO entry_note (entry_id, note_id) VALUES (12, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (13, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Camaro'), 
        2016, '2020', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (13, 13, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7952E, PCF7961E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (13, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (13, (SELECT id FROM oem_key WHERE code = 'HYQ4EA 13508780, 13594573, 13529653, 13508771'));
INSERT INTO entry_note (entry_id, note_id) VALUES (13, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (14, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Caprice'), 
        1994, '1996', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (14, 14, 
        (SELECT id FROM system_type WHERE name = 'VATS / PassKey System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (14, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (14, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (14, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (15, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Caprice/PPV'), 
        2011, '2013', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (15, 15, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (15, (SELECT id FROM cross_ref WHERE label = 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (15, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (15, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (16, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Caprice/PPV'), 
        2014, '2017', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (16, 16, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (16, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (16, (SELECT id FROM oem_key WHERE code = '92271667'));
INSERT INTO entry_note (entry_id, note_id) VALUES (16, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (17, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Captiva'), 
        2006, NULL, '2006+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (17, 17, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (17, (SELECT id FROM cross_ref WHERE label = 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (17, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (17, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (18, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Cavalier'), 
        1996, '2005', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (18, 18, 
        (SELECT id FROM system_type WHERE name = 'PassLock Anti Theft System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (18, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (18, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (18, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (19, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'City Express'), 
        2014, '2018', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (19, 19, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (19, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (19, (SELECT id FROM oem_key WHERE code = 'H0561-C993A, CWTWB1U751'));
INSERT INTO entry_note (entry_id, note_id) VALUES (19, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (20, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Cobalt'), 
        2004, '2006', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (20, 20, 
        (SELECT id FROM system_type WHERE name = 'PassKey 3+ Anti Theft System'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (20, (SELECT id FROM cross_ref WHERE label = 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (20, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (20, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (21, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Cobalt'), 
        2006, '2010', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (21, 21, 
        (SELECT id FROM system_type WHERE name = 'PassKey 3+ Anti Theft System'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (21, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (21, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (21, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (22, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Colorado'), 
        2003, '2008', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (22, 22, 
        (SELECT id FROM system_type WHERE name = 'PassLock Anti Theft System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (22, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (22, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (22, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (23, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Colorado'), 
        2008, '2012', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (23, 23, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (23, (SELECT id FROM cross_ref WHERE label = 'JMA TP08, Silca T6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (23, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (23, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (24, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Corvette'), 
        1986, '2004', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (24, 24, 
        (SELECT id FROM system_type WHERE name = 'VATS / PassKey System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (24, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (24, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (24, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (25, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Corvette'), 
        2005, '2007', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (25, 25, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (25, (SELECT id FROM cross_ref WHERE label = 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (25, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (25, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (26, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Corvette'), 
        2008, '2014', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (26, 26, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2+ / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7952A'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (26, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (26, (SELECT id FROM oem_key WHERE code = 'M3N5WY7777A 25926479, 25926480'));
INSERT INTO entry_note (entry_id, note_id) VALUES (26, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (27, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Corvette'), 
        2015, '2019', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (27, 27, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7952E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (27, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (27, (SELECT id FROM oem_key WHERE code = '23465955, 23465951, NBGGD9C04'));
INSERT INTO entry_note (entry_id, note_id) VALUES (27, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (28, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Corvette'), 
        2020, NULL, '2020+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (28, 28, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (28, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (28, (SELECT id FROM oem_key WHERE code = 'YG0G20TB1 13538853, 13538852'));
INSERT INTO entry_note (entry_id, note_id) VALUES (28, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (29, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Cruze'), 
        2008, '2011', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (29, 29, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (29, (SELECT id FROM cross_ref WHERE label = 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (29, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (29, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (30, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Cruze'), 
        2011, '2016', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (30, 30, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7952E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (30, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (30, (SELECT id FROM oem_key WHERE code = '13500318, 5921872, 5927057, OHT05918179'));
INSERT INTO entry_note (entry_id, note_id) VALUES (30, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (31, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Cruze'), 
        2016, '2019', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (31, 31, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7952E, PCF7961E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (31, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (31, (SELECT id FROM oem_key WHERE code = '13529661, 13529660, 13584504, 13508771'));
INSERT INTO entry_note (entry_id, note_id) VALUES (31, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (32, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Epica'), 
        2004, '2007', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (32, 32, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (32, (SELECT id FROM cross_ref WHERE label = 'JMA TP05, Silca 13'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (32, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (32, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (33, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Equinox'), 
        2006, '2010', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (33, 33, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (33, (SELECT id FROM cross_ref WHERE label = 'PCF7936, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (33, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (33, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (34, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Equinox'), 
        2010, '2017', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (34, 34, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7937E, NCF2951E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (34, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (34, (SELECT id FROM oem_key WHERE code = 'OHT01060512, 5913598, 20873621'));
INSERT INTO entry_note (entry_id, note_id) VALUES (34, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (35, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Equinox'), 
        2018, '2021', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (35, 35, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7961E, PCF7941E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (35, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (35, (SELECT id FROM oem_key WHERE code = 'HYQ4AA 13529665, 13585723, 13584498, 13529650'));
INSERT INTO entry_note (entry_id, note_id) VALUES (35, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (36, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Espero'), 
        1995, NULL, '1995+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (36, 36, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (36, (SELECT id FROM cross_ref WHERE label = 'JMA TP05, Silca 13'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (36, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (36, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (37, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Evanda'), 
        2003, '2006', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (37, 37, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Texas Crypto 4D / ID4D60'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (37, (SELECT id FROM cross_ref WHERE label = 'JMA TP19, XT27A66, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (37, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (37, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (38, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Express'), 
        1998, '2007', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (38, 38, 
        (SELECT id FROM system_type WHERE name = 'PassLock Anti Theft System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (38, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (38, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (38, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (39, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Express'), 
        2008, '2019', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (39, 39, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (39, (SELECT id FROM cross_ref WHERE label = 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (39, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (39, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (40, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'HHR'), 
        2005, '2011', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (40, 40, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (40, (SELECT id FROM cross_ref WHERE label = 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (40, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (40, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (41, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Impala'), 
        1995, '1996', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (41, 41, 
        (SELECT id FROM system_type WHERE name = 'VATS / PassKey System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (41, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (41, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (41, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (42, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Impala'), 
        2000, '2005', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (42, 42, 
        (SELECT id FROM system_type WHERE name = 'PassLock Anti Theft System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (42, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (42, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (42, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (43, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Impala'), 
        2006, '2014', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (43, 43, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (43, (SELECT id FROM cross_ref WHERE label = 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (43, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (43, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (44, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Impala'), 
        2014, '2020', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (44, 44, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7937E, PCF7941E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (44, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (44, (SELECT id FROM oem_key WHERE code = 'OHT01060512 13504200, 23335583, 5912543'));
INSERT INTO entry_note (entry_id, note_id) VALUES (44, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (45, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Lumina'), 
        1995, '2001', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (45, 45, 
        (SELECT id FROM system_type WHERE name = 'VATS / PassKey System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (45, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (45, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (45, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (46, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Malibu'), 
        1997, '2004', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (46, 46, 
        (SELECT id FROM system_type WHERE name = 'PassLock Anti Theft System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (46, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (46, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (46, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (47, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Malibu'), 
        2003, '2012', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (47, 47, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (47, (SELECT id FROM cross_ref WHERE label = 'PCF7936, JMA TP12GM, SILCA T14, CN3, XT27A66, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (47, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (47, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (48, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Malibu'), 
        2013, '2016', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (48, 48, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7937E, PCF7941E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (48, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (48, (SELECT id FROM oem_key WHERE code = 'OHT01060512 13504200, 23335583, 5912543'));
INSERT INTO entry_note (entry_id, note_id) VALUES (48, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (49, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Malibu'), 
        2016, '2021', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (49, 49, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7952E, PCF7961E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (49, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (49, (SELECT id FROM oem_key WHERE code = '13529661, 13529660, 13584504, 13508771'));
INSERT INTO entry_note (entry_id, note_id) VALUES (49, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (50, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Monte Carlo'), 
        1995, '1999', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (50, 50, 
        (SELECT id FROM system_type WHERE name = 'VATS / PassKey System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (50, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (50, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (50, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (51, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Monte Carlo'), 
        2000, '2005', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (51, 51, 
        (SELECT id FROM system_type WHERE name = 'PassLock Anti Theft System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (51, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (51, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (51, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (52, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Monte Carlo'), 
        2006, '2007', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (52, 52, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7936'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (52, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (52, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (52, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (53, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Optra'), 
        2003, '2008', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (53, 53, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Texas Crypto 4D / ID4D60'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (53, (SELECT id FROM cross_ref WHERE label = 'JMA TP19, XT27A66, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (53, (SELECT id FROM oem_key WHERE code = '96458347'));
INSERT INTO entry_note (entry_id, note_id) VALUES (53, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (54, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Orlando'), 
        2011, '2018', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (54, 54, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7937E, PCF7941E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (54, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (54, (SELECT id FROM oem_key WHERE code = '13500218, 13504196'));
INSERT INTO entry_note (entry_id, note_id) VALUES (54, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (55, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Silverado'), 
        1998, '2006', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (55, 55, 
        (SELECT id FROM system_type WHERE name = 'PassLock Anti Theft System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (55, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (55, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (55, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (56, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Silverado'), 
        2007, '2013', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (56, 56, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (56, (SELECT id FROM cross_ref WHERE label = 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (56, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (56, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (57, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Silverado'), 
        2014, '2019', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (57, 57, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7952E, PCF7937E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (57, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (57, (SELECT id FROM oem_key WHERE code = 'M3N32337100, 84540865, 13577770, 22881480'));
INSERT INTO entry_note (entry_id, note_id) VALUES (57, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (58, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Silverado'), 
        2019, '2021', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (58, 58, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7952E, PCF7961E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (58, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (58, (SELECT id FROM oem_key WHERE code = 'HYQ1EA 13508398, 13529632'));
INSERT INTO entry_note (entry_id, note_id) VALUES (58, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (59, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Silverado'), 
        2021, NULL, '2021+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (59, 59, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag Pro'), 
        (SELECT id FROM transponder_detail WHERE detail = 'NCF2951V, NCF2952V'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (59, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (59, (SELECT id FROM oem_key WHERE code = 'YG0G21TB2 13548437'));
INSERT INTO entry_note (entry_id, note_id) VALUES (59, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (60, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Sonic'), 
        2012, '2018', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (60, 60, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7937E, NCF2951E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (60, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (60, (SELECT id FROM oem_key WHERE code = 'KR55WK50073, 13575177'));
INSERT INTO entry_note (entry_id, note_id) VALUES (60, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (61, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Sonic'), 
        2017, '2020', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (61, 61, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7952E, PCF7941E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (61, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (61, (SELECT id FROM oem_key WHERE code = '13530752, HYQ4AA 13529664, 13585722'));
INSERT INTO entry_note (entry_id, note_id) VALUES (61, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (62, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Spark'), 
        2013, NULL, '2013+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (62, 62, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7937E, NCF2951E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (62, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (62, (SELECT id FROM oem_key WHERE code = 'OHT01060512, 20873621, 5913598'));
INSERT INTO entry_note (entry_id, note_id) VALUES (62, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (63, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Suburban'), 
        1998, '2006', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (63, 63, 
        (SELECT id FROM system_type WHERE name = 'PassLock Anti Theft System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (63, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (63, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (63, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (64, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Suburban'), 
        2007, '2014', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (64, 64, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (64, (SELECT id FROM cross_ref WHERE label = 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (64, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (64, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (65, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Suburban'), 
        2015, '2020', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (65, 65, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7952E, PCF7961E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (65, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (65, (SELECT id FROM oem_key WHERE code = 'HYQ1AA 13529634, HYQ1EA 13508282, 84540864'));
INSERT INTO entry_note (entry_id, note_id) VALUES (65, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (66, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Suburban'), 
        2021, NULL, '2021+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (66, 66, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (66, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (66, (SELECT id FROM oem_key WHERE code = '13541561, 13541565, 13537962'));
INSERT INTO entry_note (entry_id, note_id) VALUES (66, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (67, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'S10 Blazer'), 
        1996, '2003', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (67, 67, 
        (SELECT id FROM system_type WHERE name = 'PassLock Anti Theft System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (67, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (67, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (67, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (68, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'S10 Pickup'), 
        1997, '2004', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (68, 68, 
        (SELECT id FROM system_type WHERE name = 'PassLock Anti Theft System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (68, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (68, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (68, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (69, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Tahoe'), 
        1998, '2006', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (69, 69, 
        (SELECT id FROM system_type WHERE name = 'PassLock Anti Theft System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (69, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (69, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (69, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (70, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Tahoe'), 
        2007, '2014', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (70, 70, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (70, (SELECT id FROM cross_ref WHERE label = 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (70, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (70, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (71, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Tahoe'), 
        2015, '2020', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (71, 71, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7952E, PCF7941E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (71, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (71, (SELECT id FROM oem_key WHERE code = 'HYQ1AA 13580802, HYQ1EA 13508282, M3N32337100'));
INSERT INTO entry_note (entry_id, note_id) VALUES (71, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (72, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Tahoe'), 
        2021, NULL, '2021+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (72, 72, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (72, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (72, (SELECT id FROM oem_key WHERE code = '13541559, 13541561, 13541565, 13537962'));
INSERT INTO entry_note (entry_id, note_id) VALUES (72, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (73, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Trailblazer'), 
        2001, '2006', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (73, 73, 
        (SELECT id FROM system_type WHERE name = 'PassLock Anti Theft System'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (73, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (73, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (73, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (74, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Trailblazer'), 
        2006, '2009', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (74, 74, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (74, (SELECT id FROM cross_ref WHERE label = 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (74, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (74, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (75, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Traverse'), 
        2009, '2017', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (75, 75, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (75, (SELECT id FROM cross_ref WHERE label = 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (75, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (75, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (76, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Traverse'), 
        2018, '2020', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (76, 76, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7952E, PCF7961E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (76, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (76, (SELECT id FROM oem_key WHERE code = 'HYQ4EA 13519177, 13598815, 13519188'));
INSERT INTO entry_note (entry_id, note_id) VALUES (76, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (77, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Uplander'), 
        2005, '2009', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (77, 77, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (77, (SELECT id FROM cross_ref WHERE label = 'JMA TP05, Silca 13'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (77, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (77, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (78, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Venture'), 
        1999, '2005', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (78, 78, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (78, (SELECT id FROM cross_ref WHERE label = 'JMA TP05, Silca 13'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (78, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (78, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (79, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Vivant'), 
        2003, '2007', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (79, 79, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (79, (SELECT id FROM cross_ref WHERE label = 'JMA TP05, Silca 13'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (79, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (79, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (80, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Volt'), 
        2011, '2015', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (80, 80, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7937E, NCF2951E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (80, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (80, (SELECT id FROM oem_key WHERE code = 'OHT05918179, 22923862, 22755321, 5920157'));
INSERT INTO entry_note (entry_id, note_id) VALUES (80, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (81, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Volt'), 
        2016, '2019', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (81, 81, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / \~ID46, ID46E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7937E, PCF7952E'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (81, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (81, (SELECT id FROM oem_key WHERE code = 'HYQ4EA 13529638, 13598815, 13585728'));
INSERT INTO entry_note (entry_id, note_id) VALUES (81, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (82, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = '80'), 
        1996, '1996', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (82, 82, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Silca 13 / JMA TP05'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (82, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (82, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (82, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (83, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A1'), 
        2010, '2017', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (83, 83, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto ID48 (precoded dealer key)'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (83, (SELECT id FROM cross_ref WHERE label = 'JMA TP25 / SILCA A2'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (83, (SELECT id FROM oem_key WHERE code = '8X0837220, 8X0837220A'));
INSERT INTO entry_note (entry_id, note_id) VALUES (83, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (84, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A1'), 
        2018, NULL, '2018+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (84, 84, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto AES (“VAG MQB”) ID49'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Silca ID88'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (84, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (84, (SELECT id FROM oem_key WHERE code = '82A837220H, 82A837220E'));
INSERT INTO entry_note (entry_id, note_id) VALUES (84, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (85, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A2'), 
        2000, '2005', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (85, 85, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (85, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / Silca T6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (85, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (85, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (86, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A3'), 
        1996, '1998', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (86, 86, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Silca 13 / JMA TP05'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (86, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (86, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (86, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (87, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A3'), 
        1998, '2004', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (87, 87, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (87, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / Silca T6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (87, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (87, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (88, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A3'), 
        2004, '2012', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (88, 88, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto ID48 (precoded dealer key)'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (88, (SELECT id FROM cross_ref WHERE label = 'JMA TP25 / SILCA A2'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (88, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (88, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (89, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A3'), 
        2013, '2018', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (89, 89, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto AES (“VAG MQB”) ID49'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Silca ID88'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (89, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (89, (SELECT id FROM oem_key WHERE code = '8V0837220D, 8V0837220F'));
INSERT INTO entry_note (entry_id, note_id) VALUES (89, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (90, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A4 / S4'), 
        1995, '1997', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (90, 90, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Silca 13 / JMA TP05'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (90, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (90, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (90, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (91, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A4 / S4'), 
        1997, '2003', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (91, 91, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (91, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / Silca T6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (91, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (91, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (92, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A4 / S4'), 
        2004, '2008', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (92, 92, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto ID48 (precoded dealer key)'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (92, (SELECT id FROM cross_ref WHERE label = 'JMA TP25 / SILCA A2'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (92, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (92, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (93, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A4 / S4'), 
        2008, '2016', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (93, 93, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag Ext VAG'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7945AC (precoded dealer key)'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (93, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (93, (SELECT id FROM oem_key WHERE code = '8K0959754D, 8T0959754F'));
INSERT INTO entry_note (entry_id, note_id) VALUES (93, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (94, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A5 / S5'), 
        2007, '2016', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (94, 94, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag Ext VAG'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7945AC (precoded dealer key)'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (94, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (94, (SELECT id FROM oem_key WHERE code = '8T0959754A, 8T0959754D'));
INSERT INTO entry_note (entry_id, note_id) VALUES (94, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (95, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A6 / S6'), 
        1995, '1997', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (95, 95, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Silca 13 / JMA TP05'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (95, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (95, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (95, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (96, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A6 / S6'), 
        1997, '2004', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (96, 96, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (96, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / Silca T6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (96, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (96, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (97, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A6 / S6 (C6 4F)'), 
        2004, '2010', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (97, 97, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Sokymat Crypto 8E – Audi ID8E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'glass chip / MCU'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (97, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (97, (SELECT id FROM oem_key WHERE code = '4F0837220AK, 4F0837220R'));
INSERT INTO entry_note (entry_id, note_id) VALUES (97, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (98, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A6 / S6 (C7 4G)'), 
        2011, '2018', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (98, 98, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag Ext VAG'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7945AC (precoded dealer key)'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (98, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (98, (SELECT id FROM oem_key WHERE code = '4G0959754K, 4G0959754G'));
INSERT INTO entry_note (entry_id, note_id) VALUES (98, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (99, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A7 / S7'), 
        2010, '2018', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (99, 99, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag Ext VAG'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7945AC (precoded dealer key)'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (99, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (99, (SELECT id FROM oem_key WHERE code = '4H0959754DD, 4H0959754DB'));
INSERT INTO entry_note (entry_id, note_id) VALUES (99, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (100, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A8 / S8'), 
        1995, '1997', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (100, 100, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Silca 13 / JMA TP05'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (100, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (100, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (100, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (101, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A8 / S8'), 
        1997, '2003', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (101, 101, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (101, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / Silca T6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (101, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (101, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (102, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A8 / S8'), 
        2004, '2009', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (102, 102, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips ID46 – Hitag2'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7946 / PCF7936 / Silca T14 / JMA TP12'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (102, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (102, (SELECT id FROM oem_key WHERE code = '4E0837220M, 4E0837220N'));
INSERT INTO entry_note (entry_id, note_id) VALUES (102, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (103, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A8 / S8 (D4)'), 
        2010, '2017', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (103, 103, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag Ext VAG'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7945AC (precoded dealer key)'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (103, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (103, (SELECT id FROM oem_key WHERE code = '4H0959754K, 4H0959754BM'));
INSERT INTO entry_note (entry_id, note_id) VALUES (103, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (104, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'Allroad'), 
        2000, '2005', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (104, 104, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (104, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / Silca T6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (104, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (104, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (105, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'Allroad (C6 4F)'), 
        2004, '2010', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (105, 105, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Sokymat Crypto 8E – Audi ID8E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'glass chip / MCU'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (105, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (105, (SELECT id FROM oem_key WHERE code = '4F0837220AF, 4F0837220AJ'));
INSERT INTO entry_note (entry_id, note_id) VALUES (105, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (106, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'Allroad (C7 4G)'), 
        2010, '2017', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (106, 106, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag Ext VAG'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7945AC (precoded dealer key)'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (106, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (106, (SELECT id FROM oem_key WHERE code = '4G0959754BP, 4G0959754DC'));
INSERT INTO entry_note (entry_id, note_id) VALUES (106, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (107, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'Cabrio'), 
        1995, '1997', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (107, 107, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Silca 13 / JMA TP05'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (107, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (107, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (107, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (108, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'Cabrio'), 
        1997, NULL, '1997+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (108, 108, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (108, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / Silca T6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (108, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (108, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (109, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'Coupe S2'), 
        1995, '1997', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (109, 109, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Silca 13 / JMA TP05'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (109, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (109, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (109, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (110, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'Coupe S2'), 
        1997, NULL, '1997+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (110, 110, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (110, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / Silca T6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (110, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (110, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (111, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'Coupe'), 
        1995, '1997', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (111, 111, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Silca 13 / JMA TP05'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (111, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (111, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (111, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (112, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'Coupe'), 
        1997, NULL, '1997+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (112, 112, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (112, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / Silca T6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (112, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (112, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (113, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'Q7 (4L)'), 
        2006, '2015', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (113, 113, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Sokymat Crypto 8E – Audi ID8E'), 
        (SELECT id FROM transponder_detail WHERE detail = 'glass chip / MCU'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (113, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (113, (SELECT id FROM oem_key WHERE code = '4F0837220AG, 4F0837220Q'));
INSERT INTO entry_note (entry_id, note_id) VALUES (113, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (114, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'Q5'), 
        2008, '2016', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (114, 114, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag Ext VAG'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7945AC (precoded dealer key)'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (114, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (114, (SELECT id FROM oem_key WHERE code = '8K0959754BR, 8K0959754BP'));
INSERT INTO entry_note (entry_id, note_id) VALUES (114, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (115, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'Q3'), 
        2011, '2018', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (115, 115, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto ID48 (precoded dealer key)'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (115, (SELECT id FROM cross_ref WHERE label = 'JMA TP25 / SILCA A2'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (115, (SELECT id FROM oem_key WHERE code = '8X0837220R, 8X0837220C'));
INSERT INTO entry_note (entry_id, note_id) VALUES (115, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (116, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'Q2'), 
        2016, NULL, '2016+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (116, 116, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto AES (“VAG MQB”) ID49'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Silca ID88'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (116, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (116, (SELECT id FROM oem_key WHERE code = '81A837220, 81A837220E'));
INSERT INTO entry_note (entry_id, note_id) VALUES (116, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (117, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'TT'), 
        1998, '1999', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (117, 117, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (117, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (117, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (117, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (118, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'TT'), 
        2000, '2006', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (118, 118, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (118, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / Silca T6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (118, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (118, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (119, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'TT'), 
        2006, '2013', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (119, 119, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto ID48 (precoded dealer key)'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (119, (SELECT id FROM cross_ref WHERE label = 'JMA TP25 / SILCA A2'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (119, (SELECT id FROM oem_key WHERE code = '8P0837220D, 8P0837220G'));
INSERT INTO entry_note (entry_id, note_id) VALUES (119, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (120, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'TT / TTS'), 
        2014, '2018', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (120, 120, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto AES (“VAG MQB”) ID49'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Silca ID88'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (120, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (120, (SELECT id FROM oem_key WHERE code = '8S0959754H, 8S0959754AL'));
INSERT INTO entry_note (entry_id, note_id) VALUES (120, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (121, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = '500'), 
        2007, '2018', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (121, 121, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7946'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (121, (SELECT id FROM cross_ref WHERE label = 'JMA TP12 / XT27 / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (121, (SELECT id FROM oem_key WHERE code = '71749374, 71776098, 6000626799'));
INSERT INTO entry_note (entry_id, note_id) VALUES (121, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (122, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = '500L'), 
        2012, '2020', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (122, 122, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7946'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (122, (SELECT id FROM cross_ref WHERE label = 'JMA TP12 / XT27 / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (122, (SELECT id FROM oem_key WHERE code = '71752197, 6000626708, 6000626710'));
INSERT INTO entry_note (entry_id, note_id) VALUES (122, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (123, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = '500L'), 
        2014, '2020', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (123, 123, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos AES / ID88'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (123, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (123, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (123, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (124, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = '500X'), 
        2014, '2020', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (124, 124, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos AES / ID88 OR Philips Crypto 3 / Hitag 3 / ID49'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (124, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (124, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (124, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (125, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Albea'), 
        2002, '2012', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (125, 125, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (125, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / KD48 / CN6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (125, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (125, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (126, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Barchetta'), 
        1995, '2002', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (126, 126, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (126, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (126, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (126, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (127, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Brava'), 
        1995, '1997', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (127, 127, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (127, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (127, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (127, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (128, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Brava'), 
        1997, '2001', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (128, 128, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Temic 11 / ID11'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (128, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (128, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (128, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (129, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Bravo'), 
        1995, '1997', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (129, 129, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (129, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (129, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (129, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (130, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Bravo'), 
        1997, '2001', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (130, 130, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13 OR Temic 11 / ID11'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (130, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (130, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (130, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (131, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Bravo'), 
        2007, '2014', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (131, 131, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48 OR Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (131, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (131, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (131, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (132, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Cinquecento'), 
        1995, '1998', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (132, 132, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (132, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (132, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (132, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (133, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Coupe'), 
        1995, NULL, '1995+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (133, 133, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips 33 / ID33 OR Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (133, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (133, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (133, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (134, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Croma'), 
        1996, '1997', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (134, 134, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips 33 / ID33 OR Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (134, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (134, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (134, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (135, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Croma'), 
        2005, '2011', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (135, 135, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (135, (SELECT id FROM cross_ref WHERE label = 'PCF7936 / JMA TP12 / SILCA GTI / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (135, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (135, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (136, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Doblo'), 
        2000, '2006', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (136, 136, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (136, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / KD48 / CN6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (136, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (136, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (137, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Doblo'), 
        2006, '2010', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (137, 137, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (137, (SELECT id FROM cross_ref WHERE label = 'PCF7936 / JMA TP12 / SILCA GTI / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (137, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (137, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (138, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Doblo (S.A.)'), 
        2006, '2011', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (138, 138, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (138, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / KD48 / CN6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (138, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (138, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (139, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Doblo'), 
        2010, '2018', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (139, 139, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7946'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (139, (SELECT id FROM cross_ref WHERE label = 'JMA TP12 / XT27 / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (139, (SELECT id FROM oem_key WHERE code = '71749374, 71776098, 6000626799'));
INSERT INTO entry_note (entry_id, note_id) VALUES (139, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (140, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Ducato'), 
        1996, '2002', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (140, 140, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (140, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (140, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (140, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (141, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Ducato'), 
        2002, '2008', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (141, 141, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (141, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / KD48 / CN6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (141, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (141, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (142, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Ducato'), 
        2008, '2020', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (142, 142, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7946'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (142, (SELECT id FROM cross_ref WHERE label = 'JMA TP12 / XT27 / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (142, (SELECT id FROM oem_key WHERE code = '6000627330, 6000628569, 6000631468'));
INSERT INTO entry_note (entry_id, note_id) VALUES (142, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (143, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Egea'), 
        2015, NULL, '2015+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (143, 143, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos AES / ID88'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (143, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (143, (SELECT id FROM oem_key WHERE code = '71778806, 6000626702'));
INSERT INTO entry_note (entry_id, note_id) VALUES (143, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (144, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Fiorino'), 
        1996, '2000', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (144, 144, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13 OR Temic 11 / ID11'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (144, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (144, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (144, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (145, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Fiorino (S.A.)'), 
        1996, '2008', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (145, 145, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13 OR Temic 11 / ID11'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (145, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (145, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (145, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (146, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Fiorino'), 
        2007, NULL, '2007+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (146, 146, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7946'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (146, (SELECT id FROM cross_ref WHERE label = 'JMA TP12 / XT27 / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (146, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (146, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (147, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Freemont'), 
        2011, NULL, '2011+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (147, 147, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7945 / PCF7953'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (147, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (147, (SELECT id FROM oem_key WHERE code = '56046681AE, M3N-40821302'));
INSERT INTO entry_note (entry_id, note_id) VALUES (147, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (148, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Fullback'), 
        2016, NULL, '2016+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (148, 148, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 3 / Hitag3 / ID49'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (148, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (148, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (148, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (149, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Grand Siena'), 
        2012, NULL, '2012+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (149, 149, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7946'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (149, (SELECT id FROM cross_ref WHERE label = 'JMA TP12 / XT27 / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (149, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (149, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (150, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Grande Punto'), 
        2005, '2012', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (150, 150, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7946'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (150, (SELECT id FROM cross_ref WHERE label = 'JMA TP12 / XT27 / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (150, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (150, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (151, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Idea'), 
        2003, '2010', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (151, 151, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (151, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / KD48 / CN6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (151, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (151, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (152, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Idea'), 
        2010, NULL, '2010+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (152, 152, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7946'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (152, (SELECT id FROM cross_ref WHERE label = 'JMA TP12 / XT27 / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (152, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (152, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (153, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Idea (S.A.)'), 
        2010, NULL, '2010+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (153, 153, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (153, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / KD48 / CN6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (153, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (153, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (154, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Linea'), 
        2007, '2015', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (154, 154, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (154, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / KD48 / CN6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (154, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (154, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (155, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Marea'), 
        1996, NULL, '1996+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (155, 155, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13 OR Temic 11 / ID11'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (155, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (155, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (155, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (156, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Marengo'), 
        1996, NULL, '1996+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (156, 156, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13 OR Temic 11 / ID11'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (156, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (156, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (156, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (157, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Mille'), 
        2005, NULL, '2005+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (157, 157, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (157, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / KD48 / CN6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (157, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (157, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (158, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Multipla'), 
        1998, '2010', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (158, 158, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (158, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / KD48 / CN6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (158, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (158, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (159, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Palio'), 
        1996, '2001', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (159, 159, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Temic 11 / ID11'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (159, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (159, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (159, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (160, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Palio'), 
        2002, '2007', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (160, 160, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (160, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / KD48 / CN6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (160, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (160, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (161, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Palio'), 
        2007, NULL, '2007+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (161, 161, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7946'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (161, (SELECT id FROM cross_ref WHERE label = 'JMA TP12 / XT27 / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (161, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (161, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (162, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Panda'), 
        1995, '2002', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (162, 162, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (162, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (162, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (162, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (163, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Panda'), 
        2002, NULL, '2002+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (163, 163, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (163, (SELECT id FROM cross_ref WHERE label = 'PCF7936 / JMA TP12 / SILCA GTI / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (163, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (163, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (164, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Punto'), 
        1995, '1999', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (164, 164, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (164, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (164, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (164, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (165, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Punto'), 
        1999, '2005', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (165, 165, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (165, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / KD48 / CN6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (165, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (165, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (166, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Punto'), 
        2006, NULL, '2006+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (166, 166, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7946'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (166, (SELECT id FROM cross_ref WHERE label = 'JMA TP12 / XT27 / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (166, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (166, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (167, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Punto Evo'), 
        2010, NULL, '2010+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (167, 167, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7946'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (167, (SELECT id FROM cross_ref WHERE label = 'JMA TP12 / XT27 / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (167, (SELECT id FROM oem_key WHERE code = '6000628443, 71749374, 71776098'));
INSERT INTO entry_note (entry_id, note_id) VALUES (167, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (168, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Qubo'), 
        2008, '2016', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (168, 168, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7946'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (168, (SELECT id FROM cross_ref WHERE label = 'JMA TP12 / XT27 / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (168, (SELECT id FROM oem_key WHERE code = '71765697, 6000629617'));
INSERT INTO entry_note (entry_id, note_id) VALUES (168, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (169, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Scudo'), 
        1996, '2002', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (169, 169, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips 33 / ID33 OR Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (169, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (169, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (169, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (170, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Scudo'), 
        2002, '2006', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (170, 170, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (170, (SELECT id FROM cross_ref WHERE label = 'PCF7936 / JMA TP12 / SILCA GTI / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (170, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (170, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (171, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Scudo'), 
        2007, NULL, '2007+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (171, 171, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7941'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (171, (SELECT id FROM cross_ref WHERE label = 'JMA TP12 / SILCA GTI / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (171, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (171, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (172, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Sedici (diesel)'), 
        2005, '2014', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (172, 172, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto / ID40'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (172, (SELECT id FROM cross_ref WHERE label = 'PCF7935 / JMA TP12 / XT27 / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (172, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (172, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (173, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Sedici (petrol)'), 
        2005, '2014', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (173, 173, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (173, (SELECT id FROM cross_ref WHERE label = 'PCF7936 / JMA TP12 / SILCA GTI / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (173, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (173, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (174, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Seicento'), 
        1997, '2000', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (174, 174, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (174, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (174, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (174, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (175, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Seicento'), 
        2000, '2010', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (175, 175, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (175, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / KD48 / CN6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (175, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (175, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (176, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Siena'), 
        1996, '2001', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (176, 176, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Temic 11 / ID11 OR Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (176, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (176, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (176, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (177, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Siena'), 
        2002, NULL, '2002+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (177, 177, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (177, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / KD48 / CN6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (177, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (177, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (178, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Stilo'), 
        2001, '2008', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (178, 178, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (178, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / KD48 / CN6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (178, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (178, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (179, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Tempra'), 
        1995, NULL, '1995+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (179, 179, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (179, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (179, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (179, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (180, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Tipo'), 
        2015, NULL, '2015+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (180, 180, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos AES / ID88'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (180, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (180, (SELECT id FROM oem_key WHERE code = '71778806, 6000626702'));
INSERT INTO entry_note (entry_id, note_id) VALUES (180, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (181, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Ulysse'), 
        1996, '2002', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (181, 181, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips 33 / ID33 OR Megamos 13 / ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (181, (SELECT id FROM cross_ref WHERE label = 'JMA TP05 / SILCA T5'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (181, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (181, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (182, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Ulysse'), 
        2002, NULL, '2002+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (182, 182, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7941'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (182, (SELECT id FROM cross_ref WHERE label = 'JMA TP12 / SILCA GTI / K-JMD'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (182, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (182, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (183, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Fiat' AND m.name = 'Viaggio'), 
        2012, NULL, '2012+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (183, 183, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Hitag AES'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7961M'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (183, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (183, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (183, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (184, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Isuzu' AND m.name = 'Ascender'), 
        2003, '2008', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (184, 184, 
        (SELECT id FROM system_type WHERE name = 'Non-Transponder Key'), 
        (SELECT id FROM transponder_family WHERE name = 'Standard Key'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (184, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (184, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (184, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (185, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Isuzu' AND m.name = 'Aska'), 
        1998, '2002', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (185, 185, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (185, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / KD48 / CN6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (185, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (185, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (186, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Isuzu' AND m.name = 'Axiom'), 
        2002, '2005', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (186, 186, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (186, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / KD48 / CN6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (186, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (186, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (187, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Isuzu' AND m.name = 'Big Horn'), 
        1998, '2002', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (187, 187, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Texas Crypto 4D / 4D64'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (187, (SELECT id FROM cross_ref WHERE label = 'JMA TPX2 / JMA TP21 / SILCA GTI / YS-01 / K-JMD / XT27'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (187, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (187, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (188, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Isuzu' AND m.name = 'D-Max'), 
        2002, '2006', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (188, 188, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (188, (SELECT id FROM cross_ref WHERE label = 'JMA TP08 / KD48 / CN6'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (188, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (188, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (189, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Isuzu' AND m.name = 'D-Max'), 
        2007, '2012', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (189, 189, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7936'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (189, (SELECT id FROM cross_ref WHERE label = 'JMA TP12 / SILCA T14 / CN3'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (189, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (189, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (190, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Isuzu' AND m.name = 'D-Max'), 
        2012, NULL, '2012+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (190, 190, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 ID46 OR NXP Hitag-3 / ID49'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (190, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (190, (SELECT id FROM oem_key WHERE code = 'EMU470102, ACJ932U01'));
INSERT INTO entry_note (entry_id, note_id) VALUES (190, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (191, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Isuzu' AND m.name = 'ELF'), 
        2009, NULL, '2009+');
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (191, 191, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7936'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (191, (SELECT id FROM cross_ref WHERE label = 'JMA TP12 / SILCA T14 / CN3'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (191, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (191, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (192, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Isuzu' AND m.name = 'Fargo'), 
        1998, '2001', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (192, 192, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Texas Crypto 4D / 4D64'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (192, (SELECT id FROM cross_ref WHERE label = 'JMA TPX2 / JMA TP21 / SILCA GTI / YS-01 / K-JMD / XT27'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (192, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (192, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (193, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Isuzu' AND m.name = 'MU-X'), 
        2004, '2013', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (193, 193, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Philips Crypto 2 / Hitag2 / ID46'), 
        (SELECT id FROM transponder_detail WHERE detail = 'PCF7936'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (193, (SELECT id FROM cross_ref WHERE label = 'JMA TP12 / SILCA T14 / CN3'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (193, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (193, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (194, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Isuzu' AND m.name = 'Trooper'), 
        1996, '1998', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (194, 194, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Megamos ID13'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Silca 13 / JMA TP05'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (194, (SELECT id FROM cross_ref WHERE label = 'Consult manual'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (194, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (194, (SELECT id FROM note WHERE text = 'No additional notes'));

INSERT INTO vehicle_range (id, model_id, year_from, year_to, year_note) 
VALUES (195, 
        (SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Isuzu' AND m.name = 'Trooper'), 
        1998, '2002', NULL);
INSERT INTO entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (195, 195, 
        (SELECT id FROM system_type WHERE name = 'Not Specified'), 
        (SELECT id FROM transponder_family WHERE name = 'Texas Crypto 4D / 4D64'), 
        (SELECT id FROM transponder_detail WHERE detail = 'Standard chip'));
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) VALUES (195, (SELECT id FROM cross_ref WHERE label = 'JMA TPX2 / JMA TP21 / SILCA GTI / YS-01 / K-JMD / XT27'));
INSERT INTO entry_oem_key (entry_id, oem_key_id) VALUES (195, (SELECT id FROM oem_key WHERE code = 'See dealer'));
INSERT INTO entry_note (entry_id, note_id) VALUES (195, (SELECT id FROM note WHERE text = 'No additional notes'));

-- Reset sequences
SELECT setval('system_type_id_seq', COALESCE((SELECT MAX(id) FROM system_type), 1));
SELECT setval('transponder_family_id_seq', COALESCE((SELECT MAX(id) FROM transponder_family), 1));
SELECT setval('transponder_detail_id_seq', COALESCE((SELECT MAX(id) FROM transponder_detail), 1));
SELECT setval('cross_ref_id_seq', COALESCE((SELECT MAX(id) FROM cross_ref), 1));
SELECT setval('oem_key_id_seq', COALESCE((SELECT MAX(id) FROM oem_key), 1));
SELECT setval('note_id_seq', COALESCE((SELECT MAX(id) FROM note), 1));
SELECT setval('model_id_seq', COALESCE((SELECT MAX(id) FROM model), 1));
SELECT setval('vehicle_range_id_seq', COALESCE((SELECT MAX(id) FROM vehicle_range), 1));
SELECT setval('entry_id_seq', COALESCE((SELECT MAX(id) FROM entry), 1));

COMMIT;
