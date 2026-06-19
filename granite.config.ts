import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "hospital-guide-app",
  brand: {
    displayName: "병원 어디가?",
    primaryColor: "#fdf2f8",
    icon: "https://raw.githubusercontent.com/gamjabau1/hospital_guide_app/main/public/icon.svg",
  },
  web: {
    host: "localhost",
    port: 3000,
    commands: {
      dev: "next dev",
      build: "npm run build:web",
    },
  },
  permissions: [],
  outdir: "out",
});
