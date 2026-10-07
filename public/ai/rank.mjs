// Exact constrained selection: don't let one long mission crowd out the other two.
export function selectMissions(missions, vectors, query, {setting='any', minutes=10}={}) {
 const ranked=missions.map((mission,i)=>({mission,score:vectors[i].reduce((n,x,j)=>n+x*query[j],0)}))
  .filter(({mission:m})=>m.settings.includes('any')||setting==='any'||m.settings.includes(setting))
  .sort((a,b)=>b.score-a.score);
 let best=[],bestScore=-Infinity;
 for(let a=0;a<ranked.length;a++)for(let b=a+1;b<ranked.length;b++)for(let c=b+1;c<ranked.length;c++){
  const group=[ranked[a],ranked[b],ranked[c]];
  if(new Set(group.map(x=>x.mission.sense)).size!==3)continue;
  if(group.reduce((n,x)=>n+x.mission.minutes,0)>minutes)continue;
  const score=group.reduce((n,x)=>n+x.score,0);
  if(score>bestScore){best=group;bestScore=score;}
 }
 return best.map(({mission,score})=>({...mission,score}));
}
export function missionDocument(m) {return `${m.title}. ${m.text} ${m.keywords}`;}
