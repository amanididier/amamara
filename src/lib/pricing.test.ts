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

import { paymentTotal } from "./pricing";
describe("payment total", () => {
  it("matches the current server: no unapproved MTN surcharge", () => {
    expect(paymentTotal(10000, "mtn")).toEqual({ price: 10000, fee: 0, total: 10000 });
  });
  it("no MTN fee on card", () => {
    expect(paymentTotal(10000, "card").total).toBe(10000);
  });
});
