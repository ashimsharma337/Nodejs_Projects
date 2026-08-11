import React from "react";
import Task from "./components/Task";

function App() {

  const appName = process.env.APP_NAME;
  const appEnv  = process.env.APP_ENV;
  const apiUrl  = process.env.API_BASE_URL;
  const feature = process.env.FEATURE_NEW_DASHBOARD;
  const buildTime = process.env.BUILD_TIME;

  return (
    <div className="app">
      <header className="header">
        <h1>{appName}</h1>
        <p>
          Environment: {appEnv}
        </p>

        <p>Webpack + React + Babel + Sass</p>
      </header>

      <main className="task-list">
        <Task title="Learn Webpack" completed={true} />
        <Task title="Learn Babel" completed={true} />
        <Task title="Learn Sass Loader" completed={false} />
      </main>

      <section className="environment">
        <h2>Application Configuration</h2>

        <p>
          <strong>API URL:</strong>{" "}
          {apiUrl}
        </p>

        <p>
          <strong>New Dashboard:</strong>{" "}
          {feature}
        </p>

        <p>
        <strong>Build Time:</strong>{" "}
         {buildTime}
        </p>
      </section>
    </div>
  );
}

export default App;