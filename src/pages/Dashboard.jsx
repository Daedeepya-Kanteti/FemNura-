import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HeartPulse,
  Smile,
  CalendarHeart,
  Stethoscope,
  Sparkles,
  ArrowRight,
  BellRing,
  CheckCircle2,
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, Badge, Disclaimer, FadeIn } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";
import RemedyModal from "../components/RemedyModal.jsx";
import { getRemedyForSymptom, getRemedyForMood, getRemedyForCycle } from "../data/remedies.js";

export default function Dashboard() {
  const { userName, symptoms, moods, cycleEntries, reminders, doctorSessions } = useDemoData();

  // Instant Remedy Modal state
  const [remedyModalOpen, setRemedyModalOpen] = useState(false);
  const [currentRemedy, setCurrentRemedy] = useState(null);
  const [modalItemType, setModalItemType] = useState("symptom");
  const [modalItemName, setModalItemName] = useState("");

  const openRemedy = (type, name) => {
    let remedy = null;
    if (type === "symptom") remedy = getRemedyForSymptom(name);
    else if (type === "mood") remedy = getRemedyForMood(name);
    else if (type === "cycle") remedy = getRemedyForCycle(name);

    if (remedy) {
      setCurrentRemedy(remedy);
      setModalItemType(type);
      setModalItemName(name);
      setRemedyModalOpen(true);
    }
  };

  const activeReminders = reminders.filter((r) => r.active).length;
  const latestMood = moods[0];
  const latestSymptom = symptoms[0];

  return (
    <div>
      <PageHeader
        showBack={true}
        backTo="/"
        backLabel="Back to Home"
        eyebrow="Your dashboard"
        title={`Good to see you, ${userName || "Friend"} 🌿`}
        subtitle="Here's a gentle overview of where things stand. Nothing is tracked unless you log it."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={HeartPulse}
          tone="rose"
          label="Symptom entries"
          value={symptoms.length}
          hint={latestSymptom ? `Last: ${latestSymptom.name}` : "Nothing logged yet"}
          to="/app/symptoms"
        />
        <StatCard
          icon={Smile}
          tone="lavender"
          label="Mood entries"
          value={moods.length}
          hint={latestMood ? `Last: ${latestMood.mood}` : "Nothing logged yet"}
          to="/app/mood"
        />
        <StatCard
          icon={CalendarHeart}
          tone="plum"
          label="Cycle entries"
          value={cycleEntries.length}
          hint={cycleEntries[0] ? `Last: ${cycleEntries[0].phase}` : "Nothing logged yet"}
          to="/app/cycle"
        />
        <StatCard
          icon={BellRing}
          tone="sage"
          label="Active reminders"
          value={activeReminders}
          hint="Tap to manage"
          to="/app/reminders"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        <FadeIn className="lg:col-span-2">
          <Card className="p-6 sm:p-7 h-full">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-plum-800">Quick actions</h2>
              <Sparkles size={18} className="text-rose-400" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <QuickAction to="/app/symptoms" label="Log a symptom" desc="Takes under a minute" icon={HeartPulse} />
              <QuickAction to="/app/mood" label="Log your mood" desc="How are you feeling today?" icon={Smile} />
              <QuickAction to="/app/cycle" label="Update your cycle" desc="Track your current phase" icon={CalendarHeart} />
              <QuickAction to="/app/doctor-qgen" label="Prepare for a visit" desc="Generate doctor questions" icon={Stethoscope} />
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card className="p-6 sm:p-7 h-full bg-gradient-to-br from-plum-900 via-plum-950 to-plum-900 text-white flex flex-col border-2 border-plum-700/70 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500 text-white shadow-xs">
                <Sparkles size={13} className="text-amber-200" /> AI Insight
              </span>
              <span className="text-[11px] font-semibold text-rose-300">
                Grounded in your logs
              </span>
            </div>

            <h3 className="font-display text-xl font-bold text-white mb-2 leading-snug">
              {symptoms.length || moods.length
                ? "A gentle pattern from your recorded entries"
                : "Your personal insights will appear here"}
            </h3>

            <p className="text-sm text-slate-100 font-medium leading-relaxed flex-1">
              {symptoms.length || moods.length ? (
                <>
                  You have logged{" "}
                  <span className="font-extrabold text-amber-300 bg-plum-800 px-2 py-0.5 rounded border border-plum-600">
                    {symptoms.length} symptom{symptoms.length === 1 ? "" : "s"}
                  </span>{" "}
                  and{" "}
                  <span className="font-extrabold text-amber-300 bg-plum-800 px-2 py-0.5 rounded border border-plum-600">
                    {moods.length} mood log{moods.length === 1 ? "" : "s"}
                  </span>{" "}
                  so far. As you log consistently, FemNura reflects honest, clear observations back to you for your next doctor discussion.
                </>
              ) : (
                "Once you log a few symptoms or moods, FemNura will reflect gentle, honest observations here — based only on what you've actually recorded, never fabricated or alarmist."
              )}
            </p>

            <Link to="/app/timeline" className="mt-5">
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-center bg-white text-plum-950 font-bold border-2 border-white hover:bg-lavender-50 shadow-md text-xs sm:text-sm"
              >
                View full timeline <ArrowRight size={15} />
              </Button>
            </Link>
          </Card>
        </FadeIn>
      </div>

      {/* Instant Evidence-Based Remedy & Comfort Bar */}
      <FadeIn className="mb-8">
        <Card className="p-5 sm:p-6 bg-gradient-to-r from-rose-50/50 via-white to-lavender-50/50 border border-plum-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500 text-white shadow-2xs">
                  <Sparkles size={12} className="text-amber-200" /> Instant Clinical Remedies
                </span>
                <span className="text-xs text-plum-500 font-semibold">Researched Relief Guides</span>
              </div>
              <h3 className="font-display text-lg font-bold text-plum-950 mt-1">
                Feeling uncomfortable right now?
              </h3>
              <p className="text-xs text-plum-600 max-w-xl">
                Select an issue below for verified, immediate steps, herbal support, and clinical rationale (ACOG, Cleveland Clinic & Mayo Clinic evidence):
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { name: "Cramps", type: "symptom", icon: "🌸" },
                { name: "Fatigue", type: "symptom", icon: "⚡" },
                { name: "Headache", type: "symptom", icon: "🧠" },
                { name: "Bloating", type: "symptom", icon: "🍃" },
                { name: "Low", type: "mood", label: "Low Mood", icon: "💭" },
                { name: "Luteal", type: "cycle", label: "PMS / Luteal", icon: "🌙" },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => openRemedy(item.type, item.name)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-plum-800 border border-plum-200 hover:border-plum-400 hover:bg-lavender-50 shadow-2xs transition-all cursor-pointer"
                >
                  <span>{item.icon}</span>
                  <span>{item.label || item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </FadeIn>

      {doctorSessions.length > 0 && (
        <FadeIn className="mb-8">
          <Card className="p-6 sm:p-7">
            <h2 className="font-display text-lg font-semibold text-plum-800 mb-4">Your latest doctor-prep session</h2>
            <p className="text-sm text-plum-500 mb-3">{new Date(doctorSessions[0].date).toLocaleString()}</p>
            <ul className="space-y-2">
              {doctorSessions[0].questions.slice(0, 3).map((q, i) => (
                <li key={i} className="text-sm text-plum-700 bg-lavender-50 rounded-xl px-4 py-3">
                  {q}
                </li>
              ))}
            </ul>
          </Card>
        </FadeIn>
      )}

      <Disclaimer />

      {/* Instant Evidence-Based Remedy Modal */}
      <RemedyModal
        isOpen={remedyModalOpen}
        onClose={() => setRemedyModalOpen(false)}
        remedy={currentRemedy}
        itemType={modalItemType}
        itemName={modalItemName}
      />
    </div>
  );
}

function StatCard({ icon: Icon, tone, label, value, hint, to }) {
  const tones = {
    rose: "bg-rose-50 text-rose-600",
    lavender: "bg-lavender-50 text-plum-600",
    plum: "bg-plum-50 text-plum-700",
    sage: "bg-sage-50 text-sage-700",
  };
  return (
    <Link to={to}>
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
        <Card hover className="p-5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${tones[tone]}`}>
            <Icon size={19} />
          </div>
          <p className="font-display text-2xl font-semibold text-plum-800">{value}</p>
          <p className="text-sm font-semibold text-plum-500 mt-0.5">{label}</p>
          <p className="text-xs text-plum-400 mt-1">{hint}</p>
        </Card>
      </motion.div>
    </Link>
  );
}

function QuickAction({ to, label, desc, icon: Icon }) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ y: -3 }}
        className="flex items-start gap-3 p-4 rounded-2xl border border-plum-100 hover:border-plum-300 bg-ivory/60 transition-colors h-full"
      >
        <div className="w-9 h-9 rounded-lg bg-plum-100 text-plum-700 flex items-center justify-center shrink-0">
          <Icon size={17} />
        </div>
        <div>
          <p className="text-sm font-semibold text-plum-800">{label}</p>
          <p className="text-xs text-plum-500 mt-0.5">{desc}</p>
        </div>
      </motion.div>
    </Link>
  );
}
