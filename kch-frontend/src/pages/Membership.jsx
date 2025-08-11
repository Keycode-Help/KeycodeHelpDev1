import React from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/MembershipPage.css";
import features from "../components/SubscriptionPage/features";
import memberships from "../components/SubscriptionPage/memberships";
import faqitems from "../components/SubscriptionPage/FAQItems";
import { MembershipCard } from "../components/SubscriptionPage/MembershipCard";
import { FAQSection } from "../components/SubscriptionPage/FAQSection";
import { MoveRight, KeyRound } from "lucide-react";

function MembershipPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleAddSubscription = (tier) => {
    // Mapping subscription tiers to match the backend names.
    const subscriptionMapping = {
      "Trial": "BASE",
      "Professional": "PREMIUM",
    };
    
    // Make sure the old subscription page still work. Remove "|| tier" if it's not needed.
    const subscriptionType = subscriptionMapping[tier] || tier;
    const subscription = {
      tier: subscriptionType,
    };

    axios
      .post("http://localhost:8080/cart/addSubscription", subscription, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert(`${tier} Subscription added to your cart successfully.`);
        navigate("/cart");
      })
      .catch((error) => {
        console.error("Error adding subscription:", error);
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data === "User already has an active subscription."
        ) {
          alert(
            "This account already has a subscription associated with it. Only one subscription per account."
          );
        } else {
          alert("Failed to add subscription. Please try again.");
        }
      });
  };

  return (
    <div className="bg-black">
      {/* Missing css styling and unclear, ask Antthony about RegionNotice */}
      {/* <RegionNotice /> */}

      {/* Main Page -- Subscription Page */}
      <div className="min-h-screen w-screen pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
          {/* Hero Section */}
          <section className="subscription-hero-section">
            {/* Tiny header on top. */}
            <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur-md font-semibold">
              <KeyRound className="h-4 w-4 mr-2" />
              <span className="text-white">KeyCode&apos;s Pricing</span>
            </div>
            <h1 className="text-white text-center text-4xl font-bold sm:text-5xl md:text-6xl tracking-tight">
              Drive Your Success Forward
              <div className="mt-2 text-blue-400">With KeyCode Help</div>
            </h1>
            <p className="text-base md:text-lg text-white/40">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
              quae dolore illo quia, labore a non voluptatibus cum eveniet
              aliquid obcaecati hic?
            </p>
            <div className="subscription-hero-button">
              <a
                href="#membership-tiers"
                className="py-2.5 px-12 rounded-3xl font-bold border-0 focus:outline-none focus:ring-0 inline-flex items-center text-blue-500 bg-white hover:bg-green-500 hover:text-white transition duration-100"
              >
                Membership Plans
                <MoveRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </section>

          {/* Key Features */}
          <section className="subscription-key-features">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-white">
                Unlock Your Automotive Potential with KeyCode Help
              </h2>
              <p className="mt-4 text-lg text-white/50">
                Our platform provides accessibility to key codes, up to 24/7
                customer supports, comprehensive Keycode database, and many
                more.
              </p>
            </div>
            <div className="subscription-features-grid">
              {features.map((feature) => (
                <div key={feature.title} className="sub-features-content">
                  <div
                    className={`flex items-center justify-center w-16 h-16 rounded-full ${feature.backgroundColor} mx-auto mb-6`}
                  >
                    {/* Might consider replacing this with suitable icon. */}
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="object-contain w-full h-full rounded-full"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="mb-4 text-lg md:text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Membership Plans */}
          <section
            id="membership-tiers"
            className="subscription-membership-tiers py-12"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-white">
                Membership Plans
              </h2>
              <p className="mt-4 text-lg text-white/50">
                Choose the plan that best fits your needs. All plans include
                access to our core features and expert support.
              </p>
            </div>
            <div className="subscription-membership-grid">
              {memberships.map((tier) => (
                // Membership Card, tier is the object identified with id.
                <MembershipCard
                  key={tier.id}
                  tier={tier}
                  onSubscribe={() => handleAddSubscription(tier.id)}
                />
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="subscription-faq-section py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-white">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-white/50">
                Have a question? Check out our FAQ section to learn more about
                KeyCode Help.
              </p>
            </div>
            <div className="subscription-faq-questions">
              {faqitems.map((faqitem) => (
                <FAQSection key={faqitem.id} faqitems={faqitem} />
              ))}
            </div>
            <div className="mt-16 text-center">
              <p className="text-white font-bold text-lg">
                Still have questions? Contact us!
              </p>
              <button className="mt-4 py-2.5 px-10 rounded-3xl font-bold border-0 focus:outline-none focus:ring-0 bg-white text-black hover:bg-green-500 hover:text-white transition duration-100">
                Contact Support
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default MembershipPage;
