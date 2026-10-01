// Tiny Web Audio synth for the bomb: no audio files to ship.

let ctx: AudioContext | null = null;

/** Must be called from a tap (browsers block audio until a user gesture). */
export function unlockAudio() {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
  } catch {
    ctx = null; // audio unavailable; play silently
  }
}

export function playTick() {
  if (!ctx || ctx.state !== "running") return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.07);
}

export function playBoom() {
  if (!ctx || ctx.state !== "running") return;
  const now = ctx.currentTime;
  const duration = 1.2;

  // Decaying noise burst
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(1800, now);
  lowpass.frequency.exponentialRampToValueAtTime(120, now + duration);
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.9;
  noise.connect(lowpass).connect(noiseGain).connect(ctx.destination);
  noise.start(now);

  // Low thump
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(35, now + 0.6);
  oscGain.gain.setValueAtTime(0.8, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
  osc.connect(oscGain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.8);
}
