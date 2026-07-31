(()=>{
  const category=document.querySelector('#categorySelect');
  const preset=document.querySelector('#presetSelect');
  if(!category||!preset||typeof loadPreset!=='function')return;

  function loadCurrentBeat({resume=false}={}){
    const id=preset.value;
    if(!id||!presets[id])return;
    const wasPlaying=Boolean(state?.isPlaying);
    if(wasPlaying&&typeof stop==='function')stop();
    loadPreset(id);
    if((resume||wasPlaying)&&typeof start==='function')start();
  }

  // 追加プリセットを含め、ページ読み込み後に選択肢を再構築する。
  if(typeof buildCategories==='function'){
    const currentCategory=category.value||'all';
    category.innerHTML='<option value="all">すべて</option>';
    buildCategories();
    if([...category.options].some(option=>option.value===currentCategory))category.value=currentCategory;
  }
  if(typeof buildPresetUI==='function')buildPresetUI();

  category.addEventListener('change',()=>{
    // app.js側のbuildPresetUI実行後に、先頭候補を確実に読み込む。
    queueMicrotask(()=>{
      if(typeof buildPresetUI==='function')buildPresetUI();
      loadCurrentBeat();
    });
  });

  preset.addEventListener('change',()=>loadCurrentBeat());

  // 再生ボタンを押した時も、現在の選択肢とstateがずれていれば同期する。
  document.querySelector('#playButton')?.addEventListener('pointerdown',()=>{
    const id=preset.value;
    if(id&&presets[id]&&state.selectedPreset!==id&&!state.isPlaying)loadPreset(id);
  },{capture:true});
})();
