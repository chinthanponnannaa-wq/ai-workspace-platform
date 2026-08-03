import { motion } from 'framer-motion';
import { Calendar, ListChecks, FileText, MessageSquare, BarChart3, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { templates } from '@/data/mockData';
import { useChat } from '@/context/ChatContext';

const iconMap = {
  calendar: Calendar,
  list: ListChecks,
  'file-text': FileText,
  'message-square': MessageSquare,
  'bar-chart': BarChart3,
};

export default function WorkspaceGrid() {
  const navigate = useNavigate();
  const { sendMessage } = useChat();

  const handleTemplateClick = async (title) => {
    navigate('/app/chat');
    await sendMessage(title);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((tpl, i) => {
        const Icon = iconMap[tpl.icon] || Sparkles;
        return (
          <motion.div
            key={tpl.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -3 }}
            onClick={() => handleTemplateClick(tpl.title)}
            className="group p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-500/10 dark:to-violet-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Icon size={22} />
              </div>
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{tpl.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tap to start a new conversation with this prompt</p>
          </motion.div>
        );
      })}
    </div>
  );
}
