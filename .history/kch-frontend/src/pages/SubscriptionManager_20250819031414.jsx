import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MembershipCard } from "../components/SubscriptionPage/MembershipCard";
import { FAQSection } from "../components/SubscriptionPage/FAQSection";
import { FeaturesList } from "../components/SubscriptionPage/FeaturesList";
import { useNavigate } from "react-router-dom";
import api from "../services/request";

export default function SubscriptionManager() {
  const { isAuthenticated } = useAuth();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const navigate = useNavigate();

  // Mock data - in real app, this would come from API
  const availablePlans = [
    {
      id: 0,
      title: "Trial",
      price: 0,
      period: "3 days",
      discount: "FREE",
      description: "Try premium features free for 3 days — no commitment",
      isTrial: true,
      features: [
        { text: "Priority processing (30m - 1h)" },
        { text: "Premium keycode database access" },
        { text: "Phone & live chat support" },
        { text: "Expanded vehicle coverage" },
      ],
      perks: [
        { text: "Advanced search & filtering" },
        { text: "Broader VIN support" },
      ],
    },
    {
      id: 1,
      title: "Basic",
      price: 9.99,
      period: "month",
      discount: "15%",
      description: "Essential keycode services for individual locksmiths",
      features: [
        { text: "15% off 1 keycode order per month" },
        { text: "Limited vehicle access (Ford, Nissan, Chevy only)" },
        { text: "Basic customer support (24-48h)" },
        { text: "Basic search functionality" },
        { text: "Standard processing time (3-24 hours)" },
      ],
      perks: [
        { text: "Monthly usage reports" },
        { text: "Basic training resources" },
        { text: "Email support" },
      ],
    },
    {
      id: 2,
      title: "Professional",
      price: 24.99,
      period: "month",
      discount: "20%",
      description:
        "Advanced features for professional locksmiths and small businesses",
      features: [
        { text: "20% off all keycode purchases" },
        { text: "Premium keycode database access" },
        { text: "Priority customer support (4-8h)" },
        { text: "Advanced search and filtering" },
        { text: "Bulk keycode ordering (up to 20 codes)" },
        { text: "Extended vehicle coverage" },
        { text: "Priority processing (30min - 1 hour)" },
      ],
      perks: [
        { text: "Real-time keycode availability" },
        { text: "Advanced search by make/model/year" },
        { text: "Phone & chat support" },
        { text: "Priority keycode processing" },
        { text: "Extended vehicle database coverage" },
      ],
    },
    {
      id: 3,
      title: "Enterprise",
      price: 99.99,
      period: "month",
      discount: "25%",
      description: "Full-featured solution for large locksmith organizations",
      features: [
        { text: "25% off all keycode purchases" },
        { text: "Complete keycode database access" },
        { text: "24/7 premium customer support" },
        { text: "Advanced search and filtering" },
        { text: "Unlimited bulk ordering" },
        { text: "All vehicle makes & models" },
        { text: "Instant processing (15-30 minutes)" },
        { text: "Multi-location management" },
      ],
      perks: [
        { text: "Dedicated locksmith support team" },
        { text: "Advanced keycode analytics & reporting" },
        { text: "Priority emergency keycode requests" },
        { text: "Custom keycode training programs" },
        { text: "Volume keycode pricing discounts" },
        { text: "Exclusive vehicle database access" },
      ],
    },
  ];

  // FAQ data
  const faqData = [
    {
      question: "How does the keycode service work?",
      answer:
        "Our keycode service provides secure access to vehicle keycodes through VIN lookup and verification processes.",
    },
    {
      question: "What is included in each plan?",
      answer:
        "Each plan includes different levels of keycode requests, support options, and additional features as outlined above.",
    },
    {
      question: "Can I change my plan?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
    },
  ];

  const handleSubscribe = async (plan) => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = "/login";
      return;
    }

    // Trial plan starts a 3-day trial flow via backend
    if (plan?.isTrial) {
      try {
        await api.post("/cart/addSubscription", { tier: "BASIC", trial: true });
        navigate("/cart");
        return;
      } catch (e) {
        // Fallback to trial explainer page
        navigate("/membership?trial=start");
        return;
      }
    }

    // TODO: Implement paid subscription logic
    console.log("Subscribing to plan:", plan);
    setCurrentPlan(plan);
    setShowUpgrade(false);
  };

  const handleUpgrade = () => {
    setShowUpgrade(true);
  };

  const handleCancel = () => {
    // TODO: Implement cancellation logic
    console.log("Cancelling subscription");
    setCurrentPlan(null);
  };

  const url = new URL(window.location.href);
  const isTrialMode =
    url.pathname === "/membership" && url.searchParams.get("trial") === "start";
  const trialPlan = availablePlans.find((p) => p.isTrial);

  // If user has no active plan -> show available plans or trial breakdown
  if (!currentPlan) {
    return (
      <div className="container mx-auto p-6 pt-20">
        {isTrialMode ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">
                Start Your 3-Day Premium Trial
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Enjoy full access to premium features for 3 days. No commitment.
                Experience faster processing, expanded database access, and
                priority support.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
                <h3 className="text-white font-semibold mb-2">
                  What’s included
                </h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1 text-sm">
                  <li>Priority processing (30m - 1h)</li>
                  <li>Premium keycode database access</li>
                  <li>Phone & live chat support</li>
                  <li>Expanded vehicle coverage</li>
                  <li>Advanced search & filtering</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
                <h3 className="text-white font-semibold mb-2">
                  How trial works
                </h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1 text-sm">
                  <li>Trial activates immediately and lasts 3 days</li>
                  <li>No auto-charge during the trial</li>
                  <li>Your access ends automatically unless you upgrade</li>
                  <li>You can upgrade anytime to keep premium access</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
                <h3 className="text-white font-semibold mb-2">Value you get</h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1 text-sm">
                  <li>Faster order completion times</li>
                  <li>Broader VIN support</li>
                  <li>Dedicated support priority</li>
                  <li>Higher success rate for complex vehicles</li>
                </ul>
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={() => handleSubscribe(trialPlan)}
                className="px-8 py-3 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
              >
                Activate Trial Now
              </button>
              <p className="text-gray-400 text-sm mt-3">
                After 3 days, pick a plan to continue premium access. No charge
                during trial.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">
                Choose Your Plan
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Get started with our keycode services. Choose the plan that fits
                your needs.
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

            <FAQSection faqData={faqData} />
          </>
        )}
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
            <h2 className="text-2xl font-bold text-white">
              {currentPlan.title} Plan
            </h2>
            <p className="text-gray-300">
              ${currentPlan.price}/{currentPlan.period}
            </p>
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
            <h3 className="text-lg font-semibold text-white mb-4">
              Current Features
            </h3>
            <FeaturesList
              features={currentPlan.features}
              perks={currentPlan.perks}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Usage This Month
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Keycode Requests:</span>
                <span className="text-white">12 / 25</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: "48%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      {showUpgrade && (
        <div className="bg-black border border-white/20 rounded-3xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">
            Upgrade Options
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {availablePlans
              .filter((plan) => plan.id > currentPlan.id)
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

      <FAQSection faqData={faqData} />
    </div>
  );
}
