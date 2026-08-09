# Webpack React Refresher

A small React application built from scratch using **Webpack, Babel, Sass, and Webpack Dev Server**.

The purpose of this project is not to build a complex application. It is a hands-on refresher for understanding how Webpack works, how loaders and plugins fit together, and how tools such as Babel and Sass integrate with Webpack.

---

## 🎯 Purpose

This project is designed to refresh the following concepts:

- Webpack
- Webpack configuration
- Entry and output
- Dependency graph
- Loaders
- Plugins
- Babel
- `babel-loader`
- Sass / SCSS
- `sass-loader`
- `css-loader`
- `style-loader`
- `html-webpack-plugin`
- Webpack Dev Server
- Hot Module Replacement
- Development vs production builds

The goal is to understand **what each tool does and why it is needed**, rather than simply memorizing configuration.

---

# 🏗️ Project Architecture

At a high level, the application works like this:

```text
                         Source Code
                             │
                             ▼
                         Webpack
                             │
                  ┌──────────┴──────────┐
                  │                     │
              JavaScript              SCSS
                  │                     │
            babel-loader          sass-loader
                  │                     │
                Babel                   Sass
                  │                     │
          Transformed JS                CSS
                                        │
                                  css-loader
                                        │
                                  style-loader
                                        │
                  └──────────┬──────────┘
                             │
                             ▼
                       Webpack Bundle
                             │
                             ▼
                           dist/
```

---

# 📁 Project Structure

```text
webpack-react-refresher/
│
├── src/
│   ├── components/
│   │   └── Task.jsx
│   │
│   ├── styles/
│   │   ├── _variables.scss
│   │   └── main.scss
│   │
│   ├── App.jsx
│   └── index.jsx
│
├── public/
│   └── index.html
│
├── .babelrc
├── webpack.config.js
├── package.json
├── package-lock.json
└── README.md
```

---

# ⚙️ Technologies

| Technology | Purpose |
|---|---|
| React | UI library |
| React DOM | Renders React into the browser |
| Webpack | Module bundler |
| Webpack CLI | Run Webpack from the command line |
| Babel | Transforms modern JavaScript and JSX |
| `babel-loader` | Connects Webpack with Babel |
| Sass | Compiles SCSS into CSS |
| `sass-loader` | Connects Webpack with Sass |
| `css-loader` | Allows Webpack to process CSS |
| `style-loader` | Injects CSS into the page |
| `html-webpack-plugin` | Generates the HTML file |
| Webpack Dev Server | Development server and HMR |

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone <repository-url>
cd webpack-react-refresher
```

## 2. Install dependencies

```bash
npm install
```

## 3. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

The development server automatically rebuilds the application when source files change.

---

# 📦 Available Commands

## Development

```bash
npm run dev
```

Runs:

```text
webpack serve --mode development
```

This starts Webpack Dev Server and enables development features such as hot reloading.

---

## Production Build

```bash
npm run build
```

Runs:

```text
webpack --mode production
```

Webpack creates a production build inside the `dist` directory.

Example:

```text
dist/
├── bundle.js
└── index.html
```

---

# 🔨 Webpack Configuration

The main Webpack configuration is:

```text
webpack.config.js
```

The important sections are:

```js
module.exports = {
  mode: "development",

  entry: "./src/index.jsx",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true
  },

  module: {
    rules: []
  },

  resolve: {
    extensions: [".js", ".jsx"]
  },

  plugins: [],

  devServer: {}
};
```

---

# 1️⃣ Entry

```js
entry: "./src/index.jsx"
```

The entry tells Webpack:

> Start building the application from this file.

Webpack starts at:

```text
src/index.jsx
```

and follows all of its imports.

For example:

```text
index.jsx
   │
   ├── App.jsx
   │     └── Task.jsx
   │
   └── main.scss
         └── _variables.scss
```

Webpack uses these imports to build a **dependency graph**.

---

# 2️⃣ Output

```js
output: {
  path: path.resolve(__dirname, "dist"),
  filename: "bundle.js",
  clean: true
}
```

This tells Webpack where to put the generated files.

The result is:

```text
dist/
└── bundle.js
```

### `clean: true`

Webpack cleans the output directory before generating a new build.

---

# 3️⃣ Loaders

Loaders tell Webpack how to process different types of files.

For example:

```js
module: {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader"
      }
    }
  ]
}
```

This means:

> When Webpack encounters a `.js` or `.jsx` file, process it using `babel-loader`.

---

# 🧠 Babel + Webpack

React code often contains JSX:

```jsx
function App() {
  return <h1>Hello World</h1>;
}
```

The browser does not directly understand JSX.

Babel transforms it into JavaScript that the browser can execute.

The flow is:

```text
.jsx
 │
 ▼
Webpack
 │
 ▼
babel-loader
 │
 ▼
Babel
 │
 ▼
JavaScript
```

---

# 🛠️ Babel Configuration

The project uses:

```text
.babelrc
```

```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ]
}
```

## `@babel/preset-env`

Handles modern JavaScript syntax.

For example:

```js
const add = (a, b) => a + b;
```

Babel can transform this depending on the configured browser targets.

## `@babel/preset-react`

Allows Babel to understand JSX:

```jsx
<h1>Hello</h1>
```

---

# 🎨 Sass / SCSS

The project uses SCSS:

```text
src/styles/main.scss
```

For example:

```scss
$primary-color: #2563eb;

.header {
  h1 {
    color: $primary-color;
  }
}
```

Sass provides features such as:

- Variables
- Nesting
- Partials
- Mixins
- Functions
- Other CSS preprocessing features

---

# 🔄 Sass Loader Pipeline

The SCSS processing pipeline is:

```text
SCSS
 │
 ▼
sass-loader
 │
 ▼
Sass
 │
 ▼
CSS
 │
 ▼
css-loader
 │
 ▼
style-loader
 │
 ▼
Browser
```

The Webpack configuration is:

```js
{
  test: /\.s[ac]ss$/i,
  use: [
    "style-loader",
    "css-loader",
    "sass-loader"
  ]
}
```

## Why is the order reversed?

Webpack loaders are applied from **right to left**.

Therefore:

```js
use: [
  "style-loader",
  "css-loader",
  "sass-loader"
]
```

effectively means:

```text
sass-loader
    ↓
css-loader
    ↓
style-loader
```

---

# 🧩 What Does Each Sass Loader Do?

## `sass-loader`

Connects Webpack to Sass.

```text
SCSS → CSS
```

---

## `css-loader`

Allows Webpack to understand CSS imports.

For example:

```js
import "./styles/main.scss";
```

Webpack needs `css-loader` to process the resulting CSS.

---

## `style-loader`

Takes the processed CSS and injects it into the HTML page using a `<style>` element.

Conceptually:

```html
<style>
  .header {
    ...
  }
</style>
```

---

# 🔌 Plugins

Loaders process individual files.

Plugins can perform broader tasks during the Webpack build process.

This project uses:

```text
html-webpack-plugin
```

Configuration:

```js
plugins: [
  new HtmlWebpackPlugin({
    template: "./public/index.html"
  })
]
```

It takes:

```text
public/index.html
```

and generates the final HTML inside:

```text
dist/index.html
```

It also automatically adds the generated JavaScript bundle.

---

# 🌐 Webpack Dev Server

The project uses:

```text
webpack-dev-server
```

Start it with:

```bash
npm run dev
```

It provides:

- Local development server
- Automatic rebuilding
- Hot Module Replacement
- Faster development workflow

Example:

```text
http://localhost:3000
```

---

# 🔥 Hot Module Replacement

When the development server is running:

```bash
npm run dev
```

modify something such as:

```jsx
<h1>My Task Dashboard</h1>
```

to:

```jsx
<h1>My Webpack Dashboard</h1>
```

Webpack detects the change and rebuilds the affected modules.

This provides a much faster development experience than manually rebuilding the application every time.

---

# 📦 Webpack Dependency Graph

One of the most important Webpack concepts is the **dependency graph**.

Starting from:

```text
src/index.jsx
```

Webpack follows:

```js
import App from "./App";
import "./styles/main.scss";
```

Then:

```text
index.jsx
   │
   ├── App.jsx
   │     │
   │     └── Task.jsx
   │
   └── main.scss
         │
         └── _variables.scss
```

Webpack understands these relationships and bundles the required modules.

---

# 🧠 Webpack Mental Model

Think of Webpack as a build pipeline:

```text
                    Webpack
                       │
                       ▼
                  Entry Point
                       │
                       ▼
              Dependency Graph
                       │
          ┌────────────┴────────────┐
          │                         │
       JavaScript                 SCSS
          │                         │
    babel-loader              sass-loader
          │                         │
        Babel                       Sass
          │                         │
          │                         CSS
          │                         │
          │                    css-loader
          │                         │
          │                    style-loader
          │                         │
          └────────────┬────────────┘
                       │
                       ▼
                    Plugins
                       │
                       ▼
                    Output
                       │
                       ▼
                     dist/
```

---

# 🔍 Loader vs Plugin

This is an important interview concept.

### Loader

A loader generally transforms a particular type of module/file.

Examples:

```text
babel-loader
sass-loader
css-loader
```

Think:

> "How should Webpack process this file?"

---

### Plugin

A plugin can perform broader tasks during the build process.

Example:

```text
html-webpack-plugin
```

Think:

> "What additional work should Webpack perform during the build?"

---

# 🆚 Babel vs Webpack

These tools are often confused.

### Babel

Babel transforms JavaScript.

```text
Modern JS / JSX
       ↓
     Babel
       ↓
Transformed JS
```

### Webpack

Webpack bundles modules and their dependencies.

```text
JS
CSS
Images
Dependencies
   ↓
Webpack
   ↓
Bundle
```

They solve different problems.

Webpack uses `babel-loader` to connect the two.

```text
Webpack
   │
   ▼
babel-loader
   │
   ▼
Babel
```

---

# 🆚 Sass vs Webpack

Sass is a CSS preprocessor.

```text
SCSS
 ↓
Sass
 ↓
CSS
```

Webpack is a module bundler.

```text
Modules
 ↓
Webpack
 ↓
Bundle
```

Webpack uses `sass-loader` to connect Sass to the Webpack build process.

---

# 📊 Development vs Production

## Development

```bash
npm run dev
```

Purpose:

- Fast development
- Debugging
- Development server
- Hot reload
- Easier debugging

---

## Production

```bash
npm run build
```

Purpose:

- Optimized bundle
- Smaller output
- Deployment
- Production performance

Output:

```text
dist/
├── index.html
└── bundle.js
```

---

# 🧪 Exercises

After the project is working, use these exercises to reinforce the concepts.

## Exercise 1 — Add another task

Modify `App.jsx`:

```jsx
<Task
  title="Understand Webpack loaders"
  completed={false}
/>
```

---

## Exercise 2 — Add a Sass variable

Add:

```scss
$card-radius: 12px;
```

Then use it:

```scss
.task {
  border-radius: $card-radius;
}
```

---

## Exercise 3 — Add a hover effect

Add:

```scss
.task {
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
  }
}
```

Notice the Sass nesting.

---

## Exercise 4 — Break Babel

Modify JSX intentionally and observe the error.

Try to understand:

- Where the error occurs
- Whether it is a Webpack error
- Whether it is a Babel error
- Which loader is involved

---

## Exercise 5 — Remove `sass-loader`

Temporarily change:

```js
use: [
  "style-loader",
  "css-loader"
]
```

Then run:

```bash
npm run build
```

Observe the error.

This helps demonstrate why `sass-loader` is necessary.

---

# 📚 Important Concepts to Remember

### Webpack

> Module bundler that builds the application's dependency graph and produces deployable assets.

### Entry

> Where Webpack starts building the dependency graph.

### Output

> Where Webpack writes the generated files.

### Loader

> Processes specific types of modules/files.

### Plugin

> Extends Webpack's build process with additional functionality.

### Babel

> Transforms modern JavaScript and JSX.

### `babel-loader`

> Connects Babel to Webpack.

### Sass

> Preprocesses SCSS into CSS.

### `sass-loader`

> Connects Sass to Webpack.

### `css-loader`

> Allows Webpack to process CSS.

### `style-loader`

> Injects CSS into the browser.

### `html-webpack-plugin`

> Generates HTML and automatically includes Webpack's generated assets.

### Webpack Dev Server

> Runs the application locally and provides development features such as automatic rebuilding and HMR.

---

# 🎯 Recommended Learning Path

After understanding this project, build on it in this order:

```text
1. Basic Webpack
       ↓
2. Babel
       ↓
3. Sass
       ↓
4. Loaders
       ↓
5. Plugins
       ↓
6. Webpack Dev Server
       ↓
7. Asset handling
       ↓
8. Source maps
       ↓
9. Environment configuration
       ↓
10. Development vs production configs
       ↓
11. CSS extraction
       ↓
12. Code splitting
       ↓
13. Lazy loading
       ↓
14. Production optimization
```

---

# 🔮 Possible Next Improvements

This project can later be extended with:

- Image loading
- Font loading
- CSS Modules
- `MiniCssExtractPlugin`
- Source maps
- `webpack-merge`
- Separate development and production configs
- Environment variables
- Asset modules
- Code splitting
- Dynamic imports
- Lazy-loaded React components
- Bundle analysis
- Production optimization
- Caching
- Content hashes

---

# 💡 Key Takeaway

The most important thing to understand from this project is that Webpack itself doesn't know how to handle every type of file.

Instead, we configure **loaders and plugins** to extend its capabilities.

For example:

```text
React JSX
   ↓
babel-loader
   ↓
Babel
   ↓
JavaScript
```

and:

```text
SCSS
   ↓
sass-loader
   ↓
Sass
   ↓
CSS
   ↓
css-loader
   ↓
style-loader
   ↓
Browser
```

Webpack brings these pieces together and produces the final application.

---

## 📝 Quick Cheat Sheet

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Create production build
npm run build
```

### Important files

```text
webpack.config.js  → Webpack configuration
.babelrc           → Babel configuration
src/index.jsx      → Webpack entry point
src/App.jsx        → React application
main.scss          → Sass styles
public/index.html  → HTML template
dist/              → Production output
```

### Important flow

```text
index.jsx
   ↓
Webpack
   ↓
Dependency Graph
   ↓
Loaders
   ├── babel-loader
   └── sass-loader
   ↓
Plugins
   ↓
dist/
```

---

## 📌 Why This Project Exists

This project is intentionally small.

The purpose is to have a **working reference project that can be revisited whenever Webpack concepts need a refresher**.

Instead of remembering Webpack only as:

> "Webpack is a bundler."

the goal is to understand:

> **How Webpack takes source files, follows their dependencies, processes them through loaders, applies plugins, and produces the final application bundle.**