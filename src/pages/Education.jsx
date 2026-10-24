import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpenText, Search, ExternalLink } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Badge, Disclaimer } from "../components/UI.jsx";

const articles = [
  {
    title: "Understanding your menstrual cycle phases",
    category: "Menstrual Health",
    summary: "A plain-language walk-through of the follicular, ovulation, and luteal phases, and what's typical versus worth discussing with a doctor.",
    readTime: "6 min read",
  },
  {
    title: "Why fatigue deserves attention, not dismissal",
    category: "General Wellness",
    summary: "Persistent tiredness is often normalized by busy women. Here's how to tell the difference between everyday tired and something worth tracking.",
    readTime: "5 min read",
  },
  {
    title: "Mood shifts and hormonal health: what's connected",
    category: "Emotional Wellness",
    summary: "An overview of how hormonal changes can relate to mood, and when emotional changes may be worth a professional conversation.",
    readTime: "7 min read",
  },
  {
    title: "Preparing for your first gynaecologist visit",
    category: "Doctor Visits",
    summary: "What to expect, what questions are normal to ask, and how to feel more at ease walking in.",
    readTime: "4 min read",
  },
  {
    title: "Recognising symptoms that need prompt medical attention",
    category: "Safety",
    summary: "A clear, non-alarmist guide to symptoms that generally warrant timely professional evaluation.",
    readTime: "5 min read",
  },
  {
    title: "Building a self-care routine that survives a busy week",
    category: "Lifestyle",
    summary: "Practical, realistic ways to protect small pockets of self-care even during demanding periods of life.",
    readTime: "6 min read",
  },
];

const categories = ["All", ...new Set(articles.map((a) => a.category))];

export default function Education() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = articles.filter(
    (a) =>
      (cat === "All" || a.category === cat) &&
      (a.title.toLowerCase().includes(query.toLowerCase()) || a.summary.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div>
      <PageHeader
        eyebrow="Women's Health Education Hub"
        title="Clear information, written for real life"
        subtitle="Educational content to help you understand your body — not a substitute for medical advice."
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-plum-400" size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full rounded-xl border border-plum-200 pl-11 pr-4 py-3 focus-ring bg-white"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              cat === c ? "bg-plum-700 text-white border-plum-700" : "bg-white text-plum-600 border-plum-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-6">
        {filtered.map((a, i) => (
          <motion.div key={a.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card hover className="p-6 h-full flex flex-col">
              <Badge tone="lavender">{a.category}</Badge>
              <h3 className="font-display text-lg font-semibold text-plum-800 mt-3 mb-2">{a.title}</h3>
              <p className="text-sm text-plum-600/90 leading-relaxed flex-1">{a.summary}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-plum-100">
                <span className="text-xs text-plum-400 font-semibold">{a.readTime}</span>
                <span className="text-xs font-semibold text-plum-500 flex items-center gap-1">
                  Educational content <ExternalLink size={12} />
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="sm:col-span-2 text-center py-12 text-plum-400">
            <BookOpenText className="mx-auto mb-3" size={28} />
            No articles match your search yet.
          </div>
        )}
      </div>

      <Disclaimer />
    </div>
  );
}
