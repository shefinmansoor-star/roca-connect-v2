import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import OrderDetailClient from './OrderDetailClient'

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*, product:products(*)),
      order_followups(*, author:profiles(full_name, role))
    `)
    .eq('id', id)
    .eq('customer_id', user.id)
    .single()

  if (!order) notFound()

  return <OrderDetailClient order={order} />
}
