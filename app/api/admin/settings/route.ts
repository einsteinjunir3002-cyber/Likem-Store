import { NextResponse } from 'next/server';
import { getStoreSettings, updateStoreSettings } from '@/lib/settings';

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      storeName,
      tagline,
      phoneContact,
      whatsappNumber,
      snapchatHandle,
      onlineCheckoutEnabled,
      deliveryNotice,
      themePreset,
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      cardColor,
    } = body;

    const updated = await updateStoreSettings({
      storeName,
      tagline,
      phoneContact,
      whatsappNumber,
      snapchatHandle,
      onlineCheckoutEnabled,
      deliveryNotice,
      themePreset,
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      cardColor,
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
