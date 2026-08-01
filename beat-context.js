(()=>{
 const css=document.createElement('link');
 css.rel='stylesheet';
 css.href='track-mixer.css?v=3';
 document.head.append(css);
 const script=document.createElement('script');
 script.src='track-mixer.js?v=2';
 script.dataset.trackMixer='true';
 script.onerror=()=>console.error('Track mixer failed to load');
 document.body.append(script);
})();

(()=>{
 const script=document.createElement('script');
 script.src='extra-beats-3.js?v=1';
 script.onload=()=>{
  try{
   const category=document.querySelector('#categorySelect');
   const beat=document.querySelector('#presetSelect');
   const currentCategory=category?.value||'all';
   const currentBeat=beat?.value||state?.selectedPreset;
   if(category&&typeof buildCategories==='function'){
    category.innerHTML='<option value="all">すべて</option>';
    buildCategories();
    if([...category.options].some(o=>o.value===currentCategory))category.value=currentCategory;
   }
   if(typeof buildPresetUI==='function')buildPresetUI();
   if(beat&&currentBeat&&presets[currentBeat]&&[...beat.options].some(o=>o.value===currentBeat))beat.value=currentBeat;
  }catch(error){console.warn('追加ビート第3弾のUI更新に失敗しました',error)}
 };
 document.body.append(script);
})();

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
 ['sample-engine.js?v=2','notation.js?v=1'].forEach(src=>{const s=document.createElement('script');s.src=src;document.body.append(s)});
}

function installRideTones(){
 if(document.querySelector('script[data-ride-tones]'))return Promise.resolve();
 return new Promise(resolve=>{
  const script=document.createElement('script');
  script.src='ride-tones.js?v=1';
  script.dataset.rideTones='true';
  script.onload=resolve;
  script.onerror=resolve;
  document.body.append(script);
 });
}

function installJazzSwingEngine(){
 if(document.querySelector('script[data-jazz-swing-engine]'))return;
 const script=document.createElement('script');
 script.src='jazz-swing-engine.js?v=2';
 script.dataset.jazzSwingEngine='true';
 document.body.append(script);
}

function installExtraInstruments(){
 if(document.querySelector('script[data-extra-instruments]'))return;
 const script=document.createElement('script');
 script.src='extra-instruments.js?v=2';
 script.dataset.extraInstruments='true';
 document.body.append(script);
}

function installTrackMixer(){
 if(document.querySelector('script[data-track-mixer]'))return;
 const css=document.createElement('link');css.rel='stylesheet';css.href='track-mixer.css?v=3';document.head.append(css);
 const script=document.createElement('script');script.src='track-mixer.js?v=2';script.dataset.trackMixer='true';document.body.append(script);
}

unifyFillInWording();
setTimeout(()=>{
 refreshBeatSelectors();
 syncSelectedBeat();
 unifyFillInWording();
 installNotationAndRecordedSamples();
 installExtraInstruments();
 installRideTones().then(installJazzSwingEngine);
 installTrackMixer();
},0);