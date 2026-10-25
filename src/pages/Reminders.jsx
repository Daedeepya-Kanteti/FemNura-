import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellRing,
  Plus,
  X,
  Trash2,
  Clock,
  Volume2,
  Calendar,
  CheckCircle2,
  Sparkles,
  Pencil,
  Save,
  Check,
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, Disclaimer, Badge } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";
import { playReminderChime } from "../utils/sound.js";

export default function Reminders() {
  const { reminders, toggleReminder, addReminder, updateReminder, deleteReminder } = useDemoData();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("Daily");

  // Default reminder time: next minute for instant test convenience
  const getNextMinuteTime = () => {
    const d = new Date(Date.now() + 60000);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const [time, setTime] = useState(getNextMinuteTime());
  const [testedId, setTestedId] = useState(null);

  // Edit existing reminder state
  const [editingReminder, setEditingReminder] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTime, setEditTime] = useState("09:00");
  const [editFrequency, setEditFrequency] = useState("Daily");
  const [editActive, setEditActive] = useState(true);
  const [editSuccessMsg, setEditSuccessMsg] = useState("");

  const handleTestSound = (id) => {
    setTestedId(id);
    playReminderChime();
    setTimeout(() => setTestedId(null), 1800);
  };

  const setTimePreset = (presetTime) => {
    setTime(presetTime);
  };

  const startEditing = (reminder) => {
    setEditingReminder(reminder);
    setEditTitle(reminder.title);
    setEditTime(reminder.time || "09:00");
    setEditFrequency(reminder.frequency || "Daily");
    setEditActive(reminder.active !== false);
    setEditSuccessMsg("");
  };

  const cancelEditing = () => {
    setEditingReminder(null);
    setEditSuccessMsg("");
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (!editingReminder || !editTitle.trim()) return;

    updateReminder(editingReminder.id, {
      title: editTitle.trim(),
      time: editTime || "09:00",
      frequency: editFrequency,
      active: editActive,
    });

    setEditSuccessMsg("Reminder updated successfully!");
    setTimeout(() => {
      setEditSuccessMsg("");
      setEditingReminder(null);
    }, 600);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addReminder({
      title: title.trim(),
      frequency,
      time: time || "09:00",
      kind: "custom",
    });
    setTitle("");
    setFrequency("Daily");
    setTime(getNextMinuteTime());
    setShowForm(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Adaptive Reminders"
        title="Reminders with Real-Time Sound & Schedule"
        subtitle="FemNura tracks the live clock and calendar in the top corner. When your scheduled time arrives, an audible gentle chime reminds you."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => playReminderChime()}
              className="gap-1.5 text-xs font-semibold"
            >
              <Volume2 size={14} className="text-rose-500" /> Test Chime
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowForm((v) => !v)} className="gap-1.5 text-xs font-semibold">
              {showForm ? <X size={15} /> : <Plus size={15} />} {showForm ? "Close" : "New reminder"}
            </Button>
          </div>
        }
      />

      {/* Real-time sound notification card */}
      <Card className="p-4 sm:p-5 mb-6 bg-gradient-to-r from-lavender-50 via-white to-rose-50/40 border border-plum-200/80 shadow-2xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-plum-800 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Volume2 size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display text-sm font-bold text-plum-900">
                Live Clock & Sound Tracking Active
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Real-Time Sound
              </span>
            </div>
            <p className="text-xs text-plum-600 mt-1 leading-relaxed">
              The website continuously syncs with the live digital clock in the top-right corner. When an active reminder's time matches the real-time clock, a soft audible chime plays and a notification pops up.
            </p>
            <div className="mt-3 pt-2.5 border-t border-plum-200/60 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-semibold text-plum-600">
                ✨ Looking for daily voice habit alarms with gentle circadian pacing?
              </span>
              <Link
                to="/app/nudge-nourish"
                className="text-xs font-bold text-rose-700 hover:text-rose-900 inline-flex items-center gap-1 bg-white hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs transition-colors"
              >
                <span>Open Nudge & Nourish</span>
                <Sparkles size={12} className="text-rose-500" />
              </Link>
            </div>
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <Card className="p-6 sm:p-7 shadow-sm border-plum-200">
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="text-sm font-bold text-plum-700 block mb-1.5">
                    Remind me to... *
                  </label>
                  <input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Evening Multivitamin & Hydration"
                    className="w-full rounded-xl border border-plum-200 px-4 py-3 focus-ring bg-white text-plum-900 font-medium"
                  />
                </div>

                {/* Scheduled Exact Time */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-bold text-plum-700 flex items-center gap-1.5">
                      <Clock size={15} className="text-plum-600" /> Scheduled Time (Follows live clock)
                    </label>
                    <span className="text-xs text-plum-500">24h / AM-PM synchronized</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="rounded-xl border border-plum-300 px-4 py-2.5 text-base font-mono font-bold text-plum-900 bg-white focus-ring shadow-2xs"
                    />

                    {/* Quick preset buttons */}
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setTimePreset(getNextMinuteTime())}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 cursor-pointer"
                        title="Set to next minute so you can hear the sound right away"
                      >
                        ⚡ In 1 min (Test live)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimePreset("08:30")}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-lavender-50 text-plum-700 hover:bg-lavender-100 border border-lavender-200 cursor-pointer"
                      >
                        Morning (08:30)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimePreset("13:30")}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-lavender-50 text-plum-700 hover:bg-lavender-100 border border-lavender-200 cursor-pointer"
                      >
                        Afternoon (13:30)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimePreset("20:00")}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-lavender-50 text-plum-700 hover:bg-lavender-100 border border-lavender-200 cursor-pointer"
                      >
                        Evening (20:00)
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-plum-700 block mb-2">Repeat Frequency</label>
                  <div className="flex gap-2 flex-wrap">
                    {["Daily", "Weekly", "Weekdays", "Custom schedule"].map((f) => (
                      <button
                        type="button"
                        key={f}
                        onClick={() => setFrequency(f)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                          frequency === f
                            ? "bg-plum-800 text-white border-plum-800"
                            : "bg-white text-plum-600 border-plum-200 hover:border-plum-400"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" variant="primary" className="w-full justify-center text-sm font-bold" disabled={!title.trim()}>
                  <BellRing size={15} /> Save & Activate Scheduled Reminder
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminders List */}
      <div className="space-y-3 mb-6">
        {reminders.length === 0 ? (
          <Card className="p-8 text-center border-dashed border-2 border-plum-200">
            <BellRing size={32} className="mx-auto text-plum-300 mb-2" />
            <h3 className="font-display text-base font-semibold text-plum-800">No active reminders</h3>
            <p className="text-xs text-plum-500 mt-1 max-w-sm mx-auto">
              Create your first reminder above with a scheduled time to hear the real-time reminder chime.
            </p>
          </Card>
        ) : (
          reminders.map((r) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-plum-100/90 shadow-2xs hover:border-plum-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                      r.active ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <BellRing size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-plum-900 text-base">{r.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-plum-700 bg-lavender-50 px-2.5 py-0.5 rounded-lg border border-lavender-200">
                        <Clock size={12} className="text-plum-500" />
                        {r.time || "09:00"}
                      </span>
                      <span className="text-xs text-plum-500 font-medium">
                        {r.frequency || "Daily"}
                      </span>
                      {r.active && (
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={12} /> Active & Monitoring
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => startEditing(r)}
                    title="Edit reminder name, schedule time & frequency"
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border bg-white text-plum-700 border-plum-200 hover:bg-lavender-50 hover:border-plum-400 cursor-pointer shadow-2xs"
                  >
                    <Pencil size={13} className="text-plum-600" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTestSound(r.id)}
                    title="Test reminder chime sound"
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors border cursor-pointer ${
                      testedId === r.id
                        ? "bg-rose-500 text-white border-rose-500"
                        : "bg-white text-plum-700 border-plum-200 hover:bg-lavender-50 hover:border-plum-400"
                    }`}
                  >
                    <Volume2 size={13} className={testedId === r.id ? "text-white" : "text-rose-500"} />
                    <span>{testedId === r.id ? "Chiming..." : "Test Chime"}</span>
                  </button>

                  <Toggle active={r.active} onToggle={() => toggleReminder(r.id)} />

                  <button
                    type="button"
                    onClick={() => deleteReminder(r.id)}
                    title="Delete reminder"
                    className="p-2 text-plum-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors focus-ring cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Edit Reminder Modal */}
      <AnimatePresence>
        {editingReminder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-950/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-2xl border border-plum-200 w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-plum-100 bg-gradient-to-r from-lavender-50 to-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-plum-800 text-white flex items-center justify-center shadow-xs">
                    <Pencil size={16} />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-plum-900">
                      Edit Reminder
                    </h3>
                    <p className="text-xs text-plum-500">
                      Update title, scheduled chime alarm time, and repeat frequency
                    </p>
                  </div>
                </div>
                <button
                  onClick={cancelEditing}
                  className="p-1.5 text-plum-400 hover:text-plum-800 rounded-lg transition-colors cursor-pointer"
                  title="Close edit"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={saveEdit} className="p-6 space-y-5">
                <div>
                  <label className="text-xs font-bold text-plum-700 block uppercase tracking-wide mb-1.5">
                    Reminder Title / Description *
                  </label>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="e.g. Evening Multivitamin & Hydration"
                    className="w-full rounded-xl border border-plum-200 px-4 py-2.5 text-sm font-semibold text-plum-900 focus-ring bg-white shadow-2xs"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-plum-700 uppercase tracking-wide flex items-center gap-1.5">
                      <Clock size={14} className="text-plum-600" /> Scheduled Alarm Time (24h)
                    </label>
                    <span className="text-[11px] text-plum-500 font-medium">Follows live clock</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center">
                    <input
                      type="time"
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                      className="rounded-xl border border-plum-300 px-4 py-2 text-base font-mono font-bold text-plum-900 bg-white focus-ring shadow-2xs"
                      required
                    />

                    {/* Quick presets in edit mode */}
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditTime(getNextMinuteTime())}
                        className="text-xs font-semibold px-2 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 cursor-pointer"
                        title="Set to next minute for testing"
                      >
                        ⚡ In 1 min
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditTime("08:30")}
                        className="text-xs font-semibold px-2 py-1.5 rounded-lg bg-lavender-50 text-plum-700 hover:bg-lavender-100 border border-lavender-200 cursor-pointer"
                      >
                        08:30
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditTime("13:30")}
                        className="text-xs font-semibold px-2 py-1.5 rounded-lg bg-lavender-50 text-plum-700 hover:bg-lavender-100 border border-lavender-200 cursor-pointer"
                      >
                        13:30
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditTime("20:00")}
                        className="text-xs font-semibold px-2 py-1.5 rounded-lg bg-lavender-50 text-plum-700 hover:bg-lavender-100 border border-lavender-200 cursor-pointer"
                      >
                        20:00
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-plum-700 uppercase tracking-wide block mb-1.5">
                    Repeat Frequency
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {["Daily", "Weekly", "Weekdays", "Custom schedule"].map((f) => (
                      <button
                        type="button"
                        key={f}
                        onClick={() => setEditFrequency(f)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                          editFrequency === f
                            ? "bg-plum-800 text-white border-plum-800 shadow-2xs"
                            : "bg-white text-plum-600 border-plum-200 hover:border-plum-400"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-plum-700 uppercase tracking-wide block mb-1.5">
                    Reminder Status
                  </label>
                  <div className="flex items-center gap-3 bg-lavender-50/50 p-3 rounded-xl border border-lavender-100">
                    <Toggle active={editActive} onToggle={() => setEditActive((v) => !v)} />
                    <span className="text-xs font-semibold text-plum-800">
                      {editActive ? "Active & Monitoring (Will chime at scheduled time)" : "Paused (Silent)"}
                    </span>
                  </div>
                </div>

                {editSuccessMsg && (
                  <div className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2 border border-emerald-200">
                    <Check size={14} /> {editSuccessMsg}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-plum-100">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={cancelEditing}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="gap-1.5 bg-plum-800 hover:bg-plum-900 cursor-pointer"
                  >
                    <Save size={14} /> Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Disclaimer compact />
    </div>
  );
}

function Toggle({ active, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      aria-label="Toggle reminder"
      className={`w-14 h-8 rounded-full p-1 transition-colors focus-ring shrink-0 ${
        active ? "bg-emerald-600" : "bg-slate-200"
      }`}
    >
      <motion.div
        className="w-6 h-6 rounded-full bg-white shadow-sm"
        animate={{ x: active ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
