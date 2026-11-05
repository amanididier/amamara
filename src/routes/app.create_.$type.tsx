import { createFileRoute, Link } from "@tanstack/react-router";
import { CreationWizard } from "@/components/creation-wizard";

export const Route = createFileRoute("/app/create_/$type")({
  head: () => ({
    meta: [
      { title: "Tegura itangazo — Amamaza" },
      { name: "description", content: "Intambwe zo gutegura itangazo ryawe." },
      { property: "og:title", content: "Tegura itangazo — Amamaza" },
      { property: "og:description", content: "Intambwe zo gutegura itangazo ryawe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Intro,
});

function Intro() {
  const { type } = Route.useParams();
  if (type !== "video" && type !== "flyer" && type !== "banner") return <main className="p-8"><Link to="/app/create">Hitamo itangazo / Choose an ad</Link></main>;
  return <CreationWizard key={type} type={type} />;
}
