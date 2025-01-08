import React from "react";
import { FeaturesList } from "./FeaturesList";
import { PricingSection } from "./PricingSection";

/* eslint-disable react/prop-types */
export function MembershipCard({ tier, onSubscribe }) {
  return (
    <div
      className={`rounded-3xl overflow-hidden ${
        tier.id === "professional"
          ? "border-2 border-yellow-500 bg-black"
          : "border border-gray-800 bg-black"
      }`}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white">{tier.title}</h2>
        <PricingSection tier={tier} />
        <p className="mt-4 text-base text-gray-400">{tier.description}</p>

        <button
          onClick={onSubscribe}
          className={`w-full rounded-3xl mt-8 font-bold border-0 focus:outline-none focus:ring-0 ${
            tier.id === "professional"
              ? "bg-yellow-500 text-black hover:bg-yellow-500"
              : "bg-white text-black hover:bg-white"
          }`}
        >
          Get Started
        </button>

        <FeaturesList features={tier.features} perks={tier.perks} />
      </div>
    </div>
  );
}
