import Task from '../models/taskModel.js';


export const create = (data) => Task.create(data);

export const findAll = async (filter = {}, limit = 5, page = 1, sort = { createdAt: -1 }) => {
  const pageNumber = Number.parseInt(page, 10) > 0 ? Number.parseInt(page, 10) : 1;
  const limitNumber = Number.parseInt(limit, 10) > 0 ? Number.parseInt(limit, 10) : 5;
  const totalTasks = await Task.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalTasks / limitNumber));
  const currentPage = Math.min(pageNumber, totalPages);
  const skip = (currentPage - 1) * limitNumber;

  const tasks = await Task.find(filter).sort(sort).skip(skip).limit(limitNumber);

  return {
    tasks,
    pagination: {
      page: currentPage,
      limit: limitNumber,
      totalTasks,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  };
};

export const findById = (id) => Task.findById(id);

export const findMany = (filter = {}) => Task.find(filter);

export const updateById = (id, data) =>
  Task.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const deleteById = (id) => Task.findByIdAndDelete(id);

export const deleteMany = (filter = {}) => Task.deleteMany(filter);
