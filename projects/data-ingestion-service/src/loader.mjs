import pg from "pg";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const {
  PG_HOST = "localhost",
  PG_PORT = 5432,
  PG_USER = "postgres",
  PG_PASSWORD = "",
  PG_DATABASE = "",
  PG_MAX_CLIENTS = 10,
  BATCH_SIZE = 500
} = process.env;

const pool = new pg.Pool({
  host: PG_HOST,
  port: Number(PG_PORT),
  user: PG_USER,
  password: PG_PASSWORD,
  database: PG_DATABASE,
  max: Number(PG_MAX_CLIENTS)
});

pool.on("error", (err) => {
  console.error("Unexpected PG error on idle client", err);
});

// Build parameterized bulk insert for an array of records
function buildBulkInsert(records) {
  // columns: id, name, name_tokens, age, city, normalized_city, created_at
  const columns = ["id", "name", "name_tokens", "age", "city", "normalized_city", "created_at"];
  const values = [];
  const placeholders = [];
  let paramIndex = 1;

  for (const r of records) {
    const rowPlaceholders = [];
    // id
    rowPlaceholders.push(`$${paramIndex++}`);
    values.push(r.id);
    // name
    rowPlaceholders.push(`$${paramIndex++}`);
    values.push(r.name);
    // name_tokens (array)
    rowPlaceholders.push(`$${paramIndex++}`);
    values.push(r.name_tokens);
    // age
    rowPlaceholders.push(`$${paramIndex++}`);
    values.push(r.age);
    // city
    rowPlaceholders.push(`$${paramIndex++}`);
    values.push(r.city);
    // normalized_city
    rowPlaceholders.push(`$${paramIndex++}`);
    values.push(r.normalized_city);
    // created_at
    rowPlaceholders.push(`$${paramIndex++}`);
    values.push(r.created_at); // ISO string; PG will accept or we can cast

    placeholders.push(`(${rowPlaceholders.join(",")})`);
  }

  const query = `
    INSERT INTO people (${columns.join(",")})
    VALUES ${placeholders.join(",")}
    ON CONFLICT (id) DO UPDATE
    SET
      name = EXCLUDED.name,
      name_tokens = EXCLUDED.name_tokens,
      age = EXCLUDED.age,
      city = EXCLUDED.city,
      normalized_city = EXCLUDED.normalized_city,
      created_at = EXCLUDED.created_at
  `;

  return { text: query, values };
}

/**
 * Insert a batch of cleaned records in one query.
 * Splits into sub-batches if larger than maximum allowed.
 */
export async function insertBatch(cleanedRecords) {
  if (!cleanedRecords || cleanedRecords.length === 0) return 0;

  // Optionally split into chunks of BATCH_SIZE environment variable
  const batchSize = Number(process.env.BATCH_SIZE || BATCH_SIZE);
  let inserted = 0;

  for (let i = 0; i < cleanedRecords.length; i += batchSize) {
    const chunk = cleanedRecords.slice(i, i + batchSize);
    const { text, values } = buildBulkInsert(chunk);

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(text, values);
      await client.query("COMMIT");
      inserted += chunk.length;
      console.log(`💾 Inserted chunk of ${chunk.length} records`);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("DB insert error:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  return inserted;
}

/**
 * Graceful shutdown
 */
export async function closePool() {
  await pool.end();
}
