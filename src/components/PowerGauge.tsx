"use client";
import { useEffect } from 'react';
import { motion, useTransform, MotionValue, useSpring } from 'framer-motion';

export function PowerGauge({ mwSpring }: { mwSpring: MotionValue<number> }) {
  // The gauge maps 0 -> 10 MW to a stroke dashoffset.
  // Circle radius 120, circumference = 2 * PI * 120 = ~753.98
  // A half circle is ~377. Let's use standard dash calculations.
  
  const MAX_MW = 10;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  // Arc length for exactly half a circle (180 deg) is half circumference
  const semiCircumference = circumference / 2;

  // We map the live MW value (0 to 10) to the strokeDashoffset
  // If MW = 0, offset = semiCircumference (empty)
  // If MW = 10, offset = 0 (full)
  const dashOffset = useTransform(mwSpring, [0, MAX_MW], [semiCircumference, 0]);

  // Secondary ultra-volatile spring representing real-time raw turbine micro-fluctuations
  const volatileSpring = useSpring(0, { stiffness: 150, damping: 5, mass: 0.5 });
  useEffect(() => {
    return mwSpring.on('change', v => {
        // Constantly jitter around the stabilized master value
        volatileSpring.set(Math.max(0, v + (Math.random() * 1.8 - 0.9)));
    });
  }, [mwSpring, volatileSpring]);

  // Derived strings for UI
  const displayMW = useTransform(mwSpring, v => v.toFixed(2));
  const loadPercent = useTransform(mwSpring, [0, MAX_MW], [0, 100]);
  const displayLoad = useTransform(loadPercent, v => `${v.toFixed(2)}%`);
  
  // Dynamic color for text based on load (red if over 90%)
  const loadColor = useTransform(loadPercent, v => v > 90 ? '#FF2A2A' : '#00E5FF');

  return (
    <div className="relative w-[300px] h-[220px] flex flex-col items-center">
      {/* Container Title */}
      <div className="absolute top-0 left-0 text-[var(--foreground)] text-sm font-bold uppercase tracking-widest w-full pb-1 text-left">
        Critical Metrics
      </div>

      <svg width="300" height="200" className="mt-8 relative drop-shadow-[0_0_8px_rgba(0,229,255,0.2)]">
        {/* Defs for gradients */}
        <defs>
          <linearGradient id="cyanRed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--cyan-primary)" />
            <stop offset="70%" stopColor="var(--cyan-primary)" />
            <stop offset="85%" stopColor="var(--alert-red)" />
            <stop offset="100%" stopColor="var(--alert-red)" />
          </linearGradient>
          
          <linearGradient id="innerGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--cyan-glow)" />
            <stop offset="100%" stopColor="var(--alert-red-glow)" />
          </linearGradient>
        </defs>

        {/* Faint Outer Grid Lines (Wireframe aesthetic) */}
        <path d="M 30,170 A 120,120 0 0,1 270,170" fill="none" stroke="var(--surface)" strokeWidth="40" />
        <path d="M 30,170 A 120,120 0 0,1 270,170" fill="none" stroke="var(--grid)" strokeWidth="1" strokeDasharray="2 4" />
        
        {/* Structural radial grid lines */}
        {[30, 60, 90, 120, 150].map(angle => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 150 - Math.cos(rad) * 100;
          const y1 = 170 - Math.sin(rad) * 100;
          const x2 = 150 - Math.cos(rad) * 140;
          const y2 = 170 - Math.sin(rad) * 140;
          return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--grid)" strokeWidth="1" />;
        })}

        {/* ULTRA-VOLATILE SENSITIVITY ARC OUTSIDE MAIN ARC */}
        <motion.path 
          d="M 35,170 A 115,115 0 0,1 265,170" 
          fill="none" 
          stroke="url(#cyanRed)" 
          strokeWidth="2" 
          strokeLinecap="round"
          strokeDasharray="361.28 1000"
          style={{ 
             strokeDashoffset: useTransform(volatileSpring, [0, MAX_MW], [361.28, 0]),
             opacity: 0.8
          }}
        />

        {/* Background Track Arc */}
        <path d="M 50,170 A 100,100 0 0,1 250,170" fill="none" stroke="var(--surface)" strokeWidth="16" />

        {/* Live Active Arc */}
        <motion.path 
          d="M 50,170 A 100,100 0 0,1 250,170" 
          fill="none" 
          stroke="url(#cyanRed)" 
          strokeWidth="16" 
          strokeLinecap="butt"
          strokeDasharray={`${semiCircumference * 0.84} ${circumference}`}
          style={{ strokeDashoffset: useTransform(mwSpring, [0, MAX_MW], [314, 0]) }}
        />
        
        {/* Inner glow under arc */}
         <motion.path 
          d="M 60,170 A 90,90 0 0,1 240,170" 
          fill="none" 
          stroke="url(#innerGlow)" 
          strokeWidth="4" 
          style={{ strokeDashoffset: useTransform(mwSpring, [0, MAX_MW], [282.7, 0]), strokeDasharray: "282.7 600" }}
        />
      </svg>

      {/* Overlay Text Data - Pushed down securely beneath the arc curve */}
      <div className="absolute top-[138px] w-full flex flex-col items-center pointer-events-none">
        <div className="text-[9px] text-[var(--foreground)] uppercase tracking-[0.3em] font-bold">
          Power Output
        </div>
        <div className="flex items-baseline gap-1 mt-0.5 drop-shadow-lg">
          <motion.div className="text-4xl font-mono tracking-tighter font-bold text-[var(--foreground)]">
            {displayMW}
          </motion.div>
          <div className="text-sm font-mono text-[var(--muted)]">MW</div>
        </div>
        <div className="mt-1.5 text-[9px] text-[var(--foreground)] uppercase tracking-widest opacity-80 font-mono">
          / MAX {MAX_MW} MW
        </div>
      </div>
    </div>
  );
}
