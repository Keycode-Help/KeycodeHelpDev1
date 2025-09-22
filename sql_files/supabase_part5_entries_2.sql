-- Supabase Transponder Database - Part 5: Entries (2/3)
-- Run this FIFTH in Supabase SQL Editor

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
