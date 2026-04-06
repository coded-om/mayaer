import { useEffect, useRef } from "react";
import { useStocksStore } from "@/store/stocksStore";

const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useStockQuotes() {
  const holdings = useStocksStore((s) => s.holdings);
  const quotes = useStocksStore((s) => s.quotes);
  const isLoading = useStocksStore((s) => s.isLoading);
  const error = useStocksStore((s) => s.error);
  const lastFetched = useStocksStore((s) => s.lastFetched);
  const fetchAllQuotes = useStocksStore((s) => s.fetchAllQuotes);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (holdings.length === 0) return;

    // Fetch on mount
    fetchAllQuotes();

    // Poll every 5 minutes
    intervalRef.current = setInterval(() => {
      fetchAllQuotes();
    }, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [holdings.length, fetchAllQuotes]);

  return { quotes, isLoading, error, lastFetched };
}
