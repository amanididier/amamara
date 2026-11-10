import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Amamara native shell (Android / iOS).
 * Loads the live studio at /app — never the marketing landing page.
 * Product updates ship via web deploy; native rebuild only for plugins/icons.
 */
const PRODUCTION_STUDIO_URL = "https://amamaza.vercel.app/app";

const config: CapacitorConfig = {
  appId: "com.amamara.studio",
  appName: "Amamara",
  webDir: "dist/client",
  // Remote URL mode: app opens the studio directly (no Capacitor logo, no marketing site).
  server: {
    url: PRODUCTION_STUDIO_URL,
    cleartext: false,
    allowNavigation: [
      "amamaza.vercel.app",
      "www.amamaza.vercel.app",
      "*.vercel.app",
    ],
  },
  plugins: {
    SplashScreen: {
      // Branded splash — red background, no spinner, no Capacitor branding
      launchShowDuration: 400,
      launchAutoHide: true,
      backgroundColor: "#C4102E",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#C4102E",
    },
  },
  android: {
    backgroundColor: "#C4102E",
    allowMixedContent: false,
  },
  ios: {
    backgroundColor: "#C4102E",
    contentInset: "automatic",
  },
};

export default config;
