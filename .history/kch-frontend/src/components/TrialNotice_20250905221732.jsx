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
    <div
      className="bg-gradient-to-br from-success/10 to-success/20 border border-success/20 rounded-2xl p-6 backdrop-blur-sm shadow-xl relative overflow-hidden"
      style={{ marginTop: 12 }}
    >
      <div className="p-4 text-success">
        <div className="flex items-center gap-2">
          <Icon name="timer" size={16} className="text-success" />
          <span className="font-semibold">Premium Trial Active</span>
        </div>
        <div className="mt-1 text-sm">
          Ends {end.toLocaleDateString()} at {end.toLocaleTimeString()} (
          {timeDisplay})
        </div>
      </div>
    </div>
  );
}
