import React from "react";

// Simple home page without any authentication dependencies
function SimpleHome() {
  console.log("🏠 SimpleHome component rendered at:", new Date().toISOString());

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🏠 Simple Home Page</h1>
      <p>This is a minimal home page without authentication dependencies.</p>
      <p>
        If this page loads without refreshing, the issue is in the
        authentication flow.
      </p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          border: "1px solid #dee2e6",
        }}
      >
        <h3>Navigation Test:</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ margin: "10px 0" }}>
            <a
              href="/test"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              🧪 Test Page
            </a>
          </li>
          <li style={{ margin: "10px 0" }}>
            <a
              href="/login"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              🔐 Login Page
            </a>
          </li>
          <li style={{ margin: "10px 0" }}>
            <a
              href="/register"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              📝 Register Page
            </a>
          </li>
        </ul>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeaa7",
        }}
      >
        <h4>⚠️ Debug Status:</h4>
        <p>✅ React app is working</p>
        <p>✅ Router is working</p>
        <p>✅ No authentication checks on this page</p>
        <p>✅ No useEffect hooks with dependencies</p>
      </div>
    </div>
  );
}

export default SimpleHome;
