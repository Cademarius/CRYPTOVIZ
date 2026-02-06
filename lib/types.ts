// ============ API Response Types ============

// Symbols
export interface SymbolsResponse {
  symbols: string[];
}

// Trade Aggregated
export interface TradeAggregatedData {
  window_start: string;
  window_end: string;
  total_trades: number;
  total_volume: number;
  avg_price: number;
}

export interface TradeAggregatedResponse {
  symbol: string;
  interval: string;
  count: number;
  data: TradeAggregatedData[];
}

// Buy/Sell
export interface BuySellData {
  window_start: string;
  window_end: string;
  buy_count: number;
  sell_count: number;
  buy_sell_ratio: number;
  net_pressure: number;
}

export interface BuySellResponse {
  symbol: string;
  count: number;
  data: BuySellData[];
}

// Velocity
export interface VelocityData {
  window_start: string;
  window_end: string;
  trades_count: number;
  trades_per_second: number;
}

export interface VelocityResponse {
  symbol: string;
  count: number;
  data: VelocityData[];
}

// Whales
export interface WhaleData {
  timestamp: string;
  symbol: string;
  side: string;
  qty: number;
}

export interface WhaleResponse {
  count: number;
  data: WhaleData[];
}

// News
export interface NewsData {
  timestamp: string;
  symbol: string;
  source: string;
  title: string;
  summary: string | null;
  sentiment: string;
  confidence: number;
}

export interface NewsResponse {
  count: number;
  data: NewsData[];
}

// Dashboard Overview
export interface CryptoOverview {
  symbol: string;
  last_price: number | null;
  price_change_1h: number | null;
  volume_1h: number | null;
  buy_sell_ratio: number | null;
  velocity: number | null;
  whale_count_24h: number;
  news_sentiment: string | null;
}

export interface DashboardOverviewResponse {
  timestamp: string;
  cryptos: CryptoOverview[];
}
