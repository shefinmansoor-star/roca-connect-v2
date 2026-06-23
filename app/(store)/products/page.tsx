import { createClient } from '@/lib/supabase/server'
import ProductsClient from './ProductsClient'

const PAGE_SIZE = 24

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const search = typeof params.search === 'string' ? params.search : ''
  const brandSlug = typeof params.brand === 'string' ? params.brand : ''
  const categorySlug = typeof params.category === 'string' ? params.category : ''
  const featured = params.featured === 'true'
  const page = typeof params.page === 'string' ? Math.max(1, parseInt(params.page)) : 1

  const supabase = await createClient()

  const [brandsRes, categoriesRes] = await Promise.all([
    supabase.from('brands').select('*').eq('is_active', true).order('name'),
    supabase.from('categories').select('*').eq('is_active', true).order('name'),
  ])

  // Build products query
  let query = supabase
    .from('products')
    .select('*, brand:brands(*), category:categories(*)', { count: 'exact' })
    .eq('is_active', true)

  if (search) {
    query = query.or(`name.ilike.%${search}%,name_ar.ilike.%${search}%,code.ilike.%${search}%`)
  }
  if (featured) {
    query = query.eq('is_featured', true)
  }
  if (brandSlug) {
    const brand = brandsRes.data?.find((b) => b.slug === brandSlug)
    if (brand) query = query.eq('brand_id', brand.id)
  }
  if (categorySlug) {
    const category = categoriesRes.data?.find((c) => c.slug === categorySlug)
    if (category) query = query.eq('category_id', category.id)
  }

  const from = (page - 1) * PAGE_SIZE
  query = query.range(from, from + PAGE_SIZE - 1).order('name')

  const productsRes = await query

  return (
    <ProductsClient
      products={productsRes.data ?? []}
      brands={brandsRes.data ?? []}
      categories={categoriesRes.data ?? []}
      totalCount={productsRes.count ?? 0}
      page={page}
      pageSize={PAGE_SIZE}
      filters={{ search, brandSlug, categorySlug, featured }}
    />
  )
}
