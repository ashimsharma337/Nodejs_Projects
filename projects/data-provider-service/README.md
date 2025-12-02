# Data Provider Service

A Fastify-based Node.js API that serves large JSON datasets with clean pagination.  
This service acts as the data provider for your ETL pipeline project.

---

## Overview

The Data Provider Service is a simple and fast Node.js API designed to provide large datasets efficiently.  
It exposes a single endpoint `/data` that returns paginated JSON results, allowing downstream services to fetch data in manageable batches.

This project is the first project inside your Node.js Monorepo and is focused on helping you learn:

- Node.js (ESM / .mjs modules)
- Fastify framework
- Reading large JSON datasets
- Implementing API pagination
- Understanding how to build APIs that power ETL pipelines

---

## Project Structure

```
data-provider-service/
│
├── data/
│   └── data70k.json        # 70,000 fake dataset (served via API)
│
├── server.mjs              # Fastify API server
├── package.json
└── README.md
```

---

## Features

- High-performance Fastify server  
  Fastify provides extremely fast request handling and structured logging.

- Paginated data API  
  Avoid sending huge datasets at once.

- Supports large files (70k+ records)  
  Data is efficiently paginated and streamed.

- Industry-standard JSON data format  
  JSON is widely used in modern systems because it is:  
  - Human-readable  
  - Fast to parse  
  - Ideal for APIs  
  - Works seamlessly with Node.js

---

## Pagination Logic (How It Works)

**Request:**  
`GET /data?page=3`

**Internal logic:**

- `page = 3`
- `limit = 100` (default per page)
- `Start index = (page - 1) * 100`
- `End index = start + 100`

**Response:**

```json
{
  "page": 3,
  "totalRecords": 70000,
  "results": [ /* 100 items */ ]
}
```

---

## Key Concepts Learned (Technical Summary)

This project helps you strengthen core Node.js concepts:

1. **ES Modules (.mjs)**
   - Uses `import` instead of `require`
   - Requires `"type": "module"` in `package.json`
   - Uses `import path from "node:path"`

2. **Fastify Framework**
   - Super-fast, modern alternative to Express
   - Built-in structured logging
   - Easy to scale

3. **Serving large data**
   - Instead of returning 70k records at once, the server returns 100 at a time.
   - This prevents:
     - High memory usage
     - Slow frontend performance
     - Bottlenecks in downstream ETL services

4. **Pagination**
   - A common backend pattern used in:
     - E-commerce apps
     - Data processing systems
     - Microservices
     - ETL workflows

5. **Clean API Design**
   - Simple and predictable endpoints make ETL extraction easier.

---

## Getting Started

**Install dependencies**  
```bash
npm install
```

**Start server**  
```bash
node server.mjs
```

Server runs at:  
http://localhost:4000

---

## API Endpoint

**GET** `/data?page={number}`

| Query Param | Required | Description               |
|-------------|-----------|--------------------------|
| `page`      | No        | Page number (default: 1)  |
| `limit`     | No        | Items per page (default: 100) |

**Example:**  
`GET http://localhost:4000/data?page=5`

---

## Example Response

```json
{
  "page": 5,
  "totalRecords": 70000,
  "results": [
    { "...": "100 records returned here" }
  ]
}
```

---

## Why JSON Format?

JSON is currently the most widely used format in IT because:

- Works natively with JavaScript and Node.js
- Perfect for APIs
- Easy to parse and transform
- Lightweight and readable
- Universally supported across systems

CSV is more common for analytics, but JSON is the better choice for APIs.

---

## Future Enhancements

- Add filtering (`?name=John`)
- Add sorting (`?sort=age`)
- Add rate-limiting
- Add authentication
- Convert JSON to streaming for huge files

---

## Part of a Bigger ETL System

This service is the data source for your upcoming second project:

### ETL Consumer Service (Next project)
- Fetches data in batches
- Cleans, transforms
- Saves to PostgreSQL

This mirrors real-world microservice architecture.

---

## License

This is a practice/learning project — no formal license added.
