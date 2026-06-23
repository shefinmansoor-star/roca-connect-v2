import { createClient } from '@/lib/supabase/server'
import AdminProductsClient from './AdminProductsClient'

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*, brand:brands(*), category:categories(*)')
    .order('name')

  return <AdminProductsClient products={products ?? []} />
}
