import type { SourceRef } from "./types"

export type CheckFlag = {
  id: string
  label: string
  tier: "emergency" | "quasi" | "routine"
}

export type CategoryDef = {
  id: string
  label: string
  chapter: string
  icon: string
  checkFlags: CheckFlag[]
  careSteps: string[]
  department: string
  sourceIds: string[]
  quasiNote?: string
}

export const OFFICIAL_SOURCES: SourceRef[] = [
  {
    id: "moe-2025",
    institution: "교육부",
    title: "학교 응급상황 대응 가이드라인",
    url: "https://www.schoolhealth.kr/web/search/selectTotalSearchList.do?bbsId=&bbsTyCode=&kwdLogYn=N&lstnum1=5438&pageIndex=1&pageUnit=10&searchWrd=%EC%9D%91%EA%B8%89&sortOrder=",
    note: "학생건강정보센터 등록 자료. 3C(Check-Call-Care), 응급/준응급 분류, 학교 역할 체계를 반영",
  },
  {
    id: "sen-2024",
    institution: "서울특별시교육청",
    title: "학생안전매뉴얼(2024.12 개정)",
    url: "https://www.sen.go.kr/user/bbs/BD_selectBbs.do?q_bbsDocNo=20250502090853761&q_bbsSn=1026",
    note: "학교 안전사고 대응과 보고 체계 참고",
  },
  {
    id: "nfa-cpr",
    institution: "소방청",
    title: "심폐소생술(CPR)",
    url: "https://www.nfa.go.kr/nfa/safetyinfo/lifesafety/0001/?boardId=bbs_0000000000002462&category=%EC%9D%91%EA%B8%89%EC%B2%98%EC%B9%98&cntId=3&mode=view&pageIdx=",
    note: "119구급대원 현장응급처치 표준지침 기반",
  },
  {
    id: "nfa-aed",
    institution: "소방청",
    title: "자동 심장충격기(AED)",
    url: "https://www.nfa.go.kr/nfa/safetyinfo/lifesafety/0001/?boardId=bbs_0000000000002462&category=%EC%9D%91%EA%B8%89%EC%B2%98%EC%B9%98&cntId=4&mode=view&pageIdx=",
    note: "AED 전원, 패드 부착, 리듬 분석, 충격 후 CPR 재개 절차",
  },
  {
    id: "nfa-choking",
    institution: "소방청",
    title: "기도폐쇄",
    url: "https://www.nfa.go.kr/nfa/safetyinfo/lifesafety/0001/?boardId=bbs_0000000000002462&category=%EC%9D%91%EA%B8%89%EC%B2%98%EC%B9%98&cntId=6&mode=view&pageIdx=",
    note: "기침 격려, 등 두드리기와 복부 밀어내기, 의식 소실 시 CPR",
  },
  {
    id: "nfa-bleeding",
    institution: "소방청",
    title: "지혈 처치",
    url: "https://www.nfa.go.kr/nfa/safetyinfo/lifesafety/0001/?boardId=bbs_0000000000002462&category=%EC%9D%91%EA%B8%89%EC%B2%98%EC%B9%98&cntId=11&mode=view&pageIdx=",
    note: "거즈 직접 압박, 붕대 고정, 손상 부위 거상",
  },
  {
    id: "nfa-burn",
    institution: "소방청",
    title: "화상 처치",
    url: "https://www.nfa.go.kr/nfa/safetyinfo/lifesafety/0001/?boardId=bbs_0000000000002462&category=%EC%9D%91%EA%B8%89%EC%B2%98%EC%B9%98&cntId=12&mode=view&pageIdx=",
    note: "장신구 제거, 흐르는 물로 냉각, 물집 보존",
  },
  {
    id: "nfa-seizure",
    institution: "소방청",
    title: "경련처치",
    url: "https://www.nfa.go.kr/nfa/safetyinfo/lifesafety/0001/?boardId=bbs_0000000000002462&category=%EC%9D%91%EA%B8%89%EC%B2%98%EC%B9%98&cntId=19&mode=view&pageIdx=",
    note: "119구급대원 현장응급처치 표준지침 기반",
  },
  {
    id: "nfa-heat",
    institution: "소방청",
    title: "열손상",
    url: "https://www.nfa.go.kr/nfa/safetyinfo/lifesafety/0001/?boardId=bbs_0000000000002462&category=%EC%9D%91%EA%B8%89%EC%B2%98%EC%B9%98&cntId=16&mode=view&pageIdx=",
    note: "시원한 곳 이동, 복장 제거, 체온 낮추기, 고체온 시 119",
  },
  {
    id: "nfa-cold",
    institution: "소방청",
    title: "한랭손상",
    url: "https://www.nfa.go.kr/nfa/safetyinfo/lifesafety/0001/?boardId=bbs_0000000000002462&category=%EC%9D%91%EA%B8%89%EC%B2%98%EC%B9%98&cntId=17&mode=view&pageIdx=",
    note: "따뜻한 곳 이동, 젖은 옷 제거, 보온, 마사지 금지",
  },
  {
    id: "nfa-sting",
    institution: "소방청",
    title: "벌 쏘임",
    url: "https://www.nfa.go.kr/nfa/safetyinfo/lifesafety/0001/?boardId=bbs_0000000000002462&category=%EC%9D%91%EA%B8%89%EC%B2%98%EC%B9%98&cntId=8&mode=view&pageIdx=",
    note: "카드 모서리로 침 제거, 세척, 얼음찜질, 전신반응 주의",
  },
  {
    id: "nfa-snake",
    institution: "소방청",
    title: "뱀 물림",
    url: "https://www.nfa.go.kr/nfa/safetyinfo/lifesafety/0001/?boardId=bbs_0000000000002462&category=%EC%9D%91%EA%B8%89%EC%B2%98%EC%B9%98&cntId=9&mode=view&pageIdx=",
    note: "환자 안정, 움직임·말하기 자제, 독 흡입 금지",
  },
  {
    id: "nfa-nosebleed",
    institution: "소방청",
    title: "코피 처치",
    url: "https://www.nfa.go.kr/nfa/safetyinfo/lifesafety/0001/?boardId=bbs_0000000000002462&category=%EC%9D%91%EA%B8%89%EC%B2%98%EC%B9%98&cntId=10&mode=view&pageIdx=",
    note: "앉아서 고개 숙이기, 코 앞쪽 압박, 피 삼키지 않기",
  },
  {
    id: "nfa-amputation",
    institution: "소방청",
    title: "절단상 처치",
    url: "https://www.nfa.go.kr/nfa/safetyinfo/lifesafety/0001/?boardId=bbs_0000000000002462&category=%EC%9D%91%EA%B8%89%EC%B2%98%EC%B9%98&cntId=7&mode=view&pageIdx=",
    note: "절단면 세척, 젖은 거즈와 밀봉, 얼음 직접 접촉 금지",
  },
  {
    id: "kdca-anaphylaxis",
    institution: "질병관리청 국가건강정보포털",
    title: "아나필락시스 응급처치",
    url: "https://health.kdca.go.kr/healthinfo/biz/health/ntcnInfo/healthSourc/thtimtCntnts/thtimtCntntsView.do?thtimt_cntnts_sn=81",
    note: "원인 제거, 눕히기, 의식·호흡·맥박 확인, 119 신고, 자가주사용 에피네프린",
  },
  {
    id: "kdca-diabetes",
    institution: "질병관리청 국가건강정보포털",
    title: "당뇨환자의 식이요법 - 저혈당 대처",
    url: "https://health.kdca.go.kr/healthinfo/biz/health/gnrlzHealthInfo/gnrlzHealthInfo/gnrlzHealthInfoView.do?cntnts_sn=3388",
    note: "의식이 있으면 당질 15g 섭취 후 15분 뒤 재측정, 의식이 없으면 경구 섭취 금지",
  },
]

export const CATEGORIES: CategoryDef[] = [
  {
    id: "cardiac-arrest",
    label: "심장정지",
    chapter: "3C·4 Check",
    icon: "❤️",
    sourceIds: ["moe-2025", "nfa-cpr", "nfa-aed"],
    checkFlags: [
      { id: "unconscious", label: "의식이 없거나 깨워도 반응이 없음", tier: "emergency" },
      { id: "no-breath", label: "호흡이 없거나 헐떡이는 비정상 호흡", tier: "emergency" },
      { id: "no-pulse", label: "맥박이 없거나 심장정지가 의심됨", tier: "emergency" },
    ],
    careSteps: [
      "현장 안전을 확인하고 학생을 단단하고 평평한 곳에 눕힘",
      "큰 소리로 119 신고와 AED 요청을 분담",
      "10초 이내 호흡을 확인하고 정상 호흡이 없으면 즉시 가슴압박 시작",
      "가슴 중앙을 분당 100~120회 속도, 약 5cm 깊이로 압박",
      "교육받았고 시행 의지가 있으면 가슴압박 30회와 인공호흡 2회를 반복",
      "AED 도착 시 전원을 켜고 안내에 따라 패드를 붙인 뒤 분석 중 모두 물러남",
      "전기충격 후 지체 없이 가슴압박을 다시 시작하고 119 구급대에 인계",
    ],
    department: "119 구급대·응급의학과",
  },
  {
    id: "choking",
    label: "기도폐쇄",
    chapter: "3C·기도폐쇄",
    icon: "🫁",
    sourceIds: ["moe-2025", "nfa-choking"],
    checkFlags: [
      { id: "cannot-speak", label: "말·기침·호흡이 어렵고 목을 감싸는 V자 신호", tier: "emergency" },
      { id: "cyanosis", label: "입술이 파래지거나 의식이 흐려짐", tier: "emergency" },
      { id: "partial", label: "소리 나는 기침이 가능함", tier: "quasi" },
    ],
    careSteps: [
      "기침이 가능하면 계속 기침하도록 격려하고 곁에서 관찰",
      "소리 나는 기침이 어렵거나 말하지 못하면 즉시 119 신고",
      "학생 뒤에서 몸을 지지하고 등 두드리기 5회와 복부 밀어내기 5회를 반복",
      "임신부 또는 고도비만 학생은 복부 대신 가슴 밀어내기 적용",
      "의식을 잃으면 바닥에 눕히고 심폐소생술을 시작",
      "입안 이물은 보이는 경우에만 조심히 제거하고 손가락으로 훑지 않음",
    ],
    department: "119 구급대·응급의학과·이비인후과",
  },
  {
    id: "consciousness",
    label: "실신·의식장애",
    chapter: "응급상황 판단",
    icon: "🧠",
    sourceIds: ["moe-2025", "sen-2024"],
    checkFlags: [
      { id: "unresponsive", label: "불러도 반응하지 않거나 의식이 없음", tier: "emergency" },
      { id: "confused", label: "의식이 명료하지 않거나 말이 어눌함", tier: "emergency" },
      { id: "head-injury", label: "머리 손상 뒤 구토·의식 변화·심한 두통", tier: "emergency" },
      { id: "dizzy", label: "어지러움·창백·식은땀은 있으나 의식은 유지", tier: "quasi" },
    ],
    careSteps: [
      "현장 위험요인을 제거하고 낙상·추가 손상을 막음",
      "의식·호흡·맥박을 확인하고 이상이 있으면 119 신고",
      "호흡이 있으면 편안한 자세로 눕히고 옷을 느슨하게 함",
      "머리·목 손상이 의심되면 움직임을 최소화하고 목을 과도하게 젖히지 않음",
      "구토가 있거나 의식이 떨어지면 기도 막힘을 예방하며 옆으로 돌려 관찰",
      "보건교사는 활력징후와 혈당 측정 가능 여부를 확인",
    ],
    department: "응급의학과·소아청소년과·신경과",
  },
  {
    id: "hyperventilation",
    label: "과호흡·공황",
    chapter: "호흡곤란 감별",
    icon: "🌬️",
    sourceIds: ["moe-2025", "sen-2024"],
    checkFlags: [
      { id: "severe-breath", label: "호흡곤란이 심하거나 청색증·흉통 동반", tier: "emergency" },
      { id: "collapse", label: "쓰러짐·의식 저하·경련 동반", tier: "emergency" },
      { id: "anxiety", label: "불안·손발 저림·빠른 호흡이나 의식은 명료", tier: "quasi" },
    ],
    careSteps: [
      "조용하고 안전한 곳으로 이동해 앉거나 기대게 함",
      "청색증, 흉통, 의식저하, 천식 병력 등 위험 신호를 먼저 확인",
      "천천히 코로 들이마시고 길게 내쉬도록 짧게 안내",
      "종이봉투 재호흡은 저산소 위험 때문에 사용하지 않음",
      "증상이 지속되거나 처음 발생한 심한 호흡곤란이면 119 또는 의료기관 연결",
    ],
    department: "응급의학과·소아청소년과·정신건강의학과",
  },
  {
    id: "asthma-anaphylaxis",
    label: "천식·아나필락시스",
    chapter: "호흡곤란·알레르기",
    icon: "💨",
    sourceIds: ["moe-2025", "kdca-anaphylaxis", "nfa-sting"],
    checkFlags: [
      { id: "severe-breath", label: "숨쉬기 힘듦·쌕쌕거림이 심하거나 말하기 어려움", tier: "emergency" },
      { id: "facial-swelling", label: "얼굴·입술·혀 부종 또는 전신 두드러기와 호흡곤란", tier: "emergency" },
      { id: "shock", label: "창백·식은땀·어지러움·의식저하 등 쇼크 의심", tier: "emergency" },
      { id: "no-relief", label: "처방 흡입제 사용 후에도 호전 없음", tier: "emergency" },
      { id: "wheeze", label: "가벼운 쌕쌕거림·가슴 답답함", tier: "quasi" },
      { id: "hives", label: "국소 두드러기·가려움만 있고 호흡곤란 없음", tier: "quasi" },
    ],
    careSteps: [
      "원인 식품·약물·벌 등 노출을 즉시 중단하고 학생을 안정시킴",
      "호흡곤란, 얼굴·입술 부종, 의식저하가 있으면 즉시 119 신고",
      "천식 학생은 처방된 기관지확장 흡입제를 학생 계획에 따라 사용하도록 도움",
      "아나필락시스 처방 학생은 자가주사용 에피네프린을 허벅지 바깥쪽에 투여하도록 지원",
      "눕히고 다리를 올리되 호흡이 불편하면 편한 자세를 유지",
      "에피네프린 투여 시각을 기록하고 증상이 좋아져도 응급실로 이송",
    ],
    department: "119 구급대·응급의학과·알레르기/호흡기",
    quasiNote: "아나필락시스 병력이 있는 학생은 보호자·주치의 지시에 따른 응급계획과 약품 위치를 학교가 사전에 확인해야 합니다.",
  },
  {
    id: "bleeding",
    label: "출혈·상처",
    chapter: "외상",
    icon: "🩸",
    sourceIds: ["moe-2025", "nfa-bleeding", "nfa-amputation"],
    checkFlags: [
      { id: "uncontrolled", label: "직접 압박해도 멈추지 않는 다량 출혈", tier: "emergency" },
      { id: "shock", label: "창백·식은땀·의식저하 등 출혈성 쇼크 의심", tier: "emergency" },
      { id: "amputation", label: "절단상 또는 깊은 관통상", tier: "emergency" },
      { id: "minor-cut", label: "작은 찰과상·베임·지혈 가능한 상처", tier: "routine" },
    ],
    careSteps: [
      "일회용 장갑을 착용하고 가능하면 깨끗한 물로 오염을 제거",
      "거즈나 깨끗한 천으로 상처를 직접 압박",
      "붕대로 고정해 압박을 유지하고 손상 부위를 심장보다 높임",
      "관통 물체는 빼지 말고 주변을 고정한 뒤 119에 인계",
      "절단 부위는 생리식염수 거즈로 감싸 밀봉하고 얼음과 직접 닿지 않게 냉장 보관",
      "파상풍 예방접종 여부와 보호자 연락 필요성을 확인",
    ],
    department: "응급의학과·외과·정형외과",
  },
  {
    id: "burn",
    label: "화상",
    chapter: "화상",
    icon: "🔥",
    sourceIds: ["moe-2025", "nfa-burn"],
    checkFlags: [
      { id: "major-burn", label: "얼굴·손·발·회음부 화상 또는 넓은 범위·깊은 화상", tier: "emergency" },
      { id: "chemical-electric", label: "화학물질·전기 화상", tier: "emergency" },
      { id: "blister", label: "물집·통증이 있는 국소 1~2도 화상", tier: "quasi" },
    ],
    careSteps: [
      "화상 부위의 반지·시계 등 조이는 물건을 먼저 제거",
      "옷이 달라붙었으면 억지로 떼지 않음",
      "흐르는 시원한 물로 충분히 식히고 얼음은 직접 대지 않음",
      "물집은 터뜨리지 않고 연고·치약·기름 등 민간요법을 바르지 않음",
      "깨끗한 거즈나 천으로 느슨하게 덮고 감염을 예방",
      "넓거나 깊은 화상, 얼굴·기도·전기·화학 화상은 즉시 119 또는 응급실",
    ],
    department: "응급의학과·화상전문·소아청소년과",
  },
  {
    id: "diabetes",
    label: "저혈당·고혈당",
    chapter: "만성질환 응급",
    icon: "🍬",
    sourceIds: ["moe-2025", "kdca-diabetes"],
    checkFlags: [
      { id: "low-unconscious", label: "저혈당 의심 + 의식저하·경련", tier: "emergency" },
      { id: "high-keto", label: "고혈당 의심 + 구토·복통·깊은 호흡·의식저하", tier: "emergency" },
      { id: "low-mild", label: "의식이 있고 식은땀·떨림·허기·창백", tier: "quasi" },
      { id: "high-mild", label: "갈증·다뇨·피로감이나 의식은 명료", tier: "quasi" },
    ],
    careSteps: [
      "학생의 개별 건강관리계획과 보호자·주치의 지시를 확인",
      "가능하면 혈당을 측정하고 시간과 수치를 기록",
      "의식이 있으면 당질 15g(포도당, 주스 등)을 섭취하게 하고 15분 뒤 재측정",
      "의식이 없거나 삼키기 어려우면 입으로 먹이지 말고 119 신고",
      "처방된 글루카곤이 있고 학교 계획에 포함된 경우 정해진 절차에 따라 도움",
      "고혈당과 케톤산증 의심 시 인슐린 임의 투여를 피하고 보호자·의료기관과 연결",
    ],
    department: "소아청소년과·내분비·응급의학과",
  },
  {
    id: "seizure",
    label: "경련·발작",
    chapter: "신경계 응급",
    icon: "⚡",
    sourceIds: ["moe-2025", "nfa-seizure"],
    checkFlags: [
      { id: "active", label: "현재 경련 중", tier: "emergency" },
      { id: "over-5min", label: "5분 이상 지속되거나 반복되고 회복 없음", tier: "emergency" },
      { id: "injury", label: "머리 손상·물속 사고·호흡곤란 동반", tier: "emergency" },
      { id: "first-time", label: "처음 발생했거나 보호자 확인이 필요한 발작", tier: "quasi" },
    ],
    careSteps: [
      "주변 물건을 치우고 머리 아래에 부드러운 것을 받침",
      "억지로 붙잡거나 입에 물건을 넣지 않음",
      "경련 시작 시간과 양상을 기록하고 가능하면 보호자에게 전달",
      "옷을 느슨하게 하고 호흡을 관찰",
      "경련이 끝나면 옆으로 돌려 기도 막힘을 예방하고 완전히 깰 때까지 관찰",
      "5분 이상 지속, 반복 발작, 첫 발작, 외상·호흡곤란이 있으면 119 신고",
    ],
    department: "응급의학과·소아청소년과·신경과",
  },
  {
    id: "sting-foreign",
    label: "벌·뱀·이물",
    chapter: "동물·이물 손상",
    icon: "🐝",
    sourceIds: ["moe-2025", "nfa-sting", "nfa-snake", "kdca-anaphylaxis"],
    checkFlags: [
      { id: "anaphylaxis-sting", label: "벌 쏘임 뒤 호흡곤란·전신 두드러기·어지러움", tier: "emergency" },
      { id: "snake", label: "뱀 물림", tier: "emergency" },
      { id: "eye-foreign", label: "눈 이물·화학물질 노출", tier: "quasi" },
      { id: "local-sting", label: "국소 통증·부기만 있음", tier: "quasi" },
    ],
    careSteps: [
      "벌침은 카드 모서리로 밀어 제거하고 핀셋으로 짜내지 않음",
      "쏘인 부위를 비누와 물로 씻고 얼음찜질을 하며 해당 부위를 높임",
      "호흡곤란·청색증·전신 두드러기·의식저하가 있으면 아나필락시스로 보고 119 신고",
      "뱀 물림은 앉거나 눕혀 안정시키고 걷기·말하기를 줄임",
      "뱀 독을 입으로 빨거나 상처를 절개하지 않음",
      "눈 이물은 비비지 않게 하고 화학물질이면 즉시 흐르는 물로 세척 후 의료기관 연결",
    ],
    department: "응급의학과·알레르기·안과",
  },
  {
    id: "fracture",
    label: "골절·염좌·탈구",
    chapter: "근골격 손상",
    icon: "🩼",
    sourceIds: ["moe-2025", "sen-2024", "nfa-amputation"],
    checkFlags: [
      { id: "open-fracture", label: "개방성 골절 또는 뼈가 보이는 상처", tier: "emergency" },
      { id: "amputation", label: "절단 또는 손가락·발가락 절단 의심", tier: "emergency" },
      { id: "neurovascular", label: "감각저하·창백·차가움·맥박 약함", tier: "emergency" },
      { id: "deformity", label: "심한 통증·변형·움직임 제한", tier: "quasi" },
      { id: "sprain", label: "가벼운 염좌·부기만 있음", tier: "routine" },
    ],
    careSteps: [
      "손상 부위를 움직이지 않게 하고 무리한 정복을 시도하지 않음",
      "부목은 손상 부위 위아래 관절까지 고정",
      "개방성 상처는 깨끗한 거즈로 덮고 직접 깊게 압박하지 않음",
      "부기와 통증 완화를 위해 천으로 감싼 냉찜질을 적용",
      "감각·색·온도·통증 변화를 반복 확인",
      "개방골절, 감각·혈액순환 이상, 심한 변형은 119 또는 응급실 이송",
    ],
    department: "응급의학과·정형외과",
  },
  {
    id: "pain",
    label: "통증·흉통·복통",
    chapter: "증상별 응급",
    icon: "🩺",
    sourceIds: ["moe-2025", "sen-2024"],
    checkFlags: [
      { id: "head-trauma", label: "머리 손상 뒤 심한 두통·구토·의식변화", tier: "emergency" },
      { id: "chest-pain", label: "갑작스러운 흉통·호흡곤란·식은땀", tier: "emergency" },
      { id: "acute-abdomen", label: "심한 복통·복부 강직·반복 구토·발열", tier: "emergency" },
      { id: "mild-pain", label: "경미하고 점차 호전되는 통증", tier: "routine" },
    ],
    careSteps: [
      "무리한 이동을 줄이고 편안한 자세에서 활력징후를 확인",
      "흉통·호흡곤란·식은땀·의식변화가 있으면 즉시 119 신고",
      "복통은 음식·약을 임의로 먹이지 않고 통증 위치와 시작 시각을 기록",
      "머리 손상 뒤 졸림·구토·시야 이상·경련이 있으면 응급실 연결",
      "통증이 가볍더라도 반복·악화되면 보호자 연락 후 의료기관 진료 안내",
    ],
    department: "응급의학과·소아청소년과·증상별 진료과",
  },
  {
    id: "overdose",
    label: "약물·중독",
    chapter: "중독 의심",
    icon: "💊",
    sourceIds: ["moe-2025", "sen-2024"],
    checkFlags: [
      { id: "altered", label: "약물·화학물질 노출 뒤 의식·호흡 변화", tier: "emergency" },
      { id: "unknown", label: "복용량·성분을 알 수 없거나 자해 의심", tier: "emergency" },
      { id: "suspect", label: "소량 노출 의심이나 현재 안정", tier: "quasi" },
    ],
    careSteps: [
      "현장 안전을 확보하고 약물·용기·성분표를 보존",
      "의식·호흡 변화가 있으면 119 신고와 기도 유지",
      "임의로 토하게 하거나 음식·물을 먹이지 않음",
      "피부·눈 화학물질은 오염 옷을 제거하고 흐르는 물로 충분히 세척",
      "복용 시간, 추정량, 증상 변화, 발견자를 기록",
      "자해 위험이 있으면 혼자 두지 않고 학생 보호 체계와 보호자를 즉시 연결",
    ],
    department: "119 구급대·응급의학과·정신건강의학과",
  },
  {
    id: "facial",
    label: "안면·눈·코피",
    chapter: "안면 손상",
    icon: "👁️",
    sourceIds: ["moe-2025", "nfa-nosebleed"],
    checkFlags: [
      { id: "vision", label: "시야 이상·복시·눈 관통상·화학물질 노출", tier: "emergency" },
      { id: "severe-epistaxis", label: "30분 이상 멈추지 않는 코피 또는 호흡 방해", tier: "emergency" },
      { id: "eye-trauma", label: "눈 타박·통증·눈부심", tier: "quasi" },
      { id: "nosebleed", label: "압박으로 지혈 가능한 코피", tier: "routine" },
    ],
    careSteps: [
      "눈은 비비지 않게 하고 이물질을 억지로 빼지 않음",
      "화학물질이 눈에 들어가면 즉시 흐르는 물로 충분히 세척하고 응급 진료 연결",
      "코피는 앉아서 고개를 약간 앞으로 숙이고 코 앞쪽을 10분 이상 압박",
      "피는 삼키지 말고 뱉도록 안내",
      "30분 이상 지속, 반복 대량 출혈, 안면골절 의심, 호흡 방해가 있으면 119 또는 응급실",
    ],
    department: "응급의학과·안과·이비인후과",
  },
  {
    id: "heat-cold",
    label: "온열·한랭손상",
    chapter: "환경손상",
    icon: "🌡️",
    sourceIds: ["moe-2025", "nfa-heat", "nfa-cold"],
    checkFlags: [
      { id: "heatstroke", label: "고체온·의식저하·경련 또는 땀이 나지 않는 열사병 의심", tier: "emergency" },
      { id: "hypothermia", label: "저체온·의식저하·심한 떨림 또는 떨림 소실", tier: "emergency" },
      { id: "heat-exhaustion", label: "어지러움·두통·구역·다량 발한", tier: "quasi" },
      { id: "frostbite", label: "손발 저림·창백·통증·감각저하", tier: "quasi" },
    ],
    careSteps: [
      "온열손상은 즉시 시원한 곳으로 옮기고 더운 옷·장비를 제거",
      "부채, 선풍기, 얼음팩, 젖은 수건으로 체온을 낮춤",
      "의식이 명료하고 구토가 없으면 물이나 이온음료를 조금씩 마시게 함",
      "고체온·의식저하·경련이 있으면 구강섭취를 금지하고 119 신고",
      "한랭손상은 따뜻한 실내로 옮기고 젖거나 조이는 옷·장신구를 제거",
      "보온하되 손상 부위 마사지는 하지 않고 카페인 음료는 피함",
    ],
    department: "응급의학과·소아청소년과",
  },
]

export const LOCATIONS = [
  "교실",
  "운동장",
  "체육관",
  "화장실",
  "급식실",
  "복도",
  "과학실",
  "보건실",
  "통학로",
  "기타",
]

export const ACTIONS_TAKEN = [
  "현장 안전 확인",
  "119 신고",
  "보건교사 연락",
  "담임교사 연락",
  "보호자 연락",
  "AED 요청",
  "심폐소생술 시작",
  "직접 압박 지혈",
  "흐르는 물로 냉각/세척",
  "회복자세",
  "활력징후 확인",
  "관리자 보고",
]

export function getCategory(id: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.id === id)
}

export function getSources(ids: string[]): SourceRef[] {
  const required = new Set(["moe-2025", "sen-2024", ...ids])
  return OFFICIAL_SOURCES.filter((source) => required.has(source.id))
}
