import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Smartphone } from "lucide-react";
import { toast } from "sonner";
import { pricing } from "@/config/site";
import { formatRWF } from "@/lib/pricing";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/wallet")({
  head: () => ({
    meta: [
      { title: "Amafaranga — Amamaza" },
      { name: "description", content: "Shyira amafaranga kuri konti yawe ukoresheje MoMo cyangwa Airtel Money." },
      { property: "og:title", content: "Wallet — Amamaza" },
      { property: "og:description", content: "Konti y'amafaranga ya Amamaza." },
    ],
  }),
  component: WalletPage,
});

const demoTx = [
  { id: "t1", label: "Flyer · Promosiyo ya weekend", amount: -3000, status: "done", date: "2026-10-28" },
  { id: "t2", label: "MTN MoMo top-up", amount: 10000, status: "done", date: "2026-10-27" },
  { id: "t3", label: "Banner y'iduka", amount: -5000, status: "pending", date: "2026-10-30" },
];

function WalletPage() {
  const { t } = usePrefs();
  const [amount, setAmount] = useState(pricing.topUpOptions[1]);
  const [method, setMethod] = useState<"mtn" | "airtel">("mtn");
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
      <h1 className="text-3xl font-extrabold sm:text-4xl">{t("Amafaranga asigaye", "Wallet")}</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-primary p-8 text-primary-foreground">
          <p className="opacity-80">{t("Asigaye kuri konti", "Available balance")}</p>
          <p className="mt-2 font-display text-5xl font-extrabold">{formatRWF(0)}</p>
          <p className="mt-6 text-sm opacity-80">{t("Koresha aya mafaranga gukora amatangazo igihe icyo ari cyo cyose.", "Use your balance to create ads anytime.")}</p>
        </div>
        <div className="rounded-3xl border bg-card p-6">
          <p className="font-bold">{t("Ongeramo amafaranga", "Add money")}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {pricing.topUpOptions.map((v) => (
              <button key={v} onClick={() => setAmount(v)} className={cn("rounded-xl border py-3 text-sm font-semibold", amount === v && "border-primary bg-primary/10 text-primary")}>{formatRWF(v)}</button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {(["mtn", "airtel"] as const).map((m) => (
              <button key={m} onClick={() => setMethod(m)} className={cn("flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold", method === m && "border-foreground")}>
                <Smartphone className="size-4" />{m === "mtn" ? "MTN MoMo" : "Airtel Money"}
              </button>
            ))}
          </div>
          <button
            onClick={() => toast.info(t("Kwishyura ntibirahuzwa. Bizaboneka vuba.", "Payments aren't connected yet. Coming soon."))}
            className="mt-4 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground"
          >
            {t("Ishyura", "Pay")} {formatRWF(amount)}
          </button>
          <p className="mt-2 text-center text-xs text-muted-foreground">{t("Kwishyura ukoresheje telefoni bizaboneka vuba.", "Mobile money payments coming soon.")}</p>
        </div>
      </div>
      <h2 className="mt-12 text-lg font-bold">{t("Amateka y'ubwishyu", "Transactions")} <span className="text-xs font-normal text-muted-foreground">({t("ingero", "samples")})</span></h2>
      <div className="mt-4 divide-y rounded-3xl border bg-card">
        {demoTx.map((x) => (
          <div key={x.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold">{x.label}</p>
              <p className="text-xs text-muted-foreground">{x.date}</p>
            </div>
            <div className="text-right">
              <p className={cn("font-semibold tabular-nums", x.amount > 0 && "text-success")}>{x.amount > 0 ? "+" : ""}{formatRWF(x.amount)}</p>
              <p className={cn("text-xs", x.status === "done" ? "text-success" : "text-creative")}>{x.status === "done" ? t("Byakunze", "Completed") : t("Bitegereje", "Pending")}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
