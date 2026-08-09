import { parse } from "path";

/**
 * Utility: Title Case (handles multi-word, trims spacing)
 */
function toTitleCase(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(/\s+/)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

/**
 * Normalize city: trim, title case, remove weird characters
 */
function normalizeCity(city) {
  if (!city) return "UNKNOWN";
  // remove excessive whitespace and non-letters/digits punctuation
  const cleaned = city.replace(/[^\p{L}\p{N}\s\-.,]/gu, "").trim();
  return toTitleCase(cleaned);
}

/**
 * Tokenize name into searchable tokens
 */
function nameTokens(name) {
  if (!name) return [];
  return name
    .replace(/[^\p{L}\s'-]/gu, "")
    .split(/\s+/)
    .map(t => t.toLowerCase())
    .filter(Boolean);
}

/**
 * Validate and transform a single raw record into a cleaned record.
 * Returns null if the record should be dropped.
 */
export function transformRecord(raw) {
  try {
    // Basic validation + required fields
    if (!raw || raw.id == null) return null;

    // Convert types safely
    const id = Number(raw.id);
    if (!Number.isFinite(id) || id <= 0) return null;

    // Heavy cleaning/transformation
    const nameRaw = String(raw.name || "").trim();
    const name = toTitleCase(nameRaw);

    // Age: must be integer between 0 and 130
    let age = raw.age == null ? null : Number(raw.age);
    if (Number.isNaN(age) || !Number.isFinite(age)) age = null;
    if (age !== null && (age < 0 || age > 130)) age = null;

    const cityRaw = String(raw.city || "").trim();
    const city = toTitleCase(cityRaw);
    const normalized_city = normalizeCity(cityRaw);

    const created_at = raw.created_at ? new Date(raw.created_at) : new Date();

    // Build enriched record
    const cleaned = {
      id,
      name,
      name_tokens: nameTokens(name),
      age,
      city,
      normalized_city,
      created_at: created_at.toISOString() // loader will parse to timestamp
    };

    // Dropping criteria example: no name & no city -> drop
    if (!cleaned.name && !cleaned.city) return null;

    return cleaned;
  } catch (err) {
    console.error("Transform error for record:", raw, err);
    return null;
  }
}

/**
 * Transform a batch array of raw records into cleaned array (drops invalid records).
 * Returns cleanedRecords
 */
export function transformBatch(batch) {
  const out = [];
  for (const r of batch) {
    const t = transformRecord(r);
    if (t) out.push(t);
  }
  return out;
}
