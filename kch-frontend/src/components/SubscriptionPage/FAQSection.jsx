import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

/* eslint-disable react/prop-types */
export function FAQSection({ faqitems }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-800 rounded-3xl">
      <button
        className="flex items-center justify-between w-full px-6 py-4 rounded-3xl bg-black border-0 focus:outline-none focus:ring-0 hover:bg-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg text-white font-semibold">
          {faqitems.question}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-white transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {/* Subtle animation would be good here. Dropdown drop down smoother and text slides in. */}
      {isOpen && (
        <div className="p-6 bg-zinc-950 rounded-b-3xl">
          <p className="text-white text-lg">{faqitems.answer}</p>
        </div>
      )}
    </div>
  );
}
