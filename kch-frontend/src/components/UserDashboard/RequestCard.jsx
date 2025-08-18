import React from "react";
import { Image as ImageIcon, Edit2, Save } from "lucide-react";

export default function RequestCard({
  request,
  status,
  updateData,
  onStartEdit,
  onChange,
  onFile,
  onSave,
  onPreview,
}) {
  const makeName = request?.make?.manufacturerName || "—";
  const editing = Boolean(updateData[request.id]);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-b from-[#10131a] to-[#0b0e13] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div
        className="absolute inset-0 -z-10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20"
        style={{
          background:
            "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(11,65,228,.15), transparent 40%)",
        }}
      />
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {makeName} • {request.model}
          </h3>
          <p className="mt-1 text-sm text-gray-400">VIN: {request.vin}</p>
          <p className="text-sm text-gray-400">
            Price: ${request.keycodePrice}
          </p>
          <span
            className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs ${
              status === "pending"
                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                : status === "inProgress"
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                : "bg-green-500/10 text-green-400 border border-green-500/30"
            }`}
          >
            {status === "pending"
              ? "Pending"
              : status === "inProgress"
              ? "In Progress"
              : "Fulfilled"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1 rounded-md border border-gray-700 px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-800"
            onClick={() =>
              onPreview(`data:image/jpeg;base64,${request.frontId}`)
            }
          >
            <ImageIcon size={16} /> Docs
          </button>
          <button
            className="inline-flex items-center gap-1 rounded-md border border-gray-700 px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-800"
            onClick={() => onStartEdit(request)}
          >
            <Edit2 size={16} /> Edit
          </button>
        </div>
      </div>

      {editing && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-gray-400">Model</label>
            <input
              type="text"
              name="model"
              value={updateData[request.id]?.model ?? request.model}
              onChange={(e) => onChange(e, request.id)}
              className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Model"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">VIN</label>
            <input
              type="text"
              name="vin"
              value={updateData[request.id]?.vin ?? request.vin}
              onChange={(e) => onChange(e, request.id)}
              className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="VIN"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Front ID</label>
            <input
              type="file"
              name="frontId"
              onChange={(e) => onFile(e, request.id)}
              accept="image/*"
              className="w-full text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-white hover:file:bg-primary/90"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Back ID</label>
            <input
              type="file"
              name="backId"
              onChange={(e) => onFile(e, request.id)}
              accept="image/*"
              className="w-full text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-white hover:file:bg-primary/90"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-gray-400">
              Registration
            </label>
            <input
              type="file"
              name="registration"
              onChange={(e) => onFile(e, request.id)}
              accept="image/*"
              className="w-full text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-white hover:file:bg-primary/90"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
              type="button"
              onClick={() => onSave(request.id)}
            >
              <Save size={16} /> Save Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
