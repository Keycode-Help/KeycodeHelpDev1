import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/registered-users.css";

function RegisteredUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleSendNotification = () => {
    if (!notificationMessage.trim()) {
      alert("Please enter a message to send.");
      return;
    }
    axios
      .post(
        `http://localhost:8080/admin/notify-user/${selectedUser.id}`,
        { message: notificationMessage },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        alert("Notification sent successfully.");
        setNotificationMessage("");
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
        alert("Failed to send notification.");
      });
  };

  return (
    <div className="wrapper-cart">
      <div className="registered-users-container">
        <h1>Registered Users</h1>
        <div className="users-list">
          {users.map((user) => (
            <div
              key={user.id}
              className="user-card"
              onClick={() => handleUserClick(user)}
            >
              <div className="user-card-content">
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>First Name:</strong> {user.fname}
                </p>
                <p>
                  <strong>Last Name:</strong> {user.lname}
                </p>
              </div>
            </div>
          ))}
        </div>

        {selectedUser && (
          <div className="user-details">
            <h2>User Details</h2>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>First Name:</strong> {selectedUser.fname}
            </p>
            <p>
              <strong>Last Name:</strong> {selectedUser.lname}
            </p>
            <p>
              <strong>Phone:</strong> {selectedUser.phone}
            </p>
            <div className="user-images">
              <img src={selectedUser.frontId} alt="Front ID" />
              <img src={selectedUser.backId} alt="Back ID" />
              <img src={selectedUser.insurance} alt="Insurance" />
            </div>
            <textarea
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Enter a message for the user"
            />
            <button className="send-note" onClick={handleSendNotification}>
              Send Notification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisteredUsers;
