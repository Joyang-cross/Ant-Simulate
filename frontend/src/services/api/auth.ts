// API 클라이언트 - Mock 모드에서는 사용하지 않음 (추후 연동 시 사용)
import { apiClient as _apiClient } from "./client";
import { API_ENDPOINTS as _API_ENDPOINTS } from "@/config/constants";
import type { LoginRequest, LoginResponse, SignupRequest, User } from "@/types";

/**
 * 인증 관련 API 서비스
 * 
 * 📌 현재 상태: Mock 데이터 반환 (백엔드 연결 전)
 */

// Mock 사용자 데이터
const MOCK_USER: User = {
  id: "user-001",
  email: "demo@ant-simulate.com",
  name: "데모 사용자",
  profileImage: undefined,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-20T00:00:00Z",
};

/**
 * 로그인
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  // === Mock 모드: 항상 성공 반환 ===
  console.log("[Auth] Login attempt:", credentials.email);
  
  // 실제 API 연결 시 아래 코드 사용
  // const response = await apiClient.post<LoginResponse>(
  //   API_ENDPOINTS.AUTH.LOGIN,
  //   credentials
  // );
  // return response.data;

  // Mock 응답
  return {
    user: MOCK_USER,
    accessToken: "mock-access-token-" + Date.now(),
    refreshToken: "mock-refresh-token-" + Date.now(),
  };
}

/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
  console.log("[Auth] Logout");
  
  // 실제 API 연결 시 아래 코드 사용
  // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  
  // 로컬 토큰 삭제는 호출하는 쪽에서 처리
}

/**
 * 회원가입
 */
export async function signup(data: SignupRequest): Promise<LoginResponse> {
  console.log("[Auth] Signup attempt:", data.email);
  
  // 실제 API 연결 시 아래 코드 사용
  // const response = await apiClient.post<LoginResponse>(
  //   API_ENDPOINTS.AUTH.SIGNUP,
  //   data
  // );
  // return response.data;

  // Mock 응답
  return {
    user: { ...MOCK_USER, email: data.email, name: data.name },
    accessToken: "mock-access-token-" + Date.now(),
    refreshToken: "mock-refresh-token-" + Date.now(),
  };
}

/**
 * 현재 사용자 정보 조회
 */
export async function getCurrentUser(): Promise<User> {
  console.log("[Auth] Get current user");
  
  // 실제 API 연결 시 아래 코드 사용
  // const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  // return response.data;

  // Mock 응답
  return MOCK_USER;
}

/**
 * 토큰 갱신
 */
export async function refreshToken(_token: string): Promise<{ accessToken: string }> {
  console.log("[Auth] Refresh token");
  
  // 실제 API 연결 시 아래 코드 사용
  // const response = await apiClient.post<{ accessToken: string }>(
  //   API_ENDPOINTS.AUTH.REFRESH,
  //   { refreshToken }
  // );
  // return response.data;

  // Mock 응답
  return {
    accessToken: "mock-new-access-token-" + Date.now(),
  };
}
