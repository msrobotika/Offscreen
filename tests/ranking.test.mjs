import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {selectMissions} from '../public/ai/rank.mjs';
const missions=JSON.parse(readFileSync(new URL('../public/missions.json',import.meta.url)));
test('budget, location and variety constraints survive every possible highest ranked mission',()=>{
 for(let preferred=0;preferred<missions.length;preferred++)for(const minutes of [6,10,15])for(const setting of ['park','street','garden','any']){
  const vectors=missions.map((_,i)=>[i===preferred?1:0.1]);
  const selected=selectMissions(missions,vectors,[1],{setting,minutes});
  assert.equal(selected.length,3);
  assert.equal(new Set(selected.map(x=>x.id)).size,3);
  assert.equal(new Set(selected.map(x=>x.sense)).size,3);
  assert.ok(selected.reduce((n,m)=>n+m.minutes,0)<=minutes);
  assert.ok(selected.every(m=>setting==='any'||m.settings.includes('any')||m.settings.includes(setting)));
 }
});
