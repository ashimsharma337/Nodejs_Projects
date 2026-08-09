import React from "react";

function Task({ title, completed }) {
  return (
    <div className={`task ${completed ? "completed" : ""}`}>
      <span className="task-status">
        {completed ? "✓" : "○"}
      </span>

      <span>{title}</span>
    </div>
  );
}

export default Task;