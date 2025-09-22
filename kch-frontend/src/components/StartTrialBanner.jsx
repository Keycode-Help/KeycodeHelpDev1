import React, { useState } from "react";
import { Crown, X } from "lucide-react";
import { useTrialStatus } from "../hooks/useTrialStatus";
import { useAuth } from "../context/AuthContext";

const StartTrialBanner = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { isAuthenticated, isInitialized } = useAuth();
  const { shouldShowTrialBanner, startTrial, isLoading } = useTrialStatus();

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleStartTrial = async () => {
    try {
      await startTrial("BASIC");
    } catch (error) {
      console.error("Failed to start trial:", error);
    }
  };

  // Only show if auth is initialized, user is authenticated, should see banner, and banner is visible
  if (
    !isInitialized ||
    !isAuthenticated ||
    !isVisible ||
    !shouldShowTrialBanner()
  )
    return null;

  return (
    <div className="bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-3 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="h-5 w-5 text-yellow-300" />
          <div>
            <p className="font-semibold text-sm">
              🚀 Start Your 3-Day Premium Trial!
            </p>
            <p className="text-white/80 text-xs">
              Get full access to all features and member pricing
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleStartTrial}
            disabled={isLoading}
            className="bg-white text-primary px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Starting..." : "Start Trial"}
          </button>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white transition-colors duration-200 p-1"
            aria-label="Dismiss trial banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartTrialBanner;
