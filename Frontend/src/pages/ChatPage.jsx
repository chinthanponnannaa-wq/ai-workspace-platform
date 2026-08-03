import ChatWindow from '@/components/chat/ChatWindow';
import ChatInput from '@/components/chat/ChatInput';
import { useChat } from '@/context/ChatContext';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function ChatPage() {
  const { activeChat } = useChat();

  return (
    <div className="flex flex-col h-full">
      {activeChat && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-6 py-3 border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-gray-900/50"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Sparkles className="text-white" size={14} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{activeChat.title}</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">NexusAI Assistant</p>
          </div>
        </motion.div>
      )}
      <ChatWindow />
      <ChatInput />
    </div>
  );
}
