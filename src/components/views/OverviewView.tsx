import React, { useState } from 'react';
import {
  Briefcase,
  Layers,
  ArrowRight,
  Plus,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Sparkles,
  Zap,
  Activity,
  User,
  Scale,
  FolderPlus,
  Check
} from 'lucide-react';
import { ProjectConfig, ProjectId } from '../../types/hub';
import { Badge } from '../common/Badge';
import { IconRenderer } from '../common/IconRenderer';

interface OverviewViewProps {
  projects: ProjectConfig[];
  onSelectProject: (projectId: ProjectId, viewId?: string) => void;
  onAddNewProject: (newProj: ProjectConfig) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  projects,
  onSelectProject,
  onAddNewProject
}) => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  
  // New project form state
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [version, setVersion] = useState('v1.0');
  const [lead, setLead] = useState('Jean Elson');
  const [direction, setDirection] = useState('Romain FRIDERICH');
  const [targetDeadline, setTargetDeadline] = useState('T1 2027');
  const [totalDays, setTotalDays] = useState('15 à 20 j.o.');
  const [accentColorChoice, setAccentColorChoice] = useState<'indigo' | 'emerald' | 'amber' | 'purple' | 'sky'>('sky');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shortName.trim()) return;

    const id = shortName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const colorMap = {
      indigo: {
        primary: 'indigo',
        light: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dark: 'bg-indigo-950/60 text-indigo-300 border-indigo-800',
        border: 'border-indigo-500',
        ring: 'focus-visible:ring-indigo-500',
        badgeBg: 'bg-indigo-100 dark:bg-indigo-950/70',
        badgeText: 'text-indigo-800 dark:text-indigo-200'
      },
      emerald: {
        primary: 'emerald',
        light: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dark: 'bg-emerald-950/60 text-emerald-300 border-emerald-800',
        border: 'border-emerald-500',
        ring: 'focus-visible:ring-emerald-500',
        badgeBg: 'bg-emerald-100 dark:bg-emerald-950/70',
        badgeText: 'text-emerald-800 dark:text-emerald-200'
      },
      amber: {
        primary: 'amber',
        light: 'bg-amber-50 text-amber-700 border-amber-200',
        dark: 'bg-amber-950/60 text-amber-300 border-amber-800',
        border: 'border-amber-500',
        ring: 'focus-visible:ring-amber-500',
        badgeBg: 'bg-amber-100 dark:bg-amber-950/70',
        badgeText: 'text-amber-800 dark:text-amber-200'
      },
      purple: {
        primary: 'purple',
        light: 'bg-purple-50 text-purple-700 border-purple-200',
        dark: 'bg-purple-950/60 text-purple-300 border-purple-800',
        border: 'border-purple-500',
        ring: 'focus-visible:ring-purple-500',
        badgeBg: 'bg-purple-100 dark:bg-purple-950/70',
        badgeText: 'text-purple-800 dark:text-purple-200'
      },
      sky: {
        primary: 'sky',
        light: 'bg-sky-50 text-sky-700 border-sky-200',
        dark: 'bg-sky-950/60 text-sky-300 border-sky-800',
        border: 'border-sky-500',
        ring: 'focus-visible:ring-sky-500',
        badgeBg: 'bg-sky-100 dark:bg-sky-950/70',
        badgeText: 'text-sky-800 dark:text-sky-200'
      }
    };

    const newProject: ProjectConfig = {
      id,
      name: name.trim(),
      shortName: shortName.trim(),
      subtitle: subtitle.trim() || 'Nouveau chantier technique Digipepss',
      version: version.trim() || 'v1.0',
      lead: lead.trim() || 'Jean Elson',
      direction: direction.trim() || 'Romain FRIDERICH',
      status: 'Nouveau Projet · En Cadrage',
      statusVariant: 'info',
      targetDeadline: targetDeadline.trim() || 'T1 2027',
      totalDays: totalDays.trim() || '15 j.o.',
      riskLevel: 'Faible',
      accentColor: colorMap[accentColorChoice],
      defaultViewId: 'planning',
      views: [
        {
          id: 'planning',
          label: 'Planning & Tâches',
          shortLabel: 'Planning',
          icon: 'Calendar',
          description: 'Calendrier des opérations et tâches clés',
          badge: 'À lancer'
        },
        {
          id: 'jalons',
          label: 'Jalons & Dépendances',
          shortLabel: 'Jalons',
          icon: 'CheckSquare',
          description: 'Livrables majeurs et conditions de recette',
          badge: 'Jalons'
        },
        {
          id: 'decisions',
          label: 'Cadrage & Arbitrages',
          shortLabel: 'Décisions',
          icon: 'ShieldCheck',
          description: 'Choix d\'architecture et validations techniques',
          badge: 'Décisions'
        }
      ]
    };

    onAddNewProject(newProject);
    setShowCreateModal(false);
    onSelectProject(newProject.id);
  };

  return (
    <div className="space-y-8">

      {/* 1. Hub Master Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
                <Briefcase className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block">
                  Digipepss Tech Hub · 2026-2027
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Vue d'Ensemble des Projets & Stratégies
                </h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed">
              Console de pilotage technique unifiée consolidant les chantiers <strong>CaptureMind HUB</strong> (traitement 100% en RAM), <strong>VISIOfact</strong> (point d'accès Peppol & DGFiP) et l'ensemble des orientations stratégiques Digipepss.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md hover:shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Nouveau Projet</span>
          </button>
        </div>

        {/* 4 Global Hub KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
              Projets Sous Pilotage
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums mt-0.5 block">
              {projects.length} Projets
            </span>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium block mt-0.5">
              Hub modulaire extensible
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
              Prochaine Recette Clé
            </span>
            <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300 tabular-nums mt-0.5 block">
              11 Déc. 2026
            </span>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium block mt-0.5">
              PV Recette J+30 CaptureMind
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
              Échéance Réglementaire
            </span>
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 tabular-nums mt-0.5 block">
              Janvier 2027
            </span>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium block mt-0.5">
              Dépôt Candidature PDP DGFiP
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
              Garantie Technique
            </span>
            <span className="text-2xl font-black text-amber-700 dark:text-amber-300 tabular-nums mt-0.5 block">
              0 Octet Disque
            </span>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium block mt-0.5">
              Stateless RAM io.BytesIO
            </span>
          </div>
        </div>
      </div>

      {/* 2. Projects Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Cartographie des Chantiers Techniques Digipepss
          </h2>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
            Accès direct par vue & composant
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-600 transition-all space-y-5"
            >
              {/* Card Top: Identity & Status */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-base ${proj.accentColor.badgeBg} ${proj.accentColor.badgeText} border border-slate-300 dark:border-slate-700 shadow-sm shrink-0`}
                    >
                      <IconRenderer name={proj.views[0]?.icon || 'Layers'} className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {proj.name}
                        </h3>
                        <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                          {proj.version}
                        </span>
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        Direction : {proj.direction} · Lead : {proj.lead}
                      </span>
                    </div>
                  </div>

                  <Badge
                    label={proj.status}
                    variant={(proj.statusVariant as any) || 'indigo'}
                    size="sm"
                  />
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  {proj.subtitle}
                </p>

                {/* Deadlines and total days pill badges */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Échéance : {proj.targetDeadline}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    <span>Charge : {proj.totalDays}</span>
                  </div>
                </div>
              </div>

              {/* Card Bottom: Available Views & CTA */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                    Vues disponibles dans ce projet :
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {proj.views.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => onSelectProject(proj.id, v.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                        title={v.description}
                      >
                        <IconRenderer name={v.icon} className="w-3 h-3 text-slate-500" />
                        <span>{v.shortLabel || v.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500 font-mono">
                    ID : {proj.id}
                  </span>

                  <button
                    onClick={() => onSelectProject(proj.id, proj.defaultViewId)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 shadow-sm transition-all flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <span>Accéder au Projet</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Modal: Ajouter un Nouveau Projet */}
      {showCreateModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Créer un nouveau projet"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Initialiser un Nouveau Projet Technique
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Alimenté automatiquement par le modèle générique réutilisable.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Fermer
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nom du Projet *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!shortName) setShortName(e.target.value.split(' ')[0]);
                    }}
                    placeholder="Ex : Moteur Facturation V4"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nom Court (Header / Onglets) *
                  </label>
                  <input
                    type="text"
                    required
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    placeholder="Ex : Facturation V4"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sous-titre / Enjeu technique
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Ex : Refonte du pipeline de conformité fiscale et archivage"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Version
                  </label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Échéance
                  </label>
                  <input
                    type="text"
                    value={targetDeadline}
                    onChange={(e) => setTargetDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Charge (j.o.)
                  </label>
                  <input
                    type="text"
                    value={totalDays}
                    onChange={(e) => setTotalDays(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Couleur
                  </label>
                  <select
                    value={accentColorChoice}
                    onChange={(e) => setAccentColorChoice(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="indigo">Indigo</option>
                    <option value="emerald">Émeraude</option>
                    <option value="amber">Ambre</option>
                    <option value="purple">Pourpre</option>
                    <option value="sky">Ciel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Lead Expert
                  </label>
                  <input
                    type="text"
                    value={lead}
                    onChange={(e) => setLead(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Direction
                  </label>
                  <input
                    type="text"
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md cursor-pointer"
                >
                  Créer et Ouvrir le Projet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
