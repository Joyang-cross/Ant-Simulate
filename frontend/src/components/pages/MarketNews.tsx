import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Clock, 
  ExternalLink, 
  Bookmark, 
  Share2,
  Filter,
  Flame,
  Globe,
  BarChart3,
  Building2,
  Cpu
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const hotNews = [
  {
    id: 1,
    title: "삼성전자, AI 반도체 신규 투자 10조원 규모 발표",
    summary: "삼성전자가 AI 반도체 시장 선점을 위해 향후 3년간 10조원 규모의 대규모 투자를 발표했다. 이번 투자로 HBM4 생산 능력을 2배로 확대할 계획이다.",
    source: "한국경제",
    time: "30분 전",
    category: "기업",
    impact: "positive",
    stocks: ["삼성전자", "SK하이닉스"],
  },
  {
    id: 2,
    title: "미국 연준, 금리 동결 결정... 하반기 인하 기대감",
    summary: "미국 연방준비제도가 기준금리를 현 수준에서 동결했다. 파월 의장은 인플레이션이 추가로 완화될 경우 하반기 금리 인하 가능성을 시사했다.",
    source: "매일경제",
    time: "1시간 전",
    category: "글로벌",
    impact: "positive",
    stocks: ["KOSPI", "KOSDAQ"],
  },
  {
    id: 3,
    title: "전기차 배터리 원자재 가격 급등, 업계 우려 확산",
    summary: "리튬과 코발트 가격이 최근 2주간 15% 이상 급등하면서 배터리 업계의 우려가 커지고 있다. 원가 상승이 수익성에 영향을 줄 전망이다.",
    source: "전자신문",
    time: "2시간 전",
    category: "산업",
    impact: "negative",
    stocks: ["LG에너지솔루션", "삼성SDI"],
  },
  {
    id: 4,
    title: "네이버, 글로벌 AI 서비스 '하이퍼클로바X' 일본 진출",
    summary: "네이버가 자체 개발한 AI 언어모델 하이퍼클로바X를 일본 시장에 출시한다. 소프트뱅크와 전략적 파트너십을 체결하고 B2B 시장을 공략할 계획이다.",
    source: "조선비즈",
    time: "3시간 전",
    category: "IT",
    impact: "positive",
    stocks: ["NAVER", "카카오"],
  },
];

const marketIndicators = [
  { name: "KOSPI", value: "2,650.45", change: "+1.2%", isUp: true },
  { name: "KOSDAQ", value: "850.23", change: "+0.8%", isUp: true },
  { name: "USD/KRW", value: "1,380.50", change: "-0.3%", isUp: false },
  { name: "WTI", value: "$78.50", change: "+2.1%", isUp: true },
  { name: "GOLD", value: "$2,050", change: "+0.5%", isUp: true },
  { name: "BTC", value: "$67,500", change: "-1.2%", isUp: false },
];

const trendingStocks = [
  { name: "삼성전자", code: "005930", change: "+4.17%", isUp: true, volume: "12.5M" },
  { name: "SK하이닉스", code: "000660", change: "+3.82%", isUp: true, volume: "8.2M" },
  { name: "LG에너지솔루션", code: "373220", change: "-2.54%", isUp: false, volume: "2.1M" },
  { name: "현대차", code: "005380", change: "+1.25%", isUp: true, volume: "3.8M" },
  { name: "셀트리온", code: "068270", change: "-1.87%", isUp: false, volume: "1.9M" },
];

const categories = [
  { id: "all", label: "전체", icon: Globe },
  { id: "hot", label: "인기", icon: Flame },
  { id: "corp", label: "기업", icon: Building2 },
  { id: "market", label: "시장", icon: BarChart3 },
  { id: "tech", label: "IT/테크", icon: Cpu },
];

export function MarketNews() {
  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">시장 뉴스</h2>
          <p className="text-slate-400 text-sm">실시간 금융 뉴스와 시장 동향을 확인하세요</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="뉴스 검색..."
              className="pl-9 w-64 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-10"
            />
          </div>
          <Button variant="outline" className="bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Market Indicators Ticker */}
          <Card className="glass-card rounded-2xl p-4 overflow-hidden">
            <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
              {marketIndicators.map((indicator, idx) => (
                <div key={idx} className="flex items-center gap-3 shrink-0">
                  <span className="text-slate-400 text-sm">{indicator.name}</span>
                  <span className="text-white font-semibold">{indicator.value}</span>
                  <span className={`text-sm font-medium flex items-center gap-0.5 ${
                    indicator.isUp ? "text-emerald-400" : "text-rose-400"
                  }`}>
                    {indicator.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {indicator.change}
                  </span>
                  {idx < marketIndicators.length - 1 && (
                    <div className="w-px h-6 bg-white/10 ml-2" />
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* News Categories */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-white/5 rounded-xl p-1 w-full md:w-auto">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <TabsTrigger 
                    key={cat.id}
                    value={cat.id} 
                    className="rounded-lg data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300"
                  >
                    <Icon className="w-4 h-4 mr-1.5" />
                    {cat.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="all" className="mt-4 space-y-4">
              {hotNews.map((news) => (
                <Card 
                  key={news.id} 
                  className="glass-card rounded-2xl p-5 hover:bg-white/5 transition-all cursor-pointer group"
                >
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                          news.impact === 'positive' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {news.impact === 'positive' ? '호재' : '악재'}
                        </span>
                        <span className="text-xs text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded-lg">
                          {news.category}
                        </span>
                        <span className="text-slate-500 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {news.time}
                        </span>
                      </div>
                      
                      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-indigo-400 transition-colors">
                        {news.title}
                      </h3>
                      
                      <p className="text-slate-400 text-sm leading-relaxed mb-3">
                        {news.summary}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 text-xs">{news.source}</span>
                          <div className="flex gap-1">
                            {news.stocks.map((stock, idx) => (
                              <span 
                                key={idx} 
                                className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded-lg hover:bg-indigo-500/20 hover:text-indigo-400 transition-colors cursor-pointer"
                              >
                                #{stock}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              <div className="text-center pt-4">
                <Button variant="outline" className="bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl">
                  더 많은 뉴스 보기
                </Button>
              </div>
            </TabsContent>

            {categories.slice(1).map((cat) => (
              <TabsContent key={cat.id} value={cat.id} className="mt-4">
                <Card className="glass-card rounded-2xl p-8 text-center">
                  <cat.icon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">{cat.label} 관련 뉴스를 불러오는 중...</p>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Stocks */}
          <Card className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-amber-400" />
              <h3 className="text-white font-semibold">인기 종목</h3>
            </div>
            <div className="space-y-2">
              {trendingStocks.map((stock, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-sm w-5">{idx + 1}</span>
                    <div>
                      <p className="text-white font-medium text-sm group-hover:text-indigo-400 transition-colors">{stock.name}</p>
                      <p className="text-slate-500 text-xs">{stock.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${
                      stock.isUp ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {stock.change}
                    </p>
                    <p className="text-slate-500 text-xs">{stock.volume}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Market Summary */}
          <Card className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-white font-semibold">오늘의 시장</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-500/10 rounded-xl p-3 text-center">
                  <p className="text-emerald-400 text-2xl font-bold">523</p>
                  <p className="text-slate-400 text-xs">상승</p>
                </div>
                <div className="bg-rose-500/10 rounded-xl p-3 text-center">
                  <p className="text-rose-400 text-2xl font-bold">312</p>
                  <p className="text-slate-400 text-xs">하락</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">거래대금</span>
                  <span className="text-white font-medium">8.2조원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">외국인</span>
                  <span className="text-emerald-400 font-medium">+2,450억</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">기관</span>
                  <span className="text-rose-400 font-medium">-1,820억</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">개인</span>
                  <span className="text-rose-400 font-medium">-630억</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Economic Calendar */}
          <Card className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-semibold">경제 일정</h3>
            </div>
            <div className="space-y-3">
              {[
                { time: "09:00", event: "한국 소비자물가지수 발표", importance: "high" },
                { time: "11:00", event: "중국 제조업 PMI 발표", importance: "medium" },
                { time: "22:30", event: "미국 실업수당 청구건수", importance: "high" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2">
                  <span className="text-slate-500 text-sm shrink-0">{item.time}</span>
                  <div className="flex-1">
                    <p className="text-white text-sm">{item.event}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    item.importance === 'high' ? 'bg-rose-400' : 'bg-amber-400'
                  }`} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
