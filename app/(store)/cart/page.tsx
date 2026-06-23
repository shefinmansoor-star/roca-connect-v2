'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Minus, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/context/CartContext'
import { useLang } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function CartPage() {
  const { lang, isAr } = useLang()
  const { items, updateQuantity, removeItem, clearCart, totalAmount } = useCart()
  const router = useRouter()
  const supabase = createClient()
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmitOrder = async () => {
    if (items.length === 0) return
    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error(isAr ? 'يجب تسجيل الدخول أولاً' : 'Please sign in to place an order')
        router.push('/login?redirect=/cart')
        return
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user.id,
          status: 'new_order',
          notes: notes || null,
          total_amount: totalAmount,
        })
        .select()
        .single()

      if (orderError || !order) throw orderError ?? new Error('Failed to create order')

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price ?? 0,
        total_price: (item.product.price ?? 0) * item.quantity,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
      if (itemsError) throw itemsError

      clearCart()
      toast.success(isAr ? 'تم إرسال طلبك بنجاح!' : 'Order submitted successfully!')
      router.push(`/orders/${order.id}?success=1`)
    } catch (err) {
      console.error(err)
      toast.error(isAr ? 'حدث خطأ. حاول مجدداً.' : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center" dir={isAr ? 'rtl' : 'ltr'}>
        <ShoppingBag className="h-20 w-20 text-gray-200 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t(lang, 'cart.empty')}</h1>
        <p className="text-gray-500 mb-8">{t(lang, 'cart.emptyDesc')}</p>
        <Link href="/products">
          <Button className="bg-red-700 hover:bg-red-800 text-white gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t(lang, 'cart.continueShopping')}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" dir={isAr ? 'rtl' : 'ltr'}>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{t(lang, 'cart.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const displayName = isAr && item.product.name_ar ? item.product.name_ar : item.product.name
            return (
              <Card key={item.product.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-20 h-20 bg-gray-50 rounded-xl relative shrink-0 overflow-hidden border border-gray-100">
                      {item.product.image_url ? (
                        <Image
                          src={item.product.image_url}
                          alt={displayName}
                          fill
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🧴</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm leading-snug mb-0.5 line-clamp-2">
                        {displayName}
                      </p>
                      {item.product.product_code && (
                        <p className="text-xs text-gray-500 mb-0.5">{t(lang, 'product.code')}: {item.product.product_code}</p>
                      )}
                      {item.product.packing && (
                        <p className="text-xs text-gray-500">{t(lang, 'product.packing')}: {item.product.packing}</p>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="flex items-center gap-1 border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(item.product.moq ?? 1, item.quantity - 1))}
                          className="p-1 hover:bg-gray-100 rounded-l-lg"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-2 text-sm font-semibold min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded-r-lg"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {item.product.price && (
                        <p className="text-red-700 font-bold text-sm">
                          {(item.product.price * item.quantity).toFixed(2)} SAR
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">{t(lang, 'cart.summary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Item list */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {items.map((item) => {
                  const name = isAr && item.product.name_ar ? item.product.name_ar : item.product.name
                  return (
                    <div key={item.product.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 truncate mr-2">{name} x{item.quantity}</span>
                      {item.product.price && (
                        <span className="font-medium text-gray-900 shrink-0">
                          {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              <Separator />

              <div className="flex items-center justify-between font-bold text-base">
                <span>{t(lang, 'cart.total')}</span>
                <span className="text-red-700">{totalAmount.toFixed(2)} SAR</span>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  {t(lang, 'cart.notes')}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t(lang, 'cart.notesPlaceholder')}
                  rows={3}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                />
              </div>

              <Button
                onClick={handleSubmitOrder}
                disabled={submitting}
                className="w-full bg-red-700 hover:bg-red-800 text-white text-base py-5"
              >
                {submitting ? (isAr ? 'جاري الإرسال...' : 'Submitting...') : t(lang, 'cart.submitOrder')}
              </Button>

              <Link href="/products">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {t(lang, 'cart.continueShopping')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
