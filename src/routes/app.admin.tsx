import { createFileRoute } from "@tanstack/react-router";
import { AgencyAdmin } from "@/components/agency-admin";
export const Route = createFileRoute('/app/admin')({
  head:()=>({meta:[{title:'Professional Requests — Amamaza Agency'},{name:'description',content:'Manage Amamaza creative consultations, pricing and official contact settings.'},{property:'og:title',content:'Professional Requests — Amamaza Agency'},{property:'og:description',content:'The protected Amamaza creative team workspace.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'},{name:'robots',content:'noindex,nofollow'}]}),
  component:AgencyAdmin,
});