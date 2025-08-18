import React from "react";

export default function TrialNotice({ endsAt }) {
  if (!endsAt) return null;
  const end = new Date(endsAt);
  const now = new Date();
  const msLeft = end - now;
  if (msLeft <= 0) return null;
  const days = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
  return (
    <div className="bento-container bg-success/10 border-success/20" style={{ marginTop: 12 }}>
      <div className="p-4 text-success">
        Premium trial active. Ends {end.toLocaleString()} ({days} day{days !== 1 ? "s" : ""} left).
      </div>
    </div>
  );
}


