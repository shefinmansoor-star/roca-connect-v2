'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, ShoppingCart, Package, Tag, Grid3X3, Users, LogOut,
  ChevronLeft, ChevronRight, Globe, Store
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLang } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, labelKey: 'admin.dashboard' as const, exact: true },
  { href: '/admin/orders', icon: ShoppingCart, labelKey: 'admin.orders' as const },
  { href: '/admin/products', icon: Package, labelKey: 'admin.products' as const },
  { href: '/admin/brands', icon: Tag, labelKey: 'admin.brands' as const },
  { href: '/admin/categories', icon: Grid3X3, labelKey: 'admin.categories' as const },
  { href: '/admin/customers', icon: Users, labelKey: 'admin.customers' as const },
]

export default function AdminSidebar() {
  const { lang, isAr, toggleLang } = useLang()
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={cn(
        'bg-gray-900 text-white flex flex-col transition-all duration-300 shrink-0',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-700 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">RC</span>
            </div>
            <span className="font-bold text-sm truncate">
              ROCA <span className="text-red-400">ADMIN</span>
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-red-700 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xs">RC</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn('text-gray-400 hover:text-white transition-colors', collapsed && 'mx-auto mt-2 block')}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ href, icon: Icon, labelKey, exact }) => (
          <Link key={href} href={href}>
            <div
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer',
                isActive(href, exact)
                  ? 'bg-red-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && <span>{t(lang, labelKey)}</span>}
            </div>
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-gray-800 space-y-1">
        <button
          onClick={toggleLang}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all w-full',
            collapsed && 'justify-center px-2'
          )}
        >
          <Globe className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span>{isAr ? 'English' : 'عربي'}</span>}
        </button>

        <Link href="/">
          <div className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all cursor-pointer',
            collapsed && 'justify-center px-2'
          )}>
            <Store className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>{t(lang, 'admin.backToStore')}</span>}
          </div>
        </Link>

        <button
          onClick={handleSignOut}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 transition-all w-full',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span>{t(lang, 'auth.signOut')}</span>}
        </button>
      </div>
    </aside>
  )
}
