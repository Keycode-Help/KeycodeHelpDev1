import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ModalContent } from "../components/ModalContent";
import { Search, Edit2, Save, Image as ImageIcon, Loader2 } from "lucide-react";

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

  const TabButton = ({ id, label, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
        activeTab === id
          ? "bg-primary text-white border-primary"
          : "bg-transparent text-gray-300 border-gray-700 hover:bg-gray-800"
      }`}
    >
      {label}
      <span className="ml-2 inline-flex items-center justify-center rounded-full bg-gray-800 px-2 py-0.5 text-xs">
        {count}
      </span>
    </button>
  );

  const RequestCard = ({ request, status }) => {
    const makeName = request?.make?.manufacturerName || "—";
    const editing = Boolean(updateData[request.id]);
    return (
      <div className="rounded-xl border border-gray-800 bg-[#111318] p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {makeName} • {request.model}
            </h3>
            <p className="text-sm text-gray-400 mt-1">VIN: {request.vin}</p>
            <p className="text-sm text-gray-400">
              Price: ${request.keycodePrice}
            </p>
            <span
              className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs ${
                status === "pending"
                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                  : status === "inProgress"
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                  : "bg-green-500/10 text-green-400 border border-green-500/30"
              }`}
            >
              {status === "pending"
                ? "Pending"
                : status === "inProgress"
                ? "In Progress"
                : "Fulfilled"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-1 rounded-md border border-gray-700 px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-800"
              onClick={() =>
                handleImageClick(`data:image/jpeg;base64,${request.frontId}`)
              }
            >
              <ImageIcon size={16} /> Docs
            </button>
            <button
              className="inline-flex items-center gap-1 rounded-md border border-gray-700 px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-800"
              onClick={() =>
                setUpdateData((prev) => ({
                  ...prev,
                  [request.id]: prev[request.id] || {
                    model: request.model,
                    vin: request.vin,
                  },
                }))
              }
            >
              <Edit2 size={16} /> Edit
            </button>
          </div>
        </div>

        {editing && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Model</label>
              <input
                type="text"
                name="model"
                value={updateData[request.id]?.model ?? request.model}
                onChange={(e) => handleInputChange(e, request.id)}
                className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Model"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">VIN</label>
              <input
                type="text"
                name="vin"
                value={updateData[request.id]?.vin ?? request.vin}
                onChange={(e) => handleInputChange(e, request.id)}
                className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="VIN"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Front ID
              </label>
              <input
                type="file"
                name="frontId"
                onChange={(e) => handleFileChange(e, request.id)}
                accept="image/*"
                className="w-full text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-white hover:file:bg-primary/90"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Back ID
              </label>
              <input
                type="file"
                name="backId"
                onChange={(e) => handleFileChange(e, request.id)}
                accept="image/*"
                className="w-full text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-white hover:file:bg-primary/90"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">
                Registration
              </label>
              <input
                type="file"
                name="registration"
                onChange={(e) => handleFileChange(e, request.id)}
                accept="image/*"
                className="w-full text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-white hover:file:bg-primary/90"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                type="button"
                onClick={() => handleUpdateRequest(request.id)}
              >
                <Save size={16} /> Save Update
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

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
        <div className="rounded-xl border border-gray-800 bg-[#111318] p-4">
          <p className="text-sm text-gray-400">Pending</p>
          <p className="mt-1 text-2xl font-bold text-white">{stats.pending}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-[#111318] p-4">
          <p className="text-sm text-gray-400">In Progress</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {stats.inProgress}
          </p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-[#111318] p-4">
          <p className="text-sm text-gray-400">Fulfilled</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {stats.fulfilled}
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <TabButton id="pending" label="Pending" count={stats.pending} />
        <TabButton
          id="inProgress"
          label="In Progress"
          count={stats.inProgress}
        />
        <TabButton id="fulfilled" label="Fulfilled" count={stats.fulfilled} />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="animate-spin" size={18} /> Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(activeTab === "pending"
            ? filtered.pending
            : activeTab === "inProgress"
            ? filtered.inProgress
            : filtered.fulfilled
          ).map((req) => (
            <RequestCard key={req.id} request={req} status={activeTab} />
          ))}
        </div>
      )}

      {modalImage && (
        <ModalContent modalImage={modalImage} closeModal={closeModal} />
      )}
    </div>
  );
}

export default UserDash;
