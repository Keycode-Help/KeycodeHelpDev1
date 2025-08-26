import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './IconProvider';
import { useTrialStatus } from '../hooks/useTrialStatus';

export default function TrialExpirationHandler() {
  const { trialStatus, isTrialExpired } = useTrialStatus();
  const [showExpirationNotice, setShowExpirationNotice] = useState(false);

  useEffect(() => {
    // Check if trial has expired
    if (trialStatus.hasTrial && isTrialExpired()) {
      setShowExpirationNotice(true);
    }
  }, [trialStatus, isTrialExpired]);

  if (!showExpirationNotice) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bento-container bg-warning/20 border-warning/30 glass-card glare-overlay">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Icon name="alertTriangle" size={20} className="text-warning" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-warning mb-2">
                Trial Expired
              </h4>
              <p className="text-sm text-white/80 mb-3">
                Your premium trial has ended. Upgrade to continue enjoying premium features and member pricing.
              </p>
              <div className="flex gap-2">
                <Link
                  to="/membership"
                  className="btn btn-sm btn-primary"
                >
                  <Icon name="crown" size={16} />
                  Upgrade Now
                </Link>
                <button
                  onClick={() => setShowExpirationNotice(false)}
                  className="btn btn-sm btn-outline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
