import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "./IconProvider";
import api from "../services/request";
import { useAuth } from "../context/AuthContext";

export default function TrialBanner() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const startTrial = async () => {
    try {
      await api.post("/cart/addSubscription", { tier: "BASIC", trial: true });
      navigate("/cart");
    } catch (e) {
      // Fallback to membership page if not authenticated or endpoint fails
      navigate("/membership?trial=start");
    }
  };

  return (
    <div className="bento-container bg-slate/20 border-success/20 glass-card glare-overlay">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-success text-dark px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Icon name="timer" size={16} />
              Limited Time
            </span>
            <h3 className="text-xl font-bold">3-Day Premium Trial</h3>
          </div>
          <p className="text-white/80">
            Experience premium benefits with no commitment
          </p>
          <ul className="space-y-1 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Icon name="dollarSign" size={16} className="text-success" />
              20% off regular key code pricing
            </li>
            <li className="flex items-center gap-2">
              <Icon name="shield" size={16} className="text-success" />
              Access to programming guides & tech support
            </li>
            <li className="flex items-center gap-2">
              <Icon name="clock" size={16} className="text-success" />
              Extended support hours
            </li>
            <li className="flex items-center gap-2">
              <Icon name="badgeCheck" size={16} className="text-success" />
              Priority request handling
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-center gap-4">
          <button onClick={startTrial} className="btn btn-lg btn-primary">
            Start Premium Trial
            <Icon name="chevronRight" size={20} />
          </button>
          <Link
            to="/trial-details"
            className="text-success hover:text-success-light underline text-sm flex items-center gap-1"
          >
            <Icon name="helpCircle" size={16} />
            View Full Benefits
          </Link>
        </div>
      </div>
    </div>
  );
}
