import React from "react";
import { motion } from "framer-motion";

export function Button({ children, variant = "primary", size = "md", className = "", as = "button", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };
  const variants = {
    primary: "bg-plum-700 text-white hover:bg-plum-800 shadow-soft hover:shadow-lg hover:-translate-y-0.5",
    secondary: "bg-white text-plum-700 border border-plum-200 hover:border-plum-400 hover:-translate-y-0.5",
    ghost: "bg-transparent text-plum-700 hover:bg-plum-50",
    rose: "bg-rose-500 text-white hover:bg-rose-600 shadow-soft hover:-translate-y-0.5",
    sage: "bg-sage-500 text-white hover:bg-sage-600 shadow-soft hover:-translate-y-0.5",
  };
  const Comp = motion[as] || motion.button;
  return (
    <Comp
      whileTap={{ scale: 0.96 }}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`bg-white rounded-xl2 shadow-card border border-plum-100/60 ${
        hover ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, center = false, light = false }) {
  return (
    <div className={`${center ? "text-center mx-auto" : ""} max-w-2xl`}>
      {eyebrow && (
        <span
          className={`inline-block text-xs font-bold tracking-widest uppercase mb-3 ${
            light ? "text-lavender-100" : "text-rose-500"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2 className={`font-display text-3xl sm:text-4xl font-semibold mb-4 ${light ? "text-white" : "text-plum-800"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base leading-relaxed ${light ? "text-lavender-100/85" : "text-plum-600/90"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Badge({ children, tone = "lavender" }) {
  const tones = {
    lavender: "bg-lavender-100 text-plum-700",
    rose: "bg-rose-100 text-rose-700",
    sage: "bg-sage-100 text-sage-700",
    plum: "bg-plum-100 text-plum-700",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-14 px-6">
      {icon && <div className="mx-auto w-14 h-14 rounded-full bg-lavender-50 flex items-center justify-center mb-4 text-plum-500">{icon}</div>}
      <h3 className="font-display text-lg font-semibold text-plum-800 mb-2">{title}</h3>
      <p className="text-sm text-plum-500 max-w-sm mx-auto mb-5">{description}</p>
      {action}
    </div>
  );
}

export function Disclaimer({ compact = false }) {
  return (
    <div
      className={`rounded-2xl border border-sage-200 bg-sage-50 text-sage-800 ${
        compact ? "px-4 py-3 text-xs" : "px-5 py-4 text-sm"
      } leading-relaxed`}
    >
      FemNura provides health tracking, educational information, and tools to prepare for healthcare appointments.
      It does not diagnose conditions or replace a qualified healthcare professional. Seek urgent medical care for
      emergencies.
    </div>
  );
}

export function FadeIn({ children, delay = 0, y = 16, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
