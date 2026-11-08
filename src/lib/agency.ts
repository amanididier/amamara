import { z } from "zod";

export const videoTypes = [
  { id: "ugc", rw: "Umuntu wamamaza", en: "UGC / Presenter" },
  { id: "product", rw: "Igicuruzwa", en: "Product shots" },
  { id: "cinematic", rw: "Kwamamaza nka filime", en: "TV commercial" },
] as const;
export const durations = [
  { seconds: 10, rw: "Itangazo rigufi", en: "Quick Ad", pro: false },
  { seconds: 15, rw: "Itangazo risanzwe", en: "Standard Ad", pro: false },
  { seconds: 30, rw: "Itangazo ryisumbuye", en: "Premium Ad", pro: true },
  { seconds: 60, rw: "Ubukangurambaga", en: "Extended Campaign", pro: true },
] as const;
export function isSelfServiceDuration(seconds: number) { return seconds === 10 || seconds === 15; }
export const leadStatuses = ["new", "awaiting_contact", "contacted", "in_consultation", "quoted", "in_production", "completed", "cancelled"] as const;
const text = z.string().trim().min(1).max(4000);
export const consultationSchema = z.object({
  customerName: text.max(150), adType: z.enum(["ugc", "product", "cinematic", "flyer", "banner", "other"]),
  duration: z.union([z.literal(10), z.literal(15), z.literal(30), z.literal(60)]),
  business: text, objective: text, audience: text, message: text, scenes: text, style: text,
  platforms: z.array(z.string().max(60)).min(1).max(10), deadline: text.max(100),
  instructions: z.string().max(4000), references: z.string().max(2000),
  contactMethod: z.enum(["phone", "whatsapp", "email", "instagram"]), contactDetail: text.max(200),
}).superRefine((v, ctx) => {
  const valid = v.contactMethod === "email" ? z.string().email().safeParse(v.contactDetail).success
    : v.contactMethod === "instagram" ? /^@?[a-zA-Z0-9_.]{1,30}$/.test(v.contactDetail)
    : /^\+?[0-9 ()-]{8,25}$/.test(v.contactDetail);
  if (!valid) ctx.addIssue({ code: "custom", path: ["contactDetail"], message: "Enter valid contact details for your selected channel." });
});
export type Consultation = z.infer<typeof consultationSchema>;
export function creativeBrief(v: Consultation) {
  return `# Amamaza creative brief\n\n## Customer\n${v.customerName}\n${v.contactMethod}: ${v.contactDetail}\n\n## Campaign\nBusiness: ${v.business}\nObjective: ${v.objective}\nAudience: ${v.audience}\nFormat: ${v.adType} / ${v.duration}s\nKey message: ${v.message}\nScenes and features: ${v.scenes}\nVisual style: ${v.style}\nPlatforms: ${v.platforms.join(", ")}\nDeadline: ${v.deadline}\n\n## Additional direction\n${v.instructions || "Not supplied"}\n\n## References\n${v.references || "Not supplied"}`;
}
const positive = z.number().finite().nonnegative();
export const settingsSchema = z.object({
  exchangeRate: z.number().positive(), margin: positive.max(0.95), paymentFixedRwf: positive,
  paymentRate: positive.max(0.5), infrastructureRwf: positive, productionRwf: positive, allowanceRwf: positive,
  models: z.object(Object.fromEntries(videoTypes.map(v => [v.id, z.object({ name: text.max(100), resolution: text.max(100), endpoint: z.string().max(200), cost10: positive, cost15: positive, sound10: positive, sound15: positive })])) as Record<"ugc" | "product" | "cinematic", z.ZodObject<{ name: z.ZodString; resolution: z.ZodString; endpoint: z.ZodString; cost10: z.ZodNumber; cost15: z.ZodNumber; sound10: z.ZodNumber; sound15: z.ZodNumber }>>),
  overrides: z.record(positive),
  contacts: z.object({ phone: z.string().max(30), whatsapp: z.string().max(30), email: z.union([z.string().email(), z.literal("")]), instagram: z.union([z.string().url().refine(v => { try { const u = new URL(v); return u.protocol === "https:" && ["instagram.com", "www.instagram.com"].includes(u.hostname); } catch { return false; } }), z.literal("")]) }),
}).refine(v => v.margin + v.paymentRate < 1, "Margin and payment fee must total less than 100%")
  .refine(v => v.models.ugc.name === "MiniMax H3" && v.models.product.name === "Kling 3.0 Standard" && v.models.cinematic.name === "Seedance 2.0", "The production model lineup is locked")
  .refine(v => Object.values(v.overrides).every(price => price > 0), "Manual prices must be positive");
export type AgencySettings = z.infer<typeof settingsSchema>;
export type Contacts = AgencySettings["contacts"];
export function contactAction(method: Consultation["contactMethod"], contacts: Contacts, reference: string) {
  const message = `Hello Amamaza, I would like to discuss creative brief ${reference}.`;
  if (method === "whatsapp" && /^\+?\d{8,15}$/.test(contacts.whatsapp)) return `https://wa.me/${contacts.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  if (method === "phone" && /^\+?\d{8,15}$/.test(contacts.phone)) return `tel:${contacts.phone}`;
  if (method === "email" && contacts.email) return `mailto:${contacts.email}?subject=${encodeURIComponent(`Creative consultation ${reference}`)}&body=${encodeURIComponent(message)}`;
  if (method === "instagram" && contacts.instagram) return contacts.instagram;
  return null;
}