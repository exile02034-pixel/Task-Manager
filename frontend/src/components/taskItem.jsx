import { useState } from 'react';
import ConfirmDialog from './confirmDIalog.jsx';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onEdit(task._id, { title: title.trim(), description: description.trim() });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description);
    setIsEditing(false);
  };

  return (
    <li className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={() => onToggle(task._id)}
      />

      {isEditing ? (
        <div className="task-edit-fields">
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
          />
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
          <div className="task-actions">
            <button type="button" onClick={() => setIsEditing(true)}>
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
        message={`Delete "${task.title}"? This cannot be undone.`}
        onConfirm={() => {
          onDelete(task._id);
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </li>
  );
}