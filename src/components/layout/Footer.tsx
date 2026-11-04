import React from 'react';
import { ShieldCheck, Server, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-700 dark:text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Rights */}
        <div className="flex items-center gap-3 font-medium">
          <span className="font-bold text-slate-900 dark:text-white">Digipepss Tech Hub</span>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span>Plateforme de pilotage technique & architectural</span>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span>© 2026 Digilium / Digipepss</span>
        </div>

        {/* System Badges & Guarantees */}
        <div className="flex items-center gap-4 text-xs flex-wrap justify-center font-bold">
          <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>0 Octet Disque (Stateless RAM)</span>
          </div>

          <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">•</span>

          <div className="flex items-center gap-1.5 text-indigo-800 dark:text-indigo-300">
            <Cpu className="w-4 h-4 shrink-0" />
            <span>FastAPI + io.BytesIO</span>
          </div>

          <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">•</span>

          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
            <Server className="w-4 h-4 shrink-0" />
            <span>Production Hetzner & LexIA GPU</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
