import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Minus, 
  Star,
  Zap,
  Loader2,
  ExternalLink
} from "lucide-react";
import { CandlestickChart } from "@/components/ui/candlestick-chart";
import { stocksApi, accountApi, transactionApi } from "@/services/api";
import type { StockItem, StockChartData, Account } from "@/types";
import { useTheme } from "@/hooks";
import { useCurrency } from "@/hooks/useCurrency";

// 차트 주기 타입
type ChartPeriod = "daily" | "weekly" | "monthly";

// 백엔드/프론트엔드 필드명 호환을 위한 헬퍼 함수
const getStockSymbol = (stock: StockItem): string => stock.stockSymbol || stock.symbol || "";
const getStockName = (stock: StockItem): string => stock.stockName || stock.name || "";

interface TradingCenterProps {
  onStockDetail?: (stockItem: StockItem) => void;
  userId?: number;
  selectedStockFromSearch?: StockItem | null;
  onSelectedStockFromSearchHandled?: () => void;
}

export function TradingCenter({ onStockDetail, userId, selectedStockFromSearch, onSelectedStockFromSearchHandled }: TradingCenterProps) {
  const { isDark } = useTheme();
  const { formatPrice, convertPrice, currency, exchangeRate } = useCurrency();
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [chartData, setChartData] = useState<StockChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [likedStockIds, setLikedStockIds] = useState<Set<number>>(new Set());
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("daily");
  const [likedStocks, setLikedStocks] = useState<StockItem[]>([]);
  const [account, setAccount] = useState<Account | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderMessage, setOrderMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const centerContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const [baseHeight, setBaseHeight] = useState<number>(0);

  // Layout Height Synchronization
  useEffect(() => {
    // requestAnimationFrame을 사용하여 렌더링이 완전히 끝난 후 측정
    const measureHeight = () => {
      // 1. Center와 Right의 내부 실제 컨텐츠 높이 측정
      // ref가 걸린 div들의 getBoundingClientRect 사용
      
      const centerEl = centerContentRef.current;
      const rightEl = rightContentRef.current;
      
      const getCardHeight = (contentEl: HTMLDivElement | null) => {
             if (!contentEl) return 0;
             const contentH = contentEl.getBoundingClientRect().height;
             
             // 부모 Card의 패딩을 더해서 전체 높이 계산
             const parent = contentEl.parentElement; 
             if (parent) {
                 const style = window.getComputedStyle(parent);
                 const py = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
                 // border 등도 포함해야 정확
                 return contentH + py;
             }
             return contentH;
      };

      const centerH = getCardHeight(centerEl);
      const rightH = getCardHeight(rightEl);
      
      const maxH = Math.max(centerH, rightH);
      
      // 약간의 오차 방지 및 최소 높이 보장
      if (maxH > 100) { 
         // 값이 줄어드는 것도 허용해야 함 (Left가 더 길어졌을 때 Center에 맞추기 위해)
         setBaseHeight(prev => {
             // 1px 차이 등 미세한 변화 무시하여 불필요한 리렌더 방지
             if (Math.abs(prev - maxH) < 2) return prev;
             return maxH;
         });
      }
    };
    
    // 측정 함수 실행 (디바운스 없이 즉각 반응)
    // requestAnimationFrame으로 브라우저 렌더링 최적화
    const optimizedMeasure = () => {
        window.requestAnimationFrame(measureHeight);
    };

    const observer = new ResizeObserver(optimizedMeasure);
    
    if (centerContentRef.current) observer.observe(centerContentRef.current);
    if (rightContentRef.current) observer.observe(rightContentRef.current);

    // 컴포넌트 마운트/업데이트 시 즉시 측정
    optimizedMeasure();
    // 이미지 로드 등으로 인한 지연 변경 대비 (타이머 단축)
    const interval = setInterval(optimizedMeasure, 500);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [selectedStock, chartData, likedStocks, chartPeriod]); // chartPeriod 의존성 추가

  // 상단바 검색에서 종목 선택시 반영
  useEffect(() => {
    if (selectedStockFromSearch) {
      setSelectedStock(selectedStockFromSearch);
      onSelectedStockFromSearchHandled?.();
    }
  }, [selectedStockFromSearch, onSelectedStockFromSearchHandled]);

  // 관심종목 목록 로드
  useEffect(() => {
    async function loadLikedStocks() {
      if (!userId) return;
      try {
        const items = await stocksApi.getLikedStocks(userId);
        setLikedStocks(items);
        setLikedStockIds(new Set(items.map(item => item.id)));
      } catch (err) {
        console.error("관심종목 로드 실패:", err);
      }
    }
    loadLikedStocks();
  }, [userId]);

  // 계좌 정보 로드
  useEffect(() => {
    async function loadAccount() {
      if (!userId) return;
      try {
        const data = await accountApi.getAccount(userId);
        setAccount(data);
      } catch (err) {
        console.error("계좌 정보 로드 실패:", err);
      }
    }
    loadAccount();
  }, [userId]);

  // 주식 목록 로드 (초기 선택용)
  useEffect(() => {
    async function loadStocks() {
      setIsLoading(true);
      try {
        const items = await stocksApi.getStockItems();
        if (items.length > 0 && !selectedStock) {
          setSelectedStock(items[0]);
        }
      } catch (err) {
        console.error("주식 목록 로드 실패:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStocks();
  }, []);

  // 선택된 주식의 차트 데이터 로드
  useEffect(() => {
    async function loadChartData() {
      if (!selectedStock) return;
      
      setIsChartLoading(true);
      try {
        const data = await stocksApi.getStockChart(selectedStock.id);
        setChartData(data.slice(-30)); // 최근 30일
      } catch (err) {
        console.error("차트 데이터 로드 실패:", err);
        setChartData([]);
      } finally {
        setIsChartLoading(false);
      }
    }
    loadChartData();
  }, [selectedStock?.id]);

  // 관심종목 토글
  const handleToggleLike = useCallback(async (stockItem: StockItem) => {
    if (!userId) return;
    
    try {
      const response = await stocksApi.toggleLikeStock(userId, stockItem.id);
      setLikedStockIds(prev => {
        const newSet = new Set(prev);
        if (response.status === "create") {
          newSet.add(stockItem.id);
        } else {
          newSet.delete(stockItem.id);
        }
        return newSet;
      });
      if (response.status === "create") {
        setLikedStocks(prev => [...prev, stockItem]);
      } else {
        setLikedStocks(prev => prev.filter(s => s.id !== stockItem.id));
      }
    } catch (err) {
      console.error("관심종목 토글 실패:", err);
    }
  }, [userId]);

  // 일봉 데이터를 주봉/월봉으로 변환
  const aggregateChartData = useMemo(() => {
    if (chartData.length === 0) return [];
    
    if (chartPeriod === "daily") {
      // 일봉: 최근 60일
      return chartData.slice(-60);
    }
    
    // 주봉 또는 월봉으로 집계
    const groupedData: Record<string, StockChartData[]> = {};
    
    chartData.forEach(item => {
      const date = new Date(item.date);
      let key: string;
      
      if (chartPeriod === "weekly") {
        // 주봉: 해당 주의 월요일 날짜를 키로 사용
        const dayOfWeek = date.getDay();
        const monday = new Date(date);
        monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        key = monday.toISOString().split('T')[0];
      } else {
        // 월봉: 해당 월의 첫날을 키로 사용
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
      }
      
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(item);
    });
    
    // 각 그룹을 OHLCV로 집계
    const aggregated = Object.entries(groupedData).map(([dateKey, items]) => {
      const sortedItems = items.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      return {
        date: dateKey,
        time: dateKey,
        open: sortedItems[0].open,
        high: Math.max(...items.map(i => i.high)),
        low: Math.min(...items.map(i => i.low)),
        close: sortedItems[sortedItems.length - 1].close,
        price: sortedItems[sortedItems.length - 1].close,
        volume: items.reduce((sum, i) => sum + i.volume, 0)
      };
    });
    
    // 날짜순 정렬 후 적절한 개수만 반환
    const sorted = aggregated.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    return chartPeriod === "weekly" ? sorted.slice(-52) : sorted.slice(-24); // 주봉 52주, 월봉 24개월
  }, [chartData, chartPeriod]);

  // 관심종목 목록 (검색 필터 없이 전체 표시)
  const filteredStocks = likedStocks;

  // 차트 데이터 변환 (환율 적용)
  const convertedData = useMemo(() => {
    if (!selectedStock) return aggregateChartData;
    const sourceCurrency = selectedStock.stockCountry === 'US' ? 'USD' : 'KRW';

    // 이미 보고있는 통화와 같으면 변환 불필요
    if (sourceCurrency === currency) {
      return aggregateChartData;
    }

    return aggregateChartData.map(item => ({
      ...item,
      open: convertPrice(item.open, sourceCurrency),
      high: convertPrice(item.high, sourceCurrency),
      low: convertPrice(item.low, sourceCurrency),
      close: convertPrice(item.close, sourceCurrency),
      // volume은 거래량이므로 통화 변환 대상이 아님
    }));
  }, [aggregateChartData, selectedStock, currency, convertPrice]);


  // 차트에서 통계 계산 (변환된 데이터 기준)
  const displayData = convertedData;
  const chartStats = displayData.length >= 2 ? {
    currentPrice: displayData[displayData.length - 1]?.close || 0,
    previousPrice: displayData[displayData.length - 2]?.close || 0,
    change: (displayData[displayData.length - 1]?.close || 0) - (displayData[displayData.length - 2]?.close || 0),
    changePercent: (((displayData[displayData.length - 1]?.close || 0) - (displayData[displayData.length - 2]?.close || 0)) / (displayData[displayData.length - 2]?.close || 1)) * 100,
    high: Math.max(...displayData.map(d => d.high)),
    low: Math.min(...displayData.map(d => d.low)),
    open: displayData[displayData.length - 1]?.open || 0,
    volume: displayData[displayData.length - 1]?.volume || 0
  } : {
    currentPrice: 0,
    previousPrice: 0,
    change: 0,
    changePercent: 0,
    high: 0,
    low: 0,
    open: 0,
    volume: 0
  };

  const isPositive = chartStats.changePercent >= 0;

  // 매수/매도 주문창에서 항상 원화로 표시하기 위한 가격 계산
  // aggregateChartData는 원본 통화(USD/KRW) 기준이므로, 여기서 원화로 환산
  const tradingSourceCurrency = selectedStock?.stockCountry === 'US' ? 'USD' : 'KRW';
  const rawCurrentPrice = aggregateChartData.length >= 1 ? (aggregateChartData[aggregateChartData.length - 1]?.close || 0) : 0;
  const currentPriceInKRW = tradingSourceCurrency === 'USD'
    ? Math.round(rawCurrentPrice * exchangeRate)
    : rawCurrentPrice;

  // 예수금 (실제 계좌 totalAsset 기준)
  const availableBalance = account?.totalAsset ?? 0;

  // 매수 처리
  const handleBuy = async () => {
    if (!userId || !selectedStock || !quantity || parseInt(quantity) <= 0) return;
    const qty = parseInt(quantity);
    if (currentPriceInKRW * qty > availableBalance) {
      setOrderMessage({ type: 'error', text: '예수금이 부족합니다.' });
      setTimeout(() => setOrderMessage(null), 3000);
      return;
    }
    setIsOrdering(true);
    try {
      await transactionApi.createTransaction(userId, selectedStock.id, {
        transactionType: 'BUY',
        quantity: qty,
      });
      const updated = await accountApi.getAccount(userId);
      setAccount(updated);
      setQuantity("");
      setOrderMessage({ type: 'success', text: `매수 체결: ${getStockName(selectedStock)} ${qty}주` });
    } catch (err) {
      console.error('매수 실패:', err);
      setOrderMessage({ type: 'error', text: '매수 주문에 실패했습니다.' });
    } finally {
      setIsOrdering(false);
      setTimeout(() => setOrderMessage(null), 3000);
    }
  };

  // 매도 처리
  const handleSell = async () => {
    if (!userId || !selectedStock || !quantity || parseInt(quantity) <= 0) return;
    const qty = parseInt(quantity);
    setIsOrdering(true);
    try {
      await transactionApi.createTransaction(userId, selectedStock.id, {
        transactionType: 'SELL',
        quantity: qty,
      });
      const updated = await accountApi.getAccount(userId);
      setAccount(updated);
      setQuantity("");
      setOrderMessage({ type: 'success', text: `매도 체결: ${getStockName(selectedStock)} ${qty}주` });
    } catch (err) {
      console.error('매도 실패:', err);
      setOrderMessage({ type: 'error', text: '매도 주문에 실패했습니다.' });
    } finally {
      setIsOrdering(false);
      setTimeout(() => setOrderMessage(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_360px] gap-4 lg:gap-6 items-stretch">
        {/* Watchlist Section - 왼쪽: 기준 높이로 고정(스크롤) */}
        <div 
          className="xl:order-1 order-2"
          style={{ height: baseHeight > 0 ? `${baseHeight}px` : 'auto' }}
        >
          <Card className="glass-card rounded-2xl p-4 flex flex-col h-full overflow-hidden">
            {/* 관심종목 헤더 */}
            <div className="flex items-center justify-between mb-3 px-1 shrink-0">
              <h3 className={`font-bold flex items-center gap-2 text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Star className="w-4.5 h-4.5 text-amber-400 fill-amber-400" />
                관심종목
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                {likedStocks.length}개
              </span>
            </div>

            <div className="space-y-1 flex-1 min-h-0 overflow-y-auto scrollbar-themed">
            {filteredStocks.map((stock) => (
              <div 
                key={stock.id}
                onClick={() => setSelectedStock(stock)}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedStock?.id === stock.id 
                    ? "bg-indigo-500/20 border border-indigo-500/30" 
                    : isDark ? "hover:bg-white/5" : "hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {getStockName(stock)}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                        {getStockSymbol(stock)}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        stock.stockCountry === 'US' 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {stock.stockType}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLike(stock);
                    }}
                    className={`w-7 h-7 shrink-0 ${likedStockIds.has(stock.id) ? 'text-amber-400' : 'text-slate-500'}`}
                  >
                    <Star className={`w-4 h-4 ${likedStockIds.has(stock.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
            ))}
            {filteredStocks.length === 0 && (
              <div className={`flex flex-col items-center justify-center h-full py-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <Star className="w-6 h-6 mb-2 opacity-50" />
                <span className="text-sm">관심종목이 없습니다</span>
                <span className={`text-xs mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>상단 검색에서 종목의 ☆를 눌러주세요</span>
              </div>
            )}
          </div>
          </Card>
        </div>

        {/* Chart Section - 가운데: 자동 높이 조절 */}
        <div className="xl:order-2 order-1 h-full">
          {/* Card에 h-full을 주면 Grid Row가 늘어날 때 같이 늘어남.
              배경색 처리를 위해 h-full을 Card에 주는 것은 유지.
              하지만 측정 대상인 내부 div는 늘어나면 안 됨.
          */}
          <Card className="glass-card rounded-2xl p-6 flex flex-col h-full">
            {/* 측정용 div: h-full 없이, 내용물 높이만 가짐 */}
            <div ref={centerContentRef} className="flex flex-col w-full">
              {selectedStock && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {getStockName(selectedStock)}
                    </h2>
                    <span className={`text-sm px-2 py-0.5 rounded-lg ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                      {getStockSymbol(selectedStock)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleLike(selectedStock)}
                      className={`w-8 h-8 ${likedStockIds.has(selectedStock.id) ? 'text-amber-400' : isDark ? 'text-slate-500' : 'text-slate-400'}`}
                    >
                      <Star className={`w-5 h-5 ${likedStockIds.has(selectedStock.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    {isChartLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                    ) : (
                      <>
                        <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {formatPrice(chartStats.currentPrice, currency)}
                        </span>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                          isPositive ? "bg-red-500/20 text-red-500" : "bg-blue-500/20 text-blue-500"
                        }`}>
                          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span className="font-semibold">
                            {isPositive ? "+" : ""}{chartStats.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {[
                    { label: "일봉", value: "daily" as ChartPeriod },
                    { label: "주봉", value: "weekly" as ChartPeriod },
                    { label: "월봉", value: "monthly" as ChartPeriod }
                  ].map((period) => (
                    <Button 
                      key={period.value}
                      variant="outline" 
                      size="sm" 
                      onClick={() => setChartPeriod(period.value)}
                      className={`rounded-lg transition-all ${
                        chartPeriod === period.value 
                          ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/30" 
                          : isDark 
                            ? "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                            : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {period.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                {isChartLoading ? (
                  <div className="flex items-center justify-center h-[600px]">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                  </div>
                ) : displayData.length === 0 ? (
                  <div className={`flex items-center justify-center h-[600px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    차트 데이터가 없습니다
                  </div>
                ) : (
                  <CandlestickChart 
                    data={displayData}
                    isDark={isDark}
                    height={600}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-white/5">
                {[
                  { label: "시가", value: formatPrice(chartStats.open, currency), color: isDark ? "text-white" : "text-slate-900" },
                  { label: "고가", value: formatPrice(chartStats.high, currency), color: "text-red-500" },
                  { label: "저가", value: formatPrice(chartStats.low, currency), color: "text-blue-500" },
                  { label: "거래량", value: (chartStats.volume / 1000000).toFixed(2) + "M", color: isDark ? "text-white" : "text-slate-900" },
                ].map((item) => (
                  <div key={item.label} className={`rounded-xl py-5 px-4 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                    <div className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.label}</div>
                    <div className={`${item.color} font-bold text-xl`}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* 상세차트 버튼 */}
              <Button
                onClick={() => onStockDetail?.(selectedStock)}
                className="w-full mt-3 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
              >
                상세차트 보러가기
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
          </div>
        </Card>
        </div>

        {/* Order Section - 오른쪽: 자동 높이 조절 */}
        <div className="xl:order-3 order-3 h-full">
          {/* h-full 제거: 내부 컨텐츠의 실제 높이만 측정하기 위함. 
              시각적인 full height는 부모(grid item)와 Card의 flex-1 등으로 처리하려 했으나, 
              측정용 ref가 있는 div는 늘어나면 안 됨.
          */}
          <div ref={rightContentRef} className="space-y-4 flex flex-col">
            <Card className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>호가창</h3>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Zap className="w-3 h-3 text-amber-400" />
                임시
              </div>
            </div>

            <div className={`flex flex-col items-center justify-center py-10 gap-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
              <div className="text-3xl">📋</div>
              <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>임시 호가창</p>
              <p className={`text-xs text-center leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                실시간 호가 데이터 연동 기능은<br />현재 개발 예정 중입니다.
              </p>
            </div>
          </Card>

          {/* Order Entry */}
          <Card className="glass-card rounded-2xl p-4">
            <Tabs defaultValue="buy" className="w-full">
              <TabsList className={`grid w-full grid-cols-2 rounded-xl p-1 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                <TabsTrigger 
                  value="buy" 
                  className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/25 transition-all"
                >
                  매수
                </TabsTrigger>
                <TabsTrigger 
                  value="sell" 
                  className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-rose-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-rose-500/25 transition-all"
                >
                  매도
                </TabsTrigger>
              </TabsList>

              <TabsContent value="buy" className="space-y-4 mt-4">
                <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">예수금</span>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      ₩{availableBalance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">주문 가능</span>
                    <span className="text-emerald-400 font-medium">
                      {currentPriceInKRW > 0 ? Math.floor(availableBalance / currentPriceInKRW) : 0}주
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 rounded-lg"
                  >
                    시장가
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`rounded-lg ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}
                  >
                    지정가
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>주문가격 (원화)</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      value={currentPriceInKRW || ""}
                      readOnly
                      className={`rounded-xl ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                    />
                    <Button variant="outline" size="icon" className={`rounded-lg shrink-0 ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}>
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className={`rounded-lg shrink-0 ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}>
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>주문수량</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className={`rounded-xl ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {["10%", "25%", "50%", "100%"].map((pct) => (
                      <Button 
                        key={pct}
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          const percent = parseInt(pct) / 100;
                          const maxQty = currentPriceInKRW > 0 ? Math.floor((availableBalance * percent) / currentPriceInKRW) : 0;
                          setQuantity(String(maxQty));
                        }}
                        className={`text-xs rounded-lg ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {pct}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">주문금액</span>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      ₩{(currentPriceInKRW * (parseInt(quantity) || 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">수수료</span>
                    <span className="text-slate-500">
                      ₩{Math.round(currentPriceInKRW * (parseInt(quantity) || 0) * 0.00015).toLocaleString()}
                    </span>
                  </div>
                </div>

                {orderMessage && (
                  <div className={`p-3 rounded-xl text-sm text-center font-medium ${
                    orderMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {orderMessage.text}
                  </div>
                )}

                <Button
                  onClick={handleBuy}
                  disabled={isOrdering || !quantity || parseInt(quantity) <= 0}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl h-12 font-semibold shadow-lg shadow-emerald-500/25 disabled:opacity-50">
                  {isOrdering ? '체결 중...' : '매수 주문'}
                </Button>
              </TabsContent>

              <TabsContent value="sell" className="space-y-4 mt-4">
                <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">보유수량</span>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>0주</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">매도 가능</span>
                    <span className="text-rose-400 font-medium">0주</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-rose-500/20 border-rose-500/50 text-rose-300 hover:bg-rose-500/30 rounded-lg"
                  >
                    시장가
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`rounded-lg ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}
                  >
                    지정가
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>주문가격 (원화)</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      value={currentPriceInKRW || ""}
                      readOnly
                      className={`rounded-xl ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                    />
                    <Button variant="outline" size="icon" className={`rounded-lg shrink-0 ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}>
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className={`rounded-lg shrink-0 ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}>
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>주문수량</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    className={`rounded-xl ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {["10%", "25%", "50%", "100%"].map((pct) => (
                      <Button 
                        key={pct}
                        variant="outline" 
                        size="sm" 
                        className={`text-xs rounded-lg ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {pct}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">주문금액</span>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>₩0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">수수료</span>
                    <span className="text-slate-500">₩0</span>
                  </div>
                </div>

                <Button
                  onClick={handleSell}
                  disabled={isOrdering || !quantity || parseInt(quantity) <= 0}
                  className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl h-12 font-semibold shadow-lg shadow-rose-500/25 disabled:opacity-50">
                  {isOrdering ? '체결 중...' : '매도 주문'}
                </Button>
              </TabsContent>
            </Tabs>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
