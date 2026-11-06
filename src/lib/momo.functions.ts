import { supabase } from "@/integrations/supabase/client";

export type MomoPaymentStatus = "pending" | "accepted" | "successful" | "failed" | "rejected" | "expired";

export interface WalletTransaction {
  id: string;
  amount_rwf: number;
  balance_after_rwf: number | null;
  sandbox_balance_after_rwf: number | null;
  is_test: boolean;
  description: string;
  created_at: string;
}

export interface WalletSnapshot {
  balance_rwf: number;
  sandbox_balance_rwf: number;
  transactions: WalletTransaction[];
  environment: string;
}

async function invokeMomo<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke("momo-payments", { body });
  if (error) {
    throw new Error(error.message || "Could not reach the Amamaza payment service.");
  }
  if (!data || data.error) {
    throw new Error(data?.error || "The payment service returned an invalid response.");
  }
  return data as T;
}

export function loadMomoWallet() {
  return invokeMomo<WalletSnapshot & { ok: true }>({ action: "wallet" });
}

export function requestWalletTopUp(phone: string, amountRwf: number, idempotencyKey: string = crypto.randomUUID()) {
  return invokeMomo<{
    ok: boolean;
    reference_id?: string;
    status: MomoPaymentStatus;
    amount_rwf?: number;
    is_test?: boolean;
    sandbox_notice?: string;
    error?: string;
  }>({
    action: "start",
    kind: "wallet_topup",
    phone,
    amount_rwf: amountRwf,
    idempotency_key: idempotencyKey,
  });
}

export function checkMomoPayment(referenceId: string) {
  return invokeMomo<{
    ok: boolean;
    status: MomoPaymentStatus;
    is_test: boolean;
    amount_rwf: number;
    message?: string;
  }>({ action: "status", reference_id: referenceId });
}

export function createMomoAdOrder(input: {
  phone?: string;
  service_type: "video" | "flyer" | "banner" | "template";
  duration_seconds?: number;
  quality?: "standard" | "hd" | "premium";
  payment_method: "momo" | "wallet";
  idempotency_key?: string;
}) {
  return invokeMomo<{
    ok: boolean;
    reference_id?: string;
    order_id?: string;
    status: string;
    amount_rwf?: number;
    is_test?: boolean;
    sandbox_notice?: string;
    wallet?: { balance_rwf: number };
    error?: string;
  }>({
    action: "start",
    kind: "ad_order",
    ...input,
    idempotency_key: input.idempotency_key || crypto.randomUUID(),
  });
}
