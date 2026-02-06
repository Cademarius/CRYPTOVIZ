"use client";

import { useState, useMemo } from "react";
import { useNews, useSymbols } from "@/hooks/use-api";
import { LoadingSpinner, ErrorMessage } from "@/components/ui";
import Sidebar from "@/components/sidebar";
import { formatDateTime } from "@/lib/utils";
import {
  Newspaper,
  RefreshCw,
  Filter,
} from "lucide-react";

/* ── Crypto symbol colors ── */
const CRYPTO_BADGE_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  "BTC/USD": { bg: "bg-amber-400/8", text: "text-amber-400/90", border: "border-amber-400/12", dot: "bg-amber-400" },
  "ETH/USD": { bg: "bg-blue-400/8", text: "text-blue-400/90", border: "border-blue-400/12", dot: "bg-blue-400" },
  "XRP/USD": { bg: "bg-slate-300/8", text: "text-slate-300/90", border: "border-slate-300/12", dot: "bg-slate-300" },
  "BNB/USD": { bg: "bg-yellow-400/8", text: "text-yellow-400/90", border: "border-yellow-400/12", dot: "bg-yellow-400" },
  "USDT/USD": { bg: "bg-emerald-400/8", text: "text-emerald-400/90", border: "border-emerald-400/12", dot: "bg-emerald-400" },
};
const DEFAULT_CRYPTO_BADGE = { bg: "bg-indigo-400/8", text: "text-indigo-400/90", border: "border-indigo-400/12", dot: "bg-indigo-400" };

/* ── Sentiment helpers ── */
function normalizeSentiment(s: string): "positive" | "negative" | "neutral" {
  const lower = s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (lower === "positive" || lower === "bullish" || lower === "favorable") return "positive";
  if (lower === "negative" || lower === "bearish" || lower === "defavorable") return "negative";
  if (lower === "neutral" || lower === "neutre") return "neutral";
  return "neutral";
}

const SENTIMENT_CONFIG = {
  positive: {
    label: "Favorable",
    bg: "bg-emerald-400/8",
    text: "text-emerald-400",
    border: "border-emerald-400/15",
  },
  negative: {
    label: "Défavorable",
    bg: "bg-red-400/8",
    text: "text-red-400",
    border: "border-red-400/15",
  },
  neutral: {
    label: "Neutre",
    bg: "bg-amber-400/8",
    text: "text-amber-400",
    border: "border-amber-400/15",
  },
};

const ARTICLE_COUNTS = [10, 25, 50, 100];

export default function NewsPage() {
  const [filterSymbol, setFilterSymbol] = useState<string>("");
  const [articleCount, setArticleCount] = useState<number>(50);
  const { data: symbols } = useSymbols();
  const { data, loading, error, refetch } = useNews(filterSymbol || undefined, articleCount);

  /* ── Filtered data ── */
  const filteredNews = useMemo(() => {
    if (!data) return [];
    return data.data;
  }, [data]);

  return (
    <>
      <Sidebar />
      <div className="space-y-5 max-w-400 mx-auto">
        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-white/90 tracking-tight">News & Sentiment</h1>
            <p className="mt-1 text-xs text-white/25">
              AI-powered sentiment analysis on crypto news
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="glass-card flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-white/40 transition-all hover:text-white/70 hover:border-white/10 disabled:opacity-40 self-start sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* ── Filters Bar ── */}
        <div className="glass-card glass-shine rounded-2xl px-5 py-3.5 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-white/25">
            <Filter className="h-3.5 w-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Filters</span>
          </div>

          <div className="h-4 w-px bg-white/[0.06]" />

          {/* Crypto filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/30 uppercase tracking-wider">Crypto</span>
            <select
              value={filterSymbol}
              onChange={(e) => setFilterSymbol(e.target.value)}
              className="rounded-lg border border-white/[0.06] bg-[#0c0c14] px-2.5 py-1.5 text-[11px] text-white/70 focus:border-indigo-400/20 focus:outline-none transition-colors [&>option]:bg-[#0c0c14] [&>option]:text-white/70"
            >
              <option value="">All</option>
              {symbols?.symbols.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Article count */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/30 uppercase tracking-wider">Show</span>
            <div className="flex items-center rounded-lg border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              {ARTICLE_COUNTS.map((count) => (
                <button
                  key={count}
                  onClick={() => setArticleCount(count)}
                  className={`px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                    articleCount === count
                      ? "bg-indigo-500/80 text-white"
                      : "text-white/30 hover:text-white/60 hover:bg-white/[0.03]"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Result count */}
          <div className="ml-auto text-[10px] text-white/20">
            {filteredNews.length} article{filteredNews.length !== 1 ? "s" : ""}
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* ── News Feed ── */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredNews.length > 0 ? (
          <div className="space-y-2">
            {filteredNews.map((n, i) => {
              const sentiment = normalizeSentiment(n.sentiment);
              const config = SENTIMENT_CONFIG[sentiment];
              const cryptoColor = CRYPTO_BADGE_COLORS[n.symbol] || DEFAULT_CRYPTO_BADGE;

              return (
                <div
                  key={i}
                  className="glass-card glass-shine rounded-2xl p-4 transition-all duration-300"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Left: Crypto Badge */}
                    <div className="shrink-0 mt-0.5">
                      <div className={`flex items-center gap-1.5 rounded-lg border ${cryptoColor.bg} ${cryptoColor.border} px-2 py-1`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${cryptoColor.dot}`} />
                        <span className={`text-[10px] font-bold ${cryptoColor.text}`}>
                          {n.symbol.replace("/USD", "")}
                        </span>
                      </div>
                    </div>

                    {/* Center: Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[13px] font-semibold text-white/85 leading-snug flex-1">
                          {n.title}
                        </h3>
                        
                        {/* Right: Sentiment badge */}
                        <div className="shrink-0">
                          <div className={`flex items-center gap-1.5 rounded-lg border ${config.bg} ${config.border} px-2 py-0.5`}>
                            <span className={`text-[10px] font-semibold ${config.text}`}>
                              {config.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      {n.summary && (
                        <p className="mt-1.5 text-[11px] text-white/30 leading-relaxed line-clamp-2">
                          {n.summary}
                        </p>
                      )}

                      {/* Meta row */}
                      <div className="mt-3 flex items-center gap-3 flex-wrap">
                        {/* Confidence */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-white/20">Confidence</span>
                          <span className="text-[10px] font-semibold text-white/50">
                            {n.confidence.toFixed(0)}%
                          </span>
                        </div>

                        <div className="h-3 w-px bg-white/[0.06]" />

                        {/* Source & time */}
                        <div className="flex items-center gap-2 text-[10px] text-white/20">
                          <span className="flex items-center gap-1">
                            <Newspaper className="h-2.5 w-2.5" />
                            {n.source}
                          </span>
                          <span className="text-white/10">•</span>
                          <span>{formatDateTime(n.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card glass-shine rounded-2xl flex flex-col items-center justify-center py-16 text-white/20">
            <Newspaper className="h-10 w-10 mb-3" />
            <p className="text-sm font-medium">No articles found</p>
            <p className="text-[11px] text-white/15 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </>
  );
}
