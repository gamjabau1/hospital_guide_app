# 병원 어디가?

일상에서 갑자기 다치거나 몸에 이상이 왔을 때, 어느 병원과 진료과를 먼저 고려해야 할지 빠르게 안내하는 모바일 우선 웹앱입니다.

이 서비스는 의료 진단이 아니며, 위급한 경우 즉시 119에 연락해야 합니다.

## 주요 기능

- 증상 검색과 빠른 증상 버튼
- 짧은 문진을 통한 안내 수준 조정
- 일상 처치 / 빠른 진료 권장 / 긴급 안내 표시
- 추천 진료과와 네이버지도 검색 연결
- 약국에서 물어볼 수 있는 물품 안내
- 병원 방문 시 준비할 항목 안내
- 공개 자료 출처와 의료 면책 문구 표시

## 출처와 저작권

앱의 안내 문구는 아래 공개 자료를 참고해 원문을 그대로 복제하지 않고 앱용으로 재구성했습니다.
저작권을 침해하는 행위는 하지 않습니다.

- NHS: https://www.nhs.uk/our-policies/terms-and-conditions/
- CDC: https://www.cdc.gov/other/agencymaterials.html
- NINDS: https://www.ninds.nih.gov/health-information/disorders/bells-palsy

NHS 자료는 Open Government Licence v3.0 조건을 따릅니다.
Contains public sector information licensed under the Open Government Licence v3.0.

CDC 로고, 기관 명칭을 통한 보증 표현, 제3자 이미지 또는 별도 저작권 자료는 사용하지 않았습니다.
NINDS 자료는 안면마비 관련 공개 건강정보를 참고했으며, 앱 화면 문구는 직접 요약해 작성했습니다.

네이버지도는 병원과 약국 검색 결과로 이동하는 외부 링크만 사용합니다. 이 앱은 위치 정보를 직접 수집하지 않습니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다.

## 검증

```bash
npm run build
```

## 배포

일반 웹 배포는 Vercel 기준으로 가능합니다.

- Framework Preset: Next.js
- Build Command: `npm run build`
- Install Command: `npm install`

앱인토스 출품용으로는 별도의 앱인토스 프로젝트 구조에서 `.ait` 번들을 생성해 콘솔에 업로드해야 합니다.
