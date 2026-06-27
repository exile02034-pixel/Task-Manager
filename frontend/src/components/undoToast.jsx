export default function UndoToast({ toast, onUndo }) {
  if (!toast) return null;

  return (
    <div className="undo-toast" role="status" aria-live="polite">
      <div>
        <p className="undo-toast-title">Task deleted</p>
        <p className="undo-toast-message">{toast.title}</p>
      </div>
      <button type="button" onClick={onUndo}>
        Undo
      </button>
    </div>
  );
}
