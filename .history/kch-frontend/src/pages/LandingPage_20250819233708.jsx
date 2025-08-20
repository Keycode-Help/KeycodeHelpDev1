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

        {/* Pricing Section */}
        <section className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include our comprehensive 
              vehicle database and expert support.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-2">Basic</h3>
              <div className="text-3xl font-bold text-primary mb-4">$29.99<span className="text-lg text-white/60">/month</span></div>
              <ul className="text-left space-y-2 mb-6 text-white/80">
                <li>• Up to 50 keycode requests</li>
                <li>• Basic vehicle database access</li>
                <li>• Email support</li>
                <li>• Standard response time</li>
              </ul>
              <Link to="/pricing" className="btn btn-md btn-outline w-full">
                View Details
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="bg-primary/10 rounded-lg p-6 border border-primary/30 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional</h3>
              <div className="text-3xl font-bold text-primary mb-4">$59.99<span className="text-lg text-white/60">/month</span></div>
              <ul className="text-left space-y-2 mb-6 text-white/80">
                <li>• Up to 200 keycode requests</li>
                <li>• Full vehicle database access</li>
                <li>• Priority email support</li>
                <li>• Faster response time</li>
                <li>• API access</li>
              </ul>
              <Link to="/pricing" className="btn btn-md btn-primary w-full">
                View Details
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="text-3xl font-bold text-primary mb-4">$149.99<span className="text-lg text-white/60">/month</span></div>
              <ul className="text-left space-y-2 mb-6 text-white/80">
                <li>• Unlimited keycode requests</li>
                <li>• Full vehicle database access</li>
                <li>• Priority phone & email support</li>
                <li>• Fastest response time</li>
                <li>• Dedicated account manager</li>
              </ul>
              <Link to="/pricing" className="btn btn-md btn-outline w-full">
                View Details
              </Link>
            </div>
          </div>

          <div className="pt-4">
            <Link to="/pricing" className="btn btn-lg btn-primary">
              <Icon name="creditCard" size={20} />
              View Full Pricing Details
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
        <div className="w-full px-4 md:px-8 py-6 text-center text-white/60">
          &copy; 2025 KeyCode Help. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
