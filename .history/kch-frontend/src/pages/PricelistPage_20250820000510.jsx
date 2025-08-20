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

  const additionalServices = [
    {
      name: "Bulk Processing",
      description: "Process 100+ keycode requests at once",
      price: 0.5,
      period: "per request",
    },
    {
      name: "OEM Verification",
      description: "Double-check against manufacturer specifications",
      price: 9.99,
      period: "per request",
    },
    {
      name: "Priority Support",
      description: "Direct line to keycode specialists",
      price: 14.99,
      period: "per request",
    },
    {
      name: "PIN Code Service",
      description: "Additional PIN code for compatible vehicles",
      price: 20.0,
      period: "per PIN code",
    },
  ];

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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Keycode Pricing by Manufacturer
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Transparent pricing for every vehicle brand. Members save
            significantly on keycode requests. Some vehicles require additional
            PIN codes which are included in member pricing.
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
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
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
            <select
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="all">All Manufacturers</option>
              {Object.keys(manufacturerPricing).map((manufacturer) => (
                <option key={manufacturer} value={manufacturer}>
                  {manufacturer}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredManufacturers.map(([manufacturer, data]) => (
              <div
                key={manufacturer}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:scale-105"
              >
                {/* Manufacturer Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-lg flex items-center justify-center">
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
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Non-Member</span>
                      <span className="text-2xl font-bold text-white">
                        ${data.nonMemberPrice}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">Standard pricing</p>
                  </div>

                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blue-300">Member Price</span>
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
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
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
                  className="btn btn-primary w-full"
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
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                What's the difference between member and non-member pricing?
              </h3>
              <p className="text-gray-300">
                Members get significant discounts on keycode requests. For
                example, Hyundai keycodes cost $60 for non-members but only $38
                for members. Some vehicles require additional PIN codes which
                are included in member pricing.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Which vehicles require separate PIN codes?
              </h3>
              <p className="text-gray-300">
                Chrysler, Dodge/Jeep, Infiniti, and Nissan vehicles require both
                a keycode and PIN code. For members, PIN codes are included. For
                non-members, PIN codes cost an additional $20.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                What information do I need to provide?
              </h3>
              <p className="text-gray-300">
                You'll need the vehicle's VIN, make, model, year, and proof of
                ownership or professional credentials for verification.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
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
      <div className="py-16 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Your Keycode?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            No membership required. Get your keycode quickly and affordably with
            our manufacturer-specific pricing. Start your request now!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/vehicle-keycode-request"
              className="btn btn-lg btn-primary"
            >
              <Icon name="key" size={20} />
              Request Keycode Now
            </Link>
            <Link to="/support" className="btn btn-lg btn-outline">
              <Icon name="headphones" size={20} />
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricelistPage;
