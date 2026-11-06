import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, Smartphone, Wallet as WalletIcon } from "lucide-react";
import { toast } from "sonner";
import { pricing } from "@/config/site";
import { formatRWF } from "@/lib/pricing";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AccountAccess, useAccount } from "@/components/account-access";
import {
  checkMomoPayment,
  loadMomoWallet,
  requestWalletTopUp,
  type MomoPaymentStatus,
  type WalletTransaction,
} from "@/lib/momo.functions";

export const Route = createFileRoute("/app/wallet")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Amafaranga — Amamaza" },
      { name: "description", content: "Shyira amafaranga kuri konti yawe ukoresheje MTN MoMo." },
      { property: "og:title", content: "Wallet — Amamaza" },
      { property: "og:description", content: "Konti y'amafaranga ya Amamaza." },
    ],
  }),
  component: WalletPage,
});

function prettyDate(value: string) {
  return new Intl.DateTimeFormat("en-RW", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function WalletPage() {
  const { t } = usePrefs();
  const { signedIn, ready } = useAccount();
  const [attemptKey, setAttemptKey] = useState("");
  const [amount, setAmount] = useState<number>(pricing.topUpOptions[1] ?? 10000);
  const [phone, setPhone] = useState("");
  const [balance, setBalance] = useState(0);
  const [sandboxBalance, setSandboxBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [environment, setEnvironment] = useState("sandbox");
  const [walletLoading, setWalletLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [reference, setReference] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<MomoPaymentStatus | "">("");

  const refreshWallet = useCallback(async () => {
    try {
      const wallet = await loadMomoWallet();
      setBalance(Number(wallet.balance_rwf || 0));
      setSandboxBalance(Number(wallet.sandbox_balance_rwf || 0));
      setTransactions(wallet.transactions || []);
      setEnvironment(wallet.environment || "sandbox");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load your wallet.");
    } finally {
      setWalletLoading(false);
    }
  }, []);

  useEffect(() => {
    if (signedIn) void refreshWallet();
  }, [refreshWallet, signedIn]);

  async function handleTopUp() {
    if (!phone.trim()) {
      toast.error(t("Andika nimero ya MTN MoMo.", "Enter the MTN MoMo phone number."));
      return;
    }
    setSubmitting(true);
    try {
      const idempotencyKey = attemptKey || crypto.randomUUID();
      setAttemptKey(idempotencyKey);
      const result = await requestWalletTopUp(phone, amount, idempotencyKey);
      if (!result.ok || !result.reference_id) {
        throw new Error(result.error || "MTN did not accept the payment request.");
      }
      setReference(result.reference_id);
      setPaymentStatus(result.status || "pending");
      toast.success(
        environment === "sandbox"
          ? "Sandbox request sent. Approve the test prompt if one is issued."
          : "Payment request sent. Approve the prompt on your MTN phone.",
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start the payment.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCheckStatus() {
    if (!reference) return;
    setChecking(true);
    try {
      const result = await checkMomoPayment(reference);
      setPaymentStatus(result.status);
      if (result.status === "successful") {
        toast.success(
          result.is_test
            ? "Sandbox payment verified. Your test balance has been updated."
            : "Payment verified. Your wallet has been credited.",
        );
        await refreshWallet();
      } else if (["failed", "rejected", "expired"].includes(result.status)) {
        toast.error("The payment was not completed. Your wallet has not been credited.");
      } else {
        toast.info("MTN has not confirmed the payment yet. Check again shortly.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not verify payment status.");
    } finally {
      setChecking(false);
    }
  }

  const statusLabel: Record<string, string> = {
    pending: t("Bitegereje", "Pending"),
    accepted: t("Byakiriwe na MTN", "Accepted by MTN"),
    successful: t("Byakunze", "Successful"),
    failed: t("Byanze", "Failed"),
    rejected: t("Byanzwe na MTN", "Rejected by MTN"),
    expired: t("Byarangiye", "Expired"),
  };

  if (!ready || !signedIn)
    return (
      <main className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="mb-8 text-3xl font-bold">{t("Amafaranga", "Wallet")}</h1>
        {ready ? <AccountAccess /> : <p>{t("Tegereza…", "Loading…")}</p>}
      </main>
    );
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            {t("Amafaranga asigaye", "Wallet")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t(
              "Kwishyura no gukurikirana amafaranga yawe.",
              "Add funds and track your wallet activity.",
            )}
          </p>
        </div>
        <Button variant="outline" onClick={() => void refreshWallet()} disabled={walletLoading}>
          <RefreshCw className={cn("size-4", walletLoading && "animate-spin")} />
          {t("Ongera urebe", "Refresh")}
        </Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-primary p-8 text-primary-foreground">
          <div className="flex items-center gap-2 opacity-85">
            <WalletIcon className="size-5" />
            <p>{t("Amafaranga nyayo", "Real wallet balance")}</p>
          </div>
          <p className="mt-3 font-display text-4xl font-extrabold tabular-nums">
            {walletLoading ? "…" : formatRWF(balance)}
          </p>
          <p className="mt-5 text-sm opacity-80">
            {t(
              "Amafaranga azakoreshwa mu kwishyura amatangazo.",
              "Funds available for paying for advertising orders.",
            )}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold">{t("Ongeramo amafaranga", "Top up wallet")}</p>
            <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold">
              <Smartphone className="size-3.5" /> MTN MoMo
            </span>
          </div>

          <label className="mt-4 block text-sm font-medium" htmlFor="momo-phone">
            {t("Nimero ya MTN MoMo", "MTN MoMo number")}
          </label>
          <input
            id="momo-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              if (!reference) setAttemptKey("");
            }}
            placeholder="078 000 0000"
            className="mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />

          <p className="mt-4 text-sm font-medium">{t("Hitamo amafaranga", "Choose an amount")}</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {pricing.topUpOptions.map((value) => (
              <Button
                variant="outline"
                key={value}
                onClick={() => {
                  setAmount(value);
                  if (!reference) setAttemptKey("");
                }}
                className={cn(
                  "rounded-xl border py-3 text-sm font-semibold transition-colors",
                  amount === value && "border-primary bg-primary/10 text-primary",
                )}
              >
                {formatRWF(value)}
              </Button>
            ))}
          </div>

          <Button
            onClick={() => void handleTopUp()}
            disabled={
              submitting ||
              walletLoading ||
              Boolean(
                reference &&
                !["successful", "failed", "rejected", "expired"].includes(paymentStatus),
              )
            }
            className="mt-4 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? t("Tegereza...", "Starting payment...")
              : t("Kwishyura", "Continue to MTN")}{" "}
            · {formatRWF(amount)}
          </Button>

          {environment === "sandbox" && (
            <p className="mt-3 rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
              Sandbox testing is active. MTN will use a 1 EUR test request, not the RWF amount shown
              above. No real RWF is charged; successful tests go to a separate test balance.
            </p>
          )}
        </div>
      </div>

      {reference && (
        <section className="mt-6 rounded-lg border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-bold">{t("Kwishyura kwawe", "Your payment")}</p>
              <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{reference}</p>
              <p className="mt-2 text-sm">
                {t("Imiterere", "Status")}:{" "}
                <span className="font-semibold">{statusLabel[paymentStatus] || paymentStatus}</span>
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => void handleCheckStatus()}
              disabled={
                checking || ["successful", "failed", "rejected", "expired"].includes(paymentStatus)
              }
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              <RefreshCw className={cn("size-4", checking && "animate-spin")} />
              {checking
                ? t("Turimo kugenzura", "Checking...")
                : t("Reba uko byagenze", "Check payment")}
            </Button>
          </div>
          {paymentStatus === "successful" && (
            <p className="mt-3 text-sm text-success">
              {environment === "sandbox"
                ? "Test payment verified. This amount is only in your sandbox balance."
                : "Payment confirmed. Your wallet has been credited."}
            </p>
          )}
        </section>
      )}

      {environment === "sandbox" && (
        <section className="mt-6 rounded-lg border border-dashed p-5">
          <p className="text-sm font-semibold">
            {t("Amafaranga yo kugerageza", "Sandbox test balance")}
          </p>
          <p className="mt-2 text-2xl font-extrabold tabular-nums">
            {walletLoading ? "…" : formatRWF(sandboxBalance)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            This is test-only credit. It is separate from your real wallet and cannot be withdrawn
            or used as real customer money.
          </p>
        </section>
      )}

      <div className="mt-12 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{t("Amateka y'ubwishyu", "Wallet activity")}</h2>
        <span className="text-xs text-muted-foreground">
          {transactions.length} {t("ibyakozwe", "entries")}
        </span>
      </div>
      <div className="mt-4 divide-y rounded-lg border bg-card">
        {transactions.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            {walletLoading
              ? t("Turimo kuzana amateka...", "Loading activity...")
              : t("Nta bikorwa biraboneka.", "No wallet activity yet.")}
          </p>
        ) : (
          transactions.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {prettyDate(item.created_at)}
                  {item.is_test ? " · Sandbox" : ""}
                </p>
              </div>
              <p
                className={cn(
                  "shrink-0 font-semibold tabular-nums",
                  item.amount_rwf > 0 ? "text-success" : "text-foreground",
                )}
              >
                {item.amount_rwf > 0 ? "+" : ""}
                {formatRWF(item.amount_rwf)}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
