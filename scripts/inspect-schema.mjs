/**
 * Introspects the registrations table schema from Supabase
 * Run: node scripts/inspect-schema.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envLines = readFileSync(resolve(__dirname, "../.env"), "utf-8").split("\n");
const env = {};
for (const line of envLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
}

const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_ANON_KEY
);

// Fetch one row to see column names (even if empty, schema introspection works)
const { data, error } = await supabase
  .from("registrations")
  .select("*")
  .limit(1);

if (error) {
  console.error("Error:", error.message);
} else {
  if (data && data.length > 0) {
    console.log("Columns found in registrations:");
    Object.keys(data[0]).forEach(k => console.log(" •", k));
  } else {
    console.log("Table is empty. Trying information_schema...");
  }
}

// Also query information_schema for column details
const { data: cols, error: colErr } = await supabase
  .rpc("get_registrations_columns")
  .select("*");

if (!colErr && cols) {
  console.log("\nColumns via RPC:", cols);
}

// Try direct SQL via rpc if available
const { data: rawCols, error: rawErr } = await supabase
  .from("information_schema.columns")
  .select("column_name, data_type, is_nullable, column_default")
  .eq("table_name", "registrations")
  .eq("table_schema", "public");

if (!rawErr && rawCols) {
  console.log("\nAll columns:\n");
  rawCols.forEach(c => console.log(`  ${c.is_nullable === 'NO' ? '* ' : '  '}${c.column_name} (${c.data_type}) ${c.column_default ? `DEFAULT ${c.column_default}` : ''}`));
  console.log("\n* = NOT NULL");
}
