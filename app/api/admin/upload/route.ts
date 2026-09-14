import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { createHash } from 'crypto';
import path from 'path';

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

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Compute hash to deduplicate
    const sha256 = createHash('sha256').update(buffer).digest('hex');

    // Check if this file already exists in the DB
    const existing = await prisma.media.findUnique({ where: { sha256 } });
    if (existing) {
      // If productId provided, link it
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
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'perfumes');
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const url = `/uploads/perfumes/${filename}`;

    // Save Media record
    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name,
        url,
        mimeType: file.type,
        fileSize: file.size,
        sha256,
      },
    });

    // If productId provided, link image immediately
    if (productId) {
      await prisma.productImage.create({
        data: { productId, mediaId: media.id, isPrimary: true, sortOrder: 0 },
      });
    }

    return NextResponse.json({ success: true, media });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
