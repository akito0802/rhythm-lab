// Rhythm Lab 拡張ビートライブラリ
// PDF「追加機能・追加ビート計画 日本語版」に基づき、既存72種類に加えて
// ポップス系12ジャンル＋追加ジャンル8種を各16パターン収録。
(()=>{
 if(typeof presets==='undefined') return;
 const P={
  rock:{bpm:138,difficulty:'中級',meter:'4/4',feature:'力強いバックビートと前進感',role:'キックとスネアが土台、ハイハットとシンバルが勢いを作る',practice:'低いBPMでキックとスネアから覚える',lesson:'アクセントと音数の違いでロックの各スタイルを聴き分けよう。',pattern:{kick:[0,3,8,10,14],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],crash:[0]}},
  pop:{bpm:112,difficulty:'初級',meter:'4/4',feature:'歌を支える安定したビート',role:'キックとスネアが輪郭を作り、ハイハットが流れを保つ',practice:'ハイハットを一定にしてからキックを加える',lesson:'音数とアクセントでポップスの雰囲気が変わる。',pattern:{kick:[0,6,8,11],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14]}},
  edm:{bpm:128,difficulty:'中級',meter:'4/4',feature:'反復するキックと明確なダンスグルーヴ',role:'キックが脈を作り、クラップとハイハットが高揚感を加える',practice:'キックと裏拍ハイハットだけでループする',lesson:'反復の中の小さな変化を聴き取ろう。',pattern:{kick:[0,4,8,12],clap:[4,12],openHat:[2,6,10,14],closedHat:[0,4,8,12]}},
  hiphop:{bpm:92,difficulty:'中級',meter:'4/4',feature:'間を活かした重いバックビート',role:'キックのずれとスネアの位置がノリを決める',practice:'キックとスネアだけで重心を確認する',lesson:'空白とスウィングがヒップホップの個性を作る。',pattern:{kick:[0,7,10,14],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],rim:[15]}},
  jazz:{bpm:132,difficulty:'上級',meter:'4/4',feature:'ライドを軸にした跳ねるグルーヴ',role:'ライドが時間を示し、スネアとキックが会話する',practice:'ライドだけで拍を感じてから他の音を加える',lesson:'均等ではない揺れと即興的な応答を感じよう。',pattern:{ride:[0,2,4,6,8,10,12,14],kick:[0,8],snare:[4,12],pedalHat:[4,12]}},
  latin:{bpm:124,difficulty:'中級',meter:'4/4',feature:'クラーベと打楽器のシンコペーション',role:'クラーベが基準を作り、コンガやティンバレスが動きを加える',practice:'クラーベだけを先に覚える',lesson:'複数の周期が重なる感覚を身につけよう。',pattern:{kick:[0,6,10],claves:[0,5,8,13],conga:[3,7,11,15],timbale:[4,12],shaker:[0,2,4,6,8,10,12,14]}},
  world:{bpm:116,difficulty:'中級',meter:'4/4',feature:'地域固有の打楽器アクセントと反復',role:'複数の打楽器が層になってグルーヴを作る',practice:'各楽器を一つずつ追加して聴く',lesson:'世界のリズムをアクセント位置から比べよう。',pattern:{kick:[0,8],floorTom:[0,6,10,14],shaker:[0,2,4,6,8,10,12,14],claves:[0,5,8,13]}},
  odd:{bpm:108,difficulty:'上級',meter:'7/4',feature:'均等でない拍のまとまり',role:'アクセントの区切りが変拍子の流れを作る',practice:'2+2+3などのまとまりを声に出して数える',lesson:'拍数ではなく短いグループの連結として感じよう。',pattern:{kick:[0,6,10],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14]}}
 };
 const groups={
  rock:['Post-Hardcore','Math Rock','Grunge','Shoegaze','Ska Punk','Death Metal','Black Metal','Thrash Metal','Metalcore','Djent'],
  pop:['Dance Pop','Teen Pop','Bubblegum Pop','Adult Contemporary','Synthwave Pop','J-Rock','Visual Kei','Vocaloid','Idol Pop','Acoustic Pop'],
  edm:['Big Room','Slap House','Deep House','Tropical House','Tech House','Minimal Techno','Acid Techno','Psytrance','Goa Trance','Liquid DnB','Neurofunk','Jungle','Breakcore','Hardcore Techno'],
  hiphop:['UK Drill','Jersey Club','Bounce','Crunk','Dirty South','Hyphy','Alternative Hip-Hop','Experimental Hip-Hop','Instrumental Hip-Hop','Lo-Fi Boom Bap'],
  jazz:['Jazz Funk','Free Jazz','Gypsy Jazz','Dixieland','New Orleans','Big Band','Shuffle Swing','Contemporary Jazz'],
  latin:['Salsa','Cha-Cha-Cha','Bossa Groove','Baião','Forró','Cumbia','Tango','Zouk'],
  world:['Samba Reggae','Gnawa','Taarab','Balkan','Klezmer','Indian Tala','Taiko','Gamelan'],
  odd:['7/4','10/8','19/8','21/8','23/8','29/16','Odd Groove','Metric Modulation']
 };
 const labels={rock:'ロック',pop:'ポップス',edm:'EDM',hiphop:'ヒップホップ',jazz:'ジャズ',latin:'ラテン',world:'ワールド',odd:'変拍子'};
 let n=1;
 Object.entries(groups).forEach(([type,names])=>names.forEach((name,i)=>{
  const base=P[type];
  const id=`expansion${String(n++).padStart(2,'0')}`;
  const item={...base,pattern:Object.fromEntries(Object.entries(base.pattern).map(([k,v])=>[k,[...v]])),name,subtitle:base.feature,category:labels[type]};
  if(type==='rock') item.bpm=[150,126,116,108,174,190,184,182,168,142][i];
  if(type==='pop') item.bpm=[122,116,128,86,118,132,148,138,124,92][i];
  if(type==='edm') item.bpm=[128,124,122,112,126,130,134,142,144,174,174,168,190,176][i];
  if(type==='hiphop'){item.bpm=[142,140,98,84,76,102,94,88,90,78][i];item.swing=i===9?18:0;}
  if(type==='jazz') item.bpm=[116,150,188,176,142,168,126,120][i];
  if(type==='latin') item.bpm=[154,124,118,112,136,96,124,100][i];
  if(type==='world') item.bpm=[108,96,112,138,132,120,150,116][i];
  if(type==='odd') item.meter=name.includes('/')?name:'4/4';
  if(['Math Rock','Djent','Metric Modulation'].includes(name)) item.difficulty='上級';
  if(['Acoustic Pop','Teen Pop','Tropical House'].includes(name)) item.difficulty='初級';
  presets[id]=item;
 }));

 const plannedFamilies=[
  ['jpop','J-POP',112,{kick:[0,6,8,11],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14]}],
  ['kpop','K-POP',124,{kick:[0,3,7,8,11,14],clap:[4,12],closedHat:[0,2,4,6,8,10,12,14]}],
  ['jrock','J-ROCK',148,{kick:[0,3,6,8,10,14],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],crash:[0]}],
  ['anisong','アニソン',152,{kick:[0,3,6,8,11,14],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],crash:[0]}],
  ['citypop','シティポップ',108,{kick:[0,6,10,14],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],openHat:[6,14]}],
  ['indiepop','Indie Pop',110,{kick:[0,7,10],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14]}],
  ['bedroom','Bedroom Pop',86,{kick:[0,7,11],snare:[4,12],closedHat:[0,4,8,12],rim:[15]}],
  ['dreampop','Dream Pop',96,{kick:[0,8,11],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],openHat:[14]}],
  ['synthpop','Synth Pop',122,{kick:[0,4,8,12],clap:[4,12],closedHat:[2,6,10,14]}],
  ['hyperpop','Hyper Pop',168,{kick:[0,3,6,8,11,14],clap:[4,12],closedHat:[0,1,2,4,6,8,10,12,14,15]}],
  ['tiktok','TikTok Pop',126,{kick:[0,4,7,8,12,14],clap:[4,12],closedHat:[2,6,10,14]}],
  ['lofipop','Lo-Fi Pop',82,{kick:[0,7,10],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],rim:[3,15]}],
  ['gospel','ゴスペル',112,{kick:[0,6,10,14],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],tambourine:[4,12]}],
  ['country','カントリー',118,{kick:[0,8],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],ride:[0,4,8,12]}],
  ['ska','スカ',146,{kick:[0,8],snare:[4,12],closedHat:[2,6,10,14],openHat:[6,14]}],
  ['dub','ダブ',74,{kick:[8],snare:[8],closedHat:[2,6,10,14],rim:[4,12]}],
  ['breakbeats','ブレイクビーツ',128,{kick:[0,3,10,14],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14]}],
  ['ukgarage','UKガラージ',132,{kick:[0,6,10,14],clap:[4,12],closedHat:[2,5,8,11,14]}],
  ['jungle','ジャングル',170,{kick:[0,3,10],snare:[4,7,12,15],closedHat:[0,2,4,6,8,10,12,14]}],
  ['marching','マーチング',120,{kick:[0,8],snare:[0,2,4,6,8,10,12,14],crash:[0,8]}]
 ];
 const variants=['ベーシック','キック変化','シンコペーション','オープンハット','ゴースト風','タム追加','クラッシュ導入','ブレイク型','前ノリ','後ノリ','ハーフタイム','ダブルタイム','ミニマル','高密度','展開前','上級チャレンジ'];
 const clone=p=>Object.fromEntries(Object.entries(p).map(([k,v])=>[k,[...v]]));
 const shift=(a,d)=>[...new Set(a.map(v=>(v+d+16)%16))].sort((a,b)=>a-b);
 plannedFamilies.forEach(([key,label,bpm,base])=>variants.forEach((variant,i)=>{
  const pattern=clone(base);
  if(i===1&&pattern.kick)pattern.kick=[...new Set([...pattern.kick,3,14])].sort((a,b)=>a-b);
  if(i===2&&pattern.kick)pattern.kick=shift(pattern.kick,1);
  if(i===3)pattern.openHat=[...new Set([...(pattern.openHat||[]),6,14])];
  if(i===4)pattern.rim=[...new Set([...(pattern.rim||[]),3,11,15])];
  if(i===5){pattern.highTom=[2,6];pattern.floorTom=[10,14];}
  if(i===6)pattern.crash=[0,12];
  if(i===7)Object.keys(pattern).forEach(k=>pattern[k]=pattern[k].filter(v=>v<8));
  if(i===8&&pattern.kick)pattern.kick=shift(pattern.kick,-1);
  if(i===9&&pattern.snare)pattern.snare=shift(pattern.snare,1);
  if(i===10){pattern.snare=[8];pattern.kick=[0,6,10,14];}
  if(i===11)pattern.closedHat=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  if(i===12)Object.keys(pattern).forEach(k=>pattern[k]=pattern[k].filter((_,idx)=>idx%2===0));
  if(i===13){pattern.closedHat=[0,1,2,3,4,6,7,8,9,10,11,12,14,15];pattern.shaker=[1,3,5,7,9,11,13,15];}
  if(i===14){pattern.crash=[0];pattern.highTom=[10,12];pattern.floorTom=[14,15];}
  if(i===15){pattern.kick=[0,3,6,7,10,13,15];pattern.snare=[4,11,12];pattern.closedHat=[0,1,2,4,6,7,8,10,12,13,14,15];pattern.openHat=[7,15];}
  presets[`plan2026_${key}_${String(i+1).padStart(2,'0')}`]={
   name:`${label} ${variant}`,subtitle:`${label}追加パターン ${i+1}`,category:label,bpm:Math.max(60,Math.min(200,bpm+(i-7)*2)),swing:['lofipop','bedroom','dub'].includes(key)?14:0,difficulty:i<5?'初級':i<11?'中級':'上級',meter:'4/4',feature:`${variant}の配置で${label}の特徴を比較できる`,role:'キック・スネア・ハイハットの役割を分けて聴き、ジャンル固有の重心をつかむ。',practice:`BPM ${Math.max(50,bpm-30)}から始め、2小節ずつ安定して繰り返そう。`,lesson:`${label}の基本形から発展形まで、音数・アクセント・休符の違いを段階的に学ぶ。`,pattern
  };
 }));
})();