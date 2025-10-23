import React from "react";

const ApiDebug = () => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const isDev = import.meta.env.DEV;
  const mode = import.meta.env.MODE;

  return (
    <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
      <h3 className="font-bold mb-2">🔍 API Configuration Debug</h3>
      <div className="space-y-1">
        <div>
          <strong>API URL:</strong> {apiURL}
        </div>
        <div>
          <strong>Environment:</strong> {mode}
        </div>
        <div>
          <strong>Is Dev:</strong> {isDev ? "Yes" : "No"}
        </div>
        <div>
          <strong>VITE_API_URL:</strong>{" "}
          {import.meta.env.VITE_API_URL || "Not set"}
        </div>
      </div>
    </div>
  );
};

export default ApiDebug;
