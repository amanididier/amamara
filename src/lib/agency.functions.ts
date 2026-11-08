import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { consultationSchema, creativeBrief, settingsSchema } from "./agency";
import { z } from "zod";

export const submitConsultation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ brief: consultationSchema, campaign: z.record(z.unknown()).default({}), jobId: z.string().uuid().nullable(), assets: z.array(z.object({ path: z.string().max(500), name: z.string().max(200) })).max(8) }))
  .handler(async ({ data, context }) => {
    if (data.assets.some(a => !a.path.startsWith(`${context.userId}/`))) throw new Error("Invalid reference ownership.");
    if (data.jobId) {
      const { data: job } = await context.supabase.from("video_jobs").select("id").eq("id", data.jobId).eq("user_id", context.userId).maybeSingle();
      if (!job) throw new Error("Campaign video is not available to this account.");
    }
    const { data: row, error } = await context.supabase.from("professional_requests").insert({
      user_id: context.userId, customer_name: data.brief.customerName, ad_type: data.brief.adType,
      duration: data.brief.duration, contact_method: data.brief.contactMethod, contact_detail: data.brief.contactDetail,
      answers: JSON.parse(JSON.stringify(data.brief)), campaign: JSON.parse(JSON.stringify(data.campaign)),
      related_job_id: data.jobId, assets: data.assets, creative_brief: creativeBrief(data.brief),
    }).select("id, reference, ad_type, duration, contact_method, created_at, status").single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminAccess = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (error) throw new Error(error.message);
  return Boolean(data);
});
export const saveAgencySettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(settingsSchema).handler(async ({ data, context }) => {
    const { data: allowed } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!allowed) throw new Error("Administrator access required.");
    const { error } = await context.supabase.from("agency_settings").upsert({ id: true, config: data, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { saved: true };
  });