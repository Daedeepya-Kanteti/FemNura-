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
} from "lucide-react";
import { playReminderChime } from "../utils/sound.js";
import { useDemoData } from "../context/DemoDataContext.jsx";

export default function RealtimeClockWidget() {
  const { reminders, toggleReminder } = useDemoData();
  const [now, setNow] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem("femnura_sound_enabled") !== "false";
  });
  const [activeAlert, setActiveAlert] = useState(null); // { id, title, time }
  const [calMonthOffset, setCalMonthOffset] = useState(0);

  // Track fired reminders per minute to avoid re-triggering during the same minute
  const firedRef = useRef({});

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

      // Check all active reminders
      reminders.forEach((r) => {
        if (!r.active) return;
        // If reminder has a specific time matching current time
        const reminderTime = r.time || "09:00";
        if (reminderTime === currentHHMM) {
          const reminderKey = `${minuteKey}_${r.id}`;
          if (!firedRef.current[reminderKey]) {
            firedRef.current[reminderKey] = true;
            // Play sound if enabled
            if (soundEnabled) {
              playReminderChime();
            }
            // Trigger UI Alert
            setActiveAlert({
              id: r.id,
              title: r.title,
              time: currentHHMM,
              frequency: r.frequency || "Daily",
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
    }
  };

  const testChime = (e) => {
    e?.stopPropagation();
    playReminderChime();
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
      {/* Real-time floating chime alert banner */}
      <AnimatePresence>
        {activeAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 max-w-sm w-full bg-plum-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-rose-400/80"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 animate-bounce">
                <BellRing size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300">
                    Live Reminder Alert • {activeAlert.time}
                  </span>
                  <button
                    onClick={() => setActiveAlert(null)}
                    className="text-plum-300 hover:text-white p-1 rounded-md"
                  >
                    <X size={15} />
                  </button>
                </div>
                <h4 className="font-display text-base font-bold text-white mt-0.5 truncate">
                  {activeAlert.title}
                </h4>
                <p className="text-xs text-lavender-200 mt-1">
                  Scheduled for right now ({activeAlert.frequency}). Taking care of yourself is your priority!
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => {
                      playReminderChime();
                    }}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-plum-800 hover:bg-plum-700 text-white flex items-center gap-1 border border-plum-600"
                  >
                    <Volume2 size={12} /> Repeat Chime
                  </button>
                  <button
                    onClick={() => setActiveAlert(null)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white"
                  >
                    Dismiss
                  </button>
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
