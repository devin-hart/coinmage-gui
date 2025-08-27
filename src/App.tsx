import { useEffect, useState } from "react";
import { fetchCoins } from "./services/coingecko";
import type { CardItem } from "./types";
import ResultList from "./components/ResultList";

export default function App() {
  const [items, setItems] = useState<CardItem[]>([]);

  useEffect(() => {
    fetchCoins({ perPage: 25 }).then(setItems).catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hard center the content column */}
      <div className="flex justify-center">
        {/* Tweak max-w to taste (e.g., 1200px, 1400px, 1600px) */}
        <div className="w-full max-w-[1200px] px-6 py-6">
          <h1 className="text-4xl font-extrabold tracking-tight mb-6 text-white">
            CoinMage
          </h1>
          <ResultList items={items} />
        </div>
      </div>
    </main>
  );
}
