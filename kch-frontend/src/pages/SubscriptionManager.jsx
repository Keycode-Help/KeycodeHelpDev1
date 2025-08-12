import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MembershipCard } from "../components/SubscriptionPage/MembershipCard";
import { FAQSection } from "../components/SubscriptionPage/FAQSection";
import { FeaturesList } from "../components/SubscriptionPage/FeaturesList";
import { PricingSection } from "../components/SubscriptionPage/PricingSection";

export default function SubscriptionManager() {
  const { user, isAuthenticated } = useAuth();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Mock data - in real app, this would come from API
  const availablePlans = [
    {
      id: 1,
      title: "Basic",
      price: 9.99,
      period: "month",
      description: "Essential keycode services for individual users",
      features: ["5 keycode requests/month", "Basic VIN lookup", "Email support"],
      perks: ["Standard response time", "Basic documentation"]
    },
    {
      id: 2,
      title: "Professional",
      price: 24.99,
      period: "month",
      description: "Advanced features for professionals and small businesses",
      features: ["25 keycode requests/month", "Advanced VIN lookup", "Priority support", "Bulk processing"],
      perks: ["Faster response time", "Detailed reports", "API access"]
    },
    {
      id: 3,
      title: "Enterprise",
      price: 99.99,
      period: "month",
      description: "Full-featured solution for large organizations",
      features: ["Unlimited keycode requests", "Premium VIN lookup", "24/7 support", "Custom integrations"],
      perks: ["Fastest response time", "Dedicated account manager", "Custom solutions"]
    }
  ];

  const handleSubscribe = (plan) => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }
    
    // TODO: Implement subscription logic
    console.log('Subscribing to plan:', plan);
    setCurrentPlan(plan);
    setShowUpgrade(false);
  };

  const handleUpgrade = () => {
    setShowUpgrade(true);
  };

  const handleCancel = () => {
    // TODO: Implement cancellation logic
    console.log('Cancelling subscription');
    setCurrentPlan(null);
  };

  // If user has no active plan -> show available plans & start trial
  if (!currentPlan) {
    return (
      <div className="container mx-auto p-6 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get started with our keycode services. Choose the plan that fits your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {availablePlans.map((plan) => (
            <MembershipCard
              key={plan.id}
              tier={plan}
              onSubscribe={() => handleSubscribe(plan)}
            />
          ))}
        </div>

        <FAQSection />
      </div>
    );
  }

  // If user has plan -> show current plan, upgrade/downgrade, cancel
  return (
    <div className="container mx-auto p-6 pt-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Your Subscription
        </h1>
        <p className="text-xl text-gray-300">
          Manage your current plan and explore options.
        </p>
      </div>

      {/* Current Plan Display */}
      <div className="bg-black border border-white/20 rounded-3xl p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{currentPlan.title} Plan</h2>
            <p className="text-gray-300">${currentPlan.price}/{currentPlan.period}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleUpgrade}
              className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Upgrade
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Current Features</h3>
            <FeaturesList features={currentPlan.features} perks={currentPlan.perks} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Usage This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Keycode Requests:</span>
                <span className="text-white">12 / 25</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '48%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      {showUpgrade && (
        <div className="bg-black border border-white/20 rounded-3xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Upgrade Options</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {availablePlans
              .filter(plan => plan.id > currentPlan.id)
              .map((plan) => (
                <MembershipCard
                  key={plan.id}
                  tier={plan}
                  onSubscribe={() => handleSubscribe(plan)}
                />
              ))}
          </div>
        </div>
      )}

      <FAQSection />
    </div>
  );
}
