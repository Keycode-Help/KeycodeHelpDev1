import { useState, useEffect } from "react";

// Custom hook for monitoring connection status
export function useConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState("unknown");
  const [lastOnlineTime, setLastOnlineTime] = useState(Date.now());

  useEffect(() => {
    // Handle online/offline events
    const handleOnline = () => {
      console.log("🌐 Connection: Online");
      setIsOnline(true);
      setLastOnlineTime(Date.now());
    };

    const handleOffline = () => {
      console.log("📴 Connection: Offline");
      setIsOnline(false);
    };

    // Listen for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for Service Worker messages
    const handleServiceWorkerMessage = (event) => {
      if (event.data?.type === "CONNECTION_STATUS") {
        if (event.data.status === "online") {
          handleOnline();
        } else if (event.data.status === "offline") {
          handleOffline();
        }
      }
    };

    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener(
        "message",
        handleServiceWorkerMessage
      );
    }

    // Detect connection type if available
    const detectConnectionType = () => {
      if ("connection" in navigator) {
        const connection = navigator.connection;
        setConnectionType(
          connection.effectiveType || connection.type || "unknown"
        );
      }
    };

    detectConnectionType();

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.removeEventListener(
          "message",
          handleServiceWorkerMessage
        );
      }
    };
  }, []);

  // Calculate offline duration
  const getOfflineDuration = () => {
    if (isOnline) return 0;
    return Date.now() - lastOnlineTime;
  };

  // Format offline duration
  const getFormattedOfflineDuration = () => {
    const duration = getOfflineDuration();
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  // Check if connection is slow
  const isSlowConnection = () => {
    return connectionType === "slow-2g" || connectionType === "2g";
  };

  // Check if connection is good
  const isGoodConnection = () => {
    return connectionType === "4g" || connectionType === "3g";
  };

  return {
    isOnline,
    connectionType,
    lastOnlineTime,
    offlineDuration: getOfflineDuration(),
    formattedOfflineDuration: getFormattedOfflineDuration(),
    isSlowConnection: isSlowConnection(),
    isGoodConnection: isGoodConnection(),
  };
}

export default useConnectionStatus;
