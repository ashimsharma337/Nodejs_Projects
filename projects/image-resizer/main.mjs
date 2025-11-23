import fs from "node:fs";
import { Worker } from "node:worker_threads";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, "output");


// Create folder if missing
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function resizeImage(inputPath, outputPath, width, height) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, "worker.mjs"), {
      workerData: { inputPath, outputPath, width, height }
    });

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

resizeImage("./images/sample.jpeg", "./output/resized.jpeg", 300, 300)
  .then((msg) => console.log(msg))
  .catch((err) => console.error(err));
