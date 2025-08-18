import React from "react";

export default function EmptyState({
  title = "No items",
  subtitle = "Nothing to show here yet.",
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-800 bg-[#0b0e13] p-10 text-center">
      <p className="text-base font-medium text-gray-200">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}
