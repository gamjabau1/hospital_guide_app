# 병원 어디가?

증상을 검색하거나 선택하면 응급도, 추천 진료과, 지금 해야 할 행동, 위험 신호를 안내하는 모바일 우선 웹앱입니다.

이 서비스는 진단이 아니며, 위급한 경우 즉시 119에 연락하세요.

## 주요 기능

- 큰 검색창과 빠른 증상 버튼으로 증상 안내 진입
- 긴급 / 빠른 진료 권장 / 일반 진료 응급도 표시
- 추천 진료과, 바로 해야 할 일 3개, 금지 행동, 위험 신호 제공
- 공식기관 자료 출처와 의료 면책 문구 표시

## 공식 출처

앱 내용은 다음 공식 기관 자료를 바탕으로 정리했습니다.

- 소방청, 응급처치 안전교육 자료: https://www.nfa.go.kr/nfa/safetyinfo/lifesafety/0001/
- 질병관리청 국가건강정보포털: https://health.kdca.go.kr/
공식 자료는 개정될 수 있으므로 배포 전후로 문서 날짜와 내용을 주기적으로 확인하는 것을 권장합니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다.

## 검증

```bash
npx tsc --noEmit
npm run build
```

## 배포

Vercel 배포 기준 권장 설정입니다.

- Framework Preset: Next.js
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: Next.js 기본값 사용

GitHub 저장소를 Vercel에 연결하면 `main` 브랜치에 푸시될 때 자동 배포할 수 있습니다.
