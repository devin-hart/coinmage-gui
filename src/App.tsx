import { useEffect, useState } from "react";
import { fetchCoins, searchCoins } from "./services/coingecko";
import type { CardItem } from "./types";
import ResultList from "./components/ResultList";
import SearchBar from "./components/SearchBar";
import wizardIcon from "./assets/coinage.png";

export default function App() {
  const [baseItems, setBaseItems] = useState<CardItem[]>([]);
  const [items, setItems] = useState<CardItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // initial list
  useEffect(() => {
    setLoading(true);
    fetchCoins({ perPage: 25 })
      .then((data) => {
        setBaseItems(data);
        setItems(data);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    const q = query.trim();
    if (!q) {
      setItems(baseItems);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const found = await searchCoins(q, 25);
      setItems(found);
      if (!found.length) setError("No results.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setItems(baseItems);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gray-900">
      <div className="flex justify-center">
        <div className="w-full max-w-[1200px] px-6 py-6">
          {/* Header: title left, search right; stacks on small screens */}
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Logo + Title */}
            <h1 className="flex items-center gap-3 text-4xl font-extrabold tracking-tight text-white whitespace-nowrap">
              <img
                src={wizardIcon}
                alt="CoinMage Wizard"
                className="h-10 w-auto"
              />
              CoinMage
            </h1>

            {/* Search aligned right on desktop */}
            <div className="w-full md:w-auto md:flex-1 md:max-w-[520px]">
              <SearchBar
                value={query}
                onChange={setQuery}
                onSubmit={handleSubmit}
                onClear={handleClear}
                className="w-full"
              />
            </div>
          </div>

          {error && !loading && (
            <div className="text-gray-300 text-sm mb-4">{error}</div>
          )}

          <ResultList items={items} loading={loading} skeletonCount={8} />
        </div>
      </div>
    </main>
  );
}
