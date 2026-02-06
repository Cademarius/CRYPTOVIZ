"use client";

import { useState } from "react";
import { useWhales, useSymbols } from "@/hooks/use-api";
import { useWhaleStream } from "@/hooks/use-whale-stream";
import { LoadingSpinner, ErrorMessage, Card, Badge } from "@/components/ui";
import Sidebar from "@/components/sidebar";
import { formatDateTime } from "@/lib/utils";
import WhaleIcon from "@/components/icons/whale-icon";
import { History, RefreshCw } from "lucide-react";

export default function WhalesPage() {
  const [filterSymbol, setFilterSymbol] = useState<string>("");
  const { data: symbols } = useSymbols();
  const { data: whalesHistory, loading, error, refetch } = useWhales(
    filterSymbol || undefined,
    100
  );
  const { connected } = useWhaleStream(filterSymbol || undefined);

  return (
    <>
      <Sidebar />
      <div className="space-y-6 max-w-400 mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-white/90 tracking-tight">Whale Tracker</h1>
            <p className="mt-1 text-xs text-white/25">
              Monitor large transactions in real-time
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={loading}
              className="glass-card flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-white/40 transition-all hover:text-white/70 hover:border-white/10 disabled:opacity-40"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>

            <div className="glass-card flex items-center gap-2 rounded-xl px-3 py-2">
              <div className="relative">
                {connected && (
                  <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30" />
                )}
                <div
                  className={`relative h-2 w-2 rounded-full ${
                    connected ? "bg-emerald-400" : "bg-red-400"
                  }`}
                />
              </div>
              <span className="text-[11px] text-white/40 font-medium">
                {connected ? "Live" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Historical Alerts */}
        <Card
          title="Historical Alerts"
          action={
            <div className="flex items-center gap-3">
              <select
                value={filterSymbol}
                onChange={(e) => setFilterSymbol(e.target.value)}
                className="rounded-lg border border-white/[0.06] bg-[#0c0c14] px-2.5 py-1.5 text-[11px] text-white/70 focus:border-indigo-400/20 focus:outline-none transition-colors [&>option]:bg-[#0c0c14] [&>option]:text-white/70"
              >
                <option value="">All Symbols</option>
                {symbols?.symbols.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="flex items-center gap-1.5 text-[11px]">
                <History className="h-3 w-3 text-white/20" />
                <span className="text-white/25">
                  {whalesHistory?.count ?? 0} transactions
                </span>
              </div>
            </div>
          }
        >
          {loading ? (
            <LoadingSpinner />
          ) : whalesHistory && whalesHistory.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.04] text-left text-[10px] text-white/25 uppercase tracking-wider">
                    <th className="px-4 py-2.5 font-medium">Time</th>
                    <th className="px-4 py-2.5 font-medium">Side</th>
                    <th className="px-4 py-2.5 font-medium text-right">Quantity</th>
                    <th className="px-4 py-2.5 font-medium">Symbol</th>
                  </tr>
                </thead>
                <tbody>
                  {whalesHistory.data.map((w, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-2.5 text-white/35">
                        {formatDateTime(w.timestamp)}
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge variant={w.side === "buy" ? "success" : "danger"}>
                          {w.side.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-white/85">
                        {w.qty}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-white/85">
                        {w.symbol}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-white/20">
              <WhaleIcon className="h-8 w-8 mb-2" />
              <p className="text-xs">No whale alerts found</p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
