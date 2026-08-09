import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const PROVIDER_URL = process.env.PROVIDER_URL || "http://localhost:4000/data";
const PAGE_LIMIT = Number(process.env.PAGE_LIMIT || 500);

/**
 * Fetch one page from provider
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<{page:number,limit:number,total:number,data:Array,hasMore:boolean}>}
 */
export async function fetchPage(page = 1, limit = PAGE_LIMIT) {
  const url = new URL(PROVIDER_URL);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  console.log(`Fetching page ${page} (limit ${limit}) from ${url.href}`);

  const res = await fetch(url.href, { timeout: 30000 });
  if (!res.ok) {
    throw new Error(`Provider responded ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json;
}

/**
 * Fetch all pages sequentially, yielding arrays of records (batches).
 * Use an async generator to stream batches to the transformer/loader.
 */
export async function* fetchAllBatches({ startPage = 1, limit = PAGE_LIMIT } = {}) {
  let page = startPage;
  while (true) {
    const json = await fetchPage(page, limit);
    if (!Array.isArray(json.data)) {
      throw new Error("Invalid provider response: missing data array");
    }
    yield { page: json.page, limit: json.limit, data: json.data, hasMore: json.hasMore, total: json.total };
    if (!json.hasMore) break;
    page++;
  }
}

/**
 * Currently, Sequential fetch helps keep provider stable. 
 * If we want concurrency later we can add a rate limiter or worker pool.
 */
