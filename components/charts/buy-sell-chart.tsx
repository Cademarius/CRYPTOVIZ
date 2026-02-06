"use client";

import { useMemo, memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { BuySellData } from "@/lib/types";
import { formatTime } from "@/lib/utils";

interface BuySellChartProps {
  data: BuySellData[];
  height?: number;
}

function BuySellChartInner({ data, height = 300 }: BuySellChartProps) {
  const chartData = useMemo(
    () =>
      [...data].reverse().map((d) => ({
        time: formatTime(d.window_start),
        buy: d.buy_count,
        sell: -d.sell_count,
        ratio: d.buy_sell_ratio,
        pressure: d.net_pressure,
      })),
    [data]
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} stackOffset="sign" margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="time"
          stroke="rgba(255,255,255,0.35)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          stroke="rgba(255,255,255,0.35)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
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
            Math.abs(value),
            name === "buy" ? "Buy" : "Sell",
          ]}
        />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.06)" />
        <Bar dataKey="buy" fill="#34d399" stackId="stack" radius={[2, 2, 0, 0]} opacity={0.75} />
        <Bar dataKey="sell" fill="#f87171" stackId="stack" radius={[2, 2, 0, 0]} opacity={0.75} />
      </BarChart>
    </ResponsiveContainer>
  );
}

const BuySellChart = memo(BuySellChartInner);
export default BuySellChart;
