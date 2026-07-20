"use client";

import { useId } from "react";

/** Mist-fade forest band + orange route marker on the diagonal seam. Original SVG only. */
export function DaysGoneBackdrop() {
  const uid = useId().replace(/:/g, "");

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 640 220"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={`${uid}-forest`}>
            <polygon points="0,0 360,0 250,220 0,220" />
          </clipPath>
          <linearGradient id={`${uid}-mist`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#141312" stopOpacity="1" />
            <stop offset="55%" stopColor="#141312" stopOpacity="1" />
            <stop offset="78%" stopColor="#2a2826" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#3a3834" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        <rect width="640" height="220" fill={`url(#${uid}-mist)`} />

        <g clipPath={`url(#${uid}-forest)`} opacity="0.42">
          <path
            d="M0 220 L0 110 L36 108 L52 64 L68 108 L104 106 L120 56 L136 106 L172 102 L188 58 L204 102 L240 98 L256 52 L272 98 L308 94 L324 56 L340 94 L376 90 L392 48 L408 90 L444 86 L460 50 L476 86 L512 82 L528 40 L544 82 L580 78 L596 66 L612 78 L640 74 L640 220 Z"
            fill="#6f7a74"
          />
        </g>

        <ellipse cx="340" cy="158" rx="180" ry="52" fill="rgba(228,225,221,0.07)" />
        <ellipse cx="310" cy="178" rx="140" ry="34" fill="rgba(228,225,221,0.05)" />

        <line
          x1="250"
          y1="0"
          x2="360"
          y2="220"
          stroke="rgba(245,243,240,0.14)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />

        <circle cx="336" cy="114" r="18" fill="none" stroke="#6b6f4a" strokeWidth="2.5" opacity="0.92" />
        <circle cx="336" cy="114" r="6" fill="#6b6f4a" />
        <path
          d="M336 96 L336 72 M328 80 L336 72 L344 80"
          fill="none"
          stroke="#6b6f4a"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M336 132 L400 176"
          fill="none"
          stroke="#6b6f4a"
          strokeWidth="2"
          strokeDasharray="5 4"
          opacity="0.75"
        />
      </svg>

      <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(#131311_0.4px,transparent_0.4px)] [background-size:3px_3px]" />
    </div>
  );
}
