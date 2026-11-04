export type ProjectId = 'capturemind' | 'visiofact' | 'knowledge' | string;

export interface ProjectViewConfig {
  id: string;
  label: string;
  shortLabel?: string;
  icon: string; // Lucide icon identifier
  description?: string;
  badge?: string;
  subTabs?: { id: string; label: string; icon?: string }[];
}

export interface ProjectConfig {
  id: ProjectId;
  name: string;
  shortName: string;
  subtitle: string;
  version: string;
  lead: string;
  direction: string;
  status: string;
  statusVariant?: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'indigo' | 'neutral';
  targetDeadline: string;
  totalDays: string;
  riskLevel?: 'Faible' | 'Modéré' | 'Élevé';
  accentColor: {
    primary: string;
    light: string;
    dark: string;
    border: string;
    ring: string;
    badgeBg: string;
    badgeText: string;
  };
  defaultViewId: string;
  views: ProjectViewConfig[];
  primaryAction?: {
    label: string;
    actionKey: string;
  };
  templateData?: {
    kpis?: { label: string; value: string; subtext: string; variant?: string }[];
    planning?: DayPlanItem[];
    milestones?: MilestoneItem[];
    decisions?: DecisionItem[];
  };
}

export interface DecisionItem {
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

export interface InvoicePreset {
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

export interface TechToolItem {
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

export interface MilestoneItem {
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
  status: 'Terminé' | 'En cours' | 'Priorité Immédiate' | 'À venir' | 'Bloquant';
}

export interface PeppolFeature {
  code: string;
  title: string;
  scope: string;
  status: 'Nouveau à développer' | 'Socle existant à adapter' | 'Inclus dans estimation';
  details: string;
}
