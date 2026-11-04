import React from 'react';
import {
  Briefcase,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Copy,
  Check,
  Cpu,
  Network,
  BookOpen,
  LayoutDashboard,
  Sparkles,
  Layers
} from 'lucide-react';
import { ProjectConfig, ProjectId } from '../../types/hub';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  projects: ProjectConfig[];
  currentProjectId: ProjectId;
  onSelectProject: (id: ProjectId) => void;
  onOpenSearch: () => void;
  onPrimaryAction: () => void;
  copiedPrimaryAction: boolean;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projects,
  currentProjectId,
  onSelectProject,
  onOpenSearch,
  onPrimaryAction,
  copiedPrimaryAction,
  mobileMenuOpen,
  onToggleMobileMenu
}) => {
  const { theme, toggleTheme } = useTheme();
  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  const getProjectIcon = (id: ProjectId) => {
    switch (id) {
      case 'capturemind':
        return <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />;
      case 'visiofact':
        return <Network className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case 'knowledge':
        return <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
      case 'agent-ia':
        return <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />;
      default:
        return <Layers className="w-4 h-4 text-indigo-500 shrink-0" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Mobile Menu Trigger + Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu de navigation'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => onSelectProject('overview')}
              className="flex items-center gap-3 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl p-1 -m-1"
              title="Retour à la Vue d'ensemble du Hub"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 dark:from-indigo-600 dark:to-indigo-900 flex items-center justify-center text-white shadow-sm shrink-0">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                    Digipepss Tech Hub
                  </span>
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                    2026
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 hidden sm:block font-medium">
                  Pilotage technique & architectural unifié
                </p>
              </div>
            </button>
          </div>

          {/* Center: Global Project Switcher (Clean, no stacked tabs, auto-generated from config) */}
          <nav
            aria-label="Sélecteur de projet"
            className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
          >
            {/* Overview Shortcut Button */}
            <button
              onClick={() => onSelectProject('overview')}
              aria-current={currentProjectId === 'overview' ? 'page' : undefined}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                currentProjectId === 'overview'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Vue d'ensemble</span>
            </button>

            {/* Auto-generated Projects list from config */}
            {projects.map((proj) => {
              const isActive = proj.id === currentProjectId;
              return (
                <button
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700/60'
                  }`}
                >
                  {getProjectIcon(proj.id)}
                  <span>{proj.shortName}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      isActive
                        ? 'bg-slate-800 text-slate-100 dark:bg-slate-200 dark:text-slate-900'
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {proj.version}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Quick Search + Dark Mode + Primary CTA */}
          <div className="flex items-center gap-2">
            
            {/* Quick Search trigger button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
              title="Rechercher dans le Hub (Ctrl+K)"
              aria-label="Ouvrir la recherche globale"
            >
              <Search className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" />
              <span className="hidden sm:inline">Recherche</span>
              <kbd className="hidden lg:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-bold">
                ⌘K
              </kbd>
            </button>

            {/* Dark / Light Mode Switch */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
              aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
              title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onPrimaryAction}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-sm transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 cursor-pointer"
              aria-label="Action principale"
            >
              {copiedPrimaryAction ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-white" />
                  <span className="hidden sm:inline">
                    {currentProject.primaryAction?.label || 'Réponse M. Friderich'}
                  </span>
                  <span className="sm:hidden">Réponse</span>
                </>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
