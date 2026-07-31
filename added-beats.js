(()=>{
const groups={
'ロック':['ガレージロック','エモ','メロコア','ニューメタル','プログレッシブロック','ブリットポップ','サザンロック','ブルースロック','スタジアムロック','ハードコア'],
'ポップス':['J-POP','K-POP','アニメソング','ピアノポップ','シティバラード','エレクトロポップ','ドリームポップ','インディーポップ','オーケストラポップ','ソフトロック'],
'EDM':['Progressive House','Future House','Bass House','Electro House','Hardstyle','Happy Hardcore','Drumstep','Moombahton','UK Bass','Melodic Techno'],
'ヒップホップ':['East Coast','West Coast','Memphis','G-Funk','Jazz Hop','Chill Hop','Cloud Rap','Rage','Phonk','Boom Trap'],
'ファンク・R&B':['P-Funk','Disco Funk','Soul','Neo Funk','Gospel Groove','Contemporary R&B','Smooth Groove','Pocket Groove'],
'ジャズ':['Bebop','Cool Jazz','Hard Bop','Modal Jazz','Fusion','Latin Jazz','Jazz Waltz','Fast Swing'],
'ラテン':['Rumba','Merengue','Son','Bolero','Mozambique','Guaguanco','Songo','Timba'],
'ワールド':['Afrobeat','Highlife','Calypso','Soca','Dub','One Drop','Rockers','Steppers','Flamenco','Celtic'],
'変拍子':['5/8','9/8','11/8','12/8','13/8','15/8','17/8','Mixed Meter']};
const bpm={ロック:[128,118,182,98,132,112,106,120,126,190],ポップス:[118,124,168,106,82,126,96,116,110,104],EDM:[128,126,126,130,150,174,170,110,136,126],ヒップホップ:[92,96,86,94,84,82,140,150,150,145],'ファンク・R&B':[108,116,92,110,98,88,94,102],ジャズ:[188,112,154,132,128,144,126,210],ラテン:[102,132,112,86,118,104,122,134],ワールド:[110,118,106,132,74,76,82,88,120,112],変拍子:[110,112,108,118,106,104,102,116]};
const meters={変拍子:['5/8','9/8','11/8','12/8','13/8','15/8','17/8','7/8']};
const base={
'ロック':{kick:[0,3,8,10],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],crash:[0]},
'ポップス':{kick:[0,7,8,11],snare:[4,12],clap:[12],closedHat:[0,2,4,6,8,10,12,14]},
'EDM':{kick:[0,4,8,12],clap:[4,12],closedHat:[0,2,4,6,8,10,12,14],openHat:[2,6,10,14]},
'ヒップホップ':{kick:[0,7,10],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14],rim:[15]},
'ファンク・R&B':{kick:[0,3,7,10],snare:[4,12],closedHat:[0,2,3,4,6,8,10,11,12,14,15],rim:[5,13]},
'ジャズ':{kick:[0,10],snare:[4,12],ride:[0,3,6,8,11,14],pedalHat:[4,12]},
'ラテン':{kick:[0,6,10],side:[4,12],conga:[3,7,11,15],claves:[0,5,8,13],shaker:[0,2,4,6,8,10,12,14]},
'ワールド':{kick:[0,6,8,14],snare:[4,12],shaker:[0,2,4,6,8,10,12,14],conga:[3,7,11,15]},
'変拍子':{kick:[0,6,10],snare:[4,12],closedHat:[0,2,4,6,8,10,12,14]}};
const desc={
'ロック':'ギター中心の推進力と強いバックビートを学べるロック系グルーヴ。',
'ポップス':'歌を支える分かりやすい拍感と、展開を作るアクセントが特徴。',
'EDM':'反復するキックと裏拍のハイハットでダンスの脈を作る。',
'ヒップホップ':'間とシンコペーションを活かし、重心の低いノリを作る。',
'ファンク・R&B':'16分音符の細かな強弱とポケット感を学ぶグルーヴ。',
'ジャズ':'ライドの流れと柔軟なアクセントでスウィング感を作る。',
'ラテン':'複数の打楽器を重ね、クラーベを軸に前進感を作る。',
'ワールド':'地域ごとの打楽器パターンと反復の重なりを体験できる。',
'変拍子':'均等でない拍のまとまりを数えながら感じる練習に向く。'};
function clonePattern(p){return Object.fromEntries(Object.entries(p).map(([k,v])=>[k,[...v]]))}
function vary(p,i,g){const q=clonePattern(p);if(i%2===1)q.kick=[...new Set([...(q.kick||[]),2+(i%5),14])].filter(x=>x<16);if(i%3===1)q.openHat=[6,14];if(i%3===2)q.crash=[0,8];if(g==='EDM'&&i>=4)q.closedHat=[0,2,4,6,8,9,10,11,12,14,15];if(g==='ヒップホップ'&&i>=6)q.closedHat=[0,2,4,6,8,9,10,11,12,14,15];if(g==='ジャズ'){q.ride=i%2?[0,3,6,8,10,13]:[0,3,6,8,11,14];if(i===6){q.snare=[8];q.pedalHat=[4,12]}}if(g==='ラテン'){if(i%2)q.timbale=[4,12,15];if(i>=4)q.cowbell=[0,4,8,12]}if(g==='ワールド'){if(i%2)q.claves=[0,5,8,13];if(i>=4)q.rim=[2,6,10,14]}return q}
let n=0;
Object.entries(groups).forEach(([category,names])=>names.forEach((name,i)=>{
 const id='extraBeat'+(++n);
 const meter=meters[category]?.[i]||((category==='ジャズ'&&i===6)?'3/4':'4/4');
 const difficulty=(category==='変拍子'||i>=6)?'上級':i>=3?'中級':'初級';
 const swing=(category==='ジャズ'||['Jazz Hop','Chill Hop','Soul','Pocket Groove'].includes(name))?24:0;
 presets[id]={category,name,subtitle:`${category}追加ビート`,bpm:bpm[category][i],swing,difficulty,meter,
 feature:desc[category],role:'キックが土台、スネアや打楽器が拍の輪郭、ハイハット類が流れを作る。',
 practice:`BPM ${Math.max(55,bpm[category][i]-30)}から始め、まず土台の2音だけ確認してから他の楽器を重ねよう。`,
 lesson:`${name}の代表的なノリを学習用に整理したプリセット。`,pattern:vary(base[category],i,category)};
}));
const expansion=document.createElement('script');
expansion.src='beat-expansion.js?v=24';
document.head.appendChild(expansion);
})();