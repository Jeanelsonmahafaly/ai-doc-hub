import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Calendar, CheckCircle2, Boxes, Scale, Layers, Briefcase } from 'lucide-react';
import { ProjectConfig, ProjectId, ProjectViewConfig } from '../../types/hub';
import {
  full30DaysPlan,
  auditQuestionsList,
  captureMindDecisions,
  peppolFeatures,
  captureMindStack,
  visiofactStack
} from '../../data/hubData';

interface SearchResult {
  id: string;
  projectId: ProjectId;
  viewId: string;
  subTabId?: string;
  type: 'Plan 30j' | 'Audit' | 'Décision' | 'Peppol' | 'Outil' | 'Projet';
  title: string;
  snippet: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (projectId: ProjectId, viewId: string, subTabId?: string) => void;
  projects?: ProjectConfig[];
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate, projects = [] }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Gather and filter items
  const results: SearchResult[] = [];
  const q = query.toLowerCase().trim();

  if (q.length > 0) {
    // 0. Search in Projects & Views
    projects.forEach((proj) => {
      if (
        proj.name.toLowerCase().includes(q) ||
        proj.shortName.toLowerCase().includes(q) ||
        proj.subtitle.toLowerCase().includes(q) ||
        proj.lead.toLowerCase().includes(q)
      ) {
        results.push({
          id: `proj-${proj.id}`,
          projectId: proj.id,
          viewId: proj.defaultViewId,
          type: 'Projet',
          title: `Projet : ${proj.name} (${proj.version})`,
          snippet: `${proj.subtitle} · Lead : ${proj.lead}`
        });
      }

      proj.views.forEach((view: ProjectViewConfig) => {
        if (
          view.label.toLowerCase().includes(q) ||
          view.description?.toLowerCase().includes(q)
        ) {
          results.push({
            id: `view-${proj.id}-${view.id}`,
            projectId: proj.id,
            viewId: view.id,
            type: 'Projet',
            title: `${proj.shortName} > ${view.label}`,
            snippet: view.description || `Vue ${view.label} du projet ${proj.name}`
          });
        }
      });
    });

    // 1. Search in Plan 30j
    full30DaysPlan.forEach((item) => {
      if (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.deliverable.toLowerCase().includes(q) ||
        item.owner.toLowerCase().includes(q) ||
        `jour ${item.day}`.includes(q) ||
        `j${item.day}`.includes(q)
      ) {
        results.push({
          id: `plan-${item.day}`,
          projectId: 'capturemind',
          viewId: 'conception',
          subTabId: 'planning-30j',
          type: 'Plan 30j',
          title: `Jour ${item.day} : ${item.title}`,
          snippet: item.description
        });
      }
    });

    // 2. Search in Audit Questions
    auditQuestionsList.forEach((item) => {
      if (
        item.question.toLowerCase().includes(q) ||
        item.whyCrucial.toLowerCase().includes(q) ||
        item.clarification.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      ) {
        results.push({
          id: `audit-${item.id}`,
          projectId: 'capturemind',
          viewId: 'decisions',
          type: 'Audit',
          title: `[${item.id}] ${item.axeTitle}`,
          snippet: item.question
        });
      }
    });

    // 3. Search in CaptureMind Decisions
    captureMindDecisions.forEach((item) => {
      if (
        item.subject.toLowerCase().includes(q) ||
        item.choice.toLowerCase().includes(q) ||
        item.explanation.toLowerCase().includes(q)
      ) {
        results.push({
          id: `decision-${item.id}`,
          projectId: 'capturemind',
          viewId: 'decisions',
          type: 'Décision',
          title: item.subject,
          snippet: `${item.choice} - ${item.explanation}`
        });
      }
    });

    // 4. Search in Peppol Features
    peppolFeatures.forEach((item) => {
      if (
        item.title.toLowerCase().includes(q) ||
        item.details.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q)
      ) {
        results.push({
          id: `peppol-${item.code}`,
          projectId: 'visiofact',
          viewId: 'rapport',
          type: 'Peppol',
          title: `[${item.code}] ${item.title}`,
          snippet: item.details
        });
      }
    });

    // 5. Search in Stack Tools
    [...captureMindStack, ...visiofactStack].forEach((tool) => {
      if (
        tool.toolName.toLowerCase().includes(q) ||
        tool.role.toLowerCase().includes(q) ||
        tool.stepName.toLowerCase().includes(q)
      ) {
        results.push({
          id: `tool-${tool.stepNum}-${tool.toolName}`,
          projectId: tool.stepName.includes('Peppol') || tool.toolName.includes('phase4') ? 'visiofact' : 'capturemind',
          viewId: 'outils',
          type: 'Outil',
          title: `${tool.stepName} (${tool.toolName})`,
          snippet: tool.role
        });
      }
    });
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = results[selectedIndex];
      if (current) {
        onNavigate(current.projectId, current.viewId, current.subTabId);
        onClose();
      }
    }
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'Plan 30j':
        return <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />;
      case 'Audit':
        return <Layers className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'Décision':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'Peppol':
        return <Scale className="w-4 h-4 text-sky-500 shrink-0" />;
      case 'Outil':
        return <Boxes className="w-4 h-4 text-purple-500 shrink-0" />;
      case 'Projet':
        return <Briefcase className="w-4 h-4 text-indigo-500 shrink-0" />;
      default:
        return <Search className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Recherche rapide dans le hub"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Rechercher une tâche, audit, décision, outil, licence..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            aria-label="Champ de recherche"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 custom-scrollbar">
          {q.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-700 dark:text-slate-300 font-medium">
              Tapez au moins un mot pour rechercher parmi le plan 30 jours, les questions d'audit, les décisions d'architecture et les outils.
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-700 dark:text-slate-300 font-medium">
              Aucun résultat trouvé pour « <span className="font-bold text-slate-900 dark:text-white">{query}</span> ».
            </div>
          ) : (
            <ul className="space-y-1">
              {results.slice(0, 15).map((res, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <li key={res.id}>
                    <button
                      onClick={() => {
                        onNavigate(res.projectId, res.viewId, res.subTabId);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-left p-3 rounded-xl flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-950 dark:text-indigo-100 border border-indigo-300 dark:border-indigo-700'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="mt-0.5">{getResultIcon(res.type)}</div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs truncate text-slate-900 dark:text-white">
                              {res.title}
                            </span>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shrink-0">
                              {res.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-200 line-clamp-1 mt-0.5 leading-relaxed">
                            {res.snippet}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-600 dark:text-slate-300 shrink-0 mt-1" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer Shortcut Helper */}
        <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>Utilisez ↑ et ↓ pour naviguer</span>
          <span>Entrée pour sélectionner</span>
        </div>
      </div>
    </div>
  );
};
