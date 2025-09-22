-- Supabase Transponder Database - Part 1: Cleanup and Reference Data
-- Run this FIRST in Supabase SQL Editor

-- Supabase Transponder Database - Complete Data Population
-- No NULL values in critical fields, all data properly normalized



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


-- System Types (using simple inserts - TRUNCATE above ensures no duplicates)
INSERT INTO system_type (name) VALUES ('Non-Transponder Key');
INSERT INTO system_type (name) VALUES ('Not Specified');
INSERT INTO system_type (name) VALUES ('PassKey 3+ Anti Theft System');
INSERT INTO system_type (name) VALUES ('PassLock Anti Theft System');
INSERT INTO system_type (name) VALUES ('VATS / PassKey System');


-- Transponder Families
INSERT INTO transponder_family (id, name) VALUES (1, 'Hitag AES');
INSERT INTO transponder_family (id, name) VALUES (2, 'Hitag Ext VAG');
INSERT INTO transponder_family (id, name) VALUES (3, 'Hitag Pro');
INSERT INTO transponder_family (id, name) VALUES (4, 'Hitag2 Extended / \~ID46, ID46E');
INSERT INTO transponder_family (id, name) VALUES (5, 'Hitag2 Extended / \~ID46E');
INSERT INTO transponder_family (id, name) VALUES (6, 'Megamos 13 / ID13');
INSERT INTO transponder_family (id, name) VALUES (7, 'Megamos 13 / ID13 OR Temic 11 / ID11');
INSERT INTO transponder_family (id, name) VALUES (8, 'Megamos AES / ID88');
INSERT INTO transponder_family (id, name) VALUES (9, 'Megamos AES / ID88 OR Philips Crypto 3 / Hitag 3 / ID49');
INSERT INTO transponder_family (id, name) VALUES (10, 'Megamos Crypto 48 / ID48');
INSERT INTO transponder_family (id, name) VALUES (11, 'Megamos Crypto 48 / ID48 OR Philips Crypto 2 / Hitag2 / ID46');
INSERT INTO transponder_family (id, name) VALUES (12, 'Megamos Crypto AES (“VAG MQB”) ID49');
INSERT INTO transponder_family (id, name) VALUES (13, 'Megamos Crypto ID48 (precoded dealer key)');
INSERT INTO transponder_family (id, name) VALUES (14, 'Megamos ID13');
INSERT INTO transponder_family (id, name) VALUES (15, 'Philips 33 / ID33 OR Megamos 13 / ID13');
INSERT INTO transponder_family (id, name) VALUES (16, 'Philips Crypto / ID40');
INSERT INTO transponder_family (id, name) VALUES (17, 'Philips Crypto 2 / Hitag2 / ID46');
INSERT INTO transponder_family (id, name) VALUES (18, 'Philips Crypto 2 / Hitag2+ / ID46');
INSERT INTO transponder_family (id, name) VALUES (19, 'Philips Crypto 2 ID46 OR NXP Hitag-3 / ID49');
INSERT INTO transponder_family (id, name) VALUES (20, 'Philips Crypto 3 / Hitag3 / ID49');
INSERT INTO transponder_family (id, name) VALUES (21, 'Philips Crypto ID40');
INSERT INTO transponder_family (id, name) VALUES (22, 'Philips ID46 – Hitag2');
INSERT INTO transponder_family (id, name) VALUES (23, 'Sokymat Crypto 8E – Audi ID8E');
INSERT INTO transponder_family (id, name) VALUES (24, 'Standard Key');
INSERT INTO transponder_family (id, name) VALUES (25, 'Temic 11 / ID11');
INSERT INTO transponder_family (id, name) VALUES (26, 'Temic 11 / ID11 OR Megamos 13 / ID13');
INSERT INTO transponder_family (id, name) VALUES (27, 'Texas Crypto 4D / 4D64');
INSERT INTO transponder_family (id, name) VALUES (28, 'Texas Crypto 4D / ID4D60');


-- Transponder Details
INSERT INTO transponder_detail (id, detail) VALUES (1, 'NCF2951V, NCF2952V');
INSERT INTO transponder_detail (id, detail) VALUES (2, 'NXP PCF7937E, NCF2951E');
INSERT INTO transponder_detail (id, detail) VALUES (3, 'NXP PCF7937E, PCF7941E');
INSERT INTO transponder_detail (id, detail) VALUES (4, 'NXP PCF7952A');
INSERT INTO transponder_detail (id, detail) VALUES (5, 'NXP PCF7952E');
INSERT INTO transponder_detail (id, detail) VALUES (6, 'NXP PCF7952E, PCF7937E');
INSERT INTO transponder_detail (id, detail) VALUES (7, 'NXP PCF7952E, PCF7941E');
INSERT INTO transponder_detail (id, detail) VALUES (8, 'NXP PCF7952E, PCF7961E');
INSERT INTO transponder_detail (id, detail) VALUES (9, 'NXP PCF7961E, PCF7941E');
INSERT INTO transponder_detail (id, detail) VALUES (10, 'OR Megamos 13 / ID13');
INSERT INTO transponder_detail (id, detail) VALUES (11, 'PCF7935 precoded');
INSERT INTO transponder_detail (id, detail) VALUES (12, 'PCF7936');
INSERT INTO transponder_detail (id, detail) VALUES (13, 'PCF7937E, NCF2951E');
INSERT INTO transponder_detail (id, detail) VALUES (14, 'PCF7937E, PCF7941E');
INSERT INTO transponder_detail (id, detail) VALUES (15, 'PCF7937E, PCF7952E');
INSERT INTO transponder_detail (id, detail) VALUES (16, 'PCF7941');
INSERT INTO transponder_detail (id, detail) VALUES (17, 'PCF7945 / PCF7953');
INSERT INTO transponder_detail (id, detail) VALUES (18, 'PCF7945AC (precoded dealer key)');
INSERT INTO transponder_detail (id, detail) VALUES (19, 'PCF7946');
INSERT INTO transponder_detail (id, detail) VALUES (20, 'PCF7946 / PCF7936 / Silca T14 / JMA TP12');
INSERT INTO transponder_detail (id, detail) VALUES (21, 'PCF7961M');
INSERT INTO transponder_detail (id, detail) VALUES (22, 'Silca 13 / JMA TP05');
INSERT INTO transponder_detail (id, detail) VALUES (23, 'Silca ID88');
INSERT INTO transponder_detail (id, detail) VALUES (24, 'Standard chip');
INSERT INTO transponder_detail (id, detail) VALUES (25, 'glass chip / MCU');
