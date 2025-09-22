-- Supabase Final Fix - Handles existing makes with NULL prices
-- This version updates existing makes first, then adds new ones safely

-- Clear all transponder data first
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

-- Fix existing makes that have NULL prices
UPDATE make SET non_member_price = 99.99, member_price = 79.99 
WHERE non_member_price IS NULL OR member_price IS NULL;

-- System Types
INSERT INTO system_type (name) VALUES ('Non-Transponder Key');
INSERT INTO system_type (name) VALUES ('Not Specified');
INSERT INTO system_type (name) VALUES ('PassKey 3+ Anti Theft System');
INSERT INTO system_type (name) VALUES ('PassLock Anti Theft System');
INSERT INTO system_type (name) VALUES ('VATS / PassKey System');

-- Transponder Families  
INSERT INTO transponder_family (name) VALUES ('Hitag2 Extended / ID46, ID46E');
INSERT INTO transponder_family (name) VALUES ('Megamos 13 / ID13');
INSERT INTO transponder_family (name) VALUES ('Megamos Crypto 48 / ID48');
INSERT INTO transponder_family (name) VALUES ('Philips Crypto 2 / Hitag2 / ID46');
INSERT INTO transponder_family (name) VALUES ('Texas Crypto 4D / ID4D60');
INSERT INTO transponder_family (name) VALUES ('Standard Key');
INSERT INTO transponder_family (name) VALUES ('Philips Crypto ID40');
INSERT INTO transponder_family (name) VALUES ('Megamos Crypto ID48 (precoded dealer key)');

-- Transponder Details
INSERT INTO transponder_detail (detail) VALUES ('NXP PCF7952E, PCF7961E');
INSERT INTO transponder_detail (detail) VALUES ('PCF7936AS');
INSERT INTO transponder_detail (detail) VALUES ('Standard chip');
INSERT INTO transponder_detail (detail) VALUES ('PCF7935 precoded');
INSERT INTO transponder_detail (detail) VALUES ('JMA TP08, Silca T6');
INSERT INTO transponder_detail (detail) VALUES ('JMA TP19, XT27A66, K-JMD');

-- Cross References
INSERT INTO cross_ref (label) VALUES ('PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD');
INSERT INTO cross_ref (label) VALUES ('JMA TP08, Silca T6');
INSERT INTO cross_ref (label) VALUES ('JMA TP19, XT27A66, K-JMD');
INSERT INTO cross_ref (label) VALUES ('Consult manual');

-- OEM Keys
INSERT INTO oem_key (code) VALUES ('13529661, 13529660, 13584504, 13508771');
INSERT INTO oem_key (code) VALUES ('HYQ4EA 13508780, 13594573, 13529653');
INSERT INTO oem_key (code) VALUES ('96458347');
INSERT INTO oem_key (code) VALUES ('See dealer');

-- Notes
INSERT INTO note (text) VALUES ('No additional notes');
INSERT INTO note (text) VALUES ('Verify compatibility before programming');
INSERT INTO note (text) VALUES ('Standard configuration');

-- Makes - Insert only if they don't exist, with proper prices
INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Chevrolet', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Chevrolet');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Audi', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Audi');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'BMW', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'BMW');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Ford', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Ford');

INSERT INTO make (name, non_member_price, member_price) 
SELECT 'Honda', 99.99, 79.99 
WHERE NOT EXISTS (SELECT 1 FROM make WHERE name = 'Honda');

-- Models
INSERT INTO model (make_id, name) 
SELECT mk.id, 'Cruze' 
FROM make mk 
WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Cruze');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Malibu' 
FROM make mk 
WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Malibu');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Silverado' 
FROM make mk 
WHERE mk.name = 'Chevrolet' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Silverado');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'A3' 
FROM make mk 
WHERE mk.name = 'Audi' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'A3');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'A4' 
FROM make mk 
WHERE mk.name = 'Audi' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'A4');

INSERT INTO model (make_id, name) 
SELECT mk.id, '3 Series' 
FROM make mk 
WHERE mk.name = 'BMW' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = '3 Series');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'F-150' 
FROM make mk 
WHERE mk.name = 'Ford' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'F-150');

INSERT INTO model (make_id, name) 
SELECT mk.id, 'Civic' 
FROM make mk 
WHERE mk.name = 'Honda' 
AND NOT EXISTS (SELECT 1 FROM model m WHERE m.make_id = mk.id AND m.name = 'Civic');

-- Sample Vehicle Ranges and Entries
-- Chevrolet Cruze 2016-2019
INSERT INTO vehicle_range (model_id, year_from, year_to) 
VALUES ((SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Cruze'), 2016, 2019);

INSERT INTO entry (vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (
    (SELECT vr.id FROM vehicle_range vr JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Cruze' AND vr.year_from = 2016),
    (SELECT id FROM system_type WHERE name = 'Not Specified'),
    (SELECT id FROM transponder_family WHERE name = 'Hitag2 Extended / ID46, ID46E'),
    (SELECT id FROM transponder_detail WHERE detail = 'NXP PCF7952E, PCF7961E')
);

-- Add relationships for the Chevrolet Cruze entry
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) 
VALUES (
    (SELECT e.id FROM entry e JOIN vehicle_range vr ON e.vehicle_range_id = vr.id JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Cruze'),
    (SELECT id FROM cross_ref WHERE label = 'PCF7936AS, JMA TP12GM, SILCA T14, CN3, XT27, K-JMD')
);

INSERT INTO entry_oem_key (entry_id, oem_key_id) 
VALUES (
    (SELECT e.id FROM entry e JOIN vehicle_range vr ON e.vehicle_range_id = vr.id JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Cruze'),
    (SELECT id FROM oem_key WHERE code = '13529661, 13529660, 13584504, 13508771')
);

INSERT INTO entry_note (entry_id, note_id) 
VALUES (
    (SELECT e.id FROM entry e JOIN vehicle_range vr ON e.vehicle_range_id = vr.id JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Chevrolet' AND m.name = 'Cruze'),
    (SELECT id FROM note WHERE text = 'Standard configuration')
);

-- Audi A3 2013-2018
INSERT INTO vehicle_range (model_id, year_from, year_to) 
VALUES ((SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A3'), 2013, 2018);

INSERT INTO entry (vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (
    (SELECT vr.id FROM vehicle_range vr JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A3' AND vr.year_from = 2013),
    (SELECT id FROM system_type WHERE name = 'Not Specified'),
    (SELECT id FROM transponder_family WHERE name = 'Megamos Crypto 48 / ID48'),
    (SELECT id FROM transponder_detail WHERE detail = 'JMA TP08, Silca T6')
);

-- Add relationships for Audi A3
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) 
VALUES (
    (SELECT e.id FROM entry e JOIN vehicle_range vr ON e.vehicle_range_id = vr.id JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A3'),
    (SELECT id FROM cross_ref WHERE label = 'JMA TP08, Silca T6')
);

INSERT INTO entry_oem_key (entry_id, oem_key_id) 
VALUES (
    (SELECT e.id FROM entry e JOIN vehicle_range vr ON e.vehicle_range_id = vr.id JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A3'),
    (SELECT id FROM oem_key WHERE code = 'See dealer')
);

INSERT INTO entry_note (entry_id, note_id) 
VALUES (
    (SELECT e.id FROM entry e JOIN vehicle_range vr ON e.vehicle_range_id = vr.id JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Audi' AND m.name = 'A3'),
    (SELECT id FROM note WHERE text = 'Verify compatibility before programming')
);

-- Ford F-150 2015-2020
INSERT INTO vehicle_range (model_id, year_from, year_to) 
VALUES ((SELECT m.id FROM model m JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Ford' AND m.name = 'F-150'), 2015, 2020);

INSERT INTO entry (vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id) 
VALUES (
    (SELECT vr.id FROM vehicle_range vr JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Ford' AND m.name = 'F-150' AND vr.year_from = 2015),
    (SELECT id FROM system_type WHERE name = 'Not Specified'),
    (SELECT id FROM transponder_family WHERE name = 'Standard Key'),
    (SELECT id FROM transponder_detail WHERE detail = 'Standard chip')
);

-- Add relationships for Ford F-150
INSERT INTO entry_cross_ref (entry_id, cross_ref_id) 
VALUES (
    (SELECT e.id FROM entry e JOIN vehicle_range vr ON e.vehicle_range_id = vr.id JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Ford' AND m.name = 'F-150'),
    (SELECT id FROM cross_ref WHERE label = 'Consult manual')
);

INSERT INTO entry_oem_key (entry_id, oem_key_id) 
VALUES (
    (SELECT e.id FROM entry e JOIN vehicle_range vr ON e.vehicle_range_id = vr.id JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Ford' AND m.name = 'F-150'),
    (SELECT id FROM oem_key WHERE code = 'See dealer')
);

INSERT INTO entry_note (entry_id, note_id) 
VALUES (
    (SELECT e.id FROM entry e JOIN vehicle_range vr ON e.vehicle_range_id = vr.id JOIN model m ON vr.model_id = m.id JOIN make mk ON m.make_id = mk.id WHERE mk.name = 'Ford' AND m.name = 'F-150'),
    (SELECT id FROM note WHERE text = 'No additional notes')
);

-- Final verification query
SELECT 
    'SUCCESS: Database populated with sample data' as status,
    COUNT(*) as total_entries
FROM entry;

-- Show the actual data
SELECT 
    mk.name as make,
    m.name as model,
    vr.year_from,
    vr.year_to,
    st.name as system_type,
    tf.name as transponder_family,
    td.detail as transponder_detail
FROM entry e
JOIN vehicle_range vr ON e.vehicle_range_id = vr.id
JOIN model m ON vr.model_id = m.id
JOIN make mk ON m.make_id = mk.id
LEFT JOIN system_type st ON e.system_type_id = st.id
LEFT JOIN transponder_family tf ON e.transponder_family_id = tf.id
LEFT JOIN transponder_detail td ON e.transponder_detail_id = td.id
ORDER BY mk.name, m.name, vr.year_from;
