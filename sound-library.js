const soundLibraryGroups={
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
  if(!kitProfiles[performanceState.kit])performanceState.kit=slugSoundName('Studio Kit');
  select.value=performanceState.kit;
  syncPerformanceUI();
}

buildSoundLibrarySelect();
