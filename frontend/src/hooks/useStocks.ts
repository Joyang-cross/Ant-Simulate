import { useState, useEffect, useCallback } from "react";
import { stocksApi } from "@/services/api";
import type { Stock, StockChartData, OrderBook } from "@/types";

/**
 * 주식 데이터 관리 훅
 */
export function useStocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await stocksApi.getStocks();
      setStocks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "주식 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  return { stocks, isLoading, error, refetch: fetchStocks };
}

/**
 * 개별 주식 상세 정보 훅
 */
export function useStockDetail(code: string) {
  const [stock, setStock] = useState<Stock | null>(null);
  const [chartData, setChartData] = useState<StockChartData[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!code) return;

    setIsLoading(true);
    setError(null);

    try {
      const [stockData, chart, orders] = await Promise.all([
        stocksApi.getStockDetail(code),
        stocksApi.getStockChart(code),
        stocksApi.getOrderBook(code),
      ]);

      setStock(stockData);
      setChartData(chart);
      setOrderBook(orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "주식 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { stock, chartData, orderBook, isLoading, error, refetch: fetchData };
}

/**
 * 주식 검색 훅
 */
export function useStockSearch() {
  const [results, setResults] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const data = await stocksApi.searchStocks(query);
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
  }, []);

  return { results, isLoading, search, clear };
}
