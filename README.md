# 어디로 가야 해?

일상 속 작은 응급처치가 필요할 때 증상을 검색하거나 선택하면, 집에서 먼저 해볼 수 있는 처치와 방문을 고려할 진료과를 안내하는 모바일 우선 웹앱입니다.

이 서비스는 의료 진단이 아니며, 위급한 경우 즉시 119에 연락해야 합니다.

## 주요 기능

- 증상 검색과 빠른 증상 버튼
- 일상 처치 / 빠른 진료 권장 / 긴급 안내 수준 표시
- 추천 진료과, 지금 해볼 수 있는 처치, 하지 말아야 할 행동, 위험 신호 제공
- 공개 자료 출처와 의료 면책 문구 표시

## 출처와 저작권

앱의 응급처치 안내 문구는 아래 공개 자료를 참고해 원문을 그대로 복제하지 않고 앱용으로 재구성했습니다.

- NHS: https://www.nhs.uk/our-policies/terms-and-conditions/
- MedlinePlus: https://medlineplus.gov/about/using/usingcontent/
- CDC: https://www.cdc.gov/other/agencymaterials.html

NHS 자료는 Open Government Licence v3.0 조건을 따릅니다.
Contains public sector information licensed under the Open Government Licence v3.0.

MedlinePlus 자료 중 A.D.A.M. Medical Encyclopedia, 약물 monograph, 이미지 등 별도 저작권이 있는 콘텐츠는 사용하지 않았습니다.
CDC 로고, 기관 명칭을 통한 보증 표현, 제3자 이미지 또는 별도 저작권 자료는 사용하지 않았습니다.

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
