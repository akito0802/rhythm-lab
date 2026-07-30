const tracks = [
  { id: "kick", name: "キック", icon: "●", color: "#ff3cac" },
  { id: "snare", name: "スネア", icon: "◎", color: "#ffbd2e" },
  { id: "clap", name: "クラップ", icon: "👏", color: "#ff8b32" },
  { id: "closedHat", name: "クローズHH", icon: "◉", color: "#33d6c8" },
  { id: "openHat", name: "オープンHH", icon: "◌", color: "#23a9df" },
  { id: "lowTom", name: "ロータム", icon: "▣", color: "#38e054" },
  { id: "highTom", name: "ハイタム", icon: "▢", color: "#79ef65" },
  { id: "perc", name: "パーカッション", icon: "✕", color: "#9c5cff" }
];

const presets = {
  basic8: {
    name: "基本の8ビート",
    subtitle: "ロック・ポップス",
    bpm: 100,
    lesson: "ハイハットが8分音符を刻み、スネアが2拍目と4拍目に入る基本形だよ。",
    pattern: {
      kick: [0, 8], snare: [4, 12], closedHat: [0, 2, 4, 6, 8, 10, 12, 14]
    }
  },
  fourFloor: {
    name: "4つ打ち",
    subtitle: "ダンス・テクノ",
    bpm: 124,
    lesson: "キックが4分音符で毎拍鳴るから、強く安定したダンスの脈が生まれるよ。",
    pattern: {
      kick: [0, 4, 8, 12], clap: [4, 12], closedHat: [2, 6, 10, 14], openHat: [6, 14]
    }
  },
  hiphop: {
    name: "ヒップホップ",
    subtitle: "重いバックビート",
    bpm: 88,
    lesson: "少ない音数とキックのずれが、ゆったりしたグルーヴを作っているよ。",
    pattern: {
      kick: [0, 7, 10], snare: [4, 12], closedHat: [0, 2, 4, 6, 8, 10, 12, 14], perc: [15]
    }
  },
  funk: {
    name: "ファンク",
    subtitle: "16分の細かいノリ",
    bpm: 108,
    lesson: "16分音符の細かい配置と休符の組み合わせで、跳ねるようなグルーヴを作るよ。",
    pattern: {
      kick: [0, 3, 7, 10], snare: [4, 12], clap: [12], closedHat: [0, 2, 3, 4, 6, 8, 10, 11, 12, 14, 15], openHat: [7], perc: [5, 13]
    }
  },
  shuffle: {
    name: "シャッフル",
    subtitle: "跳ねる3連の感覚",
    bpm: 112,
    swing: 36,
    lesson: "スウィングを強くすると、均等な16分音符が長短に変化して跳ねる感じになるよ。",
    pattern: {
      kick: [0, 8, 11], snare: [4, 12], closedHat: [0, 2, 4, 6, 8, 10, 12, 14]
    }
  },
  latin: {
    name: "ラテン",
    subtitle: "シンコペーション",
    bpm: 116,
    lesson: "拍の頭以外にも音を置くシンコペーションが、前へ進む躍動感を作るよ。",
    pattern: {
      kick: [0, 6, 10], snare: [4, 12], closedHat: [0, 2, 4, 6, 8, 10, 12, 14], lowTom: [3, 7, 11, 15], perc: [0, 5, 8, 13]
    }
  }
};

const state = {
  pattern: Object.fromEntries(tracks.map(track => [track.id, Array(16).fill(false)])),
  isPlaying: false,
  currentStep: 0,
  bpm: 100,
  swing: 0,
  volume: 0.8,
  timer: null,
  audioContext: null,
  masterGain: null,
  selectedPreset: null
};

const sequencer = document.querySelector("#sequencer");
const playButton = document.querySelector("#playButton");
const clearButton = document.querySelector("#clearButton");
const bpmInput = document.querySelector("#bpmInput");
const bpmValue = document.querySelector("#bpmValue");
const swingInput = document.querySelector("#swingInput");
const swingValue = document.querySelector("#swingValue");
const volumeInput = document.querySelector("#volumeInput");
const volumeValue = document.querySelector("#volumeValue");
const lessonTitle = document.querySelector("#lessonTitle");
const lessonText = document.querySelector("#lessonText");
const beatCount = document.querySelector("#beatCount");
const subdivisionCount = document.querySelector("#subdivisionCount");
const presetButtons = document.querySelector("#presetButtons");
const helpDialog = document.querySelector("#helpDialog");

function buildSequencer() {
  tracks.forEach(track => {
    const row = document.createElement("div");
    row.className = "track-row";
    row.dataset.track = track.id;
    row.style.setProperty("--track-color", track.color);

    const label = document.createElement("div");
    label.className = "track-label";
    label.innerHTML = `<span class="track-icon">${track.icon}</span><span>${track.name}</span>`;
    row.append(label);

    for (let stepIndex = 0; stepIndex < 16; stepIndex += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "step";
      button.dataset.step = String(stepIndex);
      button.setAttribute("aria-label", `${track.name} ${stepIndex + 1}番目のステップ`);
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => toggleStep(track.id, stepIndex, button));
      row.append(button);
    }
    sequencer.append(row);
  });
}

function buildPresets() {
  Object.entries(presets).forEach(([id, preset]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "preset-button";
    button.dataset.preset = id;
    button.innerHTML = `<strong>${preset.name}</strong><span>${preset.subtitle}</span>`;
    button.addEventListener("click", () => loadPreset(id));
    presetButtons.append(button);
  });
}

function toggleStep(trackId, stepIndex, button) {
  ensureAudio();
  state.pattern[trackId][stepIndex] = !state.pattern[trackId][stepIndex];
  button.classList.toggle("is-active", state.pattern[trackId][stepIndex]);
  button.setAttribute("aria-pressed", String(state.pattern[trackId][stepIndex]));
  state.selectedPreset = null;
  updatePresetSelection();
  if (state.pattern[trackId][stepIndex]) triggerSound(trackId, state.audioContext.currentTime);
}

function loadPreset(id) {
  const preset = presets[id];
  tracks.forEach(track => state.pattern[track.id].fill(false));
  Object.entries(preset.pattern).forEach(([trackId, steps]) => {
    steps.forEach(step => { state.pattern[trackId][step] = true; });
  });
  state.bpm = preset.bpm;
  state.swing = preset.swing ?? 0;
  state.selectedPreset = id;
  bpmInput.value = String(state.bpm);
  swingInput.value = String(state.swing);
  updateControls();
  lessonTitle.textContent = preset.name;
  lessonText.textContent = preset.lesson;
  renderPattern();
  updatePresetSelection();
}

function renderPattern() {
  document.querySelectorAll(".track-row").forEach(row => {
    const trackId = row.dataset.track;
    row.querySelectorAll(".step").forEach((button, index) => {
      const active = state.pattern[trackId][index];
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  });
}

function updatePresetSelection() {
  document.querySelectorAll(".preset-button").forEach(button => {
    button.classList.toggle("is-selected", button.dataset.preset === state.selectedPreset);
  });
}

function ensureAudio() {
  if (!state.audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    state.audioContext = new AudioContextClass();
    state.masterGain = state.audioContext.createGain();
    state.masterGain.gain.value = state.volume;
    state.masterGain.connect(state.audioContext.destination);
  }
  if (state.audioContext.state === "suspended") state.audioContext.resume();
}

function createNoiseBuffer() {
  const context = state.audioContext;
  const buffer = context.createBuffer(1, context.sampleRate * 0.5, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function triggerSound(trackId, time) {
  const context = state.audioContext;
  const output = state.masterGain;
  if (!context || !output) return;

  if (trackId === "kick") {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.14);
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.38);
    osc.connect(gain).connect(output);
    osc.start(time); osc.stop(time + 0.4);
    return;
  }

  if (["snare", "clap", "closedHat", "openHat", "perc"].includes(trackId)) {
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = createNoiseBuffer();
    filter.type = "highpass";
    const settings = {
      snare: [900, 0.22, 0.7], clap: [1200, 0.16, 0.62], closedHat: [6500, 0.055, 0.28],
      openHat: [5200, 0.34, 0.24], perc: [2600, 0.09, 0.34]
    }[trackId];
    filter.frequency.value = settings[0];
    gain.gain.setValueAtTime(settings[2], time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + settings[1]);
    source.connect(filter).connect(gain).connect(output);
    source.start(time); source.stop(time + settings[1] + 0.02);
    return;
  }

  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = "sine";
  const startFrequency = trackId === "lowTom" ? 120 : 190;
  osc.frequency.setValueAtTime(startFrequency, time);
  osc.frequency.exponentialRampToValueAtTime(startFrequency * 0.62, time + 0.16);
  gain.gain.setValueAtTime(0.75, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);
  osc.connect(gain).connect(output);
  osc.start(time); osc.stop(time + 0.3);
}

function stepDurationMs(step) {
  const base = 60000 / state.bpm / 4;
  const swingRatio = state.swing / 100;
  return step % 2 === 0 ? base * (1 + swingRatio) : base * (1 - swingRatio);
}

function playCurrentStep() {
  document.querySelectorAll(".step.is-current").forEach(step => step.classList.remove("is-current"));
  document.querySelectorAll(`.step[data-step="${state.currentStep}"]`).forEach(step => step.classList.add("is-current"));

  const beat = Math.floor(state.currentStep / 4) + 1;
  const subdivision = ["1", "e", "&", "a"][state.currentStep % 4];
  beatCount.textContent = String(beat);
  subdivisionCount.textContent = subdivision;

  const time = state.audioContext.currentTime;
  tracks.forEach(track => {
    if (state.pattern[track.id][state.currentStep]) triggerSound(track.id, time);
  });

  const current = state.currentStep;
  state.currentStep = (state.currentStep + 1) % 16;
  state.timer = window.setTimeout(playCurrentStep, stepDurationMs(current));
}

function startPlayback() {
  ensureAudio();
  state.isPlaying = true;
  playButton.classList.add("is-playing");
  playButton.setAttribute("aria-label", "停止");
  playCurrentStep();
}

function stopPlayback() {
  state.isPlaying = false;
  window.clearTimeout(state.timer);
  state.timer = null;
  state.currentStep = 0;
  playButton.classList.remove("is-playing");
  playButton.setAttribute("aria-label", "再生");
  document.querySelectorAll(".step.is-current").forEach(step => step.classList.remove("is-current"));
  beatCount.textContent = "1";
  subdivisionCount.textContent = "e";
}

function clearPattern() {
  tracks.forEach(track => state.pattern[track.id].fill(false));
  state.selectedPreset = null;
  lessonTitle.textContent = "自由にビートを作ろう";
  lessonText.textContent = "光るマスをタップすると、その位置で音が鳴るよ。4マスで1拍、16マスで1小節。";
  renderPattern();
  updatePresetSelection();
}

function updateControls() {
  bpmValue.textContent = String(state.bpm);
  swingValue.textContent = `${state.swing}%`;
  volumeValue.textContent = `${Math.round(state.volume * 100)}%`;
}

playButton.addEventListener("click", () => state.isPlaying ? stopPlayback() : startPlayback());
clearButton.addEventListener("click", clearPattern);

bpmInput.addEventListener("input", event => {
  state.bpm = Number(event.target.value);
  bpmValue.textContent = String(state.bpm);
});

swingInput.addEventListener("input", event => {
  state.swing = Number(event.target.value);
  swingValue.textContent = `${state.swing}%`;
});

volumeInput.addEventListener("input", event => {
  state.volume = Number(event.target.value) / 100;
  volumeValue.textContent = `${event.target.value}%`;
  if (state.masterGain) state.masterGain.gain.setTargetAtTime(state.volume, state.audioContext.currentTime, 0.01);
});

document.querySelector("#helpButton").addEventListener("click", () => helpDialog.showModal());
document.querySelector("#closeHelpButton").addEventListener("click", () => helpDialog.close());
helpDialog.addEventListener("click", event => {
  if (event.target === helpDialog) helpDialog.close();
});

document.addEventListener("keydown", event => {
  if (event.code === "Space" && !["INPUT", "BUTTON"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    state.isPlaying ? stopPlayback() : startPlayback();
  }
});

buildSequencer();
buildPresets();
loadPreset("basic8");
