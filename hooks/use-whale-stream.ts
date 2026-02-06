"use client";

import { useState, useEffect, useRef } from "react";
import type { WhaleData } from "@/lib/types";
import { API_BASE } from "@/lib/api";

export function useWhaleStream(symbol?: string) {
  const [alerts, setAlerts] = useState<WhaleData[]>([]);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout | null = null;

    function connect() {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const url = new URL("whales/stream", API_BASE);
      if (symbol) url.searchParams.set("symbol", symbol);

      const es = new EventSource(url.toString());
      eventSourceRef.current = es;

      es.onopen = () => setConnected(true);

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WhaleData;
          setAlerts((prev) => [data, ...prev].slice(0, 100));
        } catch {
          // ignore parse errors
        }
      };

      es.onerror = () => {
        setConnected(false);
        es.close();
        reconnectTimeout = setTimeout(connect, 5000);
      };
    }

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [symbol]);

  return { alerts, connected };
}
