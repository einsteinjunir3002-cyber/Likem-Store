import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const productId = formData.get('productId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Validate mime type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Max 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Compute hash to deduplicate identical photos
    const sha256 = createHash('sha256').update(buffer).digest('hex');

    // Check if this file already exists in the DB
    const existing = await prisma.media.findUnique({
      where: { sha256 },
      select: {
        id: true,
        filename: true,
        originalName: true,
        url: true,
        mimeType: true,
        fileSize: true,
        width: true,
        height: true,
        sha256: true,
        altText: true,
        createdAt: true,
      },
    });

    if (existing) {
      // If productId provided, link it if not already linked
      if (productId) {
        const alreadyLinked = await prisma.productImage.findFirst({
          where: { productId, mediaId: existing.id },
        });
        if (!alreadyLinked) {
          await prisma.productImage.create({
            data: { productId, mediaId: existing.id, isPrimary: true, sortOrder: 0 },
          });
        }
      }
      return NextResponse.json({ success: true, media: existing, reused: true });
    }

    // Generate unique filename
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpeg';
    const filename = `perfume_${sha256.slice(0, 12)}.${ext}`;

    let publicUrl: string | null = null;

    // 1. Check if Supabase Storage API key is provided
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_KEY;

    // Determine Supabase Project URL
    let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    if (!supabaseUrl && process.env.DATABASE_URL) {
      const match = process.env.DATABASE_URL.match(/postgres\.([^:@]+)/);
      if (match && match[1]) {
        supabaseUrl = `https://${match[1]}.supabase.co`;
      }
    }

    // Attempt direct Supabase Storage bucket upload if credentials exist
    if (supabaseUrl && supabaseKey) {
      try {
        const cleanBaseUrl = supabaseUrl.replace(/\/$/, '');
        const uploadEndpoint = `${cleanBaseUrl}/storage/v1/object/perfumes/${filename}`;

        const uploadRes = await fetch(uploadEndpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${supabaseKey}`,
            apikey: supabaseKey,
            'Content-Type': file.type,
            'x-upsert': 'true',
          },
          body: buffer,
        });

        if (uploadRes.ok) {
          publicUrl = `${cleanBaseUrl}/storage/v1/object/public/perfumes/${filename}`;
        } else {
          console.warn('Supabase storage upload status:', uploadRes.status);
        }
      } catch (storageErr) {
        console.warn('Supabase storage upload skipped, falling back to Supabase database storage:', storageErr);
      }
    }

    // Ensure data BYTEA column exists on the active database
    try {
      await prisma.$executeRawUnsafe('ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "data" BYTEA;');
    } catch {
      // ignore if already present or user lacks DDL
    }

    let media: any;
    try {
      media = await prisma.media.create({
        data: {
          filename,
          originalName: file.name,
          url: publicUrl || '/api/media/placeholder',
          mimeType: file.type,
          fileSize: file.size,
          sha256,
          data: buffer,
        },
      });
    } catch (createErr: any) {
      if (createErr?.message && createErr.message.includes('column `data` does not exist')) {
        await prisma.$executeRawUnsafe('ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "data" BYTEA;');
        media = await prisma.media.create({
          data: {
            filename,
            originalName: file.name,
            url: publicUrl || '/api/media/placeholder',
            mimeType: file.type,
            fileSize: file.size,
            sha256,
            data: buffer,
          },
        });
      } else {
        throw createErr;
      }
    }

    // Update URL to point to /api/media/[id] if not hosted on Supabase Storage
    if (!publicUrl) {
      const dbMediaUrl = `/api/media/${media.id}`;
      await prisma.media.update({
        where: { id: media.id },
        data: { url: dbMediaUrl },
      });
      media.url = dbMediaUrl;
    }

    // If productId provided, link image immediately
    if (productId) {
      await prisma.productImage.create({
        data: { productId, mediaId: media.id, isPrimary: true, sortOrder: 0 },
      });
    }

    // Omit binary buffer from JSON response payload for speed and cleanliness
    const { data: _binaryData, ...mediaResponse } = media;
    return NextResponse.json({ success: true, media: mediaResponse });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err.message || 'Failed to upload photo.' }, { status: 500 });
  }
}
