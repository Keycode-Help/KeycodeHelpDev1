import React from "react";
import { FeaturesList } from "./FeaturesList";
import { PricingSection } from "./PricingSection";

/* eslint-disable react/prop-types */
export function MembershipCard({ tier, onSubscribe }) {
  return (
    <div
      className={`rounded-3xl overflow-hidden bg-black hover:border-yellow-500 border-2 border-white/[0.12] transition duration-300 ease-in-out`}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white">{tier.title}</h2>
        <PricingSection tier={tier} />
        <p className="mt-4 text-base text-gray-400">{tier.description}</p>

        <button
          onClick={onSubscribe}
          // focus:outline-none focus:ring-0
          className={`w-full rounded-3xl mt-8 font-bold border-0 bg-white text-black hover:bg-yellow-500 hover:text-black transition duration-100`}
        >
          Get Started
        </button>

        <FeaturesList features={tier.features} perks={tier.perks} />
      </div>
    </div>
  );
}
