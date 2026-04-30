import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ZakatResult } from "./ZakatResult";
import { useTranslation } from "react-i18next";
import { OmaniRial } from "@/components/ui/OmaniRial";
import {
  calculateZakat,
  calculateZakatGold,
  calculateZakatSilver,
  calculateZakatTrade,
  calculateZakatLivestock,
} from "@/lib/zakat";
import { GOLD_PRICE_OMR, SILVER_PRICE_OMR } from "@/constants";
import type { ZakatResult as ZakatResultType, ZakatType } from "@/types";
import { cn } from "@/lib/utils";

const ZAKAT_TYPES: ZakatType[] = [
  "money",
  "gold",
  "silver",
  "trade",
  "livestock",
];

export function ZakatCalculator() {
  const { t } = useTranslation();

  const [zakatType, setZakatType] = useState<ZakatType>("money");
  const [result, setResult] = useState<ZakatResultType | null>(null);

  // money
  const [savings, setSavings] = useState("");
  const [monthsHeld, setMonthsHeld] = useState("12");
  // gold
  const [goldGrams, setGoldGrams] = useState("");
  // silver
  const [silverGrams, setSilverGrams] = useState("");
  // trade
  const [assets, setAssets] = useState("");
  const [debts, setDebts] = useState("");
  const [tradeMonths, setTradeMonths] = useState("12");
  // livestock
  const [animalType, setAnimalType] = useState<"camels" | "cows" | "sheep">(
    "camels",
  );
  const [count, setCount] = useState("");

  const handleCalculate = () => {
    let res: ZakatResultType;
    switch (zakatType) {
      case "money":
        res = calculateZakat(
          parseFloat(savings) || 0,
          parseInt(monthsHeld) || 0,
        );
        break;
      case "gold":
        res = calculateZakatGold(parseFloat(goldGrams) || 0);
        break;
      case "silver":
        res = calculateZakatSilver(parseFloat(silverGrams) || 0);
        break;
      case "trade":
        res = calculateZakatTrade(
          parseFloat(assets) || 0,
          parseFloat(debts) || 0,
          parseInt(tradeMonths) || 0,
        );
        break;
      case "livestock":
        res = calculateZakatLivestock(animalType, parseInt(count) || 0);
        break;
      default:
        return;
    }
    setResult(res);
  };

  const handleReset = () => {
    setResult(null);
    setSavings("");
    setMonthsHeld("12");
    setGoldGrams("");
    setSilverGrams("");
    setAssets("");
    setDebts("");
    setTradeMonths("12");
    setCount("");
  };

  const switchType = (type: ZakatType) => {
    setZakatType(type);
    setResult(null);
  };

  return (
    <div className="space-y-5">
      {/* Type selector */}
      <div>
        <p className="font-arabic text-sm text-neutral-muted mb-2">
          {t("zakatPage.selectType")}
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ZAKAT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => switchType(type)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full font-arabic text-xs font-semibold transition-colors",
                zakatType === type
                  ? "bg-gold text-white"
                  : "bg-neutral-bg dark:bg-white/5 text-neutral-muted hover:bg-gold/10 hover:text-gold",
              )}>
              {t(`zakatPage.type_${type}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        {zakatType === "money" && (
          <>
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
                {t("zakatPage.totalSavings")}{" "}
                <OmaniRial className="w-3 h-auto" />
              </label>
              <Input
                type="number"
                step="0.001"
                placeholder="0.000"
                className="font-mono text-lg h-12"
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
              />
            </div>
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
                {t("zakatPage.monthsLabel")}
              </label>
              <Input
                type="number"
                placeholder="12"
                className="font-mono text-lg h-12"
                value={monthsHeld}
                onChange={(e) => setMonthsHeld(e.target.value)}
              />
            </div>
          </>
        )}

        {zakatType === "gold" && (
          <div>
            <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
              {t("zakatPage.goldWeight")}
            </label>
            <Input
              type="number"
              step="0.1"
              placeholder="0.0"
              className="font-mono text-lg h-12"
              value={goldGrams}
              onChange={(e) => setGoldGrams(e.target.value)}
            />
            <p className="font-arabic text-xs text-neutral-muted mt-1">
              {t("zakatPage.goldNote", { price: GOLD_PRICE_OMR })}
            </p>
          </div>
        )}

        {zakatType === "silver" && (
          <div>
            <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
              {t("zakatPage.silverWeight")}
            </label>
            <Input
              type="number"
              step="0.1"
              placeholder="0.0"
              className="font-mono text-lg h-12"
              value={silverGrams}
              onChange={(e) => setSilverGrams(e.target.value)}
            />
            <p className="font-arabic text-xs text-neutral-muted mt-1">
              {t("zakatPage.silverNote", { price: SILVER_PRICE_OMR })}
            </p>
          </div>
        )}

        {zakatType === "trade" && (
          <>
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
                {t("zakatPage.tradeAssets")}{" "}
                <OmaniRial className="w-3 h-auto" />
              </label>
              <Input
                type="number"
                step="0.001"
                placeholder="0.000"
                className="font-mono text-lg h-12"
                value={assets}
                onChange={(e) => setAssets(e.target.value)}
              />
            </div>
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
                {t("zakatPage.tradeDebts")} <OmaniRial className="w-3 h-auto" />
              </label>
              <Input
                type="number"
                step="0.001"
                placeholder="0.000"
                className="font-mono text-lg h-12"
                value={debts}
                onChange={(e) => setDebts(e.target.value)}
              />
            </div>
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
                {t("zakatPage.monthsLabel")}
              </label>
              <Input
                type="number"
                placeholder="12"
                className="font-mono text-lg h-12"
                value={tradeMonths}
                onChange={(e) => setTradeMonths(e.target.value)}
              />
            </div>
          </>
        )}

        {zakatType === "livestock" && (
          <>
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
                {t("zakatPage.livestockType")}
              </label>
              <div className="flex gap-2">
                {(["camels", "cows", "sheep"] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => setAnimalType(a)}
                    className={cn(
                      "flex-1 py-2 rounded-xl font-arabic text-sm font-semibold transition-colors",
                      animalType === a
                        ? "bg-primary text-white"
                        : "bg-neutral-bg dark:bg-white/5 text-neutral-muted hover:bg-primary/10",
                    )}>
                    {t(`zakatPage.${a}`)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
                {t("zakatPage.livestockCount")}
              </label>
              <Input
                type="number"
                placeholder="0"
                className="font-mono text-lg h-12"
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="gold"
          className="flex-1"
          onClick={handleCalculate}>
          {t("zakatPage.calculate")}
        </Button>
        {result && (
          <Button type="button" variant="outline" onClick={handleReset}>
            {t("zakatPage.reset")}
          </Button>
        )}
      </div>

      {result && <ZakatResult result={result} />}
    </div>
  );
}
