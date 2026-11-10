# Amamara Android app

The native app is a **Capacitor shell** that opens the **studio only** (`/app`), never the marketing site.

- **App ID:** `com.amamara.studio`
- **Name:** Amamara
- **Splash / status bar:** brand red `#C4102E` + white mark (no Capacitor branding)
- **Home screen icon:** white logo on red background (`resources/icon.png`)

## One-time setup (your machine)

Requirements: Node 20+, Android Studio (SDK 34+), Java 17+.

```bash
npm install
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/splash-screen @capacitor/status-bar @capacitor/app
npx cap add android
npx @capacitor/assets generate --android
npx cap sync android
npx cap open android
```

In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

Copy the release APK to:

```text
public/downloads/amamara.apk
```

Commit or upload that file so **Download the app** on the marketing site works.

## Production URL

`capacitor.config.ts` points at:

```text
https://amamaza.vercel.app/app
```

Change that host if your production domain changes, then `npx cap sync android` and ship a new store build.

## Updates

| Change | How users get it |
|--------|------------------|
| UI, copy, studio features | Deploy the website — app loads remote `/app` |
| Icon, splash, plugins | New APK + Play Store (or replace `public/downloads/amamara.apk`) |

## Play Store

1. Create app with package `com.amamara.studio`
2. Upload AAB from Android Studio
3. Set `PLAY_STORE_URL` in `src/lib/native.ts`
