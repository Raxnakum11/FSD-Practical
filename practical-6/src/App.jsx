import React, { useState } from "react";
import "./App.css";

const initialTasks = [
  { id: 1, text: "Task 1" },
  { id: 2, text: "Task 2" },
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      setTasks([...tasks, { id: Date.now(), text: input.trim() }]);
      setInput("");
    }
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="todo-app">
      <h1 className="todo-title">Get Things Done !</h1>
      <div className="todo-input-row">
        <input
          className="todo-input"
          type="text"
          placeholder="What is the task today?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button className="todo-add-btn" onClick={handleAdd}>
          Add Task
        </button>
      </div>
      <div className="todo-list">
        {tasks.map((task) => (
          <div className="todo-task" key={task.id}>
            <span>{task.text}</span>
            <span className="todo-actions">
              <button className="icon-btn" title="Edit" disabled>
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2l4 4-10 10H2v-4L12 2z" />
                </svg>
              </button>
              <button
                className="icon-btn"
                title="Delete"
                onClick={() => handleDelete(task.id)}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="9" r="8" />
                  <line x1="6" y1="9" x2="12" y2="9" />
                </svg>
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
