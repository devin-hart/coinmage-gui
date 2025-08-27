export type CardItem = {
  id: string;
  company: string;
  symbol: string;
  image?: string;

  // price/rank
  price?: number;
  badge?: string;           // e.g., "Rank #3"
  notes?: string;           // e.g., "24h +2.1% | 7d -3.4%"

  // highs/lows
  high24h?: number;
  low24h?: number;

  // cap/volume
  marketCap?: number;
  vol24h?: number;

  // supply
  supplyCirc?: number;
  supplyTotal?: number | null;
  supplyMax?: number | null;

  // optional extras
  ath?: number;
  athChangePct?: number;    // %
  atl?: number;
  atlChangePct?: number;    // %

  // sparkline series
  sparkline7d?: number[];
};
