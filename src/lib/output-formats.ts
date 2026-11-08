/** Output presets per ad type. Social = pixels; print = physical size with bleed at 150 DPI (large-format vinyl). */
export type OutputFormat = { id: string; rw: string; en: string; ratio: string; spec: string };

export const PRINT_DPI = 150;
export const BLEED_CM = 2;

function printSpec(wCm: number, hCm: number) {
  const px = (cm: number) => Math.round(((cm + BLEED_CM * 2) / 2.54) * PRINT_DPI);
  return `PDF + TIFF · ${wCm}×${hCm} cm + ${BLEED_CM} cm bleed · ${px(wCm)}×${px(hCm)} px @${PRINT_DPI} DPI · CMYK`;
}

export const outputFormats: Record<"flyer" | "video" | "banner", OutputFormat[]> = {
  flyer: [
    { id: "4:5", rw: "Instagram / Facebook post", en: "Instagram / Facebook post", ratio: "4:5", spec: "PNG · 1080×1350" },
    { id: "1:1", rw: "Post kare", en: "Square post", ratio: "1:1", spec: "PNG · 1080×1080" },
    { id: "9:16", rw: "Story / Status WhatsApp", en: "Story / WhatsApp status", ratio: "9:16", spec: "PNG · 1080×1920" },
    { id: "a4", rw: "Flyer yo gucapa A4", en: "Printed A4 flyer", ratio: "1:1.414", spec: "PDF · 210×297 mm + 3 mm bleed · 300 DPI" },
  ],
  video: [
    { id: "9:16", rw: "Reels / TikTok / Status", en: "Reels / TikTok / Status", ratio: "9:16", spec: "MP4 H.264 · 1080×1920" },
    { id: "4:5", rw: "Video ya feed", en: "Feed video", ratio: "4:5", spec: "MP4 H.264 · 1080×1350" },
    { id: "1:1", rw: "Video kare", en: "Square video", ratio: "1:1", spec: "MP4 H.264 · 1080×1080" },
    { id: "16:9", rw: "YouTube / TV", en: "YouTube / TV", ratio: "16:9", spec: "MP4 H.264 · 1920×1080" },
  ],
  banner: [
    { id: "300x100", rw: "Icyapa cy'iduka 3m × 1m", en: "Shop banner 3m × 1m", ratio: "3:1", spec: printSpec(300, 100) },
    { id: "200x100", rw: "Icyapa 2m × 1m", en: "Banner 2m × 1m", ratio: "2:1", spec: printSpec(200, 100) },
    { id: "85x200", rw: "Roll-up 85 × 200 cm", en: "Pull-up 85 × 200 cm", ratio: "1:2.35", spec: printSpec(85, 200) },
    { id: "150x100", rw: "Icyapa 1.5m × 1m", en: "Banner 1.5m × 1m", ratio: "3:2", spec: printSpec(150, 100) },
  ],
};

export function findFormat(type: keyof typeof outputFormats, id: string) {
  return outputFormats[type].find((f) => f.id === id) ?? outputFormats[type][0];
}
