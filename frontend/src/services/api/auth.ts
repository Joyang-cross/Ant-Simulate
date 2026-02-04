import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/config/constants";
import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse, User } from "@/types";

/**
 * 인증 관련 API 서비스 (Backend 연동)
 */

/**
 * 로그인
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  console.log("[Auth] Login attempt:", credentials.email);
  
  const response = await apiClient.post<LoginResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials
  );
  
  // 로그인 성공 시 userId를 localStorage에 저장
  if (response.data.userId) {
    localStorage.setItem("ant_user_id", String(response.data.userId));
    localStorage.setItem("ant_nickname", response.data.nickname);
  }
  
  return response.data;
}

/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
  console.log("[Auth] Logout");
  localStorage.removeItem("ant_user_id");
  localStorage.removeItem("ant_nickname");
}

/**
 * 회원가입
 */
export async function signup(data: SignupRequest): Promise<SignupResponse> {
  console.log("[Auth] Signup attempt:", data.email);
  
  const response = await apiClient.post<SignupResponse>(
    API_ENDPOINTS.AUTH.SIGNUP,
    data
  );
  return response.data;
}

/**
 * 현재 사용자 정보 조회 (localStorage 기반)
 */
export function getCurrentUser(): User | null {
  const userId = localStorage.getItem("ant_user_id");
  const nickname = localStorage.getItem("ant_nickname");
  
  if (!userId) return null;
  
  return {
    id: Number(userId),
    email: "",
    name: nickname || "",
    nickname: nickname || "",
    createdAt: new Date().toISOString()
  };
}

/**
 * 토큰 갱신 (현재 미사용 - JWT 미구현)
 */
export async function refreshToken(_token: string): Promise<{ accessToken: string }> {
  console.log("[Auth] Refresh token");
  return {
    accessToken: "mock-new-access-token-" + Date.now(),
  };
}
