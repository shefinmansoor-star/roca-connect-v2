import { createClient } from '@/lib/supabase/server'
import AdminBrandsClient from './AdminBrandsClient'

export default async function AdminBrandsPage() {
  const supabase = await createClient()
  const { data: brands } = await supabase.from('brands').select('*').order('name')
  return <AdminBrandsClient brands={brands ?? []} />
}
