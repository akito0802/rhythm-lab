(()=>{
 const q=s=>document.querySelector(s);
 const header=q('.topbar');
 const picker=q('.rhythm-picker');
 const sequencer=q('.sequencer-panel');
 const learning=q('.learning-hub');
 const library=q('.presets-panel');
 if(!header||!picker||!sequencer||!learning||!library)return;

 picker.id='rhythmSection';
 sequencer.id='sequencerSection';
 learning.id='learningSection';
 library.id='librarySection';
 [picker,sequencer,learning,library].forEach(x=>x.classList.add('panel-anchor'));

 const style=document.createElement('style');
 style.textContent=`
  .rhythm-picker{position:relative}
  .picker-actions{display:grid;grid-template-columns:minmax(0,1fr) 52px;gap:10px;margin-top:12px}
  .picker-actions .view-rhythm-button{margin:0;min-height:50px;font-size:.95rem;letter-spacing:.02em}
  .picker-actions .favorite-button{width:52px;height:50px;margin:0;font-size:1.3rem}
  .feature-page-link{order:3}
  .primary-controls{order:1}
  .rhythm-picker{order:2}
  .compact-lesson{order:4}
  .sequencer-panel{order:5}
  main{display:flex;flex-direction:column}
  .rhythm-picker .picker-title{margin-bottom:10px}
  .rhythm-picker .picker-title strong{font-size:1.05rem}
  .rhythm-picker::before{content:'STEP 1';position:absolute;top:14px;right:18px;color:var(--muted);font-size:.62rem;font-weight:900;letter-spacing:.14em}
  .primary-controls{margin-bottom:12px}
  .feature-page-link{margin-top:0;margin-bottom:12px}
  .feature-page-link h2{font-size:1.05rem;margin-bottom:2px}
  .feature-page-link p{font-size:.8rem}
  @media(max-width:620px){
   .picker-actions{grid-template-columns:1fr 46px;gap:8px}
   .picker-actions .view-rhythm-button{min-height:46px;font-size:.88rem}
   .picker-actions .favorite-button{width:46px;height:46px}
   .rhythm-picker::before{display:none}
  }
 `;
 document.head.append(style);

 const viewButton=q('#viewRhythmButton');
 const favorite=q('#favoriteButton');
 const pickerGrid=q('.two-stage-picker');
 if(viewButton&&favorite&&pickerGrid){
  viewButton.textContent='ビートを見る';
  viewButton.setAttribute('aria-label','選択中のビート配置を見る');
  favorite.textContent=favorite.getAttribute('aria-pressed')==='true'?'★':'☆';
  favorite.setAttribute('aria-label','お気に入りに追加');
  const actions=document.createElement('div');
  actions.className='picker-actions';
  actions.append(viewButton,favorite);
  pickerGrid.insertAdjacentElement('afterend',actions);
 }

 const feature=q('.feature-page-link');
 if(feature){
  const title=feature.querySelector('h2');
  const text=feature.querySelector('p');
  const action=feature.querySelector('strong:last-child');
  if(title)title.textContent='ドラムのおかずを視聴する';
  if(text)text.textContent='ジャンルとおかずを選び、試聴・配置確認・シーケンサーへの読み込みができるよ。';
  if(action)action.textContent='おかずを見る →';
  picker.insertAdjacentElement('afterend',feature);
 }

 const nav=document.createElement('nav');
 nav.className='section-nav';
 nav.setAttribute('aria-label','セクション移動');
 [['rhythmSection','ビート選択'],['sequencerSection','打ち込み'],['learningSection','学習'],['librarySection','一覧']].forEach(([id,label])=>{
  const b=document.createElement('button');
  b.type='button';
  b.textContent=label;
  b.addEventListener('click',()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'}));
  nav.append(b);
 });
 header.insertAdjacentElement('afterend',nav);

 const advanced=q('.advanced-panel');
 if(advanced&&window.matchMedia('(max-width:820px)').matches)advanced.open=false;

 const grid=q('.learning-grid');
 if(grid){
  const cards=[...grid.querySelectorAll('.learning-card')];
  const switcher=document.createElement('div');
  switcher.className='learning-mode-switch';
  const groups={guide:cards.slice(0,4),compare:cards.slice(4,5),quiz:cards.slice(5,6)};
  const labels={guide:'解説',compare:'比較',quiz:'クイズ'};
  function show(mode){
   Object.values(groups).flat().forEach(c=>c.hidden=true);
   groups[mode].forEach(c=>c.hidden=false);
   [...switcher.children].forEach(b=>b.classList.toggle('is-selected',b.dataset.mode===mode));
  }
  Object.keys(groups).forEach(mode=>{
   const b=document.createElement('button');
   b.type='button';
   b.dataset.mode=mode;
   b.textContent=labels[mode];
   b.addEventListener('click',()=>show(mode));
   switcher.append(b);
  });
  grid.before(switcher);
  show('guide');
 }

 const toggle=document.createElement('button');
 toggle.type='button';
 toggle.className='library-toggle';
 toggle.textContent='リズム一覧';
 toggle.addEventListener('click',()=>library.classList.toggle('is-collapsed'));
 library.append(toggle);
 if(window.matchMedia('(max-width:520px)').matches)library.classList.add('is-collapsed');

 const sections=[picker,sequencer,learning,library];
 const buttons=[...nav.children];
 const observer=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!visible)return;
  buttons.forEach((b,i)=>b.classList.toggle('is-active',sections[i]===visible.target));
 },{rootMargin:'-20% 0px -65% 0px',threshold:[0,.2,.5]});
 sections.forEach(s=>observer.observe(s));
})();