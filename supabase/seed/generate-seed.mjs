// Generates supabase/seed/seed.sql from the ACTUAL crabchips site-data.ts
// so restaurant + menu seed data is never hand-invented.
//
// Usage:
//   node supabase/seed/generate-seed.mjs /path/to/crabchips/src/lib/site-data.ts
//
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const srcPath = process.argv[2];
if (!srcPath) {
  console.error("Usage: node generate-seed.mjs <path-to-site-data.ts>");
  process.exit(1);
}

const src = fs.readFileSync(srcPath, "utf8");

// Pull MENU array literal out of the TS file and evaluate it as JS.
// site-data.ts has no imports in the MENU block, so this is safe to eval in isolation.
const menuMatch = src.match(/export const MENU[^=]*=\s*(\[[\s\S]*?\n\];)/);
const contactMatch = src.match(/export const CONTACT\s*=\s*(\{[\s\S]*?\n\};)/);

if (!menuMatch || !contactMatch) {
  console.error("Could not locate MENU or CONTACT in site-data.ts — file format changed?");
  process.exit(1);
}

// eslint-disable-next-line no-eval
const MENU = eval("(" + menuMatch[1].replace(/;\s*$/, "") + ")");
// eslint-disable-next-line no-eval
const CONTACT = eval("(" + contactMatch[1].replace(/;\s*$/, "").replace("null as number | null", "null") + ")");

function esc(s) {
  if (s === null || s === undefined) return "NULL";
  return "'" + String(s).replace(/'/g, "''") + "'";
}

const restaurantId = "00000000-0000-0000-0000-000000000001";
let sql = `-- AUTO-GENERATED from crabchips/src/lib/site-data.ts — do not hand edit.\n\n`;

sql += `insert into public.restaurants (id, slug, name, description, address, phone, whatsapp, instagram, maps_url, rating, review_count)\nvalues (\n  '${restaurantId}',\n  'crab-and-chips',\n  'Crab & Chips',\n  'Fruits de mer, pizzas et grillades — Tunis',\n  'Tunisie',\n  ${esc(CONTACT.whatsappNumber)},\n  ${esc(CONTACT.whatsapp)},\n  ${esc(CONTACT.instagram)},\n  ${esc(CONTACT.maps)},\n  ${CONTACT.rating},\n  ${CONTACT.reviewCount}\n)\non conflict (id) do nothing;\n\n`;

MENU.forEach((cat, ci) => {
  // Last UUID segment must be exactly 12 hex chars.
  const catId = `00000000-0000-0000-0000-${String(ci + 1).padStart(12, "0")}`;
  sql += `insert into public.categories (id, restaurant_id, name, sort_order)\nvalues ('${catId}', '${restaurantId}', ${esc(cat.label)}, ${ci})\non conflict (id) do nothing;\n\n`;

  cat.items.forEach((item, ii) => {
    // Encode (category, item) as a single number so it stays unique and fits in 12 hex chars.
    const dishId = `00000000-0000-0000-0001-${String((ci + 1) * 1000 + (ii + 1)).padStart(12, "0")}`;
    sql += `insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)\nvalues ('${dishId}', '${restaurantId}', '${catId}', ${esc(item.name)}, ${esc(item.ar)}, ${esc(item.desc)}, ${item.price}, true)\non conflict (id) do nothing;\n\n`;
  });
});

const outDir = path.dirname(fileURLToPath(import.meta.url));
fs.writeFileSync(path.join(outDir, "seed.sql"), sql);
console.log(`Wrote ${outDir}/seed.sql (${MENU.length} categories, ${MENU.reduce((a, c) => a + c.items.length, 0)} dishes)`);
