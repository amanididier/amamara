import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabase } from "@/integrations/supabase/client";
import { consultationSchema, settingsSchema } from "./agency";
import { z } from "zod";

export async function submitConsultation({ data }: { data: { brief: z.infer<typeof consultationSchema>; campaign: Record<string, unknown>; jobId: string | null; assets: { path: string; name: string }[]; honeypot?: string } }) {
  const { data: row, error } = await supabase.rpc("submit_professional_request", {
    p_brief: JSON.parse(JSON.stringify(data.brief)),
    p_campaign: JSON.parse(JSON.stringify(data.campaign || {})),
    p_job_id: data.jobId,
    p_assets: JSON.parse(JSON.stringify(data.assets || [])),
    p_honeypot: data.honeypot || "",
  });
  if (error) throw new Error(error.message);
  if (!row) throw new Error("Your request could not be saved.");
  return row as { id: string; reference: string; ad_type: string; duration: number; contact_method: string; created_at: string; status: string };
}

export const adminAccess = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (error) throw new Error(error.message);
  return Boolean(data);
});
export const saveAgencySettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .validator(settingsSchema).handler(async ({ data, context }) => {
    const { data: allowed } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!allowed) throw new Error("Administrator access required.");
    const { error } = await context.supabase.from("agency_settings").upsert({ id: true, config: data, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { saved: true };
  });