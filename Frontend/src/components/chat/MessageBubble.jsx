import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import { useAuth } from '@/context/AuthContext';

export default function MessageBubble({ message, isLast }) {
  const { user } = useAuth();
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {isUser ? (
        <Avatar src={user?.avatar} name={user?.name} size="sm" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
          <Sparkles className="text-white" size={16} />
        </div>
      )}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={
            isUser
              ? 'px-4 py-2.5 rounded-2xl rounded-tr-md bg-indigo-600 text-white text-sm leading-relaxed'
              : 'px-4 py-2.5 rounded-2xl rounded-tl-md bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-100 text-sm leading-relaxed'
          }
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 px-1">{message.timestamp}</span>
      </div>
    </motion.div>
  );
}
