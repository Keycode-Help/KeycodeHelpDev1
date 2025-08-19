import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

/* eslint-disable react/prop-types */
export function FAQSection({ faqData }) {
  // Default FAQ data if none provided
  const defaultFAQData = [
    {
      question: "How does the keycode service work?",
      answer: "Our keycode service provides secure access to vehicle keycodes through VIN lookup and verification processes."
    }
  ];

  const faqs = faqData || defaultFAQData;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <FAQItem key={index} faq={faq} />
      ))}
    </div>
  );
}

function FAQItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/[0.12] rounded-3xl transition-all duration-300">
      <button
        className="flex items-center justify-between w-full px-6 py-4 rounded-3xl bg-black border-0 focus:outline-none focus:ring-0 hover:bg-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg text-white font-semibold">
          {faq.question}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-white transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {/* Subtle animation would be good here. Dropdown drop down smoother and text slides in. */}
      <div className={`overflow-hidden transition-all duration-300 bg-zinc-950 ${
        isOpen ? "rounded-b-3xl max-h-auto p-6" : "max-h-0"}`}>
          <p className="text-white text-lg">{faq.answer}</p>
      </div>
    </div>
  );
}
