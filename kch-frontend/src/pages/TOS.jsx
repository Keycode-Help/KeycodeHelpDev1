import React from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  Users,
  Mail,
  Phone,
  Globe,
} from "lucide-react";

const TOS = () => {
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
              Terms of Service (Simplified)
            </h1>
            <p className="text-gray-300 text-lg">
              Simple, clear terms for using KeycodeHelp
            </p>
          </div>

          <div className="space-y-8">
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                Quick Summary
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    What You Need to Know
                  </h3>
                </div>
                <p className="text-gray-300">
                  By using KeycodeHelp, you agree to these simple terms. We
                  provide vehicle keycode services and expect you to use them
                  responsibly.
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                ✅ What You Can Do
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
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Look up vehicle keycodes for legitimate needs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Use our service for personal or business vehicle
                      information
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Contact support when you need help</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Cancel your membership anytime</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                ❌ What You Cannot Do
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Prohibited Actions
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Share your account with others</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Use our service for illegal purposes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Try to hack or break our systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Submit fake or incorrect vehicle information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Resell or redistribute our data</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                💰 Payment & Refunds
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Important Refund Policy
                  </h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <p>
                    <strong>No refunds for user mistakes:</strong> If you enter
                    wrong vehicle information, submit duplicate requests, or
                    change your mind, we cannot provide refunds.
                  </p>
                  <p>
                    <strong>Refunds only for:</strong> Service failures, no
                    keycode available, or technical issues on our end.
                  </p>
                  <p>
                    <strong>Membership cancellation:</strong> Cancel anytime.
                    Monthly plans: no partial refunds. Annual plans: prorated
                    refunds for unused months.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                🔒 Privacy & Security
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Data Protection
                  </h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <p>
                    <strong>We protect your data:</strong> Your personal
                    information and vehicle data are kept secure and private.
                  </p>
                  <p>
                    <strong>No sharing:</strong> We don't sell or share your
                    information with third parties.
                  </p>
                  <p>
                    <strong>Secure payments:</strong> All payments are processed
                    securely through Stripe.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                📞 Contact & Support
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Get Help When You Need It
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
                    inquiries within 24 hours during business days.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                📝 Policy Updates
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Changes to Terms
                  </h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <p>
                    KeycodeHelp may update these terms from time to time. We
                    will notify you of any material changes through email or
                    website updates.
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

export default TOS;
