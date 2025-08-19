import React from "react";
import { FeaturesList } from "./FeaturesList";

/* eslint-disable react/prop-types */
export function MembershipCard({ tier, onSubscribe }) {
  return (
    <div
      className={`rounded-3xl overflow-hidden bg-black hover:border-yellow-500 border-2 border-white/[0.12] transition duration-300 ease-in-out`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{tier.title}</h2>
          <span className="text-yellow-500 font-bold text-lg">{tier.discount}</span>
        </div>
        
        <div className="mb-4">
          <span className="text-3xl font-bold text-white">${tier.price}</span>
          <span className="text-gray-400 text-lg">/{tier.period}</span>
        </div>
        
        <p className="mt-4 text-base text-gray-400 mb-6">{tier.description}</p>

        <button
          onClick={onSubscribe}
          className={`w-full btn btn-lg btn-primary mt-4`}
        >
          Get Started
        </button>

        <FeaturesList features={tier.features} perks={tier.perks} />
      </div>
    </div>
  );
}
