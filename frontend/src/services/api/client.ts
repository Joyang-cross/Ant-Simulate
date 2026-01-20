import { API_BASE_URL, AUTH } from "@/config/constants";
import type { ApiResponse } from "@/types";

/**
 * API 클라이언트 설정 및 유틸리티
 * 
 * 📌 현재 상태: Mock 모드 (백엔드 연결 전)
 * 실제 API 연결 시 USE_MOCK_API를 false로 변경하세요.
 */

// Mock 모드 플래그 - 백엔드 연결 시 false로 변경
const USE_MOCK_API = true;

/**
 * 저장된 액세스 토큰 가져오기
 */
function getAccessToken(): string | null {
  try {
    return localStorage.getItem(AUTH.ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * 액세스 토큰 저장
 */
export function setAccessToken(token: string): void {
  localStorage.setItem(AUTH.ACCESS_TOKEN_KEY, token);
}

/**
 * 액세스 토큰 삭제
 */
export function removeAccessToken(): void {
  localStorage.removeItem(AUTH.ACCESS_TOKEN_KEY);
  localStorage.removeItem(AUTH.REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH.USER_KEY);
}

/**
 * 기본 요청 헤더 생성
 */
function createHeaders(customHeaders?: HeadersInit): Headers {
  const headers = new Headers({
    "Content-Type": "application/json",
    ...customHeaders,
  });

  const token = getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

/**
 * API 응답 처리
 */
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `HTTP Error: ${response.status}`,
      response.status,
      errorData
    );
  }

  const data = await response.json();
  return data;
}

/**
 * API 에러 클래스
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * HTTP 요청 옵션 타입
 */
interface RequestOptions {
  headers?: HeadersInit;
  signal?: AbortSignal;
}

/**
 * API 클라이언트
 * 
 * 사용 예시:
 * ```ts
 * const response = await apiClient.get<User[]>('/users');
 * const newUser = await apiClient.post<User>('/users', { name: 'John' });
 * ```
 */
export const apiClient = {
  /**
   * GET 요청
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    // === Mock 모드 ===
    if (USE_MOCK_API) {
      console.log(`[Mock API] GET ${endpoint}`);
      return { success: true, data: {} as T };
    }

    // === 실제 API 호출 (백엔드 연결 시 활성화) ===
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: createHeaders(options?.headers),
      signal: options?.signal,
    });

    return handleResponse<T>(response);
  },

  /**
   * POST 요청
   */
  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    // === Mock 모드 ===
    if (USE_MOCK_API) {
      console.log(`[Mock API] POST ${endpoint}`, body);
      return { success: true, data: {} as T };
    }

    // === 실제 API 호출 (백엔드 연결 시 활성화) ===
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: createHeaders(options?.headers),
      body: body ? JSON.stringify(body) : undefined,
      signal: options?.signal,
    });

    return handleResponse<T>(response);
  },

  /**
   * PUT 요청
   */
  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    // === Mock 모드 ===
    if (USE_MOCK_API) {
      console.log(`[Mock API] PUT ${endpoint}`, body);
      return { success: true, data: {} as T };
    }

    // === 실제 API 호출 (백엔드 연결 시 활성화) ===
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: createHeaders(options?.headers),
      body: body ? JSON.stringify(body) : undefined,
      signal: options?.signal,
    });

    return handleResponse<T>(response);
  },

  /**
   * PATCH 요청
   */
  async patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    // === Mock 모드 ===
    if (USE_MOCK_API) {
      console.log(`[Mock API] PATCH ${endpoint}`, body);
      return { success: true, data: {} as T };
    }

    // === 실제 API 호출 (백엔드 연결 시 활성화) ===
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: createHeaders(options?.headers),
      body: body ? JSON.stringify(body) : undefined,
      signal: options?.signal,
    });

    return handleResponse<T>(response);
  },

  /**
   * DELETE 요청
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    // === Mock 모드 ===
    if (USE_MOCK_API) {
      console.log(`[Mock API] DELETE ${endpoint}`);
      return { success: true, data: {} as T };
    }

    // === 실제 API 호출 (백엔드 연결 시 활성화) ===
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: createHeaders(options?.headers),
      signal: options?.signal,
    });

    return handleResponse<T>(response);
  },
};

export default apiClient;
