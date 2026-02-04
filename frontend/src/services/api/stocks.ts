import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/config/constants";
import type { StockItem, StockPriceDaily, StockChartData, OrderBook, LikeStockResponse } from "@/types";

/**
 * 주식 관련 API 서비스 (Backend 연동)
 */

/**
 * 주식 목록 조회
 */
export async function getStockItems(): Promise<StockItem[]> {
  console.log("[Stocks] Get stock items list");
  
  const response = await apiClient.get<StockItem[]>(API_ENDPOINTS.STOCKS.LIST);
  // 응답이 배열인지 확인하고 안전하게 반환
  const data = response.data;
  console.log("[Stocks] Raw API response:", data);
  console.log("[Stocks] Response type:", typeof data, Array.isArray(data));
  if (Array.isArray(data)) {
    console.log("[Stocks] Received", data.length, "items");
    if (data.length > 0) {
      console.log("[Stocks] First item:", data[0]);
    }
    return data;
  }
  console.warn("[Stocks] API response is not an array:", data);
  return [];
}

/**
 * 주식 상세 정보 조회
 */
export async function getStockDetail(stockItemId: number): Promise<StockItem> {
  console.log("[Stocks] Get stock detail:", stockItemId);
  
  const response = await apiClient.get<StockItem>(API_ENDPOINTS.STOCKS.DETAIL(stockItemId));
  return response.data;
}

/**
 * 주식 일봉 차트 데이터 조회 (최대 20년치)
 */
export async function getStockPriceDaily(stockItemId: number): Promise<StockPriceDaily[]> {
  console.log("[Stocks] Get stock daily price:", stockItemId);
  
  const response = await apiClient.get<StockPriceDaily[]>(API_ENDPOINTS.STOCKS.CHART(stockItemId));
  // 응답이 배열인지 확인하고 안전하게 반환
  const data = response.data;
  if (Array.isArray(data)) {
    return data;
  }
  console.warn("[Stocks] Chart API response is not an array:", data);
  return [];
}

/**
 * 주식 차트 데이터를 프론트엔드 형식으로 변환
 */
export async function getStockChart(stockItemId: number): Promise<StockChartData[]> {
  const priceData = await getStockPriceDaily(stockItemId);
  
  console.log("[Stocks] Raw price data:", priceData.slice(0, 3));
  
  return priceData.map(p => ({
    // 백엔드 필드명 (tradeDate, openPrice 등) 또는 프론트엔드 필드명 (date, open 등) 지원
    time: p.tradeDate || p.date || '',
    date: p.tradeDate || p.date || '',
    open: Number(p.openPrice ?? p.open ?? 0),
    high: Number(p.highPrice ?? p.high ?? 0),
    low: Number(p.lowPrice ?? p.low ?? 0),
    close: Number(p.closePrice ?? p.close ?? 0),
    price: Number(p.closePrice ?? p.close ?? 0),
    volume: Number(p.volume ?? 0)
  }));
}

/**
 * 관심종목 추가/삭제 토글
 */
export async function toggleLikeStock(userId: number, stockItemId: number): Promise<LikeStockResponse> {
  console.log("[Stocks] Toggle like stock:", userId, stockItemId);
  
  const response = await apiClient.post<LikeStockResponse>(
    API_ENDPOINTS.STOCKS.LIKE(userId, stockItemId)
  );
  return response.data;
}

/**
 * 호가창 조회 (Mock - 실시간 WebSocket으로 받는 것이 정상)
 */
export async function getOrderBook(code: string): Promise<OrderBook> {
  console.log("[Stocks] Get order book:", code);
  
  // Mock 호가창 데이터 (WebSocket 연결 전까지 사용)
  const basePrice = 50000;
  return {
    asks: Array.from({ length: 10 }, (_, i) => ({
      price: basePrice + (i + 1) * 100,
      quantity: Math.floor(Math.random() * 1000) + 100,
      total: 0,
    })).map((entry) => ({ ...entry, total: entry.price * entry.quantity })),
    bids: Array.from({ length: 10 }, (_, i) => ({
      price: basePrice - (i + 1) * 100,
      quantity: Math.floor(Math.random() * 1000) + 100,
      total: 0,
    })).map((entry) => ({ ...entry, total: entry.price * entry.quantity })),
  };
}

/**
 * 주식 검색
 */
export async function searchStocks(query: string): Promise<StockItem[]> {
  console.log("[Stocks] Search stocks:", query);
  
  // 전체 목록에서 필터링
  const allStocks = await getStockItems();
  const lowerQuery = query.toLowerCase();
  
  return allStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(lowerQuery) ||
    stock.name.toLowerCase().includes(lowerQuery) ||
    (stock.stockAlias && stock.stockAlias.toLowerCase().includes(lowerQuery))
  );
}

// Legacy API 호환성 유지
export const getStocks = getStockItems;
