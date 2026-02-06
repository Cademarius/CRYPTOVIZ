"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  SymbolsResponse,
  TradeAggregatedResponse,
  BuySellResponse,
  VelocityResponse,
  WhaleResponse,
  NewsResponse,
} from "@/lib/types";
import { API_BASE } from "@/lib/api";

async function fetchApi<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(path, API_BASE);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

function useApiData<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  refreshInterval?: number
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
    if (refreshInterval) {
      const interval = setInterval(load, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [load, refreshInterval]);

  return { data, loading, error, refetch: load };
}

// ---- Hooks ----

export function useSymbols() {
  return useApiData<SymbolsResponse>(
    () => fetchApi("symbols"),
    [],
    undefined // Pas de refresh automatique, les symboles changent rarement
  );
}

export function useTradesAggregated1Min(symbol: string, limit = 60, refreshInterval?: number) {
  return useApiData<TradeAggregatedResponse>(
    () => fetchApi("trades/aggregated/1min", { symbol, limit: String(limit) }),
    [symbol, limit],
    refreshInterval // Optionnel
  );
}

export function useTradesAggregated1H(symbol: string, limit = 24, refreshInterval?: number) {
  return useApiData<TradeAggregatedResponse>(
    () => fetchApi("trades/aggregated/1h", { symbol, limit: String(limit) }),
    [symbol, limit],
    refreshInterval // Optionnel
  );
}

export function useBuySell(symbol: string, limit = 60, refreshInterval?: number) {
  return useApiData<BuySellResponse>(
    () => fetchApi("trades/buy-sell", { symbol, limit: String(limit) }),
    [symbol, limit],
    refreshInterval // Optionnel
  );
}

export function useVelocity(symbol: string, limit = 60, refreshInterval?: number) {
  return useApiData<VelocityResponse>(
    () => fetchApi("trades/velocity", { symbol, limit: String(limit) }),
    [symbol, limit],
    refreshInterval // Optionnel
  );
}

export function useWhales(symbol?: string, limit = 50, refreshInterval?: number) {
  return useApiData<WhaleResponse>(
    () => {
      const params: Record<string, string> = { limit: String(limit) };
      if (symbol) params.symbol = symbol;
      return fetchApi("whales", params);
    },
    [symbol, limit],
    refreshInterval // Optionnel
  );
}

export function useNews(symbol?: string, limit = 20, refreshInterval?: number) {
  return useApiData<NewsResponse>(
    () => {
      const params: Record<string, string> = { limit: String(limit) };
      if (symbol) params.symbol = symbol;
      return fetchApi("news", params);
    },
    [symbol, limit],
    refreshInterval // Optionnel
  );
}
