import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import AdminOrderDetailClient from './AdminOrderDetailClient'

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      customer:profiles(id, full_name, company_name, email, phone, city),
      order_items(*, product:products(*)),
      order_followups(*, author:profiles(full_name, role))
    `)
    .eq('id', id)
    .single()

  if (!order) notFound()

  return <AdminOrderDetailClient order={order} />
}
