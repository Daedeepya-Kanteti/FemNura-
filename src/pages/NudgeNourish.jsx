import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellRing,
  Sparkles,
  Clock,
  Volume2,
  VolumeX,
  Play,
  Check,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  Radio,
  Heart,
  Flame,
  Coffee,
  Utensils,
  Moon,
  Sun,
  ShieldCheck,
  Award,
  Sliders,
  HelpCircle,
  ExternalLink,
  Hourglass,
  Lock,
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, Badge } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";
import {
  DEFAULT_HABIT_ROUTINES,
  HABIT_STORAGE_KEY,
  playHabitChime,
  speakHabitEncouragement,
  stopVoiceAndChime,
  formatTime12h,
} from "../utils/habitVoiceEngine.js";

export default function NudgeNourish() {
  const { userName } = useDemoData();

  // Load habits from localStorage or defaults
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem(HABIT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to parse saved habit alarms:", e);
    }
    return DEFAULT_HABIT_ROUTINES;
  });

  // Current playing/speaking preview state
  const [activeVoiceHabitId, setActiveVoiceHabitId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Active Alarm Popup State
  const [triggeredHabit, setTriggeredHabit] = useState(null);
  const [snoozeSecondsLeft, setSnoozeSecondsLeft] = useState(0);
  const [snoozeUsed, setSnoozeUsed] = useState(false);
  const [isAlarmSpeaking, setIsAlarmSpeaking] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  // Current live time display
  const [currentTimeStr, setCurrentTimeStr] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  });

  // Keep track of alarms that already fired today in a given minute
  const firedTrackerRef = useRef(new Set());

  // Save habits to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify(habits));
    } catch (e) {
      console.warn("Failed to persist habit alarms:", e);
    }
  }, [habits]);

  // Real-time clock & automatic alarm trigger watcher
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      setCurrentTimeStr(currentHHMM);

      // Check if any habit alarm matches current time
      habits.forEach((habit) => {
        if (habit.enabled && habit.time === currentHHMM) {
          const trackerKey = `${now.toDateString()}_${habit.id}_${currentHHMM}`;
          if (!firedTrackerRef.current.has(trackerKey) && !triggeredHabit) {
            firedTrackerRef.current.add(trackerKey);
            triggerAlarm(habit);
          }
        }
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [habits, triggeredHabit]);

  // Snooze countdown countdown timer
  useEffect(() => {
    let interval = null;
    if (snoozeSecondsLeft > 0) {
      interval = setInterval(() => {
        setSnoozeSecondsLeft((prev) => {
          if (prev <= 1) {
            // Snooze finished! Trigger final ring and voice read-aloud
            handleSnoozeEnded();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [snoozeSecondsLeft]);

  // Stop speech when unmounting
  useEffect(() => {
    return () => {
      stopVoiceAndChime();
    };
  }, []);

  // Update a habit property (time, enabled)
  const handleToggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, enabled: !h.enabled } : h))
    );
  };

  const handleTimeChange = (id, newTime) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, time: newTime } : h))
    );
  };

  const handleResetToDefault = (id) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, time: h.defaultTime } : h))
    );
  };

  // Inline "Test Voice / Preview Chime"
  const handlePreviewVoice = (habit) => {
    if (activeVoiceHabitId === habit.id && isSpeaking) {
      stopVoiceAndChime();
      setIsSpeaking(false);
      setActiveVoiceHabitId(null);
      return;
    }

    stopVoiceAndChime();
    setActiveVoiceHabitId(habit.id);
    setIsSpeaking(true);

    // Play chime first, then read voice message
    playHabitChime();

    setTimeout(() => {
      speakHabitEncouragement(habit.message, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => {
          setIsSpeaking(false);
          setActiveVoiceHabitId(null);
        },
        onError: () => {
          setIsSpeaking(false);
          setActiveVoiceHabitId(null);
        },
      });
    }, 750);
  };

  // Trigger full alarm popup (Live simulation or Real time)
  const triggerAlarm = (habit) => {
    stopVoiceAndChime();
    setTriggeredHabit(habit);
    setSnoozeUsed(false);
    setSnoozeSecondsLeft(0);
    setIsAlarmSpeaking(false);
    setShowCelebration(false);

    // Play initial chime
    playHabitChime();
  };

  // Strict One-Snooze Handler (5 mins = 300s, with demo acceleration option)
  const handleSnooze = (durationSeconds = 300) => {
    if (snoozeUsed) return; // STRICT ONE SNOOZE POLICY
    setSnoozeUsed(true);
    setSnoozeSecondsLeft(durationSeconds);
    stopVoiceAndChime();
  };

  // When snooze ends (or when user skips directly to final ring)
  const handleSnoozeEnded = () => {
    setSnoozeSecondsLeft(0);
    playHabitChime();
    setIsAlarmSpeaking(true);

    if (triggeredHabit) {
      setTimeout(() => {
        speakHabitEncouragement(triggeredHabit.message, {
          onStart: () => setIsAlarmSpeaking(true),
          onEnd: () => setIsAlarmSpeaking(false),
          onError: () => setIsAlarmSpeaking(false),
        });
      }, 700);
    }
  };

  // Dismiss Alarm with Celebration
  const handleDismissAlarm = () => {
    stopVoiceAndChime();
    const habitTitle = triggeredHabit?.title || "Habit";
    setCelebrationMessage(
      `✨ Wonderful job, ${userName || "Friend"}! You showed up for your ${habitTitle} routine.`
    );
    setShowCelebration(true);

    setTimeout(() => {
      setTriggeredHabit(null);
      setSnoozeUsed(false);
      setSnoozeSecondsLeft(0);
      setIsAlarmSpeaking(false);
    }, 1800);

    setTimeout(() => {
      setShowCelebration(false);
    }, 4500);
  };

  const enabledCount = useMemo(() => habits.filter((h) => h.enabled).length, [habits]);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Nudge & Nourish"
        subtitle="Smart Voice Habit Alarms designed for female circadian rhythms, metabolic fueling, and compassionate daily pacing."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-200">
            <Sparkles size={13} className="text-rose-600" />
            {enabledCount} of 5 Routines Active
          </span>
        }
      />

      {/* Celebration Banner after Dismiss */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-plum-800 text-white shadow-lg flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} className="text-emerald-200" />
              </div>
              <div>
                <p className="font-extrabold text-sm">{celebrationMessage}</p>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Habit logged in your wellness stream. Giving your body care is your superpower!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCelebration(false)}
              className="text-white/80 hover:text-white px-2.5 py-1 text-xs font-semibold rounded-lg hover:bg-white/10"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wellness Philosophy & Voice Engine Status Card */}
      <Card className="p-5 sm:p-6 bg-gradient-to-br from-plum-900 via-plum-950 to-plum-900 text-white relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-rose-500/30 text-rose-200 border border-rose-400/30 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <Radio size={12} className="text-rose-400 animate-pulse" />
                Adaptive Voice Habit System
              </span>
              <span className="text-xs text-lavender-200 font-medium">
                Current Time: <strong className="font-mono text-white">{currentTimeStr}</strong>
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">
              A gentle, voice-guided companion for your day
            </h2>
            <p className="text-xs sm:text-sm text-lavender-100 leading-relaxed">
              Standard alarms make women feel rushed and guilty. <strong>Nudge & Nourish</strong> uses
              harmonic solfeggio chimes, a <em>strict single-snooze policy</em> to break delay loops, and
              warm human voice synthesis reminding you that nourishing your body comes before to-do lists.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
            <button
              type="button"
              onClick={() => triggerAlarm(habits[0])}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              title="Test the complete alarm popup modal with snooze and voice"
            >
              <BellRing size={14} className="animate-bounce" />
              <span>Test Live Alarm Modal</span>
            </button>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-[10px] text-lavender-300 font-medium">
                Strict 1-Snooze Policy: Max 5 mins
              </p>
              <p className="text-[10px] text-emerald-300 font-bold mt-0.5">
                Native SpeechSynthesis • 100% Offline
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 5 Core Habits Alarm List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2 px-1">
          <div>
            <h3 className="font-display text-lg font-bold text-plum-950 flex items-center gap-2">
              <Clock size={18} className="text-rose-600" />
              Daily Recurring Habit Alarms
            </h3>
            <p className="text-xs text-plum-600">
              Customize times, toggle active chimes, and preview the voice encouragements.
            </p>
          </div>
          <span className="text-xs font-semibold text-plum-500 hidden sm:inline">
            Persisted in LocalStorage
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {habits.map((habit) => {
            const isPlayingThis = activeVoiceHabitId === habit.id;

            return (
              <Card
                key={habit.id}
                className={`p-4 sm:p-5 transition-all border-2 ${
                  habit.enabled
                    ? "border-plum-200/90 shadow-sm bg-white"
                    : "border-dashed border-plum-200/50 bg-lavender-50/40 opacity-75"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Routine Metadata */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs shrink-0 bg-gradient-to-br ${habit.color} text-white`}
                    >
                      <span>{habit.emoji}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="font-display text-base font-bold text-plum-950">
                          {habit.title}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${habit.badgeBg}`}
                        >
                          {habit.category}
                        </span>
                        {habit.enabled ? (
                          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active Daily
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-plum-400 bg-plum-100/80 px-2 py-0.5 rounded-full">
                            Paused
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-plum-600 line-clamp-2">
                        {habit.message}
                      </p>

                      <p className="text-[11px] text-plum-500 mt-1 flex items-center gap-1 italic">
                        <Sparkles size={11} className="text-rose-500 shrink-0" />
                        <span>Physiological benefit: {habit.benefit}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Controls (Time Picker, Test Voice Button, Toggle) */}
                  <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-plum-100 flex-wrap">
                    {/* Time Setter */}
                    <div className="flex items-center gap-1.5 bg-lavender-50 border border-plum-200 rounded-xl px-2.5 py-1.5">
                      <Clock size={13} className="text-plum-600 shrink-0" />
                      <input
                        type="time"
                        value={habit.time}
                        onChange={(e) => handleTimeChange(habit.id, e.target.value)}
                        disabled={!habit.enabled}
                        className="text-xs font-bold text-plum-900 bg-transparent focus:outline-none cursor-pointer disabled:opacity-40"
                        title="Set recurring alarm time"
                      />
                      <span className="text-[11px] font-semibold text-plum-500 border-l border-plum-200 pl-1.5 font-mono">
                        {formatTime12h(habit.time)}
                      </span>
                      {habit.time !== habit.defaultTime && (
                        <button
                          type="button"
                          onClick={() => handleResetToDefault(habit.id)}
                          className="p-1 text-plum-400 hover:text-plum-800 rounded transition-colors"
                          title={`Reset to default (${formatTime12h(habit.defaultTime)})`}
                        >
                          <RotateCcw size={11} />
                        </button>
                      )}
                    </div>

                    {/* Test Voice / Preview Chime Button */}
                    <button
                      type="button"
                      onClick={() => handlePreviewVoice(habit)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                        isPlayingThis
                          ? "bg-rose-600 text-white animate-pulse"
                          : "bg-white hover:bg-rose-50 text-plum-900 border border-plum-200 hover:border-rose-300"
                      }`}
                      title="Hear the soothing chime and encouragement voice preview"
                    >
                      {isPlayingThis ? (
                        <>
                          <VolumeX size={14} className="text-white" />
                          <span>Stop Voice</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={14} className="text-rose-600" />
                          <span>Test Voice / Preview Chime</span>
                        </>
                      )}
                    </button>

                    {/* Simulate Full Alarm Modal */}
                    <button
                      type="button"
                      onClick={() => triggerAlarm(habit)}
                      className="px-2.5 py-2 rounded-xl text-xs font-bold bg-lavender-100 hover:bg-lavender-200 text-plum-800 border border-plum-200 transition-colors cursor-pointer hidden sm:inline-flex items-center gap-1"
                      title="Simulate full popup alert card with snooze buttons"
                    >
                      <BellRing size={12} className="text-plum-700" />
                      <span>Simulate Popup</span>
                    </button>

                    {/* Alarm Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleHabit(habit.id)}
                      role="switch"
                      aria-checked={habit.enabled}
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors focus:outline-none ${
                        habit.enabled ? "bg-plum-800" : "bg-plum-200"
                      }`}
                      title={habit.enabled ? "Disable this alarm" : "Enable this alarm"}
                    >
                      <motion.div
                        layout
                        transition={{ type: "spring", stiffness: 600, damping: 30 }}
                        className={`bg-white w-4 h-4 rounded-full shadow-md ${
                          habit.enabled ? "ml-auto" : "ml-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Inline Voice Speaking Waveform Indicator */}
                <AnimatePresence>
                  {isPlayingThis && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-rose-100 flex items-center justify-between text-xs text-rose-900 bg-rose-50/70 p-2.5 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5">
                          <span className="w-1 h-3.5 bg-rose-600 rounded-full animate-bounce" />
                          <span className="w-1 h-5 bg-rose-500 rounded-full animate-bounce [animation-delay:0.15s]" />
                          <span className="w-1 h-3 bg-rose-600 rounded-full animate-bounce [animation-delay:0.3s]" />
                        </span>
                        <span className="font-bold">
                          Speaking Voice Encouragement via Browser SpeechSynthesis...
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-rose-700 italic">
                        "{habit.message.slice(0, 50)}..."
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Circadian & Habit FAQ Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <Card className="p-4 bg-lavender-50/60 border border-plum-200/80">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-plum-800 text-white flex items-center justify-center text-xs">
              <Hourglass size={14} />
            </div>
            <h4 className="font-bold text-xs text-plum-900">Strict One-Snooze Policy</h4>
          </div>
          <p className="text-[11px] text-plum-600 leading-relaxed">
            Multi-snoozing fragments attention and spikes morning cortisol. Our engine enforces exactly
            one 5-minute pause before triggering the encouraging voice guide.
          </p>
        </Card>

        <Card className="p-4 bg-lavender-50/60 border border-plum-200/80">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs">
              <Heart size={14} />
            </div>
            <h4 className="font-bold text-xs text-plum-900">Guilt-Free Encouragement</h4>
          </div>
          <p className="text-[11px] text-plum-600 leading-relaxed">
            Every voice cue is designed around self-compassion. No drill-sergeant pressure; just a warm,
            respectful pause that values your biological wellbeing over productivity.
          </p>
        </Card>

        <Card className="p-4 bg-lavender-50/60 border border-plum-200/80">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">
              <ShieldCheck size={14} />
            </div>
            <h4 className="font-bold text-xs text-plum-900">Zero Cloud Latency</h4>
          </div>
          <p className="text-[11px] text-plum-600 leading-relaxed">
            Uses native on-device Web Audio and SpeechSynthesis APIs. Operates offline, respects your
            privacy, and requires zero paid third-party voice tokens.
          </p>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* ACTIVE ALARM POPUP MODAL (Clean popup card with strict 1-snooze & voice) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {triggeredHabit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-950/75 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl border-2 border-rose-400 w-full max-w-lg overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
              role="alertdialog"
              aria-modal="true"
            >
              {/* Header Banner */}
              <div
                className={`bg-gradient-to-r ${triggeredHabit.color} text-white p-5 sm:p-6 relative overflow-hidden`}
              >
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner shrink-0">
                      <span>{triggeredHabit.emoji}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Radio size={10} className="animate-ping" />
                        Habit Nudge Ringing
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-black mt-1">
                        {triggeredHabit.title}
                      </h3>
                      <p className="text-xs text-white/90">
                        Scheduled for {formatTime12h(triggeredHabit.time)} • {triggeredHabit.category}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* Snooze Live Countdown or Active Status */}
                {snoozeSecondsLeft > 0 ? (
                  <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center space-y-1.5 animate-pulse">
                    <div className="flex items-center justify-center gap-1.5 text-amber-900 font-bold text-xs uppercase tracking-wider">
                      <Hourglass size={14} className="text-amber-600 animate-spin" />
                      <span>Snooze Active (Single-Snooze In Progress)</span>
                    </div>
                    <div className="text-3xl font-black font-mono text-amber-950">
                      {Math.floor(snoozeSecondsLeft / 60)}:
                      {String(snoozeSecondsLeft % 60).padStart(2, "0")}
                    </div>
                    <p className="text-xs text-amber-800">
                      Final encouraging voice guidance will speak automatically when the timer reaches zero.
                    </p>
                    <button
                      type="button"
                      onClick={handleSnoozeEnded}
                      className="mt-2 text-xs font-bold text-plum-900 underline hover:text-plum-950 cursor-pointer"
                    >
                      ⚡ Skip Snooze & Read Voice Nudge Now
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-lavender-50 border border-plum-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <Volume2 size={16} className="text-rose-600 shrink-0" />
                      <span className="text-xs font-extrabold text-plum-900 uppercase tracking-wider">
                        Warm Voice Encouragement
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-plum-950 leading-relaxed italic">
                      "{triggeredHabit.message}"
                    </p>
                    {isAlarmSpeaking && (
                      <div className="flex items-center gap-2 text-xs text-rose-700 font-bold pt-1 border-t border-plum-200/60">
                        <span className="flex gap-0.5">
                          <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce" />
                          <span className="w-1 h-4 bg-rose-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1 h-2.5 bg-rose-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </span>
                        <span>Speaking voice aloud via SpeechSynthesis...</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Snooze Policy Notice */}
                <div className="flex items-center justify-between text-[11px] text-plum-600 px-1">
                  <span className="flex items-center gap-1">
                    <Lock size={12} className="text-plum-400" />
                    <strong>Strict 1-Snooze Policy:</strong>
                  </span>
                  <span>
                    {snoozeUsed ? (
                      <strong className="text-rose-700">1 of 1 snooze used (Locked)</strong>
                    ) : (
                      <span className="text-emerald-700 font-semibold">1 snooze available (5 mins)</span>
                    )}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Strict One-Snooze Button */}
                    <button
                      type="button"
                      onClick={() => handleSnooze(300)} // 5 minutes = 300 seconds
                      disabled={snoozeUsed || snoozeSecondsLeft > 0}
                      className={`py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        snoozeUsed || snoozeSecondsLeft > 0
                          ? "bg-plum-100 text-plum-400 cursor-not-allowed border border-plum-200"
                          : "bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 shadow-2xs hover:scale-[1.01]"
                      }`}
                      title={
                        snoozeUsed
                          ? "Strict single-snooze policy: Already used for this alarm."
                          : "Pause for 5 minutes before final voice ring."
                      }
                    >
                      <Hourglass size={14} />
                      <span>{snoozeUsed ? "🔒 Snoozed (1/1 Used)" : "Snooze (5 mins)"}</span>
                    </button>

                    {/* Listen to Voice Now Button */}
                    <button
                      type="button"
                      onClick={handleSnoozeEnded}
                      className="py-3 px-4 rounded-2xl text-xs font-bold bg-lavender-100 hover:bg-lavender-200 text-plum-900 border border-plum-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Volume2 size={14} className="text-plum-700" />
                      <span>{isAlarmSpeaking ? "Replay Voice" : "Hear Voice Nudge"}</span>
                    </button>
                  </div>

                  {/* Primary "I'm on it! (Dismiss)" Button */}
                  <button
                    type="button"
                    onClick={handleDismissAlarm}
                    className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-plum-900 via-plum-800 to-rose-700 hover:from-plum-950 hover:to-rose-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-plum-900/20 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <Check size={18} className="text-emerald-300" />
                    <span>I'm on it! (Dismiss)</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
