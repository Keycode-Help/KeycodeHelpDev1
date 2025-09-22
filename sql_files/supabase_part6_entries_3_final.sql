-- Supabase Transponder Database - Part 6: Entries (3/3) + Sequences
-- Run this LAST in Supabase SQL Editor

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


