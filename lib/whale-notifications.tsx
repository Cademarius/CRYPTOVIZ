"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { WhaleData } from "@/lib/types";
import { buildApiUrl } from "@/lib/api";

interface WhaleNotification extends WhaleData {
  id: string;
  read: boolean;
}

interface WhaleNotificationContextType {
  notifications: WhaleNotification[];
  unreadCount: number;
  connected: boolean;
  dismissNotification: (id: string) => void;
  dismissAll: () => void;
  markAllRead: () => void;
}

const WhaleNotificationContext = createContext<WhaleNotificationContextType>({
  notifications: [],
  unreadCount: 0,
  connected: false,
  dismissNotification: () => {},
  dismissAll: () => {},
  markAllRead: () => {},
});

export function useWhaleNotifications() {
  return useContext(WhaleNotificationContext);
}

export function WhaleNotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<WhaleNotification[]>([]);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const idCounter = useRef(0);

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout | null = null;

    function connect() {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const url = buildApiUrl("whales/stream");
      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.onopen = () => setConnected(true);

      es.addEventListener("whale", (event) => {
        try {
          const data = JSON.parse(event.data) as WhaleData;
          const notification: WhaleNotification = {
            ...data,
            id: `whale-${Date.now()}-${idCounter.current++}`,
            read: false,
          };
          setNotifications((prev) => [notification, ...prev].slice(0, 50));
        } catch {
          // ignore parse errors
        }
      });

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
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <WhaleNotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        connected,
        dismissNotification,
        dismissAll,
        markAllRead,
      }}
    >
      {children}
    </WhaleNotificationContext.Provider>
  );
}
