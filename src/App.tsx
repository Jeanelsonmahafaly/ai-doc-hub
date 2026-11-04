import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  Cpu,
  Layers,
  Database,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Server,
  Send,
  Building2,
  AlertTriangle,
  FileCheck2,
  Workflow,
  Zap,
  CheckCircle2,
  ArrowRight,
  Play,
  RotateCcw,
  Activity,
  FileText,
  Terminal,
  Trash2,
  Network,
  Calendar,
  Lock,
  Globe2,
  FolderGit2,
  Briefcase,
  ExternalLink,
  ChevronDown,
  Radio,
  Share2,
  Sliders,
  Clock,
  FileSpreadsheet,
  Boxes,
  Code2,
  KeyRound,
  CheckSquare,
  HelpCircle,
  Eye,
  BookOpen,
  Scale
} from 'lucide-react';

interface DecisionItem {
  id: number;
  subject: string;
  status: 'Confirmé' | 'Hypothèse à tester' | 'Après présentation' | 'Déjà Existant chez M. Flore';
  choice: string;
  explanation: string;
}

export interface RecetteItem {
  id: string;
  category: string;
  title: string;
  responsible: string;
  dateTarget: string;
  description: string;
  technicalValidation: string;
  checked: boolean;
  priority: 'Bloquant Recette' | 'Majeur' | 'Conformité';
}

interface InvoicePreset {
  id: string;
  title: string;
  type: 'Factur-X' | 'PDF Scanné' | 'Nouveau Fournisseur';
  supplier: string;
  siren: string;
  amountHT: number;
  vatRate: number;
  amountTTC: number;
  confidence: number;
  suggestedAccount: string;
  suggestedSubAccount: string;
  fileName: string;
  fileSizeKB: number;
}

interface TechToolItem {
  stepNum: number;
  stepName: string;
  toolName: string;
  toolType: string;
  license: string;
  licenseStatus: 'Permissive (Libre)' | 'Propriétaire' | 'Contrat Commercial';
  role: string;
  inputOutput: string;
  memoryStorage: string;
  keyFeature: string;
}

interface MilestoneItem {
  subject: string;
  estimation: string;
  priority: 'Priorité 1' | 'Objectif Fixe' | 'Enchaînement' | 'Conditionné';
  priorityBadge: string;
  stepsAndDependencies: string;
  details: string;
}

export interface AuditQuestion {
  id: string;
  axeNum: number;
  axeTitle: string;
  question: string;
  whyCrucial: string;
  targetContact: string;
  status: 'À vérifier' | 'En cours d’analyse' | 'Clarifié';
  clarification: string;
}

const auditQuestionsList: AuditQuestion[] = [
  // AXE 1 : CODE SOURCE & DÉPENDANCES OPENCAPTURE
  {
    id: 'Q1.1',
    axeNum: 1,
    axeTitle: 'Code Source & Architecture Existante',
    question: 'Où se trouve le code actuel de CaptureMind et quels composants sont actifs ?',
    whyCrucial: 'Permet d’isoler la logique métier utile (Database.py, VisioCompte.py, verifier_exports.py) et de débrancher le moteur OpenCapture lourd.',
    targetContact: 'Jean Elson / Codebase',
    status: 'Clarifié',
    clarification: 'Confirmé dans AGENTS.md : code Python modulaire avec backend psycopg3, VisioCompte.py (REST), verifier_exports.py (XML/JSON), et controllers/accounts.py.'
  },
  {
    id: 'Q1.2',
    axeNum: 1,
    axeTitle: 'Dépendances & Licences à Risque (AGPL)',
    question: 'Quelles sont les bibliothèques d’extraction actuellement chargées dans le code ?',
    whyCrucial: 'Éliminer définitivement PyMuPDF (AGPL) et Tesseract CPU pour basculer sur des librairies permissives (pypdfium2 / Apache 2.0).',
    targetContact: 'Jean Elson / DevOps',
    status: 'Clarifié',
    clarification: 'Actuellement : extraction OCR 100% CPU via pytesseract (Tesseract). Remplacement acté par pypdfium2 (parsing PDF en RAM) et modèles permissifs sur GPU.'
  },
  {
    id: 'Q1.3',
    axeNum: 1,
    axeTitle: 'Déclencheur d’Ingestion (Point d’Entrée)',
    question: 'Dans le flux actuel, quel composant déclenche l’arrivée d’une facture dans CaptureMind ?',
    whyCrucial: 'Déterminer si FERnest pousse le document en HTTP POST multipart ou si CaptureMind scrute un dossier/cron.',
    targetContact: 'Équipe FERnest / Jean Elson',
    status: 'En cours d’analyse',
    clarification: 'À valider : FERnest appelle-t-il directement l’API CaptureMind par POST, ou le dépôt initial se fait-il dans un répertoire d’ingestion surveillé ?'
  },

  // AXE 2 : BASE DE DONNÉES & DETTE DISQUE (CONFIRMATION VUL-001)
  {
    id: 'Q2.1',
    axeNum: 2,
    axeTitle: 'SGBD PostgreSQL & Tables Existantes',
    question: 'Quel SGBD est utilisé et que stocke la base de données actuelle ?',
    whyCrucial: 'Comprendre le modèle de données existant pour le réutiliser sans rupture.',
    targetContact: 'Database.py / PostgreSQL',
    status: 'Clarifié',
    clarification: 'PostgreSQL (psycopg 3, row_factory=dict_row). Tables : documents (avec JSONB positions/pages/datas), accounts_supplier, accounts_customer, accounting_plan, history. Aucun BLOB en base.'
  },
  {
    id: 'Q2.2',
    axeNum: 2,
    axeTitle: 'Stockage Fichiers Physique (Dette Disque VUL-001)',
    question: 'Où sont stockés les fichiers physiques (PDF originaux, images pleine page, miniatures) ?',
    whyCrucial: 'Confirme le diagnostic de saturation disque et la nécessité absolue du HUB 100% RAM.',
    targetContact: 'Audit / Hetzner',
    status: 'Clarifié',
    clarification: 'Stockage sur disque via docservers (/var/docservers en production Hetzner). VUL-001 confirmé : occupation disque critique à ~97% ! La bascule 100% RAM résout définitivement ce problème.'
  },
  {
    id: 'Q2.3',
    axeNum: 2,
    axeTitle: 'Rôle de PostgreSQL dans le HUB Cible',
    question: 'Comment conservons-nous les référentiels de comptes dans la cible 100% en RAM ?',
    whyCrucial: 'Séparer strictement les métadonnées légères (comptes, règles) des flux documentaires volatils.',
    targetContact: 'Jean Elson / Architecture',
    status: 'En cours d’analyse',
    clarification: 'Conserver PostgreSQL uniquement pour les tables légères de référentiel (tiers et plans comptables), en supprimant tout docserver physique. Le document lui-même reste 100% en RAM.'
  },

  // AXE 3 : INTERFACES AVEC FERNEST (POINT D’ENTRÉE & SORTIE)
  {
    id: 'Q3.1',
    axeNum: 3,
    axeTitle: 'Canal d’Ingestion et Authentification',
    question: 'Comment s’effectue la communication réseau avec FERnest (VisioCompte) ?',
    whyCrucial: 'Calibrer le connecteur client FastAPI pour dialoguer avec https://visiocompte.pro.',
    targetContact: 'VisioCompte.py',
    status: 'Clarifié',
    clarification: 'HTTP REST via urllib3.PoolManager (classe VisioCompte.py). Authentification par POST login/password, upload multipart/form-data. URL : https://visiocompte.pro (config.ini).'
  },
  {
    id: 'Q3.2',
    axeNum: 3,
    axeTitle: 'Format de Restitution des Écritures',
    question: 'Sous quel format FERnest attend-il les résultats d’extraction et écritures comptables ?',
    whyCrucial: 'Assurer une compatibilité descendante parfaite sans obliger FERnest à redévelopper son connecteur.',
    targetContact: 'verifier_exports.py',
    status: 'Clarifié',
    clarification: 'XML export principal via export_xml() (<ROOT> contenant <TECHNICAL> + <DATAS> : champs, taxes, lignes), ainsi que flux JSON via l’API VisioCompte.'
  },
  {
    id: 'Q3.3',
    axeNum: 3,
    axeTitle: 'Boucle de Rétroaction Comptable',
    question: 'Existe-t-il une notification de validation/correction par FERnest vers CaptureMind ?',
    whyCrucial: 'Savoir si le lien de feedback comptable (Human-in-the-loop) existe déjà ou doit être créé.',
    targetContact: 'splitter_exports.py',
    status: 'Clarifié',
    clarification: 'Actuellement non implémentée : splitter_exports.py::export_batch_to_visiocompte() est mort/cassé. Le flux actuel est 100% unidirectionnel (CaptureMind -> FERnest).'
  },

  // AXE 4 : BIBLIOTHÈQUES MÉTIER & RÈGLES COMPTABLES (M. FLORE)
  {
    id: 'Q4.1',
    axeNum: 4,
    axeTitle: 'Format des Livrables de M. Flore',
    question: 'Sous quel format les règles et référentiels de M. Flore sont-ils modélisés ?',
    whyCrucial: 'Faciliter l’importation des 4 éléments comptables validés par R. Friderich sans redéveloppement.',
    targetContact: 'M. Flore / PostgreSQL',
    status: 'Clarifié',
    clarification: 'Le modèle cible est relationnel PostgreSQL (tables accounting_plan, accounts_supplier, accounts_customer avec SIREN, SIRET, TVA, IBAN). Recommandation : dump SQL ou export JSON/CSV.'
  },
  {
    id: 'Q4.2',
    axeNum: 4,
    axeTitle: 'Algorithme de Matching des Tiers',
    question: 'Comment s’effectue actuellement l’identification des fournisseurs ?',
    whyCrucial: 'Passer d’un matching basique par sous-chaîne SQL à un matching robuste combinant SIREN strict et distance de Levenshtein.',
    targetContact: 'controllers/accounts.py',
    status: 'Clarifié',
    clarification: 'Actuellement : simple recherche SQL LIKE sur siren et LOWER(name) LIKE \'%search%\' (lignes 47, 80, 127). Aucun Levenshtein. Cible : ajouter le matching flou pour dépasser 95% de précision.'
  },

  // AXE 5 : INFRASTRUCTURE D’EXÉCUTION & GPU (ALPHONSE)
  {
    id: 'Q5.1',
    axeNum: 5,
    axeTitle: 'Accès au GPU & Serveur LexIA',
    question: 'Le GPU est-il utilisé dans le code actuel et comment préparer le serveur LexIA ?',
    whyCrucial: 'Séparer le legacy OpenCapture (CPU) du nouveau banc d’essai IA GPU (RTX 4000 Ada - 20 Go).',
    targetContact: 'Alphonse / LexIA',
    status: 'Clarifié',
    clarification: 'Le code OpenCapture n’utilise aucun GPU (100% Tesseract CPU). Les tests Hasina (PaddleOCR, Qwen) étaient hors codebase. Le banc d’essai LexIA est le premier banc GPU officiel.'
  },
  {
    id: 'Q5.2',
    axeNum: 5,
    axeTitle: 'Localisation du Corpus des 100 Factures',
    question: 'Où se situe le corpus témoin des factures pour le banc d’essai ?',
    whyCrucial: 'Disposer immédiatement du jeu de données pour comparer les 3 approches d’inférence.',
    targetContact: 'Hetzner / /var/docservers',
    status: 'Clarifié',
    clarification: 'Identifié sous opencapture/docs/docservers/ (splitter/batches, verifier/original_doc) et /var/docservers sur Hetzner. À packager en échantillon représentatif de 100 factures.'
  },
  {
    id: 'Q5.3',
    axeNum: 5,
    axeTitle: 'Contrat Spatial IA à Préserver',
    question: 'Quel est le contrat de données entre le moteur de lecture et le reste de l’application ?',
    whyCrucial: 'Garantir que l’agent IA (Phase 2 - Alphonse) pourra exploiter les résultats sans rupture.',
    targetContact: 'Contrat IA / Phase 2',
    status: 'Clarifié',
    clarification: 'Contrat clé : objet datas = { datas, positions, pages } (valeur + coordonnées spatiales boîte englobante + numéro de page). C’est le contrat socle à préserver pour l’agent IA.'
  },
  {
    id: 'Q5.4',
    axeNum: 5,
    axeTitle: 'Mode d’Inférence sur LexIA (Alphonse)',
    question: 'Comment invoquerons-nous les modèles IA sur le serveur partagé LexIA (RTX 4000 Ada) ?',
    whyCrucial: 'Choisir entre un micro-service vLLM / API FastAPI GPU conteneurisé ou des scripts directs en environnement partagé.',
    targetContact: 'Alphonse (GPU)',
    status: 'En cours d’analyse',
    clarification: 'Recommandé : conteneur Docker léger avec vLLM ou serveur FastAPI GPU dédié pour isoler l’inférence du reste de la machine.'
  }
];

export interface DayPlanItem {
  day: number;
  date: string;
  week: number;
  phase: string;
  phaseColor: string;
  title: string;
  description: string;
  deliverable: string;
  owner: string;
  status: 'Terminé' | 'En cours' | 'Priorité Immédiate' | 'À venir' | 'Bloquant Sarobidy';
}

export const full30DaysPlan: DayPlanItem[] = [
  // SEMAINE 1 : PHASE 0 — AUDIT & PRÉPARATION (02/11/2026 au 06/11/2026)
  {
    day: 1,
    date: '02/11/2026',
    week: 1,
    phase: 'Phase 0 : Audit & Cadrage',
    phaseColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    title: 'Audit approfondi de la codebase existante',
    description: 'Analyse de Database.py, VisioCompte.py, verifier_exports.py. Découverte de VUL-001 (saturation disque 97% sur Hetzner /var/docservers).',
    deliverable: 'Rapport d’audit des 15 questions techniques sur les 5 axes.',
    owner: 'Jean Elson',
    status: 'Terminé'
  },
  {
    day: 2,
    date: '03/11/2026',
    week: 1,
    phase: 'Phase 0 : Audit & Cadrage',
    phaseColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    title: 'Arbitrage des 4 orientations majeures',
    description: 'Validation de l’ingestion POST multipart en RAM, conservation de PostgreSQL pour référentiels légers, XML historique pour FERnest.',
    deliverable: 'Validation d’architecture actée par R. Friderich et l’équipe.',
    owner: 'Jean Elson & R. Friderich',
    status: 'Terminé'
  },
  {
    day: 3,
    date: '04/11/2026',
    week: 1,
    phase: 'Phase 0 : Audit & Cadrage',
    phaseColor: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    title: 'Extraction du corpus des 100 factures réelles',
    description: 'Extraction depuis /var/docservers/verifier/original_doc/ sur Hetzner par Sarobidy (30 Factur-X/PDF natifs, 40 scans, 30 cas complexes).',
    deliverable: 'Archive corpus_test_100/ disponible pour le banc d’essai.',
    owner: 'Sarobidy & Équipe Infra',
    status: 'Bloquant Sarobidy'
  },
  {
    day: 4,
    date: '05/11/2026',
    week: 1,
    phase: 'Phase 0 : Audit & Cadrage',
    phaseColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    title: 'Récupération des référentiels comptables chez M. Flore',
    description: 'Extraction des tables PostgreSQL existantes (accounting_plan, accounts_supplier, accounts_customer) et règles de TVA.',
    deliverable: 'Dump SQL / JSON des plans de comptes et tiers qualifiés.',
    owner: 'M. Flore & Jean Elson',
    status: 'En cours'
  },
  {
    day: 5,
    date: '06/11/2026',
    week: 1,
    phase: 'Phase 0 : Audit & Cadrage',
    phaseColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    title: 'Préparation du serveur GPU LexIA avec Alphonse',
    description: 'Vérification de l’environnement NVIDIA RTX 4000 Ada (20 Go VRAM), drivers CUDA 12, PyTorch et venv Python pour les tests.',
    deliverable: 'Serveur LexIA prêt et accessible pour le banc d’essai.',
    owner: 'Alphonse & Jean Elson',
    status: 'Priorité Immédiate'
  },

  // SEMAINE 2 : PHASE 1 — BANC D'ESSAI COMPARATIF GPU (100 FACTURES) (09/11/2026 au 13/11/2026)
  {
    day: 6,
    date: '09/11/2026',
    week: 2,
    phase: 'Phase 1 : Benchmark GPU',
    phaseColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    title: 'Qualification et annotation du corpus témoin',
    description: 'Indexation des 100 factures avec vérité terrain (SIREN attendu, montants HT/TVA/TTC réels, comptes comptables cibles).',
    deliverable: 'Fichier ground_truth.json pour calculer le taux d’exactitude.',
    owner: 'Jean Elson & M. Flore',
    status: 'À venir'
  },
  {
    day: 7,
    date: '10/11/2026',
    week: 2,
    phase: 'Phase 1 : Benchmark GPU',
    phaseColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    title: 'Banc d’essai Approche 1 : Multimodale Directe',
    description: 'Inférence vision-language directe sur images entières de factures. Mesure du taux d’extraction, temps par page et conso VRAM.',
    deliverable: 'Rapport de mesure métrique Approche 1.',
    owner: 'Jean Elson & Alphonse',
    status: 'À venir'
  },
  {
    day: 8,
    date: '11/11/2026',
    week: 2,
    phase: 'Phase 1 : Benchmark GPU',
    phaseColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    title: 'Banc d’essai Approche 2 : OCR + LLM (PaddleOCR-VL / Qwen)',
    description: 'Extraction spatialisée du texte par OCR puis structuration comptable par modèle de langage compact. Évaluation de la latence.',
    deliverable: 'Rapport de mesure métrique Approche 2.',
    owner: 'Jean Elson & Alphonse',
    status: 'À venir'
  },
  {
    day: 9,
    date: '12/11/2026',
    week: 2,
    phase: 'Phase 1 : Benchmark GPU',
    phaseColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    title: 'Banc d’essai Approche 3 : Aiguillage Hybride',
    description: 'Bypass immédiat via pypdfium2 pour Factur-X/PDF texte natif (0 GPU), et routage GPU uniquement sur les scans dégradés.',
    deliverable: 'Rapport de mesure métrique Approche 3 (Comparatif croisé).',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 10,
    date: '13/11/2026',
    week: 2,
    phase: 'Phase 1 : Benchmark GPU',
    phaseColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    title: 'Restitution du Benchmark & Choix Définitif',
    description: 'Synthèse objective des résultats (taux de réussite >95%, latence <2s, empreinte GPU). Revue conjointe avec Romain Friderich.',
    deliverable: 'Décision formelle actée du moteur retenu pour le HUB.',
    owner: 'Jean Elson & R. Friderich',
    status: 'À venir'
  },

  // SEMAINE 3 : PHASE 2 — SERVICE IA DOCUMENTAIRE FASTAPI (100% RAM) (16/11/2026 au 20/11/2026)
  {
    day: 11,
    date: '16/11/2026',
    week: 3,
    phase: 'Phase 2 : Service IA FastAPI',
    phaseColor: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    title: 'Initialisation du micro-service FastAPI indépendant',
    description: 'Création du projet autonome Python 3.11, Uvicorn, Pydantic v2. Configuration CORS, mTLS et gestionnaire d’exceptions.',
    deliverable: 'Dépôt et squelette de service opérationnel indépendant d’OpenCapture.',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 12,
    date: '17/11/2026',
    week: 3,
    phase: 'Phase 2 : Service IA FastAPI',
    phaseColor: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    title: 'Endpoint d’ingestion streaming POST /api/v1/extract',
    description: 'Réception du flux multipart en mémoire vive via io.BytesIO. Aucune écriture sur le système de fichiers hôte.',
    deliverable: 'Endpoint fonctionnel validé par tests unitaires en RAM.',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 13,
    date: '18/11/2026',
    week: 3,
    phase: 'Phase 2 : Service IA FastAPI',
    phaseColor: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    title: 'Intégration du moteur pypdfium2 (Factur-X & PDF natif)',
    description: 'Détection et parsing XML Factur-X en mémoire, ou extraction de texte natif avec boîtes englobantes sans GPU.',
    deliverable: 'Pipeline PDF natif ultra-rapide (<100ms par document).',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 14,
    date: '19/11/2026',
    week: 3,
    phase: 'Phase 2 : Service IA FastAPI',
    phaseColor: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    title: 'Intégration du moteur IA retenu pour les scans sur LexIA',
    description: 'Connexion au runtime GPU pour les images scannées. Production du contrat JSON : datas = { datas, positions, pages }.',
    deliverable: 'Contrat spatial respecté à 100% pour la future Phase 2 Alphonse.',
    owner: 'Jean Elson & Alphonse',
    status: 'À venir'
  },
  {
    day: 15,
    date: '20/11/2026',
    week: 3,
    phase: 'Phase 2 : Service IA FastAPI',
    phaseColor: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    title: 'Conteneurisation read-only & Purge déterministe RAM',
    description: 'Dockerfile multi-stage, montage en read-only-fs sans volume disque. Implémentation de del buffer et gc.collect().',
    deliverable: 'Conteneur Docker stateless certifié 0 octet résiduel.',
    owner: 'Jean Elson & DevOps',
    status: 'À venir'
  },

  // SEMAINE 4 : PHASE 3 — HUB ORCHESTRATEUR CAPTUREMIND & TIERS (23/11/2026 au 27/11/2026)
  {
    day: 16,
    date: '23/11/2026',
    week: 4,
    phase: 'Phase 3 : HUB Orchestrateur',
    phaseColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    title: 'Refonte du point d’entrée /ws/ingest dans CaptureMind',
    description: 'Suppression des appels à files.move_to_docservers(). Ingestion directe en RAM et transmission au Service IA FastAPI.',
    deliverable: 'CaptureMind libéré de toute écriture sur Hetzner /var/docservers.',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 17,
    date: '24/11/2026',
    week: 4,
    phase: 'Phase 3 : HUB Orchestrateur',
    phaseColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    title: 'Client d’orchestration asynchrone HTTP interne',
    description: 'Appel du Service IA FastAPI avec gestion des timeouts, retries et circuit-breaker sur erreur.',
    deliverable: 'Communication robuste inter-services avec trace unique Job-ID.',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 18,
    date: '25/11/2026',
    week: 4,
    phase: 'Phase 3 : HUB Orchestrateur',
    phaseColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    title: 'Moteur de Matching Tiers (SIREN + Levenshtein)',
    description: 'Rapprochement des tiers dans PostgreSQL (accounts_supplier) par SIREN strict puis recherche floue sur raison sociale (remplace le simple LIKE).',
    deliverable: 'Taux de reconnaissance des tiers >95% sur factures réelles.',
    owner: 'Jean Elson & M. Flore',
    status: 'À venir'
  },
  {
    day: 19,
    date: '26/11/2026',
    week: 4,
    phase: 'Phase 3 : HUB Orchestrateur',
    phaseColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    title: 'Application des modèles comptables et règles dossiers',
    description: 'Imputation automatique des comptes de charge (60x/70x) selon l’historique du dossier validé par M. Flore.',
    deliverable: 'Moteur d’imputation intelligent par dossier.',
    owner: 'Jean Elson & M. Flore',
    status: 'À venir'
  },
  {
    day: 20,
    date: '27/11/2026',
    week: 4,
    phase: 'Phase 3 : HUB Orchestrateur',
    phaseColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    title: 'Contrôles arithmétiques & Écritures équilibrées (FEC)',
    description: 'Vérification arithmétique rigoureuse (HT + TVA = TTC à 0,01€ près) et génération des lignes Débit / Crédit équilibrées.',
    deliverable: 'Générateur d’écritures comptables conforme FEC.',
    owner: 'Jean Elson',
    status: 'À venir'
  },

  // SEMAINE 5 : PHASE 4 — ADAPTATEUR FERNEST XML & RÉTROACTION (30/11/2026 au 04/12/2026)
  {
    day: 21,
    date: '30/11/2026',
    week: 5,
    phase: 'Phase 4 : Adaptateur FERnest',
    phaseColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    title: 'Développement de l’Adaptateur XML historique',
    description: 'Conversion du JSON enrichi vers le format XML verifier_exports.py (<ROOT><TECHNICAL>...<DATAS>...) attendu par FERnest.',
    deliverable: 'Adaptateur XML certifié conforme au schéma FERnest.',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 22,
    date: '01/12/2026',
    week: 5,
    phase: 'Phase 4 : Adaptateur FERnest',
    phaseColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    title: 'Raccordement HTTP avec VisioCompte (https://visiocompte.pro)',
    description: 'Modernisation du connecteur VisioCompte.py (FastAPI HTTP Client mTLS, pool de connexions, gestion des jetons).',
    deliverable: 'Flux montant vers FERnest opérationnel de bout en bout.',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 23,
    date: '02/12/2026',
    week: 5,
    phase: 'Phase 4 : Adaptateur FERnest',
    phaseColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    title: 'Boucle de rétroaction comptable (Feedback Webhook)',
    description: 'Création du endpoint POST /api/v1/feedback permettant à FERnest de notifier à CaptureMind les corrections validées par le comptable.',
    deliverable: 'Enrichissement progressif des bibliothèques human-in-the-loop.',
    owner: 'Jean Elson & M. Flore',
    status: 'À venir'
  },
  {
    day: 24,
    date: '03/12/2026',
    week: 5,
    phase: 'Phase 4 : Adaptateur FERnest',
    phaseColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    title: 'Tests de non-régression avec FERnest en recette',
    description: 'Injection de factures témoins depuis FERnest et vérification de la réception immédiate des écritures prêtes pour le comptable.',
    deliverable: 'Zéro régression constatée côté FERnest.',
    owner: 'Jean Elson & Équipe FERnest',
    status: 'À venir'
  },
  {
    day: 25,
    date: '04/12/2026',
    week: 5,
    phase: 'Phase 4 : Adaptateur FERnest',
    phaseColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    title: 'Cadrage des contrats pour l’Agent IA (Phase 2 Alphonse)',
    description: 'Formalisation des interfaces OpenAPI pour l’agent IA d’assistance : endpoints de consultation des règles et proposition de corrections.',
    deliverable: 'Spécification Swagger/OpenAPI prête pour Alphonse.',
    owner: 'Jean Elson & Alphonse',
    status: 'À venir'
  },

  // SEMAINE 6 : PHASE 5 — QUALIFICATION, ZÉRO STOCKAGE & RECETTE J+30 (07/12/2026 au 11/12/2026)
  {
    day: 26,
    date: '07/12/2026',
    week: 6,
    phase: 'Phase 5 : Recette & Livraison',
    phaseColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    title: 'Tests de charge et montée en cadence',
    description: 'Simulation de traitement de 50 factures en continu. Vérification de la stabilité de la VRAM GPU et de l’absence de fuite mémoire RAM.',
    deliverable: 'Rapport de test de charge (temps moyen <1.8s par facture).',
    owner: 'Jean Elson & DevOps',
    status: 'À venir'
  },
  {
    day: 27,
    date: '08/12/2026',
    week: 6,
    phase: 'Phase 5 : Recette & Livraison',
    phaseColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    title: 'Audit de sécurité & Garantie du Zéro Stockage Disque',
    description: 'Vérification forensique sur le serveur de production : vérification que /tmp, /var/tmp et les disques contiennent 0 octet résiduel (VUL-001 résolu à 100%).',
    deliverable: 'Attestation technique de conformité Stateless RAM.',
    owner: 'Jean Elson & Sarobidy',
    status: 'À venir'
  },
  {
    day: 28,
    date: '09/12/2026',
    week: 6,
    phase: 'Phase 5 : Recette & Livraison',
    phaseColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    title: 'Expurgation des journaux techniques & Confidentialité',
    description: 'Vérification qu’aucune information nominative, RIB ou texte intégral de facture ne fuite dans les logs OpenSearch/Docker.',
    deliverable: 'Configuration des logs expurgés conforme RGPD & secret d’affaires.',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 29,
    date: '10/12/2026',
    week: 6,
    phase: 'Phase 5 : Recette & Livraison',
    phaseColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    title: 'Démonstration de validation sur les 100 factures',
    description: 'Traitement de bout en bout du corpus réel témoin avec affichage des propositions d’écritures et comparaison avec la vérité terrain.',
    deliverable: 'Démonstrateur fonctionnel complet prêt pour la direction.',
    owner: 'Jean Elson, M. Flore & Alphonse',
    status: 'À venir'
  },
  {
    day: 30,
    date: '11/12/2026',
    week: 6,
    phase: 'Phase 5 : Recette & Livraison',
    phaseColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold',
    title: 'Recette Officielle J+30 avec Romain Friderich',
    description: 'Présentation de la solution livrée, validation conjointe de la conformité au CDC, et bascule officielle en production sur FERnest.',
    deliverable: 'Procès-verbal de recette signé et mise en service de CaptureMind HUB.',
    owner: 'Jean Elson & Romain Friderich',
    status: 'À venir'
  }
];

const invoicePresets: InvoicePreset[] = [
  {
    id: 'inv-1',
    title: 'Facture Hybride / Factur-X',
    type: 'Factur-X',
    supplier: 'Orange Business Services',
    siren: '380129866',
    amountHT: 120.0,
    vatRate: 20,
    amountTTC: 144.0,
    confidence: 99.4,
    suggestedAccount: '626100 (Frais postaux et télécoms)',
    suggestedSubAccount: '401ORANGE',
    fileName: 'facture_orange_oct2026.pdf',
    fileSizeKB: 340
  },
  {
    id: 'inv-2',
    title: 'Facture Scannée Complexe',
    type: 'PDF Scanné',
    supplier: 'Bureau Express SA',
    siren: '512890123',
    amountHT: 1045.5,
    vatRate: 20,
    amountTTC: 1254.6,
    confidence: 96.8,
    suggestedAccount: '606400 (Fournitures administratives)',
    suggestedSubAccount: '401BUREX',
    fileName: 'scan_bureau_express_102026.png',
    fileSizeKB: 1850
  },
  {
    id: 'inv-3',
    title: 'Fournisseur Inconnu (Enrichissement)',
    type: 'Nouveau Fournisseur',
    supplier: 'Atelier Mécanique Durand',
    siren: '891234567',
    amountHT: 375.0,
    vatRate: 20,
    amountTTC: 450.0,
    confidence: 94.2,
    suggestedAccount: '615500 (Entretien matériel roulant)',
    suggestedSubAccount: '401DURAND (À créer)',
    fileName: 'facture_durand_interv.pdf',
    fileSizeKB: 780
  }
];

// Planning & Milestones Table directly from Jean Elson's validated response
const planningMilestones: MilestoneItem[] = [
  {
    subject: 'CaptureMind HUB',
    estimation: '25 à 30 jours ouvrés',
    priority: 'Priorité 1',
    priorityBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    stepsAndDependencies: 'Étude comparative (10-15j sur ~100 factures), choix de l’approche, développement du moteur IA en RAM, intégration comptable et tests.',
    details: 'Traité en priorité 1 immédiate par Jean Elson. Réutilise les règles métier existantes tout en reconstruisant le moteur indépendamment d’OpenCapture.'
  },
  {
    subject: 'Dossier DGFiP',
    estimation: 'Début janvier 2027',
    priority: 'Objectif Fixe',
    priorityBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    stepsAndDependencies: 'Finalisation du dossier et des éléments justificatifs, en fonction de la solution de transport et des modalités retenues pour le point d’accès.',
    details: 'Aucun blocage : B2Brouter est déjà opérationnel en production et déclaré comme partenaire d’interopérabilité. Tests non bloquants au dépôt initial.'
  },
  {
    subject: 'Point d’accès Peppol natif',
    estimation: '25 à 30 jours ouvrés',
    priority: 'Enchaînement',
    priorityBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    stepsAndDependencies: 'Intégration d’un composant AS4 existant (phase4 ou Oxalis), raccordement à l’architecture VISIOfact, gestion de l’adressage, des échanges, des statuts, des erreurs et traçabilité, puis tests techniques.',
    details: 'Enchaîné après CaptureMind ou mené en parallèle selon arbitrage. Les démarches externes (OpenPeppol, certificats PKI) sont menées en temps masqué.'
  },
  {
    subject: 'Connexion au PPF',
    estimation: 'Non estimée à ce stade',
    priority: 'Conditionné',
    priorityBadge: 'bg-slate-700 text-slate-300 border-slate-600',
    stepsAndDependencies: 'À préciser après obtention des accès nécessaires aux API et des informations techniques permettant de définir le périmètre réel de l’intégration.',
    details: 'L’AIFE n’ouvre ses API qu’après la première validation du dossier d’immatriculation DGFiP. Annuaire simulé actuellement en place dans VISIOfact.'
  }
];

// Technical stack & libraries for CaptureMind HUB
const captureMindStack: TechToolItem[] = [
  {
    stepNum: 1,
    stepName: 'Réception & Transit RAM',
    toolName: 'FastAPI + io.BytesIO',
    toolType: 'Framework Web & Buffer Mémoire',
    license: 'MIT / PSF',
    licenseStatus: 'Permissive (Libre)',
    role: 'Réception du flux chiffré depuis la GED FERnest et instanciation directe en mémoire vive.',
    inputOutput: 'POST /api/v1/invoices/process (Multipart/Stream) -> Objet binaire io.BytesIO en RAM',
    memoryStorage: '0 octet sur disque. Mémoire volatile strictement bornée à la taille du document.',
    keyFeature: 'Remplace l’ingestion disque d’OpenCapture par un transit 100% en RAM.'
  },
  {
    stepNum: 2,
    stepName: 'Aiguillage & Lecture PDF',
    toolName: 'pypdfium2 / pypdf',
    toolType: 'Moteur de parsing PDF (Fork PDFium / C++)',
    license: 'Apache 2.0 / BSD',
    licenseStatus: 'Permissive (Libre)',
    role: 'Extraction du texte natif, détection des métadonnées XML Factur-X ou tramage pour OCR si scan.',
    inputOutput: 'Flux io.BytesIO -> Texte extrait / Arbre XML Factur-X / Trames Bitmap mémoire',
    memoryStorage: 'Décodage en mémoire vive volatile. Caches nettoyés après chaque extraction.',
    keyFeature: 'Substitut officiel à PyMuPDF (définitivement écarté en raison de sa licence AGPL).'
  },
  {
    stepNum: 3,
    stepName: 'Inférence IA & OCR',
    toolName: 'PaddleOCR-VL / Qwen3-VL (4B/8B)',
    toolType: 'Modèles de Vision-Language & OCR',
    license: 'Apache 2.0 / MIT',
    licenseStatus: 'Permissive (Libre)',
    role: 'Compréhension du document scanné, localisation spatiale des mentions légales, montants et dates.',
    inputOutput: 'Trames d’images en RAM -> JSON structuré (SIREN, TVA, HT, TTC, date, lignes de facture)',
    memoryStorage: 'Modèles préchargés en VRAM GPU (Serveur partagé LexIA - NVIDIA RTX 4000 Ada - 20 Go). Payload facture évacué dès la fin de l’inférence.',
    keyFeature: 'Banc d’essai sur 100 factures réelles pour valider le taux d’exactitude et la consommation VRAM avec Alphonse.'
  },
  {
    stepNum: 4,
    stepName: 'Bibliothèques Métier & Rapprochement',
    toolName: 'Moteur Tiers & Modèles CaptureMind (Python)',
    toolType: 'Algorithmes de Rapprochement & Tables Indexées',
    license: 'Propriétaire Digipepss',
    licenseStatus: 'Propriétaire',
    role: 'Matching du SIREN, SIRET, TVA intracommunautaire, IBAN et raison sociale avec les tiers de FERnest. Application des règles d’imputation par dossier.',
    inputOutput: 'JSON brut extrait + Référentiels synchronisés -> Tiers identifié + Compte de charge (60x/70x)',
    memoryStorage: 'Indexation rapide en RAM (Dictionnaires / SQLite temporaire en mémoire). Aucun document conservé.',
    keyFeature: 'Capitalise sur les règles métier actuelles déjà cadrées avec M. Flore (TVA, qualification des tiers, aide à la saisie).'
  },
  {
    stepNum: 5,
    stepName: 'Contrôles & Écritures Comptables',
    toolName: 'Module Arithmétique & FEC (Python Decimal)',
    toolType: 'Moteur de Vérification Comptable',
    license: 'Standard Library Python',
    licenseStatus: 'Permissive (Libre)',
    role: 'Contrôle arithmétique strict (HT + TVA = TTC à 0,01€ près), vérification des taux de TVA légaux et génération des écritures équilibrées Débit / Crédit.',
    inputOutput: 'Données qualifiées -> Lignes d’écritures équilibrées prêtes pour le journal des achats',
    memoryStorage: 'Calcul pur en mémoire de processus.',
    keyFeature: 'Alerte immédiate en cas de discordance arithmétique ou de doute sur un compte.'
  },
  {
    stepNum: 6,
    stepName: 'Restitution FERnest & Purge Déterministe',
    toolName: 'Client HTTP mTLS + gc.collect() / del buffer',
    toolType: 'Connecteur API & Gestionnaire Mémoire',
    license: 'Python PSF',
    licenseStatus: 'Permissive (Libre)',
    role: 'Transmission du résultat JSON vers FERnest (avec Job ID pour traçabilité) et déclenchement de la libération immédiate de la mémoire.',
    inputOutput: 'Proposition comptable transmise à FERnest -> Confirmation de validation du comptable',
    memoryStorage: 'RAM libérée à 100%. Données résiduelles : 0 octet. Logs techniques expurgés de toute donnée documentaire.',
    keyFeature: 'Garantit l’absence totale de conservation de factures sur le serveur CaptureMind.'
  }
];

// Technical stack & libraries for VISIOfact Peppol
const visiofactStack: TechToolItem[] = [
  {
    stepNum: 1,
    stepName: 'Préparation & Normalisation Facture',
    toolName: 'VISIOfact Core Pipeline (Python)',
    toolType: 'Socle PDP & Moteur de Données',
    license: 'Propriétaire Digipepss',
    licenseStatus: 'Propriétaire',
    role: 'Génération ou réception de la facture électronique client au format standard UBL ou Factur-X.',
    inputOutput: 'Données de facturation -> Enveloppe XML Factur-X / UBL Peppol BIS Billing 3.0',
    memoryStorage: 'Base PostgreSQL sécurisée VISIOfact (9 jours de socle PDP déjà en production).',
    keyFeature: 'Assure la compatibilité stricte avec la norme européenne EN16931.'
  },
  {
    stepNum: 2,
    stepName: 'Validation Schematron Peppol (F13)',
    toolName: 'lxml + Schematron Peppol BIS 3.0',
    toolType: 'Validateur XML & Règles Métier Réseau',
    license: 'BSD',
    licenseStatus: 'Permissive (Libre)',
    role: 'Vérification syntaxique et sémantique rigoureuse des mentions obligatoires avant injection sur le réseau Peppol.',
    inputOutput: 'XML brut -> Rapport de validation Schematron (Conforme / Rejet avec motif)',
    memoryStorage: 'Validation en mémoire.',
    keyFeature: 'Empêche toute transmission de message non conforme pouvant générer des rejets réseau.'
  },
  {
    stepNum: 3,
    stepName: 'Couche d’Abstraction Transport',
    toolName: 'OutboundTransportPort (Interface Python)',
    toolType: 'Port d’Abstraction Architectural',
    license: 'Propriétaire Digipepss',
    licenseStatus: 'Propriétaire',
    role: 'Interface commune permettant d’aiguiller l’envoi soit vers B2Brouter (Option A), soit vers notre composant natif (Option B).',
    inputOutput: 'Message prêt -> Routage selon variable d’environnement DELIVERY_MODE',
    memoryStorage: 'In-memory routing.',
    keyFeature: 'Découplage architectural total : bascule transparente de B2Brouter vers le natif sans retoucher le code métier.'
  },
  {
    stepNum: 4,
    stepName: 'Mode A : Passerelle B2Brouter (Actuel)',
    toolName: 'B2Brouter REST API Client & Webhooks',
    toolType: 'Opérateur Partenaire (En production)',
    license: 'Contrat Commercial B2Brouter',
    licenseStatus: 'Contrat Commercial',
    role: 'Délégation du transport Peppol AS4 via l’API B2Brouter. 10 jours de développement déjà réalisés et stabilisés en production.',
    inputOutput: 'Payload HTTPS -> Réseau Peppol international via B2Brouter',
    memoryStorage: 'Géré par l’infrastructure Cloud de B2Brouter.',
    keyFeature: 'Zéro jour de dev bloquant pour le dépôt DGFiP Janvier 2027 : B2Brouter est déclaré comme partenaire d’interopérabilité.'
  },
  {
    stepNum: 5,
    stepName: 'Mode B : Conteneur AS4 Natif (Cible)',
    toolName: 'phase4 (Philip Helger) / Oxalis (Norstella)',
    toolType: 'Composant Open Source Peppol AS4 / ebMS3',
    license: 'Apache 2.0',
    licenseStatus: 'Permissive (Libre)',
    role: 'Cœur de transport autonome ebMS3 AS4 déployé dans un conteneur Java dédié (F5, F6, F7, F8).',
    inputOutput: 'Appel API interne VISIOfact -> Enveloppe signée AS4 émise directement vers l’Access Point destinataire',
    memoryStorage: 'Conteneur isolé, traces dans OpenSearch.',
    keyFeature: 'Licence Apache 2.0 totalement permissive : 100% exploitable commercialement sans obligation d’ouvrir le code source de VISIOfact.'
  },
  {
    stepNum: 6,
    stepName: 'Coffre-fort Clés & PKI (F1, F2)',
    toolName: 'OpenBao (Fork Open Source de HashiCorp Vault)',
    toolType: 'Gestionnaire de Secrets & Certificats PKI',
    license: 'MPL 2.0 (Open Source)',
    licenseStatus: 'Permissive (Libre)',
    role: 'Stockage ultra-sécurisé des clés privées de signature WS-Security et des certificats Peppol (test et production).',
    inputOutput: 'Demande de signature conteneur AS4 -> Signature cryptographique via certificat sans exposer la clé',
    memoryStorage: 'Chiffrement au repos en coffre-fort certifié.',
    keyFeature: 'Évite toute fuite de clés privées dans les dépôts GitLab ou pipelines CI/CD.'
  },
  {
    stepNum: 7,
    stepName: 'Résolution SML & Annuaire SMP (F3, F4, F15)',
    toolName: 'phoss SMP + Client SML DNS',
    toolType: 'Annuaire Peppol Décentralisé',
    license: 'Apache 2.0 / Backend MPL 2.0',
    licenseStatus: 'Permissive (Libre)',
    role: 'Découverte dynamique de l’Access Point du destinataire à partir de son SIRET/TVA, et publication de nos propres clients.',
    inputOutput: 'Identifiant Peppol (ex: 0009:SIREN) -> URL ebMS3 + Certificat public du destinataire',
    memoryStorage: 'Cache local résolu via DNS SML Peppol.',
    keyFeature: 'Composant open source de référence maintenu par la communauté OpenPeppol.'
  },
  {
    stepNum: 8,
    stepName: 'Gestion du Cycle de Vie (CDV) (F9)',
    toolName: 'b2b_cdv_service.py',
    toolType: 'Service Métier Statuts Réseau',
    license: 'Propriétaire Digipepss',
    licenseStatus: 'Propriétaire',
    role: 'Gestion des 14 statuts réglementaires (Déposé, Acheminé, Rejeté, Approuvé, Payé...) et émission/réception des Application Responses (MLR).',
    inputOutput: 'Accusés de réception MDN / Statuts -> Mise à jour du statut dans VISIOfact',
    memoryStorage: 'Base de données VISIOfact + logs d’audit horodatés.',
    keyFeature: 'Déjà en place dans le socle VISIOfact, réutilisable directement avec B2Brouter et le point d’accès natif.'
  },
  {
    stepNum: 9,
    stepName: 'Supervision & Files Rejets (F10, F11)',
    toolName: 'OpenSearch + RabbitMQ (DLQ)',
    toolType: 'Observabilité, Logs & Files Mortes',
    license: 'Apache 2.0 / MPL',
    licenseStatus: 'Permissive (Libre)',
    role: 'Indexation de l’ensemble des traces de transport, alertes en temps réel et rejeux automatiques sur erreurs temporaires.',
    inputOutput: 'Événements réseau -> Dashboard d’exploitation et audit légal DGFiP',
    memoryStorage: 'Cluster OpenSearch sécurisé avec rétention paramétrable.',
    keyFeature: 'Permet de tracer 100% des messages échangés pour répondre aux exigences d’audit de la DGFiP.'
  }
];

const captureMindDecisions: DecisionItem[] = [
  {
    id: 1,
    subject: "Approche d'extraction documentaire",
    status: 'Hypothèse à tester',
    choice: 'Approche Hybride (Texte natif / Factur-X / IA)',
    explanation: 'Hypothèse de départ à confirmer ou écarter objectivement par les mesures sur ~100 factures témoins.'
  },
  {
    id: 2,
    subject: 'Librairie de lecture PDF',
    status: 'Confirmé',
    choice: 'pypdfium2 / pypdf (PyMuPDF définitivement écarté)',
    explanation: 'Remplacement par une alternative gratuite à licence strictement permissive (Apache 2.0 / BSD).'
  },
  {
    id: 3,
    subject: 'Modèles IA à évaluer',
    status: 'Confirmé',
    choice: 'PaddleOCR-VL, Qwen3-VL (4B/8B), DeepSeek-OCR',
    explanation: 'Capitalisation sur les tests de Hasina, licences permissives vérifiées (Apache 2.0, MIT, BSD).'
  },
  {
    id: 4,
    subject: 'Infrastructure GPU',
    status: 'Confirmé',
    choice: 'Banc d’essai sur serveur LexIA partagé (RTX 4000 Ada)',
    explanation: 'Créneau et VRAM validés avec Alphonse. Décision d’un serveur dédié prise uniquement sur mesures réelles.'
  },
  {
    id: 5,
    subject: 'Besoins préalables comptables (Point 1)',
    status: 'Déjà Existant chez M. Flore',
    choice: '4 Livrables identifiés & Disponibles chez M. Flore',
    explanation: 'Confirmé formellement par R. Friderich ("attention, déjà existant, veuillez vous rapprocher de Mr Flore"). Les 4 éléments (PCG, plans dossiers, règles d’imputation et écritures types) existent déjà. Prise de contact directe par Jean Elson sans travail en doublon.'
  },
  {
    id: 6,
    subject: 'Hébergement de production & Sécurité',
    status: 'Confirmé',
    choice: 'Conteneurs read-only, disques chiffrés, swap et logs expurgés',
    explanation: 'Garantie matérielle et logicielle de l’absence de stockage documentaire permanent sur le serveur CaptureMind.'
  },
  {
    id: 7,
    subject: 'Enrichissement des bibliothèques',
    status: 'Confirmé',
    choice: 'Supervision exclusive par FERnest (Human-in-the-loop)',
    explanation: 'Seules les règles issues des validations ou corrections du comptable dans FERnest enrichissent CaptureMind.'
  },
  {
    id: 8,
    subject: 'Calendrier et enveloppe globale',
    status: 'Confirmé',
    choice: '25 à 30 jours ouvrés (Priorité 1 de développement)',
    explanation: 'Phase 1 de 10 à 15 jours ouvrés (benchmark), suivie de la Phase 2 de 15 jours ouvrés (confirmée après benchmark).'
  },
  {
    id: 9,
    subject: "Agent IA d'assistance & de raisonnement (Étape future)",
    status: 'Après présentation',
    choice: 'Phase 2 confiée à Alphonse / Anticipation via API découplées',
    explanation: 'Confirmé par R. Friderich : priorité absolue maintenue sur le moteur CaptureMind (25-30j). Alphonse développera l’agent IA en Phase 2. Jean Elson anticipe dès la conception des contrats d’API REST et schémas JSON modulaires sans surcoût ni retard.'
  }
];

interface PeppolFeature {
  code: string;
  title: string;
  scope: string;
  status: 'Nouveau à développer' | 'Socle existant à adapter' | 'Inclus dans estimation';
  details: string;
}

const peppolFeatures: PeppolFeature[] = [
  { code: 'F1', title: 'Certificats Access Point', scope: 'Sécurité & Confiance', status: 'Nouveau à développer', details: 'Configuration des certificats Peppol test et production.' },
  { code: 'F2', title: 'Gestion de la confiance / PKI', scope: 'Sécurité & Confiance', status: 'Nouveau à développer', details: 'Vérification de la validité et renouvellement des certificats partenaires.' },
  { code: 'F3', title: 'Résolution SML', scope: 'Topologie Réseau & SMP', status: 'Nouveau à développer', details: 'Résolution DNS/SML pour localiser le SMP associé à un participant.' },
  { code: 'F4', title: 'Accès SMP tiers', scope: 'Topologie Réseau & SMP', status: 'Nouveau à développer', details: 'Récupération des métadonnées du destinataire, endpoint AS4 et certificat.' },
  { code: 'F15', title: 'Inscription propre SMP', scope: 'Topologie Réseau & SMP', status: 'Nouveau à développer', details: 'Publication de nos clients dans phoss SMP déclaré au SML et cohérent avec PPF.' },
  { code: 'F5', title: 'Messages ebMS3', scope: 'Cœur de transport AS4', status: 'Nouveau à développer', details: 'Émission des enveloppes ebMS3 via composant open source (phase4 ou Oxalis).' },
  { code: 'F6', title: 'Signatures et chiffrement', scope: 'Cœur de transport AS4', status: 'Nouveau à développer', details: 'Signature et chiffrement WS-Security pris en charge par le composant AS4.' },
  { code: 'F7', title: 'Receipts / Anti-rejeu réseau', scope: 'Cœur de transport AS4', status: 'Nouveau à développer', details: 'Gestion des receipts signés AS4 (MDN) et détection des doublons réseau.' },
  { code: 'F8', title: 'Réception native', scope: 'Cœur de transport AS4', status: 'Nouveau à développer', details: 'Réception directe des messages entrants ebMS3 vers le pipeline VISIOfact.' },
  { code: 'F13', title: 'Validation Schematron PEPPOL BIS', scope: 'Métier & Validation', status: 'Socle existant à adapter', details: 'Validation syntaxique et sémantique UBL/Factur-X pour Peppol BIS Billing 3.0.' },
  { code: 'F14', title: 'Flux MLR / Application Response', scope: 'Protocoles MLR', status: 'Nouveau à développer', details: 'Émission et traitement des messages de niveau applicatif (Peppol BIS MLR).' },
  { code: 'F9', title: 'Statuts CDV par le réseau', scope: 'Connecteurs & Métier', status: 'Socle existant à adapter', details: 'Échange réseau des statuts du cycle de vie (b2b_cdv_service.py réutilisable).' },
  { code: 'F10', title: 'Gestion des erreurs et réponses', scope: 'Gestion des erreurs', status: 'Inclus dans estimation', details: 'Distinction erreurs temporaires/définitives et rejeux contrôlés.' },
  { code: 'F11', title: 'Files de rejet, rejeu & OpenSearch', scope: 'Rejets et reprise', status: 'Inclus dans estimation', details: 'Traces complètes et supervision des flux dans OpenSearch et files DLQ.' },
  { code: 'F12', title: 'Tests unitaires & intégration', scope: 'Tests', status: 'Inclus dans estimation', details: 'Qualification avec AP de recette (mock), puis AP tiers open source et essais officiels.' },
  { code: 'Exploit', title: 'Supervision & Alertes PKI', scope: 'Exploitation', status: 'Inclus dans estimation', details: 'Monitoring, alertes de renouvellement des certificats et reporting d’exploitation.' }
];

export default function App() {
  // Main Project Management Switcher: Clean, professional, Jira/GitLab style
  const [currentProject, setCurrentProject] = useState<'capturemind' | 'visiofact' | 'knowledge'>('capturemind');

  // Sub-tabs for CaptureMind (7 distinct views: Conception Globale, Audit Existant, Décisions, Flux RAM, Outils, Schéma, Email)
  const [cmTab, setCmTab] = useState<'conception' | 'audit' | 'decisions' | 'flux' | 'outils' | 'schema' | 'email'>('conception');
  const [conceptionSubTab, setConceptionSubTab] = useState<'planning-30j' | 'archi-microservices' | 'contrats-api' | 'matrice-flux'>('planning-30j');
  const [selectedPlanWeek, setSelectedPlanWeek] = useState<number>(0); // 0 = all weeks
  // Sub-tabs for VISIOfact (6 distinct views)
  const [vfTab, setVfTab] = useState<'decisions' | 'peppol-flux' | 'planning' | 'outils' | 'rapport' | 'email'>('decisions');
  // Sub-tabs for Knowledge Base (4 rich views)
  const [kbTab, setKbTab] = useState<'chronologie' | 'intervenants' | 'licences' | 'benchmark'>('chronologie');

  const [copied, setCopied] = useState<boolean>(false);
  const [copiedAudit, setCopiedAudit] = useState<boolean>(false);
  const [copiedPlan, setCopiedPlan] = useState<boolean>(false);
  const [selectedAuditAxe, setSelectedAuditAxe] = useState<number>(0); // 0 = all axes
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
  const [emailVersion, setEmailVersion] = useState<'msg-sarobidy' | 'msg-flore' | 'agent-ia' | 'targeted' | 'official' | 'short' | 'detailed'>('msg-sarobidy');

  // CaptureMind Simulation States
  const [selectedPreset, setSelectedPreset] = useState<InvoicePreset>(invoicePresets[0]);
  const [cmStep, setCmStep] = useState<number>(0);
  const [isCmSimulating, setIsCmSimulating] = useState<boolean>(false);
  const [allocatedRAM, setAllocatedRAM] = useState<number>(0);
  const [allocatedVRAM, setAllocatedVRAM] = useState<number>(0);
  const [cmLogs, setCmLogs] = useState<string[]>([]);
  const [cmActiveTool, setCmActiveTool] = useState<string>('FastAPI / io.BytesIO');

  // VISIOfact Simulation States
  const [peppolMode, setPeppolMode] = useState<'b2brouter' | 'native-phase4'>('b2brouter');
  const [vfStep, setVfStep] = useState<number>(0);
  const [isVfSimulating, setIsVfSimulating] = useState<boolean>(false);
  const [vfLogs, setVfLogs] = useState<string[]>([]);
  const [currentInvoiceCdv, setCurrentInvoiceCdv] = useState<string>('DÉPOSÉ (Draft)');
  const [vfActiveTool, setVfActiveTool] = useState<string>('VISIOfact Core (FastAPI)');

  // Checklist de Recette Finale J+30 (Semaine 6 : 07/12/2026 - 11/12/2026)
  const [recetteChecklist, setRecetteChecklist] = useState<RecetteItem[]>([
    {
      id: 'rec-1',
      category: 'Gouvernance & Validation Formelle',
      title: 'Signature formelle du Procès-Verbal (PV) de Recette par Romain Friderich',
      responsible: 'Romain Friderich (Directeur) & Jean Elson',
      dateTarget: '11/12/2026 (J30)',
      description: 'Adjudication formelle et clôture des 25 à 30 jours de développement. Constat de conformité aux exigences fonctionnelles et autorisation officielle de bascule en production sur FERnest.',
      technicalValidation: 'PV contradictoire signé numériquement avec rapport d’exécution sur le corpus des 100 factures joint en annexe.',
      checked: true,
      priority: 'Bloquant Recette'
    },
    {
      id: 'rec-2',
      category: 'Sécurité & Architecture',
      title: 'Attestation technique de conformité Stateless RAM (0 octet disque)',
      responsible: 'Jean Elson & Sarobidy (Infra Hetzner)',
      dateTarget: '08/12/2026 (J27)',
      description: 'Garantie matérielle et logicielle : aucun document PDF ni fichier temporaire n’est conservé sur disque. Éradication définitive de la vulnérabilité VUL-001 (saturation disque 97% sur Hetzner /var/docservers).',
      technicalValidation: 'Conteneurs déployés en --read-only, transit 100% en mémoire io.BytesIO, purge forcée gc.collect() après chaque facture. Audit forensique : 0 octet résiduel sur /tmp et /var/tmp.',
      checked: true,
      priority: 'Bloquant Recette'
    },
    {
      id: 'rec-3',
      category: 'Comptabilité & Rapprochement',
      title: 'Validation de l’équilibre arithmétique FEC & Détection d’anomalies',
      responsible: 'M. Flore (Lead Comptable FERnest)',
      dateTarget: '10/12/2026 (J29)',
      description: 'Contrôles rigoureux des propositions d’écritures : équilibre strict Débit = Crédit, formule HT + TVA = TTC vérifiée au centime près, imputation conforme aux plans comptables et modèles dossiers.',
      technicalValidation: '100% des factures de test génèrent des écritures équilibrées conformes aux normes FEC sans aucune anomalie arithmétique.',
      checked: true,
      priority: 'Bloquant Recette'
    },
    {
      id: 'rec-4',
      category: 'Intégration & Flux',
      title: 'Validation de l’injection directe XML vers FERnest (visiocompte.pro)',
      responsible: 'Jean Elson & Équipe FERnest',
      dateTarget: '03/12/2026 (J24)',
      description: 'Liaison directe mTLS / API REST entre CaptureMind HUB et https://visiocompte.pro. Remplacement du splitter défaillant par l’adaptateur conforme au schéma historique verifier_exports.py.',
      technicalValidation: 'Test d’injection bout-en-bout avec retour HTTP 200 OK et affichage immédiat dans l’interface comptable FERnest pour validation.',
      checked: true,
      priority: 'Bloquant Recette'
    },
    {
      id: 'rec-5',
      category: 'Confidentialité & RGPD',
      title: 'Audit d’expurgation des journaux techniques & Secret d’affaires',
      responsible: 'Jean Elson & DevOps',
      dateTarget: '09/12/2026 (J28)',
      description: 'Vérification de l’absence de fuite de données confidentielles : aucun IBAN, nom patronymique sensible ou texte brut de facture dans les journaux applicatifs et index OpenSearch.',
      technicalValidation: 'Filtres regex de masquage activés dans le middleware Uvicorn. Logs limités aux métadonnées techniques (Job-ID, temps de traitement, SIREN).',
      checked: true,
      priority: 'Conformité'
    },
    {
      id: 'rec-6',
      category: 'Exploitation & Continuité',
      title: 'Validation du Dual-Run & Transition sans coupure (Zero Downtime)',
      responsible: 'Sarobidy & Romain Friderich',
      dateTarget: '11/12/2026 (J30)',
      description: 'Maintien de l’ancien port OpenCapture en lecture seule pour consultation des archives historiques sans interruption de service pour les collaborateurs du cabinet.',
      technicalValidation: 'Side-by-side validé : port 8080 (legacy) accessible en lecture sans écriture disque, port 443 (nouveau HUB RAM) recevant tous les nouveaux flux.',
      checked: true,
      priority: 'Majeur'
    }
  ]);
  const [copiedPv, setCopiedPv] = useState<boolean>(false);

  // MESSAGE 1 : DEMANDE COURTE À SAROBIDY (100 FACTURES & PURGE HETZNER)
  const messageToSarobidy = `Salut Sarobidy,

Pour préparer le banc d'essai CaptureMind avec Alphonse, peux-tu m'extraire une archive de 100 factures PDF depuis /var/docservers/verifier/original_doc/ ?

En même temps, peux-tu lancer la purge des vieilles miniatures pour libérer le disque à 97% ?

Commandes rapides :
cd /var/docservers/verifier/original_doc/
find . -type f -name "*.pdf" | head -n 100 | tar -czvf /tmp/corpus_test_100.tar.gz -T -
find /var/docservers/ -type f -name "*_thumb.png" -mtime +30 -delete

Merci pour ton aide !

Jean Elson`;

  // MESSAGE 2 : DEMANDE COURTE À MONSIEUR FLORE (PCG & 3 XML FERNEST)
  const messageToMFlore = `Bonjour Monsieur Flore,

Dans le cadre de la préparation de CaptureMind pour FERnest, et suite à l'accord de Romain, j'ai besoin de vos référentiels existants pour caler les écritures automatiques :

1. Le plan de comptes (PCG) et les sous-comptes dossiers habituels.
2. Les règles d'imputation types (comptes 6xx et taux TVA par fournisseur).
3. 3 à 5 exemples de fichiers XML d'écritures déjà validées dans FERnest.

Pouvez-vous me transmettre cela dès que possible ?

Merci d'avance pour votre aide,

Jean Elson`;

  // NOUVELLE RÉPONSE : ACCORD & ANTICIPATION DE L'AGENT IA (PHASE 2 - ALPHONSE)
  const emailAgentIaToFriderich = `Bonjour M. Friderich,

Merci pour ce retour et pour cette orientation stratégique très claire.

1. Accord complet sur la démarche et la répartition des rôles
C'est une excellente perspective d'évolution. Je vous confirme qu'il n'y a aucun obstacle technique à l'intégration future d'un agent IA d'analyse et de raisonnement, d'autant plus que son développement sera pris en charge par Alphonse lors d'une seconde phase distincte.

2. Anticipation dès la conception (sans retard ni complexification)
Comme demandé, nous n'impactons en rien le périmètre ni le calendrier actuel des 25 à 30 jours ouvrés de CaptureMind.
Dès à présent, je prévois simplement des interfaces d'interconnexion propres et découplées (API REST modulaires et formats de données JSON standardisés pour les résultats documentaires, les contrôles de cohérence et les bibliothèques). Cela permettra à Alphonse de brancher son agent en toute fluidité le moment venu.

3. Respect strict des principes fondamentaux
L'architecture garantira le respect absolu de nos règles communes :
- Traitement en mémoire vive volatile sans stockage permanent de documents sur CaptureMind.
- Confidentialité et étanchéité strictes entre les dossiers.
- FERnest comme unique référentiel officiel et superviseur humain pour la validation des décisions comptables.

Je poursuis donc la Phase 1 comme convenu et me coordonne avec Alphonse (pour le calibrage GPU actuel et les futurs points de contact de son agent), ainsi qu'avec M. Flore pour les modèles existants.

Bien cordialement,

Jean Elson
Lead Développeur – Digilium / Digipepss`;

  // 0. VERSION CIBLÉE COURTE & CONCISE SUR LES 4 POINTS (RECOMMANDÉE) :
  // Répond directement et sans fioritures aux 4 questions de M. Friderich
  const targetedEmailToFriderich = `Bonjour M. Friderich,

Merci pour votre retour. Voici les réponses directes et synthétiques à vos 4 points :

1. CaptureMind – Périmètre des 25 à 30 journées
Je vous confirme que cette estimation couvre bien l'intégralité du périmètre : génération des écritures comptables (débit/crédit), bibliothèques intelligentes (tiers et modèles), enrichissement supervisé via FERnest et traitement 100 % en mémoire vive sans stockage permanent. Je me coordonne directement avec M. Flore pour réutiliser l'existant.

2. Planning – Principaux jalons et échéances (50 à 60 jours au total)
- CaptureMind (Priorité 1 – 25 à 30 j) : Jalon 1 (banc d'essai 100 factures, 10-15 j) puis Jalon 2 (moteur et intégration FERnest, ~15 j).
- Point d'accès Peppol natif (25 à 30 j) : Jalon 3 (conteneur AS4 et annuaire SMP, ~15 j) puis Jalon 4 (statuts CDV, flux MLR et qualification, 10-15 j).
- Dépôt DGFiP (début janvier 2027) : Sécurisé par le maintien temporaire de B2Brouter, sans bloquer CaptureMind.
- Raccordement PPF : Démarrera dès l'ouverture des accès par l'AIFE après dépôt. Les démarches OpenPeppol avancent en parallèle.

3. Peppol – Composants retenus et licences
Oui, l'estimation repose sur l'intégration d'un composant open source éprouvé (ebMS3 AS4) pour éviter de redévelopper le protocole :
- Transport AS4 : phase4 (ou Oxalis en alternative), sous licence Apache 2.0.
- Annuaire des participants : phoss SMP, sous licence Apache 2.0 (backend MPL 2.0).
- Exploitation commerciale & étanchéité : Ces licences permissives autorisent formellement l'usage commercial sans redevance. Le composant sera isolé dans un conteneur dédié, garantissant qu'aucune ligne de code propriétaire de VISIOfact n'est contaminée. Le choix final sera arrêté avec M. Iliev.

4. Dossier DGFiP & Maintien de B2Brouter
Le maintien temporaire de B2Brouter (déjà opérationnel en production) découple les calendriers et sécurise le dépôt de janvier 2027. M. Iliev vous apportera les précisions réglementaires et techniques complémentaires à ce sujet.

Bien cordialement,

Jean Elson
Lead Développeur – Digilium / Digipepss`;

  // 1. VERSION OFFICIELLE EN 3 SECTIONS (AVEC RAPPEL DU PÉRIMÈTRE CAPTUREMIND)
  const officialValidatedEmailToFriderich = `Bonjour M. Friderich,

Merci pour votre retour et pour les précisions apportées.

### 1. CaptureMind – Architecture et estimation

Je confirme l’estimation de 25 à 30 jours ouvrés pour réaliser le nouveau HUB documentaire et comptable intelligent, indépendant d’OpenCapture et connecté à FERnest, qui restera le référentiel officiel.

Le HUB sera organisé autour de quatre composants :
- Moteur documentaire IA : lecture et compréhension des factures, avec extraction des données structurées.
- Contrôles de cohérence : identification des tiers et vérification des informations avec FERnest.
- Bibliothèques de connaissances : gestion des tiers, des correspondances et des modèles comptables.
- Moteur de préparation comptable : application des règles de ventilation et de TVA, puis préparation des écritures débit/crédit.

Les propositions de création de nouveaux tiers ou comptes resteront soumises à validation dans FERnest. Les bibliothèques seront enrichies à partir des corrections et validations des comptables.

Le traitement des documents sera effectué en mémoire, sans stockage permanent dans CaptureMind. FERnest restera le point d’entrée et de sortie des documents, via des échanges sécurisés avec l’API.

Pour choisir la technologie de reconnaissance, je comparerai trois approches sur un corpus d’environ 100 factures :
- Multimodale directe : lecture du document par un modèle multimodal.
- OCR + LLM : extraction du texte par OCR, puis interprétation par un modèle de langage.
- Hybride : combinaison des deux approches.

La comparaison portera sur la fiabilité des données extraites et des résultats comptables, les performances et la consommation GPU. Je me rapprocherai également de M. Flore pour examiner les bibliothèques et les modèles comptables existants, ainsi que d’Alphonse pour les ressources GPU.

### 2. Point d’accès Peppol et planning

L’objectif reste de développer notre propre point d’accès Peppol.

L’estimation actuelle est de 25 à 30 jours ouvrés pour le développement et l’intégration du point d’accès natif, notamment les échanges, le suivi des statuts, les traces et les tests techniques.

Les démarches externes liées à OpenPeppol, aux accords avec l’autorité, aux certificats et aux tests de qualification restent à planifier séparément. La connexion aux API du PPF dépend également de l’accès et des informations techniques nécessaires.

Avec les deux chantiers, CaptureMind et le point d’accès natif représentent donc une estimation globale de 50 à 60 jours ouvrés, hors démarches externes et accès aux API du PPF. CaptureMind reste la priorité.

### 3. Maintien temporaire de B2Brouter

M. Iliev pourra apporter les précisions sur ce point.

Bien cordialement,

Jean Elson`;

  // 2. RÉPONSE COURTE, CLAIRE & SANS AMBIGUÏTÉ : PASSAGE DE RELAIS DIRECT À GEORGI ILIEV
  const shortEmailToFriderich = `Bonjour M. Friderich,

Je vous remercie pour votre confirmation et votre accord sur l'architecture de CaptureMind.

1. CaptureMind & Coordination Métier
C'est bien noté pour les bibliothèques et règles comptables existantes : je prends directement contact avec M. Flore afin de réutiliser l'existant sans redondance. Dès réception des éléments comptables (PCG, plans dossiers, règles d'imputation et écritures types), je lance la Phase 1 du banc d'essai sur l'échantillon des 100 factures témoins.

2. Facturation Électronique, Peppol & DGFiP (Relais M. Iliev)
Concernant le volet facturation électronique et le calendrier prévisionnel associé, je laisse la main à M. Iliev qui vous transmettra directement les éléments techniques et réglementaires relatifs au maintien temporaire de B2Brouter et au point d'accès Peppol.

Bien cordialement,

Jean Elson
Lead Développeur – Digilium / Digipepss`;

  // 3. MÉMO TECHNIQUE DÉTAILLÉ (4 POINTS CONSOLIDÉS)
  const officialEmailToFriderich = `Bonjour M. Friderich,

1. CaptureMind – Confirmation du périmètre et de l'estimation

Je vous confirme que l'estimation globale de 25 à 30 jours ouvrés couvre l'ensemble du périmètre présenté précédemment :

- Le développement du moteur IA de compréhension et d'extraction documentaire.
- La préparation des propositions d'écritures comptables, avec suggestion des comptes à débiter et à créditer.
- La mise en place des bibliothèques de connaissances et des règles métier.
- L'enrichissement contrôlé de ces bibliothèques à partir des validations et corrections comptables.
- L'intégration avec FERnest, qui reste le référentiel unique de stockage des documents.
- Les tests de traitement sans stockage documentaire permanent, avec un traitement temporaire en mémoire et des journaux limités aux informations techniques.

Pour réaliser la partie comptable, j'aurai besoin des éléments suivants :

- Le plan comptable général utilisé.
- Le plan comptable spécifique aux dossiers ou aux entreprises, s'il existe.
- Les règles d'imputation comptable actuellement utilisées.
- Quelques exemples d'écritures comptables déjà validées.

À partir de ces éléments, je pourrai constituer un référentiel comptable structuré, sous forme de données JSON ou dans une base de données, afin que CaptureMind puisse consulter les comptes disponibles et proposer les imputations adaptées. Les corrections et validations des comptables pourront ensuite contribuer à l'enrichissement contrôlé de cette base de connaissances.

L'estimation se répartit en deux phases :

- 10 à 15 jours ouvrés pour l'étude comparative des approches multimodales, OCR et hybrides, sur un échantillon d'environ 100 factures.
- Environ 15 jours ouvrés pour le développement complémentaire et l'intégration du moteur retenu, selon les résultats de l'étude.

L'objectif est de réutiliser les règles métier existantes tout en reconstruisant le moteur technique et la chaîne de traitement, indépendamment d'OpenCapture.

2. Planning général et grandes étapes

L'ordre de priorité envisagé est de finaliser CaptureMind avant de concentrer les efforts sur le point d'accès Peppol natif.

| Sujet | Estimation / échéance | Principales étapes et dépendances |
|---|---|---|
| CaptureMind | 25 à 30 jours ouvrés | Étude comparative, choix de l'approche, développement du moteur IA, intégration comptable et tests. |
| Dossier DGFiP | Objectif : début janvier 2027 | Finalisation du dossier et des éléments justificatifs, en fonction de la solution de transport et des modalités retenues pour le point d'accès. |
| Point d'accès Peppol natif | 25 à 30 jours ouvrés | Intégration d'un composant AS4 existant, raccordement à l'architecture VISIOfact, gestion de l'adressage, des échanges, des statuts, des erreurs et de la traçabilité, puis tests techniques. |
| Connexion au PPF | Non estimée à ce stade | À préciser après obtention des accès nécessaires aux API et des informations techniques permettant de définir le périmètre réel de l'intégration. |

Les deux estimations de développement, CaptureMind et point d'accès Peppol natif, représentent 50 à 60 jours ouvrés au total, dans l'hypothèse d'un enchaînement des travaux, avec CaptureMind en priorité.

Il faut distinguer ces délais de développement des démarches externes liées à OpenPeppol, aux accords, aux certificats, aux tests de qualification et à l'accès aux API du PPF. Leurs délais restent à confirmer.

3. Peppol – Architecture technique, composants et licences

L'approche envisagée repose sur l'intégration de composants open source existants et éprouvés, afin d'éviter de développer nous-mêmes toute la couche de communication AS4.

Comme évoqué avec M. Iliev, deux solutions sont à étudier pour le transport AS4 :

- phase4 : bibliothèque Java intégrable dans notre architecture, prenant en charge AS4 et disposant d'un support spécifique pour Peppol. Le dépôt officiel indique une licence Apache 2.0.
- Oxalis / Oxalis-NG : solution open source proposant une implémentation de point d'accès Peppol. La version et les composants à retenir, ainsi que leurs conditions de licence, devront être vérifiés avant leur intégration.

Pour la publication et la gestion des métadonnées de nos propres participants, nous envisageons également phoss SMP. Selon la documentation du projet, le backend est soumis à la licence MPL 2.0, tandis que les autres modules sont sous Apache 2.0.

Concernant l'utilisation commerciale, les licences Apache 2.0 et MPL 2.0 l'autorisent, sous réserve du respect de leurs conditions respectives, notamment les obligations relatives aux mentions de licence et à la redistribution éventuelle du code source modifié.

Les documentations de référence sont disponibles ici :

- phase4 : https://github.com/phax/phase4
- Licence Apache 2.0 : https://www.apache.org/licenses/LICENSE-2.0
- phoss SMP – informations sur les licences : https://github-wiki-see.page/m/phax/phoss-smp/wiki/License
- Licence MPL 2.0 et sa FAQ : https://www.mozilla.org/en-US/MPL/2.0/ et https://www.mozilla.org/en-US/MPL/2.0/FAQ/

À ce stade, le choix définitif du composant AS4 (phase4 ou Oxalis) et les modalités précises d'intégration dans notre architecture FastAPI restent à confirmer avec M. Iliev.

Les 25 à 30 jours ouvrés annoncés correspondent à l'intégration du composant retenu, son raccordement à notre architecture existante, les adaptations des flux entrants et sortants, la gestion des statuts, des erreurs et de la traçabilité, ainsi que les tests techniques. Les démarches externes d'adhésion, de certification et de qualification restent distinctes de cette estimation.

4. Dossier DGFiP – Maintien temporaire de B2Brouter

Concernant les éléments techniques et réglementaires relatifs au maintien temporaire de B2Brouter et ses implications pour le dépôt de notre dossier début janvier 2027, M. Iliev vous apportera directement les précisions détaillées à ce sujet.

Bien cordialement,

Jean Elson`;

  const currentEmailText =
    emailVersion === 'msg-sarobidy'
      ? messageToSarobidy
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
    emailVersion === 'msg-sarobidy'
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const copyAuditQuestions = () => {
    const textToCopy = `QUESTIONNAIRE D'AUDIT TECHNIQUE PRÉALABLE — CAPTUREMIND EXISTANT
Document de cadrage pour la refonte du HUB 100% RAM et le plan de développement (25-30 jours ouvrés)

${auditQuestionsList.map(q => `[${q.id}] (${q.axeTitle})
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

  const copyFullPlan = () => {
    const textToCopy = `PLAN DE TRAVAIL DÉTAILLÉ JOUR PAR JOUR — CAPTUREMIND HUB (25 À 30 JOURS OUVRÉS)
Dates : Du 02/11/2026 (J1) au 11/12/2026 (J30 - Recette Finale)
Lead Développeur : Jean Elson | Direction : Romain Friderich | Partenaires : M. Flore, Alphonse, Sarobidy

${full30DaysPlan.map(item => `[JOUR ${item.day} • ${item.date} • ${item.phase}] (Semaine ${item.week})
Titre : ${item.title}
Objectif : ${item.description}
Livrable : ${item.deliverable}
Responsable : ${item.owner} | Statut : ${item.status}
`).join('\n')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2500);
  };

  const toggleRecetteCheck = (id: string) => {
    setRecetteChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const copyPvRecette = () => {
    const text = `PROCES-VERBAL DE RECETTE FINALE J+30 — CAPTUREMIND HUB
Date de recette : 11 Décembre 2026 | Statut : VALIDÉ SANS RÉSERVE
Direction Générale : Romain Friderich | Lead Développeur : Jean Elson
Partenaires Techniques : M. Flore (FERnest), Alphonse (LexIA GPU), Sarobidy (Infra Hetzner)

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

  const updateAuditNote = (id: string, note: string) => {
    setAuditNotes(prev => ({
      ...prev,
      [id]: note
    }));
  };

  // Run CaptureMind live simulation
  const runCaptureMindSim = () => {
    setIsCmSimulating(true);
    setCmStep(1);
    setAllocatedRAM(selectedPreset.fileSizeKB);
    setAllocatedVRAM(0);
    setCmActiveTool('FastAPI & io.BytesIO (RAM Volatile)');
    setCmLogs([
      `[Transit RAM] Réception du document « ${selectedPreset.fileName} » (${selectedPreset.fileSizeKB} Ko) depuis la GED FERnest.`,
      `[Bibliothèque active] FastAPI + io.BytesIO : Allocation mémoire volatile sans écriture disque (Disque = 0 octet).`
    ]);

    setTimeout(() => {
      setCmStep(2);
      setAllocatedVRAM(selectedPreset.type === 'Factur-X' ? 0 : 3850);
      setCmActiveTool(selectedPreset.type === 'Factur-X' ? 'pypdfium2 / XML Parser (Natif)' : 'pypdfium2 (Rasterizer RAM)');
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
      setCmActiveTool(selectedPreset.type === 'Factur-X' ? 'Moteur Tiers & Modèles CaptureMind' : 'PaddleOCR-VL / Qwen3-VL (RTX 4000 Ada)');
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
      setCmActiveTool('Module Arithmétique & FEC (Python Decimal)');
      setCmLogs((prev) => [
        `[Équilibrage] Construction des lignes d'écritures : Débit = ${selectedPreset.amountTTC.toFixed(2)} € | Crédit = ${selectedPreset.amountTTC.toFixed(2)} € (Équilibre strict).`,
        `[Contrôle Arithmétique] HT (${selectedPreset.amountHT.toFixed(2)} €) + TVA ${selectedPreset.vatRate}% (${(selectedPreset.amountTTC - selectedPreset.amountHT).toFixed(2)} €) = TTC (${selectedPreset.amountTTC.toFixed(2)} €) -> Validé à 100%.`,
        ...prev
      ]);
    }, 3600);

    setTimeout(() => {
      setCmStep(5);
      setIsCmSimulating(false);
      setAllocatedRAM(0);
      setAllocatedVRAM(0);
      setCmActiveTool('httpx (mTLS) + gc.collect() [Mémoire Purgée]');
      setCmLogs((prev) => [
        `[Retour JSON FERnest] Écritures et métadonnées transmises à FERnest pour validation du comptable (Job ID: CM-2026-9812).`,
        `[Purge RAM Déterministe] Libération immédiate des buffers mémoire io.BytesIO et caches via gc.collect().`,
        `[État Final] RAM libérée : 0 Ko | VRAM GPU : 0 Mo | Données résiduelles : 0 octet. Garantie respectée.`,
        ...prev
      ]);
    }, 5000);
  };

  // Run VISIOfact Peppol live simulation
  const runVisiofactPeppolSim = () => {
    setIsVfSimulating(true);
    setVfStep(1);
    setCurrentInvoiceCdv('EN COURS D\'ÉMISSION');
    setVfActiveTool('lxml + Schematron Peppol BIS 3.0 (F13)');
    setVfLogs([
      `[VISIOfact Core] Préparation de la facture électronique (Format Factur-X / UBL Peppol BIS Billing 3.0).`,
      `[Bibliothèque active] lxml : Validation Schematron Peppol BIS EN16931 conforme.`
    ]);

    if (peppolMode === 'b2brouter') {
      setTimeout(() => {
        setVfStep(2);
        setVfActiveTool('OutboundTransportPort -> B2Brouter REST Client');
        setVfLogs((prev) => [
          `[Provider Layer] Mode actif : DELIVERY_MODE=b2brouter (Production active - 10j réalisés).`,
          `[Appel API REST] Envoi du payload signé vers l'API B2Brouter avec authentification TLS.`,
          `[Dossier DGFiP] Prestataire B2Brouter déclaré -> Zéro blocage pour le dépôt Janvier 2027.`,
          ...prev
        ]);
      }, 1200);

      setTimeout(() => {
        setVfStep(3);
        setVfActiveTool('Passerelle B2Brouter (Réseau Peppol International)');
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
        setVfActiveTool('b2b_cdv_service.py + OpenSearch (DLQ)');
        setVfLogs((prev) => [
          `[CDV Service] Mise à jour du cycle de vie VISIOfact : Statut « Livré »`,
          `[Supervision OpenSearch] Trace indexée dans le cluster sans erreur.`,
          ...prev
        ]);
      }, 4000);
    } else {
      // Native phase4 / Oxalis Mode
      setTimeout(() => {
        setVfStep(2);
        setVfActiveTool('Conteneur Java phase4 + OpenBao Secrets (F1, F2, F3, F4)');
        setVfLogs((prev) => [
          `[OutboundTransportPort] Appel du conteneur Java natif (phase4 AS4 / ebMS3 - Licence Apache 2.0)...`,
          `[OpenBao Secrets] Récupération sécurisée du certificat PKI et de la clé privée de signature.`,
          `[Résolution F3/F4 SML/SMP] Découverte dynamique de l'Access Point destinataire (URL ebMS3 + Certificat partenaire via phoss SMP).`,
          ...prev
        ]);
      }, 1300);

      setTimeout(() => {
        setVfStep(3);
        setVfActiveTool('phase4 WSS4J (Signature & Chiffrement AS4 / ebMS3 - F5, F6, F7)');
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
        setVfActiveTool('b2b_cdv_service.py + OpenSearch + phoss SMP');
        setVfLogs((prev) => [
          `[CDV F9 Réseau] Échange de statuts bidirectionnel confirmé avec l'AP partenaire.`,
          `[Supervision F11] Traces et métriques consolidées dans OpenSearch.`,
          `[Autonomie Complète] Facture émise en 100% natif, zéro dépendance tierce.`,
          ...prev
        ]);
      }, 4200);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* ================= TOP APPLICATION HEADER (GESTION DE PROJET - NO SCROLL) ================= */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Brand & Project Indicator */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-tight">Digipepss Tech Studio</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  v3.0 - Décisions Actées
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direction : <span className="text-slate-300">R. FRIDERICH</span> • Ingénierie : <span className="text-slate-300">Jean Elson & G. Iliev</span>
              </p>
            </div>
          </div>

          {/* Clean Project Management Switcher (Two distinct project buttons, no scroll!) */}
          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setCurrentProject('capturemind')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                currentProject === 'capturemind'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4 text-sky-300" />
              <span>Projet 1 : CaptureMind HUB</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-semibold uppercase">
                Priorité 1 (25-30j)
              </span>
            </button>

            <button
              onClick={() => setCurrentProject('visiofact')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                currentProject === 'visiofact'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Network className="w-4 h-4 text-emerald-200" />
              <span>Projet 2 : VISIOfact Peppol</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 font-semibold uppercase">
                DGFiP Janv. 2027
              </span>
            </button>

            <button
              onClick={() => setCurrentProject('knowledge')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                currentProject === 'knowledge'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-950/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>Base de Connaissances & Stratégie</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-200 font-semibold uppercase">
                Riche de Savoir
              </span>
            </button>
          </div>

          {/* Unified Copy Action for the Official Validated Letter */}
          <button
            onClick={() => copyToClipboard(officialEmailToFriderich)}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all cursor-pointer self-start sm:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-white" />}
            <span>{copied ? 'Lettre officielle copiée !' : "Copier la Réponse M. Friderich"}</span>
          </button>
        </div>

        {/* Clean Project Sub-Navigation (Fixed, No Horizontal Scroll) */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-2 hidden sm:inline">
            Vues du Projet :
          </span>

          {currentProject === 'capturemind' ? (
            <div className="flex items-center gap-1.5 text-xs flex-wrap">
              <button
                onClick={() => setCmTab('conception')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                  cmTab === 'conception' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/60 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-300" />
                <span>Conception Globale & Plan 30 Jours</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-400/20 text-indigo-200 font-bold uppercase">
                  Nouveau Cœur
                </span>
              </button>

              <button
                onClick={() => setCmTab('audit')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                  cmTab === 'audit' ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow-sm font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>0. Diagnostic Existant & Questionnaire</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                  Préalable
                </span>
              </button>

              <button
                onClick={() => setCmTab('decisions')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                  cmTab === 'decisions' ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>1. Décisions & Cadrage Métier</span>
              </button>

              <button
                onClick={() => setCmTab('flux')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                  cmTab === 'flux' ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. Simulateur RAM Vivant</span>
              </button>

              <button
                onClick={() => setCmTab('outils')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                  cmTab === 'outils' ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Boxes className="w-3.5 h-3.5 text-amber-400" />
                <span>3. Flux & Boîte à Outils / Bibliothèques</span>
              </button>

              <button
                onClick={() => setCmTab('schema')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                  cmTab === 'schema' ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>4. Schéma Stateless 4 Modules</span>
              </button>

              <button
                onClick={() => setCmTab('email')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                  cmTab === 'email' ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-indigo-300" />
                <span>5. Lettre Officielle Intégrale</span>
              </button>
            </div>
          ) : currentProject === 'visiofact' ? (
            <div className="flex items-center gap-1.5 text-xs flex-wrap">
              <button
                onClick={() => setVfTab('decisions')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                  vfTab === 'decisions' ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>1. Décisions Peppol & Licences</span>
              </button>

              <button
                onClick={() => setVfTab('peppol-flux')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                  vfTab === 'peppol-flux' ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. Simulateur Réseau Peppol AS4</span>
              </button>

              <button
                onClick={() => setVfTab('planning')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                  vfTab === 'planning' ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>3. Grand Tableau des 4 Jalons</span>
              </button>

              <button
                onClick={() => setVfTab('outils')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                  vfTab === 'outils' ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Boxes className="w-3.5 h-3.5 text-amber-400" />
                <span>4. Flux Peppol & Bibliothèques</span>
              </button>

              <button
                onClick={() => setVfTab('rapport')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                  vfTab === 'rapport' ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>5. Bilan 27j Réalisés (Rapport 27 oct.)</span>
              </button>

              <button
                onClick={() => setVfTab('email')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                  vfTab === 'email' ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-emerald-300" />
                <span>6. Lettre Officielle Intégrale</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs flex-wrap">
              <button
                onClick={() => setKbTab('chronologie')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                  kbTab === 'chronologie' ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>1. Fil des Échanges & Décisions</span>
              </button>

              <button
                onClick={() => setKbTab('intervenants')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                  kbTab === 'intervenants' ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                <span>2. Rôles & 5 Acteurs Clés</span>
              </button>

              <button
                onClick={() => setKbTab('licences')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                  kbTab === 'licences' ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. Encyclopédie Licences & Droits</span>
              </button>

              <button
                onClick={() => setKbTab('benchmark')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                  kbTab === 'benchmark' ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-purple-400" />
                <span>4. Banc d'Essai 100 Factures (3 Approches)</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ================= MAIN CONTENT BODY ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        
        {/* ======================================================== */}
        {/* ============ PROJET 1 : CAPTUREMIND HUB ================ */}
        {/* ======================================================== */}
        {currentProject === 'capturemind' && (
          <div className="space-y-6">
            
            {/* Project Context Alert */}
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3 text-xs">
              <Cpu className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Projet CaptureMind HUB — Traitement 100% en Mémoire Vive (RAM)</span>
                  <span className="px-2 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-normal">Priorité #1 de développement (25 à 30 jours)</span>
                </div>
                <p className="text-slate-300">
                  FERnest héberge la GED et reste la source officielle. CaptureMind est un HUB de transit qui analyse en RAM, prépare les écritures comptables, et libère instantanément la mémoire dès validation.
                </p>
              </div>
            </div>

            {/* TAB: CONCEPTION GLOBALE & PLAN DE TRAVAIL 30 JOURS (NOUVEAU CŒUR) */}
            {cmTab === 'conception' && (
              <div className="space-y-6">

                {/* Hero Banner: Conception Globale */}
                <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-sky-950/70 border border-indigo-500/50 shadow-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-extrabold text-white tracking-tight">
                            Conception Globale & Plan de Travail Jour par Jour (J1 à J30)
                          </span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold uppercase border border-indigo-500/30">
                            Feuille de Route Officielle
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          Architecture découplée en 2 micro-services : <strong>Service IA Documentaire FastAPI (100% RAM)</strong> + <strong>CaptureMind HUB Orchestrateur</strong> relié à FERnest.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={copyFullPlan}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-950/60 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      {copiedPlan ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedPlan ? 'Planning 30j copié !' : 'Copier le Plan 30 Jours (Texte)'}</span>
                    </button>
                  </div>

                  {/* 4 Indicateurs Clés de Conception */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="text-slate-400 block text-[11px]">Durée Prévisionnelle</span>
                      <span className="font-extrabold text-white text-lg">25 à 30 Jours</span>
                      <span className="text-[10px] text-indigo-400 block">Jours 1 à 30 planifiés</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="text-slate-400 block text-[11px]">Architecture Cible</span>
                      <span className="font-extrabold text-sky-400 text-lg">2 Micro-services</span>
                      <span className="text-[10px] text-sky-300 block">FastAPI en RAM + HUB</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="text-slate-400 block text-[11px]">Stockage Physique</span>
                      <span className="font-extrabold text-emerald-400 text-lg">0 Octet Disque</span>
                      <span className="text-[10px] text-emerald-300 block">VUL-001 Hetzner résolu</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-1">
                      <span className="text-slate-400 block text-[11px]">Action Bloquante #1</span>
                      <span className="font-extrabold text-rose-400 text-lg">Sarobidy (Corpus)</span>
                      <span className="text-[10px] text-rose-300 block">100 factures réelles</span>
                    </div>
                  </div>
                </div>

                {/* Sub-navigation de Conception */}
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950/80 border border-slate-800 flex-wrap text-xs">
                  <button
                    onClick={() => setConceptionSubTab('planning-30j')}
                    className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      conceptionSubTab === 'planning-30j'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/60'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-sky-300" />
                    <span>1. Planning Détaillé Jour par Jour (30 Jours)</span>
                  </button>

                  <button
                    onClick={() => setConceptionSubTab('archi-microservices')}
                    className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      conceptionSubTab === 'archi-microservices'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/60'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Cpu className="w-4 h-4 text-emerald-300" />
                    <span>2. Architecture Découplée (2 Micro-services)</span>
                  </button>

                  <button
                    onClick={() => setConceptionSubTab('contrats-api')}
                    className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      conceptionSubTab === 'contrats-api'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/60'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code2 className="w-4 h-4 text-amber-300" />
                    <span>3. Contrats d'Échange (JSON IA & XML FERnest)</span>
                  </button>

                  <button
                    onClick={() => setConceptionSubTab('matrice-flux')}
                    className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      conceptionSubTab === 'matrice-flux'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/60'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Workflow className="w-4 h-4 text-purple-300" />
                    <span>4. Matrice des Rôles & Dépendances</span>
                  </button>
                </div>

                {/* VUE 1 : PLANNING DÉTAILLÉ JOUR PAR JOUR (30 JOURS) */}
                {conceptionSubTab === 'planning-30j' && (
                  <div className="space-y-4">
                    {/* Filtres par Semaine */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                      <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider shrink-0 mr-1">Semaines :</span>
                      <button
                        onClick={() => setSelectedPlanWeek(0)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                          selectedPlanWeek === 0 ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        Toutes les 6 Semaines (J1 à J30)
                      </button>
                      <button
                        onClick={() => setSelectedPlanWeek(1)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                          selectedPlanWeek === 1 ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        Semaine 1 (J1-J5) : Audit & Infra
                      </button>
                      <button
                        onClick={() => setSelectedPlanWeek(2)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                          selectedPlanWeek === 2 ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        Semaine 2 (J6-J10) : Benchmark GPU
                      </button>
                      <button
                        onClick={() => setSelectedPlanWeek(3)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                          selectedPlanWeek === 3 ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        Semaine 3 (J11-J15) : Service IA FastAPI
                      </button>
                      <button
                        onClick={() => setSelectedPlanWeek(4)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                          selectedPlanWeek === 4 ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        Semaine 4 (J16-J20) : HUB Orchestrateur
                      </button>
                      <button
                        onClick={() => setSelectedPlanWeek(5)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                          selectedPlanWeek === 5 ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        Semaine 5 (J21-J25) : Adaptateur FERnest
                      </button>
                      <button
                        onClick={() => setSelectedPlanWeek(6)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                          selectedPlanWeek === 6 ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        Semaine 6 (J26-J30) : Recette J+30
                      </button>
                    </div>

                    {/* Liste des Jours */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {full30DaysPlan
                        .filter(item => selectedPlanWeek === 0 || item.week === selectedPlanWeek)
                        .map(item => (
                          <div
                            key={item.day}
                            className={`p-4 rounded-xl border transition-all space-y-2.5 flex flex-col justify-between ${
                              item.status === 'Terminé'
                                ? 'bg-slate-950/90 border-emerald-500/40'
                                : item.status === 'Bloquant Sarobidy'
                                ? 'bg-rose-950/30 border-rose-500/50'
                                : item.status === 'Priorité Immédiate' || item.status === 'En cours'
                                ? 'bg-amber-950/20 border-amber-500/40'
                                : 'bg-slate-900/60 border-slate-800'
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="h-6 px-2 rounded-md bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-mono font-bold text-xs flex items-center justify-center">
                                    Jour {item.day}
                                  </span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${item.phaseColor}`}>
                                    {item.phase}
                                  </span>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                  item.status === 'Terminé'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : item.status === 'Bloquant Sarobidy'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                                    : item.status === 'En cours' || item.status === 'Priorité Immédiate'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {item.status}
                                </span>
                              </div>

                              <h4 className="text-sm font-bold text-white leading-snug">
                                {item.title}
                              </h4>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {item.description}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs">
                              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                                <span>Livrable :</span>
                                <span className="font-semibold text-emerald-300 text-right">{item.deliverable}</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                                <span>Responsable :</span>
                                <span className="font-semibold text-sky-300">{item.owner}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* VUE 2 : ARCHITECTURE DÉCOUPLÉE & CARTOGRAPHIE DES 3 SERVICES / SERVEURS */}
                {conceptionSubTab === 'archi-microservices' && (
                  <div className="space-y-6">
                    
                    {/* Bannière de Synthèse : Les 3 Services Logiques & 3 Serveurs Physiques */}
                    <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="font-bold text-white flex items-center gap-2">
                          <Boxes className="w-4 h-4 text-indigo-400" />
                          <span>Répartition Claire : 3 Services Logiques sur 3 Serveurs Physiques</span>
                        </div>
                        <p className="text-slate-300 text-[11px]">
                          L'ancien OpenCapture monolithique est scindé : le stockage disque destructeur (<code className="text-amber-300">/var/docservers</code>) est supprimé, la base PostgreSQL existante est conservée, et le calcul lourd est déporté sur le GPU LexIA.
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px] shrink-0">
                        Zéro Conflit • RAM Pure
                      </span>
                    </div>

                    {/* GRILLE DES 3 SERVICES LOGIQUES */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* SERVICE 1 : CaptureMind HUB Orchestrateur */}
                      <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/40 space-y-3.5 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
                                1
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white">CaptureMind HUB</h4>
                                <span className="text-[10px] text-indigo-300 font-mono">Orchestrateur Métier</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30">
                              Hetzner (Nouveau)
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-300">
                            C'est le chef d'orchestre backend développé par Jean Elson. Il reçoit la facture de FERnest, interroge l'IA Documentaire, applique les règles comptables et renvoie le XML.
                          </p>

                          <ul className="text-[11px] space-y-1.5 text-slate-400">
                            <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> <code>POST /ws/ingest</code> en flux mémoire RAM</li>
                            <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> Rapprochement Tiers (Levenshtein &gt; 85%)</li>
                            <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> Imputation selon modèles M. Flore</li>
                            <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> Générateur XML conforme à FERnest</li>
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between">
                          <span>Techno : <strong>FastAPI / Python</strong></span>
                          <span className="text-emerald-400 font-mono">0 octet disque</span>
                        </div>
                      </div>

                      {/* SERVICE 2 : Service IA Documentaire Indépendant */}
                      <div className="p-5 rounded-2xl bg-slate-900/90 border border-sky-500/40 space-y-3.5 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-xs">
                                2
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white">IA Documentaire</h4>
                                <span className="text-[10px] text-sky-300 font-mono">Vision & Extraction RAM</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/30">
                              LexIA (Alphonse)
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-300">
                            Micro-service 100% autonome et agnostique de la comptabilité. Il traite l'image ou le PDF en RAM et renvoie les zones détectées et le texte sans jamais stocker le fichier.
                          </p>

                          <ul className="text-[11px] space-y-1.5 text-slate-400">
                            <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> <strong>Hébergement :</strong> Serveur LexIA d'Alphonse (RTX 4000 Ada - 20 Go)</li>
                            <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> <strong>Traitement Parallèle :</strong> Multi-factures asynchrones (Queue async + multi-workers)</li>
                            <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> <code>pypdfium2</code> pour Factur-X / PDF natif (&lt;300ms, sans GPU)</li>
                            <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> PaddleOCR / Qwen3-VL pour scans complexes sur GPU</li>
                            <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> Contrat JSON pur : datas, positions, pages</li>
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between">
                          <span>Mode : <strong>Parallèle / Asynchrone</strong></span>
                          <span className="text-sky-300 font-mono">Purge gc.collect()</span>
                        </div>
                      </div>

                      {/* SERVICE 3 : Base PostgreSQL & Référentiels (Existant Conservé) */}
                      <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-3.5 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                                3
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white">PostgreSQL Référentiel</h4>
                                <span className="text-[10px] text-emerald-300 font-mono">Existant Allégé & Conservé</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                              Hetzner (Actuel)
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-300">
                            La base PostgreSQL de l'actuel OpenCapture est conservée pour ses données précieuses, mais déchargée de tout fichier ou image physique.
                          </p>

                          <ul className="text-[11px] space-y-1.5 text-slate-400">
                            <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> <code>accounts_supplier</code> & <code>accounts_customer</code></li>
                            <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> <code>accounting_plan</code> (PCG & plans dossiers)</li>
                            <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> <code>form_models</code> & <code>positions_masks</code></li>
                            <li className="flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /> Docservers disques désactivés (VUL-001 résolu)</li>
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between">
                          <span>Driver : <strong>psycopg 3 / JSONB</strong></span>
                          <span className="text-emerald-400 font-mono">Poids &lt; 50 Mo</span>
                        </div>
                      </div>

                    </div>

                    {/* CARTOGRAPHIE DES 3 SERVEURS PHYSIQUES / MACHINES */}
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Server className="w-5 h-5 text-sky-400" />
                          <h4 className="text-sm font-bold text-white">Cartographie des 3 Serveurs Physiques / Hébergements</h4>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">Où tourne quoi en production ?</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                              Serveur Hetzner (Actuel)
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">Sarobidy / Jean</span>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            Héberge le <strong>CaptureMind HUB Orchestrateur</strong> + la base <strong>PostgreSQL allégée</strong>. L'ancien OpenCapture y est arrêté une fois la migration achevée et <code className="text-amber-300">/var/docservers</code> purgé.
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                              Serveur LexIA (GPU)
                            </span>
                            <span className="text-[10px] font-mono text-sky-300">Alphonse</span>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            Serveur dédié IA avec la carte <strong>NVIDIA RTX 4000 Ada (20 Go VRAM)</strong>. Héberge le conteneur Docker du <strong>Service IA Documentaire</strong>, puis accueillera l'<strong>Agent IA</strong> en Phase 2.
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                              Serveur FERnest (Prod)
                            </span>
                            <span className="text-[10px] font-mono text-emerald-300">M. Flore / Romain</span>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            L'ERP / GED comptable en production (<code className="text-emerald-300">visiocompte.pro</code>). Envoie les flux multipart et reçoit le XML historique des écritures pour validation par les comptables.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Que devient l'actuel OpenCapture ? (Explication nette) */}
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-xs">
                      <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-bold text-white block">Que devient l'ancien serveur / service OpenCapture actuel ?</span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          L'ancien OpenCapture monolithique (le code legacy qui écrivait les fichiers sur <code className="text-amber-300">/var/docservers</code> et saturait le disque à 97%) est <strong>progressivement décommissionné</strong>. 
                          En revanche, sa base de données PostgreSQL n'est <strong>PAS jetée</strong> : nous conservons directement les tables de tiers, plans comptables et masques. Le nouveau CaptureMind HUB (Service 1) se branche directement sur cette base PostgreSQL (Service 3), tandis que le traitement lourd de reconnaissance est délégué au Service IA sur LexIA (Service 2).
                        </p>
                      </div>
                    </div>

                    {/* DÉCRYPTAGE CRUCIAL : SIMPLE LECTURE OCR VS INTELLIGENCE COMPTABLE COMPLETE */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-500/50 space-y-4 shadow-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">Notre Objectif : Simple Lecture OCR ou Véritable HUB Comptable ?</h4>
                            <span className="text-[10px] text-indigo-300">Réponse clé pour la décision de validation</span>
                          </div>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                          Génération d'Écritures Clé en Main
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Ce que ce N'EST PAS */}
                        <div className="p-4 rounded-xl bg-slate-900/60 border border-rose-500/30 space-y-2">
                          <div className="flex items-center gap-2 text-rose-400 font-bold">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Ce que ce N'EST PAS : Une simple lecture OCR</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            Un OCR simple lit bêtement des caractères (ex: <em>"Orange 49.99 €"</em>). Il ne comprend pas le document, ne sait pas qui est le fournisseur, ne connaît pas les comptes comptables et ne sait pas ventiler la TVA.
                          </p>
                          <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/20 text-[10px] text-rose-200">
                            <strong>Résultat inacceptable :</strong> Le comptable devrait continuer à saisir tous les comptes à la main dans FERnest.
                          </div>
                        </div>

                        {/* Ce que FAIT CaptureMind HUB */}
                        <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30 space-y-2">
                          <div className="flex items-center gap-2 text-emerald-400 font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Ce que FAIT réellement CaptureMind HUB</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            CaptureMind lit intelligemment le document, résout le fournisseur (SIREN / IBAN), applique les règles de <strong>M. Flore</strong>, génère les écritures équilibrées Débit=Crédit et transmet le XML directement à <strong>FERnest</strong>.
                          </p>
                          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[10px] text-emerald-200">
                            <strong>Résultat visé :</strong> Le comptable ouvre FERnest et n'a plus qu'à cliquer sur <span className="font-bold underline">« Valider »</span> en 2 secondes !
                          </div>
                        </div>
                      </div>

                      {/* Le cycle complet en 4 temps */}
                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">Le Cycle en 4 Temps :</span>
                          <span>1. GED FERnest (Envoi RAM) &rarr;</span>
                          <span>2. LexIA GPU (Extraction IA) &rarr;</span>
                          <span>3. HUB (Matching & Écritures) &rarr;</span>
                          <span>4. FERnest (Validation en 1 clic)</span>
                        </div>
                        <span className="font-mono text-emerald-400 font-bold">Zéro ressaisie</span>
                      </div>
                    </div>

                    {/* TABLEAU COMPARATIF : OÙ SONT STOCKÉS LES DOCUMENTS & DONNÉES ? */}
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Database className="w-5 h-5 text-indigo-400" />
                          <div>
                            <h4 className="text-sm font-bold text-white">Où sont stockés les Documents et Données ? (Actuel vs Cible)</h4>
                            <span className="text-[10px] text-slate-400">Cartographie précise du stockage pour répondre aux craintes de saturation disque</span>
                          </div>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
                          Résolution VUL-001
                        </span>
                      </div>

                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400">
                              <th className="py-2.5 px-3 font-semibold">Composant / Serveur</th>
                              <th className="py-2.5 px-3 font-semibold">Stockage des Fichiers Physiques (PDF, Scans, Images)</th>
                              <th className="py-2.5 px-3 font-semibold">Stockage des Données & Métadonnées</th>
                              <th className="py-2.5 px-3 font-semibold">Impact sur l'Espace Disque</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            {/* Actuel OpenCapture */}
                            <tr className="bg-rose-950/10 hover:bg-rose-950/20">
                              <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                                Actuel : OpenCapture (Hetzner)
                              </td>
                              <td className="py-3 px-3 text-rose-300">
                                <span className="font-bold">Disque dur Hetzner</span> dans <code>/var/docservers/</code> (fichiers originaux, miniatures, pages découpées).
                              </td>
                              <td className="py-3 px-3">
                                PostgreSQL (table <code>documents</code> avec JSONB lourd).
                              </td>
                              <td className="py-3 px-3 text-rose-400 font-bold font-mono">
                                97% Saturé (Faille VUL-001)
                              </td>
                            </tr>

                            {/* Cible : Service IA Document */}
                            <tr className="hover:bg-slate-800/30">
                              <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                                Cible : IA Document (LexIA GPU)
                              </td>
                              <td className="py-3 px-3 text-emerald-300 font-bold">
                                Zéro octet disque. Transit 100% en RAM volatile (<code>io.BytesIO</code>), purgé après calcul (<code>del buffer, gc.collect()</code>).
                              </td>
                              <td className="py-3 px-3 text-slate-400">
                                <em>Aucune donnée conservée</em> (stateless pur).
                              </td>
                              <td className="py-3 px-3 text-emerald-400 font-mono font-bold">
                                0 Octet Disque
                              </td>
                            </tr>

                            {/* Cible : CaptureMind HUB */}
                            <tr className="hover:bg-slate-800/30">
                              <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                                Cible : CaptureMind HUB (Hetzner)
                              </td>
                              <td className="py-3 px-3 text-emerald-300 font-bold">
                                Zéro octet disque. Aucun fichier physique stocké. Plus de docserver.
                              </td>
                              <td className="py-3 px-3">
                                PostgreSQL allégé : tables des tiers (<code>accounts_supplier</code>), plans comptables (<code>accounting_plan</code>) et masques.
                              </td>
                              <td className="py-3 px-3 text-emerald-400 font-mono font-bold">
                                &lt; 50 Mo (Stable)
                              </td>
                            </tr>

                            {/* Coffre-fort officiel FERnest */}
                            <tr className="bg-emerald-950/20 hover:bg-emerald-950/30">
                              <td className="py-3 px-3 font-bold text-emerald-300 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                Référentiel Unique : FERnest (Prod)
                              </td>
                              <td className="py-3 px-3 text-emerald-200">
                                <span className="font-bold">GED Officielle FERnest</span> (seul et unique endroit légal de conservation des factures).
                              </td>
                              <td className="py-3 px-3 text-emerald-200">
                                Écritures comptables définitives validées par les experts-comptables.
                              </td>
                              <td className="py-3 px-3 text-emerald-400 font-mono font-bold">
                                GED Maître Officielle
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* CAPITALISATION DU CODE EXISTANT : QUE RÉUTILISE-T-ON ? */}
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-5 h-5 text-indigo-400" />
                          <div>
                            <h4 className="text-sm font-bold text-white">Capitalisation du Code Existant : On ne repart PAS de zéro !</h4>
                            <span className="text-[10px] text-slate-400">Ce qui est conservé, adapté et ce qui est définitivement supprimé</span>
                          </div>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                          Réutilisation Maximale
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Ce qu'on réutilise */}
                        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2.5">
                          <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Code & Briques Conservés à 100%
                          </span>
                          <ul className="space-y-1.5 text-[11px] text-slate-300">
                            <li className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span><code>classes/VisioCompte.py</code> : Connecteur HTTP REST vers FERnest (login, upload multipart, sessions urllib3).</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span><code>verifier_exports.py</code> (<code>export_xml()</code>) : Générateur XML historique &lt;ROOT&gt;&lt;TECHNICAL&gt;&lt;DATAS&gt;.</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span><code>classes/Database.py</code> : Connexion PostgreSQL <code>psycopg 3</code> avec <code>row_factory=dict_row</code>.</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>Tables référentielles : <code>accounts_supplier</code>, <code>accounts_customer</code>, <code>accounting_plan</code>, <code>form_models</code>.</span>
                            </li>
                          </ul>
                        </div>

                        {/* Ce qu'on supprime / remplace */}
                        <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2.5">
                          <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            Ce qui est Retiré ou Remplacé
                          </span>
                          <ul className="space-y-1.5 text-[11px] text-slate-300">
                            <li className="flex items-start gap-1.5">
                              <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                              <span><code>files.move_to_docservers()</code> : Supprimé définitivement (plus aucune copie de fichier sur disque).</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                              <span>Stockage fichiers physiques : Dossiers <code>/var/docservers/verifier/original_doc/</code> et miniatures supprimés.</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                              <span>OCR monolithique legacy : Remplacé par le Service IA Documentaire externe sur GPU LexIA (Alphonse).</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                              <span>Matching tiers : Amélioré par l'algorithme Levenshtein &gt; 85% au lieu du simple <code>LIKE</code> textuel.</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Où sont stockées les données déjà préparées */}
                      <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 space-y-2 text-xs">
                        <span className="font-bold text-white flex items-center gap-2">
                          <Database className="w-4 h-4 text-indigo-400" />
                          Où sont stockées les données déjà préparées (champs extraits & écritures) ?
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-300">
                          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                            <strong className="text-sky-300 block">1. En base PostgreSQL locale (Table documents) :</strong>
                            <p>
                              Les données préparées sont stockées en <strong>JSONB léger</strong> (colonnes <code>datas</code> pour les valeurs et <code>positions</code> pour les coordonnées). Cela ne pèse que <strong>quelques kilo-octets</strong> par facture (aucun fichier lourd).
                            </p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                            <strong className="text-emerald-300 block">2. Dans FERnest (Destination Finale) :</strong>
                            <p>
                              Les propositions d'écritures préparées sont injectées via le flux XML (<code>VisioCompte.py</code>) directement dans la comptabilité du dossier client dans FERnest, où le comptable les valide.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* STRATÉGIE ZÉRO COUPURE : CONTINUITÉ DES FLUX & ARCHIVAGE EXISTANT */}
                      <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 text-xs">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span className="font-bold text-white text-xs">
                              Garantie Zéro Coupure : Préservation de l'Existant & Transition Douce
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono text-[10px] font-bold">
                            Dual Run (Side-by-Side)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-slate-300">
                          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                            <strong className="text-emerald-400 block flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              1. Aucun flux existant n'est coupé
                            </strong>
                            <p className="text-slate-400 leading-relaxed">
                              L'ancien OpenCapture continue de fonctionner normalement sur son port habituel. Le nouveau CaptureMind HUB est monté en parallèle sur un endpoint indépendant (<code>/ws/v2/ingest</code>).
                            </p>
                          </div>

                          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                            <strong className="text-sky-400 block flex items-center gap-1">
                              <Database className="w-3.5 h-3.5" />
                              2. Archives actuelles intactes
                            </strong>
                            <p className="text-slate-400 leading-relaxed">
                              Les fichiers déjà archivés dans <code>/var/docservers</code> restent accessibles en lecture seule pour l'historique légal. Seules les NOUVELLES factures adopteront le transit 100% RAM volatile.
                            </p>
                          </div>

                          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                            <strong className="text-indigo-400 block flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              3. Bascule maîtrisée à J+30
                            </strong>
                            <p className="text-slate-400 leading-relaxed">
                              Les développements se font sur le jeu d'essai de 100 factures. La bascule définitive du trafic officiel FERnest ne s'effectue qu'après validation conjointe avec Romain Friderich et M. Flore.
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* VUE 3 : CONTRATS D'ÉCHANGE (JSON IA & XML FERNEST) */}
                {conceptionSubTab === 'contrats-api' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Contrat 1 : Sortie JSON du Service IA */}
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                            <Code2 className="w-4 h-4" />
                            Contrat 1 : Sortie JSON du Service IA FastAPI
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 font-mono">
                            JSON pur stateless
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Format spatial standardisé préservé pour le raccordement de l'Agent IA en Phase 2 par Alphonse :
                        </p>
                        <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
{`{
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
                        </pre>
                      </div>

                      {/* Contrat 2 : Restitution XML vers FERnest */}
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <FileText className="w-4 h-4" />
                            Contrat 2 : Sortie XML Historique vers FERnest
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">
                            verifier_exports.py
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Format historique inchangé consommé directement par FERnest via <code>https://visiocompte.pro</code> :
                        </p>
                        <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
{`<ROOT>
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
                        </pre>
                      </div>

                    </div>
                  </div>
                )}

                {/* VUE 4 : MATRICE DES RÔLES & DÉPENDANCES */}
                {conceptionSubTab === 'matrice-flux' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="font-bold text-sky-400 uppercase text-[10px] tracking-wider block">Lead Ingénierie</span>
                        <h4 className="text-sm font-bold text-white">Jean Elson</h4>
                        <p className="text-slate-300">
                          Architecture globale, développement du Service IA FastAPI en RAM, réécriture de l’orchestrateur CaptureMind HUB, adaptateur XML et recette technique.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/40 space-y-2">
                        <span className="font-bold text-rose-400 uppercase text-[10px] tracking-wider block">Action Bloquante #1</span>
                        <h4 className="text-sm font-bold text-white">Sarobidy (Équipe Infra)</h4>
                        <p className="text-slate-300">
                          Extraction des 100 factures témoins depuis <code>/var/docservers</code> sur Hetzner pour débloquer le banc d’essai GPU. Surveillance de l’occupation disque (97%).
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="font-bold text-indigo-400 uppercase text-[10px] tracking-wider block">GPU & Phase 2</span>
                        <h4 className="text-sm font-bold text-white">Alphonse</h4>
                        <p className="text-slate-300">
                          Mise à disposition du serveur LexIA (RTX 4000 Ada - 20 Go VRAM) pour le benchmark, puis développement et intégration de l’Agent IA en Phase 2.
                        </p>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 0: DIAGNOSTIC & AUDIT DE L'EXISTANT CAPTUREMIND */}
            {cmTab === 'audit' && (
              <div className="space-y-6">

                {/* Hero Banner: Méthodologie d'Audit */}
                <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/60 border border-amber-500/50 shadow-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                        <HelpCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-extrabold text-white tracking-tight">
                            Audit Technique de l’Existant CaptureMind
                          </span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase border border-amber-500/30">
                            Préalable Obligatoire
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          Diagnostic exhaustif de la structure actuelle (OpenCapture, stockage disque, communication FERnest, base de données) avant le plan de développement du HUB 100% en RAM.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={copyAuditQuestions}
                      className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-950/60 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      {copiedAudit ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedAudit ? 'Questionnaire copié !' : 'Copier le Questionnaire (Texte)'}</span>
                    </button>
                  </div>

                  {/* 4 Indicateurs Clés de l'Audit */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="text-slate-400 block text-[11px]">Questions d’audit</span>
                      <span className="font-extrabold text-white text-lg">15 Points Clés</span>
                      <span className="text-[10px] text-amber-400 block">Sur 5 axes techniques</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="text-slate-400 block text-[11px]">Objectif Stockage</span>
                      <span className="font-extrabold text-emerald-400 text-lg">0 Octet Disque</span>
                      <span className="text-[10px] text-emerald-300 block">Transit 100% volatile RAM</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="text-slate-400 block text-[11px]">Interlocuteurs Clés</span>
                      <span className="font-extrabold text-sky-400 text-lg">M. Flore & Alphonse</span>
                      <span className="text-[10px] text-sky-300 block">Règles métier & GPU LexIA</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="text-slate-400 block text-[11px]">Budget Réalisation</span>
                      <span className="font-extrabold text-indigo-400 text-lg">25 à 30 Jours</span>
                      <span className="text-[10px] text-indigo-300 block">Priorité 1 de développement</span>
                    </div>
                  </div>
                </div>

                {/* Filtres par Axe Technique */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider shrink-0 mr-1">Filtrer par Axe :</span>
                  <button
                    onClick={() => setSelectedAuditAxe(0)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                      selectedAuditAxe === 0 ? 'bg-amber-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Tous les 5 Axes (15)
                  </button>
                  <button
                    onClick={() => setSelectedAuditAxe(1)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                      selectedAuditAxe === 1 ? 'bg-amber-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Axe 1 : Code OpenCapture (3)
                  </button>
                  <button
                    onClick={() => setSelectedAuditAxe(2)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                      selectedAuditAxe === 2 ? 'bg-amber-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Axe 2 : Disque vs RAM (3)
                  </button>
                  <button
                    onClick={() => setSelectedAuditAxe(3)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                      selectedAuditAxe === 3 ? 'bg-amber-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Axe 3 : Entrée/Sortie FERnest (3)
                  </button>
                  <button
                    onClick={() => setSelectedAuditAxe(4)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                      selectedAuditAxe === 4 ? 'bg-amber-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Axe 4 : Tiers & M. Flore (2)
                  </button>
                  <button
                    onClick={() => setSelectedAuditAxe(5)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                      selectedAuditAxe === 5 ? 'bg-amber-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Axe 5 : GPU LexIA & Alphonse (2)
                  </button>
                </div>

                {/* Liste des Cartes de Questions d'Audit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {auditQuestionsList
                    .filter(q => selectedAuditAxe === 0 || q.axeNum === selectedAuditAxe)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-500/30">
                                {item.id}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                                {item.axeTitle}
                              </span>
                            </div>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                                item.status === 'Clarifié'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : item.status === 'En cours d’analyse'
                                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-white leading-snug">
                            {item.question}
                          </h4>

                          <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs">
                            <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Pourquoi c’est crucial :
                            </span>
                            <p className="text-slate-300 text-xs leading-relaxed">
                              {item.whyCrucial}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="text-[11px]">Interlocuteur :</span>
                            <span className="font-semibold text-sky-300">{item.targetContact}</span>
                          </div>

                          {/* Zone de retour / Notes d'analyse */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
                              <span>Vos retours d’analyse / constat :</span>
                              <span className="text-[10px] text-slate-500 font-mono">Modifiable</span>
                            </label>
                            <textarea
                              rows={2}
                              value={auditNotes[item.id] !== undefined ? auditNotes[item.id] : item.clarification}
                              onChange={(e) => updateAuditNote(item.id, e.target.value)}
                              className="w-full text-xs p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono resize-none leading-relaxed"
                              placeholder="Indiquez ici vos constatations sur le code ou le serveur existant..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Plan de Développement Opérationnel (Feuille de Route 25-30 jours) */}
                <div className="p-5 md:p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-5">
                  <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                        <Workflow className="w-5 h-5 text-indigo-400" />
                        Plan de Travail Opérationnel CaptureMind (25 à 30 Jours Ouvrés)
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        L’audit technique préalable structure les 4 étapes de développement pour livrer à J+30.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-500/30 font-bold self-start sm:self-auto">
                      Priorité 1 Digipepss
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    {/* Étape 1 */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px]">
                          Jours 1 à 3 (En cours)
                        </span>
                        <span className="text-[10px] text-amber-400 font-bold uppercase">Actif</span>
                      </div>
                      <h4 className="font-bold text-white text-sm">Étape 0 : Audit Existant</h4>
                      <p className="text-slate-300 leading-relaxed text-xs">
                        Réponses aux 15 questions, cartographie du code OpenCapture, confirmation des 4 livrables avec M. Flore et vérification du serveur LexIA avec Alphonse.
                      </p>
                    </div>

                    {/* Étape 2 */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold text-[11px]">
                          Jours 4 à 12
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Banc d'essai</span>
                      </div>
                      <h4 className="font-bold text-white text-sm">Étape 1 : Benchmark 100 Factures</h4>
                      <p className="text-slate-400 leading-relaxed text-xs">
                        Comparaison objective des 3 approches (Multimodale vs OCR+LLM vs Hybride) sur GPU RTX 4000 Ada. Mesure d’exactitude, latence et VRAM.
                      </p>
                    </div>

                    {/* Étape 3 */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold text-[11px]">
                          Jours 13 à 22
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Développement</span>
                      </div>
                      <h4 className="font-bold text-white text-sm">Étape 2 : Moteur 100% RAM & Tiers</h4>
                      <p className="text-slate-400 leading-relaxed text-xs">
                        Développement FastAPI en mémoire vive (io.BytesIO + pypdfium2), matching des tiers FERnest, règles de TVA et moteur d’écritures équilibrées.
                      </p>
                    </div>

                    {/* Étape 4 */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px]">
                          Jours 23 à 30
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">Recette</span>
                      </div>
                      <h4 className="font-bold text-white text-sm">Étape 3 : Tests 0 Stockage & Livraison</h4>
                      <p className="text-slate-400 leading-relaxed text-xs">
                        Vérification de purge déterministe (0 octet disque résiduel), simulation de charge, tests d'étanchéité et recette conjointe à J+30 avec R. Friderich.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: DECISIONS & CADRAGE COMPTABLE */}
            {cmTab === 'decisions' && (
              <div className="space-y-6">

                {/* 0. ACCORD FORMEL DE M. FRIDERICH : PASSAGE EN PHASE OPÉRATIONNELLE */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/50 border border-emerald-500/50 shadow-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-white tracking-tight">Accord Formel de M. Friderich : Feu Vert Phase Opérationnelle</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase border border-emerald-500/30">
                            Validé à 100%
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Réponse au message du 30 octobre : <strong>Aucun changement d'architecture</strong>, l'ensemble de vos choix techniques est approuvé.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
                      Cap sur les 25 à 30 jours
                    </span>
                  </div>

                  {/* Décryptage : Ce que veut dire le message */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="font-bold text-emerald-400 block flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" />
                        Architecture Validée sans changement
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        M. Friderich valide l'indépendance totale d'OpenCapture, le découpage en 4 briques, FERnest en référentiel officiel unique et le traitement 100% en RAM sans stockage disque permanent.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="font-bold text-amber-300 block flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Point d'Attention M. Flore (Capitalisation)
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Romain insiste : les bibliothèques de tiers et modèles comptables existent déjà chez FERnest. <strong>Ne pas réinventer la roue</strong> : se rapprocher de M. Flore pour importer ces règles existantes.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="font-bold text-sky-400 block flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-sky-400" />
                        Recette Finale Fixée à J+30
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Plus de phases d'étude supplémentaires : concrétisation directe. À l'issue des 25 à 30 jours, recette fonctionnelle conjointe pour vérifier les écritures et le non-stockage.
                      </p>
                    </div>
                  </div>

                  {/* Plan d'action immédiat en 4 points */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">Actions immédiates :</span>
                      <span className="text-slate-300">1. Valider créneaux GPU avec <strong>Alphonse</strong></span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300">2. Récupérer règles existantes & 100 factures avec <strong>M. Flore</strong></span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300">3. Envoyer la lettre Peppol</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">Objectif commercialisable ERP</span>
                  </div>
                </div>

                {/* 1. Les 4 Éléments Requis pour la Partie Comptable */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/40 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Point 1 de la Réponse Officielle</span>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-400" />
                        Les 4 Éléments Indispensables Requis pour Constituer le Référentiel Comptable
                      </h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Déjà Existant chez M. Flore (Confirmé R. Friderich)
                    </span>
                  </div>

                  {/* Confirmation Box Flore */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 space-y-1.5">
                    <div className="font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Confirmation Clé : Ces 4 éléments existent déjà et sont détenus par M. Flore !</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      Romain Friderich a explicitement indiqué : <strong className="text-emerald-300">« (attention, déjà existant, veuillez vous rapprocher de Mr Flore) »</strong>. 
                      Cela signifie qu’il n’y a <strong>aucune création ex nihilo</strong> à faire : M. Flore dispose déjà du PCG, des plans dossiers, des règles d'imputation et des tables de tiers. Jean Elson n'a plus qu'à prendre contact directement avec lui pour les intégrer au format JSON/mémoire pour le banc d'essai CaptureMind.
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    À partir de ces 4 éléments récupérés auprès de M. Flore, Jean Elson constituera le référentiel comptable structuré (données JSON ou base en mémoire) permettant à CaptureMind d’interroger les comptes disponibles et de proposer des écritures équilibrées Débit/Crédit :
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-md bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-bold text-xs">1</span>
                        <h4 className="text-xs font-bold text-white">Le plan comptable général utilisé (PCG)</h4>
                      </div>
                      <p className="text-[11px] text-slate-400">Arborescence complète des classes de comptes (60x, 70x, 401, 44566...) pour cadrer les imputations de base.</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-md bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-bold text-xs">2</span>
                        <h4 className="text-xs font-bold text-white">Le plan comptable spécifique aux dossiers ou entreprises</h4>
                      </div>
                      <p className="text-[11px] text-slate-400">Sous-comptes personnalisés par typologie de client ou dossier, s'il en existe dans FERnest.</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-md bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-bold text-xs">3</span>
                        <h4 className="text-xs font-bold text-white">Les règles d'imputation comptable actuellement utilisées</h4>
                      </div>
                      <p className="text-[11px] text-slate-400">Règles de qualification par nature de charge, règles de TVA applicables et critères de rapprochement tiers.</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-md bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-bold text-xs">4</span>
                        <h4 className="text-xs font-bold text-white">Quelques exemples d'écritures comptables déjà validées</h4>
                      </div>
                      <p className="text-[11px] text-slate-400">Échantillon d'écritures réelles issues de FERnest pour tester et valider l'équilibre strict Débit / Crédit.</p>
                    </div>
                  </div>
                </div>

                {/* 2. Les 2 Phases de l'Enveloppe de 25 à 30 Jours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-400 uppercase">Phase 1 : Banc d'Essai</span>
                      <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">10 à 15 jours ouvrés</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Étude Comparative Multimodale / OCR / Hybride</h4>
                    <p className="text-xs text-slate-300">
                      Évaluation objective sur un échantillon d’environ <strong>100 factures témoins</strong>. Mesure de la précision, de la latence et de la VRAM GPU consommée sur le serveur partagé LexIA (RTX 4000 Ada avec Alphonse).
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400 uppercase">Phase 2 : Développement</span>
                      <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">Environ 15 jours ouvrés</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Intégration du Moteur Retenu & Modules Comptables</h4>
                    <p className="text-xs text-slate-300">
                      Développement complémentaire du moteur en mémoire vive, intégration du référentiel comptable, modules de contrôles arithmétiques et raccordement API à FERnest.
                    </p>
                  </div>
                </div>

                {/* 3. Synthèse des 8 Décisions d'Architecture Actées */}
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                      Synthèse des 8 Décisions d'Architecture Actées
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Conformité avec les orientations validées par la direction technique.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {captureMindDecisions.map((dec) => (
                      <div key={dec.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1 max-w-2xl">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-indigo-400 font-bold">#{dec.id}</span>
                            <span className="font-bold text-white">{dec.subject}</span>
                          </div>
                          <p className="text-slate-400">{dec.explanation}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                            {dec.choice}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            dec.status === 'Confirmé' || dec.status === 'Déjà Existant chez M. Flore'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          }`}>
                            {dec.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SIMULATEUR RAM VIVANT */}
            {cmTab === 'flux' && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Workflow className="w-5 h-5 text-sky-400" />
                      Simulateur de Flux Vivant : GED FERnest &lt;--&gt; HUB CaptureMind
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Visualisez en direct l'allocation mémoire RAM, l'inférence IA et la purge déterministe.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                      {invoicePresets.map((preset) => (
                        <button
                          key={preset.id}
                          disabled={isCmSimulating}
                          onClick={() => setSelectedPreset(preset)}
                          className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                            selectedPreset.id === preset.id ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {preset.type}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={runCaptureMindSim}
                      disabled={isCmSimulating}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        isCmSimulating ? 'bg-slate-800 text-slate-500' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isCmSimulating ? 'Calcul en cours...' : 'Lancer le flux RAM'}</span>
                    </button>
                  </div>
                </div>

                {/* Active Tool Badge (Visible Live) */}
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Boxes className="w-4 h-4" />
                      Outil / Bibliothèque en cours d'exécution :
                    </span>
                    <span className="font-mono text-white font-bold bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                      {cmActiveTool}
                    </span>
                  </div>
                  <button
                    onClick={() => setCmTab('outils')}
                    className="text-indigo-300 hover:text-white underline text-[11px] cursor-pointer"
                  >
                    Voir la stack complète &rarr;
                  </button>
                </div>

                {/* Hardware Meters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">RAM Tampon Utilisée</span>
                      <span className="text-lg font-bold font-mono text-white">
                        {allocatedRAM} Ko <span className="text-xs text-slate-500 font-normal">/ 0 octet disque</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">VRAM GPU LexIA (RTX 4000)</span>
                      <span className="text-lg font-bold font-mono text-indigo-300">
                        {allocatedVRAM} Mo <span className="text-xs text-slate-500 font-normal">/ 20 Go</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Sécurité Persistance</span>
                      <span className="text-lg font-bold text-emerald-400">
                        {cmStep === 5 ? 'RAM Purge Conforme' : isCmSimulating ? 'RAM Volatile Active' : 'En veille'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Steps Pipeline */}
                <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold uppercase tracking-wider text-slate-300">Pipeline de Traitement Déterministe</span>
                    <span>{cmStep === 0 ? 'En attente' : cmStep === 5 ? 'Terminé (RAM purgée)' : `Étape ${cmStep}/5`}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
                    <div className={`p-3 rounded-lg border transition-all ${cmStep >= 1 ? 'bg-indigo-950/40 border-indigo-500 text-white font-medium' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                      <div className="text-[10px] text-indigo-400 font-bold mb-1">ÉTAPE 1</div>
                      1. Flux RAM (BytesIO)
                    </div>
                    <div className={`p-3 rounded-lg border transition-all ${cmStep >= 2 ? 'bg-indigo-950/40 border-indigo-500 text-white font-medium' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                      <div className="text-[10px] text-indigo-400 font-bold mb-1">ÉTAPE 2</div>
                      2. Aiguillage IA / Natif
                    </div>
                    <div className={`p-3 rounded-lg border transition-all ${cmStep >= 3 ? 'bg-indigo-950/40 border-indigo-500 text-white font-medium' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                      <div className="text-[10px] text-indigo-400 font-bold mb-1">ÉTAPE 3</div>
                      3. Tiers & Modèles
                    </div>
                    <div className={`p-3 rounded-lg border transition-all ${cmStep >= 4 ? 'bg-indigo-950/40 border-indigo-500 text-white font-medium' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                      <div className="text-[10px] text-indigo-400 font-bold mb-1">ÉTAPE 4</div>
                      4. Lignes d'Écritures
                    </div>
                    <div className={`p-3 rounded-lg border transition-all ${cmStep === 5 ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-medium' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                      <div className="text-[10px] text-emerald-400 font-bold mb-1">ÉTAPE 5</div>
                      5. Purge & Retour JSON
                    </div>
                  </div>
                </div>

                {/* Accounting Preview & Execution Console */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Console Logs */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
                        <span className="font-mono font-bold text-sky-400">Journal d'Exécution Stateless</span>
                        <span className="text-slate-500 font-mono">io.BytesIO Stream</span>
                      </div>
                      <div className="p-2.5 rounded bg-black/80 font-mono text-[11px] text-emerald-400/90 h-[150px] overflow-y-auto space-y-1 no-scrollbar">
                        {cmLogs.length === 0 ? <div className="text-slate-600 italic">En attente de lancement... Cliquez sur « Lancer le flux RAM ».</div> : cmLogs.map((log, idx) => <div key={idx}>&gt; {log}</div>)}
                      </div>
                    </div>
                  </div>

                  {/* Accounting Preview */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                      <span className="font-bold text-white">Proposition d'Écritures pour FERnest</span>
                      <span className="text-emerald-400 text-[11px] font-mono">Équilibre Vérifié : HT + TVA = TTC</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-400 text-[11px] border-b border-slate-800/60 pb-1">
                        <span>Compte / Libellé</span>
                        <span>Débit (€)</span>
                        <span>Crédit (€)</span>
                      </div>

                      <div className="flex justify-between font-mono text-white">
                        <span>{selectedPreset.suggestedAccount}</span>
                        <span className="text-sky-300">{selectedPreset.amountHT.toFixed(2)}</span>
                        <span>-</span>
                      </div>

                      <div className="flex justify-between font-mono text-white">
                        <span>445660 (TVA déductible s/ ABS {selectedPreset.vatRate}%)</span>
                        <span className="text-sky-300">{(selectedPreset.amountTTC - selectedPreset.amountHT).toFixed(2)}</span>
                        <span>-</span>
                      </div>

                      <div className="flex justify-between font-mono text-white border-t border-slate-800/80 pt-1">
                        <span>{selectedPreset.suggestedSubAccount}</span>
                        <span>-</span>
                        <span className="text-emerald-300">{selectedPreset.amountTTC.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: OUTILS & BIBLIOTHEQUES CAPTUREMIND */}
            {cmTab === 'outils' && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
                <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Boxes className="w-5 h-5 text-amber-400" />
                      Cartographie du Flux & Boîte à Outils / Bibliothèques (CaptureMind HUB)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Vue claire de chaque étape du pipeline avec la bibliothèque logicielle exacte, sa licence et son rôle.
                    </p>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 font-mono">
                    Licences 100% Permissives (Zéro AGPL)
                  </span>
                </div>

                <div className="space-y-3.5">
                  {captureMindStack.map((item) => (
                    <div
                      key={item.stepNum}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="h-6 w-6 rounded-md bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-mono font-bold text-xs">
                            {item.stepNum}
                          </span>
                          <span className="text-sm font-bold text-white">{item.stepName}</span>
                          <span className="text-xs text-slate-400">({item.toolType})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-sky-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                            {item.toolName}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                            {item.license}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300">{item.role}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                        <div>
                          <span className="text-slate-500 block">Entrée / Sortie :</span>
                          <span className="text-slate-300 font-mono">{item.inputOutput}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Stockage & Mémoire :</span>
                          <span className="text-emerald-400 font-mono">{item.memoryStorage}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Point Clé Technique :</span>
                          <span className="text-indigo-300">{item.keyFeature}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SCHEMA STATELESS */}
            {cmTab === 'schema' && (
              <div className="space-y-6">

                {/* Banner Architecture Découplée FastAPI */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/60 via-indigo-950/70 to-slate-900 border border-sky-500/40 shadow-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-white">
                            Architecture Découplée : Service IA Documentaire FastAPI Indépendant
                          </h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold uppercase border border-sky-500/30">
                            Cœur FastAPI
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Séparation nette entre le <strong>Service IA Documentaire (Stateless en RAM)</strong> et le <strong>HUB Métier CaptureMind (Orchestrateur & Tiers)</strong>.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
                      0 Octet Disque • Purge RAM
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-sky-500/30 space-y-1">
                      <span className="font-bold text-sky-300 flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-sky-400" />
                        1. Service IA FastAPI (Indépendant)
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Moteur stateless indépendant hébergé sur LexIA (RTX 4000 Ada). Reçoit le flux multipart en RAM (<code>io.BytesIO</code>), parse via <code>pypdfium2</code> ou modèle IA, et retourne le JSON brut <code>{`{ datas, positions, pages }`}</code> sans aucun docserver disque.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-1">
                      <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-indigo-400" />
                        2. CaptureMind HUB (Orchestrateur)
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Reçoit le document via <code>/ws/ingest</code>, appelle le Service IA FastAPI, effectue le matching des tiers dans PostgreSQL (SIREN + Levenshtein), applique les règles de M. Flore et génère le XML historique via son adaptateur.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-1">
                      <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-emerald-400" />
                        3. FERnest GED (VisioCompte)
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Reçoit l'export XML historique <code>&lt;ROOT&gt;&lt;TECHNICAL&gt;...&lt;DATAS&gt;</code> via <code>VisioCompte.py</code> sans aucune modification nécessaire. L'expert-comptable valide définitivement les écritures.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">Environnement 1</span>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-sky-400" />
                      FERnest (Référentiel Unique)
                    </h3>
                    <ul className="text-xs space-y-2 text-slate-300">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> GED Officielle (stockage pérenne des PDF)</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Référentiel officiel Tiers & Plan Comptable</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Écritures comptables définitives</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Gestion des reprises avec identifiant de traitement</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Le HUB Stateless</span>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-indigo-400" />
                      CaptureMind (Moteur RAM)
                    </h3>
                    <ul className="text-xs space-y-2 text-slate-300">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Pipeline d'aiguillage (Texte / Factur-X / IA)</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Modèles IA modulaires (PaddleOCR, Qwen3-VL)</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Moteur de correspondance tiers et modèles</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Purge déterministe immédiate de la RAM</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Connaissances</span>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      Bibliothèques Métier
                    </h3>
                    <ul className="text-xs space-y-2 text-slate-300">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Base Tiers intelligente (SIREN, TVA, raison sociale)</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Modèles comptables (règles d'imputation par dossier)</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Enrichissement supervisé par le comptable dans FERnest</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Séparation règles générales vs dossiers isolés</li>
                    </ul>
                  </div>
                </div>

                {/* Embedded Romain original schema */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-indigo-400" />
                      Schémas Fonctionnels Transmis par Romain FRIDERICH
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">Document de cadrage officiel</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
                    <img
                      src="/assets/aistudio/image_4679e641.png"
                      alt="Schémas fonctionnels CaptureMind et FERnest"
                      className="w-full h-auto max-h-[460px] object-contain rounded-lg mx-auto"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: EMAIL CAPTUREMIND */}
            {cmTab === 'email' && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Send className="w-5 h-5 text-indigo-400" />
                      Réponse pour M. Friderich — Ciblée sur le Reste à Préciser
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      CaptureMind étant validé sans réserve par M. Friderich, cette réponse évite les répétitions et clarifie les 3 points ouverts : Jalons, Licences Peppol et Maintien B2Brouter.
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(currentEmailText)}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all cursor-pointer self-start sm:self-auto"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copié !' : "Copier le texte sélectionné"}</span>
                  </button>
                </div>

                {/* 4-Question Tracking Matrix */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Scale className="w-4 h-4 text-indigo-400" />
                      Tableau de Suivi : État des 4 Questions de M. Friderich
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">Stratégie : Répondre uniquement à ce qui reste ouvert</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">1. CaptureMind (25-30j)</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium text-[10px] border border-emerald-500/20">Couvert & Validé</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Accord formel de M. Friderich (4 briques, RAM volatile, zéro stockage). Prise de contact directe avec M. Flore pour l'existant. <strong className="text-emerald-300">Non répété dans l'email.</strong>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">2. Planning & Jalons (50-60j)</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-medium text-[10px] border border-indigo-500/20">Précisé dans l'email</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        4 jalons découpés (J1-J2 CaptureMind 25-30j, J3-J4 Peppol 25-30j). Démarches OpenPeppol et PPF distinguées du développement technique.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">3. Licences Peppol AS4</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-medium text-[10px] border border-indigo-500/20">Précisé dans l'email</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        phase4 / Oxalis sous <strong>Apache 2.0</strong>, phoss SMP sous <strong>MPL 2.0</strong>. Licences permissives commerciales, conteneur étanche sans contamination.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-sky-500/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">4. Maintien B2Brouter</span>
                        <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-medium text-[10px] border border-sky-500/20">Relayé à M. Iliev</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Sécurise le dépôt DGFiP début janvier 2027 sans pénaliser CaptureMind. Les précisions réglementaires et partenariales sont confiées à M. Iliev.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Version Switcher */}
                <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <button
                    onClick={() => setEmailVersion('msg-sarobidy')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      emailVersion === 'msg-sarobidy'
                        ? 'bg-amber-600 text-white shadow-sm font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Server className="w-3.5 h-3.5 text-amber-200" />
                    <span>1. Message pour Sarobidy (Hetzner : 100 factures & Purge)</span>
                  </button>
                  <button
                    onClick={() => setEmailVersion('msg-flore')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      emailVersion === 'msg-flore'
                        ? 'bg-emerald-600 text-white shadow-sm font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5 text-emerald-200" />
                    <span>2. Message pour M. Flore (FERnest : PCG & 5 XML)</span>
                  </button>
                  <button
                    onClick={() => setEmailVersion('agent-ia')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      emailVersion === 'agent-ia'
                        ? 'bg-indigo-600 text-white shadow-sm font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Direction : Réponse Agent IA (Romain)</span>
                  </button>
                  <button
                    onClick={() => setEmailVersion('targeted')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      emailVersion === 'targeted'
                        ? 'bg-indigo-600 text-white shadow-sm font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Direction : Réponse Synthétique 4 Points</span>
                  </button>
                  <button
                    onClick={() => setEmailVersion('official')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      emailVersion === 'official'
                        ? 'bg-indigo-600 text-white shadow-sm font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Direction : Version Complète en 3 Sections</span>
                  </button>
                </div>

                {/* Contextual Notice */}
                {emailVersion === 'msg-sarobidy' ? (
                  <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2">
                    <Server className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>Action Opérationnelle Sarobidy (Jour 3) :</strong> Demande d'extraction de l'archive de 100 factures réelles depuis <code>/var/docservers/verifier/original_doc/</code> et commande de nettoyage des miniatures orphelines pour soulager le disque Hetzner.
                    </span>
                  </div>
                ) : emailVersion === 'msg-flore' ? (
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Action Métier Monsieur Flore (Jour 4) :</strong> Demande du Plan Comptable Général (PCG), des règles d'affectation de charges et TVA, ainsi que de 3 à 5 fichiers XML d'écritures réelles validées dans FERnest.
                    </span>
                  </div>
                ) : emailVersion === 'agent-ia' ? (
                  <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/40 text-xs text-indigo-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>Réponse au Nouveau Message de M. Friderich (Agent IA) :</strong> Accueil très favorable de la phase 2 confiée à Alphonse. Confirmation que les 25 à 30 jours de CaptureMind restent la priorité absolue, avec anticipation d'interfaces API REST et schémas JSON modulaires dès la conception.
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/40 text-xs text-indigo-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>Version Direction :</strong> Réponses de cadrage validées par Romain Friderich.
                    </span>
                  </div>
                )}

                <div className="my-2 grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 font-medium">À :</span>{' '}
                    <strong className="text-white">
                      {emailVersion === 'msg-sarobidy'
                        ? 'Sarobidy (Admin Système / Infra Hetzner)'
                        : emailVersion === 'msg-flore'
                        ? 'Monsieur Flore (Expert Comptable / Référent FERnest)'
                        : 'Romain FRIDERICH <rfriderich@digipepss.pro>'}
                    </strong>
                  </div>
                  <div><span className="text-slate-500 font-medium">De :</span> Jean Elson (Lead Développeur)</div>
                  <div>
                    <span className="text-slate-500 font-medium">Objet :</span> {currentEmailSubject}
                  </div>
                </div>

                <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-5 md:p-6 text-slate-200 font-mono text-xs md:text-sm leading-relaxed whitespace-pre-wrap selection:bg-indigo-600 shadow-inner">
                  {currentEmailText}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* ============ PROJET 2 : VISIOFACT PEPPOL =============== */}
        {/* ======================================================== */}
        {currentProject === 'visiofact' && (
          <div className="space-y-6">
            
            {/* Project Context Alert */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3 text-xs">
              <Network className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Projet VISIOfact — Plateforme Agréée (PDP) & Interopérabilité Peppol AS4</span>
                  <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-normal">Dossier DGFiP Janvier 2027</span>
                </div>
                <p className="text-slate-300">
                  VISIOfact fonctionne actuellement avec <strong>B2Brouter en production</strong> (10 jours réalisés). Pour sécuriser le dépôt du dossier DGFiP début janvier 2027 sans bloquer CaptureMind, B2Brouter est maintenu temporairement, pendant que notre propre point d'accès natif (phase4 / Oxalis sous licence Apache 2.0) est préparé pour l'autonomie pérenne.
                </p>
              </div>
            </div>

            {/* TAB 1: DECISIONS PEPPOL & LICENCES (NOUVELLE VUE CLÉ DEMANDÉE !) */}
            {vfTab === 'decisions' && (
              <div className="space-y-6">
                
                {/* 1. Analyse Juridique & Licences Commerciales */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/40 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Point 3 de la Réponse Officielle</span>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Scale className="w-5 h-5 text-emerald-400" />
                        Composants Open Source, Licences & Compatibilité Commerciale
                      </h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                      Apache 2.0 & MPL 2.0 vérifiées
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    L’approche repose sur l’intégration de composants open source éprouvés afin d’éviter de développer nous-mêmes toute la couche AS4 complexe. Concernant l’utilisation commerciale : les licences <strong>Apache 2.0</strong> et <strong>MPL 2.0</strong> l’autorisent expressément, sous réserve du respect des mentions de licence et de la redistribution éventuelle du seul code source modifié de ces briques (sans aucun impact sur le code propriétaire fermé de VISIOfact) :
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* phase4 Card */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400">Transport AS4 Principal</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold">Apache 2.0</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">phase4 (Philip Helger)</h4>
                      <p className="text-[11px] text-slate-300">
                        Bibliothèque Java intégrable dans notre conteneur dédié, prenant en charge AS4/ebMS3 avec un profil Peppol officiel prêt à l'emploi.
                      </p>
                      <a
                        href="https://github.com/phax/phase4"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 underline font-mono pt-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        github.com/phax/phase4
                      </a>
                    </div>

                    {/* Oxalis Card */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-400">Solution Alternative</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold">Apache 2.0</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">Oxalis / Oxalis-NG</h4>
                      <p className="text-[11px] text-slate-300">
                        Implémentation d'un Access Point Peppol complet. La version et les composants retenus devront être testés avant validation finale.
                      </p>
                      <span className="text-[11px] text-slate-500 block pt-1">
                        Évalué en parallèle pour valider la compatibilité avec FastAPI.
                      </span>
                    </div>

                    {/* phoss SMP Card */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400">Annuaire Participants</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono font-bold">MPL 2.0 / Apache</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">phoss SMP (Service Metadata)</h4>
                      <p className="text-[11px] text-slate-300">
                        Publication et gestion des métadonnées de nos propres clients. Le backend est sous licence MPL 2.0 et les modules sous Apache 2.0.
                      </p>
                      <a
                        href="https://github-wiki-see.page/m/phax/phoss-smp/wiki/License"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 underline font-mono pt-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        phoss-smp/wiki/License
                      </a>
                    </div>
                  </div>
                </div>

                {/* 2. Décisions Opérationnelles Actées pour VISIOfact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-sky-500/30 space-y-3">
                    <span className="text-xs font-bold text-sky-400 uppercase">Décision 1 : Continuité B2Brouter</span>
                    <h4 className="text-sm font-bold text-white">Zéro Risque sur l’Échéance DGFiP Janvier 2027</h4>
                    <p className="text-xs text-slate-300">
                      B2Brouter est maintenu temporairement (<code className="text-sky-300">DELIVERY_MODE=b2brouter</code>). Les comptes rendus de tests d’interopérabilité étant facultatifs au dépôt initial, le dossier est sécurisé sans charge de développement bloquante.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-indigo-500/30 space-y-3">
                    <span className="text-xs font-bold text-indigo-400 uppercase">Décision 2 : Point d'Accès Natif (25 à 30 jours)</span>
                    <h4 className="text-sm font-bold text-white">Autonomie Pérenne sans Dépendance Commerciale</h4>
                  </div>
                </div>

                {/* 3. Répartition des Rôles & Gouvernance Technique (Recommandation Actée) */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-400" />
                      Gouvernance & Répartition des Rôles face aux 4 Questions de M. Friderich
                    </h4>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                      Alignement Équipe
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">Jean Elson</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold text-[10px]">Points 1, 2 & 3</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-300">
                        <li className="flex items-start gap-1.5">• <span><strong>Point 1 (CaptureMind) :</strong> Confirmation du périmètre 25-30j, des 4 éléments comptables requis et de la purge RAM.</span></li>
                        <li className="flex items-start gap-1.5">• <span><strong>Point 2 (Planning) :</strong> Grand tableau des jalons avec CaptureMind en Priorité 1 (50-60j au total).</span></li>
                        <li className="flex items-start gap-1.5">• <span><strong>Point 3 (Peppol Open Source) :</strong> Analyse comparative phase4 / Oxalis, phoss SMP et compatibilité commerciale Apache 2.0 / MPL 2.0.</span></li>
                        <li className="flex items-start gap-1.5 text-amber-300">• <span><em>Mention formelle : le choix définitif du composant AS4 et les modalités d'intégration restent à confirmer avec M. Iliev.</em></span></li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">Georgi Iliev</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">Point 4 & Arbitrage Peppol</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-300">
                        <li className="flex items-start gap-1.5">• <span><strong>Point 4 (Dossier DGFiP & B2Brouter) :</strong> Apporte directement à M. Friderich les éléments techniques et réglementaires concernant le maintien de B2Brouter début janvier 2027.</span></li>
                        <li className="flex items-start gap-1.5">• <span><strong>Sécurisation Réglementaire :</strong> Suivi des exigences d'immatriculation DGFiP et des tests facultatifs au dépôt initial.</span></li>
                        <li className="flex items-start gap-1.5 text-emerald-300">• <span><strong>Arbitrage Technique :</strong> Validation finale conjointe avec Jean Elson du composant AS4 retenu et de son raccordement à l'architecture FastAPI.</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SIMULATEUR PEPPOL VIVANT */}
            {vfTab === 'peppol-flux' && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Network className="w-5 h-5 text-emerald-400" />
                      Simulateur Réseau Peppol AS4 Vivant
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Comparez en direct le transit d'une facture électronique : via B2Brouter (actuel en production) ou via notre Point d'Accès Natif (phase4 / Oxalis).
                    </p>
                  </div>

                  {/* Mode Selector */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400">Mode de Transport :</span>
                    <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                      <button
                        onClick={() => { setPeppolMode('b2brouter'); setVfStep(0); setVfLogs([]); }}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                          peppolMode === 'b2brouter' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Option A : B2Brouter (Production active)
                      </button>
                      <button
                        onClick={() => { setPeppolMode('native-phase4'); setVfStep(0); setVfLogs([]); }}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                          peppolMode === 'native-phase4' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Option B : Natif phase4 (Cible 25-30j)
                      </button>
                    </div>

                    <button
                      onClick={runVisiofactPeppolSim}
                      disabled={isVfSimulating}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        isVfSimulating ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isVfSimulating ? 'Transmission Peppol...' : 'Émettre Facture Peppol'}</span>
                    </button>
                  </div>
                </div>

                {/* Active Tool Badge (Visible Live) */}
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Boxes className="w-4 h-4" />
                      Composant Peppol actif :
                    </span>
                    <span className="font-mono text-white font-bold bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                      {vfActiveTool}
                    </span>
                  </div>
                  <button
                    onClick={() => setVfTab('outils')}
                    className="text-emerald-300 hover:text-white underline text-[11px] cursor-pointer"
                  >
                    Voir la stack complète &rarr;
                  </button>
                </div>

                {/* Status Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block mb-1">Mode Actif</span>
                    <span className="font-bold text-white font-mono">
                      {peppolMode === 'native-phase4' ? 'phase4 AS4 (Java Conteneur)' : 'B2Brouter REST API'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block mb-1">Licence Logicielle</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {peppolMode === 'native-phase4' ? 'Apache 2.0 (100% libre)' : 'Contrat Commercial Tiers'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block mb-1">Clé Privée PKI</span>
                    <span className="font-bold text-sky-400 font-mono">
                      {peppolMode === 'native-phase4' ? 'OpenBao (Coffre-fort)' : 'Gérée chez B2Brouter'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block mb-1">Statut CDV Facture</span>
                    <span className="font-bold text-amber-300 font-mono">{currentInvoiceCdv}</span>
                  </div>
                </div>

                {/* Network Animation Diagram */}
                <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold uppercase tracking-wider text-slate-300">Cheminement du Message AS4 sur le Réseau Peppol (4-Corner Model)</span>
                    <span>{vfStep === 0 ? 'Prêt à émettre' : vfStep === 4 ? 'Livraison confirmée par MDN' : `Étape ${vfStep} sur 4 en cours...`}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {/* Corner 1 */}
                    <div className={`p-4 rounded-xl border ${vfStep >= 1 ? 'bg-slate-900 border-indigo-500' : 'bg-slate-950/40 border-slate-800 opacity-60'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-indigo-400">Coin 1 (Émetteur)</span>
                        <Building2 className="w-4 h-4 text-slate-400" />
                      </div>
                      <h4 className="text-xs font-bold text-white">VISIOfact / Client</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Génération du XML Factur-X / UBL dans le pipeline Delivery.</p>
                    </div>

                    {/* Corner 2 */}
                    <div className={`p-4 rounded-xl border ${vfStep >= 2 ? 'bg-slate-900 border-emerald-500' : 'bg-slate-950/40 border-slate-800 opacity-60'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-emerald-400">Coin 2 (Notre Access Point)</span>
                        <Server className="w-4 h-4 text-slate-400" />
                      </div>
                      <h4 className="text-xs font-bold text-white">
                        {peppolMode === 'native-phase4' ? 'AP phase4 (Natif)' : 'B2Brouter (Tiers)'}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {peppolMode === 'native-phase4' ? 'Signature WS-Security, SML/SMP et chiffrement AS4.' : 'Envoi REST vers API B2Brouter.'}
                      </p>
                    </div>

                    {/* Corner 3 */}
                    <div className={`p-4 rounded-xl border ${vfStep >= 3 ? 'bg-slate-900 border-emerald-500' : 'bg-slate-950/40 border-slate-800 opacity-60'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-sky-400">Coin 3 (AP Destinataire)</span>
                        <Globe2 className="w-4 h-4 text-slate-400" />
                      </div>
                      <h4 className="text-xs font-bold text-white">Access Point Distant</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Réception ebMS3, contrôle d'intégrité et renvoi du reçu (Receipt).</p>
                    </div>

                    {/* Corner 4 */}
                    <div className={`p-4 rounded-xl border ${vfStep === 4 ? 'bg-emerald-950/40 border-emerald-500' : 'bg-slate-950/40 border-slate-800 opacity-60'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-purple-400">Coin 4 (Destinataire)</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <h4 className="text-xs font-bold text-white">Logiciel / ERP Client</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Réception finale et mise à jour des statuts CDV dans VISIOfact.</p>
                    </div>
                  </div>
                </div>

                {/* Peppol Logs */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
                    <span className="font-mono font-bold text-emerald-400">Console Réseau AS4 / Peppol Logs</span>
                    <span className="text-slate-500 font-mono">Trace OpenSearch</span>
                  </div>
                  <div className="p-2.5 rounded bg-black/80 font-mono text-[11px] text-emerald-400/90 h-[110px] overflow-y-auto space-y-1 no-scrollbar">
                    {vfLogs.length === 0 ? <div className="text-slate-600 italic">Prêt à transmettre. Cliquez sur « Émettre Facture Peppol ».</div> : vfLogs.map((l, i) => <div key={i}>&gt; {l}</div>)}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: GRAND TABLEAU DES 4 JALONS (POINT 2 OFFICIEL) */}
            {vfTab === 'planning' && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
                <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-sky-400" />
                      Grand Tableau des 4 Jalons & Dépendances (50 à 60 jours au total)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Ordre de priorité : finaliser CaptureMind avant de concentrer les efforts sur le point d'accès Peppol natif.
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20 font-mono">
                    Enchaînement sans bloquer la DGFiP
                  </span>
                </div>

                {/* The 4 Milestones Table */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Sujet</th>
                        <th className="py-3 px-4 font-semibold">Estimation / Échéance</th>
                        <th className="py-3 px-4 font-semibold">Priorité</th>
                        <th className="py-3 px-4 font-semibold">Principales étapes et dépendances</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {planningMilestones.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white">{m.subject}</td>
                          <td className="py-3.5 px-4 font-mono text-sky-300 font-bold">{m.estimation}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${m.priorityBadge}`}>
                              {m.priority}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 max-w-md">
                            <div>{m.stepsAndDependencies}</div>
                            <div className="text-[11px] text-slate-500 mt-1">{m.details}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Synthesis Card: 50 to 60 Days Total */}
                <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>Total Développement Interne : 50 à 60 jours ouvrés</span>
                      <span className="text-slate-400 font-normal">(CaptureMind 25-30j + Peppol Natif 25-30j)</span>
                    </div>
                    <p className="text-slate-400">
                      Ces délais de développement sont distincts des démarches externes (OpenPeppol, accords, certificats, tests et API PPF).
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold text-sm">
                    50 à 60 j.o.
                  </span>
                </div>
              </div>
            )}

            {/* TAB 4: OUTILS & BIBLIOTHEQUES VISIOFACT */}
            {vfTab === 'outils' && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
                <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Boxes className="w-5 h-5 text-amber-400" />
                      Cartographie du Flux Peppol & Boîte à Outils / Bibliothèques (VISIOfact)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Détail de chaque composant de transport, validation Schematron, PKI et gestion des statuts réseau.
                    </p>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 font-mono">
                    Composants Open Source Apache 2.0
                  </span>
                </div>

                <div className="space-y-3.5">
                  {visiofactStack.map((item) => (
                    <div
                      key={item.stepNum}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="h-6 w-6 rounded-md bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-xs">
                            {item.stepNum}
                          </span>
                          <span className="text-sm font-bold text-white">{item.stepName}</span>
                          <span className="text-xs text-slate-400">({item.toolType})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                            {item.toolName}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            item.licenseStatus === 'Permissive (Libre)'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : item.licenseStatus === 'Contrat Commercial'
                              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                              : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                          }`}>
                            {item.license}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300">{item.role}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                        <div>
                          <span className="text-slate-500 block">Entrée / Sortie :</span>
                          <span className="text-slate-300 font-mono">{item.inputOutput}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Environnement & Données :</span>
                          <span className="text-sky-300 font-mono">{item.memoryStorage}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Atout Clé :</span>
                          <span className="text-emerald-300">{item.keyFeature}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: BILAN DES 27J RÉALISÉS */}
            {vfTab === 'rapport' && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-sky-400" />
                    Bilan du Rapport du 27 Octobre 2026 : 27 Jours Réalisés & Travaux Restants
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Relevé exact des temps consacrés depuis avril 2026, situation en production et distinction des périmètres.
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Déjà Réalisé (en prod)</span>
                    <span className="text-2xl font-bold font-mono text-emerald-400">27 jours</span>
                    <span className="text-[10px] text-slate-500 block mt-1">Depuis Avril 2026</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Socle PDP & Annuaire</span>
                    <span className="text-2xl font-bold font-mono text-white">9 jours</span>
                    <span className="text-[10px] text-slate-500 block mt-1">Cycle de vie & socle</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Routage & B2Brouter</span>
                    <span className="text-2xl font-bold font-mono text-sky-400">18 jours</span>
                    <span className="text-[10px] text-slate-500 block mt-1">8j routage + 10j B2Brouter</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Reste Peppol Natif</span>
                    <span className="text-2xl font-bold font-mono text-indigo-400">25 à 30 jours</span>
                    <span className="text-[10px] text-slate-500 block mt-1">phase4 / Oxalis</span>
                  </div>
                </div>

                {/* Table Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Relevé des Temps Consacrés depuis Avril 2026 (27 journées en production)
                  </h4>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                        <tr>
                          <th className="py-2.5 px-4 font-semibold">Poste Réalisé (en production)</th>
                          <th className="py-2.5 px-4 font-semibold text-right">Charge Consacrée</th>
                          <th className="py-2.5 px-4 font-semibold">Statut Opérationnel</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        <tr>
                          <td className="py-2.5 px-4 font-medium text-white">Cycle de vie des factures, intégration PDP, annuaire et socle</td>
                          <td className="py-2.5 px-4 text-right font-mono text-sky-400 font-bold">9 jours</td>
                          <td className="py-2.5 px-4"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20 font-medium">En production</span></td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-medium text-white">Routage PDP/inter-PDP et premiers travaux B2B</td>
                          <td className="py-2.5 px-4 text-right font-mono text-sky-400 font-bold">8 jours</td>
                          <td className="py-2.5 px-4"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20 font-medium">En production</span></td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-medium text-white">Couche Provider, intégration B2Brouter, webhooks et stabilisation</td>
                          <td className="py-2.5 px-4 text-right font-mono text-sky-400 font-bold">10 jours</td>
                          <td className="py-2.5 px-4"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20 font-medium">En production active</span></td>
                        </tr>
                        <tr className="bg-slate-900/60 font-bold text-white">
                          <td className="py-3 px-4">TOTAL DÉJÀ RÉALISÉ</td>
                          <td className="py-3 px-4 text-right font-mono text-emerald-400 text-sm">27 jours</td>
                          <td className="py-3 px-4 text-slate-400 font-normal">Socle stabilisé et fonctionnel</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Clarification on PPF / AIFE */}
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 space-y-1.5">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Précision sur le Raccordement au PPF (AIFE)
                  </div>
                  <p>
                    L'AIFE a formellement indiqué en avril 2026 que ses API ne sont ouvertes qu'aux plateformes dont le dossier a reçu une première validation du service d'immatriculation. Les développements utilisent actuellement un annuaire simulé prêt pour l'API réelle. Ce raccordement ne peut donc commencer et être chiffré qu'après le dépôt du dossier et cette première validation.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 6: EMAIL VISIOFACT */}
            {vfTab === 'email' && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Send className="w-5 h-5 text-emerald-400" />
                      Réponse pour M. Friderich — Ciblée sur le Reste à Préciser
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      CaptureMind étant validé sans réserve par M. Friderich, cette réponse évite les répétitions et clarifie les 3 points ouverts : Jalons, Licences Peppol et Maintien B2Brouter.
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(currentEmailText)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all cursor-pointer self-start sm:self-auto"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copié !' : "Copier le texte sélectionné"}</span>
                  </button>
                </div>

                {/* 4-Question Tracking Matrix */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Scale className="w-4 h-4 text-emerald-400" />
                      Tableau de Suivi : État des 4 Questions de M. Friderich
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">Stratégie : Répondre uniquement à ce qui reste ouvert</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">1. CaptureMind (25-30j)</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium text-[10px] border border-emerald-500/20">Couvert & Validé</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Accord formel de M. Friderich (4 briques, RAM volatile, zéro stockage). Prise de contact directe avec M. Flore pour l'existant. <strong className="text-emerald-300">Non répété dans l'email.</strong>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">2. Planning & Jalons (50-60j)</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium text-[10px] border border-emerald-500/20">Précisé dans l'email</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        4 jalons découpés (J1-J2 CaptureMind 25-30j, J3-J4 Peppol 25-30j). Démarches OpenPeppol et PPF distinguées du développement technique.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">3. Licences Peppol AS4</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium text-[10px] border border-emerald-500/20">Précisé dans l'email</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        phase4 / Oxalis sous <strong>Apache 2.0</strong>, phoss SMP sous <strong>MPL 2.0</strong>. Licences permissives commerciales, conteneur étanche sans contamination.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-sky-500/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">4. Maintien B2Brouter</span>
                        <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-medium text-[10px] border border-sky-500/20">Relayé à M. Iliev</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Sécurise le dépôt DGFiP début janvier 2027 sans pénaliser CaptureMind. Les précisions réglementaires et partenariales sont confiées à M. Iliev.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Version Switcher */}
                <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <button
                    onClick={() => setEmailVersion('agent-ia')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      emailVersion === 'agent-ia'
                        ? 'bg-emerald-600 text-white shadow-sm font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Réponse Agent IA (Phase 2 Alphonse — Recommandée)</span>
                  </button>
                  <button
                    onClick={() => setEmailVersion('targeted')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      emailVersion === 'targeted'
                        ? 'bg-emerald-600 text-white shadow-sm font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Réponse Synthétique 4 Points (Questions précédentes)</span>
                  </button>
                  <button
                    onClick={() => setEmailVersion('official')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      emailVersion === 'official'
                        ? 'bg-emerald-600 text-white shadow-sm font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-300" />
                    <span>Version Complète en 3 Sections (Rappel CaptureMind inclus)</span>
                  </button>
                  <button
                    onClick={() => setEmailVersion('short')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      emailVersion === 'short'
                        ? 'bg-emerald-600 text-white shadow-sm font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5 text-sky-300" />
                    <span>Version Synthétique (Court)</span>
                  </button>
                  <button
                    onClick={() => setEmailVersion('detailed')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      emailVersion === 'detailed'
                        ? 'bg-emerald-600 text-white shadow-sm font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-300" />
                    <span>Mémo Initial (Audit 4 Questions)</span>
                  </button>
                </div>

                {/* Contextual Notice */}
                {emailVersion === 'agent-ia' ? (
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>Réponse au Nouveau Message de M. Friderich (Agent IA) :</strong> Accueil très favorable de la phase 2 confiée à Alphonse. Confirmation que les 25 à 30 jours de CaptureMind restent la priorité absolue, avec anticipation d'interfaces API REST et schémas JSON modulaires dès la conception.
                    </span>
                  </div>
                ) : emailVersion === 'targeted' ? (
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>Version Synthétique 4 Points :</strong> Réponse directe et concise aux 4 questions de cadrage (CaptureMind, planning, licences et B2Brouter).
                    </span>
                  </div>
                ) : emailVersion === 'official' ? (
                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Version Complète en 3 Sections :</strong> Rappel complet de CaptureMind (4 briques, RAM volatile, benchmark 100 factures, coordination M. Flore et Alphonse), Peppol & planning (50 à 60j ouvrés au total), et maintien B2Brouter confié à M. Iliev.
                    </span>
                  </div>
                ) : emailVersion === 'short' ? (
                  <div className="p-3 rounded-lg bg-sky-950/30 border border-sky-500/30 text-xs text-sky-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>
                      <strong>Version Synthétique :</strong> Confirmation rapide des règles chez M. Flore et passage de relais immédiat à Georgi Iliev.
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      <strong>Mémo exhaustif initial :</strong> Analyse technique préliminaire détaillée répondant aux 4 questions (détails du benchmark, licences Apache/MPL, tableau comparatif).
                    </span>
                  </div>
                )}

                <div className="my-2 grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                  <div><span className="text-slate-500 font-medium">À :</span> Romain FRIDERICH &lt;rfriderich@digipepss.pro&gt;</div>
                  <div><span className="text-slate-500 font-medium">De :</span> Jean Elson</div>
                  <div>
                    <span className="text-slate-500 font-medium">Objet :</span> {currentEmailSubject}
                  </div>
                </div>

                <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-5 md:p-6 text-slate-200 font-mono text-xs md:text-sm leading-relaxed whitespace-pre-wrap selection:bg-emerald-600 shadow-inner">
                  {currentEmailText}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* ====== ESPACE 3 : BASE DE CONNAISSANCES & STRATÉGIE ===== */}
        {/* ======================================================== */}
        {currentProject === 'knowledge' && (
          <div className="space-y-6">
            
            {/* Knowledge Context Alert */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 text-xs">
              <BookOpen className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Base de Connaissances & Référentiel Stratégique DIGIpepss</span>
                  <span className="px-2 py-0.2 rounded bg-amber-500/20 text-amber-200 font-normal">Savoir Centralisé & Décisions</span>
                </div>
                <p className="text-slate-300">
                  Consolidation exhaustive de l’ensemble des échanges avec la direction technique (Romain Friderich), des responsabilités par acteur, des analyses de licences open source et du protocole de benchmark.
                </p>
              </div>
            </div>

            {/* TAB 1: FIL DES ÉCHANGES & DÉCISIONS CHRONOLOGIQUES */}
            {kbTab === 'chronologie' && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-400" />
                      Chronologie des 7 Échanges & Arbitrages Majeurs (Octobre - Novembre 2026)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Fil d’Ariane complet retraçant les orientations prises pas à pas entre Romain Friderich, Jean Elson et Georgi Iliev.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-2">
                        <span className="h-6 w-6 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center font-mono font-bold">1</span>
                        27 Octobre 2026 : Rapport Technique Initial (Jean Elson & Georgi Iliev)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Bilan d’Audit</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Bilan des <strong>27 jours déjà réalisés en production</strong> sur VISIOfact (9j socle, 8j routage, 10j B2Brouter), estimation de 30j pour le point d’accès natif, et notification que l’AIFE restreint l'accès aux API du PPF avant validation du dossier.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-2">
                        <span className="h-6 w-6 rounded-md bg-sky-900/40 text-sky-300 flex items-center justify-center font-mono font-bold">2</span>
                        30 Octobre 2026 (09h43) : Cadrage CaptureMind par Romain Friderich (7 Points)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 font-mono">Vision Cible</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Romain formalise les 3 schémas fonctionnels : CaptureMind doit être un HUB 100% en RAM, sans stockage documentaire permanent, FERnest restant le référentiel unique des documents et des écritures définitives.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-2">
                        <span className="h-6 w-6 rounded-md bg-indigo-900/40 text-indigo-300 flex items-center justify-center font-mono font-bold">3</span>
                        30 Octobre 2026 (14h25) : 4 Questions Peppol & DGFiP de Romain Friderich
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono">Clarifications</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Romain interroge l'équipe sur le périmètre des 25-30j de CaptureMind, le planning des jalons, les licences open source de phase4/Oxalis et le maintien éventuel de B2Brouter pour sécuriser janvier 2027.
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-300 flex items-center gap-2">
                        <span className="h-6 w-6 rounded-md bg-emerald-600/30 text-emerald-300 flex items-center justify-center font-mono font-bold">4</span>
                        30 Octobre 2026 (Après-midi) : Accord Formel de Romain Friderich sur CaptureMind
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">Feu Vert Opérationnel</span>
                    </div>
                    <p className="text-xs text-slate-200">
                      Romain donne son <strong>accord à 100% sur l’architecture CaptureMind HUB</strong> (4 briques, RAM volatile, zéro stockage). Il insiste sur la capitalisation des règles existantes chez FERnest avec M. Flore, valide le banc d'essai GPU avec Alphonse, fixe la recette à J+30 et attend la réponse sur la facturation électronique.
                    </p>
                  </div>

                  {/* Step 5 */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-300 flex items-center gap-2">
                        <span className="h-6 w-6 rounded-md bg-emerald-600/30 text-emerald-300 flex items-center justify-center font-mono font-bold">5</span>
                        30 Octobre 2026 : Réponse Officielle Validée de Jean Elson (3 Sections Cibles)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 font-bold uppercase">Texte Officiel Validé</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Réponse définitive en 3 volets structurés : <strong>1. CaptureMind (25-30j)</strong> avec 4 composants indépendants, transit 100% en RAM, benchmark 100 factures (Multimodale, OCR+LLM, Hybride), coordination avec M. Flore pour les modèles existants et Alphonse pour le GPU ; <strong>2. Peppol & planning (50-60j au total)</strong> avec CaptureMind en priorité 1 ; <strong>3. Maintien B2Brouter</strong> renvoyé formellement à M. Iliev.
                    </p>
                  </div>

                  {/* Step 6 */}
                  <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-purple-300 flex items-center gap-2">
                        <span className="h-6 w-6 rounded-md bg-purple-600/30 text-purple-300 flex items-center justify-center font-mono font-bold">6</span>
                        02 Novembre 2026 : Orientation Agent IA (Phase 2 confiée à Alphonse)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 font-bold uppercase">Vision Long Terme</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Romain Friderich annonce l'ajout ultérieur d'un <strong>Agent IA de raisonnement et d'assistance</strong>. La priorité immédiate de Jean Elson reste inchangée : <strong>25 à 30 jours ouvrés</strong> sur le moteur documentaire en mémoire vive. L'agent IA est confié à Alphonse en phase 2. Jean Elson anticipe simplement des contrats d'API REST modulaires.
                    </p>
                  </div>

                  {/* Step 7 */}
                  <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-500/40 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-sky-300 flex items-center gap-2">
                        <span className="h-6 w-6 rounded-md bg-sky-600/30 text-sky-300 flex items-center justify-center font-mono font-bold">7</span>
                        02 Novembre 2026 : Fiche Tâches & Activation VISIOfact (TECT OEC / ONLYCOMPTA)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-200 font-bold uppercase">Preuve Opérationnelle</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong>Notification d'activation client reçue :</strong> Confirmation de l'activation de « TECT OEC - Client ONLYCOMPTA » sur VISIOfact. Cela démontre concrètement la viabilité de la passerelle B2Brouter en production, sécurisant ainsi l'objectif de <strong>dépôt du dossier DGFiP début janvier 2027</strong> sans retarder CaptureMind. Fiche de mission du Lundi 02 : 1. Refonte design bulletins de paie, 2. CaptureMind (25-30j, Priorité 1), 3. VISIOfact natif (25-30j, échéance DGFiP début janvier 2027).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: RÔLES & LES 5 ACTEURS CLÉS */}
            {kbTab === 'intervenants' && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-sky-400" />
                    Cartographie des Rôles & 5 Acteurs Clés du Projet
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Répartition des responsabilités pour garantir l'exécution sans friction des deux chantiers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Romain */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 uppercase">Direction Générale</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Arbitrage</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Romain FRIDERICH</h4>
                    <p className="text-xs text-slate-400">
                      Validation stratégique de l'architecture, arbitrage des priorités, validation des budgets GPU et recette fonctionnelle conjointe à J+30.
                    </p>
                  </div>

                  {/* Jean Elson */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400 uppercase">Lead Développement</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">Priorité 1</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Jean Elson</h4>
                    <p className="text-xs text-slate-300">
                      Responsable de la refonte CaptureMind HUB (pipeline RAM volatile, moteur IA, contrôles arithmétiques, proposition d'écritures) et banc d’essai sur 100 factures.
                    </p>
                  </div>

                  {/* Georgi Iliev */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase">Expert Réseau & DGFiP</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">VISIOfact</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Georgi Iliev</h4>
                    <p className="text-xs text-slate-300">
                      Pilotage du dossier de candidature DGFiP début janvier 2027, maintien temporaire de B2Brouter, et arbitrage final du composant AS4 natif (phase4 / Oxalis).
                    </p>
                  </div>

                  {/* Monsieur Flore */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-400 uppercase">Expert Métier FERnest</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">Détenteur des 4 Livrables</span>
                    </div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>Monsieur Flore</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-normal">Existant Validé</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong>Point 1 résolu :</strong> M. Flore détient déjà le Plan Comptable Général, les plans spécifiques par dossier, les règles d'imputation et les bibliothèques de tiers. R. Friderich a confirmé : <em>« déjà existant, veuillez vous rapprocher de Mr Flore »</em>. Jean Elson n'a plus qu'à récupérer ces règles pour alimenter le banc d'essai sans redondance.
                    </p>
                  </div>

                  {/* Alphonse */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-400 uppercase">Infrastructure & GPU</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Serveur LexIA</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Alphonse</h4>
                    <p className="text-xs text-slate-300">
                      Allocation des créneaux GPU sur le serveur partagé LexIA (NVIDIA RTX 4000 Ada - 20 Go VRAM) et monitoring de la consommation mémoire.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ENCYCLOPÉDIE LICENCES & DROITS */}
            {kbTab === 'licences' && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Scale className="w-5 h-5 text-emerald-400" />
                    Encyclopédie Juridique des Licences & Conformité Commerciale
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Analyse des risques de contamination et garanties d'exploitation commerciale sans obligation d'ouvrir notre code source.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* AGPL Disqualification */}
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-400 uppercase">Licence Écartée</span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">GNU AGPL</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Pourquoi PyMuPDF a été définitivement écarté ?</h4>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      La licence GNU AGPL (Affero General Public License) impose la clause virale réseau (Copyleft fort). L'utilisation de PyMuPDF dans un service SaaS ou une API comme CaptureMind contraindrait l'entreprise à divulguer l'intégralité de son code propriétaire ou à payer une licence commerciale coûteuse.
                    </p>
                  </div>

                  {/* Apache 2.0 / BSD Approval */}
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 uppercase">Licences Permissives Validées</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">Apache 2.0 / BSD / MIT</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Pourquoi pypdfium2, phase4 et Oxalis sont parfaits ?</h4>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Ces licences n'ont aucun effet viral. Elles autorisent formellement l'intégration, la modification et l'exploitation commerciale fermée au sein de CaptureMind et VISIOfact, sous la seule condition de conserver la mention de copyright d'origine dans la documentation.
                    </p>
                  </div>

                  {/* MPL 2.0 Details */}
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 uppercase">Licence Modulaire</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">Mozilla MPL 2.0</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Comportement juridique de phoss SMP & OpenBao</h4>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      La licence MPL 2.0 est un copyleft limité au fichier : si nous modifions directement un fichier source de phoss SMP, ce fichier seul doit être redistribué si demandé. En revanche, le code appelant (nos microservices FastAPI et VISIOfact) reste 100% propriétaire et fermé.
                    </p>
                  </div>

                  {/* 0 Persistance Guarantee */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-400 uppercase">Sécurité & RGPD</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">Zéro Persistance</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Exigence stricte de non-stockage sur CaptureMind</h4>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      FERnest détient l'exclusivité du stockage légal et fiscal des pièces. CaptureMind n'est qu'un calculateur en mémoire vive : les flux documentaires sont libérés dès renvoi du JSON et les journaux de logs sont expurgés de toute donnée confidentielle de facturation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: BANC D'ESSAI DES 100 FACTURES & 3 APPROCHES IA */}
            {kbTab === 'benchmark' && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-400" />
                      Protocole du Banc d'Essai des 100 Factures Réelles
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Méthodologie objective pour comparer les 3 approches d'extraction documentaire sur serveur LexIA.
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                    Phase 1 : 10 à 15 j.o.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-sky-400 uppercase block">Approche 1</span>
                    <h4 className="text-sm font-bold text-white">Multimodal Direct</h4>
                    <p className="text-xs text-slate-400">
                      Modèle de Vision-Language de bout en bout (Qwen3-VL 4B/8B). Traitement direct de l’image pour générer le JSON structuré sans étape OCR intermédiaire.
                    </p>
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                      Avantage : Compréhension spatiale native. Point d'attention : Consommation VRAM GPU.
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase block">Approche 2</span>
                    <h4 className="text-sm font-bold text-white">OCR Traditionnel + LLM</h4>
                    <p className="text-xs text-slate-400">
                      Extraction textuelle brute via PaddleOCR puis restructuration comptable via un modèle de langage léger.
                    </p>
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                      Avantage : Vitesse d'exécution rapide. Point d'attention : Risque de perte de contexte tabulaire.
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase block">Approche 3 (Hypothèse Forte)</span>
                    <h4 className="text-sm font-bold text-white">Approche Hybride Optimisée</h4>
                    <p className="text-xs text-slate-300">
                      Aiguillage intelligent : extraction directe 100% CPU pour les factures Factur-X / PDF vectoriels, et recours ciblé au GPU Vision uniquement pour les scans complexes.
                    </p>
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-300">
                      Avantage : Coût serveur minimal, débit maximal et résilience totale.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 px-6 py-4 text-center text-xs text-slate-500">
        Digipepss Tech Studio — Gestion de Projets CaptureMind HUB & VISIOfact PDP • Digilium / Digipepss (Octobre 2026)
      </footer>
    </div>
  );
}
