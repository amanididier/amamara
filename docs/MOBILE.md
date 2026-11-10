# Amamara Android app

Native shell in `mobile/android/` opens **studio only** (`https://amamaza.vercel.app/app`).

- Package: `com.amamara.studio`
- Splash / icon: brand red `#C4102E` + white mark (no Capacitor branding)

## Build on GitHub Actions (recommended)

Workflow: **`.github/workflows/android-apk.yml`**

### Run a build (any time)

1. GitHub repo → **Actions**
2. Left sidebar → **Android APK**
3. **Run workflow** → branch `main` → **Run workflow**
4. When green → open the run → **Artifacts** → download **`amamara-apk`**
5. Unzip → install `amamara.apk` on your phone

### Auto builds

Also runs when you push changes to:

- `mobile/android/**`
- `capacitor.config.ts`
- the workflow file itself

Website-only changes (hero, copy, studio UI) **do not** need a new APK — the app loads the live site.

### Version release (stable download URL)

```bash
git tag v1.0.0
git push origin v1.0.0
```

Actions attaches `amamara.apk` to the GitHub Release:

`https://github.com/amanididier/amamara/releases/latest/download/amamara.apk`

After the first tag, point marketing **Download the app** at that URL (or set `PLAY_STORE_URL` / release URL in `src/lib/native.ts`).

## Local build (optional)

```bash
cd mobile/android
gradle wrapper --gradle-version 8.2
./gradlew assembleDebug
# APK: app/build/outputs/apk/debug/app-debug.apk
```

Requires JDK 17 + Android SDK.
