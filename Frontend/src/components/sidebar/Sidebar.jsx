import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MessageSquare,
  FolderOpen,
  Settings,
  ChevronDown,
  X,
  Trash2,
  Pencil,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { useWorkspace } from '@/context/WorkspaceContext';
import { topics } from '@/data/mockData';
import { cn } from '@/utils/helpers';
import Avatar from '@/components/common/Avatar';
import Logo from '@/components/common/Logo';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const {
    chats,
    startNewChat,
    openChat,
    activeChat,
    renameChat,
    deleteChat,
  } = useChat();

  const { user, logout } = useAuth();

  const {
    activeWorkspace,
    workspaces,
    setActiveWorkspace,
    createWorkspace,
    renameWorkspace,
    deleteWorkspace,
  } = useWorkspace();

  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [deletingChatId, setDeletingChatId] = useState(null);
  const [renamingChatId, setRenamingChatId] = useState(null);

  const [deletingWorkspaceId, setDeletingWorkspaceId] =
    useState(null);

  const [renamingWorkspaceId, setRenamingWorkspaceId] =
    useState(null);

  const [creatingWorkspace, setCreatingWorkspace] =
    useState(false);

  const handleNewChat = async () => {
    await startNewChat();
    navigate('/app/chat');

    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleOpenChat = (chat) => {
    openChat(chat);
    navigate('/app/chat');

    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleCreateWorkspace = async () => {
    if (creatingWorkspace) {
      return;
    }

    const title = window.prompt(
      'Enter workspace name:'
    );

    if (title === null) {
      return;
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      window.alert(
        'Workspace name cannot be empty.'
      );
      return;
    }

    try {
      setCreatingWorkspace(true);

      const success =
        await createWorkspace(trimmedTitle);

      if (!success) {
        window.alert(
          'Unable to create workspace. Please try again.'
        );
        return;
      }

      setWorkspaceOpen(false);
      navigate('/app/workspace');
    } finally {
      setCreatingWorkspace(false);
    }
  };

  const handleRenameWorkspace = async (
    event,
    workspace
  ) => {
    event.stopPropagation();

    const workspaceId =
      workspace._id || workspace.id;

    if (
      !workspaceId ||
      renamingWorkspaceId === workspaceId
    ) {
      return;
    }

    const currentTitle =
      workspace.title ||
      workspace.label ||
      workspace.name ||
      'Workspace';

    const newTitle = window.prompt(
      'Enter a new workspace name:',
      currentTitle
    );

    if (newTitle === null) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      window.alert(
        'Workspace name cannot be empty.'
      );
      return;
    }

    if (trimmedTitle === currentTitle) {
      return;
    }

    try {
      setRenamingWorkspaceId(workspaceId);

      const success = await renameWorkspace(
        workspaceId,
        trimmedTitle
      );

      if (!success) {
        window.alert(
          'Unable to rename workspace. Please try again.'
        );
      }
    } finally {
      setRenamingWorkspaceId(null);
    }
  };

  const handleDeleteWorkspace = async (
    event,
    workspace
  ) => {
    event.stopPropagation();

    const workspaceId =
      workspace._id || workspace.id;

    if (
      !workspaceId ||
      deletingWorkspaceId === workspaceId
    ) {
      return;
    }

    const workspaceTitle =
      workspace.title ||
      workspace.label ||
      workspace.name ||
      'this workspace';

    const confirmed = window.confirm(
      `Delete "${workspaceTitle}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingWorkspaceId(workspaceId);

      const success =
        await deleteWorkspace(workspaceId);

      if (!success) {
        window.alert(
          'Unable to delete workspace. Please try again.'
        );
        return;
      }

      setWorkspaceOpen(false);
      navigate('/app/workspace');
    } finally {
      setDeletingWorkspaceId(null);
    }
  };

  const handleRenameChat = async (
    event,
    chat
  ) => {
    event.stopPropagation();

    const chatId = chat._id || chat.id;

    if (
      !chatId ||
      renamingChatId === chatId
    ) {
      return;
    }

    const currentTitle =
      chat.title || 'Untitled Chat';

    const newTitle = window.prompt(
      'Enter a new chat name:',
      currentTitle
    );

    if (newTitle === null) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      window.alert(
        'Chat name cannot be empty.'
      );
      return;
    }

    if (trimmedTitle === currentTitle) {
      return;
    }

    try {
      setRenamingChatId(chatId);

      const success = await renameChat(
        chatId,
        trimmedTitle
      );

      if (!success) {
        window.alert(
          'Unable to rename chat. Please try again.'
        );
      }
    } finally {
      setRenamingChatId(null);
    }
  };

  const handleDeleteChat = async (
    event,
    chat
  ) => {
    event.stopPropagation();

    const chatId = chat._id || chat.id;

    if (
      !chatId ||
      deletingChatId === chatId
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${chat.title || 'this chat'}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingChatId(chatId);

      const success =
        await deleteChat(chatId);

      if (!success) {
        window.alert(
          'Unable to delete chat. Please try again.'
        );
      }
    } finally {
      setDeletingChatId(null);
    }
  };

  const handleNavigateSettings = () => {
    navigate('/app/settings');
    setProfileOpen(false);

    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const userName =
    user?.name ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'User';

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%',
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 300,
        }}
        className="fixed lg:sticky top-0 left-0 h-screen w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-white/10 z-40 flex flex-col"
      >
        <div
          className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-white/10 cursor-pointer"
          onClick={() => navigate('/app')}
        >
          <Logo size="md" />

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-3">
          <div className="relative">
            <button
              onClick={() =>
                setWorkspaceOpen((o) => !o)
              }
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{
                    backgroundColor:
                      activeWorkspace?.color ||
                      '#6366F1',
                  }}
                >
                  {(
                    activeWorkspace?.label ||
                    activeWorkspace?.title ||
                    activeWorkspace?.name ||
                    'W'
                  )[0]}
                </div>

                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {activeWorkspace?.label ||
                    activeWorkspace?.title ||
                    activeWorkspace?.name ||
                    'Workspace'}
                </span>
              </div>

              <ChevronDown
                size={16}
                className={cn(
                  'text-gray-400 transition-transform flex-shrink-0',
                  workspaceOpen &&
                    'rotate-180'
                )}
              />
            </button>

            <AnimatePresence>
              {workspaceOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                  }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-white/10 py-1 z-20"
                >
                  {workspaces.map((ws) => {
                    const wsId =
                      ws._id || ws.id;

                    const wsLabel =
                      ws.label ||
                      ws.title ||
                      ws.name ||
                      'Workspace';

                    const activeId =
                      activeWorkspace?._id ||
                      activeWorkspace?.id;

                    const isRenaming =
                      renamingWorkspaceId ===
                      wsId;

                    const isDeleting =
                      deletingWorkspaceId ===
                      wsId;

                    return (
                      <div
                        key={wsId}
                        onClick={() => {
                          setActiveWorkspace(ws);
                          setWorkspaceOpen(false);
                          navigate(
                            '/app/workspace'
                          );
                        }}
                        className={cn(
                          'group flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer',
                          activeId === wsId &&
                            'bg-gray-50 dark:bg-white/5'
                        )}
                      >
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{
                            backgroundColor:
                              ws.color ||
                              '#6366F1',
                          }}
                        >
                          {wsLabel[0]}
                        </div>

                        <span className="flex-1 min-w-0 text-sm text-gray-700 dark:text-gray-300 truncate">
                          {wsLabel}
                        </span>

                        <div className="flex items-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            disabled={isRenaming}
                            onClick={(event) =>
                              handleRenameWorkspace(
                                event,
                                ws
                              )
                            }
                            title="Rename workspace"
                            className="p-1 rounded-md text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 disabled:opacity-50"
                          >
                            <Pencil size={13} />
                          </button>

                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={(event) =>
                              handleDeleteWorkspace(
                                event,
                                ws
                              )
                            }
                            title="Delete workspace"
                            className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <div className="border-t border-gray-200 dark:border-white/10 mt-1 pt-1">
                    <button
                      type="button"
                      disabled={creatingWorkspace}
                      onClick={
                        handleCreateWorkspace
                      }
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors disabled:opacity-50"
                    >
                      <Plus size={15} />

                      {creatingWorkspace
                        ? 'Creating...'
                        : 'Create Workspace'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleNewChat}
            className="w-full mt-2 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-lg shadow-indigo-600/20 transition-colors"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <div className="flex items-center gap-2 px-2 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            <FolderOpen size={14} />
            Topics
          </div>

          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() =>
                navigate('/app/chat')
              }
              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor:
                    topic.color,
                }}
              />

              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                {topic.label}
              </span>
            </button>
          ))}

          <div className="flex items-center gap-2 px-2 py-2 mt-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            <MessageSquare size={14} />
            Recent Chats
          </div>

          {!chats || chats.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-gray-400 dark:text-gray-500 italic">
              No conversations yet
            </div>
          ) : (
            chats.map((chat) => {
              const chatId =
                chat._id || chat.id;

              const activeId =
                activeChat?._id ||
                activeChat?.id;

              const isDeleting =
                deletingChatId === chatId;

              const isRenaming =
                renamingChatId === chatId;

              return (
                <div
                  key={chatId}
                  onClick={() =>
                    handleOpenChat(chat)
                  }
                  className={cn(
                    'w-full flex items-center gap-1 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group cursor-pointer',
                    activeId === chatId &&
                      'bg-gray-100 dark:bg-white/5'
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate group-hover:text-gray-900 dark:group-hover:text-white">
                      {chat.title ||
                        'Untitled Chat'}
                    </p>

                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                      {chat.preview ||
                        chat.lastMessage ||
                        'Click to open discussion'}
                    </p>
                  </div>

                  <div className="flex items-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      disabled={isRenaming}
                      onClick={(event) =>
                        handleRenameChat(
                          event,
                          chat
                        )
                      }
                      title="Rename chat"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all disabled:opacity-50"
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={(event) =>
                        handleDeleteChat(
                          event,
                          chat
                        )
                      }
                      title="Delete chat"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="relative p-3 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={() =>
              setProfileOpen((o) => !o)
            }
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <Avatar
              src={user?.avatar}
              name={userName}
              size="sm"
              showStatus
            />

            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {userName}
              </p>

              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                {user?.email}
              </p>
            </div>

            <ChevronDown
              size={16}
              className={cn(
                'text-gray-400 transition-transform',
                profileOpen &&
                  'rotate-180'
              )}
            />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 8,
                }}
                className="absolute bottom-full left-3 right-3 mb-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-white/10 py-1"
              >
                <button
                  onClick={
                    handleNavigateSettings
                  }
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm text-gray-700 dark:text-gray-300"
                >
                  <Settings size={16} />
                  Settings
                </button>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-sm text-red-600 dark:text-red-400"
                >
                  Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
}