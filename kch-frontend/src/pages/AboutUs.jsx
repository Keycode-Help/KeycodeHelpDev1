import React from "react";
import {
  Users,
  Target,
  Database,
  Shield,
  Globe,
  Award,
  Key,
} from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-2xl mb-6 shadow-2xl">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent mb-4">
            About Us – Keycode Help
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Built by locksmiths, for locksmiths. Professional keycode solutions
            for the automotive industry.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:gap-12">
          {/* Who We Are */}
          <section className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-blue-500 to-yellow-500 p-6">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-white" />
                <h2 className="text-2xl font-bold text-white">Who We Are</h2>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Our Foundation
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Keycode Help (KCH) is a specialized Software-as-a-Service
                    (SaaS) platform built by locksmiths, for locksmiths. Founded
                    by professionals with years of hands-on experience in the
                    automotive and security industry, we understand the
                    challenges technicians face in quickly identifying,
                    programming, and servicing modern vehicle keys.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Mission */}
          <section className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6">
              <div className="flex items-center gap-4">
                <Target className="h-8 w-8 text-white" />
                <h2 className="text-2xl font-bold text-white">Our Mission</h2>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Simplifying Key Programming
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    We exist to simplify and professionalize key programming.
                    Our mission is to give locksmiths, automotive techs, and
                    security providers a reliable, fast, and legally compliant
                    toolset that keeps pace with evolving vehicle technology.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What We Do */}
          <section className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
              <div className="flex items-center gap-4">
                <Database className="h-8 w-8 text-white" />
                <h2 className="text-2xl font-bold text-white">What We Do</h2>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Database className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Interactive VIN-to-Keycode Database
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    KCH provides an interactive VIN-to-Keycode and Key-Type
                    database, designed to:
                  </p>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>
                        Instantly identify the correct transponder chip or
                        system type for programming
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>
                        Cross-reference chip families with JMA, Silca, CN, PCF,
                        XT, and OEM part numbers
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>
                        Provide locksmiths with real-time resources to reduce
                        trial-and-error, cut job times, and improve
                        profitability
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>
                        Offer subscription-based access to continuously updated
                        data across makes, models, and years
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Why It Matters */}
          <section className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
              <div className="flex items-center gap-4">
                <Shield className="h-8 w-8 text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Why It Matters
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Industry Evolution
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    The locksmith industry is evolving rapidly, with vehicles
                    integrating encrypted transponders, rolling codes, and
                    proprietary OEM systems. Many small businesses lack access
                    to clean, organized reference data. KCH bridges that
                    gap—delivering dealer-level accuracy in a platform tailored
                    for independent locksmiths and mobile technicians.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Vision */}
          <section className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6">
              <div className="flex items-center gap-4">
                <Globe className="h-8 w-8 text-white" />
                <h2 className="text-2xl font-bold text-white">Our Vision</h2>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Leading Digital Resource Hub
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    To be the leading digital resource hub for locksmiths
                    worldwide—expanding beyond VIN and keycode lookups to
                    include training resources, compliance tools, programming
                    workflows, and integrations with industry hardware/software.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Built with Integrity */}
          <section className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6">
              <div className="flex items-center gap-4">
                <Award className="h-8 w-8 text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Built with Integrity
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Partnerships & Compliance
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    We partner with official data providers and industry
                    organizations to ensure compliance, accuracy, and ethical
                    use of sensitive vehicle keycode data. Our focus is on
                    protecting both the technician and the consumer by raising
                    standards in the locksmith profession.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
