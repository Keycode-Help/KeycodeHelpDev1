import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/IconProvider";

const PricelistPage = () => {
  const [selectedManufacturer, setSelectedManufacturer] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Keycode pricing by manufacturer
  const manufacturerPricing = {
    "Acura/Honda": {
      logo: "/assets/images/logos/acura-logo.png",
      nonMemberPrice: 60,
      memberPrice: 45,
      description: "Honda luxury division - precise keycode solutions",
      popularModels: [
        "MDX",
        "RDX",
        "TLX",
        "NSX",
        "CR-V",
        "Accord",
        "Civic",
        "Pilot",
      ],
      features: ["OEM specifications", "Fast processing", "Expert support"],
      pinCodeNote: null,
    },
    Chrysler: {
      logo: "/assets/images/logos/chrysler-logo.png",
      nonMemberPrice: 85,
      memberPrice: 69,
      description: "American innovation - advanced keycode technology",
      popularModels: ["300", "Pacifica", "Voyager", "Aspen"],
      features: [
        "Chrysler certified",
        "Priority processing",
        "Quick turnaround",
      ],
      pinCodeNote: "Key + PIN required",
    },
    "Dodge/Jeep": {
      logo: "/assets/images/logos/dodge-logo.png",
      nonMemberPrice: 85,
      memberPrice: 69,
      description: "Muscle and adventure - reliable keycode service",
      popularModels: [
        "Challenger",
        "Charger",
        "Durango",
        "Wrangler",
        "Grand Cherokee",
      ],
      features: ["Dodge/Jeep certified", "Fast delivery", "Expert technicians"],
      pinCodeNote: "Key + PIN required",
    },
    "Ford/Lincoln/Mercury": {
      logo: "/assets/images/logos/ford-logo.png",
      nonMemberPrice: 70,
      memberPrice: 55,
      description: "Built Ford tough - dependable keycode service",
      popularModels: [
        "F-150",
        "Explorer",
        "Mustang",
        "Bronco",
        "Navigator",
        "Continental",
      ],
      features: ["Ford certified", "Quick delivery", "Expert technicians"],
      pinCodeNote: null,
    },
    Hyundai: {
      logo: "/assets/images/logos/hyundai-logo.png",
      nonMemberPrice: 60,
      memberPrice: 38,
      description: "Smart mobility solutions - efficient keycode service",
      popularModels: [
        "Tucson",
        "Santa Fe",
        "Elantra",
        "Palisade",
        "Sonata",
        "Venue",
      ],
      features: ["Hyundai certified", "Quick turnaround", "Competitive rates"],
      pinCodeNote: null,
    },
    Infiniti: {
      logo: "/assets/images/logos/infiniti-logo.png",
      nonMemberPrice: 70,
      memberPrice: 36,
      description: "Nissan luxury division - premium keycode solutions",
      popularModels: ["Q50", "Q60", "QX50", "QX60", "QX80"],
      features: ["Infiniti certified", "Premium support", "Exclusive access"],
      pinCodeNote: "Key + PIN required (+$20)",
    },
    Kia: {
      logo: "/assets/images/logos/kia-logo.png",
      nonMemberPrice: 60,
      memberPrice: 32,
      description: "Movement that inspires - reliable keycode delivery",
      popularModels: ["Sportage", "Telluride", "K5", "Sorento", "Forte", "Rio"],
      features: ["Kia approved", "Fast processing", "Quality service"],
      pinCodeNote: null,
    },
    Nissan: {
      logo: "/assets/images/logos/nissan-logo.png",
      nonMemberPrice: 70,
      memberPrice: 36,
      description: "Innovation that excites - reliable keycode service",
      popularModels: [
        "Rogue",
        "Altima",
        "Maxima",
        "Armada",
        "Sentra",
        "Pathfinder",
      ],
      features: ["Nissan approved", "Fast delivery", "Quality guarantee"],
      pinCodeNote: "Key + PIN required (+$20)",
    },
    "Toyota/Lexus": {
      logo: "/assets/images/logos/toyota-logo.png",
      nonMemberPrice: 75,
      memberPrice: 60,
      description: "Let's go places - dependable keycode solutions",
      popularModels: [
        "RAV4",
        "Camry",
        "Highlander",
        "Tacoma",
        "RX",
        "ES",
        "NX",
        "LS",
      ],
      features: ["Toyota certified", "Quick processing", "Expert support"],
      pinCodeNote: null,
    },
    "Chevy/GM": {
      logo: "/assets/images/logos/chevrolet-logo.png",
      nonMemberPrice: 70,
      memberPrice: 50,
      description: "American reliability - affordable keycode solutions",
      popularModels: [
        "Silverado",
        "Equinox",
        "Camaro",
        "Corvette",
        "Tahoe",
        "Suburban",
      ],
      features: ["US-based support", "Fast processing", "Competitive pricing"],
      pinCodeNote: null,
    },
    Mazda: {
      logo: "/assets/images/logos/mazda-logo.png",
      nonMemberPrice: 75,
      memberPrice: 60,
      description: "Zoom-zoom - precision keycode technology",
      popularModels: ["CX-5", "CX-9", "Mazda3", "Mazda6", "MX-5", "CX-30"],
      features: ["Mazda certified", "Fast delivery", "Quality guarantee"],
      pinCodeNote: null,
    },
    Mitsubishi: {
      logo: "/assets/images/logos/mitsubishi-logo.png",
      nonMemberPrice: 70,
      memberPrice: null,
      description: "Driving ambition - reliable keycode service",
      popularModels: ["Outlander", "Eclipse Cross", "Mirage", "Lancer"],
      features: ["Mitsubishi approved", "Fast processing", "Expert support"],
      pinCodeNote: "Member price: Ask",
    },
    Subaru: {
      logo: "/assets/images/logos/subaru-logo.png",
      nonMemberPrice: 75,
      memberPrice: 60,
      description:
        "Love - it's what makes a Subaru - dependable keycode solutions",
      popularModels: [
        "Forester",
        "Outback",
        "Crosstrek",
        "Impreza",
        "WRX",
        "Ascent",
      ],
      features: ["Subaru certified", "Quick turnaround", "Quality service"],
      pinCodeNote: null,
    },
    BMW: {
      logo: "/assets/images/logos/bmw-logo.png",
      nonMemberPrice: 90,
      memberPrice: 70,
      description: "Ultimate driving machine - precision keycode delivery",
      popularModels: ["3 Series", "X5", "M3", "i4", "X3", "5 Series", "X7"],
      features: ["BMW certified", "Priority processing", "24/7 support"],
      pinCodeNote: null,
    },
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredManufacturers = Object.entries(manufacturerPricing).filter(
    ([name, data]) => {
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.popularModels.some((model) =>
          model.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesFilter =
        selectedManufacturer === "all" || name === selectedManufacturer;
      return matchesSearch && matchesFilter;
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading keycode pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-2xl mb-6 shadow-2xl">
              <span className="text-2xl font-bold text-white">$</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent mb-6">
              Keycode Pricing by Manufacturer
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transparent pricing for every vehicle brand. Members save
              significantly on keycode requests. Some vehicles require
              additional PIN codes which are included in member pricing.
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <div className="relative flex-1 max-w-md">
                  <Icon
                    name="search"
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search manufacturers, models, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <select
                  value={selectedManufacturer}
                  onChange={(e) => setSelectedManufacturer(e.target.value)}
                  className="px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  style={{
                    colorScheme: "dark",
                  }}
                >
                  <option value="all" className="bg-slate-800 text-white">
                    All Manufacturers
                  </option>
                  {Object.keys(manufacturerPricing).map((manufacturer) => (
                    <option
                      key={manufacturer}
                      value={manufacturer}
                      className="bg-slate-800 text-white"
                    >
                      {manufacturer}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredManufacturers.map(([manufacturer, data]) => (
                <div
                  key={manufacturer}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-3xl"
                >
                  {/* Manufacturer Header */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {manufacturer.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {manufacturer}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      {data.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 font-medium">
                          Non-Member
                        </span>
                        <span className="text-2xl font-bold text-white">
                          ${data.nonMemberPrice}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">Standard pricing</p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500/10 to-yellow-500/10 border border-blue-500/30 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-300 font-medium">
                          Member Price
                        </span>
                        <span className="text-2xl font-bold text-blue-400">
                          {data.memberPrice ? `$${data.memberPrice}` : "Ask"}
                        </span>
                      </div>
                      <p className="text-blue-400 text-sm">
                        {data.pinCodeNote || "Includes PIN code"}
                      </p>
                    </div>
                  </div>

                  {/* Popular Models */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">
                      Popular Models
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {data.popularModels.map((model, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-700/50 border border-slate-600 text-gray-300 text-xs rounded-full hover:bg-slate-600/50 transition-colors"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Features</h4>
                    <ul className="space-y-2">
                      {data.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-gray-300"
                        >
                          <Icon
                            name="check"
                            size={16}
                            className="text-green-400 mr-2 flex-shrink-0"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Link
                    to="/vehicle-keycode-request"
                    className="w-full bg-gradient-to-r from-blue-500 to-yellow-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Icon name="key" size={18} />
                    Get {manufacturer} Keycode
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
                <h3 className="text-xl font-semibold text-white mb-3">
                  What's the difference between member and non-member pricing?
                </h3>
                <p className="text-gray-300">
                  Members get significant discounts on keycode requests. For
                  example, Hyundai keycodes cost $60 for non-members but only
                  $38 for members. Some vehicles require additional PIN codes
                  which are included in member pricing.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Which vehicles require separate PIN codes?
                </h3>
                <p className="text-gray-300">
                  Chrysler, Dodge/Jeep, Infiniti, and Nissan vehicles require
                  both a keycode and PIN code. For members, PIN codes are
                  included. For non-members, PIN codes cost an additional $20.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
                <h3 className="text-xl font-semibold text-white mb-3">
                  What information do I need to provide?
                </h3>
                <p className="text-gray-300">
                  You'll need the vehicle's VIN, make, model, year, and proof of
                  ownership or professional credentials for verification.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Do you offer bulk pricing for multiple requests?
                </h3>
                <p className="text-gray-300">
                  Yes! For 100+ keycode requests, we offer significant discounts
                  at $0.50 per request. Contact us for custom bulk pricing
                  tailored to your needs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-blue-500/10 to-yellow-500/10 border-t border-slate-700">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent mb-6">
              Ready to Get Your Keycode?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              No membership required. Get your keycode quickly and affordably
              with our manufacturer-specific pricing. Start your request now!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/vehicle-keycode-request"
                className="bg-gradient-to-r from-blue-500 to-yellow-500 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <Icon name="key" size={20} />
                Request Keycode Now
              </Link>
              <Link
                to="/support"
                className="bg-slate-800/50 border border-slate-600 text-white font-semibold py-4 px-8 rounded-xl hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <Icon name="headphones" size={20} />
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricelistPage;
