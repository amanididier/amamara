import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, RefreshCw, Check, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountAccess, useAccount } from "@/components/account-access";
import { supabase } from "@/integrations/supabase/client";
import { usePrefs } from "@/lib/prefs";

export const Route = createFileRoute('/app/video/$id')({
  head:()=>({meta:[{title:'Your video advertisement — Amamara'},{name:'description',content:'Follow your Amamara video production and view your completed advertisement.'},{property:'og:title',content:'Your video advertisement — Amamara'},{property:'og:description',content:'Video production progress, playback and professional creative assistance.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'},{name:'robots',content:'noindex,nofollow'}]}),
  component:VideoJob,
});
function VideoJob(){
  const {id}=Route.useParams();const {signedIn}=useAccount();const {t}=usePrefs();
  const [job,setJob]=useState<{id:string;status:string;ad_type:string;duration:number;output_path:string|null}|null>(null);const [url,setUrl]=useState('');const [error,setError]=useState('');
  async function load(){const {data,error:e}=await supabase.from('video_jobs').select('id,status,ad_type,duration,output_path').eq('id',id).maybeSingle();if(e){setError(e.message);return;}if(!data){setError(t("Iyi video ntibonetse kuri konti yawe.","This video is not available to your account."));return;}setJob(data);if(data.status==='succeeded'&&data.output_path){const {data:asset,error:assetError}=await supabase.storage.from('agency-references').createSignedUrl(data.output_path,300);if(assetError)setError(assetError.message);else setUrl(asset?.signedUrl||'');}}
  useEffect(()=>{if(!signedIn)return;void load();},[id,signedIn]);
  useEffect(()=>{if(!job||!['queued','processing'].includes(job.status))return;const timer=setInterval(()=>void load(),15000);return()=>clearInterval(timer);},[job?.status,id]);
  if(!signedIn)return <main className="mx-auto max-w-xl p-8"><AccountAccess/></main>;
  return <main className="mx-auto max-w-4xl px-5 py-12">{error?<p role="alert">{error}</p>:!job?<p>Loading…</p>:<><div className="flex items-center gap-3">{job.status==='succeeded'?<Check className="text-success"/>:<Film className="text-primary"/>}<h1 className="text-3xl font-bold">{job.status==='succeeded'?t("Itangazo ryawe rirarangiye!","Congratulations! Your advertisement is ready."):t("Itangazo ryawe","Your advertisement")}</h1></div>{job.status==='succeeded'&&url?<><video className="mt-7 max-h-[65vh] w-full rounded-lg bg-surface" src={url} controls/><Button asChild className="mt-5"><a href={url} download="amamara-video.mp4"><Download/>{t("Kuramo video","Download video")}</a></Button><Button asChild variant="outline" className="ml-3 mt-5"><Link to="/app/create/$type" params={{type:'video'}}><RefreshCw/>{t("Tegura indi — igiciro gishya","Create another — new quote")}</Link></Button></>:<p role="status" className="mt-7 border-l-2 border-primary pl-4">{job.status==='blocked'?t("Gukora video ntibirahuzwa. Nta mafaranga yishyuwe.","Video generation is not connected. No charge has been taken."):job.status==='failed'?t("Gukora video ntibyakunze.","Video production failed."):job.status.replaceAll('_',' ')}</p>}<section className="mt-12 border-t pt-7"><h2 className="text-xl font-bold">{t("Ushaka irirenzeho?","Want to take it further?")}</h2><p className="mt-3 text-muted-foreground">{t("Abahanga bacu bagufashe gutegura itangazo ryuzuye.","Let our creative team transform your idea into a more complete, professional advertisement.")}</p><Button asChild className="mt-5"><Link to="/app/pro" search={{adType:job.ad_type,duration:job.duration,jobId:job.id}}>{t("Vugana n'umuhanga","Talk to a Pro")}</Link></Button></section></>}</main>;
}