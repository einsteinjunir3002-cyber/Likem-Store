import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing image id.' }, { status: 400 });
    }

    // Strip any optional extension like .webp or .jpg in the URL
    const cleanId = id.replace(/\.[^/.]+$/, '');

    const media = await prisma.media.findUnique({
      where: { id: cleanId },
      select: {
        id: true,
        data: true,
        mimeType: true,
        url: true,
        filename: true,
      },
    });

    if (!media) {
      return NextResponse.json({ error: 'Image not found.' }, { status: 404 });
    }

    // If binary data is stored in the database, serve it directly
    if (media.data && media.data.length > 0) {
      return new NextResponse(new Uint8Array(media.data), {
        status: 200,
        headers: {
          'Content-Type': media.mimeType || 'image/jpeg',
          'Content-Length': media.data.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // If media.url is a remote URL (e.g. Supabase Storage CDN), redirect
    if (media.url && (media.url.startsWith('http://') || media.url.startsWith('https://'))) {
      return NextResponse.redirect(media.url, 301);
    }

    // If media.url is a legacy static upload path (e.g. /uploads/perfumes/...)
    if (media.url && media.url.startsWith('/')) {
      return NextResponse.redirect(new URL(media.url, req.url), 302);
    }

    return NextResponse.json({ error: 'Image content unavailable.' }, { status: 404 });
  } catch (err: any) {
    console.error('Failed to serve media:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
