import { useTasks } from '../hooks/useTasks.js';
import TaskForm from '../components/taskForm.jsx';
import SearchBar from '../components/searchBar.jsx';
import FilterTabs from '../components/filterTabs.jsx';
import TaskList from '../components/taskList.jsx';
import Pagination from '../components/pagination.jsx';
import UndoToast from '../components/undoToast.jsx';
import SortSelect from '../components/sortSelect.jsx';

export default function TaskDashboard() {
  const {
    tasks,
    loading,
    error,
    search,
    setSearch,
    filter,
    setFilter,
    sort,
    setSort,
    page,
    totalPages,
    totalTasks,
    setPage,
    addTask,
    editTask,
    toggleTask,
    removeTask,
    undoToast,
    undoDelete,
  } = useTasks();

  return (
    <div className="dashboard">
      <h1>Task Manager</h1>

      <TaskForm onSubmit={addTask} />

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} />
        <FilterTabs value={filter} onChange={setFilter} />
        <SortSelect value={sort} onChange={setSort} />
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="loading">Loading tasks...</p>
      ) : (
        <>
          <TaskList tasks={tasks} onToggle={toggleTask} onEdit={editTask} onDelete={removeTask} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalTasks={totalTasks}
            onPageChange={setPage}
          />
        </>
      )}

      <UndoToast toast={undoToast} onUndo={undoDelete} />
    </div>
  );
}
