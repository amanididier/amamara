import { createFileRoute } from "@tanstack/react-router";
import { ConsultationWizard } from "@/components/consultation-wizard";

export const Route = createFileRoute("/app/pro")({
  validateSearch: (search: Record<string, unknown>): { adType?: string | undefined; duration?: number | undefined; jobId?: string | undefined } => ({ adType: typeof search['adType'] === "string" ? search['adType'] : undefined, duration: Number(search['duration']) || undefined, jobId: typeof search['jobId'] === "string" ? search['jobId'] : undefined }),
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Serivisi z'abahanga — Amamaza" },
      { name: "description", content: "Saba abahanga nyabo bagukorere itangazo ryihariye." },
      { property: "og:title", content: "Serivisi z'abahanga — Amamaza" },
      { property: "og:description", content: "Amatangazo akozwe n'abantu nyabo." },
    ],
  }),
  component: Pro,
});

function Pro() {
  return <ConsultationWizard {...Route.useSearch()} />;
}
