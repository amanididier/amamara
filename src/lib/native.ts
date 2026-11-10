/** Detect Capacitor native shell vs browser. Safe on SSR. */

export function isNativeApp(): boolean {
  if (typeof window === "undefined") return false;
  const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return Boolean(cap?.isNativePlatform?.());
}

export function isAndroid(): boolean {
  if (typeof window === "undefined") return false;
  return /android/i.test(navigator.userAgent);
}

export function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/** Play Store / APK URL — set PLAY_STORE_URL after publishing */
export const ANDROID_APK_URL = "/downloads/amamara.apk";
export const PLAY_STORE_URL = ""; // e.g. https://play.google.com/store/apps/details?id=com.amamara.studio

export function getAndroidDownloadUrl(): string {
  if (PLAY_STORE_URL) return PLAY_STORE_URL;
  return ANDROID_APK_URL;
}
