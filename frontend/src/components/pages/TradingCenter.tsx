import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Search, Plus, Minus, Star, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const mockChartData = [
  { time: "09:00", price: 48000, volume: 120 },
  { time: "10:00", price: 48500, volume: 180 },
  { time: "11:00", price: 48200, volume: 150 },
  { time: "12:00", price: 49100, volume: 220 },
  { time: "13:00", price: 49500, volume: 200 },
  { time: "14:00", price: 49200, volume: 160 },
  { time: "15:00", price: 50000, volume: 240 },
];

const mockOrderBook = {
  asks: [
    { price: 50200, quantity: 150, total: 7530000 },
    { price: 50100, quantity: 230, total: 11523000 },
    { price: 50000, quantity: 340, total: 17000000 },
  ],
  bids: [
    { price: 49900, quantity: 280, total: 13972000 },
    { price: 49800, quantity: 190, total: 9462000 },
    { price: 49700, quantity: 120, total: 5964000 },
  ],
};

const watchlist = [
  { id: 1, name: "삼성전자", code: "005930", price: 50000, change: 4.17, isUp: true },
  { id: 2, name: "SK하이닉스", code: "000660", price: 115000, change: -2.54, isUp: false },
  { id: 3, name: "NAVER", code: "035420", price: 195000, change: 1.82, isUp: true },
  { id: 4, name: "카카오", code: "035720", price: 48500, change: 0.52, isUp: true },
  { id: 5, name: "LG에너지솔루션", code: "373220", price: 385000, change: -1.28, isUp: false },
];

export function TradingCenter() {
  const [selectedStock, setSelectedStock] = useState(watchlist[0]);
  const [quantity, setQuantity] = useState("");

  return (
    <div className="p-4 lg:p-6">
      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_360px] gap-4 lg:gap-6">
        {/* Watchlist Section */}
        <Card className="glass-card rounded-2xl p-4 xl:order-1 order-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              관심종목
            </h3>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="종목 검색"
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-10 text-sm"
            />
          </div>

          <div className="space-y-1">
            {watchlist.map((stock) => (
              <div 
                key={stock.id}
                onClick={() => setSelectedStock(stock)}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedStock.id === stock.id 
                    ? "bg-indigo-500/20 border border-indigo-500/30" 
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">{stock.name}</p>
                    <p className="text-slate-500 text-xs">{stock.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold text-sm">{stock.price.toLocaleString()}</p>
                    <p className={`text-xs flex items-center justify-end gap-0.5 ${
                      stock.isUp ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {stock.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stock.isUp ? "+" : ""}{stock.change}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Chart Section */}
        <Card className="glass-card rounded-2xl p-6 flex flex-col xl:order-2 order-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white">{selectedStock.name}</h2>
                <span className="text-sm text-slate-400 bg-white/5 px-2 py-0.5 rounded-lg">{selectedStock.code}</span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-3xl font-bold text-white">{selectedStock.price.toLocaleString()}원</span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                  selectedStock.isUp ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                }`}>
                  {selectedStock.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="font-semibold">
                    {selectedStock.isUp ? "+" : ""}{selectedStock.change}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {["1분", "5분", "일봉", "주봉"].map((period, idx) => (
                <Button 
                  key={period}
                  variant="outline" 
                  size="sm" 
                  className={`rounded-lg transition-all ${
                    idx === 2 
                      ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/30" 
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 17, 27, 0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
            {[
              { label: "시가", value: "48,000", color: "text-white" },
              { label: "고가", value: "50,500", color: "text-emerald-400" },
              { label: "저가", value: "47,800", color: "text-rose-400" },
              { label: "거래량", value: "1.2M", color: "text-white" },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 rounded-xl p-3">
                <div className="text-slate-400 text-xs mb-1">{item.label}</div>
                <div className={`${item.color} font-semibold`}>{item.value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Order Section */}
        <div className="space-y-4 xl:order-3 order-3">
          {/* Order Book */}
          <Card className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">호가창</h3>
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
                  <span className="text-slate-300 text-right relative z-10">{ask.quantity}</span>
                  <span className="text-slate-500 text-right text-xs relative z-10">
                    {(ask.total / 1000000).toFixed(1)}M
                  </span>
                </div>
              ))}
            </div>

            <div className="py-3 mb-3 border-y border-white/10 text-center">
              <div className="text-2xl font-bold text-white">{selectedStock.price.toLocaleString()}</div>
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
                  <span className="text-slate-300 text-right relative z-10">{bid.quantity}</span>
                  <span className="text-slate-500 text-right text-xs relative z-10">
                    {(bid.total / 1000000).toFixed(1)}M
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">매도 잔량</span>
                <span className="text-indigo-400 font-medium">720주</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
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
              <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-xl p-1">
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
                <div className="bg-white/5 p-3 rounded-xl">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">예수금</span>
                    <span className="text-white font-medium">10,000,000원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">주문 가능</span>
                    <span className="text-emerald-400 font-medium">199주</span>
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
                    className="bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 rounded-lg"
                  >
                    지정가
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">주문가격</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      defaultValue="50000"
                      className="bg-white/5 border-white/10 text-white rounded-xl"
                    />
                    <Button variant="outline" size="icon" className="bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 rounded-lg shrink-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 rounded-lg shrink-0">
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">주문수량</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="bg-white/5 border-white/10 text-white rounded-xl"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {["10%", "25%", "50%", "100%"].map((pct) => (
                      <Button 
                        key={pct}
                        variant="outline" 
                        size="sm" 
                        className="bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 text-xs rounded-lg"
                      >
                        {pct}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">주문금액</span>
                    <span className="text-white font-medium">0원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">수수료</span>
                    <span className="text-slate-500">0원</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl h-12 font-semibold shadow-lg shadow-emerald-500/25">
                  매수 주문
                </Button>
              </TabsContent>

              <TabsContent value="sell" className="space-y-4 mt-4">
                <div className="bg-white/5 p-3 rounded-xl">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">보유수량</span>
                    <span className="text-white font-medium">100주</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">매도 가능</span>
                    <span className="text-rose-400 font-medium">100주</span>
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
                    className="bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 rounded-lg"
                  >
                    지정가
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">주문가격</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      defaultValue="50000"
                      className="bg-white/5 border-white/10 text-white rounded-xl"
                    />
                    <Button variant="outline" size="icon" className="bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 rounded-lg shrink-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 rounded-lg shrink-0">
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">주문수량</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    className="bg-white/5 border-white/10 text-white rounded-xl"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {["10%", "25%", "50%", "100%"].map((pct) => (
                      <Button 
                        key={pct}
                        variant="outline" 
                        size="sm" 
                        className="bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 text-xs rounded-lg"
                      >
                        {pct}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">주문금액</span>
                    <span className="text-white font-medium">0원</span>
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
