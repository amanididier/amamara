import { describe, it, expect } from "vitest";
import { BRIEF_STEPS, isBriefStepValid } from "./creation-brief";
import type { Brief } from "./ad-skills";
const brief: Brief = {
  type: "flyer",
  businessName: "Keza",
  description: "Advertise our new products",
  goal: "promo",
  category: "shop",
  area: "Kigali",
  contact: "",
  headline: "New products",
  cta: "Visit us",
  adLanguage: "Kinyarwanda",
  style: "premium",
  ratio: "4:5",
  period: "This weekend",
};
describe("Seven-question brief", () => {
  it("has exactly seven question steps", () => expect(BRIEF_STEPS).toBe(7));
  it("requires the promotion offer", () => {
    expect(isBriefStepValid(1, brief)).toBe(false);
    expect(isBriefStepValid(1, { ...brief, discount: "20%" })).toBe(true);
  });
  it("requires the new location for a relocation", () => {
    expect(isBriefStepValid(1, { ...brief, goal: "moved" })).toBe(false);
    expect(isBriefStepValid(1, { ...brief, goal: "moved", newLocation: "Kimironko" })).toBe(true);
  });
  it("requires business name, business type and work area", () => {
    expect(isBriefStepValid(2, brief)).toBe(true);
    expect(isBriefStepValid(2, { ...brief, area: "" })).toBe(false);
  });
  it("requires a video style for videos", () => {
    expect(isBriefStepValid(4, { ...brief, type: "video" })).toBe(false);
    expect(isBriefStepValid(4, { ...brief, type: "video", videoStyle: "ugc" })).toBe(true);
  });
  it("rejects premium durations in self-service", () => {
    expect(isBriefStepValid(5, { ...brief, type: "video", duration: 30 })).toBe(false);
    expect(isBriefStepValid(5, { ...brief, type: "video", duration: 60 })).toBe(false);
    expect(isBriefStepValid(5, { ...brief, type: "video", duration: 15 })).toBe(true);
  });
});
