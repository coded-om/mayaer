import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StockHolding, StockQuote } from "@/types";
import { ALPHA_VANTAGE_BASE_URL } from "@/constants";
import { MSM_STOCKS, TADAWUL_STOCKS, DFM_STOCKS } from "@/constants/markets";

interface StocksStore {
  holdings: StockHolding[];
  quotes: Record<string, StockQuote>;
  isLoading: boolean;
  lastFetched: string | null;
  error: string | null;
  addHolding: (holding: Omit<StockHolding, "id">) => void;
  removeHolding: (id: string) => void;
  updateHolding: (id: string, data: Partial<StockHolding>) => void;
  fetchQuote: (symbol: string) => Promise<void>;
  fetchAllQuotes: () => Promise<void>;
  searchSymbol: (query: string) => Promise<{ symbol: string; name: string }[]>;
  getPortfolioValue: () => number;
  getTotalProfitLoss: () => number;
  getHoldingProfitLoss: (id: string) => { amount: number; percent: number };
}

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY || "demo";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useStocksStore = create<StocksStore>()(
  persist(
    (set, get) => ({
      holdings: [],
      quotes: {},
      isLoading: false,
      lastFetched: null,
      error: null,

      addHolding: (holding) => {
        set((state) => ({
          holdings: [
            ...state.holdings,
            { ...holding, id: crypto.randomUUID() },
          ],
        }));
      },

      removeHolding: (id) => {
        set((state) => ({
          holdings: state.holdings.filter((h) => h.id !== id),
        }));
      },

      updateHolding: (id, data) => {
        set((state) => ({
          holdings: state.holdings.map((h) =>
            h.id === id ? { ...h, ...data } : h,
          ),
        }));
      },

      fetchQuote: async (symbol) => {
        const { quotes } = get();
        const existing = quotes[symbol];
        if (
          existing &&
          Date.now() - new Date(existing.lastUpdated).getTime() < CACHE_DURATION
        ) {
          return; // still cached
        }

        set({ isLoading: true, error: null });
        try {
          const url = `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`;
          const res = await fetch(url);
          const data = await res.json();

          if (data["Note"] || data["Information"]) {
            set({ error: "api_limit", isLoading: false });
            return;
          }

          const gq = data["Global Quote"];
          if (!gq || !gq["05. price"]) {
            set({ isLoading: false });
            return;
          }

          const quote: StockQuote = {
            symbol: gq["01. symbol"],
            currentPrice: parseFloat(gq["05. price"]),
            change: parseFloat(gq["09. change"]),
            changePercent: parseFloat(
              (gq["10. change percent"] || "0").replace("%", ""),
            ),
            high: parseFloat(gq["03. high"]),
            low: parseFloat(gq["04. low"]),
            volume: parseInt(gq["06. volume"], 10),
            lastUpdated: new Date().toISOString(),
          };

          set((state) => ({
            quotes: { ...state.quotes, [symbol]: quote },
            isLoading: false,
            lastFetched: new Date().toISOString(),
          }));
        } catch {
          set({ error: "fetch_error", isLoading: false });
        }
      },

      fetchAllQuotes: async () => {
        const { holdings, fetchQuote } = get();
        const symbols = [...new Set(holdings.map((h) => h.symbol))];
        for (const symbol of symbols) {
          await fetchQuote(symbol);
          // Small delay to respect rate limits
          await new Promise((r) => setTimeout(r, 1200));
        }
      },

      searchSymbol: async (query) => {
        if (!query || query.length < 1) return [];

        const q = query.toLowerCase().trim();

        // ── 1. Search local Gulf stocks first ──
        const localStocks = [...MSM_STOCKS, ...TADAWUL_STOCKS, ...DFM_STOCKS];
        const localMatches = localStocks
          .filter(
            (s) =>
              s.symbol.toLowerCase().includes(q) ||
              s.nameEn.toLowerCase().includes(q) ||
              s.nameAr.includes(q),
          )
          .slice(0, 5)
          .map((s) => ({ symbol: s.symbol, name: s.nameEn }));

        // ── 2. Static list of popular international stocks ──
        const POPULAR: { symbol: string; name: string }[] = [
          { symbol: "AAPL", name: "Apple Inc." },
          { symbol: "MSFT", name: "Microsoft Corporation" },
          { symbol: "GOOGL", name: "Alphabet Inc." },
          { symbol: "AMZN", name: "Amazon.com Inc." },
          { symbol: "TSLA", name: "Tesla Inc." },
          { symbol: "NVDA", name: "NVIDIA Corporation" },
          { symbol: "META", name: "Meta Platforms Inc." },
          { symbol: "BRK.B", name: "Berkshire Hathaway Inc." },
          { symbol: "JPM", name: "JPMorgan Chase & Co." },
          { symbol: "V", name: "Visa Inc." },
          { symbol: "JNJ", name: "Johnson & Johnson" },
          { symbol: "WMT", name: "Walmart Inc." },
          { symbol: "PG", name: "Procter & Gamble Co." },
          { symbol: "UNH", name: "UnitedHealth Group Inc." },
          { symbol: "HD", name: "Home Depot Inc." },
          { symbol: "BAC", name: "Bank of America Corp." },
          { symbol: "MA", name: "Mastercard Inc." },
          { symbol: "XOM", name: "Exxon Mobil Corporation" },
          { symbol: "KO", name: "Coca-Cola Company" },
          { symbol: "INTC", name: "Intel Corporation" },
          { symbol: "PFE", name: "Pfizer Inc." },
          { symbol: "NFLX", name: "Netflix Inc." },
          { symbol: "ADBE", name: "Adobe Inc." },
          { symbol: "CRM", name: "Salesforce Inc." },
          { symbol: "AMD", name: "Advanced Micro Devices" },
          { symbol: "PYPL", name: "PayPal Holdings Inc." },
          { symbol: "BABA", name: "Alibaba Group" },
          { symbol: "TSM", name: "Taiwan Semiconductor" },
          { symbol: "NKE", name: "Nike Inc." },
          { symbol: "DIS", name: "Walt Disney Company" },
          { symbol: "2222.SR", name: "أرامكو السعودية" },
          { symbol: "1120.SR", name: "Al Rajhi Bank البنك الراجحي" },
          { symbol: "1180.SR", name: "Alinma Bank بنك الإنماء" },
          { symbol: "2010.SR", name: "Saudi Basic Industries SABIC" },
          { symbol: "7010.SR", name: "STC الاتصالات السعودية" },
          { symbol: "2380.SR", name: "Petro Rabigh" },
          { symbol: "EMAAR.DFM", name: "Emaar Properties إعمار" },
          { symbol: "DIB.DFM", name: "Dubai Islamic Bank" },
          { symbol: "FAB.DFM", name: "First Abu Dhabi Bank" },
        ];

        const popularMatches = POPULAR.filter(
          (s) =>
            s.symbol.toLowerCase().includes(q) ||
            s.name.toLowerCase().includes(q),
        ).slice(0, 5);

        // Merge, deduplicate by symbol
        const seen = new Set<string>();
        const merged: { symbol: string; name: string }[] = [];
        for (const item of [...localMatches, ...popularMatches]) {
          if (!seen.has(item.symbol)) {
            seen.add(item.symbol);
            merged.push(item);
          }
        }

        if (merged.length > 0) return merged.slice(0, 8);

        // ── 3. Fallback to Alpha Vantage if no local match ──
        try {
          const url = `${ALPHA_VANTAGE_BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${API_KEY}`;
          const res = await fetch(url);
          const data = await res.json();
          if (!data.bestMatches) return [];
          return data.bestMatches
            .slice(0, 8)
            .map((m: Record<string, string>) => ({
              symbol: m["1. symbol"],
              name: m["2. name"],
            }));
        } catch {
          return [];
        }
      },

      getPortfolioValue: () => {
        const { holdings, quotes } = get();
        return holdings.reduce((sum, h) => {
          const quote = quotes[h.symbol];
          const price = quote?.currentPrice ?? h.purchasePrice;
          return sum + price * h.quantity;
        }, 0);
      },

      getTotalProfitLoss: () => {
        const { holdings, quotes } = get();
        return holdings.reduce((sum, h) => {
          const quote = quotes[h.symbol];
          if (!quote) return sum;
          return sum + (quote.currentPrice - h.purchasePrice) * h.quantity;
        }, 0);
      },

      getHoldingProfitLoss: (id) => {
        const { holdings, quotes } = get();
        const holding = holdings.find((h) => h.id === id);
        if (!holding) return { amount: 0, percent: 0 };
        const quote = quotes[holding.symbol];
        if (!quote) return { amount: 0, percent: 0 };
        const amount =
          (quote.currentPrice - holding.purchasePrice) * holding.quantity;
        const percent =
          ((quote.currentPrice - holding.purchasePrice) /
            holding.purchasePrice) *
          100;
        return { amount, percent };
      },
    }),
    {
      name: "budget-buddy-stocks",
      partialize: (state) => ({
        holdings: state.holdings,
        // Don't persist quotes — they should be re-fetched
      }),
    },
  ),
);
