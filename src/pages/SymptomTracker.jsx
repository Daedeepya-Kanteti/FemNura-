import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, HeartPulse, X, Clock, Trash2, Search, Sparkles } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, Badge, EmptyState, Disclaimer } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";
import RemedyModal from "../components/RemedyModal.jsx";
import { getRemedyForSymptom } from "../data/remedies.js";

const commonSymptoms = [
  "Fatigue",
  "Headache",
  "Bloating",
  "Cramps",
  "Nausea",
  "Back pain",
  "Breast tenderness",
  "Low appetite",
  "Insomnia",
  "Dizziness",
  "Joint pain",
  "Skin changes",
];

const severities = ["Mild", "Moderate", "Severe"];

export default function SymptomTracker() {
  const { symptoms, addSymptom, deleteSymptom } = useDemoData();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [severity, setSeverity] = useState("Mild");
  const [notes, setNotes] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");

  // Remedy Modal State
  const [remedyModalOpen, setRemedyModalOpen] = useState(false);
  const [currentRemedy, setCurrentRemedy] = useState(null);
  const [remedyTarget, setRemedyTarget] = useState({ name: "", severity: "" });

  const showRemedyFor = (symptomName, symptomSeverity) => {
    const remedy = getRemedyForSymptom(symptomName);
    if (remedy) {
      setCurrentRemedy(remedy);
      setRemedyTarget({ name: symptomName, severity: symptomSeverity });
      setRemedyModalOpen(true);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const symptomName = name.trim();
    const symptomSeverity = severity;

    addSymptom({ name: symptomName, severity: symptomSeverity, notes: notes.trim() });

    // Instantly provide clinical comfort remedy for the logged symptom
    showRemedyFor(symptomName, symptomSeverity);

    setName("");
    setSeverity("Mild");
    setNotes("");
    setShowForm(false);
  };

  const filteredSymptoms = symptoms.filter((s) => {
    const matchesSeverity = severityFilter === "All" || s.severity === severityFilter;
    const matchesQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.notes && s.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSeverity && matchesQuery;
  });

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
            <Card className="p-6 sm:p-7 shadow-sm border-plum-200">
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-plum-700 block mb-2">
                    What are you experiencing? *
                  </label>

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Fatigue, headache, lower back pain..."
                    className="w-full rounded-xl border border-plum-200 px-4 py-3 focus-ring bg-white text-plum-900"
                    autoFocus
                  />

                  <div className="flex flex-wrap gap-2 mt-3">
                    {commonSymptoms.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setName(s)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                          name === s
                            ? "bg-plum-700 text-white border-plum-700"
                            : "bg-white text-plum-600 border-plum-200 hover:border-plum-400"
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
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
                          severity === s
                            ? "bg-rose-500 text-white border-rose-500"
                            : "bg-white text-plum-600 border-plum-200 hover:border-plum-300"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-plum-700 block mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Any helpful context — when it started, triggers, what makes it better or worse..."
                    className="w-full rounded-xl border border-plum-200 px-4 py-3 focus-ring bg-white text-plum-900 resize-none"
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full justify-center" disabled={!name.trim()}>
                  Save Symptom Entry
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="p-6 sm:p-7 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h2 className="font-display text-lg font-semibold text-plum-800">Your Symptom Log</h2>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-plum-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs..."
                className="rounded-xl border border-plum-200 pl-8 pr-3 py-1.5 text-xs text-plum-800 focus-ring bg-ivory/50"
              />
            </div>

            <div className="flex items-center gap-1 bg-ivory p-1 rounded-xl border border-plum-200/80">
              {["All", "Mild", "Moderate", "Severe"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    severityFilter === sev ? "bg-plum-700 text-white" : "text-plum-600 hover:text-plum-900"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredSymptoms.length === 0 ? (
          <EmptyState
            icon={<HeartPulse size={24} />}
            title={symptoms.length === 0 ? "No symptoms logged yet" : "No matching symptoms"}
            description={
              symptoms.length === 0
                ? "When you log your first symptom, it will appear here — and begin forming a timeline you can bring to a doctor's visit."
                : "No entries match your search query or severity filter."
            }
            action={
              symptoms.length === 0 ? (
                <Button variant="secondary" size="sm" onClick={() => setShowForm(true)}>
                  Log your first symptom
                </Button>
              ) : null
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredSymptoms.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4 p-4 rounded-2xl border border-plum-100 hover:border-plum-200 transition-colors bg-white shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <HeartPulse size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-plum-800">{s.name}</p>
                    <Badge tone={s.severity === "Severe" ? "rose" : s.severity === "Moderate" ? "plum" : "sage"}>
                      {s.severity}
                    </Badge>
                  </div>
                  {s.notes && <p className="text-sm text-plum-600 mt-1">{s.notes}</p>}
                  <p className="text-xs text-plum-400 mt-2 flex items-center gap-1">
                    <Clock size={12} /> {new Date(s.date).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => showRemedyFor(s.name, s.severity)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors shadow-2xs cursor-pointer"
                    title="View clinical remedy for this symptom"
                  >
                    <Sparkles size={12} className="text-rose-500" />
                    <span>Instant Remedy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteSymptom(s.id)}
                    title="Delete entry"
                    className="p-1.5 text-plum-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus-ring"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      <Disclaimer compact />

      {/* Instant Evidence-Based Remedy Modal */}
      <RemedyModal
        isOpen={remedyModalOpen}
        onClose={() => setRemedyModalOpen(false)}
        remedy={currentRemedy}
        itemType="symptom"
        itemName={remedyTarget.name}
        severity={remedyTarget.severity}
      />
    </div>
  );
}
