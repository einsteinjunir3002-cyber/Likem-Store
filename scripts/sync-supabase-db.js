const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Read .env manually to ensure environment variables are loaded
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

async function main() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('No DATABASE_URL or DIRECT_URL found in environment.');
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL successfully.');

    // 1. Inspect StoreSettings columns
    const colsResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'StoreSettings';
    `);
    const cols = colsResult.rows.map(r => r.column_name);
    console.log('Current StoreSettings columns:', cols);

    // 2. Add bannerImageUrl if missing
    if (!cols.includes('bannerImageUrl')) {
      console.log('Adding bannerImageUrl column to StoreSettings...');
      await client.query(`
        ALTER TABLE "StoreSettings" 
        ADD COLUMN "bannerImageUrl" TEXT DEFAULT '/uploads/perfumes/perfume_hero_angham.jpg';
      `);
      console.log('Successfully added bannerImageUrl column!');
    } else {
      console.log('bannerImageUrl column already exists.');
    }

    // 3. Sync StoreSettings row with store-settings.json
    const localSettings = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/store-settings.json'), 'utf8'));
    console.log('Local store-settings.json:', localSettings);

    await client.query(`
      INSERT INTO "StoreSettings" (
        "id", "storeName", "tagline", "phoneContact", "whatsappNumber", 
        "snapchatHandle", "onlineCheckoutEnabled", "deliveryNotice", 
        "themePreset", "primaryColor", "secondaryColor", "accentColor", 
        "backgroundColor", "cardColor", "currencyCode", "currencySymbol", 
        "customWhatsappTemplate", "bannerImageUrl", "updatedAt"
      ) VALUES (
        'default', $1, $2, $3, $4, 
        $5, $6, $7, 
        $8, $9, $10, $11, 
        $12, $13, $14, $15, 
        $16, $17, NOW()
      )
      ON CONFLICT ("id") DO UPDATE SET
        "storeName" = EXCLUDED."storeName",
        "tagline" = EXCLUDED."tagline",
        "phoneContact" = EXCLUDED."phoneContact",
        "whatsappNumber" = EXCLUDED."whatsappNumber",
        "snapchatHandle" = EXCLUDED."snapchatHandle",
        "onlineCheckoutEnabled" = EXCLUDED."onlineCheckoutEnabled",
        "deliveryNotice" = EXCLUDED."deliveryNotice",
        "themePreset" = EXCLUDED."themePreset",
        "primaryColor" = EXCLUDED."primaryColor",
        "secondaryColor" = EXCLUDED."secondaryColor",
        "accentColor" = EXCLUDED."accentColor",
        "backgroundColor" = EXCLUDED."backgroundColor",
        "cardColor" = EXCLUDED."cardColor",
        "currencyCode" = EXCLUDED."currencyCode",
        "currencySymbol" = EXCLUDED."currencySymbol",
        "customWhatsappTemplate" = EXCLUDED."customWhatsappTemplate",
        "bannerImageUrl" = EXCLUDED."bannerImageUrl",
        "updatedAt" = NOW();
    `, [
      localSettings.storeName || 'The Likem Perfumery',
      localSettings.tagline || 'Authentic Luxury Fragrances in Ghana',
      localSettings.phoneContact || '0502547133',
      localSettings.whatsappNumber || '+233502547133',
      localSettings.snapchatHandle || 'lilitracess',
      localSettings.onlineCheckoutEnabled ?? false,
      localSettings.deliveryNotice || 'Delivery fees depend on your exact location.',
      localSettings.themePreset || 'custom',
      localSettings.primaryColor || '#06b6d4',
      localSettings.secondaryColor || '#67e8f9',
      localSettings.accentColor || '#0891b2',
      localSettings.backgroundColor || '#ecfeff',
      localSettings.cardColor || '#ffffff',
      localSettings.currencyCode || 'GHS',
      localSettings.currencySymbol || 'GH₵',
      localSettings.customWhatsappTemplate || 'Hello! I am interested in ordering {product_name} priced at {price}. Please confirm availability and delivery to my location.',
      localSettings.bannerImageUrl || '/uploads/perfumes/perfume_hero_angham.jpg',
    ]);
    console.log('Synchronized StoreSettings into Supabase database successfully!');

    console.log('Supabase database sync completed safely without dropping any tables!');
  } catch (err) {
    console.error('Database migration error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
