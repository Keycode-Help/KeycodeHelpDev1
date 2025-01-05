import { Check } from "lucide-react";

/* eslint-disable react/prop-types */
export function FeaturesList({ features, perks }) {
  return (
    <div className="mt-6">
      <ul className="text-sm text-gray-400 space-y-4">
        {features.map((feature) => (
          <li key={feature.text} className="flex items-center gap-2">
            <Check className="h-6 w-6 flex-shrink-0 text-green-500" />
            {feature.text}
          </li>
        ))}
      </ul>

      {/* Only if there is additional perks. */}
      {perks && (
        <div className="mt-6">
          <div className="border-t border-gray-800 py-4">
            <h3 className="text-md font-bold text-white text-center">
              Additional Perks:
            </h3>
          </div>
          <ul className="text-sm text-gray-400 space-y-4">
            {perks.map((perk) => (
              <li key={perk.text} className="flex items-center gap-2">
                <Check className="h-6 w-6 flex-shrink-0 text-green-500" />
                {perk.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
