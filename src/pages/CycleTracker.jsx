import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarHeart, Droplet, Clock, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, Badge, EmptyState, Disclaimer } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

const phases = [
  { label: "Menstrual", color: "rose" },
  { label: "Follicular", color: "lavender" },
  { label: "Ovulation", color: "sage" },
  { label: "Luteal", color: "plum" },
];

const flowLevels = ["Light", "Medium", "Heavy"];

export default function CycleTracker() {
  const { cycleEntries, addCycleEntry, deleteCycleEntry } = useDemoData();
  const [phase, setPhase] = useState("");
  const [flow, setFlow] = useState("");
  const [notes, setNotes] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!phase) return;
    addCycleEntry({ phase, flow, notes: notes.trim() });
    setPhase("");
    setFlow("");
    setNotes("");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Menstrual Health Tracker"
        title="Understand your cycle with clarity"
        subtitle="Log your current phase and flow to build a clearer, more personal picture over time."
      />

      <Card className="p-6 sm:p-7 mb-6">
        <h2 className="font-display text-lg font-semibold text-plum-800 mb-5">Log today's cycle details</h2>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-plum-700 block mb-2">Current phase</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {phases.map((p) => (
                <button
                  type="button"
                  key={p.label}
                  onClick={() => setPhase(p.label)}
                  className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                    phase === p.label ? "bg-plum-700 text-white border-plum-700" : "bg-white text-plum-600 border-plum-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-plum-700 block mb-2">Flow (if applicable)</label>
            <div className="flex gap-2">
              {flowLevels.map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFlow(f)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                    flow === f ? "bg-rose-500 text-white border-rose-500" : "bg-white text-plum-600 border-plum-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Any notes on cramps, mood, or energy? (optional)"
            className="w-full rounded-xl border border-plum-200 px-4 py-3 focus-ring bg-ivory/60 resize-none"
          />
          <Button type="submit" variant="primary" className="w-full justify-center" disabled={!phase}>
            Save entry
          </Button>
        </form>
      </Card>

      <Card className="p-6 sm:p-7 mb-6">
        <h2 className="font-display text-lg font-semibold text-plum-800 mb-5">Cycle history</h2>
        {cycleEntries.length === 0 ? (
          <EmptyState
            icon={<CalendarHeart size={24} />}
            title="No cycle entries yet"
            description="Log your current phase to start building a personal cycle history. FemNura does not guess — predictions improve only with your real entries."
          />
        ) : (
          <div className="space-y-3">
            {cycleEntries.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4 p-4 rounded-2xl border border-plum-100"
              >
                <div className="w-10 h-10 rounded-xl bg-plum-50 text-plum-700 flex items-center justify-center shrink-0">
                  <CalendarHeart size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-plum-800">{c.phase}</p>
                    {c.flow && <Badge tone="rose"><Droplet size={11} className="inline mr-1" />{c.flow} flow</Badge>}
                  </div>
                  {c.notes && <p className="text-sm text-plum-500 mt-1">{c.notes}</p>}
                  <p className="text-xs text-plum-400 mt-2 flex items-center gap-1">
                    <Clock size={12} /> {new Date(c.date).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteCycleEntry(c.id)}
                  title="Delete entry"
                  className="p-1.5 text-plum-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus-ring"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
      <Disclaimer compact />
    </div>
  );
}
