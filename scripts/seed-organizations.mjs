/**
 * Relief Chain – Organization Seeder
 * ------------------------------------
 * Creates 10 dummy LGU auth users and their pending organization
 * registrations so the Platform Admin has records to review.
 *
 * Usage:
 *   node scripts/seed-organizations.mjs
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in your .env
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ---------------------------------------------------------------------------
// Load .env
// ---------------------------------------------------------------------------
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

const SUPABASE_URL = env.SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌  SUPABASE_SERVICE_ROLE_KEY is required in .env to create auth users.");
  console.error("    Get it from: Supabase Dashboard → Project Settings → API → service_role key");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------
const orgs = [
  {
    email: "bgy.sanisidro@seed.reliefchain.dev",
    organization_name: "Barangay San Isidro LGU",
    organization_type: "LGU",
    contact_info: "bgy.sanisidro@quezon.gov.ph | +63 917 111 2233",
    representative_first_name: "Maria",
    representative_last_name: "Santos",
    representative_middle_initial: "D",
    representative_position: "Barangay Captain",
    document_reference: "seed/bgy-san-isidro-auth-letter.pdf",
  },
  {
    email: "gk.cebu@seed.reliefchain.dev",
    organization_name: "Gawad Kalinga Cebu Chapter",
    organization_type: "NGO",
    contact_info: "gk.cebu@gawadkalinga.org | +63 932 444 5566",
    representative_first_name: "Jose",
    representative_last_name: "Reyes",
    representative_middle_initial: "M",
    representative_position: "Regional Director",
    document_reference: "seed/gk-cebu-sec-registration.pdf",
  },
  {
    email: "mayor.dingras@seed.reliefchain.dev",
    organization_name: "Municipality of Dingras",
    organization_type: "LGU",
    contact_info: "mayor@dingras.gov.ph | +63 919 777 8899",
    representative_first_name: "Ricardo",
    representative_last_name: "Villanueva",
    representative_middle_initial: "A",
    representative_position: "Mayor",
    document_reference: "seed/dingras-lgu-authorization.pdf",
  },
  {
    email: "caritas.manila@seed.reliefchain.dev",
    organization_name: "Caritas Manila",
    organization_type: "NGO",
    contact_info: "info@caritasmanila.org.ph | +63 2 8527 8084",
    representative_first_name: "Elena",
    representative_last_name: "Cruz",
    representative_middle_initial: null,
    representative_position: "Executive Director",
    document_reference: "seed/caritas-manila-dswdc-cert.pdf",
  },
  {
    email: "mdrrmo.poblacion@seed.reliefchain.dev",
    organization_name: "Barangay Poblacion MDRRMO",
    organization_type: "LGU",
    contact_info: "mdrrmo.poblacion@marikina.gov.ph | +63 927 333 6677",
    representative_first_name: "Angelo",
    representative_last_name: "dela Rosa",
    representative_middle_initial: "P",
    representative_position: "MDRRMO Chief",
    document_reference: "seed/poblacion-mdrrmo-auth.pdf",
  },
  {
    email: "habitat.ph@seed.reliefchain.dev",
    organization_name: "Habitat for Humanity Philippines",
    organization_type: "NGO",
    contact_info: "ph@habitat.org | +63 2 8756 4300",
    representative_first_name: "Patricia",
    representative_last_name: "Lim",
    representative_middle_initial: "S",
    representative_position: "Country Director",
    document_reference: "seed/habitat-ph-registration.pdf",
  },
  {
    email: "dswd.legazpi@seed.reliefchain.dev",
    organization_name: "City of Legazpi DSWD",
    organization_type: "LGU",
    contact_info: "dswd@legazpi.gov.ph | +63 52 820 1234",
    representative_first_name: "Lorena",
    representative_last_name: "Bautista",
    representative_middle_initial: "F",
    representative_position: "DSWD City Officer",
    document_reference: "seed/legazpi-dswd-authorization.pdf",
  },
  {
    email: "prc.davao@seed.reliefchain.dev",
    organization_name: "Philippine Red Cross – Davao Chapter",
    organization_type: "NGO",
    contact_info: "davao@redcross.org.ph | +63 82 297 5050",
    representative_first_name: "Roberto",
    representative_last_name: "Aquino",
    representative_middle_initial: "T",
    representative_position: "Chapter Administrator",
    document_reference: "seed/prc-davao-accreditation.pdf",
  },
  {
    email: "bgy.bagongpagasa@seed.reliefchain.dev",
    organization_name: "Barangay Bagong Pag-asa Relief Council",
    organization_type: "LGU",
    contact_info: "relief@bagongpagasa.quezon.gov.ph | +63 998 222 3344",
    representative_first_name: "Leonora",
    representative_last_name: "Pascual",
    representative_middle_initial: "G",
    representative_position: "Barangay Secretary",
    document_reference: "seed/bagong-pagasa-council-auth.pdf",
  },
  {
    email: "worldvision.ph@seed.reliefchain.dev",
    organization_name: "World Vision Philippines",
    organization_type: "NGO",
    contact_info: "info@worldvision.org.ph | +63 2 8531 6390",
    representative_first_name: "Michael",
    representative_last_name: "Torres",
    representative_middle_initial: "B",
    representative_position: "National Director",
    document_reference: "seed/world-vision-ph-sec.pdf",
  },
];

// ---------------------------------------------------------------------------
// Helper: get or create a Supabase auth user, returns their UUID
// ---------------------------------------------------------------------------
async function getOrCreateUser(email) {
  // Try to create first
  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email,
    password: "SeedPassword123!",
    email_confirm: true,
  });

  if (!createErr && created?.user?.id) {
    return created.user.id;
  }

  // If user already exists, look them up
  if (createErr?.message?.includes("already") || createErr?.message?.includes("exists")) {
    const { data: list } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const found = list?.users?.find((u) => u.email === email);
    return found?.id ?? null;
  }

  throw new Error(createErr?.message ?? "Unknown error creating user");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function seed() {
  console.log(`🌱  Seeding ${orgs.length} organizations…\n`);
  let created = 0;
  let skipped = 0;

  for (const { email, ...orgData } of orgs) {
    process.stdout.write(`   • ${orgData.organization_name} … `);

    // 1. Get or create auth user
    let userId;
    try {
      userId = await getOrCreateUser(email);
    } catch (err) {
      console.log(`❌  auth: ${err.message}`);
      skipped++;
      continue;
    }

    if (!userId) {
      console.log(`❌  could not resolve user ID`);
      skipped++;
      continue;
    }

    // 2. Upsert profile with lgu role
    const { error: profileErr } = await supabase
      .from("profiles")
      .upsert({ id: userId, role: "lgu" }, { onConflict: "id" });

    if (profileErr) {
      console.log(`❌  profile: ${profileErr.message}`);
      skipped++;
      continue;
    }

    // 3. Skip if registration already exists
    const { data: existing } = await supabase
      .from("registrations")
      .select("id")
      .eq("lgu_id", userId)
      .maybeSingle();

    if (existing) {
      console.log(`⏭️  already seeded`);
      skipped++;
      continue;
    }

    // 4. Insert registration
    const { error: regErr } = await supabase.from("registrations").insert({
      lgu_id: userId,
      status: "Pending",
      rejection_reason: null,
      ...orgData,
    });

    if (regErr) {
      console.log(`❌  registration: ${regErr.message}`);
      skipped++;
      continue;
    }

    console.log(`✅`);
    created++;
  }

  console.log(`\n🎉  Done! Created: ${created}  Skipped/Errored: ${skipped}`);
  if (created > 0) {
    console.log("    Refresh /organizations to see the pending registrations.\n");
  }
}

seed().catch((err) => {
  console.error("\nUnexpected error:", err);
  process.exit(1);
});
