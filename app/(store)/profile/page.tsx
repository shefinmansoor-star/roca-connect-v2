'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useLang } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Profile } from '@/types/database'

export default function ProfilePage() {
  const { lang, isAr } = useLang()
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    company_name: '',
    phone: '',
    city: '',
  })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        setForm({
          full_name: data.full_name ?? '',
          company_name: data.company_name ?? '',
          phone: data.phone ?? '',
          city: data.city ?? '',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    try {
      const { error } = await supabase.from('profiles').update({
        full_name: form.full_name,
        company_name: form.company_name,
        phone: form.phone,
        city: form.city,
      }).eq('id', profile.id)
      if (error) throw error
      toast.success(isAr ? 'تم حفظ التغييرات' : 'Profile updated successfully')
    } catch {
      toast.error(isAr ? 'فشل الحفظ' : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10" dir={isAr ? 'rtl' : 'ltr'}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t(lang, 'nav.profile')}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t(lang, 'profile.info')}</CardTitle>
          {profile?.email && <p className="text-sm text-gray-500">{profile.email}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="full_name">{t(lang, 'auth.fullName')}</Label>
                <Input id="full_name" value={form.full_name} onChange={set('full_name')} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="company_name">{t(lang, 'auth.companyName')}</Label>
                <Input id="company_name" value={form.company_name} onChange={set('company_name')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">{t(lang, 'auth.phone')}</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={set('phone')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">{t(lang, 'auth.city')}</Label>
                <Input id="city" value={form.city} onChange={set('city')} />
              </div>
            </div>

            <Separator />

            <div className="flex gap-3">
              <Button type="submit" disabled={saving} className="bg-red-700 hover:bg-red-800 text-white">
                {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : t(lang, 'profile.save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
