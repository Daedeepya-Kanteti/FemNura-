import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, HeartPulse, X, Clock, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, Badge, EmptyState, Disclaimer } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

const commonSymptoms = [
  "Fatigue", "Headache", "Bloating", "Cramps", "Nausea", "Back pain",
  "Breast tenderness", "Low appetite", "Insomnia", "Dizziness", "Joint pain", "Skin changes",
];

const severities = ["Mild", "Moderate", "Severe"];

export default function SymptomTracker() {
  const { symptoms, addSymptom, deleteSymptom } = useDemoData();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [severity, setSeverity] = useState("Mild");
  const [notes, setNotes] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addSymptom({ name: name.trim(), severity, notes: notes.trim() });
    setName("");
    setSeverity("Mild");
    setNotes("");
    setShowForm(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Smart Symptom Tracker"
        title="Log how you feel, as it happens"
        subtitle="Small, consistent entries build a clearer picture than memory alone. Nothing here is diagnosed — just recorded."
        action={
          <Button variant="primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Close" : "Log a symptom"}
          </Button>
        }
      />

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-6"
          >
            <Card className="p-6 sm:p-7">
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-plum-700 block mb-2">What are you experiencing?</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Fatigue, headache, bloating..."
                    className="w-full rounded-xl border border-plum-200 px-4 py-3 focus-ring bg-ivory/60"
                    autoFocus
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {commonSymptoms.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setName(s)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                          name === s ? "bg-plum-700 text-white border-plum-700" : "bg-white text-plum-600 border-plum-200 hover:border-plum-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-plum-700 block mb-2">Severity</label>
                  <div className="flex gap-2">
                    {severities.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setSeverity(s)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                          severity === s ? "bg-rose-500 text-white border-rose-500" : "bg-white text-plum-600 border-plum-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-plum-700 block mb-2">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Any context that might help later — when it started, what makes it better or worse..."
                    className="w-full rounded-xl border border-plum-200 px-4 py-3 focus-ring bg-ivory/60 resize-none"
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full justify-center" disabled={!name.trim()}>
                  Save entry
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="p-6 sm:p-7 mb-6">
        <h2 className="font-display text-lg font-semibold text-plum-800 mb-5">Your symptom log</h2>
        {symptoms.length === 0 ? (
          <EmptyState
            icon={<HeartPulse size={24} />}
            title="No symptoms logged yet"
            description="When you log your first symptom, it will appear here — and begin forming a timeline you can bring to a doctor's visit."
            action={<Button variant="secondary" size="sm" onClick={() => setShowForm(true)}>Log your first symptom</Button>}
          />
        ) : (
          <div className="space-y-3">
            {symptoms.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4 p-4 rounded-2xl border border-plum-100 hover:border-plum-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <HeartPulse size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-plum-800">{s.name}</p>
                    <Badge tone={s.severity === "Severe" ? "rose" : s.severity === "Moderate" ? "plum" : "sage"}>{s.severity}</Badge>
                  </div>
                  {s.notes && <p className="text-sm text-plum-500 mt-1">{s.notes}</p>}
                  <p className="text-xs text-plum-400 mt-2 flex items-center gap-1">
                    <Clock size={12} /> {new Date(s.date).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteSymptom(s.id)}
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
