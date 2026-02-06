import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-indigo-400/80" />
        <span className="text-[11px] text-white/30 tracking-widest uppercase">Loading</span>
      </div>
    </div>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`glass-card glass-shine rounded-2xl p-5 ${className}`}>
      <div className="skeleton h-3 w-20 mb-3" />
      <div className="skeleton h-7 w-28 mb-2" />
      <div className="skeleton h-3 w-16" />
    </div>
  );
}

export function SkeletonChart({ height = 200 }: { height?: number }) {
  return (
    <div className="glass-card glass-shine rounded-2xl p-5">
      <div className="skeleton h-4 w-40 mb-4" />
      <div className="skeleton w-full" style={{ height }} />
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-500/15 bg-red-500/5 backdrop-blur-sm px-4 py-3 text-sm text-red-400/90 flex items-center gap-2.5">
      <div className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
      {message}
    </div>
  );
}

export function Card({
  title,
  children,
  className = "",
  action,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={`glass-card glass-shine rounded-2xl p-5 transition-all duration-300 ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h3 className="text-[12px] font-semibold tracking-widest text-white/40 uppercase">
              {title}
            </h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  accent = "default",
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  accent?: "default" | "indigo" | "emerald" | "amber" | "red";
}) {
  const accentGlow = {
    default: "",
    indigo: "glow-indigo",
    emerald: "glow-emerald",
    amber: "glow-amber",
    red: "glow-red",
  };

  const accentBorderColor = {
    default: "border-white/[0.04]",
    indigo: "border-indigo-400/10",
    emerald: "border-emerald-400/10",
    amber: "border-amber-400/10",
    red: "border-red-400/10",
  };

  const iconColor = {
    default: "text-white/20",
    indigo: "text-indigo-400/50",
    emerald: "text-emerald-400/50",
    amber: "text-amber-400/50",
    red: "text-red-400/50",
  };

  return (
    <div className={`glass-card glass-shine rounded-2xl p-5 transition-all duration-300 ${accentBorderColor[accent]} ${accentGlow[accent]}`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">{label}</p>
        {icon && <div className={iconColor[accent]}>{icon}</div>}
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-white/90">{value}</p>
    </div>
  );
}

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "danger" | "warning";
}) {
  const colors = {
    default: "bg-white/5 text-white/60 border-white/[0.06]",
    success: "bg-emerald-400/8 text-emerald-400/90 border-emerald-400/15",
    danger: "bg-red-400/8 text-red-400/90 border-red-400/15",
    warning: "bg-amber-400/8 text-amber-400/90 border-amber-400/15",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wider ${colors[variant]}`}
    >
      {children}
    </span>
  );
}

export function TabGroup({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: { label: string; value: string }[];
  activeTab: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="glass-card flex items-center rounded-xl p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`relative rounded-lg px-3.5 py-1.5 text-[11px] font-semibold tracking-wide transition-all duration-200 ${
            activeTab === tab.value
              ? "bg-indigo-500/80 text-white shadow-lg shadow-indigo-500/20"
              : "text-white/30 hover:text-white/60"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
