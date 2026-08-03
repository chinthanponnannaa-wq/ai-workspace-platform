import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, ListChecks, FileText, MessageSquare, BarChart3 } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { useChat } from '@/context/ChatContext';
import { templates } from '@/data/mockData';

const iconMap = {
  calendar: Calendar,
  list: ListChecks,
  'file-text': FileText,
  'message-square': MessageSquare,
  'bar-chart': BarChart3,
};

export default function ChatWindow() {
  const { messages, isTyping, activeChat, sendMessage } = useChat();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleTemplateClick = (title) => {
    sendMessage(title);
  };

  if (!activeChat && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/30">
            <Sparkles className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">How can I help you today?</h2>
          <p className="text-gray-500 dark:text-gray-400">Start a conversation or select a prompt below</p>
        </motion.div>

        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.map((tpl, i) => {
            const Icon = iconMap[tpl.icon] || Sparkles;
            return (
              <motion.button
                key={tpl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                onClick={() => handleTemplateClick(tpl.title)}
                className="flex flex-col gap-2 p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-lg transition-all text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Icon size={18} />
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{tpl.title}</p>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 lg:px-6 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
}
