import React, { useState } from 'react';
import {
  Scale,
  Activity,
  Calendar,
  Boxes,
  Clock,
  Mail,
  Play,
  RotateCcw,
  CheckCircle2,
  Server,
  Globe2,
  Copy,
  Check,
  Send,
  Sparkles,
  FileText
} from 'lucide-react';
import {
  planningMilestones,
  visiofactStack,
  peppolFeatures,
  emailAgentIaToFriderich,
  targetedEmailToFriderich,
  officialValidatedEmailToFriderich,
  shortEmailToFriderich,
  officialEmailToFriderich
} from '../../data/hubData';
import { Badge } from '../common/Badge';

interface VisiofactViewProps {
  activeViewId: string;
}

export const VisiofactView: React.FC<VisiofactViewProps> = ({ activeViewId }) => {
  // Simulator state
  const [peppolMode, setPeppolMode] = useState<'b2brouter' | 'native-phase4'>('b2brouter');
  const [vfStep, setVfStep] = useState<number>(0);
  const [isVfSimulating, setIsVfSimulating] = useState<boolean>(false);
  const [vfLogs, setVfLogs] = useState<string[]>([]);
  const [currentInvoiceCdv, setCurrentInvoiceCdv] = useState<string>('DÉPOSÉ (Draft)');

  // Email state
  const [emailVersion, setEmailVersion] = useState<'agent-ia' | 'targeted' | 'official' | 'short' | 'detailed'>('targeted');
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  // Run Peppol live simulation
  const runVisiofactPeppolSim = () => {
    setIsVfSimulating(true);
    setVfStep(1);
    setCurrentInvoiceCdv("EN COURS D'ÉMISSION");
    setVfLogs([
      `[VISIOfact Core] Préparation de la facture électronique (Format Factur-X / UBL Peppol BIS Billing 3.0).`,
      `[Bibliothèque active] lxml : Validation Schematron Peppol BIS EN16931 conforme.`
    ]);

    if (peppolMode === 'b2brouter') {
      setTimeout(() => {
        setVfStep(2);
        setVfLogs((prev) => [
          `[Provider Layer] Mode actif : DELIVERY_MODE=b2brouter (Production active - 10j réalisés).`,
          `[Appel API REST] Envoi du payload signé vers l'API B2Brouter avec authentification TLS.`,
          `[Dossier DGFiP] Prestataire B2Brouter déclaré -> Zéro blocage pour le dépôt Janvier 2027.`,
          ...prev
        ]);
      }, 1200);

      setTimeout(() => {
        setVfStep(3);
        setVfLogs((prev) => [
          `[Réseau Peppol] B2Brouter achemine le document vers le point d'accès du destinataire.`,
          `[Accusé Réception] Receipt technique reçu de B2Brouter (Status: 200 OK).`,
          ...prev
        ]);
      }, 2500);

      setTimeout(() => {
        setVfStep(4);
        setIsVfSimulating(false);
        setCurrentInvoiceCdv('ACHEMINÉ (Statut Peppol Réseau Validé)');
        setVfLogs((prev) => [
          `[CDV Service] Mise à jour du cycle de vie VISIOfact : Statut « Livré »`,
          `[Supervision OpenSearch] Trace indexée dans le cluster sans erreur.`,
          ...prev
        ]);
      }, 4000);
    } else {
      setTimeout(() => {
        setVfStep(2);
        setVfLogs((prev) => [
          `[OutboundTransportPort] Appel du conteneur Java natif (phase4 AS4 / ebMS3 - Licence Apache 2.0)...`,
          `[OpenBao Secrets] Récupération sécurisée du certificat PKI et de la clé privée de signature.`,
          `[Résolution F3/F4 SML/SMP] Découverte dynamique de l'Access Point destinataire (URL ebMS3 + Certificat partenaire via phoss SMP).`,
          ...prev
        ]);
      }, 1300);

      setTimeout(() => {
        setVfStep(3);
        setVfLogs((prev) => [
          `[Signature F6 WS-Security] Message signé cryptographiquement et chiffré selon profil Peppol AS4.`,
          `[Envoi F5 ebMS3 direct] Connexion TLS directe vers l'Access Point distant (sans intermédiaire).`,
          `[Receipt F7 AS4 / MDN] Réception du récépissé signé par le destinataire (Contrôle anti-rejeu OK).`,
          ...prev
        ]);
      }, 2700);

      setTimeout(() => {
        setVfStep(4);
        setIsVfSimulating(false);
        setCurrentInvoiceCdv('LIVRÉ DIRECTEMENT EN NATIF (AS4 Confirmé)');
        setVfLogs((prev) => [
          `[CDV F9 Réseau] Échange de statuts bidirectionnel confirmé avec l'AP partenaire.`,
          `[Supervision F11] Traces et métriques consolidées dans OpenSearch.`,
          `[Autonomie Complète] Facture émise en 100% natif, zéro dépendance tierce.`,
          ...prev
        ]);
      }, 4200);
    }
  };

  const resetPeppolSim = () => {
    setVfStep(0);
    setIsVfSimulating(false);
    setVfLogs([]);
    setCurrentInvoiceCdv('DÉPOSÉ (Draft)');
  };

  const currentEmailText =
    emailVersion === 'agent-ia'
      ? emailAgentIaToFriderich
      : emailVersion === 'targeted'
      ? targetedEmailToFriderich
      : emailVersion === 'official'
      ? officialValidatedEmailToFriderich
      : emailVersion === 'short'
      ? shortEmailToFriderich
      : officialEmailToFriderich;

  const currentEmailSubject =
    emailVersion === 'agent-ia'
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

      {/* VISIOfact Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-3.5 text-xs">
        <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Scale className="w-4 h-4" />
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2 flex-wrap justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Projet VISIOfact · Point d'Accès Peppol & Candidature PDP
              </span>
              <Badge label="DGFiP Début Janvier 2027" variant="success" size="sm" />
              <Badge label="B2Brouter Opérationnel en Prod" variant="info" size="sm" />
            </div>
            <button
              onClick={() => {
                const text = `Projet VISIOfact : B2Brouter en production active (10 jours réalisés), sécurisant le dépôt du dossier DGFiP début janvier 2027 sans bloquer CaptureMind.
Accès Peppol Natif : Développement prévu en 25 à 30 jours ouvrés (conteneur Java autonome phase4 / ebMS3 AS4 sous licence Apache 2.0 permissive, phoss SMP sous MPL 2.0), garantissant une autonomie complète sans redevance tierce ni contamination du code propriétaire.
Calendrier & Stratégie : 27 jours de socle PDP déjà validés en production (TECT OEC / ONLYCOMPTA). Enchaînement des travaux : CaptureMind HUB en priorité absolue (25-30j), puis déploiement de l'accès Peppol natif VISIOfact en temps masqué ou en parallèle.`;
                navigator.clipboard.writeText(text);
                alert('Briefing VISIOfact copié dans le presse-papier !');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copier Briefing</span>
            </button>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
            27 jours de socle PDP déjà validés en production (TECT OEC / ONLYCOMPTA activé). Maintien temporaire de la passerelle B2Brouter pour sécuriser le dépôt légal sans bloquer CaptureMind.
          </p>
        </div>
      </div>

      {/* Unified VISIOfact Briefing Block (Unseparated) */}
      <div className="text-slate-200 text-xs font-mono leading-relaxed whitespace-pre-wrap p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
Projet VISIOfact : B2Brouter en production active (10 jours réalisés), sécurisant le dépôt du dossier DGFiP début janvier 2027 sans bloquer CaptureMind.
Accès Peppol Natif : Développement prévu en 25 à 30 jours ouvrés (conteneur Java autonome phase4 / ebMS3 AS4 sous licence Apache 2.0 permissive, phoss SMP sous MPL 2.0), garantissant une autonomie complète sans redevance tierce ni contamination du code propriétaire.
Calendrier & Stratégie : 27 jours de socle PDP déjà validés en production (TECT OEC / ONLYCOMPTA). Enchaînement des travaux : CaptureMind HUB en priorité absolue (25-30j), puis déploiement de l'accès Peppol natif VISIOfact en temps masqué ou en parallèle.
      </div>

      {/* ======================================================== */}
      {/* ============ VUE 1 : DÉCISIONS & LICENCES PEPPOL ======= */}
      {/* ======================================================== */}
      {activeViewId === 'decisions' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Architecture Peppol AS4 & Analyse Juridique des Licences
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparatif d'arbitrage : Maintien B2Brouter (Option A) vs Composant AS4 Natif phase4/Oxalis (Option B).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Option A : B2Brouter */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Option A : Passerelle B2Brouter (Actuelle)</h2>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">10j Réalisés en Production</span>
                  </div>
                  <Badge label="Opérationnel" variant="success" size="sm" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  B2Brouter est déjà connecté via notre client REST FastAPI. Le contrat commercial couvre le transport ebMS3 et l'accès Peppol international.
                </p>
                <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <div>• <strong>Impact DGFiP :</strong> Zéro blocage, déclaré comme opérateur partenaire.</div>
                  <div>• <strong>Temps de dév requis :</strong> 0 jour bloquant.</div>
                  <div>• <strong>Arbitrage :</strong> M. Iliev confirme les aspects contractuels.</div>
                </div>
              </div>

              {/* Option B : Natif phase4 */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Option B : Point d'Accès Natif (phase4 / Oxalis)</h2>
                    <span className="text-[11px] text-sky-600 dark:text-sky-400 font-mono">25 à 30 Jours Ouvrés</span>
                  </div>
                  <Badge label="Apache 2.0" variant="info" size="sm" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Conteneur Java autonome avec phase4 ebMS3 AS4 et phoss SMP (MPL 2.0). 100% libre de droit commercial sans contamination de VISIOfact.
                </p>
                <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <div>• <strong>Licence :</strong> Apache 2.0 permissive (sans redevance).</div>
                  <div>• <strong>Isolation :</strong> Conteneur Docker dédié, code VISIOfact fermé.</div>
                  <div>• <strong>Enchaînement :</strong> Réalisé après CaptureMind ou en parallèle.</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ============ VUE 2 : SIMULATEUR 4-CORNER PEPPOL ======== */}
      {/* ======================================================== */}
      {activeViewId === 'peppol-flux' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Simulateur Interactif Réseau Peppol (Modèle 4-Corner AS4)
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Observez le transit d'une facture Factur-X / UBL entre les 4 coins du réseau international.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={runVisiofactPeppolSim}
                  disabled={isVfSimulating}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isVfSimulating ? 'Émission en cours...' : 'Émettre Facture Peppol'}</span>
                </button>

                <button
                  onClick={resetPeppolSim}
                  disabled={isVfSimulating}
                  className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  title="Réinitialiser"
                  aria-label="Réinitialiser la simulation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Mode de transport :</span>
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                <button
                  onClick={() => {
                    setPeppolMode('b2brouter');
                    resetPeppolSim();
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    peppolMode === 'b2brouter'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700'
                  }`}
                >
                  Mode A : Passerelle B2Brouter (En Prod)
                </button>
                <button
                  onClick={() => {
                    setPeppolMode('native-phase4');
                    resetPeppolSim();
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    peppolMode === 'native-phase4'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700'
                  }`}
                >
                  Mode B : Conteneur AS4 Natif (phase4)
                </button>
              </div>
            </div>

            {/* 4-Corner Visual Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              
              {/* Corner 1 */}
              <div className={`p-4 rounded-xl border transition-all ${vfStep >= 1 ? 'bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-md ring-1 ring-emerald-400/30' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${vfStep >= 1 ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'}`}>Coin 1 (Émetteur)</span>
                  <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xs font-bold text-slate-900 dark:text-white">VISIOfact / Client</h2>
                <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">Génération du XML Factur-X / UBL dans le pipeline Delivery.</p>
              </div>

              {/* Corner 2 */}
              <div className={`p-4 rounded-xl border transition-all ${vfStep >= 2 ? 'bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-md ring-1 ring-emerald-400/30' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${vfStep >= 2 ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'}`}>Coin 2 (Notre AP)</span>
                  <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                  {peppolMode === 'native-phase4' ? 'AP phase4 (Natif)' : 'B2Brouter (Tiers)'}
                </h2>
                <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">
                  {peppolMode === 'native-phase4' ? 'Signature WS-Security, SML/SMP et chiffrement AS4.' : 'Envoi REST vers API B2Brouter.'}
                </p>
              </div>

              {/* Corner 3 */}
              <div className={`p-4 rounded-xl border transition-all ${vfStep >= 3 ? 'bg-white dark:bg-slate-900 border-2 border-sky-500 shadow-md ring-1 ring-sky-400/30' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${vfStep >= 3 ? 'text-sky-700 dark:text-sky-300' : 'text-slate-700 dark:text-slate-300'}`}>Coin 3 (AP Destinataire)</span>
                  <Globe2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                </div>
                <h2 className="text-xs font-bold text-slate-900 dark:text-white">Access Point Distant</h2>
                <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">Réception ebMS3, contrôle d'intégrité et renvoi du reçu (Receipt).</p>
              </div>

              {/* Corner 4 */}
              <div className={`p-4 rounded-xl border transition-all ${vfStep === 4 ? 'bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-md ring-1 ring-emerald-400/30' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${vfStep === 4 ? 'text-purple-700 dark:text-purple-300' : 'text-slate-700 dark:text-slate-300'}`}>Coin 4 (Destinataire)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xs font-bold text-slate-900 dark:text-white">Logiciel / ERP Client</h2>
                <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">Réception finale et mise à jour des statuts CDV dans VISIOfact.</p>
              </div>

            </div>

            {/* Status & OpenSearch Console Logs */}
            <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-emerald-400 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Console Réseau AS4 / OpenSearch Logs
                </span>
                <span className="text-xs text-slate-300 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Statut CDV : {currentInvoiceCdv}
                </span>
              </div>
              <div className="min-h-24 max-h-48 overflow-y-auto space-y-1.5 p-1 text-xs custom-scrollbar text-emerald-300">
                {vfLogs.length === 0 ? (
                  <div className="flex items-center gap-2.5 py-4 px-3 text-slate-300 border border-dashed border-slate-700 rounded-lg bg-slate-900/60">
                    <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-sans font-medium text-xs">
                      Console prête — En attente du déclenchement. Cliquez sur « Émettre Facture Peppol » pour observer le flux en direct.
                    </span>
                  </div>
                ) : (
                  vfLogs.map((l, i) => <div key={i} className="leading-relaxed">&gt; {l}</div>)
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ============ VUE 3 : JALONS CLÉS (50-60J) ============== */}
      {/* ======================================================== */}
      {activeViewId === 'planning' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sky-500" />
                  Grand Tableau des 4 Jalons & Dépendances (50 à 60 jours au total)
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ordre de priorité : finaliser CaptureMind avant de concentrer les efforts sur le point d'accès Peppol natif.
                </p>
              </div>

              <Badge label="Enchaînement sans bloquer la DGFiP" variant="info" size="sm" />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-4 font-bold">Sujet</th>
                    <th className="py-3 px-4 font-bold">Estimation / Échéance</th>
                    <th className="py-3 px-4 font-bold">Priorité</th>
                    <th className="py-3 px-4 font-bold">Principales étapes et dépendances</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                  {planningMilestones.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{m.subject}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">{m.estimation}</td>
                      <td className="py-3.5 px-4">
                        <Badge label={m.priority} variant={m.priority === 'Priorité 1' ? 'warning' : m.priority === 'Objectif Fixe' ? 'success' : 'info'} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 max-w-md">
                        <div>{m.stepsAndDependencies}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{m.details}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total summary card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-white">
                  Total Développement Interne : 50 à 60 jours ouvrés
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  (CaptureMind 25-30j + Peppol Natif 25-30j). Les démarches externes (OpenPeppol, certificats PKI, API PPF) avancent en temps masqué.
                </p>
              </div>
              <span className="px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold font-mono text-xs">
                50 à 60 j.o.
              </span>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ============ VUE 4 : OUTILS & BIBLIOTHÈQUES ============ */}
      {/* ======================================================== */}
      {activeViewId === 'outils' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Cartographie du Flux Peppol & Boîte à Outils (VISIOfact)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Détail de chaque composant de transport, validation Schematron, PKI et gestion des statuts réseau.
            </p>

            <div className="space-y-3.5">
              {visiofactStack.map((item) => (
                <div
                  key={item.stepNum}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="h-6 w-6 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold font-mono text-xs flex items-center justify-center">
                        {item.stepNum}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{item.stepName}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">({item.toolType})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800">
                        {item.toolName}
                      </span>
                      <Badge
                        label={item.license}
                        variant={item.licenseStatus === 'Permissive (Libre)' ? 'success' : item.licenseStatus === 'Contrat Commercial' ? 'info' : 'purple'}
                        size="sm"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {item.role}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px]">
                    <div>
                      <span className="text-slate-400 block font-semibold">Entrée / Sortie :</span>
                      <span className="text-slate-700 dark:text-slate-300 font-mono">{item.inputOutput}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Stockage & Base :</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-mono">{item.memoryStorage}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Atout Clé :</span>
                      <span className="text-indigo-700 dark:text-indigo-300">{item.keyFeature}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ============ VUE 5 : BILAN 27J & MATRICE 13 BRIQUES ===== */}
      {/* ======================================================== */}
      {activeViewId === 'rapport' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Bilan des 27 Jours Réalisés & Matrice des 13 Briques Peppol AS4
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Relevé exact des travaux réalisés en production depuis avril 2026 et audit exhaustif des briques réglementaires DGFiP.
            </p>

            {/* 3 Blocks of 27 Days */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Socle PDP VISIOfact</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">9 Jours</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Gestion des flux Factur-X et PostgreSQL.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Moteur de Routage</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">8 Jours</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">OutboundTransportPort & gestion des statuts CDV.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Passerelle B2Brouter</span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">10 Jours</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">En production active (client ONLYCOMPTA activé).</p>
              </div>
            </div>

            {/* 13 Features Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 pt-2">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3 font-bold">Code</th>
                    <th className="py-2.5 px-3 font-bold">Exigence Technique</th>
                    <th className="py-2.5 px-3 font-bold">Périmètre</th>
                    <th className="py-2.5 px-3 font-bold">Statut de Réalisation</th>
                    <th className="py-2.5 px-3 font-bold">Spécifications & Détails</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                  {peppolFeatures.map((f) => (
                    <tr key={f.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{f.code}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{f.title}</td>
                      <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{f.scope}</td>
                      <td className="py-2.5 px-3">
                        <Badge
                          label={f.status}
                          variant={f.status === 'Socle existant à adapter' ? 'success' : f.status === 'Inclus dans estimation' ? 'info' : 'warning'}
                          size="sm"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 max-w-sm">{f.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ============ VUE 6 : LETTRE OFFICIELLE DIRECTION ======= */}
      {/* ======================================================== */}
      {activeViewId === 'email' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Lettre Officielle d'Arbitrage Peppol & DGFiP
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Synthèse complète à l'attention de Romain Friderich avec relais formel à Georgi Iliev.
                </p>
              </div>

              <button
                onClick={copyEmailToClipboard}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-colors flex items-center gap-2 cursor-pointer shrink-0"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4 text-white" />}
                <span>{copiedEmail ? 'Lettre Copiée !' : 'Copier le Texte'}</span>
              </button>
            </div>

            {/* Version Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setEmailVersion('targeted')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  emailVersion === 'targeted'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700'
                }`}
              >
                1. Synthèse 4 Points (Recommandée)
              </button>
              <button
                onClick={() => setEmailVersion('official')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  emailVersion === 'official'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700'
                }`}
              >
                2. Version Complète (3 Sections)
              </button>
              <button
                onClick={() => setEmailVersion('short')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  emailVersion === 'short'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700'
                }`}
              >
                3. Version Courte (Relais M. Iliev)
              </button>
              <button
                onClick={() => setEmailVersion('detailed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  emailVersion === 'detailed'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700'
                }`}
              >
                4. Mémo Exhaustif
              </button>
            </div>

            {/* Meta */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 space-y-1">
              <div><strong className="text-slate-900 dark:text-white">À :</strong> Romain FRIDERICH &lt;rfriderich@digipepss.pro&gt;</div>
              <div><strong className="text-slate-900 dark:text-white">De :</strong> Jean Elson (Lead Développeur) & Georgi Iliev</div>
              <div><strong className="text-slate-900 dark:text-white">Objet :</strong> {currentEmailSubject}</div>
            </div>

            {/* Message Body */}
            <div className="p-5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap border border-slate-800 custom-scrollbar">
              {currentEmailText}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
