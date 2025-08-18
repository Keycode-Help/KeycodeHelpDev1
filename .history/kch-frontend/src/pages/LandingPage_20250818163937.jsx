import React from "react";
import { Link } from "react-router-dom";
import RegionBanner from "../components/RegionBanner";
import SignUpSteps from "../components/SignUpSteps";
import TrialBanner from "../components/TrialBanner";
import { Icon } from "../components/IconProvider";
import "../styles/lp.css";
import "../styles/lp.css";

export default function LandingPage() {
  return (
    <div className="bg-dark text-white min-h-screen">
      <RegionBanner />

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
            <Link to="/vehicle-keycode-request" className="btn-cta whitespace-nowrap flex items-center gap-2">
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
              <Link to="/vehicle-keycode-request" className="btn-cta animate-pulse flex items-center gap-2">
                <Icon name="zap" size={20} />
                Get Key Code Now
              </Link>
              <Link to="/membership" className="btn-primary flex items-center gap-2">
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
            <Link to="/vehicle-keycode-request" className="btn-cta w-full flex items-center gap-2 justify-center">
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
            <Link to="/membership" className="btn-primary w-full flex items-center gap-2 justify-center">
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
            <Link to="/support" className="btn-primary w-full flex items-center gap-2 justify-center">
              <Icon name="headphones" size={20} />
              Contact Support
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
          &copy; 2024 KeyCode Help. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
