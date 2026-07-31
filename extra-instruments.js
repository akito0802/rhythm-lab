// Rhythm Lab: シーケンサー追加楽器
(()=>{
 if(typeof tracks==='undefined'||typeof state==='undefined')return;
 const extras=[
  {id:'brushSnare',name:'Brush Snare',icon:'≈',color:'#f4a261',type:'noise'},
  {id:'crossStick',name:'Cross Stick',icon:'⊘',color:'#e76f51',type:'click'},
  {id:'lowTom',name:'Low Tom',icon:'▰',color:'#2a9d8f',type:'tom'},
  {id:'rotoTom',name:'Roto Tom',icon:'◈',color:'#52b788',type:'tom'},
  {id:'crash2',name:'Crash 2',icon:'✹',color:'#f6bd60',type:'cymbal'},
  {id:'rideBell',name:'Ride Bell',icon:'◉',color:'#f9c74f',type:'metal'},
  {id:'sizzleRide',name:'Sizzle Ride',icon:'≋',color:'#f4d35e',type:'cymbal'},
  {id:'stack',name:'Stack Cymbal',icon:'✣',color:'#e9c46a',type:'cymbal'},
  {id:'cabasa',name:'Cabasa',icon:'░',color:'#b5179e',type:'noise'},
  {id:'maracas',name:'Maracas',icon:'⋮',color:'#9d4edd',type:'noise'},
  {id:'agogo',name:'Agogo',icon:'♢',color:'#7b2cbf',type:'metal'},
  {id:'guiro',name:'Guiro',icon:'≡',color:'#5a189a',type:'noise'},
  {id:'vibraslap',name:'Vibraslap',icon:'⌇',color:'#3c096c',type:'metal'},
  {id:'djembe',name:'Djembe',icon:'⬯',color:'#4cc9f0',type:'tom'},
  {id:'cajon',name:'Cajon',icon:'▤',color:'#4895ef',type:'tom'},
  {id:'surdo',name:'Surdo',icon:'⬤',color:'#4361ee',type:'kick'}
 ];
 extras.forEach(track=>{
  if(!tracks.some(t=>t.id===track.id))tracks.push(track);
  const steps=Number(state.stepCount)||16;
  if(state.pattern&&!Array.isArray(state.pattern[track.id]))state.pattern[track.id]=Array(steps).fill(false);
  if(state.expressions&&!Array.isArray(state.expressions[track.id]))state.expressions[track.id]=Array(steps).fill('normal');
 });

 // 追加楽器用の専用音色
 const baseSynthHit=window.synthHit;
 function noiseBuffer(c,duration){const b=c.createBuffer(1,Math.max(1,Math.floor(c.sampleRate*duration)),c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b;}
 function env(g,t,peak,dur){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.001,peak),t+.002);g.gain.exponentialRampToValueAtTime(.0001,t+dur);}
 function extraHit(id,time,amp){
  const c=state.audioContext,o=state.masterGain;if(!c||!o)return false;
  const noise=(dur,filterType,freq,gain=.5)=>{const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=noiseBuffer(c,dur);f.type=filterType;f.frequency.value=freq;env(g,time,amp*gain,dur);s.connect(f).connect(g).connect(o);s.start(time);s.stop(time+dur+.02);};
  const tone=(freq,dur,type='sine',gain=.5)=>{const osc=c.createOscillator(),g=c.createGain();osc.type=type;osc.frequency.value=freq;env(g,time,amp*gain,dur);osc.connect(g).connect(o);osc.start(time);osc.stop(time+dur+.02);};
  if(id==='brushSnare'){noise(.34,'bandpass',1450,.42);noise(.55,'highpass',4200,.16);return true;}
  if(id==='crossStick'){tone(620,.07,'triangle',.42);noise(.045,'bandpass',2500,.18);return true;}
  if(id==='lowTom'){tone(82,.48,'sine',.66);noise(.05,'bandpass',1700,.12);return true;}
  if(id==='rotoTom'){tone(245,.26,'sine',.58);tone(370,.16,'triangle',.18);return true;}
  if(id==='rideBell'){tone(1150,.75,'triangle',.34);tone(2300,.48,'sine',.18);noise(.28,'highpass',6500,.12);return true;}
  if(id==='sizzleRide'){noise(1.35,'highpass',3900,.28);tone(920,.7,'triangle',.12);return true;}
  if(id==='crash2'){noise(1.5,'highpass',2500,.42);return true;}
  if(id==='stack'){noise(.48,'bandpass',4200,.5);return true;}
  if(id==='cabasa'){noise(.18,'highpass',5200,.32);return true;}
  if(id==='maracas'){noise(.13,'highpass',6400,.30);return true;}
  if(id==='guiro'){for(let i=0;i<4;i++){const tt=time+i*.035;const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=noiseBuffer(c,.055);f.type='bandpass';f.frequency.value=2100+i*180;env(g,tt,amp*.18,.05);s.connect(f).connect(g).connect(o);s.start(tt);s.stop(tt+.07);}return true;}
  if(id==='agogo'){tone(840,.34,'sine',.42);tone(1260,.22,'triangle',.16);return true;}
  if(id==='vibraslap'){tone(430,.16,'triangle',.22);for(let i=0;i<5;i++)setTimeout(()=>{},0);noise(.65,'bandpass',1800,.28);return true;}
  if(id==='djembe'){tone(155,.34,'sine',.58);noise(.07,'bandpass',2500,.20);return true;}
  if(id==='cajon'){tone(95,.25,'sine',.48);noise(.12,'bandpass',1900,.28);return true;}
  if(id==='surdo'){const osc=c.createOscillator(),g=c.createGain();osc.type='sine';osc.frequency.setValueAtTime(88,time);osc.frequency.exponentialRampToValueAtTime(48,time+.18);env(g,time,amp*.72,.55);osc.connect(g).connect(o);osc.start(time);osc.stop(time+.58);return true;}
  return false;
 }
 if(typeof baseSynthHit==='function')window.synthHit=function(id,time,amp,profile){if(extraHit(id,time,amp))return;return baseSynthHit(id,time,amp,profile);};

 function refreshSequencer(){
  const select=document.querySelector('#stepCountSelect');
  if(select){select.dispatchEvent(new Event('change',{bubbles:true}));}
  if(typeof renderSequencer==='function')renderSequencer();
  if(typeof buildSequencer==='function')buildSequencer();
  const summary=document.querySelector('#kitSummary');if(summary)summary.textContent=`${tracks.length} INSTRUMENTS`;
 }
 setTimeout(refreshSequencer,0);
})();