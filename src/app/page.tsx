import Dashboard from '@/components/Dashboard';
import { Search, ChevronDown } from 'lucide-react';
import { WorleyLogo } from '@/components/WorleyLogo';

export default function Home() {
  return (
    <main className="min-h-screen text-[var(--foreground)] relative overflow-x-hidden font-sans">
      
      {/* Permanent Fixed Background Layer to prevent Mobile URL-bar layout jumps */}
      <div className="fixed top-0 left-0 w-full h-[100lvh] -z-50 pointer-events-none" style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 54, 69, 0.05), rgba(0, 54, 69, 0.40)), url('/bg-sunset.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'right bottom',
        backgroundRepeat: 'no-repeat'
      }} />

      {/* Background Topo Map & Grid Lines (simulated) */}
      <div className="fixed top-0 left-0 w-full h-[100lvh] pointer-events-none z-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(var(--foreground) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <header className="absolute top-0 left-0 w-full h-[75px] flex justify-between items-center px-8 md:px-12 z-50 bg-[var(--surface)] border-b border-[var(--grid)] shadow-lg text-[14px]">
        {/* Logo Area */}
        <div className="flex items-center">
           <WorleyLogo className="w-auto h-[52px]" />
        </div>

        {/* Center Nav */}
        <div className="hidden lg:flex items-center gap-8 font-semibold text-[var(--foreground)]">
           <button className="flex items-center gap-1 hover:text-[var(--cyan-primary)] transition-colors">About us <ChevronDown size={14}/></button>
           <button className="flex items-center gap-1 hover:text-[var(--cyan-primary)] transition-colors">Solutions <ChevronDown size={14}/></button>
           <button className="flex items-center gap-1 hover:text-[var(--cyan-primary)] transition-colors">Sustainability <ChevronDown size={14}/></button>
        </div>

        {/* Right Nav */}
        <div className="hidden lg:flex items-center gap-7 font-semibold text-[var(--foreground)]">
           <button className="hover:text-[var(--cyan-primary)] transition-colors">Insights</button>
           <button className="hover:text-[var(--cyan-primary)] transition-colors">News</button>
           <button className="flex items-center gap-1 hover:text-[var(--cyan-primary)] transition-colors">Careers <ChevronDown size={14}/></button>
           <button className="flex items-center gap-1 hover:text-[var(--cyan-primary)] transition-colors">Investors <ChevronDown size={14}/></button>
           <button className="hover:text-[var(--cyan-primary)] transition-colors">Contact us</button>
           <button className="ml-2 hover:text-[var(--cyan-primary)] transition-colors"><Search size={18} /></button>
        </div>
      </header>

      <div className="pt-[75px]">
         <Dashboard />
      </div>
    </main>
  );
}
