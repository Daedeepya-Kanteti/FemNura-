import React from "react";
import { motion } from "framer-motion";

export default function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8"
    >
      <div>
        {eyebrow && <p className="text-xs font-bold tracking-widest uppercase text-rose-500 mb-2">{eyebrow}</p>}
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-plum-800">{title}</h1>
        {subtitle && <p className="text-plum-500 mt-2 max-w-2xl">{subtitle}</p>}
      </div>
      {action}
    </motion.div>
  );
}
