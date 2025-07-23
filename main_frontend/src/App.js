import React, { useState } from "react";
import "./App.css";
import "./todo_app_design.css";

// Status bar icons and other Figma images
const STATUS_ICONS = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/65c1d550-fe03-472e-96c7-1d430adb8b5e";
const STATUS_ICONS_COMPLETED = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9eca8c2e-db62-4630-9f0c-c5eacdae9ef7";
const STATUS_TIME = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ffc91e39-6737-472e-9aad-54edf98be73e";
const STATUS_TIME_COMPLETED = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/bdffb879-bf73-4396-8a7c-df6e1699ebf1";
const CALENDAR_ICON = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/77e2a96f-f2a0-4c1b-b19e-04c17cef4c93";
const ADD_ICON = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/4f93fc08-6477-4172-b648-b0fc23eb296b";
const EDIT_ICON = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e1c69fa1-05b8-4661-8e91-d773a1fa6919";
const CHECK_ICON = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/39a1bd72-250a-4bf3-8d4e-4a9f79ccae60";
const TRASH_ICON = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/a1a8f54e-1362-4884-b2a4-e2e494744d42";

// ---- Utilities and helpers ----
const FILTERS = {
  all: "All",
  completed: "Completed",
};

// PUBLIC_INTERFACE
function App() {
  // App state for tasks, modal, edit, etc.
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Buy Groceries",
      detail: "Milk, eggs, vegetables",
      completed: false,
    },
    {
      id: 2,
      title: "Finish Project",
      detail: "Complete frontend design implementation",
      completed: false,
    },
    {
      id: 3,
      title: "Walk The Dog",
      detail: "30min at the park",
      completed: true,
    },
  ]);
  const [selectedFilter, setSelectedFilter] = useState("all"); // "all" or "completed"
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [modalTask, setModalTask] = useState(null); // for edit mode

  // PUBLIC_INTERFACE
  // (useEffect logic removed; no longer needed due to removal of theme toggle)

  const filteredTasks =
    selectedFilter === "all"
      ? tasks
      : tasks.filter((t) => t.completed);

  // PUBLIC_INTERFACE
  function handleAddClick() {
    setModalTask({ title: "", detail: "" });
    setEditMode(false);
    setModalOpen(true);
  }

  // PUBLIC_INTERFACE
  function handleEdit(task) {
    setModalTask(task);
    setEditMode(true);
    setModalOpen(true);
  }

  // PUBLIC_INTERFACE
  function handleDelete(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  // PUBLIC_INTERFACE
  function handleMarkComplete(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  }

  // PUBLIC_INTERFACE
  function handleFilterChange(f) {
    setSelectedFilter(f);
  }

  // PUBLIC_INTERFACE
  function closeModal() {
    setModalOpen(false);
    setModalTask(null);
  }

  // PUBLIC_INTERFACE
  function handleModalSubmit(taskObj) {
    if (editMode && modalTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === modalTask.id ? { ...t, ...taskObj } : t
        )
      );
    } else {
      setTasks((prev) => [
        ...prev,
        { ...taskObj, completed: false, id: Date.now() },
      ]);
    }
    closeModal();
  }

  return (
    <div className="App" style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "Inter, Arial, sans-serif" }}>
      <StatusBar />

      <Header
        onCalendar={() => {}}
        appTitle="TODO APP"
        icon={CALENDAR_ICON}
      />

      <NavigationBar
        selected={selectedFilter}
        onChange={handleFilterChange}
      />

      <main>
        <TodoList
          tasks={filteredTasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCheck={handleMarkComplete}
        />
      </main>

      <AddTodoButton onClick={handleAddClick} />

      {modalOpen && (
        <TodoModal
          open={modalOpen}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          editMode={editMode}
          initial={modalTask}
        />
      )}
    </div>
  );
}

/**
 * StatusBar UI - time, status (Figma-inspired, theme toggle removed).
 */
function StatusBar() {
  return (
    <div className="status-bar" style={{
      background: "transparent",
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      position: 'relative'
    }}>
      <div />
      <div className="status-icons">
        <img src={STATUS_ICONS} alt="Status Icons" width={69} height={14} style={{ marginRight: 8 }} />
      </div>
      <div className="status-time">
        <img src={STATUS_TIME} alt="Time" width={33} height={15} />
      </div>
    </div>
  );
}

/**
 * Header bar (AppBar) with App Title (or use for "Add"/"Edit" modals)
 */
function Header({ appTitle, icon, onCalendar }) {
  return (
    <div className="appBar" style={{
      height: 118,
      background: "#9295d3",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      display: "flex",
      alignItems: "center",
      padding: "0 32px",
      justifyContent: "space-between",
      position: "relative"
    }}>
      <div className="todo-title" style={{
        color: "#fff",
        fontSize: "2rem",
        fontWeight: "bold",
        letterSpacing: 2,
        marginTop: 40,
      }}>
        {appTitle}
      </div>
      <div className="calendar-icon" style={{ marginTop: 40, cursor: "pointer" }} title="Calendar" onClick={onCalendar}>
        <img src={icon} alt="Calendar" width={32} height={32} />
      </div>
    </div>
  );
}

/**
 * NavigationBar for filters: All, Completed
 */
function NavigationBar({ selected, onChange }) {
  return (
    <div className="navigation-bar">
      <div
        className={`nav-section nav-all${selected === "all" ? " active" : ""}`}
        onClick={() => onChange("all")}
        style={{ cursor: "pointer" }}
      >
        All
      </div>
      <div
        className={`nav-section nav-completed${selected === "completed" ? " active" : ""}`}
        onClick={() => onChange("completed")}
        style={{ cursor: "pointer" }}
      >
        Completed
      </div>
    </div>
  );
}

/**
 * List of Todos
 */
function TodoList({ tasks, onEdit, onDelete, onCheck }) {
  if (tasks.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#999" }}>
        No tasks found.
      </div>
    );
  }
  return (
    <div className="todos-scrollable">
      {tasks.map((task) => (
        <TodoCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onCheck={onCheck}
        />
      ))}
    </div>
  );
}

/**
 * Individual Todo Card, showing title, subtitle, action icons
 */
function TodoCard({ task, onEdit, onDelete, onCheck }) {
  const cardClass = "todo-card" + (task.completed ? " completed" : "");
  return (
    <div className={cardClass}>
      <div className="todo-main">
        <div className="todo-title-block">
          <div className="todo-title-text">{task.title}</div>
          <div className="todo-subtitle">{task.detail}</div>
        </div>
        <div className="todo-action-icons" style={{ display: "flex", alignItems: "center" }}>
          <img
            src={CHECK_ICON}
            alt="Mark Complete"
            title="Mark Complete"
            style={{
              opacity: task.completed ? 1 : 0.7,
              filter: task.completed ? "grayscale(0%)" : "grayscale(0.8)",
              cursor: "pointer",
            }}
            width={25}
            height={25}
            onClick={() => onCheck(task.id)}
          />
          <img
            src={TRASH_ICON}
            alt="Delete"
            title="Delete"
            width={25}
            height={25}
            style={{ marginLeft: 10, cursor: "pointer" }}
            onClick={() => onDelete(task.id)}
          />
          <img
            src={EDIT_ICON}
            alt="Edit"
            title="Edit"
            width={25}
            height={25}
            style={{ marginLeft: 10, cursor: "pointer" }}
            onClick={() => onEdit(task)}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Floating Action Button for "Add"
 */
function AddTodoButton({ onClick }) {
  return (
    <button
      className="fab-add-todo"
      aria-label="Add New Todo"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 20,
        border: "none",
        background: "transparent",
        boxShadow: "0 4px 12px rgba(0,0,0,0.16)",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <span className="fab-circle" style={{
        background: "#9295d3",
        width: 70,
        height: 70,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <img src={ADD_ICON} alt="Plus" width={21} height={24} />
      </span>
    </button>
  );
}

/**
 * Modal for Add/Edit Todo Task
 */
function TodoModal({ open, onClose, onSubmit, editMode, initial }) {
  const [form, setForm] = useState(
    initial || { title: "", detail: "" }
  );

  // useEffect removed: No longer required for keeping form state in sync,
  // since dark/light mode and related state logic is no longer present.

  React.useEffect?.(() => {}); // For type completeness if someone retains the import in strict eslint, but in reality
  // removing this entirely as the effect is no longer needed.

  // Simple input sync with props:
  React.useMemo?.(() => {}, [initial]); // Not used, left here to indicate that hooks not needed

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit({ ...initial, ...form });
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 200,
        background: "rgba(150,150,160,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 4px 32px rgba(0,0,0,0.19)",
          padding: "32px 32px 24px 32px",
          width: 340,
          minHeight: 260,
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header: use same as Figma/HTML asset */}
        <div className="todo-title" style={{
          color: "#9295d3",
          fontSize: "1.7rem",
          fontWeight: 700,
          margin: "0 0 20px 0"
        }}>
          {editMode ? "Edit Task" : "Add Task"}
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 30 }}>
            <label style={{ color: "#878487", fontWeight: 600, fontSize: 20, marginBottom: 2 }}>Title</label>
            <div style={{ borderBottom: "1px solid #878487", padding: "5px 0 7px 0", color: "#191a26", fontSize: 18 }}>
              <input
                name="title"
                type="text"
                placeholder="Enter ToDo Title"
                value={form.title}
                onChange={handleChange}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 18,
                  color: "#191a26",
                }}
                maxLength={160}
                autoFocus
                required
              />
            </div>
          </div>
          <div style={{ marginBottom: 33 }}>
            <label style={{ color: "#878487", fontWeight: 600, fontSize: 20, marginBottom: 2 }}>Detail</label>
            <div style={{ borderBottom: "1px solid #878487", padding: "5px 0 7px 0", color: "#191a26", fontSize: 18 }}>
              <input
                name="detail"
                type="text"
                placeholder="Enter ToDo Detail"
                value={form.detail}
                onChange={handleChange}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 18,
                  color: "#191a26",
                }}
                maxLength={350}
              />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 34 }}>
            <button
              type="submit"
              className="fab-add-todo"
              style={{
                position: "static",
                boxShadow: "none",
                width: 170,
                height: 52,
                borderRadius: 15,
                background: "#9295d3",
                fontWeight: "bold",
                color: "#fff",
                fontSize: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: "pointer",
              }}
            >
              {editMode ? "SAVE" : "ADD"}
            </button>
            <button
              type="button"
              className="btn-cancel"
              style={{
                position: "static",
                boxShadow: "none",
                width: 70,
                height: 52,
                borderRadius: 15,
                background: "#f2f2f2",
                fontWeight: 500,
                color: "#9295d3",
                fontSize: 18,
                border: "none",
                cursor: "pointer",
              }}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
