//set of rules of what a valid request body should looks like
import { body } from 'express-validator';

export const createTaskRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3 })
    .withMessage('Title should be more than 3 characters')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage('Due date must be a valid date')
    .toDate(),
];

export const updateTaskRules = createTaskRules;
