import React from "react";
import { Icon } from "./IconProvider";
import { useTrialStatus } from "../hooks/useTrialStatus";

export default function TrialNotice() {
  const { trialStatus, shouldShowTrialNotice } = useTrialStatus();

  // Don't show if user shouldn't see trial notice
  if (!shouldShowTrialNotice()) {
    return null;
  }

  const { remainingDays, trialEndsAt } = trialStatus;
  const end = new Date(trialEndsAt);
  
  // Calculate time remaining
  const now = new Date();
  const msLeft = end - now;
  const hoursLeft = Math.ceil(msLeft / (1000 * 60 * 60));
  
  // Format remaining time
  let timeDisplay = "";
  if (remainingDays > 0) {
    timeDisplay = `${remainingDays} day${remainingDays !== 1 ? "s" : ""} left`;
  } else if (hoursLeft > 0) {
    timeDisplay = `${hoursLeft} hour${hoursLeft !== 1 ? "s" : ""} left`;
  } else {
    timeDisplay = "Less than 1 hour left";
  }

  return (
    <div className="bento-container bg-success/10 border-success/20 glass-card glare-overlay" style={{ marginTop: 12 }}>
      <div className="p-4 text-success">
        <div className="flex items-center gap-2">
          <Icon name="timer" size={16} className="text-success" />
          <span className="font-semibold">Premium Trial Active</span>
        </div>
        <div className="mt-1 text-sm">
          Ends {end.toLocaleDateString()} at {end.toLocaleTimeString()} ({timeDisplay})
        </div>
      </div>
    </div>
  );
}
