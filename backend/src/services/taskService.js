import * as taskRepository from '../repositories/taskRepository.js';
import ApiError from '../utls/apiError.js';

const UNDO_DELETE_WINDOW_MS = 6000;
const pendingDeleteTimers = new Map();

const isPendingDeletion = (task) => {
  if (!task?.pendingDeletionExpiresAt) return false;
  return new Date(task.pendingDeletionExpiresAt).getTime() > Date.now();
};

const clearPendingDeleteTimer = (taskId) => {
  const timerId = pendingDeleteTimers.get(taskId);
  if (timerId) {
    clearTimeout(timerId);
    pendingDeleteTimers.delete(taskId);
  }
};

const scheduleHardDelete = (taskId, expiresAt) => {
  clearPendingDeleteTimer(taskId);

  const delay = Math.max(new Date(expiresAt).getTime() - Date.now(), 0);
  const timerId = setTimeout(async () => {
    pendingDeleteTimers.delete(taskId);

    try {
      const task = await taskRepository.findById(taskId);
      if (!task || !isPendingDeletion(task)) return;

      await taskRepository.deleteById(taskId);
    } catch (error) {
      console.error(`Failed to finalize delete for task ${taskId}:`, error);
    }
  }, delay);

  pendingDeleteTimers.set(taskId, timerId);
};

const purgeExpiredPendingDeletes = async () => {
  const now = new Date();
  const expiredTasks = await taskRepository.findMany({
    pendingDeletionExpiresAt: { $ne: null, $lte: now },
  });

  await Promise.all(
    expiredTasks.map(async (task) => {
      clearPendingDeleteTimer(task._id.toString());
      await taskRepository.deleteById(task._id);
    })
  );
};

const getActiveTaskById = async (id) => {
  await purgeExpiredPendingDeletes();

  const task = await taskRepository.findById(id);
  if (!task || isPendingDeletion(task)) {
    throw new ApiError(404, 'Task not found');
  }

  return task;
};

const buildTaskSort = (sortBy, sortOrder) => {
  const direction = sortOrder === 'asc' ? 1 : -1;

  if (sortBy === 'dueDate') {
    return { dueDate: direction, createdAt: -1 };
  }

  return { createdAt: direction };
};

export const createTask = async ({ title, description, dueDate }) => {
  return taskRepository.create({ title, description, dueDate });
};

export const getTasks = async ({ search, status, limit = 5, page = 1, sortBy, sortOrder }) => {
  await purgeExpiredPendingDeletes();

  const query = {};

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  if (status === 'active') query.isCompleted = false;
  if (status === 'completed') query.isCompleted = true;
  query.pendingDeletionExpiresAt = null;

  return taskRepository.findAll(query, limit, page, buildTaskSort(sortBy, sortOrder));
};

export const getTaskById = async (id) => {
  const task = await getActiveTaskById(id);
  return task;
};

export const updateTask = async (id, { title, description, dueDate }) => {
  await getActiveTaskById(id);
  const task = await taskRepository.updateById(id, { title, description, dueDate });
  if (!task) throw new ApiError(404, 'Task not found');
  return task;
};

export const toggleTask = async (id, { isCompleted } = {}) => {
  const task = await getActiveTaskById(id);
  task.isCompleted = typeof isCompleted === 'boolean' ? isCompleted : !task.isCompleted;
  await task.save();
  return task;
};

export const deleteTask = async (id) => {
  await purgeExpiredPendingDeletes();

  const task = await taskRepository.findById(id);
  if (!task) throw new ApiError(404, 'Task not found');

  if (isPendingDeletion(task)) {
    return task;
  }

  task.pendingDeletionExpiresAt = new Date(Date.now() + UNDO_DELETE_WINDOW_MS);
  await task.save();
  scheduleHardDelete(task._id.toString(), task.pendingDeletionExpiresAt);

  return task;
};

export const undoDeleteTask = async (id) => {
  await purgeExpiredPendingDeletes();

  const task = await taskRepository.findById(id);
  if (!task) throw new ApiError(404, 'Task not found');
  if (!isPendingDeletion(task)) throw new ApiError(400, 'Task is not pending deletion');

  clearPendingDeleteTimer(task._id.toString());
  task.pendingDeletionExpiresAt = null;
  await task.save();
  return task;
};

export const bootstrapPendingDeletes = async () => {
  await purgeExpiredPendingDeletes();

  const pendingTasks = await taskRepository.findMany({
    pendingDeletionExpiresAt: { $ne: null, $gt: new Date() },
  });

  pendingTasks.forEach((task) => {
    scheduleHardDelete(task._id.toString(), task.pendingDeletionExpiresAt);
  });
};
