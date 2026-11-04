import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'purple'
  | 'indigo';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  icon,
  size = 'md',
  className = ''
}) => {
  const getVariantStyles = (): { bg: string; text: string; border: string; defaultIcon: React.ReactNode } => {
    switch (variant) {
      case 'success':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-950',
          text: 'text-emerald-950 dark:text-emerald-100',
          border: 'border-emerald-400 dark:border-emerald-700',
          defaultIcon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-200 shrink-0" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-100 dark:bg-amber-950',
          text: 'text-amber-950 dark:text-amber-100',
          border: 'border-amber-400 dark:border-amber-700',
          defaultIcon: <AlertTriangle className="w-3.5 h-3.5 text-amber-800 dark:text-amber-200 shrink-0" />
        };
      case 'danger':
        return {
          bg: 'bg-rose-100 dark:bg-rose-950',
          text: 'text-rose-950 dark:text-rose-100',
          border: 'border-rose-400 dark:border-rose-700',
          defaultIcon: <AlertTriangle className="w-3.5 h-3.5 text-rose-800 dark:text-rose-200 shrink-0" />
        };
      case 'info':
        return {
          bg: 'bg-sky-100 dark:bg-sky-950',
          text: 'text-sky-950 dark:text-sky-100',
          border: 'border-sky-400 dark:border-sky-700',
          defaultIcon: <Info className="w-3.5 h-3.5 text-sky-800 dark:text-sky-200 shrink-0" />
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-100 dark:bg-indigo-950',
          text: 'text-indigo-950 dark:text-indigo-100',
          border: 'border-indigo-400 dark:border-indigo-700',
          defaultIcon: <Zap className="w-3.5 h-3.5 text-indigo-800 dark:text-indigo-200 shrink-0" />
        };
      case 'purple':
        return {
          bg: 'bg-purple-100 dark:bg-purple-950',
          text: 'text-purple-950 dark:text-purple-100',
          border: 'border-purple-400 dark:border-purple-700',
          defaultIcon: <ShieldCheck className="w-3.5 h-3.5 text-purple-800 dark:text-purple-200 shrink-0" />
        };
      case 'neutral':
      default:
        return {
          bg: 'bg-slate-200 dark:bg-slate-800',
          text: 'text-slate-900 dark:text-slate-100',
          border: 'border-slate-300 dark:border-slate-600',
          defaultIcon: <Clock className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 shrink-0" />
        };
    }
  };

  const v = getVariantStyles();
  const renderIcon = icon !== undefined ? icon : v.defaultIcon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-md border font-sans tracking-tight ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      } ${v.bg} ${v.text} ${v.border} ${className}`}
    >
      {renderIcon}
      <span>{label}</span>
    </span>
  );
};
