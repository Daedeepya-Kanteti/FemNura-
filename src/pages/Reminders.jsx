import React, { useState } from "react";
import { motion } from "framer-motion";
import { BellRing, Plus, X, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, Disclaimer } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

export default function Reminders() {
  const { reminders, toggleReminder, addReminder, deleteReminder } = useDemoData();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("Daily");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addReminder({ title: title.trim(), frequency, kind: "custom" });
    setTitle("");
    setFrequency("Daily");
    setShowForm(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Adaptive Reminders"
        title="Reminders that fit your real schedule"
        subtitle="Not generic pings — reminders you control, built around what actually matters to you right now."
        action={
          <Button variant="primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Close" : "New reminder"}
          </Button>
        }
      />

      {showForm && (
        <Card className="p-6 sm:p-7 mb-6">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-plum-700 block mb-2">Remind me to...</label>
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Take my iron supplement"
                className="w-full rounded-xl border border-plum-200 px-4 py-3 focus-ring bg-ivory/60"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-plum-700 block mb-2">Frequency</label>
              <div className="flex gap-2 flex-wrap">
                {["Daily", "Weekly", "Twice a day", "Custom schedule"].map((f) => (
                  <button
                    type="button"
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                      frequency === f ? "bg-plum-700 text-white border-plum-700" : "bg-white text-plum-600 border-plum-200"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" variant="primary" className="w-full justify-center" disabled={!title.trim()}>
              Create reminder
            </Button>
          </form>
        </Card>
      )}

      <div className="space-y-3 mb-6">
        {reminders.map((r) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${r.active ? "bg-sage-50 text-sage-700" : "bg-plum-50 text-plum-400"}`}>
                  <BellRing size={19} />
                </div>
                <div>
                  <p className="font-semibold text-plum-800">{r.title}</p>
                  <p className="text-sm text-plum-500">{r.frequency}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Toggle active={r.active} onToggle={() => toggleReminder(r.id)} />
                <button
                  type="button"
                  onClick={() => deleteReminder(r.id)}
                  title="Delete reminder"
                  className="p-1.5 text-plum-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus-ring"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

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
      className={`w-14 h-8 rounded-full p-1 transition-colors focus-ring shrink-0 ${active ? "bg-sage-500" : "bg-plum-200"}`}
    >
      <motion.div
        className="w-6 h-6 rounded-full bg-white shadow-sm"
        animate={{ x: active ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
