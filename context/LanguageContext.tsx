'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Lang } from '@/lib/translations'

interface LangCtx { lang: Lang; isAr: boolean; toggleLang: () => void }
const Ctx = createContext<LangCtx>({ lang: 'en', isAr: false, toggleLang: () => {} })

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('roca_lang') as Lang | null
    if (saved === 'ar' || saved === 'en') apply(saved)
  }, [])

  function apply(l: Lang) {
    setLang(l)
    localStorage.setItem('roca_lang', l)
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = l
  }

  return (
    <Ctx.Provider value={{ lang, isAr: lang === 'ar', toggleLang: () => apply(lang === 'en' ? 'ar' : 'en') }}>
      {children}
    </Ctx.Provider>
  )
}

export const useLang = () => useContext(Ctx)
