import React from 'react';
import { ProjectConfig, ProjectViewConfig } from '../../types/hub';
import { Badge } from '../common/Badge';
import { IconRenderer } from '../common/IconRenderer';
import { Calendar, Clock, User, Shield, Check, Copy } from 'lucide-react';

interface ProjectLayoutProps {
  project: ProjectConfig;
  activeViewId: string;
  activeSubTabId?: string;
  onSubTabChange?: (subTabId: string) => void;
  onPrimaryAction?: () => void;
  copiedPrimaryAction?: boolean;
  children: React.ReactNode;
}

export const ProjectLayout: React.FC<ProjectLayoutProps> = ({
  project,
  activeViewId,
  activeSubTabId,
  onSubTabChange,
  onPrimaryAction,
  copiedPrimaryAction = false,
  children
}) => {
  const currentView = project.views.find((v) => v.id === activeViewId) || project.views[0];
  const subTabs = currentView?.subTabs;

  return (
    <div className="space-y-6">
      
      {/* 1. Generic Project Context Header Card */}
      <header className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Top line: Identity + Badges + Optional Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg ${project.accentColor.badgeBg} ${project.accentColor.badgeText} border border-slate-300 dark:border-slate-700 shadow-sm shrink-0`}
            >
              <IconRenderer name={currentView?.icon || project.views[0]?.icon || 'Layers'} className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {project.name}
                </h1>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                  {project.version}
                </span>
                <Badge
                  label={project.status}
                  variant={(project.statusVariant as any) || 'indigo'}
                  size="sm"
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                {project.subtitle}
              </p>
            </div>
          </div>

          {/* Primary Action Button (if configured) */}
          {project.primaryAction && onPrimaryAction && (
            <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
              <button
                onClick={onPrimaryAction}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 shadow-sm transition-all flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {copiedPrimaryAction ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-white" />
                )}
                <span>
                  {copiedPrimaryAction ? 'Action Effectuée !' : project.primaryAction.label}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Metadata Grid */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
              Direction
            </span>
            <span className="font-bold text-slate-900 dark:text-white truncate block mt-0.5">
              {project.direction}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
              Lead Expert
            </span>
            <span className="font-bold text-slate-900 dark:text-white truncate block mt-0.5">
              {project.lead}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
              Échéance Cible
            </span>
            <span className="font-bold font-mono text-indigo-700 dark:text-indigo-300 truncate block mt-0.5">
              {project.targetDeadline}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
              Charge Totale
            </span>
            <span className="font-bold font-mono text-slate-900 dark:text-white truncate block mt-0.5">
              {project.totalDays}
            </span>
          </div>
        </div>

      </header>

      {/* 2. Optional Contextual Sub-tabs Bar (if current view defines subTabs) */}
      {subTabs && subTabs.length > 0 && onSubTabChange && (
        <nav
          aria-label="Sous-onglets contextuels"
          className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 overflow-x-auto custom-scrollbar"
        >
          {subTabs.map((tab) => {
            const isSubActive = activeSubTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSubTabChange(tab.id)}
                aria-current={isSubActive ? 'page' : undefined}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isSubActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700'
                }`}
              >
                {tab.icon && (
                  <IconRenderer
                    name={tab.icon}
                    className={`w-4 h-4 ${
                      isSubActive ? 'text-indigo-400 dark:text-indigo-600' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  />
                )}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* 3. View Content Area */}
      <div>{children}</div>

    </div>
  );
};
