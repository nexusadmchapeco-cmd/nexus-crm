import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPA_URL = "https://tmkjtyhybfbaqcqovuem.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRta2p0eWh5YmZiYXFjcW92dWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NDY5MjYsImV4cCI6MjA5MDEyMjkyNn0.ZqBH1WkFsXREV9oaDotWkC9kVNt1bA_ERjEZTNjeWO0";
const supabase = createClient(SUPA_URL, SUPA_KEY);
const ZAPI_INSTANCE = "3F0F2B7CCECF710C472AB252550E5DC7";
const ZAPI_TOKEN    = "BE18ADD41E82765B8E67964C";
const ZAPI_CLIENT   = "Fddcba541ce4d42938750ece9472eaa38S";
const LOGO = "/logo.svg";

const STAGES = [
  { id:"novo",        label:"Novo Lead",           emoji:"✦", hex:"#94a3b8", role:"sdr" },
  { id:"contato",     label:"Contato Feito",        emoji:"✉", hex:"#60a5fa", role:"sdr" },
  { id:"info",        label:"Informações Passadas", emoji:"📋", hex:"#818cf8", role:"sdr" },
  { id:"qualificado", label:"Qualificado",          emoji:"⚡", hex:"#f59e0b", role:"sdr" },
  { id:"naoqualif",   label:"Não Qualificado",      emoji:"✕", hex:"#94a3b8", role:"sdr" },
  { id:"reuniao",     label:"Reunião Agendada",     emoji:"📅", hex:"#a78bfa", role:"sdr" },
  { id:"negociacao",  label:"Negociação",           emoji:"◈", hex:"#38bdf8", role:"closer" },
  { id:"listafria",   label:"Lista Fria",           emoji:"🧊", hex:"#7dd3fc", role:"closer" },
  { id:"matriculado", label:"Matriculado",          emoji:"✔", hex:"#10b981", role:"closer" },
  { id:"perdido",     label:"Perdido",              emoji:"✗", hex:"#f87171", role:"closer" },
];

const COURSES  = ["Nexus Class","Nexus Flex","Nexus Private","Nexus Junior","Nexus Travel"];
const SOURCES  = ["Instagram","Indicação","Google","WhatsApp","Site","TikTok","Outros"];
const CTYPES   = ["WhatsApp","Ligação","Email","Reunião","Anotação"];
const UNITS = [
  { id:"pf",     label:"Nexus PF",      color:"#dbeafe", border:"#93c5fd", text:"#1d4ed8" },
  { id:"chape",  label:"Nexus Chapecó", color:"#ffedd5", border:"#fdba74", text:"#c2410c" },
  { id:"online", label:"Nexus Online",  color:"#dcfce7", border:"#86efac", text:"#15803d" },
];
const NAV_ITEMS = [
  { id:"pipeline",   icon:"◫", label:"Pipeline"  },
  { id:"agenda",     icon:"📅", label:"Agenda"    },
  { id:"whatsapp",   icon:"💬", label:"WhatsApp"  },
  { id:"dashboard",  icon:"⬡", label:"Dashboard" },
  { id:"leads",      icon:"◎", label:"Leads"     },
  { id:"followups",  icon:"◷", label:"Follow-up" },
  { id:"relatorios", icon:"◈", label:"Relatórios"},
];

const HOURS = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00"];
const WEEKDAYS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

function today()   { return new Date().toISOString().split("T")[0]; }
function uid()     { return Date.now().toString(36)+Math.random().toString(36).slice(2); }
function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR",{day:"2-digit",month:"short"})+" "+d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
}
function addMinutes(time, mins) {
  const [h,m] = time.split(":").map(Number);
  const total = h*60+m+mins;
  return `${String(Math.floor(total/60)).padStart(2,"0")}:${String(total%60).padStart(2,"0")}`;
}
function getWeekDates(baseDate) {
  // Returns Mon-Sun (7 days) of the week containing baseDate
  const d = new Date(baseDate + "T12:00:00");
  const day = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const diffToMon = day === 0 ? -6 : 1 - day;
  const dates = [];
  for (let i = 0; i < 7; i++) { // Mon to Sun
    const nd = new Date(d);
    nd.setDate(d.getDate() + diffToMon + i);
    dates.push(nd.toISOString().split("T")[0]);
  }
  return dates; // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
}

const T = {
  bg:"#f5f5f5", surface:"#ffffff", border:"#e8e8e8",
  text:"#111111", muted:"#888888",
  accent:"#e85d20", accentLight:"rgba(232,93,32,.1)",
  gold:"#e85d20", goldLight:"rgba(232,93,32,.08)",
  orange:"#e85d20", radius:14,
};

function useIsMobile() {
  const [m,setM]=useState(window.innerWidth<768);
  useEffect(()=>{ const fn=()=>setM(window.innerWidth<768); window.addEventListener("resize",fn); return()=>window.removeEventListener("resize",fn); },[]);
  return m;
}

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;400;500;600;700&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      html{-webkit-text-size-adjust:100%;}
      body{font-family:'DM Sans',sans-serif;background:${T.bg};color:${T.text};overscroll-behavior:none;}
      ::-webkit-scrollbar{width:4px;height:4px;}
      ::-webkit-scrollbar-thumb{background:#d0d0d0;border-radius:4px;}
      input,select,textarea{font-family:'DM Sans',sans-serif;color-scheme:dark;}
      ::placeholder{color:#aaa !important;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes slideUp{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}
      @keyframes cashPop{from{opacity:0;transform:scale(.2) rotate(-12deg)}to{opacity:1;transform:scale(1) rotate(0)}}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes floatUp{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-120px) scale(1.5)}}
      @keyframes shake{0%,100%{transform:rotate(0)}20%{transform:rotate(-8deg)}40%{transform:rotate(8deg)}60%{transform:rotate(-5deg)}80%{transform:rotate(5deg)}}
      .c-hover{transition:box-shadow .18s,transform .18s;}
      .c-hover:hover{box-shadow:0 8px 28px rgba(0,0,0,.10)!important;transform:translateY(-2px);}
      .nav-itm:hover{background:rgba(232,93,32,.1)!important;}
      .rw:hover td{background:#f9f5f2;}
      .gh:hover{background:#f5f0ec!important;}
      .tap{-webkit-tap-highlight-color:transparent;}
      .slot-avail:hover{background:rgba(232,93,32,.08)!important;border-color:#e85d20!important;cursor:pointer;}
    `}</style>
  );
}

function Spinner() { return <div style={{width:20,height:20,border:`2px solid ${T.border}`,borderTop:`2px solid ${T.accent}`,borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto"}}/>; }
function Pill({color,children}) { return <span style={{display:"inline-flex",alignItems:"center",background:color+"18",color,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:600}}>{children}</span>; }

function Inp({label,...p}) {
  const base={width:"100%",background:"#f8f8f8",border:`1.5px solid ${T.border}`,borderRadius:10,padding:"11px 13px",fontSize:16,color:T.text,outline:"none",transition:"border .15s"};
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
      <select {...p} style={{width:"100%",background:"#f8f8f8",border:`1.5px solid ${T.border}`,borderRadius:10,padding:"11px 13px",fontSize:16,color:T.text,outline:"none",fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}>
        {options.map(o=>typeof o==="string"?<option key={o}>{o}</option>:<option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
function Btn({variant="primary",onClick,children,style:s,full,loading,disabled}) {
  const base={display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:15,cursor:disabled?"not-allowed":"pointer",border:"none",borderRadius:11,padding:"11px 20px",transition:"all .15s",width:full?"100%":"auto",opacity:disabled?.6:1,WebkitTapHighlightColor:"transparent",...s};
  const V={primary:{...base,background:"#e85d20",color:"#fff",boxShadow:"0 2px 12px rgba(232,93,32,.3)"},ghost:{...base,background:"transparent",color:T.muted,border:`1.5px solid ${T.border}`},danger:{...base,background:"#fef2f2",color:"#dc2626",border:"1.5px solid #fecaca"},gold:{...base,background:T.gold,color:"#fff"},orange:{...base,background:T.orange,color:"#fff"}};
  return <button className={variant==="ghost"?"gh tap":"tap"} onClick={onClick} disabled={disabled||loading} style={V[variant]||V.primary}>{loading?<Spinner/>:children}</button>;
}
function Modal({title,subtitle,onClose,children,width=520,mob}) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,background:"rgba(26,23,20,.45)",display:"flex",alignItems:mob?"flex-end":"center",justifyContent:"center",zIndex:999,padding:mob?0:20,backdropFilter:"blur(6px)",animation:"fadeIn .18s"}}>
      <div style={{background:"#ffffff",borderRadius:mob?"20px 20px 0 0":20,width:"100%",maxWidth:mob?"100%":width,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(0,0,0,.2)",animation:mob?"slideUp .25s":"fadeUp .22s"}}>
        {mob&&<div style={{width:40,height:4,background:"#ddd",borderRadius:2,margin:"12px auto 0"}}/>}
        <div style={{padding:mob?"14px 20px 0":"24px 28px 0",borderBottom:`1px solid ${T.border}`,paddingBottom:14,marginTop:mob?6:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:mob?20:22,fontWeight:400,color:T.text}}>{title}</h2>
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
    <div style={{minHeight:"100vh",background:"#0d0d0d",display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-120,right:-120,width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(212,85,26,.15) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-80,left:-80,width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(13,115,119,.12) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{width:"100%",maxWidth:420,animation:"fadeUp .4s"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{background:"#ffffff",borderRadius:18,padding:"18px 32px",display:"inline-block",boxShadow:"0 8px 40px rgba(0,0,0,.35)",marginBottom:20}}>
            <img src={LOGO} alt="Nexus English Center" style={{height:52,objectFit:"contain",display:"block"}}/>
          </div>
          <div style={{color:"rgba(255,255,255,.35)",fontSize:12,letterSpacing:".1em",textTransform:"uppercase",fontWeight:600}}>Portal Comercial</div>
        </div>
        <div style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:20,padding:"32px",backdropFilter:"blur(12px)"}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:400,color:"white",marginBottom:6}}>Bem-vindo de volta</h2>
          <p style={{color:"rgba(255,255,255,.35)",fontSize:14,marginBottom:28}}>Entre com suas credenciais para acessar</p>
          <div style={{display:"grid",gap:14}}>
            <label style={{display:"block"}}>
              <span style={{display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,.45)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:6}}>Email</span>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="seu@email.com"
                style={{width:"100%",background:"rgba(255,255,255,.07)",border:"1.5px solid rgba(255,255,255,.1)",borderRadius:11,padding:"12px 14px",fontSize:15,color:"white",outline:"none",fontFamily:"'DM Sans',sans-serif"}}
                onFocus={e=>e.target.style.borderColor="#e85d20"}
                onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.12)"}/>
            </label>
            <label style={{display:"block"}}>
              <span style={{display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,.45)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:6}}>Senha</span>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="••••••••"
                style={{width:"100%",background:"rgba(255,255,255,.07)",border:"1.5px solid rgba(255,255,255,.1)",borderRadius:11,padding:"12px 14px",fontSize:15,color:"white",outline:"none",fontFamily:"'DM Sans',sans-serif"}}
                onFocus={e=>e.target.style.borderColor="#e85d20"}
                onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.12)"}/>
            </label>
            {error&&<div style={{background:"rgba(220,38,38,.15)",color:"#fca5a5",borderRadius:9,padding:"10px 14px",fontSize:13,fontWeight:600,border:"1px solid rgba(220,38,38,.2)"}}>⚠ {error}</div>}
            <button onClick={submit} disabled={loading} className="tap"
              style={{width:"100%",background:"linear-gradient(135deg,#e85d20 0%,#c44a15 100%)",color:"white",border:"none",borderRadius:11,padding:"13px",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",marginTop:6,boxShadow:"0 4px 20px rgba(232,93,32,.35)",opacity:loading?.7:1}}>
              {loading?"Entrando...":"Entrar →"}
            </button>
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:20,color:"rgba(255,255,255,.18)",fontSize:12}}>Nexus English Center © 2025</div>
      </div>
    </div>
  );
}

/* ─── CASH REGISTER CELEBRATION ─────────────────────────────────── */
function CashCelebration({onDone}) {
  const ref=useRef(null),anim=useRef(null);
  useEffect(()=>{
    try {
      const ctx=new(window.AudioContext||window.webkitAudioContext)();
      // Cash register "cha-ching"
      const playTone=(freq,start,dur,vol,type="sine")=>{
        const o=ctx.createOscillator(),g=ctx.createGain();
        o.type=type; o.frequency.value=freq;
        g.gain.setValueAtTime(0,ctx.currentTime+start);
        g.gain.linearRampToValueAtTime(vol,ctx.currentTime+start+0.01);
        g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+start+dur);
        o.connect(g);g.connect(ctx.destination);
        o.start(ctx.currentTime+start);o.stop(ctx.currentTime+start+dur+0.05);
      };
      // Bell ding
      playTone(1400,0,0.4,0.5,"sine");
      playTone(1800,0.05,0.35,0.3,"sine");
      playTone(2200,0.08,0.3,0.25,"sine");
      playTone(1600,0.15,0.5,0.4,"sine");
      playTone(2400,0.2,0.4,0.3,"sine");
      // Register click/drawer
      playTone(120,0.02,0.08,0.6,"square");
      playTone(80,0.06,0.1,0.5,"square");
      // Coins dropping
      [0.3,0.38,0.44,0.49,0.53,0.56].forEach((t,i)=>{
        playTone(800+i*200,t,0.12,0.3,"triangle");
        playTone(600+i*150,t+0.02,0.1,0.2,"triangle");
      });
      // Crowd cheer
      const bs=ctx.sampleRate*1.5,buf=ctx.createBuffer(1,bs,ctx.sampleRate),d=buf.getChannelData(0);
      for(let i=0;i<bs;i++)d[i]=(Math.random()*2-1);
      const ns=ctx.createBufferSource();ns.buffer=buf;
      const fl=ctx.createBiquadFilter();fl.type="bandpass";fl.frequency.value=900;fl.Q.value=0.5;
      const gn=ctx.createGain();gn.gain.setValueAtTime(0,ctx.currentTime+0.4);gn.gain.linearRampToValueAtTime(0.4,ctx.currentTime+0.6);gn.gain.linearRampToValueAtTime(0,ctx.currentTime+1.8);
      ns.connect(fl);fl.connect(gn);gn.connect(ctx.destination);ns.start();ns.stop(ctx.currentTime+2);
    } catch(e){}

    const canvas=ref.current;if(!canvas)return;
    canvas.width=window.innerWidth;canvas.height=window.innerHeight;
    const cx=canvas.getContext("2d");
    // Money + confetti particles
    const EMOJIS=["💰","💵","🤑","✨","🎉","🎊","💸"];
    const COLS=["#10b981","#f59e0b","#22c55e","#fbbf24","#34d399","#86efac","#fff"];
    const ps=Array.from({length:280},(_,i)=>({
      x:Math.random()*canvas.width, y:-30-Math.random()*200,
      r:4+Math.random()*9,
      color:COLS[Math.floor(Math.random()*COLS.length)],
      vx:(Math.random()-.5)*10, vy:3+Math.random()*8,
      rot:Math.random()*Math.PI*2, rv:(Math.random()-.5)*.2,
      sh:i<20?"emoji":"rect",
      emoji:EMOJIS[Math.floor(Math.random()*EMOJIS.length)],
      size:16+Math.random()*20, op:1
    }));
    let fr=0;
    const tick=()=>{
      cx.clearRect(0,0,canvas.width,canvas.height);let alive=false;
      ps.forEach(p=>{
        p.x+=p.vx;p.y+=p.vy;p.rot+=p.rv;p.vy+=0.18;
        if(p.y<canvas.height+40){alive=true;p.op=Math.max(0,1-p.y/(canvas.height*1.1));}
        cx.save();cx.globalAlpha=p.op;cx.translate(p.x,p.y);cx.rotate(p.rot);
        if(p.sh==="emoji"){cx.font=`${p.size}px serif`;cx.fillText(p.emoji,-p.size/2,-p.size/2);}
        else{cx.fillStyle=p.color;cx.fillRect(-p.r,-p.r/2,p.r*2,p.r);}
        cx.restore();
      });
      fr++;if(alive&&fr<360)anim.current=requestAnimationFrame(tick);else onDone();
    };
    anim.current=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(anim.current);
  },[]);
  return (
    <>
      <canvas ref={ref} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999}}/>
      <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:9998,pointerEvents:"none"}}>
        <div style={{animation:"cashPop .5s cubic-bezier(.17,.67,.35,1.4)",textAlign:"center",background:"rgba(255,255,255,.96)",borderRadius:28,padding:"36px 56px",boxShadow:"0 24px 70px rgba(0,0,0,.22)"}}>
          <div style={{fontSize:72,lineHeight:1,animation:"shake .5s ease"}}>🤑</div>
          <div style={{fontSize:52,marginTop:8,animation:"floatUp 1.5s ease forwards",animationDelay:"0.5s"}}>💰</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:32,color:"#16a34a",letterSpacing:"-0.5px",marginTop:8}}>É nós guri!!</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:40,color:T.orange,letterSpacing:"-1px",fontStyle:"italic",marginTop:4}}>Mais uma matrícula 🔥</div>
          <div style={{fontSize:13,color:T.muted,marginTop:12,fontWeight:600}}>CHA-CHING! 💵</div>
        </div>
      </div>
    </>
  );
}

/* ─── REUNIAO CELEBRATION ───────────────────────────────────────── */
function ReuniaoCelebration({onDone}) {
  const ref=useRef(null),anim=useRef(null);
  useEffect(()=>{
    try {
      const ctx=new(window.AudioContext||window.webkitAudioContext)();
      const playTone=(freq,start,dur,vol,type="sine")=>{
        const o=ctx.createOscillator(),g=ctx.createGain();
        o.type=type;o.frequency.value=freq;
        g.gain.setValueAtTime(0,ctx.currentTime+start);
        g.gain.linearRampToValueAtTime(vol,ctx.currentTime+start+0.02);
        g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+start+dur);
        o.connect(g);g.connect(ctx.destination);
        o.start(ctx.currentTime+start);o.stop(ctx.currentTime+start+dur+0.05);
      };
      // Triumphant fanfare
      playTone(523,0,0.15,0.4,"square");
      playTone(659,0.12,0.15,0.4,"square");
      playTone(784,0.24,0.15,0.4,"square");
      playTone(1047,0.36,0.4,0.5,"square");
      playTone(784,0.36,0.4,0.3,"square");
      // Crowd cheer
      const bs=ctx.sampleRate*1.2,buf=ctx.createBuffer(1,bs,ctx.sampleRate),d=buf.getChannelData(0);
      for(let i=0;i<bs;i++)d[i]=(Math.random()*2-1);
      const ns=ctx.createBufferSource();ns.buffer=buf;
      const fl=ctx.createBiquadFilter();fl.type="bandpass";fl.frequency.value=700;fl.Q.value=0.5;
      const gn=ctx.createGain();gn.gain.setValueAtTime(0,ctx.currentTime+0.3);gn.gain.linearRampToValueAtTime(0.3,ctx.currentTime+0.5);gn.gain.linearRampToValueAtTime(0,ctx.currentTime+1.5);
      ns.connect(fl);fl.connect(gn);gn.connect(ctx.destination);ns.start();ns.stop(ctx.currentTime+1.6);
    } catch(e){}
    const canvas=ref.current;if(!canvas)return;
    canvas.width=window.innerWidth;canvas.height=window.innerHeight;
    const cx=canvas.getContext("2d");
    const EMOJIS=["📅","🤝","⭐","✨","🎯","💪","🔥"];
    const COLS=["#a78bfa","#818cf8","#c4b5fd","#7c3aed","#ddd6fe","#fff","#f59e0b"];
    const ps=Array.from({length:200},(_,i)=>({
      x:Math.random()*canvas.width,y:-20-Math.random()*150,
      r:4+Math.random()*8,color:COLS[Math.floor(Math.random()*COLS.length)],
      vx:(Math.random()-.5)*8,vy:2+Math.random()*6,
      rot:Math.random()*Math.PI*2,rv:(Math.random()-.5)*.18,
      sh:i<15?"emoji":"rect",emoji:EMOJIS[Math.floor(Math.random()*EMOJIS.length)],
      size:18+Math.random()*16,op:1
    }));
    let fr=0;
    const tick=()=>{
      cx.clearRect(0,0,canvas.width,canvas.height);let alive=false;
      ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.rot+=p.rv;p.vy+=0.15;
        if(p.y<canvas.height+40){alive=true;p.op=Math.max(0,1-p.y/(canvas.height*1.1));}
        cx.save();cx.globalAlpha=p.op;cx.translate(p.x,p.y);cx.rotate(p.rot);
        if(p.sh==="emoji"){cx.font=`${p.size}px serif`;cx.fillText(p.emoji,-p.size/2,-p.size/2);}
        else{cx.fillStyle=p.color;cx.fillRect(-p.r,-p.r/2,p.r*2,p.r);}
        cx.restore();
      });
      fr++;if(alive&&fr<300)anim.current=requestAnimationFrame(tick);else onDone();
    };
    anim.current=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(anim.current);
  },[]);
  return (
    <>
      <canvas ref={ref} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999}}/>
      <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:9998,pointerEvents:"none"}}>
        <div style={{animation:"cashPop .5s cubic-bezier(.17,.67,.35,1.4)",textAlign:"center",background:"rgba(255,255,255,.96)",borderRadius:28,padding:"36px 56px",boxShadow:"0 24px 70px rgba(0,0,0,.22)"}}>
          <div style={{fontSize:72,lineHeight:1}}>📅</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:44,color:"#7c3aed",letterSpacing:"-1px",marginTop:12,fontStyle:"italic"}}>BOA FILHOTINHO!!</div>
          <div style={{fontSize:16,color:T.muted,marginTop:8,fontWeight:600}}>Reunião agendada! 🎯</div>
        </div>
      </div>
    </>
  );
}

/* ─── QUICK ADD ──────────────────────────────────────────────────── */
function QuickAddModal({onAdd,onClose,mob}) {
  const [form,setForm]=useState({name:"",phone:"",course:"",source:"",responsavel:"",unit:""});
  const [saving,setSaving]=useState(false);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const submit=async()=>{
    if(!form.name.trim()||!form.phone.trim()){alert("Nome e telefone são obrigatórios.");return;}
    setSaving(true);
    const id=uid();
    const{error}=await supabase.from("leads").insert({id,name:form.name,phone:form.phone,course:form.course||null,source:form.source||null,stage:"novo",responsavel:form.responsavel||null,unit:form.unit||null,created_at:new Date().toISOString()});
    if(!error){onAdd({id,name:form.name,phone:form.phone,course:form.course,source:form.source,stage:"novo",notes:"",responsavel:form.responsavel,unit:form.unit,createdAt:new Date().toISOString(),history:[],followUp:null});onClose();}
    else alert("Erro ao salvar.");
    setSaving(false);
  };
  return (
    <Modal title="⚡ Cadastro Rápido" subtitle="Campos essenciais para o pipeline" onClose={onClose} mob={mob} width={440}>
      <div style={{display:"grid",gap:13}}>
        <Inp label="Nome *" value={form.name} onChange={e=>f("name",e.target.value)} placeholder="Nome do lead" autoFocus/>
        <Inp label="Telefone *" value={form.phone} onChange={e=>f("phone",e.target.value)} placeholder="(54) 99999-9999"/>
        <Sel label="Curso" value={form.course} onChange={e=>f("course",e.target.value)} options={[{value:"",label:"Selecione..."},...COURSES.map(c=>({value:c,label:c}))]}/>
        <Sel label="Origem" value={form.source} onChange={e=>f("source",e.target.value)} options={[{value:"",label:"Selecione..."},...SOURCES.map(s=>({value:s,label:s}))]}/>
        <Inp label="Responsável (opcional)" value={form.responsavel} onChange={e=>f("responsavel",e.target.value)} placeholder="Nome do responsável"/>
        <div>
          <span style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>Unidade *</span>
          <div style={{display:"flex",gap:8}}>
            {UNITS.map(u=>(
              <button key={u.id} type="button" onClick={()=>f("unit",u.id)} className="tap"
                style={{flex:1,background:form.unit===u.id?u.color:"transparent",border:`1.5px solid ${form.unit===u.id?u.border:T.border}`,borderRadius:10,padding:"10px 8px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",color:form.unit===u.id?u.text:T.muted,transition:"all .15s"}}>
                {u.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:4}}>
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn onClick={submit} loading={saving} full={mob}>➕ Adicionar ao Pipeline</Btn>
        </div>
      </div>
    </Modal>
  );
}

/* ─── ADD LEAD FULL ──────────────────────────────────────────────── */
function AddLeadModal({onAdd,onClose,mob}) {
  const [form,setForm]=useState({name:"",phone:"",email:"",course:"",source:"",notes:"",stage:"novo",responsavel:"",unit:""});
  const [saving,setSaving]=useState(false);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const submit=async()=>{
    if(!form.name.trim()||!form.phone.trim()){alert("Nome e telefone são obrigatórios.");return;}
    setSaving(true);
    const id=uid();
    const{error}=await supabase.from("leads").insert({id,name:form.name,phone:form.phone,email:form.email||null,course:form.course||null,source:form.source||null,stage:form.stage,notes:form.notes||null,responsavel:form.responsavel||null,unit:form.unit||null,created_at:new Date().toISOString()});
    if(!error){onAdd({...form,id,unit:form.unit,createdAt:new Date().toISOString(),history:[],followUp:null});onClose();}
    else alert("Erro ao salvar.");
    setSaving(false);
  };
  return (
    <Modal title="Novo Lead" subtitle="Preencha os dados do prospect" onClose={onClose} mob={mob}>
      <div style={{display:"grid",gap:13}}>
        <Inp label="Nome completo *" value={form.name} onChange={e=>f("name",e.target.value)}/>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:11}}>
          <Inp label="Telefone *" value={form.phone} onChange={e=>f("phone",e.target.value)} placeholder="(54) 99999-9999"/>
          <Inp label="Email" value={form.email} onChange={e=>f("email",e.target.value)}/>
          <Sel label="Curso" value={form.course} onChange={e=>f("course",e.target.value)} options={[{value:"",label:"Selecione..."},...COURSES.map(c=>({value:c,label:c}))]}/>
          <Sel label="Origem" value={form.source} onChange={e=>f("source",e.target.value)} options={[{value:"",label:"Selecione..."},...SOURCES.map(s=>({value:s,label:s}))]}/>
        </div>
        <Inp label="Responsável (opcional)" value={form.responsavel} onChange={e=>f("responsavel",e.target.value)} placeholder="Nome do responsável"/>
        <div>
          <span style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>Unidade *</span>
          <div style={{display:"flex",gap:8}}>
            {UNITS.map(u=>(
              <button key={u.id} type="button" onClick={()=>f("unit",u.id)} className="tap"
                style={{flex:1,background:form.unit===u.id?u.color:"transparent",border:`1.5px solid ${form.unit===u.id?u.border:T.border}`,borderRadius:10,padding:"10px 8px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",color:form.unit===u.id?u.text:T.muted,transition:"all .15s"}}>
                {u.label}
              </button>
            ))}
          </div>
        </div>
        <Sel label="Etapa inicial" value={form.stage} onChange={e=>f("stage",e.target.value)} options={STAGES.map(s=>({value:s.id,label:s.label}))}/>
        <Inp label="Observações" type="textarea" value={form.notes} onChange={e=>f("notes",e.target.value)}/>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn onClick={submit} loading={saving} full={mob}>Salvar Lead</Btn>
        </div>
      </div>
    </Modal>
  );
}

/* ─── AGENDA GOOGLE STYLE ────────────────────────────────────────── */
function AgendaCloser({leads,mob}) {
  const [weekBase,setWeekBase]=useState(today());
  const [slots,setSlots]=useState([]);
  const [blocked,setBlocked]=useState([]);
  const [loading,setLoading]=useState(true);
  const [bookModal,setBookModal]=useState(null); // {date, time}
  const [blockMode,setBlockMode]=useState(false);
  const [bookForm,setBookForm]=useState({lead_id:"",notes:""});
  const [saving,setSaving]=useState(false);

  const weekDates=getWeekDates(weekBase);
  const workDates=getWeekDates(weekBase); // Mon(0)..Sat(5)

  useEffect(()=>{ loadData(); },[weekBase]);

  const loadData=async()=>{
    setLoading(true);
    const startD=workDates[0], endD=workDates[workDates.length-1];
    const[{data:s},{data:b}]=await Promise.all([
      supabase.from("agenda").select("*").gte("date",startD).lte("date",endD).neq("status","cancelado"),
      supabase.from("agenda_blocked").select("*").gte("date",startD).lte("date",endD)
    ]);
    setSlots(s||[]);setBlocked(b||[]);setLoading(false);
  };

  const isBlocked=(date,time)=>blocked.some(b=>b.date===date&&b.time===time);
  const getSlot=(date,time)=>slots.find(s=>s.date===date&&s.time===time);

  const toggleBlock=async(date,time)=>{
    if(isBlocked(date,time)){
      await supabase.from("agenda_blocked").delete().eq("date",date).eq("time",time);
    } else {
      await supabase.from("agenda_blocked").insert({id:uid(),date,time});
    }
    loadData();
  };

  const bookSlot=async()=>{
    if(!bookForm.lead_id){alert("Selecione um lead.");return;}
    setSaving(true);
    const{date,time}=bookModal;
    const{error}=await supabase.from("agenda").insert({id:uid(),lead_id:bookForm.lead_id,date,time,notes:bookForm.notes||null,status:"agendado"});
    if(!error){
      await supabase.from("leads").update({stage:"reuniao"}).eq("id",bookForm.lead_id);
      await loadData();
      // Send WhatsApp notification to closer
      const lead=leads.find(l=>l.id===bookForm.lead_id);
      const isPF=lead?.unit==="pf";
      const closerPhone=isPF?"5554999658474":"5549988971344";
      const dateFormatted=new Date(date+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"2-digit"});
      const msg=`🗓 *Nova reunião agendada!*

👤 *Lead:* ${lead?.name||"—"}
📱 *Telefone:* ${lead?.phone||"—"}
📚 *Curso:* ${lead?.course||"—"}
🏫 *Unidade:* ${lead?.unit==="pf"?"Nexus PF":lead?.unit==="chape"?"Nexus Chapecó":"Nexus Online"}

📅 *Data:* ${dateFormatted}
🕐 *Horário:* ${time} – ${addMinutes(time,30)}

${bookForm.notes?`📝 *Obs:* ${bookForm.notes}

`:""}Reunião cadastrada no CRM ✅`;
      const waUrl=`https://wa.me/${closerPhone}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl,"_blank");
      setBookModal(null);setBookForm({lead_id:"",notes:""});
    } else alert("Erro ao agendar.");
    setSaving(false);
  };

  const cancelSlot=async(id)=>{
    if(!window.confirm("Cancelar este agendamento?"))return;
    await supabase.from("agenda").update({status:"cancelado"}).eq("id",id);
    loadData();
  };

  const confirmarSlot=async(id)=>{
    await supabase.from("agenda").update({status:"confirmado"}).eq("id",id);
    // Move lead to negociacao automatically
    const slot=slots.find(s=>s.id===id);
    if(slot?.lead_id){
      await supabase.from("leads").update({stage:"negociacao"}).eq("id",slot.lead_id);
    }
    loadData();
  };

  const prevWeek=()=>{ const d=new Date(weekBase); d.setDate(d.getDate()-7); setWeekBase(d.toISOString().split("T")[0]); };
  const nextWeek=()=>{ const d=new Date(weekBase); d.setDate(d.getDate()+7); setWeekBase(d.toISOString().split("T")[0]); };
  const goToday=()=>setWeekBase(today());

  const ts=today();
  const todaySlots=slots.filter(s=>s.date===ts&&s.status!=="cancelado").sort((a,b)=>a.time.localeCompare(b.time));
  const availLeads=leads.filter(l=>!["matriculado","perdido","naoqualif"].includes(l.stage));

  const statusColor={agendado:T.gold,confirmado:T.accent,cancelado:"#dc2626"};

  return (
    <div style={{animation:"fadeUp .3s"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:mob?24:30,fontWeight:400,letterSpacing:"-.5px"}}>Agenda</h1>
          <p style={{color:T.muted,fontSize:13,marginTop:3}}>Reuniões de fechamento · 30 min cada</p>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <button onClick={()=>setBlockMode(b=>!b)} className="tap"
            style={{background:blockMode?"rgba(239,68,68,.15)":"transparent",color:blockMode?"#f87171":T.muted,border:`1.5px solid ${blockMode?"rgba(239,68,68,.4)":T.border}`,borderRadius:10,padding:"8px 14px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
            {blockMode?"✕ Sair do modo bloqueio":"🔒 Fechar horários"}
          </button>
          {blockMode&&<div style={{background:T.accentLight,border:"1px solid rgba(232,93,32,.3)",borderRadius:8,padding:"6px 12px",fontSize:12,color:"#e85d20",fontWeight:600}}>Clique num slot para bloquear/desbloquear</div>}
        </div>
      </div>

      {/* Today highlight */}
      {todaySlots.length>0&&(
        <div style={{background:T.accentLight,border:"1.5px solid rgba(232,93,32,.3)",borderRadius:T.radius,padding:"12px 16px",marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:14,color:T.accent,marginBottom:8}}>🔴 Hoje — {todaySlots.length} reunião(ões)</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {todaySlots.map(s=>{const lead=leads.find(l=>l.id===s.lead_id);return(
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,fontSize:13}}>
                <span style={{fontWeight:700,color:T.accent}}>{s.time}–{addMinutes(s.time,30)}</span>
                <span style={{fontWeight:600}}>{lead?.name||"—"}</span>
                <span style={{color:T.muted}}>{lead?.course||"—"}</span>
                <Pill color={statusColor[s.status]||T.muted}>{s.status}</Pill>
                {s.status==="agendado"&&<>
                  <button onClick={()=>confirmarSlot(s.id)} className="tap" style={{background:T.accentLight,color:T.accent,border:"none",borderRadius:6,padding:"3px 8px",fontSize:11,fontWeight:700,cursor:"pointer"}}>✓ Confirmar</button>
                  <button onClick={()=>cancelSlot(s.id)} className="tap" style={{background:"#fef2f2",color:"#dc2626",border:"none",borderRadius:6,padding:"3px 8px",fontSize:11,fontWeight:700,cursor:"pointer"}}>Cancelar</button>
                </>}
              </div>
            );})}
          </div>
        </div>
      )}

      {/* Week nav */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <button onClick={prevWeek} className="tap gh" style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
        <button onClick={goToday} className="tap gh" style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:600,color:T.muted,fontFamily:"'DM Sans',sans-serif"}}>Hoje</button>
        <button onClick={nextWeek} className="tap gh" style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
        <span style={{fontSize:14,fontWeight:600,color:T.text}}>
          {new Date(workDates[0]+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"short"})} – {new Date(workDates[workDates.length-1]+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric"})}
        </span>
      </div>

      {/* Calendar grid */}
      {loading?<div style={{textAlign:"center",padding:40}}><Spinner/></div>:(
        <div style={{background:"#ffffff",border:"1px solid #e8e8e8",borderRadius:T.radius,overflow:"auto"}}>
          {/* Day headers */}
          <div style={{display:"grid",gridTemplateColumns:`64px repeat(${workDates.length},1fr)`,borderBottom:`1px solid ${T.border}`}}>
            <div style={{padding:"10px 8px",fontSize:11,color:T.muted,fontWeight:700,borderRight:`1px solid ${T.border}`}}></div>
            {workDates.map(date=>{
              const d=new Date(date+"T12:00:00");
              const isToday=date===ts;
              return (
                <div key={date} style={{padding:"10px 6px",textAlign:"center",borderRight:`1px solid ${T.border}`,background:isToday?"rgba(232,93,32,.1)":"transparent"}}>
                  <div style={{fontSize:11,color:isToday?T.accent:T.muted,fontWeight:700}}>{WEEKDAYS[d.getDay()]}</div>
                  <div style={{fontSize:isToday?18:16,fontWeight:isToday?800:500,color:isToday?T.accent:T.text,marginTop:2,width:isToday?28:24,height:isToday?28:24,borderRadius:"50%",background:isToday?"#e85d20":"transparent",color:isToday?"white":"#111",display:"flex",alignItems:"center",justifyContent:"center",margin:"2px auto 0"}}>{d.getDate()}</div>
                </div>
              );
            })}
          </div>
          {/* Time slots */}
          {HOURS.map(hour=>(
            <div key={hour} style={{display:"grid",gridTemplateColumns:`64px repeat(${workDates.length},1fr)`,borderBottom:`1px solid ${T.border}`}}>
              <div style={{padding:"8px",fontSize:11,color:T.muted,fontWeight:600,borderRight:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",background:"#fafafa"}}>
                {hour}
              </div>
              {workDates.map(date=>{
                const slot=getSlot(date,hour);
                const blk=isBlocked(date,hour);
                const lead=slot?leads.find(l=>l.id===slot.lead_id):null;
                const isPast=date<ts||(date===ts&&hour<new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}));
                return (
                  <div key={date}
                    onClick={()=>{
                      if(blockMode){toggleBlock(date,hour);return;}
                      if(!slot&&!blk&&!isPast)setBookModal({date,time:hour});
                      if(slot&&!blockMode){/* show info */}
                    }}
                    className={!slot&&!blk&&!isPast&&!blockMode?"slot-avail":""}
                    style={{
                      minHeight:44,padding:"4px 6px",borderRight:`1px solid ${T.border}`,
                      background:blk?"#f0f0f0":slot?statusColor[slot.status]+"22":isPast?"#fafafa":"white",
                      cursor:blockMode?"pointer":(!slot&&!blk&&!isPast?"pointer":"default"),
                      position:"relative",transition:"background .15s"
                    }}>
                    {blk&&<div style={{fontSize:11,color:"#94a3b8",fontWeight:600,padding:"4px 2px",textAlign:"center"}}>🔒</div>}
                    {slot&&(
                      <div style={{fontSize:11,background:statusColor[slot.status]||T.accent,color:"white",borderRadius:6,padding:"4px 6px",lineHeight:1.3}}>
                        <div style={{fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lead?.name||"Lead"}</div>
                        <div style={{opacity:.85,fontSize:10}}>{hour}–{addMinutes(hour,30)}</div>
                        <div style={{display:"flex",gap:4,marginTop:4}}>
                          {slot.status==="agendado"&&<>
                            <button onClick={e=>{e.stopPropagation();confirmarSlot(slot.id);}} className="tap" style={{background:"rgba(255,255,255,.25)",border:"none",borderRadius:4,padding:"2px 5px",fontSize:10,fontWeight:700,cursor:"pointer",color:"white"}}>✓</button>
                            <button onClick={e=>{e.stopPropagation();cancelSlot(slot.id);}} className="tap" style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:4,padding:"2px 5px",fontSize:10,fontWeight:700,cursor:"pointer",color:"white"}}>✕</button>
                          </>}
                        </div>
                      </div>
                    )}
                    {!slot&&!blk&&!isPast&&!blockMode&&<div style={{fontSize:10,color:"#c8d4db",textAlign:"center",paddingTop:4}}>+</div>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Book modal */}
      {bookModal&&(
        <Modal title={`Agendar Reunião`} subtitle={`${new Date(bookModal.date+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long"})} · ${bookModal.time} – ${addMinutes(bookModal.time,30)} (30 min)`} onClose={()=>setBookModal(null)} mob={mob} width={460}>
          <div style={{display:"grid",gap:13}}>
            <Sel label="Lead *" value={bookForm.lead_id} onChange={e=>setBookForm(p=>({...p,lead_id:e.target.value}))}
              options={[{value:"",label:"Selecione o lead..."},...availLeads.map(l=>({value:l.id,label:`${l.name} — ${STAGES.find(s=>s.id===l.stage)?.label||""}`}))]}/>
            <Inp label="Observações (opcional)" type="textarea" value={bookForm.notes} onChange={e=>setBookForm(p=>({...p,notes:e.target.value}))} placeholder="Interesse, objeções, pontos importantes..."/>
            <div style={{background:T.accentLight,borderRadius:10,padding:"10px 14px",fontSize:13,color:T.accent,fontWeight:600}}>
              📅 {new Date(bookModal.date+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"short"})} · {bookModal.time} – {addMinutes(bookModal.time,30)} · 30 minutos
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn variant="ghost" onClick={()=>setBookModal(null)}>Cancelar</Btn>
              <Btn onClick={bookSlot} loading={saving} full={mob}>💾 Confirmar Agendamento</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── WHATSAPP INBOX ────────────────────────────────────────────── */
function WhatsAppInbox({leads, mob, onSelectLead}) {
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhone, setSelectedPhone] = useState(null);

  useEffect(()=>{ loadConversations(); const iv=setInterval(loadConversations,10000); return()=>clearInterval(iv); },[]);

  const loadConversations = async () => {
    const { data } = await supabase.from("whatsapp_messages").select("*").order("timestamp",{ascending:false});
    setMsgs(data||[]);
    setLoading(false);
  };

  // Group by phone
  const conversations = {};
  msgs.forEach(m=>{
    if(!conversations[m.phone]){
      const lead = leads.find(l=>l.phone.replace(/\D/g,"").slice(-9)===m.phone.slice(-9));
      conversations[m.phone]={phone:m.phone,lead,messages:[],unread:0,lastMsg:m,lastTime:m.timestamp};
    }
    conversations[m.phone].messages.push(m);
    if(!m.read&&m.direction==="in") conversations[m.phone].unread++;
  });

  const convList = Object.values(conversations).sort((a,b)=>new Date(b.lastTime)-new Date(a.lastTime));
  const selected = selectedPhone ? conversations[selectedPhone] : null;

  const markRead = async (phone) => {
    const lead = leads.find(l=>l.phone.replace(/\D/g,"").slice(-9)===phone.slice(-9));
    if(lead) await supabase.from("whatsapp_messages").update({read:true}).eq("lead_id",lead.id).eq("direction","in").eq("read",false);
  };

  const openChat = (phone) => { setSelectedPhone(phone); markRead(phone); };

  const totalUnread = convList.reduce((sum,c)=>sum+c.unread,0);

  return (
    <div style={{animation:"fadeUp .3s"}}>
      <div style={{marginBottom:20}}>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:mob?26:32,fontWeight:700,letterSpacing:"-.5px"}}>
          WhatsApp {totalUnread>0&&<span style={{fontSize:16,fontWeight:700,color:"white",background:"#25d366",borderRadius:20,padding:"3px 12px",marginLeft:8,verticalAlign:"middle"}}>{totalUnread}</span>}
        </h1>
        <p style={{color:T.muted,fontSize:13,marginTop:4}}>Histórico de conversas dos leads</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":selectedPhone?"320px 1fr":"1fr",gap:16,height:mob?"auto":"calc(100vh - 180px)"}}>
        {/* Conversation list */}
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`,fontSize:12,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em"}}>
            {convList.length} conversa(s)
          </div>
          <div style={{overflowY:"auto",flex:1}}>
            {loading?<div style={{textAlign:"center",padding:32}}><Spinner/></div>
            :convList.length===0?<div style={{textAlign:"center",padding:40,color:T.muted,fontSize:14}}>Nenhuma conversa ainda.</div>
            :convList.map(conv=>{
              const isSelected=selectedPhone===conv.phone;
              const lastMsg=conv.messages[0];
              return (
                <div key={conv.phone} onClick={()=>openChat(conv.phone)}
                  style={{padding:"14px 16px",borderBottom:`1px solid ${T.border}`,cursor:"pointer",background:isSelected?T.accentLight:"transparent",transition:"background .15s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                    <div style={{fontWeight:700,fontSize:14,color:T.text}}>{conv.lead?.name||conv.phone}</div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      {conv.unread>0&&<span style={{background:"#25d366",color:"white",borderRadius:10,padding:"1px 7px",fontSize:11,fontWeight:700}}>{conv.unread}</span>}
                      <span style={{fontSize:11,color:T.muted}}>{new Date(conv.lastTime).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</span>
                    </div>
                  </div>
                  <div style={{fontSize:12,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {lastMsg?.direction==="out"?"✓ ":""}{lastMsg?.message||""}
                  </div>
                  {conv.lead&&<div style={{marginTop:4}}><Pill color={STAGES.find(s=>s.id===conv.lead.stage)?.hex||T.muted}>{STAGES.find(s=>s.id===conv.lead.stage)?.label||"—"}</Pill></div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat window */}
        {selected&&!mob&&(
          <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            {/* Chat header */}
            <div style={{padding:"14px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:700,fontSize:16}}>{selected.lead?.name||selected.phone}</div>
                <div style={{fontSize:12,color:T.muted}}>{selected.phone}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                {selected.lead&&<button onClick={()=>onSelectLead(selected.lead)} className="tap gh" style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 12px",fontSize:12,color:T.muted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Ver lead</button>}
                <button onClick={()=>{const p=selected.phone.startsWith("55")?selected.phone:`55${selected.phone}`;window.open(`https://wa.me/${p}`,"_blank");}} className="tap"
                  style={{background:"#25d366",color:"white",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                  📱 Abrir WhatsApp
                </button>
              </div>
            </div>
            {/* Messages */}
            <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:8,background:"#f9f9f7"}}>
              {[...selected.messages].reverse().map(m=>{
                const isOut=m.direction==="out";
                return (
                  <div key={m.id} style={{display:"flex",justifyContent:isOut?"flex-end":"flex-start"}}>
                    <div style={{maxWidth:"70%",background:isOut?"#e85d20":"white",color:isOut?"white":"#111",borderRadius:isOut?"14px 14px 2px 14px":"14px 14px 14px 2px",padding:"9px 13px",fontSize:13,lineHeight:1.4,boxShadow:"0 1px 3px rgba(0,0,0,.08)"}}>
                      <div style={{wordBreak:"break-word"}}>{m.message}</div>
                      <div style={{fontSize:10,opacity:.65,marginTop:4,textAlign:"right"}}>
                        {new Date(m.timestamp).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})} {isOut?"✓✓":""}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Footer */}
            <div style={{padding:"12px 16px",borderTop:`1px solid ${T.border}`,background:T.surface,fontSize:12,color:T.muted,textAlign:"center"}}>
              Responda pelo WhatsApp no celular 📱
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── KANBAN ─────────────────────────────────────────────────────── */
function KanbanBoard({leads,onSelect,onMove,mob,onQuickAdd}) {
  const [dragOver,setDragOver]=useState(null);
  const [celebrating,setCelebrating]=useState(false);
  const [reuniaoCelebrating,setReuniaoCelebrating]=useState(false);
  const [activeStage,setActiveStage]=useState("novo");
  const dragging=useRef(null);
  const ts=today();
  const sdrStages=STAGES.filter(s=>s.role==="sdr");
  const closerStages=STAGES.filter(s=>s.role==="closer");

  const LeadCard=({lead,stage})=>{
    const isTd=lead.followUp?.date===ts,ov=lead.followUp?.date&&lead.followUp.date<ts;
    const unit=UNITS.find(u=>u.id===lead.unit);
    return (
      <div draggable={!mob} onDragStart={()=>dragging.current=lead.id}
        onClick={()=>onSelect(lead)} className="c-hover"
        style={{background:unit?unit.color:T.surface,borderRadius:10,padding:"12px 14px",border:`1px solid ${unit?unit.border:T.border}`,cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,.05)",borderTop:`3px solid ${stage.hex}`,outline:"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
          <div style={{fontWeight:600,fontSize:13}}>{lead.name}</div>
          <div style={{display:"flex",gap:4,alignItems:"center",flexShrink:0,marginLeft:4}}>
            {lead.unreadCount>0&&<span style={{fontSize:9,fontWeight:800,color:"white",background:"#25d366",borderRadius:10,padding:"2px 6px",minWidth:16,textAlign:"center"}}>💬 {lead.unreadCount}</span>}
            {unit&&<span style={{fontSize:9,fontWeight:700,color:unit.text,background:"rgba(255,255,255,.6)",borderRadius:5,padding:"2px 6px"}}>{unit.label}</span>}
          </div>
        </div>
        <div style={{fontSize:11,color:T.muted,marginBottom:2}}>{lead.course||"—"}</div>
        {lead.responsavel&&<div style={{fontSize:11,color:T.accent,marginBottom:2}}>👤 {lead.responsavel}</div>}
        {stage.id==="listafria"&&<div style={{fontSize:10,color:"#7dd3fc",fontWeight:600,marginBottom:2}}>🧊 Retomar contato</div>}
        {(isTd||ov)&&<div style={{background:ov?"#fef2f2":"#fefce8",color:ov?"#b91c1c":"#92400e",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700,marginTop:4,display:"inline-block"}}>{ov?"⚠ Atrasado":"🔔 Hoje"}</div>}
      </div>
    );
  };

  if(mob) {
    const stage=STAGES.find(s=>s.id===activeStage);
    const stLeads=leads.filter(l=>l.stage===activeStage);
    return (
      <div style={{animation:"fadeUp .3s"}}>
        {celebrating&&<CashCelebration onDone={()=>setCelebrating(false)}/>}
        {reuniaoCelebrating&&<ReuniaoCelebration onDone={()=>setReuniaoCelebrating(false)}/>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:400}}>Pipeline</h1>
          <Btn onClick={onQuickAdd} style={{padding:"8px 14px",fontSize:13}}>⚡ Novo Lead</Btn>
        </div>
        <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:10,marginBottom:16,WebkitOverflowScrolling:"touch"}}>
          {STAGES.map(s=>{const cnt=leads.filter(l=>l.stage===s.id).length,on=s.id===activeStage;return(
            <button key={s.id} onClick={()=>setActiveStage(s.id)} className="tap"
              style={{flexShrink:0,background:on?s.hex:T.surface,color:on?"white":T.muted,border:`1.5px solid ${on?s.hex:T.border}`,borderRadius:20,padding:"5px 11px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:4}}>
              {s.label}<span style={{background:on?"rgba(255,255,255,.25)":T.bg,borderRadius:10,padding:"1px 5px",fontSize:10}}>{cnt}</span>
            </button>
          );})}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {stLeads.length===0?<div style={{background:"#fafafa",border:"1.5px dashed #333",borderRadius:T.radius,padding:32,textAlign:"center",color:T.muted}}>Nenhum lead nesta etapa</div>
          :stLeads.map(lead=><LeadCard key={lead.id} lead={lead} stage={stage}/>)}
        </div>
      </div>
    );
  }

  return (
    <div style={{animation:"fadeUp .3s"}}>
      {celebrating&&<CashCelebration onDone={()=>setCelebrating(false)}/>}
      {reuniaoCelebrating&&<ReuniaoCelebration onDone={()=>setReuniaoCelebrating(false)}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:32,fontWeight:400,letterSpacing:"-.5px"}}>Pipeline</h1>
          <p style={{color:T.muted,fontSize:14,marginTop:4}}>Arraste os cards entre as etapas</p>
        </div>
        <Btn onClick={onQuickAdd}>⚡ Novo Lead</Btn>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {UNITS.map(u=>(
          <div key={u.id} style={{background:u.color,border:`1px solid ${u.border}`,borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:700,color:u.text,display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:u.text,opacity:.6}}/>
            {u.label}
          </div>
        ))}
      </div>
      {/* SDR */}
      <div style={{marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
          <span style={{background:"#f0f0f0",color:"#888",borderRadius:6,padding:"3px 10px"}}>SDR</span>
          <div style={{flex:1,height:1,background:T.border}}/>
        </div>
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8,alignItems:"flex-start"}}>
          {sdrStages.map(stage=>{
            const sl=leads.filter(l=>l.stage===stage.id),over=dragOver===stage.id;
            return (
              <div key={stage.id}
                onDragOver={e=>{e.preventDefault();setDragOver(stage.id);}}
                onDragLeave={()=>setDragOver(null)}
                onDrop={e=>{e.preventDefault();if(dragging.current){const prev=leads.find(l=>l.id===dragging.current);const shouldCelebrate=stage.id==="reuniao"&&prev?.stage!=="reuniao";onMove(dragging.current,stage.id);if(shouldCelebrate)setTimeout(()=>setReuniaoCelebrating(true),50);}setDragOver(null);dragging.current=null;}}
                style={{minWidth:195,flex:"0 0 195px",background:over?stage.hex+"11":T.bg,border:`1.5px solid ${over?stage.hex:T.border}`,borderRadius:T.radius,padding:12,transition:"all .18s"}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
                  <span style={{fontSize:13,color:stage.hex}}>{stage.emoji}</span>
                  <span style={{fontSize:11,fontWeight:700}}>{stage.label}</span>
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
      {/* CLOSER */}
      <div>
        <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
          <span style={{background:T.accentLight,color:"#e85d20",borderRadius:6,padding:"3px 10px"}}>CLOSER</span>
          <div style={{flex:1,height:1,background:T.border}}/>
        </div>
        <div style={{display:"flex",gap:10,paddingBottom:8,alignItems:"flex-start"}}>
          {closerStages.map(stage=>{
            const sl=leads.filter(l=>l.stage===stage.id),over=dragOver===stage.id;
            return (
              <div key={stage.id}
                onDragOver={e=>{e.preventDefault();setDragOver(stage.id);}}
                onDragLeave={()=>setDragOver(null)}
                onDrop={e=>{e.preventDefault();if(dragging.current){const prev=leads.find(l=>l.id===dragging.current);const shouldCelebrateMatr=stage.id==="matriculado"&&prev?.stage!=="matriculado";const shouldCelebrateReun=stage.id==="reuniao"&&prev?.stage!=="reuniao";onMove(dragging.current,stage.id);if(shouldCelebrateMatr)setTimeout(()=>setCelebrating(true),50);if(shouldCelebrateReun)setTimeout(()=>setReuniaoCelebrating(true),50);}setDragOver(null);dragging.current=null;}}
                style={{minWidth:195,flex:"0 0 195px",background:over?stage.hex+"11":T.bg,border:`1.5px solid ${over?stage.hex:T.border}`,borderRadius:T.radius,padding:12,transition:"all .18s"}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
                  <span style={{fontSize:13,color:stage.hex}}>{stage.emoji}</span>
                  <span style={{fontSize:11,fontWeight:700}}>{stage.label}</span>
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
        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:mob?26:32,fontWeight:400,letterSpacing:"-.5px"}}>Dashboard</h1>
        <p style={{color:T.muted,fontSize:13,marginTop:3}}>Resumo do pipeline comercial</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <SC label="Total Leads" value={total} icon="👥" color={T.text}/>
        <SC label="Em Negociação" value={ativos} icon="⚡" color="#6366f1"/>
        <SC label="Matriculados" value={matr} icon="🏆" color={T.accent} sub={`${taxa}% conversão`}/>
        <SC label="Follow-ups Hoje" value={fuHj} icon="🔔" color={T.gold} sub={atr>0?`${atr} atrasado(s)`:""}/>
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?16:22,marginBottom:12}}>
        <h3 style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:14}}>Pipeline por Etapa</h3>
        {etapas.map(s=>(
          <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
            <span style={{width:mob?140:170,fontSize:11,fontWeight:500,flexShrink:0}}>{s.label}</span>
            <div style={{flex:1,background:"#f0f0f0",borderRadius:6,height:8,overflow:"hidden"}}>
              <div style={{width:total>0?`${(s.cnt/total)*100}%`:"0%",height:"100%",background:s.hex,borderRadius:6}}/>
            </div>
            <span style={{fontSize:13,fontWeight:700,color:s.hex,width:20,textAlign:"right"}}>{s.cnt}</span>
          </div>
        ))}
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?16:22,marginBottom:12}}>
        <h3 style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:14}}>Top Origens</h3>
        {origens.slice(0,5).map(o=>(
          <div key={o.l} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
            <span style={{width:76,fontSize:12,flexShrink:0}}>{o.l}</span>
            <div style={{flex:1,background:"#f0f0f0",borderRadius:6,height:8,overflow:"hidden"}}>
              <div style={{width:`${(o.n/Math.max(...origens.map(x=>x.n),1))*100}%`,height:"100%",background:T.accent,borderRadius:6,opacity:.7}}/>
            </div>
            <span style={{fontSize:13,fontWeight:700,color:T.muted,width:20,textAlign:"right"}}>{o.n}</span>
          </div>
        ))}
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
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:mob?26:32,fontWeight:400}}>Leads</h1>
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
            <div key={lead.id} onClick={()=>onSelect(lead)} className="c-hover" style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"14px 16px",cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{fontWeight:700,fontSize:15}}>{lead.name}</div>
                <Pill color={st?.hex}>{st?.label}</Pill>
              </div>
              <div style={{fontSize:13,color:T.muted,marginBottom:2}}>📱 {lead.phone}</div>
              <div style={{fontSize:13,color:T.muted}}>📚 {lead.course||"—"} · {lead.source||"—"}</div>
              {lead.unit&&(()=>{const u=UNITS.find(x=>x.id===lead.unit);return u?<span style={{display:"inline-block",fontSize:11,fontWeight:700,color:u.text,background:u.color,border:`1px solid ${u.border}`,borderRadius:6,padding:"2px 8px",marginTop:4,marginRight:4}}>{u.label}</span>:null;})()}
              {lead.responsavel&&<div style={{fontSize:12,color:T.accent,marginTop:4}}>👤 {lead.responsavel}</div>}
            </div>
          );})}
          {filtered.length===0&&<div style={{textAlign:"center",color:T.muted,padding:40}}>Nenhum lead encontrado.</div>}
        </div>
      ):(
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
            <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>{["Nome","Telefone","Curso","Unidade","Responsável","Origem","Etapa","Follow-up"].map(h=>(
              <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em"}}>{h}</th>
            ))}</tr></thead>
            <tbody>
              {filtered.map(lead=>{const st=STAGES.find(s=>s.id===lead.stage),ov=lead.followUp?.date&&lead.followUp.date<today(),isTd=lead.followUp?.date===today();return(
                <tr key={lead.id} className="rw" onClick={()=>onSelect(lead)} style={{borderBottom:`1px solid ${T.border}`,cursor:"pointer"}}>
                  <td style={{padding:"12px 16px",fontWeight:600}}>{lead.name}</td>
                  <td style={{padding:"12px 16px",color:T.muted}}>{lead.phone}</td>
                  <td style={{padding:"12px 16px",color:T.muted,fontSize:13}}>{lead.course||"—"}</td>
                  <td style={{padding:"12px 16px"}}>{lead.unit?(()=>{const u=UNITS.find(x=>x.id===lead.unit);return u?<span style={{fontSize:11,fontWeight:700,color:u.text,background:u.color,border:`1px solid ${u.border}`,borderRadius:6,padding:"2px 8px"}}>{u.label}</span>:"—";})():"—"}</td>
                  <td style={{padding:"12px 16px",color:T.accent,fontSize:13}}>{lead.responsavel||"—"}</td>
                  <td style={{padding:"12px 16px",color:T.muted,fontSize:13}}>{lead.source||"—"}</td>
                  <td style={{padding:"12px 16px"}}><Pill color={st?.hex}>{st?.label}</Pill></td>
                  <td style={{padding:"12px 16px"}}>{lead.followUp?<span style={{fontSize:12,fontWeight:700,color:ov?"#dc2626":isTd?T.gold:T.muted}}>{ov?"⚠ ":isTd?"🔔 ":""}{lead.followUp.date}</span>:<span style={{color:T.muted,fontSize:13}}>—</span>}</td>
                </tr>
              );})}
              {filtered.length===0&&<tr><td colSpan={8} style={{padding:"48px 0",textAlign:"center",color:T.muted}}>Nenhum lead encontrado.</td></tr>}
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
        <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:mob?20:22,fontWeight:400,color}}>{title}</h2>
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
        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:mob?26:32,fontWeight:400}}>Follow-ups</h1>
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
        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:mob?26:32,fontWeight:400}}>Relatórios</h1>
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?16:22,marginBottom:12}}>
        <h3 style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:16}}>Funil de Conversão</h3>
        {STAGES.map(s=>{const cnt=leads.filter(l=>l.stage===s.id).length,pct=total>0?Math.round((cnt/total)*100):0;return(
          <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
            <span style={{width:mob?140:170,fontSize:11,fontWeight:500,flexShrink:0}}>{s.label}</span>
            <div style={{flex:1,background:"#f0f0f0",borderRadius:6,height:22,overflow:"hidden"}}>
              <div style={{width:`${pct}%`,height:"100%",background:s.hex,borderRadius:6,opacity:.85,display:"flex",alignItems:"center",paddingLeft:8,minWidth:pct>0?24:0}}>
                {pct>8&&<span style={{color:"white",fontSize:11,fontWeight:700}}>{pct}%</span>}
              </div>
            </div>
            <span style={{fontSize:13,fontWeight:700,color:s.hex,width:24,textAlign:"right"}}>{cnt}</span>
          </div>
        );})}
        <div style={{display:"flex",gap:24,marginTop:16}}>
          <div><div style={{fontSize:32,fontWeight:700,color:T.accent,letterSpacing:"-1px",lineHeight:1}}>{taxa}%</div><div style={{fontSize:11,color:T.muted,marginTop:3}}>Taxa de conversão</div></div>
          <div><div style={{fontSize:32,fontWeight:700,color:"#f87171",letterSpacing:"-1px",lineHeight:1}}>{perd>0&&total>0?Math.round((perd/total)*100):0}%</div><div style={{fontSize:11,color:T.muted,marginTop:3}}>Taxa de perda</div></div>
        </div>
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?16:22,marginBottom:12}}>
        <h3 style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:14}}>Por Curso</h3>
        {cData.map(c=>(
          <div key={c.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
            <div><div style={{fontWeight:500,fontSize:14}}>{c.l}</div><div style={{fontSize:12,color:T.muted,marginTop:2}}>{c.t} leads · {c.m} matr.</div></div>
            <Pill color={T.accent}>{c.t>0?Math.round((c.m/c.t)*100):0}%</Pill>
          </div>
        ))}
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?16:22}}>
        <h3 style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:14}}>Por Origem</h3>
        {oData.map(o=>(
          <div key={o.l} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5}}>
              <span style={{fontWeight:500}}>{o.l}</span><span style={{color:T.muted,fontSize:12}}>{o.m}/{o.t} matr.</span>
            </div>
            <div style={{background:"#f0f0f0",borderRadius:6,height:8,overflow:"hidden"}}>
              <div style={{width:`${(o.t/Math.max(...oData.map(x=>x.t),1))*100}%`,height:"100%",background:T.accent,borderRadius:6,opacity:.65}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── WHATSAPP TAB ───────────────────────────────────────────────── */
function WhatsAppTab({lead, mob}) {
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);

  useEffect(()=>{
    loadMsgs();
    // Poll every 10 seconds for new messages
    const interval = setInterval(loadMsgs, 10000);
    return () => clearInterval(interval);
  },[lead.id]);

  const loadMsgs = async () => {
    const cleanPhone = lead.phone.replace(/\D/g,"").slice(-9);
    const { data } = await supabase
      .from("whatsapp_messages")
      .select("*")
      .or(`lead_id.eq.${lead.id},phone.ilike.%${cleanPhone}%`)
      .order("timestamp", {ascending: true});
    setMsgs(data||[]);
    setUnread((data||[]).filter(m=>!m.read&&m.direction==="in").length);
    // Mark as read
    if (data && data.some(m=>!m.read&&m.direction==="in")) {
      await supabase.from("whatsapp_messages").update({read:true})
        .eq("lead_id", lead.id).eq("direction","in").eq("read",false);
    }
    setLoading(false);
  };

  const openWhatsApp = () => {
    const phone = lead.phone.replace(/\D/g,"");
    const num = phone.startsWith("55") ? phone : `55${phone}`;
    window.open(`https://wa.me/${num}`,"_blank");
  };

  if (loading) return <div style={{textAlign:"center",padding:32}}><Spinner/></div>;

  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:13,color:T.muted}}>{msgs.length} mensagens · {lead.phone}</div>
        <button onClick={openWhatsApp} className="tap"
          style={{background:"#25d366",color:"white",border:"none",borderRadius:10,padding:"8px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:6}}>
          📱 Abrir no WhatsApp
        </button>
      </div>

      {/* Messages */}
      <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:360,overflowY:"auto",padding:"4px 0"}}>
        {msgs.length===0 ? (
          <div style={{textAlign:"center",color:T.muted,padding:"40px 0",fontSize:14}}>
            <div style={{fontSize:32,marginBottom:8}}>💬</div>
            Nenhuma mensagem ainda.<br/>
            <span style={{fontSize:12}}>As mensagens aparecerão aqui automaticamente.</span>
          </div>
        ) : msgs.map(m=>{
          const isOut = m.direction==="out";
          const time = new Date(m.timestamp).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
          const date = new Date(m.timestamp).toLocaleDateString("pt-BR",{day:"2-digit",month:"short"});
          return (
            <div key={m.id} style={{display:"flex",justifyContent:isOut?"flex-end":"flex-start"}}>
              <div style={{
                maxWidth:"75%",background:isOut?"#e85d20":"#f0f0f0",
                color:isOut?"white":"#111",borderRadius:isOut?"14px 14px 2px 14px":"14px 14px 14px 2px",
                padding:"9px 12px",fontSize:13,lineHeight:1.4,
                boxShadow:"0 1px 3px rgba(0,0,0,.1)"
              }}>
                <div style={{wordBreak:"break-word"}}>{m.message}</div>
                <div style={{fontSize:10,opacity:.7,marginTop:4,textAlign:"right"}}>
                  {date} {time} {isOut?"✓✓":""}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Refresh button */}
      <div style={{textAlign:"center",marginTop:12}}>
        <button onClick={loadMsgs} className="tap gh"
          style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 16px",fontSize:12,color:T.muted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
          🔄 Atualizar mensagens
        </button>
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

  const saveInfo=async()=>{setSaving(true);await supabase.from("leads").update({name:form.name,phone:form.phone,email:form.email,course:form.course,source:form.source,notes:form.notes,responsavel:form.responsavel||null,unit:form.unit||null}).eq("id",lead.id);onUpdate({...lead,...form});setEditing(false);setSaving(false);};
  const changeStage=async(id)=>{await supabase.from("leads").update({stage:id}).eq("id",lead.id);onUpdate({...lead,stage:id});};
  const addHist=async()=>{if(!hist.note.trim())return;const entry={id:uid(),lead_id:lead.id,type:hist.type,note:hist.note,date:new Date().toISOString()};await supabase.from("lead_history").insert(entry);onUpdate({...lead,history:[{id:entry.id,type:entry.type,note:entry.note,date:entry.date},...lead.history]});setHist({type:"WhatsApp",note:""});};
  const saveFu=async()=>{await supabase.from("leads").update({follow_up_date:fu.date||null,follow_up_note:fu.note||null}).eq("id",lead.id);onUpdate({...lead,followUp:fu.date?{...fu}:null});};
  const deleteLead=async()=>{if(!window.confirm("Excluir este lead?"))return;await supabase.from("leads").delete().eq("id",lead.id);onDelete(lead.id);};

  return (
    <Modal title={lead.name} subtitle={`${st?.label} · ${lead.course||"Curso não definido"}`} onClose={onClose} width={620} mob={mob}>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:16}}>
        {STAGES.map(s=>(
          <button key={s.id} onClick={()=>changeStage(s.id)} className="tap"
            style={{flexShrink:0,background:lead.stage===s.id?s.hex:"transparent",color:lead.stage===s.id?"white":T.muted,border:`1.5px solid ${lead.stage===s.id?s.hex:T.border}`,borderRadius:20,padding:"4px 11px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
            {s.emoji} {s.label}
          </button>
        ))}
      </div>
      <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,marginBottom:18}}>
        {[["info","Infos"],["historico","Histórico"],["whatsapp","💬 WhatsApp"],["followup","Follow-up"]].map(([id,lbl])=>(
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
            <Inp label="Email" value={form.email||""} onChange={e=>f("email",e.target.value)}/>
            <Sel label="Curso" value={form.course||""} onChange={e=>f("course",e.target.value)} options={COURSES}/>
            <Sel label="Origem" value={form.source||""} onChange={e=>f("source",e.target.value)} options={SOURCES}/>
          </div>
          <Inp label="Responsável (opcional)" value={form.responsavel||""} onChange={e=>f("responsavel",e.target.value)}/>
          <Inp label="Observações" type="textarea" value={form.notes||""} onChange={e=>f("notes",e.target.value)}/>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <Btn variant="ghost" onClick={()=>setEditing(false)}>Cancelar</Btn>
            <Btn onClick={saveInfo} loading={saving} full={mob}>✓ Salvar</Btn>
          </div>
        </div>
      ):(
        <div style={{display:"grid",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["Nome",lead.name],["Telefone",lead.phone],["Email",lead.email||"—"],["Curso",lead.course||"—"],["Unidade",UNITS.find(u=>u.id===lead.unit)?.label||"—"],["Origem",lead.source||"—"],["Responsável",lead.responsavel||"—"]].map(([l,v])=>(
              <div key={l} style={{background:"#f8f8f8",borderRadius:10,padding:"11px 14px"}}>
                <div style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:3}}>{l}</div>
                <div style={{fontWeight:600,fontSize:14,wordBreak:"break-word"}}>{v}</div>
              </div>
            ))}
          </div>
          {lead.notes&&<div style={{background:T.accentLight,borderRadius:10,padding:"12px 14px",borderLeft:"3px solid #e85d20"}}>
            <div style={{fontSize:10,fontWeight:700,color:T.gold,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>Observações</div>
            <div style={{fontSize:13,color:"#c44a10"}}>{lead.notes}</div>
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
            <div style={{flex:1}}><Inp label="Nota" value={hist.note} onChange={e=>setHist(p=>({...p,note:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addHist()} placeholder="O que aconteceu?"/></div>
            <Btn onClick={addHist} full={mob}>+ Registrar</Btn>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:260,overflowY:"auto"}}>
            {lead.history.length===0?<div style={{textAlign:"center",color:T.muted,padding:32}}>Nenhum contato ainda.</div>
            :lead.history.map(h=>(
              <div key={h.id} style={{display:"flex",gap:12,background:"#f8f8f8",borderRadius:10,padding:"12px 14px"}}>
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
      {tab==="whatsapp"&&<WhatsAppTab lead={lead} mob={mob}/>}

      {tab==="followup"&&(
        <div style={{display:"grid",gap:14}}>
          {lead.followUp&&<div style={{background:lead.followUp.date<ts?"rgba(239,68,68,.15)":"rgba(232,93,32,.12)",borderRadius:10,padding:"14px 16px",borderLeft:`3px solid ${lead.followUp.date<ts?"#ef4444":"#e85d20"}`}}>
            <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{lead.followUp.date<ts?"⚠ Atrasado":"✓ Agendado"}</div>
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
    <aside style={{width:220,background:"#111111",display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0,flexShrink:0}}>
      <div style={{padding:"24px 20px 16px"}}>
        <div style={{marginBottom:28,paddingBottom:20,borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <div style={{background:"#ffffff",borderRadius:12,padding:"10px 14px",display:"inline-block"}}>
            <img src={LOGO} alt="Nexus" style={{height:36,objectFit:"contain",display:"block"}}/>
          </div>
        </div>
        <nav style={{display:"flex",flexDirection:"column",gap:3}}>
          {NAV_ITEMS.map(item=>{const on=active===item.id;return(
            <button key={item.id} onClick={()=>onChange(item.id)} className="nav-itm tap"
              style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:9,border:"none",borderLeft:on?"3px solid #e85d20":"3px solid transparent",background:on?"rgba(232,93,32,.12)":"transparent",color:on?"#e85d20":"rgba(255,255,255,.5)",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:on?700:500,textAlign:"left",transition:"all .15s"}}>
              <span style={{fontSize:16}}>{item.icon}</span>{item.label}
              {item.id==="followups"&&fuCount>0&&<span style={{marginLeft:"auto",background:T.gold,color:"white",borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:700}}>{fuCount}</span>}
              {item.id==="whatsapp"&&waUnreadTotal>0&&<span style={{marginLeft:"auto",background:"#25d366",color:"white",borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:700}}>{waUnreadTotal}</span>}
            </button>
          );})}
        </nav>
      </div>
      <div style={{marginTop:"auto",padding:20,borderTop:"1px solid rgba(255,255,255,.06)"}}>
        <div style={{fontSize:11,color:"rgba(255,255,255,.35)",marginBottom:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>👤 {userEmail}</div>
        <button onClick={onLogout} className="tap" style={{width:"100%",background:"transparent",border:"1px solid rgba(255,255,255,.1)",borderRadius:9,padding:"8px",fontSize:13,fontWeight:600,color:"rgba(255,255,255,.45)",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Sair</button>
      </div>
    </aside>
  );
}
function BottomNav({active,onChange,fuCount}) {
  return (
    <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"#111111",borderTop:"1px solid rgba(255,255,255,.06)",display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom,0px)",boxShadow:"0 -4px 20px rgba(0,0,0,.2)"}}>
      {NAV_ITEMS.map(item=>{const on=active===item.id;return(
        <button key={item.id} onClick={()=>onChange(item.id)} className="tap"
          style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"10px 4px 8px",border:"none",background:"transparent",color:on?"#e85d20":"rgba(255,255,255,.4)",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:on?700:500,transition:"color .15s",position:"relative"}}>
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
    <button onClick={onClick} className="tap" style={{position:"fixed",bottom:"calc(68px + env(safe-area-inset-bottom,0px))",right:20,width:54,height:54,borderRadius:27,background:T.accent,border:"none",color:"white",fontSize:26,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(13,115,119,.45)",cursor:"pointer",zIndex:99}}>+</button>
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
      const{data:waUnread}=await supabase.from("whatsapp_messages").select("lead_id").eq("direction","in").eq("read",false);
      const unreadMap={};
      (waUnread||[]).forEach(m=>{if(m.lead_id)unreadMap[m.lead_id]=(unreadMap[m.lead_id]||0)+1;});
      setLeads((ld||[]).map(l=>({
        id:l.id,name:l.name,phone:l.phone,email:l.email||"",course:l.course||"",source:l.source||"",
        stage:l.stage,notes:l.notes||"",responsavel:l.responsavel||"",unit:l.unit||"",createdAt:l.created_at,
        followUp:l.follow_up_date?{date:l.follow_up_date,note:l.follow_up_note||""}:null,
        history:(hd||[]).filter(h=>h.lead_id===l.id).map(h=>({id:h.id,type:h.type,note:h.note,date:h.date})),
        unreadCount:unreadMap[l.id]||0,
      })));
      setDbLoading(false);
    })();
  },[session]);

  const updateLead=u=>{setLeads(p=>p.map(l=>l.id===u.id?u:l));setSelected(u);};
  const addLead=d=>setLeads(p=>[d,...p]);
  const deleteLead=id=>{setLeads(p=>p.filter(l=>l.id!==id));setSelected(null);};
  const moveLead=async(lid,sid)=>{await supabase.from("leads").update({stage:sid}).eq("id",lid);setLeads(p=>p.map(l=>l.id===lid?{...l,stage:sid}:l));};
  const nav=p=>{setPage(p);setSelected(null);};
  const logout=()=>supabase.auth.signOut();
  const ts=today();
  const fuCount=leads.filter(l=>l.followUp?.date&&l.followUp.date<=ts).length;
  const waUnreadTotal=leads.reduce((sum,l)=>sum+(l.unreadCount||0),0);

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
              <div style={{background:"#ffffff",borderRadius:10,padding:"6px 10px",display:"inline-block"}}><img src={LOGO} alt="Nexus" style={{height:26,objectFit:"contain",display:"block"}}/></div>
              <button onClick={logout} className="tap" style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 12px",fontSize:12,color:T.muted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Sair</button>
            </div>
          )}
          {dbLoading?(
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",flexDirection:"column",gap:16}}>
              <Spinner/><p style={{color:T.muted,fontSize:14}}>Carregando dados...</p>
            </div>
          ):(
            <>
              {page==="pipeline"   &&<KanbanBoard leads={leads} onSelect={setSelected} onMove={moveLead} onQuickAdd={()=>setShowQuick(true)} mob={mob}/>}
              {page==="whatsapp"   &&<WhatsAppInbox leads={leads} mob={mob} onSelectLead={l=>{setSelected(l);}}/>}
              {page==="agenda"     &&<AgendaCloser leads={leads} mob={mob}/>}
              {page==="dashboard"  &&<Dashboard leads={leads} mob={mob}/>}
              {page==="leads"      &&<LeadsList leads={leads} onSelect={setSelected} onAdd={()=>setShowAdd(true)} mob={mob}/>}
              {page==="followups"  &&<FollowUps leads={leads} onSelect={setSelected} mob={mob}/>}
              {page==="relatorios" &&<Relatorios leads={leads} mob={mob}/>}
            </>
          )}
        </main>
      </div>
      {mob&&<BottomNav active={page} onChange={nav} fuCount={fuCount}/>}
      {mob&&<FAB onClick={()=>setShowQuick(true)}/>}
      {showQuick&&<QuickAddModal onAdd={addLead} onClose={()=>setShowQuick(false)} mob={mob}/>}
      {showAdd  &&<AddLeadModal  onAdd={addLead} onClose={()=>setShowAdd(false)} mob={mob}/>}
      {selected &&<LeadModal lead={selected} onUpdate={updateLead} onDelete={deleteLead} onClose={()=>setSelected(null)} mob={mob}/>}
    </>
  );
}
