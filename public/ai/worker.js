import {pipeline,env} from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/transformers.min.js';
import {selectMissions,missionDocument} from './rank.mjs';
env.allowLocalModels=false;
env.backends.onnx.wasm.numThreads=1;
const MODEL='Xenova/all-MiniLM-L6-v2';
const REVISION='751bff37182d3f1213fa05d7196b954e230abad9';
let extractor, documents, missions;
self.onmessage=async ({data})=>{
  try {
    self.postMessage({type:'status',message:extractor?'Reading your idea…':'Downloading the open model. The first run can take a minute…'});
    if(!extractor) extractor=await pipeline('feature-extraction',MODEL,{revision:REVISION,device:'wasm',dtype:'q8',progress_callback:p=>{
      if(p.status==='progress') self.postMessage({type:'status',message:`Loading ${p.file.split('/').pop()} · ${Math.round(p.progress)}%`});
    }});
    if(!missions) { const r=await fetch('/missions.json'); if(!r.ok) throw new Error('Mission catalogue unavailable');missions=await r.json(); }
    if(!documents) { self.postMessage({type:'status',message:'Reading the mission cards…'});documents=(await extractor(missions.map(missionDocument),{pooling:'mean',normalize:true})).tolist(); }
    const query=(await extractor(data.prompt,{pooling:'mean',normalize:true})).tolist()[0];
    const selected=selectMissions(missions,documents,query,data);
    if(selected.length!==3) throw new Error('Could not fit three missions into this plan.');
    self.postMessage({type:'result',missions:selected,model:MODEL});
  } catch(error) {self.postMessage({type:'error',message:error?.message||'The model could not load.'});}
};
