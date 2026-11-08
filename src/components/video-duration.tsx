import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { UserRound, Check } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { durations } from "@/lib/agency";
import { formatRWF } from "@/lib/pricing";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";
import type { Brief } from "@/lib/ad-skills";

export function useVideoPrice(adType: string, duration: number, sound: boolean, enabled: boolean) {
  const [quote,setQuote]=useState<{total:number}|null>(null); const [error,setError]=useState('');
  useEffect(()=>{ let active=true;setQuote(null);setError('');if(!enabled)return;
    void supabase.rpc('video_price',{ad_type:adType,seconds:duration,sound}).then(({data,error:e})=>{if(!active)return;if(e)setError(e.message);else if(data && typeof data==='object' && !Array.isArray(data) && typeof data['total']==='number')setQuote({total:data['total']});});
    return()=>{active=false;};
  },[adType,duration,sound,enabled]); return {quote,error};
}
export function VideoDuration({brief,onChange}:{brief:Brief;onChange:(duration:number)=>void}) {
  const {t,lang}=usePrefs();const navigate=useNavigate();
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{durations.map(d=><Button key={d.seconds} variant="outline" aria-pressed={brief.duration===d.seconds} className={cn('h-auto min-h-40 flex-col items-start justify-between whitespace-normal p-4 text-left',d.pro&&'border-creative/40',brief.duration===d.seconds&&'border-primary bg-primary/10')} onClick={()=>{
    if(d.pro){localStorage.setItem('amamaza-pro-campaign',JSON.stringify(brief));void navigate({to:'/app/pro',search:{adType:brief.videoStyle,duration:d.seconds}});}else onChange(d.seconds);
  }}><span className="flex w-full items-center justify-between"><strong className="text-2xl">{d.seconds===60?'1 min':`${d.seconds}s`}</strong>{d.pro?<UserRound className="size-4 text-creative"/>:brief.duration===d.seconds?<Check className="size-4 text-primary"/>:null}</span><span className="font-semibold">{d[lang]}</span><span className="text-xs text-muted-foreground">{d.pro?t('Vugana n’umuhanga','Talk to a Pro'):d.seconds===15?t('Igihe gisanzwe','Default duration'):t('Igiciro gito','Affordable self-service')}</span>{!d.pro&&<DurationPrice adType={brief.videoStyle||'product'} duration={d.seconds} sound={Boolean(brief.sound)}/>}</Button>)}</div>;
}
function DurationPrice({adType,duration,sound}:{adType:string;duration:number;sound:boolean}){const {quote,error}=useVideoPrice(adType,duration,sound,true);return <span className="text-xs font-semibold">{error?'—':quote?formatRWF(quote.total):'…'}</span>;}