(() => {
  if (typeof drumFills === 'undefined') return;

  const genreAliases = {
    'ファンク': 'ファンク / R&B',
    'R&B': 'ファンク / R&B',
    'ラテン': 'ラテン / ワールド',
    'ワールド': 'ラテン / ワールド',
    'ブルース': 'ブルース / シャッフル',
    'シャッフル': 'ブルース / シャッフル'
  };
  Object.values(drumFills).forEach(fill => {
    fill.genre = genreAliases[fill.genre] || fill.genre;
    if (!fill.practicePoint) fill.practicePoint = '最初はゆっくりしたBPMで、音の強弱と次の1拍目へのつながりを確認しよう。';
  });

  const targets = {
    'ロック': 50,
    'ポップス': 40,
    'ファンク / R&B': 30,
    'ジャズ': 30,
    'メタル': 30,
    'EDM': 30,
    'ヒップホップ': 30,
    'ラテン / ワールド': 40,
    'ブルース / シャッフル': 20,
    '変拍子': 20
  };

  const specs = {
    'ロック': { themes:['スネア連打','タム下降','キック混合','クラッシュ締め','フロアタム展開'], tracks:['snare','highTom','midTom','floorTom','kick'], ending:'crash', detail:'太いアクセントとタム回しで、次の小節へ力強くつなぐロックフィル。' },
    'ポップス': { themes:['J-POPショート','バラード','16ビート','サビ前','歌もの'], tracks:['snare','highTom','midTom','floorTom'], ending:'crash', detail:'歌を邪魔しない音数と自然な盛り上がりを意識したポップスフィル。' },
    'ファンク / R&B': { themes:['リニア','ゴーストノート','ポケット','キック会話','R&Bターン'], tracks:['kick','snare','closedHat','highTom','floorTom'], ending:'openHat', detail:'同時打ちを抑え、ゴーストノートと食い込みでグルーヴを作るフィル。' },
    'ジャズ': { themes:['スウィング','ブラシ風','ビバップ','コンピング','トレード'], tracks:['snare','ride','highTom','floorTom'], ending:'rideBell', detail:'強弱と間を活かし、スウィングの流れを止めずに展開するジャズフィル。' },
    'メタル': { themes:['ブラスト前','ダブルキック','チャイナ締め','高速タム','ブレイクダウン'], tracks:['kick','snare','highTom','midTom','floorTom'], ending:'china', detail:'高速連打と強いアクセントで、重く鋭く展開を切り替えるメタルフィル。' },
    'EDM': { themes:['ビルドアップ','ライザー','ドロップ前','クラップ加速','スネアロール'], tracks:['snare','clap','closedHat','floorTom'], ending:'crash', detail:'密度とベロシティを段階的に上げ、ドロップへ緊張感を作るEDMフィル。' },
    'ヒップホップ': { themes:['Boom Bap','Trap','Lo-Fi','Drill','ブレイクス'], tracks:['kick','snare','closedHat','rim','floorTom'], ending:'openHat', detail:'キックの食い込み、スネアの間、ハットロールを活かしたヒップホップフィル。' },
    'ラテン / ワールド': { themes:['サンバ','ボサノバ','マンボ','アフロ','パーカッション'], tracks:['conga','timbale','cowbell','claves','shaker'], ending:'timbale', detail:'複数のパーカッションを交差させ、明るい推進力を作るラテン／ワールド系フィル。' },
    'ブルース / シャッフル': { themes:['12/8','シャッフル','ブルースターン','3連タム','スネアゴースト'], tracks:['snare','highTom','midTom','floorTom','ride'], ending:'crash', detail:'3連系の跳ねを保ちながら、ブルースらしい粘りを加えるフィル。' },
    '変拍子': { themes:['5/4','7/8','9/8','11/8','アクセント分割'], tracks:['snare','highTom','midTom','floorTom','kick'], ending:'crash', detail:'拍のまとまりをアクセントで明確にし、変拍子でも流れを見失わないフィル。' }
  };

  function makePattern(spec, length, seed) {
    const pattern = {};
    const meta = {};
    for (let step = 0; step < length; step++) {
      const track = spec.tracks[(step + seed + Math.floor(step / 2)) % spec.tracks.length];
      if ((step + seed) % 5 === 1 && length > 4) continue;
      (pattern[track] ||= []).push(step);
      const isLast = step === length - 1;
      const expression = isLast ? 'flam' : ((step + seed) % 7 === 0 ? 'accent' : ((step + seed) % 4 === 0 ? 'ghost' : 'normal'));
      const velocity = isLast ? 124 : expression === 'accent' ? 112 : expression === 'ghost' ? 52 : 88 + ((step * 3 + seed) % 15);
      (meta[track] ||= {})[step] = [expression, velocity];
    }
    const last = length - 1;
    (pattern[spec.ending] ||= []).push(last);
    (meta[spec.ending] ||= {})[last] = ['accent', 127];
    return { pattern, meta };
  }

  Object.entries(targets).forEach(([genre, target]) => {
    const existing = Object.values(drumFills).filter(fill => fill.genre === genre).length;
    const spec = specs[genre];
    for (let number = existing + 1; number <= target; number++) {
      const length = [4, 8, 16][(number - 1) % 3];
      const difficulty = length === 4 ? '初級' : length === 8 ? '中級' : '上級';
      const theme = spec.themes[(number - 1) % spec.themes.length];
      const meter = genre === '変拍子' ? ['5/4','7/8','9/8','11/8'][(number - 1) % 4] : null;
      const generated = makePattern(spec, length, number);
      drumFills[`library_${genre.replace(/[^a-zA-Z0-9一-龠ぁ-んァ-ヶ]/g,'_')}_${number}`] = {
        name: `${theme}${meter ? ` ${meter}` : ''} ${number}`,
        genre,
        length,
        difficulty,
        description: spec.detail,
        practicePoint: length === 4
          ? '1拍目の直前だけを繰り返し、短く正確に着地する練習をしよう。'
          : length === 8
            ? '2拍分を半分の速さから練習し、各アクセントを均等にそろえよう。'
            : '1小節を4拍ずつ分けて覚え、最後に通して次の1拍目へつなげよう。',
        meter: meter || '4/4',
        ...generated
      };
    }
  });
})();