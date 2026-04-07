"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export function EfficiencyChart({ data }: { data: any[] }) {
  // If no data, render empty
  if (!data || data.length === 0) return <div className="h-48" />;

  const currentEfficiency = data[data.length - 1]?.efficiency.toFixed(1) || 0;

  return (
    <div className="relative w-full h-[220px] flex flex-col items-start mt-8">
      {/* Header */}
      <div className="text-[var(--foreground)] text-sm font-bold uppercase tracking-widest w-full pb-1 text-left mb-4">
        Energy Efficiency
      </div>
      
      {/* Current Value Pill */}
      <div className="absolute top-[50px] right-4 z-10 flex flex-col items-end">
         <div className="bg-[var(--green-primary)] text-[var(--background)] text-[10px] font-bold px-2 py-1 rounded-full font-mono shadow-[0_0_10px_var(--green-glow)]">
            EFFICIENCY: {currentEfficiency}%
         </div>
         <div className="text-[var(--green-primary)] text-[8px] font-mono mt-2 flex items-center gap-1">
             <span className="inline-block border-t-4 border-b-4 border-l-4 border-transparent border-l-[var(--green-primary)] w-0 h-0" />
             OPTIMAL PERFORMANCE
         </div>
      </div>

      {/* Chart Wrapper */}
      <div className="w-full h-[140px] mt-2 relative">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <defs>
                <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--cyan-primary)" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="var(--cyan-primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorIneff" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--alert-red)" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="var(--alert-red)" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grid)" vertical={true} horizontal={true} />
            <XAxis dataKey="time" stroke="var(--muted)" fontSize={8} tickMargin={5} axisLine={false} tickLine={false} />
            <YAxis stroke="var(--muted)" fontSize={8} tickCount={8} domain={[0, 100]} axisLine={false} tickLine={false} />
            
            <Area 
                type="monotone" 
                dataKey="inefficiency" 
                stroke="var(--alert-red)" 
                strokeWidth={1}
                fillOpacity={1} 
                fill="url(#colorIneff)" 
                isAnimationActive={false}
            />

            <Area 
                type="monotone" 
                dataKey="efficiency" 
                stroke="var(--cyan-primary)" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorEff)" 
                isAnimationActive={false}
            />
            
            {/* Draw a vertical line for the last point */}
            <line x1="100%" y1="0" x2="100%" y2="100%" stroke="var(--green-primary)" strokeWidth="1" opacity="0.8" />
            </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
