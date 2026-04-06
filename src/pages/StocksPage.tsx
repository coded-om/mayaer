import { AnimatePresence, motion } from "framer-motion";
import { TbChartLine } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { PortfolioSummary } from "@/components/stocks/PortfolioSummary";
import { StockCard } from "@/components/stocks/StockCard";
import { AddStockSheet } from "@/components/stocks/AddStockSheet";
import { useStocksStore } from "@/store/stocksStore";
import { useStockQuotes } from "@/hooks/useStockQuotes";

export function StocksPage({ embedded = false }: { embedded?: boolean }) {
  const { t } = useTranslation();
  const holdings = useStocksStore((s) => s.holdings);
  const quotes = useStocksStore((s) => s.quotes);
  const removeHolding = useStocksStore((s) => s.removeHolding);
  const getHoldingProfitLoss = useStocksStore((s) => s.getHoldingProfitLoss);
  const { isLoading } = useStockQuotes();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4">
      {!embedded && (
        <PageHeader title={t("stocks.title")} subtitle={t("stocks.subtitle")} />
      )}

      {holdings.length > 0 && <PortfolioSummary />}

      {isLoading && holdings.length > 0 && (
        <p className="font-arabic text-xs text-neutral-muted text-center animate-pulse">
          {t("stocks.loading")}
        </p>
      )}

      {holdings.length === 0 ? (
        <EmptyState
          icon={TbChartLine}
          title={t("stocks.noHoldings")}
          description={t("stocks.noHoldingsDesc")}
        />
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {holdings.map((holding) => (
              <StockCard
                key={holding.id}
                holding={holding}
                quote={quotes[holding.symbol]}
                profitLoss={getHoldingProfitLoss(holding.id)}
                onDelete={() => removeHolding(holding.id)}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      <AddStockSheet />
    </motion.div>
  );
}
