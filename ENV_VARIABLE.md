# 🌱 Environment Variables and `dotenv`

Environment variables are values provided to an application from the environment in which it runs.

Examples:

```text
APP_ENV=development
API_BASE_URL=http://localhost:4000/api
PORT=3000
```

In Node.js, environment variables are normally accessed through:

```js
process.env.APP_ENV
```

For example:

```js
console.log(process.env.APP_ENV);
```

---

## `.env` File

For local development, we commonly keep environment variables in a `.env` file:

```env
APP_ENV=development
API_BASE_URL=http://localhost:4000/api
PORT=3000
```

However, Node.js does **not automatically read the `.env` file**.

This is an important distinction:

```text
.env file
   ↓
NOT automatically loaded
   ↓
process.env
```

`process.env` contains environment variables that were provided to the Node.js process by the operating system, shell, container, hosting platform, etc.

For example:

```bash
APP_ENV=production node app.js
```

allows Node.js to access:

```js
process.env.APP_ENV
```

without needing a `.env` file.

---

# 📦 What does `dotenv` do?

`dotenv` reads variables from a `.env` file and loads them into `process.env`.

Install it:

```bash
npm install dotenv
```

Then:

```js
require("dotenv").config();
```

Now:

```env
APP_ENV=development
```

can be accessed through:

```js
process.env.APP_ENV
```

The flow becomes:

```text
.env
 │
 │ dotenv
 ▼
process.env
 │
 ▼
Node.js application
```

---

# 🤔 Why can't we simply use `process.env`?

We **can** use `process.env` directly in Node.js.

The important point is that:

> `process.env` is provided by Node.js; `.env` is just a file.

Node.js already understands:

```js
process.env.PORT
```

but it does not automatically know that it should read:

```text
.env
```

The `dotenv` package provides that functionality.

Therefore:

```text
process.env
     ↓
Node.js built-in environment variables

dotenv
     ↓
Reads .env
     ↓
Adds values to process.env
```

---

# 🌐 Frontend Applications and Webpack

In a frontend application, the situation is different.

The browser does not have Node.js's:

```js
process.env
```

environment.

Therefore, if React code contains:

```js
process.env.API_BASE_URL
```

Webpack needs to replace that value during the build.

We can use Webpack's `DefinePlugin`:

```text
.env
 │
 ▼
dotenv
 │
 ▼
webpack.config.js
 │
 ▼
DefinePlugin
 │
 ▼
Webpack build
 │
 ▼
JavaScript bundle
 │
 ▼
Browser
```

For example:

```env
API_BASE_URL=https://api.example.com
```

Webpack can use:

```js
new webpack.DefinePlugin({
  "process.env.API_BASE_URL": JSON.stringify(
    env.API_BASE_URL
  )
});
```

The resulting frontend bundle effectively contains:

```js
process.env.API_BASE_URL
```

as:

```js
"https://api.example.com"
```

---

# ⚠️ Important: Never Put Secrets in Frontend Environment Variables

Anything passed through Webpack's `DefinePlugin` becomes part of the frontend bundle.

Therefore, do **not** put secrets such as:

```env
DATABASE_PASSWORD=secret
AWS_SECRET_ACCESS_KEY=secret
CLIENT_SECRET=secret
```

into variables exposed to the frontend.

Users can inspect the JavaScript bundle in their browser.

Frontend environment variables should generally contain public configuration such as:

```env
APP_ENV=production
API_BASE_URL=https://api.example.com
FEATURE_NEW_DASHBOARD=true
APP_NAME=My Application
```

---

# 🧠 Quick Mental Model

### Node.js

```text
Operating System / Shell
          │
          ▼
      process.env
          ▲
          │
       dotenv
          ▲
          │
        .env
```

### Webpack + React

```text
        .env
          │
          ▼
       dotenv
          │
          ▼
 webpack.config.js
          │
          ▼
    DefinePlugin
          │
          ▼
     Webpack Build
          │
          ▼
     bundle.js
          │
          ▼
       Browser
```

### Key takeaway

`dotenv` **loads `.env` values into Node.js's `process.env`**.

`DefinePlugin` **takes selected values from the Webpack build environment and replaces them in the frontend bundle at build time**.

These are two different responsibilities.
