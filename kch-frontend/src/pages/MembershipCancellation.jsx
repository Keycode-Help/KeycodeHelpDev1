import React from "react";
import {
  Clock,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Globe,
  Users,
  Shield,
  Info,
} from "lucide-react";

const MembershipCancellation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 shadow-2xl mb-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center">
              <Clock className="w-10 h-10 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              Membership Cancellation Policy
            </h1>
            <p className="text-gray-300 text-lg">
              Clear guidelines for cancelling your KeycodeHelp membership
            </p>
          </div>

          <div className="space-y-8">
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                Quick Overview
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Key Points
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Cancel Anytime:</strong> No long-term contracts or
                      cancellation fees
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Monthly Plans:</strong> No refunds for partial
                      months
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Annual Plans:</strong> Prorated refunds for unused
                      months
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Immediate Effect:</strong> Cancellations take
                      effect at end of billing period
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Easy Process:</strong> Cancel through account
                      settings or contact support
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                1. Cancellation Timeline
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    When Cancellation Takes Effect
                  </h3>
                </div>
                <div className="space-y-4 mb-4">
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">
                      Immediate
                    </h4>
                    <p className="text-gray-300">
                      Your cancellation request is processed
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-emerald-400 mb-2">
                      End of Billing Period
                    </h4>
                    <p className="text-gray-300">
                      Service access continues until paid period ends
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-2">
                      Next Billing Cycle
                    </h4>
                    <p className="text-gray-300">
                      No further charges are processed
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <p className="text-gray-300">
                    <strong>Important:</strong> You maintain full access to all
                    features until your current billing period expires.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                2. Monthly Membership Plans
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Monthly Billing Cancellation
                  </h3>
                </div>
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                  <h4 className="text-lg font-semibold text-blue-400 mb-3">
                    📅 Monthly Plan Details
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Billing Cycle:</strong> Monthly (30-day periods)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Cancellation:</strong> Cancel anytime during the
                        month
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Refund Policy:</strong> No refunds for partial
                        months
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Service Access:</strong> Full access until month
                        ends
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Next Charge:</strong> No charges after
                        cancellation
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                    <p className="text-gray-300">
                      <strong>Example:</strong> If you cancel on the 15th of a
                      month, you'll have access until the end of that month, but
                      no refund for the remaining 15 days.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                3. Annual Membership Plans
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Annual Billing Cancellation
                  </h3>
                </div>
                <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl p-4 mb-4">
                  <h4 className="text-lg font-semibold text-emerald-400 mb-3">
                    📅 Annual Plan Details
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Billing Cycle:</strong> Annual (365-day periods)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Cancellation:</strong> Cancel anytime during the
                        year
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Refund Policy:</strong> Prorated refunds for
                        unused months
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Service Access:</strong> Full access until
                        cancellation date
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Refund Calculation:</strong> Based on remaining
                        months
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                    <p className="text-gray-300">
                      <strong>Example:</strong> If you cancel after 6 months on
                      an annual plan, you'll receive a refund for the remaining
                      6 months (50% of annual fee).
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                4. Refund Calculation
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    How Refunds Are Calculated
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">
                      💰 Monthly Plans
                    </h4>
                    <p className="text-gray-300">
                      <strong>No Refunds:</strong> Monthly plans are
                      non-refundable once the month begins.
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-emerald-400 mb-2">
                      💰 Annual Plans
                    </h4>
                    <p className="text-gray-300 mb-3">
                      <strong>Prorated Refunds:</strong> Calculate unused months
                      and refund proportionally.
                    </p>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          Refund = (Unused months ÷ Total months) × Annual fee
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          Processing fee: $5 deducted from refund amount
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Minimum refund: $10 (after processing fee)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-purple-400 mb-3">
                      📊 Refund Examples
                    </h4>
                    <div className="space-y-2 text-gray-300">
                      <div className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/10 rounded-lg p-3">
                        <strong>3 months used:</strong> 9 months remaining = 75%
                        refund
                      </div>
                      <div className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/10 rounded-lg p-3">
                        <strong>6 months used:</strong> 6 months remaining = 50%
                        refund
                      </div>
                      <div className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/10 rounded-lg p-3">
                        <strong>9 months used:</strong> 3 months remaining = 25%
                        refund
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                5. How to Cancel
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Cancellation Methods
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">
                      💻 Account Settings (Recommended)
                    </h4>
                    <p className="text-gray-300 mb-2">
                      Log into your account and use the cancellation option in
                      settings
                    </p>
                    <p className="text-gray-400 text-sm">
                      Fastest and most convenient method
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">
                      📧 Email Cancellation
                    </h4>
                    <p className="text-gray-300 mb-2">
                      Send cancellation request to{" "}
                      <strong>cancellations@keycode.help</strong>
                    </p>
                    <p className="text-gray-400 text-sm">
                      Include your account email and reason for cancellation
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-purple-400 mb-3">
                    Required Information for Cancellation:
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Account email address</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Full name on account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Reason for cancellation (optional but helpful)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Preferred contact method for confirmation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                6. What Happens After Cancellation
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Post-Cancellation Process
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-blue-400 mb-2">
                          Confirmation Email
                        </h4>
                        <p className="text-gray-300">
                          You'll receive immediate confirmation of your
                          cancellation request
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-emerald-400 mb-2">
                          Service Access Continues
                        </h4>
                        <p className="text-gray-300">
                          Full access to all features until current billing
                          period ends
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-yellow-400 mb-2">
                          Refund Processing
                        </h4>
                        <p className="text-gray-300">
                          Annual plan refunds processed within 5-10 business
                          days
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-purple-400 mb-2">
                          Account Status
                        </h4>
                        <p className="text-gray-300">
                          Account becomes inactive but data is preserved for 30
                          days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                7. Reactivation
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Rejoining KeycodeHelp
                  </h3>
                </div>
                <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl p-4 mb-4">
                  <h4 className="text-lg font-semibold text-emerald-400 mb-3">
                    🔄 Reactivation Process
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Anytime:</strong> You can reactivate your
                        account at any time
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Current Pricing:</strong> New rates may apply
                        (prices subject to change)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>Data Recovery:</strong> Your previous data may
                        be restored
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>New Payment:</strong> New payment method may be
                        required
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        <strong>No Penalties:</strong> No fees for reactivation
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                    <p className="text-gray-300">
                      <strong>Note:</strong> Reactivation is subject to current
                      terms and pricing. Previous promotional rates may not be
                      available.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                8. Special Circumstances
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Exceptions to Standard Policy
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-red-400 mb-3">
                      🚫 No Refunds For
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Service usage during the billing period</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Change of mind after purchase</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Technical issues on user's end</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Incompatibility with user's systems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>User errors or mistakes</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-emerald-400 mb-3">
                      ✅ Special Refunds Available For
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Service outages exceeding 24 hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Technical failures preventing service use</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Billing errors or duplicate charges</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Fraudulent charges</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                9. Contact Information
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Cancellation Support
                  </h3>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span>Cancellation Email: cancellations@keycode.help</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Globe className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span>Website: https://keycodehelp.com</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-gray-300">
                    <strong>Response Time:</strong> We aim to process all
                    cancellation requests within 24 hours during business days.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
                10. Policy Updates
              </h2>
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Changes to Cancellation Policy
                  </h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <p>
                    KeycodeHelp reserves the right to modify this cancellation
                    policy at any time. Changes will be communicated through
                    email notifications and website updates. Your cancellation
                    rights at the time of purchase will be honored.
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

export default MembershipCancellation;
