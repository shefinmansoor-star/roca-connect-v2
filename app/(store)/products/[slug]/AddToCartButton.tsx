'use client'

import { useState } from 'react'
import { Minus, Plus, ShoppingCart, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'
import { useLang } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import { toast } from 'sonner'
import type { Product } from '@/types/database'

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { lang, isAr } = useLang()
  const { items, addItem, updateQuantity, removeItem } = useCart()
  const [qty, setQty] = useState(product.moq ?? 1)

  const minQty = product.moq ?? 1
  const cartItem = items.find((i) => i.product.id === product.id)
  const isOutOfStock = product.stock_status === 'out_of_stock'

  const handleAdd = () => {
    addItem(product, qty)
    toast.success(
      isAr
        ? `تمت الإضافة إلى السلة: ${product.name_ar ?? product.name}`
        : `Added to cart: ${product.name}`,
      { duration: 3000 }
    )
  }

  const handleUpdateQty = (newQty: number) => {
    if (newQty < minQty) {
      removeItem(product.id)
    } else {
      updateQuantity(product.id, newQty)
    }
  }

  if (isOutOfStock) {
    return (
      <Button disabled className="w-full" size="lg">
        {t(lang, 'product.outOfStock')}
      </Button>
    )
  }

  if (cartItem) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
          <Check className="h-4 w-4 text-green-600" />
          <span className="text-green-700 text-sm font-medium">{t(lang, 'cart.inCart')}</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleUpdateQty(cartItem.quantity - 1)}
            className="h-10 w-10 rounded-xl"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-xl font-bold text-gray-900 min-w-[3rem] text-center">
            {cartItem.quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleUpdateQty(cartItem.quantity + 1)}
            className="h-10 w-10 rounded-xl"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-500 ml-2">{t(lang, 'product.units')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Quantity Stepper */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">{t(lang, 'product.quantity')}:</span>
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQty(Math.max(minQty, qty - 1))}
            className="h-8 w-8"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-10 text-center font-bold">{qty}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQty(qty + 1)}
            className="h-8 w-8"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        {minQty > 1 && (
          <span className="text-xs text-gray-500">
            {t(lang, 'product.moqLabel')}: {minQty}
          </span>
        )}
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAdd}
        size="lg"
        className="w-full bg-red-700 hover:bg-red-800 text-white gap-2 text-base"
      >
        <ShoppingCart className="h-5 w-5" />
        {t(lang, 'cart.addToCart')}
      </Button>
    </div>
  )
}
