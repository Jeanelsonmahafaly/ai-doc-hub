import { ProjectConfig } from '../types/hub';

export const PROJECTS: ProjectConfig[] = [
  {
    id: 'capturemind',
    name: 'CaptureMind HUB',
    shortName: 'CaptureMind',
    subtitle: 'Moteur IA sans persistance disque (100% RAM volatile)',
    version: 'v3.0',
    lead: 'Jean Elson',
    direction: 'Romain FRIDERICH',
    status: 'Priorité #1 · En développement',
    statusVariant: 'indigo',
    targetDeadline: '11/12/2026 (Recette J+30)',
    totalDays: '25 à 30 j.o.',
    riskLevel: 'Faible',
    accentColor: {
      primary: 'indigo',
      light: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      dark: 'bg-indigo-950/60 text-indigo-300 border-indigo-800',
      border: 'border-indigo-500',
      ring: 'focus-visible:ring-indigo-500',
      badgeBg: 'bg-indigo-100 dark:bg-indigo-950/70',
      badgeText: 'text-indigo-800 dark:text-indigo-200'
    },
    defaultViewId: 'conception',
    views: [
      {
        id: 'conception',
        label: 'Plan 30j & Conception',
        shortLabel: 'Plan 30j',
        icon: 'Layers',
        description: 'Feuille de route 30 jours, architecture technique stateless, contrats API et recette finale',
        badge: 'J1-J30',
        subTabs: [
          { id: 'objectifs-contexte', label: 'Objectifs & VUL-001', icon: 'Target' },
          { id: 'planning-30j', label: 'Planning 30j', icon: 'Calendar' },
          { id: 'archi-microservices', label: 'Architecture', icon: 'Cpu' },
          { id: 'contrats-api', label: 'Contrats API', icon: 'Code2' },
          { id: 'matrice-flux', label: 'Matrice Rôles', icon: 'Workflow' },
          { id: 'recette-j30', label: 'Recette J+30', icon: 'CheckSquare' }
        ]
      },
      {
        id: 'decisions',
        label: 'Cadrage & Audit Existant',
        shortLabel: 'Cadrage',
        icon: 'CheckCircle2',
        description: '9 décisions fondamentales et 15 questions d’audit sur 5 axes',
        badge: '9 Décisions'
      },
      {
        id: 'flux',
        label: 'Simulateur RAM Volatile',
        shortLabel: 'Simulateur RAM',
        icon: 'Activity',
        description: 'Banc d’essai interactif de transit mémoire et libération déterministe (0 octet disque)',
        badge: 'Live RAM'
      },
      {
        id: 'outils',
        label: 'Outils & 4 Briques',
        shortLabel: 'Outils',
        icon: 'Boxes',
        description: 'Cartographie des dépendances et bibliothèques permissives (Apache 2.0 / MIT)',
        badge: 'Apache 2.0'
      },
      {
        id: 'email',
        label: 'Réponses & Correspondance',
        shortLabel: 'Réponse M. Friderich',
        icon: 'Mail',
        description: 'Courriers et mémos officiels validés à l’attention de la direction',
        badge: 'Validé'
      }
    ],
    primaryAction: {
      label: 'Réponse M. Friderich',
      actionKey: 'copy-email'
    }
  },
  {
    id: 'visiofact',
    name: 'VISIOfact Peppol',
    shortName: 'VISIOfact',
    subtitle: 'Point d’accès Peppol AS4 & Candidature PDP DGFiP',
    version: 'v2.4',
    lead: 'Georgi Iliev & Jean Elson',
    direction: 'Romain FRIDERICH',
    status: 'Opérationnel · En production B2Brouter',
    statusVariant: 'success',
    targetDeadline: 'Début Janvier 2027 (DGFiP)',
    totalDays: '50 à 60 j.o.',
    riskLevel: 'Modéré',
    accentColor: {
      primary: 'emerald',
      light: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dark: 'bg-emerald-950/60 text-emerald-300 border-emerald-800',
      border: 'border-emerald-500',
      ring: 'focus-visible:ring-emerald-500',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/70',
      badgeText: 'text-emerald-800 dark:text-emerald-200'
    },
    defaultViewId: 'decisions',
    views: [
      {
        id: 'decisions',
        label: 'Architecture & Licences Peppol',
        shortLabel: 'Architecture Peppol',
        icon: 'Scale',
        description: 'Arbitrage B2Brouter vs Natif phase4/Oxalis, compatibilité DGFiP Janvier 2027',
        badge: 'DGFiP 2027'
      },
      {
        id: 'peppol-flux',
        label: 'Simulateur 4-Corner Peppol AS4',
        shortLabel: 'Simulateur Peppol',
        icon: 'Activity',
        description: 'Simulation interactive de bout en bout de l’acheminement ebMS3 et statuts CDV',
        badge: 'AS4 Live'
      },
      {
        id: 'planning',
        label: 'Jalons Clés & Dépendances',
        shortLabel: 'Jalons (50-60j)',
        icon: 'Calendar',
        description: 'Planning global 50 à 60 jours ouvrés découpé par grand jalon',
        badge: '50-60 j.o.'
      },
      {
        id: 'outils',
        label: 'Composants & Bibliothèques',
        shortLabel: 'Bibliothèques',
        icon: 'Boxes',
        description: 'phase4, phoss SMP, OpenBao, lxml Schematron et observabilité OpenSearch',
        badge: '9 Briques'
      },
      {
        id: 'rapport',
        label: 'Bilan 27j & Matrice 13 Briques',
        shortLabel: 'Bilan 27j & Matrice',
        icon: 'Clock',
        description: 'Relevé exact des 27 jours déjà réalisés en production et audit des 13 briques AS4',
        badge: '27j Faits'
      },
      {
        id: 'email',
        label: 'Lettre Officielle Direction',
        shortLabel: 'Lettre Arbitrage',
        icon: 'Mail',
        description: 'Synthèse intégrale d’arbitrage B2Brouter et point d’accès natif',
        badge: 'Texte Direction'
      }
    ],
    primaryAction: {
      label: 'Copier Lettre Arbitrage',
      actionKey: 'copy-visiofact-email'
    }
  },
  {
    id: 'knowledge',
    name: 'Stratégie & Référentiel',
    shortName: 'Stratégie',
    subtitle: 'Base de connaissances, chronologie des décisions et acteurs clés',
    version: 'v1.0',
    lead: 'Jean Elson',
    direction: 'Romain FRIDERICH',
    status: 'Gouvernance Validée',
    statusVariant: 'warning',
    targetDeadline: 'En continu 2026',
    totalDays: 'Référentiel',
    riskLevel: 'Faible',
    accentColor: {
      primary: 'amber',
      light: 'bg-amber-50 text-amber-700 border-amber-200',
      dark: 'bg-amber-950/60 text-amber-300 border-amber-800',
      border: 'border-amber-500',
      ring: 'focus-visible:ring-amber-500',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/70',
      badgeText: 'text-amber-800 dark:text-amber-200'
    },
    defaultViewId: 'chronologie',
    views: [
      {
        id: 'chronologie',
        label: 'Fil des Échanges & Décisions',
        shortLabel: 'Chronologie',
        icon: 'Clock',
        description: 'Historique chronologique des arbitrages du 27 octobre au 02 novembre 2026',
        badge: '7 Étapes'
      },
      {
        id: 'intervenants',
        label: 'Rôles & 5 Acteurs Clés',
        shortLabel: '5 Acteurs Clés',
        icon: 'Briefcase',
        description: 'Responsabilités et interfaces : R. Friderich, Jean Elson, G. Iliev, M. Flore, Alphonse',
        badge: '5 Rôles'
      },
      {
        id: 'licences',
        label: 'Encyclopédie Juridique Licences',
        shortLabel: 'Licences & Droits',
        icon: 'Scale',
        description: 'Disqualification AGPL (PyMuPDF) vs validation Apache 2.0 / BSD / MPL 2.0',
        badge: 'Conformité'
      },
      {
        id: 'benchmark',
        label: 'Banc d’Essai 100 Factures',
        shortLabel: 'Banc d’Essai 100',
        icon: 'Activity',
        description: 'Protocole de test comparatif : Multimodale Directe, OCR+LLM et Aiguillage Hybride',
        badge: '3 Approches'
      }
    ],
    primaryAction: {
      label: 'Exporter Synthèse',
      actionKey: 'export-knowledge'
    }
  },
  {
    id: 'agent-ia',
    name: 'Agent IA & Raisonnement',
    shortName: 'Agent IA',
    subtitle: 'Phase 2 confiée à Alphonse · Assistance documentaire et orchestration intelligente',
    version: 'v0.5-spec',
    lead: 'Alphonse & Jean Elson',
    direction: 'Romain FRIDERICH',
    status: 'Phase 2 · Cadrage Préparatoire',
    statusVariant: 'purple',
    targetDeadline: 'T1 2027 (Post CaptureMind)',
    totalDays: '15 à 20 j.o.',
    riskLevel: 'Modéré',
    accentColor: {
      primary: 'purple',
      light: 'bg-purple-50 text-purple-700 border-purple-200',
      dark: 'bg-purple-950/60 text-purple-300 border-purple-800',
      border: 'border-purple-500',
      ring: 'focus-visible:ring-purple-500',
      badgeBg: 'bg-purple-100 dark:bg-purple-950/70',
      badgeText: 'text-purple-800 dark:text-purple-200'
    },
    defaultViewId: 'cadrage',
    views: [
      {
        id: 'cadrage',
        label: 'Cadrage & Décisions IA',
        shortLabel: 'Cadrage IA',
        icon: 'Sparkles',
        description: 'Principes de découplage API REST et orchestration avec le serveur LexIA GPU',
        badge: 'Phase 2'
      },
      {
        id: 'planning',
        label: 'Planning Prévisionnel',
        shortLabel: 'Planning',
        icon: 'Calendar',
        description: 'Jalons de développement après la recette finale de CaptureMind (11/12/2026)',
        badge: '15 j.o.'
      },
      {
        id: 'jalons',
        label: 'Jalons & Livrables Clés',
        shortLabel: 'Jalons Clés',
        icon: 'CheckSquare',
        description: 'Objectifs de performance, VRAM GPU et intégration FastAPI',
        badge: '4 Jalons'
      },
      {
        id: 'kpis',
        label: 'Indicateurs & Matrice Risques',
        shortLabel: 'Indicateurs',
        icon: 'Activity',
        description: 'Suivi des ressources matérielles, temps de réponse et isolation mémoire',
        badge: 'Métriques'
      }
    ],
    primaryAction: {
      label: 'Exporter Spécification',
      actionKey: 'export-agent-ia'
    },
    templateData: {
      kpis: [
        { label: 'Phase Cible', value: 'Phase 2', subtext: 'Post-recette CaptureMind', variant: 'purple' },
        { label: 'Charge Estimée', value: '15–20 J.O.', subtext: 'Développement modulaire', variant: 'info' },
        { label: 'Ressource GPU', value: 'RTX 4000 Ada', subtext: '20 Go VRAM serveur LexIA', variant: 'success' },
        { label: 'Contrat Clé', value: 'API REST', subtext: 'Découplage strict microservices', variant: 'indigo' }
      ],
      decisions: [
        {
          id: 1,
          subject: 'Découplage strict entre CaptureMind et l\'Agent IA',
          status: 'Confirmé',
          choice: 'Architecture micro-services indépendante via OpenAPI/FastAPI',
          explanation: 'L\'Agent IA n\'interfère pas avec les 25-30 jours ouvrés prioritaires de Jean Elson. Il s\'interface via des contrats d\'API REST propres.'
        },
        {
          id: 2,
          subject: 'Allocation des ressources GPU LexIA',
          status: 'Hypothèse à tester',
          choice: 'Conteneur FastAPI avec vLLM ou backend dédié géré par Alphonse',
          explanation: 'Garantir que la mémoire VRAM GPU est allouée dynamiquement sans bloquer les autres processus du serveur mutualisé.'
        },
        {
          id: 3,
          subject: 'Préservation de la garantie Stateless RAM',
          status: 'Confirmé',
          choice: 'Aucune écriture de prompt ni de document sur disque',
          explanation: 'L\'Agent IA opère exclusivement sur les représentations vectorielles et mémoires volatiles sans persistance de données sensibles.'
        }
      ],
      milestones: [
        {
          subject: 'Spécification des contrats OpenAPI Agent IA',
          estimation: '3 jours',
          priority: 'Priorité 1',
          priorityBadge: 'Socle API',
          stepsAndDependencies: 'Définition des endpoints POST /v1/reasoning et schéma JSON d\'explication comptable.',
          details: 'Permet à Jean Elson d\'anticiper les appels sans bloquer le moteur principal.'
        },
        {
          subject: 'Déploiement du conteneur d\'inférence sur serveur LexIA',
          estimation: '5 jours',
          priority: 'Objectif Fixe',
          priorityBadge: 'Infra GPU',
          stepsAndDependencies: 'Mise en place de l\'environnement CUDA/PyTorch avec Alphonse.',
          details: 'Mesure de latence sur GPU RTX 4000 Ada (20 Go).'
        },
        {
          subject: 'Benchmark conjoint 100 factures complexes',
          estimation: '4 jours',
          priority: 'Enchaînement',
          priorityBadge: 'Recette',
          stepsAndDependencies: 'Évaluation des cas d\'arbitrage comptable ambiguë avec M. Flore.',
          details: 'Validation de la précision des suggestions d\'imputation.'
        }
      ],
      planning: [
        {
          day: 1,
          date: '04/01/2027',
          week: 1,
          phase: 'Phase 1 : Cadrage & Contrats',
          phaseColor: 'purple',
          title: 'Validation des contrats d\'interface REST',
          description: 'Revue des schémas JSON échangés entre FastAPI CaptureMind et le service IA.',
          deliverable: 'Spécification openapi.json versionnée',
          owner: 'Alphonse & Jean Elson',
          status: 'À venir'
        },
        {
          day: 2,
          date: '05/01/2027',
          week: 1,
          phase: 'Phase 1 : Cadrage & Contrats',
          phaseColor: 'purple',
          title: 'Configuration du runtime GPU vLLM',
          description: 'Installation des pilotes et benchmarks initiaux de débit de tokens sur LexIA.',
          deliverable: 'Rapport de latence d\'inférence',
          owner: 'Alphonse',
          status: 'À venir'
        },
        {
          day: 3,
          date: '06/01/2027',
          week: 1,
          phase: 'Phase 2 : Inférence & Rapprochement',
          phaseColor: 'purple',
          title: 'Pipeline de raisonnement comptable',
          description: 'Intégration des règles d\'imputation du dossier issues de FERnest.',
          deliverable: 'Module reasoning_engine.py',
          owner: 'Jean Elson',
          status: 'À venir'
        }
      ]
    }
  }
];
