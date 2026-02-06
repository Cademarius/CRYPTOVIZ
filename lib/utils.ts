import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number | null): string {
  if (price === null) return "N/A";
  if (price >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(price);
}

export function formatVolume(volume: number | null): string {
  if (volume === null) return "N/A";
  if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(2)}M`;
  if (volume >= 1_000) return `${(volume / 1_000).toFixed(2)}K`;
  return volume.toFixed(2);
}

export function formatPercent(value: number | null): string {
  if (value === null) return "N/A";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function symbolToSlug(symbol: string): string {
  return encodeURIComponent(symbol.replace("/", "-"));
}

export function slugToSymbol(slug: string): string {
  return decodeURIComponent(slug).replace("-", "/");
}

export function getSentimentColor(sentiment: string | null): string {
  if (!sentiment) return "text-zinc-400";
  const s = sentiment.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  switch (s) {
    case "positive":
    case "bullish":
    case "favorable":
      return "text-emerald-500";
    case "negative":
    case "bearish":
    case "defavorable":
      return "text-red-500";
    default:
      return "text-amber-500";
  }
}

export function getSentimentBg(sentiment: string | null): string {
  if (!sentiment) return "bg-zinc-500/10";
  const s = sentiment.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  switch (s) {
    case "positive":
    case "bullish":
    case "favorable":
      return "bg-emerald-500/10";
    case "negative":
    case "bearish":
    case "defavorable":
      return "bg-red-500/10";
    default:
      return "bg-amber-500/10";
  }
}
