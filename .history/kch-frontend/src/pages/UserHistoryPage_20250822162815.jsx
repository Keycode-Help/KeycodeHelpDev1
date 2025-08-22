import React, { useState } from "react";
import api from "../services/request";
import { useAuth } from "../context/AuthContext";
import "../styles/userHistoryPage.css"; // Import the CSS file

function UserHistoryPage() {
  const { token } = useAuth();
  const [email, setEmail] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = () => {
    setIsLoading(true);
    api
      .get(`/admin/user-history?email=${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setHistory(response.data))
      .catch((error) => {
        alert("Failed to fetch user history.");
        console.error("Error fetching user history:", error);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="wrapper-history">
      <div className="user-history-container">
        <h1 className="page-title">User History</h1>
        <div className="input-section">
          <input
            type="email"
            placeholder="Enter User Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="email-input"
          />
          <button onClick={fetchHistory} className="fetch-button">
            Fetch History
          </button>
        </div>

        {isLoading ? (
          <p className="loading-text">Loading...</p>
        ) : history.length > 0 ? (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Status</th>
                  <th>Confirmation Number</th>
                </tr>
              </thead>
              <tbody>
                {history.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.status}</td>
                    <td>{transaction.confirmationNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-history-text">No history found for this email.</p>
        )}
      </div>
    </div>
  );
}

export default UserHistoryPage;
