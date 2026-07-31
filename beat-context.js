function saveSelectedBeatContext(){
 const id=document.querySelector('#presetSelect')?.value||state.selectedPreset;
 const preset=presets[id];
 if(!id||!preset)return;
 localStorage.setItem('rhythmLabSelectedBeat',JSON.stringify({id,name:preset.name,category:preset.category,bpm:preset.bpm,meter:preset.meter}));
}

function syncSelectedBeat({resume=false}={}){
 const select=document.querySelector('#presetSelect');
 const id=select?.value;
 if(!id||!presets[id]||typeof loadPreset!=='function')return;
 const wasPlaying=Boolean(state?.isPlaying);
 if(wasPlaying&&typeof stop==='function')stop();
 loadPreset(id);
 saveSelectedBeatContext();
 if((resume||wasPlaying)&&typeof start==='function')start();
}

const beatSelect=document.querySelector('#presetSelect');
const categorySelect=document.querySelector('#categorySelect');

beatSelect?.addEventListener('change',()=>syncSelectedBeat());
categorySelect?.addEventListener('change',()=>{
 queueMicrotask(()=>{
  if(typeof buildPresetUI==='function')buildPresetUI();
  syncSelectedBeat();
 });
});

document.querySelector('#playButton')?.addEventListener('pointerdown',()=>{
 const id=beatSelect?.value;
 if(id&&presets[id]&&state.selectedPreset!==id&&!state.isPlaying)loadPreset(id);
},{capture:true});

document.querySelector('.feature-page-link')?.addEventListener('click',saveSelectedBeatContext);

setTimeout(()=>{
 if(typeof buildCategories==='function'&&typeof buildPresetUI==='function'){
  const currentCategory=categorySelect?.value||'all';
  if(categorySelect){
   categorySelect.innerHTML='<option value="all">すべて</option>';
   buildCategories();
   if([...categorySelect.options].some(option=>option.value===currentCategory))categorySelect.value=currentCategory;
  }
  buildPresetUI();
 }
 syncSelectedBeat();
},0);