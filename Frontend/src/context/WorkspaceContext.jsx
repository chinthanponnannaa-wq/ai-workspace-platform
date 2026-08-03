import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { workspaceApi } from '@/services/api';
import { useAuth } from './AuthContext';

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const { user } = useAuth();

  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);

  const normalizeWorkspace = (workspace) => ({
    ...workspace,
    label:
      workspace.title ||
      workspace.label ||
      workspace.name ||
      'Workspace',
    color: workspace.color || '#6366f1',
  });

  const fetchWorkspaces = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token || !user) {
      setWorkspaces([]);
      setActiveWorkspace(null);
      return;
    }

    try {
      setLoading(true);

      const res = await workspaceApi.getAll();

      let fetched =
        res.data?.workspaces ||
        res.data?.data ||
        res.data ||
        [];

      if (!Array.isArray(fetched)) {
        fetched = [];
      }

      if (fetched.length === 0) {
        const createRes = await workspaceApi.create({
          title: 'Main Workspace',
        });

        const newWorkspace =
          createRes.data?.workspace ||
          createRes.data?.data ||
          createRes.data;

        if (newWorkspace?._id) {
          fetched = [newWorkspace];
        }
      }

      const normalized = fetched.map(normalizeWorkspace);

      setWorkspaces(normalized);

      setActiveWorkspace((current) => {
        if (current) {
          const currentId = current._id || current.id;

          const stillExists = normalized.find(
            (workspace) =>
              (workspace._id || workspace.id) === currentId
          );

          if (stillExists) {
            return stillExists;
          }
        }

        return normalized[0] || null;
      });
    } catch (err) {
      console.error('Workspace fetch error:', err);

      setWorkspaces([]);
      setActiveWorkspace(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setWorkspaces([]);
    setActiveWorkspace(null);

    if (user) {
      fetchWorkspaces();
    }
  }, [user, fetchWorkspaces]);

  const createWorkspace = async (title) => {
    if (!title || !title.trim()) {
      return false;
    }

    try {
      const res = await workspaceApi.create({
        title: title.trim(),
      });

      const createdWorkspace =
        res.data?.workspace ||
        res.data?.data ||
        res.data;

      if (!createdWorkspace?._id) {
        return false;
      }

      const normalized =
        normalizeWorkspace(createdWorkspace);

      setWorkspaces((prev) => [
        ...prev,
        normalized,
      ]);

      setActiveWorkspace(normalized);

      return true;
    } catch (err) {
      console.error(
        'Workspace creation error:',
        err
      );

      return false;
    }
  };

  const renameWorkspace = async (
    workspaceId,
    newTitle
  ) => {
    if (
      !workspaceId ||
      !newTitle ||
      !newTitle.trim()
    ) {
      return false;
    }

    try {
      const res = await workspaceApi.update(
        workspaceId,
        {
          title: newTitle.trim(),
        }
      );

      const updatedWorkspace =
        res.data?.workspace ||
        res.data?.data ||
        res.data;

      const finalTitle =
        updatedWorkspace?.title ||
        newTitle.trim();

      setWorkspaces((prev) =>
        prev.map((workspace) => {
          const id =
            workspace._id || workspace.id;

          if (id !== workspaceId) {
            return workspace;
          }

          return {
            ...workspace,
            ...updatedWorkspace,
            title: finalTitle,
            label: finalTitle,
          };
        })
      );

      setActiveWorkspace((current) => {
        if (!current) {
          return current;
        }

        const currentId =
          current._id || current.id;

        if (currentId !== workspaceId) {
          return current;
        }

        return {
          ...current,
          ...updatedWorkspace,
          title: finalTitle,
          label: finalTitle,
        };
      });

      return true;
    } catch (err) {
      console.error(
        'Workspace rename error:',
        err
      );

      return false;
    }
  };

  const deleteWorkspace = async (workspaceId) => {
    if (!workspaceId) {
      return false;
    }

    try {
      await workspaceApi.delete(workspaceId);

      const remainingWorkspaces =
        workspaces.filter((workspace) => {
          const id =
            workspace._id || workspace.id;

          return id !== workspaceId;
        });

      setWorkspaces(remainingWorkspaces);

      const activeId =
        activeWorkspace?._id ||
        activeWorkspace?.id;

      if (activeId === workspaceId) {
        setActiveWorkspace(
          remainingWorkspaces[0] || null
        );
      }

      if (remainingWorkspaces.length === 0) {
        const createRes =
          await workspaceApi.create({
            title: 'Main Workspace',
          });

        const createdWorkspace =
          createRes.data?.workspace ||
          createRes.data?.data ||
          createRes.data;

        if (createdWorkspace?._id) {
          const normalized =
            normalizeWorkspace(
              createdWorkspace
            );

          setWorkspaces([normalized]);
          setActiveWorkspace(normalized);
        }
      }

      return true;
    } catch (err) {
      console.error(
        'Workspace deletion error:',
        err
      );

      return false;
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        setActiveWorkspace,
        fetchWorkspaces,
        createWorkspace,
        renameWorkspace,
        deleteWorkspace,
        loading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);

  if (!ctx) {
    throw new Error(
      'useWorkspace must be used within WorkspaceProvider'
    );
  }

  return ctx;
}