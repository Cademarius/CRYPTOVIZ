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
import { formatTime, formatVolume } from "@/lib/utils";

interface VolumeChartProps {
  data: TradeAggregatedData[];
  height?: number;
}

export default function VolumeChart({ data, height = 200 }: VolumeChartProps) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        time: formatTime(d.window_start),
        volume: d.total_volume,
        trades: d.total_trades,
      })),
    [data]
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
        <XAxis
          dataKey="time"
          stroke="#3f3f46"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          stroke="#3f3f46"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => formatVolume(v)}
          width={55}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(24, 24, 27, 0.95)",
            border: "1px solid #27272a",
            borderRadius: "10px",
            color: "#fff",
            fontSize: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            padding: "8px 12px",
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any, name: any) => [
            name === "volume" ? formatVolume(value ?? 0) : (value ?? 0),
            name === "volume" ? "Volume" : "Trades",
          ]}
        />
        <Bar dataKey="volume" fill="#6366f1" radius={[3, 3, 0, 0]} opacity={0.8} />
      </BarChart>
    </ResponsiveContainer>
  );
}
