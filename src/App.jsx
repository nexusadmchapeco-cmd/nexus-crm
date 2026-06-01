import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPA_URL = "https://tmkjtyhybfbaqcqovuem.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRta2p0eWh5YmZiYXFjcW92dWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NDY5MjYsImV4cCI6MjA5MDEyMjkyNn0.ZqBH1WkFsXREV9oaDotWkC9kVNt1bA_ERjEZTNjeWO0";
const supabase = createClient(SUPA_URL, SUPA_KEY);
const ZAPI_INSTANCE = "3F0F2B7CCECF710C472AB252550E5DC7";
const ZAPI_TOKEN    = "BE18ADD41E82765B8E67964C";
const ZAPI_CLIENT   = "Fddcba541ce4d42938750ece9472eaa38S";
const LOGO = "/logo.png";

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

// ─── METAS CONFIG ────────────────────────────────────────────────
const METAS = {
  pf: {
    minima: 8, ideal: 15, super: 20,
    avistaMin: 12000, avistaPremio: 150,
    superMensalidadeMin: 12,
    label: "Nexus PF",
  },
  chape: {
    minima: 8, ideal: 15, super: 20,
    avistaMin: 12000, avistaPremio: 150,
    superMensalidadeMin: 12,
    label: "Nexus Chapecó",
  },
  online: {
    minima: 4, ideal: 8, super: 15,
    avistaMin: 5000, avistaPremio: 150,
    superMensalidadeMin: 8,
    label: "Nexus Online",
  },
};
// comissão por tier (% aplicado ao valor da mensalidade ou à vista)
const COMISSAO_TIERS = {
  abaixo:  { label: "Abaixo da mínima", pct: 0,    color: "#94a3b8" },
  minima:  { label: "Meta Mínima",      pct: 0.75, color: "#f59e0b" },
  ideal:   { label: "Meta Ideal",       pct: 0.85, color: "#6366f1" },
  super:   { label: "Super Meta",       pct: 0.95, color: "#10b981" },
};

function getTierForUnit(unit, matrCount) {
  const m = METAS[unit];
  if (!m) return "abaixo";
  if (matrCount >= m.super) return "super";
  if (matrCount >= m.ideal) return "ideal";
  if (matrCount >= m.minima) return "minima";
  return "abaixo";
}

function isSuperMetaValid(unit, mensalidadeCount, avistaTotal) {
  const m = METAS[unit];
  if (!m) return false;
  return mensalidadeCount >= m.superMensalidadeMin && avistaTotal >= m.avistaMin;
}

const CADENCIA = [
  { step:1, label:"1° Contato",        desc:"Atendimento padrão",                    day:0,  role:"sdr",    color:"#6366f1" },
  { step:2, label:"Retomar (mesmo dia)",desc:"Vacuo — retomar no mesmo dia",          day:0,  role:"sdr",    color:"#8b5cf6" },
  { step:3, label:"Retomar (dia 1)",    desc:"Retomar contato no dia seguinte",       day:1,  role:"sdr",    color:"#a78bfa" },
  { step:4, label:"Outra forma",        desc:"Oferecer outra forma de contato",       day:3,  role:"sdr",    color:"#f59e0b" },
  { step:5, label:"Aula Experimental",  desc:"Oferecer aula experimental gratuita",   day:5,  role:"sdr",    color:"#10b981" },
  { step:6, label:"Retirar da lista",   desc:"Avisar que vai retirar dos interessados",day:7, role:"sdr",    color:"#ef4444" },
  { step:7, label:"Guardar contato",    desc:"Guardar pra promoções futuras",         day:14, role:"sdr",    color:"#6b7280" },
];

const CADENCIA_CLOSER = [
  { step:1, label:"Retorno Reunião",      desc:"Retorno após reunião, tirar dúvidas iniciais",   hours:24,  color:"#6366f1" },
  { step:2, label:"Tirar Dúvidas",        desc:"Acompanhamento e esclarecimento de dúvidas",     hours:48,  color:"#8b5cf6" },
  { step:3, label:"Aula Experimental",    desc:"Convidar para aula experimental gratuita",       hours:72,  color:"#10b981" },
  { step:4, label:"Oferecer Promoção",    desc:"Apresentar oferta ou condição especial",         hours:72,  color:"#f59e0b" },
  { step:5, label:"Encerrar Atendimento", desc:"Encerrar e mover para lista fria",               hours:48,  color:"#ef4444" },
];

const NAV_ITEMS = [
  { id:"pipeline",   icon:"◫", label:"Pipeline"  },
  { id:"agenda",     icon:"📅", label:"Agenda"    },
  { id:"whatsapp",   icon:"💬", label:"WhatsApp"  },
  { id:"dashboard",  icon:"⬡", label:"Dashboard" },
  { id:"leads",      icon:"◎", label:"Leads"     },
  { id:"followups",  icon:"◷", label:"Follow-up" },
  { id:"metas",      icon:"🏆", label:"Metas"     },
  { id:"relatorios", icon:"◈", label:"Relatórios"},
  { id:"ia",         icon:"🤖", label:"Agente IA" },
];

const HOURS = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00"];
const WEEKDAYS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

function today()   { return new Date().toISOString().split("T")[0]; }
function uid()     { return Date.now().toString(36)+Math.random().toString(36).slice(2); }
function norm(s)   { return (s||"").toLowerCase(); }
function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR",{day:"2-digit",month:"short"})+" "+d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
}
function fmtMoney(v) {
  if (!v && v !== 0) return "—";
  return Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}
function addMinutes(time, mins) {
  const [h,m] = time.split(":").map(Number);
  const total = h*60+m+mins;
  return `${String(Math.floor(total/60)).padStart(2,"0")}:${String(total%60).padStart(2,"0")}`;
}
function getWeekDates(baseDate) {
  const d = new Date(baseDate + "T12:00:00");
  const day = d.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const nd = new Date(d);
    nd.setDate(d.getDate() + diffToMon + i);
    dates.push(nd.toISOString().split("T")[0]);
  }
  return dates;
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

/* ─── MATRICULA MODAL ────────────────────────────────────────────── */
function MatriculaModal({ lead, onConfirm, onCancel, mob }) {
  const [tipo, setTipo] = useState("mensalidade"); // "mensalidade" | "avista"
  const [valorMensalidade, setValorMensalidade] = useState("");
  const [valorAvista, setValorAvista] = useState("");
  const [obs, setObs] = useState("");

  const handleConfirm = () => {
    if (tipo === "mensalidade" && !valorMensalidade) {
      alert("Informe o valor da mensalidade.");
      return;
    }
    if (tipo === "avista" && !valorAvista) {
      alert("Informe o valor total do curso.");
      return;
    }
    onConfirm({
      tipo,
      valorMensalidade: tipo === "mensalidade" ? parseFloat(valorMensalidade) || 0 : 0,
      valorAvista: tipo === "avista" ? parseFloat(valorAvista) || 0 : 0,
      obs,
    });
  };

  return (
    <Modal title="🏆 Registrar Matrícula" subtitle={`${lead?.name || "Lead"} — ${lead?.course || "—"}`} onClose={onCancel} mob={mob} width={480}>
      <div style={{display:"grid",gap:16}}>
        {/* Tipo de venda */}
        <div>
          <span style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>Tipo de Venda *</span>
          <div style={{display:"flex",gap:8}}>
            {[
              {id:"mensalidade", icon:"📅", label:"Mensalidade"},
              {id:"avista",      icon:"💵", label:"À Vista"},
            ].map(t=>(
              <button key={t.id} type="button" onClick={()=>setTipo(t.id)} className="tap"
                style={{flex:1,background:tipo===t.id?"#e85d2018":"transparent",border:`1.5px solid ${tipo===t.id?T.accent:T.border}`,borderRadius:11,padding:"14px 10px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",color:tipo===t.id?T.accent:T.muted,transition:"all .15s",textAlign:"center"}}>
                <div style={{fontSize:24,marginBottom:4}}>{t.icon}</div>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Valor mensalidade */}
        {tipo === "mensalidade" && (
          <div>
            <span style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>Valor da Mensalidade *</span>
            <div style={{position:"relative"}}>
              <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:14,fontWeight:700,color:T.muted}}>R$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={valorMensalidade}
                onChange={e=>setValorMensalidade(e.target.value)}
                placeholder="0,00"
                style={{width:"100%",background:"#f8f8f8",border:`1.5px solid ${T.border}`,borderRadius:10,padding:"11px 13px 11px 36px",fontSize:16,color:T.text,outline:"none",fontFamily:"'DM Sans',sans-serif"}}
                onFocus={e=>e.target.style.borderColor=T.accent}
                onBlur={e=>e.target.style.borderColor=T.border}
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Valor à vista */}
        {tipo === "avista" && (
          <div style={{display:"grid",gap:12}}>
            <div>
              <span style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>Valor Total do Curso (à vista) *</span>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:14,fontWeight:700,color:T.muted}}>R$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={valorAvista}
                  onChange={e=>setValorAvista(e.target.value)}
                  placeholder="0,00"
                  style={{width:"100%",background:"#f8f8f8",border:`1.5px solid ${T.border}`,borderRadius:10,padding:"11px 13px 11px 36px",fontSize:16,color:T.text,outline:"none",fontFamily:"'DM Sans',sans-serif"}}
                  onFocus={e=>e.target.style.borderColor=T.accent}
                  onBlur={e=>e.target.style.borderColor=T.border}
                  autoFocus
                />
              </div>
            </div>
            <div style={{background:"#dcfce7",border:"1px solid #86efac",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#15803d",fontWeight:600}}>
              💵 Venda à vista — conta para a meta de premiação!
            </div>
          </div>
        )}

        <Inp label="Observações (opcional)" type="textarea" value={obs} onChange={e=>setObs(e.target.value)} placeholder="Ex: Fechou Nexus Class, pagamento via PIX..."/>

        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <Btn variant="ghost" onClick={onCancel}>Cancelar</Btn>
          <Btn onClick={handleConfirm} full={mob}>✅ Confirmar Matrícula</Btn>
        </div>
      </div>
    </Modal>
  );
}

/* ─── MINI METAS SIDEBAR ────────────────────────────────────────── */
function MiniMetas({ leads }) {
  const curMonth = new Date().getMonth();
  const curYear  = new Date().getFullYear();

  const metaLeads = leads.filter(l => {
    if (l.stage !== "matriculado") return false;
    if (l.matriculaMes) {
      const [y,m] = l.matriculaMes.split("-");
      return parseInt(m)-1 === curMonth && parseInt(y) === curYear;
    }
    const d = new Date(l.createdAt);
    return d.getMonth() === curMonth && d.getFullYear() === curYear;
  });

  return (
    <div style={{padding:"0 12px 16px",borderTop:"1px solid rgba(255,255,255,.06)",marginTop:4,paddingTop:12}}>
      <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>
        🎯 Metas do Mês
      </div>
      {UNITS.map(unit => {
        const m = METAS[unit.id];
        const total = metaLeads.filter(l => l.unit === unit.id).length;
        const avista = metaLeads.filter(l => l.unit === unit.id && l.tipoVenda === "avista").reduce((s,l)=>s+(l.valorAvista||0),0);
        const mensalidadeCount = metaLeads.filter(l => l.unit === unit.id && l.tipoVenda === "mensalidade").length;
        const tier = getTierForUnit(unit.id, total);
        const tierInfo = COMISSAO_TIERS[tier];
        const pct = total / m.super;
        const barColor = tier === "super" ? "#10b981" : tier === "ideal" ? "#6366f1" : tier === "minima" ? "#f59e0b" : "#475569";
        const avistaOk = avista >= m.avistaMin;
        const superOk = tier === "super" && isSuperMetaValid(unit.id, mensalidadeCount, avista);

        return (
          <div key={unit.id} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
              <span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.6)"}}>{unit.label}</span>
              <span style={{fontSize:11,fontWeight:800,color:barColor}}>{total}/{m.super}</span>
            </div>
            {/* Progress bar com milestones */}
            <div style={{position:"relative",height:8,background:"rgba(255,255,255,.1)",borderRadius:4,overflow:"visible",marginBottom:4}}>
              <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${Math.min((total/m.super)*100,100)}%`,background:barColor,borderRadius:4,transition:"width .4s"}}/>
              {/* milestone markers */}
              {[
                {v:m.minima, color:"#f59e0b"},
                {v:m.ideal,  color:"#6366f1"},
              ].map(mk=>(
                <div key={mk.v} style={{position:"absolute",left:`${(mk.v/m.super)*100}%`,top:-2,width:2,height:12,background:mk.color,borderRadius:1,transform:"translateX(-50%)"}}/>
              ))}
            </div>
            {/* Labels minima/ideal/super */}
            <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"rgba(255,255,255,.25)"}}>
              <span>{m.minima}</span>
              <span>{m.ideal}</span>
              <span>{m.super}+</span>
            </div>
            {/* Tier badge */}
            <div style={{display:"flex",alignItems:"center",gap:4,marginTop:4}}>
              <span style={{fontSize:9,fontWeight:700,color:barColor,background:barColor+"22",borderRadius:4,padding:"1px 6px"}}>
                {tier === "super" && superOk ? "⚡ SUPER" : tier === "super" ? "🎯 IDEAL" : tier === "ideal" ? "🎯 IDEAL" : tier === "minima" ? "✓ MÍNIMA" : "— ABAIXO"}
              </span>
              {tier !== "abaixo" && (
                <span style={{fontSize:9,color:"rgba(255,255,255,.3)"}}>
                  com {Math.round(COMISSAO_TIERS[tier === "super" && !superOk ? "ideal" : tier].pct*100)}%
                </span>
              )}
              {avistaOk && <span style={{fontSize:9,fontWeight:700,color:"#10b981",marginLeft:"auto"}}>💵+R$150</span>}
            </div>
          </div>
        );
      })}
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
      const playTone=(freq,start,dur,vol,type="sine")=>{
        const o=ctx.createOscillator(),g=ctx.createGain();
        o.type=type; o.frequency.value=freq;
        g.gain.setValueAtTime(0,ctx.currentTime+start);
        g.gain.linearRampToValueAtTime(vol,ctx.currentTime+start+0.01);
        g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+start+dur);
        o.connect(g);g.connect(ctx.destination);
        o.start(ctx.currentTime+start);o.stop(ctx.currentTime+start+dur+0.05);
      };
      playTone(1400,0,0.4,0.5,"sine");
      playTone(1800,0.05,0.35,0.3,"sine");
      playTone(2200,0.08,0.3,0.25,"sine");
      playTone(1600,0.15,0.5,0.4,"sine");
      playTone(2400,0.2,0.4,0.3,"sine");
      playTone(120,0.02,0.08,0.6,"square");
      playTone(80,0.06,0.1,0.5,"square");
      [0.3,0.38,0.44,0.49,0.53,0.56].forEach((t,i)=>{
        playTone(800+i*200,t,0.12,0.3,"triangle");
        playTone(600+i*150,t+0.02,0.1,0.2,"triangle");
      });
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
    const EMOJIS=["💰","💵","🤑","✨","🎉","🎊","💸"];
    const COLS=["#10b981","#f59e0b","#22c55e","#fbbf24","#34d399","#86efac","#fff"];
    const ps=Array.from({length:280},(_,i)=>({
      x:Math.random()*canvas.width, y:-30-Math.random()*200,
      r:4+Math.random()*9,color:COLS[Math.floor(Math.random()*COLS.length)],
      vx:(Math.random()-.5)*10, vy:3+Math.random()*8,
      rot:Math.random()*Math.PI*2, rv:(Math.random()-.5)*.2,
      sh:i<20?"emoji":"rect",emoji:EMOJIS[Math.floor(Math.random()*EMOJIS.length)],
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
      playTone(523,0,0.15,0.4,"square");
      playTone(659,0.12,0.15,0.4,"square");
      playTone(784,0.24,0.15,0.4,"square");
      playTone(1047,0.36,0.4,0.5,"square");
      playTone(784,0.36,0.4,0.3,"square");
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
  const [bookModal,setBookModal]=useState(null);
  const [blockMode,setBlockMode]=useState(false);
  const [bookForm,setBookForm]=useState({lead_id:"",notes:"",tipo:"reuniao"});
  const [saving,setSaving]=useState(false);

  const weekDates=getWeekDates(weekBase);
  const workDates=getWeekDates(weekBase);

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
  const getSlotsAt=(date,time)=>slots.filter(s=>s.date===date&&s.time===time);

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
    const{error}=await supabase.from("agenda").insert({id:uid(),lead_id:bookForm.lead_id,date,time,notes:bookForm.notes||null,status:"agendado",tipo:bookForm.tipo||"reuniao"});
    if(!error){
      if(bookForm.tipo==="reuniao"){
        await supabase.from("leads").update({stage:"reuniao"}).eq("id",bookForm.lead_id);
      }
      await loadData();
      const lead=leads.find(l=>l.id===bookForm.lead_id);
      const isPF=lead?.unit==="pf";
      const closerPhone=isPF?"5554999658474":"5549988971344";
      const dateFormatted=new Date(date+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"2-digit"});
      const msg=`🗓 *Nova reunião agendada!*\n\n👤 *Lead:* ${lead?.name||"—"}\n📱 *Telefone:* ${lead?.phone||"—"}\n📚 *Curso:* ${lead?.course||"—"}\n🏫 *Unidade:* ${lead?.unit==="pf"?"Nexus PF":lead?.unit==="chape"?"Nexus Chapecó":"Nexus Online"}\n\n📅 *Data:* ${dateFormatted}\n🕐 *Horário:* ${time} – ${addMinutes(time,30)}\n\n${bookForm.notes?`📝 *Obs:* ${bookForm.notes}\n\n`:""}Reunião cadastrada no CRM ✅`;
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
    const slot=slots.find(s=>s.id===id);
    if(slot?.lead_id){
      await supabase.from("leads").update({stage:"negociacao"}).eq("id",slot.lead_id);
      const next=new Date(Date.now()+24*60*60*1000);
      const dateStr=next.toISOString().split("T")[0];
      const timeStr=next.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
      await supabase.from("leads").update({follow_up_date:dateStr,follow_up_time:timeStr,follow_up_note:"1° Retorno Reunião"}).eq("id",slot.lead_id);
    }
    loadData();
  };

  const prevWeek=()=>{ const d=new Date(weekBase); d.setDate(d.getDate()-7); setWeekBase(d.toISOString().split("T")[0]); };
  const nextWeek=()=>{ const d=new Date(weekBase); d.setDate(d.getDate()+7); setWeekBase(d.toISOString().split("T")[0]); };
  const goToday=()=>setWeekBase(today());

  const ts=today();
  const todaySlots=slots.filter(s=>s.date===ts&&s.status!=="cancelado").sort((a,b)=>a.time.localeCompare(b.time));
  const availLeads=leads.filter(l=>l.stage==="reuniao");
  const statusColor={agendado:T.gold,confirmado:T.accent,cancelado:"#dc2626"};

  return (
    <div style={{animation:"fadeUp .3s"}}>
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
        </div>
      </div>

      {todaySlots.length>0&&(
        <div style={{background:T.accentLight,border:"1.5px solid rgba(232,93,32,.3)",borderRadius:T.radius,padding:"12px 16px",marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:14,color:T.accent,marginBottom:8}}>🔴 Hoje — {todaySlots.length} reunião(ões)</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {todaySlots.map(s=>{const lead=leads.find(l=>l.id===s.lead_id);return(
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,fontSize:13}}>
                <span style={{fontWeight:700,color:s.tipo==="experimental"?"#10b981":T.accent}}>{s.tipo==="experimental"?"🧪":"📅"} {s.time}–{addMinutes(s.time,30)}</span>
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

      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <button onClick={prevWeek} className="tap gh" style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
        <button onClick={goToday} className="tap gh" style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:600,color:T.muted,fontFamily:"'DM Sans',sans-serif"}}>Hoje</button>
        <button onClick={nextWeek} className="tap gh" style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
        <span style={{fontSize:14,fontWeight:600,color:T.text}}>
          {new Date(workDates[0]+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"short"})} – {new Date(workDates[workDates.length-1]+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric"})}
        </span>
      </div>

      {loading?<div style={{textAlign:"center",padding:40}}><Spinner/></div>:(
        <div style={{background:"#ffffff",border:"1px solid #e8e8e8",borderRadius:T.radius,overflow:"auto"}}>
          <div style={{display:"grid",gridTemplateColumns:`64px repeat(${workDates.length},1fr)`,borderBottom:`1px solid ${T.border}`}}>
            <div style={{padding:"10px 8px",fontSize:11,color:T.muted,fontWeight:700,borderRight:`1px solid ${T.border}`}}></div>
            {workDates.map(date=>{
              const d=new Date(date+"T12:00:00");
              const isToday=date===ts;
              return (
                <div key={date} style={{padding:"10px 6px",textAlign:"center",borderRight:`1px solid ${T.border}`,background:isToday?"rgba(232,93,32,.1)":"transparent"}}>
                  <div style={{fontSize:11,color:isToday?T.accent:T.muted,fontWeight:700}}>{WEEKDAYS[d.getDay()]}</div>
                  <div style={{fontSize:isToday?18:16,fontWeight:isToday?800:500,width:isToday?28:24,height:isToday?28:24,borderRadius:"50%",background:isToday?"#e85d20":"transparent",color:isToday?"white":"#111",display:"flex",alignItems:"center",justifyContent:"center",margin:"2px auto 0"}}>{d.getDate()}</div>
                </div>
              );
            })}
          </div>
          {HOURS.map(hour=>(
            <div key={hour} style={{display:"grid",gridTemplateColumns:`64px repeat(${workDates.length},1fr)`,borderBottom:`1px solid ${T.border}`}}>
              <div style={{padding:"8px",fontSize:11,color:T.muted,fontWeight:600,borderRight:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",background:"#fafafa"}}>{hour}</div>
              {workDates.map(date=>{
                const slotsAt=getSlotsAt(date,hour);const slot=slotsAt[0];
                const blk=isBlocked(date,hour);
                const lead=slot?leads.find(l=>l.id===slot.lead_id):null;
                const isPast=date<ts||(date===ts&&hour<new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}));
                return (
                  <div key={date}
                    onClick={()=>{if(blockMode){toggleBlock(date,hour);return;}if(!slot&&!blk&&!isPast)setBookModal({date,time:hour});}}
                    className={!slot&&!blk&&!isPast&&!blockMode?"slot-avail":""}
                    style={{minHeight:44,padding:"4px 6px",borderRight:`1px solid ${T.border}`,background:blk?"#f0f0f0":slot?(slot.tipo==="experimental"?"#10b98122":"#e85d2022"):isPast?"#fafafa":"white",cursor:blockMode?"pointer":(!slot&&!blk&&!isPast?"pointer":"default"),position:"relative",transition:"background .15s"}}>
                    {blk&&<div style={{fontSize:11,color:"#94a3b8",fontWeight:600,padding:"4px 2px",textAlign:"center"}}>🔒</div>}
                    {slot&&(
                      <div style={{fontSize:11,background:slot.tipo==="experimental"?"#10b981":statusColor[slot.status]||T.accent,color:"white",borderRadius:6,padding:"4px 6px",lineHeight:1.3}}>
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

      {bookModal&&(
        <Modal title="Agendar Reunião" subtitle={`${new Date(bookModal.date+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long"})} · ${bookModal.time} – ${addMinutes(bookModal.time,30)} (30 min)`} onClose={()=>setBookModal(null)} mob={mob} width={460}>
          <div style={{display:"grid",gap:13}}>
            <Sel label="Lead *" value={bookForm.lead_id} onChange={e=>setBookForm(p=>({...p,lead_id:e.target.value}))}
              options={[{value:"",label:"Selecione o lead..."},...availLeads.map(l=>({value:l.id,label:`${l.name} — ${STAGES.find(s=>s.id===l.stage)?.label||""}`}))]}/>
            <div>
              <span style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>Tipo de encontro</span>
              <div style={{display:"flex",gap:8}}>
                {[{id:"reuniao",label:"📅 Reunião de fechamento",color:T.accent},{id:"experimental",label:"🎓 Aula Experimental",color:"#10b981"}].map(t=>(
                  <button key={t.id} type="button" onClick={()=>setBookForm(p=>({...p,tipo:t.id}))} className="tap"
                    style={{flex:1,background:bookForm.tipo===t.id?t.color+"18":"transparent",border:`1.5px solid ${bookForm.tipo===t.id?t.color:T.border}`,borderRadius:10,padding:"10px 8px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",color:bookForm.tipo===t.id?t.color:T.muted,transition:"all .15s",textAlign:"center"}}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
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

  const conversations = {};
  msgs.forEach(m=>{
    const key = m.phone.replace(/[^0-9]/g,"").slice(-9);
    if(!conversations[key]){
      const lead = leads.find(l=>l.phone.replace(/[^0-9]/g,"").slice(-9)===key);
      conversations[key]={phone:m.phone,key,lead,messages:[],unread:0,lastMsg:m,lastTime:m.timestamp};
    }
    conversations[key].messages.push(m);
    if(new Date(m.timestamp)>new Date(conversations[key].lastTime)){
      conversations[key].lastTime=m.timestamp;
      conversations[key].lastMsg=m;
    }
    if(!m.read&&m.direction==="in") conversations[key].unread++;
  });

  const convList = Object.values(conversations).filter(c=>c.key.length<=13).sort((a,b)=>new Date(b.lastTime)-new Date(a.lastTime));
  const selected = selectedPhone ? conversations[selectedPhone] : null;
  const markRead = async (key) => {
    const lead = leads.find(l=>l.phone.replace(/[^0-9]/g,"").slice(-9)===key);
    if(lead) await supabase.from("whatsapp_messages").update({read:true}).eq("lead_id",lead.id).eq("direction","in").eq("read",false);
  };
  const openChat = (key) => { setSelectedPhone(key); markRead(key); };
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
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`,fontSize:12,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em"}}>{convList.length} conversa(s)</div>
          <div style={{overflowY:"auto",flex:1}}>
            {loading?<div style={{textAlign:"center",padding:32}}><Spinner/></div>
            :convList.length===0?<div style={{textAlign:"center",padding:40,color:T.muted,fontSize:14}}>Nenhuma conversa ainda.</div>
            :convList.map(conv=>{
              const isSelected=selectedPhone===conv.key;
              const lastMsg=conv.messages[0];
              return (
                <div key={conv.phone} onClick={()=>openChat(conv.key)}
                  style={{padding:"14px 16px",borderBottom:`1px solid ${T.border}`,cursor:"pointer",background:isSelected?T.accentLight:"transparent",transition:"background .15s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                    <div style={{fontWeight:700,fontSize:14,color:T.text}}>{conv.lead?.name||conv.phone}</div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      {conv.unread>0&&<span style={{background:"#25d366",color:"white",borderRadius:10,padding:"1px 7px",fontSize:11,fontWeight:700}}>{conv.unread}</span>}
                      <span style={{fontSize:11,color:T.muted}}>{new Date(conv.lastTime).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</span>
                    </div>
                  </div>
                  <div style={{fontSize:12,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lastMsg?.direction==="out"?"✓ ":""}{lastMsg?.message||""}</div>
                  {conv.lead&&<div style={{marginTop:4}}><Pill color={STAGES.find(s=>s.id===conv.lead.stage)?.hex||T.muted}>{STAGES.find(s=>s.id===conv.lead.stage)?.label||"—"}</Pill></div>}
                </div>
              );
            })}
          </div>
        </div>
        {selected&&!mob&&(
          <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,display:"flex",flexDirection:"column",overflow:"hidden"}}>
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
            <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:8,background:"#f9f9f7"}}>
              {[...selected.messages].reverse().map(m=>{
                const isOut=m.direction==="out";
                return (
                  <div key={m.id} style={{display:"flex",justifyContent:isOut?"flex-end":"flex-start"}}>
                    <div style={{maxWidth:"70%",background:isOut?"#e85d20":"white",color:isOut?"white":"#111",borderRadius:isOut?"14px 14px 2px 14px":"14px 14px 14px 2px",padding:"9px 13px",fontSize:13,lineHeight:1.4,boxShadow:"0 1px 3px rgba(0,0,0,.08)"}}>
                      <div style={{wordBreak:"break-word"}}>{m.message}</div>
                      <div style={{fontSize:10,opacity:.65,marginTop:4,textAlign:"right"}}>{new Date(m.timestamp).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})} {isOut?"✓✓":""}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{padding:"12px 16px",borderTop:`1px solid ${T.border}`,background:T.surface,fontSize:12,color:T.muted,textAlign:"center"}}>Responda pelo WhatsApp no celular 📱</div>
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
  const [search,setSearch]=useState("");
  const [filterUnit,setFilterUnit]=useState("");
  const [matrFilter,setMatrFilter]=useState("mes");
  // Matricula modal state
  const [matriculaPending,setMatriculaPending]=useState(null); // {leadId, prevStage}
  const dragging=useRef(null);
  const ts=today();

  const filteredLeads=leads.filter(l=>{
    const s=(search||"").toLowerCase().trim();
    const matchSearch=!s||(l.name||"").toLowerCase().includes(s)||(l.responsavel||"").toLowerCase().includes(s)||(l.phone||"").replace(/\D/g,"").includes(s.replace(/\D/g,""));
    const matchUnit=!filterUnit||l.unit===filterUnit;
    return matchSearch&&matchUnit;
  });
  const sdrStages=STAGES.filter(s=>s.role==="sdr");
  const closerStages=STAGES.filter(s=>s.role==="closer");

  const handleMatriculaConfirm = async (leadId, data) => {
    // Save matricula info + move stage
    await supabase.from("leads").update({
      stage: "matriculado",
      tipo_venda: data.tipo,
      valor_mensalidade: data.tipo === "mensalidade" ? data.valorMensalidade : null,
      valor_avista: data.tipo === "avista" ? data.valorAvista : null,
    }).eq("id", leadId);

    if (data.obs) {
      await supabase.from("lead_history").insert({
        id: uid(), lead_id: leadId, type: "Anotação",
        note: `💰 Matrícula registrada — ${data.tipo === "avista" ? `À Vista: ${fmtMoney(data.valorAvista)}` : `Mensalidade: ${fmtMoney(data.valorMensalidade)}`}${data.obs ? `. ${data.obs}` : ""}`,
        date: new Date().toISOString()
      });
    }

    onMove(leadId, "matriculado", {
      tipoVenda: data.tipo,
      valorMensalidade: data.tipo === "mensalidade" ? data.valorMensalidade : 0,
      valorAvista: data.tipo === "avista" ? data.valorAvista : 0,
    });
    setMatriculaPending(null);
    setTimeout(()=>setCelebrating(true), 50);
  };

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
        {/* Valor da matrícula no card */}
        {stage.id==="matriculado"&&lead.tipoVenda&&(
          <div style={{fontSize:10,fontWeight:700,color:"#16a34a",background:"#dcfce7",borderRadius:5,padding:"2px 7px",display:"inline-block",marginBottom:2}}>
            {lead.tipoVenda==="avista"?`💵 ${fmtMoney(lead.valorAvista)} à vista`:`📅 ${fmtMoney(lead.valorMensalidade)}/mês`}
          </div>
        )}
        {(isTd||ov)&&<div style={{background:ov?"#fef2f2":"#fefce8",color:ov?"#b91c1c":"#92400e",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700,marginTop:4,display:"inline-block"}}>{ov?"⚠ Atrasado":"🔔 Hoje"}</div>}
        {lead.cadenciaStep>0&&(()=>{
          const cad=CADENCIA.find(c=>c.step===lead.cadenciaStep);
          if(!cad)return null;
          const started=lead.cadenciaStarted?new Date(lead.cadenciaStarted):null;
          const nextStep=CADENCIA.find(c=>c.step===lead.cadenciaStep+1);
          const deadlineDay=nextStep?nextStep.day:cad.day+7;
          const deadline=started?new Date(started.getTime()+(deadlineDay*24*60*60*1000)):null;
          const isLate=deadline&&new Date()>deadline;
          return(
            <div style={{background:isLate?"#fef2f2":cad.color+"18",border:`1px solid ${isLate?"#fecaca":cad.color+"44"}`,borderRadius:6,padding:"3px 8px",fontSize:10,fontWeight:700,marginTop:4,color:isLate?"#dc2626":cad.color,display:"flex",alignItems:"center",gap:4}}>
              {isLate?"⚠":"▶"} {cad.step}/7 {cad.label}{isLate?" — ATRASADO":""}
            </div>
          );
        })()}
      </div>
    );
  };

  const StageColumn = ({ stage, leads: sl, onDrop }) => {
    const isMatr = stage.id === "matriculado";
    const curMonth = new Date().getMonth(), curYear = new Date().getFullYear();
    const slRaw = filteredLeads.filter(l => l.stage === stage.id);
    const displayed = isMatr && matrFilter === "mes"
      ? slRaw.filter(l => {
          if (l.matriculaMes) { const [y,m] = l.matriculaMes.split("-"); return parseInt(m)-1 === curMonth && parseInt(y) === curYear; }
          const d = new Date(l.createdAt); return d.getMonth() === curMonth && d.getFullYear() === curYear;
        })
      : slRaw;
    const over = dragOver === stage.id;
    return (
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(stage.id); }}
        onDragLeave={() => setDragOver(null)}
        onDrop={e => { e.preventDefault(); onDrop(dragging.current, stage.id); setDragOver(null); dragging.current = null; }}
        style={{ minWidth: 195, flex: "0 0 195px", background: over ? stage.hex + "11" : T.bg, border: `1.5px solid ${over ? stage.hex : T.border}`, borderRadius: T.radius, padding: 12, transition: "all .18s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: stage.hex }}>{stage.emoji}</span>
          <span style={{ fontSize: 11, fontWeight: 700 }}>{stage.label}</span>
          <span style={{ marginLeft: "auto", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: "1px 7px", fontSize: 11, fontWeight: 700, color: T.muted }}>{displayed.length}{isMatr && matrFilter === "mes" && <span style={{ fontSize: 9, color: T.muted }}> /mês</span>}</span>
        </div>
        {isMatr && (
          <div style={{ display: "flex", gap: 4, marginBottom: 10, background: T.bg, borderRadius: 8, padding: 3 }}>
            {[["mes", "Este mês"], ["total", "Total"]].map(([id, lbl]) => (
              <button key={id} onClick={() => setMatrFilter(id)} className="tap"
                style={{ flex: 1, background: matrFilter === id ? T.accent : "transparent", color: matrFilter === id ? "white" : T.muted, border: "none", borderRadius: 6, padding: "4px 6px", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .15s" }}>
                {lbl}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 40, maxHeight: 340, overflowY: "auto", paddingRight: 2 }}>
          {displayed.map(lead => <LeadCard key={lead.id} lead={lead} stage={stage} />)}
        </div>
      </div>
    );
  };

  const handleDrop = (leadId, stageId) => {
    if (!leadId) return;
    const prev = leads.find(l => l.id === leadId);
    if (stageId === "matriculado" && prev?.stage !== "matriculado") {
      // Show matricula modal first
      setMatriculaPending({ leadId, prevStage: prev?.stage });
      return;
    }
    const shouldCelebrateMatr = stageId === "matriculado" && prev?.stage !== "matriculado";
    const shouldCelebrateReun = stageId === "reuniao" && prev?.stage !== "reuniao";
    onMove(leadId, stageId);
    if (shouldCelebrateMatr) setTimeout(() => setCelebrating(true), 50);
    if (shouldCelebrateReun) setTimeout(() => setReuniaoCelebrating(true), 50);
  };

  if (mob) {
    const stage = STAGES.find(s => s.id === activeStage);
    const stLeads = filteredLeads.filter(l => l.stage === activeStage);
    return (
      <div style={{ animation: "fadeUp .3s" }}>
        {celebrating && <CashCelebration onDone={() => setCelebrating(false)} />}
        {reuniaoCelebrating && <ReuniaoCelebration onDone={() => setReuniaoCelebrating(false)} />}
        {matriculaPending && (
          <MatriculaModal
            lead={leads.find(l => l.id === matriculaPending.leadId)}
            onConfirm={data => handleMatriculaConfirm(matriculaPending.leadId, data)}
            onCancel={() => setMatriculaPending(null)}
            mob={mob}
          />
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 400 }}>Pipeline</h1>
          <Btn onClick={onQuickAdd} style={{ padding: "8px 14px", fontSize: 13 }}>⚡ Novo Lead</Btn>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Buscar lead..." style={{ flex: 1, background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "9px 12px", fontSize: 14, color: T.text, outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
          <select value={filterUnit} onChange={e => setFilterUnit(e.target.value)} style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "9px 10px", fontSize: 13, color: T.muted, outline: "none", fontFamily: "'DM Sans',sans-serif", cursor: "pointer" }}>
            <option value="">Todas</option>
            {UNITS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 10, marginBottom: 16, WebkitOverflowScrolling: "touch" }}>
          {STAGES.map(s => { const cnt = filteredLeads.filter(l => l.stage === s.id).length, on = s.id === activeStage; return (
            <button key={s.id} onClick={() => setActiveStage(s.id)} className="tap"
              style={{ flexShrink: 0, background: on ? s.hex : T.surface, color: on ? "white" : T.muted, border: `1.5px solid ${on ? s.hex : T.border}`, borderRadius: 20, padding: "5px 11px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
              {s.label}<span style={{ background: on ? "rgba(255,255,255,.25)" : T.bg, borderRadius: 10, padding: "1px 5px", fontSize: 10 }}>{cnt}</span>
            </button>
          ); })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {stLeads.length === 0 ? <div style={{ background: "#fafafa", border: "1.5px dashed #333", borderRadius: T.radius, padding: 32, textAlign: "center", color: T.muted }}>Nenhum lead nesta etapa</div>
            : stLeads.map(lead => <LeadCard key={lead.id} lead={lead} stage={stage} />)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeUp .3s" }}>
      {celebrating && <CashCelebration onDone={() => setCelebrating(false)} />}
      {reuniaoCelebrating && <ReuniaoCelebration onDone={() => setReuniaoCelebrating(false)} />}
      {matriculaPending && (
        <MatriculaModal
          lead={leads.find(l => l.id === matriculaPending.leadId)}
          onConfirm={data => handleMatriculaConfirm(matriculaPending.leadId, data)}
          onCancel={() => { setMatriculaPending(null); dragging.current = null; }}
          mob={mob}
        />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 400, letterSpacing: "-.5px" }}>Pipeline</h1>
          <p style={{ color: T.muted, fontSize: 14, marginTop: 4 }}>Arraste os cards entre as etapas</p>
        </div>
        <Btn onClick={onQuickAdd}>⚡ Novo Lead</Btn>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
        {UNITS.map(u => (
          <div key={u.id} style={{ background: u.color, border: `1px solid ${u.border}`, borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, color: u.text, display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: u.text, opacity: .6 }} />{u.label}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Nome ou telefone..." style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "9px 14px", fontSize: 14, color: T.text, outline: "none", fontFamily: "'DM Sans',sans-serif", width: 240 }} />
        <select value={filterUnit} onChange={e => setFilterUnit(e.target.value)} style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "9px 12px", fontSize: 13, color: filterUnit ? T.text : T.muted, outline: "none", fontFamily: "'DM Sans',sans-serif", cursor: "pointer" }}>
          <option value="">Todas as unidades</option>
          {UNITS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
        </select>
        {(search || filterUnit) && <button onClick={() => { setSearch(""); setFilterUnit(""); }} className="tap gh" style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: T.muted, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>✕ Limpar</button>}
      </div>
      {/* SDR */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: "#f0f0f0", color: "#888", borderRadius: 6, padding: "3px 10px" }}>SDR</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, alignItems: "flex-start" }}>
          {sdrStages.map(stage => <StageColumn key={stage.id} stage={stage} onDrop={handleDrop} />)}
        </div>
      </div>
      {/* CLOSER */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: T.accentLight, color: "#e85d20", borderRadius: 6, padding: "3px 10px" }}>CLOSER</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>
        <div style={{ display: "flex", gap: 10, paddingBottom: 8, alignItems: "flex-start" }}>
          {closerStages.map(stage => <StageColumn key={stage.id} stage={stage} onDrop={handleDrop} />)}
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
          {filtered.map(lead=>{const st=STAGES.find(s=>s.id===lead.stage);return(
            <div key={lead.id} onClick={()=>onSelect(lead)} className="c-hover" style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"14px 16px",cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{fontWeight:700,fontSize:15}}>{lead.name}</div>
                <Pill color={st?.hex}>{st?.label}</Pill>
              </div>
              <div style={{fontSize:13,color:T.muted,marginBottom:2}}>📱 {lead.phone}</div>
              <div style={{fontSize:13,color:T.muted}}>📚 {lead.course||"—"} · {lead.source||"—"}</div>
              {lead.unit&&(()=>{const u=UNITS.find(x=>x.id===lead.unit);return u?<span style={{display:"inline-block",fontSize:11,fontWeight:700,color:u.text,background:u.color,border:`1px solid ${u.border}`,borderRadius:6,padding:"2px 8px",marginTop:4,marginRight:4}}>{u.label}</span>:null;})()}
            </div>
          );})}
          {filtered.length===0&&<div style={{textAlign:"center",color:T.muted,padding:40}}>Nenhum lead encontrado.</div>}
        </div>
      ):(
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
            <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>{["Nome","Telefone","Curso","Unidade","Responsável","Origem","Etapa","Matrícula","Follow-up"].map(h=>(
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
                  <td style={{padding:"12px 16px",fontSize:12}}>
                    {lead.tipoVenda ? (
                      <span style={{color:lead.tipoVenda==="avista"?"#16a34a":"#6366f1",fontWeight:700}}>
                        {lead.tipoVenda==="avista"?`💵 ${fmtMoney(lead.valorAvista)}`:`📅 ${fmtMoney(lead.valorMensalidade)}/mês`}
                      </span>
                    ) : <span style={{color:T.muted}}>—</span>}
                  </td>
                  <td style={{padding:"12px 16px"}}>{lead.followUp?<span style={{fontSize:12,fontWeight:700,color:ov?"#dc2626":isTd?T.gold:T.muted}}>{ov?"⚠ ":isTd?"🔔 ":""}{lead.followUp.date}</span>:<span style={{color:T.muted,fontSize:13}}>—</span>}</td>
                </tr>
              );})}
              {filtered.length===0&&<tr><td colSpan={9} style={{padding:"48px 0",textAlign:"center",color:T.muted}}>Nenhum lead encontrado.</td></tr>}
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
  const [roleFilter,setRoleFilter]=useState("sdr");
  const [viewMode,setViewMode]=useState("followup");
  const sdrStages=["novo","contato","info","qualificado","naoqualif","reuniao"];
  const closerStages=["negociacao","listafria","matriculado","perdido"];
  const sdrLeads=leads.filter(l=>sdrStages.includes(l.stage));
  const closerLeads=leads.filter(l=>closerStages.includes(l.stage));
  const roleLeads=roleFilter==="sdr"?sdrLeads:closerLeads;
  const ov=roleLeads.filter(l=>l.followUp?.date&&l.followUp.date<ts).sort((a,b)=>a.followUp.date.localeCompare(b.followUp.date));
  const td=roleLeads.filter(l=>l.followUp?.date===ts);
  const up=roleLeads.filter(l=>l.followUp?.date&&l.followUp.date>ts).sort((a,b)=>a.followUp.date.localeCompare(b.followUp.date));
  const cadLeads=leads.filter(l=>sdrStages.includes(l.stage)&&l.cadenciaStep>0&&l.cadenciaStep<7);
  const cadLate=leads.filter(l=>{
    if(!sdrStages.includes(l.stage)||!l.cadenciaStep||l.cadenciaStep===0)return false;
    const cad=CADENCIA.find(c=>c.step===l.cadenciaStep);
    const nextStep=CADENCIA.find(c=>c.step===l.cadenciaStep+1);
    if(!cad||!l.cadenciaStarted)return false;
    const deadlineDay=nextStep?nextStep.day:cad.day+7;
    const deadline=new Date(new Date(l.cadenciaStarted).getTime()+(deadlineDay*24*60*60*1000));
    return new Date()>deadline;
  });

  const CadCard=({lead})=>{
    const cad=CADENCIA.find(c=>c.step===lead.cadenciaStep);
    const nextCad=CADENCIA.find(c=>c.step===lead.cadenciaStep+1);
    const started=lead.cadenciaStarted?new Date(lead.cadenciaStarted):null;
    const deadlineDay=nextCad?nextCad.day:14;
    const deadline=started?new Date(started.getTime()+(deadlineDay*24*60*60*1000)):null;
    const isLate=deadline&&new Date()>deadline;
    const daysLeft=deadline?Math.ceil((deadline-new Date())/(1000*60*60*24)):null;
    const st=STAGES.find(s=>s.id===lead.stage);
    const unit=UNITS.find(u=>u.id===lead.unit);
    return(
      <div onClick={()=>onSelect(lead)} className="c-hover"
        style={{background:T.surface,border:`1.5px solid ${isLate?"#fecaca":T.border}`,borderRadius:T.radius,padding:"14px 16px",cursor:"pointer",borderLeft:`4px solid ${isLate?"#ef4444":cad?.color||T.accent}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div><div style={{fontWeight:700,fontSize:15}}>{lead.name}</div><div style={{fontSize:12,color:T.muted,marginTop:2}}>{lead.phone} · {lead.course||"—"}</div></div>
          <div style={{display:"flex",gap:6,flexDirection:"column",alignItems:"flex-end"}}>
            {unit&&<span style={{fontSize:10,fontWeight:700,color:unit.text,background:unit.color,borderRadius:5,padding:"2px 7px"}}>{unit.label}</span>}
            <Pill color={st?.hex}>{st?.label}</Pill>
          </div>
        </div>
        <div style={{marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.muted,marginBottom:4}}>
            <span>Etapa {lead.cadenciaStep} de 7</span>
            <span style={{fontWeight:700,color:isLate?"#dc2626":cad?.color}}>{cad?.label}</span>
          </div>
          <div style={{background:T.bg,borderRadius:20,height:6,overflow:"hidden"}}>
            <div style={{width:`${(lead.cadenciaStep/7)*100}%`,height:"100%",background:isLate?"#ef4444":cad?.color,borderRadius:20,transition:"width .3s"}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:3,marginBottom:8}}>
          {CADENCIA.map(c=>(
            <div key={c.step} style={{flex:1,height:4,borderRadius:2,background:c.step<=lead.cadenciaStep?c.color:T.border}}/>
          ))}
        </div>
        {nextCad&&<div style={{background:isLate?"#fef2f2":nextCad.color+"12",border:`1px solid ${isLate?"#fecaca":nextCad.color+"30"}`,borderRadius:8,padding:"8px 10px",fontSize:12}}>
          <div style={{fontWeight:700,color:isLate?"#dc2626":nextCad.color}}>{isLate?"⚠ ATRASADO — ":"📍 Próximo: "}{nextCad.label}</div>
          <div style={{color:T.muted,marginTop:2}}>{nextCad.desc}</div>
          {deadline&&<div style={{fontSize:11,marginTop:4,fontWeight:600,color:isLate?"#dc2626":T.muted}}>{isLate?`${Math.abs(daysLeft)} dias atrasado`:`${Math.max(0,daysLeft)} dias restantes`}</div>}
        </div>}
        {!nextCad&&lead.cadenciaStep===7&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"8px 10px",fontSize:12,color:"#15803d",fontWeight:600}}>✅ Cadência completa</div>}
      </div>
    );
  };

  const Sec=({title,color,items,empty})=>(
    <div style={{marginBottom:22}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:mob?18:20,fontWeight:700,color}}>{title}</h2>
        <span style={{background:color+"18",color,borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:700}}>{items.length}</span>
      </div>
      {items.length===0?<div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:24,textAlign:"center",color:T.muted,fontSize:14}}>{empty}</div>
      :<div style={{display:"flex",flexDirection:"column",gap:10}}>
        {items.map(l=>{const st=STAGES.find(s=>s.id===l.stage),ov2=l.followUp?.date&&l.followUp.date<ts,unit=UNITS.find(u=>u.id===l.unit);return(
          <div key={l.id} className="c-hover" onClick={()=>onSelect(l)} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"14px 16px",cursor:"pointer",borderLeft:`3px solid ${color}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,flexWrap:"wrap",gap:6}}>
              <div style={{fontWeight:700,fontSize:15}}>{l.name}</div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontSize:12,fontWeight:700,color}}>{l.followUp.date}{l.followUp.time?` às ${l.followUp.time}`:""}</span>
              </div>
            </div>
            <div style={{fontSize:13,color:T.muted,marginBottom:8}}>{l.phone} · {l.course||"—"}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <Pill color={st?.hex}>{st?.label}</Pill>
                {unit&&<span style={{fontSize:11,fontWeight:700,color:unit.text,background:unit.color,border:`1px solid ${unit.border}`,borderRadius:6,padding:"2px 8px"}}>{unit.label}</span>}
              </div>
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
        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:mob?26:32,fontWeight:700,letterSpacing:"-.5px"}}>Follow-up</h1>
        <p style={{color:T.muted,fontSize:13,marginTop:4}}>Acompanhe os contatos e a cadência</p>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:4,background:T.bg,borderRadius:10,padding:4,border:`1px solid ${T.border}`}}>
          {[["followup","📅 Follow-ups"],["cadencia","🔄 Cadência"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>setViewMode(id)} className="tap"
              style={{background:viewMode===id?T.accent:"transparent",color:viewMode===id?"white":T.muted,border:"none",borderRadius:8,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .15s"}}>
              {lbl}
            </button>
          ))}
        </div>
        {viewMode==="followup"&&<div style={{display:"flex",gap:4,background:T.bg,borderRadius:10,padding:4,border:`1px solid ${T.border}`}}>
          {[["sdr","SDR"],["closer","Closer"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>setRoleFilter(id)} className="tap"
              style={{background:roleFilter===id?"#111":"transparent",color:roleFilter===id?"white":T.muted,border:"none",borderRadius:8,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .15s"}}>
              {lbl}
            </button>
          ))}
        </div>}
        {viewMode==="cadencia"&&cadLate.length>0&&(
          <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"8px 14px",fontSize:13,fontWeight:700,color:"#dc2626",display:"flex",alignItems:"center",gap:6}}>
            ⚠ {cadLate.length} lead(s) com cadência atrasada!
          </div>
        )}
      </div>
      {viewMode==="followup"&&<>
        <Sec title="Atrasados" color="#dc2626" items={ov} empty="Nenhum follow-up atrasado 🎉"/>
        <Sec title="Hoje" color={T.gold} items={td} empty="Nenhum follow-up para hoje."/>
        <Sec title="Próximos" color={T.accent} items={up} empty="Nenhum follow-up futuro agendado."/>
        {ov.length===0&&td.length===0&&up.length===0&&(
          <div style={{textAlign:"center",padding:60,color:T.muted}}>
            <div style={{fontSize:40,marginBottom:12}}>✅</div>
            <div style={{fontSize:16,fontWeight:600}}>Nenhum follow-up pendente para o {roleFilter==="sdr"?"SDR":"Closer"}!</div>
          </div>
        )}
      </>}
      {viewMode==="cadencia"&&<>
        {cadLate.length>0&&<div style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:mob?18:20,fontWeight:700,color:"#dc2626"}}>⚠ Atrasados</h2>
            <span style={{background:"#fef2f2",color:"#dc2626",borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:700}}>{cadLate.length}</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>{cadLate.map(l=><CadCard key={l.id} lead={l}/>)}</div>
        </div>}
        {cadLeads.filter(l=>!cadLate.find(x=>x.id===l.id)).length>0&&<div style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:mob?18:20,fontWeight:700,color:T.accent}}>Em andamento</h2>
            <span style={{background:T.accentLight,color:T.accent,borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:700}}>{cadLeads.filter(l=>!cadLate.find(x=>x.id===l.id)).length}</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>{cadLeads.filter(l=>!cadLate.find(x=>x.id===l.id)).map(l=><CadCard key={l.id} lead={l}/>)}</div>
        </div>}
        {cadLeads.length===0&&<div style={{textAlign:"center",padding:60,color:T.muted}}>
          <div style={{fontSize:40,marginBottom:12}}>🔄</div>
          <div style={{fontSize:16,fontWeight:600}}>Nenhum lead em cadência ativa.</div>
        </div>}
      </>}
    </div>
  );
}

/* ─── RELATÓRIOS + METAS ─────────────────────────────────────────── */
function Relatorios({leads,mob}) {
  const now = new Date();
  const [selMonth, setSelMonth] = useState(now.getMonth());
  const [selYear, setSelYear] = useState(now.getFullYear());
  const [viewMode, setViewMode] = useState("metas"); // "metas" | "month" | "evolution"

  const months = [];
  for (let i=11; i>=0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    months.push({ month: d.getMonth(), year: d.getFullYear(), label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}` });
  }

  // Metas: usa mês selecionado quando em mensal, senão mês atual
  const targetMonth = viewMode === "metas" ? now.getMonth() : selMonth;
  const targetYear  = viewMode === "metas" ? now.getFullYear() : selYear;

  const metaLeads = leads.filter(l => {
    if (l.stage !== "matriculado") return false;
    if (l.matriculaMes) {
      const [y,m] = l.matriculaMes.split("-");
      return parseInt(m)-1 === targetMonth && parseInt(y) === targetYear;
    }
    const d = new Date(l.createdAt);
    return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
  });

  const filtered = leads.filter(l => {
    if (!l.createdAt) return false;
    const d = new Date(l.createdAt);
    return d.getMonth()===selMonth && d.getFullYear()===selYear;
  });

  const matr = filtered.filter(l=>l.stage==="matriculado").length;
  const taxa = filtered.length>0 ? Math.round((matr/filtered.length)*100) : 0;
  const perdidos = filtered.filter(l=>l.stage==="perdido").length;
  const byUnit = UNITS.map(u=>({...u,total:filtered.filter(l=>l.unit===u.id).length,matr:filtered.filter(l=>l.unit===u.id&&l.stage==="matriculado").length}));
  const byOrigin = SOURCES.map(s=>({label:s,total:filtered.filter(l=>l.source===s).length,matr:filtered.filter(l=>l.source===s&&l.stage==="matriculado").length})).filter(x=>x.total>0).sort((a,b)=>b.total-a.total);
  const byCourse = COURSES.map(c=>({label:c,total:filtered.filter(l=>l.course===c).length,matr:filtered.filter(l=>l.course===c&&l.stage==="matriculado").length})).filter(x=>x.total>0).sort((a,b)=>b.total-a.total);

  const evolution = [];
  for (let i=5; i>=0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    const m = d.getMonth(), y = d.getFullYear();
    const ml = leads.filter(l=>{ if(!l.createdAt)return false; const ld=new Date(l.createdAt); return ld.getMonth()===m&&ld.getFullYear()===y; });
    evolution.push({label:MONTHS[m].slice(0,3),leads:ml.length,matr:ml.filter(l=>l.stage==="matriculado").length,taxa:ml.length>0?Math.round((ml.filter(l=>l.stage==="matriculado").length/ml.length)*100):0});
  }
  const maxLeads = Math.max(...evolution.map(e=>e.leads), 1);

  const SC=({label,value,sub,color,icon})=>(
    <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?"13px 15px":"18px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em"}}>{label}</span>
        <span style={{fontSize:17}}>{icon}</span>
      </div>
      <div style={{fontSize:mob?28:36,fontWeight:700,color,letterSpacing:"-1.5px",lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:T.muted,marginTop:4}}>{sub}</div>}
    </div>
  );

  // ─── METAS VIEW ───────────────────────────────────────────────────
  const MetasView = () => {
    return (
      <div>
        <div style={{marginBottom:20}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:mob?20:26,fontWeight:700,color:T.text}}>
            🎯 Metas de {MONTHS[now.getMonth()]} {now.getFullYear()}
          </h2>
          <p style={{color:T.muted,fontSize:13,marginTop:4}}>Acompanhamento de performance e comissões por unidade</p>
        </div>

        {UNITS.map(unit => {
          const m = METAS[unit.id];
          const unitLeads = metaLeads.filter(l => l.unit === unit.id);
          const total = unitLeads.length;
          const mensalidadeLeads = unitLeads.filter(l => l.tipoVenda === "mensalidade");
          const avistaLeads = unitLeads.filter(l => l.tipoVenda === "avista");
          const totalMensalidades = mensalidadeLeads.length;
          const totalAvista = avistaLeads.reduce((s, l) => s + (l.valorAvista || 0), 0);
          const totalMensalidadeVal = mensalidadeLeads.reduce((s, l) => s + (l.valorMensalidade || 0), 0);

          // Determine tier — super requires conditions
          const rawTier = getTierForUnit(unit.id, total);
          const superValid = rawTier === "super" && isSuperMetaValid(unit.id, totalMensalidades, totalAvista);
          const effectiveTier = rawTier === "super" && !superValid ? "ideal" : rawTier;
          const tierInfo = COMISSAO_TIERS[effectiveTier];

          const avistaOk = totalAvista >= m.avistaMin;

          // Comissão estimada
          const comissaoMensalidade = totalMensalidadeVal * tierInfo.pct;
          const comissaoAvista = totalAvista * tierInfo.pct;
          const premioAvista = avistaOk ? m.avistaPremio : 0;
          const totalComissao = comissaoMensalidade + comissaoAvista + premioAvista;

          const barPct = Math.min((total / m.super) * 100, 100);
          const barColor = effectiveTier === "super" ? "#10b981" : effectiveTier === "ideal" ? "#6366f1" : effectiveTier === "minima" ? "#f59e0b" : "#94a3b8";

          return (
            <div key={unit.id} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?16:24,marginBottom:16}}>
              {/* Header */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:12,height:12,borderRadius:"50%",background:unit.border}}/>
                  <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700}}>{unit.label}</h3>
                  <span style={{fontSize:13,fontWeight:700,color:barColor,background:barColor+"18",borderRadius:20,padding:"3px 12px"}}>
                    {effectiveTier === "super" ? "⚡ SUPER META" : effectiveTier === "ideal" ? "🎯 META IDEAL" : effectiveTier === "minima" ? "✓ META MÍNIMA" : "— ABAIXO DA MÍNIMA"}
                  </span>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:11,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em"}}>Comissão estimada</div>
                  <div style={{fontSize:28,fontWeight:800,color:"#16a34a",letterSpacing:"-1px"}}>{fmtMoney(totalComissao)}</div>
                  <div style={{fontSize:11,color:T.muted}}>{Math.round(tierInfo.pct*100)}% sobre vendas{avistaOk?` + R$ ${m.avistaPremio} bônus`:""}</div>
                </div>
              </div>

              {/* Progress bar com milestones */}
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:600,color:T.muted,marginBottom:6}}>
                  <span>{total} matrícula(s)</span>
                  <span>Meta: {m.super}+ para Super</span>
                </div>
                <div style={{position:"relative",height:14,background:"#f0f0f0",borderRadius:7,overflow:"visible",marginBottom:6}}>
                  <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${barPct}%`,background:barColor,borderRadius:7,transition:"width .5s"}}/>
                  {/* milestone markers */}
                  {[
                    {v:m.minima,color:"#f59e0b",label:"Mín"},
                    {v:m.ideal, color:"#6366f1",label:"Ideal"},
                  ].filter(mk=>mk.v<m.super).map(mk=>(
                    <div key={mk.v} title={`${mk.label}: ${mk.v}`} style={{position:"absolute",left:`${(mk.v/m.super)*100}%`,top:-4,width:3,height:22,background:mk.color,borderRadius:2,transform:"translateX(-50%)",zIndex:2}}/>
                  ))}
                </div>
                {/* tier labels */}
                <div style={{position:"relative",height:16}}>
                  {[
                    {v:m.minima,color:"#f59e0b",label:`${m.minima} mín`},
                    {v:m.ideal, color:"#6366f1",label:`${m.ideal} ideal`},
                    {v:m.super, color:"#10b981",label:`${m.super}+ super`},
                  ].map(mk=>(
                    <span key={mk.v} style={{position:"absolute",left:`${(mk.v/m.super)*100}%`,transform:"translateX(-50%)",fontSize:10,fontWeight:700,color:mk.color,whiteSpace:"nowrap"}}>{mk.label}</span>
                  ))}
                </div>
              </div>

              {/* Stats grid */}
              <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"repeat(4,1fr)",gap:10,marginBottom:16}}>
                {[
                  {label:"Total matr.",value:total,color:barColor,icon:"🏆"},
                  {label:"Mensalidades",value:`${totalMensalidades}x`,sub:fmtMoney(totalMensalidadeVal),color:"#6366f1",icon:"📅"},
                  {label:"À Vista",value:`${avistaLeads.length}x`,sub:fmtMoney(totalAvista),color:avistaOk?"#16a34a":"#ef4444",icon:"💵"},
                  {label:"Bônus à vista",value:avistaOk?`R$ ${m.avistaPremio}`:"—",sub:avistaOk?"✅ Meta atingida":`Falta ${fmtMoney(m.avistaMin-totalAvista)}`,color:avistaOk?"#16a34a":T.muted,icon:avistaOk?"🎁":"🎯"},
                ].map(sc=>(
                  <div key={sc.label} style={{background:"#f8f8f8",borderRadius:10,padding:"12px 14px"}}>
                    <div style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>{sc.icon} {sc.label}</div>
                    <div style={{fontSize:18,fontWeight:800,color:sc.color}}>{sc.value}</div>
                    {sc.sub&&<div style={{fontSize:11,color:T.muted,marginTop:2}}>{sc.sub}</div>}
                  </div>
                ))}
              </div>

              {/* Super meta requirements */}
              {rawTier === "super" && !superValid && (
                <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"12px 14px",marginBottom:12}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#92400e",marginBottom:6}}>⚠️ Condições para Super Meta não atendidas</div>
                  <div style={{fontSize:12,color:"#92400e",display:"flex",flexDirection:"column",gap:4}}>
                    <div>{totalMensalidades >= m.superMensalidadeMin ? "✅" : "❌"} Mínimo {m.superMensalidadeMin} mensalidades ({totalMensalidades} atual)</div>
                    <div>{avistaOk ? "✅" : "❌"} Meta à vista de {fmtMoney(m.avistaMin)} ({fmtMoney(totalAvista)} atual)</div>
                  </div>
                </div>
              )}

              {/* Tiers summary */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                {[
                  {tier:"minima",count:m.minima,label:"Mínima",pct:75,color:"#f59e0b"},
                  {tier:"ideal", count:m.ideal, label:"Ideal",  pct:85,color:"#6366f1"},
                  {tier:"super", count:m.super, label:"Super",  pct:95,color:"#10b981"},
                ].map(t=>(
                  <div key={t.tier} style={{background:effectiveTier===t.tier?t.color+"15":"#f8f8f8",border:`1.5px solid ${effectiveTier===t.tier?t.color:T.border}`,borderRadius:9,padding:"10px 12px",textAlign:"center",transition:"all .2s"}}>
                    <div style={{fontSize:10,fontWeight:700,color:t.color,marginBottom:2}}>{t.label}</div>
                    <div style={{fontSize:12,fontWeight:700,color:T.text}}>{t.count}+ matr.</div>
                    <div style={{fontSize:11,color:T.muted}}>{t.pct}% comissão</div>
                    {t.tier==="super"&&<div style={{fontSize:9,color:T.muted,marginTop:2}}>requer condições</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Resumo geral */}
        <div style={{background:"#111111",borderRadius:T.radius,padding:mob?16:24,color:"white"}}>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,marginBottom:16,color:"rgba(255,255,255,.9)"}}>💰 Resumo Geral — {MONTHS[now.getMonth()]}</h3>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(3,1fr)",gap:12}}>
            {UNITS.map(unit => {
              const unitLeads = metaLeads.filter(l => l.unit === unit.id);
              const total = unitLeads.length;
              const mensalidadeLeads = unitLeads.filter(l => l.tipoVenda === "mensalidade");
              const avistaLeads = unitLeads.filter(l => l.tipoVenda === "avista");
              const totalMensalidades = mensalidadeLeads.length;
              const totalAvista = avistaLeads.reduce((s,l)=>s+(l.valorAvista||0),0);
              const totalMensalidadeVal = mensalidadeLeads.reduce((s,l)=>s+(l.valorMensalidade||0),0);
              const rawTier = getTierForUnit(unit.id, total);
              const superValid = rawTier === "super" && isSuperMetaValid(unit.id, totalMensalidades, totalAvista);
              const effectiveTier = rawTier === "super" && !superValid ? "ideal" : rawTier;
              const tierInfo = COMISSAO_TIERS[effectiveTier];
              const avistaOk = totalAvista >= METAS[unit.id].avistaMin;
              const comissao = (totalMensalidadeVal + totalAvista) * tierInfo.pct + (avistaOk ? METAS[unit.id].avistaPremio : 0);
              const barColor = effectiveTier === "super" ? "#10b981" : effectiveTier === "ideal" ? "#6366f1" : effectiveTier === "minima" ? "#f59e0b" : "#475569";
              return (
                <div key={unit.id} style={{background:"rgba(255,255,255,.06)",borderRadius:10,padding:"14px 16px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.5)",marginBottom:8}}>{unit.label}</div>
                  <div style={{fontSize:22,fontWeight:800,color:"white",marginBottom:4}}>{fmtMoney(comissao)}</div>
                  <div style={{fontSize:11,fontWeight:700,color:barColor}}>{effectiveTier==="super"?"⚡ SUPER":effectiveTier==="ideal"?"🎯 IDEAL":effectiveTier==="minima"?"✓ MÍNIMA":"— ABAIXO"}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,.35)",marginTop:4}}>{total} matrículas · {Math.round(tierInfo.pct*100)}%{avistaOk?` + R$${METAS[unit.id].avistaPremio}`:""}</div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid rgba(255,255,255,.1)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:13,color:"rgba(255,255,255,.5)"}}>Total estimado</div>
            <div style={{fontSize:28,fontWeight:800,color:"#10b981"}}>
              {fmtMoney(UNITS.reduce((sum, unit) => {
                const unitLeads = metaLeads.filter(l => l.unit === unit.id);
                const total = unitLeads.length;
                const mensalidadeLeads = unitLeads.filter(l => l.tipoVenda === "mensalidade");
                const avistaLeads = unitLeads.filter(l => l.tipoVenda === "avista");
                const totalMensalidades = mensalidadeLeads.length;
                const totalAvista = avistaLeads.reduce((s,l)=>s+(l.valorAvista||0),0);
                const totalMensalidadeVal = mensalidadeLeads.reduce((s,l)=>s+(l.valorMensalidade||0),0);
                const rawTier = getTierForUnit(unit.id, total);
                const superValid = rawTier === "super" && isSuperMetaValid(unit.id, totalMensalidades, totalAvista);
                const effectiveTier = rawTier === "super" && !superValid ? "ideal" : rawTier;
                const tierInfo = COMISSAO_TIERS[effectiveTier];
                const avistaOk = totalAvista >= METAS[unit.id].avistaMin;
                return sum + (totalMensalidadeVal + totalAvista) * tierInfo.pct + (avistaOk ? METAS[unit.id].avistaPremio : 0);
              }, 0))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{animation:"fadeUp .3s"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:mob?26:32,fontWeight:700,letterSpacing:"-.5px"}}>Relatórios</h1>
          <p style={{color:T.muted,fontSize:13,marginTop:4}}>Metas, análise e performance comercial</p>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          {[["metas","🎯 Metas"],["month","📊 Mensal"],["evolution","📈 Evolução"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>setViewMode(id)} className="tap"
              style={{background:viewMode===id?T.accent:"transparent",color:viewMode===id?"white":T.muted,border:`1.5px solid ${viewMode===id?T.accent:T.border}`,borderRadius:9,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {viewMode==="metas"&&<MetasView/>}

      {viewMode==="month"&&<>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:20,WebkitOverflowScrolling:"touch"}}>
          {months.map(m=>{const on=m.month===selMonth&&m.year===selYear;return(
            <button key={`${m.month}-${m.year}`} onClick={()=>{setSelMonth(m.month);setSelYear(m.year);}} className="tap"
              style={{flexShrink:0,background:on?T.accent:"transparent",color:on?"white":T.muted,border:`1.5px solid ${on?T.accent:T.border}`,borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>
              {m.label}
            </button>
          );})}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          <SC label="Leads Novos" value={filtered.length} icon="👥" color={T.text}/>
          <SC label="Matrículas" value={matr} icon="🏆" color={T.accent} sub={`${taxa}% conversão`}/>
          <SC label="Perdidos" value={perdidos} icon="❌" color="#ef4444" sub={filtered.length>0?`${Math.round((perdidos/filtered.length)*100)}% dos leads`:""}/>
          <SC label="Em Negociação" value={filtered.filter(l=>l.stage==="negociacao").length} icon="⚡" color="#6366f1"/>
        </div>
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?16:22,marginBottom:12}}>
          <h3 style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:16}}>Por Unidade</h3>
          {byUnit.map(u=>(
            <div key={u.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:u.border,flexShrink:0}}/>
              <span style={{width:mob?100:130,fontSize:13,fontWeight:500,flexShrink:0}}>{u.label}</span>
              <div style={{flex:1,background:T.bg,borderRadius:6,height:10,overflow:"hidden"}}>
                <div style={{width:filtered.length>0?`${(u.total/filtered.length)*100}%`:"0%",height:"100%",background:u.border,borderRadius:6}}/>
              </div>
              <span style={{fontSize:12,color:T.muted,width:60,textAlign:"right",flexShrink:0}}>{u.total} leads</span>
              <span style={{fontSize:12,fontWeight:700,color:T.accent,width:40,textAlign:"right",flexShrink:0}}>{u.matr} ✓</span>
            </div>
          ))}
        </div>
        {byOrigin.length>0&&<div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?16:22,marginBottom:12}}>
          <h3 style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:16}}>Por Origem</h3>
          {byOrigin.map(o=>(
            <div key={o.label} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <span style={{width:mob?80:100,fontSize:13,flexShrink:0}}>{o.label}</span>
              <div style={{flex:1,background:T.bg,borderRadius:6,height:10,overflow:"hidden"}}>
                <div style={{width:`${(o.total/Math.max(...byOrigin.map(x=>x.total),1))*100}%`,height:"100%",background:T.accent,borderRadius:6,opacity:.7}}/>
              </div>
              <span style={{fontSize:12,color:T.muted,width:50,textAlign:"right",flexShrink:0}}>{o.total}</span>
              <span style={{fontSize:12,fontWeight:700,color:T.accent,width:36,textAlign:"right",flexShrink:0}}>{o.matr}✓</span>
            </div>
          ))}
        </div>}
        {byCourse.length>0&&<div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?16:22}}>
          <h3 style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:16}}>Por Curso</h3>
          {byCourse.map(c=>(
            <div key={c.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
              <div><div style={{fontWeight:500,fontSize:14}}>{c.label}</div><div style={{fontSize:12,color:T.muted,marginTop:2}}>{c.total} leads · {c.matr} matr.</div></div>
              <Pill color={T.accent}>{c.total>0?Math.round((c.matr/c.total)*100):0}%</Pill>
            </div>
          ))}
        </div>}
      </>}

      {viewMode==="evolution"&&<>
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?16:22,marginBottom:12}}>
          <h3 style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:20}}>Leads & Matrículas — Últimos 6 Meses</h3>
          <div style={{display:"flex",gap:mob?8:16,alignItems:"flex-end",height:160,marginBottom:12}}>
            {evolution.map((e,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{fontSize:10,fontWeight:700,color:T.accent}}>{e.matr>0?e.matr:""}</div>
                <div style={{width:"100%",display:"flex",gap:2,alignItems:"flex-end",height:120}}>
                  <div style={{flex:1,background:T.accentLight,borderRadius:"4px 4px 0 0",height:`${Math.max((e.leads/maxLeads)*100,2)}%`,transition:"height .4s",position:"relative"}}>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,background:T.accent,borderRadius:"4px 4px 0 0",height:`${e.leads>0?(e.matr/e.leads)*100:0}%`}}/>
                  </div>
                </div>
                <div style={{fontSize:10,color:T.muted,fontWeight:600}}>{e.label}</div>
                <div style={{fontSize:10,color:T.text,fontWeight:700}}>{e.leads}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:16,fontSize:11,color:T.muted}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:12,height:12,borderRadius:3,background:T.accentLight,border:`1px solid ${T.accent}`}}/> Total de leads</div>
            <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:12,height:12,borderRadius:3,background:T.accent}}/> Matrículas</div>
          </div>
        </div>
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{borderBottom:`1px solid ${T.border}`,background:T.bg}}>
              {["Mês","Leads","Matrículas","Conversão","Perdidos"].map(h=>(
                <th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {[...evolution].reverse().map((e,i)=>{
                const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
                const ml = leads.filter(l=>{ if(!l.createdAt)return false; const ld=new Date(l.createdAt); return ld.getMonth()===d.getMonth()&&ld.getFullYear()===d.getFullYear(); });
                const perd = ml.filter(l=>l.stage==="perdido").length;
                return (
                  <tr key={i} className="rw" style={{borderBottom:`1px solid ${T.border}`}}>
                    <td style={{padding:"12px 16px",fontWeight:600}}>{MONTHS[d.getMonth()]} {d.getFullYear()}</td>
                    <td style={{padding:"12px 16px"}}>{e.leads}</td>
                    <td style={{padding:"12px 16px",color:T.accent,fontWeight:700}}>{e.matr}</td>
                    <td style={{padding:"12px 16px"}}><Pill color={e.taxa>=20?"#10b981":e.taxa>=10?T.gold:"#ef4444"}>{e.taxa}%</Pill></td>
                    <td style={{padding:"12px 16px",color:"#ef4444"}}>{perd}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>}
    </div>
  );
}

/* ─── WHATSAPP TAB ───────────────────────────────────────────────── */
function WhatsAppTab({lead, mob}) {
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ loadMsgs(); const iv=setInterval(loadMsgs,10000); return()=>clearInterval(iv); },[lead.id]);

  const loadMsgs = async () => {
    const cleanPhone = lead.phone.replace(/[^0-9]/g,"").slice(-9);
    const { data } = await supabase.from("whatsapp_messages").select("*")
      .or(`lead_id.eq.${lead.id},phone.ilike.%${cleanPhone}%`)
      .order("timestamp", {ascending: true});
    setMsgs(data||[]);
    if (data && data.some(m=>!m.read&&m.direction==="in")) {
      await supabase.from("whatsapp_messages").update({read:true}).eq("lead_id", lead.id).eq("direction","in").eq("read",false);
    }
    setLoading(false);
  };

  const openWhatsApp = () => {
    const phone = lead.phone.replace(/[^0-9]/g,"");
    const num = phone.startsWith("55") ? phone : `55${phone}`;
    window.open(`https://wa.me/${num}`,"_blank");
  };

  if (loading) return <div style={{textAlign:"center",padding:32}}><Spinner/></div>;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:13,color:T.muted}}>{msgs.length} mensagens · {lead.phone}</div>
        <button onClick={openWhatsApp} className="tap"
          style={{background:"#25d366",color:"white",border:"none",borderRadius:10,padding:"8px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:6}}>
          📱 Abrir no WhatsApp
        </button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:360,overflowY:"auto",background:"#f9f9f7",borderRadius:10,padding:12}}>
        {msgs.length===0 ? (
          <div style={{textAlign:"center",color:T.muted,padding:"40px 0",fontSize:14}}>
            <div style={{fontSize:32,marginBottom:8}}>💬</div>Nenhuma mensagem ainda.
          </div>
        ) : msgs.map(m=>{
          const isOut = m.direction==="out";
          const time = new Date(m.timestamp).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
          const date = new Date(m.timestamp).toLocaleDateString("pt-BR",{day:"2-digit",month:"short"});
          return (
            <div key={m.id} style={{display:"flex",justifyContent:isOut?"flex-end":"flex-start"}}>
              <div style={{maxWidth:"75%",background:isOut?"#e85d20":"white",color:isOut?"white":"#111",borderRadius:isOut?"14px 14px 2px 14px":"14px 14px 14px 2px",padding:"9px 12px",fontSize:13,lineHeight:1.4,boxShadow:"0 1px 3px rgba(0,0,0,.1)"}}>
                <div style={{wordBreak:"break-word"}}>{m.message}</div>
                <div style={{fontSize:10,opacity:.65,marginTop:4,textAlign:"right"}}>{date} {time} {isOut?"✓✓":""}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{textAlign:"center",marginTop:12}}>
        <button onClick={loadMsgs} className="tap gh" style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 16px",fontSize:12,color:T.muted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>🔄 Atualizar</button>
      </div>
    </div>
  );
}

/* ─── LEAD MODAL ─────────────────────────────────────────────────── */
function LeadModal({lead,onUpdate,onDelete,onClose,mob}) {
  const [tab,setTab]=useState("info"),[editing,setEditing]=useState(!lead.unit);
  const [nextCadModal,setNextCadModal]=useState(null);
  const [editMatriculaModal,setEditMatriculaModal]=useState(false);
  const [form,setForm]=useState({...lead, unit:lead.unit||'', matriculaMes:lead.matriculaMes||''});
  const [hist,setHist]=useState({type:"",note:""});
  const [fu,setFu]=useState(lead.followUp||{date:"",note:"",time:""});
  const [saving,setSaving]=useState(false);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const ts=today(),st=STAGES.find(s=>s.id===lead.stage);

  const saveInfo=async()=>{setSaving(true);await supabase.from("leads").update({name:form.name,phone:form.phone,email:form.email,course:form.course,source:form.source,notes:form.notes,responsavel:form.responsavel||null,unit:form.unit||null,matricula_mes:form.matriculaMes||null}).eq("id",lead.id);onUpdate({...lead,...form,cadenciaStep:lead.cadenciaStep,cadenciaStarted:lead.cadenciaStarted});setEditing(false);setSaving(false);};
  const changeStage=async(id)=>{await supabase.from("leads").update({stage:id}).eq("id",lead.id);onUpdate({...lead,stage:id});};
  const addHist=async()=>{
    if(!hist.note.trim())return;
    const entry={id:uid(),lead_id:lead.id,type:hist.type,note:hist.note,date:new Date().toISOString()};
    await supabase.from("lead_history").insert(entry);
    const isCloserStep=CADENCIA_CLOSER.some(c=>c.step+"° "+c.label===hist.type);
    const isSDRStep=CADENCIA.some(c=>c.step+"° "+c.label===hist.type);
    if((isCloserStep||isSDRStep)&&fu.date){
      await supabase.from("leads").update({follow_up_date:fu.date,follow_up_time:fu.time||null,follow_up_note:fu.note||null}).eq("id",lead.id);
      onUpdate({...lead,followUp:{date:fu.date,time:fu.time||"",note:fu.note||""},history:[{id:entry.id,type:entry.type,note:entry.note,date:entry.date},...lead.history]});
    } else {
      onUpdate({...lead,history:[{id:entry.id,type:entry.type,note:entry.note,date:entry.date},...lead.history]});
    }
    setHist({type:"",note:""});
  };
  const saveFu=async()=>{await supabase.from("leads").update({follow_up_date:fu.date||null,follow_up_note:fu.note||null,follow_up_time:fu.time||null}).eq("id",lead.id);onUpdate({...lead,followUp:fu.date?{...fu}:null});};
  const deleteLead=async()=>{if(!window.confirm("Excluir este lead?"))return;await supabase.from("leads").delete().eq("id",lead.id);onDelete(lead.id);};

  const handleEditMatricula = async (data) => {
    await supabase.from("leads").update({
      tipo_venda: data.tipo,
      valor_mensalidade: data.tipo === "mensalidade" ? data.valorMensalidade : null,
      valor_avista: data.tipo === "avista" ? data.valorAvista : null,
    }).eq("id", lead.id);
    onUpdate({...lead, tipoVenda: data.tipo, valorMensalidade: data.tipo==="mensalidade"?data.valorMensalidade:0, valorAvista: data.tipo==="avista"?data.valorAvista:0});
    setEditMatriculaModal(false);
  };

  return (
    <Modal title={lead.name} subtitle={`${st?.label} · ${lead.course||"Curso não definido"}`} onClose={onClose} width={620} mob={mob}>
      {editMatriculaModal && (
        <MatriculaModal
          lead={lead}
          onConfirm={handleEditMatricula}
          onCancel={() => setEditMatriculaModal(false)}
          mob={mob}
        />
      )}
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
          <div>
            <span style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>Unidade</span>
            <div style={{display:"flex",gap:8}}>
              {UNITS.map(u=>(
                <button key={u.id} type="button" onClick={()=>f("unit",u.id)} className="tap"
                  style={{flex:1,background:form.unit===u.id?u.color:"transparent",border:`1.5px solid ${form.unit===u.id?u.border:T.border}`,borderRadius:10,padding:"10px 6px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",color:form.unit===u.id?u.text:T.muted,transition:"all .15s"}}>
                  {u.label}
                </button>
              ))}
            </div>
          </div>
          {lead.stage==="matriculado"&&(
            <div>
              <span style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>Mês da Matrícula</span>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {Array.from({length:12},(_,i)=>{
                  const now=new Date();
                  const d=new Date(now.getFullYear(),now.getMonth()-i,1);
                  const val=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");
                  const lbl=d.toLocaleDateString("pt-BR",{month:"short",year:"numeric"});
                  const sel=form.matriculaMes===val;
                  return(
                    <button key={val} type="button" onClick={()=>f("matriculaMes",val)} className="tap"
                      style={{background:sel?T.accent:"transparent",color:sel?"white":T.muted,border:`1.5px solid ${sel?T.accent:T.border}`,borderRadius:8,padding:"6px 10px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .15s"}}>
                      {lbl}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <Inp label="Observações" type="textarea" value={form.notes||""} onChange={e=>f("notes",e.target.value)}/>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <Btn variant="ghost" onClick={()=>setEditing(false)}>Cancelar</Btn>
            <Btn onClick={saveInfo} loading={saving} full={mob}>✓ Salvar</Btn>
          </div>
        </div>
      ):(
        <div style={{display:"grid",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["Nome",lead.name],["Telefone",lead.phone],["Email",lead.email||"—"],["Curso",lead.course||"—"],["Unidade",UNITS.find(u=>u.id===lead.unit)?.label||"—"],["Origem",lead.source||"—"],["Responsável",lead.responsavel||"—"],lead.stage==="matriculado"?["Mês da Matrícula",lead.matriculaMes?new Date(lead.matriculaMes+"-15").toLocaleDateString("pt-BR",{month:"long",year:"numeric"}):"Não definido"]:null].filter(Boolean).map(([l,v])=>(
              <div key={l} style={{background:"#f8f8f8",borderRadius:10,padding:"11px 14px"}}>
                <div style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:3}}>{l}</div>
                <div style={{fontWeight:600,fontSize:14,wordBreak:"break-word"}}>{v}</div>
              </div>
            ))}
          </div>
          {/* Matrícula info */}
          {lead.stage==="matriculado"&&(
            <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:10,padding:"12px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <div style={{fontSize:10,fontWeight:700,color:"#15803d",textTransform:"uppercase",letterSpacing:".07em"}}>💰 Matrícula</div>
                <button onClick={()=>setEditMatriculaModal(true)} className="tap gh"
                  style={{background:"transparent",border:`1px solid #86efac`,borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:700,color:"#15803d",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                  ✏ Editar
                </button>
              </div>
              {lead.tipoVenda ? (
                <div style={{fontSize:15,fontWeight:700,color:"#16a34a"}}>
                  {lead.tipoVenda==="avista"?`💵 À Vista: ${fmtMoney(lead.valorAvista)}`:`📅 Mensalidade: ${fmtMoney(lead.valorMensalidade)}/mês`}
                </div>
              ) : (
                <div style={{fontSize:13,color:"#15803d",fontStyle:"italic"}}>Nenhum valor registrado. <button onClick={()=>setEditMatriculaModal(true)} style={{background:"none",border:"none",color:T.accent,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700,padding:0}}>Registrar →</button></div>
              )}
            </div>
          )}
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
          {!["negociacao","listafria","matriculado","perdido"].includes(lead.stage)&&<div style={{marginBottom:4}}>
            <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>Cadência de contatos</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
              {CADENCIA.map(c=>{const n=`${c.step}°`;return(
                <button key={c.step} className="tap" onClick={async()=>{
                  setHist({type:"WhatsApp",note:`[${n} ${c.label}] ${c.desc}`});
                  if(c.step>=(lead.cadenciaStep||0)){
                    const now=new Date().toISOString();
                    const updates={cadencia_step:c.step};
                    if(!lead.cadenciaStarted||c.step===1)updates.cadencia_started_at=now;
                    await supabase.from("leads").update(updates).eq("id",lead.id);
                    onUpdate({...lead,cadenciaStep:c.step,cadenciaStarted:lead.cadenciaStarted||now});
                    const nextStep=CADENCIA.find(x=>x.step===c.step+1);
                    if(nextStep){
                      const base=new Date();
                      const diffDays=nextStep.day-c.day;
                      const suggested=new Date(base.getTime()+(diffDays*24*60*60*1000));
                      const suggestedDate=suggested.toISOString().split("T")[0];
                      setNextCadModal({step:nextStep.step,label:nextStep.label,desc:nextStep.desc,color:nextStep.color,suggestedDate,suggestedTime:""});
                    }
                  }
                }}
                  style={{background:c.color+"15",border:`1.5px solid ${c.color}44`,borderRadius:9,padding:"8px 6px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"left"}}>
                  <div style={{fontSize:11,fontWeight:800,color:c.color}}>{n}</div>
                  <div style={{fontSize:10,fontWeight:600,color:T.text,marginTop:2,lineHeight:1.3}}>{c.label}</div>
                </button>
              );})}
            </div>
          </div>}
          {["negociacao","listafria","matriculado","perdido"].includes(lead.stage)&&<div style={{marginBottom:4}}>
            <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>Cadência Closer</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
              {CADENCIA_CLOSER.map(c=>{const n=c.step+"°";return(
                <button key={c.step} className="tap" onClick={async()=>{
                  setHist({type:c.step+"° "+c.label,note:""});
                  const nextStep=CADENCIA_CLOSER.find(x=>x.step===c.step+1);
                  if(nextStep){
                    const nextDate=new Date(Date.now()+nextStep.hours*60*60*1000);
                    setFu({date:nextDate.toISOString().split("T")[0],note:nextStep.step+"° "+nextStep.label,time:nextDate.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})});
                  }
                }}
                  style={{background:c.color+"15",border:`1.5px solid ${c.color}44`,borderRadius:9,padding:"8px 6px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"left"}}>
                  <div style={{fontSize:11,fontWeight:800,color:c.color}}>{n}</div>
                  <div style={{fontSize:10,fontWeight:600,color:T.text,marginTop:2,lineHeight:1.3}}>{c.label}</div>
                </button>
              );})}
            </div>
          </div>}
          <div style={{display:"flex",flexDirection:mob?"column":"row",gap:10,marginBottom:16,alignItems:mob?"stretch":"flex-end"}}>
            <div style={{minWidth:180}}>
              <span style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>Etapa da Cadência</span>
              {(()=>{
                const isCloser=["negociacao","listafria","matriculado","perdido"].includes(lead.stage);
                const cadList=isCloser?CADENCIA_CLOSER:CADENCIA;
                const cadLabel=isCloser?"Cadência Closer":"Cadência SDR";
                return(
                  <select value={hist.type} onChange={async e=>{
                    const val=e.target.value;
                    setHist(p=>({...p,type:val}));
                    const SDR_HOURS=[4,20,48,48,48,168];
                    if(isCloser){
                      const step=CADENCIA_CLOSER.find(c=>c.step+"° "+c.label===val);
                      const nextStep=step?CADENCIA_CLOSER.find(c=>c.step===step.step+1):null;
                      if(nextStep){
                        const nextDate=new Date(Date.now()+nextStep.hours*60*60*1000);
                        const dateStr=nextDate.toISOString().split("T")[0];
                        const timeStr=nextDate.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
                        setFu({date:dateStr,note:nextStep.step+"° "+nextStep.label,time:timeStr});
                      }
                    } else {
                      const step=CADENCIA.find(c=>c.step+"° "+c.label===val);
                      const nextStep=step?CADENCIA.find(c=>c.step===step.step+1):null;
                      if(step&&nextStep){
                        const hrs=SDR_HOURS[step.step-1]||24;
                        const nextDate=new Date(Date.now()+hrs*60*60*1000);
                        setFu({date:nextDate.toISOString().split("T")[0],note:nextStep.step+"° "+nextStep.label,time:nextDate.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})});
                      }
                    }
                  }}
                  style={{width:"100%",background:"#f8f8f8",border:`1.5px solid ${T.border}`,borderRadius:10,padding:"11px 13px",fontSize:15,color:T.text,outline:"none",fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}>
                  <option value="">Selecione...</option>
                  <optgroup label={cadLabel}>
                    {cadList.map(c=><option key={c.step} value={c.step+"° "+c.label}>{c.step}° {c.label}</option>)}
                  </optgroup>
                  <optgroup label="Outros">
                    <option value="Ligação">📞 Ligação</option>
                    <option value="Email">📧 Email</option>
                    <option value="Reunião">🤝 Reunião</option>
                    <option value="Anotação">📝 Anotação</option>
                  </optgroup>
                </select>
                );
              })()}
            </div>
            <div style={{flex:1}}><Inp label="Nota" value={hist.note} onChange={e=>setHist(p=>({...p,note:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addHist()} placeholder="O que aconteceu?"/></div>
            <Btn onClick={addHist} full={mob}>+ Registrar</Btn>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:260,overflowY:"auto"}}>
            {lead.history.length===0?<div style={{textAlign:"center",color:T.muted,padding:32}}>Nenhum contato ainda.</div>
            :lead.history.map(h=>(
              <div key={h.id} style={{display:"flex",gap:12,background:"#f8f8f8",borderRadius:10,padding:"12px 14px"}}>
                <span style={{fontSize:20}}>{
                  h.type==="Ligação"?"📞":h.type==="Email"?"📧":h.type==="Reunião"?"🤝":h.type==="Anotação"?"📝":h.type==="WhatsApp"?"💬":h.type?.includes("Retorno")?"🤝":h.type?.includes("Dúvidas")?"❓":h.type?.includes("Promoção")?"🎁":h.type?.includes("Encerrar")?"🔚":"📌"
                }</span>
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
            <Btn variant="primary" onClick={async()=>{
              const note=`Follow-up concluído${lead.followUp?.time?` às ${lead.followUp.time}`:""}${lead.followUp?.note?` — ${lead.followUp.note}`:""}`;
              const entry={id:uid(),lead_id:lead.id,type:"Anotação",note,date:new Date().toISOString()};
              await supabase.from("lead_history").insert(entry);
              await supabase.from("leads").update({follow_up_date:null,follow_up_note:null,follow_up_time:null}).eq("id",lead.id);
              onUpdate({...lead,followUp:null,history:[{id:entry.id,type:entry.type,note:entry.note,date:entry.date},...lead.history]});
              setFu({date:"",note:"",time:""});
            }}>✅ Concluído</Btn>
            <Btn variant="gold" onClick={saveFu} full={mob}>💾 Salvar follow-up</Btn>
          </div>
        </div>
      )}
      {nextCadModal&&(
        <div onClick={e=>e.target===e.currentTarget&&setNextCadModal(null)}
          style={{position:"fixed",inset:0,background:"rgba(26,23,20,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:20,backdropFilter:"blur(4px)"}}>
          <div style={{background:"white",borderRadius:20,padding:"28px 32px",width:"100%",maxWidth:440,boxShadow:"0 8px 40px rgba(0,0,0,.2)",animation:"fadeUp .2s"}}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{width:48,height:48,borderRadius:24,background:nextCadModal.color+"20",border:`2px solid ${nextCadModal.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 12px"}}>📅</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:700,color:"#111",marginBottom:4}}>Agendar próximo contato?</div>
              <div style={{fontSize:14,color:"#888"}}>Etapa {nextCadModal.step}/7 — <strong style={{color:nextCadModal.color}}>{nextCadModal.label}</strong></div>
              <div style={{fontSize:13,color:"#aaa",marginTop:4}}>{nextCadModal.desc}</div>
            </div>
            <div style={{display:"grid",gap:12,marginBottom:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <label style={{display:"block"}}>
                  <span style={{display:"block",fontSize:11,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>Data sugerida</span>
                  <input type="date" value={nextCadModal.suggestedDate} onChange={e=>setNextCadModal(p=>({...p,suggestedDate:e.target.value}))}
                    style={{width:"100%",background:"#f8f8f8",border:"1.5px solid #e8e8e8",borderRadius:10,padding:"11px 12px",fontSize:15,color:"#111",outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
                </label>
                <label style={{display:"block"}}>
                  <span style={{display:"block",fontSize:11,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>Horário *</span>
                  <input type="time" value={nextCadModal.suggestedTime||""} onChange={e=>setNextCadModal(p=>({...p,suggestedTime:e.target.value}))}
                    style={{width:"100%",background:"#f8f8f8",border:"1.5px solid #e8e8e8",borderRadius:10,padding:"11px 12px",fontSize:15,color:"#111",outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
                </label>
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={async()=>{
                if(!nextCadModal.suggestedDate||!nextCadModal.suggestedTime){alert('Informe a data e o horário.');return;}
                await supabase.from("leads").update({follow_up_date:nextCadModal.suggestedDate,follow_up_note:`${nextCadModal.step}° ${nextCadModal.label}`,follow_up_time:nextCadModal.suggestedTime||null}).eq("id",lead.id);
                onUpdate({...lead,cadenciaStep:nextCadModal.step-1,followUp:{date:nextCadModal.suggestedDate,note:`${nextCadModal.step}° ${nextCadModal.label}`,time:nextCadModal.suggestedTime||""}});
                setNextCadModal(null);
              }} className="tap"
                style={{flex:1,background:nextCadModal.color,border:"none",borderRadius:11,padding:"12px",fontSize:14,fontWeight:700,color:"white",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:`0 4px 16px ${nextCadModal.color}44`}}>
                ✓ Confirmar agendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ─── SIMULADOR DE COMISSÕES ─────────────────────────────────────── */
function SimuladorComissoes({mob}) {
  const [simUnit, setSimUnit] = useState("pf");
  const [simMens, setSimMens] = useState(10);
  const [simValMens, setSimValMens] = useState(350);
  const [simAvistaQtd, setSimAvistaQtd] = useState(2);
  const [simValAvista, setSimValAvista] = useState(4800);

  const m = METAS[simUnit];
  const totalMatrSim = simMens + simAvistaQtd;
  const tier = getTierForUnit(simUnit, totalMatrSim);
  const tierInfo = COMISSAO_TIERS[tier];
  const totalMensVal = simMens * simValMens;
  const totalAvistaVal = simAvistaQtd * simValAvista;
  const comissaoMens = totalMensVal * tierInfo.pct;
  const bateuAvista = totalAvistaVal >= m.avistaMin;
  const premio = bateuAvista ? m.avistaPremio : 0;
  const total = comissaoMens + premio;
  const superValida = tier==="super" && isSuperMetaValid(simUnit, simMens, totalAvistaVal);
  const barColor = tier==="super"?"#10b981":tier==="ideal"?"#6366f1":tier==="minima"?"#f59e0b":"#94a3b8";
  const barW = Math.min((totalMatrSim/m.super)*100,100);

  const faixas = ["abaixo","minima","ideal","super"].map(t=>({
    t, info: COMISSAO_TIERS[t],
    matrMin: t==="abaixo"?0:t==="minima"?m.minima:t==="ideal"?m.ideal:m.super,
    comissao: totalMensVal * COMISSAO_TIERS[t].pct + (bateuAvista?m.avistaPremio:0),
  }));

  return (
    <div style={{background:"#fff",border:`1.5px solid ${barColor}44`,borderRadius:T.radius,overflow:"hidden",marginBottom:20,boxShadow:`0 4px 20px ${barColor}18`}}>
      <div style={{padding:"16px 22px",borderBottom:`1px solid ${T.border}`,background:`linear-gradient(135deg,${barColor}12,transparent)`,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:20}}>🧮</span>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700}}>Simulador de Comissões</div>
          <div style={{fontSize:12,color:T.muted,marginTop:1}}>Simule diferentes cenários e veja o impacto na comissão</div>
        </div>
      </div>
      <div style={{padding:mob?"16px":"20px 24px",display:"grid",gap:20}}>
        {/* Seletor de unidade */}
        <div>
          <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>Unidade</div>
          <div style={{display:"flex",gap:8}}>
            {UNITS.map(u=>(
              <button key={u.id} type="button" onClick={()=>setSimUnit(u.id)} className="tap"
                style={{flex:1,background:simUnit===u.id?u.color:"transparent",border:`1.5px solid ${simUnit===u.id?u.border:T.border}`,borderRadius:10,padding:"10px 8px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",color:simUnit===u.id?u.text:T.muted,transition:"all .15s"}}>
                {u.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
          {/* Mensalidades */}
          <div style={{background:"#eff6ff",border:"1.5px solid #bfdbfe",borderRadius:12,padding:"16px"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#1d4ed8",marginBottom:12}}>📅 Mensalidades</div>
            <div style={{display:"grid",gap:12}}>
              <label>
                <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:6}}>
                  Quantidade: <span style={{color:"#1d4ed8",fontSize:14}}>{simMens}</span>
                </div>
                <input type="range" min={0} max={30} value={simMens} onChange={e=>setSimMens(Number(e.target.value))} style={{width:"100%",accentColor:"#3b82f6",cursor:"pointer"}}/>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.muted,marginTop:2}}><span>0</span><span>30</span></div>
              </label>
              <label>
                <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:6}}>
                  Valor médio: <span style={{color:"#1d4ed8",fontSize:14}}>R$ {simValMens}</span>
                </div>
                <input type="range" min={200} max={1000} step={50} value={simValMens} onChange={e=>setSimValMens(Number(e.target.value))} style={{width:"100%",accentColor:"#3b82f6",cursor:"pointer"}}/>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.muted,marginTop:2}}><span>R$200</span><span>R$1000</span></div>
              </label>
              <div style={{background:"white",borderRadius:8,padding:"8px 12px",fontSize:13}}>
                <span style={{color:T.muted}}>Receita mensal: </span>
                <span style={{fontWeight:700,color:"#1d4ed8"}}>{fmtMoney(totalMensVal)}</span>
              </div>
            </div>
          </div>
          {/* À vista */}
          <div style={{background:"#fefce8",border:"1.5px solid #fde68a",borderRadius:12,padding:"16px"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#92400e",marginBottom:12}}>💵 À Vista</div>
            <div style={{display:"grid",gap:12}}>
              <label>
                <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:6}}>
                  Quantidade: <span style={{color:"#92400e",fontSize:14}}>{simAvistaQtd}</span>
                </div>
                <input type="range" min={0} max={15} value={simAvistaQtd} onChange={e=>setSimAvistaQtd(Number(e.target.value))} style={{width:"100%",accentColor:"#f59e0b",cursor:"pointer"}}/>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.muted,marginTop:2}}><span>0</span><span>15</span></div>
              </label>
              <label>
                <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:6}}>
                  Ticket médio: <span style={{color:"#92400e",fontSize:14}}>R$ {simValAvista}</span>
                </div>
                <input type="range" min={1000} max={15000} step={200} value={simValAvista} onChange={e=>setSimValAvista(Number(e.target.value))} style={{width:"100%",accentColor:"#f59e0b",cursor:"pointer"}}/>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.muted,marginTop:2}}><span>R$1k</span><span>R$15k</span></div>
              </label>
              <div style={{background:"white",borderRadius:8,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:11,color:T.muted}}>Total à vista: <span style={{fontWeight:700,color:"#92400e"}}>{fmtMoney(totalAvistaVal)}</span></div>
                  <div style={{fontSize:11,color:T.muted}}>Meta: {fmtMoney(m.avistaMin)}</div>
                </div>
                <span style={{fontSize:18}}>{bateuAvista?"✅":"⏳"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resultado */}
        <div style={{background:`linear-gradient(135deg,${barColor}18,${barColor}08)`,border:`2px solid ${barColor}44`,borderRadius:14,padding:"20px 24px"}}>
          <div style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:13,fontWeight:700,color:barColor}}>{totalMatrSim} matrículas totais</span>
              <span style={{fontSize:12,color:T.muted}}>{barW.toFixed(0)}% da super</span>
            </div>
            <div style={{position:"relative",height:10,background:"rgba(0,0,0,.06)",borderRadius:5}}>
              <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${barW}%`,background:barColor,borderRadius:5,transition:"width .3s ease"}}/>
              {[(m.minima/m.super)*100,(m.ideal/m.super)*100].map((pos,i)=>(
                <div key={i} style={{position:"absolute",left:`${pos}%`,top:-3,width:2,height:16,background:i===0?"#f59e0b":"#6366f1",borderRadius:1,transform:"translateX(-50%)"}}/>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.muted,marginTop:4}}>
              <span>Mín {m.minima}</span><span>Ideal {m.ideal}</span><span>Super {m.super}+</span>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,flexWrap:"wrap"}}>
            <div style={{background:tierInfo.color+"22",border:`1.5px solid ${tierInfo.color}44`,borderRadius:20,padding:"6px 16px",fontSize:13,fontWeight:700,color:tierInfo.color}}>
              {tier==="super"&&superValida?"🚀 Super Meta":tier==="super"?"⚠ Super (inválida)":tier==="ideal"?"⭐ Meta Ideal":tier==="minima"?"✅ Meta Mínima":"— Abaixo da Mínima"}
            </div>
            <div style={{background:"rgba(0,0,0,.05)",borderRadius:20,padding:"6px 14px",fontSize:13,fontWeight:700,color:T.muted}}>{(tierInfo.pct*100).toFixed(0)}% de comissão</div>
            {bateuAvista&&<div style={{background:"#dcfce7",border:"1px solid #86efac",borderRadius:20,padding:"6px 14px",fontSize:13,fontWeight:700,color:"#15803d"}}>💰 +{fmtMoney(m.avistaPremio)} prêmio</div>}
          </div>
          <div style={{display:"grid",gap:6,marginBottom:16}}>
            {[
              {label:`${simMens} mensalidades × R$${simValMens} × ${(tierInfo.pct*100).toFixed(0)}%`, value:comissaoMens, color:barColor},
              {label:`Prêmio à vista ${bateuAvista?"✅":"⏳ (faltam "+fmtMoney(Math.max(0,m.avistaMin-totalAvistaVal))+")"}`, value:premio, color:"#10b981"},
            ].map((row,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"6px 0",borderBottom:`1px solid rgba(0,0,0,.06)`}}>
                <span style={{color:T.muted}}>{row.label}</span>
                <span style={{fontWeight:700,color:row.value>0?row.color:T.muted}}>{fmtMoney(row.value)}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:15,fontWeight:700}}>💰 Comissão Total</span>
            <span style={{fontSize:mob?28:36,fontWeight:800,color:barColor,letterSpacing:"-1px"}}>{fmtMoney(total)}</span>
          </div>
        </div>

        {/* Tabela "e se?" */}
        <div>
          <div style={{fontSize:12,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>E se você batesse cada faixa com esses valores?</div>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"repeat(4,1fr)",gap:8}}>
            {faixas.map(f=>{
              const isActive = f.t===tier;
              const faltamFaixa = Math.max(0, f.matrMin - totalMatrSim);
              return (
                <div key={f.t} style={{background:isActive?f.info.color+"18":"#f8fafc",border:`1.5px solid ${isActive?f.info.color:T.border}`,borderRadius:12,padding:"12px",textAlign:"center",transition:"all .15s"}}>
                  <div style={{fontSize:11,fontWeight:700,color:isActive?f.info.color:T.muted,marginBottom:4}}>{f.info.label}</div>
                  <div style={{fontSize:11,color:T.muted,marginBottom:6}}>{f.t==="abaixo"?"< "+m.minima:f.matrMin+"+"} matr.</div>
                  <div style={{fontSize:mob?16:20,fontWeight:800,color:isActive?f.info.color:T.muted}}>{fmtMoney(f.comissao)}</div>
                  {faltamFaixa>0&&<div style={{fontSize:10,color:T.muted,marginTop:4}}>+{faltamFaixa} matr.</div>}
                  {isActive&&<div style={{fontSize:9,fontWeight:800,color:f.info.color,marginTop:4,textTransform:"uppercase"}}>← você está aqui</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Aviso super inválida */}
        {tier==="super"&&!superValida&&(
          <div style={{background:"#fffbeb",border:"1.5px solid #fde68a",borderRadius:10,padding:"12px 16px",fontSize:13}}>
            <div style={{fontWeight:700,color:"#92400e",marginBottom:4}}>⚠ Super Meta não válida ainda</div>
            <div style={{color:T.muted,display:"flex",flexDirection:"column",gap:2}}>
              {simMens < m.superMensalidadeMin && <span>• Faltam {m.superMensalidadeMin - simMens} mensalidades (mín. {m.superMensalidadeMin})</span>}
              {!bateuAvista && <span>• Faltam {fmtMoney(m.avistaMin - totalAvistaVal)} em vendas à vista</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── PAINEL METAS ───────────────────────────────────────────────── */
function PainelMetas({leads, mob}) {
  const now = new Date();
  const [selMonth, setSelMonth] = useState(now.getMonth());
  const [selYear,  setSelYear]  = useState(now.getFullYear());
  const [openUnit, setOpenUnit] = useState(null); // id da unidade expandida

  // Meses disponíveis (últimos 6)
  const monthOptions = Array.from({length:6},(_,i)=>{
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    return { month: d.getMonth(), year: d.getFullYear(), label: `${MONTHS[d.getMonth()].slice(0,3)} ${d.getFullYear()}` };
  });

  const diasNoMes = new Date(selYear, selMonth+1, 0).getDate();
  const diaAtual  = (selMonth === now.getMonth() && selYear === now.getFullYear()) ? now.getDate() : diasNoMes;
  const percMes   = Math.min((diaAtual / diasNoMes) * 100, 100);

  // Leads matriculados no mês selecionado por unidade
  const getMatrMes = (unitId) => leads.filter(l => {
    if (l.stage !== "matriculado") return false;
    if (l.unit !== unitId) return false;
    if (l.matriculaMes) {
      const [y,m] = l.matriculaMes.split("-");
      return parseInt(m)-1 === selMonth && parseInt(y) === selYear;
    }
    const d = new Date(l.createdAt);
    return d.getMonth() === selMonth && d.getFullYear() === selYear;
  });

  // Dados consolidados por unidade
  const unitsData = UNITS.map(u => {
    const matrLeads   = getMatrMes(u.id);
    const m           = METAS[u.id];
    const count       = matrLeads.length;
    const mensLeads   = matrLeads.filter(l => l.tipoVenda === "mensalidade");
    const avistaLeads = matrLeads.filter(l => l.tipoVenda === "avista");
    const totalMensVal  = mensLeads.reduce((s,l) => s+(l.valorMensalidade||0), 0);
    const totalAvistaVal= avistaLeads.reduce((s,l) => s+(l.valorAvista||0), 0);
    const tier        = getTierForUnit(u.id, count);
    const tierInfo    = COMISSAO_TIERS[tier];
    const superValida = tier === "super" && isSuperMetaValid(u.id, mensLeads.length, totalAvistaVal);
    const comissaoBase= totalMensVal * tierInfo.pct;
    const premioPago  = totalAvistaVal >= m.avistaMin ? m.avistaPremio : 0;
    const comissaoTotal = comissaoBase + premioPago;

    // Projeção: ritmo atual → extrapolado pro fim do mês
    const ritmo         = diaAtual > 0 ? count / diaAtual : 0;
    const projecaoFim   = Math.round(ritmo * diasNoMes);
    const projecaoTier  = getTierForUnit(u.id, projecaoFim);
    const projecaoTierInfo = COMISSAO_TIERS[projecaoTier];
    // Faltam X pra próximo tier
    const nextTierCount = tier==="abaixo"?m.minima : tier==="minima"?m.ideal : tier==="ideal"?m.super : null;
    const faltamNext    = nextTierCount ? Math.max(0, nextTierCount - count) : 0;
    // Dias restantes no mês
    const diasRestantes = diasNoMes - diaAtual;
    // Ritmo necessário pra bater próximo tier
    const ritmoNecessario = faltamNext > 0 && diasRestantes > 0 ? (faltamNext / diasRestantes).toFixed(1) : null;

    // Histórico últimos 3 meses p/ sparkline
    const historico = Array.from({length:3},(_,i)=>{
      const d = new Date(selYear, selMonth-1-i, 1);
      const cnt = leads.filter(l => {
        if(l.stage!=="matriculado"||l.unit!==u.id) return false;
        if(l.matriculaMes){const[y,mo]=l.matriculaMes.split("-");return parseInt(mo)-1===d.getMonth()&&parseInt(y)===d.getFullYear();}
        const ld=new Date(l.createdAt);return ld.getMonth()===d.getMonth()&&ld.getFullYear()===d.getFullYear();
      }).length;
      return { label: MONTHS[d.getMonth()].slice(0,3), count: cnt };
    }).reverse();

    return { ...u, m, count, mensLeads, avistaLeads, totalMensVal, totalAvistaVal,
      tier, tierInfo, superValida, comissaoBase, premioPago, comissaoTotal,
      projecaoFim, projecaoTier, projecaoTierInfo, faltamNext, nextTierCount,
      diasRestantes, ritmoNecessario, historico };
  });

  // Totais gerais
  const totalMatr     = unitsData.reduce((s,u)=>s+u.count, 0);
  const totalComissao = unitsData.reduce((s,u)=>s+u.comissaoTotal, 0);
  const totalPremio   = unitsData.reduce((s,u)=>s+u.premioPago, 0);
  const totalAvista   = unitsData.reduce((s,u)=>s+u.totalAvistaVal, 0);

  const isCurMonth = selMonth===now.getMonth()&&selYear===now.getFullYear();

  const tierBadge = (tier, superValida) => {
    const map = {
      abaixo: { label:"Abaixo da Mínima", bg:"#f1f5f9", color:"#64748b", icon:"—" },
      minima: { label:"Meta Mínima ✅",    bg:"#fefce8", color:"#a16207", icon:"🟡" },
      ideal:  { label:"Meta Ideal ⭐",     bg:"#eff6ff", color:"#1d4ed8", icon:"🔵" },
      super:  { label: superValida ? "Super Meta 🚀" : "Super (inválida) ⚠", bg: superValida?"#f0fdf4":"#fffbeb", color: superValida?"#15803d":"#92400e", icon: superValida?"🟢":"🟠" },
    };
    return map[tier] || map.abaixo;
  };

  const UnitCard = ({u}) => {
    const badge = tierBadge(u.tier, u.superValida);
    const isOpen = openUnit === u.id;
    const barW = Math.min((u.count / u.m.super)*100, 100);
    const markerMin = (u.m.minima/u.m.super)*100;
    const markerIdeal = (u.m.ideal/u.m.super)*100;
    const barColor = u.tier==="super"?"#10b981":u.tier==="ideal"?"#6366f1":u.tier==="minima"?"#f59e0b":"#94a3b8";

    return (
      <div style={{background:"#fff",border:`1.5px solid ${u.tier==="abaixo"?T.border:barColor+"44"}`,borderRadius:16,overflow:"hidden",boxShadow:isOpen?"0 8px 32px rgba(0,0,0,.08)":"0 2px 8px rgba(0,0,0,.04)",transition:"all .2s"}}>
        {/* Header clicável */}
        <div onClick={()=>setOpenUnit(isOpen?null:u.id)} style={{padding:mob?"16px":"20px 24px",cursor:"pointer",borderLeft:`4px solid ${barColor}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:mob?18:22,fontWeight:700,color:T.text}}>{u.label}</div>
              <div style={{display:"inline-flex",alignItems:"center",gap:5,background:badge.bg,color:badge.color,borderRadius:20,padding:"3px 12px",fontSize:12,fontWeight:700,marginTop:4}}>
                {badge.icon} {badge.label}
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:mob?36:44,fontWeight:800,color:barColor,lineHeight:1,letterSpacing:"-2px"}}>{u.count}</div>
              <div style={{fontSize:12,color:T.muted,marginTop:2}}>de {u.m.super}+ (super)</div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div style={{position:"relative",height:12,background:"#f1f5f9",borderRadius:6,marginBottom:8}}>
            <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${barW}%`,background:`linear-gradient(90deg,${barColor}99,${barColor})`,borderRadius:6,transition:"width .5s ease"}}/>
            {[{pos:markerMin,label:u.m.minima,color:"#f59e0b"},{pos:markerIdeal,label:u.m.ideal,color:"#6366f1"}].map((mk,i)=>(
              <div key={i}>
                <div style={{position:"absolute",left:`${mk.pos}%`,top:-3,width:2,height:18,background:mk.color,borderRadius:1,transform:"translateX(-50%)"}}/>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.muted}}>
            <span style={{color:u.count>=u.m.minima?"#a16207":T.muted,fontWeight:u.count>=u.m.minima?700:400}}>Mín {u.m.minima}</span>
            <span style={{color:u.count>=u.m.ideal?"#1d4ed8":T.muted,fontWeight:u.count>=u.m.ideal?700:400}}>Ideal {u.m.ideal}</span>
            <span style={{color:u.count>=u.m.super?"#15803d":T.muted,fontWeight:u.count>=u.m.super?700:400}}>Super {u.m.super}+</span>
          </div>

          {/* Resumo rápido */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:12}}>
            {[
              {label:"Comissão",value:fmtMoney(u.comissaoTotal),color:barColor},
              {label:"À Vista",value:fmtMoney(u.totalAvistaVal),color:u.totalAvistaVal>=u.m.avistaMin?"#10b981":"#f59e0b"},
              {label:"Projeção",value:`${u.projecaoFim} matr.`,color:COMISSAO_TIERS[u.projecaoTier]?.color||"#94a3b8"},
            ].map(s=>(
              <div key={s.label} style={{background:"#f8fafc",borderRadius:10,padding:"8px 10px",textAlign:"center"}}>
                <div style={{fontSize:10,color:T.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>{s.label}</div>
                <div style={{fontSize:13,fontWeight:800,color:s.color}}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Detalhes expandidos */}
        {isOpen && (
          <div style={{borderTop:`1px solid ${T.border}`,padding:mob?"16px":"20px 24px",display:"grid",gap:20,background:"#fafafa"}}>

            {/* Faixas de comissão */}
            <div>
              <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:12}}>Faixas de Comissão</div>
              <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"repeat(4,1fr)",gap:8}}>
                {Object.entries(COMISSAO_TIERS).map(([key,t])=>{
                  const isActive = u.tier===key;
                  const cnt = key==="abaixo"?`< ${u.m.minima}`:key==="minima"?`${u.m.minima}–${u.m.ideal-1}`:key==="ideal"?`${u.m.ideal}–${u.m.super-1}`:`${u.m.super}+`;
                  return (
                    <div key={key} style={{background:isActive?t.color+"18":"#fff",border:`1.5px solid ${isActive?t.color:T.border}`,borderRadius:12,padding:"12px 10px",textAlign:"center",transition:"all .15s"}}>
                      <div style={{fontSize:22,fontWeight:800,color:isActive?t.color:T.muted}}>{t.pct>0?`${(t.pct*100).toFixed(0)}%`:"—"}</div>
                      <div style={{fontSize:11,fontWeight:700,color:isActive?t.color:T.muted,marginTop:2}}>{t.label}</div>
                      <div style={{fontSize:10,color:T.muted,marginTop:2}}>{cnt} matr.</div>
                      {isActive&&<div style={{fontSize:9,fontWeight:800,color:t.color,marginTop:4,textTransform:"uppercase",letterSpacing:".06em"}}>← ATUAL</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comissão detalhada */}
            <div style={{background:"#fff",border:`1px solid ${T.border}`,borderRadius:12,padding:"16px"}}>
              <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:12}}>Cálculo da Comissão</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:14}}>
                  <span style={{color:T.muted}}>Mensalidades ({u.mensLeads.length} × {(u.tierInfo.pct*100).toFixed(0)}%)</span>
                  <span style={{fontWeight:700}}>{fmtMoney(u.comissaoBase)}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:14}}>
                  <span style={{color:T.muted}}>Prêmio à vista {u.totalAvistaVal>=u.m.avistaMin?"✅":"⏳"}</span>
                  <span style={{fontWeight:700,color:u.premioPago>0?"#10b981":T.muted}}>{u.premioPago>0?`+ ${fmtMoney(u.premioPago)}`:"R$ 0"}</span>
                </div>
                <div style={{borderTop:`1px solid ${T.border}`,paddingTop:8,display:"flex",justifyContent:"space-between",fontSize:16}}>
                  <span style={{fontWeight:700}}>Total estimado</span>
                  <span style={{fontWeight:800,color:barColor,fontSize:20}}>{fmtMoney(u.comissaoTotal)}</span>
                </div>
              </div>
            </div>

            {/* Meta à Vista */}
            <div style={{background:"#fff",border:`1px solid ${T.border}`,borderRadius:12,padding:"16px"}}>
              <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:12}}>Meta À Vista — Prêmio {fmtMoney(u.m.avistaPremio)}</div>
              <div style={{position:"relative",height:10,background:"#f1f5f9",borderRadius:5,marginBottom:8}}>
                <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${Math.min((u.totalAvistaVal/u.m.avistaMin)*100,100)}%`,background:u.totalAvistaVal>=u.m.avistaMin?"#10b981":"#f59e0b",borderRadius:5,transition:"width .5s"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                <div>
                  <span style={{fontWeight:700,color:u.totalAvistaVal>=u.m.avistaMin?"#10b981":"#f59e0b"}}>{fmtMoney(u.totalAvistaVal)}</span>
                  <span style={{color:T.muted}}> / {fmtMoney(u.m.avistaMin)}</span>
                </div>
                {u.totalAvistaVal>=u.m.avistaMin
                  ? <span style={{fontWeight:700,color:"#10b981"}}>✅ Meta batida! +{fmtMoney(u.m.avistaPremio)}</span>
                  : <span style={{color:T.muted}}>Faltam {fmtMoney(u.m.avistaMin-u.totalAvistaVal)}</span>
                }
              </div>
              {/* Vendas à vista listadas */}
              {u.avistaLeads.length>0&&(
                <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:6}}>
                  {u.avistaLeads.map(l=>(
                    <div key={l.id} style={{display:"flex",justifyContent:"space-between",fontSize:12,background:"#f0fdf4",borderRadius:8,padding:"6px 10px"}}>
                      <span style={{fontWeight:600}}>{l.name}</span>
                      <span style={{fontWeight:700,color:"#10b981"}}>{fmtMoney(l.valorAvista)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Super Meta validação */}
            <div style={{background:u.superValida?"#f0fdf4":u.tier==="super"?"#fffbeb":"#fff",border:`1px solid ${u.superValida?"#86efac":u.tier==="super"?"#fde68a":T.border}`,borderRadius:12,padding:"16px"}}>
              <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Requisitos Super Meta</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  { label:`Matrículas (${u.m.super}+)`, ok: u.count>=u.m.super, atual: u.count, meta: u.m.super },
                  { label:`Mensalidades mín. (${u.m.superMensalidadeMin})`, ok: u.mensLeads.length>=u.m.superMensalidadeMin, atual: u.mensLeads.length, meta: u.m.superMensalidadeMin },
                  { label:`Meta à vista (${fmtMoney(u.m.avistaMin)})`, ok: u.totalAvistaVal>=u.m.avistaMin, atual: fmtMoney(u.totalAvistaVal), meta: fmtMoney(u.m.avistaMin) },
                ].map(req=>(
                  <div key={req.label} style={{display:"flex",alignItems:"center",gap:10,background:req.ok?"#dcfce7":"#f8fafc",borderRadius:8,padding:"8px 12px"}}>
                    <span style={{fontSize:16}}>{req.ok?"✅":"⏳"}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:req.ok?"#15803d":T.text}}>{req.label}</div>
                      <div style={{fontSize:11,color:T.muted}}>{req.atual} / {req.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projeção */}
            {isCurMonth&&(
              <div style={{background:"#fff",border:`1px solid ${T.border}`,borderRadius:12,padding:"16px"}}>
                <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:12}}>Projeção do Mês</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                  <div style={{background:"#f8fafc",borderRadius:10,padding:"12px",textAlign:"center"}}>
                    <div style={{fontSize:10,color:T.muted,fontWeight:600,textTransform:"uppercase",marginBottom:4}}>Ritmo atual</div>
                    <div style={{fontSize:22,fontWeight:800,color:T.text}}>{(u.count/Math.max(diaAtual,1)*30).toFixed(1)}</div>
                    <div style={{fontSize:11,color:T.muted}}>matr/mês (proj.)</div>
                  </div>
                  <div style={{background:COMISSAO_TIERS[u.projecaoTier]?.color+"18"||"#f8fafc",border:`1.5px solid ${COMISSAO_TIERS[u.projecaoTier]?.color+"44"||T.border}`,borderRadius:10,padding:"12px",textAlign:"center"}}>
                    <div style={{fontSize:10,color:T.muted,fontWeight:600,textTransform:"uppercase",marginBottom:4}}>Projeção fim mês</div>
                    <div style={{fontSize:22,fontWeight:800,color:COMISSAO_TIERS[u.projecaoTier]?.color||T.text}}>{u.projecaoFim}</div>
                    <div style={{fontSize:11,color:COMISSAO_TIERS[u.projecaoTier]?.color||T.muted,fontWeight:600}}>{COMISSAO_TIERS[u.projecaoTier]?.label}</div>
                  </div>
                </div>
                {u.faltamNext>0&&(
                  <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:10,padding:"10px 14px",fontSize:13}}>
                    <span style={{fontWeight:700,color:"#ea580c"}}>🎯 Faltam {u.faltamNext} matrículas</span>
                    <span style={{color:T.muted}}> para {u.nextTierCount===u.m.minima?"Meta Mínima":u.nextTierCount===u.m.ideal?"Meta Ideal":"Super Meta"}</span>
                    {u.ritmoNecessario&&<div style={{fontSize:11,color:T.muted,marginTop:3}}>Precisa de ~{u.ritmoNecessario} matr/dia nos próximos {u.diasRestantes} dias</div>}
                  </div>
                )}
                {/* Sparkline histórico */}
                {u.historico.length>0&&(
                  <div style={{marginTop:12}}>
                    <div style={{fontSize:11,color:T.muted,fontWeight:600,marginBottom:8}}>Últimos 3 meses</div>
                    <div style={{display:"flex",gap:8,alignItems:"flex-end",height:60}}>
                      {u.historico.map((h,i)=>{
                        const maxH = Math.max(...u.historico.map(x=>x.count), u.m.super, 1);
                        const hPct = (h.count/maxH)*100;
                        const hTier = getTierForUnit(u.id, h.count);
                        const hColor = COMISSAO_TIERS[hTier]?.color||"#94a3b8";
                        return (
                          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                            <div style={{fontSize:11,fontWeight:700,color:hColor}}>{h.count}</div>
                            <div style={{width:"100%",background:hColor,borderRadius:"4px 4px 0 0",height:`${Math.max(hPct,4)}%`,transition:"height .4s"}}/>
                            <div style={{fontSize:10,color:T.muted}}>{h.label}</div>
                          </div>
                        );
                      })}
                      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                        <div style={{fontSize:11,fontWeight:700,color:barColor}}>{u.count}</div>
                        <div style={{width:"100%",background:barColor,borderRadius:"4px 4px 0 0",height:`${Math.max(barW,4)}%`,opacity:.7,position:"relative"}}>
                          <div style={{position:"absolute",top:-1,left:0,right:0,height:2,background:barColor,borderRadius:1,animation:"pulseGold 1.5s infinite"}}/>
                        </div>
                        <div style={{fontSize:10,fontWeight:700,color:barColor}}>{MONTHS[selMonth].slice(0,3)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Lista de matriculados do mês */}
            {u.mensLeads.length+u.avistaLeads.length>0&&(
              <div>
                <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Matrículas do Mês ({u.count})</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {[...u.mensLeads,...u.avistaLeads].map(l=>(
                    <div key={l.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fff",border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px"}}>
                      <div>
                        <div style={{fontWeight:600,fontSize:13}}>{l.name}</div>
                        <div style={{fontSize:11,color:T.muted}}>{l.course||"—"} · {l.responsavel||"—"}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontWeight:700,fontSize:13,color:l.tipoVenda==="avista"?"#10b981":"#6366f1"}}>
                          {l.tipoVenda==="avista"?"💵":"📅"} {fmtMoney(l.tipoVenda==="avista"?l.valorAvista:l.valorMensalidade)}
                        </div>
                        <div style={{fontSize:10,color:T.muted}}>{l.tipoVenda==="avista"?"À Vista":"Mensalidade"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{animation:"fadeUp .3s"}}>
      {/* Header */}
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:mob?"flex-start":"center",gap:16,flexDirection:mob?"column":"row",flexWrap:"wrap"}}>
          <div>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:mob?26:34,fontWeight:700,letterSpacing:"-.5px"}}>🏆 Painel de Metas</h1>
            <p style={{color:T.muted,fontSize:13,marginTop:4}}>Acompanhe metas, comissões e projeções por unidade</p>
          </div>
          <div style={{background:"linear-gradient(135deg,#fefce8,#fff7ed)",border:"1.5px solid #fde68a",borderRadius:12,padding:"10px 16px",maxWidth:340}}>
            <p style={{fontSize:13,fontWeight:600,color:"#92400e",fontStyle:"italic",margin:0,lineHeight:1.4}}>
              💬 "Dinheiro não traz felicidade, mas comissão ajuda bastante."
            </p>
          </div>
        </div>
      </div>

      {/* Seletor de mês */}
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:20,WebkitOverflowScrolling:"touch"}}>
        {monthOptions.map(mo=>{
          const on = mo.month===selMonth&&mo.year===selYear;
          return (
            <button key={`${mo.month}-${mo.year}`} onClick={()=>{setSelMonth(mo.month);setSelYear(mo.year);setOpenUnit(null);}} className="tap"
              style={{flexShrink:0,background:on?T.accent:"transparent",color:on?"white":T.muted,border:`1.5px solid ${on?T.accent:T.border}`,borderRadius:20,padding:"6px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>
              {mo.label}{on&&isCurMonth?" 🔴":""}
            </button>
          );
        })}
      </div>

      {/* Progresso do mês */}
      {isCurMonth&&(
        <div style={{background:"#fff",border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?"14px 16px":"16px 22px",marginBottom:16,display:"flex",alignItems:"center",gap:16}}>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:T.muted,fontWeight:600,marginBottom:6}}>Progresso do mês — Dia {diaAtual} de {diasNoMes}</div>
            <div style={{position:"relative",height:8,background:"#f1f5f9",borderRadius:4}}>
              <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${percMes}%`,background:"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:4}}/>
            </div>
          </div>
          <div style={{fontSize:22,fontWeight:800,color:"#6366f1",flexShrink:0}}>{Math.round(percMes)}%</div>
        </div>
      )}

      {/* Cards de resumo geral */}
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"repeat(4,1fr)",gap:10,marginBottom:20}}>
        {[
          {label:"Total Matrículas",value:totalMatr,icon:"🎓",color:T.accent},
          {label:"Comissão Total",  value:fmtMoney(totalComissao),icon:"💰",color:"#10b981"},
          {label:"Prêmios À Vista", value:fmtMoney(totalPremio),icon:"🏅",color:"#f59e0b"},
          {label:"Receita À Vista", value:fmtMoney(totalAvista),icon:"💵",color:"#6366f1"},
        ].map(s=>(
          <div key={s.label} style={{background:"#fff",border:`1px solid ${T.border}`,borderRadius:T.radius,padding:mob?"12px 14px":"16px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em"}}>{s.label}</span>
              <span style={{fontSize:16}}>{s.icon}</span>
            </div>
            <div style={{fontSize:mob?20:26,fontWeight:800,color:s.color,letterSpacing:"-1px"}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── TABELA DE REGRAS ── */}
      <div style={{background:"#fff",border:`1px solid ${T.border}`,borderRadius:T.radius,overflow:"hidden",marginBottom:20}}>
        <div style={{padding:"16px 22px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}>📋</span>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700}}>Regras das Metas</div>
            <div style={{fontSize:12,color:T.muted,marginTop:1}}>Referência completa de faixas, comissões e prêmios</div>
          </div>
        </div>
        <div style={{overflowX:"auto"}}>
          {/* Tabela de faixas por unidade */}
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:"#f8fafc"}}>
                <th style={{padding:"10px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",borderBottom:`1px solid ${T.border}`}}>Faixa</th>
                {UNITS.map(u=>(
                  <th key={u.id} style={{padding:"10px 16px",textAlign:"center",fontSize:11,fontWeight:700,color:u.text,textTransform:"uppercase",letterSpacing:".07em",borderBottom:`1px solid ${T.border}`,background:u.color}}>{u.label}</th>
                ))}
                <th style={{padding:"10px 16px",textAlign:"center",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",borderBottom:`1px solid ${T.border}`}}>Comissão</th>
              </tr>
            </thead>
            <tbody>
              {[
                {tier:"minima", label:"🟡 Meta Mínima", color:"#a16207", bg:"#fefce8"},
                {tier:"ideal",  label:"🔵 Meta Ideal",  color:"#1d4ed8", bg:"#eff6ff"},
                {tier:"super",  label:"🟢 Super Meta",  color:"#15803d", bg:"#f0fdf4"},
              ].map(row=>(
                <tr key={row.tier} style={{borderBottom:`1px solid ${T.border}`,background:row.bg+"80"}}>
                  <td style={{padding:"13px 16px"}}>
                    <div style={{fontWeight:700,color:row.color,fontSize:14}}>{row.label}</div>
                    {row.tier==="super"&&<div style={{fontSize:11,color:T.muted,marginTop:2}}>+ requisitos especiais</div>}
                  </td>
                  {UNITS.map(u=>(
                    <td key={u.id} style={{padding:"13px 16px",textAlign:"center"}}>
                      <span style={{fontWeight:800,fontSize:18,color:row.color}}>{METAS[u.id][row.tier]}+</span>
                      <div style={{fontSize:10,color:T.muted}}>matrículas</div>
                    </td>
                  ))}
                  <td style={{padding:"13px 16px",textAlign:"center"}}>
                    <span style={{fontWeight:800,fontSize:20,color:row.color}}>{row.tier==="minima"?"75%":row.tier==="ideal"?"85%":"95%"}</span>
                    <div style={{fontSize:10,color:T.muted}}>do valor da matrícula</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Meta à vista + Super meta */}
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:0,borderTop:`1px solid ${T.border}`}}>
          {/* Meta à vista */}
          <div style={{padding:"16px 20px",borderRight:mob?"none":`1px solid ${T.border}`}}>
            <div style={{fontSize:12,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>💵 Meta À Vista — Prêmio R$ 150/unidade</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {UNITS.map(u=>(
                <div key={u.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:u.color,border:`1px solid ${u.border}`,borderRadius:8,padding:"8px 12px"}}>
                  <span style={{fontWeight:700,fontSize:13,color:u.text}}>{u.label}</span>
                  <span style={{fontWeight:800,fontSize:14,color:u.text}}>{fmtMoney(METAS[u.id].avistaMin)}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Super meta requisitos */}
          <div style={{padding:"16px 20px"}}>
            <div style={{fontSize:12,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>🚀 Requisitos da Super Meta (95%)</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:8,padding:"10px 12px",fontSize:13}}>
                <div style={{fontWeight:700,color:"#15803d",marginBottom:4}}>Chapecó & Passo Fundo</div>
                <div style={{color:"#15803d",fontSize:12}}>✅ 20+ matrículas no mês</div>
                <div style={{color:"#15803d",fontSize:12}}>✅ Mínimo 12 mensalidades</div>
                <div style={{color:"#15803d",fontSize:12}}>✅ Meta à vista R$ 12.000</div>
              </div>
              <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:8,padding:"10px 12px",fontSize:13}}>
                <div style={{fontWeight:700,color:"#15803d",marginBottom:4}}>Online</div>
                <div style={{color:"#15803d",fontSize:12}}>✅ 15+ matrículas no mês</div>
                <div style={{color:"#15803d",fontSize:12}}>✅ Mínimo 8 mensalidades</div>
                <div style={{color:"#15803d",fontSize:12}}>✅ Meta à vista R$ 5.000</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SIMULADOR DE COMISSÕES ── */}
      <SimuladorComissoes mob={mob}/>

      {/* Cards por unidade */}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {unitsData.map(u => <UnitCard key={u.id} u={u}/>)}
      </div>

      {/* Tabela comparativa */}
      <div style={{background:"#fff",border:`1px solid ${T.border}`,borderRadius:T.radius,overflow:"hidden",marginTop:20}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${T.border}`,fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700}}>Comparativo por Unidade</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:"#f8fafc",borderBottom:`1px solid ${T.border}`}}>
                {["Unidade","Matrículas","Faixa","Comissão Base","Prêmio À Vista","Total Comissão","Projeção"].map(h=>(
                  <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {unitsData.map(u=>{
                const badge = tierBadge(u.tier, u.superValida);
                const projColor = COMISSAO_TIERS[u.projecaoTier]?.color||"#94a3b8";
                return (
                  <tr key={u.id} className="rw" onClick={()=>setOpenUnit(openUnit===u.id?null:u.id)} style={{borderBottom:`1px solid ${T.border}`,cursor:"pointer"}}>
                    <td style={{padding:"12px 14px",fontWeight:700}}>{u.label}</td>
                    <td style={{padding:"12px 14px"}}>
                      <span style={{fontWeight:800,fontSize:16,color:COMISSAO_TIERS[u.tier]?.color||"#94a3b8"}}>{u.count}</span>
                      <span style={{color:T.muted,fontSize:11}}> / {u.m.super}</span>
                    </td>
                    <td style={{padding:"12px 14px"}}>
                      <span style={{background:badge.bg,color:badge.color,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{badge.label}</span>
                    </td>
                    <td style={{padding:"12px 14px",fontWeight:600}}>{fmtMoney(u.comissaoBase)}</td>
                    <td style={{padding:"12px 14px",fontWeight:600,color:u.premioPago>0?"#10b981":T.muted}}>{u.premioPago>0?`✅ ${fmtMoney(u.premioPago)}`:"—"}</td>
                    <td style={{padding:"12px 14px",fontWeight:800,color:COMISSAO_TIERS[u.tier]?.color||T.text,fontSize:15}}>{fmtMoney(u.comissaoTotal)}</td>
                    <td style={{padding:"12px 14px"}}>
                      <span style={{color:projColor,fontWeight:700}}>{u.projecaoFim}</span>
                      <span style={{fontSize:10,color:projColor,marginLeft:4}}>({COMISSAO_TIERS[u.projecaoTier]?.label})</span>
                    </td>
                  </tr>
                );
              })}
              <tr style={{background:"#f8fafc",borderTop:`2px solid ${T.border}`,fontWeight:700}}>
                <td style={{padding:"12px 14px"}}>TOTAL</td>
                <td style={{padding:"12px 14px",fontSize:16,fontWeight:800,color:T.accent}}>{totalMatr}</td>
                <td style={{padding:"12px 14px"}}>—</td>
                <td style={{padding:"12px 14px"}}>{fmtMoney(unitsData.reduce((s,u)=>s+u.comissaoBase,0))}</td>
                <td style={{padding:"12px 14px",color:"#10b981"}}>{totalPremio>0?`✅ ${fmtMoney(totalPremio)}`:"—"}</td>
                <td style={{padding:"12px 14px",fontSize:18,fontWeight:800,color:"#10b981"}}>{fmtMoney(totalComissao)}</td>
                <td style={{padding:"12px 14px",fontWeight:700}}>{unitsData.reduce((s,u)=>s+u.projecaoFim,0)} matr.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── AGENTE IA ──────────────────────────────────────────────────── */
function AgenteIA({leads, mob}) {
  const [msgs, setMsgs] = useState([{role:"assistant", content:"Olá! Sou o agente de IA da Nexus. Tenho acesso a todos os dados do CRM e posso te ajudar com análises, resumos de leads, sugestões de próximos passos e muito mais. Como posso ajudar?"}]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const buildContext = () => {
    const ts = today();
    const total = leads.length;
    const matr = leads.filter(l=>l.stage==="matriculado").length;
    const hoje = new Date().toLocaleDateString("pt-BR");
    return [
      "Voce e um assistente de vendas especializado da Nexus English Center.",
      "Escola de ingles com unidades em Chapeco (chape), Passo Fundo (pf) e Online.",
      "",
      "DADOS DO CRM - " + hoje,
      "Total de leads: " + total,
      "Matriculados: " + matr,
      "Em negociacao: " + leads.filter(l=>l.stage==="negociacao").length,
      "Follow-ups atrasados: " + leads.filter(l=>l.followUp?.date&&l.followUp.date<ts).length,
      "",
      "METAS DO MES:",
      "PF: min=8, ideal=15, super=20+ (req: 12 mensalidades + meta avista R$12k)",
      "Chapeco: min=8, ideal=15, super=20+ (req: 12 mensalidades + meta avista R$12k)",
      "Online: min=4, ideal=8, super=15+ (req: 8 mensalidades + meta avista R$5k)",
      "Comissao: minima=75%, ideal=85%, super=95%",
      "Premio avista: PF R$150 ao atingir R$12k, Chapeco R$150 ao atingir R$12k, Online R$150 ao atingir R$5k",
      "",
      "Responda sempre em portugues brasileiro. Use emojis. Seja objetivo e util.",
    ].join("\n");
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMsgs(p=>[...p, {role:"user", content:userMsg}]);
    setLoading(true);
    try {
      const context = buildContext();
      const history = msgs.slice(-10).map(m=>({role:m.role, content:m.content}));
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {"Content-Type":"application/json","Authorization":"Bearer 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"},
        body: JSON.stringify({model:"llama-3.3-70b-versatile",max_tokens:1000,messages:[{role:"system",content:context},...history,{role:"user",content:userMsg}]})
      });
      const data = await response.json();
      setMsgs(p=>[...p, {role:"assistant", content:data.choices?.[0]?.message?.content||"Não consegui processar."}]);
    } catch(e) {
      setMsgs(p=>[...p, {role:"assistant", content:"❌ Erro ao conectar com a IA."}]);
    }
    setLoading(false);
  };

  return (
    <div style={{animation:"fadeUp .3s",display:"flex",flexDirection:"column",height:mob?"calc(100vh - 140px)":"calc(100vh - 120px)"}}>
      <div style={{marginBottom:16,flexShrink:0}}>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:mob?26:32,fontWeight:700,letterSpacing:"-.5px"}}>🤖 Agente IA</h1>
        <p style={{color:T.muted,fontSize:13,marginTop:4}}>Assistente inteligente com acesso aos dados do CRM</p>
      </div>
      <div style={{flex:1,overflowY:"auto",background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:16,display:"flex",flexDirection:"column",gap:12,marginBottom:12}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            {m.role==="assistant"&&<div style={{width:28,height:28,borderRadius:14,background:"#111",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,marginRight:8,alignSelf:"flex-start",marginTop:2}}>🤖</div>}
            <div style={{maxWidth:"80%",background:m.role==="user"?T.accent:"#f8f8f8",color:m.role==="user"?"white":T.text,borderRadius:m.role==="user"?"16px 16px 2px 16px":"16px 16px 16px 2px",padding:"10px 14px",fontSize:14,lineHeight:1.5,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{m.content}</div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:14,background:"#111",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div>
          <div style={{background:"#f8f8f8",borderRadius:"16px 16px 16px 2px",padding:"10px 14px",display:"flex",gap:4,alignItems:"center"}}>
            {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:3,background:T.muted,animation:"fadeIn .6s infinite",animationDelay:`${i*0.2}s`}}/>)}
          </div>
        </div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{display:"flex",gap:8,flexShrink:0}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder="Pergunte sobre seus leads, metas, métricas..."
          style={{flex:1,background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:12,padding:"12px 16px",fontSize:15,color:T.text,outline:"none",fontFamily:"'DM Sans',sans-serif"}}
          onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
        <button onClick={send} disabled={loading||!input.trim()} className="tap"
          style={{background:T.accent,border:"none",borderRadius:12,padding:"12px 18px",fontSize:18,cursor:loading||!input.trim()?"not-allowed":"pointer",opacity:loading||!input.trim()?0.5:1}}>
          ➤
        </button>
      </div>
    </div>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────────────────── */
function Sidebar({active,onChange,fuCount,waUnread,cadLate,onLogout,userEmail,leads}) {
  return (
    <aside style={{width:228,background:"#111111",display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0,flexShrink:0,overflowY:"auto"}}>
      <div style={{padding:"24px 16px 12px"}}>
        <div style={{marginBottom:20,paddingBottom:16,borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <img src={LOGO} alt="Nexus" style={{height:44,objectFit:"contain",display:"block",filter:"drop-shadow(0 0 1px rgba(255,255,255,.1))"}}/>
        </div>
        <nav style={{display:"flex",flexDirection:"column",gap:2}}>
          {NAV_ITEMS.map(item=>{const on=active===item.id;return(
            <button key={item.id} onClick={()=>onChange(item.id)} className="nav-itm tap"
              style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:9,border:"none",borderLeft:on?"3px solid #e85d20":"3px solid transparent",background:on?"rgba(232,93,32,.12)":"transparent",color:on?"#e85d20":"rgba(255,255,255,.5)",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:on?700:500,textAlign:"left",transition:"all .15s"}}>
              <span style={{fontSize:16}}>{item.icon}</span>{item.label}
              {item.id==="followups"&&(fuCount+cadLate)>0&&<span style={{marginLeft:"auto",background:cadLate>0?"#ef4444":T.gold,color:"white",borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:700}}>{fuCount+cadLate}</span>}
              {item.id==="whatsapp"&&waUnread>0&&<span style={{marginLeft:"auto",background:"#25d366",color:"white",borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:700}}>{waUnread}</span>}
            </button>
          );})}
        </nav>
      </div>

      {/* Mini Metas no sidebar */}
      <MiniMetas leads={leads}/>

      <div style={{marginTop:"auto",padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,.06)"}}>
        <div style={{fontSize:11,color:"rgba(255,255,255,.35)",marginBottom:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>👤 {userEmail}</div>
        <button onClick={onLogout} className="tap" style={{width:"100%",background:"transparent",border:"1px solid rgba(255,255,255,.1)",borderRadius:9,padding:"8px",fontSize:13,fontWeight:600,color:"rgba(255,255,255,.45)",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Sair</button>
      </div>
    </aside>
  );
}

function BottomNav({active,onChange,fuCount,waUnread}) {
  return (
    <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"#111111",borderTop:"1px solid rgba(255,255,255,.06)",display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom,0px)",boxShadow:"0 -4px 20px rgba(0,0,0,.2)"}}>
      {NAV_ITEMS.map(item=>{const on=active===item.id;return(
        <button key={item.id} onClick={()=>onChange(item.id)} className="tap"
          style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"10px 4px 8px",border:"none",background:"transparent",color:on?"#e85d20":"rgba(255,255,255,.4)",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:on?700:500,transition:"color .15s",position:"relative"}}>
          <span style={{fontSize:18,lineHeight:1}}>{item.icon}</span>
          {item.label}
          {item.id==="followups"&&(fuCount+waUnread)>0&&<span style={{position:"absolute",top:6,right:"calc(50% - 18px)",background:waUnread>0?"#ef4444":T.gold,color:"white",borderRadius:10,padding:"0 5px",fontSize:9,fontWeight:700,lineHeight:"16px"}}>{fuCount}</span>}
          {item.id==="whatsapp"&&waUnread>0&&<span style={{position:"absolute",top:6,right:"calc(50% - 18px)",background:"#25d366",color:"white",borderRadius:10,padding:"0 5px",fontSize:9,fontWeight:700,lineHeight:"16px"}}>{waUnread}</span>}
        </button>
      );})}
    </nav>
  );
}

function FAB({onClick}) {
  return <button onClick={onClick} className="tap" style={{position:"fixed",bottom:"calc(68px + env(safe-area-inset-bottom,0px))",right:20,width:54,height:54,borderRadius:27,background:T.accent,border:"none",color:"white",fontSize:26,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(232,93,32,.45)",cursor:"pointer",zIndex:99}}>+</button>;
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
        cadenciaStep:l.cadencia_step||0,cadenciaStarted:l.cadencia_started_at||null,matriculaMes:l.matricula_mes||null,
        // Matrícula fields
        tipoVenda:l.tipo_venda||null,
        valorMensalidade:l.valor_mensalidade||0,
        valorAvista:l.valor_avista||0,
        followUp:l.follow_up_date?{date:l.follow_up_date,note:l.follow_up_note||"",time:l.follow_up_time||""}:null,
        history:(hd||[]).filter(h=>h.lead_id===l.id).map(h=>({id:h.id,type:h.type,note:h.note,date:h.date})),
        unreadCount:unreadMap[l.id]||0,
      })));
      setDbLoading(false);
    })();
  },[session]);

  const updateLead=u=>{setLeads(p=>p.map(l=>l.id===u.id?u:l));setSelected(u);};
  const addLead=d=>setLeads(p=>[d,...p]);
  const deleteLead=id=>{setLeads(p=>p.filter(l=>l.id!==id));setSelected(null);};

  // onMove agora aceita extraData para campos de matrícula
  const moveLead=async(lid,sid,extraData=null)=>{
    const updates={stage:sid};
    if(extraData){
      if(extraData.tipoVenda) updates.tipo_venda=extraData.tipoVenda;
      if(extraData.valorMensalidade!=null) updates.valor_mensalidade=extraData.valorMensalidade;
      if(extraData.valorAvista!=null) updates.valor_avista=extraData.valorAvista;
    }
    await supabase.from("leads").update(updates).eq("id",lid);
    setLeads(p=>p.map(l=>l.id===lid?{...l,stage:sid,...(extraData||{})}:l));
  };

  const nav=p=>{setPage(p);setSelected(null);};
  const logout=()=>supabase.auth.signOut();
  const ts=today();
  const fuCount=leads.filter(l=>l.followUp?.date&&l.followUp.date<=ts).length;
  const waUnreadTotal=leads.reduce((sum,l)=>sum+(l.unreadCount||0),0);
  const sdrStages2=["novo","contato","info","qualificado","naoqualif","reuniao"];
  const cadLateTotal=leads.filter(l=>{
    if(!sdrStages2.includes(l.stage)||!l.cadenciaStep||l.cadenciaStep===0||l.cadenciaStep>=7)return false;
    const cad=CADENCIA.find(c=>c.step===l.cadenciaStep);
    const nextCad=CADENCIA.find(c=>c.step===l.cadenciaStep+1);
    if(!cad||!l.cadenciaStarted)return false;
    const deadlineDay=nextCad?nextCad.day:14;
    const deadline=new Date(new Date(l.cadenciaStarted).getTime()+(deadlineDay*24*60*60*1000));
    return new Date()>deadline;
  }).length;

  if(authLoading)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:T.bg}}><Spinner/></div>);
  if(!session)return(<><GlobalStyles/><LoginScreen/></>);

  return (
    <>
      <GlobalStyles/>
      <div style={{display:"flex",minHeight:"100vh"}}>
        {!mob&&<Sidebar active={page} onChange={nav} fuCount={fuCount} waUnread={waUnreadTotal} cadLate={cadLateTotal} onLogout={logout} userEmail={session.user.email} leads={leads}/>}
        <main style={{flex:1,padding:mob?"18px 16px 90px":"36px 40px",overflowY:"auto",minHeight:"100vh"}}>
          {mob&&(
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <img src={LOGO} alt="Nexus" style={{height:32,objectFit:"contain",display:"block"}}/>
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
              {page==="metas"      &&<PainelMetas leads={leads} mob={mob}/>}
              {page==="relatorios" &&<Relatorios leads={leads} mob={mob}/>}
              {page==="ia"          &&<AgenteIA leads={leads} mob={mob}/>}
            </>
          )}
        </main>
      </div>
      {mob&&<BottomNav active={page} onChange={nav} fuCount={fuCount} waUnread={waUnreadTotal}/>}
      {mob&&<FAB onClick={()=>setShowQuick(true)}/>}
      {showQuick&&<QuickAddModal onAdd={addLead} onClose={()=>setShowQuick(false)} mob={mob}/>}
      {showAdd  &&<AddLeadModal  onAdd={addLead} onClose={()=>setShowAdd(false)} mob={mob}/>}
      {selected &&<LeadModal lead={selected} onUpdate={updateLead} onDelete={deleteLead} onClose={()=>setSelected(null)} mob={mob}/>}
    </>
  );
}
