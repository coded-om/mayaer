import { useState, useCallback } from "react";
import { calculateZakat } from "@/lib/zakat";
import type { ZakatResult } from "@/types";

export function useZakat() {
  const [result, setResult] = useState<ZakatResult | null>(null);

  const calculate = useCallback((savings: number, monthsHeld: number) => {
    const zakatResult = calculateZakat(savings, monthsHeld);
    setResult(zakatResult);
    return zakatResult;
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
