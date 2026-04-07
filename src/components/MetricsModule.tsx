"use client";
import React, { useEffect, useState } from 'react';
import { motion, useTransform, MotionValue, useSpring } from 'framer-motion';

export function MetricsModule({ mwSpring, realWindSpeed = 24, aestTime = "00:00:00" }: { mwSpring: MotionValue<number>; realWindSpeed?: number; aestTime?: string }) {
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

  const timeParts = aestTime.split(':');
  const h = isNaN(Number(timeParts[0])) ? 0 : Number(timeParts[0]);
  const m = isNaN(Number(timeParts[1])) ? 0 : Number(timeParts[1]);
  const s = isNaN(Number(timeParts[2])) ? 0 : Number(timeParts[2]);

  const secondAngle = s * 6;
  const minuteAngle = m * 6 + s * 0.1;
  const hourAngle = (h % 12) * 30 + m * 0.5;

  return (
    <div className="w-full max-w-[360px] flex gap-3 mt-4 items-end justify-between">
       {/* TIME PANEL - Box explicitly removed, raw analogue interface */}
       <div className="flex-1 flex flex-col items-center justify-center relative p-3">
          <span className="text-[8px] h-6 flex items-end justify-center text-[#faf8ef] uppercase tracking-widest font-mono mb-3 text-center leading-tight whitespace-nowrap">Eastern<br/>Time</span>
          <div className="relative w-[32px] h-[32px]">
             <svg width="32" height="32" viewBox="0 0 32 32" className="drop-shadow-[0_0_5px_rgba(41,200,193,0.3)]">
                {/* Dial ring */}
                <circle cx="16" cy="16" r="15" fill="transparent" stroke="var(--cyan-primary)" strokeWidth="1.5" strokeOpacity="0.4"/>
                {/* Center dot */}
                <circle cx="16" cy="16" r="1.5" fill="var(--cyan-primary)" />
                {/* Hour hand */}
                <line x1="16" y1="16" x2="16" y2="8" stroke="#faf8ef" strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${hourAngle} 16 16)`} />
                {/* Minute hand */}
                <line x1="16" y1="16" x2="16" y2="4" stroke="var(--cyan-primary)" strokeWidth="1" strokeLinecap="round" transform={`rotate(${minuteAngle} 16 16)`} />
                {/* Second hand */}
                <line x1="16" y1="16" x2="16" y2="2" stroke="var(--alert-red)" strokeWidth="0.5" strokeLinecap="round" transform={`rotate(${secondAngle} 16 16)`} />
             </svg>
          </div>
       </div>

       {/* GRID LOAD PANEL */}
       <div className="flex-1 bg-[var(--surface)]/30 border border-[var(--grid)] p-3 rounded flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm">
          <span className="text-[8px] h-6 flex items-end justify-center text-[#faf8ef] uppercase tracking-widest font-mono mb-3 text-center leading-tight whitespace-nowrap">Grid<br/>Load</span>
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
       <div className="flex-1 bg-[var(--surface)]/30 border border-[var(--grid)] p-3 rounded flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm">
          <span className="text-[8px] h-6 flex items-end justify-center text-[#faf8ef] uppercase tracking-widest font-mono mb-3 text-center leading-tight whitespace-nowrap">Avg National<br/>Windspeed</span>
          
          <div className="flex items-center justify-center gap-1">
             {/* Text Block */}
             <div className="flex items-end pr-1">
                <motion.div className="text-[20px] font-mono font-bold leading-none text-[var(--cyan-primary)]">
                   <motion.span>{displayWindSpeed}</motion.span>
                </motion.div>
             </div>
             
             {/* Animated Airsock Illustration */}
             <div className="w-[20px] h-[28px] flex items-center justify-center relative ml-1">
                <style>{`
                  @keyframes rigidFlap {
                     0% { transform: scale(1) rotate(0deg); }
                     100% { transform: scale(0.95) rotate(-1deg); }
                  }
                  @keyframes smoothSway {
                     0% { transform: rotate(4deg) translateY(1px); }
                     100% { transform: rotate(-5deg) translateY(-1px); }
                  }
                  .wind-flap {
                     transform-origin: 0px 4px;
                     animation: rigidFlap 0.12s infinite alternate ease-in-out, smoothSway 2s infinite alternate ease-in-out;
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
                <div className="absolute left-[2px] top-0 bottom-0 w-[1.5px] bg-[var(--muted)] rounded-full" />
                
                {/* Wind Sock Canvas */}
                <motion.div 
                    className="absolute left-[3px] top-[6px] origin-[0px_4px]"
                    style={{ rotate: sockRotation }}
                >
                   <svg width="20" height="10" viewBox="0 0 24 12" className={`overflow-visible ${isHighWind ? 'wind-flap' : 'wind-slow'}`}>
                      <path d="M 0,0 L 22,3 L 22,9 L 0,12 Z" fill="#b02636" />
                      <path d="M 0,0 L 8,1.2 L 8,10.8 L 0,12 Z" fill="var(--alert-red)" />
                      <path d="M 8,1.2 L 15,2.1 L 15,9.9 L 8,10.8 Z" fill="#faf8ef" />
                      <path d="M 15,2.1 L 22,3 L 22,9 L 15,9.9 Z" fill="var(--alert-red)" />
                      <ellipse cx="0" cy="6" rx="1.5" ry="6" fill="#faf8ef" stroke="var(--muted)" strokeWidth="0.5" />
                   </svg>
                </motion.div>
             </div>
          </div>
       </div>
    </div>
  );
}
