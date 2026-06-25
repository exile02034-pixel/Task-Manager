import { useState, useEffect, useCallback } from 'react';
import * as taskApi from '../api/taskApi.js';

export function useTasks() {
  //global state for whole task list
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskApi.getTasks({ search, status: filter });
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  //wait 300 miliseconds before calling the api
  useEffect(() => {
    const debounceId = setTimeout(fetchTasks, 300);
    return () => clearTimeout(debounceId);
  }, [fetchTasks]);

  const addTask = async (payload) => {
    const newTask = await taskApi.createTask(payload);
    setTasks((prev) => [newTask, ...prev]);
  };

  const editTask = async (id, payload) => {
    const updated = await taskApi.updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, ...updated } : t)));
  };

  const toggleTask = async (id, isCompleted) => {
    const updated = await taskApi.toggleTask(id, { isCompleted });
    setTasks((prev) => {
      const nextTasks = prev.map((t) => (t._id === id ? { ...t, ...updated } : t));

      if (filter === 'active') return nextTasks.filter((t) => !t.isCompleted);
      if (filter === 'completed') return nextTasks.filter((t) => t.isCompleted);

      return nextTasks;
    });
  };

  const removeTask = async (id) => {
    await taskApi.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  return {
    tasks,
    loading,
    error,
    search,
    setSearch,
    filter,
    setFilter,
    addTask,
    editTask,
    toggleTask,
    removeTask,
  };
}
