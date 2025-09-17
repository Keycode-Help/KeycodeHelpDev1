// Helper function to generate year ranges (1995-2025 only)
const generateYearRange = (startYear, endYear = 2025) => {
  const years = [];
  const minYear = Math.max(startYear, 1995); // Enforce 1995 minimum
  const maxYear = Math.min(endYear, 2025); // Enforce 2025 maximum
  for (let year = minYear; year <= maxYear; year++) {
    years.push(year);
  }
  return years;
};

// Comprehensive Vehicle Database with Actual Keycode Pricing
export const vehicleDatabase = {
  // Acura/Honda - $60 Non-Member, $45 Member
  Acura: {
    basePrice: 60.0,
    memberPrice: 45.0,
    category: "Acura/Honda",
    models: {
      MDX: { years: generateYearRange(2001) },
      RDX: { years: generateYearRange(2007) },
      TLX: { years: generateYearRange(2015) },
      ILX: { years: generateYearRange(2013) },
      NSX: { years: generateYearRange(1995, 2005).concat(generateYearRange(2016, 2022)) },
      TSX: { years: generateYearRange(2004, 2014) },
      ZDX: { years: generateYearRange(2010, 2013) },
      CDX: { years: generateYearRange(2017, 2021) },
      Integra: { years: generateYearRange(1995, 2001).concat(generateYearRange(2023)) },
      RSX: { years: generateYearRange(2002, 2006) },
      RL: { years: generateYearRange(1996, 2012) },
      TL: { years: generateYearRange(1995, 2014) },
      CL: { years: generateYearRange(1997, 2003) },
      "3.2TL": { years: generateYearRange(1999, 2003) },
      "3.5RL": { years: generateYearRange(1996, 2004) },
    },
  },
  Honda: {
    basePrice: 60.0,
    memberPrice: 45.0,
    category: "Acura/Honda",
    models: {
      Civic: { years: generateYearRange(1996) },
      Accord: { years: generateYearRange(1998) },
      "CR-V": { years: generateYearRange(1997) },
      Pilot: { years: generateYearRange(2003) },
      Ridgeline: {
        years: generateYearRange(2006, 2014).concat(generateYearRange(2017)),
      },
      Passport: { years: generateYearRange(1995, 2002).concat(generateYearRange(2019)) },
      "HR-V": { years: generateYearRange(2016) },
      Odyssey: { years: generateYearRange(1999) },
      Fit: { years: generateYearRange(2007, 2020) },
      Insight: { years: generateYearRange(2000, 2006).concat(generateYearRange(2010, 2014)).concat(generateYearRange(2019, 2022)) },
      "CR-Z": { years: generateYearRange(2011, 2016) },
      Element: { years: generateYearRange(2003, 2011) },
      S2000: { years: generateYearRange(2000, 2009) },
      Crosstour: { years: generateYearRange(2010, 2015) },
      Prelude: { years: generateYearRange(1997, 2001) },
      "del Sol": { years: generateYearRange(1995, 1997) },
      "Civic del Sol": { years: generateYearRange(1995, 1997) },
    },
  },

  // Chrysler (Key+PIN) - $85 Non-Member, $69 Member
  Chrysler: {
    basePrice: 85.0,
    memberPrice: 69.0,
    category: "Chrysler (Key+PIN)",
    requiresPin: true,
    models: {
      300: { years: generateYearRange(2005, 2023) },
      Pacifica: {
        years: generateYearRange(2004, 2008).concat(generateYearRange(2017)),
      },
      200: { years: generateYearRange(2011, 2017) },
      Sebring: { years: generateYearRange(1995, 2010) },
      "Town & Country": { years: generateYearRange(1995, 2016) },
      Aspen: { years: generateYearRange(2007, 2009) },
      Crossfire: { years: generateYearRange(2004, 2008) },
      Concorde: { years: generateYearRange(1995, 2004) },
      "300M": { years: generateYearRange(1999, 2004) },
      LHS: { years: generateYearRange(1995, 2001) },
      Cirrus: { years: generateYearRange(1995, 2000) },
      "PT Cruiser": { years: generateYearRange(2001, 2010) },
      Voyager: { years: generateYearRange(1996, 2000) },
    },
  },

  // Dodge/Jeep - $85 Non-Member, $69 Member
  Dodge: {
    basePrice: 85.0,
    memberPrice: 69.0,
    category: "Dodge/Jeep",
    requiresPin: true,
    models: {
      "Ram 1500": { years: generateYearRange(2009) },
      "Ram 2500": { years: generateYearRange(2010) },
      "Ram 3500": { years: generateYearRange(2010) },
      Challenger: { years: generateYearRange(2008) },
      Charger: { years: generateYearRange(2006) },
      Durango: {
        years: generateYearRange(1998, 2009).concat(generateYearRange(2011)),
      },
      Journey: { years: generateYearRange(2009, 2020) },
      "Grand Caravan": { years: generateYearRange(1996, 2020) },
      Avenger: {
        years: generateYearRange(1995, 2000).concat(
          generateYearRange(2008, 2014)
        ),
      },
      Caliber: { years: generateYearRange(2007, 2012) },
      Magnum: { years: generateYearRange(2005, 2008) },
      Nitro: { years: generateYearRange(2007, 2011) },
      Viper: {
        years: generateYearRange(1992, 2002)
          .concat(generateYearRange(2003, 2010))
          .concat(generateYearRange(2013, 2017)),
      },
      Dart: { years: generateYearRange(2013, 2016) },
      Neon: { years: generateYearRange(1995, 2005) },
      Stratus: { years: generateYearRange(1995, 2006) },
      Intrepid: { years: generateYearRange(1993, 2004) },
      Spirit: { years: generateYearRange(1989, 1995) },
      Shadow: { years: generateYearRange(1987, 1994) },
      Stealth: { years: generateYearRange(1991, 1996) },
      "Ram Van": { years: generateYearRange(1994, 2003) },
      "Ram Wagon": { years: generateYearRange(1994, 2003) },
      Dakota: { years: generateYearRange(1997, 2011) },
      "Ram 50": { years: generateYearRange(1987, 1993) },
      Ramcharger: { years: generateYearRange(1974, 1993) },
    },
  },
  Jeep: {
    basePrice: 85.0,
    memberPrice: 69.0,
    category: "Dodge/Jeep",
    requiresPin: true,
    models: {
      Wrangler: { years: generateYearRange(1995) },
      "Grand Cherokee": { years: generateYearRange(1995) },
      Cherokee: { years: generateYearRange(1995, 2001).concat(generateYearRange(2014)) },
      Compass: { years: generateYearRange(2007) },
      Renegade: { years: generateYearRange(2015) },
      Gladiator: { years: generateYearRange(2020) },
      Liberty: { years: generateYearRange(2002, 2012) },
      Patriot: { years: generateYearRange(2007, 2017) },
      Commander: { years: generateYearRange(2006, 2010) },
      Wagoneer: { years: generateYearRange(2022) },
      "Grand Wagoneer": { years: generateYearRange(2022) },
    },
  },

  // Ford/Lincoln/Mercury - $70 Non-Member, $55 Member
  Ford: {
    basePrice: 70.0,
    memberPrice: 55.0,
    category: "Ford/Lincoln/Mercury",
    models: {
      "F-150": { years: generateYearRange(1995) },
      "F-250": { years: generateYearRange(1999) },
      "F-350": { years: generateYearRange(1999) },
      "F-450": { years: generateYearRange(2008) },
      "F-550": { years: generateYearRange(2008) },
      Mustang: { years: generateYearRange(1995) },
      Explorer: { years: generateYearRange(1995) },
      Escape: { years: generateYearRange(2001) },
      Edge: { years: generateYearRange(2007) },
      Expedition: { years: generateYearRange(1997) },
      Ranger: { years: generateYearRange(1995, 2011).concat(generateYearRange(2019)) },
      Bronco: { years: generateYearRange(1995, 1996).concat(generateYearRange(2021)) },
      "Bronco Sport": { years: generateYearRange(2021) },
      Maverick: { years: generateYearRange(2022) },
      Focus: { years: generateYearRange(2000, 2018) },
      Fiesta: { years: generateYearRange(2011, 2019) },
      Fusion: { years: generateYearRange(2006, 2020) },
      Taurus: { years: generateYearRange(1995, 2007).concat(generateYearRange(2008, 2019)) },
      EcoSport: { years: generateYearRange(2018, 2022) },
      Transit: { years: generateYearRange(2015) },
      "Transit Connect": { years: generateYearRange(2010) },
      Flex: { years: generateYearRange(2009, 2019) },
      "C-Max": { years: generateYearRange(2013, 2018) },
      "Five Hundred": { years: generateYearRange(2005, 2007) },
      Freestyle: { years: generateYearRange(2005, 2007) },
      "Crown Victoria": { years: generateYearRange(1995, 2011) },
      "Grand Marquis": { years: generateYearRange(1995, 2011) },
      Windstar: { years: generateYearRange(1995, 2003) },
      Freestar: { years: generateYearRange(2004, 2007) },
      Excursion: { years: generateYearRange(2000, 2005) },
      Aerostar: { years: generateYearRange(1995, 1997) },
      Contour: { years: generateYearRange(1995, 2000) },
      Mystique: { years: generateYearRange(1995, 2000) },
      Probe: { years: generateYearRange(1995, 1997) },
      Thunderbird: { years: generateYearRange(1995, 2005) },
      GT: { years: generateYearRange(2005, 2006) },
    },
  },
  Lincoln: {
    basePrice: 70.0,
    memberPrice: 55.0,
    category: "Ford/Lincoln/Mercury",
    models: {
      Navigator: { years: generateYearRange(1998) },
      Aviator: {
        years: generateYearRange(2003, 2005).concat(generateYearRange(2020)),
      },
      Corsair: { years: generateYearRange(2020) },
      Nautilus: { years: generateYearRange(2019) },
      MKZ: { years: generateYearRange(2007, 2020) },
      MKX: { years: generateYearRange(2007, 2018) },
      MKS: { years: generateYearRange(2009, 2016) },
      MKT: { years: generateYearRange(2010, 2019) },
      MKC: { years: generateYearRange(2015, 2019) },
      Continental: { years: generateYearRange(1995, 2002).concat(generateYearRange(2017, 2020)) },
      "Town Car": { years: generateYearRange(1995, 2011) },
      LS: { years: generateYearRange(2000, 2006) },
      Zephyr: { years: generateYearRange(2006) },
      Blackwood: { years: generateYearRange(2002, 2003) },
      "Mark VIII": { years: generateYearRange(1995, 1998) },
      "Mark LT": { years: generateYearRange(2006, 2008) },
    },
  },

  // Hyundai - $60 Non-Member, $38 Member
  Hyundai: {
    basePrice: 60.0,
    memberPrice: 38.0,
    category: "Hyundai",
    models: {
      Elantra: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Sonata: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Tucson: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "Santa Fe": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Palisade: { years: [2020, 2021, 2022, 2023, 2024] },
      Venue: { years: [2020, 2021, 2022, 2023, 2024] },
      Kona: { years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      Accent: {
        years: [
          2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022,
          2023, 2024,
        ],
      },
      Genesis: { years: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016] },
      Azera: {
        years: [
          2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016,
          2017,
        ],
      },
      Veloster: {
        years: [
          2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022,
        ],
      },
      "Santa Fe Sport": { years: [2013, 2014, 2015, 2016, 2017, 2018] },
      Nexo: { years: [2019, 2020, 2021, 2022, 2023, 2024] },
      "Ioniq 5": { years: [2022, 2023, 2024] },
      "Ioniq 6": { years: [2023, 2024] },
      Entourage: { years: [2007, 2008, 2009] },
      Veracruz: { years: [2007, 2008, 2009, 2010, 2011, 2012] },
    },
  },

  // Infiniti (Key + PIN) - $70 Non-Member, $36 + $20 Member
  Infiniti: {
    basePrice: 70.0,
    memberPrice: 56.0, // $36 + $20
    category: "Infiniti (Key + PIN)",
    requiresPin: true,
    models: {
      Q50: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Q60: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Q70: { years: [2014, 2015, 2016, 2017, 2018, 2019] },
      QX50: {
        years: [
          2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
        ],
      },
      QX60: {
        years: [
          2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
          2024,
        ],
      },
      QX80: {
        years: [
          2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
        ],
      },
      Q30: { years: [2017, 2018, 2019] },
      QX30: { years: [2017, 2018, 2019] },
      QX4: { years: [1997, 1998, 1999, 2000, 2001, 2002, 2003] },
      FX35: { years: [2003, 2004, 2005, 2006, 2007, 2008] },
      FX45: { years: [2003, 2004, 2005, 2006, 2007, 2008] },
      G35: { years: [2003, 2004, 2005, 2006, 2007, 2008] },
      G37: { years: [2008, 2009, 2010, 2011, 2012, 2013] },
      M35: { years: [2006, 2007, 2008, 2009, 2010] },
      M45: { years: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010] },
      EX35: { years: [2008, 2009, 2010, 2011, 2012, 2013] },
      JX35: { years: [2013] },
    },
  },

  // Kia - $60 Non-Member, $32 Member
  Kia: {
    basePrice: 60.0,
    memberPrice: 32.0,
    category: "Kia",
    models: {
      Forte: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      K5: { years: [2021, 2022, 2023, 2024] },
      Sportage: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Sorento: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Telluride: { years: [2020, 2021, 2022, 2023, 2024] },
      Soul: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Rio: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Stinger: { years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      Optima: {
        years: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
      },
      Cadenza: { years: [2014, 2015, 2016, 2017, 2018, 2019, 2020] },
      Niro: { years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      Seltos: { years: [2021, 2022, 2023, 2024] },
      Carnival: { years: [2022, 2023, 2024] },
      EV6: { years: [2022, 2023, 2024] },
      EV9: { years: [2024] },
      Rondo: { years: [2007, 2008, 2009, 2010, 2011, 2012] },
      Sedona: {
        years: [
          2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016,
          2017, 2018, 2019, 2020, 2021,
        ],
      },
      Borrego: { years: [2009, 2010, 2011] },
      Amanti: { years: [2004, 2005, 2006, 2007, 2008, 2009] },
      Spectra: {
        years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009],
      },
    },
  },

  // Nissan (Key + PIN) - $70 Non-Member, $36 + $20 Member
  Nissan: {
    basePrice: 70.0,
    memberPrice: 56.0, // $36 + $20
    category: "Nissan (Key + PIN)",
    requiresPin: true,
    models: {
      Altima: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Maxima: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Rogue: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Murano: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Pathfinder: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Armada: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Frontier: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Titan: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Sentra: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Versa: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "Rogue Sport": { years: [2017, 2018, 2019, 2020, 2021, 2022] },
      Kicks: { years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      Ariya: { years: [2023, 2024] },
      Z: { years: [2023, 2024] },
      "GT-R": {
        years: [
          2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019,
          2020, 2021, 2022,
        ],
      },
      "Titan XD": { years: [2016, 2017, 2018, 2019] },
      NV200: { years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020] },
      "370Z": {
        years: [
          2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019,
          2020,
        ],
      },
      "350Z": { years: [2003, 2004, 2005, 2006, 2007, 2008, 2009] },
      Juke: { years: [2011, 2012, 2013, 2014, 2015, 2016, 2017] },
      Cube: { years: [2009, 2010, 2011, 2012, 2013, 2014] },
      Quest: { years: [2011, 2012, 2013, 2014, 2015, 2016, 2017] },
      Xterra: {
        years: [
          2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015,
        ],
      },
      Pathfinder: {
        years: [
          2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
          2024,
        ],
      },
      Leaf: {
        years: [
          2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021,
          2022, 2023, 2024,
        ],
      },
      NV1500: { years: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020] },
      NV2500: { years: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020] },
      NV3500: { years: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020] },
    },
  },

  // Toyota/Lexus - $75 Non-Member, $60 Member
  Toyota: {
    basePrice: 75.0,
    memberPrice: 60.0,
    category: "Toyota/Lexus",
    models: {
      Camry: { years: generateYearRange(1983) },
      Corolla: { years: generateYearRange(1993) },
      RAV4: { years: generateYearRange(1996) },
      Highlander: { years: generateYearRange(2001) },
      Tacoma: { years: generateYearRange(1995) },
      Tundra: { years: generateYearRange(2000) },
      "4Runner": { years: generateYearRange(1984) },
      Sequoia: { years: generateYearRange(2001) },
      Prius: { years: generateYearRange(2001) },
      Avalon: { years: generateYearRange(1995) },
      Sienna: { years: generateYearRange(1998) },
      "C-HR": { years: generateYearRange(2018) },
      Venza: {
        years: generateYearRange(2009, 2015).concat(generateYearRange(2021)),
      },
      "Crown Signia": { years: generateYearRange(2024) },
      "Prius Prime": { years: generateYearRange(2017) },
      bZ4X: { years: generateYearRange(2023) },
      "Prius C": { years: generateYearRange(2012, 2019) },
      "Prius V": { years: generateYearRange(2012, 2017) },
      Yaris: { years: generateYearRange(2007, 2020) },
      "Yaris iA": { years: generateYearRange(2017, 2018) },
      Matrix: { years: generateYearRange(2003, 2014) },
      Celica: { years: generateYearRange(1986, 2006) },
      "MR2 Spyder": { years: generateYearRange(2000, 2005) },
      MR2: { years: generateYearRange(1985, 1995) },
      Solara: { years: generateYearRange(1999, 2008) },
      Echo: { years: generateYearRange(2000, 2005) },
      xB: { years: generateYearRange(2004, 2015) },
      xA: { years: generateYearRange(2004, 2006) },
      xD: { years: generateYearRange(2008, 2014) },
      tC: { years: generateYearRange(2005, 2016) },
      iQ: { years: generateYearRange(2012, 2015) },
      "FJ Cruiser": { years: generateYearRange(2007, 2014) },
      "Land Cruiser": { years: generateYearRange(1958, 2021) },
      Pickup: { years: generateYearRange(1972, 1995) },
      T100: { years: generateYearRange(1993, 1998) },
      Previa: { years: generateYearRange(1991, 1997) },
      "Van Wagon": { years: generateYearRange(1984, 1989) },
      Tercel: { years: generateYearRange(1980, 1999) },
      Paseo: { years: generateYearRange(1992, 1999) },
      Supra: {
        years: generateYearRange(1979, 2002).concat(generateYearRange(2020)),
      },
      Cressida: { years: generateYearRange(1988, 1996) },
    },
  },
  Lexus: {
    basePrice: 75.0,
    memberPrice: 60.0,
    category: "Toyota/Lexus",
    models: {
      ES: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      IS: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      LS: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      RX: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      NX: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      GX: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      LX: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      GS: { years: [2015, 2016, 2017, 2018, 2019, 2020] },
      RC: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      LC: { years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      UX: { years: [2019, 2020, 2021, 2022, 2023, 2024] },
      CT: { years: [2015, 2016, 2017] },
      LFA: { years: [2015] },
    },
  },

  // Chevy/GM - $70 Non-Member, $50 Member
  Chevrolet: {
    basePrice: 70.0,
    memberPrice: 50.0,
    category: "Chevy/GM",
    models: {
      "Silverado 1500": { years: generateYearRange(1999) },
      "Silverado 2500": { years: generateYearRange(2001) },
      "Silverado 3500": { years: generateYearRange(2001) },
      Camaro: {
        years: generateYearRange(1967, 2002).concat(generateYearRange(2010)),
      },
      Corvette: { years: generateYearRange(1995) },
      Equinox: { years: generateYearRange(2005) },
      Traverse: { years: generateYearRange(2009) },
      Tahoe: { years: generateYearRange(1995) },
      Suburban: { years: generateYearRange(1995) },
      Colorado: {
        years: generateYearRange(2004, 2012).concat(generateYearRange(2015)),
      },
      Malibu: { years: generateYearRange(1997, 2003).concat(generateYearRange(2004)) },
      Impala: { years: generateYearRange(2000, 2020) },
      Cruze: { years: generateYearRange(2011, 2019) },
      Trax: { years: generateYearRange(2015, 2022) },
      "Bolt EV": { years: generateYearRange(2017, 2023) },
      "Bolt EUV": { years: generateYearRange(2022, 2023) },
      Spark: { years: generateYearRange(2013, 2022) },
      Sonic: { years: generateYearRange(2012, 2020) },
      Volt: { years: generateYearRange(2011, 2019) },
      HHR: { years: generateYearRange(2006, 2011) },
      Cobalt: { years: generateYearRange(2005, 2010) },
      Aveo: { years: generateYearRange(2004, 2011) },
      "Monte Carlo": {
        years: generateYearRange(1970, 1988).concat(
          generateYearRange(1995, 2007)
        ),
      },
      "Captiva Sport": { years: generateYearRange(2012, 2015) },
      "City Express": { years: generateYearRange(2015, 2018) },
      "Express 1500": { years: generateYearRange(2003) },
      "Express 2500": { years: generateYearRange(2003) },
      "Express 3500": { years: generateYearRange(2003) },
      S10: { years: generateYearRange(1982, 2004) },
      Astro: { years: generateYearRange(1985, 2005) },
      "C/K 1500": { years: generateYearRange(1988, 1998) },
      "C/K 2500": { years: generateYearRange(1988, 1998) },
      "C/K 3500": { years: generateYearRange(1988, 1998) },
      "El Camino": { years: generateYearRange(1959, 1987) },
      SSR: { years: generateYearRange(2003, 2006) },
      Lumina: { years: generateYearRange(1990, 2001) },
      Cavalier: { years: generateYearRange(1982, 2005) },
      Beretta: { years: generateYearRange(1987, 1996) },
      Corsica: { years: generateYearRange(1987, 1996) },
      Celebrity: { years: generateYearRange(1982, 1990) },
    },
  },
  GMC: {
    basePrice: 70.0,
    memberPrice: 50.0,
    category: "Chevy/GM",
    models: {
      "Sierra 1500": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "Sierra 2500": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "Sierra 3500": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Acadia: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Terrain: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Yukon: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Canyon: {
        years: [
          2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2015, 2016,
          2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
        ],
      },
      Envoy: { years: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009] },
      "Yukon XL": {
        years: [
          2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017,
          2018, 2019, 2020, 2021, 2022, 2023, 2024,
        ],
      },
      "Sierra 1500 HD": { years: [2015, 2016, 2017, 2018, 2019] },
      Savana: {
        years: [
          2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013,
          2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
        ],
      },
      "Hummer EV": { years: [2022, 2023, 2024] },
    },
  },
  Buick: {
    basePrice: 70.0,
    memberPrice: 50.0,
    category: "Chevy/GM",
    models: {
      Enclave: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Encore: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Envision: {
        years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Regal: {
        years: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
      },
      LaCrosse: {
        years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
      },
      Verano: { years: [2012, 2013, 2014, 2015, 2016, 2017] },
      "Encore GX": { years: [2020, 2021, 2022, 2023, 2024] },
      Cascada: { years: [2016, 2017, 2018, 2019] },
      Lucerne: { years: [2006, 2007, 2008, 2009, 2010, 2011] },
      "Park Avenue": {
        years: [1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005],
      },
      Lesabre: { years: [2000, 2001, 2002, 2003, 2004, 2005] },
      Century: {
        years: [1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005],
      },
      Rendezvous: { years: [2002, 2003, 2004, 2005, 2006, 2007] },
      Terraza: { years: [2005, 2006, 2007] },
    },
  },
  Cadillac: {
    basePrice: 70.0,
    memberPrice: 50.0,
    category: "Chevy/GM",
    models: {
      Escalade: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      XT5: { years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      XT6: { years: [2020, 2021, 2022, 2023, 2024] },
      CT5: { years: [2020, 2021, 2022, 2023, 2024] },
      CT4: { years: [2020, 2021, 2022, 2023, 2024] },
      CTS: {
        years: [
          2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018,
          2019,
        ],
      },
      ATS: { years: [2013, 2014, 2015, 2016, 2017, 2018, 2019] },
      XTS: { years: [2013, 2014, 2015, 2016, 2017, 2018, 2019] },
      SRX: { years: [2010, 2011, 2012, 2013, 2014, 2015, 2016] },
      DTS: { years: [2006, 2007, 2008, 2009, 2010, 2011] },
      STS: { years: [2005, 2006, 2007, 2008, 2009, 2010, 2011] },
      DeVille: { years: [2000, 2001, 2002, 2003, 2004, 2005] },
      Seville: { years: [1998, 1999, 2000, 2001, 2002, 2003, 2004] },
      ELR: { years: [2014, 2015, 2016] },
      Lyriq: { years: [2023, 2024] },
      Celestiq: { years: [2024] },
    },
  },

  // Mazda - $75 Non-Member, $60 Member
  Mazda: {
    basePrice: 75.0,
    memberPrice: 60.0,
    category: "Mazda",
    models: {
      "CX-3": { years: [2016, 2017, 2018, 2019, 2020, 2021] },
      "CX-5": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "CX-9": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "CX-30": { years: [2020, 2021, 2022, 2023, 2024] },
      "CX-50": { years: [2022, 2023, 2024] },
      "CX-90": { years: [2024] },
      "CX-70": { years: [2024] },
      2: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      3: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      6: { years: [2015, 2016, 2017, 2018, 2019, 2020, 2021] },
      "MX-5 Miata": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "MX-30": { years: [2022, 2023, 2024] },
    },
  },

  // Mitsubishi - $70* Non-Member, Ask Member (pricing varies)
  Mitsubishi: {
    basePrice: 70.0,
    memberPrice: 0, // Ask - pricing varies
    category: "Mitsubishi",
    pricingNote:
      "Prices may vary depending on vehicle year or data source availability",
    models: {
      Outlander: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "Outlander PHEV": { years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      "Eclipse Cross": { years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      Mirage: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "Mirage G4": {
        years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Lancer: { years: [2015, 2016, 2017] },
      "Outlander Sport": { years: [2015, 2016, 2017, 2018, 2019, 2020, 2021] },
      Montero: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
    },
  },

  // Subaru - $75 Non-Member, $60 Member
  Subaru: {
    basePrice: 75.0,
    memberPrice: 60.0,
    category: "Subaru",
    models: {
      Outback: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Forester: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Crosstrek: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Impreza: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Legacy: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Ascent: { years: [2019, 2020, 2021, 2022, 2023, 2024] },
      BRZ: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      WRX: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "WRX STI": { years: [2015, 2016, 2017, 2018, 2019, 2020, 2021] },
      Tribeca: { years: [2015] },
      Baja: { years: [2015] },
      Solterra: { years: [2023, 2024] },
    },
  },

  // BMW - $90 Non-Member, $70 Member (Limited Availability)
  BMW: {
    basePrice: 90.0,
    memberPrice: 70.0,
    category: "BMW",
    availabilityNote:
      "Limited keycode availability - contact support for specific models",
    limitedAvailability: true,
    models: {
      "2 Series": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "3 Series": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "4 Series": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "5 Series": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "6 Series": {
        years: [2015, 2016, 2017, 2018, 2019, 2020],
      },
      "7 Series": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "8 Series": { years: [2019, 2020, 2021, 2022, 2023, 2024] },
      X1: {
        years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      X2: { years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      X3: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      X4: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      X5: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      X6: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      X7: { years: [2019, 2020, 2021, 2022, 2023, 2024] },
      Z4: { years: [2019, 2020, 2021, 2022, 2023, 2024] },
      i3: { years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022] },
      i4: { years: [2022, 2023, 2024] },
      iX: { years: [2022, 2023, 2024] },
      M2: { years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      M3: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      M4: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      M5: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      M8: { years: [2020, 2021, 2022, 2023, 2024] },
    },
  },

  // Mercedes-Benz - $95 Non-Member, $75 Member (Limited Availability)
  "Mercedes-Benz": {
    basePrice: 95.0,
    memberPrice: 75.0,
    category: "Mercedes-Benz",
    availabilityNote:
      "Limited keycode availability - contact support for specific models",
    limitedAvailability: true,
    models: {
      "C-Class": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "E-Class": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "S-Class": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "A-Class": { years: [2019, 2020, 2021, 2022, 2023, 2024] },
      "CLA-Class": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "CLS-Class": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "GLA-Class": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "GLB-Class": { years: [2020, 2021, 2022, 2023, 2024] },
      "GLC-Class": {
        years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "GLE-Class": {
        years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "GLS-Class": {
        years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "G-Class": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "SL-Class": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "AMG GT": {
        years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      EQS: { years: [2022, 2023, 2024] },
      EQE: { years: [2023, 2024] },
      EQB: { years: [2022, 2023, 2024] },
      EQA: { years: [2022, 2023, 2024] },
    },
  },

  // Audi - $90 Non-Member, $70 Member
  Audi: {
    basePrice: 90.0,
    memberPrice: 70.0,
    category: "Audi",
    models: {
      A3: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      A4: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      A5: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      A6: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      A7: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      A8: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Q3: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Q4: { years: [2022, 2023, 2024] },
      Q5: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Q7: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Q8: { years: [2019, 2020, 2021, 2022, 2023, 2024] },
      TT: { years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023] },
      R8: { years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023] },
      "e-tron": { years: [2019, 2020, 2021, 2022, 2023, 2024] },
      "e-tron GT": { years: [2022, 2023, 2024] },
      S3: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      S4: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      S5: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      S6: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      S8: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      RS3: { years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      RS4: { years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      RS5: { years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      RS6: { years: [2020, 2021, 2022, 2023, 2024] },
      RS7: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
    },
  },

  // Volkswagen - $80 Non-Member, $60 Member
  Volkswagen: {
    basePrice: 80.0,
    memberPrice: 60.0,
    category: "Volkswagen",
    models: {
      Jetta: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Passat: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Golf: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Tiguan: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Atlas: { years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      "Atlas Cross Sport": { years: [2020, 2021, 2022, 2023, 2024] },
      Arteon: { years: [2019, 2020, 2021, 2022, 2023, 2024] },
      Beetle: { years: [2015, 2016, 2017, 2018, 2019] },
      "Golf GTI": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "Golf R": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Taos: { years: [2022, 2023, 2024] },
      ID4: { years: [2021, 2022, 2023, 2024] },
      "ID.Buzz": { years: [2024] },
    },
  },

  // Volvo - $85 Non-Member, $65 Member
  Volvo: {
    basePrice: 85.0,
    memberPrice: 65.0,
    category: "Volvo",
    models: {
      S60: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      S90: { years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      XC40: { years: [2019, 2020, 2021, 2022, 2023, 2024] },
      XC60: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      XC90: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      V60: { years: [2019, 2020, 2021, 2022, 2023, 2024] },
      V90: { years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      "C40 Recharge": { years: [2022, 2023, 2024] },
      "XC40 Recharge": { years: [2021, 2022, 2023, 2024] },
    },
  },

  // Tesla - Keycodes Not Available
  Tesla: {
    basePrice: 0.0,
    memberPrice: 0.0,
    category: "Tesla",
    availabilityNote:
      "Tesla keycodes are not currently available - contact Tesla directly",
    notAvailable: true,
    models: {
      "Model 3": { years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      "Model Y": { years: [2020, 2021, 2022, 2023, 2024] },
      "Model S": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "Model X": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Cybertruck: { years: [2024] },
      Roadster: { years: [2015, 2016, 2017] },
    },
  },

  // Genesis - $85 Non-Member, $65 Member
  Genesis: {
    basePrice: 85.0,
    memberPrice: 65.0,
    category: "Genesis",
    models: {
      G70: { years: [2019, 2020, 2021, 2022, 2023, 2024] },
      G80: { years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      G90: { years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      GV60: { years: [2022, 2023, 2024] },
      GV70: { years: [2022, 2023, 2024] },
      GV80: { years: [2021, 2022, 2023, 2024] },
      Coupe: { years: [2015, 2016] },
      Sedan: { years: [2015, 2016] },
    },
  },

  // Porsche - $120 Non-Member, $95 Member
  Porsche: {
    basePrice: 120.0,
    memberPrice: 95.0,
    category: "Porsche",
    models: {
      911: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Cayenne: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Macan: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Panamera: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Boxster: { years: [2015, 2016] },
      Cayman: { years: [2015, 2016] },
      "718 Boxster": {
        years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "718 Cayman": { years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      Taycan: { years: [2020, 2021, 2022, 2023, 2024] },
    },
  },

  // Land Rover - $110 Non-Member, $85 Member
  "Land Rover": {
    basePrice: 110.0,
    memberPrice: 85.0,
    category: "Land Rover",
    models: {
      "Range Rover": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "Range Rover Sport": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "Range Rover Evoque": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "Range Rover Velar": {
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "Discovery Sport": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Discovery: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Defender: { years: [2020, 2021, 2022, 2023, 2024] },
    },
  },

  // Jaguar - $105 Non-Member, $80 Member
  Jaguar: {
    basePrice: 105.0,
    memberPrice: 80.0,
    category: "Jaguar",
    models: {
      XE: { years: [2017, 2018, 2019, 2020] },
      XF: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      XJ: { years: [2015, 2016, 2017, 2018, 2019] },
      "F-PACE": { years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      "E-PACE": { years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      "I-PACE": { years: [2019, 2020, 2021, 2022, 2023, 2024] },
      "F-TYPE": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
    },
  },
};

// Helper functions
export const getVehicleMakes = () => {
  return Object.keys(vehicleDatabase).sort();
};

export const getVehicleModels = (make) => {
  if (!make || !vehicleDatabase[make]) return [];
  return Object.keys(vehicleDatabase[make].models).sort();
};

export const getVehicleYears = (make, model) => {
  if (
    !make ||
    !model ||
    !vehicleDatabase[make] ||
    !vehicleDatabase[make].models[model]
  )
    return [];
  return vehicleDatabase[make].models[model].years.sort((a, b) => b - a);
};

export const getVehiclePrice = (make, isMember = false) => {
  if (!make || !vehicleDatabase[make]) return 0;

  // Handle special cases
  if (vehicleDatabase[make].notAvailable) return 0;
  if (vehicleDatabase[make].memberPrice === 0 && !isMember) {
    return vehicleDatabase[make].basePrice;
  }

  return isMember
    ? vehicleDatabase[make].memberPrice
    : vehicleDatabase[make].basePrice;
};

export const getVehicleAvailabilityNote = (make) => {
  if (!make || !vehicleDatabase[make]) return null;
  return vehicleDatabase[make].availabilityNote || null;
};

export const isVehicleAvailable = (make) => {
  if (!make || !vehicleDatabase[make]) return false;
  return !vehicleDatabase[make].notAvailable;
};

export const hasLimitedAvailability = (make) => {
  if (!make || !vehicleDatabase[make]) return false;
  return vehicleDatabase[make].limitedAvailability || false;
};

export const getVehicleCategory = (make) => {
  if (!make || !vehicleDatabase[make]) return "";
  return vehicleDatabase[make].category;
};

export const requiresPin = (make) => {
  if (!make || !vehicleDatabase[make]) return false;
  return vehicleDatabase[make].requiresPin || false;
};

export const isValidVehicleCombination = (make, model, year) => {
  if (!make || !model || !year) return false;
  const years = getVehicleYears(make, model);
  return years.includes(parseInt(year));
};

export const getVehicleLogo = (make) => {
  if (!make) return "";

  // Vehicle logo mapping - using actual logo files
  const logoMap = {
    Acura: "/assets/images/logos/vehicle_logos/optimized/acura.png",
    Honda: "/assets/images/logos/vehicle_logos/optimized/honda.png",
    Chrysler: "/assets/images/logos/vehicle_logos/optimized/chrysler.png",
    Dodge: "/assets/images/logos/vehicle_logos/optimized/dodge.png",
    Jeep: "/assets/images/logos/vehicle_logos/optimized/jeep.png",
    Ford: "/assets/images/logos/vehicle_logos/optimized/ford.png",
    Lincoln: "/assets/images/logos/vehicle_logos/optimized/lincoln.png",
    Hyundai: "/assets/images/logos/vehicle_logos/optimized/hyundai.png",
    Infiniti: "/assets/images/logos/vehicle_logos/optimized/infiniti.png",
    Kia: "/assets/images/logos/vehicle_logos/optimized/kia.png",
    Nissan: "/assets/images/logos/vehicle_logos/optimized/nissan.png",
    Toyota: "/assets/images/logos/vehicle_logos/optimized/toyota.png",
    Lexus: "/assets/images/logos/vehicle_logos/optimized/lexus.png",
    Chevrolet: "/assets/images/logos/vehicle_logos/optimized/chevrolet.png",
    GMC: "/assets/images/logos/vehicle_logos/optimized/gmc.png",
    Buick: "/assets/images/logos/vehicle_logos/optimized/buick.png",
    Cadillac: "/assets/images/logos/vehicle_logos/optimized/cadillac.png",
    Mazda: "/assets/images/logos/vehicle_logos/optimized/mazda.png",
    Mitsubishi: "/assets/images/logos/vehicle_logos/optimized/mitsubishi.png",
    Subaru: "/assets/images/logos/vehicle_logos/optimized/subaru.png",
    BMW: "/assets/images/logos/vehicle_logos/optimized/bmw.png",
  };

  return logoMap[make] || "";
};
