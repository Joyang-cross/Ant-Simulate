// ============================================
// 공통 타입 정의
// ============================================

// 화면 타입
export type ScreenType = "login" | "signup" | "trading" | "portfolio" | "backtesting" | "mypage" | "news" | "stockDetail";

// ============================================
// 사용자 관련 타입 (Backend 연동)
// ============================================
export interface User {
  id: number;
  email: string;
  name: string;
  nickname: string;
  profileImage?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  nickname: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  nickname: string;
}

export interface SignupResponse {
  userId: number;
  email: string;
}

// ============================================
// 계좌 관련 타입 (Backend 연동)
// ============================================
export interface Account {
  accountId: number;
  startAsset: number;
  totalAsset: number;
}

export interface UpdateStartAssetRequest {
  startAsset: number;
}

// ============================================
// 거래 내역 타입 (Backend 연동)
// ============================================
export interface Transaction {
  stockSymbol: string;
  stockName: string;
  transactionType: 'BUY' | 'SELL';
  price: number;        // 원화 기준 주당 가격
  quantity: number;
  createdAt: string;    // ISO 날짜 문자열
}

export interface CreateTransactionRequest {
  transactionType: 'BUY' | 'SELL';
  quantity: number;
}

// ============================================
// 주식/거래 관련 타입 (Backend 연동)
// ============================================

// 프론트엔드용 주식 타입 (호환성 유지)
export interface Stock {
  code: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

// 백엔드 StockItems 엔티티 (백엔드 필드명과 일치)
export interface StockItem {
  id: number;
  stockSymbol: string;
  stockName: string;
  // 프론트엔드 호환용 alias (선택적)
  symbol?: string;
  name?: string;
  stockType?: string;
  stockCountry?: string;
  stockAlias?: string;
}

// 백엔드 StockPriceDaily API 응답 (GetStockPriceDailyResponse)
export interface StockPriceDaily {
  stockPriceDailyId?: number;
  stockName?: string;
  tradeDate: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  volume: number;
  // 프론트엔드 호환용 alias (선택적)
  id?: number;
  stockItemId?: number;
  date?: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  createdAt?: string;
  updatedAt?: string;
}

// 관심종목 토글 응답
export interface LikeStockResponse {
  status: "create" | "delete";
}

// 관심종목 아이템
export interface LikedStockItem extends StockItem {
  likeId: number;
  likedAt: string;
}

export interface StockChartData {
  time: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  price: number;
  volume: number;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

export interface OrderBook {
  asks: OrderBookEntry[];
  bids: OrderBookEntry[];
}

export interface Order {
  id: string;
  stockCode: string;
  stockName: string;
  type: "buy" | "sell";
  orderType: "market" | "limit";
  price: number;
  quantity: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  executedAt?: string;
}

export interface TradeHistory {
  id: string;
  stockCode: string;
  stockName: string;
  type: "buy" | "sell";
  price: number;
  quantity: number;
  totalAmount: number;
  executedAt: string;
}

// ============================================
// 포트폴리오 관련 타입
// ============================================
export interface Holding {
  stockCode: string;
  stockName: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvestment: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  cash: number;
  holdings: Holding[];
}

export interface PortfolioHistory {
  date: string;
  totalValue: number;
  profitLoss: number;
}

// ============================================
// 백테스팅 관련 타입 (Backend 연동)
// ============================================

// 백테스트 인터벌 타입
export type BacktestInterval = "1m" | "5m" | "15m" | "30m" | "1h" | "1d";

// 백테스트 전략 타입
export type BacktestStrategyType = "aggressive" | "defensive";

// 백테스트 주문 타입
export type BacktestOrderType = "BATCH" | "DIVIDED";

// 백테스트 요청 DTO (Backend와 일치)
export interface BacktestRequest {
  ticker: string;               // 종목 심볼
  startDate: string;            // 시작일 (YYYY-MM-DD)
  endDate: string;              // 종료일 (YYYY-MM-DD)
  interval: BacktestInterval;   // 인터벌
  initialCapital: number;       // 초기 자본 (최소 1000)
  commissionRate: number;       // 수수료율
  stopLossPct: number;          // 손절률
  strategyType: BacktestStrategyType;  // 전략 타입
  orderType: BacktestOrderType; // 주문 타입
  divisionCount?: number;       // 분할 횟수 (DIVIDED일 경우 필수)
}

// 백테스트 응답 DTO (Backend와 일치)
export interface BacktestResult {
  totalReturnPct: number;       // 총 수익률 %
  mddPct: number;               // 최대 낙폭 %
  sharpeRatio: number;          // 샤프 지수
  finalAssets: number;          // 최종 자산
  totalTrades: number;          // 총 거래 횟수
  winRate: number;              // 승률
}

// 레거시 호환성용
export interface BacktestStrategy {
  id: string;
  name: string;
  stockCode: string;
  stockName: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  strategy: string;
  parameters: Record<string, number | string>;
}

// ============================================
// 뉴스 관련 타입
// ============================================
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  publishedAt: string;
  category: string;
  impact: "positive" | "negative" | "neutral";
  relatedStocks: string[];
  imageUrl?: string;
}

export interface MarketIndicator {
  name: string;
  value: string;
  change: string;
  isUp: boolean;
}

// ============================================
// API 응답 타입
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// 알림 관련 타입
// ============================================
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  read: boolean;
  createdAt: string;
}
