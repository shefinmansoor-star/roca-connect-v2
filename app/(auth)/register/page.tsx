'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Globe, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLang } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const { lang, isAr, toggleLang } = useLang()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirm: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirm) {
      setError(isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match')
      return
    }
    if (formData.password.length < 8) {
      setError(isAr ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })
      if (signUpError) throw signUpError
      if (!data.user) throw new Error('No user returned')

      // Update profile
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: formData.full_name,
        company_name: formData.company_name,
        phone: formData.phone,
        city: formData.city,
        role: 'customer',
      })

      setSuccess(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" dir={isAr ? 'rtl' : 'ltr'}>
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12 px-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-5" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isAr ? 'تم التسجيل بنجاح!' : 'Registration Successful!'}
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              {isAr
                ? 'تحقق من بريدك الإلكتروني لتأكيد حسابك.'
                : 'Please check your email to confirm your account.'}
            </p>
            <Link href="/login">
              <Button className="bg-red-700 hover:bg-red-800 text-white w-full">
                {t(lang, 'auth.signIn')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative" dir={isAr ? 'rtl' : 'ltr'}>
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
            <CardTitle className="text-center text-xl">{t(lang, 'auth.register')}</CardTitle>
            <p className="text-center text-sm text-gray-500 mt-1">{t(lang, 'auth.registerDesc')}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="full_name">{t(lang, 'auth.fullName')}</Label>
                  <Input id="full_name" value={formData.full_name} onChange={set('full_name')} required />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="company_name">{t(lang, 'auth.companyName')}</Label>
                  <Input id="company_name" value={formData.company_name} onChange={set('company_name')} required />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="email">{t(lang, 'auth.email')}</Label>
                  <Input id="email" type="email" value={formData.email} onChange={set('email')} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">{t(lang, 'auth.phone')}</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={set('phone')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city">{t(lang, 'auth.city')}</Label>
                  <Input id="city" value={formData.city} onChange={set('city')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">{t(lang, 'auth.password')}</Label>
                  <Input id="password" type="password" value={formData.password} onChange={set('password')} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm">{t(lang, 'auth.confirmPassword')}</Label>
                  <Input id="confirm" type="password" value={formData.confirm} onChange={set('confirm')} required />
                </div>
              </div>

              {error && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800 text-white py-5 text-base"
                disabled={loading}
              >
                {loading ? (isAr ? 'جاري التسجيل...' : 'Creating account...') : t(lang, 'auth.register')}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              {t(lang, 'auth.hasAccount')}{' '}
              <Link href="/login" className="text-red-700 font-semibold hover:underline">
                {t(lang, 'auth.signIn')}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
