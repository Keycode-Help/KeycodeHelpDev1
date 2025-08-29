import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Car,
  Calendar,
  Settings,
  Shield,
  Copy,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  X,
} from "lucide-react";
import "../styles/kchDatabase.css";

const KchDatabase = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State for filters and search
  const [filters, setFilters] = useState({
    makeId: null,
    modelId: null,
    yearFrom: null,
    yearTo: null,
    systemTypeId: null,
    transponderFamilyId: null,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // State for dropdown data
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [systemTypes, setSystemTypes] = useState([]);
  const [transponderFamilies, setTransponderFamilies] = useState([]);

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [copyAttempts, setCopyAttempts] = useState(0);
  const [showCopyWarning, setShowCopyWarning] = useState(false);

  // Check access control
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Check if user has access to KCH Database
    if (user && user.role === "GUEST") {
      navigate("/subscription");
      return;
    }

    // Check trial status for BASEUSER
    if (user && user.role === "BASEUSER") {
      // TODO: Add trial status check
      // For now, allow all BASEUSER access
    }

    // Load initial data
    loadInitialData();

    // Check if first visit
    const hasVisited = localStorage.getItem("kch-db-visited");
    if (hasVisited) {
      setShowOnboarding(false);
    }
  }, [isAuthenticated, user, navigate]);

  const loadInitialData = async () => {
    try {
      const [makesRes, systemTypesRes, familiesRes] = await Promise.all([
        fetch("/api/kch/makes"),
        fetch("/api/kch/system-types"),
        fetch("/api/kch/transponder-families"),
      ]);

      if (makesRes.ok) setMakes(await makesRes.json());
      if (systemTypesRes.ok) setSystemTypes(await systemTypesRes.json());
      if (familiesRes.ok) setTransponderFamilies(await familiesRes.json());
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const loadModels = async (makeId) => {
    if (!makeId) {
      setModels([]);
      return;
    }

    try {
      const response = await fetch(`/api/kch/makes/${makeId}/models`);
      if (response.ok) {
        const modelsData = await response.json();
        setModels(modelsData);
      }
    } catch (error) {
      console.error("Error loading models:", error);
    }
  };

  const searchEntries = useCallback(
    async (page = 0) => {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: "20",
        });

        // Add filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });

        // Add search term
        if (searchTerm.trim()) {
          params.append("q", searchTerm.trim());
        }

        const response = await fetch(`/api/kch/search?${params}`);

        if (response.ok) {
          const data = await response.json();
          setResults(data.content);
          setTotalPages(data.totalPages);
          setTotalElements(data.totalElements);
          setCurrentPage(data.currentPage);
        } else {
          console.error("Search failed:", response.statusText);
        }
      } catch (error) {
        console.error("Error searching entries:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters, searchTerm]
  );

  useEffect(() => {
    searchEntries(0);
  }, [searchEntries]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));

    // Reset dependent filters
    if (key === "makeId") {
      setFilters((prev) => ({ ...prev, modelId: null }));
      setModels([]);
      if (value) {
        loadModels(value);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchEntries(0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    searchEntries(page);
  };

  const handleCopyCredentials = (text) => {
    setCopyAttempts((prev) => prev + 1);

    if (copyAttempts >= 3) {
      setShowCopyWarning(true);
      setTimeout(() => setShowCopyWarning(false), 5000);
      return;
    }

    navigator.clipboard.writeText(text);
  };

  const handlePrintAttempt = (e) => {
    e.preventDefault();
    setShowCopyWarning(true);
    setTimeout(() => setShowCopyWarning(false), 3000);
  };

  const closeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("kch-db-visited", "true");
  };

  if (!isAuthenticated || (user && user.role === "GUEST")) {
    return null;
  }

  return (
    <div className="kch-database">
      {/* Header */}
      <div className="kch-header">
        <div className="header-content">
          <h1>
            <Car className="header-icon" />
            KCH Key Chip Database
          </h1>
          <p>Comprehensive automotive transponder and key chip information</p>
        </div>
        <div className="header-actions">
          <Shield className="security-icon" />
          <span>Protected Resource</span>
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="onboarding-modal">
          <div className="onboarding-content">
            <h2>Welcome to KCH Database! 🎉</h2>
            <div className="onboarding-tips">
              <div className="tip">
                <Search className="tip-icon" />
                <div>
                  <h4>Quick Search</h4>
                  <p>Search by chip type, OEM code, or vehicle details</p>
                </div>
              </div>
              <div className="tip">
                <Filter className="tip-icon" />
                <div>
                  <h4>Smart Filters</h4>
                  <p>
                    Use filters to narrow down results by make, model, and year
                  </p>
                </div>
              </div>
              <div className="tip">
                <Copy className="tip-icon" />
                <div>
                  <h4>Copy Credentials</h4>
                  <p>Click "Copy Creds" to get login details for portals</p>
                </div>
              </div>
            </div>
            <button onClick={closeOnboarding} className="btn-primary">
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by chip type, OEM code, vehicle details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </div>
        </form>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="filter-toggle"
        >
          <Filter />
          Filters
          {showFilters ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Make</label>
              <select
                value={filters.makeId || ""}
                onChange={(e) =>
                  handleFilterChange("makeId", e.target.value || null)
                }
                className="filter-select"
              >
                <option value="">All Makes</option>
                {makes.map((make) => (
                  <option key={make.id} value={make.id}>
                    {make.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Model</label>
              <select
                value={filters.modelId || ""}
                onChange={(e) =>
                  handleFilterChange("modelId", e.target.value || null)
                }
                className="filter-select"
                disabled={!filters.makeId}
              >
                <option value="">All Models</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Year From</label>
              <input
                type="number"
                min="1990"
                max="2024"
                value={filters.yearFrom || ""}
                onChange={(e) =>
                  handleFilterChange("yearFrom", e.target.value || null)
                }
                className="filter-input"
                placeholder="1990"
              />
            </div>

            <div className="filter-group">
              <label>Year To</label>
              <input
                type="number"
                min="1990"
                max="2024"
                value={filters.yearTo || ""}
                onChange={(e) =>
                  handleFilterChange("yearTo", e.target.value || null)
                }
                className="filter-input"
                placeholder="2024"
              />
            </div>

            <div className="filter-group">
              <label>System Type</label>
              <select
                value={filters.systemTypeId || ""}
                onChange={(e) =>
                  handleFilterChange("systemTypeId", e.target.value || null)
                }
                className="filter-select"
              >
                <option value="">All Systems</option>
                {systemTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Transponder Family</label>
              <select
                value={filters.transponderFamilyId || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "transponderFamilyId",
                    e.target.value || null
                  )
                }
                className="filter-select"
              >
                <option value="">All Families</option>
                {transponderFamilies.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button
              onClick={() => {
                setFilters({
                  makeId: null,
                  modelId: null,
                  yearFrom: null,
                  yearTo: null,
                  systemTypeId: null,
                  transponderFamilyId: null,
                });
                setSearchTerm("");
              }}
              className="btn-secondary"
            >
              Clear All
            </button>
            <button onClick={() => searchEntries(0)} className="btn-primary">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="results-section">
        <div className="results-header">
          <h3>Search Results</h3>
          <span className="results-count">
            {loading ? "Searching..." : `${totalElements} entries found`}
          </span>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching transponder database...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state">
            <Search className="empty-icon" />
            <h4>No results found</h4>
            <p>Try adjusting your search terms or filters</p>
          </div>
        ) : (
          <>
            <div className="results-grid">
              {results.map((entry) => (
                <ResultCard
                  key={entry.id}
                  entry={entry}
                  onCopyCredentials={handleCopyCredentials}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="pagination-btn"
                >
                  Previous
                </button>

                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`pagination-btn ${
                        currentPage === i ? "active" : ""
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Copy Warning Toast */}
      {showCopyWarning && (
        <div className="copy-warning">
          <AlertTriangle className="warning-icon" />
          <span>Copy protection active. This content is protected.</span>
          <button
            onClick={() => setShowCopyWarning(false)}
            className="close-warning"
          >
            <X />
          </button>
        </div>
      )}
    </div>
  );
};

// Result Card Component
const ResultCard = ({ entry, onCopyCredentials }) => {
  const [expanded, setExpanded] = useState(false);

  const vehicleRange = entry.vehicleRange;
  const model = vehicleRange?.model;
  const make = model?.make;

  const getYearRange = () => {
    if (vehicleRange.yearFrom && vehicleRange.yearTo) {
      return `${vehicleRange.yearFrom}-${vehicleRange.yearTo}`;
    } else if (vehicleRange.yearFrom) {
      return `${vehicleRange.yearFrom}+`;
    }
    return "N/A";
  };

  return (
    <div className="result-card">
      <div className="card-header">
        <div className="vehicle-info">
          <h4>
            {make?.name} {model?.name}
          </h4>
          <div className="vehicle-details">
            <span className="year-range">
              <Calendar className="icon-sm" />
              {getYearRange()}
            </span>
            {vehicleRange.yearNote && (
              <span className="year-note">{vehicleRange.yearNote}</span>
            )}
          </div>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="expand-btn">
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>

      <div className="card-content">
        <div className="info-row">
          <span className="label">System:</span>
          <span className="value">{entry.systemType?.name || "N/A"}</span>
        </div>

        <div className="info-row">
          <span className="label">Transponder:</span>
          <span className="value">
            {entry.transponderFamily?.name || "N/A"}
          </span>
        </div>

        {entry.transponderDetail && (
          <div className="info-row">
            <span className="label">Details:</span>
            <span className="value">{entry.transponderDetail.detail}</span>
          </div>
        )}

        {expanded && (
          <div className="expanded-content">
            {entry.crossRefs && entry.crossRefs.length > 0 && (
              <div className="info-section">
                <h5>Cross References</h5>
                <div className="tags">
                  {entry.crossRefs.map((ref, index) => (
                    <span key={index} className="tag">
                      {ref.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entry.oemKeys && entry.oemKeys.length > 0 && (
              <div className="info-section">
                <h5>OEM Keys</h5>
                <div className="oem-keys">
                  {entry.oemKeys.map((key, index) => (
                    <div key={index} className="oem-key">
                      <span className="key-code">{key.code}</span>
                      <button
                        onClick={() => onCopyCredentials(key.code)}
                        className="copy-btn"
                        title="Copy OEM key code"
                      >
                        <Copy className="icon-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {entry.notes && entry.notes.length > 0 && (
              <div className="info-section">
                <h5>Notes</h5>
                {entry.notes.map((note, index) => (
                  <p key={index} className="note-text">
                    {note.text}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card-actions">
        <button
          onClick={() =>
            onCopyCredentials(
              `Make: ${make?.name}\nModel: ${
                model?.name
              }\nYears: ${getYearRange()}\nSystem: ${
                entry.systemType?.name || "N/A"
              }\nTransponder: ${entry.transponderFamily?.name || "N/A"}`
            )
          }
          className="btn-secondary"
        >
          <Copy className="icon-sm" />
          Copy Summary
        </button>
      </div>
    </div>
  );
};

export default KchDatabase;
