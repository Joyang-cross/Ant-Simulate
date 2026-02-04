import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { TrendingUp, Mail, Lock, User, AtSign, ArrowLeft, Sparkles } from "lucide-react";
import { useTheme } from "@/hooks";
import type { SignupRequest } from "@/types";
import { authApi } from "@/services/api";

interface SignupScreenProps {
  onSignupComplete: (userId: number, nickname: string) => void;
  onBackToLogin: () => void;
}

export function SignupScreen({ onSignupComplete, onBackToLogin }: SignupScreenProps) {
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    nickname: "",
  });
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password || !formData.name || !formData.nickname) {
      setError("모든 필드를 입력해주세요.");
      return false;
    }

    if (formData.password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const signupData: SignupRequest = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        nickname: formData.nickname,
      };

      // 회원가입
      await authApi.signup(signupData);
      
      // 자동 로그인
      const loginResponse = await authApi.login({
        email: formData.email,
        password: formData.password
      });
      
      onSignupComplete(loginResponse.userId, loginResponse.nickname);
    } catch (err) {
      console.error("회원가입 에러:", err);
      setError(err instanceof Error ? err.message : "회원가입 중 오류가 발생했습니다.");
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
            계정 생성하기
          </p>
        </div>

        {/* Signup Card */}
        <Card className={`rounded-2xl p-8 animate-slide-up border ${isDark ? 'glass-card' : 'bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-xl shadow-slate-200/50'}`}>
          <div className="space-y-4 mb-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>이메일</Label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 rounded-xl h-12 transition-all ${isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 focus:bg-white'}`}
                />
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>이름</Label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <Input 
                  id="name" 
                  name="name"
                  type="text" 
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={handleChange}
                  className={`pl-10 rounded-xl h-12 transition-all ${isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 focus:bg-white'}`}
                />
              </div>
            </div>

            {/* Nickname */}
            <div className="space-y-2">
              <Label htmlFor="nickname" className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>닉네임</Label>
              <div className="relative">
                <AtSign className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <Input 
                  id="nickname" 
                  name="nickname"
                  type="text" 
                  placeholder="투자닉네임"
                  value={formData.nickname}
                  onChange={handleChange}
                  className={`pl-10 rounded-xl h-12 transition-all ${isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 focus:bg-white'}`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>비밀번호</Label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 rounded-xl h-12 transition-all ${isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 focus:bg-white'}`}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>비밀번호 확인</Label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword"
                  type="password" 
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pl-10 rounded-xl h-12 transition-all ${isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 focus:bg-white'}`}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${isDark ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {error}
            </div>
          )}

          <Button 
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl h-12 font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "가입 중..." : "계정 생성"}
          </Button>

          <div className="mt-6 text-center text-sm">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>이미 계정이 있으신가요? </span>
            <button 
              onClick={onBackToLogin}
              className="text-indigo-500 hover:text-indigo-400 font-medium transition-colors"
            >
              로그인
            </button>
          </div>
        </Card>

        {/* Back Button */}
        <button 
          onClick={onBackToLogin}
          className={`flex items-center justify-center gap-2 w-full mt-4 text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로가기
        </button>

        {/* Footer Text */}
        <p className={`text-center text-xs mt-6 animate-fade-in ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          가입 시 <span className={`cursor-pointer transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>서비스 약관</span> 및 <span className={`cursor-pointer transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>개인정보 처리방침</span>에 동의합니다.
        </p>
      </div>
    </div>
  );
}
