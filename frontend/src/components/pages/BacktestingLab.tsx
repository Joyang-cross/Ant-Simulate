import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, TrendingUp, Play, Sparkles, Target, Calendar, Coins, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const mockBacktestData = [
  { date: "2024-01", strategy: 100, benchmark: 100 },
  { date: "2024-02", strategy: 105, benchmark: 102 },
  { date: "2024-03", strategy: 103, benchmark: 104 },
  { date: "2024-04", strategy: 110, benchmark: 106 },
  { date: "2024-05", strategy: 108, benchmark: 105 },
  { date: "2024-06", strategy: 115, benchmark: 108 },
  { date: "2024-07", strategy: 118, benchmark: 110 },
  { date: "2024-08", strategy: 116, benchmark: 109 },
  { date: "2024-09", strategy: 122, benchmark: 112 },
  { date: "2024-10", strategy: 125, benchmark: 115 },
  { date: "2024-11", strategy: 128, benchmark: 117 },
  { date: "2024-12", strategy: 135, benchmark: 120 },
];

export function BacktestingLab() {
  const [showResults, setShowResults] = useState(false);
  const [splitCount, setSplitCount] = useState([5]);

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">
      <Tabs defaultValue="settings" value={showResults ? "results" : "settings"} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">백테스팅 랩</h2>
            <p className="text-slate-400 text-sm">과거 데이터로 투자 전략을 검증하세요</p>
          </div>
          <TabsList className="bg-white/5 rounded-xl p-1">
            <TabsTrigger 
              value="settings" 
              onClick={() => setShowResults(false)}
              className="rounded-lg data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300"
            >
              전략 설정
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              disabled={!showResults}
              className="rounded-lg data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300"
            >
              결과 리포트
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="settings" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Target Settings */}
            <Card className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Target className="w-5 h-5 text-indigo-400" />
                <h3 className="text-white font-semibold">대상 설정</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">종목 검색</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input 
                      placeholder="종목명 또는 종목코드 입력"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      시작일
                    </Label>
                    <Input 
                      type="date"
                      defaultValue="2024-01-01"
                      className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      종료일
                    </Label>
                    <Input 
                      type="date"
                      defaultValue="2024-12-31"
                      className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-slate-500" />
                    초기 투자금
                  </Label>
                  <Input 
                    type="number"
                    defaultValue="10000000"
                    placeholder="초기 투자 금액을 입력하세요"
                    className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                  />
                </div>
              </div>
            </Card>

            {/* Cost Settings */}
            <Card className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Coins className="w-5 h-5 text-amber-400" />
                <h3 className="text-white font-semibold">비용 설정</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">증권사 수수료 (%)</Label>
                  <Input 
                    type="number"
                    defaultValue="0.015"
                    step="0.001"
                    className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">거래세 (%)</Label>
                  <Input 
                    type="number"
                    defaultValue="0.23"
                    step="0.01"
                    className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                  />
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <p className="text-amber-300 text-sm">
                    💡 비용을 정확히 설정하면 더 현실적인 수익률을 확인할 수 있습니다.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Strategy Settings */}
          <Card className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-semibold">전략 설정</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">매수 전략</Label>
                  <Select defaultValue="split">
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-11">
                      <SelectValue placeholder="전략 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a2e] border-white/10 rounded-xl">
                      <SelectItem value="lump" className="text-white hover:bg-white/10 rounded-lg">일괄 매수</SelectItem>
                      <SelectItem value="split" className="text-white hover:bg-white/10 rounded-lg">분할 매수</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-white/5 p-4 rounded-xl space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300 text-sm">분할 횟수</Label>
                      <span className="text-indigo-400 font-semibold">{splitCount[0]}회</span>
                    </div>
                    <Slider 
                      value={splitCount}
                      onValueChange={setSplitCount}
                      max={20} 
                      min={2}
                      step={1}
                      className="py-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm">분할 간격</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-10">
                        <SelectValue placeholder="간격 선택" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-white/10 rounded-xl">
                        <SelectItem value="daily" className="text-white hover:bg-white/10 rounded-lg">매일</SelectItem>
                        <SelectItem value="weekly" className="text-white hover:bg-white/10 rounded-lg">매주</SelectItem>
                        <SelectItem value="monthly" className="text-white hover:bg-white/10 rounded-lg">매월</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm">분할 비중</Label>
                    <Select defaultValue="equal">
                      <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-10">
                        <SelectValue placeholder="비중 선택" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-white/10 rounded-xl">
                        <SelectItem value="equal" className="text-white hover:bg-white/10 rounded-lg">균등 분할</SelectItem>
                        <SelectItem value="increasing" className="text-white hover:bg-white/10 rounded-lg">점증식</SelectItem>
                        <SelectItem value="decreasing" className="text-white hover:bg-white/10 rounded-lg">점감식</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">매도 전략</Label>
                  <Select defaultValue="target">
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-11">
                      <SelectValue placeholder="전략 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a2e] border-white/10 rounded-xl">
                      <SelectItem value="hold" className="text-white hover:bg-white/10 rounded-lg">보유</SelectItem>
                      <SelectItem value="target" className="text-white hover:bg-white/10 rounded-lg">목표가 도달</SelectItem>
                      <SelectItem value="stoploss" className="text-white hover:bg-white/10 rounded-lg">손절가 도달</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-white/5 p-4 rounded-xl space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm">목표 수익률 (%)</Label>
                    <Input 
                      type="number"
                      defaultValue="20"
                      className="bg-white/5 border-white/10 text-white rounded-xl h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm">손절 수익률 (%)</Label>
                    <Input 
                      type="number"
                      defaultValue="-10"
                      className="bg-white/5 border-white/10 text-white rounded-xl h-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Button 
            onClick={() => setShowResults(true)}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl h-14 font-semibold text-lg shadow-lg shadow-indigo-500/25 group"
          >
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            백테스트 실행
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </TabsContent>

        <TabsContent value="results" className="space-y-6 mt-0">
          {/* Performance Chart */}
          <Card className="glass-card rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">수익률 비교</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockBacktestData}>
                  <defs>
                    <linearGradient id="colorStrategy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 17, 27, 0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="strategy"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorStrategy)"
                    name="내 전략"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="benchmark"
                    stroke="#6366f1"
                    fillOpacity={1}
                    fill="url(#colorBenchmark)"
                    name="KOSPI"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass-card rounded-2xl p-5 hover:glow-profit transition-all">
              <div className="text-slate-400 text-sm mb-2">최종 수익률</div>
              <div className="text-emerald-400 text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                +35.0%
              </div>
            </Card>

            <Card className="glass-card rounded-2xl p-5 hover:glow-sm transition-all">
              <div className="text-slate-400 text-sm mb-2">벤치마크 대비</div>
              <div className="text-indigo-400 text-2xl font-bold">+15.0%</div>
            </Card>

            <Card className="glass-card rounded-2xl p-5 hover:glow-loss transition-all">
              <div className="text-slate-400 text-sm mb-2">MDD (최대 낙폭)</div>
              <div className="text-rose-400 text-2xl font-bold">-8.5%</div>
            </Card>

            <Card className="glass-card rounded-2xl p-5 hover:glow-sm transition-all">
              <div className="text-slate-400 text-sm mb-2">총 수익금</div>
              <div className="text-white text-2xl font-bold">+3.5M</div>
            </Card>
          </div>

          {/* Detailed Metrics */}
          <Card className="glass-card rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">핵심 지표</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {[
                  { label: "승률", value: "68.5%", icon: CheckCircle2, color: "text-emerald-400" },
                  { label: "평균 보유 기간", value: "45일", icon: Calendar, color: "text-white" },
                  { label: "총 거래 횟수", value: "24회", icon: Target, color: "text-white" },
                  { label: "평균 수익", value: "+5.8%", icon: TrendingUp, color: "text-emerald-400" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-slate-400 flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </span>
                      <span className={`font-semibold ${item.color}`}>{item.value}</span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3">
                {[
                  { label: "Sharpe Ratio", value: "1.85", color: "text-white" },
                  { label: "최대 연속 수익", value: "8회", color: "text-emerald-400" },
                  { label: "최대 연속 손실", value: "3회", color: "text-rose-400" },
                  { label: "총 수수료", value: "45,000원", color: "text-slate-400" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-slate-400">{item.label}</span>
                    <span className={`font-semibold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* AI Feedback */}
          <Card className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-500/20 rounded-2xl p-6">
            <div className="flex gap-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl h-fit">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold mb-3">AI 분석 피드백</h3>
                <div className="space-y-3 text-slate-300">
                  <p className="leading-relaxed flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><span className="text-emerald-400 font-medium">장점:</span> 분할 매수 전략으로 평균 단가를 효과적으로 낮췄으며, 
                    시장 변동성에 대한 리스크가 감소했습니다. MDD가 -8.5%로 낮아 안정적인 수익률을 유지했습니다.</span>
                  </p>
                  <p className="leading-relaxed flex gap-2">
                    <XCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span><span className="text-amber-400 font-medium">개선점:</span> 매도 타이밍을 개선하면 추가 수익을 기대할 수 있습니다. 
                    목표 수익률을 10-15% 수준에서 단계적으로 설정하는 것을 권장합니다.</span>
                  </p>
                  <p className="leading-relaxed flex gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span><span className="text-indigo-400 font-medium">제안:</span> 비슷한 전략을 다른 대형주에도 적용해보세요. 
                    특히 변동성이 큰 종목에서 분할 매수 전략의 효과가 더욱 두드러질 수 있습니다.</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button 
              onClick={() => setShowResults(false)}
              variant="outline"
              className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl h-12"
            >
              새로운 백테스트
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl h-12 font-semibold shadow-lg shadow-emerald-500/25"
            >
              전략 저장
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
