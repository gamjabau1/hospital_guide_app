const fs = require("fs")
const path = require("path")
const sharp = require("sharp")

const outDir = path.join(process.cwd(), "public", "store-assets")
fs.mkdirSync(outDir, { recursive: true })

const keywords = [
  "병원",
  "병원찾기",
  "병원 어디가",
  "응급처치",
  "증상 확인",
  "증상별 병원",
  "진료과 참고",
  "내과",
  "소아과",
  "정형외과",
  "피부과",
  "이비인후과",
  "안과",
  "약국",
  "약국찾기",
  "네이버지도",
  "카카오지도",
  "응급실",
  "119",
  "건강",
  "진료 안내",
]

fs.writeFileSync(path.join(outDir, "app-search-keywords.txt"), keywords.join(", "), "utf8")

function logoSvg({ dark = false } = {}) {
  const bg = dark ? "#171925" : "#f7f8fb"
  const card = dark ? "#232639" : "#ffffff"
  const cardStroke = dark ? "#363a52" : "#e6e8ef"
  const primary = dark ? "#a7a4ff" : "#51459e"
  const primary2 = dark ? "#7dd7c8" : "#58b8a9"

  return `
  <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="22" stdDeviation="28" flood-color="#101828" flood-opacity="${dark ? "0.45" : "0.13"}"/>
      </filter>
      <linearGradient id="pin" x1="174" y1="126" x2="426" y2="416" gradientUnits="userSpaceOnUse">
        <stop stop-color="${primary}"/>
        <stop offset="1" stop-color="${primary2}"/>
      </linearGradient>
    </defs>
    <rect width="600" height="600" rx="136" fill="${bg}"/>
    <rect x="82" y="78" width="436" height="436" rx="124" fill="${card}" stroke="${cardStroke}" stroke-width="4" filter="url(#shadow)"/>
    <path d="M300 112C230 112 174 166 174 237c0 95 126 232 126 232s126-137 126-232c0-71-56-125-126-125z" fill="url(#pin)"/>
    <circle cx="300" cy="238" r="74" fill="${card}" opacity="0.98"/>
    <rect x="285" y="187" width="30" height="102" rx="15" fill="${primary}"/>
    <rect x="249" y="223" width="102" height="30" rx="15" fill="${primary}"/>
  </svg>`
}

function thumbnailSvg() {
  return `
  <svg width="1932" height="828" viewBox="0 0 1932 828" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="24" stdDeviation="34" flood-color="#101828" flood-opacity="0.12"/>
      </filter>
      <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#51459e"/>
        <stop offset="1" stop-color="#58b8a9"/>
      </linearGradient>
    </defs>
    <rect width="1932" height="828" fill="#f7f8fb"/>
    <circle cx="1540" cy="142" r="210" fill="#ecebff" opacity="0.8"/>
    <circle cx="306" cy="694" r="220" fill="#e9f7f5" opacity="0.88"/>

    <g transform="translate(180 126)">
      <text x="0" y="88" font-family="Gowun Dodum, Malgun Gothic, Arial, sans-serif" font-size="82" font-weight="700" fill="#1f2330">증상부터 병원까지</text>
      <text x="0" y="176" font-family="Gowun Dodum, Malgun Gothic, Arial, sans-serif" font-size="48" fill="#4f5667">응급처치 안내와 지도 검색을 한 번에</text>
      <g transform="translate(0 252)">
        <rect width="363" height="82" rx="41" fill="#51459e"/>
        <text x="181.5" y="54" text-anchor="middle" font-family="Gowun Dodum, Malgun Gothic, Arial, sans-serif" font-size="34" font-weight="700" fill="#fff">증상 확인</text>
      </g>
      <g transform="translate(391 252)">
        <rect width="363" height="82" rx="41" fill="#ffffff" stroke="#e1e4ec" stroke-width="3"/>
        <text x="181.5" y="54" text-anchor="middle" font-family="Gowun Dodum, Malgun Gothic, Arial, sans-serif" font-size="34" font-weight="700" fill="#51459e">지도 확인</text>
      </g>
      <g transform="translate(0 414)">
        <rect width="230" height="74" rx="37" fill="#ffffff" stroke="#e6e8ef" stroke-width="3"/>
        <text x="115" y="48" text-anchor="middle" font-family="Gowun Dodum, Malgun Gothic, Arial, sans-serif" font-size="28" fill="#2b3040">응급처치</text>
        <rect x="262" width="230" height="74" rx="37" fill="#ffffff" stroke="#e6e8ef" stroke-width="3"/>
        <text x="377" y="48" text-anchor="middle" font-family="Gowun Dodum, Malgun Gothic, Arial, sans-serif" font-size="28" fill="#2b3040">진료과 참고</text>
        <rect x="524" width="230" height="74" rx="37" fill="#ffffff" stroke="#e6e8ef" stroke-width="3"/>
        <text x="639" y="48" text-anchor="middle" font-family="Gowun Dodum, Malgun Gothic, Arial, sans-serif" font-size="28" fill="#2b3040">약국 찾기</text>
      </g>
    </g>

    <g transform="translate(1180 80)" filter="url(#soft)">
      <rect width="430" height="668" rx="64" fill="#ffffff"/>
      <rect x="38" y="42" width="354" height="96" rx="34" fill="#f3f4f8"/>
      <circle cx="84" cy="90" r="22" fill="url(#brand)"/>
      <text x="126" y="100" font-family="Gowun Dodum, Malgun Gothic, Arial, sans-serif" font-size="30" font-weight="700" fill="#202433">병원 어디가?</text>
      <rect x="38" y="172" width="354" height="140" rx="40" fill="#51459e"/>
      <text x="70" y="228" font-family="Gowun Dodum, Malgun Gothic, Arial, sans-serif" font-size="30" font-weight="700" fill="#ffffff">어디가 불편한가요?</text>
      <text x="70" y="270" font-family="Gowun Dodum, Malgun Gothic, Arial, sans-serif" font-size="22" fill="#dddafa">증상을 입력하면 안내해요</text>
      <rect x="38" y="344" width="354" height="72" rx="36" fill="#f7f8fb" stroke="#e6e8ef" stroke-width="2"/>
      <text x="74" y="390" font-family="Gowun Dodum, Malgun Gothic, Arial, sans-serif" font-size="24" fill="#767d8d">예: 열, 복통, 두통</text>
      <rect x="38" y="448" width="162" height="74" rx="28" fill="#f1f0ff"/>
      <text x="119" y="494" text-anchor="middle" font-family="Gowun Dodum, Malgun Gothic, Arial, sans-serif" font-size="22" fill="#40358d">진료과</text>
      <rect x="230" y="448" width="162" height="74" rx="28" fill="#eaf8f5"/>
      <text x="311" y="494" text-anchor="middle" font-family="Gowun Dodum, Malgun Gothic, Arial, sans-serif" font-size="22" fill="#267c72">약국</text>
      <rect x="38" y="554" width="354" height="72" rx="36" fill="#ffffff" stroke="#e6e8ef" stroke-width="2"/>
      <text x="215" y="600" text-anchor="middle" font-family="Gowun Dodum, Malgun Gothic, Arial, sans-serif" font-size="24" fill="#51459e">카카오지도 · 네이버지도</text>
    </g>
  </svg>`
}

async function writePng(name, svg) {
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, name))
}

async function main() {
  fs.writeFileSync(path.join(outDir, "app-logo-light.svg"), logoSvg({ dark: false }), "utf8")
  fs.writeFileSync(path.join(outDir, "app-logo-dark.svg"), logoSvg({ dark: true }), "utf8")
  fs.writeFileSync(path.join(outDir, "thumbnail.svg"), thumbnailSvg(), "utf8")
  await writePng("app-logo-light-600.png", logoSvg({ dark: false }))
  await writePng("app-logo-dark-600.png", logoSvg({ dark: true }))
  await writePng("thumbnail-1932x828.png", thumbnailSvg())
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
