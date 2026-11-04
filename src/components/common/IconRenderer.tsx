import React from 'react';
import {
  Layers,
  Cpu,
  Code2,
  Workflow,
  CheckSquare,
  Activity,
  Boxes,
  Mail,
  Calendar,
  Scale,
  Clock,
  Briefcase,
  HelpCircle,
  FileCheck2,
  Server,
  Network,
  BookOpen,
  FileText,
  Search,
  CheckCircle2,
  Zap,
  FolderGit2
} from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-4 h-4' }) => {
  switch (name) {
    case 'Layers':
      return <Layers className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'Code2':
      return <Code2 className={className} />;
    case 'Workflow':
      return <Workflow className={className} />;
    case 'CheckSquare':
      return <CheckSquare className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    case 'Boxes':
      return <Boxes className={className} />;
    case 'Mail':
      return <Mail className={className} />;
    case 'Calendar':
      return <Calendar className={className} />;
    case 'Scale':
      return <Scale className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'HelpCircle':
      return <HelpCircle className={className} />;
    case 'FileCheck2':
      return <FileCheck2 className={className} />;
    case 'Server':
      return <Server className={className} />;
    case 'Network':
      return <Network className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'Search':
      return <Search className={className} />;
    case 'CheckCircle2':
      return <CheckCircle2 className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'FolderGit2':
      return <FolderGit2 className={className} />;
    default:
      return <FolderGit2 className={className} />;
  }
};
