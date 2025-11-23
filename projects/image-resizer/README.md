# Node.js Image Resizer (Worker Threads)

A high-performance image resizing tool built with Node.js, Worker Threads, and Sharp.  
This project demonstrates how to offload CPU-heavy operations (image processing) to worker threads, keeping the Node.js event loop fast and responsive.

This README also includes a Master Technical Summary so you can refresh the entire concept anytime.

## Features

- Resize images to any width & height
- Uses Worker Threads for parallel CPU execution
- Sharp for fast image manipulation
- Fully modern ESM (.mjs) module structure
- Clean architecture (main thread + worker thread)
- Demonstrates correct absolute path handling

## Project Structure

```
Nodejs_Projects/
│
└── projects/
    └── image-resizer/
        │
        ├── main.mjs          # Main thread (entry point)
        ├── worker.mjs        # Worker thread for image processing
        ├── output/           # Resized images saved here
        ├── package.json
        └── README.md
```

## Installation

1. Clone the repository  
   ```bash
   git clone https://github.com/YOUR_USERNAME/image-resizer.git
   cd image-resizer
   ```

2. Install dependencies  
   ```bash
   npm install
   ```

3. Create output folder  
   ```bash
   mkdir output
   ```

## Usage

Run the project:  
```bash
node main.mjs
```

This will:

- Load your input image
- Resize it (default: 300×300)
- Save the output to: `./output/resized.jpeg`

You can change the input path, output path, and dimensions inside `main.mjs`.

## How the Project Works

### 1. Main Thread (`main.mjs`)

- Creates a worker thread using `new Worker()`
- Passes `inputPath`, `outputPath`, `width`, `height`
- Listens for:
  - `message` → success
  - `error` → worker crash
  - `exit` → worker finished

> Main thread stays non-blocking and free to perform other tasks.

### 2. Worker Thread (`worker.mjs`)

- Receives data through `workerData`
- Uses Sharp to:
  - Load the image
  - Resize it
  - Save to output folder
- Sends result back using `parentPort.postMessage()`

> 💡 Worker handles all CPU-heavy operations separately from main thread.

## Technologies Used

| Technology      | Usage              |
| --------------- | ------------------ |
| Node.js         | Runtime            |
| Worker Threads  | Parallelism        |
| Sharp           | Image resizing     |
| ES Modules      | Modern syntax      |
| node:path + node:url | Absolute path handling |

## MASTER SUMMARY 

### Node.js Image Resizer — Complete Technical Summary

#### Architecture

- Main thread creates worker threads.
- Worker thread handles CPU-heavy Sharp image resizing.
- Communication occurs through message passing.
- Project uses modern ES Modules (.mjs).

#### 1. Main Thread Responsibilities

- Creates worker using:  
  ```js
  new Worker("./worker.mjs", { workerData });
  ```
- Passes data:
  - `inputPath`
  - `outputPath`
  - `width`
  - `height`
- Listens for:
  - `message` (success)
  - `error`
  - `exit`

> 💡 Main thread stays free (non-blocking).

#### 2. Worker Thread Responsibilities

- Receives data using:  
  ```js
  import { workerData, parentPort } from "node:worker_threads";
  ```
- Uses Sharp to:
  - Read
  - Resize
  - Save
- Sends message back to main thread.

> 💡 Worker performs true parallel CPU work.

#### 3. Why Worker Threads?

- Image processing is CPU-heavy.  
- If done in the main thread:
  - Event loop blocks
  - Server becomes slow
  - Requests lag
- Workers solve this by parallelizing workload.

#### 4. ES Modules (mjs) Notes

Switching from `.js` to `.mjs` requires:

- No `require`, `module.exports`, `__dirname`, `__filename`
- Instead use:
  ```js
  import path from "node:path";
  import { fileURLToPath } from "node:url";

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  ```

Why?

- Workers need absolute paths
- ESM does not support `__dirname` by default 

What does this mean?  
- Old way (CommonJS or legacy ESM)  
  ```js
  import path from "path";
  ```
- New recommended way (ESM)  
  ```js
  import path from "node:path";
  ```

Why `"node:path"`?  

Because Node wants to clearly differentiate:

- Built-in Node modules → `"node:path"`, `"node:fs"`, `"node:url"`, `"node:crypto"`, etc.
- User-installed npm modules → `"express"`, `"sharp"`, `"lodash"`.
- Local files → `"./utils.mjs"`

This avoids conflicts in case someone creates a module named `path` in npm.

✔️ Both versions still work, but `node:path` is now the official recommended pattern.

#### 5. Path Handling

- Workers cannot rely on relative paths.
- Correct approach:  
  ```js
  path.join(__dirname, "output", "resized.jpeg");
  ```
- Ensures files always resolve correctly.

#### 6. Sharp Workflow

The typical pipeline:

- Extract (load input image)
- Transform (resize)
- Load (save to output file)

Built on libvips → extremely fast.

## Common Issues & Fixes

- unable to open for write  
  Output folder missing.  
  Fix:  
  ```bash
  mkdir output
  ```

- Unsupported image format  
Input file is corrupt or not a valid PNG/JPG/JPEG.

- Worker cannot locate file  
Use absolute paths via `fileURLToPath + __dirname`.

## License

Free for learning, modifying, or reusing.
