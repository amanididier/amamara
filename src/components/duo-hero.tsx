// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

const slides = [
  { id:"video", kind:"video", src:"/ads/amamaza-showreel-placeholder.mp4", title:"Video yamamaza", business:"Video", headline:"Kora video yamamaza business yawe byoroshye.", english:"Bring your business to life with video ads.", description:"Video plays across both displays until it ends." },
  { id:"posts", kind:"posts", left:"/ads/amamaza-product-post-01.jpg", right:"/ads/amamaza-product-post-02.jpg", title:"Amafoto yo kwamamaza", business:"Social posts", headline:"Kora amafoto yo Postinga business yawe byoroshye.", english:"Create professional product posts with ease.", description:"Two product posts appear together, one on each display." },
  { id:"banner", kind:"banner", src:"/ads/amamaza-print-banner.jpg", title:"Icyapa cyamamaza", business:"Print banner", headline:"Ikorere icyapa cyamamaza business yawe byoroshye.", english:"Make a banner that gets your business noticed.", description:"A full-bleed banner spans both displays." },
] as const;
type Slide = (typeof slides)[number];

function loadTexture(url:string, half?:"left"|"right") {
  const texture = new THREE.TextureLoader().load(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  if (half) { texture.repeat.set(.5,1); texture.offset.set(half==="left"?0:.5,0); }
  return texture;
}
function coverTexture() {
  const canvas=document.createElement("canvas"); canvas.width=1024; canvas.height=768;
  const ctx=canvas.getContext("2d")!;
  const g=ctx.createLinearGradient(0,0,1024,768); g.addColorStop(0,"#34404d"); g.addColorStop(.5,"#111720"); g.addColorStop(1,"#080b10");
  ctx.fillStyle=g; ctx.fillRect(0,0,1024,768);
  ctx.fillStyle="rgba(255,255,255,.055)"; ctx.beginPath(); ctx.ellipse(510,180,420,230,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#f8fafc"; ctx.font="700 78px Arial"; ctx.textAlign="center"; ctx.fillText("amamaza",512,410);
  ctx.fillStyle="rgba(255,255,255,.5)"; ctx.font="22px Arial"; ctx.fillText("DUO  ·  RWANDA",512,460);
  for(const x of [770,850,930]){ctx.fillStyle="#080b10";ctx.beginPath();ctx.arc(x,100,25,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#8793a2";ctx.lineWidth=5;ctx.stroke();}
  const texture=new THREE.CanvasTexture(canvas); texture.colorSpace=THREE.SRGBColorSpace; return texture;
}

function ThreeFoldable({slide,replayKey,paused,foldValue,onVideoEnded}:{slide:Slide;replayKey:number;paused:boolean;foldValue:number;onVideoEnded:()=>void}) {
  const host=useRef<HTMLDivElement>(null);
  const sceneState=useRef<{left:THREE.Group;leftScreen:THREE.Mesh;rightScreen:THREE.Mesh;renderer:THREE.WebGLRenderer;controls:OrbitControls;video?:HTMLVideoElement;raf:number;fold:number;target:number}|null>(null);
  const ended=useRef(onVideoEnded); ended.current=onVideoEnded;

  useEffect(()=>{
    const root=host.current; if(!root)return;
    let disposed=false;
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(32,1,.1,100); camera.position.set(0,.2,14);
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"high-performance"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)); renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.15; root.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xffffff,0x77808d,2));
    const key=new THREE.DirectionalLight(0xffffff,3); key.position.set(-5,8,10); scene.add(key);
    const rim=new THREE.DirectionalLight(0xb7d2ff,1.8); rim.position.set(8,3,-8); scene.add(rim);

    const device=new THREE.Group(); scene.add(device);
    const width=3.15,height=4.72,depth=.19;
    const metal=new THREE.MeshStandardMaterial({color:0x858d99,metalness:.88,roughness:.23});
    const dark=new THREE.MeshStandardMaterial({color:0x171b22,metalness:.72,roughness:.28});
    const black=new THREE.MeshBasicMaterial({color:0x080a0e});
    const bodyGeo=new THREE.BoxGeometry(width,height,depth);
    const right=new THREE.Group(); right.position.x=width/2; device.add(right);
    const rightBody=new THREE.Mesh(bodyGeo,metal); right.add(rightBody);
    const rightBezel=new THREE.Mesh(new THREE.PlaneGeometry(width+.035,height-.18),black); rightBezel.position.z=depth/2+.003; right.add(rightBezel);
    const rightScreen=new THREE.Mesh(new THREE.PlaneGeometry(width+.02,height-.24),black.clone()); rightScreen.position.z=depth/2+.010; right.add(rightScreen);

    const left=new THREE.Group(); device.add(left);
    const leftBody=new THREE.Mesh(bodyGeo,metal); leftBody.position.x=-width/2; left.add(leftBody);
    const leftBezel=new THREE.Mesh(new THREE.PlaneGeometry(width-.16,height-.16),black); leftBezel.position.set(-width/2,0,depth/2+.003); left.add(leftBezel);
    const leftScreen=new THREE.Mesh(new THREE.PlaneGeometry(width-.27,height-.27),black.clone()); leftScreen.position.set(-width/2,0,depth/2+.011); left.add(leftScreen);

    const outer=new THREE.Mesh(new THREE.PlaneGeometry(width-.12,height-.12),new THREE.MeshBasicMaterial({map:coverTexture()}));
    outer.position.set(-width/2,0,-depth/2-.012); outer.rotation.y=Math.PI; left.add(outer);
    const hinge=new THREE.Mesh(new THREE.CylinderGeometry(.105,.105,height+.08,32),dark); hinge.rotation.z=Math.PI/2; hinge.position.set(0,0,-depth/2-.018); device.add(hinge);
    
    const railMat=new THREE.MeshStandardMaterial({color:0x454d58,metalness:.9,roughness:.22});
    for(const x of [-width,width]){const rail=new THREE.Mesh(new THREE.BoxGeometry(.035,height-.55,.075),railMat);rail.position.set(x,0,-.035);device.add(rail);}

    const controls=new OrbitControls(camera,renderer.domElement); controls.enableDamping=true; controls.dampingFactor=.075; controls.enablePan=false;
    controls.minDistance=9; controls.maxDistance=23; controls.minPolarAngle=Math.PI*.22; controls.maxPolarAngle=Math.PI*.78; controls.target.set(0,0,0); controls.update();
    const resize=()=>{const b=root.getBoundingClientRect();if(!b.width||!b.height)return;renderer.setSize(b.width,b.height,false);camera.aspect=b.width/b.height;camera.fov=2*Math.atan(b.height/2/520)*180/Math.PI;camera.updateProjectionMatrix();};
    const observer=new ResizeObserver(resize);observer.observe(root);resize();
    const state={left,leftScreen,rightScreen,renderer,controls,raf:0,fold:Math.PI,target:Math.PI};sceneState.current=state;
    let last=performance.now();
    const render=(now:number)=>{if(disposed)return;const dt=Math.min((now-last)/1000,.05);last=now;state.fold+=(state.target-state.fold)*(1-Math.exp(-dt*3.2));if(Math.abs(state.target-state.fold)<.001)state.fold=state.target;left.rotation.y=state.fold;controls.update();renderer.render(scene,camera);state.raf=requestAnimationFrame(render);};
    state.raf=requestAnimationFrame(render);
    const openTimer=window.setTimeout(()=>{if(sceneState.current)sceneState.current.target=0;},520);
    return ()=>{
      disposed=true;window.clearTimeout(openTimer);cancelAnimationFrame(state.raf);observer.disconnect();controls.dispose();
      if(state.video){state.video.pause();state.video.removeAttribute("src");state.video.load();state.video.remove();}
      scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{if("map" in m&&m.map)m.map.dispose();m.dispose();});}});
      renderer.dispose();renderer.domElement.remove();sceneState.current=null;
    };
  },[]);

  useEffect(()=>{
    const state=sceneState.current;if(!state)return;
    const video=document.createElement("video");let textures:THREE.Texture[]=[];
    if(slide.kind==="video"){
      video.src=slide.src;video.muted=true;video.playsInline=true;video.preload="auto";video.style.display="none";document.body.appendChild(video);
      video.addEventListener("ended",()=>ended.current(),{once:true});
      const base=new THREE.VideoTexture(video);base.colorSpace=THREE.SRGBColorSpace;base.minFilter=THREE.LinearFilter;base.magFilter=THREE.LinearFilter;
      const l=base.clone();l.repeat.set(.5,1);l.offset.set(0,0);l.needsUpdate=true;
      const r=base.clone();r.repeat.set(.5,1);r.offset.set(.5,0);r.needsUpdate=true;
      (state.leftScreen.material as THREE.MeshBasicMaterial).map=l;(state.rightScreen.material as THREE.MeshBasicMaterial).map=r;textures=[l,r,base];state.video=video;
    }else{
      const l=loadTexture(slide.kind==="posts"?slide.left:slide.src,slide.kind==="banner"?"left":undefined);
      const r=loadTexture(slide.kind==="posts"?slide.right:slide.src,slide.kind==="banner"?"right":undefined);
      (state.leftScreen.material as THREE.MeshBasicMaterial).map=l;(state.rightScreen.material as THREE.MeshBasicMaterial).map=r;textures=[l,r];
    }
    (state.leftScreen.material as THREE.MeshBasicMaterial).needsUpdate=true;(state.rightScreen.material as THREE.MeshBasicMaterial).needsUpdate=true;
    if(slide.kind==="video"&&!paused)void video.play().catch(()=>{});
    return()=>{video.pause();video.removeAttribute("src");video.load();video.remove();if(state.video===video)state.video=undefined;textures.forEach(t=>t.dispose());};
  },[slide.id]);

  useEffect(()=>{const v=sceneState.current?.video;if(!v)return;if(paused)v.pause();else void v.play().catch(()=>{});},[paused,slide.id]);
  useEffect(()=>{const s=sceneState.current;if(s)s.target=Math.PI*foldValue;},[foldValue]);
  useEffect(()=>{const s=sceneState.current;if(!s)return;s.target=Math.PI;const timer=window.setTimeout(()=>{if(sceneState.current)sceneState.current.target=0;},100);return()=>window.clearTimeout(timer);},[replayKey]);
  return <div ref={host} className="amamaza-three-stage" role="img" aria-label="Interactive Amamaza foldable phone. Drag to rotate and scroll to zoom." />;
}

export function DuoHero() {
  const {t,lang}=usePrefs();
  const [active,setActive]=useState(0);
  const [isPaused,setIsPaused]=useState(false);
  const [replayKey,setReplayKey]=useState(0);
  const [foldValue,setFoldValue]=useState(0);
  const current=slides[active]!;
  useEffect(()=>{if(isPaused||current.kind==="video")return;const timer=window.setTimeout(()=>setActive(i=>(i+1)%slides.length),current.kind==="banner"?5000:3500);return()=>window.clearTimeout(timer);},[active,current.kind,isPaused]);
  useEffect(()=>{const visibility=()=>{if(document.visibilityState==="hidden")setIsPaused(true);};document.addEventListener("visibilitychange",visibility);return()=>document.removeEventListener("visibilitychange",visibility);},[]);
  const move=useCallback((direction:number)=>setActive(i=>(i+direction+slides.length)%slides.length),[]);
  const headline=lang==="rw"?current.headline:current.english;
  return (
    <section className="duo-hero relative isolate overflow-hidden pb-16 sm:pb-20">
      <div className="duo-hero__inner relative mx-auto grid max-w-7xl items-center gap-8 px-4 pt-10 sm:px-6 sm:pt-14">
        <div className="duo-hero__copy relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold"><span className="size-1.5 rounded-full bg-creative"/>{t("Byakozwe ku bucuruzi bwo mu Rwanda","Built for Rwandan businesses")}</span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">{t("Amamaza yawe,","Your ads,")} <span className="text-primary">{t("mu buryo bworoshye.","made simple.")}</span></h1>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">{t("Kora post, video n'ibyapa by'ubucuruzi bwawe ukoresheje AI. Nta bumenyi bwihariye bwo gushushanya busabwa.","Create social posts, video ads and storefront banners with AI. No design skills needed.")}</p>
          <div className="duo-hero__story mt-7 min-h-[116px]" aria-live="polite">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{current.business} · {active+1} / {slides.length}</p>
            <h2 className="mt-2 text-xl font-bold leading-tight sm:text-2xl">{headline}</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">{current.description}</p>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a href="/app/create" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 font-semibold text-primary-foreground glow-primary transition-transform hover:scale-[1.03]">{t("Tangira gukora","Start creating")} <ArrowRight className="size-4"/></a>
            <a href="#trending" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border bg-card px-7 font-semibold hover:bg-accent"><Play className="size-4 fill-current"/> {t("Reba ingero","See examples")}</a>
          </div>
        </div>
        <div className="duo-hero__visual relative flex items-center justify-center">
          <ThreeFoldable slide={current} replayKey={replayKey} paused={isPaused} foldValue={foldValue} onVideoEnded={()=>setActive(1)}/>
          <div className="duo-controls" aria-label="Advertisement showcase controls">
            <button type="button" onClick={()=>move(-1)} aria-label={t("Ibanze","Previous ad")}><ArrowLeft className="size-4"/></button>
            <button type="button" onClick={()=>setIsPaused(p=>!p)} aria-label={isPaused?t("Komeza","Play showcase"):t("Hagarika","Pause showcase")}>{isPaused?<Play className="size-4 fill-current"/>:<Pause className="size-4"/>}</button>
            <button type="button" onClick={()=>move(1)} aria-label={t("Ikurikira","Next ad")}><ArrowRight className="size-4"/></button>
            <button type="button" onClick={()=>{setFoldValue(0);setReplayKey(k=>k+1);}} aria-label={t("Subiramo gufunguka","Replay fold animation")}><RotateCcw className="size-4"/></button>
          </div>
          <div className="duo-fold-control"><span>{t("GUFUNGA","FOLD")}</span><input aria-label={t("Urwego rwo gufunga","Fold angle")} type="range" min="0" max="1" step="0.01" value={foldValue} onChange={e=>setFoldValue(Number(e.target.value))}/></div>
          <div className="duo-dots">{slides.map((slide,index)=><button key={slide.id} type="button" onClick={()=>setActive(index)} aria-label={slide.title} aria-current={index===active?"true":undefined} className={cn(index===active&&"is-active")}/>)}</div>
          <span className="duo-counter">{String(active+1).padStart(2,"0")} / 03</span>
        </div>
      </div>
    </section>
  );
}
