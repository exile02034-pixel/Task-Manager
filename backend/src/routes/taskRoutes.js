import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';
import validateRequest from '../middlewares/validateRequest.js';
import { createTaskRules, updateTaskRules } from '../validators/taskValidator.js';

const router = Router();

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', createTaskRules, validateRequest, taskController.createTask);
router.put('/:id', updateTaskRules, validateRequest, taskController.updateTask);
router.patch('/:id/toggle', taskController.toggleTask);
router.delete('/:id', taskController.deleteTask);
router.post('/:id/undo-delete', taskController.undoDeleteTask);

export default router;
