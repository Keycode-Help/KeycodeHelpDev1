import React, { useEffect, useState } from "react";
import api from "../services/request";
import {
  FileText,
  RefreshCw,
  MapPin,
  Shield,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-2xl mb-6 shadow-2xl">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent mb-4">
            State Requirements
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            What you need to submit to access keycode services. Compliance
            requirements vary by state.
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Current Status
                </h2>
                <p className="text-gray-300">Your compliance requirements</p>
              </div>
            </div>
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Jurisdiction
              </h3>
              <p className="text-gray-300 text-lg">
                {data?.jurisdiction || "—"}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Status Message
              </h3>
              <p className="text-gray-300">
                {loading ? (
                  <span className="text-gray-400">Loading...</span>
                ) : (
                  data?.message ||
                  "Submit the required documents to comply with your state policy."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Required Documents */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Required Documents
              </h2>
              <p className="text-gray-300">Documents needed for your state</p>
            </div>
          </div>

          {requiredDocs.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg">
                No specific documents listed for your state.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {requiredDocs.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl border border-slate-600"
                >
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-gray-200 font-medium">{doc}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* General Requirements */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                General Requirements
              </h2>
              <p className="text-gray-300">
                Standard eligibility and document requirements
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">
                Service is available only within the United States and Canada.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">
                All documents must be valid, non-expired, and clearly legible in
                the photo.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">
                Driver's license (owner) is required.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">
                Provide one of the following: registration, title, or proof of
                insurance.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">
                Upload a photo of the vehicle's license plate and a photo of the
                odometer.
              </span>
            </div>
          </div>
        </div>

        {/* Licensed States */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                States Requiring Locksmith License
              </h2>
              <p className="text-gray-300">
                Special licensing requirements by state
              </p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <p className="text-orange-300 text-sm">
              If you operate in one of the states below, a locksmith license is
              required to perform locksmith-related services. Always verify
              current requirements with the state regulator.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {LICENSED_STATES.map((state) => (
              <div
                key={state}
                className="p-3 bg-slate-700/30 border border-slate-600 rounded-xl text-center"
              >
                <span className="text-gray-200 text-sm font-medium">
                  {state}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Helpful Tip */}
        <div className="bg-gradient-to-r from-blue-500/10 to-yellow-500/10 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Helpful Tip
              </h3>
              <p className="text-gray-300">
                You can upload and manage your documents in your profile and
                during keycode request submission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
