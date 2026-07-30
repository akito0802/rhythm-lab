Object.assign(presets,{
  popRock:{category:'ポップス',name:'ポップロック',subtitle:'歌を支える安定ビート',bpm:108,difficulty:'初級',meter:'4/4',feature:'8ビートを土台にした素直な配置',role:'キックとスネアが歌の輪郭を支える',practice:'ハイハットを一定に保って演奏する',lesson:'歌ものに合わせやすいバランスの良いビート。',pattern:{kick:[0,6,8,11],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],crash:[0]}},
  indieRock:{category:'ロック',name:'インディーロック',subtitle:'少し崩した8ビート',bpm:124,difficulty:'中級',meter:'4/4',feature:'キックの位置を少し外した前進感',role:'オープンハイハットがフレーズの区切りを作る',practice:'基本8ビートとの違いを聴き比べる',lesson:'定番から少し外すことで独特の浮遊感が生まれる。',pattern:{kick:[0,3,8,11],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],openHat:[7,15]}},
  metal:{category:'ロック',name:'メタルビート',subtitle:'重い高速ドライブ',bpm:160,difficulty:'上級',meter:'4/4',feature:'細かいキックと強いクラッシュ',role:'キックが推進力、クラッシュが強拍を強調する',practice:'BPMを半分にしてキック配置から覚える',lesson:'密度の高いキックが重さと速度感を作る。',pattern:{kick:[0,2,3,6,8,10,11,14],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],crash:[0,8]}},
  house:{category:'EDM',name:'ハウス',subtitle:'裏拍ハイハット',bpm:124,difficulty:'初級',meter:'4/4',feature:'4つ打ちと裏拍のオープンハイハット',role:'キックが脈、ハイハットが跳ねる感覚を作る',practice:'キックと裏拍だけでループして聴く',lesson:'ダンスミュージックの基本的な推進力を体感できる。',pattern:{kick:[0,4,8,12],clap:[4,12],openHat:[2,6,10,14],closedHat:[0,4,8,12]}},
  dubstep:{category:'EDM',name:'ダブステップ',subtitle:'重いハーフタイム',bpm:140,difficulty:'中級',meter:'4/4',feature:'3拍目のスネアと空間の広い配置',role:'スネアが大きな拍感、キックが低音の動きを作る',practice:'ハーフタイムの重さを感じながら数える',lesson:'速いBPMでもスネア位置で重く遅く感じられる。',pattern:{kick:[0,7,11],snare:[8],closedHat:[0,2,4,6,8,10,12,14],openHat:[15]}},
  lofi:{category:'ヒップホップ',name:'Lo-Fiヒップホップ',subtitle:'ゆるく揺れるビート',bpm:76,swing:18,difficulty:'初級',meter:'4/4',feature:'少ない音数と強めのスウィング',role:'柔らかなスネアと遅れたハイハットが雰囲気を作る',practice:'スウィング0%と18%を比較する',lesson:'正確すぎない揺れが落ち着いた質感を生む。',pattern:{kick:[0,7,10],snare:[4,12],closedHat:[0,3,4,7,8,11,12,15],rim:[14]}},
  neoSoul:{category:'ファンク',name:'ネオソウル',subtitle:'後ろに重い16ビート',bpm:88,swing:20,difficulty:'上級',meter:'4/4',feature:'細かな16分と後ろに引くアクセント',role:'キックとリムの細かなずれがグルーヴを作る',practice:'ハイハットだけで揺れを作ってから他を加える',lesson:'音の位置と強弱の微妙なずれが深いノリにつながる。',pattern:{kick:[0,3,7,10,14],snare:[4,12],rim:[6,11,15],closedHat:[0,2,3,4,6,8,10,11,12,14,15],openHat:[7]}},
  mambo:{category:'ラテン',name:'マンボ',subtitle:'明るいラテンビート',bpm:132,difficulty:'中級',meter:'4/4',feature:'クラーベとティンバレスの掛け合い',role:'クラーベが基準、ティンバレスがアクセントを作る',practice:'クラーベだけを先に覚えてから重ねる',lesson:'複数の打楽器が会話するように重なる。',pattern:{kick:[0,8],claves:[0,3,6,10,12],timbale:[4,7,12,15],conga:[2,5,9,13],cowbell:[0,4,8,12]} }
});

// ステップ数をユーザー選択の4・8・16・32に統一する
effectiveSteps=()=>state.stepCount;

// 追加したジャンルとリズムを選択欄へ反映する
els.category.innerHTML='<option value="all">すべて</option>';
buildCategories();
buildPresetUI();
