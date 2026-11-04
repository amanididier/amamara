import { createClient } from "npm:@supabase/supabase-js@2";

function serviceKey(): string {
  const direct = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SECRET_KEY");
  if (direct) return direct;
  const raw = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (raw) {
    try {
      const keys = JSON.parse(raw) as Record<string, string>;
      const selected = keys.default || Object.values(keys)[0];
      if (selected) return Deno.env.get(selected) || selected;
    } catch { /* continue */ }
  }
  throw new Error("Supabase server secret is not configured.");
}
function adminClient() {
  const url = Deno.env.get("SUPABASE_URL");
  if (!url) throw new Error("SUPABASE_URL is missing.");
  return createClient(url, serviceKey(), { auth: { persistSession: false, autoRefreshToken: false } });
}
async function mtnCredentials() {
  const base = (Deno.env.get("MTN_BASE_URL") || "").replace(/\/+$/, "");
  const sub = Deno.env.get("MTN_COLLECTION_SUBSCRIPTION_KEY") || "";
  const user = Deno.env.get("MTN_API_USER") || "";
  const key = Deno.env.get("MTN_API_KEY") || "";
  const target = Deno.env.get("MTN_TARGET_ENVIRONMENT") || "";
  if (!base || !sub || !user || !key || target !== "mtnrwanda" || Deno.env.get("MTN_LIVE_ENABLED") !== "true") {
    throw new Error("Production MTN callback is not enabled.");
  }
  const response = await fetch(base + "/collection/token/", {
    method: "POST",
    headers: { Authorization: "Basic " + btoa(user + ":" + key), "Ocp-Apim-Subscription-Key": sub },
  });
  if (!response.ok) throw new Error("MTN authentication failed.");
  const token = (await response.json() as { access_token?: string }).access_token;
  if (!token) throw new Error("MTN access token missing.");
  return { base, sub, target, token };
}
Deno.serve(async (req: Request) => {
  if (req.method !== "POST" && req.method !== "PUT") return new Response("Method not allowed.", { status: 405 });
  try {
    const url = new URL(req.url);
    let referenceId = url.searchParams.get("reference_id") || "";
    if (!referenceId) {
      const body = await req.json().catch(() => ({})) as Record<string, unknown>;
      referenceId = String(body.externalId || body.external_id || body.referenceId || body.reference_id || "");
    }
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(referenceId)) return new Response("Invalid reference.", { status: 400 });

    const admin = adminClient();
    const { data: payment } = await admin.from("momo_payments")
      .select("reference_id,status,environment").eq("reference_id", referenceId).maybeSingle();
    if (!payment) return new Response("Payment not found.", { status: 404 });
    if (payment.environment !== "production") return new Response("Sandbox callbacks are disabled; use status polling.", { status: 202 });
    if (["successful", "failed", "rejected", "expired"].includes(payment.status)) return new Response("Already finalized.", { status: 200 });

    const config = await mtnCredentials();
    const statusResponse = await fetch(config.base + "/collection/v1_0/requesttopay/" + encodeURIComponent(referenceId), {
      headers: { Authorization: "Bearer " + config.token, "X-Target-Environment": config.target, "Ocp-Apim-Subscription-Key": config.sub },
    });
    if (!statusResponse.ok) return new Response("Could not verify with MTN.", { status: 502 });
    const statusData = await statusResponse.json() as { status?: string; financialTransactionId?: string };
    const { error } = await admin.rpc("finalize_momo_payment", {
      p_reference_id: referenceId,
      p_mtn_status: String(statusData.status || "PENDING").toUpperCase(),
      p_financial_transaction_id: statusData.financialTransactionId || null,
    });
    if (error) return new Response("Could not update payment ledger.", { status: 500 });
    return new Response("Callback processed.", { status: 200 });
  } catch (error) {
    console.error("momo-callback failed:", error instanceof Error ? error.message : "unknown");
    return new Response("Callback processing failed.", { status: 500 });
  }
});
