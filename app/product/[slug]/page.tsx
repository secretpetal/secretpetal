import ProductDetailClient from './ProductDetailClient';
import { DEFAULT_PRODUCTS } from '@/lib/db';

export function generateStaticParams() {
  return DEFAULT_PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductDetailClient initialSlug={params.slug} />;
}
