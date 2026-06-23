import { createClient } from '@/lib/supabase/server'
import AdminCategoriesClient from './AdminCategoriesClient'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')
  return <AdminCategoriesClient categories={categories ?? []} />
}
