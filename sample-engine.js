(() => {
  const SAMPLE_KIT_ID='recorded-acoustic';
  const base='https://tonejs.github.io/audio/drum-samples/Kit8/';
  const sampleMap={
    kick:['kick.mp3'],
    snare:['snare.mp3'],clap:['snare.mp3'],rim:['snare.mp3'],side:['snare.mp3'],
    closedHat:['hihat.mp3'],pedalHat:['hihat.mp3'],openHat:['hihat.mp3'],
    highTom:['tom1.mp3'],midTom:['tom2.mp3'],floorTom:['tom3.mp3'],
    crash:['crash.mp3'],ride:['ride.mp3'],splash:['crash.mp3'],china:['crash.mp3']
  };
  const buffers=new Map();
  const failed=new Set();
  let loading=false;

  function ensureKitOption(){
    if(typeof kitProfiles==='undefined')return;
    kitProfiles[SAMPLE_KIT_ID]={name:'Recorded Acoustic',recorded:true,pitch:1,decay:1,noise:1,filter:1};
    if(typeof soundLibraryGroups!=='undefined'){
      soundLibraryGroups['Recorded Samples']=['Recorded Acoustic'];
    }
    const select=document.querySelector('#drumKitSelect');
    if(!select)return;
    if(!select.querySelector(`option[value="${SAMPLE_KIT_ID}"]`)){
      const group=document.createElement('optgroup');group.label='Recorded Samples';
      const option=document.createElement('option');option.value=SAMPLE_KIT_ID;option.textContent='Recorded Acoustic';
      group.appendChild(option);select.insertBefore(group,select.firstChild);
    }
  }

  async function loadOne(id,file){
    if(buffers.has(id)||failed.has(id))return;
    try{
      const response=await fetch(base+file,{mode:'cors'});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const arrayBuffer=await response.arrayBuffer();
      const decoded=await state.audioContext.decodeAudioData(arrayBuffer);
      buffers.set(id,decoded);
    }catch(error){
      failed.add(id);
      console.warn('Recorded sample unavailable, synth fallback:',id,error);
    }
  }

  async function preloadRecordedKit(){
    if(loading)return;loading=true;
    ensureAudio();
    await Promise.all(Object.entries(sampleMap).map(([id,files])=>loadOne(id,files[0])));
    loading=false;
    const summary=document.querySelector('#kitSummary');
    if(summary&&performanceState.kit===SAMPLE_KIT_ID){
      const ready=[...buffers.keys()].length;
      summary.textContent=`24 INSTRUMENTS・RECORDED ACOUSTIC (${ready} READY)`;
    }
  }

  function playRecorded(id,time,meta){
    const buffer=buffers.get(id);if(!buffer)return false;
    const source=state.audioContext.createBufferSource();
    const gain=state.audioContext.createGain();
    const pan=state.audioContext.createStereoPanner?state.audioContext.createStereoPanner():null;
    const velocity=Math.max(.05,Math.min(1.25,(meta?.velocity??100)/100));
    let amp=velocity;
    if(meta?.expression==='accent')amp*=1.18;
    if(meta?.expression==='ghost')amp*=.34;
    source.buffer=buffer;
    source.playbackRate.value=1+(Math.random()*2-1)*.012;
    gain.gain.setValueAtTime(amp,time);
    if(pan){pan.pan.value=(Math.random()*2-1)*.035;source.connect(gain).connect(pan).connect(state.masterGain)}
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
      if(!state.audioContext){ensureAudio();}
      if(!buffers.size&&!loading)preloadRecordedKit();
      const fire=(offset=0,scale=1)=>{
        const adjusted={...meta,velocity:(meta.velocity??100)*scale};
        if(!playRecorded(id,time+offset,adjusted))synthTrigger(id,time+offset,adjusted);
      };
      if(meta.expression==='flam'){fire(0,.58);fire(.035,1)}
      else if(meta.expression==='roll'){fire(0,.72);fire(.045,.85);fire(.09,1)}
      else fire();
    };
    const select=document.querySelector('#drumKitSelect');
    select?.addEventListener('change',e=>{if(e.target.value===SAMPLE_KIT_ID)preloadRecordedKit()});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();