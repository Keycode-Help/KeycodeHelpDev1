import React, { useEffect, useState } from "react";
import api from "../services/request";

const STAGES = [
  { key: "ACCOUNT", label: "Account Verified" },
  { key: "DOCS", label: "Documents Approved" },
  { key: "PROCESSING", label: "Processing" },
  { key: "COMPLETED", label: "Completed" },
];

export default function OrderTracker() {
  const [status, setStatus] = useState({});

  useEffect(() => {
    const fetch = () =>
      api
        .get("/user/orders")
        .then((res) => setStatus(res.data?.status || {}))
        .catch(() => {});
    fetch();
    const id = setInterval(fetch, 5000);
    return () => clearInterval(id);
  }, []);

  const currentIndex = STAGES.findIndex((s) => status[s.key]);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-black/30 p-4">
      <div className="text-white font-semibold mb-2">Order Tracker</div>
      <div className="flex items-center justify-between">
        {STAGES.map((s, idx) => (
          <div key={s.key} className="flex-1 flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                idx <= currentIndex
                  ? "bg-emerald-500 text-black"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {idx + 1}
            </div>
            <div className="mt-2 text-xs text-gray-300 text-center max-w-[6rem]">
              {s.label}
            </div>
            {idx < STAGES.length - 1 && (
              <div
                className={`h-1 w-full ${
                  idx < currentIndex ? "bg-emerald-500" : "bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
