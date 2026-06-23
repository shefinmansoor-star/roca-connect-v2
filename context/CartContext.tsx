'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Product } from '@/types/database'

interface CartItem { product: Product; quantity: number }
interface CartCtx {
  items: CartItem[]
  addItem: (product: Product, qty?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  totalItems: number
  totalAmount: number
}

const Ctx = createContext<CartCtx>({} as CartCtx)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try { const s = localStorage.getItem('roca_cart'); if (s) setItems(JSON.parse(s)) } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('roca_cart', JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, qty = 1) => {
    setItems(prev => {
      const ex = prev.find(i => i.product.id === product.id)
      if (ex) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i)
      return [...prev, { product, quantity: qty }]
    })
  }

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.product.id !== id))
  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) { removeItem(id); return }
    setItems(prev => prev.map(i => i.product.id === id ? { ...i, quantity: qty } : i))
  }
  const clearCart = () => setItems([])
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const totalAmount = items.reduce((s, i) => s + (i.product.price ?? 0) * i.quantity, 0)

  return (
    <Ctx.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalAmount }}>
      {children}
    </Ctx.Provider>
  )
}

export const useCart = () => useContext(Ctx)
