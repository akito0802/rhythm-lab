// Rhythm Lab: ジャズカテゴリ再編成
(()=>{
 if(typeof presets==='undefined') return;

 const jazzPresets={
  jazz_swing_basic:{name:'Jazz Swing Basic',subtitle:'王道ライド・レガート',category:'ジャズ',bpm:132,swing:38,difficulty:'初級',meter:'4/4',rideTone:'jazz',humanize:18,feature:'ライドの「チーン・チキ」と2・4拍のペダルハイハット',role:'ライドが時間を作り、左足ハイハットが2拍目と4拍目を示す。キックとスネアは小さく会話する。',practice:'最初はライドとペダルハイハットだけで反復し、後からキックとスネアを足す。',lesson:'4分音符の流れを保ちながら、跳ねる裏側の音を軽く置く。',pattern:{ride:[0,3,4,7,8,11,12,15],pedalHat:[4,12],kick:[0,10],snare:[6,14]}},
  jazz_bebop:{name:'Bebop Comping',subtitle:'高速スウィングと細かなコンピング',category:'ジャズ',bpm:184,swing:34,difficulty:'上級',meter:'4/4',rideTone:'bell',humanize:22,feature:'速いライド・レガートと不規則なスネア／キックの応答',role:'ライドが一定の流れを維持し、スネアとキックがソリストへ短く返答する。',practice:'ライドを止めずに、スネアを1音ずつ追加して独立させる。',lesson:'すべてを強く叩かず、ライドの拍頭とベルを部分的に強調する。',pattern:{ride:[0,3,4,7,8,11,12,15],pedalHat:[4,12],kick:[0,5,10,15],snare:[2,6,9,14],rim:[7]}},
  jazz_hard_bop:{name:'Hard Bop Drive',subtitle:'太いライドと力強いコンピング',category:'ジャズ',bpm:156,swing:36,difficulty:'中級',meter:'4/4',rideTone:'dark',humanize:16,feature:'ダークなライド、強めの2・4拍、前へ進むキック',role:'ライドが重心を作り、キックとスネアがブルース感のある押し引きを作る。',practice:'2・4拍を感じながら、キックを少し前に置く意識で練習する。',lesson:'音数よりも重さとアクセントの位置でハードバップらしさを出す。',pattern:{ride:[0,3,4,7,8,11,12,15],pedalHat:[4,12],kick:[0,6,10,14],snare:[4,9,12,15]}},
  jazz_cool:{name:'Cool Jazz',subtitle:'薄いライドと余白のある演奏',category:'ジャズ',bpm:112,swing:40,difficulty:'中級',meter:'4/4',rideTone:'thin',humanize:24,feature:'小さな音量と広い余白、控えめなコンピング',role:'薄いライドが空気を作り、スネアとキックは必要な場所だけを支える。',practice:'音を増やすより休符を保つことを優先する。',lesson:'ライドの余韻を聴き、次の音を急いで置かない。',pattern:{ride:[0,3,4,7,8,11,12,15],pedalHat:[4,12],kick:[0,11],snare:[6,14]}},
  jazz_modal:{name:'Modal Jazz',subtitle:'反復と空間を生かすモーダル・フィール',category:'ジャズ',bpm:126,swing:30,difficulty:'中級',meter:'4/4',rideTone:'vintage',humanize:28,feature:'一定のライドと長い間、少ないコンピング',role:'ライドが静かな循環を作り、タムとスネアが色彩を加える。',practice:'同じパターンを長く保ち、音量だけで変化を作る。',lesson:'複雑な配置よりも、反復・余白・音色の変化を意識する。',pattern:{ride:[0,3,4,7,8,11,12,15],pedalHat:[4,12],kick:[0,8],snare:[7,14],floorTom:[10]}},
  jazz_waltz:{name:'Jazz Waltz',subtitle:'3拍子のスウィング',category:'ジャズ',bpm:144,swing:38,difficulty:'中級',meter:'3/4',rideTone:'jazz',humanize:20,feature:'1拍目を軸にした3拍子のライドと左足ハイハット',role:'ライドが3拍の円運動を作り、キックは1拍目、ハイハットは2・3拍目を補助する。',practice:'「1・2・3」を声に出し、1拍目だけ少し重く感じる。',lesson:'4拍子のバックビートを持ち込まず、3拍で一周する流れを作る。',pattern:{ride:[0,3,4,7,8,11],pedalHat:[4,8],kick:[0],snare:[6,10]}},
  jazz_brush_ballad:{name:'Brush Ballad',subtitle:'ブラシ風の静かなバラード',category:'ジャズ',bpm:72,swing:42,difficulty:'初級',meter:'4/4',rideTone:'vintage',humanize:30,feature:'柔らかいスネア、長い余韻、最小限のライド',role:'スネアのブラシ感が面を作り、ライドは節目だけを示す。',practice:'音量を下げ、各音の余韻が消えるまで待つ。',lesson:'強いアタックを避け、流れるような音量変化を意識する。',pattern:{ride:[0,8],pedalHat:[4,12],kick:[0,10],snare:[0,2,4,6,8,10,12,14]}},
  jazz_fusion:{name:'Jazz Fusion',subtitle:'明るいライドと直線的な16分フィール',category:'ジャズ',bpm:118,swing:8,difficulty:'上級',meter:'4/4',rideTone:'bright',humanize:10,feature:'明るいライド、シンコペーション、タイトなキック',role:'ライドとキックが直線的な推進力を作り、スネアとゴーストノートが細かいノリを加える。',practice:'スウィングを抑え、16分の位置を正確にそろえる。',lesson:'アコースティック・ジャズと違い、タイムをはっきり前へ出す。',pattern:{ride:[0,2,4,6,8,10,12,14],kick:[0,3,7,10,14],snare:[4,12],rim:[6,15],pedalHat:[4,12]}},
  jazz_new_orleans:{name:'New Orleans Jazz',subtitle:'セカンドラインの跳ねる行進感',category:'ジャズ',bpm:116,swing:28,difficulty:'中級',meter:'4/4',rideTone:'bright',humanize:20,feature:'跳ねるスネアとキック、祝祭的なシンバル',role:'キックが行進の足取りを作り、スネアが裏から押し返す。',practice:'キックとスネアだけで歩くようなノリを作ってからシンバルを足す。',lesson:'均等な8ビートではなく、前後に揺れる行進感を意識する。',pattern:{ride:[0,3,4,7,8,11,12,15],kick:[0,6,8,14],snare:[3,7,11,15],pedalHat:[4,12]}},
  jazz_big_band:{name:'Big Band Swing',subtitle:'大編成を支える強いスウィング',category:'ジャズ',bpm:168,swing:34,difficulty:'上級',meter:'4/4',rideTone:'bell',humanize:14,feature:'明確なライド、強い2・4拍、セクションを支えるアクセント',role:'ライドとハイハットが全体を統率し、クラッシュとスネアがホーンのキメを支える。',practice:'ライドを一定に保ちながら、スネアのアクセントだけを強くする。',lesson:'ビッグバンドでは自由なコンピングだけでなく、全員のキメを明確に示す。',pattern:{ride:[0,3,4,7,8,11,12,15],pedalHat:[4,12],kick:[0,4,8,12],snare:[4,7,12,15],crash:[0,12]}},
  jazz_free:{name:'Free Jazz',subtitle:'拍を保ちながら配置を崩す',category:'ジャズ',bpm:148,swing:22,difficulty:'上級',meter:'4/4',rideTone:'dark',humanize:36,feature:'不規則なシンバルとタム、固定バックビートを避けた会話',role:'各楽器が独立して動き、明確な反復を意図的に崩す。',practice:'完全に無秩序にせず、4分音符の位置だけは内側で感じ続ける。',lesson:'自由さは拍を失うことではなく、拍に対する選択肢を広げること。',pattern:{ride:[0,3,7,8,11,15],kick:[1,9,14],snare:[4,10,13],highTom:[2,12],floorTom:[6]}},
  jazz_latin:{name:'Latin Jazz',subtitle:'クラーベとライドの融合',category:'ジャズ',bpm:132,swing:4,difficulty:'上級',meter:'4/4',rideTone:'bright',humanize:12,feature:'ストレートなライドとクラーベ系アクセント',role:'ライドが拍を示し、クラーベとコンガがシンコペーションを作る。',practice:'クラーベだけを覚えてから、ライドを重ねる。',lesson:'スウィングを強くかけず、複数の周期が重なる感覚を学ぶ。',pattern:{ride:[0,2,4,6,8,10,12,14],kick:[0,6,10,14],snare:[4,12],claves:[0,5,8,13],conga:[3,7,11,15]}}
 };

 // 旧ジャズ拡張プリセットを除き、学習用に再編したプリセットへ置換
 Object.keys(presets).forEach(id=>{
  const p=presets[id];
  if(p?.category==='ジャズ' && !id.startsWith('jazz_')) delete presets[id];
 });
 Object.assign(presets,jazzPresets);

 const rideToneMap={jazz:'jazz',bright:'bright',dark:'dark',bell:'bell',thin:'thin',vintage:'vintage'};
 function applyJazzPerformance(id){
  const p=presets[id];
  if(!p||p.category!=='ジャズ')return;
  const swing=document.querySelector('#swingInput');
  const humanize=document.querySelector('#humanizeInput');
  const ride=document.querySelector('#rideToneSelect');
  if(swing){swing.value=p.swing??0;swing.dispatchEvent(new Event('input',{bubbles:true}))}
  if(humanize){humanize.value=p.humanize??0;humanize.dispatchEvent(new Event('input',{bubbles:true}))}
  if(ride){ride.value=rideToneMap[p.rideTone]||'jazz';ride.dispatchEvent(new Event('change',{bubbles:true}))}
 }

 const select=document.querySelector('#presetSelect');
 select?.addEventListener('change',()=>queueMicrotask(()=>applyJazzPerformance(select.value)));
 document.querySelector('#playButton')?.addEventListener('pointerdown',()=>applyJazzPerformance(select?.value),{capture:true});

 function refresh(){
  const category=document.querySelector('#categorySelect');
  const selected=select?.value;
  if(category&&typeof buildCategories==='function'){
   const keep=category.value;
   category.innerHTML='<option value="all">すべて</option>';
   buildCategories();
   if([...category.options].some(o=>o.value===keep))category.value=keep;
  }
  if(typeof buildPresetUI==='function')buildPresetUI();
  if(select&&selected&&presets[selected]&&[...select.options].some(o=>o.value===selected))select.value=selected;
 }
 setTimeout(refresh,0);
})();