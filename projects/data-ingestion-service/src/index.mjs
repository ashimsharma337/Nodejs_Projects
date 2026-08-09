// The runner and scheduler (node-cron)

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
console.log("DEBUG: Loaded password:", process.env.PG_PASSWORD);
console.log("DEBUG: Current working directory:", process.cwd());


import cron from "node-cron";
import { fetchAllBatches } from "./extractor.mjs";
import { transformBatch } from "./transformer.mjs";
import { insertBatch, closePool } from "./loader.mjs";

const CRON_SCHEDULE = process.env.CRON_SCHEDULE || "0 2 * * *"; // daily at 02:00
const PAGE_LIMIT = Number(process.env.PAGE_LIMIT || 500);

// ETL pipeline for one run
export async function runETL() {
  console.log("==== ETL run started at", new Date().toISOString(), "====");
  let totalFetched = 0;
  let totalCleaned = 0;
  let totalInserted = 0;

  try {
    for await (const batchInfo of fetchAllBatches({ startPage: 1, limit: PAGE_LIMIT })) {
      const { page, data } = batchInfo;
      console.log(`Processing batch page ${page} (received ${data.length} raw records)`);

      totalFetched += data.length;

      // Transform
      const cleaned = transformBatch(data);
      console.log(`🧹 Cleaned => ${cleaned.length} valid records`);
      totalCleaned += cleaned.length;

      // Load
      if (cleaned.length > 0) {
        const inserted = await insertBatch(cleaned);
        totalInserted += inserted;
      }
    }

    console.log(`ETL Completed. Fetched=${totalFetched}, Cleaned=${totalCleaned}, Inserted=${totalInserted}`);
  } catch (err) {
    console.error("ETL run failed:", err);
    throw err;
  } finally {
    // Keep DB pool open for subsequent scheduled runs; do not close here when running as daemon.
    // If running in ETL_RUN_ONCE mode, we'll close in main.
  }
}

// If ETL_RUN_ONCE env var is set, run once and exit (use for testing)
if (process.env.ETL_RUN_ONCE) {
  (async () => {
    try {
      await runETL();
    } catch (err) {
      console.error("Run-once error:", err);
    } finally {
      await closePool();
      console.log("DB pool closed. Exiting.");
      process.exit(0);
    }
  })();
} else {
  // Schedule daily runs
  console.log(`Scheduler started. CRON schedule: "${CRON_SCHEDULE}"`);
  // Run immediately once at startup (optional) - comment out if you don't want this
  (async () => {
    console.log("Running initial ETL at startup...");
    try {
      await runETL();
    } catch (err) {
      console.error("Initial ETL failed:", err);
    }
  })();

  cron.schedule(CRON_SCHEDULE, async () => {
    console.log("Cron triggered ETL at", new Date().toISOString());
    try {
      await runETL();
    } catch (err) {
      console.error("Scheduled ETL failed:", err);
    }
  });
}

/**
* Notes:
Default cron 0 2 * * * runs daily at 02:00.
The script also runs once at startup (helpful for immediate ingestion). 
We can remove that if undesired.
For production, run the service permanently with a process manager (PM2/systemd) so cron scheduling persists.
*/
