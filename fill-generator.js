const fillGeneratorState={lastGenerated:null};

function currentBasePreset(){
 const id=document.querySelector('#presetSelect')?.value||state.selectedPreset;
 return {id,preset:presets[id]};
}
function usedTrackIds(preset){return Object.keys(preset?.pattern||{}).filter(id=>Array.isArray(preset.pattern[id])&&preset.pattern[id].length)}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}
function uniqueSorted(arr){return [...new Set(arr)].sort((a,b)=>a-b)}
function makeVelocity(i,total,intensity){
 const base=intensity==='soft'?72:intensity==='wild'?96:84;
 const rise=Math.round((i/Math.max(1,total-1))*(intensity==='wild'?31:22));
 return Math.min(127,base+rise+Math.floor(Math.random()*7-3));
}
function genreProfile(category){
 const map={
  'ロック':{tracks:['snare','highTom','midTom','floorTom'],style:'toms'},'ポップス':{tracks:['snare','highTom','midTom'],style:'clean'},
  'EDM':{tracks:['snare','clap','closedHat'],style:'build'},'ヒップホップ':{tracks:['snare','rim','closedHat','kick'],style:'linear'},
  'ファンク':{tracks:['snare','kick','highTom','openHat'],style:'ghost'},'ジャズ':{tracks:['snare','highTom','floorTom','ride'],style:'swing'},
  'ラテン':{tracks:['timbale','conga','highTom','cowbell'],style:'latin'},'ブルース':{tracks:['snare','highTom','floorTom'],style:'shuffle'},
  'ワールド':{tracks:['conga','timbale','floorTom','shaker'],style:'world'},'変拍子':{tracks:['snare','highTom','midTom','floorTom'],style:'odd'}
 };
 return map[category]||{tracks:['snare','highTom','midTom','floorTom'],style:'toms'};
}
function generateFillFromBeat(){
 const {preset}=currentBasePreset();if(!preset)return;
 const length=+(document.querySelector('#generatedFillLength')?.value||8);
 const intensity=document.querySelector('#generatedFillIntensity')?.value||'normal';
 const profile=genreProfile(preset.category);
 const baseUsed=usedTrackIds(preset);
 const available=profile.tracks.filter(id=>tracks.some(t=>t.id===id));
 const pool=available.length?available:['snare','highTom','floorTom'];
 const density=intensity==='soft'?.5:intensity==='wild'?.95:.72;
 const hitCount=Math.max(2,Math.round(length*density));
 const positions=[];
 for(let i=0;i<length;i++){
  const chance=(i===length-1?1:density*(.82+i/length*.26));
  if(Math.random()<chance)positions.push(i);
 }
 while(positions.length<hitCount){positions.push(Math.floor(Math.random()*length));}
 const steps=uniqueSorted(positions).slice(0,Math.min(length,hitCount+2));
 const pattern={},meta={};
 steps.forEach((step,index)=>{
  let track;
  if(profile.style==='build')track=index<Math.floor(steps.length*.7)?'snare':pick(['snare','clap']);
  else if(profile.style==='linear')track=pool[index%pool.length];
  else if(profile.style==='ghost')track=index%3===0?'kick':pool[index%pool.length];
  else track=pool[Math.min(pool.length-1,Math.floor(index/Math.max(1,Math.ceil(steps.length/pool.length))))];
  if(!pattern[track])pattern[track]=[];pattern[track].push(step);
  if(!meta[track])meta[track]={};
  let expression='normal';
  if(step===length-1)expression=intensity==='soft'?'accent':'flam';
  else if(intensity==='wild'&&index>steps.length*.65&&Math.random()<.45)expression='roll';
  else if((profile.style==='ghost'||profile.style==='swing')&&index%2===0)expression='ghost';
  else if(index===0||index%4===0)expression='accent';
  meta[track][step]=[expression,makeVelocity(index,steps.length,intensity)];
 });
 if(baseUsed.includes('crash')&&intensity==='wild'){pattern.crash=[length-1];meta.crash={};meta.crash[length-1]=['accent',127];}
 const generated={name:`${preset.name}向け・${length===4?'1拍':length===8?'2拍':'1小節'}フィル`,genre:preset.category,length,difficulty:intensity==='soft'?'初級':intensity==='wild'?'上級':'中級',description:`${preset.name}（BPM ${preset.bpm}・${preset.meter}）の楽器構成とジャンル感をもとに自動生成したフィル。`,pattern,meta};
 drumFills.generated=generated;fillGeneratorState.lastGenerated=generated;
 const genre=document.querySelector('#fillGenre');if(genre)genre.value='all';
 const lengthSelect=document.querySelector('#fillLength');if(lengthSelect)lengthSelect.value=String(length);
 renderFillCards();
 document.querySelector('[data-preview-fill="generated"]')?.scrollIntoView({behavior:'smooth',block:'center'});
 const result=document.querySelector('#generatedFillResult');if(result)result.innerHTML=`<strong>${generated.name}</strong><span>${generated.genre}・${generated.difficulty}・BPM ${preset.bpm}</span><small>${generated.description}</small>`;
}
function saveBeatContext(){
 const {id,preset}=currentBasePreset();if(!id||!preset)return;
 localStorage.setItem('rhythmLabSelectedBeat',JSON.stringify({id,bpm:preset.bpm,meter:preset.meter,category:preset.category,name:preset.name}));
}
function restoreBeatContext(){
 try{const saved=JSON.parse(localStorage.getItem('rhythmLabSelectedBeat'));if(saved?.id&&presets[saved.id]){loadPreset(saved.id);document.querySelector('#presetSelect').value=saved.id;}}catch{}
}
function insertFillGenerator(){
 const base=document.querySelector('.fill-base-picker');if(!base)return;
 const box=document.createElement('section');box.className='panel fill-generator-panel';
 box.innerHTML=`<div class="fill-generator-head"><div><span class="section-kicker">SMART FILL</span><h2>選択したビートに合うおかずを生成</h2><p>ジャンル・BPM・拍子・使用楽器を分析してフィルを作るよ。</p></div></div><div class="fill-generator-controls"><label><span>長さ</span><select id="generatedFillLength"><option value="4">1拍</option><option value="8" selected>2拍</option><option value="16">1小節</option></select></label><label><span>派手さ</span><select id="generatedFillIntensity"><option value="soft">控えめ</option><option value="normal" selected>標準</option><option value="wild">派手</option></select></label><button id="generateFillButton" type="button">このビートに合わせて生成</button></div><div id="generatedFillResult" class="generated-fill-result"><span>土台のビートを選んで生成してね。</span></div>`;
 base.insertAdjacentElement('afterend',box);
 document.querySelector('#generateFillButton').addEventListener('click',generateFillFromBeat);
 document.querySelector('#presetSelect')?.addEventListener('change',saveBeatContext);
 restoreBeatContext();saveBeatContext();
}
insertFillGenerator();