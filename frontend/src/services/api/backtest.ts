import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/config/constants";
import type { BacktestRequest, BacktestResult } from "@/types";

/**
 * 백테스팅 관련 API 서비스 (Backend 연동)
 */

/**
 * 백테스팅 실행
 */
export async function runBacktest(request: BacktestRequest): Promise<BacktestResult> {
  console.log("[Backtest] Run backtest:", request);
  
  const response = await apiClient.post<BacktestResult>(
    API_ENDPOINTS.BACKTEST.RUN,
    request
  );
  return response.data;
}
