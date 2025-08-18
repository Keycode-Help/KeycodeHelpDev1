import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ModalContent } from "../components/ModalContent";
import { Search, Loader2, Hourglass, Clock, CheckCircle2 } from "lucide-react";
import StatCard from "../components/UserDashboard/StatCard";
import TabNav from "../components/UserDashboard/TabNav";
import RequestCardView from "../components/UserDashboard/RequestCard";
import EmptyState from "../components/UserDashboard/EmptyState";

function UserDash() {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState({
    pendingRequests: [],
    inProgressRequests: [],
    fulfilledRequests: [],
  });
  const [activeTab, setActiveTab] = useState("pending");
  const [modalImage, setModalImage] = useState(null);
  const [updateData, setUpdateData] = useState({});
  const [fileData, setFileData] = useState({});
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/vehicle/user-requests", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setRequests(response.data))
      .catch((error) =>
        console.error("Error fetching vehicle requests:", error)
      )
      .finally(() => setLoading(false));
  }, [token]);

  const handleInputChange = (e, requestId) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [requestId]: { ...prev[requestId], [name]: value },
    }));
  };

  const handleFileChange = (e, requestId) => {
    const { name, files } = e.target;
    setFileData((prev) => ({
      ...prev,
      [requestId]: { ...prev[requestId], [name]: files[0] },
    }));
  };

  const handleImageClick = (imageSrc) => setModalImage(imageSrc);
  const closeModal = () => setModalImage(null);

  const handleUpdateRequest = (requestId) => {
    const requestData = updateData[requestId] || {};
    const requestFiles = fileData[requestId] || {};

    const formData = new FormData();
    if (requestData.make) formData.append("make", requestData.make);
    if (requestData.model) formData.append("model", requestData.model);
    if (requestData.vin) formData.append("vin", requestData.vin);
    if (requestFiles.frontId) formData.append("frontId", requestFiles.frontId);
    if (requestFiles.backId) formData.append("backId", requestFiles.backId);
    if (requestFiles.registration)
      formData.append("registration", requestFiles.registration);

    axios
      .put(
        `http://localhost:8080/vehicle/update-request/${requestId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        // Refresh
        return axios.get("http://localhost:8080/vehicle/user-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((response) => setRequests(response.data))
      .catch((error) => {
        console.error("Error updating request:", error);
        alert("Failed to update request.");
      });
  };

  const stats = useMemo(
    () => ({
      pending: requests.pendingRequests.length,
      inProgress: requests.inProgressRequests.length,
      fulfilled: requests.fulfilledRequests.length,
    }),
    [requests]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filter = (arr) =>
      !q
        ? arr
        : arr.filter(
            (r) =>
              (r.model || "").toLowerCase().includes(q) ||
              (r.vin || "").toLowerCase().includes(q) ||
              ((r.make && r.make.manufacturerName) || "")
                .toLowerCase()
                .includes(q)
          );
    return {
      pending: filter(requests.pendingRequests),
      inProgress: filter(requests.inProgressRequests),
      fulfilled: filter(requests.fulfilledRequests),
    };
  }, [requests, query]);
  const startEdit = (r) =>
    setUpdateData((prev) => ({
      ...prev,
      [r.id]: prev[r.id] || { model: r.model, vin: r.vin },
    }));

  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Welcome{user?.fname ? `, ${user.fname}` : ""}
          </h1>
          <p className="text-sm text-gray-400">
            Track and manage your keycode requests.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by VIN, model, or make"
              className="w-full rounded-full border border-gray-700 bg-transparent py-2 pl-9 pr-4 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Pending" value={stats.pending} icon={Hourglass} />
        <StatCard label="In Progress" value={stats.inProgress} icon={Clock} />
        <StatCard
          label="Fulfilled"
          value={stats.fulfilled}
          icon={CheckCircle2}
        />
      </section>

      {/* Tabs */}
      <div className="mb-4">
        <TabNav
          tabs={[
            { id: "pending", label: "Pending", count: stats.pending },
            { id: "inProgress", label: "In Progress", count: stats.inProgress },
            { id: "fulfilled", label: "Fulfilled", count: stats.fulfilled },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="animate-spin" size={18} /> Loading...
        </div>
      ) : (
        (() => {
          const list =
            activeTab === "pending"
              ? filtered.pending
              : activeTab === "inProgress"
              ? filtered.inProgress
              : filtered.fulfilled;
          if (!list.length) {
            return (
              <EmptyState
                title="Nothing here yet"
                subtitle="New requests will appear in this tab."
              />
            );
          }
          return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((req) => (
                <RequestCardView
                  key={req.id}
                  request={req}
                  status={activeTab}
                  updateData={updateData}
                  onStartEdit={startEdit}
                  onChange={handleInputChange}
                  onFile={handleFileChange}
                  onSave={handleUpdateRequest}
                  onPreview={handleImageClick}
                />
              ))}
            </div>
          );
        })()
      )}

      {modalImage && (
        <ModalContent modalImage={modalImage} closeModal={closeModal} />
      )}
    </div>
  );
}

export default UserDash;
