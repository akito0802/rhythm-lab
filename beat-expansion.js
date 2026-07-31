(() => {
  if (typeof presets === 'undefined') return;

  const families = [
    {key:'rock', category:'ロック', label:'ロック', bpm:112, difficulty:'初級', lesson:'8ビートを土台に、キックとシンバルの変化で推進力を学ぶ。', role:'キックが土台、スネアが2・4拍、ハイハットが時間を支える。', base:{kick:[0,8],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14]}},
    {key:'pop', category:'ポップス', label:'ポップス', bpm:104, difficulty:'初級', lesson:'歌を支える安定した配置と、控えめな装飾を学ぶ。', role:'音数を詰めすぎず、スネアとハイハットで輪郭を作る。', base:{kick:[0,7,10],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14]}},
    {key:'funk', category:'ファンク', label:'ファンク', bpm:106, difficulty:'中級', lesson:'16分の休符とゴースト感を意識してポケットを作る。', role:'キックとスネアの細かな会話がグルーヴを作る。', base:{kick:[0,3,7,10],snare:[4,12],closedHat:[0,2,3,4,6,8,10,11,12,14,15],rim:[5,13]}},
    {key:'rb', category:'R&B', label:'R&B', bpm:86, difficulty:'中級', lesson:'後ろに引くスネアと少ない音数で深いノリを作る。', role:'キックの間とスネアの重さを中心に組み立てる。', base:{kick:[0,6,10],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],rim:[15]}},
    {key:'hiphop', category:'ヒップホップ', label:'ヒップホップ', bpm:92, difficulty:'中級', lesson:'キックの食い込みとハイハットの揺れを比べる。', role:'スネアを基準に、キックの位置でキャラクターを変える。', base:{kick:[0,6,11],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],rim:[3]}},
    {key:'edm', category:'EDM', label:'EDM', bpm:126, difficulty:'初級', lesson:'4つ打ちを軸に、裏拍とビルド感を学ぶ。', role:'キックが一定の脈、クラップとハットが高揚感を作る。', base:{kick:[0,4,8,12],clap:[4,12],closedHat:[2,6,10,14],openHat:[6,14]}},
    {key:'jazz', category:'ジャズ', label:'ジャズ', bpm:132, difficulty:'上級', lesson:'均等ではないアクセントと会話するような配置を学ぶ。', role:'ライドが流れ、スネアとキックが合いの手を入れる。', base:{kick:[0,10],snare:[4,11],ride:[0,3,6,8,11,14],pedalHat:[4,12]}},
    {key:'latin', category:'ラテン', label:'ラテン', bpm:118, difficulty:'中級', lesson:'クラーベとパーカッションの重なりを分けて聴く。', role:'コンガとクラーベがシンコペーションを作る。', base:{kick:[0,6,10],side:[4,12],conga:[3,7,11,15],claves:[0,5,8,13],shaker:[0,2,4,6,8,10,12,14]}},
    {key:'world', category:'ワールド', label:'ワールド', bpm:108, difficulty:'中級', lesson:'異なる周期の打楽器を重ね、ポリリズム感を養う。', role:'複数のパーカッションが独立した反復を担当する。', base:{kick:[0,8],conga:[0,3,6,10,13],claves:[1,5,9,14],shaker:[0,2,4,6,8,10,12,14]}},
    {key:'metal', category:'メタル', label:'メタル', bpm:168, difficulty:'上級', lesson:'高速でも拍の頭とスネア位置を見失わないようにする。', role:'連続キックが推進力、チャイナやクラッシュが区切りを作る。', base:{kick:[0,2,4,6,8,10,12,14],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],china:[0]}},
    {key:'blues', category:'ブルース', label:'ブルース／シャッフル', bpm:108, difficulty:'中級', lesson:'跳ねる3連感とバックビートの関係を学ぶ。', role:'ハイハットのスウィング感が全体のノリを決める。', base:{kick:[0,8,11],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14]}},
    {key:'odd', category:'変拍子', label:'変拍子', bpm:116, difficulty:'上級', lesson:'アクセントのまとまりを数え、拍子の区切りを体で覚える。', role:'キックとタムのアクセントが拍子のグループを示す。', base:{kick:[0,6,10],snare:[4,12],highTom:[2,8],floorTom:[14],closedHat:[0,2,4,6,8,10,12,14]}}
  ];

  const variantNames=['ベーシック','キック変化','シンコペーション','オープンハット','ゴースト風','タムアクセント','クラッシュ導入','ブレイク型','前ノリ','後ノリ','ハーフタイム','ダブルタイム','ミニマル','高密度','展開前','上級チャレンジ'];
  const shift=(arr,n)=>[...new Set(arr.map(v=>(v+n+16)%16))].sort((a,b)=>a-b);
  const copyPattern=p=>Object.fromEntries(Object.entries(p).map(([k,v])=>[k,[...v]]));

  families.forEach((family, familyIndex) => {
    variantNames.forEach((variant, i) => {
      const pattern=copyPattern(family.base);
      const amount=(i%4);
      if(i===1 && pattern.kick) pattern.kick=[...new Set([...pattern.kick,3,14])].sort((a,b)=>a-b);
      if(i===2 && pattern.kick) pattern.kick=shift(pattern.kick,1);
      if(i===3){pattern.openHat=[...new Set([...(pattern.openHat||[]),6,14])];}
      if(i===4){pattern.rim=[...new Set([...(pattern.rim||[]),3,11,15])];}
      if(i===5){pattern.highTom=[2,6];pattern.floorTom=[10,14];}
      if(i===6){pattern.crash=[0,12];}
      if(i===7){Object.keys(pattern).forEach(k=>pattern[k]=pattern[k].filter(step=>step<8));pattern.crash=[8];}
      if(i===8 && pattern.kick) pattern.kick=shift(pattern.kick,15);
      if(i===9 && pattern.snare) pattern.snare=shift(pattern.snare,1);
      if(i===10){pattern.snare=[8]; if(pattern.kick) pattern.kick=[0,6,10,14];}
      if(i===11){pattern.closedHat=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];}
      if(i===12){Object.keys(pattern).forEach(k=>pattern[k]=pattern[k].filter((_,idx)=>idx%2===0));}
      if(i===13){pattern.closedHat=[0,1,2,3,4,6,7,8,9,10,11,12,14,15];pattern.shaker=[1,3,5,7,9,11,13,15];}
      if(i===14){pattern.crash=[0];pattern.highTom=[10,12];pattern.floorTom=[14,15];}
      if(i===15){pattern.kick=[0,3,6,7,10,13,15];pattern.snare=[4,11,12];pattern.closedHat=[0,1,2,4,6,7,8,10,12,13,14,15];pattern.openHat=[7,15];}

      const id=`exp_${family.key}_${String(i+1).padStart(2,'0')}`;
      presets[id]={
        category:family.category,
        name:`${family.label} ${variant}`,
        subtitle:`追加ビート ${i+1}`,
        bpm:Math.max(60,Math.min(200,family.bpm+(i-7)*2)),
        swing:family.key==='blues'?34:(family.key==='jazz'?22:(family.key==='hiphop'||family.key==='rb'?10:0)),
        difficulty:i<5?family.difficulty:(i<11?'中級':'上級'),
        meter:family.key==='odd'?(i%3===0?'5/4':i%3===1?'7/8':'9/8'):'4/4',
        feature:`${variant}の配置で${family.label}の特徴を比較できる`,
        role:family.role,
        practice:`BPM ${Math.max(50,family.bpm-30)}から始め、2小節ずつ安定して繰り返そう。`,
        lesson:family.lesson,
        pattern
      };
    });
  });
})();