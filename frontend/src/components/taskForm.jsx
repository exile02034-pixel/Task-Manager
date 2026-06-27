import { useState } from 'react';
import DueDatePicker from './dueDatePicker.jsx';

export default function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }

    setFormError('');
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null,
      });
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={500}
      />
      <DueDatePicker id="create-task-due-date" value={dueDate} onChange={setDueDate} />
      {formError && <p className="form-error">{formError}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}
