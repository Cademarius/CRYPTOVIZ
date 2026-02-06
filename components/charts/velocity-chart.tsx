"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { VelocityData } from "@/lib/types";
import { formatTime } from "@/lib/utils";

interface VelocityChartProps {
  data: VelocityData[];
  height?: number;
}

export default function VelocityChart({ data, height = 250 }: VelocityChartProps) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        time: formatTime(d.window_start),
        tps: d.trades_per_second,
        count: d.trades_count,
      })),
    [data]
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
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
          width={40}
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
          formatter={(value: any, name: any) => [
            Number(value).toFixed(2),
            name === "tps" ? "Trades/sec" : "Total trades",
          ]}
        />
        <Area
          type="monotone"
          dataKey="tps"
          stroke="#f59e0b"
          strokeWidth={2}
          fill="url(#velocityGradient)"
          dot={false}
          activeDot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
