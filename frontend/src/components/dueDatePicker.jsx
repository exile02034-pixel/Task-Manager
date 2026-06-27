export default function DueDatePicker({ value, onChange, id, label = 'Due date' }) {
  return (
    <label className="due-date-picker" htmlFor={id}>
      <span>{label}</span>
      <input id={id} type="date" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
