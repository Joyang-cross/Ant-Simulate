import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/config/constants";
import type { Account, UpdateStartAssetRequest } from "@/types";

/**
 * 계좌 관련 API 서비스 (Backend 연동)
 */

/**
 * 계좌 정보 조회
 */
export async function getAccount(userId: number): Promise<Account> {
  console.log("[Account] Get account for user:", userId);
  
  const response = await apiClient.get<Account>(API_ENDPOINTS.ACCOUNT.GET(userId));
  return response.data;
}

/**
 * 시드머니 업데이트
 */
export async function updateStartAsset(accountId: number, startAsset: number): Promise<void> {
  console.log("[Account] Update start asset:", accountId, startAsset);
  
  await apiClient.patch<void>(
    API_ENDPOINTS.ACCOUNT.UPDATE_START_ASSET(accountId),
    { startAsset } as UpdateStartAssetRequest
  );
}

/**
 * 계좌 리셋 (기본 1000만원으로)
 */
export async function resetAsset(accountId: number): Promise<void> {
  console.log("[Account] Reset asset:", accountId);
  
  await apiClient.patch<void>(API_ENDPOINTS.ACCOUNT.RESET_ASSET(accountId));
}
