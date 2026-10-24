import React from "react";

export default function Logo({ size = "md", light = false, withTagline = true }) {
  const dims = size === "sm" ? 30 : size === "lg" ? 46 : 36;
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-xl";

  return (
    <div className="flex items-center gap-3">
      <svg
        width={dims}
        height={dims}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <circle cx="24" cy="24" r="21" stroke={light ? "#ecdcea" : "#7a4c79"} strokeWidth="2.2" opacity="0.5" />
        <path
          d="M14 28c3.5-10 8-14 10-14s6.5 4 10 14"
          stroke={light ? "#f5e0e2" : "#9c5765"}
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M14 20c3.5 10 8 14 10 14s6.5-4 10-14"
          stroke={light ? "#e9e2f5" : "#5f3860"}
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="24" cy="24" r="3.2" fill={light ? "#fff" : "#7a4c79"} />
      </svg>
      <div className="leading-tight">
        <div className={`font-display font-semibold tracking-tight ${textSize} ${light ? "text-ivory" : "text-plum-800"}`}>
          FemNura
        </div>
        {withTagline && (
          <div className={`text-[11px] font-medium tracking-wide ${light ? "text-lavender-100/80" : "text-plum-500/80"}`}>
            Your Health. Your Priority.
          </div>
        )}
      </div>
    </div>
  );
}
