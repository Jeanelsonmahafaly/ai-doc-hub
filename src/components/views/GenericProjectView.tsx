import React, { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  Sparkles,
  Activity,
  Plus,
  Trash2,
  Copy,
  Check,
  Code2,
  ChevronDown,
  Layers,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { ProjectConfig, DayPlanItem, MilestoneItem, DecisionItem } from '../../types/hub';
import { Badge, BadgeVariant } from '../common/Badge';

interface GenericProjectViewProps {
  project: ProjectConfig;
  activeViewId: string;
}

export const GenericProjectView: React.FC<GenericProjectViewProps> = ({
  project,
  activeViewId
}) => {
  // 1. KPIs State
  const defaultKpis = project.templateData?.kpis || [
    { label: 'Statut Cycle', value: 'Phase Cadrage', subtext: 'Spécification technique', variant: 'indigo' },
    { label: 'Charge Cible', value: project.totalDays || '15 à 20 j.o.', subtext: 'Calendrier estimé', variant: 'info' },
    { label: 'Échéance', value: project.targetDeadline || '2027', subtext: 'Objectif de livraison', variant: 'purple' },
    { label: 'Garantie Archi', value: '100% Stateless', subtext: 'Isolation mémoire RAM', variant: 'success' }
  ];

  // 2. Planning State
  const defaultPlanning: DayPlanItem[] = project.templateData?.planning || [
    {
      day: 1,
      date: 'J+1 (Démarrage)',
      week: 1,
      phase: 'Phase 1 : Cadrage & Architecture',
      phaseColor: 'indigo',
      title: 'Spécification fonctionnelle et analyse des flux',
      description: 'Identification des dépendances critiques et formalisation du modèle de données.',
      deliverable: 'Dossier de cadrage technique',
      owner: project.lead,
      status: 'En cours'
    },
    {
      day: 2,
      date: 'J+2',
      week: 1,
      phase: 'Phase 1 : Cadrage & Architecture',
      phaseColor: 'indigo',
      title: 'Validation des contrats d\'API et protocoles',
      description: 'Définition des schémas OpenAPI et interfaces de communication REST / JSON.',
      deliverable: 'Contrats API versionnés',
      owner: project.lead,
      status: 'À venir'
    },
    {
      day: 3,
      date: 'J+3',
      week: 1,
      phase: 'Phase 2 : Développement & Tests',
      phaseColor: 'sky',
      title: 'Implémentation du pipeline de calcul en mémoire',
      description: 'Développement du moteur principal avec libération déterministe des buffers.',
      deliverable: 'Composant fonctionnel unitaire',
      owner: project.lead,
      status: 'À venir'
    }
  ];

  const [planningItems, setPlanningItems] = useState<DayPlanItem[]>(defaultPlanning);
  const [selectedWeek, setSelectedWeek] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<DayPlanItem['status'] | 'Tous'>('Tous');

  // New task form state
  const [showAddTask, setShowAddTask] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDeliverable, setNewTaskDeliverable] = useState('');
  const [newTaskOwner, setNewTaskOwner] = useState(project.lead);

  // 3. Milestones State
  const defaultMilestones: MilestoneItem[] = project.templateData?.milestones || [
    {
      subject: 'Validation du Cadrage & Architecture Cible',
      estimation: '3 jours',
      priority: 'Priorité 1',
      priorityBadge: 'Cadrage',
      stepsAndDependencies: 'Accord formel de la direction sur les principes de conception et ressources allouées.',
      details: 'Livrable validé par Romain Friderich.'
    },
    {
      subject: 'Prototypage & Première Recette d\'Intégration',
      estimation: '7 jours',
      priority: 'Objectif Fixe',
      priorityBadge: 'Prototype',
      stepsAndDependencies: 'Mise en place de l\'environnement de test et benchmark sur jeu de données réel.',
      details: 'Mesure des performances et consommation mémoire.'
    },
    {
      subject: 'Mise en Production & Recette Finale',
      estimation: '5 jours',
      priority: 'Enchaînement',
      priorityBadge: 'Déploiement',
      stepsAndDependencies: 'Déploiement en conteneur sécurisé et signature du procès-verbal de conformité.',
      details: 'Intégration officielle au catalogue Digipepss.'
    }
  ];

  const [milestonesList, setMilestonesList] = useState<MilestoneItem[]>(defaultMilestones);
  const [showAddMilestone, setShowAddMilestone] = useState<boolean>(false);
  const [newMilestoneSubject, setNewMilestoneSubject] = useState('');
  const [newMilestoneEstimation, setNewMilestoneEstimation] = useState('');
  const [newMilestoneSteps, setNewMilestoneSteps] = useState('');

  // 4. Decisions State
  const defaultDecisions: DecisionItem[] = project.templateData?.decisions || [
    {
      id: 1,
      subject: 'Choix de l\'architecture et isolation des responsabilités',
      status: 'Confirmé',
      choice: 'Microservices découplés avec API REST et contrats stricts',
      explanation: 'Évite tout couplage fort avec les systèmes existants et autorise des déploiements autonomes.'
    },
    {
      id: 2,
      subject: 'Politique de persistance et conformité RGPD',
      status: 'Confirmé',
      choice: 'Traitement 100% en RAM volatile sans écriture résiduelle',
      explanation: 'Garantit l\'absence de fuite de données confidentielles sur les serveurs d\'infrastructure.'
    },
    {
      id: 3,
      subject: 'Choix des bibliothèques logicielles',
      status: 'Hypothèse à tester',
      choice: 'Licences hautement permissives exclusivement (Apache 2.0 / BSD / MIT)',
      explanation: 'Exclusion stricte des licences contaminantes GNU AGPL afin de protéger le code propriétaire.'
    }
  ];

  const [decisionsList, setDecisionsList] = useState<DecisionItem[]>(defaultDecisions);
  const [showAddDecision, setShowAddDecision] = useState<boolean>(false);
  const [newDecisionSubject, setNewDecisionSubject] = useState('');
  const [newDecisionChoice, setNewDecisionChoice] = useState('');
  const [newDecisionExplanation, setNewDecisionExplanation] = useState('');

  // Copy helpers
  const [copiedData, setCopiedData] = useState<boolean>(false);

  const copyProjectJson = () => {
    const payload = {
      project: {
        id: project.id,
        name: project.name,
        lead: project.lead,
        direction: project.direction,
        status: project.status,
        deadline: project.targetDeadline
      },
      kpis: defaultKpis,
      planning: planningItems,
      milestones: milestonesList,
      decisions: decisionsList
    };

    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2000);
  };

  // Add handlers
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const nextDay = planningItems.length + 1;
    const item: DayPlanItem = {
      day: nextDay,
      date: `J+${nextDay}`,
      week: Math.ceil(nextDay / 5),
      phase: `Phase ${Math.ceil(nextDay / 5)}`,
      phaseColor: 'indigo',
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || 'Tâche planifiée pour ce projet.',
      deliverable: newTaskDeliverable.trim() || 'Livrable à définir',
      owner: newTaskOwner || project.lead,
      status: 'À venir'
    };

    setPlanningItems((prev) => [...prev, item]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskDeliverable('');
    setShowAddTask(false);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneSubject.trim()) return;

    const milestone: MilestoneItem = {
      subject: newMilestoneSubject.trim(),
      estimation: newMilestoneEstimation.trim() || '3 jours',
      priority: 'Priorité 1',
      priorityBadge: 'Jalon Clé',
      stepsAndDependencies: newMilestoneSteps.trim() || 'Étapes à formaliser.',
      details: 'Spécifié dans le template projet.'
    };

    setMilestonesList((prev) => [...prev, milestone]);
    setNewMilestoneSubject('');
    setNewMilestoneEstimation('');
    setNewMilestoneSteps('');
    setShowAddMilestone(false);
  };

  const handleAddDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDecisionSubject.trim()) return;

    const decision: DecisionItem = {
      id: decisionsList.length + 1,
      subject: newDecisionSubject.trim(),
      status: 'Confirmé',
      choice: newDecisionChoice.trim() || 'Option validée',
      explanation: newDecisionExplanation.trim() || 'Arbitrage documenté dans le hub.'
    };

    setDecisionsList((prev) => [...prev, decision]);
    setNewDecisionSubject('');
    setNewDecisionChoice('');
    setNewDecisionExplanation('');
    setShowAddDecision(false);
  };

  const updateTaskStatus = (day: number, status: DayPlanItem['status']) => {
    setPlanningItems((prev) =>
      prev.map((t) => (t.day === day ? { ...t, status } : t))
    );
  };

  return (
    <div className="space-y-6">

      {/* Global Actions Toolbar */}
      <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Modèle de Projet Évolutif & Réutilisable
          </span>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            {project.id}
          </span>
        </div>

        <button
          onClick={copyProjectJson}
          className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          {copiedData ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedData ? 'Export Copié !' : 'Exporter Modèle (JSON)'}</span>
        </button>
      </div>

      {/* 4 KPIs Dashboard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {defaultKpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
              {kpi.label}
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums block">
              {kpi.value}
            </span>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium block">
              {kpi.subtext}
            </span>
          </div>
        ))}
      </div>

      {/* ======================================================== */}
      {/* ============ SECTION 1 : PLANNING DU PROJET ============ */}
      {/* ======================================================== */}
      <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Planning Opérationnel & Feuille de Route
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Calendrier modulaire des actions techniques et jalons jour par jour.
            </p>
          </div>

          <button
            onClick={() => setShowAddTask((prev) => !prev)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Tâche</span>
          </button>
        </div>

        {/* Add Task Form Modal / Collapse */}
        {showAddTask && (
          <form
            onSubmit={handleAddTask}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-800 space-y-3 animate-in fade-in duration-150"
          >
            <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
              <span>Nouvelle tâche au planning :</span>
              <button
                type="button"
                onClick={() => setShowAddTask(false)}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Annuler
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Intitulé de la tâche *
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Ex : Rédaction contrat API FastAPI"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Livrable attendu *
                </label>
                <input
                  type="text"
                  required
                  value={newTaskDeliverable}
                  onChange={(e) => setNewTaskDeliverable(e.target.value)}
                  placeholder="Ex : Fichier specification.json"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Description / Objectif technique
              </label>
              <textarea
                rows={2}
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                placeholder="Détails, critères de réussite et dépendances..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer shadow-sm"
              >
                Enregistrer la tâche
              </button>
            </div>
          </form>
        )}

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-200">Statut :</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold cursor-pointer"
              >
                <option value="Tous">Tous les statuts</option>
                <option value="Terminé">Terminé</option>
                <option value="En cours">En cours</option>
                <option value="Priorité Immédiate">Priorité Immédiate</option>
                <option value="Bloquant">Bloquant</option>
                <option value="À venir">À venir</option>
              </select>
            </div>
          </div>

          <span className="font-bold text-slate-600 dark:text-slate-300">
            {planningItems.filter((i) => selectedStatus === 'Tous' || i.status === selectedStatus).length} tâche(s) affichée(s)
          </span>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {planningItems
            .filter((item) => selectedStatus === 'Tous' || item.status === selectedStatus)
            .map((item) => (
              <div
                key={item.day}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="font-mono font-bold text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                      J{item.day} · {item.date}
                    </span>

                    {/* Status selector */}
                    <div className="relative">
                      <select
                        value={item.status}
                        onChange={(e) => updateTaskStatus(item.day, e.target.value as any)}
                        className="text-xs font-bold px-2 py-0.5 rounded border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600 cursor-pointer"
                      >
                        <option value="À venir">À VENIR</option>
                        <option value="En cours">EN COURS</option>
                        <option value="Priorité Immédiate">PRIORITÉ</option>
                        <option value="Bloquant">BLOQUANT</option>
                        <option value="Terminé">TERMINÉ</option>
                      </select>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Livrable : </span>
                    <span className="font-mono text-slate-900 dark:text-white font-semibold">{item.deliverable}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Responsable : </span>
                    <span className="text-slate-900 dark:text-white font-semibold">{item.owner}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* ============ SECTION 2 : JALONS CLÉS =================== */}
      {/* ======================================================== */}
      <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Jalons Clés & Dépendances Critiques
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Grands jalons d'avancement et conditions de livraison.
            </p>
          </div>

          <button
            onClick={() => setShowAddMilestone((prev) => !prev)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un Jalon</span>
          </button>
        </div>

        {/* Add Milestone Form */}
        {showAddMilestone && (
          <form
            onSubmit={handleAddMilestone}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-800 space-y-3"
          >
            <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
              <span>Nouveau jalon structurant :</span>
              <button
                type="button"
                onClick={() => setShowAddMilestone(false)}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Annuler
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Intitulé du Jalon *
                </label>
                <input
                  type="text"
                  required
                  value={newMilestoneSubject}
                  onChange={(e) => setNewMilestoneSubject(e.target.value)}
                  placeholder="Ex : Homologation DGFiP"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Estimation / Échéance *
                </label>
                <input
                  type="text"
                  required
                  value={newMilestoneEstimation}
                  onChange={(e) => setNewMilestoneEstimation(e.target.value)}
                  placeholder="Ex : 5 jours ouvrés"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Principales étapes & dépendances
              </label>
              <textarea
                rows={2}
                value={newMilestoneSteps}
                onChange={(e) => setNewMilestoneSteps(e.target.value)}
                placeholder="Conditions préalables et livrables associés..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer shadow-sm"
              >
                Enregistrer le Jalon
              </button>
            </div>
          </form>
        )}

        {/* Milestones Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 font-bold">
              <tr>
                <th className="py-3 px-4">Jalon</th>
                <th className="py-3 px-4">Échéance</th>
                <th className="py-3 px-4">Priorité</th>
                <th className="py-3 px-4">Étapes & Livrables</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {milestonesList.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{m.subject}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700 dark:text-indigo-400">{m.estimation}</td>
                  <td className="py-3.5 px-4">
                    <Badge label={m.priorityBadge || m.priority} variant="info" size="sm" />
                  </td>
                  <td className="py-3.5 px-4 max-w-md">
                    <div>{m.stepsAndDependencies}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">{m.details}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================== */}
      {/* ============ SECTION 3 : DÉCISIONS TECHNIQUES ========== */}
      {/* ======================================================== */}
      <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Registre des Arbitrages & Décisions d'Architecture
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Historique opposable des choix structurants, justifications techniques et licences.
            </p>
          </div>

          <button
            onClick={() => setShowAddDecision((prev) => !prev)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Décision</span>
          </button>
        </div>

        {/* Add Decision Form */}
        {showAddDecision && (
          <form
            onSubmit={handleAddDecision}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-purple-200 dark:border-purple-800 space-y-3"
          >
            <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
              <span>Nouvel arbitrage technique :</span>
              <button
                type="button"
                onClick={() => setShowAddDecision(false)}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Annuler
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sujet d'arbitrage *
                </label>
                <input
                  type="text"
                  required
                  value={newDecisionSubject}
                  onChange={(e) => setNewDecisionSubject(e.target.value)}
                  placeholder="Ex : Choix du moteur OCR"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Option retenue *
                </label>
                <input
                  type="text"
                  required
                  value={newDecisionChoice}
                  onChange={(e) => setNewDecisionChoice(e.target.value)}
                  placeholder="Ex : pypdfium2 (Licence Apache 2.0)"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Justification & Rationale
              </label>
              <textarea
                rows={2}
                value={newDecisionExplanation}
                onChange={(e) => setNewDecisionExplanation(e.target.value)}
                placeholder="Pourquoi cette solution a été retenue plutôt qu'une autre..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer shadow-sm"
              >
                Enregistrer la Décision
              </button>
            </div>
          </form>
        )}

        {/* Decisions Cards */}
        <div className="space-y-3">
          {decisionsList.map((d) => (
            <div
              key={d.id}
              className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-purple-500 space-y-1.5 shadow-sm"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="h-6 w-6 rounded-md bg-purple-600 text-white flex items-center justify-center font-mono font-bold">
                    {d.id}
                  </span>
                  {d.subject}
                </span>
                <Badge
                  label={d.status}
                  variant={d.status === 'Confirmé' ? 'success' : 'warning'}
                  size="sm"
                />
              </div>

              <div className="text-xs text-indigo-700 dark:text-indigo-300 font-mono font-bold pt-1">
                → Choix validé : {d.choice}
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                {d.explanation}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
