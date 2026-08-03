import axios from 'axios';
import { topics, templates, assistants } from '@/data/mockData';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  register: (userData) =>
    api.post('/auth/register', userData),

  login: (credentials) =>
    api.post('/auth/login', credentials),

  getProfile: () =>
    api.get('/auth/profile'),
};

export const workspaceApi = {
  getAll: () =>
    api.get('/workspace'),

  create: (data) =>
    api.post('/workspace', data),

  update: (id, data) =>
    api.patch(`/workspace/${id}`, data),

  delete: (id) =>
    api.delete(`/workspace/${id}`),
};

export const chatApi = {
  create: (workspaceId, title = 'New Chat') =>
    api.post('/chat', {
      workspaceId,
      title,
    }),

  getByWorkspace: (workspaceId) =>
    api.get(`/chat/workspace/${workspaceId}`),

  update: (id, data) =>
    api.patch(`/chat/${id}`, data),

  delete: (id) =>
    api.delete(`/chat/${id}`),
};

export const messageApi = {
  getByChat: (chatId) =>
    api.get(`/message/chat/${chatId}`),

  create: (chatId, role, content) =>
    api.post('/message', {
      chatId,
      role,
      content,
    }),
};

export const aiApi = {
  sendPrompt: (chatId, prompt) =>
    api.post('/ai/chat', {
      chatId,
      prompt,
    }),
};

export const mockApi = {
  getTopics: () =>
    Promise.resolve(topics),

  getTemplates: () =>
    Promise.resolve(templates),

  getAssistants: () =>
    Promise.resolve(assistants),
};

export const chatService = {
  getChats: (workspaceId) =>
    workspaceId
      ? chatApi
          .getByWorkspace(workspaceId)
          .then(
            (res) =>
              res.data.chats || res.data
          )
      : Promise.resolve([]),
};

export const workspaceService = {
  getTemplates: () =>
    mockApi.getTemplates(),
};

export const assistantService = {
  getAll: () =>
    mockApi.getAssistants(),
};

export default api;