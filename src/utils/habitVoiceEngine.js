// Habit Voice & Chime Engine for FemNura "Nudge & Nourish"
// Powered by browser native Web Audio API (soothing chime) and SpeechSynthesis (voice engine)
// 100% offline, zero external dependencies or API keys required

export const DEFAULT_HABIT_ROUTINES = [
  {
    id: "exercise",
    title: "Movement / Exercise",
    emoji: "🏃‍♀️",
    defaultTime: "07:00",
    time: "07:00",
    enabled: true,
    category: "Morning Energy",
    focus: "Endorphins & Gentle Mobility",
    message:
      "Time to stretch and move! Whatever you have on your plate right now can pause for ten minutes. Give your body a little love and endorphins!",
    benefit: "Reduces cortisol, regulates insulin sensitivity, and lifts mood.",
    color: "from-amber-500 to-rose-500",
    badgeBg: "bg-amber-50 text-amber-900 border-amber-200",
  },
  {
    id: "breakfast",
    title: "Breakfast",
    emoji: "🍳",
    defaultTime: "08:30",
    time: "08:30",
    enabled: true,
    category: "Morning Fuel",
    focus: "Hormone Harmony & Blood Sugar Balance",
    message:
      "Good morning! Please don't put off breakfast today. Take a mindful pause, get some fresh fuel, and start your morning right.",
    benefit: "Stabilizes morning glucose to prevent 11 AM energy crashes.",
    color: "from-orange-500 to-amber-600",
    badgeBg: "bg-orange-50 text-orange-900 border-orange-200",
  },
  {
    id: "lunch",
    title: "Lunch",
    emoji: "🥗",
    defaultTime: "13:15",
    time: "13:15",
    enabled: true,
    category: "Midday Balance",
    focus: "Gut Health & Cellular Nutrition",
    message:
      "Pause whatever you're caught up with! Your body needs genuine energy to carry you through the day. Time to sit down and enjoy a nourishing lunch.",
    benefit: "Replenishes macronutrients and sustains cognitive focus.",
    color: "from-emerald-600 to-teal-700",
    badgeBg: "bg-emerald-50 text-emerald-900 border-emerald-200",
  },
  {
    id: "dinner",
    title: "Dinner",
    emoji: "🍲",
    defaultTime: "20:00",
    time: "20:00",
    enabled: true,
    category: "Evening Warmth",
    focus: "Mindful Nourishment & Recovery",
    message:
      "Put your tasks on hold and treat yourself to a good meal. You've given energy to everything and everyone all day; now it's time to nourish yourself.",
    benefit: "Allows healthy digestive transit before melatonin secretion.",
    color: "from-rose-500 to-plum-700",
    badgeBg: "bg-rose-50 text-rose-900 border-rose-200",
  },
  {
    id: "sleep",
    title: "Sleep & Wind-Down",
    emoji: "🌙",
    defaultTime: "22:30",
    time: "22:30",
    enabled: true,
    category: "Night Rest",
    focus: "Circadian Rhythm & Neuro-Restoration",
    message:
      "Time to call it a day! Step away from the screens and to-do lists. Rest isn't a reward you earn, it's a necessity. Sleep well and recharge.",
    benefit: "Triggers deep cellular repair, hormone synthesis, and memory consolidation.",
    color: "from-indigo-600 to-plum-900",
    badgeBg: "bg-indigo-50 text-indigo-900 border-indigo-200",
  },
];

export const HABIT_STORAGE_KEY = "femnura_nudge_nourish_habits_v2";

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
 * Play a soothing, harmonic wellness chime chord (E Major 9th chime)
 * Pure sine oscillators with gentle attack and long decay
 */
export function playHabitChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Four bell harmonics: E5 (659.25), G#5 (830.61), B5 (987.77), E6 (1318.51)
    const tones = [
      { freq: 659.25, offset: 0.0, gain: 0.35, dur: 1.6 },
      { freq: 830.61, offset: 0.14, gain: 0.32, dur: 1.8 },
      { freq: 987.77, offset: 0.28, gain: 0.3, dur: 2.0 },
      { freq: 1318.51, offset: 0.42, gain: 0.25, dur: 2.2 },
    ];

    tones.forEach(({ freq, offset, gain, dur }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + offset);

      // Soft envelope to avoid clicking
      gainNode.gain.setValueAtTime(0.001, now + offset);
      gainNode.gain.linearRampToValueAtTime(gain, now + offset + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + offset + dur);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + dur);
    });
  } catch (e) {
    console.warn("Chime playback notice:", e);
  }
}

let activeUtterance = null;

/**
 * Trigger browser native Text-to-Speech (window.speechSynthesis)
 * Uses a warm, friendly female voice with soothing pitch and natural tempo
 */
export function speakHabitEncouragement(text, callbacks = {}) {
  const { onStart, onEnd, onError } = callbacks;

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis not supported in this browser.");
    onEnd?.();
    return;
  }

  try {
    // Cancel any active utterance first
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    activeUtterance = utterance;

    // Pick best warm female / natural English voice
    const voices = window.speechSynthesis.getVoices() || [];
    const warmVoice =
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.toLowerCase().includes("female") ||
            v.name.toLowerCase().includes("samantha") ||
            v.name.toLowerCase().includes("victoria") ||
            v.name.toLowerCase().includes("zira") ||
            v.name.toLowerCase().includes("karen") ||
            v.name.toLowerCase().includes("natural"))
      ) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0];

    if (warmVoice) {
      utterance.voice = warmVoice;
    }

    utterance.pitch = 1.04; // Slightly warm & bright
    utterance.rate = 0.94; // Calm, unrushed, warm delivery
    utterance.volume = 1.0;

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      activeUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (err) => {
      activeUtterance = null;
      onError?.(err);
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("Speech error:", err);
    onEnd?.();
  }
}

/**
 * Cancel any ongoing speech or chime
 */
export function stopVoiceAndChime() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  activeUtterance = null;
}

/**
 * Format 24-hr time string (e.g. "07:00") into 12-hr with AM/PM (e.g. "07:00 AM")
 */
export function formatTime12h(timeStr) {
  if (!timeStr) return "";
  const [hhStr, mmStr] = timeStr.split(":");
  let hh = parseInt(hhStr, 10);
  const mm = mmStr || "00";
  if (isNaN(hh)) return timeStr;

  const ampm = hh >= 12 ? "PM" : "AM";
  hh = hh % 12;
  if (hh === 0) hh = 12;

  return `${String(hh).padStart(2, "0")}:${mm} ${ampm}`;
}
