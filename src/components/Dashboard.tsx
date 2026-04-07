"use client";
import { useEffect, useRef } from 'react';
import { useSpring } from 'framer-motion';
import { useWindData } from '@/hooks/useWindData';
import { Turbine } from './Turbine';
import { PowerGauge } from './PowerGauge';
import { EfficiencyChart } from './EfficiencyChart';
import { MetricsModule } from './MetricsModule';
import { ArrowRight, ChevronDown } from 'lucide-react';

import { AustraliaMap } from './AustraliaMap';

export default function Dashboard() {
  const { targetMW, history } = useWindData();
  const dataVisRef = useRef<HTMLDivElement>(null);

  const scrollToData = () => {
    dataVisRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Spring to smoothly interpolate the target MW changes
  const mwSpring = useSpring(targetMW, {
    stiffness: 40,
    damping: 15,
    mass: 1
  });

  useEffect(() => {
    mwSpring.set(targetMW);
  }, [targetMW, mwSpring]);

  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 pt-4 px-6 md:px-12 relative overflow-hidden min-h-[calc(100vh-75px)]">

      {/* Left Column - Contextual Text */}
      <div className="relative flex-1 flex flex-col gap-4 items-start text-left z-50 w-full lg:max-w-sm">
        {/* Infinite Left & Vertical Sky Mist Background - Square Edges 
            (Constrained to just cover itself on Mobile, infinite vertical on Desktop) */}
        <div className="absolute -top-[100vh] -bottom-16 lg:-bottom-[100vh] -left-[100vw] right-[-2rem] bg-[var(--cyan-primary)] opacity-95 backdrop-blur-md -z-10 shadow-2xl" />

        <div className="p-2 pb-2 relative text-[var(--background)]">
          <h2 className="text-[var(--background)] opacity-70 text-sm tracking-[0.2em] mb-4 uppercase font-bold border-l-2 border-[var(--background)] pl-4">
            National Grid Telemetry
          </h2>
          <h1 className="text-4xl lg:text-5xl font-mono text-[var(--background)] tracking-tighter mb-4 leading-[1.05] font-bold">
            <span className="text-[var(--foreground)] drop-shadow-md">Live</span> Australian wind <br /><span className="text-[var(--foreground)] drop-shadow-md">energy</span> grid
          </h1>
          <p className="text-[var(--background)] opacity-80 text-sm leading-relaxed mb-4 font-sans">
            Monitoring grid load and electrical efficiency for a simulated high-capacity offshore turbine node networked into the vast Australian coastal energy corridor.
          </p>
          <p className="text-[var(--background)] opacity-60 text-xs leading-relaxed font-sans mb-4">
            <strong className="text-[var(--background)] opacity-100">Status:</strong> Operational. Target baseline maps 8.5 MW standard output.
          </p>
        </div>

        {/* Render the stylized Tech Node map of Australia directly below the text */}
        <div className="px-6 w-full text-[var(--background)] border-[var(--background)] z-10">
          <AustraliaMap />
        </div>
      </div>

      {/* Center Visualization */}
      <div className="flex-[1.5] flex flex-col justify-center items-center w-full z-10 relative mt-16 lg:mt-0 translate-x-0 lg:translate-x-[35px]">
        <Turbine mwValue={mwSpring} />
        
        {/* Mobile Interactive Scroll Bypass */}
        <button 
           onClick={scrollToData}
           className="lg:hidden absolute top-[65%] right-6 animate-pulse flex items-center justify-center bg-[var(--cyan-primary)] text-[var(--background)] p-4 rounded-full hover:bg-[var(--foreground)] transition-colors shadow-[0_0_30px_rgba(41,200,193,0.5)] z-[100] ring-4 ring-white/10"
           aria-label="Scroll past 3D module"
        >
           <ChevronDown size={32} />
        </button>
      </div>

      {/* Right Column - Data Vis */}
      <div ref={dataVisRef} className="flex-1 flex flex-col items-center lg:items-end text-right z-50 w-full lg:max-w-sm p-4 pt-10 lg:pt-4">
        <div className="w-full mb-12 relative flex flex-col items-center gap-6">

          {/* Top Metrics - Box explicitly removed per user request */}
          <div className="w-full flex flex-col items-center gap-4">
            <PowerGauge mwSpring={mwSpring} />
            <MetricsModule mwSpring={mwSpring} />
          </div>

          {/* Efficiency Chart Glass Container */}
          <div className="w-full mt-2 bg-[var(--background)]/30 backdrop-blur-xl p-6 rounded-xl shadow-2xl border border-white/10">
            <EfficiencyChart data={history} />
          </div>

        </div>
      </div>

    </div>
  );
}
