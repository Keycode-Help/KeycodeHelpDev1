// Comprehensive Vehicle Database with Actual Keycode Pricing
export const vehicleDatabase = {
  // Acura/Honda - $60 Non-Member, $45 Member
  Acura: {
    basePrice: 60.0,
    memberPrice: 45.0,
    category: "Acura/Honda",
    models: {
      MDX: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      RDX: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      TLX: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      ILX: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      NSX: { years: [2016, 2017, 2018, 2019, 2020, 2021, 2022] },
      TSX: { years: [2009, 2010, 2011, 2012, 2013, 2014] },
      ZDX: { years: [2010, 2011, 2012, 2013] },
      CDX: { years: [2017, 2018, 2019, 2020, 2021] },
      Integra: { years: [2023, 2024] },
      RSX: { years: [2002, 2003, 2004, 2005, 2006] },
    },
  },
  Honda: {
    basePrice: 60.0,
    memberPrice: 45.0,
    category: "Acura/Honda",
    models: {
      Civic: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Accord: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "CR-V": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Pilot: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Ridgeline: { years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      Passport: { years: [2019, 2020, 2021, 2022, 2023, 2024] },
      "HR-V": { years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      Odyssey: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Fit: { years: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020] },
      Insight: { years: [2010, 2011, 2012, 2013, 2014, 2019, 2020, 2021, 2022] },
      "CR-Z": { years: [2011, 2012, 2013, 2014, 2015, 2016] },
      Element: { years: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011] },
      S2000: { years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009] },
      Crosstour: { years: [2010, 2011, 2012, 2013, 2014, 2015] },
    },
  },

  // Chrysler (Key+PIN) - $85 Non-Member, $69 Member
  Chrysler: {
    basePrice: 85.0,
    memberPrice: 69.0,
    category: "Chrysler (Key+PIN)",
    requiresPin: true,
    models: {
      300: {
        years: [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
      },
      Pacifica: { years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      200: { years: [2011, 2012, 2013, 2014, 2015, 2016, 2017] },
      Sebring: { years: [2007, 2008, 2009, 2010] },
      "Town & Country": { years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016] },
      Aspen: { years: [2007, 2008, 2009] },
      Crossfire: { years: [2004, 2005, 2006, 2007, 2008] },
    },
  },

  // Dodge/Jeep - $85 Non-Member, $69 Member
  Dodge: {
    basePrice: 85.0,
    memberPrice: 69.0,
    category: "Dodge/Jeep",
    requiresPin: true,
    models: {
      "Ram 1500": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "Ram 2500": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "Ram 3500": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Challenger: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Charger: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Durango: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Journey: { years: [2015, 2016, 2017, 2018, 2019, 2020] },
      "Grand Caravan": { years: [2015, 2016, 2017, 2018, 2019, 2020] },
    },
  },
  Jeep: {
    basePrice: 85.0,
    memberPrice: 69.0,
    category: "Dodge/Jeep",
    requiresPin: true,
    models: {
      Wrangler: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "Grand Cherokee": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Cherokee: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Compass: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Renegade: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Gladiator: { years: [2020, 2021, 2022, 2023, 2024] },
    },
  },

  // Ford/Lincoln/Mercury - $70 Non-Member, $55 Member
  Ford: {
    basePrice: 70.0,
    memberPrice: 55.0,
    category: "Ford/Lincoln/Mercury",
    models: {
      "F-150": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "F-250": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "F-350": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Mustang: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Explorer: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Escape: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Edge: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Expedition: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Ranger: { years: [2019, 2020, 2021, 2022, 2023, 2024] },
      Bronco: { years: [2021, 2022, 2023, 2024] },
      "Bronco Sport": { years: [2021, 2022, 2023, 2024] },
      Maverick: { years: [2022, 2023, 2024] },
      Focus: { years: [2015, 2016, 2017, 2018] },
      Fiesta: { years: [2015, 2016, 2017, 2018, 2019] },
      Fusion: { years: [2015, 2016, 2017, 2018, 2019, 2020] },
      Taurus: { years: [2015, 2016, 2017, 2018, 2019] },
      EcoSport: { years: [2018, 2019, 2020, 2021, 2022] },
      Transit: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "Transit Connect": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
    },
  },
  Lincoln: {
    basePrice: 70.0,
    memberPrice: 55.0,
    category: "Ford/Lincoln/Mercury",
    models: {
      Navigator: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Aviator: { years: [2020, 2021, 2022, 2023, 2024] },
      Corsair: { years: [2020, 2021, 2022, 2023, 2024] },
      Nautilus: { years: [2019, 2020, 2021, 2022, 2023, 2024] },
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
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
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
      Q70: { years: [2015, 2016, 2017, 2018, 2019, 2020] },
      QX50: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      QX60: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      QX80: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
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
      "GT-R": { years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022] },
      "Titan XD": { years: [2016, 2017, 2018, 2019] },
      NV200: { years: [2015, 2016, 2017, 2018, 2019, 2020] },
    },
  },

  // Toyota/Lexus - $75 Non-Member, $60 Member
  Toyota: {
    basePrice: 75.0,
    memberPrice: 60.0,
    category: "Toyota/Lexus",
    models: {
      Camry: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Corolla: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      RAV4: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Highlander: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Tacoma: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Tundra: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "4Runner": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Sequoia: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Prius: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Avalon: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Sienna: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "C-HR": { years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      Venza: { years: [2021, 2022, 2023, 2024] },
      "Crown Signia": { years: [2024] },
      "Prius Prime": {
        years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      bZ4X: { years: [2023, 2024] },
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
      "Silverado 1500": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "Silverado 2500": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "Silverado 3500": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Camaro: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Corvette: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Equinox: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Traverse: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Tahoe: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Suburban: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Colorado: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Malibu: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Impala: { years: [2015, 2016, 2017, 2018, 2019, 2020] },
      Cruze: { years: [2015, 2016, 2017, 2018, 2019] },
      Trax: { years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022] },
      Blazer: { years: [2019, 2020, 2021, 2022, 2023, 2024] },
      "Bolt EV": { years: [2017, 2018, 2019, 2020, 2021, 2022, 2023] },
      "Bolt EUV": { years: [2022, 2023] },
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
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
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
      Regal: { years: [2015, 2016, 2017, 2018, 2019, 2020] },
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
