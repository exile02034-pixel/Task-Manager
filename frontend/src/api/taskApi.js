import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const getTasks = async ({ search, status }) => {
  const { data } = await api.get('/tasks', { params: { search, status } });
  return data.data;
};

export const createTask = async (payload) => {
  const { data } = await api.post('/tasks', payload);
  return data.data;
};

export const updateTask = async (id, payload) => {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data.data;
};

export const toggleTask = async (id, payload) => {
  const { data } = await api.patch(`/tasks/${id}/toggle`, payload);
  return data.data;
};

export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data.data;
};
