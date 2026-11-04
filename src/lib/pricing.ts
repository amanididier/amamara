import { pricing } from "@/config/site";

export type AdType = "video" | "flyer" | "banner" | "template";
export type Quality = keyof typeof pricing.quality;

export interface EstimateInput {
  type: AdType;
  durationSec: number;
  quality: Quality;
}

export interface EstimateLine {
  labelRw: string;
  labelEn: string;
  amount: number;
}

/** Estimated (not final) price in RWF, rounded to the nearest 100. */
export function estimatePrice({ type, durationSec, quality }: EstimateInput) {
  const lines: EstimateLine[] = [
    { labelRw: "Igiciro fatizo", labelEn: "Base price", amount: pricing.base[type] },
  ];
  if (type === "video") {
    lines.push({
      labelRw: `Igihe (${durationSec}s)`,
      labelEn: `Duration (${durationSec}s)`,
      amount: durationSec * pricing.perVideoSecond,
    });
  }
  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const mult = pricing.quality[quality];
  if (mult !== 1) {
    lines.push({
      labelRw: "Ubwiza bwisumbuye",
      labelEn: "Higher quality",
      amount: Math.round(subtotal * (mult - 1)),
    });
  }
  const total = Math.round((subtotal * mult) / 100) * 100;
  return { lines, total };
}

export function formatRWF(n: number) {
  return `${n.toLocaleString("en-US")} RWF`;
}

/** MTN merchant fees are contract-dependent; do not add an unapproved customer surcharge. */
export const MOMO_FEE_RATE = 0;
export function paymentTotal(price: number, _method: "mtn" | "card") {
  return { price, fee: 0, total: price };
}
