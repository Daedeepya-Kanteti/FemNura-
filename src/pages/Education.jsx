import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpenText, Search, ExternalLink, X, ArrowRight, ShieldCheck, Stethoscope, Clock } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Badge, Disclaimer, Button } from "../components/UI.jsx";

const articles = [
  {
    id: "cycle-phases",
    title: "Understanding your menstrual cycle phases",
    category: "Menstrual Health",
    summary:
      "A plain-language walk-through of the menstrual, follicular, ovulation, and luteal phases, and what's typical versus worth discussing with a doctor.",
    readTime: "6 min read",
    keyTakeaways: [
      "The cycle consists of four distinct phases: Menstrual, Follicular, Ovulatory, and Luteal.",
      "Cervical mucus and basal body temperature naturally shift around ovulation.",
      "Severe debilitating cramps, heavy bleeding soaking more than one pad an hour, or sudden irregularity warrant clinical evaluation.",
    ],
    content: `
      Your cycle is an essential vital sign of overall health, orchestrated by shifting levels of estrogen and progesterone. 
      
      1. Menstrual Phase (Days 1–5):
      Marked by the shedding of the uterine lining. Mild cramping is common as prostaglandins contract uterine muscles, but pain should respond to gentle warmth or standard pain relief.
      
      2. Follicular Phase (Days 1–13):
      FSH (follicle-stimulating hormone) signals ovaries to prepare an egg. Estrogen rises, often bringing increased energy, brighter mood, and mental focus.
      
      3. Ovulation Phase (Around Day 14 in a 28-day cycle):
      A surge in luteinizing hormone releases a mature egg into the fallopian tube. You may notice clear, slippery cervical fluid and heightened energy.
      
      4. Luteal Phase (Days 15–28):
      Progesterone rises to support potential implantation. If conception does not occur, hormone levels drop, which can trigger premenstrual physical or emotional sensations.
    `,
    whenToSeeDoctor:
      "Consult a gynaecologist if your period is consistently absent for >3 months, cycles are shorter than 21 days or longer than 35 days, or bleeding interferes significantly with daily life.",
    sources: "ACOG Guidelines, NHS Women's Health Resource",
  },
  {
    id: "fatigue-signals",
    title: "Why fatigue deserves attention, not dismissal",
    category: "General Wellness",
    summary:
      "Persistent tiredness is often normalized by busy women. Here's how to tell the difference between everyday tired and something worth tracking.",
    readTime: "5 min read",
    keyTakeaways: [
      "Everyday tiredness improves with a restful night; clinical fatigue persists despite sleep.",
      "Common medical contributors include iron deficiency / low ferritin, thyroid imbalance (hypothyroidism), and chronic stress.",
      "Tracking the timing of fatigue alongside your cycle helps physicians pinpoint the root cause.",
    ],
    content: `
      In households, universities, and workplaces, women are culturally praised for 'powering through' exhaustion. But unrelenting fatigue is not a badge of honor; it is your body's communication system.
      
      Common Underlying Contributors:
      • Low Iron / Ferritin: Even without full anemia, low iron stores impair cellular oxygen delivery.
      • Subclinical Thyroid Dysfunction: The thyroid regulates metabolic rate and energy output.
      • Vitamin D & B12 Insufficiency: Essential for neurological function and cellular energy.
      • Sleep Architecture Disruptions: Hormonal fluctuations in the luteal phase can disrupt restorative REM and deep sleep.
    `,
    whenToSeeDoctor:
      "If fatigue is accompanied by unexplained weight changes, dizziness upon standing, brittle nails, breathlessness on mild exertion, or feeling cold all the time.",
    sources: "Mayo Clinic Internal Medicine, Endocrine Society",
  },
  {
    id: "mood-hormones",
    title: "Mood shifts and hormonal health: what's connected",
    category: "Emotional Wellness",
    summary:
      "An overview of how hormonal changes can relate to mood, and when emotional changes may be worth a professional conversation.",
    readTime: "7 min read",
    keyTakeaways: [
      "Estrogen supports serotonin and dopamine synthesis; progesterone interacts with GABA receptors.",
      "PMDD (Premenstrual Dysphoric Disorder) is a recognized clinical condition, not a personal failing.",
      "Logging mood over at least two full cycles provides critical diagnostic clarity for healthcare providers.",
    ],
    content: `
      Emotional health is deeply biological. Fluctuating neurosteroids directly alter neurotransmitter signaling in brain regions responsible for emotional regulation.
      
      Recognizing PMDD vs. PMS:
      While mild irritability or sensitivity before a period is widespread, PMDD involves severe mood swings, intense anxiety, overwhelming feelings of despair, or explosive anger that consistently clears once bleeding begins.
    `,
    whenToSeeDoctor:
      "If mood changes disrupt your relationships, work, or safety, or if emotional lows feel impossible to bear.",
    sources: "International Association for Premenstrual Disorders (IAPMD)",
  },
  {
    id: "doctor-visit-prep",
    title: "Preparing for your first gynaecologist visit",
    category: "Doctor Visits",
    summary:
      "What to expect, what questions are normal to ask, and how to feel more at ease walking into a clinic.",
    readTime: "4 min read",
    keyTakeaways: [
      "You have the right to ask questions, request a chaperone, or pause an examination at any moment.",
      "Writing down your top three concerns in advance ensures they get addressed in the consultation.",
      "Honest disclosure of symptoms, sexual history, and cycle dates helps your doctor provide targeted care.",
    ],
    content: `
      Doctor appointments can feel intimidating or rushed. Going in with an organised log shifts the consultation into a collaborative dialogue.
      
      What to Bring:
      1. Your logged symptom frequency and cycle dates (use FemNura's Doctor Q-Gen summary).
      2. A complete list of supplements, vitamins, and medications.
      3. Prior lab results or ultrasound reports stored in your Medical Vault.
    `,
    whenToSeeDoctor:
      "Annual preventative check-ups, Pap smears starting at age 21 (or local guideline age), or whenever you notice new pelvic discomfort or abnormal bleeding.",
    sources: "ACOG Patient Education Series",
  },
  {
    id: "red-flag-symptoms",
    title: "Recognising symptoms that need prompt medical attention",
    category: "Safety",
    summary:
      "A clear, non-alarmist guide to symptoms that generally warrant timely professional evaluation.",
    readTime: "5 min read",
    keyTakeaways: [
      "Sudden, severe one-sided lower abdominal pain requires immediate emergency evaluation.",
      "Post-menopausal bleeding is never normal and should always be clinically examined.",
      "Unexplained pelvic masses, persistent bloating lasting weeks, or unexplained rapid weight changes warrant imaging.",
    ],
    content: `
      Clear knowledge replaces anxiety with preparedness. This guide outlines symptoms that should not wait for routine check-ups:
      
      Seek Immediate Emergency Care:
      • Sudden, tearing lower abdominal pain (potential ectopic pregnancy or ovarian torsion).
      • Severe dizziness, fainting, or pale clammy skin combined with pelvic pain.
      • Heavy bleeding requiring pad changes every 30-60 minutes for consecutive hours.
      
      Schedule a Timely Doctor Consultation (Within 1–2 Weeks):
      • Persistent pelvic bloating or feeling full quickly lasting longer than 3 weeks.
      • Pain during intercourse or urination.
      • Bleeding between menstrual cycles or after sexual activity.
    `,
    whenToSeeDoctor:
      "Always trust your instinct. If something feels distinct from your normal baseline, seeking medical advice is always the right step.",
    sources: "NHS Red Flag Guidelines, CDC Women's Health",
  },
  {
    id: "practical-self-care",
    title: "Building a self-care routine that survives a busy week",
    category: "Lifestyle",
    summary:
      "Practical, realistic ways to protect small pockets of self-care even during demanding periods of family and career life.",
    readTime: "6 min read",
    keyTakeaways: [
      "Self-care is not an indulgence or luxury spa day; it is foundational physiology.",
      "Micro-habits (hydration, 5-minute daylight exposure, balanced protein) build long-term stamina.",
      "Setting adaptive boundaries prevents caregiver burnout.",
    ],
    content: `
      For many women, self-care is the first thing sacrificed when family or work demands rise. However, genuine healthcare starts with baseline nervous system recovery.
      
      Sustainable Micro-Commitments:
      • The 10-Minute Morning Transition: Drink a tall glass of water and get daylight exposure before opening work emails.
      • Gentle Blood Sugar Stability: Pair carbohydrates with protein and healthy fats to avoid adrenaline spikes and afternoon crashes.
      • Evening Digital Wind-Down: Protect the last 30 minutes before sleep from bright screens to preserve melatonin production.
    `,
    whenToSeeDoctor:
      "If chronic exhaustion persists despite adequate lifestyle adjustments, consult an endocrinologist or primary care physician.",
    sources: "Harvard Health Publishing, World Health Organization",
  },
];

const categories = ["All", ...new Set(articles.map((a) => a.category))];

export default function Education() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState(null);

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
        subtitle="Educational guides written to help you understand your body with clarity and confidence — grounded in evidence, not clinical jargon."
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-plum-400" size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, symptoms, or topics..."
            className="w-full rounded-xl border border-plum-200 pl-11 pr-4 py-3 focus-ring bg-white text-plum-900"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors cursor-pointer ${
              cat === c ? "bg-plum-700 text-white border-plum-700" : "bg-white text-plum-600 border-plum-200 hover:border-plum-400"
            }`}
          >
            {c}
          </button>
        ))}
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
