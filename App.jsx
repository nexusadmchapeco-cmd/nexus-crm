import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

/* ─── SUPABASE ───────────────────────────────────────────────────── */
const SUPA_URL  = "https://tmkjtyhybfbaqcqovuem.supabase.co";
const SUPA_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRta2p0eWh5YmZiYXFjcW92dWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NDY5MjYsImV4cCI6MjA5MDEyMjkyNn0.ZqBH1WkFsXREV9oaDotWkC9kVNt1bA_ERjEZTNjeWO0";
const supabase  = createClient(SUPA_URL, SUPA_KEY);

/* ─── CONSTANTS ──────────────────────────────────────────────────── */
const STAGES = [
  { id:"novo",         label:"Novo Lead",   emoji:"✦", hex:"#94a3b8" },
  { id:"contato",      label:"Contato",     emoji:"✉", hex:"#60a5fa" },
  { id:"experimental", label:"Aula Exp.",   emoji:"★", hex:"#f59e0b" },
  { id:"proposta",     label:"Proposta",    emoji:"◈", hex:"#a78bfa" },
  { id:"matriculado",  label:"Matriculado", emoji:"✔", hex:"#10b981" },
  { id:"perdido",      label:"Perdido",     emoji:"✕", hex:"#f87171" },
];
const COURSES  = ["Business English","Inglês Geral","Viagem & Intercâmbio","TOEFL / IELTS","Inglês para Kids","Conversação Avançada"];
const SOURCES  = ["Instagram","Indicação","Google","WhatsApp","Site","TikTok","Outros"];
const CTYPES   = ["WhatsApp","Ligação","Email","Reunião","Anotação"];
const NAV_ITEMS = [
  { id:"dashboard",  icon:"⬡", label:"Início"    },
  { id:"pipeline",   icon:"◫", label:"Pipeline"  },
  { id:"leads",      icon:"◎", label:"Leads"     },
  { id:"followups",  icon:"◷", label:"Follow-up" },
  { id:"relatorios", icon:"◈", label:"Relatórios"},
];

function today()   { return new Date().toISOString().split("T")[0]; }
function uid()     { return Date.now().toString(36)+Math.random().toString(36).slice(2); }
function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR",{day:"2-digit",month:"short"})+" "+d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
}

const T = {
  bg:"#f7f6f3", surface:"#ffffff", border:"#e8e4de",
  text:"#1a1714", muted:"#8c8580",
  accent:"#0d7377", accentLight:"#e6f4f4",
  gold:"#c9922a", goldLight:"#fdf5e8",
  radius:14,
};

function useIsMobile() {
  const [m, setM] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
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
      @keyframes goalPop{from{opacity:0;transform:scale(.3) rotate(-8deg)}to{opacity:1;transform:scale(1) rotate(0)}}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
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
  return <div style={{ width:20, height:20, border:`2px solid ${T.border}`, borderTop:`2px solid ${T.accent}`, borderRadius:"50%", animation:"spin .7s linear infinite", margin:"0 auto" }} />;
}

function Pill({ color, children }) {
  return <span style={{ display:"inline-flex", alignItems:"center", background:color+"18", color, borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:600 }}>{children}</span>;
}

function Inp({ label, ...p }) {
  const base = { width:"100%", background:T.bg, border:`1.5px solid ${T.border}`, borderRadius:10, padding:"11px 13px", fontSize:16, color:T.text, outline:"none", transition:"border .15s" };
  return (
    <label style={{ display:"block" }}>
      {label && <span style={{ display:"block", fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".07em", marginBottom:5 }}>{label}</span>}
      {p.type==="textarea" ? <textarea {...p} style={{ ...base, resize:"vertical", minHeight:76, fontSize:16 }} />
        : <input {...p} style={base} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border} />}
    </label>
  );
}

function Sel({ label, options, ...p }) {
  return (
    <label style={{ display:"block" }}>
      {label && <span style={{ display:"block", fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".07em", marginBottom:5 }}>{label}</span>}
      <select {...p} style={{ width:"100%", background:T.bg, border:`1.5px solid ${T.border}`, borderRadius:10, padding:"11px 13px", fontSize:16, color:T.text, outline:"none", fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>
        {options.map(o => typeof o==="string" ? <option key={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function Btn({ variant="primary", onClick, children, style:s, full, loading, disabled }) {
  const base = { display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6, fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, cursor:disabled?"not-allowed":"pointer", border:"none", borderRadius:11, padding:"11px 20px", transition:"all .15s", width:full?"100%":"auto", opacity:disabled?0.6:1, WebkitTapHighlightColor:"transparent", ...s };
  const V = { primary:{...base,background:T.accent,color:"#fff"}, ghost:{...base,background:"transparent",color:T.muted,border:`1.5px solid ${T.border}`}, danger:{...base,background:"#fef2f2",color:"#dc2626",border:"1.5px solid #fecaca"}, gold:{...base,background:T.gold,color:"#fff"} };
  return <button className={variant==="ghost"?"gh tap":"tap"} onClick={onClick} disabled={disabled||loading} style={V[variant]}>{loading ? <Spinner /> : children}</button>;
}

function Modal({ title, subtitle, onClose, children, width=520, mob }) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{ position:"fixed", inset:0, background:"rgba(26,23,20,.45)", display:"flex", alignItems:mob?"flex-end":"center", justifyContent:"center", zIndex:999, padding:mob?0:20, backdropFilter:"blur(6px)", animation:"fadeIn .18s" }}>
      <div style={{ background:T.surface, borderRadius:mob?"20px 20px 0 0":20, width:"100%", maxWidth:mob?"100%":width, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 -8px 40px rgba(0,0,0,.2)", animation:mob?"slideUp .25s":"fadeUp .22s" }}>
        {mob && <div style={{ width:40, height:4, background:"#d1cdc7", borderRadius:2, margin:"12px auto 0" }} />}
        <div style={{ padding:mob?"14px 20px 0":"24px 28px 0", borderBottom:`1px solid ${T.border}`, paddingBottom:14, marginTop:mob?6:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:mob?20:22, fontWeight:400, color:T.text }}>{title}</h2>
              {subtitle && <p style={{ fontSize:13, color:T.muted, marginTop:3 }}>{subtitle}</p>}
            </div>
            <button onClick={onClose} style={{ background:T.bg, border:"none", borderRadius:8, width:32, height:32, fontSize:18, color:T.muted, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>×</button>
          </div>
        </div>
        <div style={{ padding:mob?"16px 20px 28px":"22px 28px 28px" }}>{children}</div>
      </div>
    </div>
  );
}

/* ─── LOGIN ──────────────────────────────────────────────────────── */
function LoginScreen({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const submit = async () => {
    if (!email || !password) { setError("Preencha email e senha."); return; }
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError("Email ou senha incorretos.");
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:T.surface, borderRadius:20, padding:"40px 36px", width:"100%", maxWidth:400, boxShadow:"0 8px 40px rgba(0,0,0,.10)", animation:"fadeUp .3s" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:52, height:52, background:T.accent, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
            <span style={{ fontFamily:"'DM Serif Display',serif", color:"white", fontSize:22, fontStyle:"italic" }}>N</span>
          </div>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, fontWeight:400, letterSpacing:"-.3px" }}>Nexus CRM</h1>
          <p style={{ color:T.muted, fontSize:14, marginTop:6 }}>Acesso exclusivo — equipe comercial</p>
        </div>
        <div style={{ display:"grid", gap:14 }}>
          <Inp label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="seu@email.com" />
          <Inp label="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="••••••••" />
          {error && <div style={{ background:"#fef2f2", color:"#dc2626", borderRadius:9, padding:"10px 14px", fontSize:13, fontWeight:600 }}>⚠ {error}</div>}
          <Btn onClick={submit} loading={loading} full>Entrar</Btn>
        </div>
      </div>
    </div>
  );
}

/* ─── GOAL CELEBRATION ──────────────────────────────────────────── */
function GoalCelebration({ onDone }) {
  const ref = useRef(null), anim = useRef(null);
  useEffect(() => {
    try {
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      const bs = ctx.sampleRate*1.8, buf = ctx.createBuffer(1,bs,ctx.sampleRate), d = buf.getChannelData(0);
      for (let i=0;i<bs;i++) d[i]=(Math.random()*2-1);
      const ns=ctx.createBufferSource(); ns.buffer=buf;
      const fl=ctx.createBiquadFilter(); fl.type="bandpass"; fl.frequency.value=600; fl.Q.value=0.5;
      const gn=ctx.createGain(); gn.gain.setValueAtTime(0,ctx.currentTime); gn.gain.linearRampToValueAtTime(0.55,ctx.currentTime+0.15); gn.gain.linearRampToValueAtTime(0,ctx.currentTime+1.8);
      ns.connect(fl); fl.connect(gn); gn.connect(ctx.destination); ns.start(); ns.stop(ctx.currentTime+1.8);
      [0.05,0.22].forEach((t,i)=>{ const o=ctx.createOscillator(),g=ctx.createGain(); o.type="sine"; o.frequency.value=3200+i*200; g.gain.setValueAtTime(0,ctx.currentTime+t); g.gain.linearRampToValueAtTime(0.4,ctx.currentTime+t+0.02); g.gain.linearRampToValueAtTime(0,ctx.currentTime+t+0.14); o.connect(g); g.connect(ctx.destination); o.start(ctx.currentTime+t); o.stop(ctx.currentTime+t+0.2); });
    } catch(e) {}
    const canvas=ref.current; if(!canvas) return;
    canvas.width=window.innerWidth; canvas.height=window.innerHeight;
    const cx=canvas.getContext("2d");
    const COLS=["#10b981","#f59e0b","#6366f1","#f87171","#60a5fa","#fbbf24","#34d399","#a78bfa","#fff"];
    const ps=Array.from({length:180},()=>({ x:Math.random()*canvas.width, y:-20-Math.random()*200, r:5+Math.random()*9, color:COLS[Math.floor(Math.random()*COLS.length)], vx:(Math.random()-.5)*7, vy:3+Math.random()*6, rot:Math.random()*Math.PI*2, rv:(Math.random()-.5)*.18, sh:Math.random()>.5?"r":"c", op:1 }));
    let fr=0;
    const tick=()=>{ cx.clearRect(0,0,canvas.width,canvas.height); let alive=false;
      ps.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.rot+=p.rv; p.vy+=0.12;
        if(p.y<canvas.height+30){alive=true; p.op=Math.max(0,1-p.y/(canvas.height*1.1));}
        cx.save(); cx.globalAlpha=p.op; cx.translate(p.x,p.y); cx.rotate(p.rot); cx.fillStyle=p.color;
        if(p.sh==="r") cx.fillRect(-p.r,-p.r/2,p.r*2,p.r); else{cx.beginPath();cx.arc(0,0,p.r/2,0,Math.PI*2);cx.fill();}
        cx.restore();
      });
      fr++; if(alive&&fr<260) anim.current=requestAnimationFrame(tick); else onDone();
    };
    anim.current=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(anim.current);
  },[]);
  return (
    <>
      <canvas ref={ref} style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999 }} />
      <div style={{ position:"fixed", inset:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:9998, pointerEvents:"none" }}>
        <div style={{ animation:"goalPop .5s cubic-bezier(.17,.67,.35,1.4)", textAlign:"center" }}>
          <div style={{ fontSize:72, lineHeight:1, filter:"drop-shadow(0 4px 24px rgba(16,185,129,.6))" }}>🏆</div>
          <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:42, color:"#10b981", letterSpacing:"-1px", marginTop:8, textShadow:"0 2px 20px rgba(16,185,129,.4)" }}>GOOOL!</div>
          <div style={{ fontSize:16, color:"#065f46", fontWeight:700, marginTop:4 }}>Lead Matriculado! 🎉</div>
        </div>
      </div>
    </>
  );
}

/* ─── DASHBOARD ─────────────────────────────────────────────────── */
function Dashboard({ leads, mob }) {
  const ts=today(), total=leads.length, matr=leads.filter(l=>l.stage==="matriculado").length;
  const ativos=leads.filter(l=>!["matriculado","perdido"].includes(l.stage)).length;
  const fuHj=leads.filter(l=>l.followUp?.date===ts).length, atr=leads.filter(l=>l.followUp?.date&&l.followUp.date<ts).length;
  const taxa=total>0?Math.round((matr/total)*100):0;
  const etapas=STAGES.map(s=>({...s,cnt:leads.filter(l=>l.stage===s.id).length}));
  const origens=SOURCES.map(s=>({l:s,n:leads.filter(x=>x.source===s).length})).filter(x=>x.n>0).sort((a,b)=>b.n-a.n);
  const maxO=Math.max(...origens.map(x=>x.n),1);
  const recentes=[...leads].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);
  const SC=({label,value,sub,color,icon})=>(
    <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.radius, padding:mob?"13px 15px":"20px 22px", display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".07em" }}>{label}</span>
        <span style={{ fontSize:17 }}>{icon}</span>
      </div>
      <div style={{ fontSize:mob?28:38, fontWeight:700, color, letterSpacing:"-1.5px", lineHeight:1 }}>{value}</div>
      {sub&&<div style={{ fontSize:11, color:T.muted }}>{sub}</div>}
    </div>
  );
  return (
    <div style={{ animation:"fadeUp .3s" }}>
      <div style={{ marginBottom:18 }}>
        <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:mob?26:32, fontWeight:400, letterSpacing:"-.5px" }}>Visão Geral</h1>
        <p style={{ color:T.muted, fontSize:13, marginTop:3 }}>Resumo do pipeline comercial</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
        <SC label="Total de Leads" value={total} icon="👥" color={T.text} />
        <SC label="Em Negociação"  value={ativos} icon="⚡" color="#6366f1" sub={`${total-ativos} fora`} />
        <SC label="Matriculados"   value={matr}   icon="🏆" color={T.accent} sub={`${taxa}% conversão`} />
        <SC label="Follow-ups Hoje" value={fuHj}  icon="🔔" color={T.gold} sub={atr>0?`${atr} atrasado(s)`:""} />
      </div>
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.radius, padding:mob?16:22, marginBottom:12 }}>
        <h3 style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".07em", marginBottom:14 }}>Pipeline por Etapa</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {etapas.map(s=>(
            <div key={s.id} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ width:mob?88:116, fontSize:12, fontWeight:500, flexShrink:0 }}>{s.label}</span>
              <div style={{ flex:1, background:T.bg, borderRadius:6, height:8, overflow:"hidden" }}>
                <div style={{ width:total>0?`${(s.cnt/total)*100}%`:"0%", height:"100%", background:s.hex, borderRadius:6, transition:"width .4s" }} />
              </div>
              <span style={{ fontSize:13, fontWeight:700, color:s.hex, width:20, textAlign:"right" }}>{s.cnt}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.radius, padding:mob?16:22, marginBottom:12 }}>
        <h3 style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".07em", marginBottom:14 }}>Top Origens</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {origens.slice(0,5).map(o=>(
            <div key={o.l} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ width:76, fontSize:12, flexShrink:0 }}>{o.l}</span>
              <div style={{ flex:1, background:T.bg, borderRadius:6, height:8, overflow:"hidden" }}>
                <div style={{ width:`${(o.n/maxO)*100}%`, height:"100%", background:T.accent, borderRadius:6, opacity:.7 }} />
              </div>
              <span style={{ fontSize:13, fontWeight:700, color:T.muted, width:20, textAlign:"right" }}>{o.n}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.radius, padding:mob?16:22 }}>
        <h3 style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".07em", marginBottom:14 }}>Leads Recentes</h3>
        <div style={{ display:"flex", flexDirection:"column" }}>
          {recentes.map(l=>{ const st=STAGES.find(s=>s.id===l.stage); return (
            <div key={l.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
              <div><div style={{ fontWeight:600, fontSize:14 }}>{l.name}</div><div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{l.course||"—"}</div></div>
              <Pill color={st?.hex}>{st?.label}</Pill>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

/* ─── KANBAN ─────────────────────────────────────────────────────── */
function KanbanBoard({ leads, onSelect, onMove, mob }) {
  const [dragOver, setDragOver]     = useState(null);
  const [celebrating, setCelebrating] = useState(false);
  const [activeStage, setActiveStage] = useState("novo");
  const dragging = useRef(null);
  const ts = today();

  if (mob) {
    const stage=STAGES.find(s=>s.id===activeStage), stLeads=leads.filter(l=>l.stage===activeStage);
    return (
      <div style={{ animation:"fadeUp .3s" }}>
        {celebrating && <GoalCelebration onDone={()=>setCelebrating(false)} />}
        <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, fontWeight:400, marginBottom:14 }}>Pipeline</h1>
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:10, marginBottom:16, WebkitOverflowScrolling:"touch" }}>
          {STAGES.map(s=>{ const cnt=leads.filter(l=>l.stage===s.id).length, on=s.id===activeStage; return (
            <button key={s.id} onClick={()=>setActiveStage(s.id)} className="tap"
              style={{ flexShrink:0, background:on?s.hex:T.surface, color:on?"white":T.muted, border:`1.5px solid ${on?s.hex:T.border}`, borderRadius:20, padding:"6px 13px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:5 }}>
              {s.emoji} {s.label} <span style={{ background:on?"rgba(255,255,255,.25)":T.bg, borderRadius:10, padding:"1px 6px", fontSize:11 }}>{cnt}</span>
            </button>
          );})}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {stLeads.length===0 ? <div style={{ background:T.surface, border:`1.5px dashed ${T.border}`, borderRadius:T.radius, padding:32, textAlign:"center", color:T.muted }}>Nenhum lead nesta etapa</div>
          : stLeads.map(lead=>{ const isTd=lead.followUp?.date===ts, ov=lead.followUp?.date&&lead.followUp.date<ts; return (
            <div key={lead.id} onClick={()=>onSelect(lead)}
              style={{ background:T.surface, borderRadius:12, padding:"14px 16px", border:`1px solid ${T.border}`, borderLeft:`3px solid ${stage.hex}`, cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>{lead.name}</div>
              <div style={{ fontSize:13, color:T.muted, marginBottom:2 }}>{lead.phone}</div>
              <div style={{ fontSize:12, color:T.muted, marginBottom:(isTd||ov)?10:0 }}>{lead.course||"—"} · {lead.source||"—"}</div>
              {(isTd||ov)&&<div style={{ background:ov?"#fef2f2":"#fefce8", color:ov?"#b91c1c":"#92400e", borderRadius:6, padding:"3px 10px", fontSize:12, fontWeight:700, display:"inline-block" }}>{ov?"⚠ Atrasado":"🔔 Hoje"}</div>}
            </div>
          );})}
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation:"fadeUp .3s" }}>
      {celebrating && <GoalCelebration onDone={()=>setCelebrating(false)} />}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:32, fontWeight:400, letterSpacing:"-.5px" }}>Pipeline</h1>
        <p style={{ color:T.muted, fontSize:14, marginTop:4 }}>Arraste os cards entre as etapas</p>
      </div>
      <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:16, alignItems:"flex-start" }}>
        {STAGES.map(stage=>{ const sl=leads.filter(l=>l.stage===stage.id), over=dragOver===stage.id; return (
          <div key={stage.id}
            onDragOver={e=>{e.preventDefault();setDragOver(stage.id);}}
            onDragLeave={()=>setDragOver(null)}
            onDrop={e=>{e.preventDefault();if(dragging.current){const prev=leads.find(l=>l.id===dragging.current);onMove(dragging.current,stage.id);if(stage.id==="matriculado"&&prev?.stage!=="matriculado")setCelebrating(true);}setDragOver(null);dragging.current=null;}}
            style={{ minWidth:216, flex:"0 0 216px", background:over?stage.hex+"10":T.bg, border:`1.5px solid ${over?stage.hex:T.border}`, borderRadius:T.radius, padding:14, transition:"all .18s" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <span style={{ fontSize:14, color:stage.hex }}>{stage.emoji}</span>
              <span style={{ fontSize:12, fontWeight:700 }}>{stage.label}</span>
              <span style={{ marginLeft:"auto", background:T.surface, border:`1px solid ${T.border}`, borderRadius:20, padding:"1px 8px", fontSize:11, fontWeight:700, color:T.muted }}>{sl.length}</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:9, minHeight:48 }}>
              {sl.map(lead=>{ const isTd=lead.followUp?.date===ts, ov=lead.followUp?.date&&lead.followUp.date<ts; return (
                <div key={lead.id} draggable onDragStart={()=>dragging.current=lead.id}
                  onClick={()=>onSelect(lead)} className="c-hover"
                  style={{ background:T.surface, borderRadius:10, padding:"13px 14px", border:`1px solid ${T.border}`, cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,.05)", borderTop:`2.5px solid ${stage.hex}` }}>
                  <div style={{ fontWeight:600, fontSize:13, marginBottom:4 }}>{lead.name}</div>
                  <div style={{ fontSize:11, color:T.muted, marginBottom:(isTd||ov)?8:0 }}>{lead.course||"—"}</div>
                  {(isTd||ov)&&<div style={{ background:ov?"#fef2f2":"#fefce8", color:ov?"#b91c1c":"#92400e", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700 }}>{ov?"⚠ Atrasado":"🔔 Hoje"}</div>}
                </div>
              );})}
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}

/* ─── LEADS LIST ─────────────────────────────────────────────────── */
function LeadsList({ leads, onSelect, onAdd, mob }) {
  const [search, setSearch] = useState("");
  const [fs, setFs] = useState("todos");
  const filtered = leads.filter(l=>{
    const ms=!search||l.name.toLowerCase().includes(search.toLowerCase())||l.phone.includes(search)||(l.course||"").toLowerCase().includes(search.toLowerCase());
    return ms&&(fs==="todos"||l.stage===fs);
  });
  return (
    <div style={{ animation:"fadeUp .3s" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
        <div>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:mob?26:32, fontWeight:400 }}>Leads</h1>
          <p style={{ color:T.muted, fontSize:13, marginTop:3 }}>{leads.length} leads no total</p>
        </div>
        {!mob && <Btn onClick={onAdd}>+ Novo Lead</Btn>}
      </div>
      <div style={{ display:"flex", flexDirection:mob?"column":"row", gap:10, marginBottom:14 }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Buscar nome, telefone ou curso..." style={{ flex:1, background:T.surface, border:`1.5px solid ${T.border}`, borderRadius:10, padding:"11px 14px", fontSize:16, color:T.text, outline:"none", fontFamily:"'DM Sans',sans-serif" }} />
        <select value={fs} onChange={e=>setFs(e.target.value)} style={{ background:T.surface, border:`1.5px solid ${T.border}`, borderRadius:10, padding:"11px 13px", fontSize:15, color:T.text, outline:"none", fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>
          <option value="todos">Todas as etapas</option>
          {STAGES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>
      {mob ? (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.length===0 ? <div style={{ textAlign:"center", color:T.muted, padding:40 }}>Nenhum lead encontrado.</div>
          : filtered.map(lead=>{ const st=STAGES.find(s=>s.id===lead.stage), ov=lead.followUp?.date&&lead.followUp.date<today(), isTd=lead.followUp?.date===today(); return (
            <div key={lead.id} onClick={()=>onSelect(lead)} className="c-hover"
              style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.radius, padding:"14px 16px", cursor:"pointer", boxShadow:"0 1px 3px rgba(0,0,0,.05)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div style={{ fontWeight:700, fontSize:15 }}>{lead.name}</div>
                <Pill color={st?.hex}>{st?.label}</Pill>
              </div>
              <div style={{ fontSize:13, color:T.muted, marginBottom:2 }}>📱 {lead.phone}</div>
              <div style={{ fontSize:13, color:T.muted, marginBottom:(isTd||ov)?10:0 }}>📚 {lead.course||"—"} · {lead.source||"—"}</div>
              {(isTd||ov)&&<div style={{ background:ov?"#fef2f2":"#fefce8", color:ov?"#b91c1c":"#92400e", borderRadius:6, padding:"3px 10px", fontSize:12, fontWeight:700, display:"inline-block" }}>{ov?"⚠ Follow-up atrasado":"🔔 Follow-up hoje"}</div>}
            </div>
          );})}
        </div>
      ) : (
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.radius, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
            <thead><tr style={{ borderBottom:`1px solid ${T.border}` }}>{["Nome","Telefone","Curso","Origem","Etapa","Follow-up"].map(h=>(
              <th key={h} style={{ padding:"12px 18px", textAlign:"left", fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".07em" }}>{h}</th>
            ))}</tr></thead>
            <tbody>
              {filtered.map(lead=>{ const st=STAGES.find(s=>s.id===lead.stage), ov=lead.followUp?.date&&lead.followUp.date<today(), isTd=lead.followUp?.date===today(); return (
                <tr key={lead.id} className="rw" onClick={()=>onSelect(lead)} style={{ borderBottom:`1px solid ${T.border}`, cursor:"pointer" }}>
                  <td style={{ padding:"13px 18px", fontWeight:600 }}>{lead.name}</td>
                  <td style={{ padding:"13px 18px", color:T.muted }}>{lead.phone}</td>
                  <td style={{ padding:"13px 18px", color:T.muted, fontSize:13 }}>{lead.course||"—"}</td>
                  <td style={{ padding:"13px 18px", color:T.muted, fontSize:13 }}>{lead.source||"—"}</td>
                  <td style={{ padding:"13px 18px" }}><Pill color={st?.hex}>{st?.label}</Pill></td>
                  <td style={{ padding:"13px 18px" }}>{lead.followUp?<span style={{ fontSize:12, fontWeight:700, color:ov?"#dc2626":isTd?T.gold:T.muted }}>{ov?"⚠ ":isTd?"🔔 ":""}{lead.followUp.date}</span>:<span style={{ color:T.muted, fontSize:13 }}>—</span>}</td>
                </tr>
              );})}
              {filtered.length===0&&<tr><td colSpan={6} style={{ padding:"48px 0", textAlign:"center", color:T.muted }}>Nenhum lead encontrado.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── FOLLOW-UPS ─────────────────────────────────────────────────── */
function FollowUps({ leads, onSelect, mob }) {
  const ts=today();
  const ov=leads.filter(l=>l.followUp?.date&&l.followUp.date<ts).sort((a,b)=>a.followUp.date.localeCompare(b.followUp.date));
  const td=leads.filter(l=>l.followUp?.date===ts);
  const up=leads.filter(l=>l.followUp?.date&&l.followUp.date>ts).sort((a,b)=>a.followUp.date.localeCompare(b.followUp.date));
  const Sec=({title,color,items,empty})=>(
    <div style={{ marginBottom:22 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:mob?20:22, fontWeight:400, color }}>{title}</h2>
        <span style={{ background:color+"18", color, borderRadius:20, padding:"2px 10px", fontSize:12, fontWeight:700 }}>{items.length}</span>
      </div>
      {items.length===0?<div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.radius, padding:24, textAlign:"center", color:T.muted, fontSize:14 }}>{empty}</div>
      :<div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {items.map(l=>{ const st=STAGES.find(s=>s.id===l.stage); return (
          <div key={l.id} className="c-hover" onClick={()=>onSelect(l)}
            style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.radius, padding:"14px 16px", cursor:"pointer", boxShadow:"0 1px 3px rgba(0,0,0,.05)", borderLeft:`3px solid ${color}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
              <div style={{ fontWeight:700, fontSize:15 }}>{l.name}</div>
              <span style={{ fontSize:12, fontWeight:700, color }}>{l.followUp.date}</span>
            </div>
            <div style={{ fontSize:13, color:T.muted, marginBottom:8 }}>{l.phone} · {l.course||"—"}</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:6 }}>
              <Pill color={st?.hex}>{st?.label}</Pill>
              {l.followUp.note&&<span style={{ fontSize:12, color:T.muted, fontStyle:"italic" }}>"{l.followUp.note}"</span>}
            </div>
          </div>
        );})}
      </div>}
    </div>
  );
  return (
    <div style={{ animation:"fadeUp .3s" }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:mob?26:32, fontWeight:400 }}>Follow-ups</h1>
        <p style={{ color:T.muted, fontSize:13, marginTop:3 }}>Seus contatos agendados</p>
      </div>
      <Sec title="Atrasados" color="#dc2626" items={ov} empty="Nenhum follow-up atrasado 🎉" />
      <Sec title="Hoje" color={T.gold} items={td} empty="Nenhum follow-up para hoje." />
      <Sec title="Próximos" color={T.accent} items={up} empty="Nenhum follow-up futuro agendado." />
    </div>
  );
}

/* ─── RELATÓRIOS ─────────────────────────────────────────────────── */
function Relatorios({ leads, mob }) {
  const total=leads.length, matr=leads.filter(l=>l.stage==="matriculado").length, perd=leads.filter(l=>l.stage==="perdido").length;
  const taxa=total>0?Math.round((matr/total)*100):0;
  const cData=COURSES.map(c=>({ l:c.length>22?c.slice(0,22)+"…":c, full:c, t:leads.filter(x=>x.course===c).length, m:leads.filter(x=>x.course===c&&x.stage==="matriculado").length })).filter(x=>x.t>0).sort((a,b)=>b.t-a.t);
  const oData=SOURCES.map(s=>({ l:s, t:leads.filter(x=>x.source===s).length, m:leads.filter(x=>x.source===s&&x.stage==="matriculado").length })).filter(x=>x.t>0).sort((a,b)=>b.t-a.t);
  const maxO=Math.max(...oData.map(x=>x.t),1);
  return (
    <div style={{ animation:"fadeUp .3s" }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:mob?26:32, fontWeight:400 }}>Relatórios</h1>
        <p style={{ color:T.muted, fontSize:13, marginTop:3 }}>Análise de conversão do funil</p>
      </div>
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.radius, padding:mob?16:22, marginBottom:12 }}>
        <h3 style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".07em", marginBottom:16 }}>Funil de Conversão</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:18 }}>
          {STAGES.map(s=>{ const cnt=leads.filter(l=>l.stage===s.id).length, pct=total>0?Math.round((cnt/total)*100):0; return (
            <div key={s.id} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ width:mob?88:116, fontSize:12, fontWeight:500, flexShrink:0 }}>{s.label}</span>
              <div style={{ flex:1, background:T.bg, borderRadius:6, height:24, overflow:"hidden" }}>
                <div style={{ width:`${pct}%`, height:"100%", background:s.hex, borderRadius:6, opacity:.85, display:"flex", alignItems:"center", paddingLeft:8, minWidth:pct>0?28:0 }}>
                  {pct>8&&<span style={{ color:"white", fontSize:11, fontWeight:700 }}>{pct}%</span>}
                </div>
              </div>
              <span style={{ fontSize:13, fontWeight:700, color:s.hex, width:24, textAlign:"right" }}>{cnt}</span>
            </div>
          );})}
        </div>
        <div style={{ display:"flex", gap:24 }}>
          <div><div style={{ fontSize:32, fontWeight:700, color:T.accent, letterSpacing:"-1px", lineHeight:1 }}>{taxa}%</div><div style={{ fontSize:11, color:T.muted, marginTop:3 }}>Taxa de conversão</div></div>
          <div><div style={{ fontSize:32, fontWeight:700, color:"#f87171", letterSpacing:"-1px", lineHeight:1 }}>{perd>0&&total>0?Math.round((perd/total)*100):0}%</div><div style={{ fontSize:11, color:T.muted, marginTop:3 }}>Taxa de perda</div></div>
        </div>
      </div>
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.radius, padding:mob?16:22, marginBottom:12 }}>
        <h3 style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".07em", marginBottom:14 }}>Performance por Curso</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {cData.map(c=>(
            <div key={c.full} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
              <div><div style={{ fontWeight:500, fontSize:14 }}>{c.l}</div><div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{c.t} leads · {c.m} matr.</div></div>
              <Pill color={T.accent}>{c.t>0?Math.round((c.m/c.t)*100):0}%</Pill>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.radius, padding:mob?16:22 }}>
        <h3 style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".07em", marginBottom:14 }}>Performance por Origem</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {oData.map(o=>(
            <div key={o.l}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:5 }}>
                <span style={{ fontWeight:500 }}>{o.l}</span>
                <span style={{ color:T.muted, fontSize:12 }}>{o.m}/{o.t} matr.</span>
              </div>
              <div style={{ background:T.bg, borderRadius:6, height:8, overflow:"hidden" }}>
                <div style={{ width:`${(o.t/maxO)*100}%`, height:"100%", background:T.accent, borderRadius:6, opacity:.65 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── LEAD MODAL ─────────────────────────────────────────────────── */
function LeadModal({ lead, onUpdate, onDelete, onClose, mob }) {
  const [tab, setTab]       = useState("info");
  const [editing, setEditing] = useState(false);
  const [form, setForm]     = useState({...lead});
  const [hist, setHist]     = useState({type:"WhatsApp",note:""});
  const [fu, setFu]         = useState(lead.followUp||{date:"",note:""});
  const [saving, setSaving] = useState(false);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const ts=today(), st=STAGES.find(s=>s.id===lead.stage);

  const saveInfo = async () => {
    setSaving(true);
    await supabase.from("leads").update({ name:form.name, phone:form.phone, email:form.email, course:form.course, source:form.source, notes:form.notes }).eq("id", lead.id);
    onUpdate({...lead,...form}); setEditing(false); setSaving(false);
  };

  const changeStage = async (id) => {
    await supabase.from("leads").update({ stage:id }).eq("id", lead.id);
    onUpdate({...lead, stage:id});
  };

  const addHist = async () => {
    if (!hist.note.trim()) return;
    const entry = { id:uid(), lead_id:lead.id, type:hist.type, note:hist.note, date:new Date().toISOString() };
    await supabase.from("lead_history").insert(entry);
    onUpdate({...lead, history:[{id:entry.id, type:entry.type, note:entry.note, date:entry.date}, ...lead.history]});
    setHist({type:"WhatsApp", note:""});
  };

  const saveFu = async () => {
    const fu_date = fu.date || null, fu_note = fu.note || null;
    await supabase.from("leads").update({ follow_up_date:fu_date, follow_up_note:fu_note }).eq("id", lead.id);
    onUpdate({...lead, followUp:fu.date?{date:fu.date,note:fu.note}:null});
  };

  const deleteLead = async () => {
    if (!window.confirm("Excluir este lead?")) return;
    await supabase.from("leads").delete().eq("id", lead.id);
    onDelete(lead.id);
  };

  return (
    <Modal title={lead.name} subtitle={`${st?.label} · ${lead.course||"Curso não definido"}`} onClose={onClose} width={620} mob={mob}>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
        {STAGES.map(s=>(
          <button key={s.id} onClick={()=>changeStage(s.id)} className="tap"
            style={{ flexShrink:0, background:lead.stage===s.id?s.hex:"transparent", color:lead.stage===s.id?"white":T.muted, border:`1.5px solid ${lead.stage===s.id?s.hex:T.border}`, borderRadius:20, padding:"5px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
            {s.emoji} {s.label}
          </button>
        ))}
      </div>
      <div style={{ display:"flex", borderBottom:`1px solid ${T.border}`, marginBottom:18 }}>
        {[["info","Infos"],["historico","Histórico"],["followup","Follow-up"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} className="tap"
            style={{ flex:1, background:"none", border:"none", borderBottom:tab===id?`2px solid ${T.accent}`:"2px solid transparent", padding:"10px 8px", fontSize:14, fontWeight:600, color:tab===id?T.accent:T.muted, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", marginBottom:-1 }}>
            {lbl}
          </button>
        ))}
      </div>

      {tab==="info"&&(editing?(
        <div style={{ display:"grid", gap:13 }}>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:11 }}>
            <Inp label="Nome" value={form.name} onChange={e=>f("name",e.target.value)} />
            <Inp label="Telefone" value={form.phone} onChange={e=>f("phone",e.target.value)} />
            <Inp label="Email" value={form.email} onChange={e=>f("email",e.target.value)} />
            <Sel label="Curso" value={form.course} onChange={e=>f("course",e.target.value)} options={COURSES} />
            <Sel label="Origem" value={form.source} onChange={e=>f("source",e.target.value)} options={SOURCES} />
          </div>
          <Inp label="Observações" type="textarea" value={form.notes} onChange={e=>f("notes",e.target.value)} />
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <Btn variant="ghost" onClick={()=>setEditing(false)}>Cancelar</Btn>
            <Btn onClick={saveInfo} loading={saving} full={mob}>✓ Salvar</Btn>
          </div>
        </div>
      ):(
        <div style={{ display:"grid", gap:12 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[["Nome",lead.name],["Telefone",lead.phone],["Email",lead.email||"—"],["Curso",lead.course||"—"],["Origem",lead.source||"—"]].map(([l,v])=>(
              <div key={l} style={{ background:T.bg, borderRadius:10, padding:"11px 14px" }}>
                <div style={{ fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".07em", marginBottom:3 }}>{l}</div>
                <div style={{ fontWeight:600, fontSize:14, wordBreak:"break-word" }}>{v}</div>
              </div>
            ))}
          </div>
          {lead.notes&&<div style={{ background:T.goldLight, borderRadius:10, padding:"12px 14px", borderLeft:`3px solid ${T.gold}` }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.gold, textTransform:"uppercase", letterSpacing:".07em", marginBottom:4 }}>Observações</div>
            <div style={{ fontSize:13, color:"#78350f" }}>{lead.notes}</div>
          </div>}
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", flexWrap:"wrap" }}>
            <Btn variant="danger" onClick={deleteLead}>🗑 Excluir</Btn>
            <Btn variant="ghost" onClick={()=>setEditing(true)}>✏ Editar</Btn>
          </div>
        </div>
      ))}

      {tab==="historico"&&(
        <div>
          <div style={{ display:"flex", flexDirection:mob?"column":"row", gap:10, marginBottom:16, alignItems:mob?"stretch":"flex-end" }}>
            <Sel label="Tipo" value={hist.type} onChange={e=>setHist(p=>({...p,type:e.target.value}))} options={CTYPES} />
            <div style={{ flex:1 }}><Inp label="Nota do contato" value={hist.note} onChange={e=>setHist(p=>({...p,note:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addHist()} placeholder="O que aconteceu?" /></div>
            <Btn onClick={addHist} full={mob}>+ Registrar</Btn>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:260, overflowY:"auto" }}>
            {lead.history.length===0?<div style={{ textAlign:"center", color:T.muted, padding:32 }}>Nenhum contato ainda.</div>
            :lead.history.map(h=>(
              <div key={h.id} style={{ display:"flex", gap:12, background:T.bg, borderRadius:10, padding:"12px 14px" }}>
                <span style={{ fontSize:20 }}>{{ WhatsApp:"💬",Ligação:"📞",Email:"📧",Reunião:"🤝",Anotação:"📝" }[h.type]||"📌"}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3, flexWrap:"wrap", gap:4 }}>
                    <span style={{ fontWeight:700, fontSize:13, color:T.accent }}>{h.type}</span>
                    <span style={{ fontSize:11, color:T.muted }}>{fmtDate(h.date)}</span>
                  </div>
                  <div style={{ color:T.muted, fontSize:13, wordBreak:"break-word" }}>{h.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="followup"&&(
        <div style={{ display:"grid", gap:14 }}>
          {lead.followUp&&<div style={{ background:lead.followUp.date<ts?"#fef2f2":T.accentLight, borderRadius:10, padding:"14px 16px", borderLeft:`3px solid ${lead.followUp.date<ts?"#ef4444":T.accent}` }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>{lead.followUp.date<ts?"⚠ Follow-up atrasado":"✓ Agendado"}</div>
            <div style={{ fontSize:13, color:T.muted }}>Data: <strong>{lead.followUp.date}</strong></div>
            {lead.followUp.note&&<div style={{ fontSize:13, color:T.muted, marginTop:2 }}>{lead.followUp.note}</div>}
          </div>}
          <Inp label="Data" type="date" value={fu.date} onChange={e=>setFu(p=>({...p,date:e.target.value}))} />
          <Inp label="Nota (opcional)" value={fu.note} onChange={e=>setFu(p=>({...p,note:e.target.value}))} placeholder="Ex: Ligar para confirmar" />
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", flexWrap:"wrap" }}>
            {lead.followUp&&<Btn variant="danger" onClick={async()=>{await supabase.from("leads").update({follow_up_date:null,follow_up_note:null}).eq("id",lead.id);onUpdate({...lead,followUp:null});setFu({date:"",note:""});}}>Remover</Btn>}
            <Btn variant="gold" onClick={saveFu} full={mob}>💾 Salvar follow-up</Btn>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ─── ADD LEAD MODAL ─────────────────────────────────────────────── */
function AddLeadModal({ onAdd, onClose, mob }) {
  const [form, setForm] = useState({name:"",phone:"",email:"",course:"",source:"",notes:"",stage:"novo"});
  const [saving, setSaving] = useState(false);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const submit = async () => {
    if (!form.name.trim()||!form.phone.trim()) { alert("Nome e telefone são obrigatórios."); return; }
    setSaving(true);
    const id = uid();
    const { error } = await supabase.from("leads").insert({
      id, name:form.name, phone:form.phone, email:form.email||null,
      course:form.course||null, source:form.source||null,
      stage:form.stage, notes:form.notes||null,
      created_at: new Date().toISOString(),
    });
    if (!error) { onAdd({...form, id, createdAt:new Date().toISOString(), history:[], followUp:null}); onClose(); }
    else alert("Erro ao salvar. Tente novamente.");
    setSaving(false);
  };
  return (
    <Modal title="Novo Lead" subtitle="Preencha os dados do prospect" onClose={onClose} mob={mob}>
      <div style={{ display:"grid", gap:13 }}>
        <Inp label="Nome completo *" value={form.name} onChange={e=>f("name",e.target.value)} />
        <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":"1fr 1fr", gap:11 }}>
          <Inp label="Telefone *" value={form.phone} onChange={e=>f("phone",e.target.value)} placeholder="(11) 99999-9999" />
          <Inp label="Email" value={form.email} onChange={e=>f("email",e.target.value)} placeholder="email@exemplo.com" />
          <Sel label="Curso" value={form.course} onChange={e=>f("course",e.target.value)} options={[{value:"",label:"Selecione..."},...COURSES.map(c=>({value:c,label:c}))]} />
          <Sel label="Origem" value={form.source} onChange={e=>f("source",e.target.value)} options={[{value:"",label:"Selecione..."},...SOURCES.map(s=>({value:s,label:s}))]} />
        </div>
        <Sel label="Etapa inicial" value={form.stage} onChange={e=>f("stage",e.target.value)} options={STAGES.map(s=>({value:s.id,label:s.label}))} />
        <Inp label="Observações" type="textarea" value={form.notes} onChange={e=>f("notes",e.target.value)} placeholder="Informações relevantes sobre o lead..." />
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn onClick={submit} loading={saving} full={mob}>Salvar Lead</Btn>
        </div>
      </div>
    </Modal>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────────────────── */
function Sidebar({ active, onChange, fuCount, onLogout, userEmail }) {
  return (
    <aside style={{ width:220, background:T.surface, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", height:"100vh", position:"sticky", top:0, flexShrink:0 }}>
      <div style={{ padding:"24px 20px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
          <div style={{ width:36, height:36, background:T.accent, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontFamily:"'DM Serif Display',serif", color:"white", fontSize:14, fontStyle:"italic" }}>N</span>
          </div>
          <div>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:15, fontWeight:400 }}>Nexus</div>
            <div style={{ fontSize:11, color:T.muted }}>English Center</div>
          </div>
        </div>
        <nav style={{ display:"flex", flexDirection:"column", gap:3 }}>
          {NAV_ITEMS.map(item=>{ const on=active===item.id; return (
            <button key={item.id} onClick={()=>onChange(item.id)} className="nav-itm"
              style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:9, border:"none", background:on?T.accentLight:"transparent", color:on?T.accent:T.muted, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:on?700:500, textAlign:"left", transition:"all .15s" }}>
              <span style={{ fontSize:16 }}>{item.icon}</span>{item.label}
              {item.id==="followups"&&fuCount>0&&<span style={{ marginLeft:"auto", background:T.gold, color:"white", borderRadius:20, padding:"1px 7px", fontSize:10, fontWeight:700 }}>{fuCount}</span>}
            </button>
          );})}
        </nav>
      </div>
      <div style={{ marginTop:"auto", padding:20, borderTop:`1px solid ${T.border}` }}>
        <div style={{ fontSize:12, color:T.muted, marginBottom:10, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>👤 {userEmail}</div>
        <button onClick={onLogout} className="gh tap" style={{ width:"100%", background:"transparent", border:`1.5px solid ${T.border}`, borderRadius:9, padding:"8px", fontSize:13, fontWeight:600, color:T.muted, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Sair</button>
      </div>
    </aside>
  );
}

/* ─── BOTTOM NAV ─────────────────────────────────────────────────── */
function BottomNav({ active, onChange, fuCount }) {
  return (
    <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:T.surface, borderTop:`1px solid ${T.border}`, display:"flex", zIndex:100, paddingBottom:"env(safe-area-inset-bottom,0px)", boxShadow:"0 -4px 20px rgba(0,0,0,.08)" }}>
      {NAV_ITEMS.map(item=>{ const on=active===item.id; return (
        <button key={item.id} onClick={()=>onChange(item.id)} className="tap"
          style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"10px 4px 8px", border:"none", background:"transparent", color:on?T.accent:T.muted, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:on?700:500, transition:"color .15s", position:"relative" }}>
          <span style={{ fontSize:20, lineHeight:1 }}>{item.icon}</span>
          {item.label}
          {item.id==="followups"&&fuCount>0&&<span style={{ position:"absolute", top:6, right:"calc(50% - 18px)", background:T.gold, color:"white", borderRadius:10, padding:"0 5px", fontSize:9, fontWeight:700, lineHeight:"16px" }}>{fuCount}</span>}
        </button>
      );})}
    </nav>
  );
}

function FAB({ onClick }) {
  return (
    <button onClick={onClick} className="tap"
      style={{ position:"fixed", bottom:"calc(68px + env(safe-area-inset-bottom,0px))", right:20, width:54, height:54, borderRadius:27, background:T.accent, border:"none", color:"white", fontSize:26, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(13,115,119,.45)", cursor:"pointer", zIndex:99 }}>
      +
    </button>
  );
}

/* ─── APP ROOT ───────────────────────────────────────────────────── */
export default function App() {
  const mob = useIsMobile();
  const [session, setSession]   = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [leads, setLeads]       = useState([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [page, setPage]         = useState("dashboard");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd]   = useState(false);

  /* ── auth listener ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session); setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  /* ── load leads from supabase ── */
  useEffect(() => {
    if (!session) return;
    setDbLoading(true);
    (async () => {
      const { data: leadsData } = await supabase.from("leads").select("*").order("created_at", { ascending:false });
      const { data: histData }  = await supabase.from("lead_history").select("*").order("date", { ascending:false });
      const merged = (leadsData||[]).map(l => ({
        id: l.id, name: l.name, phone: l.phone, email: l.email||"",
        course: l.course||"", source: l.source||"", stage: l.stage,
        notes: l.notes||"", createdAt: l.created_at,
        followUp: l.follow_up_date ? { date: l.follow_up_date, note: l.follow_up_note||"" } : null,
        history: (histData||[]).filter(h=>h.lead_id===l.id).map(h=>({ id:h.id, type:h.type, note:h.note, date:h.date })),
      }));
      setLeads(merged); setDbLoading(false);
    })();
  }, [session]);

  const updateLead  = u => { setLeads(p=>p.map(l=>l.id===u.id?u:l)); setSelected(u); };
  const addLead     = d => setLeads(p=>[d,...p]);
  const deleteLead  = id => { setLeads(p=>p.filter(l=>l.id!==id)); setSelected(null); };
  const moveLead    = async (lid, sid) => {
    await supabase.from("leads").update({ stage:sid }).eq("id", lid);
    setLeads(p=>p.map(l=>l.id===lid?{...l,stage:sid}:l));
  };
  const nav = p => { setPage(p); setSelected(null); };
  const logout = () => supabase.auth.signOut();
  const ts = today();
  const fuCount = leads.filter(l=>l.followUp?.date&&l.followUp.date<=ts).length;
  const sp = { mob };

  if (authLoading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:T.bg }}>
      <Spinner />
    </div>
  );

  if (!session) return <><GlobalStyles /><LoginScreen /></>;

  return (
    <>
      <GlobalStyles />
      <div style={{ display:"flex", minHeight:"100vh" }}>
        {!mob && <Sidebar active={page} onChange={nav} fuCount={fuCount} onLogout={logout} userEmail={session.user.email} />}
        <main style={{ flex:1, padding:mob?"18px 16px 90px":"36px 40px", overflowY:"auto", minHeight:"100vh" }}>
          {mob && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                <div style={{ width:32, height:32, background:T.accent, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontFamily:"'DM Serif Display',serif", color:"white", fontSize:13, fontStyle:"italic" }}>N</span>
                </div>
                <div>
                  <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:14 }}>Nexus CRM</div>
                  <div style={{ fontSize:10, color:T.muted }}>English Center</div>
                </div>
              </div>
              <button onClick={logout} className="tap" style={{ background:"transparent", border:`1px solid ${T.border}`, borderRadius:8, padding:"6px 12px", fontSize:12, color:T.muted, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Sair</button>
            </div>
          )}
          {dbLoading ? (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"60vh", flexDirection:"column", gap:16 }}>
              <Spinner />
              <p style={{ color:T.muted, fontSize:14 }}>Carregando dados...</p>
            </div>
          ) : (
            <>
              {page==="dashboard"  && <Dashboard  leads={leads} {...sp} />}
              {page==="pipeline"   && <KanbanBoard leads={leads} onSelect={setSelected} onMove={moveLead} {...sp} />}
              {page==="leads"      && <LeadsList   leads={leads} onSelect={setSelected} onAdd={()=>setShowAdd(true)} {...sp} />}
              {page==="followups"  && <FollowUps   leads={leads} onSelect={setSelected} {...sp} />}
              {page==="relatorios" && <Relatorios  leads={leads} {...sp} />}
            </>
          )}
        </main>
      </div>
      {mob && <BottomNav active={page} onChange={nav} fuCount={fuCount} />}
      {mob && <FAB onClick={()=>setShowAdd(true)} />}
      {showAdd  && <AddLeadModal onAdd={addLead} onClose={()=>setShowAdd(false)} mob={mob} />}
      {selected && <LeadModal lead={selected} onUpdate={updateLead} onDelete={deleteLead} onClose={()=>setSelected(null)} mob={mob} />}
    </>
  );
}
