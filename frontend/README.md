# 🐜 Ant-Simulate Frontend

실시간 모의투자 플랫폼의 프론트엔드 애플리케이션입니다.

## 📋 목차

- [개요](#개요)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [주요 기능](#주요-기능)
- [API 연동](#api-연동)
- [컴포넌트 가이드](#컴포넌트-가이드)
- [스타일 가이드](#스타일-가이드)

---

## 개요

Ant-Simulate는 실제 시장 데이터를 기반으로 한 모의투자 플랫폼입니다. 사용자는 가상의 시드머니로 주식 거래를 연습하고, 백테스팅을 통해 투자 전략을 검증할 수 있습니다.

### 주요 특징

- 🎯 **실시간 모의 거래**: 가상 시드머니로 주식 매매 연습
- 📊 **포트폴리오 관리**: 보유 종목 현황 및 수익률 분석
- 🧪 **백테스팅 연구소**: 투자 전략 시뮬레이션 및 검증
- 📰 **시장 뉴스**: 실시간 금융 뉴스 및 시장 동향
- 👤 **마이페이지**: 계정 관리 및 거래 통계

---

## 기술 스택

| 카테고리 | 기술 |
|---------|------|
| **Framework** | React 18.3.1 + TypeScript |
| **Build Tool** | Vite 6.3.5 |
| **Styling** | Tailwind CSS 4.1.12 |
| **UI Components** | Shadcn UI (Radix Primitives) |
| **Charts** | Recharts 2.15.2 |
| **Icons** | Lucide React 0.487.0 |
| **Package Manager** | npm |

---

## 프로젝트 구조

```
src/
├── App.tsx                 # 루트 애플리케이션 컴포넌트
├── main.tsx                # 엔트리포인트
│
├── components/             # 컴포넌트 디렉토리
│   ├── index.ts           # 컴포넌트 통합 export
│   ├── pages/             # 페이지 레벨 컴포넌트
│   │   ├── LoginScreen.tsx
│   │   ├── TradingCenter.tsx
│   │   ├── Portfolio.tsx
│   │   ├── BacktestingLab.tsx
│   │   ├── MyPage.tsx
│   │   └── MarketNews.tsx
│   └── ui/                # 재사용 UI 컴포넌트 (Shadcn UI)
│       ├── index.ts       # UI 컴포넌트 통합 export
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── tabs.tsx
│       └── ... (48개 컴포넌트)
│
├── pages/                  # 페이지 export (라우터용)
│   └── index.ts
│
├── hooks/                  # 커스텀 React Hooks
│   ├── index.ts
│   ├── useAuth.ts         # 인증 상태 관리
│   ├── useStocks.ts       # 주식 데이터 훅
│   └── usePortfolio.ts    # 포트폴리오 데이터 훅
│
├── services/               # API 서비스 레이어
│   └── api/
│       ├── index.ts       # API 모듈 통합 export
│       ├── client.ts      # 기본 API 클라이언트
│       ├── auth.ts        # 인증 API
│       ├── stocks.ts      # 주식 데이터 API
│       ├── portfolio.ts   # 포트폴리오 API
│       └── orders.ts      # 주문/거래 API
│
├── types/                  # TypeScript 타입 정의
│   └── index.ts           # 모든 타입/인터페이스
│
├── lib/                    # 유틸리티 함수
│   └── utils.ts           # 공통 유틸리티 (cn, formatKRW 등)
│
├── config/                 # 설정 파일
│   └── constants.ts       # 앱 설정 및 API 엔드포인트
│
└── styles/                 # 글로벌 스타일
    ├── index.css          # 메인 스타일 (imports)
    ├── tailwind.css       # Tailwind 설정
    ├── theme.css          # 테마 변수 및 커스텀 스타일
    └── fonts.css          # 폰트 설정
```

### 파일 구조 규칙

1. **components/pages/**: 라우트 단위의 페이지 컴포넌트
2. **components/ui/**: 재사용 가능한 UI 컴포넌트 (Shadcn UI)
3. **hooks/**: 비즈니스 로직이 포함된 커스텀 훅
4. **services/**: API 통신 로직
5. **types/**: 모든 TypeScript 인터페이스/타입
6. **lib/**: 순수 유틸리티 함수
7. **config/**: 앱 설정 값들

---

## 시작하기

### 요구사항

- Node.js 18.0.0 이상
- npm 9.0.0 이상

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 환경 변수

```bash
# .env (개발용)
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_BASE_URL=ws://localhost:8080/ws
```

---

## 주요 기능

### 1. 🔐 로그인/회원가입 (LoginScreen)

- 이메일/비밀번호 로그인
- 회원가입
- 소셜 로그인 (준비중)

### 2. 📈 거래소 (TradingCenter)

- 실시간 주식 시세 조회
- 주식 차트 (캔들차트, 라인차트)
- 호가창 (매수/매도 호가)
- 매수/매도 주문 기능
- 관심종목 관리
- 주문 내역 조회

### 3. 💼 포트폴리오 (Portfolio)

- 보유 종목 현황
- 총 자산 및 수익률 분석
- 수익률 차트
- 거래 내역

### 4. 🧪 백테스팅 연구소 (BacktestingLab)

- 투자 전략 생성
- 과거 데이터 기반 시뮬레이션
- 수익률 분석 및 통계
- 전략 비교

### 5. 📰 시장 뉴스 (MarketNews)

- 실시간 금융 뉴스
- 시장 지표 (KOSPI, KOSDAQ, 환율 등)
- 인기 종목 순위
- 경제 일정

### 6. 👤 마이페이지 (MyPage)

- 프로필 관리
- 가상 계좌 관리 (시드머니 설정)
- 거래 통계
- 알림 설정
- 보안 설정 (비밀번호 변경, 2FA)

---

## API 연동

### Mock 모드

현재 프론트엔드는 **Mock 모드**로 동작합니다. 실제 백엔드 연동 없이 UI를 개발하고 테스트할 수 있습니다.

```typescript
// src/services/api/client.ts
export const USE_MOCK_API = true; // Mock 모드 활성화
```

### 실제 API 연동 방법

1. `USE_MOCK_API`를 `false`로 변경
2. 환경 변수에 실제 API URL 설정
3. 각 서비스 파일의 주석 처리된 실제 API 호출 코드 활성화

```typescript
// 예시: src/services/api/auth.ts
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  // Mock 응답 제거하고 아래 코드 사용
  return await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
}
```

### API 엔드포인트

| 기능 | 엔드포인트 |
|------|-----------|
| **인증** | |
| 로그인 | `POST /api/auth/login` |
| 회원가입 | `POST /api/auth/signup` |
| 로그아웃 | `POST /api/auth/logout` |
| 토큰 갱신 | `POST /api/auth/refresh` |
| **주식** | |
| 종목 목록 | `GET /api/stocks` |
| 종목 상세 | `GET /api/stocks/:code` |
| 차트 데이터 | `GET /api/stocks/:code/chart` |
| 호가창 | `GET /api/stocks/:code/orderbook` |
| 검색 | `GET /api/stocks/search` |
| **포트폴리오** | |
| 요약 | `GET /api/portfolio/summary` |
| 보유 종목 | `GET /api/portfolio/holdings` |
| 히스토리 | `GET /api/portfolio/history` |
| **주문** | |
| 주문 생성 | `POST /api/orders` |
| 주문 목록 | `GET /api/orders` |
| 주문 취소 | `DELETE /api/orders/:id` |
| 거래 내역 | `GET /api/orders/history` |

---

## 컴포넌트 가이드

### UI 컴포넌트 사용

```tsx
// 권장: 통합 import
import { Button, Card, Input } from '@/components/ui';

// 개별 import도 가능
import { Button } from '@/components/ui/button';
```

### 페이지 컴포넌트 사용

```tsx
import { TradingCenter, Portfolio } from '@/pages';
```

### 커스텀 Hook 사용

```tsx
import { useAuth, useStocks, usePortfolio } from '@/hooks';

function MyComponent() {
  const { user, isLoggedIn, login, logout } = useAuth();
  const { stocks, isLoading } = useStocks();
  const { summary, holdings } = usePortfolio();
  
  // ...
}
```

### 유틸리티 함수 사용

```tsx
import { cn, formatKRW, formatPercent } from '@/lib/utils';

// 클래스 병합
<div className={cn("base-class", isActive && "active-class")} />

// 원화 포맷
formatKRW(1000000);  // "1,000,000원"

// 퍼센트 포맷
formatPercent(0.125);  // "+12.50%"
```

---

## 스타일 가이드

### 테마 색상

```css
/* src/styles/theme.css */

/* Primary: 인디고 계열 */
--primary: oklch(0.6 0.2 270);

/* Success: 에메랄드 */
--success: oklch(0.7 0.15 160);

/* Danger: 로즈 */
--danger: oklch(0.65 0.2 25);

/* Warning: 앰버 */
--warning: oklch(0.75 0.15 80);
```

### Glass Effect

```css
.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
}

.glass-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 반응형 디자인

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

```tsx
// Tailwind 반응형 클래스 사용
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* ... */}
</div>
```

---

## 라이선스

MIT License

---

## 기여

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 문의

프로젝트 관련 문의사항은 이슈를 생성해주세요.
  