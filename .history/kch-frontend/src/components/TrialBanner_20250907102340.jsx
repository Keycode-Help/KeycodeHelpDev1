import React, { useState, useEffect } from "react";
import { Clock, X } from "lucide-react";
import { useTrialStatus } from "../hooks/useTrialStatus";
import { useAuth } from "../context/AuthContext";

const TrialBanner = ({ onDismiss }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const { isAuthenticated, isInitialized } = useAuth();
  const { trialStatus, shouldShowTrialNotice } = useTrialStatus();

  useEffect(() => {
    if (!trialStatus.trialEndsAt) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const trialEnd = new Date(trialStatus.trialEndsAt).getTime();
      const difference = trialEnd - now;

      if (difference <= 0) {
        setTimeLeft("Trial expired");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days} day${days !== 1 ? "s" : ""} remaining`);
      } else if (hours > 0) {
        setTimeLeft(`${hours} hour${hours !== 1 ? "s" : ""} remaining`);
      } else {
        setTimeLeft(`${minutes} minute${minutes !== 1 ? "s" : ""} remaining`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [trialStatus.trialEndsAt]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  // Only show if auth is initialized, user is authenticated, has an active trial, and banner is visible
  if (
    !isInitialized ||
    !isAuthenticated ||
    !isVisible ||
    !shouldShowTrialNotice()
  )
    return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-blue-100" />
          <div>
            <p className="font-semibold text-sm">🎉 You're on a 3-day trial!</p>
            <p className="text-blue-100 text-xs">
              {timeLeft} • Full access to all features
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-blue-100 hover:text-white transition-colors duration-200 p-1"
          aria-label="Dismiss trial banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TrialBanner;
