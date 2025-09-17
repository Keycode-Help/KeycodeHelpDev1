import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft, ShoppingCart, Home } from "lucide-react";

function PaymentCancel() {
  const navigate = useNavigate();

  const handleReturnToCart = () => {
    navigate("/cart");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-secondary to-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Cancel Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center">
              <XCircle size={48} className="text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">❌ Payment Cancelled</h1>
            <p className="text-white/80 text-lg">
              Your payment was cancelled. No charges were made to your account.
            </p>
          </div>

          {/* What Happened */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                <span className="text-blue-400">📋</span>
              </div>
              What Happened?
            </h2>
            <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6">
              <p className="text-white/80 mb-4">
                You cancelled the payment process before it was completed. This
                can happen when:
              </p>
              <ul className="space-y-2 text-white/80 mb-4">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>You closed the payment window</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>You clicked the "Cancel" button</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>There was a technical issue</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>You decided not to proceed with the payment</span>
                </li>
              </ul>
              <p className="text-white/80">
                <strong className="text-green-400">Good news:</strong> No money was charged to your account,
                and your cart items are still available.
              </p>
            </div>
          </div>

          {/* Your Options */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                <span className="text-green-400">🔄</span>
              </div>
              Your Options
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center">
                    <ShoppingCart size={32} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Return to Cart</h3>
                  <p className="text-white/80 mb-6">
                    Go back to your cart to review your items and try payment again.
                  </p>
                  <button 
                    onClick={handleReturnToCart} 
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    <ArrowLeft size={20} />
                    Return to Cart
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center">
                    <Home size={32} className="text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Go to Homepage</h3>
                  <p className="text-white/80 mb-6">
                    Return to the homepage to browse other services or start over.
                  </p>
                  <button 
                    onClick={handleGoHome} 
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    <Home size={20} />
                    Go Home
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                <span className="text-yellow-400">❓</span>
              </div>
              Need Help?
            </h2>
            <p className="text-white/80 mb-6">
              If you experienced technical issues or have questions about the
              payment process, our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a 
                href="mailto:support@keycode.help" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <span>📧</span>
                Contact Support
              </a>
              <span className="text-white/60">or</span>
              <a 
                href="tel:+1-800-KEYCODE" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <span>📞</span>
                Call Us
              </a>
            </div>
          </div>
      </div>
    </div>
  );
}

export default PaymentCancel;
