import type { Brief } from "./ad-skills";

export const BRIEF_STEPS = 7;
export function isBriefStepValid(step: number, b: Brief): boolean {
  switch (step) {
    case 0:
      return b.description.trim().length >= 10;
    case 1:
      return (
        Boolean(b.goal) &&
        (b.goal !== "promo" || Boolean(b.discount?.trim())) &&
        (b.goal !== "moved" || Boolean(b.newLocation?.trim()))
      );
    case 2:
      return Boolean(b.businessName.trim() && b.category && b.area.trim());
    case 3:
      return Boolean(b.headline.trim() && b.cta.trim());
    case 4:
      return Boolean(b.type === "video" ? b.videoStyle : b.style);
    case 5:
      return Boolean(b.ratio && (b.type !== "video" || [10, 15, 20, 30].includes(b.duration ?? 0)));
    case 6:
      return Boolean(b.period.trim());
    default:
      return false;
  }
}
