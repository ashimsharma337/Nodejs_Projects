# Nodejs_Projects  
**Nodejs_Projects Monorepo**

This repository is a collection of Node.js projects designed for learning, practicing, and revising Node.js concepts and related technologies.  
Each project is self-contained but follows a consistent ESM (.mjs) and modular structure, making it easy to explore, run, and modify.

## Purpose of This Monorepo

- Practice Node.js fundamentals and advanced concepts  
- Learn Worker Threads, APIs, file processing, databases, etc.  
- Keep multiple projects organized under a single repository  
- Avoid creating multiple `node_modules` folders for each small practice project  

💡 Each project is designed for hands-on learning and quick revision.

## Folder Structure

```
Nodejs_Projects/
│
├── projects/
│   ├── image-resizer/          # CPU-intensive image resizing with Worker Threads
│   ├── project-2/              # Example project 2 (add description)
│   ├── project-3/              # Example project 3 (add description)
│   └── ...                     # Other Node.js practice projects
│
├── node_modules/               # Shared dependencies across all projects
├── package.json                # Root package.json managing shared dependencies
└── README.md                   # Monorepo README (this file)
```

## How to Use This Monorepo

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/Nodejs_Projects.git
cd Nodejs_Projects
```

Install dependencies (shared for all projects):

```bash
npm install
```

Navigate to a project:

```bash
cd projects/image-resizer
```

Follow the individual project README for instructions on running it.

💡 Each project folder contains its own `README.md` with detailed instructions, architecture, and technical summary.

## Benefits

- **Organized practice environment:** All Node.js projects in one place  
- **Reusability:** Share `node_modules` across projects  
- **Revision-friendly:** Quickly revisit previously built projects  
- **Hands-on learning:** Each project targets a specific Node.js concept  
- **Scalable:** Add more practice projects over time  

## Projects Included (Examples)

| Project       | Description                                        |
| ------------- | ---------------------------------------------------|
| image-resizer | Resize images using Worker Threads and Sharp       |
| project-2     | coming soon...                                     |
| project-3     | coming soon...                                     |

You can expand this list as you create more practice projects.

## License

This monorepo is for personal learning and practice purposes.
