import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

/* eslint-disable react/prop-types */
export function FAQSection({ faqitems }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/[0.12] rounded-3xl transition-all duration-300">
      <button
        className="flex items-center justify-between w-full px-6 py-4 rounded-3xl bg-black border-0 focus:outline-none focus:ring-0 hover:bg-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg text-white font-semibold">
          {faqitems.question}
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
          <p className="text-white text-lg">{faqitems.answer}</p>
      </div>
    </div>
  );
}
