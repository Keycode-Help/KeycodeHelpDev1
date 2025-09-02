import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Shield,
  Users,
  Mail,
  Globe,
  DollarSign,
} from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 shadow-2xl mb-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center">
              <FileText className="w-10 h-10 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              Terms of Usage
            </h1>
            <p className="text-gray-300 text-lg">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                1. Acceptance of Terms
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Agreement to Terms
                  </h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <p>
                    By accessing and using KeycodeHelp services, you agree to be
                    bound by these Terms of Usage. If you do not agree to these
                    terms, please do not use our services.
                  </p>
                  <p>
                    These terms apply to all users of the service, including
                    without limitation users who are browsers, vendors,
                    customers, merchants, and/or contributors of content.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                2. Description of Service
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    What We Provide
                  </h3>
                </div>
                <p className="text-gray-300 mb-4">
                  KeycodeHelp provides vehicle keycode lookup and information
                  services, including:
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Vehicle keycode retrieval and lookup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Vehicle information and specifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Membership-based access to premium features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Customer support and assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Payment processing for services</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                3. User Accounts and Registration
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Account Requirements
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      You must be at least 18 years old to create an account
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Provide accurate, current, and complete information
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Maintain the security of your account credentials
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Notify us immediately of any unauthorized use</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      You are responsible for all activities under your account
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                4. Acceptable Use Policy
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Permitted Uses
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-300 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Use services for legitimate vehicle information needs
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Access information for personal or business purposes
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Contact support for legitimate assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Cancel membership according to our policies</span>
                  </li>
                </ul>
                <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-red-400 mb-3">
                    ❌ Prohibited Actions
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Share account access with unauthorized users</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Use services for illegal or fraudulent purposes
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Attempt to hack, disrupt, or compromise our systems
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Submit false or misleading vehicle information
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Resell, redistribute, or commercialize our data
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                5. Payment Terms
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Billing and Payments
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-2">
                      💰 Payment Methods
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          Credit and debit cards processed through Stripe
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          Monthly and annual subscription plans available
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          Automatic recurring billing for active subscriptions
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-red-400 mb-2">
                      ⚠️ Important Refund Policy
                    </h4>
                    <p className="text-gray-300">
                      <strong>No refunds for user errors:</strong> We do not
                      provide refunds for incorrect vehicle information,
                      duplicate submissions, or change of mind. Refunds are only
                      available for service failures or technical issues on our
                      end.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                6. Privacy and Data Protection
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Data Security
                  </h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <p>
                    <strong>Data Protection:</strong> We implement
                    industry-standard security measures to protect your personal
                    information and vehicle data.
                  </p>
                  <p>
                    <strong>No Data Sharing:</strong> We do not sell, trade, or
                    rent your personal information to third parties, except as
                    required by law.
                  </p>
                  <p>
                    <strong>Data Retention:</strong> We retain your data only as
                    long as necessary to provide our services and comply with
                    legal obligations.
                  </p>
                  <p>
                    <strong>Your Rights:</strong> You have the right to access,
                    correct, or delete your personal data. Contact us for
                    assistance.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                7. Service Availability
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Service Reliability
                  </h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <p>
                    <strong>Service Availability:</strong> We strive to maintain
                    99.9% uptime but cannot guarantee uninterrupted service.
                  </p>
                  <p>
                    <strong>Maintenance:</strong> Scheduled maintenance may
                    temporarily affect service availability. We will provide
                    advance notice when possible.
                  </p>
                  <p>
                    <strong>Technical Issues:</strong> We are not liable for
                    service interruptions caused by factors beyond our control.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                8. Limitation of Liability
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Liability Limits
                  </h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <p>
                    <strong>Service "As Is":</strong> Our services are provided
                    "as is" without warranties of any kind, either express or
                    implied.
                  </p>
                  <p>
                    <strong>Maximum Liability:</strong> Our total liability to
                    you for any claims shall not exceed the amount you paid for
                    our services in the 12 months preceding the claim.
                  </p>
                  <p>
                    <strong>Excluded Damages:</strong> We are not liable for
                    indirect, incidental, special, consequential, or punitive
                    damages.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                9. Contact Information
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Get in Touch
                  </h3>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span>Email: legal@keycode.help</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Globe className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span>Website: https://keycodehelp.com</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                  <p className="text-gray-300">
                    <strong>Response Time:</strong> We aim to respond to all
                    legal inquiries within 48 hours during business days.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                10. Changes to Terms
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Policy Updates
                  </h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <p>
                    KeycodeHelp reserves the right to modify these Terms of
                    Usage at any time. Changes will be communicated through
                    email notifications and website updates.
                  </p>
                  <p>
                    <strong>Continued Use:</strong> Your continued use of our
                    services after changes become effective constitutes
                    acceptance of the updated terms.
                  </p>
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
