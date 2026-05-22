/**
 * 교육부 「학교 응급상황 대응 가이드라인」(2025) 제2장 상황별 응급처치 기반
 */

export type CheckFlag = {
  id: string
  label: string
  /** 가이드라인 3C Check 시 V(응급) 해당 */
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
  quasiNote?: string
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: "cardiac-arrest",
    label: "심장정지",
    chapter: "제2장 Ⅰ",
    icon: "❤️",
    checkFlags: [
      { id: "unconscious", label: "무의식·무반응", tier: "emergency" },
      { id: "no-breath", label: "무호흡·심장정지 호흡(헐떡임)", tier: "emergency" },
      { id: "no-pulse", label: "맥박 없음", tier: "emergency" },
    ],
    careSteps: [
      "현장 안전 확인",
      "119 신고 및 AED 요청",
      "가슴압박 100~120회/분, 5cm 깊이(소아·학령기는 4~5cm)",
      "보건교사: 가슴압박:인공호흡 30:2, 2분마다 역할 교대",
      "AED 도착 시 패드 부착·제세동 후 즉시 심폐소생술 재개",
      "119 구급대 도착 시 상황 인계",
    ],
    department: "응급실 · 심혈관/소아응급",
  },
  {
    id: "choking",
    label: "기도폐쇄(질식)",
    chapter: "제2장 Ⅱ",
    icon: "😮",
    checkFlags: [
      { id: "cannot-speak", label: "말·기침 불가, V자 손짓", tier: "emergency" },
      { id: "cyanosis", label: "청색증·의식저하", tier: "emergency" },
      { id: "partial", label: "거친 기침·말로 반응(부분 폐쇄)", tier: "quasi" },
    ],
    careSteps: [
      "부분 폐쇄: 자발적 기침 유도, 지켜봄",
      "완전 폐쇄: 등 두드리기 5회 → 복부 밀어내기(하임리히) 5회 반복",
      "임산부·고도비만: 가슴 밀어내기",
      "의식 잃으면 즉시 심폐소생술, 입안 이물 보일 때만 제거",
    ],
    department: "응급실 · 이비인후과/소아응급",
  },
  {
    id: "consciousness",
    label: "실신·의식장애",
    chapter: "제2장 Ⅲ",
    icon: "😵",
    checkFlags: [
      { id: "unresponsive", label: "불러도 눈 뜨지 못함·의식 없음", tier: "emergency" },
      { id: "confused", label: "횡설수설·의식 명료하지 않음", tier: "emergency" },
      { id: "head-injury", label: "두부 손상·구토·의식변화", tier: "emergency" },
      { id: "seizure-now", label: "경련 중", tier: "emergency" },
      { id: "dizzy", label: "어지러움·쓰러질 것 같음(의식 있음)", tier: "quasi" },
    ],
    careSteps: [
      "기도 유지(머리 기울임-턱 들어올리기, 척추 손상 의심 시 주의)",
      "호흡·맥박 없으면 심폐소생술",
      "회복자세(안정적인 옆으로), 보온",
      "의식 있어도 바로 일으키지 않음, 꽉 조이는 옷 풀기",
      "활력징후·혈당 측정(보건교사)",
    ],
    department: "응급실 · 신경과/소아응급",
  },
  {
    id: "hyperventilation",
    label: "과호흡",
    chapter: "제2장 Ⅳ",
    icon: "💨",
    checkFlags: [
      { id: "tachypnea", label: "분당 20회 이상 가쁜 호흡", tier: "emergency" },
      { id: "cyanosis-pale", label: "입술 청색·창백", tier: "emergency" },
      { id: "collapse", label: "비틀거리며 쓰러짐", tier: "emergency" },
      { id: "chest-pain", label: "실신·가슴통증", tier: "emergency" },
      { id: "anxiety", label: "불안·손발 저림(일시적)", tier: "quasi" },
    ],
    careSteps: [
      "편안한 환경 조성, 옷·넥타이 느슨하게",
      "7-11 호흡법(7초 들이마시고 11초 내쉬기) 안내",
      "종이봉투 재호흡은 저산소 위험 — 권장하지 않음",
      "천천히 호흡 유도하며 상태 관찰",
    ],
    department: "필요 시 응급실 · 소아과/정신건강의학",
  },
  {
    id: "asthma-anaphylaxis",
    label: "천식·아나필락시스",
    chapter: "제2장 Ⅴ",
    icon: "🫁",
    checkFlags: [
      { id: "severe-breath", label: "심한 호흡곤란·말하기 힘듦", tier: "emergency" },
      { id: "cyanosis", label: "입술·손끝 청색·의식 저하", tier: "emergency" },
      { id: "facial-swelling", label: "얼굴·입술 부종(호전 없음)", tier: "emergency" },
      { id: "no-relief", label: "기관지확장제 3회 후에도 호전 없음", tier: "emergency" },
      { id: "wheeze", label: "쌕쌕거림·가슴 답답(경·중등도)", tier: "quasi" },
      { id: "hives", label: "두드러기·가려움(호흡곤란 없음)", tier: "quasi" },
    ],
    careSteps: [
      "편안히 앉히고 옷 단추 풀기",
      "소지 시 기관지확장제 1~2puff 흡입(스페이서 있으면 사용)",
      "20분 후 재평가, 3회 후에도 호전 없으면 119",
      "아나필락시스: 알레르기 원인 제거, 에피네프린 자가주사(처방·동의 학생)",
      "다리 올린 쇼크 자세, 2차 반응 대비 신속 이송",
    ],
    department: "응급실 · 소아응급/알레르기",
    quasiNote: "에피네프린·글루카곤은 학교보건법 제15조의2(사전 동의·의사 자문)",
  },
  {
    id: "bleeding",
    label: "출혈·상처",
    chapter: "제2장 Ⅵ",
    icon: "🩸",
    checkFlags: [
      { id: "uncontrolled", label: "지혈 안 됨·심한 출혈", tier: "emergency" },
      { id: "shock", label: "출혈 쇼크(창백·의식변화)", tier: "emergency" },
      { id: "internal", label: "외상 없는 어지러움·구토·의식변화", tier: "emergency" },
      { id: "minor-cut", label: "작은 상처·코피(지혈 가능)", tier: "routine" },
    ],
    careSteps: [
      "흐르는 물로 상처 세척",
      "깨끗한 거즈로 직접 압박 지혈(10분 이상)",
      "심한 출혈: 압박 유지·거상·쇼크 자세(다리 15~25cm 올림)",
      "이물 제거하지 않고 덧대어 압박",
      "드레싱·붕대, 파상풍 예방 안내",
    ],
    department: "응급실 · 외과/소아외과",
  },
  {
    id: "burn",
    label: "화상",
    chapter: "제2장 Ⅶ",
    icon: "🔥",
    checkFlags: [
      { id: "major-burn", label: "2도 이상·넓은 화상", tier: "emergency" },
      { id: "chemical-electric", label: "화학·전기 화상", tier: "emergency" },
      { id: "blister", label: "발적·물집·통증(1~2도)", tier: "quasi" },
    ],
    careSteps: [
      "뜨거운 옷은 벗기지 말고 가위로 제거",
      "흐르는 찬물 20분 이상(얼음 직접 대지 않음)",
      "수포 터뜨리지 않음",
      "기름·된장·치약 등 민간요법 금지",
      "깨끗한 붕대로 감싸 이송",
    ],
    department: "응급실 · 화상전문/소아응급",
  },
  {
    id: "diabetes",
    label: "당뇨(저·고혈당)",
    chapter: "제2장 Ⅷ",
    icon: "🩺",
    checkFlags: [
      { id: "low-shock", label: "저혈당 쇼크(의식변화·경련)", tier: "emergency" },
      { id: "high-keto", label: "고혈당 응급(과호흡·의식변화)", tier: "emergency" },
      { id: "low-mild", label: "저혈당 의심(식은땀·떨림, 의식 있음)", tier: "quasi" },
      { id: "high-mild", label: "고혈당(갈증·다뇨, 의식 명료)", tier: "quasi" },
    ],
    careSteps: [
      "혈당 측정",
      "저혈당·의식 있음: 단순당 15g(주스 1/2컵, 사탕 3알 등) → 15분 후 재측정",
      "의식 없음: 경구 금지, 글루카곤(처방·동의)·119",
      "고혈당: 인슐린 자가투여 확인, 의식 없으면 기도 유지·119",
    ],
    department: "응급실 · 소아내분비/응급",
  },
  {
    id: "seizure",
    label: "경련(발작)",
    chapter: "제2장 Ⅸ",
    icon: "⚡",
    checkFlags: [
      { id: "active", label: "경련 중", tier: "emergency" },
      { id: "over-5min", label: "5분 이상 지속·의식 미회복", tier: "emergency" },
      { id: "first-time", label: "처음 경련·열성 경련", tier: "quasi" },
    ],
    careSteps: [
      "주변 위험물 제거, 머리 아래 수건",
      "옆으로 눕혀 기도 확보, 옷·허리띠 풀기",
      "경련 중 억지로 누르거나 입에 손가락 넣지 않음",
      "시작 시간·양상 기록(가능하면 영상)",
      "회복 후 완전히 깨어날 때까지 곁에서 지켜봄",
    ],
    department: "응급실 · 소아신경/소아응급",
  },
  {
    id: "sting-foreign",
    label: "곤충·이물",
    chapter: "제2장 Ⅹ",
    icon: "🐝",
    checkFlags: [
      { id: "anaphylaxis-sting", label: "전신 두드러기·호흡곤란(벌 등)", tier: "emergency" },
      { id: "snake", label: "뱀에 물림", tier: "emergency" },
      { id: "local-sting", label: "국소 통증·부종", tier: "quasi" },
      { id: "eye-foreign", label: "눈 이물", tier: "quasi" },
    ],
    careSteps: [
      "벌침: 카드로 밀어 제거(집어당기지 않음)",
      "비누로 세척, 냉찜질(뱀 교상 제외)",
      "항히스타민·병원 진료 안내(동물 교상)",
      "뱀: 움직임 최소·심장보다 낮게·15분 이내 10cm 위 압박·냉찜질 금지",
    ],
    department: "응급실 · 이비인후과/안과",
  },
  {
    id: "fracture",
    label: "골절·염좌·탈구",
    chapter: "제2장 ⅩⅠ",
    icon: "🦴",
    checkFlags: [
      { id: "open-fracture", label: "개방성·다발성 골절", tier: "emergency" },
      { id: "amputation", label: "절단·사지 훼손", tier: "emergency" },
      { id: "deformity", label: "통증·움직임 제한·변형", tier: "quasi" },
      { id: "sprain", label: "염좌·부종(변형 없음)", tier: "routine" },
    ],
    careSteps: [
      "RICE: 안정·냉찜질·압박·거상",
      "골절·탈구: 정복 시도 금지, 부목으로 고정",
      "개방 상처 드레싱 후 부목",
      "절단: 직접 압박·절단부 생리식염수·밀폐용기(얼음 직접 닿지 않게)",
    ],
    department: "응급실 · 정형외과/소아외과",
  },
  {
    id: "pain",
    label: "통증(두·흉·복)",
    chapter: "제2장 ⅩⅡ",
    icon: "🤕",
    checkFlags: [
      { id: "head-trauma", label: "두부 손상·의식변화 동반 두통", tier: "emergency" },
      { id: "chest-pain", label: "갑작스럽고 지속되는 흉통", tier: "emergency" },
      { id: "acute-abdomen", label: "발열·복부팽만·복부강직", tier: "emergency" },
      { id: "mild-pain", label: "경미·호전되는 통증", tier: "routine" },
    ],
    careSteps: [
      "조용한 실내에서 안정, 활력징후 측정",
      "흉통: 반좌위, 옷 느슨하게, 재평가",
      "복통: 무릎 구부림·금식 검토, 염증·출혈 시 복부 마사지·온찜질 금지",
      "두통: 자극 최소화, 충분한 휴식",
    ],
    department: "응급실 또는 소아과(증상별)",
  },
  {
    id: "overdose",
    label: "약물 중독·오남용",
    chapter: "제2장 ⅩⅢ",
    icon: "💊",
    checkFlags: [
      { id: "altered", label: "의식·호흡 변화", tier: "emergency" },
      { id: "suspect", label: "중독 의심 징후", tier: "quasi" },
    ],
    careSteps: [
      "의식·호흡 없으면 기도 유지·심폐소생술·119",
      "중독 약물·용량 확인 후 이송 시 정보 제공",
      "학부모·전문기관 연계(청소년 중독은 신속 악화)",
    ],
    department: "응급실 · 독극물/소아응급",
  },
  {
    id: "facial",
    label: "안면손상·코피",
    chapter: "제2장 ⅩⅣ",
    icon: "👁️",
    checkFlags: [
      { id: "vision", label: "시력 변화·안구 함몰", tier: "emergency" },
      { id: "severe-epistaxis", label: "멈추지 않는 코피·기도 위협", tier: "emergency" },
      { id: "eye-trauma", label: "눈 타박상·복시", tier: "quasi" },
      { id: "nosebleed", label: "지혈 가능한 코피", tier: "routine" },
    ],
    careSteps: [
      "눈: 비비지 않게, 양쪽 안대(압박 금지), 코 풀기 금지",
      "코피: 앉히고 고개 숙임, 콧앞 10분 압박, 피 삼키지 말고 뱉기",
      "30분 이상 지속·후방출혈 의심 시 병원",
    ],
    department: "응급실 · 안과/이비인후과",
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
  "기타",
]

export const ACTIONS_TAKEN = [
  "현장 안전 확인",
  "119 신고",
  "보건교사 연락",
  "AED 적용",
  "심폐소생술",
  "직접 압박 지혈",
  "상처 소독·드레싱",
  "냉찜질",
  "회복자세",
  "학부모 연락",
  "담임·교무 보고",
]

export function getCategory(id: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.id === id)
}
