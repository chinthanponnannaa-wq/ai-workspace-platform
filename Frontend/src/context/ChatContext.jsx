import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  chatApi,
  messageApi,
  aiApi,
  workspaceApi,
} from '@/services/api';

import { useWorkspace } from './WorkspaceContext';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const {
    activeWorkspace,
    setActiveWorkspace,
  } = useWorkspace();

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);

  const fetchChats = useCallback(async () => {
    const workspaceId = activeWorkspace?._id;

    if (!workspaceId || workspaceId === 'default') {
      setChats([]);
      setActiveChat(null);
      setMessages([]);
      return;
    }

    try {
      setLoadingChats(true);

      setChats([]);
      setActiveChat(null);
      setMessages([]);

      const res = await chatApi.getByWorkspace(workspaceId);

      const fetchedChats =
        res.data?.chats ||
        res.data?.data ||
        res.data ||
        [];

      if (Array.isArray(fetchedChats)) {
        setChats(fetchedChats);
      } else {
        setChats([]);
      }
    } catch (err) {
      console.warn(
        'Could not fetch chats from backend:',
        err.message
      );

      setChats([]);
      setActiveChat(null);
      setMessages([]);
    } finally {
      setLoadingChats(false);
    }
  }, [activeWorkspace]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const openChat = async (chat) => {
    setActiveChat(chat);
    setInputValue('');

    const chatId = chat?._id || chat?.id;

    if (!chatId) {
      setMessages([]);
      return;
    }

    if (String(chatId).startsWith('temp-')) {
      setMessages(chat.messages || []);
      return;
    }

    try {
      setMessages([]);

      const res = await messageApi.getByChat(chatId);

      const fetchedMessages =
        res.data?.messages ||
        res.data?.data ||
        res.data ||
        [];

      if (Array.isArray(fetchedMessages)) {
        setMessages(
          fetchedMessages.map((m) => ({
            id: m._id || m.id,
            role: m.role,
            content: m.content,
            timestamp: m.createdAt
              ? new Date(m.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
          }))
        );
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.warn(
        'Could not fetch chat messages:',
        err.message
      );

      setMessages(chat.messages || []);
    }
  };

  const startNewChat = () => {
    setActiveChat(null);
    setMessages([]);
    setInputValue('');
  };

  const renameChat = async (chatId, newTitle) => {
    if (!chatId || !newTitle || !newTitle.trim()) {
      return false;
    }

    try {
      const res = await chatApi.update(chatId, {
        title: newTitle.trim(),
      });

      const updatedChat =
        res.data?.chat ||
        res.data?.data ||
        res.data;

      const finalTitle =
        updatedChat?.title || newTitle.trim();

      setChats((prev) =>
        prev.map((chat) => {
          const id = chat._id || chat.id;

          if (id === chatId) {
            return {
              ...chat,
              title: finalTitle,
            };
          }

          return chat;
        })
      );

      setActiveChat((prev) => {
        if (!prev) {
          return prev;
        }

        const activeId = prev._id || prev.id;

        if (activeId !== chatId) {
          return prev;
        }

        return {
          ...prev,
          title: finalTitle,
        };
      });

      return true;
    } catch (err) {
      console.error(
        'Could not rename chat:',
        err
      );

      return false;
    }
  };

  const deleteChat = async (chatId) => {
    try {
      await chatApi.delete(chatId);

      setChats((prev) =>
        prev.filter((chat) => {
          const id = chat._id || chat.id;
          return id !== chatId;
        })
      );

      const activeChatId =
        activeChat?._id ||
        activeChat?.id;

      if (activeChatId === chatId) {
        setActiveChat(null);
        setMessages([]);
        setInputValue('');
      }

      return true;
    } catch (err) {
      console.error(
        'Could not delete chat:',
        err
      );

      return false;
    }
  };

  const sendMessage = async (content) => {
    if (!content || !content.trim()) {
      return;
    }

    const userMsg = {
      id: `temp-u-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);

    setInputValue('');
    setIsTyping(true);

    try {
      let currentChatId =
        activeChat?._id ||
        activeChat?.id;

      if (
        !currentChatId ||
        String(currentChatId).startsWith('temp-')
      ) {
        let validWorkspaceId = activeWorkspace?._id;

        if (
          !validWorkspaceId ||
          validWorkspaceId === 'default'
        ) {
          try {
            const wsRes = await workspaceApi.create({
              title: 'Main Workspace',
            });

            const createdWs =
              wsRes.data?.workspace ||
              wsRes.data?.data ||
              wsRes.data;

            if (createdWs?._id) {
              validWorkspaceId = createdWs._id;
              setActiveWorkspace(createdWs);
            }
          } catch (wsErr) {
            console.warn(
              'Could not create workspace for chat:',
              wsErr.message
            );
          }
        }

        if (
          validWorkspaceId &&
          validWorkspaceId !== 'default'
        ) {
          const titleSnippet =
            content.slice(0, 30) +
            (content.length > 30 ? '...' : '');

          const chatRes = await chatApi.create(
            validWorkspaceId,
            titleSnippet
          );

          const newChat =
            chatRes.data?.chat ||
            chatRes.data?.data ||
            chatRes.data;

          if (
            newChat &&
            (newChat._id || newChat.id)
          ) {
            currentChatId =
              newChat._id ||
              newChat.id;

            setActiveChat(newChat);

            setChats((prev) => [
              newChat,
              ...prev,
            ]);
          }
        }
      }

      if (
        currentChatId &&
        !String(currentChatId).startsWith('temp-')
      ) {
        const aiRes = await aiApi.sendPrompt(
          currentChatId,
          content
        );

        const aiData = aiRes.data;

        const responseContent =
          aiData?.response ||
          aiData?.assistantMessage?.content ||
          aiData?.reply ||
          aiData?.message ||
          'AI response generated successfully.';

        const assistantMsg = {
          id:
            aiData?.assistantMessage?._id ||
            `m-${Date.now()}`,
          role: 'assistant',
          content: responseContent,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };

        setMessages((prev) => [
          ...prev,
          assistantMsg,
        ]);
      } else {
        const errorMsg = {
          id: `m-err-${Date.now()}`,
          role: 'assistant',
          content:
            'Unable to create backend conversation session. Please verify backend connection.',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };

        setMessages((prev) => [
          ...prev,
          errorMsg,
        ]);
      }
    } catch (err) {
      console.error(
        'AI Request Error:',
        err
      );

      const errorMsg = {
        id: `m-err-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${
          err.response?.data?.message ||
          err.message ||
          'Failed to generate response.'
        }`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [
        ...prev,
        errorMsg,
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        messages,
        inputValue,
        isTyping,
        loadingChats,
        setInputValue,
        startNewChat,
        openChat,
        renameChat,
        deleteChat,
        sendMessage,
        fetchChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);

  if (!ctx) {
    throw new Error(
      'useChat must be used within ChatProvider'
    );
  }

  return ctx;
}