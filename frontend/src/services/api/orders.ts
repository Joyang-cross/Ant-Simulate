// API 클라이언트 - Mock 모드에서는 사용하지 않음 (추후 연동 시 사용)
import { apiClient as _apiClient } from "./client";
import { API_ENDPOINTS as _API_ENDPOINTS } from "@/config/constants";
import type { Order, TradeHistory } from "@/types";

/**
 * 주문/거래 관련 API 서비스
 * 
 * 📌 현재 상태: Mock 데이터 반환 (백엔드 연결 전)
 */

interface CreateOrderRequest {
  stockCode: string;
  type: "buy" | "sell";
  orderType: "market" | "limit";
  price?: number;
  quantity: number;
}

// Mock 주문 내역
const MOCK_ORDERS: Order[] = [
  {
    id: "order-001",
    stockCode: "005930",
    stockName: "삼성전자",
    type: "buy",
    orderType: "limit",
    price: 72000,
    quantity: 50,
    status: "pending",
    createdAt: "2025-01-20T09:30:00Z",
  },
  {
    id: "order-002",
    stockCode: "000660",
    stockName: "SK하이닉스",
    type: "buy",
    orderType: "market",
    price: 134500,
    quantity: 10,
    status: "completed",
    createdAt: "2025-01-19T14:20:00Z",
    executedAt: "2025-01-19T14:20:05Z",
  },
];

// Mock 거래 내역
const MOCK_TRADE_HISTORY: TradeHistory[] = [
  {
    id: "trade-001",
    stockCode: "005930",
    stockName: "삼성전자",
    type: "buy",
    price: 68000,
    quantity: 100,
    totalAmount: 6800000,
    executedAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "trade-002",
    stockCode: "000660",
    stockName: "SK하이닉스",
    type: "buy",
    price: 125000,
    quantity: 30,
    totalAmount: 3750000,
    executedAt: "2025-01-10T11:45:00Z",
  },
  {
    id: "trade-003",
    stockCode: "035420",
    stockName: "NAVER",
    type: "buy",
    price: 220000,
    quantity: 20,
    totalAmount: 4400000,
    executedAt: "2025-01-08T09:15:00Z",
  },
];

/**
 * 주문 생성
 */
export async function createOrder(order: CreateOrderRequest): Promise<Order> {
  console.log("[Orders] Create order:", order);
  
  // 실제 API 연결 시 아래 코드 사용
  // const response = await apiClient.post<Order>(
  //   API_ENDPOINTS.ORDERS.CREATE,
  //   order
  // );
  // return response.data;

  // Mock 응답
  return {
    id: `order-${Date.now()}`,
    stockCode: order.stockCode,
    stockName: order.stockCode === "005930" ? "삼성전자" : "Unknown",
    type: order.type,
    orderType: order.orderType,
    price: order.price || 0,
    quantity: order.quantity,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}

/**
 * 주문 목록 조회
 */
export async function getOrders(): Promise<Order[]> {
  console.log("[Orders] Get orders");
  
  // 실제 API 연결 시 아래 코드 사용
  // const response = await apiClient.get<Order[]>(API_ENDPOINTS.ORDERS.LIST);
  // return response.data;

  return MOCK_ORDERS;
}

/**
 * 주문 취소
 */
export async function cancelOrder(orderId: string): Promise<void> {
  console.log("[Orders] Cancel order:", orderId);
  
  // 실제 API 연결 시 아래 코드 사용
  // await apiClient.post(API_ENDPOINTS.ORDERS.CANCEL(orderId));
}

/**
 * 거래 내역 조회
 */
export async function getTradeHistory(): Promise<TradeHistory[]> {
  console.log("[Orders] Get trade history");
  
  // 실제 API 연결 시 아래 코드 사용
  // const response = await apiClient.get<TradeHistory[]>(
  //   API_ENDPOINTS.ORDERS.HISTORY
  // );
  // return response.data;

  return MOCK_TRADE_HISTORY;
}
