import { createClient } from "npm:@supabase/supabase-js@2";

type MomoConfig = {
  subscriptionKey: string; apiUser: string; apiKey: string; baseUrl: string;
  targetEnvironment: string; currency: "EUR" | "RWF"; isTest: boolean; callbackUrl?: string;
};
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
function getServiceKey(): string {
  const direct = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SECRET_KEY");
  if (direct) return direct;
  const raw = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (raw) {
    try {
      const keys = JSON.parse(raw) as Record<string, string>;
      const selected = keys.default || Object.values(keys)[0];
      if (selected) return Deno.env.get(selected) || selected;
    } catch { /* use the explicit configuration error below */ }
  }
  throw new Error("Supabase server secret is not configured.");
}
function adminClient() {
  const url = Deno.env.get("SUPABASE_URL");
  if (!url) throw new Error("SUPABASE_URL is missing.");
  return createClient(url, getServiceKey(), { auth: { persistSession: false, autoRefreshToken: false } });
}
async function authenticatedUser(req: Request, admin: ReturnType<typeof adminClient>) {
  const header = req.headers.get("Authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;
  const { data, error } = await admin.auth.getUser(token);
  return error ? null : data.user;
}
function isSandboxMode() {
  return Deno.env.get("MTN_TARGET_ENVIRONMENT") !== "mtnrwanda" || Deno.env.get("MTN_LIVE_ENABLED") !== "true";
}
function getMomoConfig(): MomoConfig {
  const subscriptionKey = Deno.env.get("MTN_COLLECTION_SUBSCRIPTION_KEY") || "";
  const apiUser = Deno.env.get("MTN_API_USER") || "";
  const apiKey = Deno.env.get("MTN_API_KEY") || "";
  if (!subscriptionKey || !apiUser || !apiKey) throw new Error("MTN sandbox credentials are not configured yet.");

  const targetEnvironment = Deno.env.get("MTN_TARGET_ENVIRONMENT") || "sandbox";
  const isTest = targetEnvironment === "sandbox";
  if (!isTest && Deno.env.get("MTN_LIVE_ENABLED") !== "true") {
    throw new Error("Live MTN payments are locked until MTN approves Amamaza and issues production credentials.");
  }
  if (!isTest && targetEnvironment !== "mtnrwanda") throw new Error("The production target environment must be confirmed with MTN Rwanda.");

  const currency = isTest ? "EUR" : (Deno.env.get("MTN_CURRENCY") || "RWF");
  if ((!isTest && currency !== "RWF") || (isTest && currency !== "EUR")) throw new Error("MTN currency configuration is invalid.");

  const baseUrl = isTest
    ? (Deno.env.get("MTN_BASE_URL") || "https://sandbox.momodeveloper.mtn.com")
    : (Deno.env.get("MTN_BASE_URL") || "");
  if (!baseUrl) throw new Error("MTN production base URL must be supplied by MTN Rwanda.");

  return {
    subscriptionKey, apiUser, apiKey, baseUrl: baseUrl.replace(/\/+$/, ""),
    targetEnvironment, currency, isTest,
    callbackUrl: !isTest ? (Deno.env.get("MTN_CALLBACK_URL") || undefined) : undefined,
  };
}
let cachedToken: { value: string; expiresAt: number } | null = null;
async function getAccessToken(config: MomoConfig): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const response = await fetch(config.baseUrl + "/collection/token/", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(config.apiUser + ":" + config.apiKey),
      "Ocp-Apim-Subscription-Key": config.subscriptionKey,
    },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error("MTN authentication failed with HTTP " + response.status + ".");
  const payload = await response.json() as { access_token?: string; expires_in?: number };
  if (!payload.access_token) throw new Error("MTN did not return an access token.");
  cachedToken = { value: payload.access_token, expiresAt: Date.now() + Math.max(60, payload.expires_in || 300) * 1000 };
  return payload.access_token;
}
function normalizePhone(value: unknown): string {
  const digits = String(value || "").replace(/\D/g, "");
  const normalized = digits.startsWith("07") ? "25" + digits : digits;
  if (!/^2507\d{8}$/.test(normalized)) throw new Error("Enter a valid Rwanda MTN number, for example 078xxxxxxx.");
  return normalized;
}
function calculateOrderPrice(input: Record<string, unknown>) {
  const serviceType = String(input.service_type || "");
  const duration = Math.round(Number(input.duration_seconds || 0));
  const quality = String(input.quality || "standard");
  const basePrices: Record<string, number> = { video: 15000, flyer: 3000, banner: 5000, template: 2500 };
  const multipliers: Record<string, number> = { standard: 1, hd: 1.4, premium: 2 };
  if (!(serviceType in basePrices)) throw new Error("Unsupported advertising service.");
  if (!(quality in multipliers)) throw new Error("Unsupported quality option.");
  if (serviceType === "video" && (duration < 5 || duration > 120)) throw new Error("Video duration must be between 5 and 120 seconds.");
  const subtotal = basePrices[serviceType] + (serviceType === "video" ? duration * 800 : 0);
  const amount = Math.round((subtotal * multipliers[quality]) / 100) * 100;
  if (!(amount > 0 && amount < 5_000_000)) throw new Error("Order amount is outside the supported range.");
  return { serviceType, amount, details: { duration_seconds: serviceType === "video" ? duration : null, quality } };
}
async function readProviderStatus(config: MomoConfig, referenceId: string) {
  const token = await getAccessToken(config);
  const response = await fetch(config.baseUrl + "/collection/v1_0/requesttopay/" + encodeURIComponent(referenceId), {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "X-Target-Environment": config.targetEnvironment,
      "Ocp-Apim-Subscription-Key": config.subscriptionKey,
    },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error("MTN status check failed with HTTP " + response.status + ".");
  return await response.json() as { status?: string; financialTransactionId?: string };
}
async function syncStatus(admin: ReturnType<typeof adminClient>, referenceId: string, providerStatus: string, financialId?: string) {
  const { error } = await admin.rpc("finalize_momo_payment", {
    p_reference_id: referenceId,
    p_mtn_status: String(providerStatus || "PENDING").toUpperCase(),
    p_financial_transaction_id: financialId || null,
  });
  if (error) throw new Error("Could not safely finalize the payment.");
}
async function sendPaymentRequest(
  config: MomoConfig, referenceId: string, phone: string, amountRwf: number,
  kind: string, orderId: string | null, admin: ReturnType<typeof adminClient>,
) {
  try {
    const token = await getAccessToken(config);
    const headers: Record<string, string> = {
      Authorization: "Bearer " + token,
      "X-Reference-Id": referenceId,
      "X-Target-Environment": config.targetEnvironment,
      "Ocp-Apim-Subscription-Key": config.subscriptionKey,
      "Content-Type": "application/json",
    };
    if (config.callbackUrl) {
      const callback = new URL(config.callbackUrl);
      callback.searchParams.set("reference_id", referenceId);
      headers["X-Callback-Url"] = callback.toString();
    }
    const response = await fetch(config.baseUrl + "/collection/v1_0/requesttopay", {
      method: "POST", headers,
      body: JSON.stringify({
        amount: config.isTest ? "1" : String(amountRwf),
        currency: config.currency,
        externalId: referenceId,
        payer: { partyIdType: "MSISDN", partyId: phone },
        payerMessage: "Amamaza advertising payment",
        payeeNote: kind === "wallet_topup" ? "Amamaza wallet top-up" : "Amamaza ad order",
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (response.status === 202) {
      await admin.from("momo_payments").update({
        status: "accepted", mtn_status: "PENDING", updated_at: new Date().toISOString(),
      }).eq("reference_id", referenceId);
      return {
        ok: true, reference_id: referenceId, order_id: orderId, status: "accepted",
        amount_rwf: amountRwf, is_test: config.isTest,
        sandbox_notice: config.isTest ? "Sandbox only: MTN is requesting a 1 EUR test transaction. No real RWF is charged." : null,
      };
    }
    await admin.from("momo_payments").update({
      status: "rejected", mtn_status: "REJECTED",
      failure_reason: "MTN rejected the request (HTTP " + response.status + ").",
      updated_at: new Date().toISOString(),
    }).eq("reference_id", referenceId);
    if (orderId) await admin.from("ad_orders").update({ status: "failed" }).eq("id", orderId);
    return { ok: false, status: "rejected", error: "MTN did not accept the payment request.", http_status: response.status };
  } catch {
    // A timeout can happen after MTN received the request. Keep the record pending and reconcile it.
    return {
      ok: true, reference_id: referenceId, order_id: orderId, status: "pending",
      amount_rwf: amountRwf, is_test: config.isTest,
      message: "The request outcome is unknown. Check its status before retrying.",
    };
  }
}
async function handleStart(body: Record<string, unknown>, userId: string, admin: ReturnType<typeof adminClient>) {
  const kind = String(body.kind || "");
  const idempotencyKey = String(body.idempotency_key || "");
  if (idempotencyKey.length < 12 || idempotencyKey.length > 100) throw new Error("A valid idempotency key is required.");

  if (kind === "wallet_topup") {
    const config = getMomoConfig();
    const phone = normalizePhone(body.phone);
    const amount = Number(body.amount_rwf);
    if (![5000, 10000, 25000, 50000].includes(amount)) throw new Error("Choose one of the available wallet top-up amounts.");

    const { data: prior } = await admin.from("momo_payments")
      .select("reference_id,status,kind,amount_rwf,order_id,is_test")
      .eq("user_id", userId).eq("idempotency_key", idempotencyKey).maybeSingle();
    if (prior) return {
      ok: true, reference_id: prior.reference_id, status: prior.status, kind: prior.kind,
      amount_rwf: prior.amount_rwf, order_id: prior.order_id, is_test: prior.is_test, reused: true,
    };

    const referenceId = crypto.randomUUID();
    const { error } = await admin.from("momo_payments").insert({
      reference_id: referenceId, external_id: referenceId, user_id: userId,
      kind: "wallet_topup", phone, amount_rwf: amount,
      mtn_amount: config.isTest ? 1 : amount, currency: config.currency, fee_rwf: 0,
      environment: config.isTest ? "sandbox" : "production", is_test: config.isTest,
      idempotency_key: idempotencyKey, status: "pending",
    });
    if (error) throw new Error("Could not create the payment record.");
    return await sendPaymentRequest(config, referenceId, phone, amount, "wallet_topup", null, admin);
  }

  if (kind === "ad_order") {
    const paymentMethod = String(body.payment_method || "momo");
    const config = paymentMethod === "wallet" ? null : getMomoConfig();
    const isTest = config ? config.isTest : isSandboxMode();

    const { data: priorOrder } = await admin.from("ad_orders")
      .select("id,status,amount_rwf,is_test").eq("user_id", userId)
      .eq("idempotency_key", idempotencyKey).maybeSingle();
    if (priorOrder) {
      const { data: priorPayment } = await admin.from("momo_payments")
        .select("reference_id,status").eq("order_id", priorOrder.id).maybeSingle();
      return {
        ok: true, order_id: priorOrder.id, reference_id: priorPayment?.reference_id || undefined,
        status: priorPayment?.status || priorOrder.status, amount_rwf: priorOrder.amount_rwf,
        is_test: priorOrder.is_test, reused: true,
      };
    }

    const order = calculateOrderPrice(body);
    const { data: createdOrder, error: orderError } = await admin.from("ad_orders").insert({
      user_id: userId, service_type: order.serviceType, details: order.details,
      amount_rwf: order.amount, is_test: isTest, status: "pending_payment",
      idempotency_key: idempotencyKey,
    }).select("id").single();
    if (orderError || !createdOrder) throw new Error("Could not create the advertising order.");

    if (paymentMethod === "wallet") {
      const { data, error } = await admin.rpc("debit_wallet_for_order", {
        p_user_id: userId, p_order_id: createdOrder.id,
      });
      if (error) {
        await admin.from("ad_orders").update({ status: "failed" }).eq("id", createdOrder.id);
        throw new Error(error.message.includes("Insufficient wallet balance")
          ? "Your wallet does not have enough money for this order."
          : "Could not complete wallet payment.");
      }
      return { ok: true, kind: "ad_order", order_id: createdOrder.id, amount_rwf: order.amount, status: isTest ? "paid_test" : "paid", is_test: isTest, wallet: data };
    }

    if (paymentMethod !== "momo" || !config) throw new Error("Unsupported payment method.");
    const phone = normalizePhone(body.phone);
    const referenceId = crypto.randomUUID();
    const { error: paymentError } = await admin.from("momo_payments").insert({
      reference_id: referenceId, external_id: referenceId, user_id: userId,
      order_id: createdOrder.id, kind: "ad_order", phone, amount_rwf: order.amount,
      mtn_amount: config.isTest ? 1 : order.amount, currency: config.currency, fee_rwf: 0,
      environment: config.isTest ? "sandbox" : "production", is_test: config.isTest,
      idempotency_key: idempotencyKey, status: "pending",
    });
    if (paymentError) {
      await admin.from("ad_orders").update({ status: "failed" }).eq("id", createdOrder.id);
      throw new Error("Could not create the payment record.");
    }
    return await sendPaymentRequest(config, referenceId, phone, order.amount, "ad_order", createdOrder.id, admin);
  }

  throw new Error("Unsupported payment type.");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);
  try {
    const admin = adminClient();
    const user = await authenticatedUser(req, admin);
    if (!user) return json({ error: "Please sign in before making a payment." }, 401);
    const body = await req.json() as Record<string, unknown>;
    const action = String(body.action || "");

    if (action === "wallet") {
      const { error: ensureError } = await admin.from("wallet_accounts")
        .upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true });
      if (ensureError) throw new Error("Could not load wallet.");
      const [wallet, ledger] = await Promise.all([
        admin.from("wallet_accounts").select("balance_rwf,sandbox_balance_rwf,updated_at").eq("user_id", user.id).single(),
        admin.from("wallet_transactions").select("id,amount_rwf,balance_after_rwf,sandbox_balance_after_rwf,is_test,description,created_at")
          .eq("user_id", user.id).order("created_at", { ascending: false }).limit(25),
      ]);
      if (wallet.error || ledger.error) throw new Error("Could not load wallet history.");
      return json({
        ok: true, balance_rwf: wallet.data.balance_rwf, sandbox_balance_rwf: wallet.data.sandbox_balance_rwf,
        transactions: ledger.data || [], environment: Deno.env.get("MTN_TARGET_ENVIRONMENT") || "sandbox",
      });
    }

    if (action === "start") {
      try { return json(await handleStart(body, user.id, admin)); }
      catch (error) { return json({ error: error instanceof Error ? error.message : "Payment could not be started." }, 400); }
    }

    if (action === "status") {
      const referenceId = String(body.reference_id || "");
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(referenceId)) return json({ error: "Invalid payment reference." }, 400);
      const { data: payment, error } = await admin.from("momo_payments")
        .select("reference_id,user_id,status,is_test,amount_rwf").eq("reference_id", referenceId).eq("user_id", user.id).maybeSingle();
      if (error || !payment) return json({ error: "Payment not found." }, 404);
      if (["successful", "failed", "rejected", "expired"].includes(payment.status)) {
        return json({ ok: true, status: payment.status, is_test: payment.is_test, amount_rwf: payment.amount_rwf });
      }
      const config = getMomoConfig();
      try {
        const provider = await readProviderStatus(config, referenceId);
        await syncStatus(admin, referenceId, provider.status || "PENDING", provider.financialTransactionId);
      } catch {
        return json({ ok: true, status: payment.status, is_test: payment.is_test, amount_rwf: payment.amount_rwf, message: "MTN status is temporarily unavailable. Check again shortly." });
      }
      const { data: updated } = await admin.from("momo_payments").select("status,is_test,amount_rwf").eq("reference_id", referenceId).single();
      return json({ ok: true, status: updated?.status || "pending", is_test: updated?.is_test ?? payment.is_test, amount_rwf: updated?.amount_rwf ?? payment.amount_rwf });
    }
    return json({ error: "Unknown action." }, 400);
  } catch (error) {
    console.error("momo-payments handler failed:", error instanceof Error ? error.message : "unknown");
    return json({ error: error instanceof Error ? error.message : "Payment service unavailable." }, 500);
  }
});
