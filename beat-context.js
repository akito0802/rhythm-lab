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

function refreshBeatSelectors(){
 const beatSelect=document.querySelector('#presetSelect');
 const categorySelect=document.querySelector('#categorySelect');
 if(typeof buildCategories==='function'&&typeof buildPresetUI==='function'){
  const currentCategory=categorySelect?.value||'all';
  const currentBeat=beatSelect?.value||state.selectedPreset;
  if(categorySelect){
   categorySelect.innerHTML='<option value="all">すべて</option>';
   buildCategories();
   if([...categorySelect.options].some(option=>option.value===currentCategory))categorySelect.value=currentCategory;
  }
  buildPresetUI();
  if(currentBeat&&presets[currentBeat]&&[...beatSelect.options].some(option=>option.value===currentBeat))beatSelect.value=currentBeat;
 }
}

function unifyFillInWording(){
 document.querySelectorAll('h1,h2,h3,p,li,span,strong,button,a').forEach(element=>{
  element.childNodes.forEach(node=>{
   if(node.nodeType===Node.TEXT_NODE&&node.nodeValue?.includes('おかず'))node.nodeValue=node.nodeValue.replaceAll('おかず','フィルイン');
  });
 });
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

const extraPresetScript=document.createElement('script');
extraPresetScript.src='extra-presets-2.js?v=1';
extraPresetScript.onload=()=>{
 refreshBeatSelectors();
 const selected=document.querySelector('#presetSelect')?.value;
 if(selected&&presets[selected])loadPreset(selected);
};
document.body.append(extraPresetScript);

function installNotationAndRecordedSamples(){
 const css=document.createElement('link');css.rel='stylesheet';css.href='notation.css?v=1';document.head.append(css);
 const sequencer=document.querySelector('.sequencer-panel');
 if(sequencer&&!document.querySelector('#notationGrid')){
  const panel=document.createElement('section');panel.className='panel notation-panel';panel.setAttribute('aria-label','ドラム楽譜');
  panel.innerHTML='<div class="notation-header"><div><span class="section-kicker">DRUM NOTATION</span><h2>ドラム譜・簡易譜</h2></div><button id="copyNotationButton" class="secondary-button" type="button">簡易譜をコピー</button></div><div class="notation-scroll"><div id="notationGrid" class="notation-grid"></div></div><pre id="notationText" class="notation-text" aria-label="テキスト形式のドラム譜"></pre>';
  sequencer.insertAdjacentElement('afterend',panel);
 }
 ['sample-engine.js?v=1','notation.js?v=1'].forEach(src=>{const s=document.createElement('script');s.src=src;document.body.append(s)});
}

unifyFillInWording();
setTimeout(()=>{
 refreshBeatSelectors();
 syncSelectedBeat();
 unifyFillInWording();
 installNotationAndRecordedSamples();
},0);