# NPM Workspaces — Installing Packages

This repository is an **npm monorepo**. The root `package.json` defines all projects under the `projects/` directory as workspaces.

## Monorepo Structure

```text
nodejs_projects/
│
├── package.json              ← Root package.json
├── package-lock.json         ← Root lockfile
├── node_modules/             ← Shared dependencies
│
└── projects/
    ├── image-resizer/
    ├── data-provider-service/
    ├── data-ingestion-service/
    └── webpack-react-refresher/
```

The root `package.json` contains:

```json
{
  "name": "nodejs_projects",
  "private": true,
  "workspaces": [
    "projects/*"
  ]
}
```

The:

```json
"projects/*"
```

configuration tells npm:

> Every directory directly under `projects/` is an npm workspace.

For example:

```text
projects/image-resizer/
projects/data-provider-service/
projects/data-ingestion-service/
projects/webpack-react-refresher/
```

are all separate workspaces.

---

# 📦 Each Project Has Its Own `package.json`

Each workspace should have its own `package.json`.

For example:

```text
projects/
└── webpack-react-refresher/
    └── package.json
```

Example:

```json
{
  "name": "webpack-react-refresher",
  "version": "1.0.0"
}
```

The workspace defines the dependencies that belong specifically to that project.

---

# ⭐ Recommended Way to Install Packages

Run package installation commands from the **root of the monorepo**.

```bash
cd nodejs_projects
```

Then specify which workspace should receive the package.

For example:

```bash
npm install react react-dom --workspace=webpack-react-refresher
```

Short form:

```bash
npm install react react-dom -w webpack-react-refresher
```

This means:

```text
Install react and react-dom
             ↓
webpack-react-refresher workspace
```

---

# 🛠️ Installing Development Dependencies

For packages needed only during development/building:

```bash
npm install --save-dev webpack webpack-cli -w webpack-react-refresher
```

For example, the Webpack refresher project needs:

```bash
npm install --save-dev \
  webpack \
  webpack-cli \
  webpack-dev-server \
  @babel/core \
  @babel/preset-env \
  @babel/preset-react \
  babel-loader \
  sass \
  sass-loader \
  css-loader \
  style-loader \
  html-webpack-plugin \
  -w webpack-react-refresher
```

---

# 📌 Why Use `-w` / `--workspace`?

Without specifying a workspace, npm may install the package into the **root project**.

For example:

```bash
npm install react
```

can install React as a dependency of the root workspace.

Instead, use:

```bash
npm install react -w webpack-react-refresher
```

to explicitly say:

> Install React for the `webpack-react-refresher` workspace.

---

# 🔍 Installing from Inside a Workspace

You can also navigate into the workspace:

```bash
cd projects/webpack-react-refresher
```

and run:

```bash
npm install react react-dom
```

npm understands that the directory is part of the workspace.

However, for consistency in this repository, the preferred approach is:

```bash
cd nodejs_projects

npm install react react-dom -w webpack-react-refresher
```

This makes it obvious which workspace is being modified.

---

# 🏠 Root Dependencies vs Workspace Dependencies

There are two different concepts.

## Root Dependency

A package installed for the monorepo itself:

```bash
npm install some-package
```

This modifies the root `package.json`.

```text
nodejs_projects/
└── package.json
```

Use this when the dependency is genuinely needed by the **monorepo/root tooling**.

---

## Workspace Dependency

A package installed for one specific project:

```bash
npm install some-package -w webpack-react-refresher
```

This modifies:

```text
projects/webpack-react-refresher/package.json
```

Use this when the dependency belongs to that particular application.

---

# 📂 Where Are `node_modules`?

npm workspaces can use a **hoisted dependency layout**.

You may see:

```text
nodejs_projects/
├── node_modules/
│   ├── react/
│   ├── webpack/
│   ├── fastify/
│   └── ...
│
└── projects/
    ├── image-resizer/
    └── webpack-react-refresher/
```

Even though React may physically exist under the root `node_modules`, npm still associates it with the appropriate workspace through the workspace's `package.json` and the root lockfile.

The important distinction is:

```text
Physical location
        ≠
Which project owns the dependency
```

The workspace's `package.json` tells npm which project declares the dependency.

---

# 🔗 Workspace Packages

Workspaces can also depend on other workspaces in the same monorepo.

For example:

```text
projects/
├── shared-utils/
└── my-service/
```

If `my-service` needs `shared-utils`, npm can link the workspace packages together.

This is one of the major benefits of a monorepo.

---

# 📦 Installing Dependencies for All Workspaces

If you clone this repository for the first time, you generally only need:

```bash
npm install
```

from the root:

```text
nodejs_projects/
```

npm reads:

```text
package.json
       +
package-lock.json
       +
workspaces
```

and installs the dependencies for the repository's workspaces.

---

# 🔄 Updating a Package

To update a package for a specific workspace:

```bash
npm update react -w webpack-react-refresher
```

Or install a specific version:

```bash
npm install react@latest -w webpack-react-refresher
```

---

# 🗑️ Removing a Package

Remove a package from a specific workspace:

```bash
npm uninstall react -w webpack-react-refresher
```

For example:

```bash
npm uninstall webpack -w webpack-react-refresher
```

---

# 🔎 Useful Workspace Commands

List configured workspaces:

```bash
npm query .workspace
```

Run a script in a specific workspace:

```bash
npm run <script> --workspace=webpack-react-refresher
```

For example:

```bash
npm run dev --workspace=webpack-react-refresher
```

You can also use:

```bash
npm run build -w webpack-react-refresher
```

---

# 🧠 Quick Mental Model

Think of the repository like this:

```text
                 nodejs_projects
                       │
                 Root package.json
                       │
                "workspaces"
                       │
              ┌────────┼────────┐
              │        │        │
              ▼        ▼        ▼
          project A project B project C
              │        │        │
              │        │        │
          own deps  own deps  own deps
```

When installing a package, tell npm **where the package belongs**:

```bash
npm install <package> -w <workspace>
```

For example:

```bash
npm install react -w webpack-react-refresher
```

means:

```text
nodejs_projects
      │
      └── webpack-react-refresher
                  │
                  └── react
```

---

# ✅ Recommended Rules for This Repository

### 1. Keep the root as the monorepo manager

```text
nodejs_projects/package.json
```

contains the workspace configuration.

### 2. Give every project its own `package.json`

```text
projects/<project>/package.json
```

### 3. Install project-specific dependencies into the appropriate workspace

```bash
npm install <package> -w <workspace>
```

### 4. Use `--save-dev` for build/development tools

```bash
npm install --save-dev webpack -w webpack-react-refresher
```

### 5. Use normal `npm install` for runtime dependencies

```bash
npm install react -w webpack-react-refresher
```

### 6. Run `npm install` from the root after cloning

```bash
cd nodejs_projects
npm install
```

### 7. Commit the root `package-lock.json`

The lockfile keeps dependency versions consistent across the monorepo.

---

# 🚀 Example: Adding a New Project

Suppose we create:

```text
projects/my-react-app/
```

First:

```bash
cd projects/my-react-app
npm init -y
```

Then from the root:

```bash
cd ../..
```

Install React:

```bash
npm install react react-dom -w my-react-app
```

Install development tools:

```bash
npm install --save-dev webpack webpack-cli -w my-react-app
```

Now npm knows:

```text
my-react-app
   │
   ├── react
   ├── react-dom
   ├── webpack
   └── webpack-cli
```

while the other projects maintain their own dependency declarations.

---

# 💡 Key Takeaway

The most important command to remember is:

```bash
npm install <package> -w <workspace-name>
```

For example:

```bash
npm install react react-dom -w webpack-react-refresher
```

The `-w` tells npm:

> **Install this package in this specific workspace, not the root project.**

This keeps each project in the monorepo logically separated while allowing npm to manage them together.