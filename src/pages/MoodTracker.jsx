import React, { useState } from "react";
import { motion } from "framer-motion";
import { Smile, Meh, Frown, Angry, Heart, Clock, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, EmptyState, Disclaimer } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

const moods = [
  { label: "Joyful", icon: Heart, color: "text-rose-500 bg-rose-50" },
  { label: "Calm", icon: Smile, color: "text-sage-600 bg-sage-50" },
  { label: "Neutral", icon: Meh, color: "text-plum-500 bg-plum-50" },
  { label: "Low", icon: Frown, color: "text-lavender-600 bg-lavender-50" },
  { label: "Irritable", icon: Angry, color: "text-rose-600 bg-rose-100" },
];

export default function MoodTracker() {
  const { moods: entries, addMood, deleteMood } = useDemoData();
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");

  const submit = () => {
    if (!selected) return;
    addMood({ mood: selected, notes: notes.trim() });
    setSelected(null);
    setNotes("");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Emotional Wellness Tracker"
        title="How are you feeling, really?"
        subtitle="Emotional patterns matter as much as physical ones. A quiet moment to check in with yourself."
      />

      <Card className="p-6 sm:p-7 mb-6">
        <h2 className="font-display text-lg font-semibold text-plum-800 mb-5">Today's mood</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
          {moods.map((m) => (
            <motion.button
              key={m.label}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(m.label)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                selected === m.label ? "border-plum-600 bg-lavender-50" : "border-plum-100 hover:border-plum-300"
              }`}
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center ${m.color}`}>
                <m.icon size={20} />
              </div>
              <span className="text-xs font-semibold text-plum-700">{m.label}</span>
            </motion.button>
          ))}
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="What's contributing to this feeling? (optional)"
          className="w-full rounded-xl border border-plum-200 px-4 py-3 focus-ring bg-ivory/60 resize-none mb-4"
        />
        <Button variant="primary" className="w-full justify-center" onClick={submit} disabled={!selected}>
          Save today's mood
        </Button>
      </Card>

      <Card className="p-6 sm:p-7 mb-6">
        <h2 className="font-display text-lg font-semibold text-plum-800 mb-5">Mood history</h2>
        {entries.length === 0 ? (
          <EmptyState
            icon={<Smile size={24} />}
            title="No mood entries yet"
            description="Checking in daily helps FemNura reflect gentle emotional patterns back to you over time."
          />
        ) : (
          <div className="space-y-3">
            {entries.map((e) => {
              const moodDef = moods.find((m) => m.label === e.mood) || moods[2];
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-plum-100"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${moodDef.color}`}>
                    <moodDef.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-plum-800">{e.mood}</p>
                    {e.notes && <p className="text-sm text-plum-500 mt-1">{e.notes}</p>}
                    <p className="text-xs text-plum-400 mt-2 flex items-center gap-1">
                      <Clock size={12} /> {new Date(e.date).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteMood(e.id)}
                    title="Delete entry"
                    className="p-1.5 text-plum-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus-ring"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </Card>
      <Disclaimer compact />
    </div>
  );
}
