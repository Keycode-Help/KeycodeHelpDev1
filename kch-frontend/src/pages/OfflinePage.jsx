import React from "react";
import {
  WifiOff,
  RefreshCw,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
          {/* Offline Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <WifiOff size={40} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              You're Offline
            </h1>
            <p className="text-slate-300">
              It looks like you've lost your internet connection. Don't worry,
              we've got you covered!
            </p>
          </div>

          {/* What's Available Offline */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              What's Available Offline
            </h3>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle size={16} />
                <span className="text-sm">View cached profile data</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle size={16} />
                <span className="text-sm">Browse cached database</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle size={16} />
                <span className="text-sm">View order history</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle size={16} />
                <span className="text-sm">Queue actions for later</span>
              </div>
            </div>
          </div>

          {/* Limitations */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              What's Limited Offline
            </h3>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle size={16} />
                <span className="text-sm">New keycode requests</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle size={16} />
                <span className="text-sm">Profile updates</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle size={16} />
                <span className="text-sm">Real-time data sync</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle size={16} />
                <span className="text-sm">New subscriptions</span>
              </div>
            </div>
          </div>

          {/* Sync Status */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-blue-400" />
              <span className="text-sm font-medium text-blue-400">
                Auto-Sync Enabled
              </span>
            </div>
            <p className="text-xs text-blue-200">
              Your actions will be automatically synced when you're back online
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg"
            >
              <RefreshCw size={20} />
              Try Again
            </button>

            <button
              onClick={handleGoHome}
              className="w-full px-6 py-3 bg-slate-600 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors duration-200 shadow-lg"
            >
              Go to Homepage
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-xs text-slate-400">
            <p>
              If you continue to have connection issues, please check your
              internet connection or try again later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfflinePage;
