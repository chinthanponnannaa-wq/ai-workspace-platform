import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Paperclip, Mic, Sparkles } from 'lucide-react';
import { useChat } from '@/context/ChatContext';

export default function ChatInput() {
  const { inputValue, setInputValue, sendMessage, isTyping } = useChat();
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputValue]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    sendMessage(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 lg:px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 focus-within:border-indigo-500 transition-colors p-2">
          <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 transition-colors shrink-0">
            <Paperclip size={20} />
          </button>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Message NexusAI..."
            className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 py-2 max-h-[200px]"
          />
          <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 transition-colors shrink-0">
            <Mic size={20} />
          </button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isTyping}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors shrink-0"
          >
            <ArrowUp size={18} />
          </motion.button>
        </div>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center justify-center gap-1">
          <Sparkles size={12} />
          NexusAI can make mistakes. Verify important info.
        </p>
      </div>
    </div>
  );
}
