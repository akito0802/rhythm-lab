const rhythmViewDialog=document.querySelector('#rhythmViewDialog');
const rhythmViewButton=document.querySelector('#viewRhythmButton');
const rhythmViewClose=document.querySelector('#closeRhythmViewButton');
const rhythmViewGrid=document.querySelector('#rhythmViewGrid');
const rhythmViewTitle=document.querySelector('#rhythmViewTitle');
const rhythmViewDescription=document.querySelector('#rhythmViewDescription');

function getVisibleRhythm(){
  const id=document.querySelector('#presetSelect')?.value||state.selectedPreset;
  return {id,preset:presets[id]};
}

function renderRhythmView(){
  const {preset}=getVisibleRhythm();
  if(!preset)return;
  const usedTracks=tracks.filter(track=>Array.isArray(preset.pattern[track.id])&&preset.pattern[track.id].length);
  const maxStep=Math.max(15,...usedTracks.flatMap(track=>preset.pattern[track.id]));
  const stepCount=maxStep>=16?32:16;
  const instrumentNames=usedTracks.map(track=>track.name).join(' / ');
  rhythmViewTitle.textContent=`${preset.name} の配置`;
  rhythmViewDescription.innerHTML=`<strong>${preset.category}・${preset.meter}・BPM ${preset.bpm}・${preset.difficulty}</strong><br>${preset.feature}<br><span>使用楽器：${instrumentNames}</span><br><span>練習方法：${preset.practice}</span>`;
  rhythmViewGrid.style.setProperty('--view-steps',stepCount);
  rhythmViewGrid.innerHTML=`<div class="rhythm-view-timeline"><div></div>${Array.from({length:stepCount},(_,i)=>`<span class="${i%4===0?'is-beat':''}">${i%4===0?Math.floor(i/4)+1:['','e','&','a'][i%4]}</span>`).join('')}</div>`+
    usedTracks.map(track=>{
      const active=new Set(preset.pattern[track.id]);
      return `<div class="rhythm-view-row" style="--track-color:${track.color}"><div class="rhythm-view-label"><span>${track.icon}</span><strong>${track.name}</strong></div>${Array.from({length:stepCount},(_,i)=>`<div class="rhythm-view-cell ${active.has(i)?'is-on':''}" aria-label="${track.name} ${i+1}">${active.has(i)?'●':''}</div>`).join('')}</div>`;
    }).join('');
}

rhythmViewButton?.addEventListener('click',()=>{renderRhythmView();rhythmViewDialog.showModal()});
rhythmViewClose?.addEventListener('click',()=>rhythmViewDialog.close());
rhythmViewDialog?.addEventListener('click',event=>{if(event.target===rhythmViewDialog)rhythmViewDialog.close()});