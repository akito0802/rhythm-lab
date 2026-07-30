let selectedFillId='rock1';

function fillLengthLabel(length){return length===4?'1拍':length===8?'2拍':'1小節'}
function fillEntriesForCategory(category){return Object.entries(drumFills).filter(([,fill])=>category==='all'||fill.genre===category)}

function renderFillPicker(){
 const panel=document.querySelector('#drumFillLibrary');
 if(!panel)return;
 const categories=[...new Set(Object.values(drumFills).map(fill=>fill.genre))].sort();
 if(!drumFills[selectedFillId])selectedFillId=Object.keys(drumFills)[0];
 panel.innerHTML=`
  <div class="fill-header">
   <div><span class="section-kicker">DRUM FILL SELECT</span><h2>ジャンルからおかずを選ぶ</h2><p>ビートと同じ流れで、ジャンル→おかずの順に選べるよ。</p></div>
   <span id="fillCount">全${Object.keys(drumFills).length}種類</span>
  </div>
  <div class="two-stage-picker fill-two-stage-picker">
   <label class="picker-field"><span class="picker-number">1</span><span class="picker-label">ジャンル</span><select id="fillCategorySelect"><option value="all">すべて</option>${categories.map(c=>`<option value="${c}">${c}</option>`).join('')}</select></label>
   <span class="picker-arrow">→</span>
   <label class="picker-field rhythm-field"><span class="picker-number">2</span><span class="picker-label">おかず</span><select id="fillPresetSelect"></select></label>
  </div>
  <article class="fill-selected-card">
   <div id="fillSelectedTags" class="fill-tags"></div>
   <h3 id="fillSelectedName"></h3>
   <p id="fillSelectedDescription"></p>
   <div class="fill-actions fill-selected-actions">
    <button id="previewSelectedFill" type="button">試聴</button>
    <button id="viewSelectedFill" type="button">配置を見る</button>
    <button id="loadSelectedFill" type="button" class="fill-primary">シーケンサーへ読み込む</button>
   </div>
  </article>`;
 const category=document.querySelector('#fillCategorySelect');
 const select=document.querySelector('#fillPresetSelect');
 function rebuildOptions(){
  const list=fillEntriesForCategory(category.value);
  if(!list.some(([id])=>id===selectedFillId))selectedFillId=list[0]?.[0]||Object.keys(drumFills)[0];
  select.innerHTML=list.map(([id,fill])=>`<option value="${id}">【${fill.genre}】${fill.name}｜${fillLengthLabel(fill.length)}</option>`).join('');
  select.value=selectedFillId;
  document.querySelector('#fillCount').textContent=`${list.length} / 全${Object.keys(drumFills).length}種類`;
  updateSelectedFillInfo();
 }
 function updateSelectedFillInfo(){
  selectedFillId=select.value;
  const fill=drumFills[selectedFillId];if(!fill)return;
  document.querySelector('#fillSelectedTags').innerHTML=`<span>${fill.genre}</span><span>${fillLengthLabel(fill.length)}</span><span>${fill.difficulty}</span>`;
  document.querySelector('#fillSelectedName').textContent=fill.name;
  document.querySelector('#fillSelectedDescription').textContent=fill.description;
 }
 category.addEventListener('change',rebuildOptions);
 select.addEventListener('change',updateSelectedFillInfo);
 document.querySelector('#previewSelectedFill').addEventListener('click',()=>previewFill(selectedFillId));
 document.querySelector('#loadSelectedFill').addEventListener('click',()=>applyFill(selectedFillId));
 document.querySelector('#viewSelectedFill').addEventListener('click',()=>{
  applyFill(selectedFillId);
  document.querySelector('.sequencer-panel')?.scrollIntoView({behavior:'smooth',block:'start'});
 });
 rebuildOptions();
}

renderFillCards=renderFillPicker;
renderFillPicker();
