import React from "react";

export default function StatCard({ label, value, icon: Icon, accent = "from-primary/50 to-primary/20" }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-[#0d1015] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className={`pointer-events-none absolute inset-px rounded-2xl bg-gradient-to-b ${accent} opacity-10`} />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>
        {Icon ? (
          <div className="rounded-xl border border-gray-800 bg-[#12161c] p-3 text-gray-300">
            <Icon size={22} />
          </div>
        ) : null}
      </div>
    </div>
  );
}


