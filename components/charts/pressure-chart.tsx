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
  ReferenceLine,
} from "recharts";
import type { BuySellData } from "@/lib/types";
import { formatTime } from "@/lib/utils";

interface PressureChartProps {
  data: BuySellData[];
  height?: number;
}

export default function PressureChart({ data, height = 250 }: PressureChartProps) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        time: formatTime(d.window_start),
        pressure: d.net_pressure,
        ratio: d.buy_sell_ratio,
      })),
    [data]
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="pressureUp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
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
          width={50}
        />
        <ReferenceLine y={0} stroke="#27272a" strokeDasharray="3 3" />
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
          formatter={(value: any) => [Number(value).toFixed(4), "Net Pressure"]}
        />
        <Area
          type="monotone"
          dataKey="pressure"
          stroke="#10b981"
          fill="url(#pressureUp)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
