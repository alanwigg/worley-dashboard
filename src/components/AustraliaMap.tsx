"use client";
import React from 'react';

const TinyTurbine = ({ x, y, delay, scaleFactor = 1 }: { x: number, y: number, delay: number, scaleFactor?: number }) => (
  // Boosted base scale from 0.3 to 0.45 for global visibility increase
  <g transform={`translate(${x}, ${y}) scale(${0.45 * scaleFactor})`}>
    
    {/* Shadow perfectly locked to the base coordinate spreading leftwards, rotated 15deg anti-clockwise, fading to 0 */}
    <ellipse cx="-10" cy="13" rx="10" ry="1.5" fill="url(#fadeShadow)" transform="rotate(-15, 0, 13)" />

    <line x1="0" y1="0" x2="0" y2="12" stroke="var(--alert-red)" strokeWidth="2" />
    <circle cx="0" cy="0" r="1.5" fill="var(--alert-red)" />
    
    <g stroke="var(--alert-red)" strokeWidth="1" fill="none">
       <animateTransform 
          attributeName="transform" 
          type="rotate" 
          from="0 0 0" 
          to="-360 0 0" 
          dur={`${1.5 + delay}s`} 
          repeatCount="indefinite" 
       />
       <line x1="0" y1="0" x2="0" y2="-8" />
       <line x1="0" y1="0" x2="7" y2="4" />
       <line x1="0" y1="0" x2="-7" y2="4" />
    </g>
  </g>
);

export function AustraliaMap() {
  return (
    // Switch to flex column without hardcoded absolute heights to allow natural document flow
    <div className="w-full flex flex-col mt-0 lg:mt-0">
      
      {/* Header Metric Row */}
      <div className="w-full flex justify-between items-start z-10 mb-0">
         {/* Left Stat */}
         <div className="flex flex-col items-start drop-shadow-sm">
            <div className="text-[28px] font-bold font-mono text-[var(--background)] tracking-tighter leading-none">
               114
            </div>
            <div className="flex flex-col items-start text-[7px] font-mono text-[var(--background)] uppercase tracking-widest pt-1 border-t border-[var(--background)]/40 mt-1 w-full text-left leading-tight opacity-80">
               <span>Utility</span>
               <span>Wind Farms</span>
            </div>
         </div>
         {/* Right Stat */}
         <div className="flex flex-col items-end drop-shadow-sm text-right">
            <div className="text-[28px] font-bold font-mono text-[var(--background)] tracking-tighter leading-none">
               3,842
            </div>
            <div className="flex flex-col items-end text-[7px] font-mono text-[var(--background)] uppercase tracking-widest pt-1 border-t border-[var(--background)]/40 mt-1 w-full text-right leading-tight opacity-80">
               <span>Active</span>
               <span>Turbines</span>
            </div>
         </div>
      </div>

      {/* Removed drop shadow and replaced flat fill with a volumetric terrain gradient */}
      <svg width="100%" height="auto" viewBox="0 0 100 90" className="opacity-100 overflow-visible mt-0 min-h-[220px]">
         <defs>
           <linearGradient id="fadeShadow" x1="1" y1="0" x2="0" y2="0">
             <stop offset="0%" stopColor="rgba(0,0,0,0.8)" />
             <stop offset="100%" stopColor="rgba(0,0,0,0)" />
           </linearGradient>
           
           {/* Subtle terrain tonality mapping: light source coming from top-right to match turbine drop shadows */}
           <linearGradient id="terrainGradient" x1="0%" y1="100%" x2="100%" y2="0%">
             <stop offset="0%" stopColor="#001820" stopOpacity="0.95" />
             <stop offset="40%" stopColor="#00222b" stopOpacity="0.9" />
             <stop offset="85%" stopColor="#003645" stopOpacity="0.85" />
             <stop offset="100%" stopColor="#00485c" stopOpacity="0.95" />
           </linearGradient>
         </defs>

         {/* Standard Top-Down Surface Layer */}
         <g opacity="0.75">
           <g transform="scale(0.034) translate(-40, -100)" fill="url(#terrainGradient)" stroke="var(--cyan-primary)" strokeWidth="6" strokeOpacity="0.3">
             <path d="M105.3,1968.5s16.2-275.3,0-388.6c-16.2-113.3-161.9-599.1-81-663.9,81-64.8,615.3-323.9,615.3-323.9,0,0,178.1-290.8,356.2-299.2l178.1-8.4s210.5-210.5,291.5-210.5,226.7,111.1,226.7,111.1l-99.4,164.2,358.5,161.9L2145.6,0s178.1,300.6,226.7,462.6,194.3,307.7,194.3,307.7c0,0,388.6,360.2,356.2,601.1-32.4,240.9-226.7,597.1-226.7,710.5s-145.7,194.3-145.7,194.3h-469.6l-242.9-210.5s-97.2-194.3-178.1-113.3-210.5-275.3-372.4-275.3-469.6,210.5-647.7,226.7c-178.1,16.2-388.6,145.7-534.4,64.8Z"/>
             <path d="M2253.4,2510.5s63.6,279.9,140,279.9,152.7-229,152.7-229l-292.7-50.9Z"/>
           </g>
         </g>

         {/* Scaled Volume Farm Mapping per Regional Data */}
         {/* WA (18 Farms - Medium) */}
         <TinyTurbine x={18} y={48} delay={0.2} scaleFactor={1.0} />
         <TinyTurbine x={12} y={55} delay={0.6} scaleFactor={0.8} />

         {/* SA (24 Farms - Very High Volume) */}
         <TinyTurbine x={35} y={60} delay={0.6} scaleFactor={1.5} /> 
         <TinyTurbine x={44} y={62} delay={0.3} scaleFactor={1.2} /> 

         {/* VIC (35 Farms - HIGHEST DENSITY CORRIDOR) */}
         <TinyTurbine x={55} y={65} delay={0.9} scaleFactor={2.0} /> 

         {/* NSW & ACT (15 Farms - High Growth) */}
         <TinyTurbine x={65} y={45} delay={0.7} scaleFactor={1.4} />
         <TinyTurbine x={72} y={55} delay={0.1} scaleFactor={1.0} />

         {/* QLD (6 Farms - Growing) */}
         <TinyTurbine x={70} y={20} delay={0.5} scaleFactor={0.7} />
         <TinyTurbine x={60} y={10} delay={0.4} scaleFactor={0.6} />

         {/* TAS (4 Farms - Strong Constant Output) */}
         <TinyTurbine x={78} y={80} delay={0.5} scaleFactor={0.9} />
         
      </svg>

      {/* Map Legend / Key structurally rendered strictly underneath map */}
      <div className="w-full flex items-center justify-start gap-4 z-10 opacity-80 bg-[var(--cyan-primary)] p-3 px-4 rounded-md shadow-lg border border-[var(--background)]/20 mt-1 lg:mt-2 mb-2">
         <div className="flex items-center gap-3">
             <svg width="12" height="15" viewBox="-8 -8 20 25" className="overflow-visible">
                <TinyTurbine x={0} y={5} delay={0} scaleFactor={0.8} />
             </svg>
             <div className="text-[10px] font-mono text-[var(--background)] tracking-widest leading-none mt-1">
                &lt;20 <span className="text-[8px] opacity-70">UNITS</span>
             </div>
         </div>
         <div className="flex items-center gap-3 border-l border-[var(--background)]/30 pl-4">
             <svg width="12" height="20" viewBox="-8 -8 20 25" className="overflow-visible">
                <TinyTurbine x={0} y={5} delay={0} scaleFactor={1.2} />
             </svg>
             <div className="text-[10px] font-mono text-[var(--background)] tracking-widest leading-none mt-1">
                +20 <span className="text-[8px] opacity-70">UNITS</span>
             </div>
         </div>
         <div className="flex items-center gap-3 border-l border-[var(--background)]/30 pl-4">
             <svg width="12" height="26" viewBox="-8 -8 20 30" className="overflow-visible">
                <TinyTurbine x={0} y={5} delay={0} scaleFactor={1.8} />
             </svg>
             <div className="text-[10px] font-mono text-[var(--background)] font-bold tracking-widest leading-none mt-1">
                LARGE 40+
             </div>
         </div>
      </div>

    </div>
  );
}
