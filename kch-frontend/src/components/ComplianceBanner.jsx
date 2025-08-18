import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function ComplianceBanner({ className = "" }) {
  const { token } = useAuth();
  const [status, setStatus] = useState({ required: false, requiredDocs: [], message: "", jurisdiction: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/compliance/status", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStatus(res.data))
      .catch((e) => setError(e?.response?.data?.message || "Failed to load compliance status"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return null;
  if (error) return null;
  if (!status.required) return null;

  const checklist = {
    STATE_LOCKSMITH_LICENSE: "State locksmith license",
    PHOTO_ID: "Government photo ID",
  };

  return (
    <div className={`rounded-xl border border-yellow-700 bg-yellow-500/10 p-4 text-yellow-200 ${className}`}>
      <p className="font-semibold">Additional verification required in {status.jurisdiction}.</p>
      <p className="mt-1 text-sm opacity-90 whitespace-pre-line">{status.message}</p>
      {status.requiredDocs?.length ? (
        <ul className="mt-3 list-disc pl-5 text-sm">
          {status.requiredDocs.map((d) => (
            <li key={d}>{checklist[d] || d}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
