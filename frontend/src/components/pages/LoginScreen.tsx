import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { TrendingUp, Mail, Lock, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useTheme } from "@/hooks";
import { authApi } from "@/services/api";

interface LoginScreenProps {
  onLogin: (userId: number, nickname: string) => void;
  onSignupClick?: () => void;
}

export function LoginScreen({ onLogin, onSignupClick }: LoginScreenProps) {
  const { isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ email, password });
      onLogin(response.userId, response.nickname);
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300 ${isDark ? 'dark bg-[#0a0a0f]' : 'light bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30'}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse-slow ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-400/30'}`} />
        <div className={`absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse-slow ${isDark ? 'bg-purple-500/15' : 'bg-purple-400/25'}`} style={{ animationDelay: '1s' }} />
        <div className={`absolute -bottom-40 right-1/3 w-[400px] h-[400px] rounded-full blur-3xl animate-pulse-slow ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-400/20'}`} style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern */}
        <div 
          className={`absolute inset-0 ${isDark ? 'opacity-[0.02]' : 'opacity-[0.03]'}`}
          style={{
            backgroundImage: isDark 
              ? 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)'
              : 'linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-60" />
            <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-2xl">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className={`text-3xl font-bold tracking-tight mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Ant-Simulate</h1>
          <p className={`text-sm flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <Sparkles className="w-4 h-4 text-indigo-500" />
            실시간 시장 데이터 기반 모의 투자 플랫폼
          </p>
        </div>

        {/* Login Card */}
        <Card className={`rounded-2xl p-8 animate-slide-up border ${isDark ? 'glass-card' : 'bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-xl shadow-slate-200/50'}`}>
          <div className="space-y-5 mb-6">
            <div className="space-y-2">
              <Label htmlFor="email" className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>이메일</Label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 rounded-xl h-12 transition-all ${isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 focus:bg-white'}`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>비밀번호</Label>
                <button className="text-xs text-indigo-500 hover:text-indigo-400 transition-colors font-medium">
                  비밀번호 찾기
                </button>
              </div>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className={`pl-10 rounded-xl h-12 transition-all ${isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 focus:bg-white'}`}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                {error}
              </div>
            )}
          </div>

          <Button 
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl h-12 font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 group disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                로그인
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className={`w-full border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={`px-3 ${isDark ? 'bg-[#11111b] text-slate-500' : 'bg-white/80 text-slate-400'}`}>또는</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              variant="outline"
              className={`w-full rounded-xl h-11 font-medium transition-all ${isDark 
                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'}`}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google로 계속하기
            </Button>
            <button 
              type="button"
              className="w-full rounded-xl h-11 font-medium transition-all flex items-center justify-center gap-2 hover:opacity-90"
              style={{ backgroundColor: '#FEE500', color: '#191919', border: '1px solid #FEE500' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#191919" d="M12 3C6.477 3 2 6.463 2 10.788c0 2.677 1.765 5.052 4.42 6.406-.19.702-.69 2.53-.79 2.928-.12.49.182.484.381.352.16-.105 2.523-1.72 3.547-2.415.47.063.95.096 1.442.096 5.523 0 10-3.463 10-7.787S17.523 3 12 3z"/>
              </svg>
              Kakao로 계속하기
            </button>
          </div>

          <div className="mt-8 text-center text-sm">
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>계정이 없으신가요? </span>
            <button 
              onClick={onSignupClick}
              className="text-indigo-500 hover:text-indigo-400 font-medium transition-colors"
            >
              회원가입
            </button>
          </div>
        </Card>

        {/* Footer Text */}
        <p className={`text-center text-xs mt-6 animate-fade-in ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          로그인 시 <span className={`cursor-pointer transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>서비스 약관</span> 및 <span className={`cursor-pointer transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>개인정보 처리방침</span>에 동의합니다.
        </p>
      </div>
    </div>
  );
}
