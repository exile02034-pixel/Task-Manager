import { useState } from 'react';
import ConfirmDialog from './confirmDIalog.jsx';
import DueDatePicker from './dueDatePicker.jsx';

const formatInputDate = (value) => {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
};

const formatDisplayDate = (value) => {
  if (!value) return '';

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
};

const isOverdue = (task) => {
  if (!task?.dueDate || task.isCompleted) return false;

  const dueDateKey = new Date(task.dueDate).toISOString().slice(0, 10);
  const todayKey = new Date().toISOString().slice(0, 10);
  return dueDateKey < todayKey;
};

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(formatInputDate(task.dueDate));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const handleSave = async () => {
    if (!title.trim()) {
      setEditError('Title is required');
      return;
    }

    if (title.trim().length < 3) {
      setEditError('Title should be more than 3 characters');
      return;
    }

    setEditError('');
    setSaving(true);
    try {
      await onEdit(task._id, {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null,
        isCompleted: task.isCompleted,
      });
      setIsEditing(false);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(formatInputDate(task.dueDate));
    setEditError('');
    setIsEditing(false);
  };

  const handleEdit = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(formatInputDate(task.dueDate));
    setEditError('');
    setIsEditing(true);
  };

  return (
    <li className={`task-item ${task.isCompleted ? 'completed' : ''} ${isOverdue(task) ? 'overdue' : ''}`}>
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={(e) => onToggle(task._id, e.target.checked)}
      />

      {isEditing ? (
        <div className="task-edit-fields">
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
          />
          <DueDatePicker
            id={`edit-task-due-date-${task._id}`}
            value={dueDate}
            onChange={setDueDate}
          />
          {editError && <p className="form-error">{editError}</p>}
          <div className="task-edit-actions">
            <button type="button" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="task-content">
          <h3>{task.title}</h3>
          {task.description && <p>{task.description}</p>}
          {task.dueDate && (
            <p className={`task-due-date ${isOverdue(task) ? 'overdue' : ''}`}>
              Due {formatDisplayDate(task.dueDate)}
            </p>
          )}
          <div className="task-actions">
            <button type="button" onClick={handleEdit}>
              Edit
            </button>
            <button type="button" onClick={() => setConfirmOpen(true)}>
              Delete
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        message={`Delete "${task.title}"?`}
        onConfirm={() => {
          onDelete(task._id);
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </li>
  );
}
