"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const API_URL = "http://localhost:3001";

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(false);
  const previousStatus = useRef<boolean | null>(null);

  const checkConnection = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/health`, {
        method: "GET",
        cache: "no-store",
      });

      const online = response.ok;

      // Only update when status changes
      if (previousStatus.current !== online) {
        previousStatus.current = online;
        setIsOnline(online);

        console.log(
          online ? "API Online" : "API Offline"
        );
      }
    } catch {
      // Backend is unavailable.
      // Don't throw or log the error.
      if (previousStatus.current !== false) {
        previousStatus.current = false;
        setIsOnline(false);

        console.log("API Offline");
      }
    }
  }, []);

  useEffect(() => {
    // Initial check
    void checkConnection();

    // Check every 15 seconds
    const interval = window.setInterval(() => {
      void checkConnection();
    }, 15000);

    return () => {
      window.clearInterval(interval);
    };
  }, [checkConnection]);

  return isOnline;
}