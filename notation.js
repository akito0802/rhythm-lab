(() => {
  const rows=[
    ['crash','CR'],['ride','RD'],['openHat','OH'],['closedHat','HH'],['snare','SD'],['rim','RS'],['highTom','HT'],['midTom','MT'],['floorTom','FT'],['kick','BD']
  ];
  function cell(active,step){
    if(!active)return '<span class="notation-cell is-rest">·</span>';
    return `<span class="notation-cell is-hit" data-step="${step}">●</span>`;
  }
  function renderNotation(){
    const host=document.querySelector('#notationGrid');
    if(!host||typeof state==='undefined'||typeof effectiveSteps!=='function')return;
    const steps=effectiveSteps();
    host.style.setProperty('--notation-steps',steps);
    const header=`<div class="notation-label">楽器</div>${Array.from({length:steps},(_,i)=>`<span class="notation-count ${i%4===0?'is-beat':''}">${i%4===0?Math.floor(i/4)+1:['e','&','a'][i%4-1]}</span>`).join('')}`;
    const body=rows.filter(([id])=>state.pattern[id]).map(([id,label])=>{
      const values=state.pattern[id]||[];
      return `<div class="notation-label">${label}</div>${Array.from({length:steps},(_,i)=>cell(!!values[i],i)).join('')}`;
    }).join('');
    host.innerHTML=header+body;
    const simple=document.querySelector('#notationText');
    if(simple){
      simple.textContent=rows.filter(([id])=>state.pattern[id]).map(([id,label])=>`${label}  ${Array.from({length:steps},(_,i)=>state.pattern[id]?.[i]?'x':'-').join('')}`).join('\n');
    }
  }
  function install(){
    if(typeof renderPattern==='function'){
      const original=renderPattern;
      renderPattern=function(){original();renderNotation();};
    }
    if(typeof loadPreset==='function'){
      const originalLoad=loadPreset;
      loadPreset=function(id){originalLoad(id);renderNotation();};
    }
    document.querySelector('#copyNotationButton')?.addEventListener('click',async()=>{
      const text=document.querySelector('#notationText')?.textContent||'';
      try{await navigator.clipboard.writeText(text);const b=document.querySelector('#copyNotationButton');b.textContent='コピー済み ✓';setTimeout(()=>b.textContent='簡易譜をコピー',1200)}catch{}
    });
    renderNotation();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();