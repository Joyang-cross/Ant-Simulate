import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Shield, DollarSign, RefreshCw, Award, TrendingUp, Target, Calendar, Settings, Bell, CreditCard, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MyPage() {
  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <Award className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">홍길동</h2>
          <p className="text-slate-400">user@example.com</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">프리미엄</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">레벨 12</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-white/5 rounded-xl p-1 mb-6 w-full md:w-auto">
          <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300">
            <User className="w-4 h-4 mr-2" />
            프로필
          </TabsTrigger>
          <TabsTrigger value="account" className="rounded-lg data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300">
            <CreditCard className="w-4 h-4 mr-2" />
            가상 계좌
          </TabsTrigger>
          <TabsTrigger value="stats" className="rounded-lg data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300">
            <TrendingUp className="w-4 h-4 mr-2" />
            거래 통계
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300">
            <Shield className="w-4 h-4 mr-2" />
            보안
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Section */}
          <Card className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <User className="w-5 h-5 text-indigo-400" />
              <h3 className="text-white font-semibold">프로필 정보</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">이름</Label>
                  <Input 
                    defaultValue="홍길동"
                    className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">닉네임</Label>
                  <Input 
                    defaultValue="개미투자자"
                    className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">이메일</Label>
                <Input 
                  type="email"
                  defaultValue="user@example.com"
                  disabled
                  className="bg-white/5 border-white/10 text-slate-500 rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">휴대폰 번호</Label>
                <Input 
                  type="tel"
                  defaultValue="010-1234-5678"
                  className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                />
              </div>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl h-11">
                프로필 업데이트
              </Button>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Bell className="w-5 h-5 text-amber-400" />
              <h3 className="text-white font-semibold">알림 설정</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "목표가 도달 알림", description: "설정한 목표가에 도달하면 알림을 받습니다", enabled: true },
                { label: "손절가 경고 알림", description: "손절가 근처 도달 시 알림을 받습니다", enabled: true },
                { label: "시장 뉴스 알림", description: "관심 종목 관련 뉴스를 받습니다", enabled: false },
                { label: "주간 리포트 알림", description: "매주 포트폴리오 리포트를 받습니다", enabled: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-slate-500 text-sm">{item.description}</p>
                  </div>
                  <button className={`w-12 h-6 rounded-full transition-colors ${item.enabled ? 'bg-indigo-500' : 'bg-white/10'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          {/* Virtual Account Section */}
          <Card className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="text-white font-semibold">가상 계좌 관리</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-5 rounded-xl">
                <div className="text-slate-400 text-sm mb-1">현재 시드 머니</div>
                <div className="text-white text-2xl font-bold">10,000,000원</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 p-5 rounded-xl">
                <div className="text-slate-400 text-sm mb-1">총 자산</div>
                <div className="text-emerald-400 text-2xl font-bold">12,450,000원</div>
                <div className="text-emerald-400 text-sm mt-1">+24.5%</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">초기 시드 머니 설정</Label>
                <Input 
                  type="number"
                  defaultValue="10000000"
                  placeholder="초기 투자 금액"
                  className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl h-11">
                  시드 머니 변경
                </Button>
                <Button 
                  variant="outline"
                  className="bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 rounded-xl h-11"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  계좌 초기화
                </Button>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                <p className="text-amber-300 text-sm">
                  ⚠️ 계좌 초기화 시 모든 거래 내역과 보유 종목이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
            </div>
          </Card>

          {/* Transaction History */}
          <Card className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-purple-400" />
                <h3 className="text-white font-semibold">최근 거래 내역</h3>
              </div>
              <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300">
                전체 보기
              </Button>
            </div>
            <div className="space-y-2">
              {[
                { type: "buy", stock: "삼성전자", quantity: 10, price: 50000, time: "오늘 14:30" },
                { type: "sell", stock: "SK하이닉스", quantity: 5, price: 115000, time: "어제 10:15" },
                { type: "buy", stock: "NAVER", quantity: 3, price: 195000, time: "3일 전" },
              ].map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'buy' ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                    }`}>
                      <TrendingUp className={`w-5 h-5 ${tx.type === 'buy' ? 'text-emerald-400' : 'text-rose-400 rotate-180'}`} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{tx.stock}</p>
                      <p className="text-slate-500 text-sm">{tx.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${tx.type === 'buy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.type === 'buy' ? '매수' : '매도'} {tx.quantity}주
                    </p>
                    <p className="text-slate-400 text-sm">{(tx.price * tx.quantity).toLocaleString()}원</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          {/* Account Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "총 거래 횟수", value: "145회", icon: Target, color: "text-indigo-400", bg: "from-indigo-500/20 to-purple-500/20" },
              { label: "평균 수익률", value: "+8.5%", icon: TrendingUp, color: "text-emerald-400", bg: "from-emerald-500/20 to-green-500/20" },
              { label: "승률", value: "62.3%", icon: Award, color: "text-amber-400", bg: "from-amber-500/20 to-orange-500/20" },
              { label: "가입일", value: "2024.06", icon: Calendar, color: "text-blue-400", bg: "from-blue-500/20 to-cyan-500/20" },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} className="glass-card rounded-2xl p-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-slate-400 text-sm mb-1">{stat.label}</div>
                  <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                </Card>
              );
            })}
          </div>

          {/* Detailed Stats */}
          <Card className="glass-card rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">상세 거래 통계</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {[
                  { label: "총 수익 거래", value: "90회", color: "text-emerald-400" },
                  { label: "총 손실 거래", value: "55회", color: "text-rose-400" },
                  { label: "최대 단일 수익", value: "+15.3%", color: "text-emerald-400" },
                  { label: "최대 단일 손실", value: "-8.7%", color: "text-rose-400" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-slate-400">{item.label}</span>
                    <span className={`font-semibold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  { label: "평균 보유 기간", value: "12일", color: "text-white" },
                  { label: "총 거래 금액", value: "1.2억원", color: "text-white" },
                  { label: "총 수수료", value: "180,000원", color: "text-slate-400" },
                  { label: "순 수익", value: "+2,450,000원", color: "text-emerald-400" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-slate-400">{item.label}</span>
                    <span className={`font-semibold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security Section */}
          <Card className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="text-white font-semibold">비밀번호 변경</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">현재 비밀번호</Label>
                <Input 
                  type="password"
                  placeholder="현재 비밀번호 입력"
                  className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">새 비밀번호</Label>
                <Input 
                  type="password"
                  placeholder="새 비밀번호 입력"
                  className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">새 비밀번호 확인</Label>
                <Input 
                  type="password"
                  placeholder="새 비밀번호 재입력"
                  className="bg-white/5 border-white/10 text-white rounded-xl h-11"
                />
              </div>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl h-11">
                비밀번호 변경
              </Button>
            </div>
          </Card>

          {/* Two Factor Auth */}
          <Card className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">2단계 인증</h3>
                  <p className="text-slate-400 text-sm">계정 보안을 강화하세요</p>
                </div>
              </div>
              <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl">
                설정하기
              </Button>
            </div>
          </Card>

          {/* Connected Accounts */}
          <Card className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Settings className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-semibold">연결된 계정</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: "Google", email: "user@gmail.com", connected: true },
                { name: "Kakao", email: "연결되지 않음", connected: false },
              ].map((account, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/5">
                  <div>
                    <p className="text-white font-medium">{account.name}</p>
                    <p className="text-slate-500 text-sm">{account.email}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`rounded-lg ${
                      account.connected 
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' 
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    {account.connected ? '연결 해제' : '연결하기'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
