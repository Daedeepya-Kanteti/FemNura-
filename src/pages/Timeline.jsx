import React, { useState } from "react";
import { motion } from "framer-motion";
import { HeartPulse, Smile, CalendarHeart, History, Search } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Badge, EmptyState, Disclaimer } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

export default function Timeline() {
  const { symptoms, moods, cycleEntries } = useDemoData();
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allEvents = [
    ...symptoms.map((s) => ({ ...s, type: "symptom", icon: HeartPulse, tone: "rose", label: s.name, subtitle: `Severity: ${s.severity}` })),
    ...moods.map((m) => ({ ...m, type: "mood", icon: Smile, tone: "lavender", label: m.mood, subtitle: "Mood reflection" })),
    ...cycleEntries.map((c) => ({ ...c, type: "cycle", icon: CalendarHeart, tone: "plum", label: c.phase, subtitle: c.flow ? `${c.flow} flow` : "Cycle log" })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredEvents = allEvents.filter((e) => {
    const matchesType = filterType === "all" || e.type === filterType;
    const matchesQuery =
      e.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesQuery;
  });

  return (
    <div>
      <PageHeader
        eyebrow="Health History"
        title="Your health timeline"
        subtitle="Every symptom, mood, and cycle entry in one clear, chronological view — built strictly from what you've logged."
      />

      {/* Filter and stats bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-plum-200/80 shadow-2xs">
          {[
            { id: "all", label: "All Logs", count: allEvents.length },
            { id: "symptom", label: "Symptoms", count: symptoms.length },
            { id: "mood", label: "Moods", count: moods.length },
            { id: "cycle", label: "Cycle", count: cycleEntries.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterType === tab.id
                  ? "bg-plum-700 text-white shadow-2xs"
                  : "text-plum-600 hover:text-plum-900 hover:bg-lavender-50"
              }`}
            >
              {tab.label} <span className="opacity-75 text-[10px]">({tab.count})</span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-plum-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search timeline..."
            className="rounded-xl border border-plum-200 pl-9 pr-3 py-1.5 text-xs text-plum-800 focus-ring bg-white"
          />
        </div>
      </div>

      <Card className="p-6 sm:p-7">
        {filteredEvents.length === 0 ? (
          <EmptyState
            icon={<History size={24} />}
            title={allEvents.length === 0 ? "Your timeline is empty" : "No matching entries found"}
            description={
              allEvents.length === 0
                ? "As you log symptoms, moods, and cycle details, they'll appear here in chronological order — forming an authentic picture of your health journey."
                : "Try selecting a different filter or clearing your search query."
            }
          />
        ) : (
          <div className="relative pl-6 border-l-2 border-plum-100 space-y-6">
            {filteredEvents.map((e, i) => (
              <motion.div
                key={`${e.type}-${e.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.4) }}
                className="relative"
              >
                <span
                  className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-2xs ${
                    e.tone === "rose" ? "bg-rose-500" : e.tone === "lavender" ? "bg-lavender-500" : "bg-plum-600"
                  }`}
                />
                <div className="flex items-start gap-3.5 bg-white p-3.5 rounded-2xl border border-plum-100/80 shadow-2xs hover:border-plum-200 transition-colors">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      e.tone === "rose"
                        ? "bg-rose-50 text-rose-600"
                        : e.tone === "lavender"
                        ? "bg-lavender-50 text-plum-600"
                        : "bg-plum-50 text-plum-700"
                    }`}
                  >
                    <e.icon size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-plum-900 text-sm">{e.label}</p>
                      <Badge tone={e.tone === "rose" ? "rose" : e.tone === "lavender" ? "lavender" : "plum"}>
                        {e.type === "symptom" ? "Symptom" : e.type === "mood" ? "Mood" : "Cycle"}
                      </Badge>
                      <span className="text-[11px] text-plum-400 font-medium">{e.subtitle}</span>
                    </div>
                    {e.notes && <p className="text-xs text-plum-600 mt-1.5 leading-relaxed">{e.notes}</p>}
                    <p className="text-[11px] text-plum-400 mt-2 flex items-center gap-1">
                      {new Date(e.date).toLocaleString()}
                    </p>
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
