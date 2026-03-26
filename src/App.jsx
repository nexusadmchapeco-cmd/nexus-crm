import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPA_URL = "https://tmkjtyhybfbaqcqovuem.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRta2p0eWh5YmZiYXFjcW92dWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NDY5MjYsImV4cCI6MjA5MDEyMjkyNn0.ZqBH1WkFsXREV9oaDotWkC9kVNt1bA_ERjEZTNjeWO0";
const supabase = createClient(SUPA_URL, SUPA_KEY);
const LOGO_B64 = "data:image/png;base64,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";

const STAGES = [
  { id:"novo",        label:"Novo Lead",           emoji:"✦", hex:"#94a3b8", role:"sdr" },
  { id:"contato",     label:"Contato Feito",        emoji:"✉", hex:"#60a5fa", role:"sdr" },
  { id:"info",        label:"Informações Passadas", emoji:"📋", hex:"#818cf8", role:"sdr" },
  { id:"qualificado", label:"Qualificado",          emoji:"⚡", hex:"#f59e0b", role:"sdr" },
  { id:"naoqualif",   label:"Não Qualificado",      emoji:"✕", hex:"#94a3b8", role:"sdr" },
  { id:"reuniao",     label:"Reunião Agendada",     emoji:"📅", hex:"#a78bfa", role:"sdr" },
  { id:"negociacao",  label:"Negociação",           emoji:"◈", hex:"#38bdf8", role:"closer" },
  { id:"matriculado", label:"Matriculado",          emoji:"✔", hex:"#10b981", role:"closer" },
  { id:"perdido",     label:"Perdido",              emoji:"✗", hex:"#f87171", role:"closer" },
];

const COURSES  = ["Nexus Class","Nexus Flex","Nexus Private","Nexus Junior","Nexus Travel"];
const SOURCES  = ["Instagram","Indicação","Google","WhatsApp","Site","TikTok","Outros"];
const CTYPES   = ["WhatsApp","Ligação","Email","Reunião","Anotação"];
const NAV_ITEMS = [
  { id:"pipeline",   icon:"◫", label:"Pipeline"  },
  { id:"dashboard",  icon:"⬡", label:"Dashboard" },
  { id:"leads",      icon:"◎", label:"Leads"     },
  { id:"agenda",     icon:"📅", label:"Agenda"    },
  { id:"followups",  icon:"◷", label:"Follow-up" },
  { id:"relatorios", icon:"◈", label:"Relatórios"},
];

function today()   { return new Date().toISOString().split("T")[0]; }
function sub(d)    { const dt=new Date(); dt.setDate(dt.getDate()-d); return dt.toISOString(); }
function future(d) { const dt=new Date(); dt.setDate(dt.getDate()+d); return dt.toISOString().split("T")[0]; }
function uid()     { return Date.now().toString(36)+Math.random().toString(36).slice(2); }
function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR",{day:"2-digit",month:"short"})+" "+d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
}
function fmtDateShort(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"2-digit"});
}

const T = {
  bg:"#f7f6f3", surface:"#ffffff", border:"#e8e4de",
  text:"#1a1714", muted:"#8c8580",
  accent:"#0d7377", accentLight:"#e6f4f4",
  gold:"#c9922a", goldLight:"#fdf5e8",
  orange:"#d4551a",
  radius:14,
};

function useIsMobile() {
  const [m,setM]=useState(window.innerWidth<768);
  useEffect(()=>{ const fn=()=>setM(window.innerWidth<768); window.addEventListener("resize",fn); return()=>window.removeEventListener("resize",fn); },[]);
  return m;
}

/* ─── GLOBAL STYLES ─────────────────────────────────────────────── */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;400;500;600;700&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      html{-webkit-text-size-adjust:100%;}
      body{font-family:'DM Sans',sans-serif;background:${T.bg};color:${T.text};overscroll-behavior:none;}
      ::-webkit-scrollbar{width:4px;height:4px;}
      ::-webkit-scrollbar-thumb{background:#d0cbc4;border-radius:4px;}
      input,select,textarea{font-family:'DM Sans',sans-serif;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes slideUp{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}
      @keyframes goalPop{from{opacity:0;transform:scale(.2) rotate(-12deg)}to{opacity:1;transform:scale(1) rotate(0)}}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
      .c-hover{transition:box-shadow .18s,transform .18s;}
      .c-hover:hover{box-shadow:0 8px 28px rgba(0,0,0,.10)!important;transform:translateY(-2px);}
      .nav-itm:hover{background:rgba(13,115,119,.07)!important;}
      .rw:hover td{background:#f7f6f3;}
      .gh:hover{background:#f0ede8!important;}
      .tap{-webkit-tap-highlight-color:transparent;}
    `}</style>
  );
}

/* ─── SHARED UI ─────────────────────────────────────────────────── */
function Spinner() {
  return <div style={{width:20,height:20,border:`2px solid ${T.border}`,borderTop:`2px solid ${T.accent}`,borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto"}} />;
}
function Pill({color,children}) {
  return <span style={{display:"inline-flex",alignItems:"center",background:color+"18",color,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:600}}>{children}</span>;
}
function Inp({label,...p}) {
  const base={width:"100%",background:T.bg,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"11px 13px",fontSize:16,color:T.text,outline:"none",transition:"border .15s"};
  return (
    <label style={{display:"block"}}>
      {label&&<span style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>{label}</span>}
      {p.type==="textarea"?<textarea {...p} style={{...base,resize:"vertical",minHeight:76,fontSize:16}}/>
        :<input {...p} style={base} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>}
    </label>
  );
}
function Sel({label,options,...p}) {
  return (
    <label style={{display:"block"}}>
      {label&&<span style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>{label}</span>}
      <select {...p} style={{width:"100%",background:T.bg,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"11px 13px",fontSize:16,color:T.text,outline:"none",fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}>
        {options.map(o=>typeof o==="string"?<option key={o}>{o}</option>:<option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
function Btn({variant="primary",onClick,children,style:s,full,loading,disabled}) {
  const base={display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:15,cursor:disabled?"not-allowed":"pointer",border:"none",borderRadius:11,padding:"11px 20px",transition:"all .15s",width:full?"100%":"auto",opacity:disabled?.6:1,WebkitTapHighlightColor:"transparent",...s};
  const V={primary:{...base,background:T.accent,color:"#fff"},ghost:{...base,background:"transparent",color:T.muted,border:`1.5px solid ${T.border}`},danger:{...base,background:"#fef2f2",color:"#dc2626",border:"1.5px solid #fecaca"},gold:{...base,background:T.gold,color:"#fff"},orange:{...base,background:T.orange,color:"#fff"}};
  return <button className={variant==="ghost"?"gh tap":"tap"} onClick={onClick} disabled={disabled||loading} style={V[variant]||V.primary}>{loading?<Spinner/>:children}</button>;
}
function Modal({title,subtitle,onClose,children,width=520,mob}) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,background:"rgba(26,23,20,.45)",display:"flex",alignItems:mob?"flex-end":"center",justifyContent:"center",zIndex:999,padding:mob?0:20,backdropFilter:"blur(6px)",animation:"fadeIn .18s"}}>
      <div style={{background:T.surface,borderRadius:mob?"20px 20px 0 0":20,width:"100%",maxWidth:mob?"100%":width,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(0,0,0,.2)",animation:mob?"slideUp .25s":"fadeUp .22s"}}>
        {mob&&<div style={{width:40,height:4,background:"#d1cdc7",borderRadius:2,margin:"12px auto 0"}}/>}
        <div style={{padding:mob?"14px 20px 0":"24px 28px 0",borderBottom:`1px solid ${T.border}`,paddingBottom:14,marginTop:mob?6:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:mob?20:22,fontWeight:400,color:T.text}}>{title}</h2>
              {subtitle&&<p style={{fontSize:13,color:T.muted,marginTop:3}}>{subtitle}</p>}
            </div>
            <button onClick={onClose} style={{background:T.bg,border:"none",borderRadius:8,width:32,height:32,fontSize:18,color:T.muted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>×</button>
          </div>
        </div>
        <div style={{padding:mob?"16px 20px 28px":"22px 28px 28px"}}>{children}</div>
      </div>
    </div>
  );
}

/* ─── LOGIN ──────────────────────────────────────────────────────── */
function LoginScreen() {
  const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[loading,setLoading]=useState(false),[error,setError]=useState("");
  const submit=async()=>{
    if(!email||!password){setError("Preencha email e senha.");return;}
    setLoading(true);setError("");
    const{error:err}=await supabase.auth.signInWithPassword({email,password});
    if(err)setError("Email ou senha incorretos.");
    setLoading(false);
  };
  return (
    <div style={{minHeight:"100vh",background:"#0d1f22",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:T.surface,borderRadius:20,padding:"40px 36px",width:"100%",maxWidth:400,boxShadow:"0 8px 40px rgba(0,0,0,.3)",animation:"fadeUp .3s"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <img src={LOGO_B64} alt="Nexus" style={{height:60,objectFit:"contain",marginBottom:16,filter:"brightness(0) invert(0)"}} />
          <p style={{color:T.muted,fontSize:14,marginTop:8}}>Acesso exclusivo — equipe comercial</p>
        </div>
        <div style={{display:"grid",gap:14}}>
          <Inp label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="seu@email.com"/>
          <Inp label="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="••••••••"/>
          {error&&<div style={{background:"#fef2f2",color:"#dc2626",borderRadius:9,padding:"10px 14px",fontSize:13,fontWeight:600}}>⚠ {error}</div>}
          <Btn onClick={submit} loading={loading} full>Entrar</Btn>
        </div>
      </div>
    </div>
  );
}

/* ─── CELEBRATION ────────────────────────────────────────────────── */
function GoalCelebration({onDone}) {
  const ref=useRef(null),anim=useRef(null);
  useEffect(()=>{
    try {
      const ctx=new(window.AudioContext||window.webkitAudioContext)();
      // Crowd roar
      const bs=ctx.sampleRate*2.5,buf=ctx.createBuffer(1,bs,ctx.sampleRate),d=buf.getChannelData(0);
      for(let i=0;i<bs;i++)d[i]=(Math.random()*2-1);
      const ns=ctx.createBufferSource();ns.buffer=buf;
      const fl=ctx.createBiquadFilter();fl.type="bandpass";fl.frequency.value=800;fl.Q.value=0.4;
      const gn=ctx.createGain();gn.gain.setValueAtTime(0,ctx.currentTime);gn.gain.linearRampToValueAtTime(0.7,ctx.currentTime+0.1);gn.gain.linearRampToValueAtTime(0.5,ctx.currentTime+1.5);gn.gain.linearRampToValueAtTime(0,ctx.currentTime+2.5);
      ns.connect(fl);fl.connect(gn);gn.connect(ctx.destination);ns.start();ns.stop(ctx.currentTime+2.5);
      // Air horn
      [0,0.05,0.1].forEach((t,i)=>{
        const o=ctx.createOscillator(),g=ctx.createGain();
        o.type="sawtooth";o.frequency.value=220+i*30;
        g.gain.setValueAtTime(0,ctx.currentTime+t);g.gain.linearRampToValueAtTime(0.5,ctx.currentTime+t+0.05);g.gain.linearRampToValueAtTime(0,ctx.currentTime+t+0.35);
        const dist=ctx.createWaveShaper();const curve=new Float32Array(256);for(let j=0;j<256;j++)curve[j]=j<128?j/128:-1+(j-128)/128;dist.curve=curve;
        o.connect(dist);dist.connect(g);g.connect(ctx.destination);o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+0.4);
      });
      // Whistle
      [0.4,0.55].forEach(t=>{
        const o=ctx.createOscillator(),g=ctx.createGain();o.type="sine";o.frequency.value=3800;
        g.gain.setValueAtTime(0,ctx.currentTime+t);g.gain.linearRampToValueAtTime(0.45,ctx.currentTime+t+0.02);g.gain.linearRampToValueAtTime(0,ctx.currentTime+t+0.18);
        o.connect(g);g.connect(ctx.destination);o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+0.25);
      });
      // Rising cheer
      const osc2=ctx.createOscillator(),g2=ctx.createGain();
      osc2.type="sawtooth";osc2.frequency.setValueAtTime(160,ctx.currentTime+0.3);osc2.frequency.linearRampToValueAtTime(280,ctx.currentTime+1.8);
      g2.gain.setValueAtTime(0,ctx.currentTime+0.3);g2.gain.linearRampToValueAtTime(0.15,ctx.currentTime+0.6);g2.gain.linearRampToValueAtTime(0,ctx.currentTime+2.2);
      const fl2=ctx.createBiquadFilter();fl2.type="lowpass";fl2.frequency.value=500;
      osc2.connect(fl2);fl2.connect(g2);g2.connect(ctx.destination);osc2.start(ctx.currentTime+0.3);osc2.stop(ctx.currentTime+2.3);
    } catch(e){}
    const canvas=ref.current;if(!canvas)return;
    canvas.width=window.innerWidth;canvas.height=window.innerHeight;
    const cx=canvas.getContext("2d");
    const COLS=["#10b981","#f59e0b","#ef4444","#60a5fa","#fbbf24","#34d399","#a78bfa","#fff","#ff6b35","#ff3366"];
    const ps=Array.from({length:250},()=>({x:Math.random()*canvas.width,y:-30-Math.random()*300,r:4+Math.random()*10,color:COLS[Math.floor(Math.random()*COLS.length)],vx:(Math.random()-.5)*9,vy:4+Math.random()*7,rot:Math.random()*Math.PI*2,rv:(Math.random()-.5)*.22,sh:Math.random()>.5?"r":"c",op:1}));
    let fr=0;
    const tick=()=>{cx.clearRect(0,0,canvas.width,canvas.height);let alive=false;
      ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.rot+=p.rv;p.vy+=0.15;
        if(p.y<canvas.height+30){alive=true;p.op=Math.max(0,1-p.y/(canvas.height*1.1));}
        cx.save();cx.globalAlpha=p.op;cx.translate(p.x,p.y);cx.rotate(p.rot);cx.fillStyle=p.color;
        if(p.sh==="r")cx.fillRect(-p.r,-p.r/2,p.r*2,p.r);else{cx.beginPath();cx.arc(0,0,p.r/2,0,Math.PI*2);cx.fill();}
        cx.restore();
      });
      fr++;if(alive&&fr<320)anim.current=requestAnimationFrame(tick);else onDone();
    };
    anim.current=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(anim.current);
  },[]);
  return (
    <>
      <canvas ref={ref} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999}}/>
      <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:9998,pointerEvents:"none"}}>
        <div style={{animation:"goalPop .5s cubic-bezier(.17,.67,.35,1.4)",textAlign:"center",background:"rgba(255,255,255,.95)",borderRadius:24,padding:"32px 48px",boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
          <div style={{fontSize:64,lineHeight:1,animation:"bounce 0.6s ease infinite"}}>🎉</div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:36,color:T.accent,letterSpacing:"-1px",marginTop:12,fontWeight:400}}>mais uma matrícula,</div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:42,color:T.orange,letterSpacing:"-1px",fontStyle:"italic",marginTop:4}}>é nós guri! 🔥</div>
          <div style={{fontSize:14,color:T.muted,marginTop:12,fontWeight:600}}>Pipeline atualizado ✔</div>
        </div>
      </div>
    </>
  );
}

/* ─── QUICK ADD LEAD MODAL ───────────────────────────────────────── */
function QuickAddModal({onAdd,onClose,mob}) {
  const [form,setForm]=useState({name:"",phone:"",course:"",source:"",responsavel:""});
  const [saving,setSaving]=useState(false);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const submit=async()=>{
    if(!form.name.trim()||!form.phone.trim()){alert("Nome e telefone são obrigatórios.");return;}
    setSaving(true);
    const id=uid();
    const{error}=await supabase.from("leads").insert({
      id,name:form.name,phone:form.phone,course:form.course||null,source:form.source||null,
      stage:"novo",notes:null,responsavel:form.responsavel||null,created_at:new Date().toISOString(),
    });
    if(!error){onAdd({id,name:form.name,phone:form.phone,course:form.course,source:form.source,stage:"novo",notes:"",responsavel:form.responsavel,createdAt:new Date().toISOString(),history:[],followUp:null});onClose();}
    else alert("Erro ao salvar.");
    setSaving(false);
  };
  return (
    <Modal title="⚡ Cadastro Rápido" subtitle="Preencha os dados essenciais" onClose={onClose} mob={mob} width={440}>
      <div style={{display:"grid",gap:13}}>
        <Inp label="Nome *" value={form.name} onChange={e=>f("name",e.target.value)} placeholder="Nome do lead" autoFocus/>
        <Inp label="Telefone *" value={form.phone} onChange={e=>f("phone",e.target.value)} placeholder="(54) 99999-9999"/>
        <Sel label="Curso" value={form.course} onChange={e=>f("course",e.target.value)} options={[{value:"",label:"Selecione..."},...COURSES.map(c=>({value:c,label:c}))]}/>
        <Sel label="Origem" value={form.source} onChange={e=>f("source",e.target.value)} options={[{value:"",label:"Selecione..."},...SOURCES.map(s=>({value:s,label:s}))]}/>
        <Inp label="Responsável (opcional)" value={form.responsavel} onChange={e=>f("responsavel",e.target.value)} placeholder="Nome do responsável"/>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:4}}>
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn onClick={submit} loading={saving} full={mob}>➕ Adicionar ao Pipeline</Btn>
        </div>
      </div>
    </Modal>
  );
}

/* ─── FULL ADD LEAD MODAL ────────────────────────────────────────── */
function AddLeadModal({onAdd,onClose,mob}) {
  const [form,setForm]=useState({name:"",phone:"",email:"",course:"",source:"",notes:"",stage:"novo",responsavel:""});
  const [saving,setSaving]=useState(false);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const submit=async()=>{
    if(!form.name.trim()||!form.phone.trim()){alert("Nome e telefone são obrigatórios.");return;}
    setSaving(true);
    const id=uid();
    const{error}=await supabase.from("leads").insert({
      id,name:form.name,phone:form.phone,email:form.email||null,course:form.course||null,
      source:form.source||null,stage:form.stage,notes:form.notes||null,
      responsavel:form.responsavel||null,created_at:new Date().toISOString(),
    });
    if(!error){onAdd({...form,id,createdAt:new Date().toISOString(),history:[],followUp:null});onClose();}
    else alert("Erro ao salvar.");
    setSaving(false);
  };
  return (
    <Modal title="Novo Lead" subtitle="Preencha os dados do prospect" onClose={onClose} mob={mob}>
      <div style={{display:"grid",gap:13}}>
        <Inp label="Nome completo *" value={form.name} onChange={e=>f("name",e.target.value)}/>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:11}}>
          <Inp label="Telefone *" value={form.phone} onChange={e=>f("phone",e.target.value)} placeholder="(54) 99999-9999"/>
          <Inp label="Email" value={form.email} onChange={e=>f("email",e.target.value)} placeholder="email@exemplo.com"/>
          <Sel label="Curso" value={form.course} onChange={e=>f("course",e.target.value)} options={[{value:"",label:"Selecione..."},...COURSES.map(c=>({value:c,label:c}))]}/>
          <Sel label="Origem" value={form.source} onChange={e=>f("source",e.target.value)} options={[{value:"",label:"Selecione..."},...SOURCES.map(s=>({value:s,label:s}))]}/>
        </div>
        <Inp label="Responsável (opcional)" value={form.responsavel} onChange={e=>f("responsavel",e.target.value)} placeholder="Nome do responsável"/>
        <Sel label="Etapa inicial" value={form.stage} onChange={e=>f("stage",e.target.value)} options={STAGES.map(s=>({value:s.id,label:s.label}))}/>
        <Inp label="Observações" type="textarea" value={form.notes} onChange={e=>f("notes",e.target.value)} placeholder="Informações relevantes..."/>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn onClick={submit} loading={saving} full={mob}>Salvar Lead</Btn>
        </div>
      </div>
    </Modal>
  );
}

/* ─── KANBAN ─────────────────────────────────────────────────────── */
function KanbanBoard({leads,onSelect,onMove,mob,onQuickAdd}) {
  const [dragOver,setDragOver]=useState(null);
  const [celebrating,setCelebrating]=useState(false);
  const [activeStage,setActiveStage]=useState("novo");
  const dragging=useRef(null);
  const ts=today();
  const sdrStages=STAGES.filter(s=>s.role==="sdr");
  const closerStages=STAGES.filter(s=>s.role==="closer");

  const LeadCard=({lead,stage})=>{
    const isTd=lead.followUp?.date===ts,ov=lead.followUp?.date&&lead.followUp.date<ts;
    return (
      <div draggable={!mob} onDragStart={()=>dragging.current=lead.id}
        onClick={()=>onSelect(lead)} className="c-hover"
        style={{background:T.surface,borderRadius:10,padding:"12px 14px",border:`1px solid ${T.border}`,cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,.05)",borderTop:`2.5px solid ${stage.hex}`}}>
        <div style={{fontWeight:600,fontSize:13,marginBottom:3}}>{lead.name}</div>
        <div style={{fontSize:11,color:T.muted,marginBottom:2}}>{lead.course||"—"}</div>
        {lead.responsavel&&<div style={{fontSize:11,color:T.accent,marginBottom:2}}>👤 {lead.responsavel}</div>}
        {(isTd||ov)&&<div style={{background:ov?"#fef2f2":"#fefce8",color:ov?"#b91c1c":"#92400e",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700,marginTop:4,display:"inline-block"}}>{ov?"⚠ Atrasado":"🔔 Hoje"}</div>}
      </div>
    );
  };

  if(mob) {
    const stage=STAGES.find(s=>s.id===activeStage);
    const stLeads=leads.filter(l=>l.stage===activeStage);
    return (
      <div style={{animation:"fadeUp .3s"}}>
        {celebrating&&<GoalCelebration onDone={()=>setCelebrating(false)}/>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:26,fontWeight:400}}>Pipeline</h1>
          <Btn onClick={onQuickAdd} style={{padding:"8px 14px",fontSize:13}}>⚡ Novo Lead</Btn>
        </div>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:10,marginBottom:16,WebkitOverflowScrolling:"touch"}}>
          {STAGES.map(s=>{const cnt=leads.filter(l=>l.stage===s.id).length,on=s.id===activeStage;return(
            <button key={s.id} onClick={()=>setActiveStage(s.id)} className="tap"
              style={{flexShrink:0,background:on?s.hex:T.surface,color:on?"white":T.muted,border:`1.5px solid ${on?s.hex:T.border}`,borderRadius:20,padding:"6px 12px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:4}}>
              {s.label}<span style={{background:on?"rgba(255,255,255,.25)":T.bg,borderRadius:10,padding:"1px 5px",fontSize:10}}>{cnt}</span>
            </button>
          );})}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {stLeads.length===0?<div style={{background:T.surface,border:`1.5px dashed ${T.border}`,borderRadius:T.radius,padding:32,textAlign:"center",color:T.muted}}>Nenhum lead nesta etapa</div>
          :stLeads.map(lead=><LeadCard key={lead.id} lead={lead} stage={stage}/>)}
        </div>
      </div>
    );
  }

  return (
    <div style={{animation:"fadeUp .3s"}}>
      {celebrating&&<GoalCelebration onDone={()=>setCelebrating(false)}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:32,fontWeight:400,letterSpacing:"-.5px"}}>Pipeline</h1>
          <p style={{color:T.muted,fontSize:14,marginTop:4}}>Arraste os cards entre as etapas</p>
        </div>
        <Btn onClick={onQuickAdd}>⚡ Novo Lead</Btn>
      </div>

      {/* SDR Section */}
      <div style={{marginBottom:8}}>
        <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
          <span style={{background:"#f1f5f9",borderRadius:6,padding:"3px 10px"}}>SDR</span>
          <div style={{flex:1,height:1,background:T.border}}/>
        </div>
        <div style={{display:"flex",gap:11,overflowX:"auto",paddingBottom:8,alignItems:"flex-start"}}>
          {sdrStages.map(stage=>{
            const sl=leads.filter(l=>l.stage===stage.id),over=dragOver===stage.id;
            return (
              <div key={stage.id}
                onDragOver={e=>{e.preventDefault();setDragOver(stage.id);}}
                onDragLeave={()=>setDragOver(null)}
                onDrop={e=>{e.preventDefault();if(dragging.current){onMove(dragging.current,stage.id);}setDragOver(null);dragging.current=null;}}
                style={{minWidth:200,flex:"0 0 200px",background:over?stage.hex+"10":T.bg,border:`1.5px solid ${over?stage.hex:T.border}`,borderRadius:T.radius,padding:12,transition:"all .18s"}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
                  <span style={{fontSize:13,color:stage.hex}}>{stage.emoji}</span>
                  <span style={{fontSize:11,fontWeight:700,color:T.text}}>{stage.label}</span>
                  <span style={{marginLeft:"auto",background:T.surface,border:`1px solid ${T.border}`,borderRadius:20,padding:"1px 7px",fontSize:11,fontWeight:700,color:T.muted}}>{sl.length}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8,minHeight:40}}>
                  {sl.map(lead=><LeadCard key={lead.id} lead={lead} stage={stage}/>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Closer Section */}
      <div>
        <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
          <span style={{background:"#fdf5e8",color:T.gold,borderRadius:6,padding:"3px 10px"}}>CLOSER</span>
          <div style={{flex:1,height:1,background:T.border}}/>
        </div>
        <div style={{display:"flex",gap:11,paddingBottom:8,alignItems:"flex-start"}}>
          {closerStages.map(stage=>{
            const sl=leads.filter(l=>l.stage===stage.id),over=dragOver===stage.id;
            return (
              <div key={stage.id}
                onDragOver={e=>{e.preventDefault();setDragOver(stage.id);}}
                onDragLeave={()=>setDragOver(null)}
                onDrop={e=>{e.preventDefault();if(dragging.current){const prev=leads.find(l=>l.id===dragging.current);onMove(dragging.current,stage.id);if(stage.id==="matriculado"&&prev?.stage!=="matriculado")setCelebrating(true);}setDragOver(null);dragging.current=null;}}
                style={{minWidth:200,flex:"0 0 200px",background:over?stage.hex+"10":T.bg,border:`1.5px solid ${over?stage.hex:T.border}`,borderRadius:T.radius,padding:12,transition:"all .18s"}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
                  <span style={{fontSize:13,color:stage.hex}}>{stage.emoji}</span>
                  <span style={{fontSize:11,fontWeight:700,color:T.text}}>{stage.label}</span>
                  <span style={{marginLeft:"auto",background:T.surface,border:`1px solid ${T.border}`,borderRadius:20,padding:"1px 7px",fontSize:11,fontWeight:700,color:T.muted}}>{sl.length}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8,minHeight:40}}>
                  {sl.map(lead=><LeadCard key={lead.id} lead={lead} stage={stage}/>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── AGENDA DO CLOSER ───────────────────────────────────────────── */
function AgendaCloser({leads,mob,supabase}) {
  const [slots,setSlots]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({lead_id:"",date:"",time:"",notes:""});
  const [saving,setSaving]=useState(false);

  useEffect(()=>{
    loadSlots();
  },[]);

  const loadSlots=async()=>{
    setLoading(true);
    const{data}=await supabase.from("agenda").select("*").order("date",{ascending:true});
    setSlots(data||[]);
    setLoading(false);
  };

  const saveSlot=async()=>{
    if(!form.lead_id||!form.date||!form.time){alert("Selecione o lead, data e horário.");return;}
    setSaving(true);
    const id=uid();
    const{error}=await supabase.from("agenda").insert({id,lead_id:form.lead_id,date:form.date,time:form.time,notes:form.notes||null,status:"agendado"});
    if(!error){await loadSlots();setShowAdd(false);setForm({lead_id:"",date:"",time:"",notes:""});}
    else alert("Erro ao salvar. Verifique se a tabela agenda existe no Supabase.");
    setSaving(false);
  };

  const cancelSlot=async(id)=>{
    if(!window.confirm("Cancelar este agendamento?"))return;
    await supabase.from("agenda").update({status:"cancelado"}).eq("id",id);
    loadSlots();
  };

  const confirmarSlot=async(id)=>{
    await supabase.from("agenda").update({status:"confirmado"}).eq("id",id);
    loadSlots();
  };

  const ts=today();
  const reuniaoLeads=leads.filter(l=>l.stage==="reuniao");
  const upcoming=slots.filter(s=>s.date>=ts&&s.status!=="cancelado").sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time));
  const past=slots.filter(s=>s.date<ts&&s.status!=="cancelado").sort((a,b)=>b.date.localeCompare(a.date)||b.time.localeCompare(a.time)).slice(0,10);

  const statusColor={agendado:T.gold,confirmado:T.accent,cancelado:"#dc2626"};
  const statusLabel={agendado:"Agendado",confirmado:"Confirmado ✓",cancelado:"Cancelado"};

  const SlotCard=({slot})=>{
    const lead=leads.find(l=>l.id===slot.lead_id);
    const isToday=slot.date===ts;
    return (
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"14px 16px",borderLeft:`3px solid ${statusColor[slot.status]||T.muted}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div>
            <div style={{fontWeight:700,fontSize:15}}>{lead?.name||"Lead não encontrado"}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:2}}>{lead?.phone} · {lead?.course||"—"}</div>
          </div>
          <Pill color={statusColor[slot.status]||T.muted}>{statusLabel[slot.status]}</Pill>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:slot.notes?8:0}}>
          <span style={{fontSize:13,fontWeight:700,color:isToday?T.orange:T.text}}>
            {isToday?"🔴 HOJE":"📅 "+new Date(slot.date+"T00:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"2-digit"})}
          </span>
          <span style={{fontSize:13,fontWeight:600,color:T.accent}}>🕐 {slot.time}</span>
        </div>
        {slot.notes&&<div style={{fontSize:13,color:T.muted,fontStyle:"italic",marginBottom:10}}>"{slot.notes}"</div>}
        {slot.status==="agendado"&&(
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <Btn variant="ghost" onClick={()=>confirmarSlot(slot.id)} style={{fontSize:12,padding:"6px 12px"}}>✓ Confirmar</Btn>
            <Btn variant="danger" onClick={()=>cancelSlot(slot.id)} style={{fontSize:12,padding:"6px 12px"}}>Cancelar</Btn>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{animation:"fadeUp .3s"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:mob?26:32,fontWeight:400,letterSpacing:"-.5px"}}>Agenda do Closer</h1>
          <p style={{color:T.muted,fontSize:13,marginTop:3}}>Reuniões de fechamento agendadas</p>
        </div>
        <Btn onClick={()=>setShowAdd(true)}>📅 Agendar Reunião</Btn>
      </div>

      {reuniaoLeads.length>0&&(
        <div style={{background:"#fefce8",border:"1.5px solid #fde68a",borderRadius:T.radius,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20}}>⚡</span>
          <div>
            <div style={{fontWeight:700,fontSize:14,color:"#92400e"}}>{reuniaoLeads.length} lead(s) com Reunião Agendada no pipeline!</div>
            <div style={{fontSize:12,color:"#78350f",marginTop:2}}>{reuniaoLeads.map(l=>l.name).join(", ")}</div>
          </div>
        </div>
      )}

      {loading?<div style={{textAlign:"center",padding:40}}><Spinner/></div>:(
        <>
          <div style={{marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:20,fontWeight:400,color:T.accent}}>Próximas reuniões</h2>
              <span style={{background:T.accentLight,color:T.accent,borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:700}}>{upcoming.length}</span>
            </div>
            {upcoming.length===0?<div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:24,textAlign:"center",color:T.muted}}>Nenhuma reunião agendada.</div>
            :<div style={{display:"flex",flexDirection:"column",gap:10}}>{upcoming.map(s=><SlotCard key={s.id} slot={s}/>)}</div>}
          </div>
          {past.length>0&&(
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:20,fontWeight:400,color:T.muted}}>Reuniões anteriores</h2>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10,opacity:.7}}>{past.map(s=><SlotCard key={s.id} slot={s}/>)}</div>
            </div>
          )}
        </>
      )}

      {showAdd&&(
        <Modal title="Agendar Reunião" subtitle="Reunião de fechamento com o closer" onClose={()=>setShowAdd(false)} mob={mob} width={460}>
          <div style={{display:"grid",gap:13}}>
            <Sel label="Lead *" value={form.lead_id} onChange={e=>setForm(p=>({...p,lead_id:e.target.value}))}
              options={[{value:"",label:"Selecione o lead..."},...leads.filter(l=>!["matriculado","perdido"].includes(l.stage)).map(l=>({value:l.id,label:`${l.name} — ${l.stage==="reuniao"?"⚡ ":""}${STAGES.find(s=>s.id===l.stage)?.label||""}`}))]}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
              <Inp label="Data *" type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/>
              <Inp label="Horário *" type="time" value={form.time} onChange={e=>setForm(p=>({...p,time:e.target.value}))}/>
            </div>
            <Inp label="Observações (opcional)" type="textarea" value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Interesse, objeções, pontos importantes..."/>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn variant="ghost" onClick={()=>setShowAdd(false)}>Cancelar</Btn>
              <Btn onClick={saveSlot} loading={saving} full={mob}>💾 Agendar</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── DASHBOARD ──────────────────────────────────────────────────── */
function Dashboard({leads,mob}) {
  const ts=today(),total=leads.length,matr=leads.filter(l=>l.stage==="matriculado").length;
  const ativos=leads.filter(l=>!["matriculado","perdido","naoqualif"].includes(l.stage)).length;
  const fuHj=leads.filter(l=>l.followUp?.date===ts).length,atr=leads.filter(l=>l.followUp?.date&&l.followUp.date<ts).length;
  const taxa=total>0?Math.round((matr/total)*100):0;
  const etapas=STAGES.map(s=>({...s,cnt:leads.filter(l=>l.stage===s.id).length}));
  const origens=SOURCES.map(s=>({l:s,n:leads.filter(x=>x.source===s).length})).filter(x=>x.n>0).sort((a,b)=>b.n-a.n);
  const recentes=[...leads].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);
  const SC=({label,value,sub,color,icon})=>(
    <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?"13px 15px":"18px 20px",display:"flex",flexDirection:"column",gap:8}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em"}}>{label}</span>
        <span style={{fontSize:17}}>{icon}</span>
      </div>
      <div style={{fontSize:mob?28:36,fontWeight:700,color,letterSpacing:"-1.5px",lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:T.muted}}>{sub}</div>}
    </div>
  );
  return (
    <div style={{animation:"fadeUp .3s"}}>
      <div style={{marginBottom:18}}>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:mob?26:32,fontWeight:400,letterSpacing:"-.5px"}}>Dashboard</h1>
        <p style={{color:T.muted,fontSize:13,marginTop:3}}>Resumo do pipeline comercial</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <SC label="Total de Leads" value={total} icon="👥" color={T.text}/>
        <SC label="Em Negociação" value={ativos} icon="⚡" color="#6366f1" sub={`${total-ativos} fora`}/>
        <SC label="Matriculados" value={matr} icon="🏆" color={T.accent} sub={`${taxa}% conversão`}/>
        <SC label="Follow-ups Hoje" value={fuHj} icon="🔔" color={T.gold} sub={atr>0?`${atr} atrasado(s)`:""}/>
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?16:22,marginBottom:12}}>
        <h3 style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:14}}>Pipeline por Etapa</h3>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {etapas.map(s=>(
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{width:mob?140:170,fontSize:11,fontWeight:500,flexShrink:0,color:T.text}}>{s.label}</span>
              <div style={{flex:1,background:T.bg,borderRadius:6,height:8,overflow:"hidden"}}>
                <div style={{width:total>0?`${(s.cnt/total)*100}%`:"0%",height:"100%",background:s.hex,borderRadius:6,transition:"width .4s"}}/>
              </div>
              <span style={{fontSize:13,fontWeight:700,color:s.hex,width:20,textAlign:"right"}}>{s.cnt}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?16:22,marginBottom:12}}>
        <h3 style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:14}}>Top Origens</h3>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {origens.slice(0,5).map(o=>(
            <div key={o.l} style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{width:76,fontSize:12,flexShrink:0}}>{o.l}</span>
              <div style={{flex:1,background:T.bg,borderRadius:6,height:8,overflow:"hidden"}}>
                <div style={{width:`${(o.n/Math.max(...origens.map(x=>x.n),1))*100}%`,height:"100%",background:T.accent,borderRadius:6,opacity:.7}}/>
              </div>
              <span style={{fontSize:13,fontWeight:700,color:T.muted,width:20,textAlign:"right"}}>{o.n}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?16:22}}>
        <h3 style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:14}}>Leads Recentes</h3>
        {recentes.map(l=>{const st=STAGES.find(s=>s.id===l.stage);return(
          <div key={l.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
            <div><div style={{fontWeight:600,fontSize:14}}>{l.name}</div><div style={{fontSize:12,color:T.muted,marginTop:2}}>{l.course||"—"}</div></div>
            <Pill color={st?.hex}>{st?.label}</Pill>
          </div>
        );})}
      </div>
    </div>
  );
}

/* ─── LEADS LIST ─────────────────────────────────────────────────── */
function LeadsList({leads,onSelect,onAdd,mob}) {
  const [search,setSearch]=useState(""),[fs,setFs]=useState("todos");
  const filtered=leads.filter(l=>{
    const ms=!search||l.name.toLowerCase().includes(search.toLowerCase())||l.phone.includes(search)||(l.course||"").toLowerCase().includes(search.toLowerCase());
    return ms&&(fs==="todos"||l.stage===fs);
  });
  return (
    <div style={{animation:"fadeUp .3s"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
        <div>
          <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:mob?26:32,fontWeight:400}}>Leads</h1>
          <p style={{color:T.muted,fontSize:13,marginTop:3}}>{leads.length} leads no total</p>
        </div>
        {!mob&&<Btn onClick={onAdd}>+ Novo Lead</Btn>}
      </div>
      <div style={{display:"flex",flexDirection:mob?"column":"row",gap:10,marginBottom:14}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Buscar..." style={{flex:1,background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"11px 14px",fontSize:16,color:T.text,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
        <select value={fs} onChange={e=>setFs(e.target.value)} style={{background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"11px 13px",fontSize:15,color:T.text,outline:"none",fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}>
          <option value="todos">Todas as etapas</option>
          {STAGES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>
      {mob?(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.map(lead=>{const st=STAGES.find(s=>s.id===lead.stage),ov=lead.followUp?.date&&lead.followUp.date<today(),isTd=lead.followUp?.date===today();return(
            <div key={lead.id} onClick={()=>onSelect(lead)} className="c-hover" style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"14px 16px",cursor:"pointer",boxShadow:"0 1px 3px rgba(0,0,0,.05)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{fontWeight:700,fontSize:15}}>{lead.name}</div>
                <Pill color={st?.hex}>{st?.label}</Pill>
              </div>
              <div style={{fontSize:13,color:T.muted,marginBottom:2}}>📱 {lead.phone}</div>
              <div style={{fontSize:13,color:T.muted,marginBottom:(isTd||ov)?10:0}}>📚 {lead.course||"—"} · {lead.source||"—"}</div>
              {lead.responsavel&&<div style={{fontSize:12,color:T.accent,marginBottom:4}}>👤 {lead.responsavel}</div>}
              {(isTd||ov)&&<div style={{background:ov?"#fef2f2":"#fefce8",color:ov?"#b91c1c":"#92400e",borderRadius:6,padding:"3px 10px",fontSize:12,fontWeight:700,display:"inline-block"}}>{ov?"⚠ Atrasado":"🔔 Hoje"}</div>}
            </div>
          );})}
          {filtered.length===0&&<div style={{textAlign:"center",color:T.muted,padding:40}}>Nenhum lead encontrado.</div>}
        </div>
      ):(
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
            <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>{["Nome","Telefone","Curso","Responsável","Origem","Etapa","Follow-up"].map(h=>(
              <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em"}}>{h}</th>
            ))}</tr></thead>
            <tbody>
              {filtered.map(lead=>{const st=STAGES.find(s=>s.id===lead.stage),ov=lead.followUp?.date&&lead.followUp.date<today(),isTd=lead.followUp?.date===today();return(
                <tr key={lead.id} className="rw" onClick={()=>onSelect(lead)} style={{borderBottom:`1px solid ${T.border}`,cursor:"pointer"}}>
                  <td style={{padding:"12px 16px",fontWeight:600}}>{lead.name}</td>
                  <td style={{padding:"12px 16px",color:T.muted}}>{lead.phone}</td>
                  <td style={{padding:"12px 16px",color:T.muted,fontSize:13}}>{lead.course||"—"}</td>
                  <td style={{padding:"12px 16px",color:T.accent,fontSize:13}}>{lead.responsavel||"—"}</td>
                  <td style={{padding:"12px 16px",color:T.muted,fontSize:13}}>{lead.source||"—"}</td>
                  <td style={{padding:"12px 16px"}}><Pill color={st?.hex}>{st?.label}</Pill></td>
                  <td style={{padding:"12px 16px"}}>{lead.followUp?<span style={{fontSize:12,fontWeight:700,color:ov?"#dc2626":isTd?T.gold:T.muted}}>{ov?"⚠ ":isTd?"🔔 ":""}{lead.followUp.date}</span>:<span style={{color:T.muted,fontSize:13}}>—</span>}</td>
                </tr>
              );})}
              {filtered.length===0&&<tr><td colSpan={7} style={{padding:"48px 0",textAlign:"center",color:T.muted}}>Nenhum lead encontrado.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── FOLLOW-UPS ─────────────────────────────────────────────────── */
function FollowUps({leads,onSelect,mob}) {
  const ts=today();
  const ov=leads.filter(l=>l.followUp?.date&&l.followUp.date<ts).sort((a,b)=>a.followUp.date.localeCompare(b.followUp.date));
  const td=leads.filter(l=>l.followUp?.date===ts);
  const up=leads.filter(l=>l.followUp?.date&&l.followUp.date>ts).sort((a,b)=>a.followUp.date.localeCompare(b.followUp.date));
  const Sec=({title,color,items,empty})=>(
    <div style={{marginBottom:22}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:mob?20:22,fontWeight:400,color}}>{title}</h2>
        <span style={{background:color+"18",color,borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:700}}>{items.length}</span>
      </div>
      {items.length===0?<div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:24,textAlign:"center",color:T.muted}}>{empty}</div>
      :<div style={{display:"flex",flexDirection:"column",gap:10}}>
        {items.map(l=>{const st=STAGES.find(s=>s.id===l.stage);return(
          <div key={l.id} className="c-hover" onClick={()=>onSelect(l)} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"14px 16px",cursor:"pointer",borderLeft:`3px solid ${color}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <div style={{fontWeight:700,fontSize:15}}>{l.name}</div>
              <span style={{fontSize:12,fontWeight:700,color}}>{l.followUp.date}</span>
            </div>
            <div style={{fontSize:13,color:T.muted,marginBottom:8}}>{l.phone} · {l.course||"—"}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
              <Pill color={st?.hex}>{st?.label}</Pill>
              {l.followUp.note&&<span style={{fontSize:12,color:T.muted,fontStyle:"italic"}}>"{l.followUp.note}"</span>}
            </div>
          </div>
        );})}
      </div>}
    </div>
  );
  return (
    <div style={{animation:"fadeUp .3s"}}>
      <div style={{marginBottom:20}}>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:mob?26:32,fontWeight:400}}>Follow-ups</h1>
        <p style={{color:T.muted,fontSize:13,marginTop:3}}>Seus contatos agendados</p>
      </div>
      <Sec title="Atrasados" color="#dc2626" items={ov} empty="Nenhum follow-up atrasado 🎉"/>
      <Sec title="Hoje" color={T.gold} items={td} empty="Nenhum follow-up para hoje."/>
      <Sec title="Próximos" color={T.accent} items={up} empty="Nenhum follow-up futuro agendado."/>
    </div>
  );
}

/* ─── RELATÓRIOS ─────────────────────────────────────────────────── */
function Relatorios({leads,mob}) {
  const total=leads.length,matr=leads.filter(l=>l.stage==="matriculado").length,perd=leads.filter(l=>l.stage==="perdido").length;
  const taxa=total>0?Math.round((matr/total)*100):0;
  const cData=COURSES.map(c=>({l:c,t:leads.filter(x=>x.course===c).length,m:leads.filter(x=>x.course===c&&x.stage==="matriculado").length})).filter(x=>x.t>0).sort((a,b)=>b.t-a.t);
  const oData=SOURCES.map(s=>({l:s,t:leads.filter(x=>x.source===s).length,m:leads.filter(x=>x.source===s&&x.stage==="matriculado").length})).filter(x=>x.t>0).sort((a,b)=>b.t-a.t);
  return (
    <div style={{animation:"fadeUp .3s"}}>
      <div style={{marginBottom:20}}>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:mob?26:32,fontWeight:400}}>Relatórios</h1>
        <p style={{color:T.muted,fontSize:13,marginTop:3}}>Análise de conversão do funil</p>
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?16:22,marginBottom:12}}>
        <h3 style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:16}}>Funil de Conversão</h3>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:18}}>
          {STAGES.map(s=>{const cnt=leads.filter(l=>l.stage===s.id).length,pct=total>0?Math.round((cnt/total)*100):0;return(
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{width:mob?140:170,fontSize:11,fontWeight:500,flexShrink:0}}>{s.label}</span>
              <div style={{flex:1,background:T.bg,borderRadius:6,height:22,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:s.hex,borderRadius:6,opacity:.85,display:"flex",alignItems:"center",paddingLeft:8,minWidth:pct>0?24:0}}>
                  {pct>8&&<span style={{color:"white",fontSize:11,fontWeight:700}}>{pct}%</span>}
                </div>
              </div>
              <span style={{fontSize:13,fontWeight:700,color:s.hex,width:24,textAlign:"right"}}>{cnt}</span>
            </div>
          );})}
        </div>
        <div style={{display:"flex",gap:24}}>
          <div><div style={{fontSize:32,fontWeight:700,color:T.accent,letterSpacing:"-1px",lineHeight:1}}>{taxa}%</div><div style={{fontSize:11,color:T.muted,marginTop:3}}>Taxa de conversão</div></div>
          <div><div style={{fontSize:32,fontWeight:700,color:"#f87171",letterSpacing:"-1px",lineHeight:1}}>{perd>0&&total>0?Math.round((perd/total)*100):0}%</div><div style={{fontSize:11,color:T.muted,marginTop:3}}>Taxa de perda</div></div>
        </div>
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?16:22,marginBottom:12}}>
        <h3 style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:14}}>Performance por Curso</h3>
        {cData.map(c=>(
          <div key={c.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
            <div><div style={{fontWeight:500,fontSize:14}}>{c.l}</div><div style={{fontSize:12,color:T.muted,marginTop:2}}>{c.t} leads · {c.m} matr.</div></div>
            <Pill color={T.accent}>{c.t>0?Math.round((c.m/c.t)*100):0}%</Pill>
          </div>
        ))}
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?16:22}}>
        <h3 style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:14}}>Performance por Origem</h3>
        {oData.map(o=>(
          <div key={o.l} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5}}>
              <span style={{fontWeight:500}}>{o.l}</span><span style={{color:T.muted,fontSize:12}}>{o.m}/{o.t} matr.</span>
            </div>
            <div style={{background:T.bg,borderRadius:6,height:8,overflow:"hidden"}}>
              <div style={{width:`${(o.t/Math.max(...oData.map(x=>x.t),1))*100}%`,height:"100%",background:T.accent,borderRadius:6,opacity:.65}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── LEAD MODAL ─────────────────────────────────────────────────── */
function LeadModal({lead,onUpdate,onDelete,onClose,mob}) {
  const [tab,setTab]=useState("info"),[editing,setEditing]=useState(false);
  const [form,setForm]=useState({...lead});
  const [hist,setHist]=useState({type:"WhatsApp",note:""});
  const [fu,setFu]=useState(lead.followUp||{date:"",note:""});
  const [saving,setSaving]=useState(false);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const ts=today(),st=STAGES.find(s=>s.id===lead.stage);

  const saveInfo=async()=>{
    setSaving(true);
    await supabase.from("leads").update({name:form.name,phone:form.phone,email:form.email,course:form.course,source:form.source,notes:form.notes,responsavel:form.responsavel||null}).eq("id",lead.id);
    onUpdate({...lead,...form});setEditing(false);setSaving(false);
  };
  const changeStage=async(id)=>{await supabase.from("leads").update({stage:id}).eq("id",lead.id);onUpdate({...lead,stage:id});};
  const addHist=async()=>{
    if(!hist.note.trim())return;
    const entry={id:uid(),lead_id:lead.id,type:hist.type,note:hist.note,date:new Date().toISOString()};
    await supabase.from("lead_history").insert(entry);
    onUpdate({...lead,history:[{id:entry.id,type:entry.type,note:entry.note,date:entry.date},...lead.history]});
    setHist({type:"WhatsApp",note:""});
  };
  const saveFu=async()=>{
    await supabase.from("leads").update({follow_up_date:fu.date||null,follow_up_note:fu.note||null}).eq("id",lead.id);
    onUpdate({...lead,followUp:fu.date?{...fu}:null});
  };
  const deleteLead=async()=>{
    if(!window.confirm("Excluir este lead?"))return;
    await supabase.from("leads").delete().eq("id",lead.id);onDelete(lead.id);
  };

  return (
    <Modal title={lead.name} subtitle={`${st?.label} · ${lead.course||"Curso não definido"}`} onClose={onClose} width={620} mob={mob}>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {STAGES.map(s=>(
          <button key={s.id} onClick={()=>changeStage(s.id)} className="tap"
            style={{flexShrink:0,background:lead.stage===s.id?s.hex:"transparent",color:lead.stage===s.id?"white":T.muted,border:`1.5px solid ${lead.stage===s.id?s.hex:T.border}`,borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
            {s.emoji} {s.label}
          </button>
        ))}
      </div>
      <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,marginBottom:18}}>
        {[["info","Infos"],["historico","Histórico"],["followup","Follow-up"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} className="tap"
            style={{flex:1,background:"none",border:"none",borderBottom:tab===id?`2px solid ${T.accent}`:"2px solid transparent",padding:"10px 8px",fontSize:14,fontWeight:600,color:tab===id?T.accent:T.muted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:-1}}>
            {lbl}
          </button>
        ))}
      </div>

      {tab==="info"&&(editing?(
        <div style={{display:"grid",gap:13}}>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:11}}>
            <Inp label="Nome" value={form.name} onChange={e=>f("name",e.target.value)}/>
            <Inp label="Telefone" value={form.phone} onChange={e=>f("phone",e.target.value)}/>
            <Inp label="Email" value={form.email} onChange={e=>f("email",e.target.value)}/>
            <Sel label="Curso" value={form.course} onChange={e=>f("course",e.target.value)} options={COURSES}/>
            <Sel label="Origem" value={form.source} onChange={e=>f("source",e.target.value)} options={SOURCES}/>
          </div>
          <Inp label="Responsável (opcional)" value={form.responsavel||""} onChange={e=>f("responsavel",e.target.value)} placeholder="Nome do responsável"/>
          <Inp label="Observações" type="textarea" value={form.notes} onChange={e=>f("notes",e.target.value)}/>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <Btn variant="ghost" onClick={()=>setEditing(false)}>Cancelar</Btn>
            <Btn onClick={saveInfo} loading={saving} full={mob}>✓ Salvar</Btn>
          </div>
        </div>
      ):(
        <div style={{display:"grid",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["Nome",lead.name],["Telefone",lead.phone],["Email",lead.email||"—"],["Curso",lead.course||"—"],["Origem",lead.source||"—"],["Responsável",lead.responsavel||"—"]].map(([l,v])=>(
              <div key={l} style={{background:T.bg,borderRadius:10,padding:"11px 14px"}}>
                <div style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:3}}>{l}</div>
                <div style={{fontWeight:600,fontSize:14,wordBreak:"break-word"}}>{v}</div>
              </div>
            ))}
          </div>
          {lead.notes&&<div style={{background:T.goldLight,borderRadius:10,padding:"12px 14px",borderLeft:`3px solid ${T.gold}`}}>
            <div style={{fontSize:10,fontWeight:700,color:T.gold,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>Observações</div>
            <div style={{fontSize:13,color:"#78350f"}}>{lead.notes}</div>
          </div>}
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",flexWrap:"wrap"}}>
            <Btn variant="danger" onClick={deleteLead}>🗑 Excluir</Btn>
            <Btn variant="ghost" onClick={()=>setEditing(true)}>✏ Editar</Btn>
          </div>
        </div>
      ))}

      {tab==="historico"&&(
        <div>
          <div style={{display:"flex",flexDirection:mob?"column":"row",gap:10,marginBottom:16,alignItems:mob?"stretch":"flex-end"}}>
            <Sel label="Tipo" value={hist.type} onChange={e=>setHist(p=>({...p,type:e.target.value}))} options={CTYPES}/>
            <div style={{flex:1}}><Inp label="Nota do contato" value={hist.note} onChange={e=>setHist(p=>({...p,note:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addHist()} placeholder="O que aconteceu?"/></div>
            <Btn onClick={addHist} full={mob}>+ Registrar</Btn>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:260,overflowY:"auto"}}>
            {lead.history.length===0?<div style={{textAlign:"center",color:T.muted,padding:32}}>Nenhum contato ainda.</div>
            :lead.history.map(h=>(
              <div key={h.id} style={{display:"flex",gap:12,background:T.bg,borderRadius:10,padding:"12px 14px"}}>
                <span style={{fontSize:20}}>{{ WhatsApp:"💬",Ligação:"📞",Email:"📧",Reunião:"🤝",Anotação:"📝" }[h.type]||"📌"}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,flexWrap:"wrap",gap:4}}>
                    <span style={{fontWeight:700,fontSize:13,color:T.accent}}>{h.type}</span>
                    <span style={{fontSize:11,color:T.muted}}>{fmtDate(h.date)}</span>
                  </div>
                  <div style={{color:T.muted,fontSize:13,wordBreak:"break-word"}}>{h.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="followup"&&(
        <div style={{display:"grid",gap:14}}>
          {lead.followUp&&<div style={{background:lead.followUp.date<ts?"#fef2f2":T.accentLight,borderRadius:10,padding:"14px 16px",borderLeft:`3px solid ${lead.followUp.date<ts?"#ef4444":T.accent}`}}>
            <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{lead.followUp.date<ts?"⚠ Follow-up atrasado":"✓ Agendado"}</div>
            <div style={{fontSize:13,color:T.muted}}>Data: <strong>{lead.followUp.date}</strong></div>
            {lead.followUp.note&&<div style={{fontSize:13,color:T.muted,marginTop:2}}>{lead.followUp.note}</div>}
          </div>}
          <Inp label="Data" type="date" value={fu.date} onChange={e=>setFu(p=>({...p,date:e.target.value}))}/>
          <Inp label="Nota (opcional)" value={fu.note} onChange={e=>setFu(p=>({...p,note:e.target.value}))} placeholder="Ex: Ligar para confirmar"/>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",flexWrap:"wrap"}}>
            {lead.followUp&&<Btn variant="danger" onClick={async()=>{await supabase.from("leads").update({follow_up_date:null,follow_up_note:null}).eq("id",lead.id);onUpdate({...lead,followUp:null});setFu({date:"",note:""});}}>Remover</Btn>}
            <Btn variant="gold" onClick={saveFu} full={mob}>💾 Salvar follow-up</Btn>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────────────────── */
function Sidebar({active,onChange,fuCount,onLogout,userEmail}) {
  return (
    <aside style={{width:220,background:"#0d1f22",display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0,flexShrink:0}}>
      <div style={{padding:"24px 20px 16px"}}>
        <div style={{marginBottom:32,paddingBottom:20,borderBottom:"1px solid rgba(255,255,255,.1)"}}>
          <img src={LOGO_B64} alt="Nexus" style={{height:44,objectFit:"contain",display:"block"}}/>
        </div>
        <nav style={{display:"flex",flexDirection:"column",gap:3}}>
          {NAV_ITEMS.map(item=>{const on=active===item.id;return(
            <button key={item.id} onClick={()=>onChange(item.id)} className="tap"
              style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:9,border:"none",background:on?"rgba(13,115,119,.4)":"transparent",color:on?"#5eead4":"rgba(255,255,255,.55)",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:on?700:500,textAlign:"left",transition:"all .15s"}}>
              <span style={{fontSize:16}}>{item.icon}</span>{item.label}
              {item.id==="followups"&&fuCount>0&&<span style={{marginLeft:"auto",background:T.gold,color:"white",borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:700}}>{fuCount}</span>}
            </button>
          );})}
        </nav>
      </div>
      <div style={{marginTop:"auto",padding:20,borderTop:"1px solid rgba(255,255,255,.1)"}}>
        <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>👤 {userEmail}</div>
        <button onClick={onLogout} className="tap" style={{width:"100%",background:"transparent",border:"1px solid rgba(255,255,255,.15)",borderRadius:9,padding:"8px",fontSize:13,fontWeight:600,color:"rgba(255,255,255,.5)",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Sair</button>
      </div>
    </aside>
  );
}

/* ─── BOTTOM NAV ─────────────────────────────────────────────────── */
function BottomNav({active,onChange,fuCount}) {
  return (
    <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"#0d1f22",borderTop:"1px solid rgba(255,255,255,.1)",display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom,0px)",boxShadow:"0 -4px 20px rgba(0,0,0,.2)"}}>
      {NAV_ITEMS.map(item=>{const on=active===item.id;return(
        <button key={item.id} onClick={()=>onChange(item.id)} className="tap"
          style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"10px 4px 8px",border:"none",background:"transparent",color:on?"#5eead4":"rgba(255,255,255,.45)",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:on?700:500,transition:"color .15s",position:"relative"}}>
          <span style={{fontSize:18,lineHeight:1}}>{item.icon}</span>
          {item.label}
          {item.id==="followups"&&fuCount>0&&<span style={{position:"absolute",top:6,right:"calc(50% - 18px)",background:T.gold,color:"white",borderRadius:10,padding:"0 5px",fontSize:9,fontWeight:700,lineHeight:"16px"}}>{fuCount}</span>}
        </button>
      );})}
    </nav>
  );
}

function FAB({onClick}) {
  return (
    <button onClick={onClick} className="tap"
      style={{position:"fixed",bottom:"calc(68px + env(safe-area-inset-bottom,0px))",right:20,width:54,height:54,borderRadius:27,background:T.accent,border:"none",color:"white",fontSize:26,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(13,115,119,.45)",cursor:"pointer",zIndex:99}}>
      +
    </button>
  );
}

/* ─── APP ROOT ───────────────────────────────────────────────────── */
export default function App() {
  const mob=useIsMobile();
  const [session,setSession]=useState(null),[authLoading,setAuthLoading]=useState(true);
  const [leads,setLeads]=useState([]),[dbLoading,setDbLoading]=useState(false);
  const [page,setPage]=useState("pipeline");
  const [selected,setSelected]=useState(null),[showAdd,setShowAdd]=useState(false),[showQuick,setShowQuick]=useState(false);

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{setSession(data.session);setAuthLoading(false);});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));
    return()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    if(!session)return;
    setDbLoading(true);
    (async()=>{
      const{data:ld}=await supabase.from("leads").select("*").order("created_at",{ascending:false});
      const{data:hd}=await supabase.from("lead_history").select("*").order("date",{ascending:false});
      setLeads((ld||[]).map(l=>({
        id:l.id,name:l.name,phone:l.phone,email:l.email||"",course:l.course||"",source:l.source||"",
        stage:l.stage,notes:l.notes||"",responsavel:l.responsavel||"",createdAt:l.created_at,
        followUp:l.follow_up_date?{date:l.follow_up_date,note:l.follow_up_note||""}:null,
        history:(hd||[]).filter(h=>h.lead_id===l.id).map(h=>({id:h.id,type:h.type,note:h.note,date:h.date})),
      })));
      setDbLoading(false);
    })();
  },[session]);

  const updateLead=u=>{setLeads(p=>p.map(l=>l.id===u.id?u:l));setSelected(u);};
  const addLead=d=>setLeads(p=>[d,...p]);
  const deleteLead=id=>{setLeads(p=>p.filter(l=>l.id!==id));setSelected(null);};
  const moveLead=async(lid,sid)=>{
    await supabase.from("leads").update({stage:sid}).eq("id",lid);
    setLeads(p=>p.map(l=>l.id===lid?{...l,stage:sid}:l));
  };
  const nav=p=>{setPage(p);setSelected(null);};
  const logout=()=>supabase.auth.signOut();
  const ts=today();
  const fuCount=leads.filter(l=>l.followUp?.date&&l.followUp.date<=ts).length;
  const sp={mob};

  if(authLoading)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:T.bg}}><Spinner/></div>);
  if(!session)return(<><GlobalStyles/><LoginScreen/></>);

  return (
    <>
      <GlobalStyles/>
      <div style={{display:"flex",minHeight:"100vh"}}>
        {!mob&&<Sidebar active={page} onChange={nav} fuCount={fuCount} onLogout={logout} userEmail={session.user.email}/>}
        <main style={{flex:1,padding:mob?"18px 16px 90px":"36px 40px",overflowY:"auto",minHeight:"100vh"}}>
          {mob&&(
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <img src={LOGO_B64} alt="Nexus" style={{height:32,objectFit:"contain"}}/>
              <button onClick={logout} className="tap" style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 12px",fontSize:12,color:T.muted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Sair</button>
            </div>
          )}
          {dbLoading?(
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",flexDirection:"column",gap:16}}>
              <Spinner/><p style={{color:T.muted,fontSize:14}}>Carregando dados...</p>
            </div>
          ):(
            <>
              {page==="pipeline"   &&<KanbanBoard leads={leads} onSelect={setSelected} onMove={moveLead} onQuickAdd={()=>setShowQuick(true)} {...sp}/>}
              {page==="dashboard"  &&<Dashboard   leads={leads} {...sp}/>}
              {page==="leads"      &&<LeadsList   leads={leads} onSelect={setSelected} onAdd={()=>setShowAdd(true)} {...sp}/>}
              {page==="agenda"     &&<AgendaCloser leads={leads} mob={mob} supabase={supabase}/>}
              {page==="followups"  &&<FollowUps   leads={leads} onSelect={setSelected} {...sp}/>}
              {page==="relatorios" &&<Relatorios  leads={leads} {...sp}/>}
            </>
          )}
        </main>
      </div>
      {mob&&<BottomNav active={page} onChange={nav} fuCount={fuCount}/>}
      {mob&&<FAB onClick={()=>setShowQuick(true)}/>}
      {showQuick &&<QuickAddModal onAdd={addLead} onClose={()=>setShowQuick(false)} mob={mob}/>}
      {showAdd   &&<AddLeadModal  onAdd={addLead} onClose={()=>setShowAdd(false)}  mob={mob}/>}
      {selected  &&<LeadModal lead={selected} onUpdate={updateLead} onDelete={deleteLead} onClose={()=>setSelected(null)} mob={mob}/>}
    </>
  );
}
