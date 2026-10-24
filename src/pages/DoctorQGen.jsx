import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  Sparkles,
  Loader2,
  Printer,
  Copy,
  Check,
  Calendar,
  AlertCircle,
  FileText,
  Clock,
  Plus,
  AlertTriangle,
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, EmptyState, Disclaimer, Badge } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";
import { detectRedFlags } from "../utils/redFlags.js";
import RedFlagAlertBanner from "../components/RedFlagAlertBanner.jsx";

export default function DoctorQGen() {
  const { userName, symptoms, moods, cycleEntries, doctorSessions, addDoctorSession } = useDemoData();
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeSessionForModal, setActiveSessionForModal] = useState(null);
  const [dismissedFlagId, setDismissedFlagId] = useState(null);

  const hasData = symptoms.length > 0 || moods.length > 0 || cycleEntries.length > 0;

  // Real-time red flag detector across custom notes and logged symptoms
  const currentRedFlag = useMemo(() => {
    return detectRedFlags(
      customNote,
      ...symptoms.map((s) => `${s.name} ${s.severity} ${s.notes || ""}`)
    );
  }, [customNote, symptoms]);

  const showRedFlagBanner = currentRedFlag && dismissedFlagId !== currentRedFlag.id;

  const generate = () => {
    setGenerating(true);
    setResult(null);
    setTimeout(() => {
      const questions = buildQuestions(symptoms, moods, cycleEntries, currentRedFlag);
      const session = {
        questions,
        doctorName: doctorName.trim(),
        customNote: customNote.trim(),
        redFlag: currentRedFlag,
        basedOn: { symptoms: symptoms.length, moods: moods.length, cycle: cycleEntries.length },
      };
      addDoctorSession(session);
      setResult(session);
      setGenerating(false);
    }, 1000);
  };

  const copyQuestions = (qs) => {
    const text = `FemNura Doctor Appointment Preparation\nPatient: ${userName || "Patient"}\nDate: ${new Date().toLocaleDateString()}\n\nQuestions for my Doctor:\n${qs
      .map((q, i) => `${i + 1}. ${q}`)
      .join("\n")}${customNote ? `\n\nAdditional Notes: ${customNote}` : ""}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = (sessionToPrint) => {
    const questions = sessionToPrint?.questions || result?.questions || [];
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>FemNura — Doctor Appointment Prep Summary</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #2e1f2d; margin: 40px; line-height: 1.6; }
            .header { border-bottom: 2px solid #5f3860; padding-bottom: 16px; margin-bottom: 24px; }
            .logo { font-size: 24px; font-weight: bold; color: #5f3860; }
            .tagline { font-size: 13px; color: #7a5689; text-transform: uppercase; letter-spacing: 1px; }
            .meta { font-size: 14px; color: #555; margin-top: 8px; }
            .section { margin-bottom: 24px; }
            h2 { font-size: 17px; color: #5f3860; border-bottom: 1px solid #e5dbe4; padding-bottom: 6px; margin-bottom: 12px; }
            ol { padding-left: 20px; }
            li { margin-bottom: 10px; font-size: 14px; }
            .box { background: #faf7fc; border: 1px solid #e2d7e5; border-radius: 8px; padding: 12px 16px; font-size: 13px; margin-bottom: 16px; }
            .footer { margin-top: 40px; font-size: 11px; color: #777; border-top: 1px solid #ddd; padding-top: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">FemNura</div>
            <div class="tagline">Your Health. Your Priority.</div>
            <div class="meta">
              <strong>Patient:</strong> ${userName || "Patient"} &nbsp;|&nbsp; 
              <strong>Generated:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
              ${doctorName ? `&nbsp;|&nbsp; <strong>Prepared for:</strong> Dr. ${doctorName}` : ""}
            </div>
          </div>

          <div class="section">
            <h2>Prepared Questions for Consultation</h2>
            <ol>
              ${questions.map((q) => `<li><strong>${q}</strong></li>`).join("")}
            </ol>
          </div>

          ${
            customNote
              ? `
            <div class="section">
              <h2>Patient's Personal Notes / Specific Concerns</h2>
              <div class="box">${customNote}</div>
            </div>
          `
              : ""
          }

          <div class="section">
            <h2>Recent Logged Health Context (From Patient's Diary)</h2>
            <div class="box">
              ${
                symptoms.length
                  ? `<strong>Recent Symptoms:</strong> ${symptoms.slice(0, 4).map((s) => `${s.name} (${s.severity})`).join(", ")}<br/>`
                  : ""
              }
              ${
                cycleEntries.length
                  ? `<strong>Latest Cycle Phase:</strong> ${cycleEntries[0].phase}${cycleEntries[0].flow ? ` (${cycleEntries[0].flow} flow)` : ""}<br/>`
                  : ""
              }
              ${moods.length ? `<strong>Recent Mood Trend:</strong> ${moods[0].mood}` : ""}
            </div>
          </div>

          <div class="section">
            <h2>Doctor's Notes & Recommendations</h2>
            <div style="height: 120px; border: 1px dashed #ccc; border-radius: 8px; padding: 10px; color: #999; font-size: 12px;">
              Space for physician's examination notes, follow-up testing orders, or medication advice...
            </div>
          </div>

          <div class="footer">
            Disclaimer: FemNura provides health tracking and tools to prepare for healthcare appointments. It does not diagnose conditions or replace a qualified healthcare professional.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div>
      <PageHeader
        eyebrow="AI Doctor Q-Gen"
        title="Walk in prepared, not overwhelmed"
        subtitle="Generate thoughtful questions based strictly on what you've actually logged — never fabricated, never a diagnosis."
      />

      {/* Emergency Red Flag High Alert Banner */}
      <AnimatePresence>
        {showRedFlagBanner && (
          <RedFlagAlertBanner
            flag={currentRedFlag}
            onDismiss={() => setDismissedFlagId(currentRedFlag.id)}
          />
        )}
      </AnimatePresence>

      <Card className="p-6 sm:p-7 mb-6">
        {!hasData ? (
          <EmptyState
            icon={<Stethoscope size={24} />}
            title="Log a few entries first"
            description="FemNura builds your doctor questions strictly from your real symptom, mood, and cycle entries. Add a few logs, then come back here."
          />
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pb-6 border-b border-plum-100">
              <div className="w-13 h-13 rounded-2xl bg-lavender-100 text-plum-700 flex items-center justify-center shrink-0">
                <Stethoscope size={26} />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-xl font-semibold text-plum-900 mb-1">
                  Ready to prepare for your consultation
                </h2>
                <p className="text-sm text-plum-600">
                  Synthesising questions from {symptoms.length} symptom{symptoms.length === 1 ? "" : "s"},{" "}
                  {moods.length} mood log{moods.length === 1 ? "" : "s"}, and {cycleEntries.length} cycle log
                  {cycleEntries.length === 1 ? "" : "s"}.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-plum-700 block mb-1.5">
                  Doctor or Clinic Name (optional)
                </label>
                <input
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Sharma / Women's Wellness"
                  className="w-full rounded-xl border border-plum-200 px-4 py-2.5 text-sm text-plum-800 focus-ring bg-ivory/50"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-plum-700 block mb-1.5">
                  Specific concerns to mention (optional)
                </label>
                <input
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. Started new medication, pain worse in morning"
                  className="w-full rounded-xl border border-plum-200 px-4 py-2.5 text-sm text-plum-800 focus-ring bg-ivory/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <Button variant="primary" onClick={generate} disabled={generating} className="gap-2">
                {generating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                {generating ? "Generating thoughtfully..." : "Generate Doctor Questions"}
              </Button>
              <span className="text-xs text-plum-400">Grounded only in your recorded data</span>
            </div>
          </div>
        )}
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="p-6 sm:p-8 mb-6 border-lavender-200 shadow-md">
              <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge tone="rose">Ready for appointment</Badge>
                    <span className="text-xs text-plum-400">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-semibold text-plum-900">
                    Your Personalised Consultation Sheet
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => copyQuestions(result.questions)}
                    className="gap-1.5"
                  >
                    {copied ? <Check size={14} className="text-sage-600" /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Copy Questions"}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handlePrint(result)}
                    className="gap-1.5 bg-plum-800 hover:bg-plum-900"
                  >
                    <Printer size={14} /> Print / Save as PDF
                  </Button>
                </div>
              </div>

              {result.redFlag && (
                <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-500 text-rose-950 flex items-start gap-3.5 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-rose-950 flex items-center gap-1.5">
                      ⚠️ Urgent Medical Advisory Prepended to Consultation Sheet
                    </h4>
                    <p className="text-xs sm:text-sm text-rose-900 mt-1 leading-relaxed">
                      Your entered notes or recorded symptoms contain clinical red flags for{" "}
                      <strong>{result.redFlag.title}</strong>. Please do not delay emergency medical care for routine appointment questions. Immediate in-person evaluation is recommended.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-lavender-50/80 rounded-2xl p-4 sm:p-5 mb-5 border border-lavender-200 shadow-2xs">
                <p className="text-xs font-extrabold uppercase tracking-wider text-plum-900 mb-3 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-rose-500" /> Questions to ask your physician:
                </p>
                <ul className="space-y-3">
                  {result.questions.map((q, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex gap-3 text-sm text-plum-950 font-medium bg-white rounded-xl p-3.5 shadow-2xs border border-plum-200"
                    >
                      <span className="font-display font-bold text-rose-600 shrink-0 w-5">
                        {i + 1}.
                      </span>
                      <span className="leading-relaxed">{q}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {customNote && (
                <div className="p-4 rounded-xl bg-ivory border border-plum-100 text-sm text-plum-700 mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-plum-500 mb-1">
                    Your personal note for this visit:
                  </p>
                  <p>{customNote}</p>
                </div>
              )}

              <div className="flex items-center gap-2.5 text-xs text-plum-500 bg-plum-50/70 rounded-xl px-4 py-3">
                <AlertCircle size={15} className="shrink-0 text-plum-500" />
                <span>
                  You can print this sheet or save it as a PDF using your browser's print dialog to bring directly into your clinic visit.
                </span>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {doctorSessions.length > 0 && (
        <Card className="p-6 sm:p-7 mb-6">
          <h2 className="font-display text-lg font-semibold text-plum-800 mb-4">Past Generated Sessions</h2>
          <div className="space-y-3">
            {doctorSessions.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-plum-100 hover:border-plum-300 transition-colors flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-xs text-plum-400 mb-1 flex items-center gap-1.5">
                    <Clock size={12} /> {new Date(s.date).toLocaleString()}
                    {s.doctorName && <span className="font-semibold text-plum-600">• Dr. {s.doctorName}</span>}
                  </p>
                  <p className="text-sm font-semibold text-plum-800">{s.questions.length} questions prepared</p>
                  <p className="text-xs text-plum-500 mt-0.5 line-clamp-1">{s.questions[0]}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handlePrint(s)}
                    className="p-2 text-plum-500 hover:text-plum-900 hover:bg-lavender-50 rounded-lg transition-colors focus-ring"
                    title="Print / Save this past session"
                  >
                    <Printer size={16} />
                  </button>
                  <button
                    onClick={() => copyQuestions(s.questions)}
                    className="p-2 text-plum-500 hover:text-plum-900 hover:bg-lavender-50 rounded-lg transition-colors focus-ring"
                    title="Copy questions"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Disclaimer />
    </div>
  );
}

function buildQuestions(symptoms, moods, cycleEntries, redFlag = null) {
  const qs = [];

  // Critical safety protocol: Prepend emergency advisory when red flag keywords are triggered
  if (redFlag) {
    qs.push(
      `🚨 URGENT MEDICAL ADVISORY: The symptoms you described ("${redFlag.title}") present acute clinical red flags. Do not delay emergency medical care for routine appointment questions — please seek emergency in-person medical evaluation immediately.`,
      `Doctor, have my acute symptoms ("${redFlag.title}") been fully evaluated to rule out time-sensitive emergencies like ectopic pregnancy, internal hemorrhage, or acute pelvic pathology?`
    );
  }

  const topSymptoms = [...new Set(symptoms.map((s) => s.name))].slice(0, 3);
  topSymptoms.forEach((name) => {
    const entries = symptoms.filter((s) => s.name === name);
    qs.push(
      `I've recorded ${name.toLowerCase()} ${entries.length} time${entries.length === 1 ? "" : "s"} recently — could this be related to any underlying factors, and what red flags should I monitor?`
    );
  });

  if (moods.length) {
    const recentMoods = moods.slice(0, 5).map((m) => m.mood);
    const lowCount = recentMoods.filter((m) => m === "Low" || m === "Irritable").length;
    if (lowCount >= 2) {
      qs.push("I've noticed recurrent low or irritable mood entries — could hormonal or metabolic shifts be involved?");
    } else {
      qs.push("Could you help me understand whether my logged mood patterns correlate with my cycle or overall wellness?");
    }
  }

  if (cycleEntries.length) {
    qs.push(`My most recent logged cycle phase was "${cycleEntries[0].phase}" — are there specific parameters or timings you recommend I track?`);
  }

  qs.push("Based on these recorded symptoms, are there any diagnostic panels (such as thyroid, ferritin, or vitamin levels) you'd advise?");
  if (qs.length < 4) {
    qs.push("What lifestyle or preventative adjustments would be most helpful for me at this stage?");
  }
  return qs;
}
