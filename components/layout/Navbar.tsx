'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Menu, Globe, User, LogOut, Package, ChevronDown, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useLang } from '@/context/LanguageContext'
import { useCart } from '@/context/CartContext'
import { t } from '@/lib/translations'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'

export default function Navbar() {
  const { lang, isAr, toggleLang } = useLang()
  const { totalItems } = useCart()
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.push('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { href: '/products', label: t(lang, 'nav.products') },
    { href: '/brands', label: t(lang, 'nav.brands') },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-red-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm tracking-tight">RC</span>
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">
              ROCA <span className="text-red-700">CONNECT</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-red-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t(lang, 'search.placeholder')}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLang}
              className="hidden sm:flex items-center gap-1 text-xs font-medium text-gray-600"
            >
              <Globe className="h-4 w-4" />
              {isAr ? 'EN' : 'عربي'}
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-700 hover:bg-red-700">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Dropdown */}
            <div className="hidden sm:block">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-gray-100 transition-colors">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-red-700 text-white text-xs">
                        {profile?.full_name?.charAt(0)?.toUpperCase() ?? user.email?.charAt(0)?.toUpperCase() ?? 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3 w-3 text-gray-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{profile?.full_name ?? 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/profile')} className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t(lang, 'nav.profile')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/orders')} className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      {t(lang, 'nav.orders')}
                    </DropdownMenuItem>
                    {(profile?.role === 'admin' || profile?.role === 'salesman') && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(profile?.role === 'admin' ? '/admin' : '/salesman')}>
                          {profile?.role === 'admin' ? t(lang, 'nav.admin') : t(lang, 'nav.salesman')}
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      {t(lang, 'auth.signOut')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-sm">
                      {t(lang, 'auth.signIn')}
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-red-700 hover:bg-red-800 text-white text-sm">
                      {t(lang, 'auth.register')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side={isAr ? 'right' : 'left'} className="w-72">
                <div className="flex flex-col gap-4 mt-6">
                  {/* Logo */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-9 h-9 bg-red-700 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">RC</span>
                    </div>
                    <span className="font-bold text-gray-900 text-lg">ROCA CONNECT</span>
                  </div>

                  {/* Mobile Search */}
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t(lang, 'search.placeholder')}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20"
                      />
                    </div>
                  </form>

                  {/* Nav Links */}
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-base font-medium text-gray-700 hover:text-red-700 py-2 border-b border-gray-100"
                    >
                      {link.label}
                    </Link>
                  ))}

                  {/* Auth */}
                  {user ? (
                    <div className="flex flex-col gap-2 mt-2">
                      <Link href="/profile" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700 hover:text-red-700 py-2">
                        {t(lang, 'nav.profile')}
                      </Link>
                      <Link href="/orders" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700 hover:text-red-700 py-2">
                        {t(lang, 'nav.orders')}
                      </Link>
                      <button onClick={handleSignOut} className="text-sm text-red-600 text-left py-2">
                        {t(lang, 'auth.signOut')}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 mt-2">
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full">{t(lang, 'auth.signIn')}</Button>
                      </Link>
                      <Link href="/register" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full bg-red-700 hover:bg-red-800 text-white">{t(lang, 'auth.register')}</Button>
                      </Link>
                    </div>
                  )}

                  {/* Lang Toggle */}
                  <Button variant="outline" size="sm" onClick={toggleLang} className="mt-2 w-full">
                    <Globe className="h-4 w-4 mr-2" />
                    {isAr ? 'Switch to English' : 'التبديل إلى العربية'}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
