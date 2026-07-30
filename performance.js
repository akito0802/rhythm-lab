const performanceState={mode:'normal',velocity:100,humanize:0,kit:'studio',stepData:{},openHatVoices:[]};
const kitProfiles={
 studio:{name:'Studio',pitch:1,decay:1,noise:1,filter:1},
 electronic:{name:'Electronic',pitch:1.18,decay:.72,noise:.82,filter:1.18},
 vintage:{name:'Vintage',pitch:.88,decay:1.18,noise:.9,filter:.82},
 lofi:{name:'Lo-Fi',pitch:.78,decay:.62,noise:.62,filter:.58}
};
function ensureStepData(){tracks.forEach(t=>{if(!performanceState.stepData[t.id])performanceState.stepData[t.id]=[];for(let i=0;i<effectiveSteps();i++)if(!performanceState.stepData[t.id][i])performanceState.stepData[t.id][i]={expression:'normal',velocity:100}})}
function getStepMeta(id,i){ensureStepData();return performanceState.stepData[id][i]||{expression:'normal',velocity:100}}
function setStepMeta(id,i,meta){ensureStepData();performanceState.stepData[id][i]={...getStepMeta(id,i),...meta}}
function gainFor(meta){const v=Math.max(.05,Math.min(1.25,(meta.velocity??100)/100));if(meta.expression==='accent')return v*1.22;if(meta.expression==='ghost')return v*.34;return v}
function humanized(time,meta){const amount=performanceState.humanize/100;return {time:Math.max(state.audioContext.currentTime,time+((Math.random()*2-1)*.018*amount)),gain:gainFor(meta)*(1+((Math.random()*2-1)*.13*amount))}}
function chokeOpenHat(time){performanceState.openHatVoices=performanceState.openHatVoices.filter(v=>{try{v.gain.gain.cancelScheduledValues(time);v.gain.gain.setTargetAtTime(.001,time,.012);v.source.stop(time+.05)}catch{}return false})}
const originalTriggerSound=triggerSound;
triggerSound=function(id,time,meta={expression:'normal',velocity:100}){
 const c=state.audioContext,o=state.masterGain,t=tracks.find(x=>x.id===id);if(!c||!o||!t)return;
 const profile=kitProfiles[performanceState.kit]||kitProfiles.studio;
 const hit=humanized(time,meta);const when=hit.time;const amp=hit.gain;
 const fire=(offset=0,scale=1)=>synthHit(id,when+offset,amp*scale,profile);
 if(meta.expression==='flam'){fire(0,.58);fire(.035,1)}else if(meta.expression==='roll'){fire(0,.72);fire(.045,.85);fire(.09,1)}else fire();
};
function synthHit(id,time,amp,profile){
 const c=state.audioContext,o=state.masterGain,t=tracks.find(x=>x.id===id);if(!t)return;const idx=tracks.indexOf(t);
 if(id==='closedHat'||id==='pedalHat')chokeOpenHat(time);
 if(t.type==='kick'){
  const osc=c.createOscillator(),g=c.createGain();osc.type=performanceState.kit==='electronic'?'square':'sine';osc.frequency.setValueAtTime(150*profile.pitch,time);osc.frequency.exponentialRampToValueAtTime(42*profile.pitch,time+.16*profile.decay);g.gain.setValueAtTime(Math.min(1.4,amp),time);g.gain.exponentialRampToValueAtTime(.001,time+.4*profile.decay);osc.connect(g).connect(o);osc.start(time);osc.stop(time+.45*profile.decay);return;
 }
 if(['noise','hat','cymbal'].includes(t.type)){
  const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=noiseBuffer();f.type=performanceState.kit==='lofi'?'lowpass':'highpass';const base=t.type==='hat'?5200:t.type==='cymbal'?2800:900;f.frequency.value=(base+(idx%4)*650)*profile.filter;const dur=(id==='openHat'||t.type==='cymbal'?.42:id==='shaker'?.08:.16)*profile.decay;g.gain.setValueAtTime((t.type==='cymbal'?.28:.52)*amp*profile.noise,time);g.gain.exponentialRampToValueAtTime(.001,time+dur);s.connect(f).connect(g).connect(o);s.start(time);s.stop(time+dur+.04);if(id==='openHat')performanceState.openHatVoices.push({source:s,gain:g});return;
 }
 const osc=c.createOscillator(),g=c.createGain();osc.type=t.type==='metal'?'triangle':performanceState.kit==='electronic'?'square':'sine';const freq=(t.type==='tom'?95+(idx%6)*28:t.type==='metal'?700+(idx%4)*240:320+(idx%5)*90)*profile.pitch;osc.frequency.setValueAtTime(freq,time);if(t.type==='tom')osc.frequency.exponentialRampToValueAtTime(freq*.65,time+.16*profile.decay);g.gain.setValueAtTime(.65*amp,time);g.gain.exponentialRampToValueAtTime(.001,time+(t.type==='metal'?.34:.18)*profile.decay);osc.connect(g).connect(o);osc.start(time);osc.stop(time+.38*profile.decay);
}
const originalToggleStep=toggleStep;
toggleStep=function(id,i,b){ensureAudio();ensureStepData();const active=!!state.pattern[id][i];const chosen=performanceState.mode;
 if(!active){state.pattern[id][i]=true;setStepMeta(id,i,{expression:chosen,velocity:performanceState.velocity})}
 else{const current=getStepMeta(id,i).expression;if(chosen!=='normal'&&current!==chosen)setStepMeta(id,i,{expression:chosen,velocity:performanceState.velocity});else if(chosen==='normal'&&current!=='normal')setStepMeta(id,i,{expression:'normal',velocity:performanceState.velocity});else state.pattern[id][i]=false}
 state.selectedPreset=null;renderPattern();if(state.pattern[id][i])triggerSound(id,state.audioContext.currentTime,getStepMeta(id,i));
};
const originalRenderPattern=renderPattern;
renderPattern=function(){originalRenderPattern();ensureStepData();document.querySelectorAll('.track-row').forEach(row=>row.querySelectorAll('.step').forEach((b,i)=>{const meta=getStepMeta(row.dataset.track,i);b.dataset.expression=meta.expression||'normal';b.dataset.velocityLevel=meta.velocity>=115?'high':meta.velocity<=55?'low':'mid';b.title=state.pattern[row.dataset.track]?.[i]?`${meta.expression}・Velocity ${meta.velocity}`:'クリックで配置'}))};
const originalLoadPreset=loadPreset;
loadPreset=function(id){performanceState.stepData={};originalLoadPreset(id);ensureStepData();renderPattern()};
playCurrentStep=function(){const n=effectiveSteps();document.querySelectorAll('.step.is-current').forEach(s=>s.classList.remove('is-current'));document.querySelectorAll(`.step[data-step="${state.currentStep}"]`).forEach(s=>s.classList.add('is-current'));els.beat.textContent=Math.floor(state.currentStep/4)+1;els.sub.textContent=['1','e','&','a'][state.currentStep%4];const time=state.audioContext.currentTime;if(state.metronome&&state.currentStep%4===0)clickSound(time,state.currentStep===0);tracks.forEach(t=>state.pattern[t.id]?.[state.currentStep]&&triggerSound(t.id,time,getStepMeta(t.id,state.currentStep)));const current=state.currentStep;state.currentStep=(state.currentStep+1)%n;state.timer=setTimeout(playCurrentStep,stepDurationMs(current))};
const originalClear=clear;
clear=function(){performanceState.stepData={};originalClear();ensureStepData();renderPattern()};
const originalSavePattern=savePattern;
savePattern=function(){localStorage.setItem('rhythmLabPattern',JSON.stringify({pattern:state.pattern,bpm:state.bpm,swing:state.swing,meter:state.meter,stepCount:state.stepCount,stepData:performanceState.stepData,performance:{humanize:performanceState.humanize,kit:performanceState.kit,velocity:performanceState.velocity}}));els.save.textContent='保存済み ✓';setTimeout(()=>els.save.textContent='保存',1200)};
function restorePerformance(){try{const s=JSON.parse(localStorage.getItem('rhythmLabPattern'));if(!s)return;if(s.stepData)performanceState.stepData=s.stepData;if(s.performance)Object.assign(performanceState,s.performance)}catch{}}
function bindPerformanceUI(){
 const modeButtons=document.querySelectorAll('[data-expression-mode]');modeButtons.forEach(btn=>btn.addEventListener('click',()=>{performanceState.mode=btn.dataset.expressionMode;modeButtons.forEach(x=>x.classList.toggle('is-selected',x===btn))}));
 const velocity=document.querySelector('#velocityInput'),velocityValue=document.querySelector('#velocityValue');velocity.value=performanceState.velocity;velocityValue.textContent=performanceState.velocity;velocity.addEventListener('input',e=>{performanceState.velocity=+e.target.value;velocityValue.textContent=e.target.value});
 const humanize=document.querySelector('#humanizeInput'),humanizeValue=document.querySelector('#humanizeValue');humanize.value=performanceState.humanize;humanizeValue.textContent=`${performanceState.humanize}%`;humanize.addEventListener('input',e=>{performanceState.humanize=+e.target.value;humanizeValue.textContent=`${e.target.value}%`});
 const kit=document.querySelector('#drumKitSelect');kit.value=performanceState.kit;kit.addEventListener('change',e=>{performanceState.kit=e.target.value;document.querySelector('#kitSummary').textContent=`24 INSTRUMENTS・${kitProfiles[performanceState.kit].name.toUpperCase()}`});
 document.querySelector('#kitSummary').textContent=`24 INSTRUMENTS・${kitProfiles[performanceState.kit].name.toUpperCase()}`;
}
restorePerformance();ensureStepData();bindPerformanceUI();buildSequencer();renderPattern();
