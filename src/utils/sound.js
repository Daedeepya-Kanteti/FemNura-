// Web Audio API Gentle Wellness Reminder Chime
// Does not depend on external mp3 files, operates 100% reliably in all modern browsers

let audioCtx = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a soothing, crystal-clear 2-tone harmonic reminder chime
 */
export function playReminderChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // First bell tone: D5 (587.33 Hz) with warm harmonic swell
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.28);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.35, now + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.9);

    // Second bell tone: high pleasant chime harmonic A5 (880 Hz) -> D6 (1174.66 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.22);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.45);

    gain2.gain.setValueAtTime(0.001, now + 0.22);
    gain2.gain.linearRampToValueAtTime(0.38, now + 0.26);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.22);
    osc2.stop(now + 1.25);

    // Subtle third soft low shimmer tone for warmth
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = "triangle";
    osc3.frequency.setValueAtTime(440, now + 0.22);
    gain3.gain.setValueAtTime(0.12, now + 0.22);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.22);
    osc3.stop(now + 1.1);
  } catch (err) {
    console.warn("Could not play reminder chime:", err);
  }
}
