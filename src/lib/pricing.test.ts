import { describe, expect, it } from "vitest";
import { estimatePrice } from "./pricing";

describe("estimatePrice", () => {
  it("flyer standard costs just the base price", () => {
    expect(estimatePrice({ type: "flyer", durationSec: 0, quality: "standard" }).total).toBe(3000);
  });
  it("video adds per-second cost", () => {
    // 15000 + 15*800 = 27000
    expect(estimatePrice({ type: "video", durationSec: 15, quality: "standard" }).total).toBe(27000);
  });
  it("premium quality doubles the price", () => {
    expect(estimatePrice({ type: "banner", durationSec: 0, quality: "premium" }).total).toBe(10000);
  });
});
