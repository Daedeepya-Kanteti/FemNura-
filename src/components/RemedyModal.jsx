import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  HeartPulse,
  Smile,
  CalendarHeart,
  X,
  CheckCircle2,
  Clock,
  BookOpen,
  AlertTriangle,
  Copy,
  Check,
  Stethoscope,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, Button, Badge } from "./UI.jsx";

export default function RemedyModal({
  isOpen,
  onClose,
  remedy,
  itemType = "symptom", // "symptom" | "mood" | "cycle"
  itemName = "",
  severity = "",
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !remedy) return null;

  const typeConfig = {
    symptom: {
      icon: HeartPulse,
      badgeTone: "rose",
      badgeText: "Instant Symptom Care",
      color: "text-rose-600 bg-rose-50",
    },
    mood: {
      icon: Smile,
      badgeTone: "lavender",
      badgeText: "Instant Emotional Comfort",
      color: "text-plum-700 bg-lavender-50",
    },
    cycle: {
      icon: CalendarHeart,
      badgeTone: "plum",
      badgeText: "Instant Cycle Alignment",
      color: "text-plum-800 bg-plum-50",
    },
  };

  const config = typeConfig[itemType] || typeConfig.symptom;
  const Icon = config.icon;

  const handleCopy = () => {
    const text = `FemNura Instant Remedy for ${itemName}:\n\n` +
      `IMMEDIATE ACTIONS:\n${remedy.immediateAction.map((a, i) => `${i + 1}. ${a}`).join("\n")}\n\n` +
      `NUTRITIONAL & HERBAL COMFORT:\n${remedy.nutritionHerbal.map((n) => `• ${n}`).join("\n")}\n\n` +
      `CLINICAL EVIDENCE SOURCE:\n${remedy.evidenceSource}\n\n` +
      `WHEN TO CONSULT A DOCTOR:\n${remedy.whenToSeekCare}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-plum-950/60 backdrop-blur-xs"
        />

        <div className="min-h-full flex items-center justify-center p-4 sm:p-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-plum-200 text-left overflow-hidden relative my-8"
          >
            {/* Header bar */}
            <div className="bg-gradient-to-r from-plum-900 via-plum-950 to-plum-900 text-white p-6 sm:p-7 relative">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full text-plum-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close remedy modal"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500 text-white shadow-xs">
                  <Sparkles size={13} className="text-amber-200" /> {config.badgeText}
                </span>
                {severity && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                    Severity: {severity}
                  </span>
                )}
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">
                {remedy.title}
              </h2>

              <p className="text-xs text-lavender-200 mt-1 flex items-center gap-1 font-medium">
                <span>Logged:</span>
                <strong className="text-white">{itemName}</strong>
                <span>• Clinically researched lifestyle & comfort guidelines</span>
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Step 1: Immediate relief actions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <h3 className="font-display text-lg font-bold text-plum-950">
                    Immediate Relief Actions (0 to 5 Minutes)
                  </h3>
                </div>

                <div className="space-y-2.5 pl-9">
                  {remedy.immediateAction.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-lavender-50/70 border border-lavender-200/80 text-sm text-plum-950 font-medium leading-relaxed flex items-start gap-3 shadow-2xs"
                    >
                      <CheckCircle2 size={17} className="text-rose-500 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Nutrition & Herbal Comfort */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-sage-100 text-sage-800 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <h3 className="font-display text-lg font-bold text-plum-950">
                    Evidence-Based Nutrition & Herbal Support
                  </h3>
                </div>

                <div className="space-y-2.5 pl-9">
                  {remedy.nutritionHerbal.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-sage-50/60 border border-sage-200/80 text-sm text-plum-900 font-medium leading-relaxed flex items-start gap-3 shadow-2xs"
                    >
                      <span className="w-2 h-2 rounded-full bg-sage-600 shrink-0 mt-2" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scientific Rationale & Clinical Source */}
              <div className="bg-plum-50/80 border border-plum-200 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-1.5 text-xs font-bold uppercase tracking-wider text-plum-800">
                  <BookOpen size={14} className="text-plum-600" />
                  <span>Clinical Rationale & Mechanism</span>
                </div>
                <p className="text-xs sm:text-sm text-plum-900 font-medium leading-relaxed mb-3">
                  {remedy.clinicalRationale}
                </p>
                <div className="text-[11px] font-semibold text-plum-600 flex items-center gap-1 border-t border-plum-200/80 pt-2.5">
                  <span className="text-plum-500">Medical Reference:</span>
                  <span className="text-plum-900 font-bold">{remedy.evidenceSource}</span>
                </div>
              </div>

              {/* Safety: When to consult a physician */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-1.5 text-xs font-bold uppercase tracking-wider text-rose-800">
                  <AlertTriangle size={15} className="text-rose-600" />
                  <span>When to Seek Clinical Care (Red Flags)</span>
                </div>
                <p className="text-xs sm:text-sm text-rose-950 font-medium leading-relaxed">
                  {remedy.whenToSeekCare}
                </p>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-5 sm:p-6 bg-lavender-50/50 border-t border-plum-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-1.5 text-xs font-bold flex-1 sm:flex-initial"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  {copied ? "Remedy Copied!" : "Copy Remedy"}
                </Button>

                <Link to="/app/doctor-qgen" className="flex-1 sm:flex-initial">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1.5 text-xs font-bold w-full border-plum-300 text-plum-900 hover:bg-white"
                  >
                    <Stethoscope size={14} className="text-rose-500" /> Prepare Doctor Visit
                  </Button>
                </Link>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={onClose}
                className="w-full sm:w-auto text-xs font-bold px-6 bg-plum-800 hover:bg-plum-900"
              >
                Done
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
