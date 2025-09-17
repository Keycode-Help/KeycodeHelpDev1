import React, { useState } from "react";
import {
  FileText,
  CreditCard,
  Key,
  Zap,
  ClipboardList,
  KeyRound,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function SignUpSteps() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: "1",
      title: "Enter VIN",
      desc: "Input your vehicle's VIN number",
      icon: ClipboardList,
      details:
        "Simply enter your 17-digit Vehicle Identification Number. We'll verify and process it instantly.",
      color: "primary",
    },
    {
      step: "2",
      title: "Pay Securely",
      desc: "Simple one-time payment process",
      icon: CreditCard,
      details:
        "Choose your preferred payment method. All transactions are secure and encrypted.",
      color: "success",
    },
    {
      step: "3",
      title: "Get Code",
      desc: "Receive your key code in 5-30 minutes",
      icon: KeyRound,
      details:
        "Your key code will be delivered to your account and email. Most codes arrive within 5 minutes.",
      color: "cta",
    },
  ];

  // Helper function to render icon
  const renderIcon = (IconComponent, index, isActive) => {
    return (
      <IconComponent
        size={28}
        strokeWidth={2.5}
        className={`transition-colors duration-300 ${
          isActive ? "text-white" : "text-white/60"
        }`}
        aria-hidden="true"
      />
    );
  };

  return (
    <section className="space-y-16 py-16">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          How It Works
        </h2>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Get your keycode in just three simple steps
        </p>
      </div>

      {/* Steps Timeline Container */}
      <div className="relative py-12">
        {/* Progress Bar */}
        <div className="absolute top-[4.5rem] left-0 w-full h-2 bg-secondary/30 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-500 shadow-lg"
            style={{ width: `${(activeStep + 1) * 33.33}%` }}
          />
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="relative"
              onMouseEnter={() => setActiveStep(index)}
            >
              {/* Icon Circle */}
              <div
                className={`w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center
                                          transition-all duration-300 transform hover:scale-110 shadow-lg
                                          ${
                                            index <= activeStep
                                              ? `bg-gradient-to-br from-${item.color} to-${item.color}-dark shadow-${item.color}/50`
                                              : `bg-gradient-to-br from-secondary/20 to-dark/20 border-2 border-${item.color}/30`
                                          }`}
              >
                {renderIcon(item.icon, index, index <= activeStep)}
              </div>

              {/* Content Box */}
              <div
                className={`text-center space-y-4 transition-all duration-300
                                     ${
                                       index === activeStep
                                         ? "opacity-100 scale-105"
                                         : "opacity-70"
                                     }`}
              >
                {/* Step Number */}
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300 ${
                  index <= activeStep 
                    ? `bg-${item.color} text-white shadow-lg` 
                    : `bg-secondary/30 text-white/60`
                }`}>
                  {item.step}
                </div>
                
                <h3 className={`text-xl font-semibold transition-colors duration-300 ${
                  index <= activeStep ? "text-white" : "text-white/80"
                }`}>{item.title}</h3>
                <p className="text-white/70 text-sm">{item.desc}</p>

                {/* Expanded Details */}
                <div
                  className={`transition-all duration-300 overflow-hidden
                                              ${
                                                index === activeStep
                                                  ? "max-h-32 opacity-100"
                                                  : "max-h-0 opacity-0"
                                              }`}
                >
                  <div className="bg-gradient-to-br from-secondary/10 to-dark/10 rounded-xl p-4 border border-secondary/20">
                    <p className="text-sm text-white/80 leading-relaxed">{item.details}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Join thousands of locksmiths who trust KeycodeHelp for accurate, fast keycode delivery.
          </p>
          <Link
            to="/vehicle-keycode-request"
            className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold text-lg rounded-xl hover:from-accent hover:to-primary hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/50 focus:ring-offset-2"
          >
            <Zap size={24} />
            Start Your Request
          </Link>
        </div>
      </div>
    </section>
  );
}
