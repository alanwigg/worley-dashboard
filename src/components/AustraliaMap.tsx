"use client";
import React from 'react';

const TinyTurbine = ({ x, y, delay }: { x: number, y: number, delay: number }) => (
  <g transform={`translate(${x}, ${y}) scale(0.3)`}>
    {/* Sun cast shadow extended heavily to the left */}
    <ellipse cx="-12" cy="14" rx="14" ry="2" fill="rgba(0,0,0,0.5)" transform="rotate(15, -12, 14)" />

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
    <div className="relative w-full h-[300px] flex items-center justify-center mt-2">
      
      {/* Metric Stat positioned freely at top left */}
      <div className="absolute -top-4 left-4 flex flex-col items-start z-10">
         <div className="text-[28px] font-bold font-mono text-[var(--background)] tracking-tighter leading-none drop-shadow-sm">
            3,842
         </div>
         <div className="flex flex-col items-start text-[7px] font-mono text-[var(--background)] uppercase tracking-widest pt-1 border-t border-[var(--background)]/40 mt-1 w-full text-left leading-tight opacity-80">
            <span>Active</span>
            <span>Turbines</span>
         </div>
      </div>

      {/* Map Legend / Key */}
      <div className="absolute bottom-6 left-4 flex items-center gap-2 z-10 opacity-80 bg-[var(--cyan-primary)] p-2 rounded-md shadow-lg border border-[var(--background)]/20">
         <svg width="12" height="15" viewBox="-10 -10 20 25" className="overflow-visible">
            <TinyTurbine x={0} y={0} delay={0} />
         </svg>
         <div className="text-[9px] font-mono text-[var(--background)] font-bold tracking-widest leading-none">
            = 250 UNITS
         </div>
      </div>

      {/* Increased viewBox and adjusted negative space so Tasmania renders perfectly without cutoff */}
      <svg width="100%" height="100%" viewBox="0 0 100 90" className="opacity-100 overflow-visible mt-6 drop-shadow-xl">
         <defs>
           <filter id="landShadow">
             <feDropShadow dx="-2" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.4)" floodOpacity="0.8"/>
           </filter>
         </defs>

         {/* Standard Top-Down Surface Layer */}
         <g filter="url(#landShadow)">
           <g transform="scale(0.034) translate(-40, -100)" fill="#003645" fillOpacity="0.8" stroke="var(--cyan-primary)" strokeWidth="6" strokeOpacity="0.3">
             <path d="M105.3,1968.5s16.2-275.3,0-388.6c-16.2-113.3-161.9-599.1-81-663.9,81-64.8,615.3-323.9,615.3-323.9,0,0,178.1-290.8,356.2-299.2l178.1-8.4s210.5-210.5,291.5-210.5,226.7,111.1,226.7,111.1l-99.4,164.2,358.5,161.9L2145.6,0s178.1,300.6,226.7,462.6,194.3,307.7,194.3,307.7c0,0,388.6,360.2,356.2,601.1-32.4,240.9-226.7,597.1-226.7,710.5s-145.7,194.3-145.7,194.3h-469.6l-242.9-210.5s-97.2-194.3-178.1-113.3-210.5-275.3-372.4-275.3-469.6,210.5-647.7,226.7c-178.1,16.2-388.6,145.7-534.4,64.8Z"/>
             <path d="M2253.4,2510.5s63.6,279.9,140,279.9,152.7-229,152.7-229l-292.7-50.9Z"/>
           </g>
         </g>
         
         {/* Inner Grid pinned to flat surface */}
         <line x1="15" y1="20" x2="65" y2="45" stroke="var(--background)" strokeWidth="0.5" opacity="0.3" />
         <line x1="45" y1="0" x2="50" y2="60" stroke="var(--background)" strokeWidth="0.5" opacity="0.3" />
         <line x1="15" y1="50" x2="60" y2="25" stroke="var(--background)" strokeWidth="0.5" opacity="0.3" />
         <line x1="30" y1="40" x2="80" y2="80" stroke="var(--background)" strokeWidth="0.5" opacity="0.3" />

         {/* Turbines manually mapped into generic 2D coordinate space */}
         {/* West Coast / WA */}
         <TinyTurbine x={18} y={48} delay={0.2} />
         <TinyTurbine x={12} y={55} delay={0.6} />
         <TinyTurbine x={15} y={35} delay={0.1} />
         <TinyTurbine x={22} y={25} delay={0.8} />

         {/* South Coast / SA / VIC */}
         <TinyTurbine x={35} y={60} delay={0.6} /> 
         <TinyTurbine x={45} y={62} delay={0.3} /> 
         <TinyTurbine x={55} y={65} delay={0.9} /> 

         {/* East Coast / NSW / QLD */}
         <TinyTurbine x={65} y={45} delay={0.7} />
         <TinyTurbine x={72} y={55} delay={0.1} />
         <TinyTurbine x={80} y={30} delay={0.3} />
         <TinyTurbine x={70} y={20} delay={0.5} />
         <TinyTurbine x={60} y={10} delay={0.4} />

         {/* Inland Corridors */}
         <TinyTurbine x={42} y={40} delay={0.8} />
         <TinyTurbine x={52} y={35} delay={0.2} />

         {/* Tasmania Node! */}
         <TinyTurbine x={78} y={80} delay={0.5} />
         <TinyTurbine x={82} y={85} delay={0.9} />
      </svg>
    </div>
  );
}
