(()=>{
 if(typeof presets==='undefined')return;
 const swingIds=new Set([
  'jazz_swing_basic','jazz_bebop','jazz_hard_bop','jazz_cool','jazz_modal',
  'jazz_waltz','jazz_brush_ballad','jazz_new_orleans','jazz_big_band','jazz_free'
 ]);
 const straightIds=new Set(['jazz_fusion','jazz_latin']);

 const swingPatterns={
  jazz_swing_basic:{ride:[0,4,8,12],pedalHat:[4,12],kick:[0,10],snare:[6,14]},
  jazz_bebop:{ride:[0,4,8,12],pedalHat:[4,12],kick:[0,10],snare:[3,7,11,15]},
  jazz_hard_bop:{ride:[0,4,8,12],pedalHat:[4,12],kick:[0,6,10],snare:[7,14]},
  jazz_cool:{ride:[0,4,8,12],pedalHat:[4,12],kick:[0],snare:[10]},
  jazz_modal:{ride:[0,4,8,12],pedalHat:[4,12],kick:[0,11],snare:[6,15],floorTom:[10]},
  jazz_waltz:{ride:[0,4,8],pedalHat:[4,8],kick:[0],snare:[6,10]},
  jazz_brush_ballad:{ride:[0,8],pedalHat:[4,12],kick:[0],snare:[2,6,10,14]},
  jazz_new_orleans:{ride:[0,4,8,12],pedalHat:[4,12],kick:[0,6,8,14],snare:[3,7,11,15],floorTom:[11]},
  jazz_big_band:{ride:[0,4,8,12],pedalHat:[4,12],kick:[0,8],snare:[7,15],crash:[0,12]},
  jazz_free:{ride:[0,4,8,12],pedalHat:[4,12],kick:[1,9,14],snare:[3,10,13],highTom:[2,12],floorTom:[6]}
 };
 Object.entries(swingPatterns).forEach(([id,pattern])=>{if(presets[id]){presets[id].pattern=pattern;presets[id].swing=0;presets[id].feature='四分音符のライドに、2拍目・4拍目後ろの三連符スキップを加えたスウィング';}});

 const previousSynthHit=window.synthHit;
 if(typeof previousSynthHit!=='function')return;
 let selectedId='';
 let rideBeat=0;

 window.synthHit=function(id,time,amp,profile){
  const current=state?.selectedPreset||document.querySelector('#presetSelect')?.value||'';
  if(current!==selectedId){selectedId=current;rideBeat=0;}
  if(swingIds.has(current)&&id==='ride'){
   const preset=presets[current];
   const beatSeconds=60/(state?.bpm||preset?.bpm||120);
   const beatIndex=rideBeat++%(current==='jazz_waltz'?3:4);
   previousSynthHit(id,time,amp*(beatIndex===0?0.96:0.82),profile);
   const addSkip=current==='jazz_waltz'?beatIndex>0:(beatIndex===1||beatIndex===3);
   if(addSkip)previousSynthHit(id,time+beatSeconds*(2/3),amp*.52,profile);
   return;
  }
  return previousSynthHit(id,time,amp,profile);
 };

 function applyFeel(){
  const id=document.querySelector('#presetSelect')?.value||state?.selectedPreset||'';
  if(!swingIds.has(id)&&!straightIds.has(id))return;
  const p=presets[id];
  const swing=document.querySelector('#swingInput');
  if(swing){swing.value=0;swing.dispatchEvent(new Event('input',{bubbles:true}));}
  if(typeof performanceState!=='undefined')performanceState.humanize=p?.humanize||10;
  const humanize=document.querySelector('#humanizeInput');
  if(humanize){humanize.value=p?.humanize||10;humanize.dispatchEvent(new Event('input',{bubbles:true}));}
 }
 document.querySelector('#presetSelect')?.addEventListener('change',()=>setTimeout(applyFeel,0));
 document.querySelector('#playButton')?.addEventListener('pointerdown',applyFeel,{capture:true});
 setTimeout(()=>{if(typeof buildPresetUI==='function')buildPresetUI();applyFeel();},0);
})();