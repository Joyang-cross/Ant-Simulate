// API 클라이언트 - Mock 모드에서는 사용하지 않음 (추후 연동 시 사용)
import { apiClient as _apiClient } from "./client";
import { API_ENDPOINTS as _API_ENDPOINTS } from "@/config/constants";
import type { PortfolioSummary, Holding, PortfolioHistory } from "@/types";

/**
 * 포트폴리오 관련 API 서비스
 * 
 * 📌 현재 상태: Mock 데이터 반환 (백엔드 연결 전)
 */

// Mock 보유 종목 데이터
const MOCK_HOLDINGS: Holding[] = [
  {
    stockCode: "005930",
    stockName: "삼성전자",
    quantity: 100,
    averagePrice: 68000,
    currentPrice: 72500,
    totalValue: 7250000,
    profitLoss: 450000,
    profitLossPercent: 6.62,
  },
  {
    stockCode: "000660",
    stockName: "SK하이닉스",
    quantity: 30,
    averagePrice: 125000,
    currentPrice: 135000,
    totalValue: 4050000,
    profitLoss: 300000,
    profitLossPercent: 8.0,
  },
  {
    stockCode: "035420",
    stockName: "NAVER",
    quantity: 20,
    averagePrice: 220000,
    currentPrice: 215000,
    totalValue: 4300000,
    profitLoss: -100000,
    profitLossPercent: -2.27,
  },
];

// Mock 포트폴리오 요약
const MOCK_PORTFOLIO_SUMMARY: PortfolioSummary = {
  totalValue: 25600000,
  totalInvestment: 20000000,
  totalProfitLoss: 5600000,
  totalProfitLossPercent: 28.0,
  cash: 10000000,
  holdings: MOCK_HOLDINGS,
};

/**
 * 포트폴리오 요약 조회
 */
export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  console.log("[Portfolio] Get summary");
  
  // 실제 API 연결 시 아래 코드 사용
  // const response = await apiClient.get<PortfolioSummary>(
  //   API_ENDPOINTS.PORTFOLIO.SUMMARY
  // );
  // return response.data;

  return MOCK_PORTFOLIO_SUMMARY;
}

/**
 * 보유 종목 조회
 */
export async function getHoldings(): Promise<Holding[]> {
  console.log("[Portfolio] Get holdings");
  
  // 실제 API 연결 시 아래 코드 사용
  // const response = await apiClient.get<Holding[]>(
  //   API_ENDPOINTS.PORTFOLIO.HOLDINGS
  // );
  // return response.data;

  return MOCK_HOLDINGS;
}

/**
 * 포트폴리오 히스토리 조회
 */
export async function getPortfolioHistory(
  period: "1W" | "1M" | "3M" | "6M" | "1Y" = "1M"
): Promise<PortfolioHistory[]> {
  console.log("[Portfolio] Get history:", period);
  
  // 실제 API 연결 시 아래 코드 사용
  // const response = await apiClient.get<PortfolioHistory[]>(
  //   `${API_ENDPOINTS.PORTFOLIO.HISTORY}?period=${period}`
  // );
  // return response.data;

  // Mock 히스토리 데이터 생성
  const days = period === "1W" ? 7 : period === "1M" ? 30 : period === "3M" ? 90 : period === "6M" ? 180 : 365;
  const baseValue = 20000000;
  
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    const growth = 1 + (i / days) * 0.28 + (Math.random() - 0.5) * 0.05;
    const totalValue = Math.floor(baseValue * growth);
    
    return {
      date: date.toISOString().split("T")[0],
      totalValue,
      profitLoss: totalValue - baseValue,
    };
  });
}
