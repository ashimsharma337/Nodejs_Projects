-- Run in your Postgres DB (e.g., psql -U postgres -d etl_db -f init.sql)

CREATE TABLE IF NOT EXISTS people (
  id INTEGER PRIMARY KEY,
  name TEXT,
  name_tokens TEXT[],
  age INTEGER,
  city TEXT,
  normalized_city TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE,
  imported_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);
