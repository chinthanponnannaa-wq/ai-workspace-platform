import { Sparkles } from 'lucide-react';

export default function Logo({ size = 'md', showText = true }) {
  const sizes = {
    sm: { box: 'w-8 h-8', icon: 16, text: 'text-base' },
    md: { box: 'w-10 h-10', icon: 20, text: 'text-lg' },
    lg: { box: 'w-12 h-12', icon: 24, text: 'text-xl' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${s.box} rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20`}>
        <Sparkles className="text-white" size={s.icon} />
      </div>
      {showText && (
        <span className={`${s.text} font-bold text-gray-900 dark:text-white tracking-tight`}>
          NEXUS<span className="text-indigo-500">AI</span>
        </span>
      )}
    </div>
  );
}
