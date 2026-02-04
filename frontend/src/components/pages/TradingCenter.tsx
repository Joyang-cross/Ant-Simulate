import { useState, useEffect, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Plus, 
  Minus, 
  Star, 
  Zap,
  Loader2,
  ExternalLink,
  X
} from "lucide-react";
import { CandlestickChart } from "@/components/ui/candlestick-chart";
import { stocksApi } from "@/services/api";
import type { StockItem, StockChartData } from "@/types";
import { useTheme } from "@/hooks";

// 차트 주기 타입
type ChartPeriod = "daily" | "weekly" | "monthly";

// 백엔드/프론트엔드 필드명 호환을 위한 헬퍼 함수
const getStockSymbol = (stock: StockItem): string => stock.stockSymbol || stock.symbol || "";
const getStockName = (stock: StockItem): string => stock.stockName || stock.name || "";

interface TradingCenterProps {
  onStockDetail?: (stockItem: StockItem) => void;
  userId?: number;
}

export function TradingCenter({ onStockDetail, userId }: TradingCenterProps) {
  const { isDark } = useTheme();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [chartData, setChartData] = useState<StockChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantity, setQuantity] = useState("");
  const [likedStockIds, setLikedStockIds] = useState<Set<number>>(new Set());
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("daily");

  // 주식 목록 로드
  useEffect(() => {
    async function loadStocks() {
      setIsLoading(true);
      try {
        const items = await stocksApi.getStockItems();
        setStockItems(items);
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

  // 검색 필터링된 주식 목록
  const filteredStocks = Array.isArray(stockItems) ? stockItems.filter(stock => {
    const query = searchQuery.toLowerCase();
    const symbol = stock.stockSymbol || stock.symbol || "";
    const name = stock.stockName || stock.name || "";
    const alias = stock.stockAlias || "";
    return (
      symbol.toLowerCase().includes(query) ||
      name.toLowerCase().includes(query) ||
      alias.toLowerCase().includes(query)
    );
  }).slice(0, 20) : []; // 최대 20개만 표시

  // 차트에서 통계 계산 (집계된 데이터 기준)
  const displayData = aggregateChartData;
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

  // Mock 호가창 데이터 (WebSocket 연결 전)
  const mockOrderBook = {
    asks: [
      { price: Math.round(chartStats.currentPrice * 1.004), quantity: 150, total: 0 },
      { price: Math.round(chartStats.currentPrice * 1.002), quantity: 230, total: 0 },
      { price: Math.round(chartStats.currentPrice * 1.001), quantity: 340, total: 0 },
    ].map(ask => ({ ...ask, total: ask.price * ask.quantity })),
    bids: [
      { price: Math.round(chartStats.currentPrice * 0.999), quantity: 280, total: 0 },
      { price: Math.round(chartStats.currentPrice * 0.998), quantity: 190, total: 0 },
      { price: Math.round(chartStats.currentPrice * 0.996), quantity: 120, total: 0 },
    ].map(bid => ({ ...bid, total: bid.price * bid.quantity })),
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
      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_360px] gap-4 lg:gap-6">
        {/* Watchlist Section */}
        <Card className="glass-card rounded-2xl p-4 xl:order-1 order-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Star className="w-4 h-4 text-amber-400" />
              종목 목록
            </h3>
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
              {stockItems.length}개
            </span>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="종목 검색 (심볼/이름)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 rounded-xl h-10 text-sm ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-500'}`}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>

          <div className="space-y-1 max-h-[500px] overflow-y-auto scrollbar-hide">
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
              <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                검색 결과가 없습니다
              </div>
            )}
          </div>
        </Card>

        {/* Chart Section */}
        <Card className="glass-card rounded-2xl p-6 flex flex-col xl:order-2 order-1">
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
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    {isChartLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                    ) : (
                      <>
                        <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {selectedStock.stockCountry === 'US' ? '$' : '₩'}{chartStats.currentPrice.toLocaleString()}
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
                  { label: "시가", value: chartStats.open.toLocaleString(), color: isDark ? "text-white" : "text-slate-900" },
                  { label: "고가", value: chartStats.high.toLocaleString(), color: "text-red-500" },
                  { label: "저가", value: chartStats.low.toLocaleString(), color: "text-blue-500" },
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
        </Card>

        {/* Order Section */}
        <div className="space-y-4 xl:order-3 order-3">
          {/* Order Book */}
          <Card className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>호가창</h3>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Zap className="w-3 h-3 text-amber-400" />
                실시간
              </div>
            </div>
            
            <div className="space-y-1 mb-3">
              {mockOrderBook.asks.slice().reverse().map((ask, idx) => (
                <div key={idx} className="grid grid-cols-3 text-sm py-1.5 px-2 rounded-lg relative overflow-hidden">
                  <div 
                    className="absolute right-0 top-0 bottom-0 bg-indigo-500/10" 
                    style={{ width: `${(ask.quantity / 500) * 100}%` }}
                  />
                  <span className="text-indigo-400 font-medium relative z-10">{ask.price.toLocaleString()}</span>
                  <span className={`text-right relative z-10 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{ask.quantity}</span>
                  <span className="text-slate-500 text-right text-xs relative z-10">
                    {(ask.total / 1000000).toFixed(1)}M
                  </span>
                </div>
              ))}
            </div>

            <div className={`py-3 mb-3 border-y text-center ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {chartStats.currentPrice.toLocaleString()}
              </div>
              <div className="text-slate-400 text-xs mt-0.5">현재가</div>
            </div>

            <div className="space-y-1">
              {mockOrderBook.bids.map((bid, idx) => (
                <div key={idx} className="grid grid-cols-3 text-sm py-1.5 px-2 rounded-lg relative overflow-hidden">
                  <div 
                    className="absolute right-0 top-0 bottom-0 bg-emerald-500/10" 
                    style={{ width: `${(bid.quantity / 500) * 100}%` }}
                  />
                  <span className="text-emerald-400 font-medium relative z-10">{bid.price.toLocaleString()}</span>
                  <span className={`text-right relative z-10 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{bid.quantity}</span>
                  <span className="text-slate-500 text-right text-xs relative z-10">
                    {(bid.total / 1000000).toFixed(1)}M
                  </span>
                </div>
              ))}
            </div>

            <div className={`mt-4 pt-4 border-t ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">매도 잔량</span>
                <span className="text-indigo-400 font-medium">720주</span>
              </div>
              <div className={`w-full rounded-full h-2 overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-200'}`}>
                <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400" style={{ width: '55%' }} />
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-slate-400">매수 잔량</span>
                <span className="text-emerald-400 font-medium">590주</span>
              </div>
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
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>10,000,000원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">주문 가능</span>
                    <span className="text-emerald-400 font-medium">
                      {chartStats.currentPrice > 0 ? Math.floor(10000000 / chartStats.currentPrice) : 0}주
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
                  <Label className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>주문가격</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      value={chartStats.currentPrice || ""}
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
                          const maxQty = chartStats.currentPrice > 0 ? Math.floor((10000000 * percent) / chartStats.currentPrice) : 0;
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
                      {(chartStats.currentPrice * (parseInt(quantity) || 0)).toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">수수료</span>
                    <span className="text-slate-500">
                      {Math.round(chartStats.currentPrice * (parseInt(quantity) || 0) * 0.00015).toLocaleString()}원
                    </span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl h-12 font-semibold shadow-lg shadow-emerald-500/25">
                  매수 주문
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
                  <Label className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>주문가격</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      value={chartStats.currentPrice || ""}
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
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>0원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">수수료</span>
                    <span className="text-slate-500">0원</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl h-12 font-semibold shadow-lg shadow-rose-500/25">
                  매도 주문
                </Button>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
