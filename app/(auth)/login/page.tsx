'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLang } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const { lang, isAr, toggleLang } = useLang()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError

      // Fetch profile to determine role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profile?.role === 'admin') {
        router.push('/admin')
      } else if (profile?.role === 'salesman') {
        router.push('/salesman')
      } else {
        router.push(redirect)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed'
      setError(isAr ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Lang toggle */}
      <button
        onClick={toggleLang}
        className="absolute top-6 right-6 flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-700 transition-colors"
      >
        <Globe className="h-4 w-4" />
        {isAr ? 'EN' : 'عربي'}
      </button>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-red-700 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">RC</span>
          </div>
          <span className="font-bold text-gray-900 text-xl">ROCA CONNECT</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl">{t(lang, 'auth.signIn')}</CardTitle>
            <p className="text-center text-sm text-gray-500 mt-1">{t(lang, 'auth.signInDesc')}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">{t(lang, 'auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">{t(lang, 'auth.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800 text-white py-5 text-base"
                disabled={loading}
              >
                {loading ? (isAr ? 'جاري تسجيل الدخول...' : 'Signing in...') : t(lang, 'auth.signIn')}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              {t(lang, 'auth.noAccount')}{' '}
              <Link href="/register" className="text-red-700 font-semibold hover:underline">
                {t(lang, 'auth.register')}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
