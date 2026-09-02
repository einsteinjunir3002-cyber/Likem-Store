const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Media Source & Target
const SOURCE_DIR = path.join(__dirname, '..', 'MEDIA');
const TARGET_DIR = path.join(__dirname, '..', 'public', 'uploads', 'perfumes');

// Cautious name suggestion mapper based strictly on visible packaging in the 11 real photographs
const PACKAGING_HINTS = {
  'WhatsApp Image 2026-09-02 at 7.24.18 PM.jpeg': {
    name: 'Suger Candy',
    brand: 'Aro-Fac Aroma Factory',
    size: '100ml',
    concentration: 'Eau De Parfum',
  },
  'WhatsApp Image 2026-09-02 at 7.24.19 PM (1).jpeg': {
    name: 'Now Women',
    brand: 'Rave',
    size: '100ml',
    concentration: 'Eau De Parfum',
    gender: 'Women',
  },
  'WhatsApp Image 2026-09-02 at 7.24.19 PM (2).jpeg': {
    name: 'Hayaati',
    brand: 'Lattafa',
    size: '100ml',
    concentration: 'Eau De Parfum',
  },
  'WhatsApp Image 2026-09-02 at 7.24.19 PM (3).jpeg': {
    name: 'Zara Man',
    brand: 'Zara',
    size: '100ml',
    concentration: 'Eau De Parfum',
    gender: 'Men',
  },
  'WhatsApp Image 2026-09-02 at 7.24.19 PM (4).jpeg': {
    name: 'Ophylia',
    brand: 'Fragrance World',
    size: '80ml',
    concentration: 'Eau De Parfum',
    gender: 'Women',
  },
  'WhatsApp Image 2026-09-02 at 7.24.19 PM (5).jpeg': {
    name: 'Suspenso Pour Homme',
    brand: 'Fragrance World',
    size: '100ml',
    concentration: 'Eau De Parfum',
    gender: 'Men',
  },
  'WhatsApp Image 2026-09-02 at 7.24.19 PM (6).jpeg': {
    name: 'Angham',
    brand: 'Lattafa',
    size: '100ml',
    concentration: 'Eau De Parfum',
  },
  'WhatsApp Image 2026-09-02 at 7.24.19 PM.jpeg': {
    name: '9 PM Rebel',
    brand: 'Afnan',
    size: '100ml',
    concentration: 'Eau De Parfum',
  },
  'WhatsApp Image 2026-09-02 at 7.24.20 PM (1).jpeg': {
    name: 'Tharwah Gold',
    brand: 'Lattafa Pride',
    size: '100ml',
    concentration: 'Eau De Parfum',
  },
  'WhatsApp Image 2026-09-02 at 7.24.20 PM (2).jpeg': {
    name: 'Elysia Collection',
    brand: 'Fragrance World',
    size: '100ml',
    concentration: 'Eau De Parfum',
  },
  'WhatsApp Image 2026-09-02 at 7.24.20 PM.jpeg': {
    name: 'Petra',
    brand: 'Lattafa',
    size: '100ml',
    concentration: 'Eau De Parfum',
  },
};

function getJpegDimensions(buf) {
  for (let i = 0; i < buf.length - 8; i++) {
    if (buf[i] === 0xff && (buf[i + 1] === 0xc0 || buf[i + 1] === 0xc2)) {
      const height = buf.readUInt16BE(i + 5);
      const width = buf.readUInt16BE(i + 7);
      return { width, height };
    }
  }
  return { width: null, height: null };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function main() {
  console.log('=== LIKEM PERFUMES MEDIA IMPORT & SEED SYSTEM ===\n');

  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  // 1. Initialize Default Store Settings
  const existingSettings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
  if (!existingSettings) {
    await prisma.storeSettings.create({
      data: {
        id: 'default',
        storeName: 'LIKEM Fragrances',
        tagline: 'Curated Perfumes Delivered Across Ghana',
        currencyCode: 'GHS',
        currencySymbol: 'GH₵',
        phoneContact: '0502547133',
        whatsappNumber: '+233502547133',
        snapchatHandle: 'lilitracess',
        onlineCheckoutEnabled: false, // Owner opts in when ready
        storeStatus: 'OPEN',
        deliveryNotice: 'Delivery fees depend on your exact location. We arrange dispatch across Accra, Kumasi and all Ghanaian regions.',
      },
    });
    console.log('✔ Initialized real Ghanaian store settings.');
  }

  // 2. Initialize Ghanaian Administrative Regions with standard baseline estimates
  const ghanaRegions = [
    { regionName: 'Greater Accra (Accra & Tema)', baseFeeInGhs: 30.0, estimatedDays: 'Same-day or 24 hrs' },
    { regionName: 'Ashanti (Kumasi)', baseFeeInGhs: 45.0, estimatedDays: '24 - 48 hrs' },
    { regionName: 'Central (Cape Coast / Kasoa)', baseFeeInGhs: 40.0, estimatedDays: '24 - 48 hrs' },
    { regionName: 'Eastern (Koforidua)', baseFeeInGhs: 40.0, estimatedDays: '24 - 48 hrs' },
    { regionName: 'Western (Takoradi)', baseFeeInGhs: 50.0, estimatedDays: '48 hrs' },
    { regionName: 'Volta (Ho)', baseFeeInGhs: 50.0, estimatedDays: '48 hrs' },
    { regionName: 'Northern (Tamale)', baseFeeInGhs: 65.0, estimatedDays: '2 - 3 days' },
  ];

  for (const reg of ghanaRegions) {
    await prisma.deliveryRegion.upsert({
      where: { regionName: reg.regionName },
      update: {},
      create: reg,
    });
  }
  console.log('✔ Verified Ghanaian delivery regions.');

  // 3. Ensure Default Admin User exists
  const existingAdmin = await prisma.adminUser.findFirst();
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('AdminLikem2026!', 10);
    await prisma.adminUser.create({
      data: {
        email: 'admin@likem.com',
        name: 'Store Owner',
        passwordHash,
        role: 'SUPER_ADMIN',
      },
    });
    console.log('✔ Created initial admin account (admin@likem.com).');
  }

  // 4. Scan Desktop/LIKEM/MEDIA
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source directory not found: ${SOURCE_DIR}`);
    return;
  }

  const files = fs.readdirSync(SOURCE_DIR);
  console.log(`Found ${files.length} items in ${SOURCE_DIR}\n`);

  const report = [];

  for (const file of files) {
    if (!file.toLowerCase().endsWith('.jpeg') && !file.toLowerCase().endsWith('.jpg') && !file.toLowerCase().endsWith('.png')) {
      continue;
    }

    const sourcePath = path.join(SOURCE_DIR, file);
    const buf = fs.readFileSync(sourcePath);
    const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
    const { width, height } = getJpegDimensions(buf);

    // Copy to managed app storage with clean unique name
    const ext = path.extname(file);
    const managedFileName = `perfume_${sha256.slice(0, 12)}${ext}`;
    const targetPath = path.join(TARGET_DIR, managedFileName);
    if (!fs.existsSync(targetPath)) {
      fs.copyFileSync(sourcePath, targetPath);
    }

    const appUrl = `/uploads/perfumes/${managedFileName}`;

    // Upsert Media Record
    const media = await prisma.media.upsert({
      where: { sha256 },
      update: {
        width,
        height,
      },
      create: {
        filename: managedFileName,
        originalName: file,
        url: appUrl,
        mimeType: 'image/jpeg',
        fileSize: buf.length,
        width,
        height,
        sha256,
        altText: 'Perfume bottle photograph',
      },
    });

    // Check if Product already exists with this image
    const existingProductImage = await prisma.productImage.findFirst({
      where: { mediaId: media.id },
      include: { product: true },
    });

    if (existingProductImage) {
      report.push({
        file,
        status: 'ALREADY_EXISTS',
        product: existingProductImage.product.name,
      });
      continue;
    }

    // Packaging metadata hint
    const hint = PACKAGING_HINTS[file] || {
      name: `Imported Perfume (${sha256.slice(0, 6)})`,
      brand: 'Unspecified Brand',
      size: '100ml',
      concentration: 'Eau De Parfum',
    };

    // Upsert Brand if hint available
    let brand = null;
    if (hint.brand) {
      brand = await prisma.brand.upsert({
        where: { slug: slugify(hint.brand) },
        update: {},
        create: {
          name: hint.brand,
          slug: slugify(hint.brand),
        },
      });
    }

    // Generate unique slug
    let baseSlug = slugify(hint.name);
    let candidateSlug = baseSlug;
    let count = 1;
    while (await prisma.product.findUnique({ where: { slug: candidateSlug } })) {
      candidateSlug = `${baseSlug}-${count++}`;
    }

    // Create DRAFT product requiring owner price and details
    const product = await prisma.product.create({
      data: {
        name: hint.name,
        slug: candidateSlug,
        brandId: brand ? brand.id : null,
        size: hint.size || '100ml',
        concentration: hint.concentration || 'Eau De Parfum',
        gender: hint.gender || 'Unisex',
        priceInGhs: 0.0, // Strict zero until owner enters actual price
        stock: 0,        // Strict zero until owner sets physical stock count
        requiresInformation: true, // Needs price, stock, and confirmation before publishing
        status: 'DRAFT',           // Draft status: never shown publicly until confirmed
        shortDescription: `Authentic ${hint.name} ${hint.concentration || ''} ${hint.size || ''}. Contact on WhatsApp or checkout online for delivery.`,
        images: {
          create: {
            mediaId: media.id,
            isPrimary: true,
            sortOrder: 0,
          },
        },
      },
    });

    report.push({
      file,
      status: 'IMPORTED_AS_DRAFT',
      name: product.name,
      slug: product.slug,
      requiresInformation: true,
    });
  }

  console.log('--- MEDIA IMPORT REPORT ---');
  console.table(report);
  console.log(`\nImport complete: ${report.length} media items processed.`);
  console.log('All products safely placed in DRAFT state awaiting owner completion.\n');
}

main()
  .catch((e) => {
    console.error('Error in media import script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
