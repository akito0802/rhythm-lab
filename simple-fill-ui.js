(() => {
  function fillLengthLabel(length){return length===4?'1拍':length===8?'2拍':'1小節'}
  function renderSimpleFillUI(){
    const panel=document.querySelector('#drumFillLibrary');
    if(!panel||typeof drumFills==='undefined')return;
    const categories=[...new Set(Object.values(drumFills).map(fill=>fill.genre))].sort();
    let selectedId=window.selectedFillId&&drumFills[window.selectedFillId]?window.selectedFillId:Object.keys(drumFills)[0];
    panel.innerHTML=`
      <div class="fill-header">
        <div>
          <span class="section-kicker">DRUM FILL SELECT</span>
          <h2>ジャンルからフィルインを選ぶ</h2>
          <p>ジャンルを選ぶと、そのジャンルのフィルインだけが表示されるよ。</p>
        </div>
        <span id="fillCount"></span>
      </div>
      <div class="two-stage-picker fill-two-stage-picker">
        <label class="picker-field">
          <span class="picker-number">1</span>
          <span class="picker-label">ジャンル</span>
          <select id="fillCategorySelect"><option value="all">すべて</option>${categories.map(c=>`<option value="${c}">${c}</option>`).join('')}</select>
        </label>
        <span class="picker-arrow" aria-hidden="true">→</span>
        <label class="picker-field rhythm-field">
          <span class="picker-number">2</span>
          <span class="picker-label">フィルイン</span>
          <select id="fillPresetSelect"></select>
        </label>
      </div>
      <article class="fill-selected-card">
        <div id="fillSelectedTags" class="fill-tags"></div>
        <h3 id="fillSelectedName"></h3>
        <p id="fillSelectedDescription"></p>
        <button id="viewSelectedFill" type="button" class="view-rhythm-button fill-view-main-button">配置を見る</button>
        <div class="fill-actions fill-selected-actions">
          <button id="previewSelectedFill" type="button">試聴</button>
          <button id="loadSelectedFill" type="button" class="fill-primary">シーケンサーへ読み込む</button>
        </div>
      </article>`;

    const category=panel.querySelector('#fillCategorySelect');
    const select=panel.querySelector('#fillPresetSelect');
    const count=panel.querySelector('#fillCount');

    function currentItems(){
      return Object.entries(drumFills).filter(([,fill])=>category.value==='all'||fill.genre===category.value);
    }
    function updateDetails(){
      selectedId=select.value;
      window.selectedFillId=selectedId;
      const fill=drumFills[selectedId];
      if(!fill)return;
      panel.querySelector('#fillSelectedTags').innerHTML=`<span>${fill.genre}</span><span>${fillLengthLabel(fill.length)}</span><span>${fill.difficulty}</span>`;
      panel.querySelector('#fillSelectedName').textContent=fill.name;
      panel.querySelector('#fillSelectedDescription').textContent=fill.description;
    }
    function rebuild(){
      const items=currentItems();
      if(!items.some(([id])=>id===selectedId))selectedId=items[0]?.[0]||'';
      select.innerHTML=items.map(([id,fill])=>`<option value="${id}">【${fill.genre}】${fill.name}</option>`).join('');
      select.value=selectedId;
      count.textContent=`${items.length} / 全${Object.keys(drumFills).length}種類`;
      updateDetails();
    }

    category.addEventListener('change',rebuild);
    select.addEventListener('change',updateDetails);
    panel.querySelector('#previewSelectedFill').addEventListener('click',()=>typeof previewFill==='function'&&previewFill(selectedId));
    panel.querySelector('#loadSelectedFill').addEventListener('click',()=>typeof applyFill==='function'&&applyFill(selectedId));
    panel.querySelector('#viewSelectedFill').addEventListener('click',()=>typeof renderFillView==='function'&&renderFillView(selectedId));
    rebuild();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(renderSimpleFillUI,0));
  else setTimeout(renderSimpleFillUI,0);
})();