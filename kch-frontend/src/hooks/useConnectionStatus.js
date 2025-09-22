import { useState, useEffect, useMemo } from "react";

// Custom hook for monitoring connection status
export function useConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState("unknown");
  const [lastOnlineTime, setLastOnlineTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());

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

    // Update current time every second to prevent excessive re-renders
    const timeInterval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(timeInterval);

      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.removeEventListener(
          "message",
          handleServiceWorkerMessage
        );
      }
    };
  }, []);

  // Memoize calculated values to prevent infinite re-renders
  const offlineDuration = useMemo(() => {
    if (isOnline) return 0;
    return currentTime - lastOnlineTime;
  }, [isOnline, lastOnlineTime, currentTime]);

  const formattedOfflineDuration = useMemo(() => {
    const duration = offlineDuration;
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  }, [offlineDuration]);

  const isSlowConnection = useMemo(() => {
    return connectionType === "slow-2g" || connectionType === "2g";
  }, [connectionType]);

  const isGoodConnection = useMemo(() => {
    return connectionType === "4g" || connectionType === "3g";
  }, [connectionType]);

  return {
    isOnline,
    connectionType,
    lastOnlineTime,
    offlineDuration,
    formattedOfflineDuration,
    isSlowConnection,
    isGoodConnection,
  };
}

export default useConnectionStatus;
