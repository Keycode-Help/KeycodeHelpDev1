import React, { useState } from "react";
import { ExternalLink, Copy, Shield, Clock, Key } from "lucide-react";
import { keycodeService } from "../services/keycodeService";
import { getVehicleLogo } from "../utils/vehicleLogos";

const KeycodeGrid = ({ portals }) => {
  const [copyStatus, setCopyStatus] = useState({});
  const [loading, setLoading] = useState({});

  const handleLaunchPortal = (portal) => {
    if (portal.portal_url) {
      window.open(portal.portal_url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyCredentials = async (portal) => {
    if (loading[portal.id]) return;

    setLoading((prev) => ({ ...prev, [portal.id]: true }));
    setCopyStatus((prev) => ({ ...prev, [portal.id]: "" }));

    try {
      const data = await keycodeService.getCredentials(portal.id);

      const credentials = `Username: ${data.username}\nPassword: ${data.password}`;

      try {
        await navigator.clipboard.writeText(credentials);
        setCopyStatus((prev) => ({
          ...prev,
          [portal.id]: "Credentials copied to clipboard!",
        }));
      } catch (clipboardError) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = credentials;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopyStatus((prev) => ({
          ...prev,
          [portal.id]: "Credentials copied to clipboard!",
        }));
      }
    } catch (error) {
      console.error("Error copying credentials:", error);
      let errorMessage = "Failed to copy credentials";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Invalid request";
            break;
          case 403:
            errorMessage = "Access denied";
            break;
          case 404:
            errorMessage = "Unknown OEM";
            break;
          case 409:
            errorMessage =
              "Missing credentials. Update environment variables for this OEM.";
            break;
          case 429:
            errorMessage = "Rate limit exceeded. Try again later.";
            break;
          default:
            errorMessage =
              error.response.data?.error || "Failed to copy credentials";
        }
      }

      setCopyStatus((prev) => ({
        ...prev,
        [portal.id]: errorMessage,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [portal.id]: false }));

      // Clear status after 3 seconds
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [portal.id]: "" }));
      }, 3000);
    }
  };

  const getStatusBadge = (portal) => {
    if (portal.comingSoon) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
          <Clock className="w-3 h-3 mr-1" />
          Coming Soon
        </span>
      );
    }

    if (portal.sdrm) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
          <Shield className="w-3 h-3 mr-1" />
          SDRM
        </span>
      );
    }

    return null;
  };

  const getActionButtons = (portal) => {
    if (!portal.portal_url) {
      return (
        <div className="text-sm text-white/60 italic">Portal not available</div>
      );
    }

    return (
      <div className="flex space-x-3">
        <button
          onClick={() => handleLaunchPortal(portal)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Launch
        </button>
        <button
          onClick={() => handleCopyCredentials(portal)}
          disabled={loading[portal.id]}
          className="inline-flex items-center px-4 py-2 border border-slate-600 text-sm leading-4 font-medium rounded-lg text-white bg-slate-700/50 hover:bg-slate-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          {loading[portal.id] ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/60 mr-2"></div>
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          Copy Creds
        </button>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {portals.map((portal) => (
        <div
          key={portal.id}
          className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-xl ${
            !portal.portal_url ? "opacity-75" : ""
          } hover:shadow-2xl transition-all duration-300`}
        >
          {/* Card Header */}
          <div className="p-6 border-b border-slate-600">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {/* Vehicle Logo */}
                  <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center border border-slate-600">
                    <img
                      src={getVehicleLogo(portal.name)}
                      alt={portal.name}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    {/* Fallback icon when logo fails to load */}
                    <div className="hidden w-6 h-6 text-slate-400">
                      <Key className="w-full h-full" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {portal.name}
                  </h3>
                </div>
                {getStatusBadge(portal)}
              </div>
              <div className="flex-shrink-0 ml-2">
                <Key className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6">
            {/* Notes */}
            {portal.notes && (
              <div className="mb-6">
                <p className="text-sm text-white/80 leading-relaxed">
                  {portal.notes}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {getActionButtons(portal)}

            {/* Status Message */}
            {copyStatus[portal.id] && (
              <div
                className={`mt-4 p-3 rounded-lg text-sm ${
                  copyStatus[portal.id].includes("Failed") ||
                  copyStatus[portal.id].includes("error")
                    ? "bg-red-500/10 text-red-400 border border-red-500/30"
                    : "bg-green-500/10 text-green-400 border border-green-500/30"
                }`}
              >
                {copyStatus[portal.id]}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KeycodeGrid;
