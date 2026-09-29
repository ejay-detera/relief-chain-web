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

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const sampleDisbursements = [
  {
    program_name: "Typhoon Kristine Emergency Cash Aid",
    disaster_event: "Typhoon Kristine",
    amount: 35000,
    recipients_count: 35,
    created_at: "2025-10-18T10:30:00Z",
  },
  {
    program_name: "Typhoon Kristine Relief Phase 2",
    disaster_event: "Typhoon Kristine",
    amount: 50000,
    recipients_count: 50,
    created_at: "2025-11-24T14:15:00Z",
  },
  {
    program_name: "Barangay Poblacion Livelihood Aid",
    disaster_event: "Flash Flood Rehabilitation",
    amount: 42000,
    recipients_count: 42,
    created_at: "2025-12-12T09:00:00Z",
  },
  {
    program_name: "Dingras Agricultural Relief Fund",
    disaster_event: "Agricultural Drought",
    amount: 60000,
    recipients_count: 60,
    created_at: "2026-01-20T11:45:00Z",
  },
  {
    program_name: "Legazpi City Evacuation Assistance",
    disaster_event: "Volcanic Unrest",
    amount: 75000,
    recipients_count: 75,
    created_at: "2026-02-15T16:20:00Z",
  },
  {
    program_name: "Caritas Manila Nutrition Voucher",
    disaster_event: "Child Malnutrition Crisis",
    amount: 90000,
    recipients_count: 90,
    created_at: "2026-03-25T13:10:00Z",
  },
  {
    program_name: "Gawad Kalinga Housing Repair Aid",
    disaster_event: "Earthquake Aftermath",
    amount: 68000,
    recipients_count: 68,
    created_at: "2026-04-14T08:30:00Z",
  },
  {
    program_name: "Philippine Red Cross Medical Aid",
    disaster_event: "Dengue Outbreak Response",
    amount: 55000,
    recipients_count: 55,
    created_at: "2026-05-19T15:00:00Z",
  },
  {
    program_name: "Barangay Bagong Pag-asa Aid",
    disaster_event: "Monsoon Inundation",
    amount: 80000,
    recipients_count: 80,
    created_at: "2026-06-22T10:00:00Z",
  },
  {
    program_name: "San Isidro LGU Community Aid",
    disaster_event: "Coastal Storm Surge",
    amount: 95000,
    recipients_count: 95,
    created_at: "2026-07-28T12:00:00Z",
  },
  {
    program_name: "Emergency Cash Transfer - Mindanao",
    disaster_event: "Severe Flooding",
    amount: 110000,
    recipients_count: 110,
    created_at: "2026-08-16T14:30:00Z",
  },
  {
    program_name: "Typhoon Kristine Reconstruction Aid",
    disaster_event: "Typhoon Kristine",
    amount: 125000,
    recipients_count: 125,
    created_at: "2026-09-28T09:15:00Z",
  },
];

console.log(`Seeding ${sampleDisbursements.length} disbursement records…`);
const { data, error } = await supabase.from("disbursements").insert(sampleDisbursements);
if (error) {
  console.error("Disbursement seed error:", error.message);
} else {
  console.log("✅ Successfully seeded disbursements!");
}
