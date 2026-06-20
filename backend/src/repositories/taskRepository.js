import Task from '../models/taskModel.js';


export const create = (data) => Task.create(data);

export const findAll = (filter) => Task.find(filter).sort({ createdAt: -1 });

export const findById = (id) => Task.findById(id);

export const updateById = (id, data) =>
  Task.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const deleteById = (id) => Task.findByIdAndDelete(id);