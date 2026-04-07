"use client";
import React, { useEffect, useState } from 'react';
import { motion, useTransform, MotionValue, useSpring } from 'framer-motion';

export function MetricsModule({ mwSpring, realWindSpeed = 24 }: { mwSpring: MotionValue<number>; realWindSpeed?: number }) {
  const MAX_MW = 10;
  
  // Grid Load Extracted Logic
  const loadPercent = useTransform(mwSpring, [0, MAX_MW], [0, 100]);
  const displayLoad = useTransform(loadPercent, v => `${v.toFixed(2)}%`);
  const loadColor = useTransform(loadPercent, v => v > 90 ? 'var(--alert-red)' : 'var(--cyan-primary)');
  const alertText = useTransform(loadPercent, v => v > 90 ? 'CRITICAL' : 'NOMINAL');

  // Inject Real API Wind Value into a localized animation spring
  const windSpring = useSpring(realWindSpeed, { stiffness: 45, damping: 20 });
  
  useEffect(() => {
    windSpring.set(realWindSpeed);
  }, [realWindSpeed, windSpring]);

  const displayWindSpeed = useTransform(windSpring, v => `${Math.round(v)}`);

  // Wind sock physically dropping/lifting based on the real wind speed
  const sockRotation = useTransform(windSpring, [5, 24, 48], ["80deg", "-5deg", "-15deg"]);
  
  // Track high-wind state natively to trigger CSS flapping classes
  const [isHighWind, setIsHighWind] = useState(false);
  useEffect(() => {
     return windSpring.on("change", (v) => {
        setIsHighWind(v > 25);
     });
  }, [windSpring]);

  return (
    <div className="w-full max-w-[300px] flex gap-3 mt-4">
       {/* GRID LOAD PANEL */}
       <div className="flex-1 bg-[var(--surface)]/30 border border-[var(--grid)] p-3 rounded flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm">
          <span className="text-[8px] text-[var(--muted)] uppercase tracking-widest font-mono mb-2">Grid Load</span>
          <motion.div className="text-xl font-mono font-bold leading-none mb-1" style={{ color: loadColor }}>
             <motion.span>{displayLoad}</motion.span>
          </motion.div>
          <motion.span 
            className="text-[7px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-sm" 
            style={{ 
              color: loadColor,
              backgroundColor: useTransform(loadPercent, v => v > 90 ? 'rgba(244,58,79,0.1)' : 'rgba(41,200,193,0.1)')
            }}
          >
             {alertText as any}
          </motion.span>
       </div>
       
       {/* WINDSPEED PANEL */}
       <div className="flex-[1.2] bg-[var(--surface)]/30 border border-[var(--grid)] p-3 rounded flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm">
          <span className="text-[7px] text-[var(--cyan-primary)] uppercase tracking-widest font-mono mb-2 text-center leading-tight">Avg National<br/>Windspeed</span>
          
          <div className="flex items-center gap-2">
             {/* Text Block */}
             <div className="flex items-end border-r border-[var(--grid)] pr-2">
                <motion.div className="text-[22px] font-mono font-bold leading-none text-[var(--cyan-primary)]">
                   <motion.span>{displayWindSpeed}</motion.span>
                </motion.div>
                <span className="text-[8px] text-[var(--muted)] ml-1 mb-[2px]">km/h</span>
             </div>
             
             {/* Animated Airsock Illustration */}
             <div className="w-[30px] h-[30px] flex items-center justify-center relative">
                <style>{`
                  @keyframes rigidFlap {
                     0% { transform: rotate(0deg) scale(1); }
                     50% { transform: rotate(2deg) scale(0.98); }
                     100% { transform: rotate(-1deg) scale(1.01); }
                  }
                  .wind-flap {
                     transform-origin: 0px 4px;
                     animation: rigidFlap 0.25s infinite alternate ease-in-out;
                  }
                  
                  @keyframes slowFlap {
                     0% { transform: rotate(0deg); }
                     100% { transform: rotate(2deg); }
                  }
                  .wind-slow {
                     transform-origin: 0px 4px;
                     animation: slowFlap 0.8s infinite alternate ease-in-out;
                  }
                `}</style>
                {/* Visual Mast Pole */}
                <div className="absolute left-1 top-0 bottom-0 w-[2px] bg-[var(--muted)] rounded-full" />
                
                {/* Wind Sock Canvas (Driven dynamically by simulation) */}
                <motion.div 
                    className="absolute left-[5px] top-[6px] origin-[0px_4px]"
                    style={{ rotate: sockRotation }}
                >
                   {/* Flapper element reacting to high torque events */}
                   <svg width="24" height="12" viewBox="0 0 24 12" className={`overflow-visible ${isHighWind ? 'wind-flap' : 'wind-slow'}`}>
                      {/* Sock Backing */}
                      <path d="M 0,0 L 22,3 L 22,9 L 0,12 Z" fill="#b02636" />
                      {/* Red Stripe 1 */}
                      <path d="M 0,0 L 8,1.2 L 8,10.8 L 0,12 Z" fill="var(--alert-red)" />
                      {/* White Stripe */}
                      <path d="M 8,1.2 L 15,2.1 L 15,9.9 L 8,10.8 Z" fill="#faf8ef" />
                      {/* Red Stripe 2 */}
                      <path d="M 15,2.1 L 22,3 L 22,9 L 15,9.9 Z" fill="var(--alert-red)" />
                      
                      {/* Hoop ring at the mast */}
                      <ellipse cx="0" cy="6" rx="1.5" ry="6" fill="#faf8ef" stroke="var(--muted)" strokeWidth="0.5" />
                   </svg>
                </motion.div>
             </div>
          </div>
       </div>
    </div>
  );
}
