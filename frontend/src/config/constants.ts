// ============================================
// 애플리케이션 설정 상수
// ============================================

/**
 * API 기본 URL
 * 환경 변수에서 가져오거나 기본값 사용
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

/**
 * WebSocket URL
 */
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8080/ws";

/**
 * 앱 정보
 */
export const APP_INFO = {
  name: "Ant-Simulate",
  version: "1.0.0",
  description: "실시간 모의투자 플랫폼",
} as const;

/**
 * 인증 관련 상수
 */
export const AUTH = {
  ACCESS_TOKEN_KEY: "ant_access_token",
  REFRESH_TOKEN_KEY: "ant_refresh_token",
  USER_KEY: "ant_user",
  TOKEN_EXPIRY_BUFFER: 60 * 1000, // 1분 (밀리초)
} as const;

/**
 * API 엔드포인트 (Backend 연동)
 */
export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    SIGNUP: "/auth/signup",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
  },

  // 계좌
  ACCOUNT: {
    GET: (userId: number) => `/account/${userId}`,
    UPDATE_START_ASSET: (accountId: number) => `/account/${accountId}/update-start-asset`,
    RESET_ASSET: (accountId: number) => `/account/${accountId}/reset-asset`,
  },

  // 주식 (백엔드: /api/stock)
  STOCKS: {
    LIST: "/stock",
    DETAIL: (id: number) => `/stock/${id}`,
    CHART: (stockItemId: number) => `/stock/${stockItemId}`,
    LIKE: (userId: number, stockItemId: number) => `/stock/${userId}/${stockItemId}/like`,
    LIKED: (userId: number) => `/stock/${userId}/liked`,
    ORDERBOOK: (code: string) => `/stock/${code}/orderbook`,
    SEARCH: "/stock/search",
  },

  // 실시간 구독
  SUBSCRIPTION: {
    SUBSCRIBE: (symbol: string) => `/subscription/${symbol}`,
    UNSUBSCRIBE: (symbol: string) => `/subscription/${symbol}`,
  },

  // 거래
  ORDERS: {
    LIST: "/orders",
    CREATE: "/orders",
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    HISTORY: "/orders/history",
  },

  // 실제 거래 (백엔드 연동)
  TRANSACTION: {
    LIST: (userId: number) => `/transaction/${userId}`,
    CREATE: (userId: number, stockItemId: number) => `/transaction/${userId}/${stockItemId}`,
  },

  // 포트폴리오
  PORTFOLIO: {
    SUMMARY: "/portfolio/summary",
    HOLDINGS: "/portfolio/holdings",
    HISTORY: "/portfolio/history",
    PERFORMANCE: "/portfolio/performance",
  },

  // 백테스팅
  BACKTEST: {
    RUN: "/backtest",
  },

  // 뉴스
  NEWS: {
    LIST: "/news",
    DETAIL: (id: string) => `/news/${id}`,
    CATEGORIES: "/news/categories",
    TRENDING: "/news/trending",
  },

  // 사용자
  USER: {
    GET: (userId: number) => `/user/${userId}`,
    UPDATE: (userId: number) => `/user/${userId}`,
    DELETE: (userId: number) => `/user/${userId}`,
    NOTIFICATIONS: "/user/notifications",
    SETTINGS: "/user/settings",
  },
} as const;

/**
 * 차트 관련 상수
 */
export const CHART = {
  INTERVALS: ["1m", "5m", "15m", "30m", "1h", "1d", "1w", "1M"] as const,
  DEFAULT_INTERVAL: "1d" as const,
  COLORS: {
    UP: "#10b981", // emerald-500
    DOWN: "#f43f5e", // rose-500
    NEUTRAL: "#64748b", // slate-500
    GRID: "rgba(255, 255, 255, 0.05)",
    TOOLTIP_BG: "rgba(15, 23, 42, 0.9)",
  },
} as const;

/**
 * 거래 관련 상수
 */
export const TRADING = {
  ORDER_TYPES: ["market", "limit"] as const,
  MIN_ORDER_QUANTITY: 1,
  MAX_ORDER_QUANTITY: 10000,
  FEE_RATE: 0.00015, // 0.015%
  TAX_RATE: 0.0023, // 0.23% (매도시)
} as const;

/**
 * 백테스팅 관련 상수
 */
export const BACKTEST = {
  STRATEGIES: [
    { value: "momentum", label: "모멘텀 전략" },
    { value: "meanReversion", label: "평균 회귀 전략" },
    { value: "breakout", label: "돌파 전략" },
    { value: "macd", label: "MACD 전략" },
    { value: "rsi", label: "RSI 전략" },
    { value: "custom", label: "사용자 정의" },
  ],
  DEFAULT_INITIAL_CAPITAL: 10000000, // 1천만원
  MIN_CAPITAL: 1000000, // 100만원
  MAX_CAPITAL: 1000000000, // 10억원
} as const;

/**
 * UI 관련 상수
 */
export const UI = {
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  PAGE_SIZE: 20,
} as const;
