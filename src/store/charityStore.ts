import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CharityEntry {
  id: string;
  amount: number;
  note?: string;
  date: string;
  type: "sadaqah" | "zakat" | "other";
}

interface CharityStore {
  entries: CharityEntry[];
  addEntry: (entry: Omit<CharityEntry, "id">) => void;
  deleteEntry: (id: string) => void;
  getTotal: () => number;
  getThisMonth: () => CharityEntry[];
}

export const useCharityStore = create<CharityStore>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        set((state) => ({
          entries: [{ ...entry, id: crypto.randomUUID() }, ...state.entries],
        }));
      },

      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        }));
      },

      getTotal: () => {
        return get().entries.reduce((sum, e) => sum + e.amount, 0);
      },

      getThisMonth: () => {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        return get().entries.filter((e) => {
          const d = new Date(e.date);
          return d.getMonth() === month && d.getFullYear() === year;
        });
      },
    }),
    { name: "budget-buddy-charity" },
  ),
);
