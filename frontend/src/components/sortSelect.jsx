const SORT_OPTIONS = [
  { label: 'Newest first', value: 'createdAt-desc' },
  { label: 'Oldest first', value: 'createdAt-asc' },
  { label: 'Due date soonest', value: 'dueDate-asc' },
  { label: 'Due date latest', value: 'dueDate-desc' },
];

export default function SortSelect({ value, onChange }) {
  return (
    <label className="sort-select">
      <span>Sort</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
