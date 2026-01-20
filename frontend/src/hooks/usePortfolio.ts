import { useState, useEffect, useCallback } from "react";
import { portfolioApi } from "@/services/api";
import type { PortfolioSummary, PortfolioHistory } from "@/types";

/**
 * 포트폴리오 데이터 관리 훅
 */
export function usePortfolio() {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [history, setHistory] = useState<PortfolioHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await portfolioApi.getPortfolioSummary();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "포트폴리오를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async (period: "1W" | "1M" | "3M" | "6M" | "1Y" = "1M") => {
    try {
      const data = await portfolioApi.getPortfolioHistory(period);
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch portfolio history:", err);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
    fetchHistory();
  }, [fetchSummary, fetchHistory]);

  return {
    summary,
    history,
    isLoading,
    error,
    refetchSummary: fetchSummary,
    refetchHistory: fetchHistory,
  };
}
