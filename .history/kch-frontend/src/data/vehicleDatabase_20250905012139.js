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
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Pacifica: { years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      200: { years: [2015, 2016, 2017] },
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
      Maverick: { years: [2022, 2023, 2024] },
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
      "CX-5": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "CX-9": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "CX-30": { years: [2020, 2021, 2022, 2023, 2024] },
      "CX-50": { years: [2022, 2023, 2024] },
      3: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      6: { years: [2015, 2016, 2017, 2018, 2019, 2020, 2021] },
      "MX-5 Miata": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
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
      "Eclipse Cross": { years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      Mirage: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      Lancer: { years: [2015, 2016, 2017] },
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
    },
  },

  // BMW - $90 Non-Member, $70 Member
  BMW: {
    basePrice: 90.0,
    memberPrice: 70.0,
    category: "BMW",
    models: {
      "3 Series": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      "5 Series": {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      X3: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      X5: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      X7: { years: [2019, 2020, 2021, 2022, 2023, 2024] },
      M3: {
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      M5: {
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
  return isMember
    ? vehicleDatabase[make].memberPrice
    : vehicleDatabase[make].basePrice;
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
