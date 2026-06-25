const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Available', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

export default function FilterTabs({ value, onChange }) {
  return (
    <div className="filter-tabs">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          className={value === f.value ? 'active' : ''}
          onClick={() => onChange(f.value)}
          type="button"
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
