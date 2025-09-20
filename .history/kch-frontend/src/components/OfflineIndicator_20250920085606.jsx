import React, { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useConnectionStatus } from "../hooks/useConnectionStatus";
import { syncActions } from "../utils/offlineQueue";

function OfflineIndicator() {
  const {
    isOnline,
    connectionType,
    formattedOfflineDuration,
    isSlowConnection: isSlow,
    isGoodConnection: isGood,
  } = useConnectionStatus();

  const [showDetails, setShowDetails] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Auto-hide indicator after 5 seconds when online
  useEffect(() => {
    if (isOnline) {
      const timer = setTimeout(() => {
        setShowDetails(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  // Handle sync button click
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncActions();
      setLastSyncTime(Date.now());
      console.log("✅ Manual sync completed");
    } catch (error) {
      console.error("❌ Manual sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Get connection status color
  const getStatusColor = () => {
    if (!isOnline) return "text-red-400";
    if (isSlow) return "text-yellow-400";
    if (isGood) return "text-green-400";
    return "text-blue-400";
  };

  // Get connection status icon
  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff size={16} />;
    if (isSlow) return <AlertTriangle size={16} />;
    return <Wifi size={16} />;
  };

  // Get connection status text
  const getStatusText = () => {
    if (!isOnline) return "Offline";
    if (isSlow) return "Slow Connection";
    return "Online";
  };

  // Get connection type display
  const getConnectionTypeDisplay = () => {
    if (!isOnline) return "No Connection";
    if (connectionType === "unknown") return "Unknown";
    return connectionType.toUpperCase();
  };

  return (
    <>
      {/* Main Status Indicator */}
      <div
        className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
          isOnline && !isSlow ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg cursor-pointer transition-all duration-200 ${
            isOnline
              ? isSlow
                ? "bg-yellow-500/20 border border-yellow-500/30"
                : "bg-blue-500/20 border border-blue-500/30"
              : "bg-red-500/20 border border-red-500/30"
          }`}
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className={getStatusColor()}>{getStatusIcon()}</div>
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          {!isOnline && (
            <span className="text-xs text-red-300">
              {formattedOfflineDuration}
            </span>
          )}
        </div>
      </div>

      {/* Detailed Status Panel */}
      {showDetails && (
        <div className="fixed top-16 right-4 z-50 bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-xl min-w-80">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Connection Status
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-slate-400 hover:text-white transition-colors duration-200"
              >
                ×
              </button>
            </div>

            {/* Status Details */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Status:</span>
                <div className={`flex items-center gap-2 ${getStatusColor()}`}>
                  {getStatusIcon()}
                  <span className="text-sm font-medium">{getStatusText()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Connection Type:</span>
                <span className="text-sm text-white">
                  {getConnectionTypeDisplay()}
                </span>
              </div>

              {!isOnline && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">
                    Offline Duration:
                  </span>
                  <div className="flex items-center gap-1 text-sm text-red-400">
                    <Clock size={14} />
                    <span>{formattedOfflineDuration}</span>
                  </div>
                </div>
              )}

              {lastSyncTime && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Last Sync:</span>
                  <div className="flex items-center gap-1 text-sm text-green-400">
                    <CheckCircle size={14} />
                    <span>{new Date(lastSyncTime).toLocaleTimeString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-slate-700">
              <button
                onClick={handleSync}
                disabled={!isOnline || isSyncing}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isOnline && !isSyncing
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-600 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isSyncing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw size={14} />
                    Sync Now
                  </>
                )}
              </button>

              {!isOnline && (
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-3 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors duration-200"
                >
                  Retry
                </button>
              )}
            </div>

            {/* Offline Information */}
            {!isOnline && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    size={16}
                    className="text-amber-400 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-amber-400 mb-1">
                      Offline Mode
                    </h4>
                    <p className="text-xs text-amber-200">
                      Some features may be limited. Your actions will be synced
                      when you're back online.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Slow Connection Information */}
            {isOnline && isSlow && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    size={16}
                    className="text-yellow-400 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-400 mb-1">
                      Slow Connection
                    </h4>
                    <p className="text-xs text-yellow-200">
                      Your connection is slow. Some features may take longer to
                      load.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default OfflineIndicator;
