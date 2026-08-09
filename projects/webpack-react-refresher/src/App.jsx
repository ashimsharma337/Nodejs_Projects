import React from "react";
import Task from "./components/Task";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>My Task Dashboard</h1>
        <p>Webpack + React + Babel + Sass</p>
      </header>

      <main className="task-list">
        <Task title="Learn Webpack" completed={true} />
        <Task title="Learn Babel" completed={true} />
        <Task title="Learn Sass Loader" completed={false} />
      </main>
    </div>
  );
}

export default App;