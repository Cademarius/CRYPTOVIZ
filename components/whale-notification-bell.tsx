"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWhaleNotifications } from "@/lib/whale-notifications";
import { formatDateTime, formatVolume } from "@/lib/utils";
import WhaleIcon from "@/components/icons/whale-icon";
import { Bell, X, ExternalLink, Volume2, VolumeX } from "lucide-react";

export default function WhaleNotificationBell() {
  const {
    notifications,
    unreadCount,
    connected,
    dismissNotification,
    dismissAll,
    markAllRead,
  } = useWhaleNotifications();
  const [open, setOpen] = useState(false);
  const [toasts, setToasts] = useState<string[]>([]);
  const [muted, setMuted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(notifications.length);
  const router = useRouter();

  // Show toast when new notification arrives
  useEffect(() => {
    if (muted) {
      prevCountRef.current = notifications.length;
      return;
    }
    if (notifications.length > prevCountRef.current && notifications.length > 0) {
      const newest = notifications[0];
      const toastId = newest.id;
      // Use microtask to avoid sync setState in effect
      queueMicrotask(() => {
        setToasts((prev) => [toastId, ...prev].slice(0, 3));
      });
      // Auto-dismiss toast after 5s
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((id) => id !== toastId));
      }, 5000);
      prevCountRef.current = notifications.length;
      return () => clearTimeout(timer);
    }
    prevCountRef.current = notifications.length;
  }, [notifications, muted]);

  // Close panel on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleOpenPanel = () => {
    setOpen(!open);
    if (!open) markAllRead();
  };

  const handleGoToWhales = () => {
    setOpen(false);
    router.push("/whales");
  };

  // Toast notifications at the top
  const activeToasts = notifications.filter((n) => toasts.includes(n.id));

  return (
    <>
      {/* ── Toast notifications (bottom-right) ── */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col-reverse gap-2 pointer-events-none">
        {activeToasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto glass-card glass-shine rounded-xl border-indigo-400/15 px-4 py-3 flex items-center gap-3 animate-fade-in-up min-w-80 max-w-96 shadow-2xl shadow-black/40"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                toast.side === "buy"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              <WhaleIcon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-white/85">
                  🐋 Whale Alert
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                    toast.side === "buy"
                      ? "bg-emerald-400/10 text-emerald-400"
                      : "bg-red-400/10 text-red-400"
                  }`}
                >
                  {toast.side}
                </span>
              </div>
              <p className="text-[10px] text-white/40 mt-0.5">
                {toast.symbol} — {formatVolume(toast.qty)}
              </p>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((id) => id !== toast.id))}
              className="shrink-0 text-white/20 hover:text-white/50 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* ── Bell + Panel ── */}
      <div ref={panelRef} className="relative">
        {/* Bell button */}
        <button
          onClick={handleOpenPanel}
          className="relative glass-card glass-shine rounded-xl p-2.5 transition-all hover:border-white/10 group"
        >
          <Bell className="h-4 w-4 text-white/40 group-hover:text-white/70 transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-red-500/30 animate-fade-in-up">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
          {/* Connection dot */}
          <div
            className={`absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full ${
              connected ? "bg-emerald-400" : "bg-red-400"
            }`}
          />
        </button>

        {/* Dropdown panel */}
        {open && (
          <div className="absolute top-full right-0 z-[90] mt-2 w-96 rounded-2xl border border-white/[0.06] bg-[#0c0c14]/98 backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden animate-fade-in-up">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-white/[0.05] px-4 py-3">
              <div className="flex items-center gap-2">
                <WhaleIcon className="h-4 w-4 text-indigo-400/60" />
                <span className="text-xs font-bold text-white/80">Whale Alerts</span>
                {notifications.length > 0 && (
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/30">
                    {notifications.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMuted(!muted)}
                  className="rounded-lg p-1.5 text-white/20 hover:text-white/50 hover:bg-white/5 transition-all"
                  title={muted ? "Unmute notifications" : "Mute notifications"}
                >
                  {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </button>
                {notifications.length > 0 && (
                  <button
                    onClick={dismissAll}
                    className="rounded-lg px-2 py-1 text-[10px] text-white/25 hover:text-white/50 hover:bg-white/5 transition-all"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Notification list */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.slice(0, 20).map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-center gap-3 border-b border-white/[0.03] px-4 py-3 transition-all hover:bg-white/[0.02] ${
                      !n.read ? "bg-indigo-400/[0.02]" : ""
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        n.side === "buy"
                          ? "bg-emerald-500/8 text-emerald-400"
                          : "bg-red-500/8 text-red-400"
                      }`}
                    >
                      <WhaleIcon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-white/80">
                          {n.symbol}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                            n.side === "buy"
                              ? "bg-emerald-400/10 text-emerald-400"
                              : "bg-red-400/10 text-red-400"
                          }`}
                        >
                          {n.side}
                        </span>
                        {!n.read && (
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        )}
                      </div>
                      <p className="text-[10px] text-white/25 mt-0.5">
                        {formatVolume(n.qty)} — {formatDateTime(n.timestamp)}
                      </p>
                    </div>
                    <button
                      onClick={() => dismissNotification(n.id)}
                      className="shrink-0 text-white/10 hover:text-white/40 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-white/15">
                  <WhaleIcon className="h-8 w-8 mb-2" />
                  <p className="text-[11px]">No whale alerts yet</p>
                </div>
              )}
            </div>

            {/* Panel footer */}
            {notifications.length > 0 && (
              <div className="border-t border-white/[0.05] px-4 py-2.5">
                <button
                  onClick={handleGoToWhales}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-[11px] font-semibold text-indigo-400/70 hover:bg-indigo-400/5 hover:text-indigo-400 transition-all"
                >
                  <span>View all in Whale Tracker</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
