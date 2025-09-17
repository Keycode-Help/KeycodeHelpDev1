import { Check } from "lucide-react";

/* eslint-disable react/prop-types */
export function FeaturesList({ features, perks }) {
  return (
    <div className="mt-6">
      <ul className="text-sm text-white/80 space-y-4">
        {features.map((feature) => (
          <li key={feature.text} className="flex items-center gap-3">
            <Check className="h-5 w-5 flex-shrink-0 text-green-400" />
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>

      {/* Only if there is additional perks. */}
      {perks && (
        <div className="mt-6">
          <div className="border-t border-slate-600 py-4">
            <h3 className="text-lg font-bold text-white text-center">
              Additional Perks:
            </h3>
          </div>
          <ul className="text-sm text-white/80 space-y-4">
            {perks.map((perk) => (
              <li key={perk.text} className="flex items-center gap-3">
                <Check className="h-5 w-5 flex-shrink-0 text-green-400" />
                <span>{perk.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
