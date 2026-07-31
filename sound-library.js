const soundLibraryGroups={
  'Natural Acoustic':['Natural Studio','Warm Vintage','Jazz Room'],
  'Acoustic Drums':['Studio Kit','Rock Kit','Pop Kit','Jazz Kit','Funk Kit','Blues Kit','Metal Kit','Punk Kit','Vintage Kit','Dry Studio','Arena Kit','Fusion Kit'],
  'Electronic Drums':['TR-808','TR-909','TR-707','TR-606','LinnDrum','DMX','CR-78','Simmons SDS-V','DrumBrute','Elektron Style'],
  'Lo-Fi':['Vinyl Kit','Cassette Kit','Tape Saturation','Dust Kit','Bedroom Kit','Coffee Shop Kit'],
  'Latin Percussion':['Conga','Bongo','Timbale','Cowbell','Claves','Guiro','Cabasa','Agogo','Maracas','Cuica'],
  'World Percussion':['Djembe','Cajon','Darbuka','Tabla','Taiko','Udu','Frame Drum','Bodhran','Steel Pan'],
  'Cymbals':['Bright Crash','Dark Crash','Splash','China','Ride','Bell Ride','Stack Cymbal','Trash Cymbal'],
  'Hand Percussion':['Hand Clap','Finger Snap','Finger Click','Tambourine','Shaker','Egg Shaker','Triangle','Wood Block'],
  'Electronic FX':['Noise Sweep','Reverse Cymbal','Impact','Downlifter','Uplifter','Glitch','Laser','FX Hit'],
  'Bass Percussion':['808 Kick','Sub Kick','Deep Kick','Punch Kick','Analog Kick','Hybrid Kick'],
  'Snare Library':['Tight Snare','Rock Snare','Jazz Snare','Brush Snare','Electronic Snare','Rimshot','Side Stick','Piccolo Snare'],
  'Hi-Hat Library':['Closed HH','Half Open HH','Open HH','Pedal HH','Loose HH','Tight HH','Electronic HH'],
  'Special Sounds':['Beatbox','Stomp','Clap Ensemble','Snap Ensemble','Crowd Clap','Orchestral Hit','Clock','Typewriter','Bottle','Can Hit']
};

function slugSoundName(name){return 'lib-'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}

function profileForSound(name,group,index){
  const seed=[...name].reduce((sum,ch)=>sum+ch.charCodeAt(0),0);
  const base={name,pitch:1,decay:1,noise:1,filter:1};
  if(group==='Natural Acoustic')Object.assign(base,{acousticModel:true,pitch:name==='Warm Vintage'?.92:name==='Jazz Room'?1.04:1,decay:name==='Jazz Room'?1.22:name==='Warm Vintage'?1.08:1,noise:name==='Warm Vintage'?.84:1,filter:name==='Warm Vintage'?.82:1,room:name==='Jazz Room'?.2:name==='Natural Studio'?.12:.08});
  if(group==='Acoustic Drums')Object.assign(base,{pitch:.9+(seed%22)/100,decay:.82+(seed%42)/100,noise:.86+(seed%24)/100,filter:.86+(seed%26)/100});
  if(group==='Electronic Drums')Object.assign(base,{pitch:1.02+(seed%30)/100,decay:.58+(seed%36)/100,noise:.66+(seed%35)/100,filter:1.02+(seed%38)/100});
  if(group==='Lo-Fi')Object.assign(base,{pitch:.68+(seed%22)/100,decay:.5+(seed%28)/100,noise:.48+(seed%26)/100,filter:.46+(seed%24)/100});
  if(['Latin Percussion','World Percussion','Hand Percussion'].includes(group))Object.assign(base,{pitch:.92+(seed%34)/100,decay:.66+(seed%35)/100,noise:.7+(seed%32)/100,filter:.84+(seed%38)/100});
  if(group==='Cymbals')Object.assign(base,{pitch:1.05+(seed%35)/100,decay:1.12+(seed%60)/100,noise:1.02+(seed%34)/100,filter:1.08+(seed%42)/100});
  if(group==='Electronic FX')Object.assign(base,{pitch:.72+(seed%75)/100,decay:.72+(seed%80)/100,noise:.82+(seed%55)/100,filter:.72+(seed%85)/100});
  if(group==='Bass Percussion')Object.assign(base,{pitch:.58+(seed%30)/100,decay:.9+(seed%62)/100,noise:.62+(seed%28)/100,filter:.62+(seed%26)/100});
  if(group==='Snare Library')Object.assign(base,{pitch:.92+(seed%34)/100,decay:.58+(seed%44)/100,noise:.92+(seed%42)/100,filter:.84+(seed%46)/100});
  if(group==='Hi-Hat Library')Object.assign(base,{pitch:1.08+(seed%42)/100,decay:.48+(seed%40)/100,noise:.9+(seed%38)/100,filter:1.14+(seed%48)/100});
  if(group==='Special Sounds')Object.assign(base,{pitch:.72+(seed%62)/100,decay:.58+(seed%60)/100,noise:.64+(seed%50)/100,filter:.68+(seed%66)/100});
  return base;
}

Object.entries(soundLibraryGroups).forEach(([group,names])=>{
  names.forEach((name,index)=>{kitProfiles[slugSoundName(name)]=profileForSound(name,group,index)});
});

function buildSoundLibrarySelect(){
  const select=document.querySelector('#drumKitSelect');
  if(!select)return;
  select.innerHTML='';
  Object.entries(soundLibraryGroups).forEach(([group,names])=>{
    const optgroup=document.createElement('optgroup');optgroup.label=group;
    names.forEach(name=>{const option=document.createElement('option');option.value=slugSoundName(name);option.textContent=name;optgroup.appendChild(option)});
    select.appendChild(optgroup);
  });
  if(!kitProfiles[performanceState.kit])performanceState.kit=slugSoundName('Natural Studio');
  select.value=performanceState.kit;
  syncPerformanceUI();
}

const basicSynthHit=synthHit;
let acousticRoundRobin=0;
function acousticNoise(c,duration){
  const length=Math.max(1,Math.floor(c.sampleRate*duration));
  const b=c.createBuffer(1,length,c.sampleRate),data=b.getChannelData(0);
  let last=0;
  for(let i=0;i<length;i++){const white=Math.random()*2-1;last=last*.18+white*.82;data[i]=last*(1-i/length*.12)}
  return b;
}
function acousticEnvelope(g,time,peak,duration,attack=.002){
  g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(Math.max(.001,peak),time+attack);g.gain.exponentialRampToValueAtTime(.0001,time+duration);
}
function connectRoom(c,node,out,time,amount,duration){
  node.connect(out);if(!amount)return;
  const delay=c.createDelay(.2),gain=c.createGain(),filter=c.createBiquadFilter();delay.delayTime.value=.045+(acousticRoundRobin%3)*.008;gain.gain.value=amount;filter.type='lowpass';filter.frequency.value=4800;node.connect(delay).connect(filter).connect(gain).connect(out);gain.gain.setValueAtTime(amount,time);gain.gain.exponentialRampToValueAtTime(.0001,time+duration+.5);
}
function naturalKick(c,out,time,amp,p){
  const body=c.createOscillator(),click=c.createBufferSource(),bg=c.createGain(),cg=c.createGain(),cf=c.createBiquadFilter();
  body.type='sine';body.frequency.setValueAtTime((92+(acousticRoundRobin%4)*2)*p.pitch,time);body.frequency.exponentialRampToValueAtTime(44*p.pitch,time+.12);acousticEnvelope(bg,time,amp*.95,.48*p.decay,.001);
  click.buffer=acousticNoise(c,.035);cf.type='bandpass';cf.frequency.value=2500*p.filter;cf.Q.value=.8;acousticEnvelope(cg,time,amp*.22,.035,.001);
  body.connect(bg);click.connect(cf).connect(cg);connectRoom(c,bg,out,time,p.room,.5);connectRoom(c,cg,out,time,p.room*.35,.08);body.start(time);body.stop(time+.52*p.decay);click.start(time);click.stop(time+.05);
}
function naturalSnare(c,out,time,amp,p,side=false){
  const noise=c.createBufferSource(),ng=c.createGain(),nf=c.createBiquadFilter(),tone=c.createOscillator(),tg=c.createGain();
  noise.buffer=acousticNoise(c,side?.09:.25);nf.type='bandpass';nf.frequency.value=(side?1900:1500)*p.filter;nf.Q.value=side?2.5:.65;acousticEnvelope(ng,time,amp*(side?.52:.75)*p.noise,side?.1:.24*p.decay,.001);
  tone.type='triangle';tone.frequency.value=(side?420:185)*p.pitch;acousticEnvelope(tg,time,amp*(side?.28:.42),side?.08:.18*p.decay,.001);
  noise.connect(nf).connect(ng);tone.connect(tg);connectRoom(c,ng,out,time,p.room,.28);connectRoom(c,tg,out,time,p.room*.7,.2);noise.start(time);noise.stop(time+.3);tone.start(time);tone.stop(time+.22);
}
function naturalTom(c,out,time,amp,p,id){
  const freq={highTom:175,midTom:132,floorTom:92,conga:205,bongo:265,timbale:225}[id]||150;
  const osc=c.createOscillator(),g=c.createGain(),n=c.createBufferSource(),ng=c.createGain(),f=c.createBiquadFilter();osc.type='sine';osc.frequency.setValueAtTime((freq+(acousticRoundRobin%3)*2)*p.pitch,time);osc.frequency.exponentialRampToValueAtTime(freq*.7*p.pitch,time+.2);acousticEnvelope(g,time,amp*.72,.38*p.decay,.001);n.buffer=acousticNoise(c,.045);f.type='bandpass';f.frequency.value=2300;acousticEnvelope(ng,time,amp*.14,.045,.001);osc.connect(g);n.connect(f).connect(ng);connectRoom(c,g,out,time,p.room,.4);connectRoom(c,ng,out,time,p.room*.3,.08);osc.start(time);osc.stop(time+.42*p.decay);n.start(time);n.stop(time+.06);
}
function naturalMetal(c,out,time,amp,p,id){
  const src=c.createBufferSource(),g=c.createGain(),hp=c.createBiquadFilter();src.buffer=acousticNoise(c,id==='openHat'||['crash','ride','splash','china'].includes(id)?1.5:.35);hp.type='highpass';hp.frequency.value=(id==='ride'?3600:id==='crash'?2800:id==='openHat'?5200:6500)*p.filter;const dur=id==='openHat'?.65:['crash','ride','china'].includes(id)?1.25:id==='splash'?.65:.13;acousticEnvelope(g,time,amp*(id==='closedHat'?.28:.38)*p.noise,dur*p.decay,.001);src.connect(hp).connect(g);connectRoom(c,g,out,time,p.room,dur);src.start(time);src.stop(time+dur*p.decay+.05);if(id==='openHat')performanceState.openHatVoices.push({source:src,gain:g});
}
synthHit=function(id,time,amp,profile){
  if(!profile?.acousticModel)return basicSynthHit(id,time,amp,profile);
  const c=state.audioContext,o=state.masterGain,t=tracks.find(x=>x.id===id);if(!c||!o||!t)return;acousticRoundRobin=(acousticRoundRobin+1)%12;const varied={...profile,pitch:profile.pitch*(.985+Math.random()*.03)};
  if(id==='closedHat'||id==='pedalHat')chokeOpenHat(time);
  if(t.type==='kick')return naturalKick(c,o,time,amp,varied);
  if(id==='snare'||id==='clap'||id==='rim'||id==='side')return naturalSnare(c,o,time,amp,varied,id==='rim'||id==='side');
  if(t.type==='tom')return naturalTom(c,o,time,amp,varied,id);
  if(['hat','cymbal','metal'].includes(t.type))return naturalMetal(c,o,time,amp,varied,id);
  return basicSynthHit(id,time,amp,varied);
};

buildSoundLibrarySelect();
