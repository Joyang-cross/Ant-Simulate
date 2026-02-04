import { useState, useCallback } from "react";
import { authApi, removeAccessToken } from "@/services/api";
import type { User, LoginRequest, SignupRequest } from "@/types";
import { AUTH } from "@/config/constants";

/**
 * 인증 상태 관리 훅 (Backend 연동)
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    return authApi.getCurrentUser();
  });
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
      
      // 로그인 성공 시 사용자 정보 설정
      const loggedInUser: User = {
        id: response.userId,
        email: credentials.email,
        name: response.nickname,
        nickname: response.nickname,
        createdAt: new Date().toISOString()
      };
      
      setUser(loggedInUser);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "로그인에 실패했습니다.";
      setError(errorMessage);
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
      await authApi.signup(data);
      
      // 회원가입 성공 후 자동 로그인
      return await login({ email: data.email, password: data.password });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "회원가입에 실패했습니다.";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [login]);

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
