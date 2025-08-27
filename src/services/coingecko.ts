import type { CardItem } from "../types";

/* ---------- existing types/helpers from your file ---------- */
type MarketsItem = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  price_change_percentage_24h?: number;
  price_change_percentage_7d_in_currency?: number;
  ath?: number;
  ath_change_percentage?: number;
  atl?: number;
  atl_change_percentage?: number;
  sparkline_in_7d?: { price: number[] };
};
type MarketsResponse = MarketsItem[];

function pct(n: number | undefined, label: string): string | undefined {
  return typeof n === "number" ? `${label} ${n.toFixed(2)}%` : undefined;
}

function normalizeCoin(c: MarketsItem): CardItem {
  return {
    id: c.id,
    company: c.name,
    symbol: (c.symbol || "").toUpperCase(),
    image: c.image,
    price: c.current_price,
    badge: c.market_cap_rank ? `Rank #${c.market_cap_rank}` : undefined,
    notes: [
      pct(c.price_change_percentage_24h, "24h"),
      pct(c.price_change_percentage_7d_in_currency, "7d"),
    ].filter(Boolean).join(" | "),
    change24hPct: c.price_change_percentage_24h,
    high24h: c.high_24h,
    low24h: c.low_24h,
    marketCap: c.market_cap,
    vol24h: c.total_volume,
    supplyCirc: c.circulating_supply,
    supplyTotal: c.total_supply,
    supplyMax: c.max_supply,
    ath: c.ath ?? undefined,
    athChangePct: c.ath_change_percentage ?? undefined,
    atl: c.atl ?? undefined,
    atlChangePct: c.atl_change_percentage ?? undefined,
    sparkline7d: c.sparkline_in_7d?.price || [],
  };
}

/* ---------- existing list fetch ---------- */
export async function fetchCoins(
  opts: { page?: number; perPage?: number; order?: string } = {}
): Promise<CardItem[]> {
  const { page = 1, perPage = 25, order = "market_cap_desc" } = opts;

  const url = new URL("https://api.coingecko.com/api/v3/coins/markets");
  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("order", order);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("page", String(page));
  url.searchParams.set("sparkline", "true");
  url.searchParams.set("price_change_percentage", "1h,24h,7d");

  const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`CoinGecko ${res.status}: ${await res.text()}`);
  const data: MarketsResponse = await res.json();
  return data.map(normalizeCoin);
}

/* ---------- NEW: fetch by ids ---------- */
export async function fetchCoinsByIds(ids: string[]): Promise<CardItem[]> {
  if (!ids.length) return [];
  // CoinGecko supports comma-separated ids; keep within a safe chunk size
  const chunk = (arr: string[], size = 50) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  const results: CardItem[] = [];
  for (const idsChunk of chunk(ids)) {
    const url = new URL("https://api.coingecko.com/api/v3/coins/markets");
    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set("ids", idsChunk.join(","));
    url.searchParams.set("sparkline", "true");
    url.searchParams.set("price_change_percentage", "1h,24h,7d");

    const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`CoinGecko ${res.status}: ${await res.text()}`);
    const data: MarketsResponse = await res.json();
    results.push(...data.map(normalizeCoin));
  }
  return results;
}

/* ---------- NEW: search -> ids -> markets ---------- */
export async function searchCoins(query: string, limit = 25): Promise<CardItem[]> {
  const q = query.trim();
  if (!q) return [];
  const searchUrl = new URL("https://api.coingecko.com/api/v3/search");
  searchUrl.searchParams.set("query", q);

  const res = await fetch(searchUrl.toString(), { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`CoinGecko ${res.status}: ${await res.text()}`);

  type SearchResp = { coins: Array<{ id: string }> };
  const data: SearchResp = await res.json();
  const ids = (data.coins || []).map(c => c.id).slice(0, limit);
  if (!ids.length) return [];
  return fetchCoinsByIds(ids);
}
