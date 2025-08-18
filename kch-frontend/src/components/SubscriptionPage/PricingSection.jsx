/* eslint-disable react/prop-types */
export function PricingSection({ tier }) {
  const getPriceDisplay = (tier) => {
    // Handle both old pricing array format and new direct properties
    if (tier.pricing && tier.pricing.length > 0) {
      return tier.pricing[0].amount;
    }
    return tier.price || 0;
  };

  const getPeriodDisplay = (tier) => {
    // Handle both old pricing array format and new direct properties
    if (tier.pricing && tier.pricing.length > 0) {
      return tier.pricing[0].period;
    }
    return tier.period || 'month';
  };

  return (
    <div className="mt-4">
      <div className="flex items-baseline">
        <span className="text-4xl font-bold">${getPriceDisplay(tier)}</span>
        <span className="text-gray-400 ml-1">/{getPeriodDisplay(tier)}</span>
      </div>

      {tier.id === "Ultimate" && tier.pricing && tier.pricing.length > 1 && (
        <p className="mt-1 text-sm text-gray-400">
          One-Time Setup Fee: ${tier.pricing[1].setupFee}
        </p>
      )}
    </div>
  );
}
