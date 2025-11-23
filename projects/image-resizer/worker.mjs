import { parentPort, workerData } from "node:worker_threads";
import sharp from "sharp";

async function processImage() {
  const { inputPath, outputPath, width, height } = workerData;

  await sharp(inputPath)
    .resize(width, height)
    .toFile(outputPath);

  parentPort.postMessage("Image resized successfully!");
}

processImage();
