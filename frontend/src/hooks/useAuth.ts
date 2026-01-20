import { useState, useCallback } from "react";
import { authApi, setAccessToken, removeAccessToken } from "@/services/api";
import type { User, LoginRequest, SignupRequest } from "@/types";
import { storage } from "@/lib/utils";
import { AUTH } from "@/config/constants";

/**
 * 인증 상태 관리 훅
 * 
 * 📌 현재 상태: Mock 모드 (백엔드 연결 전)
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(() => 
    storage.get<User | null>(AUTH.USER_KEY, null)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = !!user;

  /**
   * 로그인
   */
  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(credentials);
      
      setAccessToken(response.accessToken);
      storage.set(AUTH.REFRESH_TOKEN_KEY, response.refreshToken);
      storage.set(AUTH.USER_KEY, response.user);
      
      setUser(response.user);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 로그아웃
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      removeAccessToken();
      setUser(null);
    }
  }, []);

  /**
   * 회원가입
   */
  const signup = useCallback(async (data: SignupRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.signup(data);
      
      setAccessToken(response.accessToken);
      storage.set(AUTH.REFRESH_TOKEN_KEY, response.refreshToken);
      storage.set(AUTH.USER_KEY, response.user);
      
      setUser(response.user);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 에러 초기화
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isLoggedIn,
    isLoading,
    error,
    login,
    logout,
    signup,
    clearError,
  };
}
