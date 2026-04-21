import Dashboard from '@/components/Dashboard';

export default function Home() {
  return (
    <main className="min-h-screen text-[var(--foreground)] relative overflow-x-hidden font-sans">
      
      {/* Permanent Fixed Background Layer to prevent Mobile URL-bar layout jumps */}
      <div className="fixed top-0 left-0 w-full h-[100lvh] -z-50 pointer-events-none" style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 54, 69, 0.05), rgba(0, 54, 69, 0.40)), url('/BG_Turbine_Crisp.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'right bottom',
        backgroundRepeat: 'no-repeat'
      }} />

      {/* Background Topo Map & Grid Lines (simulated) */}
      <div className="fixed top-0 left-0 w-full h-[100lvh] pointer-events-none z-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(var(--foreground) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="w-full">
         <Dashboard />
      </div>
    </main>
  );
}
