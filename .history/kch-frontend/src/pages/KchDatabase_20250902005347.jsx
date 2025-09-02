import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  AlertTriangle,
  Shield,
  Database,
  Calendar,
  Key,
  Car,
  Settings,
  Users,
  FileText,
  History,
  Globe,
  Home,
  DollarSign,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import TransponderAPI from "../services/transponderApi";
import AutocompleteSearch from "../components/AutocompleteSearch";
import { useAuth } from "../context/AuthContext";
import { canSeeAdmin, isSuper, isBaseUser } from "../utils/roles";
import { useNavigate } from "react-router-dom";

// Onboarding tips for new users
const ONBOARDING_TIPS = [
  {
    icon: <Search className="tip-icon" />,
    title: "Smart Search",
    description:
      "Search by chip type, OEM code, vehicle make/model, or any combination",
  },
  {
    icon: <Filter className="tip-icon" />,
    title: "Advanced Filters",
    description:
      "Use filters to narrow down results by year, system type, or transponder family",
  },
  {
    icon: <Copy className="tip-icon" />,
    title: "Quick Copy",
    description:
      "Click the copy button next to any OEM code to copy it to your clipboard",
  },
  {
    icon: <Shield className="tip-icon" />,
    title: "Security First",
    description:
      "All data is protected and usage is logged for security purposes",
  },
];

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
    pageSize: 20,
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
      const [makesData, systemTypesData, familiesData] = await Promise.all([
        TransponderAPI.getVehicleMakes(),
        TransponderAPI.getSystemTypes(),
        TransponderAPI.getTransponderFamilies(),
      ]);

      setMakes(makesData);
      setSystemTypes(systemTypesData);
      setTransponderFamilies(familiesData);
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
      const modelsData = await TransponderAPI.getModelsForMake(makeId);
      setModels(modelsData);
    } catch (error) {
      console.error("Error loading models:", error);
    }
  };

  const searchEntries = useCallback(
    async (page = 0, pageSize = 20) => {
      setLoading(true);

      try {
        const searchParams = {
          makeId: filters.makeId,
          modelId: filters.modelId,
          yearFrom: filters.yearFrom,
          yearTo: filters.yearTo,
          systemTypeId: filters.systemTypeId,
          transponderFamilyId: filters.transponderFamilyId,
          searchTerm: searchTerm.trim() || null,
          page,
          pageSize,
        };

        const data = await TransponderAPI.searchEntries(searchParams);

        setResults(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setCurrentPage(data.currentPage);
      } catch (error) {
        console.error("Error searching entries:", error);
        // Show user-friendly error message
        setResults([]);
        setTotalPages(0);
        setTotalElements(0);
        setCurrentPage(0);
      } finally {
        setLoading(false);
      }
    },
    [filters, searchTerm]
  );

  useEffect(() => {
    searchEntries(0, filters.pageSize);
  }, [searchEntries, filters.pageSize]);

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
    searchEntries(0, filters.pageSize);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    searchEntries(page, filters.pageSize);
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
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h4 className="text-lg font-bold text-white mb-2">
              {make?.name} {model?.name}
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="w-4 h-4" />
              <span>{getYearRange()}</span>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors duration-200"
          >
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-300" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-300" />
            )}
          </button>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-400">System:</span>
            <span className="text-sm text-white">
              {entry.systemType?.name || "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-400">
              Transponder:
            </span>
            <span className="text-sm text-white">
              {entry.transponderFamily?.name || "N/A"}
            </span>
          </div>

          {entry.transponderDetail && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-400">
                Details:
              </span>
              <span className="text-sm text-white">
                {entry.transponderDetail.detail}
              </span>
            </div>
          )}
        </div>

        {expanded && (
          <div className="border-t border-slate-700 pt-4 space-y-4">
            {entry.crossRefs && entry.crossRefs.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-white mb-2">
                  Cross References
                </h5>
                <div className="flex flex-wrap gap-2">
                  {entry.crossRefs.map((ref, index) => (
                    <span
                      key={index}
                      className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30"
                    >
                      {ref.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entry.oemKeys && entry.oemKeys.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-white mb-2">
                  OEM Keys
                </h5>
                <div className="space-y-2">
                  {entry.oemKeys.map((key, index) => (
                    <div
                      key={`oemkey-${entry.id}-${index}-${key.code}`}
                      className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3"
                    >
                      <span className="font-mono text-sm text-white">
                        {key.code}
                      </span>
                      <button
                        onClick={() => onCopyCredentials(key.code)}
                        className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors duration-200"
                        title="Copy OEM key code"
                      >
                        <Copy className="w-4 h-4 text-blue-300" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {entry.notes && entry.notes.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-white mb-2">Notes</h5>
                <div className="space-y-2">
                  {entry.notes.map((note, index) => (
                    <p
                      key={index}
                      className="text-sm text-gray-300 bg-slate-700/30 rounded-lg p-3"
                    >
                      {note.text}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-slate-700 pt-4 mt-4">
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
            className="w-full bg-slate-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-slate-600 shadow-lg flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Summary
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 lg:p-8 font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-yellow-500 text-white rounded-3xl p-8 mb-8 flex justify-between items-center shadow-2xl">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-4">
              <Car className="w-10 h-10" />
              KCH Key Chip Database
            </h1>
            <p className="text-xl opacity-90">
              Comprehensive automotive transponder and key chip information
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm">
            <Shield className="w-5 h-5" />
            <span>Protected Resource</span>
          </div>
        </div>

        {/* Onboarding Modal */}
        {showOnboarding && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-3xl p-12 max-w-2xl text-center shadow-2xl">
              <h2 className="text-3xl font-bold mb-8 text-white">
                Welcome to KCH Database! 🎉
              </h2>
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4 text-left p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <Search className="w-8 h-8 text-blue-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Quick Search
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Search by chip type, OEM code, or vehicle details
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-left p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <Filter className="w-8 h-8 text-blue-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Smart Filters
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Use filters to narrow down results by make, model, and
                      year
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-left p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <Copy className="w-8 h-8 text-blue-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Copy Credentials
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Click "Copy Creds" to get login details for portals
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={closeOnboarding}
                className="bg-gradient-to-r from-blue-500 to-yellow-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex gap-4 mb-8 items-center flex-wrap">
          <div className="flex-1 min-w-80">
            <AutocompleteSearch
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSubmit={handleSearch}
              placeholder="Search by chip type, OEM code, vehicle details..."
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              showFilters
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                : "bg-gradient-to-r from-slate-700/80 to-slate-800/80 text-gray-300 hover:text-white hover:bg-slate-600/80 border-2 border-slate-600/50 hover:border-blue-500/50"
            } shadow-lg`}
          >
            <Filter className="w-5 h-5" />
            Filters
            {showFilters ? (
              <ChevronUp className="w-5 h-5 transition-transform duration-300" />
            ) : (
              <ChevronDown className="w-5 h-5 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 mb-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-white text-sm">Make</label>
                <select
                  value={filters.makeId || ""}
                  onChange={(e) =>
                    handleFilterChange("makeId", e.target.value || null)
                  }
                  className="p-3 bg-slate-800/50 border-2 border-slate-600 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 text-white shadow-sm"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="" className="bg-slate-800 text-white">
                    All Makes
                  </option>
                  {makes.map((make) => (
                    <option
                      key={make.id}
                      value={make.id}
                      className="bg-slate-800 text-white flex items-center gap-2"
                    >
                      {make.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-white text-sm">
                  Model
                </label>
                <select
                  value={filters.modelId || ""}
                  onChange={(e) =>
                    handleFilterChange("modelId", e.target.value || null)
                  }
                  className={`p-3 bg-slate-800/50 border-2 border-slate-600 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 text-white shadow-sm ${
                    !filters.makeId ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!filters.makeId}
                  style={{ colorScheme: "dark" }}
                >
                  <option value="" className="bg-slate-800 text-white">
                    All Models
                  </option>
                  {models.map((model) => (
                    <option
                      key={model.id}
                      value={model.id}
                      className="bg-slate-800 text-white"
                    >
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-white text-sm">
                  Year From
                </label>
                <input
                  type="number"
                  min="1990"
                  max="2024"
                  value={filters.yearFrom || ""}
                  onChange={(e) =>
                    handleFilterChange("yearFrom", e.target.value || null)
                  }
                  className="p-3 bg-slate-800/50 border-2 border-slate-600 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 text-white shadow-sm placeholder-gray-400"
                  placeholder="1990"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-white text-sm">
                  Year To
                </label>
                <input
                  type="number"
                  min="1990"
                  max="2024"
                  value={filters.yearTo || ""}
                  onChange={(e) =>
                    handleFilterChange("yearTo", e.target.value || null)
                  }
                  className="p-3 bg-slate-800/50 border-2 border-slate-600 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 text-white shadow-sm placeholder-gray-400"
                  placeholder="2024"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-white text-sm">
                  System Type
                </label>
                <select
                  value={filters.systemTypeId || ""}
                  onChange={(e) =>
                    handleFilterChange("systemTypeId", e.target.value || null)
                  }
                  className="p-3 bg-slate-800/50 border-2 border-slate-600 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 text-white shadow-sm"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="" className="bg-slate-800 text-white">
                    All Systems
                  </option>
                  {systemTypes.map((type) => (
                    <option
                      key={type.id}
                      value={type.id}
                      className="bg-slate-800 text-white"
                    >
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-white text-sm">
                  Transponder Family
                </label>
                <select
                  value={filters.transponderFamilyId || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "transponderFamilyId",
                      e.target.value || null
                    )
                  }
                  className="p-3 bg-slate-800/50 border-2 border-slate-600 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 text-white shadow-sm"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="" className="bg-slate-800 text-white">
                    All Families
                  </option>
                  {transponderFamilies.map((family) => (
                    <option
                      key={family.id}
                      value={family.id}
                      className="bg-slate-800 text-white"
                    >
                      {family.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setFilters({
                    makeId: null,
                    modelId: null,
                    yearFrom: null,
                    yearTo: null,
                    systemTypeId: null,
                    transponderFamilyId: null,
                    pageSize: 20,
                  });
                  setSearchTerm("");
                }}
                className="bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-slate-600 shadow-lg"
              >
                Clear All
              </button>
              <button
                onClick={() => searchEntries(0, filters.pageSize)}
                className="bg-gradient-to-r from-blue-500 to-yellow-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-white">Search Results</h3>
            <div className="bg-gradient-to-r from-blue-500/20 to-yellow-500/20 border border-blue-500/30 rounded-xl px-4 py-2">
              <span className="text-blue-400 font-semibold">
                {loading ? "Searching..." : `${totalElements} entries found`}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-300 text-lg">
                Searching transponder database...
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-xl flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">
                No results found
              </h4>
              <p className="text-gray-300">
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-700">
                  {/* Page Size Selector */}
                  <div className="flex items-center gap-3">
                    <span className="text-gray-200 text-sm font-medium">
                      Show:
                    </span>
                    <select
                      value={filters.pageSize || 20}
                      onChange={(e) => {
                        const newPageSize = parseInt(e.target.value);
                        setFilters((prev) => ({
                          ...prev,
                          pageSize: newPageSize,
                        }));
                        setCurrentPage(0);
                        searchEntries(0, newPageSize);
                      }}
                      className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-medium shadow-sm"
                      style={{ colorScheme: "dark" }}
                    >
                      <option
                        value={10}
                        className="bg-slate-700 text-white hover:bg-slate-600"
                      >
                        10
                      </option>
                      <option
                        value={20}
                        className="bg-slate-700 text-white hover:bg-slate-600"
                      >
                        20
                      </option>
                      <option
                        value={50}
                        className="bg-slate-700 text-white hover:bg-slate-600"
                      >
                        50
                      </option>
                      <option
                        value={100}
                        className="bg-slate-700 text-white hover:bg-slate-600"
                      >
                        100
                      </option>
                    </select>
                    <span className="text-gray-200 text-sm font-medium">
                      per page
                    </span>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-slate-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="flex gap-2">
                      {/* First page */}
                      {currentPage > 2 && (
                        <>
                          <button
                            onClick={() => handlePageChange(0)}
                            className="px-4 py-2 rounded-xl font-semibold transition-all duration-300 bg-slate-700 text-white hover:bg-slate-600 shadow-lg"
                          >
                            1
                          </button>
                          {currentPage > 3 && (
                            <span className="px-2 py-2 text-gray-400">...</span>
                          )}
                        </>
                      )}

                      {/* Page range around current page */}
                      {(() => {
                        // Create a unique array of page numbers
                        const pageNumbers = [];
                        const start = Math.max(0, currentPage - 2);
                        const end = Math.min(totalPages - 1, currentPage + 2);

                        for (let i = start; i <= end; i++) {
                          if (!pageNumbers.includes(i)) {
                            pageNumbers.push(i);
                          }
                        }

                        return pageNumbers.map((pageNum, index) => (
                          <button
                            key={`pagination-${pageNum}-${index}-${currentPage}`}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                              currentPage === pageNum
                                ? "bg-gradient-to-r from-blue-500 to-yellow-500 text-white shadow-lg"
                                : "bg-slate-700 text-white hover:bg-slate-600 shadow-lg"
                            }`}
                          >
                            {pageNum + 1}
                          </button>
                        ));
                      })()}

                      {/* Last page */}
                      {currentPage < totalPages - 3 && (
                        <>
                          {currentPage < totalPages - 4 && (
                            <span className="px-2 py-2 text-gray-400">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(totalPages - 1)}
                            className="px-4 py-2 rounded-xl font-semibold transition-all duration-300 bg-slate-700 text-white hover:bg-slate-600 shadow-lg"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                      className="bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-slate-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>

                  {/* Page Info */}
                  <div className="text-gray-200 text-sm font-medium">
                    Page {currentPage + 1} of {totalPages}
                  </div>

                  {/* Go to page input */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-800/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-slate-600 shadow-lg">
                    <span className="text-gray-200 text-sm font-medium">
                      Go to:
                    </span>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={currentPage + 1}
                      onChange={(e) => {
                        const pageNum = parseInt(e.target.value) - 1;
                        if (pageNum >= 0 && pageNum < totalPages) {
                          handlePageChange(pageNum);
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          const pageNum = parseInt(e.target.value) - 1;
                          if (pageNum >= 0 && pageNum < totalPages) {
                            handlePageChange(pageNum);
                          }
                        }
                      }}
                      className="w-16 bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-center font-medium shadow-sm"
                      style={{ backgroundColor: "#374151", color: "white" }}
                      placeholder="Page"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Copy Warning Toast */}
        {showCopyWarning && (
          <div className="fixed bottom-6 right-6 bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4 shadow-2xl z-50 max-w-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-100 flex-shrink-0" />
              <span className="text-yellow-100 text-sm font-medium">
                Copy protection active. This content is protected.
              </span>
              <button
                onClick={() => setShowCopyWarning(false)}
                className="text-yellow-100 hover:text-white transition-colors duration-200 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KchDatabase;
