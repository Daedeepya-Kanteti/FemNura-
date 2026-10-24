import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
  showBack,
  backTo,
  backLabel,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Show back option on sub-pages by default, or when explicitly requested
  const shouldShowBack = showBack !== undefined ? showBack : location.pathname !== "/app";

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/app");
    }
  };

  const defaultLabel = location.pathname === "/app" ? "Back to Home" : "Back to Dashboard";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-8"
    >
      {shouldShowBack && (
        <button
          type="button"
          onClick={handleBack}
          aria-label={backLabel || defaultLabel}
          className="inline-flex items-center gap-2 text-xs font-semibold text-plum-600 hover:text-plum-900 bg-white/90 hover:bg-white border border-plum-200/90 px-3 py-1.5 rounded-xl shadow-xs transition-all hover:shadow-sm focus-ring mb-4 group cursor-pointer"
        >
          <ArrowLeft size={14} className="text-plum-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>{backLabel || defaultLabel}</span>
        </button>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
        <div>
          {eyebrow && <p className="text-xs font-bold tracking-widest uppercase text-rose-500 mb-2">{eyebrow}</p>}
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-plum-800">{title}</h1>
          {subtitle && <p className="text-plum-500 mt-2 max-w-2xl">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </motion.div>
  );
}
