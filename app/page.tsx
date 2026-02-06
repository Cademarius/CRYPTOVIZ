"use client";

import { useState, useCallback } from "react";
import {
  useSymbols,
  useTradesAggregated1Min,
  useTradesAggregated1H,
  useBuySell,
  useVelocity,
  useWhales,
  useNews,
} from "@/hooks/use-api";
import {
  ErrorMessage,
  Card,
  StatCard,
  Badge,
  TabGroup,
  SkeletonCard,
  SkeletonChart,
} from "@/components/ui";
import Sidebar from "@/components/sidebar";
import {
  formatPrice,
  formatPercent,
  formatVolume,
  formatDateTime,
  getSentimentColor,
  getSentimentBg,
} from "@/lib/utils";
import PriceChart from "@/components/charts/price-chart";
import BuySellChart from "@/components/charts/buy-sell-chart";
import VelocityChart from "@/components/charts/velocity-chart";
import TradesChart from "@/components/charts/trades-chart";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Zap,
  Fish,
  ChevronDown,
  Newspaper,
  Activity,
} from "lucide-react";

type TimeRange = "1min" | "1h";

const SYMBOL_ICONS: Record<string, string> = {
  "BTC/USD": "₿",
  "ETH/USD": "Ξ",
  "XRP/USD": "✕",
  "BNB/USD": "◆",
  "USDT/USD": "₮",
};

const SYMBOL_COLORS: Record<string, string> = {
  "BTC/USD": "text-amber-400",
  "ETH/USD": "text-blue-400",
  "XRP/USD": "text-zinc-300",
  "BNB/USD": "text-yellow-400",
  "USDT/USD": "text-emerald-400",
};

export default function DashboardPage() {
  const { data: symbolsData } = useSymbols();
  const [selectedSymbol, setSelectedSymbol] = useState<string>("BTC/USD");
  const [timeRange, setTimeRange] = useState<TimeRange>("1min");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // All data hooks for the selected symbol
  const trades1Min = useTradesAggregated1Min(selectedSymbol, 60);
  const trades1H = useTradesAggregated1H(selectedSymbol, 24);
  const buySell = useBuySell(selectedSymbol, 60);
  const velocity = useVelocity(selectedSymbol, 60);
  const whales = useWhales(selectedSymbol, 10);
  const news = useNews(selectedSymbol, 8);

  const tradesData = timeRange === "1min" ? trades1Min : trades1H;
  const isLoading = tradesData.loading && !tradesData.data;

  const refreshAll = useCallback(() => {
    setIsRefreshing(true);
    trades1Min.refetch();
    trades1H.refetch();
    buySell.refetch();
    velocity.refetch();
    whales.refetch();
    news.refetch();
    setTimeout(() => setIsRefreshing(false), 1200);
  }, [trades1Min, trades1H, buySell, velocity, whales, news]);

  // Derived stats
  const latestPrice = tradesData.data?.data?.at(-1)?.avg_price ?? null;
  const prevPrice = tradesData.data?.data?.at(-2)?.avg_price ?? null;
  const priceChange =
    latestPrice && prevPrice
      ? ((latestPrice - prevPrice) / prevPrice) * 100
      : null;
  const totalVolume =
    tradesData.data?.data?.reduce((sum, d) => sum + d.total_volume, 0) ?? null;
  const latestVelocity =
    velocity.data?.data?.at(-1)?.trades_per_second ?? null;
  const latestRatio = buySell.data?.data?.at(-1)?.buy_sell_ratio ?? null;

  const symbolIcon = SYMBOL_ICONS[selectedSymbol] || "◈";
  const symbolColor = SYMBOL_COLORS[selectedSymbol] || "text-indigo-400";

  return (
    <>
      {/* Sidebar with refresh */}
      <Sidebar onRefresh={refreshAll} isRefreshing={isRefreshing} />

      <div className="space-y-6 max-w-400 mx-auto">
        {/* ── Top Bar ── */}
        <div className="flex items-center gap-4">
          {/* Symbol Selector */}
          <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="glass-card glass-shine flex items-center gap-3 rounded-xl px-4 py-3 pr-10 transition-all hover:border-white/10 min-w-50"
              >
                <span className={`text-2xl ${symbolColor}`}>{symbolIcon}</span>
                <div className="text-left">
                  <p className="text-sm font-bold text-white/90">{selectedSymbol}</p>
                  <p className="text-[10px] text-white/30">
                    {latestPrice ? formatPrice(latestPrice) : "Loading..."}
                  </p>
                </div>
                <ChevronDown
                  className={`absolute right-3 h-4 w-4 text-white/25 transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-xl border border-white/[0.06] bg-[#0c0c14]/95 backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden animate-fade-in-up">
                  {(symbolsData?.symbols ?? []).map((symbol) => (
                    <button
                      key={symbol}
                      onClick={() => {
                        setSelectedSymbol(symbol);
                        setDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                        symbol === selectedSymbol
                          ? "bg-indigo-500/8 text-indigo-400"
                          : "text-white/50 hover:bg-white/[0.03] hover:text-white/80"
                      }`}
                    >
                      <span className={`text-lg ${SYMBOL_COLORS[symbol] || "text-white/30"}`}>
                        {SYMBOL_ICONS[symbol] || "◈"}
                      </span>
                      <span className="text-sm font-medium">{symbol}</span>
                      {symbol === selectedSymbol && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50" />
                      )}
                    </button>
                  ))}
              </div>
            )}
          </div>

            {/* Price badge */}
            {priceChange !== null && (
              <div
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${
                  priceChange >= 0
                    ? "bg-emerald-500/8 text-emerald-400 border border-emerald-400/15"
                    : "bg-red-500/8 text-red-400 border border-red-400/15"
                }`}
              >
                {priceChange >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {formatPercent(priceChange)}
              </div>
            )}
        </div>        {/* ── Close dropdown on click outside ── */}
        {dropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
        )}

        {/* ── Stat Cards ── */}
        {isLoading && !tradesData.data ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="animate-fade-in-up stagger-1">
              <StatCard
                label="Price"
                value={formatPrice(latestPrice)}
                icon={<DollarSign className="h-4 w-4" />}
                accent="indigo"
              />
            </div>
            <div className="animate-fade-in-up stagger-2">
              <StatCard
                label="Volume"
                value={formatVolume(totalVolume)}
                icon={<BarChart3 className="h-4 w-4" />}
                accent="emerald"
              />
            </div>
            <div className="animate-fade-in-up stagger-3">
              <StatCard
                label="Velocity"
                value={
                  latestVelocity
                    ? `${latestVelocity.toFixed(2)} trades/s`
                    : "N/A"
                }
                icon={<Zap className="h-4 w-4" />}
                accent="amber"
              />
            </div>
            <div className="animate-fade-in-up stagger-4">
              <StatCard
                label="Buy/Sell Ratio"
                value={latestRatio?.toFixed(3) ?? "N/A"}
                icon={
                  latestRatio && latestRatio >= 1 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )
                }
                accent={latestRatio && latestRatio >= 1 ? "emerald" : "red"}
              />
            </div>
          </div>
        )}

        {tradesData.error && <ErrorMessage message={tradesData.error} />}

        {/* ── Price Chart (Hero) ── */}
        {isLoading && !tradesData.data ? (
          <SkeletonChart height={320} />
        ) : (
          tradesData.data && (
            <Card
              title={`Price — ${selectedSymbol}`}
              action={
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-white/25 font-mono">
                    {timeRange === "1min" ? "1-minute" : "1-hour"} candles
                  </span>
                  <TabGroup
                    tabs={[
                      { label: "1 Min", value: "1min" },
                      { label: "1 Hour", value: "1h" },
                    ]}
                    activeTab={timeRange}
                    onChange={(v) => setTimeRange(v as TimeRange)}
                  />
                </div>
              }
            >
              <PriceChart
                data={tradesData.data.data}
                height={320}
                id={`main-${selectedSymbol}`}
              />
            </Card>
          )
        )}

        {/* ── Buy/Sell + Velocity Row ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {buySell.data && (
            <Card
              title="Buy vs Sell"
              action={
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-white/30">Buy</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="text-white/30">Sell</span>
                  </span>
                </div>
              }
            >
              <BuySellChart data={buySell.data.data} height={250} />
            </Card>
          )}
          {velocity.data && (
            <Card
              title="Trading Velocity"
              action={
                <span className="text-[11px] text-white/25 font-mono">
                  trades/sec
                </span>
              }
            >
              <VelocityChart data={velocity.data.data} height={250} />
            </Card>
          )}
        </div>

        {/* ── Total Trades ── */}
        {tradesData.data && (
          <Card
            title={`Total Trades — ${selectedSymbol}`}
            action={
              <div className="flex items-center gap-2 text-[11px]">
                <BarChart3 className="h-3 w-3 text-indigo-400/60" />
                <span className="text-white/25 font-mono">
                  {tradesData.data.data.reduce((sum, d) => sum + d.total_trades, 0).toLocaleString()} total
                </span>
              </div>
            }
          >
            <TradesChart data={tradesData.data.data} height={250} />
          </Card>
        )}

        {/* ── Whale Alerts + News Feed ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Whale Alerts */}
          <Card
            title="Whale Alerts"
            action={
              <div className="flex items-center gap-1.5 text-[11px]">
                <Fish className="h-3 w-3 text-amber-400/60" />
                <span className="text-white/25">
                  {whales.data?.count ?? 0} alerts
                </span>
              </div>
            }
          >
            {whales.loading && !whales.data ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="skeleton h-14 w-full" />
                ))}
              </div>
            ) : whales.data && whales.data.data.length > 0 ? (
              <div className="max-h-90 space-y-2 overflow-y-auto pr-1">
                {whales.data.data.map((w, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.07]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          w.side === "buy"
                            ? "bg-emerald-500/8 text-emerald-400"
                            : "bg-red-500/8 text-red-400"
                        }`}
                      >
                        <Fish className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/85 font-mono">
                          {w.qty.toFixed(4)}
                        </p>
                        <p className="text-[10px] text-white/25">
                          {formatDateTime(w.timestamp)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={w.side === "buy" ? "success" : "danger"}>
                      {w.side.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-white/20">
                <Fish className="h-8 w-8 mb-2" />
                <p className="text-xs">No whale alerts</p>
              </div>
            )}
          </Card>

          {/* News */}
          <Card
            title="News & Sentiment"
            action={
              <div className="flex items-center gap-1.5 text-[11px]">
                <Newspaper className="h-3 w-3 text-indigo-400/60" />
                <span className="text-white/25">
                  {news.data?.count ?? 0} articles
                </span>
              </div>
            }
          >
            {news.loading && !news.data ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="skeleton h-16 w-full" />
                ))}
              </div>
            ) : news.data && news.data.data.length > 0 ? (
              <div className="max-h-90 space-y-2 overflow-y-auto pr-1">
                {news.data.data.map((n, i) => (
                  <a
                    key={i}
                    href={`https://www.google.com/search?q=${encodeURIComponent(n.title + " " + n.source)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.07] cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-semibold text-white/85 leading-snug line-clamp-2 group-hover:text-white/95 transition-colors">
                        {n.title}
                      </p>
                      <span
                        className={`shrink-0 rounded-lg border px-2 py-0.5 text-[10px] font-semibold capitalize ${getSentimentColor(
                          n.sentiment
                        )} ${getSentimentBg(n.sentiment)} ${
                          (() => {
                            const s = n.sentiment.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            if (s === "positive" || s === "bullish" || s === "favorable") return "border-emerald-400/15";
                            if (s === "negative" || s === "bearish" || s === "defavorable") return "border-red-400/15";
                            return "border-amber-400/15";
                          })()
                        }`}
                      >
                        {n.sentiment}
                      </span>
                    </div>
                    {n.summary && (
                      <p className="mt-1.5 text-[11px] text-white/30 line-clamp-1">
                        {n.summary}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-white/20">
                      <span>{n.source}</span>
                      <span className="text-white/10">•</span>
                      <span>{formatDateTime(n.timestamp)}</span>
                      <span className="text-white/10">•</span>
                      <span className="text-white/30">
                        {n.confidence.toFixed(0)}%
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-white/20">
                <Newspaper className="h-8 w-8 mb-2" />
                <p className="text-xs">No news available</p>
              </div>
            )}
          </Card>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 pb-2">
          <div className="flex items-center gap-2 text-[11px] text-white/15">
            <Activity className="h-3 w-3" />
            <span>CryptoViz — Real-time Analytics Dashboard</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-white/15">
            {symbolsData && (
              <span>{symbolsData.symbols.length} symbols tracked</span>
            )}
            <span className="text-white/10">•</span>
            <span>{timeRange === "1min" ? "1-minute" : "1-hour"} interval</span>
          </div>
        </div>
      </div>
    </>
  );
}
