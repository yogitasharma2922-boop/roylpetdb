import React, { useState, useEffect } from "react";
import { apiFetch } from "../services/api";

export default function HealthCheck() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/health")
      .then(setStatus)
      .catch((err) => setStatus({ error: err.message }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Backend Status</h2>
      {loading ? (
        <p>Checking...</p>
      ) : status?.error ? (
        <div className="bg-red-50 p-4 text-red-700 rounded-md">
          API is not reachable: {status.error}
        </div>
      ) : (
        <div className="bg-green-50 p-4 text-green-700 rounded-md">
          API is reachable. Environment: {status.env || "unknown"}
        </div>
      )}
    </div>
  );
}
