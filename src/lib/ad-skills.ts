/**
 * Amamaza creative "skills": expert rules turned into prompt blocks that we send to
 * the image/video provider (Higgsfield, Nano Banana, GPT Image...). A normal user typing
 * into a provider directly doesn't get these — this is our quality edge.
 */
import type { AdType } from "@/lib/pricing";

export interface Brief {
  type: AdType;
  businessName: string;
  description: string;
  goal: string;
  discount?: string;
  newLocation?: string;
  category: string;
  area: string;
  contact: string;
  headline: string;
  cta: string;
  adLanguage: string;
  style: string;
  videoStyle?: string;
  duration?: number;
  ratio: string;
  period: string;
}

export const goals = [
  { id: "promo", rw: "Promosiyo / igabanuka", en: "Promotion / discount", emoji: "🏷️" },
  { id: "new-product", rw: "Igicuruzwa gishya", en: "New product", emoji: "✨" },
  { id: "moved", rw: "Twimukiye ahandi", en: "We moved location", emoji: "📍" },
  { id: "opening", rw: "Gufungura bushya", en: "Grand opening", emoji: "🎉" },
  { id: "event", rw: "Igikorwa / ibirori", en: "Event", emoji: "🎤" },
  { id: "hiring", rw: "Turashaka abakozi", en: "We're hiring", emoji: "🤝" },
  { id: "holiday", rw: "Iminsi mikuru", en: "Holiday season", emoji: "🎄" },
  { id: "awareness", rw: "Kumenyekanisha izina", en: "Brand awareness", emoji: "📣" },
] as const;

export const categories = [
  { id: "restaurant", rw: "Resitora / Cafe", en: "Restaurant / Cafe", emoji: "🍽️" },
  { id: "salon", rw: "Salon / Ubwiza", en: "Salon / Beauty", emoji: "💇🏾" },
  { id: "fashion", rw: "Imyenda / Inkweto", en: "Fashion / Shoes", emoji: "👗" },
  { id: "electronics", rw: "Telefoni / Ikoranabuhanga", en: "Phones / Electronics", emoji: "📱" },
  { id: "pharmacy", rw: "Farumasi / Ubuzima", en: "Pharmacy / Health", emoji: "💊" },
  { id: "hardware", rw: "Ibikoresho by'ubwubatsi", en: "Hardware", emoji: "🧱" },
  { id: "shop", rw: "Alimentation / Supermarket", en: "Grocery / Supermarket", emoji: "🛒" },
  { id: "services", rw: "Serivisi", en: "Services", emoji: "🧰" },
] as const;

export const imageStyles = [
  { id: "premium", rw: "Igezweho & Ihenze", en: "Modern & Premium" },
  { id: "energetic", rw: "Amabara & Imbaraga", en: "Bold & Colorful" },
  { id: "minimal", rw: "Yoroheje & Nziza", en: "Clean & Minimal" },
  { id: "luxury", rw: "Iy'akataraboneka", en: "Luxury" },
  { id: "cultural", rw: "Gakondo (Imigongo)", en: "Rwandan cultural" },
  { id: "street", rw: "Iy'umuhanda", en: "Street & Market" },
] as const;

export const videoStyles = [
  { id: "ugc", rw: "Umuntu uvuga ku gicuruzwa", en: "Person talking (UGC)" },
  { id: "product", rw: "Igicuruzwa kizunguruka", en: "Product showcase" },
  { id: "cinematic", rw: "Nka filime", en: "Cinematic story" },
  { id: "motion-text", rw: "Inyandiko zigenda", en: "Animated text promo" },
  { id: "slideshow", rw: "Amafoto akurikirana", en: "Photo slideshow" },
] as const;

/** Style most users of this category pick — shown as the "Most picked" badge. */
export function suggestStyle(category: string, type: AdType): string {
  if (type === "video") {
    return ({ restaurant: "product", salon: "ugc", fashion: "cinematic", electronics: "product" } as Record<string, string>)[category] ?? "motion-text";
  }
  return ({
    restaurant: "energetic", salon: "luxury", fashion: "premium", electronics: "premium",
    pharmacy: "minimal", hardware: "street", shop: "energetic", services: "minimal",
  } as Record<string, string>)[category] ?? "premium";
}

const STYLE_SKILL: Record<string, string> = {
  premium: "Modern premium commercial look: soft studio key light with rim light, deep shadows, glossy reflections, generous negative space, restrained 2-3 color palette.",
  energetic: "Bold energetic retail look: saturated complementary colors, dynamic diagonal composition, sticker-like price burst, high contrast, playful depth.",
  minimal: "Clean minimal look: single hero subject, off-white or solid background, Swiss-grid typography, lots of whitespace, one accent color.",
  luxury: "Luxury look: dark rich background, gold or champagne accents, elegant serif headline, macro detail, cinematic low-key lighting.",
  cultural: "Rwandan cultural look: Imigongo geometric pattern accents in black, terracotta and white, warm natural light, proud authentic local people.",
  street: "Authentic street-market look: real Kigali shopfront context, daylight, honest textures, hand-painted-sign energy but legible modern type.",
};

const FORMAT_SKILL: Record<string, string> = {
  flyer: "SOCIAL POST SKILL: designed for a phone feed. Thumb-stopping focal point in the top 2/3, headline readable at 300px width, max 3 text blocks, CTA in a high-contrast pill at the bottom, logo small in a corner.",
  banner: "SHOP SIGNAGE SKILL: a printed storefront banner read from 10+ meters. Huge business name, max 7 words total besides contact, phone number very large, strong figure/ground contrast, keep 5% safe margin for printing, no tiny details.",
  template: "Reusable template layout with clear text zones.",
  video: "VIDEO KEYFRAME SKILL: cinematic hero frame for a short vertical ad; subject in sharp focus, motion-ready composition, space for a caption.",
};

const VIDEO_SKILL: Record<string, string> = {
  ugc: "Selfie-style handheld clip of a friendly local presenter holding the product, natural window light, hook in the first 2 seconds, jump cuts every 2-3s.",
  product: "Slow 360° orbit around the product on a clean plinth, macro push-ins on details, light sweeps, end card with logo and price.",
  cinematic: "3-shot mini story: problem -> product -> happy customer; shallow depth of field, anamorphic feel, warm grade.",
  "motion-text": "Kinetic typography over brand-color backgrounds and product cutouts, beat-synced cuts, bold sans-serif words.",
  slideshow: "Ken Burns pans across the user's photos, smooth crossfades, captions on each slide, logo end card.",
};

/** Turns the 7-step brief into the provider prompt. Exact user text is quoted so models render it verbatim. */
export function buildPrompt(b: Brief): string {
  const goal = goals.find((g) => g.id === b.goal)?.en ?? b.goal;
  const cat = categories.find((c) => c.id === b.category)?.en ?? b.category;
  const lines = [
    `Professional advertising ${b.type === "banner" ? "shop banner" : b.type === "video" ? "video" : "social media poster"} for "${b.businessName || "the business"}", a ${cat} in ${b.area || "Kigali"}, Rwanda.`,
    `Purpose: ${goal}.${b.discount ? ` Feature the offer "${b.discount}" as the biggest visual element after the product.` : ""}${b.newLocation ? ` Announce the new address: "${b.newLocation}".` : ""}`,
    `Client brief: ${b.description}`,
    b.period ? `Campaign period, display only as supplied: "${b.period}".` : "",
    b.headline ? `Headline text, render exactly: "${b.headline}".` : "",
    b.cta ? `Call to action text, render exactly: "${b.cta}".` : "",
    b.contact ? `Contact to display clearly: "${b.contact}".` : "",
    `All on-image text in ${b.adLanguage}. Spell every word exactly as given; no extra invented text.`,
    FORMAT_SKILL[b.type] ?? "",
    STYLE_SKILL[b.style] ?? "",
    b.type === "video" && b.videoStyle ? `Video direction (${b.duration ?? 15}s): ${VIDEO_SKILL[b.videoStyle]}` : "",
    `Aspect ratio ${b.ratio}. Real Rwandan people and settings when people appear. Photorealistic commercial quality, sharp, no watermarks, no distorted hands or text.`,
  ];
  return lines.filter(Boolean).join("\n");
}
