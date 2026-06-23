import { Badge } from '@/components/ui/badge'
import type { OrderStatus, StockStatus } from '@/types/database'
import { cn } from '@/lib/utils'

const orderStatusConfig: Record<OrderStatus, { label: string; labelAr: string; className: string }> = {
  new_order: { label: 'New Order', labelAr: 'طلب جديد', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  under_review: { label: 'Under Review', labelAr: 'قيد المراجعة', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  confirmed: { label: 'Confirmed', labelAr: 'مؤكد', className: 'bg-green-100 text-green-800 border-green-200' },
  quotation_sent: { label: 'Quotation Sent', labelAr: 'تم إرسال العرض', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  payment_pending: { label: 'Payment Pending', labelAr: 'في انتظار الدفع', className: 'bg-orange-100 text-orange-800 border-orange-200' },
  ready_for_delivery: { label: 'Ready for Delivery', labelAr: 'جاهز للتسليم', className: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  delivered: { label: 'Delivered', labelAr: 'تم التسليم', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  cancelled: { label: 'Cancelled', labelAr: 'ملغى', className: 'bg-red-100 text-red-800 border-red-200' },
}

const stockStatusConfig: Record<StockStatus, { label: string; labelAr: string; className: string }> = {
  in_stock: { label: 'In Stock', labelAr: 'متوفر', className: 'bg-green-100 text-green-800 border-green-200' },
  out_of_stock: { label: 'Out of Stock', labelAr: 'غير متوفر', className: 'bg-red-100 text-red-800 border-red-200' },
  limited_stock: { label: 'Limited Stock', labelAr: 'كميات محدودة', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
}

interface OrderStatusBadgeProps {
  status: OrderStatus
  isAr?: boolean
  className?: string
}

export function OrderStatusBadge({ status, isAr = false, className }: OrderStatusBadgeProps) {
  const config = orderStatusConfig[status] ?? { label: status, labelAr: status, className: 'bg-gray-100 text-gray-800 border-gray-200' }
  return (
    <Badge
      variant="outline"
      className={cn('text-xs font-medium border', config.className, className)}
    >
      {isAr ? config.labelAr : config.label}
    </Badge>
  )
}

interface StockStatusBadgeProps {
  status: StockStatus
  isAr?: boolean
  className?: string
}

export function StockStatusBadge({ status, isAr = false, className }: StockStatusBadgeProps) {
  const config = stockStatusConfig[status] ?? { label: status, labelAr: status, className: 'bg-gray-100 text-gray-800 border-gray-200' }
  return (
    <Badge
      variant="outline"
      className={cn('text-xs font-medium border', config.className, className)}
    >
      {isAr ? config.labelAr : config.label}
    </Badge>
  )
}
