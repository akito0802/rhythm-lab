(()=>{
  const toneProfiles={
    jazz:{label:'Jazz Ride',partials:[1,1.48,2.16,2.72,3.35],base:410,decay:1.55,noise:.20,brightness:5200,bell:.18},
    bright:{label:'Bright Ride',partials:[1,1.62,2.31,3.08,4.12],base:470,decay:1.35,noise:.26,brightness:7200,bell:.22},
    dark:{label:'Dark Ride',partials:[1,1.42,1.93,2.58,3.12],base:330,decay:1.8,noise:.15,brightness:3900,bell:.12},
    bell:{label:'Bell Ride',partials:[1,1.51,2.04,2.95,4.3],base:610,decay:1.65,noise:.10,brightness:6800,bell:.46},
    thin:{label:'Thin Ride',partials:[1,1.73,2.49,3.4],base:520,decay:1.05,noise:.30,brightness:8200,bell:.10},
    vintage:{label:'Vintage Ride',partials:[1,1.46,2.08,2.83,3.66],base:370,decay:2.05,noise:.18,brightness:4600,bell:.16}
  };

  let selectedTone=localStorage.getItem('rhythmLabRideTone')||'jazz';
  if(!toneProfiles[selectedTone])selectedTone='jazz';

  function envelope(g,time,peak,duration,attack=.002){
    g.gain.setValueAtTime(.0001,time);
    g.gain.exponentialRampToValueAtTime(Math.max(.001,peak),time+attack);
    g.gain.exponentialRampToValueAtTime(.0001,time+duration);
  }

  function noiseBuffer(c,duration){
    const length=Math.max(1,Math.floor(c.sampleRate*duration));
    const buffer=c.createBuffer(1,length,c.sampleRate);
    const data=buffer.getChannelData(0);
    let last=0;
    for(let i=0;i<length;i++){
      const white=Math.random()*2-1;
      last=last*.14+white*.86;
      data[i]=last*(1-i/length*.18);
    }
    return buffer;
  }

  function playRide(time,amp){
    const c=state?.audioContext;
    const out=state?.masterGain;
    if(!c||!out)return;
    const p=toneProfiles[selectedTone];
    const master=c.createGain();
    const high=c.createBiquadFilter();
    high.type='highpass';high.frequency.value=900;
    const low=c.createBiquadFilter();
    low.type='lowpass';low.frequency.value=p.brightness;
    master.connect(high).connect(low).connect(out);

    p.partials.forEach((ratio,index)=>{
      const osc=c.createOscillator();
      const gain=c.createGain();
      osc.type=index%2?'square':'triangle';
      osc.frequency.value=p.base*ratio*(.985+Math.random()*.03);
      envelope(gain,time,amp*(.12/(index+1)),p.decay*(1-index*.08),.001);
      osc.connect(gain).connect(master);
      osc.start(time);osc.stop(time+p.decay+.1);
    });

    const noise=c.createBufferSource();
    const noiseGain=c.createGain();
    const band=c.createBiquadFilter();
    noise.buffer=noiseBuffer(c,p.decay+.2);
    band.type='bandpass';band.frequency.value=p.brightness*.72;band.Q.value=.55;
    envelope(noiseGain,time,amp*p.noise,p.decay,.001);
    noise.connect(band).connect(noiseGain).connect(master);
    noise.start(time);noise.stop(time+p.decay+.25);

    if(p.bell>0){
      const bell=c.createOscillator();
      const bellGain=c.createGain();
      bell.type='sine';bell.frequency.value=p.base*3.05;
      envelope(bellGain,time,amp*p.bell,p.decay*.72,.001);
      bell.connect(bellGain).connect(master);
      bell.start(time);bell.stop(time+p.decay);
    }
  }

  const originalSynthHit=window.synthHit;
  window.synthHit=function(id,time,amp,profile){
    if(id==='ride')return playRide(time,amp);
    return originalSynthHit(id,time,amp,profile);
  };

  function addSelector(){
    const grid=document.querySelector('.performance-grid');
    if(!grid||document.querySelector('#rideToneSelect'))return;
    const label=document.createElement('label');
    label.className='select-control ride-tone-control';
    label.innerHTML='<span>ライド音色</span>';
    const select=document.createElement('select');
    select.id='rideToneSelect';
    Object.entries(toneProfiles).forEach(([value,p])=>{
      const option=document.createElement('option');
      option.value=value;option.textContent=p.label;
      select.appendChild(option);
    });
    select.value=selectedTone;
    select.addEventListener('change',()=>{
      selectedTone=select.value;
      localStorage.setItem('rhythmLabRideTone',selectedTone);
      if(state?.audioContext?.state==='suspended')state.audioContext.resume();
      playRide(state?.audioContext?.currentTime||0,.72);
    });
    label.appendChild(select);
    grid.appendChild(label);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addSelector);
  else addSelector();
})();
