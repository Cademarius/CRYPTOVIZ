"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { TradeAggregatedData } from "@/lib/types";
import { formatTime } from "@/lib/utils";

interface TradesChartProps {
  data: TradeAggregatedData[];
  height?: number;
}

export default function TradesChart({ data, height = 250 }: TradesChartProps) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        time: formatTime(d.window_start),
        trades: d.total_trades,
      })),
    [data]
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="tradesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#818cf8" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
        <XAxis
          dataKey="time"
          stroke="rgba(255,255,255,0.08)"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          stroke="rgba(255,255,255,0.08)"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          width={45}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(12, 12, 20, 0.95)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px",
            color: "rgba(255,255,255,0.8)",
            fontSize: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            padding: "8px 12px",
            backdropFilter: "blur(12px)",
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any) => [(value ?? 0).toLocaleString(), "Trades"]}
        />
        <Bar
          dataKey="trades"
          fill="url(#tradesGradient)"
          radius={[3, 3, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
