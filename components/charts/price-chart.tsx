"use client";

import { useMemo, memo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { TradeAggregatedData } from "@/lib/types";
import { formatTime, formatPrice } from "@/lib/utils";

interface PriceChartProps {
  data: TradeAggregatedData[];
  height?: number;
  id?: string;
}

function PriceChartInner({ data, height = 300, id = "price" }: PriceChartProps) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        time: formatTime(d.window_start),
        price: d.avg_price,
        volume: d.total_volume,
      })),
    [data]
  );

  const gradientId = `gradient-${id}`;
  const isUp = chartData.length >= 2 && chartData[chartData.length - 1].price >= chartData[0].price;
  const color = isUp ? "#10b981" : "#ef4444";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
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
          tickFormatter={(v: number) => formatPrice(v)}
          domain={["auto", "auto"]}
          width={70}
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
          formatter={(value: any) => [formatPrice(value ?? 0), "Price"]}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const PriceChart = memo(PriceChartInner);
export default PriceChart;
