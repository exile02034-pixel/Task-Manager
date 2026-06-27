import { useState, useEffect, useCallback, useRef } from 'react';
import * as taskApi from '../api/taskApi.js';

const ITEMS_PER_PAGE = 5;
const UNDO_DELETE_WINDOW_MS = 6000;

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('createdAt-desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [undoToast, setUndoToast] = useState(null);
  const undoTimerRef = useRef(null);

  const fetchTasks = useCallback(async (targetPage = 1, options = {}) => {
    const { silent = false } = options;

    if (!silent) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await taskApi.getTasks({
        search,
        status: filter,
        page: targetPage,
        limit: ITEMS_PER_PAGE,
        sortBy: sort.split('-')[0],
        sortOrder: sort.split('-')[1],
      });

      const pagination = data?.pagination ?? {};
      const nextPage = pagination.page ?? targetPage;
      const nextTotalPages = pagination.totalPages ?? 1;

      if (nextPage > nextTotalPages && targetPage !== nextTotalPages) {
        setPage(nextTotalPages);
        return;
      }

      setTasks(data?.tasks ?? []);
      setTotalPages(nextTotalPages);
      setTotalTasks(pagination.totalTasks ?? 0);
      setPage(nextPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [search, filter, sort]);

  useEffect(() => {
    const debounceId = setTimeout(() => fetchTasks(page), 300);
    return () => clearTimeout(debounceId);
  }, [fetchTasks, page]);

  useEffect(() => {
    return () => {
      window.clearTimeout(undoTimerRef.current);
    };
  }, []);

  const handleSearchChange = (value) => {
    setPage(1);
    setSearch(value);
  };

  const handleFilterChange = (value) => {
    setPage(1);
    setFilter(value);
  };

  const handleSortChange = (value) => {
    setPage(1);
    setSort(value);
  };

  const addTask = async (payload) => {
    await taskApi.createTask(payload);
    setPage(1);
    await fetchTasks(1);
  };

  const editTask = async (id, payload) => {
    const updated = await taskApi.updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, ...updated } : t)));
    await fetchTasks(page);
  };

  const toggleTask = async (id, isCompleted) => {
    const updated = await taskApi.toggleTask(id, { isCompleted });
    setTasks((prev) => {
      const nextTasks = prev.map((t) => (t._id === id ? { ...t, ...updated } : t));

      if (filter === 'active') return nextTasks.filter((t) => !t.isCompleted);
      if (filter === 'completed') return nextTasks.filter((t) => t.isCompleted);

      return nextTasks;
    });
    await fetchTasks(page);
  };

  const removeTask = async (id) => {
    const taskToDelete = tasks.find((task) => task._id === id);
    if (!taskToDelete) return;

    try {
      await taskApi.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      window.clearTimeout(undoTimerRef.current);
      setUndoToast({
        id,
        title: taskToDelete.title,
      });
      undoTimerRef.current = window.setTimeout(() => {
        undoTimerRef.current = null;
        setUndoToast((currentToast) => {
          if (currentToast?.id !== id) return currentToast;
          return null;
        });
      }, UNDO_DELETE_WINDOW_MS);
      await fetchTasks(page, { silent: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const undoDelete = async () => {
    if (!undoToast) return;

    try {
      await taskApi.undoDeleteTask(undoToast.id);
      window.clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
      setUndoToast(null);
      await fetchTasks(page, { silent: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to restore task');
    }
  };

  return {
    tasks,
    loading,
    error,
    search,
    setSearch: handleSearchChange,
    filter,
    setFilter: handleFilterChange,
    sort,
    setSort: handleSortChange,
    page,
    totalPages,
    totalTasks,
    setPage,
    refreshTasks: () => fetchTasks(page),
    addTask,
    editTask,
    toggleTask,
    removeTask,
    undoToast,
    undoDelete,
  };
}
