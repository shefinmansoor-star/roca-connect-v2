import { createClient } from '@/lib/supabase/server'
import HomeClient from './HomeClient'

export default async function HomePage() {
  const supabase = await createClient()

  const [brandsRes, categoriesRes, featuredRes] = await Promise.all([
    supabase.from('brands').select('*').eq('is_active', true).order('name'),
    supabase.from('categories').select('*').eq('is_active', true).order('name'),
    supabase
      .from('products')
      .select('*, brand:brands(*), category:categories(*)')
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(8),
  ])

  return (
    <HomeClient
      brands={brandsRes.data ?? []}
      categories={categoriesRes.data ?? []}
      featured={featuredRes.data ?? []}
    />
  )
}
