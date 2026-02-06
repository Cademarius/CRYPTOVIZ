"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Fish,
  Newspaper,
  Activity,
  RefreshCw,
} from "lucide-react";
import WhaleNotificationBell from "@/components/whale-notification-bell";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, description: "Analytics overview" },
  { href: "/whales", label: "Whale Tracker", icon: Fish, description: "Large transactions" },
  { href: "/news", label: "News & Sentiment", icon: Newspaper, description: "Market sentiment" },
];

export default function Sidebar({ onRefresh, isRefreshing }: { onRefresh?: () => void; isRefreshing?: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/[0.04] bg-[#08080c]/90 backdrop-blur-2xl">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/[0.04] px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-400/15">
            <Activity className="h-5 w-5 text-indigo-400/80" />
          </div>
          <div>
            <span className="text-sm font-bold text-white/90 tracking-tight">CryptoViz</span>
            <div className="flex items-center gap-1.5">
              <div className="relative h-1.5 w-1.5">
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30" />
                <div className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[10px] text-white/25 font-medium">Live</span>
            </div>
          </div>
        </div>
        <WhaleNotificationBell />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="px-3 mb-3 text-[9px] font-bold text-white/15 uppercase tracking-[0.2em]">Navigation</p>
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 ${
                isActive
                  ? "glass-card border-indigo-400/10 text-indigo-400 glow-indigo"
                  : "border border-transparent text-white/35 hover:bg-white/[0.03] hover:text-white/60"
              }`}
            >
              <item.icon className={`h-4 w-4 ${isActive ? "text-indigo-400/80" : "text-white/20 group-hover:text-white/40"}`} />
              <div>
                <p className="text-[13px] font-medium leading-none">{item.label}</p>
                <p className={`text-[10px] mt-0.5 ${isActive ? "text-indigo-400/40" : "text-white/15"}`}>
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Refresh Button */}
      {onRefresh && (
        <div className="mx-3 mb-3">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="glass-card glass-shine flex w-full items-center justify-center gap-2.5 rounded-xl px-4 py-2.5 text-[11px] font-semibold text-white/50 tracking-wider uppercase transition-all duration-300 hover:text-white/80 hover:border-indigo-400/15 disabled:opacity-40"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-white/[0.03] px-5 py-3">
        <p className="text-[10px] text-white/15">CryptoViz v2.0</p>
      </div>
    </aside>
  );
}
