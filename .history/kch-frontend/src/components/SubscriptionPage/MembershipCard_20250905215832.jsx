import React from "react";
import { FeaturesList } from "./FeaturesList";

/* eslint-disable react/prop-types */
export function MembershipCard({ tier, onSubscribe, billingCycle }) {
  const getPrice = () => {
    if (tier.isTrial) return 0;
    if (tier.title === "Basic") return tier.monthlyPrice;
    return billingCycle === "monthly" ? tier.monthlyPrice : tier.annualPrice;
  };

  const getPeriod = () => {
    if (tier.isTrial) return "3 days";
    if (tier.title === "Basic") return "month";
    return billingCycle === "monthly" ? "month" : "year";
  };

  const getSetupFee = () => {
    if (tier.isTrial || tier.title === "Basic" || billingCycle === "monthly")
      return null;
    return 49; // $49 setup fee for annual plans
  };

  return (
    <div
      className={`rounded-3xl overflow-hidden bg-black hover:border-yellow-500 border-2 border-white/[0.12] transition duration-300 ease-in-out`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{tier.title}</h2>
          <span className="text-yellow-500 font-bold text-lg">
            {tier.discount}
          </span>
        </div>

        <div className="mb-4">
          <span className="text-3xl font-bold text-white">${getPrice()}</span>
          <span className="text-gray-600 text-lg">/{getPeriod()}</span>
          {getSetupFee() && (
            <div className="text-sm text-green-400 mt-1">
              + ${getSetupFee()} setup fee
            </div>
          )}
        </div>

        <p className="mt-4 text-base text-gray-600 mb-6">{tier.description}</p>

        <button
          onClick={onSubscribe}
          className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl hover:from-primary-dark hover:to-primary hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-4"
        >
          Get Started
        </button>

        <FeaturesList features={tier.features} perks={tier.perks} />
      </div>
    </div>
  );
}
