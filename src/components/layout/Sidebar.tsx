import React from 'react';
import { ProjectConfig, ProjectId, ProjectViewConfig } from '../../types/hub';
import { IconRenderer } from '../common/IconRenderer';
import { X, Layers, LayoutDashboard, ArrowLeft, Briefcase, ChevronRight } from 'lucide-react';
import { Badge } from '../common/Badge';

interface SidebarProps {
  currentProject: ProjectConfig;
  allProjects: ProjectConfig[];
  currentProjectId: ProjectId;
  onSelectProject: (id: ProjectId) => void;
  activeViewId: string;
  onSelectView: (viewId: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentProject,
  allProjects,
  currentProjectId,
  onSelectProject,
  activeViewId,
  onSelectView,
  mobileOpen,
  onCloseMobile
}) => {
  const isOverview = currentProjectId === 'overview';

  const content = (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 select-none">
      
      {/* 1. Header Area */}
      {isOverview ? (
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  Vue d'Ensemble Hub
                </h2>
                <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-bold">
                  {allProjects.length} Projets Actifs
                </span>
              </div>
            </div>

            {/* Mobile close */}
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Fermer la navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold">Direction :</span>
              <span className="font-bold text-slate-900 dark:text-white">Romain FRIDERICH</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold">Lead Hub :</span>
              <span className="font-bold text-slate-900 dark:text-white">Jean Elson</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
          {/* Back to overview link */}
          <button
            onClick={() => onSelectProject('overview')}
            className="w-full flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors py-1 px-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer -mt-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Vue d'ensemble des projets</span>
          </button>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${currentProject.accentColor.badgeBg} ${currentProject.accentColor.badgeText} border border-slate-300 dark:border-slate-700 shrink-0`}
              >
                <IconRenderer name={currentProject.views[0]?.icon || 'Layers'} className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
                  {currentProject.name}
                </h2>
                <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-bold">
                  {currentProject.version}
                </span>
              </div>
            </div>

            {/* Close button on mobile */}
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Fermer la navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lead & Direction metadata */}
          <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold">Direction :</span>
              <span className="font-bold text-slate-900 dark:text-white">{currentProject.direction}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold">Lead :</span>
              <span className="font-bold text-slate-900 dark:text-white">{currentProject.lead}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Navigation List */}
      <nav aria-label="Navigation principale" className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {isOverview ? (
          <>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 px-3 py-1.5 block">
              Tous les Projets ({allProjects.length})
            </span>

            {allProjects.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelectProject(p.id);
                  onCloseMobile();
                }}
                className="w-full text-left p-2.5 rounded-xl text-xs font-bold flex items-center justify-between text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs ${p.accentColor.badgeBg} ${p.accentColor.badgeText} border border-slate-300 dark:border-slate-700 shrink-0`}
                  >
                    <IconRenderer name={p.views[0]?.icon || 'Layers'} className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="truncate block">{p.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono font-medium block">
                      {p.totalDays}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 shrink-0" />
              </button>
            ))}
          </>
        ) : (
          <>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 px-3 py-1.5 block">
              Vues contextuelles ({currentProject.views.length})
            </span>

            {currentProject.views.map((view: ProjectViewConfig) => {
              const isActive = view.id === activeViewId;
              return (
                <button
                  key={view.id}
                  onClick={() => {
                    onSelectView(view.id);
                    onCloseMobile();
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={
                        isActive
                          ? 'text-indigo-400 dark:text-indigo-600'
                          : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                      }
                    >
                      <IconRenderer name={view.icon} className="w-4 h-4 shrink-0" />
                    </span>
                    <span className="truncate">{view.label}</span>
                  </div>

                  {view.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shrink-0 ${
                        isActive
                          ? 'bg-slate-800 text-slate-100 dark:bg-slate-200 dark:text-slate-900'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {view.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </>
        )}
      </nav>

      {/* 3. Sidebar Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between font-bold">
        <span className="font-mono">Digipepss Hub</span>
        <span className="inline-flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Hub Opérationnel
        </span>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed width, sticky) */}
      <aside
        aria-label="Navigation latérale"
        className="hidden md:block w-72 shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-30"
      >
        {content}
      </aside>

      {/* Mobile Drawer with Backdrop */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <aside
            aria-label="Menu de navigation mobile"
            className="relative w-80 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200"
          >
            {content}
          </aside>
        </div>
      )}
    </>
  );
};
