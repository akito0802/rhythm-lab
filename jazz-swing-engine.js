(()=>{
 if(typeof presets==='undefined')return;
 const jazzMap={
  jazzSwing:{name:'Jazz Swing Basic',bpm:132,swing:0,meter:'4/4',rideTone:'jazz',humanize:10,pattern:{ride:[0,4,8,12],pedalHat:[4,12],kick:[0,8],snare:[6,14]}},
  bebop:{name:'Bebop Comping',bpm:188,swing:0,meter:'4/4',rideTone:'bell',humanize:14,pattern:{ride:[0,4,8,12],pedalHat:[4,12],kick:[0,10],snare:[3,7,11,15]}},
  hardBop:{name:'Hard Bop Drive',bpm:154,swing:0,meter:'4/4',rideTone:'dark',humanize:11,pattern:{ride:[0,4,8,12],pedalHat:[4,12],kick:[0,6,10],snare:[7,14]}},
  coolJazz:{name:'Cool Jazz',bpm:112,swing:0,meter:'4/4',rideTone:'thin',humanize:8,pattern:{ride:[0,4,8,12],pedalHat:[4,12],kick:[0],snare:[10]}},
  modalJazz:{name:'Modal Jazz',bpm:126,swing:0,meter:'4/4',rideTone:'vintage',humanize:13,pattern:{ride:[0,4,8,12],pedalHat:[4,12],kick:[0,11],snare:[6,15]}},
  bigBandSwing:{name:'Big Band Swing',bpm:168,swing:0,meter:'4/4',rideTone:'bright',humanize:8,pattern:{ride:[0,4,8,12],pedalHat:[4,12],kick:[0,4,8,12],snare:[4,12],crash:[0]}},
  brushBallad:{name:'Brush Ballad',bpm:72,swing:0,meter:'4/4',rideTone:'vintage',humanize:16,pattern:{ride:[0,4,8,12],pedalHat:[4,12],kick:[0],snare:[6,14]}},
  jazzWaltz:{name:'Jazz Waltz',bpm:138,swing:0,meter:'3/4',rideTone:'jazz',humanize:10,pattern:{ride:[0,4,8],pedalHat:[4],kick:[0],snare:[6]}},
  newOrleansJazz:{name:'New Orleans Jazz',bpm:132,swing:0,meter:'4/4',rideTone:'bright',humanize:9,pattern:{ride:[0,4,8,12],pedalHat:[4,12],kick:[0,8],snare:[4,12],floorTom:[3,11]}},
  freeJazz:{name:'Free Jazz',bpm:176,swing:0,meter:'4/4',rideTone:'bell',humanize:20,pattern:{ride:[0,4,8,12],pedalHat:[4,12],kick:[2,9,14],snare:[3,6,11,15]}},
  latinJazz:{name:'Latin Jazz',bpm:144,swing:0,meter:'4/4',rideTone:'bright',humanize:7,straightJazz:true,pattern:{ride:[0,2,4,6,8,10,12,14],pedalHat:[4,12],kick:[0,6,10],snare:[4,12],claves:[0,5,8,13]}},
  jazzFusion:{name:'Jazz Fusion',bpm:124,swing:0,meter:'4/4',rideTone:'bright',humanize:6,straightJazz:true,pattern:{ride:[0,2,4,6,8,10,12,14],kick:[0,3,7,10,14],snare:[4,12],closedHat:[1,5,9,13]}}
 };
 Object.entries(jazzMap).forEach(([id,cfg])=>{
  const old=presets[id]||{};
  presets[id]={...old,...cfg,category:'ジャズ',difficulty:cfg.bpm>170?'上級':cfg.bpm<100?'初級':'中級',feature:cfg.straightJazz?'ストレートフィールのジャズグルーヴ':'四分音符のライドに、2拍目・4拍目後ろの三連符スキップを加えたスウィング',role:'ライドが時間を示し、ペダルハイハットが2拍目・4拍目、キックとスネアがコンピングを担当する。',practice:'まずライドとペダルハイハットだけを聴き、「チーン・チキ／チーン・チキ」と口ずさんでからコンピングを加える。',lesson:'ジャズのスウィングは均等な8分ではなく、三連符の1個目と3個目を使う長短のフィールが中心。'};
 });
 const originalSynthHit=window.synthHit;
 if(typeof originalSynthHit!=='function')return;
 let rideCount=0,lastPreset='';
 window.synthHit=function(id,time,amp,profile){
  const selected=state?.selectedPreset||document.querySelector('#presetSelect')?.value||'';
  const preset=presets[selected];
  const jazz=preset?.category==='ジャズ'&&!preset?.straightJazz;
  if(selected!==lastPreset){rideCount=0;lastPreset=selected;}
  if(jazz&&id==='ride'){
   const beatSeconds=60/(state?.bpm||preset.bpm||120);
   const count=rideCount++%4;
   originalSynthHit(id,time,amp*(count===0||count===2?0.94:1),profile);
   if(count===1||count===3){
    const skipTime=time+beatSeconds*(2/3);
    originalSynthHit(id,skipTime,amp*.60,profile);
   }
   return;
  }
  return originalSynthHit(id,time,amp,profile);
 };
 function syncJazzFeel(){
  const id=document.querySelector('#presetSelect')?.value||state?.selectedPreset;
  const p=presets[id];if(!p||p.category!=='ジャズ')return;
  if(typeof performanceState!=='undefined')performanceState.humanize=p.humanize||10;
  const h=document.querySelector('#humanizeInput');if(h){h.value=p.humanize||10;h.dispatchEvent(new Event('input',{bubbles:true}));}
  const s=document.querySelector('#swingInput');if(s){s.value=0;s.dispatchEvent(new Event('input',{bubbles:true}));}
 }
 document.querySelector('#presetSelect')?.addEventListener('change',()=>setTimeout(syncJazzFeel,0));
 setTimeout(()=>{if(typeof buildCategories==='function'){const c=document.querySelector('#categorySelect');if(c){const v=c.value;c.innerHTML='<option value="all">すべて</option>';buildCategories();c.value=[...c.options].some(o=>o.value===v)?v:'all';}}if(typeof buildPresetUI==='function')buildPresetUI();syncJazzFeel();},0);
})();