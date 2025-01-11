/* eslint-disable react/prop-types */
export function PricingSection({ tier }) {
  const getPriceDisplay = (tier) => {
    return tier.pricing[0].amount;
  };

  const getPeriodDisplay = (tier) => {
    return tier.pricing[0].period;
  };

  return (
    <div className="mt-4">
      <div className="flex items-baseline">
        <span className="text-4xl font-bold">${getPriceDisplay(tier)}</span>
        <span className="text-gray-400 ml-1">/{getPeriodDisplay(tier)}</span>
      </div>

      {tier.id === "Ultimate" && (
        <p className="mt-1 text-sm text-gray-400">
          One-Time Setup Fee: ${tier.pricing[1].setupFee}
        </p>
      )}
    </div>
  );
}
