// ============================================
// 공통 타입 정의
// ============================================

// 화면 타입
export type ScreenType = "login" | "trading" | "portfolio" | "backtesting" | "mypage" | "news";

// ============================================
// 사용자 관련 타입
// ============================================
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
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
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

// ============================================
// 주식/거래 관련 타입
// ============================================
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

export interface StockChartData {
  time: string;
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
// 백테스팅 관련 타입
// ============================================
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

export interface BacktestResult {
  strategyId: string;
  totalReturn: number;
  totalReturnPercent: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  totalTrades: number;
  profitFactor: number;
  trades: TradeHistory[];
  equityCurve: { date: string; value: number }[];
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
