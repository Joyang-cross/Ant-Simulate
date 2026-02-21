import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/config/constants";
import type { Transaction, CreateTransactionRequest } from "@/types";

/**
 * 거래(체결) 관련 API 서비스 (Backend 연동)
 * Backend URL: /api/tracsaction (백엔드의 오타 그대로 사용)
 */

/**
 * 거래내역 조회
 */
export async function getTransactionList(userId: number): Promise<Transaction[]> {
  console.log("[Transaction] Get list for user:", userId);
  const response = await apiClient.get<Transaction[]>(
    API_ENDPOINTS.TRANSACTION.LIST(userId)
  );
  return response.data;
}

/**
 * 매수 / 매도 주문 생성
 */
export async function createTransaction(
  userId: number,
  stockItemId: number,
  request: CreateTransactionRequest
): Promise<void> {
  console.log("[Transaction] Create:", userId, stockItemId, request);
  await apiClient.post<void>(
    API_ENDPOINTS.TRANSACTION.CREATE(userId, stockItemId),
    request
  );
}
