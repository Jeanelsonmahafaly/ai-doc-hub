import React from 'react';
import {
  Clock,
  Briefcase,
  Scale,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface KnowledgeViewProps {
  activeViewId: string;
}

export const KnowledgeView: React.FC<KnowledgeViewProps> = ({ activeViewId }) => {
  return (
    <div className="space-y-6">

      {/* Stratégie Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3.5 text-xs">
        <div className="h-8 w-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Base de Connaissances & Référentiel Stratégique
            </span>
            <Badge label="Savoir Centralisé" variant="warning" size="sm" />
            <Badge label="Gouvernance 2026" variant="neutral" size="sm" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
            Consolidation exhaustive de l’ensemble des échanges avec la direction technique, des responsabilités par acteur, des analyses de licences et du protocole de benchmark 100 factures.
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ============ VUE 1 : FIL DES ÉCHANGES (CHRONOLOGIE) ==== */}
      {/* ======================================================== */}
      {activeViewId === 'chronologie' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Chronologie des Arbitrages Majeurs
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Fil d’Ariane complet retraçant les orientations prises pas à pas depuis le 27 octobre 2026.
              </p>
            </div>

            <div className="space-y-3.5">
              
              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-slate-400 dark:border-l-slate-500 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="h-6 w-6 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 flex items-center justify-center font-mono font-bold">1</span>
                    27 Octobre 2026 : Rapport Technique Initial
                  </span>
                  <Badge label="Bilan d'Audit" variant="neutral" size="sm" />
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  Bilan des <strong>27 jours déjà réalisés en production</strong> sur VISIOfact (9j socle, 8j routage, 10j B2Brouter), estimation de 30j pour le point d’accès natif, et notification que l’AIFE restreint l'accès aux API du PPF avant validation du dossier.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-sky-500 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="h-6 w-6 rounded-md bg-sky-600 text-white flex items-center justify-center font-mono font-bold">2</span>
                    30 Octobre 2026 : Cadrage CaptureMind
                  </span>
                  <Badge label="Vision Cible" variant="info" size="sm" />
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  Romain formalise les 3 schémas fonctionnels : CaptureMind doit être un HUB 100% en RAM, sans stockage documentaire permanent, FERnest restant le référentiel unique des documents et des écritures définitives.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-indigo-500 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="h-6 w-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-mono font-bold">3</span>
                    30 Octobre 2026 : Questions Peppol & DGFiP
                  </span>
                  <Badge label="Clarifications" variant="indigo" size="sm" />
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  Romain interroge l'équipe sur le périmètre des 25-30j de CaptureMind, le planning des jalons, les licences open source de phase4/Oxalis et le maintien éventuel de B2Brouter pour sécuriser janvier 2027.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-emerald-500 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="h-6 w-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-mono font-bold">4</span>
                    30 Octobre 2026 : Accord Formel de Direction
                  </span>
                  <Badge label="Feu Vert" variant="success" size="sm" />
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  Accord à 100% sur l’architecture CaptureMind HUB (4 briques, RAM volatile, zéro stockage). Capitalisation des règles existantes validée.
                </p>
              </div>

              {/* Step 5 */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-slate-400 dark:border-l-slate-500 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="h-6 w-6 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 flex items-center justify-center font-mono font-bold">5</span>
                    30 Octobre 2026 : Réponse Officielle Validée
                  </span>
                  <Badge label="Texte Validé" variant="success" size="sm" />
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  Réponse définitive en 3 volets structurés : <strong>1. CaptureMind (25-30j)</strong> avec 4 composants indépendants, transit 100% en RAM, benchmark 100 factures (Multimodale, OCR+LLM, Hybride), coordination avec M. Flore pour les modèles existants et Alphonse pour le GPU ; <strong>2. Peppol & planning (50-60j au total)</strong> avec CaptureMind en priorité 1 ; <strong>3. Maintien B2Brouter</strong> renvoyé formellement à M. Iliev.
                </p>
              </div>

              {/* Step 6 */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-purple-500 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="h-6 w-6 rounded-md bg-purple-600 text-white flex items-center justify-center font-mono font-bold">6</span>
                    02 Novembre 2026 : Orientation Agent IA (Phase 2 confiée à Alphonse)
                  </span>
                  <Badge label="Vision Long Terme" variant="purple" size="sm" />
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  Romain Friderich annonce l'ajout ultérieur d'un <strong>Agent IA de raisonnement et d'assistance</strong>. La priorité immédiate de Jean Elson reste inchangée : <strong>25 à 30 jours ouvrés</strong> sur le moteur documentaire en mémoire vive. L'agent IA est confié à Alphonse en phase 2. Jean Elson anticipe simplement des contrats d'API REST modulaires.
                </p>
              </div>

              {/* Step 7 */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-sky-500 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="h-6 w-6 rounded-md bg-sky-600 text-white flex items-center justify-center font-mono font-bold">7</span>
                    02 Novembre 2026 : Fiche Tâches & Activation VISIOfact (TECT OEC / ONLYCOMPTA)
                  </span>
                  <Badge label="Preuve Opérationnelle" variant="info" size="sm" />
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  <strong>Notification d'activation client reçue :</strong> Confirmation de l'activation de « TECT OEC - Client ONLYCOMPTA » sur VISIOfact. Cela démontre concrètement la viabilité de la passerelle B2Brouter en production, sécurisant ainsi l'objectif de <strong>dépôt du dossier DGFiP début janvier 2027</strong> sans retarder CaptureMind. Fiche de mission du Lundi 02 : 1. Refonte design bulletins de paie, 2. CaptureMind (25-30j, Priorité 1), 3. VISIOfact natif (25-30j, échéance DGFiP début janvier 2027).
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ============ VUE 2 : RÔLES & 5 ACTEURS CLÉS ============ */}
      {/* ======================================================== */}
      {activeViewId === 'intervenants' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-sky-500" />
                Cartographie des Rôles & 5 Acteurs Clés du Projet
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Répartition des responsabilités pour garantir l'exécution sans friction des deux chantiers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              
              {/* Romain */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-600 dark:text-amber-400 uppercase text-[11px]">Direction Générale</span>
                  <Badge label="Arbitrage" variant="warning" size="sm" />
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Romain FRIDERICH</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Validation stratégique de l'architecture, arbitrage des priorités, validation des budgets GPU et recette fonctionnelle conjointe à J+30.
                </p>
              </div>

              {/* Jean Elson */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-700 dark:text-indigo-400 uppercase text-[11px]">Lead Développement</span>
                  <Badge label="Priorité 1" variant="indigo" size="sm" />
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Jean Elson</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Responsable de la refonte CaptureMind HUB (pipeline RAM volatile, moteur IA, contrôles arithmétiques, proposition d'écritures) et banc d’essai sur 100 factures.
                </p>
              </div>

              {/* Georgi Iliev */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase text-[11px]">Expert Réseau & DGFiP</span>
                  <Badge label="VISIOfact" variant="success" size="sm" />
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Georgi Iliev</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Pilotage du dossier de candidature DGFiP début janvier 2027, maintien temporaire de B2Brouter, et arbitrage final du composant AS4 natif (phase4 / Oxalis).
                </p>
              </div>

              {/* Monsieur Flore */}
              <div className="p-5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-700 dark:text-sky-400 uppercase text-[11px]">Expert Métier FERnest</span>
                  <Badge label="Détenteur des 4 Livrables" variant="info" size="sm" />
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Monsieur Flore</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>Point 1 résolu :</strong> M. Flore détient déjà le Plan Comptable Général, les plans spécifiques par dossier, les règles d'imputation et les bibliothèques de tiers. R. Friderich a confirmé : <em>« déjà existant, veuillez vous rapprocher de Mr Flore »</em>. Jean Elson n'a plus qu'à récupérer ces règles pour alimenter le banc d'essai sans redondance.
                </p>
              </div>

              {/* Alphonse */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-600 dark:text-purple-400 uppercase text-[11px]">Infrastructure & GPU</span>
                  <Badge label="Serveur LexIA" variant="purple" size="sm" />
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Alphonse</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Allocation des créneaux GPU sur le serveur partagé LexIA (NVIDIA RTX 4000 Ada - 20 Go VRAM) et monitoring de la consommation mémoire.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ============ VUE 3 : ENCYCLOPÉDIE LICENCES ============= */}
      {/* ======================================================== */}
      {activeViewId === 'licences' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-500" />
                Encyclopédie Juridique des Licences & Conformité Commerciale
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Analyse des risques de contamination et garanties d'exploitation commerciale sans obligation d'ouvrir notre code source.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* AGPL Disqualification */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-rose-500 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-800 dark:text-rose-300 uppercase text-[11px] tracking-wider">Licence Écartée</span>
                  <Badge label="GNU AGPL" variant="danger" size="sm" />
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Pourquoi PyMuPDF a été définitivement écarté ?</h2>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                  La licence GNU AGPL (Affero General Public License) impose la clause virale réseau (Copyleft fort). L'utilisation de PyMuPDF dans un service SaaS ou une API comme CaptureMind contraindrait l'entreprise à divulguer l'intégralité de son code propriétaire ou à payer une licence commerciale coûteuse.
                </p>
              </div>

              {/* Apache 2.0 / BSD Approval */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-emerald-500 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 uppercase text-[11px] tracking-wider">Licences Permissives Validées</span>
                  <Badge label="Apache 2.0 / BSD / MIT" variant="success" size="sm" />
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Pourquoi pypdfium2, phase4 et Oxalis sont parfaits ?</h2>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                  Ces licences n'ont aucun effet viral. Elles autorisent formellement l'intégration, la modification et l'exploitation commerciale fermée au sein de CaptureMind et VISIOfact, sous la seule condition de conserver la mention de copyright d'origine dans la documentation.
                </p>
              </div>

              {/* MPL 2.0 Details */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-amber-500 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-800 dark:text-amber-300 uppercase text-[11px] tracking-wider">Licence Modulaire</span>
                  <Badge label="Mozilla MPL 2.0" variant="warning" size="sm" />
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Comportement juridique de phoss SMP & OpenBao</h2>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                  La licence MPL 2.0 est un copyleft limité au fichier : si nous modifions directement un fichier source de phoss SMP, ce fichier seul doit être redistribué si demandé. En revanche, le code appelant (nos microservices FastAPI et VISIOfact) reste 100% propriétaire et fermé.
                </p>
              </div>

              {/* 0 Persistance Guarantee */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-indigo-500 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-800 dark:text-indigo-300 uppercase text-[11px] tracking-wider">Sécurité & RGPD</span>
                  <Badge label="Zéro Persistance" variant="indigo" size="sm" />
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Exigence stricte de non-stockage sur CaptureMind</h2>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                  FERnest détient l'exclusivité du stockage légal et fiscal des pièces. CaptureMind n'est qu'un calculateur en mémoire vive : les flux documentaires sont libérés dès renvoi du JSON et les journaux de logs sont expurgés de toute donnée confidentielle de facturation.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ============ VUE 4 : BANC D'ESSAI 100 FACTURES ======== */}
      {/* ======================================================== */}
      {activeViewId === 'benchmark' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  Protocole du Banc d'Essai des 100 Factures Réelles
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Méthodologie objective pour comparer les 3 approches d'extraction documentaire sur serveur LexIA.
                </p>
              </div>
              <Badge label="Phase 1 : 10 à 15 j.o." variant="purple" size="sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-sky-500 space-y-2 shadow-sm">
                <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider block">Approche 1</span>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Multimodal Direct</h2>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                  Modèle de Vision-Language de bout en bout (Qwen3-VL 4B/8B). Traitement direct de l’image pour générer le JSON structuré sans étape OCR intermédiaire.
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                  Avantage : Compréhension spatiale native. Point d'attention : Consommation VRAM GPU.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-indigo-500 space-y-2 shadow-sm">
                <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">Approche 2</span>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">OCR Traditionnel + LLM</h2>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                  Extraction textuelle brute via PaddleOCR puis restructuration comptable via un modèle de langage léger.
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                  Avantage : Vitesse d'exécution rapide. Point d'attention : Risque de perte de contexte tabulaire.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-emerald-500 space-y-2 shadow-sm">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">Approche 3 (Hypothèse Forte)</span>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Approche Hybride Optimisée</h2>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                  Aiguillage intelligent : extraction directe 100% CPU pour les factures Factur-X / PDF vectoriels, et recours ciblé au GPU Vision uniquement pour les scans complexes.
                </p>
                <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-200 font-semibold">
                  Avantage : Coût serveur minimal, débit maximal et résilience totale.
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
