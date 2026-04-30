import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  MarketId,
  HalalStatus,
  LocalStock,
  Sukuk,
  InvestmentFund,
  MarketIndex,
} from "@/types/markets";
import {
  getAllStocks,
  getStocksByMarket,
  getSukukByMarket,
  getFundsByMarket,
  MARKET_INDICES,
} from "@/constants/markets";

interface MarketsStore {
  selectedMarket: MarketId;
  searchQuery: string;
  halalFilter: HalalStatus | "all";
  watchlist: string[]; // stock symbols
  setSelectedMarket: (market: MarketId) => void;
  setSearchQuery: (q: string) => void;
  setHalalFilter: (f: HalalStatus | "all") => void;
  toggleWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
  getFilteredStocks: () => LocalStock[];
  getIndices: () => MarketIndex[];
  getSukuk: () => Sukuk[];
  getFunds: () => InvestmentFund[];
}

export const useMarketsStore = create<MarketsStore>()(
  persist(
    (set, get) => ({
      selectedMarket: "msm",
      searchQuery: "",
      halalFilter: "all",
      watchlist: [],

      setSelectedMarket: (market) => set({ selectedMarket: market }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setHalalFilter: (f) => set({ halalFilter: f }),

      toggleWatchlist: (symbol) => {
        set((state) => ({
          watchlist: state.watchlist.includes(symbol)
            ? state.watchlist.filter((s) => s !== symbol)
            : [...state.watchlist, symbol],
        }));
      },

      isInWatchlist: (symbol) => get().watchlist.includes(symbol),

      getFilteredStocks: () => {
        const { selectedMarket, searchQuery, halalFilter } = get();
        let stocks =
          selectedMarket === "global"
            ? getAllStocks()
            : getStocksByMarket(selectedMarket);

        if (halalFilter !== "all") {
          stocks = stocks.filter((s) => s.halalStatus === halalFilter);
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          stocks = stocks.filter(
            (s) =>
              s.symbol.toLowerCase().includes(q) ||
              s.nameEn.toLowerCase().includes(q) ||
              s.nameAr.includes(q),
          );
        }

        return stocks;
      },

      getIndices: () => MARKET_INDICES,

      getSukuk: () => {
        const { selectedMarket } = get();
        return selectedMarket === "global"
          ? getSukukByMarket()
          : getSukukByMarket(selectedMarket);
      },

      getFunds: () => {
        const { selectedMarket } = get();
        return selectedMarket === "global"
          ? getFundsByMarket()
          : getFundsByMarket(selectedMarket);
      },
    }),
    { name: "budget-buddy-markets" },
  ),
);
