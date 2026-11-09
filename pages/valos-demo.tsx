import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { SiteHeader } from "@components/layout/SiteHeader";
import { SiteFooter } from "@components/layout/SiteFooter";
import NextLink from "next/link";

type Pathway = "lite" | "full";
type Answer = "yes" | "partial" | "no" | "na";
type Disclosure = "minimal" | "summary" | "detailed";
type Badge = { id: string; operator: string; wallet: string; pathway: Pathway; rating: string; score: number; issued: string; expires: string; disclosure: Disclosure; listed: boolean; answers: Answer[]; supersedes?: string };
const QUESTIONS = [
  { category: "Key management", label: "Are signing keys protected by documented access-control and management procedures?" },
  { category: "Key management", label: "Are recovery and backup procedures tested and access-controlled?" },
  { category: "Infrastructure", label: "Are validator systems hardened and patched through a documented process?" },
  { category: "Infrastructure", label: "Are administrative privileges limited and periodically reviewed?" },
  { category: "Monitoring", label: "Are validator and infrastructure security events actively monitored?" },
  { category: "Monitoring", label: "Is there an escalation process for operational or security alerts?" },
  { category: "Incident response", label: "Is there a documented incident-response plan with assigned responsibilities?" },
  { category: "Incident response", label: "Have incident-response procedures been exercised and reviewed?" },
  { category: "Continuity", label: "Are failure recovery and continuity procedures documented?" },
  { category: "Continuity", label: "Are backups and restoration processes regularly tested?" },
  { category: "Governance", label: "Are changes to critical validator infrastructure reviewed and recorded?" },
  { category: "Governance", label: "Are suppliers and dependencies included in operational risk reviews?" }
];
const DEMO = [
  {operator:"Northstar Staking",pathway:"full",rating:"A",score:91,disclosure:"detailed",wallet:"0x184a…92c1",issued:"2026-10-12",expires:"2027-04-12"},
  {operator:"Meridian Nodes",pathway:"lite",rating:"B",score:76,disclosure:"summary",wallet:"0x73bf…c018",issued:"2026-10-24",expires:"2027-04-24"},
  {operator:"Quiet Validator",pathway:"full",rating:"B",score:72,disclosure:"minimal",wallet:"0x2ef1…103a",issued:"2026-11-02",expires:"2027-05-02"}
];
const panel: CSSProperties = { background:"var(--theme-surface-card)", border:"1px solid var(--theme-border)", borderRadius:16, padding:24 };
const muted: CSSProperties = { color:"var(--theme-text-secondary)" };
const btn: CSSProperties = { border:0, borderRadius:9, padding:"12px 20px", background:"var(--theme-brand)", color:"var(--theme-text-on-brand)", fontWeight:700, cursor:"pointer" };
const outline: CSSProperties = { ...btn, background:"transparent", border:"1px solid var(--theme-border-strong)", color:"var(--theme-text-primary)" };
const small: CSSProperties = { fontSize:12, letterSpacing:".08em", textTransform:"uppercase", color:"var(--theme-brand)", fontWeight:700 };
function addMonths(date: Date, n: number) { const d = new Date(date); const day = d.getUTCDate(); d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth()+n); const end = new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate(); d.setUTCDate(Math.min(day,end)); return d.toISOString().slice(0,10); }
function calculate(answers: Answer[]) {const applicable=answers.filter(a=>a!=="na");const score=applicable.length?Math.round(applicable.reduce((s,a)=>s+(a==="yes"?1:a==="partial"?.5:0),0)/applicable.length*100):0;return {score,rating:score>=85?"A":score>=70?"B":score>=50?"C":"D"};}
function Chip({children}:{children:ReactNode}) {return <span style={{border:"1px solid var(--theme-border-strong)",borderRadius:99,padding:"5px 10px",fontSize:12,display:"inline-block"}}>{children}</span>;}
function MockPizza(){const colors=["#3a9e80","#cf9a3a","#3a9e80","#c46044","#3a9e80","#cf9a3a"];return <svg viewBox="0 0 220 220" style={{width:"100%",maxWidth:230}} aria-label="Example six-slice Validator Beat resilience pizza">{colors.map((c,i)=>{const a=(-90+i*60)*Math.PI/180,b=(-90+(i+1)*60)*Math.PI/180;return <path key={i} d={"M110 110 L"+(110+94*Math.cos(a))+" "+(110+94*Math.sin(a))+" A94 94 0 0 1 "+(110+94*Math.cos(b))+" "+(110+94*Math.sin(b))+" Z"} fill={c} stroke="var(--theme-surface-page)" strokeWidth="3"/>;})}<circle cx="110" cy="110" r="27" fill="var(--theme-surface-card)"/><text x="110" y="114" textAnchor="middle" fill="var(--theme-text-primary)" fontSize="12" fontWeight="bold">BEAT</text></svg>;}
export default function ValOSDemo(){
  const [screen,setScreen]=useState<"landing"|"assessment"|"results"|"directory"|"profile">("landing");
  const [pathway,setPathway]=useState<Pathway>("lite");
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState<Record<number,Answer>>({});
  const [operator,setOperator]=useState("My Validator Operation");
  const [wallet,setWallet]=useState("");
  const [disclosure,setDisclosure]=useState<Disclosure>("summary");
  const [listed,setListed]=useState(true);
  const [badge,setBadge]=useState<Badge|null>(null);
  const [history,setHistory]=useState<Badge[]>([]);
  const [selected,setSelected]=useState<any>(null);
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("all");
  const indices=pathway==="lite"?[0,2,4,6,8,10]:QUESTIONS.map((_,i)=>i);
  const result=useMemo(()=>calculate(indices.map(i=>answers[i]||"no")),[answers,pathway]);
  const records=[...DEMO,...history.filter(b=>b.listed && (!badge||b.id===badge.id))];
  const directory=records.filter(r=>(r.operator.toLowerCase().includes(search.toLowerCase()))&&(filter==="all"||r.pathway===filter));
  const reset=(p:Pathway)=>{setPathway(p);setAnswers({});setStep(0);setScreen("assessment");};
  const createBadge=()=>{
    if(!/^0x[a-fA-F0-9]{40}$/.test(wallet)){alert("Enter a 42-character Ethereum wallet address (0x plus 40 hex characters). This demo does not connect or verify wallet ownership.");return;}
    const now=new Date(),issued=now.toISOString().slice(0,10);
    const entry:Badge={id:"DEMO-"+Math.random().toString(16).slice(2,12).toUpperCase(),operator:operator.trim()||"Unnamed Operator",wallet,pathway,rating:result.rating,score:result.score,issued,expires:addMonths(now,6),disclosure,listed,answers:indices.map(i=>answers[i]!),supersedes:badge?.id};
    setBadge(entry);setSelected(null);setHistory(prev=>[entry,...prev]);setScreen("profile");
  };
  const box=(children:ReactNode,style:CSSProperties={})=><section style={{...panel,...style}}>{children}</section>;
  const scoreTone=(r:string)=>r==="A"?"#3a9e80":r==="B"?"#cf9a3a":"#c46044";
  return <><SiteHeader/><main id="main-content" style={{maxWidth:1140,margin:"0 auto",padding:"48px 24px 100px",minHeight:"70vh"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:24}}>
      <div style={small}>VALOS × VALIDATOR BEAT · INTERACTIVE CONCEPT</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <button style={screen==="landing"?btn:outline} onClick={()=>setScreen("landing")}>Overview</button>
        <button style={screen==="directory"?btn:outline} onClick={()=>setScreen("directory")}>Operator directory</button>
        {badge&&<button style={screen==="profile"?btn:outline} onClick={()=>{setSelected(badge);setScreen("profile");}}>My badge</button>}
      </div>
    </div>
    {screen==="landing"&&<>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:32,alignItems:"center",marginBottom:40}}>
        <div><div style={small}>Two complementary ways to assess your setup</div><h1 style={{fontSize:"clamp(36px,5vw,56px)",lineHeight:1.06,letterSpacing:"-.03em",margin:"18px 0"}}>Know your validator. Prove your progress.</h1><p style={{...muted,fontSize:17,lineHeight:1.65}}>Start with Validator Beat's six-slice resilience pizza, then go deeper with a ValOS operational security self-assessment. Choose how much you share with the ecosystem.</p><button style={btn} onClick={()=>reset("lite")}>Start ValOS assessment →</button></div>
        <div style={{...panel,textAlign:"center",background:"var(--theme-surface-panel)"}}><MockPizza/><h3>Validator Beat resilience check</h3><p style={muted}>Six questions · Existing tool preserved</p><NextLink href="/assess/" style={{color:"var(--theme-brand)",fontWeight:700}}>Open resilience assessment →</NextLink></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18}}>
        {(["lite","full"] as Pathway[]).map(p=>box(<><div style={small}>VALOS {p.toUpperCase()}</div><h2 style={{fontSize:26,margin:"12px 0"}}>{p==="lite"?"A lighter first step":"The deeper security review"}</h2><p style={{...muted,minHeight:60}}>{p==="lite"?"Six illustrative questions across core security practices. A fast route to your first self-assessed badge.":"Twelve illustrative questions for a more detailed look at your operational controls and resilience."}</p><p style={{fontWeight:700}}>{p==="lite"?"6":"12"} example questions · Self-assessed</p><button style={btn} onClick={()=>reset(p)}>Choose {p==="lite"?"Lite":"Full"} →</button></>,{height:"100%",boxSizing:"border-box"}))}
      </div>
      <p style={{...muted,fontSize:13,marginTop:25}}>Prototype only. These example questions, grades and pathways are not an approved ValOS methodology or formal ValOS certification. Official scope and badge governance require approval.</p>
    </>}
    {screen==="assessment"&&<div style={{maxWidth:850,margin:"0 auto"}}>
      <button style={{...outline,marginBottom:20}} onClick={()=>setScreen("landing")}>← Pathways</button>
      <div style={small}>VALOS {pathway.toUpperCase()} · QUESTION {step+1} OF {indices.length}</div>
      <div style={{height:8,background:"var(--theme-surface-panel)",borderRadius:99,margin:"14px 0 28px",overflow:"hidden"}}><div style={{width:((step+1)/indices.length*100)+"%",height:"100%",background:"var(--theme-brand)"}}/></div>
      {box(<><div style={small}>{QUESTIONS[indices[step]].category}</div><h2 style={{fontSize:29,lineHeight:1.3,margin:"14px 0 24px"}}>{QUESTIONS[indices[step]].label}</h2>
      <div style={{display:"grid",gap:10}}>{([["yes","Implemented"],["partial","Partially implemented"],["no","Not implemented"],["na","Not applicable"]] as [Answer,string][]).map(([value,label])=><button key={value} onClick={()=>setAnswers(a=>({...a,[indices[step]]:value}))} style={{padding:16,textAlign:"left",cursor:"pointer",fontSize:15,borderRadius:10,border:answers[indices[step]]===value?"2px solid var(--theme-brand)":"1px solid var(--theme-border-strong)",background:answers[indices[step]]===value?"var(--theme-surface-panel)":"var(--theme-surface-card)",color:"var(--theme-text-primary)"}}>{answers[indices[step]]===value?"◉ ":"○ "}{label}</button>)}</div>
      <p style={{...muted,fontSize:13,marginTop:18}}>Self-reported response. Do not enter keys, credentials or sensitive infrastructure details.</p>
      <div style={{display:"flex",justifyContent:"space-between",gap:12,marginTop:24}}><button style={outline} disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))}>← Previous</button><button style={btn} disabled={!answers[indices[step]]} onClick={()=>step===indices.length-1?setScreen("results"):setStep(s=>s+1)}>{step===indices.length-1?"View my rating →":"Next →"}</button></div></>)}
    </div>}
    {screen==="results"&&<div style={{maxWidth:950,margin:"0 auto"}}>
      <div style={small}>VALOS {pathway.toUpperCase()} · YOUR RESULTS</div>
      <h1 style={{fontSize:42,margin:"12px 0"}}>Your self-assessed security posture</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:18}}>
        {box(<><div style={small}>ILLUSTRATIVE RATING</div><div style={{fontSize:95,fontWeight:800,color:scoreTone(result.rating),lineHeight:1.1}}>{result.rating}</div><h2>{result.score}%</h2><p style={muted}>Demonstration score based on your selected answers, not a verified audit or approved ValOS grading scale.</p></>)}
        {box(<><h3>Assessment summary</h3><p><b>Pathway:</b> ValOS {pathway.toUpperCase()}</p><p><b>Implemented:</b> {indices.filter(i=>answers[i]==="yes").length}</p><p><b>Partial:</b> {indices.filter(i=>answers[i]==="partial").length}</p><p><b>Not implemented:</b> {indices.filter(i=>answers[i]==="no").length}</p><p><b>Not applicable:</b> {indices.filter(i=>answers[i]==="na").length}</p><button style={outline} onClick={()=>{setStep(0);setScreen("assessment");}}>Edit answers</button></>)}
      </div>
      {box(<><h2>Issue a wallet-linked demo badge</h2><p style={muted}>The proposed production design stores immutable issuance records on-chain, linked to a verified wallet. This demonstration only simulates issuance in the browser; it does not connect a wallet or submit transactions.</p>
      <div style={{display:"grid",gap:8,maxWidth:600}}>
        <label htmlFor="operatorName">Operator display name</label><input id="operatorName" value={operator} onChange={e=>setOperator(e.target.value)} style={{padding:13,borderRadius:8,border:"1px solid var(--theme-border-strong)",background:"var(--theme-surface-card)",color:"var(--theme-text-primary)"}}/>
        <label htmlFor="walletAddress">Ethereum wallet address</label><input id="walletAddress" value={wallet} onChange={e=>setWallet(e.target.value)} placeholder="0x…" style={{padding:13,borderRadius:8,border:"1px solid var(--theme-border-strong)",background:"var(--theme-surface-card)",color:"var(--theme-text-primary)"}}/>
      </div>
      <h3 style={{marginBottom:12}}>Choose your disclosure</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>{([["minimal","Minimal","Badge, rating, scope and status only"],["summary","Summary","Plus category-level outcomes"],["detailed","Detailed","Plus non-sensitive question responses"]] as [Disclosure,string,string][]).map(([v,title,detail])=><button key={v} onClick={()=>setDisclosure(v)} style={{textAlign:"left",padding:16,borderRadius:10,cursor:"pointer",background:"var(--theme-surface-card)",color:"var(--theme-text-primary)",border:disclosure===v?"2px solid var(--theme-brand)":"1px solid var(--theme-border-strong)"}}><strong>{title}</strong><p style={{...muted,fontSize:13}}>{detail}</p></button>)}</div>
      <label style={{display:"flex",gap:9,margin:"20px 0",alignItems:"center"}}><input type="checkbox" checked={listed} onChange={e=>setListed(e.target.checked)}/> List my operator in the public directory</label>
      <button style={btn} onClick={createBadge}>Simulate badge issuance →</button>
      </>,{marginTop:20})}
    </div>}
    {screen==="profile"&&(()=>{const r=selected||badge;if(!r)return null;return <div style={{maxWidth:850,margin:"0 auto"}}>
      <button style={{...outline,marginBottom:18}} onClick={()=>setScreen("directory")}>← Operator directory</button>
      <div style={small}>OPERATOR PROFILE · SELF-ASSESSED</div><h1 style={{fontSize:42}}>{r.operator}</h1>
      {box(<><div style={{display:"flex",gap:22,flexWrap:"wrap",alignItems:"center"}}><div style={{width:145,height:145,borderRadius:22,border:"3px solid "+scoreTone(r.rating),display:"grid",placeItems:"center",textAlign:"center"}}><div><div style={small}>VALOS {r.pathway.toUpperCase()}</div><div style={{fontSize:75,fontWeight:800,lineHeight:1,color:scoreTone(r.rating)}}>{r.rating}</div><div style={{fontSize:11}}>SELF-ASSESSED</div></div></div><div style={{flex:1,minWidth:220}}><h2>{r.score}% · Demo rating</h2><p><Chip>{r.disclosure} disclosure</Chip> <Chip>Valid to {r.expires}</Chip></p><p style={muted}>Issued {r.issued} · Six-month validity window</p></div></div><hr style={{border:"none",borderTop:"1px solid var(--theme-border)",margin:"24px 0"}}/>
      <p><b>Wallet:</b> <code>{r.wallet}</code></p><p><b>Record:</b> <code>{r.id||"DEMO-EXAMPLE"}</code></p><p><b>Status:</b> Self-assessed · Not independently verified</p>{r.supersedes&&<p><b>Supersedes:</b> {r.supersedes}</p>}
      {r.disclosure!=="minimal"&&<><h3>Published summary</h3><p style={muted}>This operator chose {r.disclosure} disclosure. {r.disclosure==="summary"?"Category-level results would appear here.":"Non-sensitive question-level responses can appear here after review."}</p></>}
      <p style={{...muted,fontSize:12}}>Mock badge record only. No blockchain transaction or cryptographic wallet proof was created.</p></>)}
      {badge&&r.id===badge.id&&<div style={{marginTop:18,display:"flex",gap:12,flexWrap:"wrap"}}><button style={btn} onClick={()=>reset(badge.pathway)}>Update my assessment →</button><button style={outline} onClick={()=>{setSelected(null);setScreen("directory");}}>View directory</button></div>}
    </div>})()}
    {screen==="directory"&&<>
      <div style={small}>PUBLIC VALIDATOR DIRECTORY · DEMO DATA</div><h1 style={{fontSize:44,margin:"12px 0"}}>Operators & self-assessed badges</h1><p style={{...muted,maxWidth:750,lineHeight:1.7}}>Compare declared ValOS pathways, ratings and transparency choices. A self-assessed badge is not third-party certification. Operators may choose to stay unlisted; absence does not imply poor security.</p>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",margin:"24px 0"}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search operators…" aria-label="Search operators" style={{flex:"1 1 250px",padding:12,borderRadius:8,border:"1px solid var(--theme-border-strong)",background:"var(--theme-surface-card)",color:"var(--theme-text-primary)"}}/><select aria-label="Filter pathway" value={filter} onChange={e=>setFilter(e.target.value)} style={{padding:12,borderRadius:8,border:"1px solid var(--theme-border-strong)",background:"var(--theme-surface-card)",color:"var(--theme-text-primary)"}}><option value="all">All pathways</option><option value="lite">Lite</option><option value="full">Full</option></select></div>
      <div style={{display:"grid",gap:12}}>{directory.map((r,i)=>box(<div style={{display:"flex",gap:16,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}} key={i}><div><h3 style={{margin:"0 0 8px"}}>{r.operator}</h3><p style={{margin:0,...muted,fontSize:13}}>ValOS {r.pathway.toUpperCase()} · {r.disclosure} disclosure · Expires {r.expires}</p></div><div style={{display:"flex",gap:16,alignItems:"center"}}><strong style={{fontSize:27,color:scoreTone(r.rating)}}>{r.rating}</strong><button style={outline} onClick={()=>{setSelected(r);setScreen("profile");}}>View profile →</button></div></div>,{padding:18}))}{directory.length===0&&box(<p>No matching operators.</p>)}</div>
      <p style={{...muted,fontSize:13,marginTop:20}}>All listed operators are fictional samples, except any demo record you create in this browser session. Production issuance, wallet verification, privacy screening, indexing and status checks are not implemented.</p>
    </>}
  </main><SiteFooter/></>;
}
