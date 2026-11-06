import {
  AuditQuestion,
  DayPlanItem,
  InvoicePreset,
  MilestoneItem,
  TechToolItem,
  DecisionItem,
  PeppolFeature,
  RecetteItem
} from '../types/hub';

export const auditQuestionsList: AuditQuestion[] = [
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

export const full30DaysPlan: DayPlanItem[] = [
  // SEMAINE 1 : PHASE 0 — AUDIT & PRÉPARATION (Du Lundi 02/11 au Vendredi 06/11/2026)
  {
    day: 1,
    date: 'Lundi 02/11/2026',
    week: 1,
    phase: 'Phase 0 : Audit & Cadrage',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Audit approfondi de la codebase existante',
    description: 'Analyse de Database.py, VisioCompte.py, verifier_exports.py. Découverte de VUL-001 (saturation disque 97% sur Hetzner /var/docservers).',
    deliverable: 'Rapport d’audit des 15 questions techniques sur les 5 axes.',
    owner: 'Jean Elson',
    status: 'Terminé'
  },
  {
    day: 2,
    date: 'Mardi 03/11/2026',
    week: 1,
    phase: 'Phase 0 : Audit & Cadrage',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Arbitrage des 4 orientations majeures',
    description: 'Validation de l’ingestion POST multipart en RAM, conservation de PostgreSQL pour référentiels légers, XML historique pour FERnest.',
    deliverable: 'Validation d’architecture actée par R. Friderich et l’équipe.',
    owner: 'Jean Elson & R. Friderich',
    status: 'Terminé'
  },
  {
    day: 3,
    date: 'Mercredi 04/11/2026',
    week: 1,
    phase: 'Phase 0 : Audit & Cadrage',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Extraction du corpus des 100 factures réelles',
    description: 'Extraction depuis /var/docservers/verifier/original_doc/ sur Hetzner (30 Factur-X/PDF natifs, 40 scans, 30 cas complexes). Corpus validé et prêt.',
    deliverable: 'Archive corpus_test_100/ disponible pour le banc d’essai.',
    owner: 'Équipe Infra',
    status: 'Terminé'
  },
  {
    day: 4,
    date: 'Jeudi 05/11/2026',
    week: 1,
    phase: 'Phase 0 : Audit & Cadrage',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Récupération des référentiels comptables chez M. Flore',
    description: 'Message envoyé à M. Flore. Extraction des tables PostgreSQL (accounting_plan, accounts_supplier, accounts_customer) et règles TVA confirmées.',
    deliverable: 'Dump SQL / JSON des plans de comptes et tiers qualifiés transmis.',
    owner: 'M. Flore & Jean Elson',
    status: 'Terminé'
  },
  {
    day: 5,
    date: 'Vendredi 06/11/2026',
    week: 1,
    phase: 'Phase 0 : Audit & Cadrage',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Préparation du serveur GPU LexIA & Micro-service FastAPI',
    description: 'Serveur LexIA (NVIDIA RTX 4000 Ada - 20 Go VRAM) configuré. Intégration de PaddleOCR et Qwen pour le déploiement du micro-service d’inférence et lancement du test du banc d’essai.',
    deliverable: 'Micro-service d’inférence prêt pour le banc d’essai 100 factures.',
    owner: 'Alphonse & Jean Elson',
    status: 'En cours'
  },

  // SEMAINE 2 : PHASE 1 — BANC D'ESSAI COMPARATIF GPU (Du Lundi 09/11 au Vendredi 13/11/2026)
  {
    day: 6,
    date: 'Lundi 09/11/2026',
    week: 2,
    phase: 'Phase 1 : Benchmark GPU',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Qualification et annotation du corpus témoin',
    description: 'Indexation des 100 factures avec vérité terrain (SIREN attendu, montants HT/TVA/TTC réels, comptes comptables cibles).',
    deliverable: 'Fichier ground_truth.json pour calculer le taux d’exactitude.',
    owner: 'Jean Elson & M. Flore',
    status: 'À venir'
  },
  {
    day: 7,
    date: 'Mardi 10/11/2026',
    week: 2,
    phase: 'Phase 1 : Benchmark GPU',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Banc d’essai Approche 1 : Multimodale Directe',
    description: 'Inférence vision-language directe sur images entières de factures. Mesure du taux d’extraction, temps par page et conso VRAM.',
    deliverable: 'Rapport de mesure métrique Approche 1.',
    owner: 'Jean Elson & Alphonse',
    status: 'À venir'
  },
  {
    day: 8,
    date: 'Mercredi 11/11/2026',
    week: 2,
    phase: 'Phase 1 : Benchmark GPU',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Banc d’essai Approche 2 : OCR + LLM (PaddleOCR-VL / Qwen)',
    description: 'Extraction spatialisée du texte par OCR puis structuration comptable par modèle de langage compact. Évaluation de la latence.',
    deliverable: 'Rapport de mesure métrique Approche 2.',
    owner: 'Jean Elson & Alphonse',
    status: 'À venir'
  },
  {
    day: 9,
    date: 'Jeudi 12/11/2026',
    week: 2,
    phase: 'Phase 1 : Benchmark GPU',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Banc d’essai Approche 3 : Aiguillage Hybride',
    description: 'Bypass immédiat via pypdfium2 pour Factur-X/PDF texte natif (0 GPU), et routage GPU uniquement sur les scans dégradés.',
    deliverable: 'Rapport de mesure métrique Approche 3 (Comparatif croisé).',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 10,
    date: 'Vendredi 13/11/2026',
    week: 2,
    phase: 'Phase 1 : Benchmark GPU',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Restitution du Benchmark & Choix Définitif',
    description: 'Synthèse objective des résultats (taux de réussite >95%, latence <2s, empreinte GPU). Revue conjointe avec Romain Friderich.',
    deliverable: 'Décision formelle actée du moteur retenu pour le HUB.',
    owner: 'Jean Elson & R. Friderich',
    status: 'À venir'
  },

  // SEMAINE 3 : PHASE 2 — SERVICE IA DOCUMENTAIRE FASTAPI (Du Lundi 16/11 au Vendredi 20/11/2026)
  {
    day: 11,
    date: 'Lundi 16/11/2026',
    week: 3,
    phase: 'Phase 2 : Service IA FastAPI',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Initialisation du micro-service FastAPI indépendant',
    description: 'Création du projet autonome Python 3.11, Uvicorn, Pydantic v2. Configuration CORS, mTLS et gestionnaire d’exceptions.',
    deliverable: 'Dépôt et squelette de service opérationnel indépendant d’OpenCapture.',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 12,
    date: 'Mardi 17/11/2026',
    week: 3,
    phase: 'Phase 2 : Service IA FastAPI',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Endpoint d’ingestion streaming POST /api/v1/extract',
    description: 'Réception du flux multipart en mémoire vive via io.BytesIO. Aucune écriture sur le système de fichiers hôte.',
    deliverable: 'Endpoint fonctionnel validé par tests unitaires en RAM.',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 13,
    date: 'Mercredi 18/11/2026',
    week: 3,
    phase: 'Phase 2 : Service IA FastAPI',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Intégration du moteur pypdfium2 (Factur-X & PDF natif)',
    description: 'Détection et parsing XML Factur-X en mémoire, ou extraction de texte natif avec boîtes englobantes sans GPU.',
    deliverable: 'Pipeline PDF natif ultra-rapide (<100ms par document).',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 14,
    date: 'Jeudi 19/11/2026',
    week: 3,
    phase: 'Phase 2 : Service IA FastAPI',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Intégration du moteur IA retenu pour les scans sur LexIA',
    description: 'Connexion au runtime GPU pour les images scannées. Production du contrat JSON : datas = { datas, positions, pages }.',
    deliverable: 'Contrat spatial respecté à 100% pour la future Phase 2 Alphonse.',
    owner: 'Jean Elson & Alphonse',
    status: 'À venir'
  },
  {
    day: 15,
    date: 'Vendredi 20/11/2026',
    week: 3,
    phase: 'Phase 2 : Service IA FastAPI',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Conteneurisation read-only & Purge déterministe RAM',
    description: 'Dockerfile multi-stage, montage en read-only-fs sans volume disque. Implémentation de del buffer et gc.collect().',
    deliverable: 'Conteneur Docker stateless certifié 0 octet résiduel.',
    owner: 'Jean Elson & DevOps',
    status: 'À venir'
  },

  // SEMAINE 4 : PHASE 3 — HUB ORCHESTRATEUR CAPTUREMIND (Du Lundi 23/11 au Vendredi 27/11/2026)
  {
    day: 16,
    date: 'Lundi 23/11/2026',
    week: 4,
    phase: 'Phase 3 : HUB Orchestrateur',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Refonte du point d’entrée /ws/ingest dans CaptureMind',
    description: 'Suppression des appels à files.move_to_docservers(). Ingestion directe en RAM et transmission au Service IA FastAPI.',
    deliverable: 'CaptureMind libéré de toute écriture sur Hetzner /var/docservers.',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 17,
    date: 'Mardi 24/11/2026',
    week: 4,
    phase: 'Phase 3 : HUB Orchestrateur',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Client d’orchestration asynchrone HTTP interne',
    description: 'Appel du Service IA FastAPI avec gestion des timeouts, retries et circuit-breaker sur erreur.',
    deliverable: 'Communication robuste inter-services avec trace unique Job-ID.',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 18,
    date: 'Mercredi 25/11/2026',
    week: 4,
    phase: 'Phase 3 : HUB Orchestrateur',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Moteur de Matching Tiers (SIREN + Levenshtein)',
    description: 'Rapprochement des tiers dans PostgreSQL (accounts_supplier) par SIREN strict puis recherche floue sur raison sociale (remplace le simple LIKE).',
    deliverable: 'Taux de reconnaissance des tiers >95% sur factures réelles.',
    owner: 'Jean Elson & M. Flore',
    status: 'À venir'
  },
  {
    day: 19,
    date: 'Jeudi 26/11/2026',
    week: 4,
    phase: 'Phase 3 : HUB Orchestrateur',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Application des modèles comptables et règles dossiers',
    description: 'Imputation automatique des comptes de charge (60x/70x) selon l’historique du dossier validé par M. Flore.',
    deliverable: 'Moteur d’imputation intelligent par dossier.',
    owner: 'Jean Elson & M. Flore',
    status: 'À venir'
  },
  {
    day: 20,
    date: 'Vendredi 27/11/2026',
    week: 4,
    phase: 'Phase 3 : HUB Orchestrateur',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Contrôles arithmétiques & Écritures équilibrées (FEC)',
    description: 'Vérification arithmétique rigoureuse (HT + TVA = TTC à 0,01€ près) et génération des lignes Débit / Crédit équilibrées.',
    deliverable: 'Générateur d’écritures comptables conforme FEC.',
    owner: 'Jean Elson',
    status: 'À venir'
  },

  // SEMAINE 5 : PHASE 4 — ADAPTATEUR FERNEST (Du Lundi 30/11 au Vendredi 04/12/2026)
  {
    day: 21,
    date: 'Lundi 30/11/2026',
    week: 5,
    phase: 'Phase 4 : Adaptateur FERnest',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Développement de l’Adaptateur XML historique',
    description: 'Conversion du JSON enrichi vers le format XML verifier_exports.py (<ROOT><TECHNICAL>...<DATAS>...) attendu par FERnest.',
    deliverable: 'Adaptateur XML certifié conforme au schéma FERnest.',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 22,
    date: 'Mardi 01/12/2026',
    week: 5,
    phase: 'Phase 4 : Adaptateur FERnest',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Raccordement HTTP avec VisioCompte (https://visiocompte.pro)',
    description: 'Modernisation du connecteur VisioCompte.py (FastAPI HTTP Client mTLS, pool de connexions, gestion des jetons).',
    deliverable: 'Flux montant vers FERnest opérationnel de bout en bout.',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 23,
    date: 'Mercredi 02/12/2026',
    week: 5,
    phase: 'Phase 4 : Adaptateur FERnest',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Boucle de rétroaction comptable (Feedback Webhook)',
    description: 'Création du endpoint POST /api/v1/feedback permettant à FERnest de notifier à CaptureMind les corrections validées par le comptable.',
    deliverable: 'Enrichissement progressif des bibliothèques human-in-the-loop.',
    owner: 'Jean Elson & M. Flore',
    status: 'À venir'
  },
  {
    day: 24,
    date: 'Jeudi 03/12/2026',
    week: 5,
    phase: 'Phase 4 : Adaptateur FERnest',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Tests de non-régression avec FERnest en recette',
    description: 'Injection de factures témoins depuis FERnest et vérification de la réception immédiate des écritures prêtes pour le comptable.',
    deliverable: 'Zéro régression constatée côté FERnest.',
    owner: 'Jean Elson & Équipe FERnest',
    status: 'À venir'
  },
  {
    day: 25,
    date: 'Vendredi 04/12/2026',
    week: 5,
    phase: 'Phase 4 : Adaptateur FERnest',
    phaseColor: 'bg-slate-800/50 text-slate-400 border-slate-700',
    title: 'Cadrage des contrats pour l’Agent IA (Phase 2 Alphonse)',
    description: 'Formalisation des interfaces OpenAPI pour l’agent IA d’assistance : endpoints de consultation des règles et proposition de corrections.',
    deliverable: 'Spécification Swagger/OpenAPI prête pour Alphonse.',
    owner: 'Jean Elson & Alphonse',
    status: 'À venir'
  },

  // SEMAINE 6 : PHASE 5 — RECETTE J+30 (Du Lundi 07/12 au Vendredi 11/12/2026)
  {
    day: 26,
    date: 'Lundi 07/12/2026',
    week: 6,
    phase: 'Phase 5 : Recette & Livraison',
    phaseColor: 'bg-slate-800/50 text-emerald-400 border-emerald-500/30',
    title: 'Tests de charge et montée en cadence',
    description: 'Simulation de traitement de 50 factures en continu. Vérification de la stabilité de la VRAM GPU et de l’absence de fuite mémoire RAM.',
    deliverable: 'Rapport de test de charge (temps moyen <1.8s par facture).',
    owner: 'Jean Elson & DevOps',
    status: 'À venir'
  },
  {
    day: 27,
    date: 'Mardi 08/12/2026',
    week: 6,
    phase: 'Phase 5 : Recette & Livraison',
    phaseColor: 'bg-slate-800/50 text-emerald-400 border-emerald-500/30',
    title: 'Audit de sécurité & Garantie du Zéro Stockage Disque',
    description: 'Vérification forensique sur le serveur de production : vérification que /tmp, /var/tmp et les disques contiennent 0 octet résiduel (VUL-001 résolu à 100%).',
    deliverable: 'Attestation technique de conformité Stateless RAM.',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 28,
    date: 'Mercredi 09/12/2026',
    week: 6,
    phase: 'Phase 5 : Recette & Livraison',
    phaseColor: 'bg-slate-800/50 text-emerald-400 border-emerald-500/30',
    title: 'Expurgation des journaux techniques & Confidentialité',
    description: 'Vérification qu’aucune information nominative, RIB ou texte intégral de facture ne fuite dans les logs OpenSearch/Docker.',
    deliverable: 'Configuration des logs expurgés conforme RGPD & secret d’affaires.',
    owner: 'Jean Elson',
    status: 'À venir'
  },
  {
    day: 29,
    date: 'Jeudi 10/12/2026',
    week: 6,
    phase: 'Phase 5 : Recette & Livraison',
    phaseColor: 'bg-slate-800/50 text-emerald-400 border-emerald-500/30',
    title: 'Démonstration de validation sur les 100 factures',
    description: 'Traitement de bout en bout du corpus réel témoin avec affichage des propositions d’écritures et comparaison avec la vérité terrain.',
    deliverable: 'Démonstrateur fonctionnel complet prêt pour la direction.',
    owner: 'Jean Elson, M. Flore & Alphonse',
    status: 'À venir'
  },
  {
    day: 30,
    date: 'Vendredi 11/12/2026',
    week: 6,
    phase: 'Phase 5 : Recette & Livraison',
    phaseColor: 'bg-slate-800/50 text-emerald-400 border-emerald-500/40 font-bold',
    title: 'Recette Officielle J+30 avec Romain Friderich',
    description: 'Présentation de la solution livrée, validation conjointe de la conformité au CDC, et bascule officielle en production sur FERnest.',
    deliverable: 'Procès-verbal de recette signé et mise en service de CaptureMind HUB.',
    owner: 'Jean Elson & Romain Friderich',
    status: 'À venir'
  }
];

export const invoicePresets: InvoicePreset[] = [
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

export const planningMilestones: MilestoneItem[] = [
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

export const captureMindStack: TechToolItem[] = [
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

export const visiofactStack: TechToolItem[] = [
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

export const captureMindDecisions: DecisionItem[] = [
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

export const peppolFeatures: PeppolFeature[] = [
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

export const initialRecetteChecklist: RecetteItem[] = [
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
    responsible: 'Jean Elson & Équipe Infra (Hetzner)',
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
    responsible: 'Romain Friderich',
    dateTarget: '11/12/2026 (J30)',
    description: 'Maintien de l’ancien port OpenCapture en lecture seule pour consultation des archives historiques sans interruption de service pour les collaborateurs du cabinet.',
    technicalValidation: 'Side-by-side validé : port 8080 (legacy) accessible en lecture sans écriture disque, port 443 (nouveau HUB RAM) recevant tous les nouveaux flux.',
    checked: true,
    priority: 'Majeur'
  }
];

export const messageToInfra = `Bonjour l'équipe Infra,

Pour préparer le banc d'essai CaptureMind avec Alphonse, j'ai besoin d'une extraction d'archive de 100 factures PDF depuis /var/docservers/verifier/original_doc/ (Hetzner).

En même temps, merci de lancer la purge des vieilles miniatures pour libérer l'espace disque (VUL-001).

Commandes suggérées :
cd /var/docservers/verifier/original_doc/
find . -type f -name "*.pdf" | head -n 100 | tar -czvf /tmp/corpus_test_100.tar.gz -T -
find /var/docservers/ -type f -name "*_thumb.png" -mtime +30 -delete

Merci pour votre aide,

Jean Elson`;

export const messageToMFlore = `Bonjour Monsieur Flore,

Dans le cadre de la préparation de CaptureMind pour FERnest, et suite à l'accord de Romain, j'ai besoin de vos référentiels existants pour caler les écritures automatiques :

1. Le plan de comptes (PCG) et les sous-comptes dossiers habituels.
2. Les règles d'imputation types (comptes 6xx et taux TVA par fournisseur).
3. 3 à 5 exemples de fichiers XML d'écritures déjà validées dans FERnest.

Pouvez-vous me transmettre cela dès que possible ?

Merci d'avance pour votre aide,

Jean Elson`;

export const emailAgentIaToFriderich = `Bonjour M. Friderich,

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

export const targetedEmailToFriderich = `Bonjour M. Friderich,

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

export const officialValidatedEmailToFriderich = `Bonjour M. Friderich,

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

export const shortEmailToFriderich = `Bonjour M. Friderich,

Je vous remercie pour votre confirmation et votre accord sur l'architecture de CaptureMind.

1. CaptureMind & Coordination Métier
C'est bien noté pour les bibliothèques et règles comptables existantes : je prends directement contact avec M. Flore afin de réutiliser l'existant sans redondance. Dès réception des éléments comptables (PCG, plans dossiers, règles d'imputation et écritures types), je lance la Phase 1 du banc d'essai sur l'échantillon des 100 factures témoins.

2. Facturation Électronique, Peppol & DGFiP (Relais M. Iliev)
Concernant le volet facturation électronique et le calendrier prévisionnel associé, je laisse la main à M. Iliev qui vous transmettra directement les éléments techniques et réglementaires relatifs au maintien temporaire de B2Brouter et au point d'accès Peppol.

Bien cordialement,

Jean Elson
Lead Développeur – Digilium / Digipepss`;

export const officialEmailToFriderich = `Bonjour M. Friderich,

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
