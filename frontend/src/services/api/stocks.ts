// API 클라이언트 - Mock 모드에서는 사용하지 않음 (추후 연동 시 사용)
import { apiClient as _apiClient } from "./client";
import { API_ENDPOINTS as _API_ENDPOINTS } from "@/config/constants";
import type { Stock, StockChartData, OrderBook } from "@/types";

/**
 * 주식 관련 API 서비스
 * 
 * 📌 현재 상태: Mock 데이터 반환 (백엔드 연결 전)
 */

// Mock 주식 데이터
const MOCK_STOCKS: Stock[] = [
  {
    code: "005930",
    name: "삼성전자",
    currentPrice: 72500,
    change: 1500,
    changePercent: 2.11,
    volume: 12500000,
    high: 73000,
    low: 71000,
    open: 71500,
    previousClose: 71000,
  },
  {
    code: "000660",
    name: "SK하이닉스",
    currentPrice: 135000,
    change: 3500,
    changePercent: 2.66,
    volume: 3200000,
    high: 136000,
    low: 131500,
    open: 132000,
    previousClose: 131500,
  },
  {
    code: "373220",
    name: "LG에너지솔루션",
    currentPrice: 385000,
    change: -8000,
    changePercent: -2.04,
    volume: 450000,
    high: 395000,
    low: 383000,
    open: 393000,
    previousClose: 393000,
  },
  {
    code: "005380",
    name: "현대차",
    currentPrice: 242500,
    change: 2500,
    changePercent: 1.04,
    volume: 890000,
    high: 244000,
    low: 239000,
    open: 240000,
    previousClose: 240000,
  },
  {
    code: "035420",
    name: "NAVER",
    currentPrice: 215000,
    change: 5000,
    changePercent: 2.38,
    volume: 1100000,
    high: 216000,
    low: 209000,
    open: 210000,
    previousClose: 210000,
  },
];

/**
 * 주식 목록 조회
 */
export async function getStocks(): Promise<Stock[]> {
  console.log("[Stocks] Get stock list");
  
  // 실제 API 연결 시 아래 코드 사용
  // const response = await apiClient.get<Stock[]>(API_ENDPOINTS.STOCKS.LIST);
  // return response.data;

  return MOCK_STOCKS;
}

/**
 * 주식 상세 정보 조회
 */
export async function getStockDetail(code: string): Promise<Stock> {
  console.log("[Stocks] Get stock detail:", code);
  
  // 실제 API 연결 시 아래 코드 사용
  // const response = await apiClient.get<Stock>(API_ENDPOINTS.STOCKS.DETAIL(code));
  // return response.data;

  const stock = MOCK_STOCKS.find((s) => s.code === code);
  if (!stock) {
    throw new Error(`Stock not found: ${code}`);
  }
  return stock;
}

/**
 * 주식 차트 데이터 조회
 */
export async function getStockChart(
  code: string,
  interval: string = "1d"
): Promise<StockChartData[]> {
  console.log("[Stocks] Get stock chart:", code, interval);
  
  // 실제 API 연결 시 아래 코드 사용
  // const response = await apiClient.get<StockChartData[]>(
  //   `${API_ENDPOINTS.STOCKS.CHART(code)}?interval=${interval}`
  // );
  // return response.data;

  // Mock 차트 데이터 생성
  const basePrice = MOCK_STOCKS.find((s) => s.code === code)?.currentPrice || 50000;
  return Array.from({ length: 30 }, (_, i) => ({
    time: `2025-01-${String(i + 1).padStart(2, "0")}`,
    price: basePrice + (Math.random() - 0.5) * basePrice * 0.1,
    volume: Math.floor(Math.random() * 1000000) + 500000,
  }));
}

/**
 * 호가창 조회
 */
export async function getOrderBook(code: string): Promise<OrderBook> {
  console.log("[Stocks] Get order book:", code);
  
  // 실제 API 연결 시 아래 코드 사용
  // const response = await apiClient.get<OrderBook>(API_ENDPOINTS.STOCKS.ORDERBOOK(code));
  // return response.data;

  const stock = MOCK_STOCKS.find((s) => s.code === code);
  const basePrice = stock?.currentPrice || 50000;

  // Mock 호가창 데이터 생성
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
export async function searchStocks(query: string): Promise<Stock[]> {
  console.log("[Stocks] Search stocks:", query);
  
  // 실제 API 연결 시 아래 코드 사용
  // const response = await apiClient.get<Stock[]>(
  //   `${API_ENDPOINTS.STOCKS.SEARCH}?q=${encodeURIComponent(query)}`
  // );
  // return response.data;

  return MOCK_STOCKS.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.code.includes(query)
  );
}
