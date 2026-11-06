import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Calendar,
  Code2,
  Workflow,
  CheckSquare,
  Copy,
  Check,
  ChevronDown,
  FileCheck2,
  Server,
  Activity,
  Play,
  RotateCcw,
  ShieldCheck,
  Boxes,
  Mail,
  Send,
  Sparkles,
  FileText,
  HelpCircle,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  DayPlanItem,
  InvoicePreset,
  RecetteItem
} from '../../types/hub';
import {
  full30DaysPlan,
  auditQuestionsList,
  captureMindDecisions,
  invoicePresets,
  captureMindStack,
  initialRecetteChecklist,
  messageToInfra,
  messageToMFlore,
  emailAgentIaToFriderich,
  targetedEmailToFriderich,
  officialValidatedEmailToFriderich,
  shortEmailToFriderich,
  officialEmailToFriderich
} from '../../data/hubData';
import { Badge } from '../common/Badge';
import { CodeBlock } from '../common/CodeBlock';

interface CaptureMindViewProps {
  activeViewId: string;
  activeSubTabId?: string;
  onSubTabChange?: (subTabId: string) => void;
}

export const CaptureMindView: React.FC<CaptureMindViewProps> = ({
  activeViewId,
  activeSubTabId,
  onSubTabChange
}) => {
  // Sub-tabs for Conception
  const [internalSubTab, setInternalSubTab] = useState<'objectifs-contexte' | 'planning-30j' | 'archi-microservices' | 'contrats-api' | 'matrice-flux' | 'recette-j30'>(
    (activeSubTabId as any) || 'objectifs-contexte'
  );

  const currentSubTab = activeSubTabId || internalSubTab;

  const handleSubTabChange = (tab: 'objectifs-contexte' | 'planning-30j' | 'archi-microservices' | 'contrats-api' | 'matrice-flux' | 'recette-j30') => {
    setInternalSubTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  // Planning 30j state
  const [planItems, setPlanItems] = useState<DayPlanItem[]>(full30DaysPlan);
  const [selectedPlanWeek, setSelectedPlanWeek] = useState<number>(0);
  const [selectedPlanStatus, setSelectedPlanStatus] = useState<DayPlanItem['status'] | 'Tous'>('Tous');
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [copiedPlan, setCopiedPlan] = useState<boolean>(false);

  // Recette J+30 state
  const [recetteChecklist, setRecetteChecklist] = useState<RecetteItem[]>(initialRecetteChecklist);
  const [copiedPv, setCopiedPv] = useState<boolean>(false);

  // Audit state
  const [selectedAuditAxe, setSelectedAuditAxe] = useState<number>(0);
  const [copiedAudit, setCopiedAudit] = useState<boolean>(false);
  const [auditNotes, setAuditNotes] = useState<Record<string, string>>({
    'Q1.1': 'Confirmé dans AGENTS.md : backend psycopg3, Database.py, VisioCompte.py (REST), verifier_exports.py (XML/JSON), controllers/accounts.py.',
    'Q1.2': 'Extraction actuelle 100% CPU via pytesseract (Tesseract). Aucun GPU. Remplacement acté par pypdfium2 (parsing PDF en RAM) et modèles permissifs.',
    'Q1.3': 'À valider : FERnest pousse-t-il directement en POST multipart ou CaptureMind scrute-t-il un dossier surveillé ?',
    'Q2.1': 'PostgreSQL (psycopg 3, dict_row) : documents (JSONB positions/pages/datas), accounts_supplier, accounts_customer, accounting_plan, history.',
    'Q2.2': 'Stockage fichiers sur filesystem /var/docservers sur Hetzner. VUL-001 confirmé : occupation disque critique à ~97% ! La cible 100% RAM résout ce blocage.',
    'Q2.3': 'Conserver PostgreSQL uniquement pour les tables légères de référentiel (comptes et tiers), sans stocker de fichiers physiques sur disque.',
    'Q3.1': 'HTTP REST via urllib3.PoolManager (VisioCompte.py), auth login/password, upload multipart/form-data. URL : https://visiocompte.pro.',
    'Q3.2': 'XML export principal via export_xml() (<ROOT><TECHNICAL> + <DATAS> : champs, taxes, lignes) + JSON via API VisioCompte.',
    'Q3.3': 'Non implémentée dans le code : splitter_exports.py::export_batch_to_visiocompte() est mort/cassé. Le flux actuel est 100% unidirectionnel.',
    'Q4.1': 'Modèle relationnel PostgreSQL existant (accounting_plan, accounts_supplier). Prise de contact avec M. Flore pour export SQL ou JSON/CSV.',
    'Q4.2': 'SQL LIKE sur siren et LOWER(name) LIKE \'%search%\' dans controllers/accounts.py (lignes 47, 80, 127). Pas de Levenshtein (à ajouter dans le HUB).',
    'Q5.1': 'Le code OpenCapture actuel n’a pas de référence GPU (100% CPU pytesseract). Banc d’essai LexIA (RTX 4000 Ada - 20 Go) à interfacer.',
    'Q5.2': 'Stocké sous opencapture/docs/docservers/ et /var/docservers sur Hetzner. Échantillon de 100 factures à extraire.',
    'Q5.3': 'Contrat clé validé : datas = { datas, positions, pages } (valeur + coordonnées spatiales + numéro de page). Socle à préserver pour l’agent IA.',
    'Q5.4': 'Recommandation : micro-service d’inférence vLLM ou conteneur FastAPI GPU dédié sur le serveur partagé LexIA avec Alphonse.'
  });

  // Simulator RAM state
  const [selectedPreset, setSelectedPreset] = useState<InvoicePreset>(invoicePresets[0]);
  const [cmStep, setCmStep] = useState<number>(0);
  const [isCmSimulating, setIsCmSimulating] = useState<boolean>(false);
  const [cmLogs, setCmLogs] = useState<string[]>([]);
  const [ramChartMode, setRamChartMode] = useState<'live' | 'batch5'>('live');

  // Email Correspondence state
  const [emailVersion, setEmailVersion] = useState<'msg-infra' | 'msg-flore' | 'agent-ia' | 'targeted' | 'official' | 'short' | 'detailed'>('msg-infra');
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  // Status update in Plan 30j
  const updatePlanStatus = (day: number, newStatus: DayPlanItem['status']) => {
    setPlanItems((prev) => prev.map((item) => (item.day === day ? { ...item, status: newStatus } : item)));
  };

  // Toggle recette item
  const toggleRecetteCheck = (id: string) => {
    setRecetteChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  // Copy helpers
  const copyFullPlan = () => {
    const textToCopy = `PLAN DE TRAVAIL DÉTAILLÉ JOUR PAR JOUR — CAPTUREMIND HUB (25 À 30 JOURS OUVRÉS)
Dates : Du 02/11/2026 (J1) au 11/12/2026 (J30 - Recette Finale)
Lead Développeur : Jean Elson | Direction : Romain Friderich | Partenaires : M. Flore, Alphonse

${full30DaysPlan.map((item) => `[JOUR ${item.day} • ${item.date} • ${item.phase}] (Semaine ${item.week})
Titre : ${item.title}
Objectif : ${item.description}
Livrable : ${item.deliverable}
Responsable : ${item.owner} | Statut : ${item.status}
`).join('\n')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2500);
  };

  const copyPlanJson = () => {
    const jsonStr = JSON.stringify(planItems, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2500);
  };

  const copyPvRecette = () => {
    const text = `PROCES-VERBAL DE RECETTE FINALE J+30 — CAPTUREMIND HUB
Date de recette : 11 Décembre 2026 | Statut : VALIDÉ SANS RÉSERVE
Direction Générale : Romain Friderich | Lead Développeur : Jean Elson
Partenaires Techniques : M. Flore (FERnest), Alphonse (LexIA GPU), Équipe Infra (Hetzner)

=== CRITÈRES DE RECETTE VÉRIFIÉS & APPROUVÉS ===
${recetteChecklist.map((r, i) => `${i + 1}. [${r.checked ? 'X - VALIDÉ' : 'EN ATTENTE'}] ${r.title}
   - Responsable : ${r.responsible} (Échéance : ${r.dateTarget})
   - Objectif : ${r.description}
   - Preuve technique : ${r.technicalValidation}
`).join('\n')}

=== ATTESTATION DE CONFORMITÉ STATELESS RAM ===
Le soussigné Jean Elson certifie que le service CaptureMind HUB opère 100% en mémoire vive volatile (io.BytesIO).
Aucun fichier PDF ni données documentaires ne sont stockés de manière permanente sur les disques Hetzner (/tmp, /var/tmp, /var/docservers = 0 octet résiduel).
La vulnérabilité VUL-001 (saturation disque 97%) est définitivement résolue.
L'unique coffre-fort documentaire et archive légale reste FERnest (visiocompte.pro).

Signatures :
Pour Digilium / Digipepss (Lead Développeur) : Jean Elson [Validé le 11/12/2026]
Pour la Direction (Directeur) : Romain Friderich [Approuvé le 11/12/2026]`;

    navigator.clipboard.writeText(text);
    setCopiedPv(true);
    setTimeout(() => setCopiedPv(false), 2500);
  };

  const copyAuditQuestions = () => {
    const textToCopy = `QUESTIONNAIRE D'AUDIT TECHNIQUE PRÉALABLE — CAPTUREMIND EXISTANT
Document de cadrage pour la refonte du HUB 100% RAM et le plan de développement (25-30 jours ouvrés)

${auditQuestionsList.map((q) => `[${q.id}] (${q.axeTitle})
Question : ${q.question}
Enjeu : ${q.whyCrucial}
Contact clé : ${q.targetContact}
État : ${q.status}
Clarification / Note : ${auditNotes[q.id] || q.clarification}
`).join('\n')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedAudit(true);
    setTimeout(() => setCopiedAudit(false), 2500);
  };

  // Run live RAM simulation
  const runCaptureMindSim = () => {
    setIsCmSimulating(true);
    setCmStep(1);
    setCmLogs([
      `[Transit RAM] Réception du document « ${selectedPreset.fileName} » (${selectedPreset.fileSizeKB} Ko) depuis la GED FERnest.`,
      `[Bibliothèque active] FastAPI + io.BytesIO : Allocation mémoire volatile sans écriture disque (Disque = 0 octet).`
    ]);

    setTimeout(() => {
      setCmStep(2);
      setCmLogs((prev) => [
        selectedPreset.type === 'Factur-X'
          ? `[Aiguillage] Factur-X détectée : Extraction directe XML natif UBL/CII via pypdfium2 sans GPU.`
          : `[Aiguillage] Document scanné : Tramage bitmap en mémoire via pypdfium2 (remplacement PyMuPDF Apache 2.0).`,
        `[Contrôles] Vérification de l'intégrité numérique et format des zones texte.`,
        ...prev
      ]);
    }, 1200);

    setTimeout(() => {
      setCmStep(3);
      setCmLogs((prev) => [
        `[Inférence & Tiers] Modèle IA : ${selectedPreset.type === 'Factur-X' ? 'Parser Factur-X' : 'Inférence GPU sur serveur LexIA avec Alphonse'}.`,
        `[Matching Tiers] Rapprochement SIREN ${selectedPreset.siren} avec la bibliothèque Tiers CaptureMind.`,
        `[Tiers Résolu] Fournisseur identifié : « ${selectedPreset.supplier} ».`,
        `[Modèles Comptables] Application de la règle d'imputation dossier : Compte de charge ${selectedPreset.suggestedAccount}.`,
        ...prev
      ]);
    }, 2400);

    setTimeout(() => {
      setCmStep(4);
      setCmLogs((prev) => [
        `[Équilibrage] Construction des lignes d'écritures : Débit = ${selectedPreset.amountTTC.toFixed(2)} € | Crédit = ${selectedPreset.amountTTC.toFixed(2)} € (Équilibre strict).`,
        `[Contrôle Arithmétique] HT (${selectedPreset.amountHT.toFixed(2)} €) + TVA ${selectedPreset.vatRate}% (${(selectedPreset.amountTTC - selectedPreset.amountHT).toFixed(2)} €) = TTC (${selectedPreset.amountTTC.toFixed(2)} €) -> Validé à 100%.`,
        ...prev
      ]);
    }, 3600);

    setTimeout(() => {
      setCmStep(5);
      setIsCmSimulating(false);
      setCmLogs((prev) => [
        `[Retour JSON FERnest] Écritures et métadonnées transmises à FERnest pour validation du comptable (Job ID: CM-2026-9812).`,
        `[Purge RAM Déterministe] Libération immédiate des buffers mémoire io.BytesIO et caches via gc.collect().`,
        `[État Final] RAM libérée : 0 Ko | VRAM GPU : 0 Mo | Données résiduelles : 0 octet. Garantie respectée.`,
        ...prev
      ]);
    }, 5000);
  };

  const resetCaptureMindSim = () => {
    setCmStep(0);
    setIsCmSimulating(false);
    setCmLogs([]);
  };

  // Email texts
  const currentEmailText =
    emailVersion === 'msg-infra'
      ? messageToInfra
      : emailVersion === 'msg-flore'
      ? messageToMFlore
      : emailVersion === 'agent-ia'
      ? emailAgentIaToFriderich
      : emailVersion === 'targeted'
      ? targetedEmailToFriderich
      : emailVersion === 'official'
      ? officialValidatedEmailToFriderich
      : emailVersion === 'short'
      ? shortEmailToFriderich
      : officialEmailToFriderich;

  const currentEmailSubject =
    emailVersion === 'msg-infra'
      ? 'Hetzner — Extraction corpus 100 factures & Purge préventive disque (CaptureMind HUB)'
      : emailVersion === 'msg-flore'
      ? 'FERnest — Référentiels comptables & 3 à 5 exemples XML (CaptureMind HUB)'
      : emailVersion === 'agent-ia'
      ? 'Re: Intégration future d’un Agent IA dans CaptureMind & Anticipation Technique'
      : emailVersion === 'targeted'
      ? 'Re: Précisions Planning, Architecture Peppol AS4 et Maintien B2Brouter'
      : emailVersion === 'official'
      ? 'Re: Accord Architecture CaptureMind, Planning Peppol & Maintien B2Brouter'
      : emailVersion === 'short'
      ? 'Re: Validation CaptureMind & Coordination Facturation Électronique'
      : 'Re: Clarifications – CaptureMind, Planning et Architecture Peppol AS4';

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(currentEmailText);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-6">

      {/* Project Context & Operational Brief Summary Card */}
      <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 space-y-3 text-xs">
        <div className="flex items-start gap-3.5">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Projet CaptureMind HUB · Résolution VUL-001 & Banc d'Essai LexIA GPU (J5 en cours)
              </span>
              <Badge label="Priorité #1 · 25–30 j.o." variant="indigo" size="sm" />
              <Badge label="J5 : Serveur LexIA & PaddleOCR/Qwen" variant="warning" size="sm" />
              <Badge label="Zéro Stockage Disque" variant="success" size="sm" />
            </div>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
              <strong>Problème résolu :</strong> OpenCapture écrivait les factures sur le disque Hetzner (<code className="font-mono text-indigo-700 dark:text-indigo-300">/var/docservers</code> saturé à ~97%). 
              <strong>Solution :</strong> CaptureMind HUB, hub de transit 100% en RAM volatile (<code className="font-mono text-indigo-700 dark:text-indigo-300">io.BytesIO</code>, 0 octet persisté). FERnest reste la GED officielle.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-indigo-200 dark:border-indigo-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
          <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-900">
            <span className="font-bold text-indigo-900 dark:text-indigo-300 block">J1 à J4 (Terminés) :</span>
            <span className="text-slate-700 dark:text-slate-200">Audit codebase, arbitrage orientations, extraction du corpus 100 factures, et envoi des messages à M. Flore.</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-900">
            <span className="font-bold text-indigo-900 dark:text-indigo-300 block">J5 Actuel (En cours) :</span>
            <span className="text-slate-700 dark:text-slate-200">Serveur LexIA (RTX 4000 Ada, 20 Go VRAM) configuré avec PaddleOCR et Qwen. Micro-service d'inférence en cours de test.</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-900">
            <span className="font-bold text-indigo-900 dark:text-indigo-300 block">Banc d'Essai 100 Factures :</span>
            <span className="text-slate-700 dark:text-slate-200">Évaluation des 3 approches (Multimodal, OCR+LLM, Hybride) : &lt;5s / facture, &gt;90% exactitude, 0 erreur.</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ============ VUE 1 : CONCEPTION & FEUILLE DE ROUTE ====== */}
      {/* ======================================================== */}
      {activeViewId === 'conception' && (
        <div className="space-y-6">
          
          {/* Sub-navigation bar (Unified single row, high contrast active state) */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 overflow-x-auto custom-scrollbar">
            <button
              onClick={() => handleSubTabChange('objectifs-contexte')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                currentSubTab === 'objectifs-contexte'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700'
              }`}
            >
              <Target className="w-4 h-4 text-indigo-400 dark:text-indigo-600" />
              <span>Objectifs & VUL-001</span>
            </button>

            <button
              onClick={() => handleSubTabChange('planning-30j')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                currentSubTab === 'planning-30j'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700'
              }`}
            >
              <Calendar className="w-4 h-4 text-indigo-400 dark:text-indigo-600" />
              <span>Planning 30j</span>
            </button>

            <button
              onClick={() => handleSubTabChange('archi-microservices')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                currentSubTab === 'archi-microservices'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700'
              }`}
            >
              <Cpu className="w-4 h-4 text-sky-400 dark:text-sky-600" />
              <span>Architecture</span>
            </button>

            <button
              onClick={() => handleSubTabChange('contrats-api')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                currentSubTab === 'contrats-api'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700'
              }`}
            >
              <Code2 className="w-4 h-4 text-purple-400 dark:text-purple-600" />
              <span>Contrats API</span>
            </button>

            <button
              onClick={() => handleSubTabChange('matrice-flux')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                currentSubTab === 'matrice-flux'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700'
              }`}
            >
              <Workflow className="w-4 h-4 text-amber-400 dark:text-amber-600" />
              <span>Matrice Rôles</span>
            </button>

            <button
              onClick={() => handleSubTabChange('recette-j30')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                currentSubTab === 'recette-j30'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              <span>Recette J+30</span>
            </button>
          </div>

          {/* SUB-TAB 0 : OBJECTIFS & CONTEXTE VUL-001 */}
          {currentSubTab === 'objectifs-contexte' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      Objectifs Stratégiques, Résolution VUL-001 & Briefing Technique
                    </h1>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Cahier des charges complet, banc d'essai LexIA GPU et questions d'architecture (J5).
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const text = `PROBLÈME : OpenCapture écrit les factures sur disque, et le disque de Hetzner (/var/docservers) est saturé à 97 % (VUL-001).
SOLUTION : CaptureMind HUB, un hub de transit 100 % en RAM, zéro octet persisté. FERnest reste la GED et la source officielle ; CaptureMind analyse, prépare les écritures comptables et libère la mémoire dès validation.
CE QU’ON CONSTRUIT MAINTENANT : le micro-service d’IA documentaire (FastAPI) sur le GPU partagé LexIA (RTX 4000 Ada, 20 Go), qui lit les factures (PDF ou images) et renvoie un JSON.
LE BANC D’ESSAI : 100 factures réelles (30 Factur-X natifs, 40 scans, 30 complexes) pour choisir entre trois approches (multimodal, OCR puis LLM, hybride). Objectifs : moins de 5 s par facture, plus de 90 % d’exactitude, moins de 20 Go de VRAM, 0 erreur.
ENSUITE : sortie au contrat du HUB, rapprochement des tiers (SIREN, Levenshtein) avec les règles de M. Flore, imputation 60x/70x, XML historique pour FERnest, puis la phase 2 (agent IA, Alphonse).
EN PARALLÈLE : VISIOfact (B2Brouter en production, accès Peppol natif en 25-30 jours, dossier DGFiP en janvier 2027).
OBJECTIF RÉCENT : Traiter beaucoup de factures en parallèle, avec des résultats enrichis (aiguillage Factur-X, traitement par lots [vLLM], enrichissement côté HUB).
HYPOTHÈSES : 1. Le contrat de sortie attendu est celui du hub (status, datas, scores, anomalies). 2. Transit réseau chiffré et sans stockage vers LexIA à valider ISO 27001. 3. Le choix du moteur se fait sur les chiffres de LexIA.
QUESTION CLÉ : Quel volume faut-il tenir en production (factures par jour, et par heure de pointe) ?`;
                      navigator.clipboard.writeText(text);
                      alert('Briefing copié dans le presse-papier !');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <Copy className="w-4 h-4 text-white" />
                    <span>Copier ce Briefing</span>
                  </button>
                </div>

                {/* Comprehensive User Briefing Box */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-4 border border-slate-800 shadow-inner leading-relaxed">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-bold text-emerald-400 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      CADRAGE & CAHIER DES CHARGES OPÉRATEUR (CAPTUREMIND HUB & VISIOFACT)
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">Statut : J5 Actuel</span>
                  </div>

                  <div className="text-slate-200 text-xs font-mono leading-relaxed whitespace-pre-wrap p-4 rounded-xl bg-slate-800/90 border border-slate-700/80">
Problème : OpenCapture écrit les factures sur disque, et le disque de Hetzner (/var/docservers) est saturé à 97 % (VUL-001).
Solution : CaptureMind HUB, un hub de transit 100 % en RAM, zéro octet persisté. FERnest reste la GED et la source officielle ; CaptureMind analyse, prépare les écritures comptables et libère la mémoire dès validation.
Ce qu’on construit maintenant : le micro-service d’IA documentaire (FastAPI) sur le GPU partagé LexIA (RTX 4000 Ada, 20 Go), qui lit les factures (PDF ou images) et renvoie un JSON.
Le banc d’essai : 100 factures réelles (30 Factur-X natifs, 40 scans, 30 complexes) pour choisir entre trois approches (multimodal, OCR puis LLM, hybride). Objectifs : moins de 5 s par facture, plus de 90 % d’exactitude, moins de 20 Go de VRAM, 0 erreur.
Ensuite : sortie au contrat du HUB, rapprochement des tiers (SIREN, Levenshtein) avec les règles de M. Flore, imputation 60x/70x, XML historique pour FERnest, puis la phase 2 (agent IA, Alphonse).
En parallèle : VISIOfact (B2Brouter en production, accès Peppol natif en 25-30 jours, dossier DGFiP en janvier 2027).

Votre objectif plus récent
Traiter beaucoup de factures en parallèle, avec des résultats enrichis. D’où mes propositions : aiguillage Factur-X, traitement par lots (vLLM), enrichissement côté HUB.

Ce que je suppose sans en être sûr
Le contrat de sortie attendu est celui du hub (status, datas, scores, anomalies), pas notre JSON plat actuel.
Les factures partent de Hetzner vers LexIA (serveur partagé) : cela suppose un transit réseau chiffré et sans stockage, à valider côté ISO 27001.
Le choix du moteur se fait sur les chiffres de LexIA, pas sur les tests locaux.

La question qui change le plus l’architecture : quel volume faut-il tenir en production (factures par jour, et par heure de pointe) ? Sans ce chiffre, je ne peux pas dire si un traitement séquentiel suffit ou s’il faut le parallèle avec vLLM.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                  {/* Problem & Solution */}
                  <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                    <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                      Problème (VUL-001) & Solution Cible
                    </h2>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                      <strong>Problème :</strong> OpenCapture écrivait les factures sur le système de fichiers, entraînant une saturation critique du disque Hetzner (<code className="font-mono text-rose-700 dark:text-rose-300">/var/docservers</code> à ~97%).
                    </p>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                      <strong>Solution :</strong> <strong>CaptureMind HUB</strong>, un hub de transit 100 % en mémoire vive volatile (<code className="font-mono text-emerald-700 dark:text-emerald-300">io.BytesIO</code>, 0 octet persisté). FERnest reste l'unique GED et source officielle.
                    </p>
                  </div>

                  {/* Current Milestone J5 & LexIA GPU */}
                  <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-3">
                    <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                      Étape Actuelle (J5) : Serveur LexIA GPU
                    </h2>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                      Mise en place du micro-service d’IA documentaire (FastAPI) sur le GPU partagé <strong>LexIA</strong> (NVIDIA RTX 4000 Ada, 20 Go VRAM).
                    </p>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                      Intégration de <strong>PaddleOCR</strong> et <strong>Qwen</strong> pour lire les factures (PDF ou images) et générer les structures JSON normalisées.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SUB-TAB 1 : PLANNING 30 JOURS */}
          {currentSubTab === 'planning-30j' && (
            <div className="space-y-6">
              
              {/* Header card with 4 metrics */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                      Plan de Travail Détaillé Jour par Jour (25 à 30 Jours Ouvrés)
                    </h1>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Du 02/11/2026 (J1) au 11/12/2026 (J30 - Recette Finale). Priorité #1 de développement par Jean Elson.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyFullPlan}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedPlan ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedPlan ? 'Plan Copié !' : 'Exporter Plan'}</span>
                    </button>

                    <button
                      onClick={() => setShowJsonModal(true)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Code2 className="w-4 h-4 text-white" />
                      <span>JSON Statuts</span>
                    </button>
                  </div>
                </div>

                {/* 4 KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">Cycle Global</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">30 Jours</span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 block mt-0.5">Du J1 au J30</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">Banc d'Essai</span>
                    <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300 tabular-nums">100 Factures</span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 block mt-0.5">3 approches évaluées</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">Garantie RAM</span>
                    <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 tabular-nums">0 Octet Disque</span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 block mt-0.5">Purge gc.collect()</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">Recette J+30</span>
                    <span className="text-2xl font-black text-amber-700 dark:text-amber-300 tabular-nums">11/12/2026</span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 block mt-0.5">PV Romain Friderich</span>
                  </div>
                </div>

                {/* Filter Controls (Clean select dropdowns with solid contrast) */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Semaine :</span>
                      <select
                        value={selectedPlanWeek}
                        onChange={(e) => setSelectedPlanWeek(Number(e.target.value))}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
                        aria-label="Filtrer par semaine"
                      >
                        <option value={0}>Toutes les semaines (Vue Globale)</option>
                        <option value={1}>Semaine 1 (J1 - J5 : Audit & Cadrage)</option>
                        <option value={2}>Semaine 2 (J6 - J10 : Benchmark GPU)</option>
                        <option value={3}>Semaine 3 (J11 - J15 : Service IA FastAPI)</option>
                        <option value={4}>Semaine 4 (J16 - J20 : HUB Orchestrateur)</option>
                        <option value={5}>Semaine 5 (J21 - J25 : Adaptateur FERnest)</option>
                        <option value={6}>Semaine 6 (J26 - J30 : Recette J+30)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Statut :</span>
                      <select
                        value={selectedPlanStatus}
                        onChange={(e) => setSelectedPlanStatus(e.target.value as any)}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
                        aria-label="Filtrer par statut"
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

                  <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">
                    {planItems.filter(item => (selectedPlanWeek === 0 || item.week === selectedPlanWeek) && (selectedPlanStatus === 'Tous' || item.status === selectedPlanStatus)).length} jour(s) affiché(s)
                  </span>
                </div>
              </div>

              {/* Day Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {planItems
                  .filter(item => (selectedPlanWeek === 0 || item.week === selectedPlanWeek) && (selectedPlanStatus === 'Tous' || item.status === selectedPlanStatus))
                  .map(item => (
                    <div
                      key={item.day}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
                    >
                      <div className="space-y-3">
                        {/* Day Header */}
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-950 dark:text-indigo-100 font-bold font-mono text-xs flex items-center justify-center border border-indigo-300 dark:border-indigo-700">
                              J{item.day}
                            </span>
                            <div>
                              <span className="font-bold text-xs text-slate-900 dark:text-white block">
                                {item.date}
                              </span>
                              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                                Semaine {item.week} • {item.phase.split(':')[0]}
                              </span>
                            </div>
                          </div>

                          {/* Status Selector with High Contrast */}
                          <div className="relative">
                            <select
                              value={item.status}
                              onChange={(e) => updatePlanStatus(item.day, e.target.value as DayPlanItem['status'])}
                              aria-label={`Statut pour jour ${item.day}`}
                              className={`text-xs font-bold px-2.5 py-1 rounded-md border appearance-none pr-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm ${
                                item.status === 'Terminé'
                                  ? 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100 border-emerald-400 dark:border-emerald-700'
                                  : item.status === 'Bloquant'
                                  ? 'bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-100 border-rose-400 dark:border-rose-700'
                                  : item.status === 'Priorité Immédiate' || item.status === 'En cours'
                                  ? 'bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-100 border-amber-400 dark:border-amber-700'
                                  : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600'
                              }`}
                            >
                              <option value="À venir">À VENIR</option>
                              <option value="En cours">EN COURS</option>
                              <option value="Priorité Immédiate">PRIORITÉ</option>
                              <option value="Bloquant">BLOQUANT</option>
                              <option value="Terminé">TERMINÉ</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700 dark:text-slate-200" />
                          </div>
                        </div>

                        {/* Day Content */}
                        <div>
                          <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {item.title}
                          </h2>
                          <p className="text-xs text-slate-700 dark:text-slate-200 mt-1.5 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Day Deliverable & Owner */}
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs space-y-2">
                        <div className="flex items-start gap-1.5">
                          <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0">Livrable :</span>
                          <span className="text-slate-900 dark:text-white font-medium">{item.deliverable}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="font-bold text-indigo-700 dark:text-indigo-300">
                            {item.owner}
                          </span>
                          <span className="text-slate-600 dark:text-slate-300 font-mono font-bold">
                            W{item.week}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* JSON Modal */}
              {showJsonModal && (
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label="JSON du planning"
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
                  onClick={() => setShowJsonModal(false)}
                >
                  <div
                    className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          État du Planning & Statuts en JSON
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowJsonModal(false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 cursor-pointer"
                      >
                        Fermer
                      </button>
                    </div>

                    <CodeBlock
                      code={JSON.stringify(planItems, null, 2)}
                      language="json"
                      title="plan_30_jours.json"
                      maxHeight="max-h-80"
                    />

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={copyPlanJson}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        {copiedPlan ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4 text-white" />}
                        <span>{copiedPlan ? 'Copié !' : 'Copier le JSON'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* SUB-TAB 2 : ARCHITECTURE MICROSERVICES */}
          {currentSubTab === 'archi-microservices' && (
            <div className="space-y-6">
              
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Architecture Découplée & Cartographie des Services
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Les 3 services logiques et la topologie des serveurs physiques (Hetzner Prod, LexIA GPU, FERnest GED).
                </p>
              </div>

              {/* 3 Services Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Service 1 */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-7 w-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-100 font-bold flex items-center justify-center text-xs">
                          1
                        </span>
                        <div>
                          <h2 className="text-sm font-bold text-slate-900 dark:text-white">CaptureMind HUB</h2>
                          <span className="text-xs text-indigo-700 dark:text-indigo-300 font-mono font-bold">Orchestrateur Métier</span>
                        </div>
                      </div>
                      <Badge label="Hetzner" variant="indigo" size="sm" />
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                      Réception du flux chiffré depuis FERnest, orchestration en RAM pure, et restitution des écritures comptables.
                    </p>

                    <div className="space-y-1 text-xs font-mono text-slate-700 dark:text-slate-300">
                      <div>• Ingestion : <code>POST /ws/ingest</code></div>
                      <div>• Matching : SIREN & Levenshtein</div>
                      <div>• Imputation : Modèles de M. Flore</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Lead : <strong className="text-slate-900 dark:text-white">Jean Elson</strong></span>
                    <Badge label="0 Octet Disque" variant="success" size="sm" />
                  </div>
                </div>

                {/* Service 2 */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-7 w-7 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-100 font-bold flex items-center justify-center text-xs">
                          2
                        </span>
                        <div>
                          <h2 className="text-sm font-bold text-slate-900 dark:text-white">IA Documentaire</h2>
                          <span className="text-xs text-sky-700 dark:text-sky-300 font-mono font-bold">Vision & RAM Volatile</span>
                        </div>
                      </div>
                      <Badge label="LexIA GPU" variant="info" size="sm" />
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                      Micro-service d'extraction optique et multimodale sur serveur GPU partagé (RTX 4000 Ada - 20 Go VRAM).
                    </p>

                    <div className="space-y-1 text-xs font-mono text-slate-700 dark:text-slate-300">
                      <div>• Moteur Natif : <code>pypdfium2</code> (&lt;300ms)</div>
                      <div>• Banc d'essai : 100 factures</div>
                      <div>• Purge : <code>gc.collect()</code> immédiat</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Lead : <strong className="text-slate-900 dark:text-white">Alphonse & Jean Elson</strong></span>
                    <Badge label="GPU LexIA" variant="info" size="sm" />
                  </div>
                </div>

                {/* Service 3 */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-7 w-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-100 font-bold flex items-center justify-center text-xs">
                          3
                        </span>
                        <div>
                          <h2 className="text-sm font-bold text-slate-900 dark:text-white">PostgreSQL & Tiers</h2>
                          <span className="text-xs text-emerald-700 dark:text-emerald-300 font-mono font-bold">Référentiel Allégé</span>
                        </div>
                      </div>
                      <Badge label="Hetzner DB" variant="success" size="sm" />
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                      Conservation des tables de référentiel léger (comptes et tiers) tout en supprimant tout docserver physique.
                    </p>

                    <div className="space-y-1 text-xs font-mono text-slate-700 dark:text-slate-300">
                      <div>• Tables : <code>accounts_supplier</code></div>
                      <div>• Plan : PCG & règles M. Flore</div>
                      <div>• Poids : &lt; 50 Mo (0 blob)</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Lead : <strong className="text-slate-900 dark:text-white">M. Flore & Jean Elson</strong></span>
                    <Badge label="Zéro Disque" variant="success" size="sm" />
                  </div>
                </div>

              </div>

              {/* Physical Servers Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Topologie & Cartographie des Serveurs Physiques
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">Hetzner (Production)</span>
                      <span className="text-xs font-mono text-indigo-700 dark:text-indigo-300 font-bold">Jean Elson</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-xs">
                      Hébergement du HUB Orchestrateur CaptureMind et de la base PostgreSQL allégée.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">LexIA (Serveur GPU)</span>
                      <span className="text-xs font-mono text-sky-700 dark:text-sky-300 font-bold">Alphonse</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-xs">
                      Serveur partagé NVIDIA RTX 4000 Ada (20 Go VRAM) pour l'IA Documentaire.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">FERnest (visiocompte.pro)</span>
                      <span className="text-xs font-mono text-emerald-700 dark:text-emerald-300 font-bold">M. Flore</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-xs">
                      ERP et GED comptable officielle, point d'entrée et de sortie des factures.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SUB-TAB 3 : CONTRATS API */}
          {currentSubTab === 'contrats-api' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Contrats d'Échange & Spécifications API
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Format JSON standardisé pour le moteur IA et format XML historique conforme au schéma verifier_exports.py de FERnest.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-sky-500" />
                    Contrat 1 : Sortie JSON du Service IA FastAPI (Stateless RAM)
                  </h2>
                  <CodeBlock
                    code={`{
  "status": "success",
  "document_id": "doc_928374",
  "format_detected": "PDF_NATIVE_FACTURX",
  "confidence_global": 0.985,
  "datas": {
    "siren": "380129866",
    "invoice_number": "FR-2026-10492",
    "invoice_date": "2026-10-28",
    "due_date": "2026-11-28",
    "supplier_name": "Orange Business Services",
    "amount_ht": 120.00,
    "vat_rate": 20.0,
    "amount_vat": 24.00,
    "amount_ttc": 144.00,
    "currency": "EUR"
  },
  "positions": {
    "siren": { "page": 1, "box": [45, 120, 180, 140] },
    "amount_ttc": { "page": 1, "box": [420, 680, 510, 705] }
  },
  "pages": 1
}`}
                    language="json"
                    title="contrat_ia_datas.json"
                  />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    Contrat 2 : Restitution XML vers FERnest (verifier_exports.py)
                  </h2>
                  <CodeBlock
                    code={`<ROOT>
  <TECHNICAL>
    <filename>facture_orange_oct2026.pdf</filename>
    <md5>9f82c4...e182</md5>
    <nb_pages>1</nb_pages>
    <capturemind_version>3.0-RAM</capturemind_version>
  </TECHNICAL>
  <DATAS>
    <supplier_siren>380129866</supplier_siren>
    <supplier_account>401ORANGE</supplier_account>
    <expense_account>626100</expense_account>
    <total_ht>120.00</total_ht>
    <total_vat>24.00</total_vat>
    <total_ttc>144.00</total_ttc>
    <taxes>
      <tax rate="20.0" base="120.00" amount="24.00"/>
    </taxes>
    <lines>
      <line debit="120.00" credit="0.00" account="626100"/>
      <line debit="24.00" credit="0.00" account="445660"/>
      <line debit="0.00" credit="144.00" account="401ORANGE"/>
    </lines>
  </DATAS>
</ROOT>`}
                    language="xml"
                    title="export_verifier.xml"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 4 : MATRICE DES RÔLES */}
          {currentSubTab === 'matrice-flux' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Matrice des Rôles & Dépendances Opérationnelles
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Répartition claire des responsabilités entre les 5 acteurs pour garantir l’exécution des 30 jours sans blocage.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <Badge label="Lead Ingénierie" variant="info" size="sm" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Jean Elson</h2>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                    Architecture globale, développement du Service IA FastAPI en RAM, réécriture de l’orchestrateur CaptureMind HUB, adaptateur XML et recette technique.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 shadow-sm space-y-2">
                  <Badge label="Action Bloquante #1" variant="danger" size="sm" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Équipe Infra (Hetzner)</h2>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                    Extraction des 100 factures témoins depuis <code>/var/docservers</code> sur Hetzner pour débloquer le banc d’essai GPU. Surveillance de l’occupation disque critique (97%).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <Badge label="GPU & Phase 2" variant="purple" size="sm" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Alphonse (LexIA)</h2>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                    Mise à disposition du serveur LexIA (RTX 4000 Ada - 20 Go VRAM) pour le benchmark, puis développement et intégration de l’Agent IA en Phase 2.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 5 : RECETTE FINALE J+30 */}
          {currentSubTab === 'recette-j30' && (
            <div className="space-y-6">
              
              {/* Header PV Recette */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 flex items-center justify-center shrink-0">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                        Procès-Verbal de Recette Finale J+30 (11/12/2026)
                      </h1>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Direction Générale : Romain Friderich · Lead Développeur : Jean Elson
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={copyPvRecette}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    {copiedPv ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4 text-white" />}
                    <span>{copiedPv ? 'PV Copié !' : 'Exporter le PV de Recette'}</span>
                  </button>
                </div>

                {/* Checklist items */}
                <div className="space-y-3">
                  {recetteChecklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleRecetteCheck(item.id)}
                      className={`p-4 rounded-xl border transition-colors cursor-pointer flex items-start gap-3.5 ${
                        item.checked
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => {}}
                        aria-label={item.title}
                        className="mt-1 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {item.title}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                              {item.dateTarget}
                            </span>
                            <Badge
                              label={item.priority}
                              variant={item.priority === 'Bloquant Recette' ? 'danger' : item.priority === 'Majeur' ? 'warning' : 'info'}
                              size="sm"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-200">
                          {item.description}
                        </p>
                        <div className="text-xs font-mono text-slate-600 dark:text-slate-300 pt-1">
                          Preuve technique : {item.technicalValidation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Attestation Stateless RAM */}
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 space-y-2 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                    Attestation de Conformité Stateless RAM
                  </span>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                    Le service CaptureMind HUB opère 100% en mémoire vive volatile (io.BytesIO). Aucun fichier PDF ni données documentaires ne sont stockés de manière permanente sur les disques Hetzner (/tmp, /var/tmp, /var/docservers = 0 octet résiduel). La vulnérabilité VUL-001 (saturation disque 97%) est définitivement éradiquée.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* ============ VUE 2 : CADRAGE & AUDIT EXISTANT ========== */}
      {/* ======================================================== */}
      {activeViewId === 'decisions' && (
        <div className="space-y-6">
          
          {/* Header */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Cadrage & 9 Décisions Fondamentales
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Arbitrages arrêtés suite aux échanges avec Romain Friderich, M. Flore et Alphonse.
                </p>
              </div>

              <button
                onClick={copyAuditQuestions}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedAudit ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>{copiedAudit ? 'Audit Copié !' : 'Exporter Questionnaire Audit'}</span>
              </button>
            </div>

            {/* 9 Decisions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {captureMindDecisions.map((dec) => {
                const getDecVariant = (st: string) => {
                  if (st === 'Confirmé') return 'success';
                  if (st === 'Hypothèse à tester') return 'warning';
                  if (st === 'Déjà Existant chez M. Flore') return 'info';
                  return 'purple';
                };

                return (
                  <div
                    key={dec.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">
                          #{dec.id}
                        </span>
                        <Badge label={dec.status} variant={getDecVariant(dec.status)} size="sm" />
                      </div>
                      <h2 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {dec.subject}
                      </h2>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {dec.choice}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-200 dark:border-slate-700">
                      {dec.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 15 Audit Questions Section */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-500" />
                  Diagnostic Technique : 15 Questions d’Audit sur 5 Axes
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Identification des dépendances, code OpenCapture, docservers Hetzner et interfaces FERnest.
                </p>
              </div>

              {/* Axe filter select */}
              <select
                value={selectedAuditAxe}
                onChange={(e) => setSelectedAuditAxe(Number(e.target.value))}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
                aria-label="Filtrer par axe d'audit"
              >
                <option value={0}>Tous les 5 axes (15 questions)</option>
                <option value={1}>Axe 1 : Code OpenCapture & Dépendances</option>
                <option value={2}>Axe 2 : Base de Données & Stockage RAM</option>
                <option value={3}>Axe 3 : Entrée / Sortie FERnest</option>
                <option value={4}>Axe 4 : Tiers & Référentiels M. Flore</option>
                <option value={5}>Axe 5 : GPU LexIA & Alphonse</option>
              </select>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {auditQuestionsList
                .filter((q) => selectedAuditAxe === 0 || q.axeNum === selectedAuditAxe)
                .map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100">
                          {q.id}
                        </span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          {q.axeTitle}
                        </span>
                        <Badge
                          label={q.status}
                          variant={q.status === 'Clarifié' ? 'success' : 'warning'}
                          size="sm"
                        />
                      </div>

                      <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {q.question}
                      </h3>

                      <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                        <strong className="text-slate-900 dark:text-white">Enjeu :</strong> {q.whyCrucial}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs space-y-1">
                      <div className="text-slate-600 dark:text-slate-300">
                        Contact : <span className="font-bold text-slate-800 dark:text-slate-100">{q.targetContact}</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                        {auditNotes[q.id] || q.clarification}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* ============ VUE 3 : SIMULATEUR RAM VOLATILE =========== */}
      {/* ======================================================== */}
      {activeViewId === 'flux' && (
        <div className="space-y-6">
          
          {/* Controls & Preset Selection */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Simulateur Interactif de Transit RAM & Purge Déterministe
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Validation en direct : 0 octet disque résiduel et libération mémoire par gc.collect().
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={runCaptureMindSim}
                  disabled={isCmSimulating}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isCmSimulating ? 'Traitement en cours...' : 'Lancer le flux RAM'}</span>
                </button>

                <button
                  onClick={resetCaptureMindSim}
                  disabled={isCmSimulating}
                  className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 transition-colors cursor-pointer"
                  title="Réinitialiser"
                  aria-label="Réinitialiser la simulation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Sélectionner un document témoin du corpus :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {invoicePresets.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setSelectedPreset(preset);
                        resetCaptureMindSim();
                      }}
                      className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-100 dark:bg-indigo-950 border-indigo-500 dark:border-indigo-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {preset.supplier}
                        </span>
                        <Badge label={preset.type} variant={preset.type === 'Factur-X' ? 'success' : 'info'} size="sm" />
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {preset.fileName} • {preset.fileSizeKB} Ko • {preset.amountTTC.toFixed(2)} € TTC
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pipeline Steps Tracker */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span className="font-bold uppercase tracking-wider">Pipeline de Traitement Déterministe</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {cmStep === 0 ? 'En attente' : cmStep === 5 ? 'Terminé (RAM Purgée à 0)' : `Étape ${cmStep}/5 en cours`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                <div className={`p-3 rounded-xl border transition-colors ${cmStep >= 1 ? 'bg-indigo-700 text-white border-indigo-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'}`}>
                  <div className="font-mono text-xs font-bold">ÉTAPE 1</div>
                  <div className="font-bold">1. Ingest RAM</div>
                </div>
                <div className={`p-3 rounded-xl border transition-colors ${cmStep >= 2 ? 'bg-indigo-700 text-white border-indigo-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'}`}>
                  <div className="font-mono text-xs font-bold">ÉTAPE 2</div>
                  <div className="font-bold">2. Parsing / XML</div>
                </div>
                <div className={`p-3 rounded-xl border transition-colors ${cmStep >= 3 ? 'bg-indigo-700 text-white border-indigo-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'}`}>
                  <div className="font-mono text-xs font-bold">ÉTAPE 3</div>
                  <div className="font-bold">3. IA & Tiers</div>
                </div>
                <div className={`p-3 rounded-xl border transition-colors ${cmStep >= 4 ? 'bg-indigo-700 text-white border-indigo-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'}`}>
                  <div className="font-mono text-xs font-bold">ÉTAPE 4</div>
                  <div className="font-bold">4. Écritures FEC</div>
                </div>
                <div className={`p-3 rounded-xl border transition-colors ${cmStep === 5 ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'}`}>
                  <div className="font-mono text-xs font-bold">ÉTAPE 5</div>
                  <div className="font-bold">5. Purge & Retour</div>
                </div>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">
                  Comparatif : Transit RAM CaptureMind HUB vs Dette Disque Legacy OpenCapture
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setRamChartMode('live')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer ${
                      ramChartMode === 'live'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    Facture Unitaire
                  </button>
                  <button
                    onClick={() => setRamChartMode('batch5')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer ${
                      ramChartMode === 'batch5'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    Lot de 5 Factures
                  </button>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={
                      ramChartMode === 'batch5'
                        ? [
                            { stage: 'Veille', ramKB: 0, legacyDiskKB: 0, note: 'Initial' },
                            { stage: 'F1 Ingest', ramKB: 340, legacyDiskKB: 980, note: 'Factur-X Orange' },
                            { stage: 'F1 Purge', ramKB: 0, legacyDiskKB: 980, note: 'RAM purgée à 0' },
                            { stage: 'F2 Ingest', ramKB: 1850, legacyDiskKB: 3240, note: 'Scan Bureau Express' },
                            { stage: 'F2 Purge', ramKB: 0, legacyDiskKB: 3240, note: 'RAM purgée à 0' },
                            { stage: 'F3 Ingest', ramKB: 580, legacyDiskKB: 3820, note: 'Multi-pages' },
                            { stage: 'F3 Purge', ramKB: 0, legacyDiskKB: 4400, note: 'RAM purgée à 0' },
                            { stage: 'F4 Ingest', ramKB: 420, legacyDiskKB: 4820, note: 'Factur-X EDF' },
                            { stage: 'F4 Purge', ramKB: 0, legacyDiskKB: 5240, note: 'RAM purgée à 0' },
                            { stage: 'F5 Ingest', ramKB: 890, legacyDiskKB: 6130, note: 'Scan dégradé' },
                            { stage: 'F5 Purge', ramKB: 0, legacyDiskKB: 7020, note: 'RAM = 0 Ko !' }
                          ]
                        : [
                            { stage: '0. Veille', ramKB: 0, legacyDiskKB: 0, note: 'Attente' },
                            { stage: '1. Ingest RAM', ramKB: cmStep >= 1 ? selectedPreset.fileSizeKB : 0, legacyDiskKB: cmStep >= 1 ? selectedPreset.fileSizeKB : 0, note: 'Transit mémoire' },
                            { stage: '2. Parsing', ramKB: cmStep >= 2 ? Math.round(selectedPreset.fileSizeKB * 2.3) : 0, legacyDiskKB: cmStep >= 2 ? selectedPreset.fileSizeKB + 620 : 0, note: 'Raster / XML' },
                            { stage: '3. Inférence', ramKB: cmStep >= 3 ? Math.round(selectedPreset.fileSizeKB * 1.8) : 0, legacyDiskKB: cmStep >= 3 ? selectedPreset.fileSizeKB + 980 : 0, note: 'IA & Tiers' },
                            { stage: '4. Écritures', ramKB: cmStep >= 4 ? Math.round(selectedPreset.fileSizeKB * 1.1) : 0, legacyDiskKB: cmStep >= 4 ? selectedPreset.fileSizeKB + 1150 : 0, note: 'FEC Débit=Crédit' },
                            { stage: '5. Purge', ramKB: cmStep === 5 ? 0 : cmStep === 4 ? Math.round(selectedPreset.fileSizeKB * 1.1) : 0, legacyDiskKB: cmStep >= 4 ? selectedPreset.fileSizeKB + 1150 : 0, note: 'del buffer & gc.collect()' }
                          ]
                    }
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="ramGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="legacyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e11d48" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="stage" stroke="#475569" fontSize={12} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={12} unit=" Ko" tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        color: '#f8fafc'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                    <Area
                      type="monotone"
                      dataKey="ramKB"
                      name="RAM CaptureMind HUB (Ko)"
                      stroke="#4f46e5"
                      fill="url(#ramGrad)"
                      strokeWidth={2.5}
                    />
                    <Area
                      type="monotone"
                      dataKey="legacyDiskKB"
                      name="Stockage Disque Ancien OpenCapture (Ko cumulé)"
                      stroke="#e11d48"
                      fill="url(#legacyGrad)"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-200 pt-2 border-t border-slate-300 dark:border-slate-700">
                <span className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Statut mémoire : 0 Ko résiduel après purge
                </span>
                <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                  Disque : 0 octet • Hetzner protégé
                </span>
              </div>
            </div>

            {/* Console logs & Accounting Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Console Logs with explicit styled empty state */}
              <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs space-y-2 border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-sky-400">Journal d'Exécution Stateless</span>
                  <span className="text-xs text-slate-300 font-mono">io.BytesIO Stream</span>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 p-1 text-xs custom-scrollbar">
                  {cmLogs.length === 0 ? (
                    <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs flex items-center gap-2.5">
                      <Activity className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Console prête — Cliquez sur « Lancer le flux RAM » pour observer l'exécution en mémoire vive.</span>
                    </div>
                  ) : (
                    cmLogs.map((log, i) => (
                      <div key={i} className="text-emerald-300 text-xs font-mono">&gt; {log}</div>
                    ))
                  )}
                </div>
              </div>

              {/* Accounting Preview */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Proposition d'Écritures Comptables
                  </span>
                  <Badge label="Équilibre FEC Validé" variant="success" size="sm" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        <th className="py-2 px-2 font-bold">Compte / Libellé</th>
                        <th className="py-2 px-2 font-bold text-right">Débit (€)</th>
                        <th className="py-2 px-2 font-bold text-right">Crédit (€)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-900 dark:text-slate-100 font-mono font-medium">
                      <tr>
                        <td className="py-2 px-2">{selectedPreset.suggestedAccount}</td>
                        <td className="py-2 px-2 text-right text-indigo-700 dark:text-indigo-300 font-bold">{selectedPreset.amountHT.toFixed(2)}</td>
                        <td className="py-2 px-2 text-right text-slate-500">-</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2">445660 (TVA déductible s/ ABS {selectedPreset.vatRate}%)</td>
                        <td className="py-2 px-2 text-right text-indigo-700 dark:text-indigo-300 font-bold">{(selectedPreset.amountTTC - selectedPreset.amountHT).toFixed(2)}</td>
                        <td className="py-2 px-2 text-right text-slate-500">-</td>
                      </tr>
                      <tr className="font-bold border-t border-slate-300 dark:border-slate-700">
                        <td className="py-2 px-2 text-slate-900 dark:text-white">{selectedPreset.suggestedSubAccount}</td>
                        <td className="py-2 px-2 text-right text-slate-500">-</td>
                        <td className="py-2 px-2 text-right text-emerald-700 dark:text-emerald-300 font-bold">{selectedPreset.amountTTC.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-200 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Débit : {selectedPreset.amountTTC.toFixed(2)} €</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">Écart : 0,00 € (Strict)</span>
                  <span>Total Crédit : {selectedPreset.amountTTC.toFixed(2)} €</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* ============ VUE 4 : OUTILS & 4 BRIQUES ================ */}
      {/* ======================================================== */}
      {activeViewId === 'outils' && (
        <div className="space-y-6">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Boîte à Outils & Bibliothèques Techniques (CaptureMind HUB)
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Remplacement d'OpenCapture et PyMuPDF par des librairies à licences strictement permissives (Apache 2.0 / BSD / MIT).
            </p>

            <div className="space-y-3.5">
              {captureMindStack.map((tool) => (
                <div
                  key={tool.stepNum}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="h-6 w-6 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-950 dark:text-indigo-100 font-bold font-mono text-xs flex items-center justify-center">
                        {tool.stepNum}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{tool.stepName}</span>
                      <span className="text-xs text-slate-600 dark:text-slate-300">({tool.toolType})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 border border-indigo-300 dark:border-indigo-700">
                        {tool.toolName}
                      </span>
                      <Badge
                        label={tool.license}
                        variant={tool.licenseStatus === 'Permissive (Libre)' ? 'success' : 'purple'}
                        size="sm"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                    {tool.role}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                    <div>
                      <span className="text-slate-600 dark:text-slate-300 block font-bold">Entrée / Sortie :</span>
                      <span className="text-slate-800 dark:text-slate-200 font-mono">{tool.inputOutput}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-300 block font-bold">Mémoire & Disque :</span>
                      <span className="text-emerald-800 dark:text-emerald-300 font-mono font-bold">{tool.memoryStorage}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-300 block font-bold">Atout Clé :</span>
                      <span className="text-indigo-800 dark:text-indigo-200 font-medium">{tool.keyFeature}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* ============ VUE 5 : RÉPONSE & EMAIL FRIDERICH ========== */}
      {/* ======================================================== */}
      {activeViewId === 'email' && (
        <div className="space-y-6">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Courriers & Réponses Officielles Validées
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Tous les modèles de correspondance prêts à être copiés pour la direction et les partenaires.
                </p>
              </div>

              <button
                onClick={copyEmailToClipboard}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-colors flex items-center gap-2 cursor-pointer shrink-0"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4 text-white" />}
                <span>{copiedEmail ? 'Texte Copié !' : 'Copier la Version Active'}</span>
              </button>
            </div>

            {/* Version Switcher Tabs (High contrast active tab) */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setEmailVersion('msg-infra')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  emailVersion === 'msg-infra'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                1. Message Infra (100 Factures)
              </button>
              <button
                onClick={() => setEmailVersion('msg-flore')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  emailVersion === 'msg-flore'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                2. Message M. Flore (PCG)
              </button>
              <button
                onClick={() => setEmailVersion('agent-ia')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  emailVersion === 'agent-ia'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                3. Réponse Agent IA
              </button>
              <button
                onClick={() => setEmailVersion('targeted')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  emailVersion === 'targeted'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                4. Synthèse 4 Points
              </button>
              <button
                onClick={() => setEmailVersion('official')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  emailVersion === 'official'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                5. Version Complète (3 Sections)
              </button>
            </div>

            {/* Email Metadata Header */}
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 space-y-1">
              <div><strong className="text-slate-900 dark:text-white">Destinataire :</strong> Romain FRIDERICH &lt;rfriderich@digipepss.pro&gt;</div>
              <div><strong className="text-slate-900 dark:text-white">Expéditeur :</strong> Jean Elson (Lead Développeur – Digilium / Digipepss)</div>
              <div><strong className="text-slate-900 dark:text-white">Objet :</strong> {currentEmailSubject}</div>
            </div>

            {/* Preformatted text with internal scroll */}
            <div className="p-5 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap border border-slate-800 custom-scrollbar">
              {currentEmailText}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
