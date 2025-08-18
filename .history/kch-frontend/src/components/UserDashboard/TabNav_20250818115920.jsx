import React from "react";

export default function TabNav({ tabs, active, onChange }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-[#0c0f14] p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            active === t.id
              ? "bg-primary text-white"
              : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          {t.label}
          <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-black/40 px-1.5 text-[10px] text-gray-300">
            {t.count}
          </span>
        </button>
      ))}
    </div>
  );
}


