import { useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { TbSearch } from "react-icons/tb";
import { useStocksStore } from "@/store/stocksStore";

interface StockSearchProps {
  onSelect: (symbol: string, name: string) => void;
}

export function StockSearch({ onSelect }: StockSearchProps) {
  const { t } = useTranslation();
  const searchSymbol = useStocksStore((s) => s.searchSymbol);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ symbol: string; name: string }[]>(
    [],
  );
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (value.length < 1) {
        setResults([]);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setIsSearching(true);
        const res = await searchSymbol(value);
        setResults(res);
        setIsSearching(false);
      }, 500);
    },
    [searchSymbol],
  );

  return (
    <div className="space-y-2">
      <div className="relative">
        <TbSearch className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t("stocks.searchSymbol")}
          className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-white/70 dark:border-white/[0.08] font-arabic text-sm text-neutral-text dark:text-white placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {isSearching && (
        <p className="font-arabic text-xs text-neutral-muted text-center py-2">
          {t("stocks.loading")}
        </p>
      )}

      {results.length > 0 && (
        <div className="rounded-xl border border-white/70 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.06] divide-y divide-white/50 dark:divide-white/[0.06] max-h-48 overflow-y-auto">
          {results.map((item) => (
            <button
              key={item.symbol}
              onClick={() => {
                onSelect(item.symbol, item.name);
                setQuery(item.symbol);
                setResults([]);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-start">
              <span className="font-mono text-sm font-semibold text-primary shrink-0">
                {item.symbol}
              </span>
              <span className="font-arabic text-xs text-neutral-muted dark:text-gray-400 truncate">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
