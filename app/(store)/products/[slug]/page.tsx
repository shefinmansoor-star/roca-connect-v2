import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, brand:brands(*), category:categories(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  const { data: related } = await supabase
    .from('products')
    .select('*, brand:brands(*)')
    .eq('brand_id', product.brand_id)
    .eq('is_active', true)
    .neq('id', product.id)
    .limit(4)

  return <ProductDetailClient product={product} related={related ?? []} />
}
