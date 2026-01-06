# 프로젝트 구조

## 기술 스택

### Core
- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구 (빠른 개발 서버 및 HMR)
- **React Router DOM v7** - 클라이언트 사이드 라우팅

### HTTP 통신
- **Axios** - HTTP 클라이언트 (API 통신)

### 스타일링
- **CSS Modules** - 컴포넌트 단위 스타일링
- **Modern CSS** - CSS Variables, Flexbox, Grid

## 프로젝트 디렉토리 구조

```
login-frontend/
├── public/                 # 정적 파일
├── src/
│   ├── components/         # React 컴포넌트
│   │   ├── Login.jsx       # 로그인 컴포넌트
│   │   ├── Login.module.css
│   │   ├── Register.jsx    # 회원가입 컴포넌트
│   │   ├── Register.module.css
│   │   └── Dashboard.jsx   # 로그인 후 대시보드
│   │
│   ├── services/           # API 통신 레이어
│   │   ├── api.js          # Axios 인스턴스 설정
│   │   └── authService.js  # 인증 관련 API 호출
│   │
│   ├── App.jsx             # 메인 앱 컴포넌트 (라우팅)
│   ├── App.css             # 글로벌 스타일
│   ├── index.css           # CSS 변수 및 리셋
│   └── main.jsx            # 앱 진입점
│
├── package.json
├── vite.config.js
├── PROJECT_STRUCTURE.md    # 이 문서
├── API_INTEGRATION.md      # API 연동 스펙
├── COMPONENT_SPECIFICATION.md  # 컴포넌트 스펙
└── STYLING_GUIDE.md        # 디자인 가이드
```

## 개발 명령어

```bash
# 의존성 설치
yarn

# 개발 서버 시작 (http://localhost:8080)
yarn dev

# 프로덕션 빌드
yarn build

# 빌드 결과 미리보기ㄴ
yarn preview
```

## 환경 설정

### API Base URL
- 개발: `http://localhost:8080/api`
- 프로덕션: 환경변수로 관리

### 포트
- 프론트엔드: `8080` (Vite 기본)
- 백엔드: `8080`

## 코딩 규칙

### 파일 명명
- 컴포넌트: PascalCase (예: `Login.jsx`, `Register.jsx`)
- 스타일: PascalCase.module.css (예: `Login.module.css`)
- 서비스: camelCase (예: `authService.js`)
- 유틸: camelCase (예: `validation.js`)

### 컴포넌트 작성 규칙
- 함수형 컴포넌트 사용
- React Hooks 활용 (useState, useEffect, useNavigate)
- Props validation (필요시)
- 명확한 함수/변수명 사용

### 스타일링 규칙
- CSS Modules 사용으로 스타일 격리
- CSS Variables로 테마 관리
- 반응형 디자인 적용
- 모던하고 깔끔한 UI

## 상태 관리 전략

현재는 간단한 애플리케이션이므로:
- **Local State**: `useState`로 컴포넌트 내부 상태 관리
- **Navigation State**: React Router로 페이지 상태 관리
- **API State**: 컴포넌트에서 직접 관리

추후 확장 시 고려사항:
- Context API (전역 사용자 상태)
- Redux/Zustand (복잡한 상태 관리)
- React Query (서버 상태 관리)

