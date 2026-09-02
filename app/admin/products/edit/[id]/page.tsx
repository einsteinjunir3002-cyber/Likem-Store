import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductEditForm from '@/components/ProductEditForm';

export const revalidate = 0;

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      brand: true,
      images: { include: { media: true }, take: 1 },
    },
  });

  if (!product) {
    notFound();
  }

  const primaryImage = product.images[0]?.media?.url;

  return (
    <ProductEditForm
      product={{
        id: product.id,
        name: product.name,
        brandName: product.brand?.name,
        priceInGhs: Number(product.priceInGhs),
        stock: product.stock,
        size: product.size || '100ml',
        concentration: product.concentration || 'Eau De Parfum',
        gender: product.gender || 'Unisex',
        shortDescription: product.shortDescription || '',
        status: product.status,
        imageUrl: primaryImage,
      }}
    />
  );
}
