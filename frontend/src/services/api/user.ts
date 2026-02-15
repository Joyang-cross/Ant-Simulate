import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/config/constants";

/**
 * 사용자 정보 응답 타입
 */
export interface GetUserResponse {
  email: string;
  name: string;
  nickname: string;
}

/**
 * 사용자 관련 API 서비스 (Backend 연동)
 */

/**
 * 사용자 정보 조회
 */
export async function getUser(userId: number): Promise<GetUserResponse> {
  console.log("[User] Get user info:", userId);

  const response = await apiClient.get<GetUserResponse>(API_ENDPOINTS.USER.GET(userId));
  return response.data;
}

/**
 * 사용자 정보 수정
 */
export async function updateUser(userId: number, name: string, nickname: string): Promise<void> {
  console.log("[User] Update user:", userId, name, nickname);

  await apiClient.put<void>(API_ENDPOINTS.USER.UPDATE(userId), { name, nickname });
}

/**
 * 계정 탈퇴
 */
export async function deleteUser(userId: number, password: string): Promise<void> {
  console.log("[User] Delete user:", userId);

  await apiClient.delete<void>(API_ENDPOINTS.USER.DELETE(userId), { password });
}
