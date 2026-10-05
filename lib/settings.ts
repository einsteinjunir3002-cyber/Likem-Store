import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';

export interface StoreSettingsData {
  id?: string;
  storeName: string;
  tagline: string;
  phoneContact: string;
  whatsappNumber: string;
  snapchatHandle?: string;
  onlineCheckoutEnabled: boolean;
  deliveryNotice: string;
  themePreset?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  cardColor?: string;
  currencyCode?: string;
  currencySymbol?: string;
  customWhatsappTemplate?: string;
}

const DEFAULT_SETTINGS: StoreSettingsData = {
  id: 'default',
  storeName: 'The Likem Perfumery',
  tagline: 'Authentic Luxury Fragrances in Ghana',
  phoneContact: '0502547133',
  whatsappNumber: '+233502547133',
  snapchatHandle: 'lilitracess',
  onlineCheckoutEnabled: false,
  deliveryNotice: 'Delivery fees depend on your exact location. We arrange delivery across Accra, Kumasi and all regions.',
  themePreset: 'cool-cloud-blue',
  primaryColor: '#0284c7',
  secondaryColor: '#38bdf8',
  accentColor: '#0369a1',
  backgroundColor: '#f0f8ff',
  cardColor: '#ffffff',
  currencyCode: 'GHS',
  currencySymbol: 'GH₵',
  customWhatsappTemplate: 'Hello! I am interested in ordering {product_name} priced at {price}. Please confirm availability and delivery to my location.',
};

function getFallbackFilePath(): string {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      // ignore in read-only environment
    }
  }
  return path.join(dir, 'store-settings.json');
}

function readFallbackSettings(): StoreSettingsData {
  try {
    const filePath = getFallbackFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.error('Error reading fallback settings:', err);
  }
  return { ...DEFAULT_SETTINGS };
}

function writeFallbackSettings(data: Partial<StoreSettingsData>): StoreSettingsData {
  const current = readFallbackSettings();
  const merged = { ...current, ...data };
  try {
    const filePath = getFallbackFilePath();
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing fallback settings:', err);
  }
  return merged;
}

export async function getStoreSettings(): Promise<StoreSettingsData> {
  const fallback = readFallbackSettings();
  try {
    const dbSettings = await prisma.storeSettings.findUnique({
      where: { id: 'default' },
    });
    if (dbSettings) {
      return {
        ...DEFAULT_SETTINGS,
        ...fallback,
        ...dbSettings,
        // Ensure theme fields have fallbacks
        themePreset: (dbSettings as any).themePreset || fallback.themePreset || 'royal-gold',
        primaryColor: (dbSettings as any).primaryColor || fallback.primaryColor || '#d4af37',
        secondaryColor: (dbSettings as any).secondaryColor || fallback.secondaryColor || '#f5e4ab',
        accentColor: (dbSettings as any).accentColor || fallback.accentColor || '#b8902a',
        backgroundColor: (dbSettings as any).backgroundColor || fallback.backgroundColor || '#050508',
        cardColor: (dbSettings as any).cardColor || fallback.cardColor || '#0c0e18',
      };
    }
  } catch (err) {
    // Database may be unreachable or timeout
  }
  return fallback;
}

export async function updateStoreSettings(data: Partial<StoreSettingsData>): Promise<StoreSettingsData> {
  // Always update local fallback first so changes immediately take effect
  const updatedFallback = writeFallbackSettings(data);

  try {
    const updated = await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: {
        storeName: data.storeName,
        tagline: data.tagline,
        phoneContact: data.phoneContact,
        whatsappNumber: data.whatsappNumber,
        snapchatHandle: data.snapchatHandle,
        onlineCheckoutEnabled: data.onlineCheckoutEnabled,
        deliveryNotice: data.deliveryNotice,
        ...((data.themePreset !== undefined ? { themePreset: data.themePreset } : {}) as any),
        ...((data.primaryColor !== undefined ? { primaryColor: data.primaryColor } : {}) as any),
        ...((data.secondaryColor !== undefined ? { secondaryColor: data.secondaryColor } : {}) as any),
        ...((data.accentColor !== undefined ? { accentColor: data.accentColor } : {}) as any),
        ...((data.backgroundColor !== undefined ? { backgroundColor: data.backgroundColor } : {}) as any),
        ...((data.cardColor !== undefined ? { cardColor: data.cardColor } : {}) as any),
      },
      create: {
        id: 'default',
        storeName: data.storeName || updatedFallback.storeName,
        tagline: data.tagline || updatedFallback.tagline,
        phoneContact: data.phoneContact || updatedFallback.phoneContact,
        whatsappNumber: data.whatsappNumber || updatedFallback.whatsappNumber,
        snapchatHandle: data.snapchatHandle || updatedFallback.snapchatHandle,
        onlineCheckoutEnabled: data.onlineCheckoutEnabled ?? updatedFallback.onlineCheckoutEnabled,
        deliveryNotice: data.deliveryNotice || updatedFallback.deliveryNotice,
        ...((data.themePreset !== undefined ? { themePreset: data.themePreset } : {}) as any),
        ...((data.primaryColor !== undefined ? { primaryColor: data.primaryColor } : {}) as any),
        ...((data.secondaryColor !== undefined ? { secondaryColor: data.secondaryColor } : {}) as any),
        ...((data.accentColor !== undefined ? { accentColor: data.accentColor } : {}) as any),
        ...((data.backgroundColor !== undefined ? { backgroundColor: data.backgroundColor } : {}) as any),
        ...((data.cardColor !== undefined ? { cardColor: data.cardColor } : {}) as any),
      },
    });
    return { ...updatedFallback, ...updated };
  } catch (err: any) {
    console.warn('Prisma update warning (using persisted fallback):', err.message);
    return updatedFallback;
  }
}
