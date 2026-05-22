# School SOS

학교 현장에서 응급 상황을 빠르게 정리하고, 119 신고와 교직원 역할 분담, 보호자 안내, 기록 문구까지 한 화면에서 확인할 수 있도록 만든 응급 대응 보조 앱입니다.

이 앱은 의료 진단이나 119/보건교사/의료진 판단을 대체하지 않습니다. 생명위험 징후가 있으면 앱 안내보다 먼저 119 신고와 현장 안전 확보를 우선합니다.

## 주요 기능

- 자유 입력 문장으로 응급 상황 분류
- 1단계 생명위험 응급, 2단계 응급, 3단계 준응급 안내
- Check-Call-Care 흐름 기반 현장 행동 안내
- 교직원 역할 분담, 보호자 연락 문구, 사고 기록 초안 제공
- 심정지, 기도폐쇄, 아나필락시스, 출혈, 화상, 경련, 온열·한랭질환 등 학교에서 자주 필요한 상황 반영
- 각 결과 화면에서 참고한 공식 출처 표시

## 공식 출처

앱 내용은 다음 공식 기관 자료를 바탕으로 정리했습니다.

- 교육부 학생건강정보센터, 학교 응급상황 대응 가이드라인: https://www.schoolhealth.kr/
- 서울특별시교육청, 학생안전매뉴얼(2024.12 개정): https://www.sen.go.kr/
- 소방청, 응급처치 안전교육 자료: https://www.nfa.go.kr/nfa/safetyinfo/lifesafety/0001/
- 질병관리청 국가건강정보포털, 아나필락시스 및 저혈당 관련 건강정보: https://health.kdca.go.kr/

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
