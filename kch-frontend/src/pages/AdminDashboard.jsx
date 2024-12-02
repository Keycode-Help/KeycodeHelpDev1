import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { token } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [keycodes, setKeycodes] = useState({}); // Store keycodes for each request

  useEffect(() => {
    axios
      .get("http://localhost:8080/admin/pending-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setPendingRequests(response.data))
      .catch((error) =>
        console.error("Error fetching pending requests:", error)
      );

    axios
      .get("http://localhost:8080/admin/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setTransactions(response.data))
      .catch((error) => console.error("Error fetching transactions:", error));
  }, [token]);

  const handleProcessRequest = (vehicleId) => {
    if (!keycodes[vehicleId]) {
      alert("Please enter a keycode before submitting.");
      return;
    }

    axios
      .post(
        "http://localhost:8080/admin/process-request",
        { vehicleId, keycode: keycodes[vehicleId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert("Keycode processed successfully.");
        setPendingRequests(
          pendingRequests.filter((request) => request.id !== vehicleId)
        );
        axios
          .get("http://localhost:8080/admin/transactions", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => setTransactions(response.data))
          .catch((error) =>
            console.error("Error updating transactions:", error)
          );
      })
      .catch((error) => console.error("Error processing request:", error));
  };

  const handleKeycodeChange = (vehicleId, value) => {
    setKeycodes((prevKeycodes) => ({
      ...prevKeycodes,
      [vehicleId]: value,
    }));
  };

  return (
    <div className="container admin-dashboard">
      <h1>Admin Dashboard</h1>
      {/* Pending Requests Section */}
      <section className="pending-requests">
        <h2>Pending Requests</h2>
        {pendingRequests.length === 0 ? (
          <p>No pending requests at the moment.</p>
        ) : (
          <ul>
            {pendingRequests.map((request) => (
              <li key={request.id}>
                <h3>
                  {request.make} {request.model} (VIN: {request.vin})
                </h3>
                <input
                  type="text"
                  value={keycodes[request.id] || ""}
                  onChange={(e) =>
                    handleKeycodeChange(request.id, e.target.value)
                  }
                  placeholder="Enter Keycode"
                />
                <button onClick={() => handleProcessRequest(request.id)}>
                  Submit Keycode
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Transactions Section */}
      <section className="transactions">
        <h2>All Transactions</h2>
        {transactions.length === 0 ? (
          <p>No transactions available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Confirmation Number</th>
                <th>Status</th>
                <th>Vehicle Info</th>
                <th>Keycode</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.confirmationNumber}</td>
                  <td>{transaction.status}</td>
                  <td>
                    {transaction.vehicles &&
                      transaction.vehicles.map((vehicle, index) => (
                        <div key={index}>
                          {vehicle.make} {vehicle.model} (VIN: {vehicle.vin})
                        </div>
                      ))}
                  </td>
                  <td>
                    {transaction.vehicles &&
                      transaction.vehicles.map((vehicle, index) => (
                        <div key={index}>
                          {vehicle.keycode ? vehicle.keycode : "Not Provided"}
                        </div>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
