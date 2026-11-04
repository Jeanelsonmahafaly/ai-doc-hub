import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  maxHeight?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'text',
  title,
  maxHeight = 'max-h-96',
  showLineNumbers = false
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className="rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-900 text-slate-100 overflow-hidden shadow-sm">
      {/* Header with Title & Copy Button */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/90 dark:bg-slate-950 border-b border-slate-700/80 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 font-mono text-slate-300 font-medium">
          <Terminal className="w-4 h-4 text-slate-400" />
          <span>{title || language.toUpperCase()}</span>
        </div>
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Code copié' : 'Copier le code'}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">Copié !</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-300" />
              <span>Copier</span>
            </>
          )}
        </button>
      </div>

      {/* Code body with internal scroll */}
      <div className={`overflow-x-auto overflow-y-auto p-4 font-mono text-xs leading-relaxed ${maxHeight}`}>
        {showLineNumbers ? (
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50">
                  <td className="pr-4 text-right select-none text-slate-500 text-[11px] w-8">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre">{line}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <pre className="whitespace-pre font-mono">{code}</pre>
        )}
      </div>
    </div>
  );
};
