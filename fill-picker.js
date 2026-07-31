let selectedFillId='rock1';
const FILL_TARGET=180;
const fillGenrePlans=[
 ['ロック',20],['ポップス',15],['ファンク / R&B',15],['ジャズ',15],['メタル',15],['EDM',15],['ヒップホップ',15],['ラテン',10],['ワールド',10],['ブルース',10],['シャッフル',10],['変拍子',10]
];
const genreAliases={'ファンク':'ファンク / R&B'};
Object.values(drumFills).forEach(fill=>{if(genreAliases[fill.genre])fill.genre=genreAliases[fill.genre]});

function fillLengthLabel(length){return length===4?'1拍':length===8?'2拍':'1小節'}
function fillEntriesForCategory(category){return Object.entries(drumFills).filter(([,fill])=>category==='all'||fill.genre===category)}
function clampVelocity(v){return Math.max(35,Math.min(127,v))}
function makeGeneratedFill(genre,index){
 const lengths=[4,8,16], difficulties=['初級','中級','上級'];
 const length=lengths[index%3], difficulty=difficulties[(index+Math.floor(index/3))%3];
 const genreData={
  'ロック':{tracks:['snare','highTom','midTom','floorTom','kick'],prefix:'ロック・タムラン',tip:'拍頭を強くし、最後の一打を次の小節へつなげよう。'},
  'ポップス':{tracks:['snare','highTom','floorTom','kick'],prefix:'ポップ・コネクト',tip:'歌を邪魔しない音量から練習しよう。'},
  'ファンク / R&B':{tracks:['kick','snare','closedHat','openHat','highTom'],prefix:'ポケット・リニア',tip:'ゴーストノートと強拍の差をはっきり付けよう。'},
  'ジャズ':{tracks:['snare','ride','highTom','floorTom'],prefix:'ジャズ・トレード',tip:'均等に叩かず、会話するような強弱を付けよう。'},
  'メタル':{tracks:['kick','snare','highTom','midTom','floorTom','china'],prefix:'メタル・ラッシュ',tip:'小さな動きで粒をそろえ、最後だけ大きく締めよう。'},
  'EDM':{tracks:['snare','clap','closedHat','floorTom','crash'],prefix:'ビルドアップ',tip:'後半へ向けて音量と密度を上げよう。'},
  'ヒップホップ':{tracks:['kick','snare','closedHat','rim','floorTom'],prefix:'ビート・ターン',tip:'少し後ろに置く感覚で、間を残して叩こう。'},
  'ラテン':{tracks:['conga','timbale','cowbell','claves','highTom'],prefix:'ラテン・コール',tip:'アクセント位置を声に出してから演奏しよう。'},
  'ワールド':{tracks:['conga','shaker','claves','timbale','floorTom'],prefix:'ワールド・パルス',tip:'各楽器の音色を分けて、重なりを聴こう。'},
  'ブルース':{tracks:['snare','highTom','floorTom','ride'],prefix:'ブルース・ターン',tip:'3連の大きな流れを崩さずに叩こう。'},
  'シャッフル':{tracks:['snare','highTom','floorTom','closedHat'],prefix:'シャッフル・フロー',tip:'真ん中の音を抜いた跳ね方を意識しよう。'},
  '変拍子':{tracks:['snare','highTom','midTom','floorTom','kick'],prefix:'オッド・グループ',tip:'3+2や2+2+3に区切って数えよう。'}
 }[genre];
 const pattern={},meta={};
 for(let step=0;step<length;step++){
  const track=genreData.tracks[(step+index)%genreData.tracks.length];
  const density=difficulty==='初級'?step%2===0||step===length-1:true;
  if(!density)continue;
  (pattern[track]??=[]).push(step);
  const expression=step===length-1?'flam':(difficulty==='上級'&&step%5===2?'roll':(step%4===0?'accent':(genre.includes('ファンク')&&step%3===1?'ghost':'normal')));
  (meta[track]??={})[step]=[expression,clampVelocity(68+step*3+(expression==='accent'?18:expression==='ghost'?-24:0))];
 }
 if(!Object.keys(pattern).length)pattern.snare=[length-1];
 return {name:`${genreData.prefix} ${String(index+1).padStart(2,'0')}`,genre,length,difficulty,description:`${genre}で使える${fillLengthLabel(length)}の${difficulty}フィル。${genreData.tip}`,practice:genreData.tip,pattern,meta,pro:index%7===0};
}
function expandFillLibrary(){
 const existingCounts={};Object.values(drumFills).forEach(f=>existingCounts[f.genre]=(existingCounts[f.genre]||0)+1);
 fillGenrePlans.forEach(([genre,target])=>{
  let count=existingCounts[genre]||0,idx=0;
  while(count<target){const id=`auto_${genre.replace(/[^a-zA-Z0-9一-龠ぁ-んァ-ヶ]/g,'')}_${idx}`;if(!drumFills[id]){drumFills[id]=makeGeneratedFill(genre,idx);count++}idx++}
 });
 let serial=0;while(Object.keys(drumFills).length<FILL_TARGET){const genre=fillGenrePlans[serial%fillGenrePlans.length][0],id=`bonus_fill_${serial}`;drumFills[id]=makeGeneratedFill(genre,100+serial);serial++}
}
expandFillLibrary();

const favoriteFillIds=new Set(JSON.parse(localStorage.getItem('rhythmLabFillFavorites')||'[]'));
function saveFillFavorites(){localStorage.setItem('rhythmLabFillFavorites',JSON.stringify([...favoriteFillIds]))}
function practicePoint(fill){return fill.practice||({初級:'ゆっくりしたBPMで、音の順番を声に出して覚えよう。',中級:'アクセントと弱音の差を付け、一定のテンポで反復しよう。',上級:'小さなモーションで粒をそろえ、最後の着地まで録音確認しよう。'}[fill.difficulty])}
function recommendedFillId(){
 const current=drumFills[selectedFillId];
 const pool=Object.entries(drumFills).filter(([id,f])=>id!==selectedFillId&&f.genre===current?.genre&&f.difficulty===current?.difficulty);
 return (pool[Math.floor(Math.random()*pool.length)]||Object.entries(drumFills)[0])?.[0];
}

function ensureFillViewDialog(){
 if(document.querySelector('#fillViewDialog'))return;
 const style=document.createElement('style');style.textContent=`
 .fill-filter-grid{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:10px;margin-top:16px}.fill-filter-grid label{display:grid;gap:7px;color:var(--muted);font-size:.72rem;font-weight:800}.fill-filter-grid input,.fill-filter-grid select{min-height:44px;border:1px solid var(--line);border-radius:12px;background:#171a20;color:#fff;padding:0 12px}.fill-tools{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.fill-tools button{min-height:40px;padding:0 13px;border-radius:12px}.fill-favorite.is-favorite{color:#ffd86b;border-color:#ffd86b}.fill-learning-box{margin-top:14px;padding:14px;border-radius:14px;background:rgba(255,255,255,.04)}.fill-learning-box strong{display:block;margin-bottom:5px}.fill-learning-box p{margin:0}.fill-view-dialog{width:min(1100px,calc(100% - 20px));max-height:90vh;border:1px solid var(--line);border-radius:22px;background:var(--panel);color:var(--text);padding:0}.fill-view-dialog::backdrop{background:rgba(0,0,0,.72);backdrop-filter:blur(5px)}.fill-view-content{position:relative;max-height:90vh;overflow:auto;padding:26px}.fill-view-description{color:var(--muted);line-height:1.65}.fill-view-description strong{color:var(--text)}.fill-view-grid{overflow-x:auto}.fill-view-timeline,.fill-view-row{min-width:max-content;display:grid;grid-template-columns:120px repeat(var(--fill-view-steps),34px);gap:4px}.fill-view-row{margin-bottom:5px}.fill-view-cell{display:grid;place-items:center;min-height:34px;border-radius:7px;background:#20242c}.fill-view-cell.is-on{background:var(--track-color)}.fill-view-label{display:flex;align-items:center;gap:8px}.fill-view-timeline span{display:grid;place-items:center;font-size:.65rem;color:var(--muted)}@media(max-width:700px){.fill-filter-grid{grid-template-columns:1fr 1fr}.fill-filter-grid label:first-child{grid-column:1/-1}.fill-view-content{padding:18px 10px}.fill-view-timeline,.fill-view-row{grid-template-columns:84px repeat(var(--fill-view-steps),28px)}}`;
 document.head.append(style);
 const dialog=document.createElement('dialog');dialog.id='fillViewDialog';dialog.className='fill-view-dialog';dialog.innerHTML=`<div class="fill-view-content"><button id="closeFillViewButton" class="dialog-close" type="button">×</button><p class="eyebrow">FILL MAP</p><h2 id="fillViewTitle"></h2><p id="fillViewDescription" class="fill-view-description"></p><div id="fillViewGrid" class="fill-view-grid"></div></div>`;document.body.append(dialog);dialog.querySelector('#closeFillViewButton').onclick=()=>dialog.close();
}
function renderFillView(id){ensureFillViewDialog();const fill=drumFills[id];if(!fill)return;const used=tracks.filter(t=>fill.pattern[t.id]?.length);document.querySelector('#fillViewTitle').textContent=`${fill.name} の配置`;document.querySelector('#fillViewDescription').innerHTML=`<strong>${fill.genre}・${fillLengthLabel(fill.length)}・${fill.difficulty}</strong><br>${fill.description}<br>練習ポイント：${practicePoint(fill)}`;const grid=document.querySelector('#fillViewGrid');grid.style.setProperty('--fill-view-steps',fill.length);grid.innerHTML=`<div class="fill-view-timeline"><div></div>${Array.from({length:fill.length},(_,i)=>`<span>${i%4===0?Math.floor(i/4)+1:['','e','&','a'][i%4]}</span>`).join('')}</div>`+used.map(t=>{const active=new Set(fill.pattern[t.id]);return `<div class="fill-view-row" style="--track-color:${t.color}"><div class="fill-view-label"><span>${t.icon}</span><strong>${t.name}</strong></div>${Array.from({length:fill.length},(_,i)=>`<div class="fill-view-cell ${active.has(i)?'is-on':''}">${active.has(i)?'●':''}</div>`).join('')}</div>`}).join('');document.querySelector('#fillViewDialog').showModal()}

function renderFillPicker(){
 const panel=document.querySelector('#drumFillLibrary');if(!panel)return;
 const categories=[...new Set(Object.values(drumFills).map(f=>f.genre))].sort();
 panel.innerHTML=`<div class="fill-header"><div><span class="section-kicker">DRUM FILL LIBRARY</span><h2>フィルインを検索して学ぶ</h2><p>ジャンル・難易度・長さで絞り込み、試聴・配置確認・シーケンサー読込ができるよ。</p></div><span id="fillCount"></span></div>
 <div class="fill-filter-grid"><label>キーワード<input id="fillSearch" placeholder="名前・特徴で検索"></label><label>ジャンル<select id="fillCategorySelect"><option value="all">すべて</option>${categories.map(c=>`<option>${c}</option>`).join('')}</select></label><label>難易度<select id="fillDifficultySelect"><option value="all">すべて</option><option>初級</option><option>中級</option><option>上級</option></select></label><label>長さ<select id="fillLengthSelect"><option value="all">すべて</option><option value="4">1拍</option><option value="8">2拍</option><option value="16">1小節</option></select></label></div>
 <div class="fill-tools"><button id="favoriteOnlyFill" type="button">☆ お気に入りのみ</button><button id="recommendFill" type="button">おすすめを表示</button><button id="proFill" type="button">プロドラマー風</button></div>
 <div class="two-stage-picker fill-two-stage-picker"><label class="picker-field rhythm-field"><span class="picker-number">1</span><span class="picker-label">フィルイン</span><select id="fillPresetSelect"></select></label></div>
 <article class="fill-selected-card"><div id="fillSelectedTags" class="fill-tags"></div><h3 id="fillSelectedName"></h3><p id="fillSelectedDescription"></p><div class="fill-learning-box"><strong>練習ポイント</strong><p id="fillPractice"></p></div><div class="fill-tools"><button id="favoriteSelectedFill" class="fill-favorite" type="button"></button></div><button id="viewSelectedFill" type="button" class="view-rhythm-button fill-view-main-button">配置を見る</button><div class="fill-actions fill-selected-actions"><button id="previewSelectedFill" type="button">試聴</button><button id="loadSelectedFill" type="button" class="fill-primary">シーケンサーへ読み込む</button></div></article>`;
 const q=id=>document.querySelector(id),category=q('#fillCategorySelect'),difficulty=q('#fillDifficultySelect'),length=q('#fillLengthSelect'),search=q('#fillSearch'),select=q('#fillPresetSelect');let favoriteOnly=false,proOnly=false;
 function list(){const word=search.value.trim().toLowerCase();return Object.entries(drumFills).filter(([id,f])=>(category.value==='all'||f.genre===category.value)&&(difficulty.value==='all'||f.difficulty===difficulty.value)&&(length.value==='all'||String(f.length)===length.value)&&(!favoriteOnly||favoriteFillIds.has(id))&&(!proOnly||f.pro)&&(!word||`${f.name} ${f.description} ${f.genre}`.toLowerCase().includes(word)))}
 function rebuild(){const items=list();if(!items.some(([id])=>id===selectedFillId))selectedFillId=items[0]?.[0]||'';select.innerHTML=items.length?items.map(([id,f])=>`<option value="${id}">【${f.genre}】${f.name}｜${fillLengthLabel(f.length)}｜${f.difficulty}</option>`).join(''):'<option>条件に合うフィルインなし</option>';select.value=selectedFillId;q('#fillCount').textContent=`${items.length} / 全${Object.keys(drumFills).length}種類`;update()}
 function update(){selectedFillId=select.value;const f=drumFills[selectedFillId];if(!f)return;q('#fillSelectedTags').innerHTML=`<span>${f.genre}</span><span>${fillLengthLabel(f.length)}</span><span>${f.difficulty}</span>${f.pro?'<span>PRO STYLE</span>':''}`;q('#fillSelectedName').textContent=f.name;q('#fillSelectedDescription').textContent=f.description;q('#fillPractice').textContent=practicePoint(f);const fav=favoriteFillIds.has(selectedFillId),btn=q('#favoriteSelectedFill');btn.textContent=fav?'★ お気に入り登録済み':'☆ お気に入りに追加';btn.classList.toggle('is-favorite',fav)}
 [category,difficulty,length].forEach(el=>el.onchange=rebuild);search.oninput=rebuild;select.onchange=update;
 q('#favoriteOnlyFill').onclick=e=>{favoriteOnly=!favoriteOnly;e.currentTarget.classList.toggle('is-selected',favoriteOnly);rebuild()};q('#proFill').onclick=e=>{proOnly=!proOnly;e.currentTarget.classList.toggle('is-selected',proOnly);rebuild()};q('#recommendFill').onclick=()=>{selectedFillId=recommendedFillId();category.value='all';difficulty.value='all';length.value='all';favoriteOnly=proOnly=false;search.value='';rebuild();select.value=selectedFillId;update()};q('#favoriteSelectedFill').onclick=()=>{if(favoriteFillIds.has(selectedFillId))favoriteFillIds.delete(selectedFillId);else favoriteFillIds.add(selectedFillId);saveFillFavorites();update()};q('#previewSelectedFill').onclick=()=>previewFill(selectedFillId);q('#loadSelectedFill').onclick=()=>{applyFill(selectedFillId);document.querySelector('#sequencer')?.scrollIntoView({behavior:'smooth',block:'start'})};q('#viewSelectedFill').onclick=()=>renderFillView(selectedFillId);rebuild();
}
renderFillCards=renderFillPicker;renderFillPicker();
