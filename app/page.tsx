'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Leaf, Printer, Download, X, Check, LoaderCircle, Compass, Volume2, Eye, Sparkles, Wind } from 'lucide-react';
type Mission={id:string;title:string;text:string;sense:string;minutes:number;score?:number};
const sample:Mission[]=[
{id:'palette',title:'Collect a colour palette',text:'Find three different colours without picking anything. Give each one a name you would put on a paint tin.',sense:'sight',minutes:2},
{id:'sound-map',title:'Draw a sound map',text:'Stay in a safe spot. Notice one sound nearby, one far away, and one in between. Remember where each came from.',sense:'sound',minutes:2},
{id:'cloud-story',title:'Give a cloud a story',text:'Look at the sky without looking at the sun. If there are clouds, choose a shape and invent a one-sentence story. On a clear day, use a rooftop silhouette instead.',sense:'imagination',minutes:2}];
const icons:Record<string,typeof Eye>={sight:Eye,sound:Volume2,imagination:Sparkles,movement:Wind};
export default function Home(){
 const [prompt,setPrompt]=useState('I need a quiet reset. I like birds and noticing small things.');
 const [minutes,setMinutes]=useState(10),[setting,setSetting]=useState('park');
 const [missions,setMissions]=useState<Mission[]>(sample),[mode,setMode]=useState<'sample'|'ai'>('sample');
 const [busy,setBusy]=useState(false),[status,setStatus]=useState(''),[error,setError]=useState(''),[pocket,setPocket]=useState(false);
 const [complete,setComplete]=useState<string[]>([]),[planLabel,setPlanLabel]=useState('A little of everything');
 const worker=useRef<Worker|null>(null),timeout=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{worker.current?.terminate();if(timeout.current)clearTimeout(timeout.current);},[]);
 function stop(){worker.current?.terminate();worker.current=null;if(timeout.current)clearTimeout(timeout.current);setBusy(false);setStatus('Download cancelled. You can still use the sample card.');}
 function build(){
   if(!prompt.trim())return;setBusy(true);setError('');setStatus('Starting the local model…');
   if(!worker.current)worker.current=new Worker('/ai/worker.js',{type:'module'});
   const fail=()=>{stop();setError('The local model could not run in this browser. Please retry on a current desktop browser, or use the clearly labelled sample below.');setStatus('');};
   worker.current.onerror=fail;
   worker.current.onmessage=({data})=>{
     if(data.type==='status')setStatus(data.message);
     if(data.type==='error')fail();
     if(data.type==='result'){
       if(timeout.current)clearTimeout(timeout.current);setMissions(data.missions);setMode('ai');setBusy(false);setComplete([]);setStatus('Ready. Chosen on your device.');setPlanLabel(prompt.trim());
     }
   };
   timeout.current=setTimeout(fail,240000);
   worker.current.postMessage({prompt:prompt.trim(),setting,minutes});
 }
 function download(){
   const text=['OFFSCREEN — YOUR POCKET CARD',planLabel,mode==='ai'?'Selected by an open model on your device.':'Sample card — no AI used.','',...missions.map((m,i)=>`${i+1}. ${m.title} (${m.minutes} min)\n${m.text}\n`),'Stay somewhere safe and permitted. Observe without collecting or disturbing wildlife. No location guidance or species identification.','Made by MS ROBOTIKA'].join('\n');
   const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='offscreen-pocket-card.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 return <div className={pocket?'app pocket':'app'}>
  <header className="topbar"><a className="wordmark" href="/" aria-label="Offscreen home"><Leaf size={25}/>offscreen<span className="brand-dot">.</span></a><span className="edition">FIELD NOTES / 001</span><a className="about-link" href="#about">About the project <ArrowUpRight size={16}/></a></header>
  <main>
   <section className="intro"><div><p className="eyebrow">A SMALL PLAN FOR THE OUTDOORS</p><h1>Less scrolling.<br/><em>More noticing.</em></h1><p className="lead">Choose three little things to do outside.<br/>Then put your phone away.</p></div><div className="photo-panel"><img src="/field.jpg" alt="Sunlight revealing the delicate textures of green leaves"/><span className="photo-caption">THERE'S A LOT IN A LITTLE PATCH.</span></div></section>
   <div className="workspace">
    <section className="planner" aria-labelledby="planner-title"><div className="section-heading"><span className="step">01</span><h2 id="planner-title">What would feel good?</h2></div>
     <label htmlFor="idea">Your idea, in English</label><textarea disabled={busy} id="idea" value={prompt} onChange={e=>setPrompt(e.target.value)} maxLength={300} rows={3}/>
     <div className="quick-ideas" aria-label="Ideas to try">{[['A quiet reset','I want a peaceful break with birdsong and gentle movement.'],['With the kids','A playful outdoor story game with children and imagination.'],['Something creative','I want to notice colours, shadows and shapes like an artist.']].map(([label,value])=><button type="button" disabled={busy} key={label} onClick={()=>setPrompt(value)}>{label}</button>)}</div>
     <div className="select-row"><div><label htmlFor="time">Time outside</label><select disabled={busy} id="time" value={minutes} onChange={e=>setMinutes(+e.target.value)}><option value={6}>6 minutes</option><option value={10}>10 minutes</option><option value={15}>15 minutes</option></select></div><div><label htmlFor="setting">Your little patch</label><select disabled={busy} id="setting" value={setting} onChange={e=>setSetting(e.target.value)}><option value="park">Park or trees</option><option value="street">Neighbourhood</option><option value="garden">Garden or balcony</option><option value="any">Anywhere outdoors</option></select></div></div>
     <p className="seated-note"><Compass size={17}/>Every mission can be observed from a safe, stationary spot.</p>
     <button className="primary" disabled={busy||!prompt.trim()} onClick={build}>{busy?<><LoaderCircle className="spin" size={19}/>Choosing your missions…</>:<>Make my pocket card <Sparkles size={19}/></>}</button>
     {busy&&<button className="cancel" onClick={stop}>Cancel download</button>}
     <p className="status" role="status" aria-live="polite">{status}</p>{error&&<p className="error" role="alert">{error}</p>}
     <p className="download-note">First use downloads an open AI model and its runtime (tens of MB). Your words stay on your device. No account or paid API needed.</p>
    </section>
    <section className="card-panel" aria-labelledby="card-title"><div className="card-top"><div><p className="eyebrow">YOUR POCKET CARD</p><h2 id="card-title">A reason to step outside.</h2></div><span className="duration">{missions.reduce((n,m)=>n+m.minutes,0)}<small>MIN</small></span></div><div className="card-meta"><span className={mode==='ai'?'mode-ai':'mode-sample'}>{mode==='ai'?'OPEN MODEL · ON DEVICE':'SAMPLE · NO AI USED'}</span><span>3 small missions</span></div>
     <div className="missions">{missions.map((m,i)=>{const Icon=icons[m.sense]||Eye;return <article className={complete.includes(m.id)?'mission done':'mission'} key={m.id}><span className="mission-number">0{i+1}</span><div><div className="mission-label"><Icon size={15}/>{m.sense}<span>{m.minutes} min</span></div><h3>{m.title}</h3><p>{m.text}</p></div><button className="check" onClick={()=>setComplete(c=>c.includes(m.id)?c.filter(id=>id!==m.id):[...c,m.id])} aria-label={`Mark ${m.title} ${complete.includes(m.id)?'incomplete':'complete'}`} aria-pressed={complete.includes(m.id)}>{complete.includes(m.id)&&<Check size={18}/>}</button></article>})}</div>
     <div className="card-actions"><button onClick={()=>setPocket(!pocket)} className="primary">{pocket?<><X size={18}/>Close pocket view</>:<>Ready. Let's go outside.<Leaf size={18}/></>}</button><div><button className="icon-button" onClick={()=>window.print()} aria-label="Print pocket card"><Printer size={20}/></button><button className="icon-button" onClick={download} aria-label="Download pocket card as text"><Download size={20}/></button></div></div>
     <p className="care">Stay somewhere safe and permitted. Leave plants and wildlife as you find them.</p>{complete.length===3&&<p className="finish" role="status">Three little things noticed. That's enough for today.</p>}
    </section>
   </div>
   <section id="about" className="about"><div><p className="eyebrow">SMALL TECHNOLOGY. REAL OUTDOORS.</p><h2>The AI helps you choose.<br/>The rest is yours.</h2></div><div><p>Offscreen matches your idea with a small, curated collection of observation prompts. An open embedding model reads the meaning of your words. Time, place and variety shape the final three.</p><p>It does not invent routes, identify plants or check local conditions. Model files come from Hugging Face and the runtime from jsDelivr; your idea is processed locally. The sample card works without AI.</p><a href="https://huggingface.co/Xenova/all-MiniLM-L6-v2" target="_blank" rel="noreferrer">Meet the open model <ArrowUpRight size={15}/></a></div></section>
  </main><footer><span>OFFSCREEN / MS ROBOTIKA</span><span>Made for the Hacktoberfest Open-Source AI Challenge</span><a href="/ATTRIBUTION.txt">Photo & model credits</a></footer>
 </div>
}
