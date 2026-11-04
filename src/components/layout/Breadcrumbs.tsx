import React from 'react';
import { ChevronRight, Home, LayoutDashboard } from 'lucide-react';
import { ProjectConfig, ProjectId } from '../../types/hub';

interface BreadcrumbsProps {
  currentProject?: ProjectConfig;
  activeViewLabel: string;
  activeSubTabLabel?: string;
  isOverview?: boolean;
  onNavigateToOverview: () => void;
  onResetToProject: () => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentProject,
  activeViewLabel,
  activeSubTabLabel,
  isOverview = false,
  onNavigateToOverview,
  onResetToProject
}) => {
  return (
    <nav aria-label="Fil d'Ariane" className="py-2.5 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-xs">
      <ol className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 flex-wrap font-medium">
        
        {/* Hub Home (Always navigates to Overview) */}
        <li className="flex items-center gap-1.5">
          <button
            onClick={onNavigateToOverview}
            className="hover:text-slate-950 dark:hover:text-white flex items-center gap-1.5 transition-colors font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            title="Revenir à la Vue d'ensemble du Hub"
          >
            <Home className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>Digipepss Hub</span>
          </button>
        </li>

        <li aria-hidden="true" className="text-slate-400 dark:text-slate-500">
          <ChevronRight className="w-3.5 h-3.5" />
        </li>

        {isOverview ? (
          <li className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5" aria-current="page">
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Vue d'ensemble</span>
            </span>
          </li>
        ) : (
          <>
            {/* Current Project */}
            {currentProject && (
              <li className="flex items-center gap-1.5">
                <button
                  onClick={onResetToProject}
                  className="font-bold text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {currentProject.name}
                </button>
              </li>
            )}

            <li aria-hidden="true" className="text-slate-400 dark:text-slate-500">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>

            {/* Current View */}
            <li className="flex items-center gap-1.5">
              <span
                className={
                  !activeSubTabLabel
                    ? 'font-bold text-slate-900 dark:text-white'
                    : 'text-slate-700 dark:text-slate-300 font-semibold'
                }
                aria-current={!activeSubTabLabel ? 'page' : undefined}
              >
                {activeViewLabel}
              </span>
            </li>

            {/* Optional Sub-tab */}
            {activeSubTabLabel && (
              <>
                <li aria-hidden="true" className="text-slate-400 dark:text-slate-500">
                  <ChevronRight className="w-3.5 h-3.5" />
                </li>
                <li className="flex items-center gap-1.5">
                  <span
                    className="font-bold text-indigo-700 dark:text-indigo-300"
                    aria-current="page"
                  >
                    {activeSubTabLabel}
                  </span>
                </li>
              </>
            )}
          </>
        )}
      </ol>
    </nav>
  );
};
