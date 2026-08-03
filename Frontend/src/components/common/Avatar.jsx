import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function Avatar({ src, name, size = 'md', color, showStatus = false }) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };
  const initials = (name || '').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="relative inline-block">
      {src ? (
        <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-white dark:ring-gray-800`} />
      ) : (
        <div
          className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white dark:ring-gray-800`}
          style={{ backgroundColor: color || '#6366f1' }}
        >
          {initials || '?'}
        </div>
      )}
      {showStatus && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800" />
      )}
    </div>
  );
}
