(() => {
  const SAMPLE_KIT_ID='recorded-acoustic';
  const base='https://tonejs.github.io/audio/drum-samples/Kit8/';

  // 実録キットに存在する素材を、40トラックすべてへ用途別に割り当てる。
  // 専用録音がない補助打楽器は最も近い実録素材を音程・減衰で調整する。
  const sampleMap={
    kick:{file:'kick.mp3'},surdo:{file:'kick.mp3',rate:.72,gain:1.08},
    snare:{file:'snare.mp3'},clap:{file:'snare.mp3',rate:1.08,gain:.78},rim:{file:'snare.mp3',rate:1.42,gain:.62},side:{file:'snare.mp3',rate:1.32,gain:.58},
    brushSnare:{file:'snare.mp3',rate:.88,gain:.46},crossStick:{file:'snare.mp3',rate:1.55,gain:.55},cajon:{file:'snare.mp3',rate:.72,gain:.72},
    closedHat:{file:'hihat.mp3',rate:1.08,gain:.72,cut:.16},pedalHat:{file:'hihat.mp3',rate:.94,gain:.58,cut:.22},openHat:{file:'hihat.mp3',rate:.82,gain:.82},
    shaker:{file:'hihat.mp3',rate:1.28,gain:.38,cut:.12},cabasa:{file:'hihat.mp3',rate:1.18,gain:.34,cut:.16},maracas:{file:'hihat.mp3',rate:1.34,gain:.32,cut:.12},guiro:{file:'hihat.mp3',rate:.72,gain:.34,cut:.30},
    highTom:{file:'tom1.mp3',rate:1.05},midTom:{file:'tom2.mp3'},floorTom:{file:'tom3.mp3'},lowTom:{file:'tom3.mp3',rate:.82,gain:1.04},rotoTom:{file:'tom1.mp3',rate:1.38,gain:.75},
    conga:{file:'tom1.mp3',rate:1.22,gain:.72},bongo:{file:'tom1.mp3',rate:1.48,gain:.64},timbale:{file:'tom1.mp3',rate:1.62,gain:.68},djembe:{file:'tom2.mp3',rate:1.18,gain:.78},
    crash:{file:'crash.mp3'},crash2:{file:'crash.mp3',rate:.92,gain:.90},splash:{file:'crash.mp3',rate:1.34,gain:.62,cut:.55},china:{file:'crash.mp3',rate:.78,gain:.82},stack:{file:'crash.mp3',rate:1.52,gain:.58,cut:.42},
    ride:{file:'ride.mp3'},rideBell:{file:'ride.mp3',rate:1.42,gain:.72,cut:.48},sizzleRide:{file:'ride.mp3',rate:.90,gain:.82},
    cowbell:{file:'ride.mp3',rate:1.72,gain:.50,cut:.18},agogo:{file:'ride.mp3',rate:1.95,gain:.46,cut:.20},triangle:{file:'ride.mp3',rate:2.10,gain:.36,cut:.38},vibraslap:{file:'ride.mp3',rate:.66,gain:.42,cut:.55},
    tambourine:{file:'hihat.mp3',rate:1.16,gain:.46},claves:{file:'snare.mp3',rate:1.88,gain:.42,cut:.10},woodBlock:{file:'snare.mp3',rate:1.68,gain:.42,cut:.12}
  };

  const fileBuffers=new Map();
  const failed=new Set();
  let loading=false;

  function ensureKitOption(){
    if(typeof kitProfiles==='undefined')return;
    kitProfiles[SAMPLE_KIT_ID]={name:'Recorded Acoustic',recorded:true,pitch:1,decay:1,noise:1,filter:1};
    if(typeof soundLibraryGroups!=='undefined')soundLibraryGroups['Recorded Samples']=['Recorded Acoustic'];
    const select=document.querySelector('#drumKitSelect');
    if(!select)return;
    if(!select.querySelector(`option[value="${SAMPLE_KIT_ID}"]`)){
      const group=document.createElement('optgroup');group.label='Recorded Samples';
      const option=document.createElement('option');option.value=SAMPLE_KIT_ID;option.textContent='Recorded Acoustic（実録）';
      group.appendChild(option);select.insertBefore(group,select.firstChild);
    }
  }

  async function loadFile(file){
    if(fileBuffers.has(file)||failed.has(file))return;
    try{
      const response=await fetch(base+file,{mode:'cors',cache:'force-cache'});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const decoded=await state.audioContext.decodeAudioData(await response.arrayBuffer());
      fileBuffers.set(file,decoded);
    }catch(error){
      failed.add(file);
      console.warn('Recorded sample unavailable, synth fallback:',file,error);
    }
  }

  async function preloadRecordedKit(){
    if(loading)return;loading=true;
    ensureAudio();
    await Promise.all([...new Set(Object.values(sampleMap).map(x=>x.file))].map(loadFile));
    loading=false;
    const summary=document.querySelector('#kitSummary');
    if(summary&&performanceState.kit===SAMPLE_KIT_ID){
      summary.textContent=`${typeof tracks!=='undefined'?tracks.length:40} INSTRUMENTS・RECORDED ACOUSTIC`;
    }
  }

  function playRecorded(id,time,meta){
    const cfg=sampleMap[id];
    const buffer=cfg&&fileBuffers.get(cfg.file);
    if(!buffer)return false;
    const c=state.audioContext;
    const source=c.createBufferSource();
    const gain=c.createGain();
    const pan=c.createStereoPanner?c.createStereoPanner():null;
    const velocity=Math.max(.05,Math.min(1.25,(meta?.velocity??100)/100));
    let amp=velocity*(cfg.gain??1);
    if(meta?.expression==='accent')amp*=1.18;
    if(meta?.expression==='ghost')amp*=.34;
    source.buffer=buffer;
    source.playbackRate.value=(cfg.rate??1)*(1+(Math.random()*2-1)*.008);
    gain.gain.setValueAtTime(Math.max(.001,amp),time);
    if(cfg.cut){
      const end=time+Math.max(.04,buffer.duration*cfg.cut/(cfg.rate??1));
      gain.gain.setValueAtTime(Math.max(.001,amp),time);
      gain.gain.exponentialRampToValueAtTime(.0001,end);
      source.stop(end+.02);
    }
    if(pan){pan.pan.value=(Math.random()*2-1)*.025;source.connect(gain).connect(pan).connect(state.masterGain)}
    else source.connect(gain).connect(state.masterGain);
    source.start(time);
    return true;
  }

  function install(){
    ensureKitOption();
    if(typeof triggerSound!=='function')return;
    const synthTrigger=triggerSound;
    triggerSound=function(id,time,meta={expression:'normal',velocity:100}){
      if(performanceState.kit!==SAMPLE_KIT_ID)return synthTrigger(id,time,meta);
      if(!state.audioContext)ensureAudio();
      if(!fileBuffers.size&&!loading)preloadRecordedKit();
      const fire=(offset=0,scale=1)=>{
        const adjusted={...meta,velocity:(meta.velocity??100)*scale};
        if(!playRecorded(id,time+offset,adjusted))synthTrigger(id,time+offset,adjusted);
      };
      if(meta.expression==='flam'){fire(0,.58);fire(.035,1)}
      else if(meta.expression==='roll'){fire(0,.72);fire(.045,.85);fire(.09,1)}
      else fire();
    };

    const select=document.querySelector('#drumKitSelect');
    const saved=localStorage.getItem('rhythmLabPreferredKit');
    if(!saved||saved==='studio'||saved.startsWith('lib-')){
      performanceState.kit=SAMPLE_KIT_ID;
      if(select)select.value=SAMPLE_KIT_ID;
      localStorage.setItem('rhythmLabPreferredKit',SAMPLE_KIT_ID);
      if(typeof syncPerformanceUI==='function')syncPerformanceUI();
    }
    select?.addEventListener('change',e=>{
      localStorage.setItem('rhythmLabPreferredKit',e.target.value);
      if(e.target.value===SAMPLE_KIT_ID)preloadRecordedKit();
    });
    preloadRecordedKit();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();