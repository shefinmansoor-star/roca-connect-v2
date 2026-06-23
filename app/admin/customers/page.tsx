import { createClient } from '@/lib/supabase/server'
import AdminCustomersClient from './AdminCustomersClient'

export default async function AdminCustomersPage() {
  const supabase = await createClient()

  const { data: customers } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  return <AdminCustomersClient customers={customers ?? []} />
}
