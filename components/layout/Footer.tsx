'use client'

import Link from 'next/link'
import { useLang } from '@/context/LanguageContext'
import { t } from '@/lib/translations'

export default function Footer() {
  const { lang, isAr } = useLang()

  return (
    <footer className="bg-gray-900 text-white" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RC</span>
              </div>
              <span className="font-bold text-white text-lg">
                ROCA <span className="text-red-400">CONNECT</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {isAr
                ? 'منصة المنتجات الاحترافية لقطاع السيارات في المملكة العربية السعودية'
                : 'Professional automotive products platform for the Saudi Arabian market.'}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              {t(lang, 'footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/products', label: t(lang, 'nav.products') },
                { href: '/brands', label: t(lang, 'nav.brands') },
                { href: '/orders', label: t(lang, 'nav.orders') },
                { href: '/cart', label: t(lang, 'nav.cart') },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              {t(lang, 'footer.account')}
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/login', label: t(lang, 'auth.signIn') },
                { href: '/register', label: t(lang, 'auth.register') },
                { href: '/profile', label: t(lang, 'nav.profile') },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-sm">
            © 2025 ROCA Trading Company. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            {isAr ? 'شركة روكا للتجارة — المملكة العربية السعودية' : 'ROCA Trading Company — Saudi Arabia'}
          </p>
        </div>
      </div>
    </footer>
  )
}
