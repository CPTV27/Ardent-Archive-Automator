
import React from 'react';
import { ArchiveIcon } from 'lucide-react'; // Assuming we can use lucide here, or use the SVG from App.tsx

// Reusing the specific SVG icon from App.tsx for consistency if Lucide isn't preferred for the logo
const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: 'ingest' | 'magnets' | 'sorting';
  setActiveTab: (tab: 'ingest' | 'magnets' | 'sorting') => void;
}

export default function DashboardLayout({ children, activeTab, setActiveTab }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-ardent-black text-ardent-cream font-sans selection:bg-ardent-gold selection:text-ardent-black">
      {/* Header / Navigation */}
      <header className="border-b border-ardent-darkGray bg-ardent-black/95 sticky top-0 z-50 backdrop-blur-md shadow-sm shadow-black">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-ardent-gold rounded-md text-ardent-black shadow-lg shadow-ardent-gold/20">
              <LogoIcon />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold tracking-wide text-ardent-gold">ARDENT</h1>
              <p className="text-[10px] uppercase tracking-[0.25em] text-ardent-cream/60 font-medium">Archive Automator</p>
            </div>
          </div>

          <nav className="flex gap-1 bg-white/5 p-1.5 rounded-lg border border-white/5">
            {(['ingest', 'magnets', 'sorting'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-ardent-gold text-ardent-black shadow-lg shadow-ardent-gold/20 scale-105'
                    : 'text-ardent-cream/60 hover:text-ardent-cream hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  );
}
