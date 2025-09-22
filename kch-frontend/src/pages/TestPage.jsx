import React from "react";

// Simple test page to check if the app loads without authentication issues
function TestPage() {
  console.log("🧪 TestPage loaded successfully");

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f0f0",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#333" }}>🧪 Test Page</h1>
      <p>If you can see this page, the React app is loading properly.</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
        }}
      >
        <h3>Debug Info:</h3>
        <p>Environment: {process.env.NODE_ENV}</p>
        <p>Page loaded at: {new Date().toISOString()}</p>
        <p>User Agent: {navigator.userAgent}</p>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default TestPage;
