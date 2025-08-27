import type { FormEvent } from "react";
import { Search, X } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;          // NEW
};

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = "Search CoinGecko (e.g., PEPE, BONK, DOGE)…",
  className = "",              // NEW
}: Props) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-stretch gap-2 w-full ${className}`}  // apply width from parent
      role="search"
      aria-label="Search coins"
    >
      {/* input container grows to fill */}
      <div className="flex items-center bg-white rounded-md shadow px-3 h-10 w-full">
        <Search className="w-4 h-4 text-gray-400 mr-2" aria-hidden="true" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full text-sm outline-none placeholder:text-gray-400"
          aria-label="Search"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              onClear?.();
            }}
            className="ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
            title="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <button
        type="submit"
        className="h-10 px-3 bg-blue-600 text-white text-sm rounded-md shadow hover:bg-blue-700 whitespace-nowrap"
        aria-label="Apply search"
        title="Search"
      >
        Search
      </button>
    </form>
  );
}
