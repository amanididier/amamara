import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Phone, Mail, Instagram, MessageCircle, Upload, Sparkles, Clock3 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useAccount } from "./account-access";
import { supabase } from "@/integrations/supabase/client";
import { consultationSchema, contactAction, videoTypes, type Consultation, type Contacts } from "@/lib/agency";
import { submitConsultation } from "@/lib/agency.functions";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";
import { images } from "@/data/ads";
import { Link } from "@tanstack/react-router";

export function ConsultationWizard({ adType, duration, jobId }: { adType?: string; duration?: number; jobId?: string }) {
  const { t, lang } = usePrefs(); const { signedIn } = useAccount();
  const [step, setStep] = useState(0); const [busy, setBusy] = useState(false); const [loaded, setLoaded] = useState(false); const [honeypot, setHoneypot] = useState("");
  const [campaign, setCampaign] = useState<Record<string, unknown>>({});
  const [contacts, setContacts] = useState<Contacts>({ phone: "", whatsapp: "", email: "", instagram: "" });
  const [files, setFiles] = useState<File[]>([]); const [assets, setAssets] = useState<{ path: string; name: string }[]>([]);
  const [result, setResult] = useState<Awaited<ReturnType<typeof submitConsultation>> | null>(null);
  const [v, setV] = useState<Consultation>({ customerName: "", business: "", objective: "", audience: "", message: "", scenes: "", style: "", platforms: [], deadline: "", instructions: "", references: "", contactMethod: "whatsapp", contactDetail: "", adType: "product", duration: 30 });
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("amamaza-pro-draft") || "null");
      const c = JSON.parse(localStorage.getItem("amamaza-pro-campaign") || "{}"); setCampaign(c);
      setV(current => ({ ...current, ...(saved || {}), ...(c.businessName ? { business: c.businessName, objective: c.goal || "", message: c.headline || "", scenes: c.description || "" } : {}), ...(adType && ["ugc","product","cinematic","flyer","banner","other"].includes(adType) ? { adType } : {}), ...(duration && [10,15,30,60].includes(duration) ? { duration } : {}) }));
    } catch { /* retain empty draft */ }
    void supabase.auth.getUser().then(({ data }) => { if (data.user) setV(current => ({ ...current, customerName: current.customerName || String(data.user?.user_metadata?.['full_name'] || "") })); });
    void supabase.rpc("agency_contacts").then(({ data }) => { if (data) setContacts(data as Contacts); });
    setLoaded(true);
  }, [adType, duration]);
  useEffect(() => { if (loaded) localStorage.setItem("amamaza-pro-draft", JSON.stringify(v)); }, [v, loaded]);
  const update = (patch: Partial<Consultation>) => setV(current => ({ ...current, ...patch }));
  const fieldClass = "mt-2 w-full rounded-md border bg-background px-4 py-3 text-sm outline-none focus:border-primary";
  const field = (label: string, name: keyof Consultation, multiline = false, optional = false) => <label className="block text-sm font-medium">{label}{!optional && " *"}{multiline ? <textarea rows={4} className={fieldClass} value={String(v[name])} onChange={e => update({ [name]: e.target.value })} /> : <input className={fieldClass} value={String(v[name])} onChange={e => update({ [name]: e.target.value })} />}</label>;
  const valid = step === 0 ? Boolean(v.customerName.trim() && v.business.trim() && v.objective.trim() && v.audience.trim()) : step === 1 ? Boolean(v.message.trim() && v.scenes.trim() && v.style.trim()) : step === 2 ? Boolean(v.platforms.length && v.deadline.trim()) : consultationSchema.safeParse(v).success;
  async function submit() {
    const parsed = consultationSchema.safeParse(v); if (!parsed.success) { toast.error(parsed.error.issues[0]?.message || "Check your brief."); return; }
    setBusy(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (files.length && !user.user) throw new Error("Sign in to attach private reference images, or add public reference links instead.");
      const uploaded = [...assets];
      for (const file of files) {
        if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 10*1024*1024) throw new Error("Use JPG, PNG or WebP images under 10 MB.");
        const path = `${user.user.id}/${crypto.randomUUID()}.${file.type.split('/')[1]}`;
        const { error } = await supabase.storage.from("agency-references").upload(path, file); if (error) throw error;
        uploaded.push({ path, name: file.name }); setAssets([...uploaded]);
      }
      setFiles([]);
      const row = await submitConsultation({ data: { brief: parsed.data, campaign, jobId: jobId || null, assets: uploaded, honeypot } });
      setResult(row); localStorage.removeItem("amamaza-pro-draft"); localStorage.removeItem("amamaza-pro-campaign");
      const action = contactAction(v.contactMethod, contacts, row.reference);
      
    } catch (e) { toast.error(e instanceof Error ? e.message : "Your request could not be saved."); } finally { setBusy(false); }
  }
  if (result) {
    const action = contactAction(v.contactMethod, contacts, result.reference);
    return <main className="mx-auto max-w-3xl px-5 py-12">
      <section className="rounded-3xl border bg-card p-6 shadow-sm sm:p-9">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-success/10 text-success"><Check className="size-6"/></div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[.2em] text-muted-foreground">Amamara Studio · Request received</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{t("Twakiriye ibisobanuro byawe!", "Your creative brief is in.")}</h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{t("Twabitse ibisobanuro byawe neza. Itsinda ryacu rizagusubiza rikoresheje uburyo wahisemo. Nta konti cyangwa ubwishyu bisabwa kugira ngo utange ubusabe.", "Your brief has been saved securely. Our creative team will contact you using the details you provided. No account or payment was required to submit this request.")}</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-muted/60 p-4"><p className="text-xs font-medium text-muted-foreground">Request reference</p><p className="mt-1 font-mono text-lg font-semibold">{result.reference}</p></div>
          <div className="rounded-2xl bg-muted/60 p-4"><p className="text-xs font-medium text-muted-foreground">Preferred contact</p><p className="mt-1 font-semibold capitalize">{result.contact_method} · {v.contactDetail}</p></div>
        </div>
        <div className="mt-8 grid gap-4 border-y py-6 sm:grid-cols-3">
          <div><span className="text-xs font-bold text-primary">01</span><h2 className="mt-2 font-semibold">{t("Dusuzuma ibisobanuro", "We review your brief")}</h2><p className="mt-1 text-sm text-muted-foreground">{t("Tureba intego, uburyo n'ibipimo.", "We check the goal, creative direction and format.")}</p></div>
          <div><span className="text-xs font-bold text-primary">02</span><h2 className="mt-2 font-semibold">{t("Turakuvugisha", "We contact you")}</h2><p className="mt-1 text-sm text-muted-foreground">{t("Dukoresheje uburyo wahisemo.", "Through your preferred contact channel.")}</p></div>
          <div><span className="text-xs font-bold text-primary">03</span><h2 className="mt-2 font-semibold">{t("Wemeza igiciro", "You approve the quote")}</h2><p className="mt-1 text-sm text-muted-foreground">{t("Nta gikorwa cyo gukora itangazo gitangira utabyemeye.", "Production only starts after you approve the quote.")}</p></div>
        </div>
        {action ? <Button asChild className="mt-7"><a href={action}>{t("Vugana na Amamara", "Message Amamara")} <ArrowRight/></a></Button> : <p className="mt-7 rounded-xl border border-dashed p-4 text-sm text-muted-foreground">{t("Ubusabe bwabitswe. Tuzakuvugisha ku makuru watanze; nta kindi usabwa gukora ubu.", "Your request is saved. We’ll reach you using the contact details you supplied; there’s nothing else you need to do right now.")}</p>}
        {v.contactMethod === "instagram" && <Button variant="outline" className="ml-2 mt-7" onClick={()=>void navigator.clipboard.writeText("Hello Amamara, I’d like to discuss creative brief "+result.reference+".").then(()=>toast.success("Copied"))}>Copy introduction</Button>}
        <div className="mt-8 flex items-center justify-between gap-4 border-t pt-5"><p className="text-xs text-muted-foreground"><Clock3 className="mr-1 inline size-3.5"/> {t("Ubusabe bwawe bwakiriwe neza.", "Your request has been received.")}</p><Link to="/app" className="text-sm font-semibold text-primary">{t("Subira muri studio", "Back to Studio")}</Link></div>
      </section>
    </main>;
  }
  return <main className="mx-auto max-w-3xl px-5 py-10"><span className="text-sm font-semibold text-creative">{t("Abahanga ba Amamara", "Amamara creative team")}</span><h1 className="mt-3 text-3xl font-bold">{t("Vugana n'umuhanga", "Talk to a Pro")}</h1><div className="mt-7 flex items-center justify-between text-sm"><span>{[t("Umushinga wawe", "Your project"),t("Icyerekezo", "Creative direction"),t("Gutanga itangazo", "Delivery & references"),t("Uko tukuvugisha", "Contact preference")][step]}</span><span>{step+1} / 4</span></div><div className="mt-3 grid grid-cols-4 gap-2">{[0,1,2,3].map(i=><span key={i} className={cn("h-1 rounded-sm",i<=step ? "bg-primary":"bg-muted")}/>)}</div><div className="mt-8 space-y-5">
    {step===0 && <>{field(t("Izina ryawe", "Your name"),"customerName")}{field(t("Ubucuruzi cyangwa igicuruzwa", "Business, product or service"),"business")}{field(t("Intego y'itangazo", "Main campaign objective"),"objective")}{field(t("Abakiriya ugamije", "Target audience"),"audience")}<label className="block text-sm">{t("Ubwoko bw'itangazo", "Advertisement type")}<select className={fieldClass} value={v.adType} onChange={e=>update({adType:e.target.value as Consultation['adType']})}>{[...videoTypes,{id:'flyer',rw:'Post',en:'Post'},{id:'banner',rw:'Icyapa',en:'Banner'},{id:'other',rw:'Ikindi',en:'Other'}].map(x=><option key={x.id} value={x.id}>{x[lang]}</option>)}</select></label></>}
    {step===1 && <>{field(t("Ubutumwa bw'ingenzi", "What should viewers understand or feel?"),"message",true)}{field(v.adType==='ugc' ? t("Umuntu uvuga, ijwi n'ibicuruzwa", "Presenter, tone and product demonstration") : v.adType==='product' ? t("Ibicuruzwa n'ibice byabyo bigomba kugaragara", "Product features and shots that must appear") : t("Inkuru, amashusho n'ijwi", "Story, scenes and voiceover"),"scenes",true)}{field(t("Isura n'imiterere wifuza", "Preferred visual style"),"style")}<div className="rounded-2xl border p-4"><div className="mb-3 flex items-center gap-2"><Sparkles className="size-4 text-primary"/><p className="text-sm font-semibold">{t("Ingero z'ibikorwa by'umwuga", "Creative direction examples")}</p></div><div className="grid grid-cols-3 gap-2">{[{src:images.restaurant,label:t("Kwamamaza resitora","Restaurant campaign")},{src:images.juice,label:t("Kwamamaza igicuruzwa","Product commercial")},{src:images.fashion,label:t("Kwamamaza imyenda","Fashion campaign")}].map(x=><figure key={x.label}><img src={x.src} alt={x.label} className="aspect-[4/5] w-full rounded-xl object-cover"/><figcaption className="mt-2 text-[11px] leading-4 text-muted-foreground">{x.label}</figcaption></figure>)}</div></div></>}
    {step===2 && <><div className="grid grid-cols-2 gap-2">{['Instagram','TikTok','Facebook','WhatsApp','YouTube','TV','Print'].map(p=><Button variant="outline" key={p} aria-pressed={v.platforms.includes(p)} className={cn(v.platforms.includes(p)&&'border-primary text-primary')} onClick={()=>update({platforms:v.platforms.includes(p)?v.platforms.filter(x=>x!==p):[...v.platforms,p]})}>{p}</Button>)}</div><label className="block text-sm">{t("Igihe", "Duration")}<select className={fieldClass} value={v.duration} onChange={e=>update({duration:Number(e.target.value) as Consultation['duration']})}>{[10,15,30,60].map(s=><option key={s} value={s}>{s}s</option>)}</select></label>{field(t("Igihe ukeneye ko rirangira", "When should it be completed?"),"deadline")}{field(t("Andi mabwiriza", "Additional instructions (optional)"),"instructions",true,true)}{field(t("Urubuga rw'icyitegererezo", "Reference links (optional)"),"references",false,true)}{signedIn ? <label className="block text-sm"><span className="flex items-center gap-2"><Upload className="size-4"/>{t("Amafoto y'icyitegererezo", "Inspiration images (optional)")}</span><input className={fieldClass} type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={e=>setFiles(Array.from(e.target.files||[]).slice(0,8-assets.length))}/></label> : <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">{t("Nta konti ikenewe. Ushobora gushyiraho amahuza y’amafoto y’icyitegererezo hejuru.", "No account is needed. Add public reference-image links above; private image uploads are available to existing signed-in customers.")}</p>}<div className="flex flex-wrap gap-3">{files.map((file,i)=><ReferenceThumbnail key={`${file.name}-${i}`} file={file}/>)}</div></>}
    {step===3 && <><p className="font-semibold">{t("Tukuvugishe dute?", "How should our creative team reach you?")}</p><div className="grid grid-cols-2 gap-3">{[{id:'phone',Icon:Phone,label:t("Telefoni", "Phone call")},{id:'whatsapp',Icon:MessageCircle,label:'WhatsApp'},{id:'email',Icon:Mail,label:'Email'},{id:'instagram',Icon:Instagram,label:'Instagram'}].map(c=><Button key={c.id} variant="outline" aria-pressed={v.contactMethod===c.id} className={cn("h-20 flex-col",v.contactMethod===c.id&&'border-primary text-primary')} onClick={()=>update({contactMethod:c.id as Consultation['contactMethod'],contactDetail:''})}><c.Icon/>{c.label}</Button>)}</div>{field(v.contactMethod==='email' ? 'Email' : v.contactMethod==='instagram' ? 'Instagram @handle' : t("Nimero ya telefoni", "Phone number"),"contactDetail")}<p className="text-xs text-muted-foreground">{t("Ibisobanuro byawe bibikwa mbere yo gufungura uburyo bwo kuvugana.", "Your brief is saved before opening your preferred contact channel.")}</p><div className="rounded-xl bg-muted/50 p-4"><p className="font-semibold">{t("Nta konti ikenewe", "No account required")}</p><p className="mt-1 text-sm text-muted-foreground">{t("Tanga amakuru yawe gusa. Itsinda ryacu rizakuvugisha rikoresheje uburyo wahisemo.", "Just share your contact details. Our team will reach you using your preferred channel.")}</p></div><div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={e=>setHoneypot(e.target.value)}/></label></div></>}
  </div><div className="mt-9 flex justify-between gap-3 border-t pt-6"><Button variant="ghost" disabled={step===0||busy} onClick={()=>setStep(s=>s-1)}><ArrowLeft/>{t("Subira", "Back")}</Button><Button disabled={!valid||busy} onClick={()=>step===3?void submit():setStep(s=>s+1)}>{busy?t("Tegereza…", "Saving…"):step===3?t("Ohereza ibisobanuro", "Submit creative brief"):t("Komeza", "Continue")}<ArrowRight/></Button></div></main>;
}
function ReferenceThumbnail({file}:{file:File}) { const [url,setUrl]=useState(''); useEffect(()=>{const u=URL.createObjectURL(file);setUrl(u);return()=>URL.revokeObjectURL(u);},[file]);return <figure className="w-24">{url&&<img src={url} alt={file.name} className="aspect-square w-24 rounded-md object-cover"/>}<figcaption className="mt-1 truncate text-xs text-muted-foreground">{file.name}</figcaption></figure>; }