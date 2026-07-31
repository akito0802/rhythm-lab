(() => {
  if (typeof presets === 'undefined') return;

  const families = [
    {key:'gospel',category:'ゴスペル',label:'ゴスペル',bpm:104,difficulty:'中級',swing:14,lesson:'力強いバックビートと跳ねるハイハットで高揚感を作る。',role:'スネアとタンバリンが拍を押し上げ、キックが歌を支える。',base:{kick:[0,6,10,14],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],tambourine:[4,12]}},
    {key:'country',category:'カントリー',label:'カントリー',bpm:118,difficulty:'初級',swing:8,lesson:'一定の刻みとシンプルなバックビートを安定させる。',role:'キックとサイドスティックが土台を作り、ライドが流れを保つ。',base:{kick:[0,8,11],side:[4,12],ride:[0,2,4,6,8,10,12,14]}},
    {key:'ska',category:'スカ',label:'スカ',bpm:146,difficulty:'中級',swing:0,lesson:'裏拍アクセントと速いテンポの軽快さを学ぶ。',role:'ハイハットとリムが裏拍を示し、キックが前進感を作る。',base:{kick:[0,6,8,14],snare:[4,12],closedHat:[2,6,10,14],rim:[2,6,10,14]}},
    {key:'dub',category:'ダブ',label:'ダブ',bpm:76,difficulty:'中級',swing:10,lesson:'少ない音数と長い余韻を活かして深い間を作る。',role:'ワンドロップのキックとスネア、疎らなハットが空間を作る。',base:{kick:[8],snare:[8],closedHat:[2,10],openHat:[14],rim:[4,12]}},
    {key:'breakbeat',category:'ブレイクビーツ',label:'ブレイクビーツ',bpm:136,difficulty:'上級',swing:6,lesson:'崩したキックとスネアの位置で切れ味を作る。',role:'細かいキックとゴースト風のリムがブレイク感を生む。',base:{kick:[0,3,7,10,14],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],rim:[3,11,15]}},
    {key:'garage',category:'UKガラージ',label:'UKガラージ',bpm:132,difficulty:'上級',swing:18,lesson:'2ステップ系の抜けたキックと跳ねるハットを学ぶ。',role:'キックの空白とスネアの位置が独特の弾みを作る。',base:{kick:[0,7,10,15],snare:[4,12],closedHat:[0,2,5,7,8,10,13,15],openHat:[6,14]}},
    {key:'jungle',category:'ジャングル',label:'ジャングル',bpm:170,difficulty:'上級',swing:4,lesson:'高速テンポで細かく分割されたブレイクを捉える。',role:'キックとスネアの細かな交差、ライドの刻みが疾走感を作る。',base:{kick:[0,3,7,10,14],snare:[4,11,12],closedHat:[0,2,4,6,8,10,12,14],ride:[1,5,9,13]}},
    {key:'march',category:'マーチング',label:'マーチング',bpm:120,difficulty:'中級',swing:0,lesson:'均等な歩行感とスネアのルーディメンツを学ぶ。',role:'キックが行進の足取り、スネアとタムが隊列の動きを表す。',base:{kick:[0,4,8,12],snare:[2,4,6,10,12,14],highTom:[0,8],floorTom:[6,14],crash:[0]}},
  ];

  const variants=['ベーシック','キック変化','スネア変化','裏拍強調','ゴースト風','タム展開','クラッシュ導入','ブレイク型','前ノリ','後ノリ','ハーフタイム','ダブルタイム','ミニマル','高密度','フィル前','上級チャレンジ'];
  const clone=p=>Object.fromEntries(Object.entries(p).map(([k,v])=>[k,[...v]]));
  const uniq=a=>[...new Set(a)].sort((x,y)=>x-y);
  const shift=(a,n)=>uniq(a.map(v=>(v+n+16)%16));

  families.forEach(f=>{
    variants.forEach((variant,i)=>{
      const pattern=clone(f.base);
      if(i===1&&pattern.kick)pattern.kick=uniq([...pattern.kick,3,11,15]);
      if(i===2&&pattern.snare)pattern.snare=uniq([...pattern.snare,3,11,15]);
      if(i===3){pattern.closedHat=uniq([...(pattern.closedHat||[]),2,6,10,14]);pattern.openHat=uniq([...(pattern.openHat||[]),6,14]);}
      if(i===4)pattern.rim=uniq([...(pattern.rim||[]),3,7,11,15]);
      if(i===5){pattern.highTom=uniq([...(pattern.highTom||[]),2,6]);pattern.midTom=[9,11];pattern.floorTom=uniq([...(pattern.floorTom||[]),14,15]);}
      if(i===6)pattern.crash=uniq([...(pattern.crash||[]),0,12]);
      if(i===7){Object.keys(pattern).forEach(k=>pattern[k]=pattern[k].filter(s=>s<8));pattern.crash=[8];}
      if(i===8&&pattern.kick)pattern.kick=shift(pattern.kick,15);
      if(i===9&&pattern.snare)pattern.snare=shift(pattern.snare,1);
      if(i===10){pattern.snare=[8];pattern.kick=[0,6,10,14];}
      if(i===11)pattern.closedHat=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
      if(i===12)Object.keys(pattern).forEach(k=>pattern[k]=pattern[k].filter((_,idx)=>idx%2===0));
      if(i===13){pattern.closedHat=[0,1,2,3,4,6,7,8,9,10,11,12,14,15];pattern.shaker=[1,3,5,7,9,11,13,15];}
      if(i===14){pattern.highTom=[10,12];pattern.midTom=[13];pattern.floorTom=[14,15];pattern.crash=[0];}
      if(i===15){pattern.kick=[0,3,6,7,10,13,15];pattern.snare=[4,11,12];pattern.closedHat=[0,1,2,4,6,7,8,10,12,13,14,15];pattern.openHat=[7,15];pattern.crash=[0,8];}

      const id=`extra3_${f.key}_${String(i+1).padStart(2,'0')}`;
      presets[id]={
        category:f.category,
        name:`${f.label} ${variant}`,
        subtitle:`追加ビート 第3弾 ${i+1}`,
        bpm:Math.max(60,Math.min(200,f.bpm+(i-7)*2)),
        swing:f.swing,
        difficulty:i<5?f.difficulty:(i<11?'中級':'上級'),
        meter:'4/4',
        feature:`${variant}の配置で${f.label}の特徴を比較できる`,
        role:f.role,
        practice:`BPM ${Math.max(50,f.bpm-28)}から始め、キックとスネアだけ→全体の順で練習しよう。`,
        lesson:f.lesson,
        pattern
      };
    });
  });
})();