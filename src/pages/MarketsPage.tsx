import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { TbSearch, TbBell, TbBuildingBank, TbChartLine } from "react-icons/tb";
import { PageHeader } from "@/components/shared/PageHeader";
import { MarketSelector } from "@/components/markets/MarketSelector";
import { MarketIndexCard } from "@/components/markets/MarketIndexCard";
import { HalalFilter } from "@/components/markets/HalalFilter";
import { StockListItem } from "@/components/markets/StockListItem";
import { StockDetailSheet } from "@/components/markets/StockDetailSheet";
import { SukukCard } from "@/components/markets/SukukCard";
import { FundCard } from "@/components/markets/FundCard";
import { HalalDetailSheet } from "@/components/markets/HalalDetailSheet";
import { AlertCard } from "@/components/alerts/AlertCard";
import { AlertSettings } from "@/components/alerts/AlertSettings";
import { useMarketsStore } from "@/store/marketsStore";
import { useAlertsStore } from "@/store/alertsStore";
import { StocksPage } from "@/pages/StocksPage";
import type { LocalStock } from "@/types/markets";
import { cn } from "@/lib/utils";

type TabKey = "stocks" | "sukuk" | "funds" | "alerts";

export function MarketsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [pageTab, setPageTab] = useState<"markets" | "portfolio">(
    searchParams.get("tab") === "portfolio" ? "portfolio" : "markets",
  );
  const [tab, setTab] = useState<TabKey>("stocks");
  const [selectedStock, setSelectedStock] = useState<LocalStock | null>(null);
  const [halalStock, setHalalStock] = useState<LocalStock | null>(null);

  const {
    selectedMarket,
    setSelectedMarket,
    searchQuery,
    setSearchQuery,
    halalFilter,
    setHalalFilter,
    getFilteredStocks,
    getIndices,
    getSukuk,
    getFunds,
    isInWatchlist,
    toggleWatchlist,
  } = useMarketsStore();

  const alerts = useAlertsStore((s) => s.alerts);
  const markRead = useAlertsStore((s) => s.markRead);
  const unreadCount = useAlertsStore((s) => s.getUnreadCount());

  const stocks = getFilteredStocks();
  const indices = getIndices();
  const sukuk = getSukuk();
  const funds = getFunds();

  const TABS: { key: TabKey; labelKey: string; count?: number }[] = [
    { key: "stocks", labelKey: "markets.tabs.stocks" },
    { key: "sukuk", labelKey: "markets.tabs.sukuk" },
    { key: "funds", labelKey: "markets.tabs.funds" },
    { key: "alerts", labelKey: "markets.tabs.alerts", count: unreadCount },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-5">
        <PageHeader
          title={t("markets.title")}
          subtitle={t("markets.subtitle")}
        />

        {/* Page-level tab: Markets / Portfolio */}
        <div className="flex gap-2 p-1 rounded-xl bg-neutral-bg dark:bg-white/[0.05]">
          <button
            onClick={() => setPageTab("markets")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-arabic text-sm font-semibold transition-colors",
              pageTab === "markets"
                ? "bg-white dark:bg-white/10 text-primary shadow-sm"
                : "text-neutral-muted",
            )}>
            <TbBuildingBank className="w-4 h-4" />
            {t("nav.markets")}
          </button>
          <button
            onClick={() => setPageTab("portfolio")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-arabic text-sm font-semibold transition-colors",
              pageTab === "portfolio"
                ? "bg-white dark:bg-white/10 text-primary shadow-sm"
                : "text-neutral-muted",
            )}>
            <TbChartLine className="w-4 h-4" />
            {t("nav.stocks")}
          </button>
        </div>

        {pageTab === "portfolio" ? (
          <StocksPage embedded />
        ) : (
          <>
            {/* Market Selector */}
            <MarketSelector
              selected={selectedMarket}
              onChange={setSelectedMarket}
            />

            {/* Indices Ticker */}
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
              {indices.map((idx) => (
                <MarketIndexCard key={idx.id} index={idx} />
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-white/40 dark:bg-white/5 border border-white/70 dark:border-white/[0.08]">
              {TABS.map((t_) => (
                <button
                  key={t_.key}
                  onClick={() => setTab(t_.key)}
                  className={cn(
                    "relative flex-1 py-2 rounded-lg font-arabic text-xs font-medium transition-colors",
                    tab === t_.key
                      ? "text-white"
                      : "text-neutral-muted dark:text-gray-400",
                  )}>
                  {tab === t_.key && (
                    <motion.div
                      layoutId="marketsTab"
                      className="absolute inset-0 rounded-lg bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1">
                    {t(t_.labelKey)}
                    {t_.count != null && t_.count > 0 && (
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center">
                        {t_.count}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>

            {/* Stocks Tab */}
            {tab === "stocks" && (
              <div className="space-y-3">
                {/* Search */}
                <div className="relative">
                  <TbSearch className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-white/70 dark:border-white/[0.08] bg-white/50 dark:bg-white/5 font-arabic text-sm text-neutral-text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-neutral-muted"
                    placeholder={t("markets.searchPlaceholder")}
                  />
                </div>

                {/* Halal Filter */}
                <HalalFilter value={halalFilter} onChange={setHalalFilter} />

                {/* Stock List */}
                <div className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] divide-y divide-white/50 dark:divide-white/[0.06]">
                  {stocks.length > 0 ? (
                    stocks.map((stock) => (
                      <StockListItem
                        key={stock.symbol}
                        stock={stock}
                        inWatchlist={isInWatchlist(stock.symbol)}
                        onToggleWatchlist={() => toggleWatchlist(stock.symbol)}
                        onPress={() => setSelectedStock(stock)}
                      />
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="font-arabic text-sm text-neutral-muted">
                        {t("markets.noResults")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sukuk Tab */}
            {tab === "sukuk" && (
              <div className="space-y-3">
                {sukuk.length > 0 ? (
                  sukuk.map((s) => <SukukCard key={s.id} sukuk={s} />)
                ) : (
                  <div className="p-8 text-center">
                    <p className="font-arabic text-sm text-neutral-muted">
                      {t("markets.noSukuk")}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Funds Tab */}
            {tab === "funds" && (
              <div className="space-y-3">
                {funds.length > 0 ? (
                  funds.map((f) => <FundCard key={f.id} fund={f} />)
                ) : (
                  <div className="p-8 text-center">
                    <p className="font-arabic text-sm text-neutral-muted">
                      {t("markets.noFunds")}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Alerts Tab */}
            {tab === "alerts" && (
              <div className="space-y-4">
                <AlertSettings />
                <div className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-2 space-y-1">
                  {alerts.length > 0 ? (
                    alerts.map((a) => (
                      <AlertCard
                        key={a.id}
                        alert={a}
                        onRead={() => markRead(a.id)}
                      />
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <TbBell className="w-8 h-8 text-neutral-muted/30 mx-auto mb-2" />
                      <p className="font-arabic text-sm text-neutral-muted">
                        {t("alerts.empty")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {pageTab === "markets" && (
        <>
          <StockDetailSheet
            stock={selectedStock}
            open={!!selectedStock}
            onOpenChange={(open) => !open && setSelectedStock(null)}
          />
          <HalalDetailSheet
            stock={halalStock}
            open={!!halalStock}
            onOpenChange={(open) => !open && setHalalStock(null)}
          />
        </>
      )}
    </div>
  );
}
