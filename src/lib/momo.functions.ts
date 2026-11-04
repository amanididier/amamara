import { createServerFn } from "@tanstack/react-start";

/**
 * MTN MoMo Collection API (sandbox first). Needed secrets:
 * MOMO_SUBSCRIPTION_KEY, MOMO_API_USER, MOMO_API_KEY,
 * optional MOMO_TARGET_ENV (default "sandbox"), MOMO_BASE_URL (default sandbox URL),
 * MOMO_CURRENCY (sandbox only accepts "EUR"; live Rwanda uses "RWF").
 */
function cfg() {
  const sub = process.env["MOMO_SUBSCRIPTION_KEY"];
  const user = process.env["MOMO_API_USER"];
  const key = process.env["MOMO_API_KEY"];
  if (!sub || !user || !key) return null;
  const env = process.env["MOMO_TARGET_ENV"] ?? "sandbox";
  return {
    sub, user, key, env,
    base: process.env["MOMO_BASE_URL"] ?? "https://sandbox.momodeveloper.mtn.com",
    currency: process.env["MOMO_CURRENCY"] ?? (env === "sandbox" ? "EUR" : "RWF"),
  };
}

async function token(c: NonNullable<ReturnType<typeof cfg>>) {
  const r = await fetch(`${c.base}/collection/token/`, {
    method: "POST",
    headers: { Authorization: `Basic ${btoa(`${c.user}:${c.key}`)}`, "Ocp-Apim-Subscription-Key": c.sub },
  });
  if (!r.ok) throw new Error(`MoMo token failed (${r.status})`);
  return ((await r.json()) as { access_token: string }).access_token;
}

export const momoStatus = createServerFn({ method: "GET" }).handler(async () => ({ configured: !!cfg() }));

export const requestMomoPayment = createServerFn({ method: "POST" })
  .inputValidator((d: { phone: string; amount: number; fee: number; purpose: string }) => {
    const phone = String(d.phone).replace(/\D/g, "");
    if (!/^2507\d{8}$/.test(phone) && !/^07\d{8}$/.test(phone)) throw new Error("Invalid MTN number");
    const amount = Math.round(Number(d.amount));
    if (!(amount > 0 && amount < 5_000_000)) throw new Error("Invalid amount");
    return { phone: phone.startsWith("07") ? `25${phone}` : phone, amount, fee: Math.round(Number(d.fee) || 0), purpose: String(d.purpose).slice(0, 120) };
  })
  .handler(async ({ data }) => {
    const c = cfg();
    if (!c) return { ok: false as const, reason: "not_configured" as const };
    const ref = crypto.randomUUID();
    const r = await fetch(`${c.base}/collection/v1_0/requesttopay`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await token(c)}`,
        "X-Reference-Id": ref,
        "X-Target-Environment": c.env,
        "Ocp-Apim-Subscription-Key": c.sub,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: String(data.amount),
        currency: c.currency,
        externalId: ref.slice(0, 8),
        payer: { partyIdType: "MSISDN", partyId: data.phone },
        payerMessage: `Amamaza: ${data.purpose}`.slice(0, 160),
        payeeNote: "Amamaza",
      }),
    });
    if (r.status !== 202) return { ok: false as const, reason: "rejected" as const, status: r.status };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("momo_payments").insert({ reference_id: ref, phone: data.phone, amount: data.amount, fee: data.fee, purpose: data.purpose });
    return { ok: true as const, referenceId: ref };
  });

export const checkMomoPayment = createServerFn({ method: "POST" })
  .inputValidator((d: { referenceId: string }) => {
    if (!/^[0-9a-f-]{36}$/i.test(d.referenceId)) throw new Error("Bad reference");
    return d;
  })
  .handler(async ({ data }) => {
    const c = cfg();
    if (!c) return { status: "not_configured" };
    const r = await fetch(`${c.base}/collection/v1_0/requesttopay/${data.referenceId}`, {
      headers: { Authorization: `Bearer ${await token(c)}`, "X-Target-Environment": c.env, "Ocp-Apim-Subscription-Key": c.sub },
    });
    const j = (await r.json().catch(() => ({}))) as { status?: string };
    const status = (j.status ?? "PENDING").toLowerCase();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("momo_payments").update({ status, updated_at: new Date().toISOString() }).eq("reference_id", data.referenceId);
    return { status };
  });
