import React from "react";
import { Shield, Lock, Eye, Database, Users, Globe, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 shadow-2xl mb-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-300 text-lg">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                1. Information We Collect
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Personal Information
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Name and contact information (email, phone number)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Vehicle information (make, model, year, VIN)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Payment information (processed securely through Stripe)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Account credentials and login information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Communication history and support requests</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <Database className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Technical Information
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>IP address and device information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Browser type and version</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Usage patterns and analytics data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Cookies and session information</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                2. How We Use Your Information
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Service Provision
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Process keycode requests and provide vehicle information
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Manage your account and subscription</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Process payments and maintain billing records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Provide customer support and respond to inquiries
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Send important service notifications</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Improvement & Analytics
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Analyze usage patterns to improve our services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Develop new features and functionality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Ensure security and prevent fraud</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Comply with legal obligations</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                3. Information Sharing
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    We Do Not Sell Your Data
                  </h3>
                </div>
                <p className="text-gray-300 mb-4">
                  KeycodeHelp does not sell, trade, or rent your personal
                  information to third parties.
                </p>
                <h4 className="text-lg font-semibold text-white mb-3">
                  Limited Sharing Only For:
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Service Providers:</strong> Payment processors
                      (Stripe), hosting services, and analytics tools
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Legal Requirements:</strong> When required by law
                      or to protect our rights
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Business Transfers:</strong> In case of company
                      sale or merger (with notice)
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                4. Data Security
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Protection Measures
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Encryption of data in transit and at rest</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Secure payment processing through Stripe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Regular security audits and updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Limited access to personal information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Secure hosting infrastructure</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                5. Data Retention
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    How Long We Keep Your Data
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Account Data:</strong> Retained while your account
                      is active
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Transaction Records:</strong> Kept for 7 years for
                      tax and legal purposes
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Support Communications:</strong> Retained for 2
                      years after resolution
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Analytics Data:</strong> Aggregated and anonymized
                      after 1 year
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                6. Your Rights
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Control Your Information
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Access:</strong> Request a copy of your personal
                      data
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Correction:</strong> Update or correct inaccurate
                      information
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Deletion:</strong> Request deletion of your data
                      (with limitations)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Portability:</strong> Export your data in a
                      standard format
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Opt-out:</strong> Unsubscribe from marketing
                      communications
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                7. Cookies and Tracking
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    How We Use Cookies
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-300 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Essential Cookies:</strong> Required for basic
                      functionality
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Analytics Cookies:</strong> Help us understand
                      usage patterns
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Preference Cookies:</strong> Remember your
                      settings and choices
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Security Cookies:</strong> Protect against fraud
                      and abuse
                    </span>
                  </li>
                </ul>
                <p className="text-gray-300">
                  You can control cookie settings through your browser
                  preferences.
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                8. International Data Transfers
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Global Service Provision
                  </h3>
                </div>
                <p className="text-gray-300">
                  KeycodeHelp operates globally and may transfer your data to
                  countries outside your residence. We ensure appropriate
                  safeguards are in place for international data transfers.
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                9. Children's Privacy
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Age Requirements
                  </h3>
                </div>
                <p className="text-gray-300">
                  Our services are not intended for children under 18 years of
                  age. We do not knowingly collect personal information from
                  children under 18. If you believe we have collected such
                  information, please contact us immediately.
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                10. Changes to This Policy
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Policy Updates
                  </h3>
                </div>
                <p className="text-gray-300">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any material changes through email or prominent
                  notice on our website. Your continued use of our services
                  after changes become effective constitutes acceptance of the
                  updated policy.
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                11. Contact Information
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Get in Touch
                  </h3>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span>Email: privacy@keycode.help</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Globe className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span>Website: https://keycodehelp.com</span>
                  </div>
                </div>
                <p className="text-gray-300">
                  If you have questions about this Privacy Policy or our data
                  practices, please contact us. We're committed to protecting
                  your privacy and will respond to your inquiries promptly.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
