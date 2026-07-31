let selectedFillId='rock1';

function fillLengthLabel(length){return length===4?'1拍':length===8?'2拍':'1小節'}
function fillEntriesForCategory(category){return Object.entries(drumFills).filter(([,fill])=>category==='all'||fill.genre===category)}

function ensureFillViewDialog(){
 if(document.querySelector('#fillViewDialog'))return;
 const style=document.createElement('style');
 style.textContent=`
 .fill-view-dialog{width:min(1100px,calc(100% - 20px));max-height:90vh;border:1px solid var(--line);border-radius:22px;background:var(--panel);color:var(--text);padding:0}.fill-view-dialog::backdrop{background:rgba(0,0,0,.72);backdrop-filter:blur(5px)}
 .fill-view-content{position:relative;max-height:90vh;overflow:auto;padding:26px}.fill-view-description{color:var(--muted);line-height:1.65}.fill-view-description strong{color:var(--text)}
 .fill-view-legend{display:flex;gap:16px;margin:14px 0;color:var(--muted);font-size:.78rem}.fill-view-legend span{display:flex;align-items:center;gap:6px}.fill-view-legend i{width:14px;height:14px;border-radius:4px;background:#20242c}.fill-view-legend .legend-on{background:var(--accent)}
 .fill-view-grid{overflow-x:auto;padding-bottom:8px}.fill-view-timeline,.fill-view-row{min-width:max-content;display:grid;grid-template-columns:120px repeat(var(--fill-view-steps),34px);gap:4px}.fill-view-timeline{margin-bottom:6px;color:var(--muted);font-size:.65rem}.fill-view-timeline span{display:grid;place-items:center;min-height:22px}.fill-view-timeline .is-beat{color:#fff;font-weight:900}
 .fill-view-row{margin-bottom:5px}.fill-view-label{display:flex;align-items:center;gap:8px;padding-right:6px;font-size:.75rem}.fill-view-label>span{display:grid;place-items:center;width:26px;height:26px;border-radius:7px;background:var(--panel-2)}.fill-view-cell{display:grid;place-items:center;min-height:34px;border-radius:7px;background:#20242c;color:#fff;font-size:.62rem}.fill-view-cell.is-on{background:var(--track-color);box-shadow:0 0 14px color-mix(in srgb,var(--track-color) 45%,transparent)}
 @media(max-width:620px){.fill-view-content{padding:20px 12px}.fill-view-timeline,.fill-view-row{grid-template-columns:84px repeat(var(--fill-view-steps),28px);gap:3px}.fill-view-cell{min-height:28px}.fill-view-label{font-size:.62rem;gap:4px}.fill-view-label>span{width:22px;height:22px}}
 `;
 document.head.append(style);
 const dialog=document.createElement('dialog');
 dialog.id='fillViewDialog';dialog.className='fill-view-dialog';
 dialog.innerHTML=`<div class="fill-view-content"><button id="closeFillViewButton" class="dialog-close" type="button" aria-label="閉じる">×</button><p class="eyebrow">BEAT MAP</p><h2 id="fillViewTitle">おかずの配置</h2><p id="fillViewDescription" class="fill-view-description"></p><div class="fill-view-legend"><span><i class="legend-on"></i>鳴る</span><span><i></i>休み</span></div><div id="fillViewGrid" class="fill-view-grid"></div></div>`;
 document.body.append(dialog);
 dialog.querySelector('#closeFillViewButton').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
}

function renderFillView(id){
 ensureFillViewDialog();
 const fill=drumFills[id];if(!fill)return;
 const dialog=document.querySelector('#fillViewDialog');
 const usedTracks=tracks.filter(track=>Array.isArray(fill.pattern[track.id])&&fill.pattern[track.id].length);
 const stepCount=fill.length;
 const instrumentNames=usedTracks.map(track=>track.name).join(' / ');
 document.querySelector('#fillViewTitle').textContent=`${fill.name} の配置`;
 document.querySelector('#fillViewDescription').innerHTML=`<strong>${fill.genre}・${fillLengthLabel(fill.length)}・${fill.difficulty}</strong><br>${fill.description}<br><span>使用楽器：${instrumentNames}</span>`;
 const grid=document.querySelector('#fillViewGrid');
 grid.style.setProperty('--fill-view-steps',stepCount);
 grid.innerHTML=`<div class="fill-view-timeline"><div></div>${Array.from({length:stepCount},(_,i)=>`<span class="${i%4===0?'is-beat':''}">${i%4===0?Math.floor(i/4)+1:['','e','&','a'][i%4]}</span>`).join('')}</div>`+usedTracks.map(track=>{const active=new Set(fill.pattern[track.id]);return `<div class="fill-view-row" style="--track-color:${track.color}"><div class="fill-view-label"><span>${track.icon}</span><strong>${track.name}</strong></div>${Array.from({length:stepCount},(_,i)=>`<div class="fill-view-cell ${active.has(i)?'is-on':''}" aria-label="${track.name} ${i+1}">${active.has(i)?'●':''}</div>`).join('')}</div>`}).join('');
 dialog.showModal();
}

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
   <button id="viewSelectedFill" type="button" class="view-rhythm-button fill-view-main-button">ビートを見る</button>
   <div class="fill-actions fill-selected-actions">
    <button id="previewSelectedFill" type="button">試聴</button>
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
 document.querySelector('#viewSelectedFill').addEventListener('click',()=>renderFillView(selectedFillId));
 rebuildOptions();
}

renderFillCards=renderFillPicker;
renderFillPicker();
