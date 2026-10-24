import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpenText,
  Search,
  ExternalLink,
  X,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Badge, Disclaimer, Button } from "../components/UI.jsx";
import { educationArticles, educationCategories } from "../data/educationArticles.js";

export default function Education() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const getCategoryCount = (categoryName) => {
    if (categoryName === "All") return educationArticles.length;
    return educationArticles.filter((a) => a.category === categoryName).length;
  };

  const filtered = educationArticles.filter(
    (a) =>
      (cat === "All" || a.category === cat) &&
      (a.title.toLowerCase().includes(query.toLowerCase()) || a.summary.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div>
      <PageHeader
        eyebrow="Women's Health Education Hub"
        title="Clear information, written for real life"
        subtitle="80 peer-reviewed educational guides (minimum 20 in every core topic) to understand your body with confidence — grounded strictly in clinical evidence, not myths or assumptions."
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-plum-400" size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across 80+ clinical guides, symptoms, or topics..."
            className="w-full rounded-xl border border-plum-200 pl-11 pr-4 py-3 focus-ring bg-white text-plum-900"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {educationCategories.map((c) => {
          const count = getCategoryCount(c);
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-colors cursor-pointer flex items-center gap-2 ${
                cat === c
                  ? "bg-plum-800 text-white border-plum-800 shadow-2xs"
                  : "bg-white text-plum-700 border-plum-200 hover:border-plum-400 hover:bg-lavender-50"
              }`}
            >
              <span>{c}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  cat === c ? "bg-plum-950/60 text-white" : "bg-lavender-100 text-plum-800"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {filtered.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              hover
              onClick={() => setSelectedArticle(a)}
              className="p-6 h-full flex flex-col cursor-pointer border-plum-100 hover:border-plum-300 shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge tone="lavender">{a.category}</Badge>
                <span className="text-xs text-plum-400 font-medium flex items-center gap-1">
                  <Clock size={12} /> {a.readTime}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-plum-900 mt-2 mb-2 leading-snug">
                {a.title}
              </h3>
              <p className="text-xs text-plum-600 leading-relaxed flex-1">{a.summary}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-plum-100">
                <span className="text-xs font-semibold text-plum-700 flex items-center gap-1">
                  Read article <ArrowRight size={13} />
                </span>
                <span className="text-[11px] text-plum-400">{a.sources.split(",")[0]}</span>
              </div>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-3 text-center py-12 text-plum-400">
            <BookOpenText className="mx-auto mb-3" size={28} />
            No articles match your search query. Try another keyword.
          </div>
        )}
      </div>

      {/* ARTICLE READER MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-plum-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 relative border border-plum-100"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-plum-400 hover:text-plum-900 hover:bg-lavender-50 transition-colors focus-ring"
                aria-label="Close article"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <Badge tone="lavender">{selectedArticle.category}</Badge>
                <span className="text-xs text-plum-400 font-medium">{selectedArticle.readTime}</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-plum-900 mb-4 leading-tight">
                {selectedArticle.title}
              </h2>

              <p className="text-sm text-plum-700 italic border-l-3 border-plum-300 pl-4 py-1 mb-6 bg-lavender-50/40 rounded-r-xl">
                {selectedArticle.summary}
              </p>

              {/* KEY TAKEAWAYS */}
              <div className="bg-sage-50/60 border border-sage-200/80 rounded-2xl p-4 sm:p-5 mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-sage-800 mb-3 flex items-center gap-1.5">
                  <ShieldCheck size={15} /> Key Clinical Takeaways
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-sage-900">
                  {selectedArticle.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-sage-600 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* BODY CONTENT */}
              <div className="text-sm text-plum-800 leading-relaxed space-y-4 mb-6 whitespace-pre-line">
                {selectedArticle.content}
              </div>

              {/* WHEN TO SEE DOCTOR */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 sm:p-5 mb-6 text-xs sm:text-sm text-rose-900">
                <p className="font-bold text-xs uppercase tracking-wider text-rose-700 mb-1 flex items-center gap-1.5">
                  <Stethoscope size={15} /> When to Consult a Healthcare Professional
                </p>
                <p>{selectedArticle.whenToSeeDoctor}</p>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="flex items-center justify-between pt-4 border-t border-plum-100 flex-wrap gap-3">
                <p className="text-xs text-plum-400">Sources: {selectedArticle.sources}</p>
                <div className="flex items-center gap-2">
                  <Link to="/app/doctor-qgen">
                    <Button variant="primary" size="sm" className="gap-1.5">
                      Prepare Doctor Questions <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Disclaimer />
    </div>
  );
}
