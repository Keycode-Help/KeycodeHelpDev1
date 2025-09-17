const jwt = require('jsonwebtoken');

// The JWT token from the logs
const token = "eyJhbGciOiJIUzI1NiIsImtpZCI6InRPU2NhSThwT2ZBV1hDa1IiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2NoZ3BpeW1xc2R4bnVsbXRpdGRoLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIwYTVmOWZjYS00ZGZiLTRkNzUtOGQ4My1hYWNlZGU0OTg3NmIiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU3Mjc2MjU5LCJpYXQiOjE3NTcyNzI2NTksImVtYWlsIjoiNWVwbWdsbGNAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicm9sZSI6IlNVUEVSX0FETUlOIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NTcyNzI2NTV9XSwic2Vzc2lvbl9pZCI6ImQ5NGFkZGYwLWIwZWEtNDcxMy04ZDYzLTBkMGYyNGNjYzc5YiIsImlzX2Fub255bW91cyI6ZmFsc2V9.7I2maIJVv5qoEgS0p0WFcUmu17amgrHcwuOMLLsxktY";

// The correct JWT secret from Supabase dashboard
const secret = "hcX/YSh5bgmIFvTX31sdsdcrEDNQi+wIAAH/GZmJa1puxj/SRIm1lGZD3e4TqCpNbUaaPB9ofvG1Xq6Z4qPGpw==";

try {
  const decoded = jwt.verify(token, secret);
  console.log("✅ JWT validation successful!");
  console.log("Decoded payload:", JSON.stringify(decoded, null, 2));
} catch (error) {
  console.log("❌ JWT validation failed:", error.message);
}
