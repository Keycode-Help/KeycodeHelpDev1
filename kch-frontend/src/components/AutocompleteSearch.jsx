import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  Clock,
  ChevronRight,
  Sparkles,
  TrendingUp,
  History,
  Car,
  Key,
  Database,
} from "lucide-react";
import TransponderAPI from "../services/transponderApi";

const AutocompleteSearch = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search by chip type, OEM code, vehicle details...",
  className = "",
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const recent = JSON.parse(
      localStorage.getItem("kch-recent-searches") || "[]"
    );
    setRecentSearches(recent.slice(0, 5));
    loadPopularSearches();
  }, []);

  // Load popular searches
  const loadPopularSearches = async () => {
    try {
      const popular = await TransponderAPI.getPopularSearches();
      setPopularSearches(popular.slice(0, 5));
    } catch (error) {
      console.error("Error loading popular searches:", error);
    }
  };

  // Debounced search suggestions
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value && value.trim().length >= 2) {
      debounceRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const searchSuggestions = await TransponderAPI.getSearchSuggestions(
            value.trim(),
            8
          );
          setSuggestions(searchSuggestions);
        } catch (error) {
          console.error("Error getting suggestions:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value]);

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  // Handle input blur (with delay to allow clicking suggestions)
  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    const allSuggestions = [
      ...suggestions,
      ...(value.trim().length < 2
        ? recentSearches.map((term) => ({
            suggestion: term,
            suggestion_type: "recent",
          }))
        : []),
      ...(value.trim().length < 2
        ? popularSearches.map((item) => ({
            suggestion: item.search_term,
            suggestion_type: "popular",
          }))
        : []),
    ];

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < allSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : allSuggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && allSuggestions[selectedIndex]) {
          selectSuggestion(allSuggestions[selectedIndex].suggestion);
        } else {
          handleSubmit(e);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Select a suggestion
  const selectSuggestion = (suggestion) => {
    onChange({ target: { value: suggestion } });
    addToRecentSearches(suggestion);
    setShowSuggestions(false);

    // Trigger search immediately
    setTimeout(() => {
      onSubmit?.({ preventDefault: () => {} });
    }, 100);
  };

  // Add to recent searches
  const addToRecentSearches = (term) => {
    if (!term.trim()) return;

    const recent = JSON.parse(
      localStorage.getItem("kch-recent-searches") || "[]"
    );
    const filtered = recent.filter(
      (item) => item.toLowerCase() !== term.toLowerCase()
    );
    const updated = [term, ...filtered].slice(0, 10);

    localStorage.setItem("kch-recent-searches", JSON.stringify(updated));
    setRecentSearches(updated.slice(0, 5));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      addToRecentSearches(value.trim());
    }
    onSubmit?.(e);
    setShowSuggestions(false);
  };

  // Clear search
  const clearSearch = () => {
    onChange({ target: { value: "" } });
    inputRef.current?.focus();
  };

  // Get suggestion icon
  const getSuggestionIcon = (type) => {
    switch (type) {
      case "make":
        return <Car className="w-4 h-4 text-blue-400" />;
      case "model":
        return <Car className="w-4 h-4 text-green-400" />;
      case "transponder":
        return <Key className="w-4 h-4 text-yellow-400" />;
      case "recent":
        return <History className="w-4 h-4 text-purple-400" />;
      case "popular":
        return <TrendingUp className="w-4 h-4 text-orange-400" />;
      default:
        return <Database className="w-4 h-4 text-gray-400" />;
    }
  };

  // Get suggestions to display
  const getSuggestionsToDisplay = () => {
    if (value && value.trim().length >= 2) {
      return suggestions;
    }

    const combined = [];
    if (recentSearches.length > 0) {
      combined.push(
        { suggestion: "Recent Searches", suggestion_type: "header" },
        ...recentSearches.map((term) => ({
          suggestion: term,
          suggestion_type: "recent",
        }))
      );
    }

    if (popularSearches.length > 0) {
      if (combined.length > 0)
        combined.push({ suggestion: "", suggestion_type: "divider" });
      combined.push(
        { suggestion: "Popular Searches", suggestion_type: "header" },
        ...popularSearches.map((item) => ({
          suggestion: item.search_term,
          suggestion_type: "popular",
        }))
      );
    }

    return combined;
  };

  const suggestionsToShow = getSuggestionsToDisplay();

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative w-full transition-all duration-300 shadow-lg">
          {/* Search Input Container */}
          <div className="relative flex items-center bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-600/50 rounded-2xl overflow-hidden shadow-lg">
            {/* Left Icon */}
            <div
              className={`flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-r border-slate-600/30 transition-all duration-300 ${
                isFocused
                  ? "from-blue-500/30 to-purple-500/30"
                  : "from-blue-500/20 to-purple-500/20"
              }`}
            >
              <Search
                className={`w-7 h-7 text-blue-400 transition-all duration-300 ${
                  isFocused ? "scale-110" : "scale-100"
                }`}
              />
            </div>

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent px-6 py-5 text-white placeholder-gray-400 text-lg font-medium focus:outline-none transition-all duration-300 min-w-0"
              autoComplete="off"
              spellCheck="false"
            />

            {/* Clear Button */}
            {value && (
              <button
                type="button"
                onClick={clearSearch}
                className="flex items-center justify-center w-12 h-12 mx-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-full transition-all duration-200 group hover:scale-110"
                tabIndex="-1"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
              </button>
            )}

            {/* Search Button */}
            <button
              type="submit"
              className="flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 border-l border-slate-600/30"
            >
              <Sparkles className="w-5 h-5" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </form>

      {/* Enhanced Suggestions Dropdown */}
      {showSuggestions && (suggestionsToShow.length > 0 || isLoading) && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-600/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 transform transition-all duration-300 ease-out"
        >
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center gap-3 p-4 text-gray-300">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="font-medium">Searching...</span>
            </div>
          )}

          {/* Suggestions List */}
          {suggestionsToShow.map((item, index) => {
            if (item.suggestion_type === "header") {
              return (
                <div
                  key={`header-${index}`}
                  className="px-4 py-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border-b border-slate-600/30"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-400 uppercase tracking-wide">
                    {item.suggestion === "Recent Searches" ? (
                      <History className="w-4 h-4" />
                    ) : (
                      <TrendingUp className="w-4 h-4" />
                    )}
                    {item.suggestion}
                  </div>
                </div>
              );
            }

            if (item.suggestion_type === "divider") {
              return (
                <div
                  key={`divider-${index}`}
                  className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mx-4"
                ></div>
              );
            }

            return (
              <div
                key={`suggestion-${index}`}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 group ${
                  selectedIndex === index
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-l-4 border-blue-400"
                    : "hover:bg-slate-700/50 border-l-4 border-transparent"
                }`}
                onClick={() => selectSuggestion(item.suggestion)}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  {getSuggestionIcon(item.suggestion_type)}
                </div>

                {/* Text */}
                <span
                  className={`flex-1 font-medium transition-colors duration-200 ${
                    selectedIndex === index
                      ? "text-white"
                      : "text-gray-300 group-hover:text-white"
                  }`}
                >
                  {item.suggestion}
                </span>

                {/* Count Badge */}
                {item.count && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30">
                    {item.count}
                  </span>
                )}

                {/* Arrow */}
                <ChevronRight
                  className={`w-4 h-4 transition-all duration-200 ${
                    selectedIndex === index
                      ? "text-blue-400 translate-x-1"
                      : "text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1"
                  }`}
                />
              </div>
            );
          })}

          {/* No Results */}
          {!isLoading &&
            suggestionsToShow.length === 0 &&
            value.trim().length >= 2 && (
              <div className="flex items-center gap-3 p-4 text-gray-400">
                <Search className="w-4 h-4" />
                <span>No suggestions found</span>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default AutocompleteSearch;
