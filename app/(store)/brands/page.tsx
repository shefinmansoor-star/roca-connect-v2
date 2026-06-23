import { createClient } from '@/lib/supabase/server'
import BrandsClient from './BrandsClient'

export default async function BrandsPage() {
  const supabase = await createClient()
  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return <BrandsClient brands={brands ?? []} />
}
