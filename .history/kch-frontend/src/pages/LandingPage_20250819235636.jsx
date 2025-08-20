import React from "react";
import { Link } from "react-router-dom";
import RegionBanner from "../components/RegionBanner";
import TrialNotice from "../components/TrialNotice";
import api from "../services/request";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import SignUpSteps from "../components/SignUpSteps";
import TrialBanner from "../components/TrialBanner";
import { Icon } from "../components/IconProvider";
import "../styles/lp.css";
import "../styles/lp.css";

export default function LandingPage() {
  const { token } = useAuth();
  const [trialEndsAt, setTrialEndsAt] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  
  useEffect(() => {
    if (!token) return;
    api
      .get("/keycode-user/subscription")
      .then((res) => {
        if (res.data?.trial && res.data?.trialEndsAt) {
          setTrialEndsAt(res.data.trialEndsAt);
        }
      })
      .catch(() => {});
  }, [token]);

  return (
    <div className="bg-dark text-white min-h-screen">
      <RegionBanner />
      <TrialNotice endsAt={trialEndsAt} />

      {/* Logo Section */}
      <div className="flex justify-center py-8">
        <img
          src="/assets/images/logos/Logodarktheme.png"
          alt="KeyCode Help Logo"
          className="h-16 md:h-20"
        />
      </div>

      {/* Main Content */}
      <main className="w-full px-4 md:px-8 py-12 space-y-16">
        {/* Quick Action Banner */}
        <div className="bento-container bg-primary/10 border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
            <p className="text-white/90 font-medium flex items-center gap-2">
              <Icon name="zap" size={20} className="text-cta" />
              Need a key code? Get it within 5-30 minutes. No membership
              required.
            </p>
            <Link
              to="/vehicle-keycode-request"
              className="btn btn-md btn-primary"
            >
              <Icon name="key" size={20} />
              Order Key Code
            </Link>
          </div>
        </div>

        {/* Hero Section with fixed video */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight flex items-center gap-3">
              <Icon name="key" size={48} className="text-cta" />
              KeyCodes On Demand
            </h1>
            <p className="text-xl text-white/80">
              Direct access. No membership required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/vehicle-keycode-request"
                className="btn btn-lg btn-primary"
              >
                <Icon name="zap" size={20} />
                Get Key Code Now
              </Link>
              <Link to="/membership" className="btn btn-lg btn-outline">
                <Icon name="userCheck" size={20} />
                View Membership Benefits
              </Link>
            </div>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-r from-dark/20 to-transparent"></div>

            <video
              className="w-full h-full object-cover"
              autoPlay={true}
              muted={true}
              playsInline={true}
              preload="auto"
              controls
              controlsList="nodownload noremoteplayback"
              onEnded={(e) => {
                e.target.currentTime = 0;
              }}
            >
              <source
                src="/assets/Videos/Unlock_Efficiency__Keycode_Help_for_Locksmiths-VEED.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </section>

        {/* Add Trial Banner after the Hero Section */}
        <TrialBanner />

        {/* Services Grid */}
        <section className="grid md:grid-cols-3 gap-8">
          {/* Quick Access Box */}
          <div className="bento-item">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-primary/20 rounded-lg">
                <Icon name="key" size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Pay Per Use</h3>
            </div>
            <p className="text-white/80 mb-6">
              Quick key code delivery within 5-30 minutes. No membership needed.
            </p>
            <Link
              to="/vehicle-keycode-request"
              className="btn btn-md btn-primary w-full sm:w-auto"
            >
              <Icon name="creditCard" size={20} />
              Order Now
            </Link>
          </div>

          {/* Premium Box */}
          <div className="bento-item">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-success/20 rounded-lg">
                <Icon name="userCheck" size={24} className="text-success" />
              </div>
              <h3 className="text-xl font-semibold">Premium Access</h3>
            </div>
            <p className="text-white/80 mb-6">
              Save on every order with premium benefits
            </p>
            <Link
              to="/membership"
              className="btn btn-md btn-primary w-full sm:w-auto"
            >
              <Icon name="zap" size={20} />
              Try Premium Free
            </Link>
          </div>

          {/* Support Box */}
          <div className="bento-item">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-cta/20 rounded-lg">
                <Icon name="headphones" size={24} className="text-cta" />
              </div>
              <h3 className="text-xl font-semibold">24/7 Support</h3>
            </div>
            <p className="text-white/80 mb-6">
              Technical assistance for all users
            </p>
            <Link
              to="/support"
              className="btn btn-md btn-primary w-full sm:w-auto"
            >
              <Icon name="headphones" size={20} />
              Contact Support
            </Link>
          </div>
        </section>

        {/* Subscription Pricing Section */}
        <section className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Choose Your Plan
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Start with a free trial, then choose the plan that fits your needs
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  billingCycle === 'annual'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Annual Billing
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Trial Plan */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 relative">
              <div className="absolute top-4 left-4 text-white font-semibold">Trial</div>
              <div className="absolute top-4 right-4 text-yellow-400 font-bold">FREE</div>
              <div className="text-3xl font-bold text-white mb-4 mt-8">$0<span className="text-lg text-white/60">/3 days</span></div>
              <p className="text-white/80 mb-6">Try premium features free for 3 days – no commitment</p>
              <ul className="text-left space-y-2 mb-6 text-white/80">
                <li>• Priority processing (30m - 1h)</li>
                <li>• Premium keycode database access</li>
                <li>• Phone & live chat support</li>
                <li>• Expanded vehicle coverage</li>
              </ul>
              <div className="text-left mb-4">
                <h4 className="text-white font-semibold mb-2">Additional Perks:</h4>
                <ul className="space-y-1 text-white/80 text-sm">
                  <li>• Advanced search & filtering</li>
                  <li>• Broader VIN support</li>
                </ul>
              </div>
              <Link to="/register" className="btn btn-md btn-primary w-full">
                Get Started
              </Link>
            </div>

            {/* Basic Plan */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 relative">
              <div className="absolute top-4 left-4 text-white font-semibold">Basic</div>
              <div className="absolute top-4 right-4 text-yellow-400 font-bold">15%</div>
              <div className="text-3xl font-bold text-primary mb-4 mt-8">
                {billingCycle === 'monthly' ? '$9.99' : '$99.99'}<span className="text-lg text-white/60">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </div>
              {billingCycle === 'annual' && (
                <div className="text-sm text-green-400 mb-2">+ $49 setup fee</div>
              )}
              <p className="text-white/80 mb-6">Essential keycode services for individual locksmiths</p>
              <ul className="text-left space-y-2 mb-6 text-white/80">
                <li>• 15% off 1 keycode order per month</li>
                <li>• Limited vehicle access (Ford, Nissan, Chevy only)</li>
                <li>• Basic customer support (24-48h)</li>
                <li>• Basic search functionality</li>
                <li>• Standard processing time (3-24 hours)</li>
              </ul>
              <div className="text-left mb-4">
                <h4 className="text-white font-semibold mb-2">Additional Perks:</h4>
                <ul className="space-y-1 text-white/80 text-sm">
                  <li>• Monthly usage reports</li>
                  <li>• Basic training resources</li>
                  <li>• Email support</li>
                </ul>
              </div>
              <Link to="/register" className="btn btn-md btn-primary w-full">
                Get Started
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="bg-primary/10 rounded-lg p-6 border border-primary/30 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="absolute top-4 left-4 text-white font-semibold">Professional</div>
              <div className="absolute top-4 right-4 text-yellow-400 font-bold">20%</div>
              <div className="text-3xl font-bold text-primary mb-4 mt-8">
                {billingCycle === 'monthly' ? '$24.99' : '$249.99'}<span className="text-lg text-white/60">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </div>
              {billingCycle === 'annual' && (
                <div className="text-sm text-green-400 mb-2">+ $49 setup fee</div>
              )}
              <p className="text-white/80 mb-6">Advanced features for professional locksmiths and small businesses</p>
              <ul className="text-left space-y-2 mb-6 text-white/80">
                <li>• 20% off all keycode purchases</li>
                <li>• Premium keycode database access</li>
                <li>• Priority customer support (4-8h)</li>
                <li>• Advanced search and filtering</li>
                <li>• Bulk keycode ordering (up to 20 codes)</li>
                <li>• Extended vehicle coverage</li>
                <li>• Priority processing (30min - 1 hour)</li>
              </ul>
              <div className="text-left mb-4">
                <h4 className="text-white font-semibold mb-2">Additional Perks:</h4>
                <ul className="space-y-1 text-white/80 text-sm">
                  <li>• Real-time keycode availability</li>
                  <li>• Advanced search by make/model/year</li>
                  <li>• Phone & chat support</li>
                  <li>• Priority keycode processing</li>
                  <li>• Extended vehicle database coverage</li>
                </ul>
              </div>
              <Link to="/register" className="btn btn-md btn-primary w-full">
                Get Started
              </Link>
            </div>
          </div>

          <div className="pt-4">
            <Link to="/membership" className="btn btn-lg btn-primary">
              <Icon name="userCheck" size={20} />
              View All Plans & Features
            </Link>
          </div>
        </section>

        {/* Process Steps */}
        <SignUpSteps />

        {/* Requirements Notice */}
        <div className="text-center text-white/60 space-y-2">
          <p>
            Service available to verified automotive professionals in US &
            Canada.
          </p>
          <Link
            to="/requirements"
            className="text-primary hover:text-success underline text-sm"
          >
            View Professional Requirements & Service Area Details
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-navy mt-16">
        <div className="w-full px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/60">
              &copy; 2025 KeyCode Help. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link
                to="/pricing"
                className="text-primary hover:text-success underline"
              >
                Keycode Pricing
              </Link>
              <Link
                to="/support"
                className="text-white/60 hover:text-white underline"
              >
                Support
              </Link>
              <Link
                to="/requirements"
                className="text-white/60 hover:text-white underline"
              >
                Requirements
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
