import * as taskService from '../services/taskService.js';
import ApiResponse from '../utls/apiResponse.js';
import asyncHandler from '../utls/asyncHandler.js';

export const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.body);
  res.status(201).json(new ApiResponse(201, task, 'Task created successfully'));
});
export const getTasks = asyncHandler(async (req, res) => {
  const { search, status, page, limit, sortBy, sortOrder } = req.query;
  const tasks = await taskService.getTasks({ search, status, limit, page, sortBy, sortOrder });
  res.status(200).json(new ApiResponse(200, tasks, 'Tasks fetched successfully'));
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);
  res.status(200).json(new ApiResponse(200, task));
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, task, 'Task updated successfully'));
});

export const toggleTask = asyncHandler(async (req, res) => {
  const task = await taskService.toggleTask(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, task, 'Task status toggled'));
});

export const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Task deleted successfully'));
});

export const undoDeleteTask = asyncHandler(async (req, res) => {
  const task = await taskService.undoDeleteTask(req.params.id);
  res.status(200).json(new ApiResponse(200, task, 'Task restored successfully'));
});
