import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  Volume2,
  VolumeX,
  BellRing,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  X,
  Info,
  TimerReset,
  Check,
} from "lucide-react";
import {
  playReminderChime,
  startContinuousChime,
  stopContinuousChime,
  isChimeActive,
} from "../utils/sound.js";
import { useDemoData } from "../context/DemoDataContext.jsx";

export default function RealtimeClockWidget() {
  const { reminders, toggleReminder } = useDemoData();
  const [now, setNow] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem("femnura_sound_enabled") !== "false";
  });
  const [activeAlert, setActiveAlert] = useState(null); // { id, title, time, frequency, snoozeCount, isPostSnooze }
  const [snoozeInfo, setSnoozeInfo] = useState(null); // { alertData, secondsLeft, totalSeconds }
  const [calMonthOffset, setCalMonthOffset] = useState(0);

  // Track fired reminders per minute to avoid re-triggering during the same minute
  const firedRef = useRef({});

  // Stop continuous sound if component unmounts
  useEffect(() => {
    return () => {
      stopContinuousChime();
    };
  }, []);

  // Active snooze countdown timer — when snooze ends, automatically resumes continuous chime
  useEffect(() => {
    if (!snoozeInfo) return;
    const interval = setInterval(() => {
      setSnoozeInfo((prev) => {
        if (!prev) return null;
        if (prev.secondsLeft <= 1) {
          // Snooze period is complete! Ring chime continuously again!
          if (soundEnabled) {
            startContinuousChime();
          }
          const nowD = new Date();
          const hh = String(nowD.getHours()).padStart(2, "0");
          const mm = String(nowD.getMinutes()).padStart(2, "0");
          setActiveAlert({
            ...prev.alertData,
            snoozeCount: (prev.alertData.snoozeCount || 0) + 1,
            isPostSnooze: true,
            time: `${hh}:${mm}`,
          });
          return null;
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [snoozeInfo, soundEnabled]);

  // Real-time ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      const current = new Date();
      setNow(current);

      // Current HH:mm in 24h format
      const currentHH = String(current.getHours()).padStart(2, "0");
      const currentMM = String(current.getMinutes()).padStart(2, "0");
      const currentHHMM = `${currentHH}:${currentMM}`;
      const minuteKey = `${current.getFullYear()}-${current.getMonth()}-${current.getDate()} ${currentHHMM}`;

      // Check all active reminders with a scheduled alarm time
      reminders.forEach((r) => {
        if (!r.active || !r.time) return;
        if (r.time === currentHHMM) {
          const reminderKey = `${minuteKey}_${r.id}`;
          if (!firedRef.current[reminderKey]) {
            firedRef.current[reminderKey] = true;
            // Play continuous repeating sound if sound enabled
            if (soundEnabled) {
              startContinuousChime();
            }
            // Trigger UI Alert (starts with 0 snoozes used)
            setActiveAlert({
              id: r.id,
              title: r.title,
              time: currentHHMM,
              frequency: r.frequency || "Daily",
              snoozeCount: 0,
            });
          }
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [reminders, soundEnabled]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("femnura_sound_enabled", String(next));
    if (next) {
      playReminderChime();
    } else {
      stopContinuousChime();
    }
  };

  const handleDismiss = () => {
    stopContinuousChime();
    setActiveAlert(null);
    setSnoozeInfo(null);
  };

  // Snooze function: accepts duration in seconds (default 300 = 5 minutes).
  // Strictly permitted only ONCE: "no delay in healthcare!"
  const handleSnooze = (seconds = 300) => {
    if (!activeAlert) return;
    if ((activeAlert.snoozeCount || 0) >= 1) return; // Disallow subsequent snoozes

    stopContinuousChime();
    const alertData = { ...activeAlert };
    setActiveAlert(null);

    setSnoozeInfo({
      alertData,
      secondsLeft: seconds,
      totalSeconds: seconds,
    });
  };

  const cancelSnoozeAndRingNow = () => {
    if (!snoozeInfo) return;
    const alertData = snoozeInfo.alertData;
    setSnoozeInfo(null);
    if (soundEnabled) {
      startContinuousChime();
    }
    const nowD = new Date();
    const hh = String(nowD.getHours()).padStart(2, "0");
    const mm = String(nowD.getMinutes()).padStart(2, "0");
    setActiveAlert({
      ...alertData,
      snoozeCount: (alertData.snoozeCount || 0) + 1,
      isPostSnooze: true,
      time: `${hh}:${mm}`,
    });
  };

  const dismissSnooze = () => {
    stopContinuousChime();
    setSnoozeInfo(null);
  };

  const formatSnoozeTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const testChime = (e) => {
    e?.stopPropagation();
    if (soundEnabled) {
      startContinuousChime();
      setActiveAlert({
        id: "test-alert",
        title: "Test Health Reminder",
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        frequency: "Live Chime Loop Test",
        snoozeCount: 0,
      });
    } else {
      playReminderChime();
    }
  };

  // Formatted live values
  const timeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const dateString = now.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Calendar calculations
  const displayDate = new Date(now.getFullYear(), now.getMonth() + calMonthOffset, 1);
  const monthName = displayDate.toLocaleString([], { month: "long", year: "numeric" });
  const daysInMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0).getDate();
  const firstDayWeekday = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const isToday = (day) => {
    if (!day) return false;
    return (
      calMonthOffset === 0 &&
      day === now.getDate() &&
      displayDate.getMonth() === now.getMonth() &&
      displayDate.getFullYear() === now.getFullYear()
    );
  };

  return (
    <>
      {/* Active Snooze Floating Countdown Banner */}
      <AnimatePresence>
        {snoozeInfo && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-amber-400"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
                <TimerReset size={20} className="animate-spin text-amber-300" style={{ animationDuration: "5s" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-950/90 border border-amber-800/80 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    Snooze Active (1 of 1 used)
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {formatSnoozeTime(snoozeInfo.secondsLeft)}
                  </span>
                </div>
                <h4 className="font-display text-sm font-bold text-white mt-1 truncate">
                  {snoozeInfo.alertData.title}
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Chime will automatically ring again in <strong className="text-amber-300 font-mono">{formatSnoozeTime(snoozeInfo.secondsLeft)}</strong>. No second snooze permitted because healthcare cannot wait!
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={cancelSnoozeAndRingNow}
                    className="flex-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    title="End snooze right now and resume chime"
                  >
                    <BellRing size={13} /> Ring Chime Now
                  </button>
                  <button
                    type="button"
                    onClick={dismissSnooze}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time floating chime alert banner */}
      <AnimatePresence>
        {activeAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-5 right-5 z-50 max-w-sm w-full p-4 rounded-2xl shadow-2xl border-2 ${
              (activeAlert.snoozeCount || 0) >= 1
                ? "bg-amber-950 text-white border-amber-400"
                : "bg-plum-900 text-white border-rose-400/80"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-11 h-11 rounded-2xl text-white flex items-center justify-center shrink-0 animate-pulse shadow-md ${
                  (activeAlert.snoozeCount || 0) >= 1
                    ? "bg-amber-500 ring-4 ring-amber-400/40"
                    : "bg-rose-500 ring-4 ring-rose-400/40"
                }`}
              >
                <BellRing size={22} className="animate-bounce" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                      (activeAlert.snoozeCount || 0) >= 1
                        ? "text-amber-100 bg-amber-800"
                        : "text-rose-200 bg-rose-800/80"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-300 animate-ping" />
                    {(activeAlert.snoozeCount || 0) >= 1
                      ? `Final Alarm (Snooze Ended) • ${activeAlert.time}`
                      : `Chiming Continuously • ${activeAlert.time}`}
                  </span>
                  <button
                    onClick={handleDismiss}
                    className="text-plum-300 hover:text-white p-1 rounded-md cursor-pointer"
                    title="Dismiss and stop chime"
                  >
                    <X size={16} />
                  </button>
                </div>

                <h4 className="font-display text-base font-bold text-white mt-1 truncate">
                  {activeAlert.title}
                </h4>

                {(activeAlert.snoozeCount || 0) >= 1 ? (
                  <div className="mt-2 p-2.5 rounded-xl bg-amber-900/90 border border-amber-500/60">
                    <p className="text-[11px] font-bold text-amber-200 flex items-center gap-1">
                      ⚠️ Snooze Limit Reached (1 of 1 used)
                    </p>
                    <p className="text-[11px] text-amber-100/90 mt-0.5 leading-snug">
                      No delay in healthcare! Snooze is allowed only once. Please attend to your health now.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-lavender-200 mt-0.5 leading-snug">
                    Chime will ring continuously until addressed. Snooze allowed only once — no delay in healthcare!
                  </p>
                )}

                <div className="mt-3">
                  {(activeAlert.snoozeCount || 0) >= 1 ? (
                    <button
                      type="button"
                      onClick={handleDismiss}
                      className="w-full text-xs font-bold px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
                      title="Mark reminder completed and stop chime"
                    >
                      <Check size={15} /> Completed / Stop Chime
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSnooze(300)}
                        className="flex-1 text-xs font-bold px-3 py-2 rounded-xl bg-plum-800 hover:bg-plum-700 text-white flex items-center justify-center gap-1.5 border border-plum-600 shadow-sm cursor-pointer"
                        title="Snooze for 5 minutes (Allowed only once)"
                      >
                        <TimerReset size={13} className="text-amber-300" /> Snooze (5m)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSnooze(15)}
                        className="text-[11px] font-bold px-2 py-2 rounded-xl bg-plum-800/80 hover:bg-plum-700 text-lavender-200 hover:text-white flex items-center justify-center gap-1 border border-plum-700/80 cursor-pointer"
                        title="Quick 15-second snooze to verify chime resumes"
                      >
                        ⚡ 15s Test
                      </button>
                      <button
                        type="button"
                        onClick={handleDismiss}
                        className="flex-1 text-xs font-bold px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        title="Stop chime and dismiss reminder"
                      >
                        <Check size={13} /> Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Clock & Calendar Widget Container */}
      <div className="relative">
        <div className="flex items-center gap-2">
          {/* Audio Chime quick button */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundEnabled ? "Reminder sound is ON. Click to mute." : "Reminder sound is MUTED. Click to unmute."}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              soundEnabled
                ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                : "bg-white text-plum-400 border-plum-200 hover:text-plum-700"
            }`}
          >
            {soundEnabled ? <Volume2 size={16} className="text-rose-600" /> : <VolumeX size={16} />}
            <span className="hidden sm:inline text-xs">{soundEnabled ? "Sound ON" : "Muted"}</span>
          </button>

          {/* Sound test button */}
          <button
            type="button"
            onClick={testChime}
            title="Test reminder chime"
            className="hidden sm:flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold text-plum-700 bg-lavender-50 hover:bg-lavender-100 border border-lavender-200 transition-colors"
          >
            <BellRing size={13} className="text-plum-600" />
            <span>Test Sound</span>
          </button>

          {/* Clock & Calendar Pill Button */}
          <button
            type="button"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white border border-plum-200/80 shadow-2xs hover:border-plum-400 hover:shadow-xs transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Real-time synchronized" />
              <Clock size={15} className="text-plum-600" />
              <span className="font-mono text-xs sm:text-sm font-bold text-plum-900 tracking-tight">
                {timeString}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-plum-200 text-plum-600 text-xs font-medium">
              <Calendar size={14} className="text-rose-500" />
              <span>{dateString}</span>
            </div>
          </button>
        </div>

        {/* Calendar & Real-Time Sync Dropdown Popover */}
        <AnimatePresence>
          {isCalendarOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsCalendarOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-plum-200 p-5 text-plum-900"
              >
                {/* Header with live clock details */}
                <div className="flex items-center justify-between pb-3 border-b border-plum-100 mb-4">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        Real-Time Clock
                      </span>
                    </div>
                    <p className="font-mono text-xl font-extrabold text-plum-950 mt-0.5">
                      {timeString}
                    </p>
                    <p className="text-xs text-plum-600">{dateString}</p>
                  </div>
                  <button
                    onClick={() => setIsCalendarOpen(false)}
                    className="p-1.5 text-plum-400 hover:text-plum-800 rounded-lg hover:bg-lavender-50"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Calendar Navigation */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-display font-bold text-sm text-plum-900">{monthName}</h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCalMonthOffset((v) => v - 1)}
                      className="p-1 text-plum-600 hover:bg-lavender-100 rounded-md"
                      title="Previous month"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setCalMonthOffset(0)}
                      className="text-[11px] font-semibold text-plum-700 px-2 py-0.5 rounded-md hover:bg-lavender-100"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setCalMonthOffset((v) => v + 1)}
                      className="p-1 text-plum-600 hover:bg-lavender-100 rounded-md"
                      title="Next month"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Weekday labels */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-plum-400 mb-1.5">
                  <span>Su</span>
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {calendarDays.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} className="h-8" />;
                    const today = isToday(day);
                    return (
                      <div
                        key={`day-${day}`}
                        className={`h-8 flex flex-col items-center justify-center rounded-lg font-medium transition-colors ${
                          today
                            ? "bg-plum-800 text-white font-bold shadow-xs"
                            : "hover:bg-lavender-50 text-plum-800"
                        }`}
                      >
                        <span>{day}</span>
                        {today && <span className="w-1 h-1 rounded-full bg-rose-400 mt-0.5" />}
                      </div>
                    );
                  })}
                </div>

                {/* Sound & Active reminders footer */}
                <div className="mt-4 pt-3 border-t border-plum-100 text-xs">
                  <div className="flex items-center justify-between bg-lavender-50/70 p-2.5 rounded-xl mb-2.5">
                    <div className="flex items-center gap-2">
                      <Volume2 size={15} className="text-plum-700" />
                      <span className="font-semibold text-plum-800">Reminder Sound Alert</span>
                    </div>
                    <button
                      onClick={testChime}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                    >
                      Play Test Chime
                    </button>
                  </div>

                  <div className="text-[11px] text-plum-600 flex items-center justify-between">
                    <span>
                      Active reminders: <strong>{reminders.filter((r) => r.active).length}</strong>
                    </span>
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 size={12} /> Syncing in real time
                    </span>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
