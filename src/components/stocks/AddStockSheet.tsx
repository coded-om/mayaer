import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { StockSearch } from "./StockSearch";
import { useStocksStore } from "@/store/stocksStore";
import { TbPlus } from "react-icons/tb";
import { motion } from "framer-motion";

export function AddStockSheet() {
  const { t } = useTranslation();
  const addHolding = useStocksStore((s) => s.addHolding);
  const fetchQuote = useStocksStore((s) => s.fetchQuote);
  const [open, setOpen] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = () => {
    const priceNum = parseFloat(price);
    const qtyNum = parseFloat(quantity);
    if (
      !symbol ||
      isNaN(priceNum) ||
      priceNum <= 0 ||
      isNaN(qtyNum) ||
      qtyNum <= 0
    )
      return;

    addHolding({
      symbol: symbol.toUpperCase(),
      name,
      purchasePrice: priceNum,
      quantity: qtyNum,
      purchaseDate: date,
      currency: "USD",
    });

    fetchQuote(symbol.toUpperCase());

    // Reset
    setSymbol("");
    setName("");
    setPrice("");
    setQuantity("");
    setDate(new Date().toISOString().split("T")[0]);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-24 md:bottom-8 end-5 z-30 w-14 h-14 rounded-2xl bg-primary shadow-lg shadow-primary/30 flex items-center justify-center">
          <TbPlus className="w-7 h-7 text-white" />
        </motion.button>
      </SheetTrigger>
      <SheetContent>
        <h2 className="font-arabic text-lg font-bold text-neutral-text dark:text-white mb-1">
          {t("stocks.addStock")}
        </h2>
        <p className="font-arabic text-sm text-neutral-muted mb-4">
          {t("stocks.addStockDesc")}
        </p>

        <div className="space-y-4">
          {/* Symbol search */}
          <StockSearch
            onSelect={(sym, nm) => {
              setSymbol(sym);
              setName(nm);
            }}
          />

          {symbol && (
            <div className="px-3 py-2 rounded-xl bg-primary/5 dark:bg-primary/10">
              <p className="font-mono text-sm font-semibold text-primary">
                {symbol}
              </p>
              <p className="font-arabic text-xs text-neutral-muted">{name}</p>
            </div>
          )}

          {/* Purchase Price */}
          <div>
            <label className="font-arabic text-sm font-medium text-neutral-text dark:text-white block mb-1.5">
              {t("stocks.purchasePrice")} ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-white/70 dark:border-white/[0.08] font-arabic text-sm text-neutral-text dark:text-white placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="font-arabic text-sm font-medium text-neutral-text dark:text-white block mb-1.5">
              {t("stocks.quantity")}
            </label>
            <input
              type="number"
              step="1"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1"
              className="w-full px-3 py-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-white/70 dark:border-white/[0.08] font-arabic text-sm text-neutral-text dark:text-white placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Purchase Date */}
          <div>
            <label className="font-arabic text-sm font-medium text-neutral-text dark:text-white block mb-1.5">
              {t("stocks.purchaseDate")}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-white/70 dark:border-white/[0.08] font-arabic text-sm text-neutral-text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!symbol || !price || !quantity}
            className="w-full py-3 rounded-xl font-arabic text-sm font-semibold bg-primary text-white hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {t("stocks.save")}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
