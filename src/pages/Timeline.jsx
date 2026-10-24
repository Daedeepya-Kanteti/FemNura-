import React from "react";
import { motion } from "framer-motion";
import { HeartPulse, Smile, CalendarHeart, History } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Badge, EmptyState, Disclaimer } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

export default function Timeline() {
  const { symptoms, moods, cycleEntries } = useDemoData();

  const events = [
    ...symptoms.map((s) => ({ ...s, type: "symptom", icon: HeartPulse, tone: "rose", label: s.name })),
    ...moods.map((m) => ({ ...m, type: "mood", icon: Smile, tone: "lavender", label: m.mood })),
    ...cycleEntries.map((c) => ({ ...c, type: "cycle", icon: CalendarHeart, tone: "plum", label: c.phase })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <PageHeader
        eyebrow="Health History"
        title="Your health timeline"
        subtitle="Every symptom, mood, and cycle entry in one clear, chronological view — built entirely from what you've logged."
      />

      <Card className="p-6 sm:p-7">
        {events.length === 0 ? (
          <EmptyState
            icon={<History size={24} />}
            title="Your timeline is empty"
            description="As you log symptoms, moods, and cycle details, they'll appear here in order — giving you a clear picture of your health journey."
          />
        ) : (
          <div className="relative pl-6 border-l-2 border-plum-100 space-y-6">
            {events.map((e, i) => (
              <motion.div
                key={`${e.type}-${e.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.4) }}
                className="relative"
              >
                <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                  e.tone === "rose" ? "bg-rose-400" : e.tone === "lavender" ? "bg-lavender-400" : "bg-plum-500"
                }`} />
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    e.tone === "rose" ? "bg-rose-50 text-rose-600" : e.tone === "lavender" ? "bg-lavender-50 text-plum-600" : "bg-plum-50 text-plum-700"
                  }`}>
                    <e.icon size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-plum-800">{e.label}</p>
                      <Badge tone={e.tone === "rose" ? "rose" : e.tone === "lavender" ? "lavender" : "plum"}>
                        {e.type === "symptom" ? "Symptom" : e.type === "mood" ? "Mood" : "Cycle"}
                      </Badge>
                    </div>
                    {(e.notes) && <p className="text-sm text-plum-500 mt-1">{e.notes}</p>}
                    <p className="text-xs text-plum-400 mt-1">{new Date(e.date).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      <div className="mt-6">
        <Disclaimer compact />
      </div>
    </div>
  );
}
