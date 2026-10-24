import React from "react";
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
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, Badge, Disclaimer, FadeIn } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

export default function Dashboard() {
  const { userName, symptoms, moods, cycleEntries, reminders, doctorSessions } = useDemoData();

  const activeReminders = reminders.filter((r) => r.active).length;
  const latestMood = moods[0];
  const latestSymptom = symptoms[0];

  return (
    <div>
      <PageHeader
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
          <Card className="p-6 sm:p-7 h-full bg-plum-800 text-white flex flex-col">
            <Badge tone="rose">AI Insight</Badge>
            <h3 className="font-display text-lg font-semibold mt-4 mb-2">
              {symptoms.length || moods.length
                ? "A gentle pattern from your entries"
                : "Your insights will appear here"}
            </h3>
            <p className="text-sm text-lavender-100/85 leading-relaxed flex-1">
              {symptoms.length || moods.length
                ? `You've logged ${symptoms.length} symptom${symptoms.length === 1 ? "" : "s"} and ${moods.length} mood entr${moods.length === 1 ? "y" : "ies"} so far. Keep logging consistently so FemNura can reflect more meaningful patterns back to you.`
                : "Once you log a few symptoms or moods, FemNura will reflect gentle, honest observations here — based only on what you've actually recorded."}
            </p>
            <Link to="/app/timeline" className="mt-5">
              <Button variant="secondary" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                View full timeline <ArrowRight size={15} />
              </Button>
            </Link>
          </Card>
        </FadeIn>
      </div>

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
