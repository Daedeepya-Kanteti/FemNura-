import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, Sparkles, Loader2, FileDown, AlertTriangle } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, EmptyState, Disclaimer } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

export default function DoctorQGen() {
  const { symptoms, moods, cycleEntries, doctorSessions, addDoctorSession } = useDemoData();
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const hasData = symptoms.length || moods.length || cycleEntries.length;

  const generate = () => {
    setGenerating(true);
    setResult(null);
    setTimeout(() => {
      const questions = buildQuestions(symptoms, moods, cycleEntries);
      const session = { questions, basedOn: { symptoms: symptoms.length, moods: moods.length, cycle: cycleEntries.length } };
      addDoctorSession(session);
      setResult(session);
      setGenerating(false);
    }, 1200);
  };

  return (
    <div>
      <PageHeader
        eyebrow="AI Doctor Q-Gen"
        title="Walk in prepared, not overwhelmed"
        subtitle="Generate thoughtful questions based only on what you've actually logged — never fabricated, never a diagnosis."
      />

      <Card className="p-6 sm:p-7 mb-6">
        {!hasData ? (
          <EmptyState
            icon={<Stethoscope size={24} />}
            title="Log a few entries first"
            description="FemNura builds your doctor questions strictly from your real symptom, mood, and cycle entries. Add a few logs, then come back here."
          />
        ) : (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-14 h-14 rounded-full bg-lavender-100 text-plum-600 flex items-center justify-center mb-4">
              <Stethoscope size={26} />
            </div>
            <h2 className="font-display text-xl font-semibold text-plum-800 mb-2">Ready to generate your questions</h2>
            <p className="text-plum-500 max-w-md mb-6">
              Based on {symptoms.length} symptom{symptoms.length === 1 ? "" : "s"}, {moods.length} mood entr{moods.length === 1 ? "y" : "ies"}, and{" "}
              {cycleEntries.length} cycle entr{cycleEntries.length === 1 ? "y" : "ies"} you've logged.
            </p>
            <Button variant="primary" onClick={generate} disabled={generating}>
              {generating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              {generating ? "Generating thoughtfully..." : "Generate doctor questions"}
            </Button>
          </div>
        )}
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="p-6 sm:p-7 mb-6">
              <h2 className="font-display text-lg font-semibold text-plum-800 mb-4">Your prepared questions</h2>
              <ul className="space-y-3 mb-5">
                {result.questions.map((q, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-3 text-sm text-plum-700 bg-lavender-50 rounded-xl px-4 py-3"
                  >
                    <span className="font-display font-semibold text-plum-500">{i + 1}.</span>
                    <span>{q}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-xs text-plum-400 bg-plum-50 rounded-xl px-4 py-3 mb-4">
                <AlertTriangle size={14} className="shrink-0" />
                PDF export and printing require file-generation access, which isn't configured in this demo
                environment. You can copy these questions manually for now.
              </div>
              <Button variant="secondary" size="sm" disabled title="PDF export is not available in this demo">
                <FileDown size={15} /> Export as PDF (unavailable)
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {doctorSessions.length > 0 && (
        <Card className="p-6 sm:p-7 mb-6">
          <h2 className="font-display text-lg font-semibold text-plum-800 mb-4">Past sessions</h2>
          <div className="space-y-3">
            {doctorSessions.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-plum-100">
                <p className="text-xs text-plum-400 mb-2">{new Date(s.date).toLocaleString()}</p>
                <p className="text-sm text-plum-700">{s.questions.length} questions generated</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Disclaimer />
    </div>
  );
}

function buildQuestions(symptoms, moods, cycleEntries) {
  const qs = [];
  const topSymptoms = [...new Set(symptoms.map((s) => s.name))].slice(0, 3);
  topSymptoms.forEach((name) => {
    const entries = symptoms.filter((s) => s.name === name);
    qs.push(
      `I've noticed ${name.toLowerCase()} ${entries.length} time${entries.length === 1 ? "" : "s"} recently — could this be related to anything specific, and what would you recommend I watch for?`
    );
  });
  if (moods.length) {
    const recentMoods = moods.slice(0, 5).map((m) => m.mood);
    const lowCount = recentMoods.filter((m) => m === "Low" || m === "Irritable").length;
    if (lowCount >= 2) {
      qs.push("I've had several low or irritable mood entries recently — is this something worth discussing further?");
    } else {
      qs.push("Could you help me understand if my recent mood patterns are something to monitor?");
    }
  }
  if (cycleEntries.length) {
    qs.push(`My most recent logged cycle phase was "${cycleEntries[0].phase}" — is there anything about my cycle tracking I should pay closer attention to?`);
  }
  qs.push("Based on what I've shared, are there any follow-up tests or check-ins you'd suggest?");
  if (qs.length < 3) qs.push("What are some early signs I should be more aware of, given what I've logged so far?");
  return qs;
}
