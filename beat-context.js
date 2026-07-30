function saveSelectedBeatContext(){
 const id=document.querySelector('#presetSelect')?.value||state.selectedPreset;
 const preset=presets[id];
 if(!id||!preset)return;
 localStorage.setItem('rhythmLabSelectedBeat',JSON.stringify({id,name:preset.name,category:preset.category,bpm:preset.bpm,meter:preset.meter}));
}
document.querySelector('#presetSelect')?.addEventListener('change',saveSelectedBeatContext);
document.querySelector('.feature-page-link')?.addEventListener('click',saveSelectedBeatContext);
setTimeout(saveSelectedBeatContext,0);