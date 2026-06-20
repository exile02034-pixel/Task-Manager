export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      className="search-bar"
      placeholder="Search tasks by title..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}