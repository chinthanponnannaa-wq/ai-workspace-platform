import { motion } from 'framer-motion';
import { MessageSquare, FolderKanban, Sparkles, UserCheck } from 'lucide-react';
import { WorkspaceGrid } from '@/components/workspace';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';

export default function Dashboard() {
  const { activeWorkspace, workspaces } = useWorkspace();
  const { user } = useAuth();
  const { chats } = useChat();

  const userName = user?.name || user?.displayName || user?.email?.split('@')[0] || 'User';
  const activeWorkspaceLabel = activeWorkspace?.label || activeWorkspace?.name || 'Default';

  const realStats = [
    { label: 'Total Conversations', value: chats ? String(chats.length) : '0', icon: MessageSquare, color: 'from-indigo-500 to-violet-500' },
    { label: 'Active Workspaces', value: workspaces ? String(workspaces.length) : '1', icon: FolderKanban, color: 'from-emerald-500 to-teal-500' },
    { label: 'AI Platform Status', value: 'Online', icon: Sparkles, color: 'from-amber-500 to-orange-500' },
    { label: 'Account User', value: user?.email ? 'Authenticated' : 'Guest', icon: UserCheck, color: 'from-pink-500 to-rose-500' },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {userName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's what's happening in your {activeWorkspaceLabel} workspace
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {realStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                    <Icon size={20} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Templates</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Quick-start conversations for your workspace</p>
        </div>
        <WorkspaceGrid />
      </div>
    </div>
  );
}
