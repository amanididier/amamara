import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { usePrefs } from "@/lib/prefs";

export function useAccount() {
  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return { signedIn, ready };
}

export function AccountAccess() {
  const { t } = usePrefs();
  const [busy, setBusy] = useState(false);
  async function signIn(provider: "google" | "lovable") {
    setBusy(true);
    sessionStorage.setItem("amamaza-return", window.location.pathname);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error)
        toast.error(
          t("Kwinjira ntibyakunze. Ongera ugerageze.", "Sign-in failed. Please try again."),
        );
    } catch {
      toast.error(t("Kwinjira ntibyakunze.", "Could not sign in."));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-4 border-y py-6">
      <p className="font-semibold">{t("Injira kuri konti yawe", "Sign in to your account")}</p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => void signIn("google")} disabled={busy}>
          <LogIn /> Google
        </Button>
        <Button variant="outline" onClick={() => void signIn("lovable")} disabled={busy}>
          Lovable
        </Button>
      </div>
    </div>
  );
}
