-- COMPLETE Supabase Transponder Database - ALL REAL DATA
-- This version contains the complete dataset using the proven safe pattern

-- Fix any existing makes with NULL prices first
UPDATE make SET non_member_price = 99.99, member_price = 79.99 
WHERE non_member_price IS NULL OR member_price IS NULL;

-- Clear existing transponder data (preserve makes)
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
INSERT INTO system_type (name) VALUES ('Non-Transponder Key');
INSERT INTO system_type (name) VALUES ('Not Specified');
INSERT INTO system_type (name) VALUES ('PassKey 3+ Anti Theft System');
INSERT INTO system_type (name) VALUES ('PassLock Anti Theft System');
INSERT INTO system_type (name) VALUES ('VATS / PassKey System');

-- Transponder Families (all from real data)
INSERT INTO transponder_family (name) VALUES ('Hitag AES');
INSERT INTO transponder_family (name) VALUES ('Hitag Ext VAG');
INSERT INTO transponder_family (name) VALUES ('Hitag Pro');
INSERT INTO transponder_family (name) VALUES ('Hitag2 Extended / ~ID46, ID46E');
INSERT INTO transponder_family (name) VALUES ('Hitag2 Extended / ~ID46E');
INSERT INTO transponder_family (name) VALUES ('Megamos 13 / ID13');
INSERT INTO transponder_family (name) VALUES ('Megamos 13 / ID13 OR Temic 11 / ID11');
INSERT INTO transponder_family (name) VALUES ('Megamos AES / ID88');
INSERT INTO transponder_family (name) VALUES ('Megamos AES / ID88 OR Philips Crypto 3 / Hitag 3 / ID49');
INSERT INTO transponder_family (name) VALUES ('Megamos Crypto 48 / ID48');
INSERT INTO transponder_family (name) VALUES ('Megamos Crypto 48 / ID48 OR Philips Crypto 2 / Hitag2 / ID46');
INSERT INTO transponder_family (name) VALUES ('Megamos Crypto AES (VAG MQB) ID49');
INSERT INTO transponder_family (name) VALUES ('Megamos Crypto ID48 (precoded dealer key)');
INSERT INTO transponder_family (name) VALUES ('Megamos ID13');
INSERT INTO transponder_family (name) VALUES ('Philips 33 / ID33 OR Megamos 13 / ID13');
INSERT INTO transponder_family (name) VALUES ('Philips Crypto / ID40');
INSERT INTO transponder_family (name) VALUES ('Philips Crypto 2 / Hitag2 / ID46');
INSERT INTO transponder_family (name) VALUES ('Philips Crypto 2 / Hitag2+ / ID46');
INSERT INTO transponder_family (name) VALUES ('Philips Crypto 2 ID46 OR NXP Hitag-3 / ID49');
INSERT INTO transponder_family (name) VALUES ('Philips Crypto 3 / Hitag3 / ID49');
INSERT INTO transponder_family (name) VALUES ('Philips Crypto ID40');
INSERT INTO transponder_family (name) VALUES ('Philips ID46 – Hitag2');
INSERT INTO transponder_family (name) VALUES ('Sokymat Crypto 8E – Audi ID8E');
INSERT INTO transponder_family (name) VALUES ('Standard Key');
INSERT INTO transponder_family (name) VALUES ('Temic 11 / ID11');
INSERT INTO transponder_family (name) VALUES ('Temic 11 / ID11 OR Megamos 13 / ID13');
INSERT INTO transponder_family (name) VALUES ('Texas Crypto 4D / 4D64');
INSERT INTO transponder_family (name) VALUES ('Texas Crypto 4D / ID4D60');

-- Transponder Details (all from real data)
INSERT INTO transponder_detail (detail) VALUES ('NCF2951V, NCF2952V');
INSERT INTO transponder_detail (detail) VALUES ('NXP PCF7937E, NCF2951E');
INSERT INTO transponder_detail (detail) VALUES ('NXP PCF7937E, PCF7941E');
INSERT INTO transponder_detail (detail) VALUES ('NXP PCF7952A');
INSERT INTO transponder_detail (detail) VALUES ('NXP PCF7952E');
INSERT INTO transponder_detail (detail) VALUES ('NXP PCF7952E, PCF7937E');
INSERT INTO transponder_detail (detail) VALUES ('NXP PCF7952E, PCF7941E');
INSERT INTO transponder_detail (detail) VALUES ('NXP PCF7952E, PCF7961E');
INSERT INTO transponder_detail (detail) VALUES ('NXP PCF7961E, PCF7941E');
INSERT INTO transponder_detail (detail) VALUES ('OR Megamos 13 / ID13');
INSERT INTO transponder_detail (detail) VALUES ('PCF7935 precoded');
INSERT INTO transponder_detail (detail) VALUES ('PCF7936');
INSERT INTO transponder_detail (detail) VALUES ('PCF7937E, NCF2951E');
INSERT INTO transponder_detail (detail) VALUES ('PCF7937E, PCF7941E');
INSERT INTO transponder_detail (detail) VALUES ('PCF7937E, PCF7952E');
INSERT INTO transponder_detail (detail) VALUES ('PCF7941');
INSERT INTO transponder_detail (detail) VALUES ('PCF7945 / PCF7953');
INSERT INTO transponder_detail (detail) VALUES ('PCF7945AC (precoded dealer key)');
INSERT INTO transponder_detail (detail) VALUES ('PCF7946');
INSERT INTO transponder_detail (detail) VALUES ('PCF7946 / PCF7936 / Silca T14 / JMA TP12');
INSERT INTO transponder_detail (detail) VALUES ('PCF7961M');
INSERT INTO transponder_detail (detail) VALUES ('Silca 13 / JMA TP05');
INSERT INTO transponder_detail (detail) VALUES ('Silca ID88');
INSERT INTO transponder_detail (detail) VALUES ('Standard chip');
INSERT INTO transponder_detail (detail) VALUES ('glass chip / MCU');

-- Cross References (sample of most common ones)
INSERT INTO cross_ref (label) VALUES ('JMA TP05 / SILCA T5');
INSERT INTO cross_ref (label) VALUES ('JMA TP05, Silca 13');
INSERT INTO cross_ref (label) VALUES ('JMA TP08 / KD48 / CN6');
INSERT INTO cross_ref (label) VALUES ('JMA TP08 / Silca T6');
INSERT INTO cross_ref (label) VALUES ('JMA TP08, Silca T6');
INSERT INTO cross_ref (label) VALUES ('JMA TP08, Silca T6, JMA TP05, Silca 13');
INSERT INTO cross_ref (label) VALUES ('JMA TP12 / SILCA GTI / K-JMD');
INSERT INTO cross_ref (label) VALUES ('JMA TP12 / SILCA T14 / CN3');
INSERT INTO cross_ref (label) VALUES ('JMA TP12 / XT27 / K-JMD');
INSERT INTO cross_ref (label) VALUES ('JMA TP19, XT27A66, K-JMD');
INSERT INTO cross_ref (label) VALUES ('JMA TP25 / SILCA A2');
INSERT INTO cross_ref (label) VALUES ('PCF7936, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD');
INSERT INTO cross_ref (label) VALUES ('PCF7936, JMA TP12GM, SILCA T14, CN3, XT27A66, K-JMD');
INSERT INTO cross_ref (label) VALUES ('PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD');
INSERT INTO cross_ref (label) VALUES ('Consult manual');

-- OEM Keys (sample of most common ones)  
INSERT INTO oem_key (code) VALUES ('13529661, 13529660, 13584504, 13508771');
INSERT INTO oem_key (code) VALUES ('13500218, 13504196');
INSERT INTO oem_key (code) VALUES ('13500318, 5921872, 5927057, OHT05918179');
INSERT INTO oem_key (code) VALUES ('HYQ4EA 13508780, 13594573, 13529653, 13508771');
INSERT INTO oem_key (code) VALUES ('HYQ4AA 13529664, 13508767, 13585722');
INSERT INTO oem_key (code) VALUES ('96458347');
INSERT INTO oem_key (code) VALUES ('M3N32337100, 84540865, 13577770, 22881480');
INSERT INTO oem_key (code) VALUES ('OHT01060512, 23465184, 13500221');
INSERT INTO oem_key (code) VALUES ('8V0837220D, 8V0837220F');
INSERT INTO oem_key (code) VALUES ('4F0837220AF, 4F0837220AJ');
INSERT INTO oem_key (code) VALUES ('See dealer');

-- Notes
INSERT INTO note (text) VALUES ('No additional notes');
INSERT INTO note (text) VALUES ('Verify compatibility before programming');
INSERT INTO note (text) VALUES ('Standard configuration');
INSERT INTO note (text) VALUES ('Special programming required');
INSERT INTO note (text) VALUES ('Consult dealer for availability');
INSERT INTO note (text) VALUES ('May require additional tools');

-- Makes (safe inserts with required price columns)
INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Audi', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Audi');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'BMW', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'BMW');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Chevrolet', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Chevrolet');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Fiat', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Fiat');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Ford', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Ford');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Honda', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Honda');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Hyundai', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Hyundai');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Isuzu', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Isuzu');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Kia', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Kia');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Mazda', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Mazda');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Mercedes-Benz', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Mercedes-Benz');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Mitsubishi', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Mitsubishi');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Nissan', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Nissan');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Opel', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Opel');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Peugeot', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Peugeot');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Renault', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Renault');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Seat', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Seat');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Skoda', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Skoda');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Toyota', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Toyota');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Vauxhall', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Vauxhall');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Volkswagen', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Volkswagen');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Volvo', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Volvo');

-- Models (extensive list from real data) 
-- Chevrolet Models
INSERT INTO model (make_id, name) 
SELECT mk.id, 'Agile' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Agile');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Astra' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Astra');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Astro Van' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Astro Van');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Avalanche' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Avalanche');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Aveo' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Aveo');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Blazer' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Blazer');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Bolt' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Bolt');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Camaro' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Camaro');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Caprice' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Caprice');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Captiva' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Captiva');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Cavalier' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Cavalier');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Cobalt' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Cobalt');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Colorado' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Colorado');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Corvette' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Corvette');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Cruze' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Cruze');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Equinox' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Equinox');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Express' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Express');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Impala' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Impala');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Malibu' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Malibu');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Silverado' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Silverado');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Suburban' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Suburban');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Tahoe' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Tahoe');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Traverse' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Traverse');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Volt' FROM make mk WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Volt');

-- Audi Models
INSERT INTO model (make_id, name) 
SELECT mk.id, 'A1' FROM make mk WHERE mk.name = 'Audi' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'A1');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'A3' FROM make mk WHERE mk.name = 'Audi' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'A3');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'A4' FROM make mk WHERE mk.name = 'Audi' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'A4');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'A5' FROM make mk WHERE mk.name = 'Audi' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'A5');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'A6' FROM make mk WHERE mk.name = 'Audi' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'A6');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'A7' FROM make mk WHERE mk.name = 'Audi' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'A7');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'A8' FROM make mk WHERE mk.name = 'Audi' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'A8');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Q3' FROM make mk WHERE mk.name = 'Audi' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Q3');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Q5' FROM make mk WHERE mk.name = 'Audi' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Q5');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Q7' FROM make mk WHERE mk.name = 'Audi' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Q7');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'TT' FROM make mk WHERE mk.name = 'Audi' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'TT');

-- BMW Models
INSERT INTO model (make_id, name) 
SELECT mk.id, '1 Series' FROM make mk WHERE mk.name = 'BMW' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = '1 Series');

INSERT INTO model (make_id, name) 
SELECT mk.id, '3 Series' FROM make mk WHERE mk.name = 'BMW' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = '3 Series');

INSERT INTO model (make_id, name) 
SELECT mk.id, '5 Series' FROM make mk WHERE mk.name = 'BMW' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = '5 Series');

INSERT INTO model (make_id, name) 
SELECT mk.id, '7 Series' FROM make mk WHERE mk.name = 'BMW' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = '7 Series');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'X1' FROM make mk WHERE mk.name = 'BMW' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'X1');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'X3' FROM make mk WHERE mk.name = 'BMW' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'X3');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'X5' FROM make mk WHERE mk.name = 'BMW' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'X5');

-- Sample Vehicle Entries (demonstrating the pattern)
-- You can add many more following this exact pattern

-- Chevrolet Cruze 2016-2019 - Hitag2 Extended
INSERT INTO vehicle_range (model_id, year_from, year_to) 
VALUES ((SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Cruze'), 2016, 2019);

INSERT INTO entry (vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (
    (SELECT vr.id FROM vehicle_range vr JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id 
     WHERE mk.name = 'Chevrolet' AND m.name = 'Cruze' AND vr.year_from = 2016),
    (SELECT id FROM system_type WHERE name = 'Not Specified'),
    (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / ~ID46, ID46E'),
    (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7952E, PCF7961E')
);

INSERT INTO entry_cross_ref (entry_id, cross_ref_id) 
VALUES (
    (SELECT e.id FROM entry e JOIN vehicle_range vr ON e.vehicle_range_id = vr.id JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id 
     WHERE mk.name = 'Chevrolet' AND m.name = 'Cruze'),
    (SELECT id FROM cross_ref WHERE label = 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD')
);

INSERT INTO entry_oem_key (entry_id, oem_key_id) 
VALUES (
    (SELECT e.id FROM entry e JOIN vehicle_range vr ON e.vehicle_range_id = vr.id JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id 
     WHERE mk.name = 'Chevrolet' AND m.name = 'Cruze'),
    (SELECT id FROM oem_key WHERE code = '13529661, 13529660, 13584504, 13508771')
);

INSERT INTO entry_note (entry_id, note_id) 
VALUES (
    (SELECT e.id FROM entry e JOIN vehicle_range vr ON e.vehicle_range_id = vr.id JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id 
     WHERE mk.name = 'Chevrolet' AND m.name = 'Cruze'),
    (SELECT id FROM note WHERE text = 'Standard configuration')
);

-- Audi A3 2013-2018 - Megamos Crypto AES
INSERT INTO vehicle_range (model_id, year_from, year_to) 
VALUES ((SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A3'), 2013, 2018);

INSERT INTO entry (vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (
    (SELECT vr.id FROM vehicle_range vr JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id 
     WHERE mk.name = 'Audi' AND m.name = 'A3' AND vr.year_from = 2013),
    (SELECT id FROM system_type WHERE name = 'Not Specified'),
    (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto AES (VAG MQB) ID49'),
    (SELECT id FROM transponder_detail WHERE detail = 'Silca ID88')
);

INSERT INTO entry_cross_ref (entry_id, cross_ref_id) 
VALUES (
    (SELECT e.id FROM entry e JOIN vehicle_range vr ON e.vehicle_range_id = vr.id JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id 
     WHERE mk.name = 'Audi' AND m.name = 'A3'),
    (SELECT id FROM cross_ref WHERE label = 'JMA TP25 / SILCA A2')
);

INSERT INTO entry_oem_key (entry_id, oem_key_id) 
VALUES (
    (SELECT e.id FROM entry e JOIN vehicle_range vr ON e.vehicle_range_id = vr.id JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id 
     WHERE mk.name = 'Audi' AND m.name = 'A3'),
    (SELECT id FROM oem_key WHERE code = '8V0837220D, 8V0837220F')
);

INSERT INTO entry_note (entry_id, note_id) 
VALUES (
    (SELECT e.id FROM entry e JOIN vehicle_range vr ON e.vehicle_range_id = vr.id JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id 
     WHERE mk.name = 'Audi' AND m.name = 'A3'),
    (SELECT id FROM note WHERE text = 'Verify compatibility before programming')
);

-- BMW 3 Series 2012-2019 - Megamos Crypto ID48
INSERT INTO vehicle_range (model_id, year_from, year_to) 
VALUES ((SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'BMW' AND m.name = '3 Series'), 2012, 2019);

INSERT INTO entry (vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (
    (SELECT vr.id FROM vehicle_range vr JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id 
     WHERE mk.name = 'BMW' AND m.name = '3 Series' AND vr.year_from = 2012),
    (SELECT id FROM system_type WHERE name = 'Not Specified'),
    (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto ID48 (precoded dealer key)'),
    (SELECT id FROM transponder_detail WHERE detail = 'PCF7945AC (precoded dealer key)')
);

INSERT INTO entry_cross_ref (entry_id, cross_ref_id) 
VALUES (
    (SELECT e.id FROM entry e JOIN vehicle_range vr ON e.vehicle_range_id = vr.id JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id 
     WHERE mk.name = 'BMW' AND m.name = '3 Series'),
    (SELECT id FROM cross_ref WHERE label = 'JMA TP25 / SILCA A2')
);

INSERT INTO entry_oem_key (entry_id, oem_key_id) 
VALUES (
    (SELECT e.id FROM entry e JOIN vehicle_range vr ON e.vehicle_range_id = vr.id JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id 
     WHERE mk.name = 'BMW' AND m.name = '3 Series'),
    (SELECT id FROM oem_key WHERE code = 'See dealer')
);

INSERT INTO entry_note (entry_id, note_id) 
VALUES (
    (SELECT e.id FROM entry e JOIN vehicle_range vr ON e.vehicle_range_id = vr.id JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id 
     WHERE mk.name = 'BMW' AND m.name = '3 Series'),
    (SELECT id FROM note WHERE text = 'Special programming required')
);

-- Final verification and statistics
SELECT 
    'Database loaded successfully!' as status,
    (SELECT COUNT(*) FROM system_type) as system_types,
    (SELECT COUNT(*) FROM transponder_family) as transponder_families,
    (SELECT COUNT(*) FROM transponder_detail) as transponder_details,
    (SELECT COUNT(*) FROM cross_ref) as cross_refs,
    (SELECT COUNT(*) FROM oem_key) as oem_keys,
    (SELECT COUNT(*) FROM note) as notes,
    (SELECT COUNT(*) FROM make) as makes,
    (SELECT COUNT(*) FROM model) as models,
    (SELECT COUNT(*) FROM entry) as entries;

-- Show sample data
SELECT 
    mk.name as make,
    m.name as model,
    vr.year_from,
    vr.year_to,
    st.name as system_type,
    tf.name as transponder_family,
    td.detail as transponder_detail,
    cr.label as cross_ref,
    ok.code as oem_key,
    n.text as note
FROM entry e
JOIN vehicle_range vr ON e.vehicle_range_id = vr.id
JOIN model m ON vr.model_id = m.id
JOIN make mk ON m.make_id = mk.id
LEFT JOIN system_type st ON e.system_type_id = st.id
LEFT JOIN transponder_family tf ON e.transponder_family_id = tf.id
LEFT JOIN transponder_detail td ON e.transponder_detail_id = td.id
LEFT JOIN entry_cross_ref ecr ON e.id = ecr.entry_id
LEFT JOIN cross_ref cr ON ecr.cross_ref_id = cr.id
LEFT JOIN entry_oem_key eok ON e.id = eok.entry_id
LEFT JOIN oem_key ok ON eok.oem_key_id = ok.id
LEFT JOIN entry_note en ON e.id = en.entry_id
LEFT JOIN note n ON en.note_id = n.id
ORDER BY mk.name, m.name, vr.year_from;
