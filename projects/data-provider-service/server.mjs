import Fastify from "fastify";
import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({ logger: true });  // Fastify uses Pino under the hood, which logs every incoming request and completed response in a structured JSON format.

// Load dataset once at server startup
console.log("Loading dataset...");

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data70k.json"), "utf-8")
);

console.log("Dataset loaded. Total records:", data.length);

fastify.get("/data", async (request, reply) => {
  const page = Number(request.query.page) || 1;
  const limit = Number(request.query.limit) || 100;

  // Helpful debug logs
  console.log("\n==========================");
  console.log("Incoming Request");
  console.log("Page:", page);
  console.log("Limit:", limit);

  const start = (page - 1) * limit;
  const end = page * limit;

  console.log("Slicing Data From:", start, "To:", end);

  const sliced = data.slice(start, end);

  console.log("Sending", sliced.length, "records");
  console.log("==========================\n");

  return {
    page,
    limit,
    total: data.length,
    hasMore: end < data.length,
    data: sliced
  };
});

fastify.listen({ port: 4000 }, err => {
  if (err) throw err;
  console.log("Data Provider Service running on port 4000");
});
