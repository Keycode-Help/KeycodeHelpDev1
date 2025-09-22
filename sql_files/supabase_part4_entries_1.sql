-- Supabase Transponder Database - Part 4: Entries (1/3)
-- Run this FOURTH in Supabase SQL Editor

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
