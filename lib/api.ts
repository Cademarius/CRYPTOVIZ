import type {
  SymbolsResponse,
  TradeAggregatedResponse,
  BuySellResponse,
  VelocityResponse,
  WhaleResponse,
  NewsResponse,
} from "./types";

export const API_BASE = "/api/";

/** Build an absolute URL from a relative API path (works with both SSR and client) */
export function buildApiUrl(path: string, params?: Record<string, string>): string {
  // In the browser, window.location.origin gives us the full base
  // During SSR, fall back to the external API directly
  const base = typeof window !== "undefined"
    ? `${window.location.origin}${API_BASE}`
    : `http://64.23.190.226/api/`;
  const url = new URL(path, base);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }
  return url.toString();
}

async function fetchApi<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = buildApiUrl(path, params);
  const res = await fetch(url.toString(), { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ---- Symbols ----
export async function getSymbols(): Promise<SymbolsResponse> {
  return fetchApi<SymbolsResponse>("symbols");
}

// ---- Trades Aggregated 1min ----
export async function getTradesAggregated1Min(
  symbol: string,
  limit: number = 60
): Promise<TradeAggregatedResponse> {
  return fetchApi<TradeAggregatedResponse>("trades/aggregated/1min", {
    symbol,
    limit: String(limit),
  });
}

// ---- Trades Aggregated 1h ----
export async function getTradesAggregated1H(
  symbol: string,
  limit: number = 24
): Promise<TradeAggregatedResponse> {
  return fetchApi<TradeAggregatedResponse>("trades/aggregated/1h", {
    symbol,
    limit: String(limit),
  });
}

// ---- Buy/Sell ----
export async function getBuySell(
  symbol: string,
  limit: number = 60
): Promise<BuySellResponse> {
  return fetchApi<BuySellResponse>("trades/buy-sell", {
    symbol,
    limit: String(limit),
  });
}

// ---- Velocity ----
export async function getVelocity(
  symbol: string,
  limit: number = 60
): Promise<VelocityResponse> {
  return fetchApi<VelocityResponse>("trades/velocity", {
    symbol,
    limit: String(limit),
  });
}

// ---- Whales ----
export async function getWhales(
  symbol?: string,
  limit: number = 50
): Promise<WhaleResponse> {
  const params: Record<string, string> = { limit: String(limit) };
  if (symbol) params.symbol = symbol;
  return fetchApi<WhaleResponse>("whales", params);
}

// ---- Whales Stream (SSE) ----
export function getWhalesStreamUrl(symbol?: string): string {
  return buildApiUrl("whales/stream", symbol ? { symbol } : undefined);
}

// ---- News ----
export async function getNews(
  symbol?: string,
  limit: number = 20
): Promise<NewsResponse> {
  const params: Record<string, string> = { limit: String(limit) };
  if (symbol) params.symbol = symbol;
  return fetchApi<NewsResponse>("news", params);
}
