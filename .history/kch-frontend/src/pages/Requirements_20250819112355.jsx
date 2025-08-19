import React, { useEffect, useState } from "react";
import api from "../services/request";
import { FileText, RefreshCw } from "lucide-react";

export default function Requirements() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const LICENSED_STATES = [
    "Alabama",
    "California",
    "Connecticut",
    "Illinois",
    "Louisiana",
    "Maryland",
    "Nevada",
    "New Jersey",
    "North Carolina",
    "Oklahoma",
    "Oregon",
    "Tennessee",
    "Texas",
    "Virginia",
  ];

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/compliance/status");
      setData(res.data || {});
    } catch (e) {
      setError("Unable to load requirements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const requiredDocs = Array.isArray(data?.requiredDocs)
    ? data.requiredDocs
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-8">
      <div className="mb-6 rounded-3xl border border-neutral-800 bg-gradient-to-br from-[#0d0f1a] to-[#121524] p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              State Requirements
            </h1>
            <p className="text-gray-300">
              What you need to submit to access keycode services
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-800 bg-black/30 p-5 backdrop-blur supports-[backdrop-filter]:bg-black/40">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-300">
            Jurisdiction:{" "}
            <span className="text-white font-medium">
              {data?.jurisdiction || "—"}
            </span>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className={`btn btn-sm ${loading ? "btn-outline" : "btn-primary"}`}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />{" "}
            Refresh
          </button>
        </div>

        {error && <div className="mb-3 text-sm text-red-400">{error}</div>}

        <div className="mb-4 text-gray-200">
          {loading ? (
            <div className="text-gray-400">Loading…</div>
          ) : (
            <p>
              {data?.message ||
                "Submit the required documents to comply with your state policy."}
            </p>
          )}
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">Required Documents</h2>
          {requiredDocs.length === 0 ? (
            <div className="text-gray-400 text-sm">
              No specific documents listed for your state.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {requiredDocs.map((d) => (
                <span
                  key={d}
                  className="rounded-full border border-neutral-700 bg-black/40 px-3 py-1 text-sm text-gray-200"
                >
                  {d}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-white font-semibold mb-2">
            General eligibility & document requirements
          </h2>
          <ul className="list-disc pl-5 text-gray-200 space-y-1">
            <li>
              Service is available only within the United States and Canada.
            </li>
            <li>
              All documents must be valid, non-expired, and clearly legible in
              the photo.
            </li>
            <li>Driver’s license (owner) is required.</li>
            <li>
              Provide one of the following: registration, title, or proof of
              insurance.
            </li>
            <li>
              Upload a photo of the vehicle’s license plate and a photo of the
              odometer.
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="text-white font-semibold mb-2">
            States requiring a locksmith license
          </h2>
          <p className="text-gray-300 text-sm mb-3">
            If you operate in one of the states below, a locksmith license is
            required to perform locksmith-related services. Always verify
            current requirements with the state regulator.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {LICENSED_STATES.map((s) => (
              <div
                key={s}
                className="rounded-xl border border-neutral-800 bg-black/40 px-3 py-2 text-gray-200 text-sm"
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-400">
          Tip: You can upload and manage your documents in your profile and
          during keycode request submission.
        </div>
      </div>
    </div>
  );
}
