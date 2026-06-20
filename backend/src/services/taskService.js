import * as taskRepository from '../repositories/taskRepository.js';
import ApiError from '../utls/apiError.js';

export const createTask = async ({ title, description }) => {
  return taskRepository.create({ title, description });
};

export const getTasks = async ({ search, status }) => {
  const query = {};

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  if (status === 'active') query.isCompleted = false;
  if (status === 'completed') query.isCompleted = true;
  

  return taskRepository.findAll(query);
};

export const getTaskById = async (id) => {
  const task = await taskRepository.findById(id);
  if (!task) throw new ApiError(404, 'Task not found');
  return task;
};

export const updateTask = async (id, { title, description }) => {
  const task = await taskRepository.updateById(id, { title, description });
  if (!task) throw new ApiError(404, 'Task not found');
  return task;
};

export const toggleTask = async (id) => {
  const task = await taskRepository.findById(id);
  if (!task) throw new ApiError(404, 'Task not found');
  task.isCompleted = !task.isCompleted;
  await task.save();
  return task;
};

export const deleteTask = async (id) => {
  const task = await taskRepository.deleteById(id);
  if (!task) throw new ApiError(404, 'Task not found');
  return task;
};