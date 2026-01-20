/**
 * API 서비스 모듈 통합 export
 * 
 * 사용 예시:
 * ```ts
 * import { authApi, stocksApi, portfolioApi, ordersApi } from '@/services/api';
 * 
 * // 로그인
 * const result = await authApi.login({ email, password });
 * 
 * // 주식 목록 조회
 * const stocks = await stocksApi.getStocks();
 * ```
 */

// API 클라이언트
export { apiClient, ApiError, setAccessToken, removeAccessToken } from "./client";

// 인증 API
export * as authApi from "./auth";

// 주식 API
export * as stocksApi from "./stocks";

// 포트폴리오 API
export * as portfolioApi from "./portfolio";

// 주문 API
export * as ordersApi from "./orders";
