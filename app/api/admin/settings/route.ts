import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { storeName, tagline, phoneContact, whatsappNumber, snapchatHandle, onlineCheckoutEnabled, deliveryNotice } = body;

    const updated = await prisma.storeSettings.update({
      where: { id: 'default' },
      data: {
        storeName,
        tagline,
        phoneContact,
        whatsappNumber,
        snapchatHandle,
        onlineCheckoutEnabled,
        deliveryNotice,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
