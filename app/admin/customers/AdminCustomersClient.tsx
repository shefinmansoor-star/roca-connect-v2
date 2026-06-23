'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useLang } from '@/context/LanguageContext'
import type { Profile } from '@/types/database'

interface AdminCustomersClientProps {
  customers: Profile[]
}

export default function AdminCustomersClient({ customers }: AdminCustomersClientProps) {
  const { isAr } = useLang()
  const [search, setSearch] = useState('')

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase()
    return (
      (c.full_name ?? '').toLowerCase().includes(q) ||
      (c.company_name ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-6 max-w-7xl" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isAr ? 'العملاء' : 'Customers'}</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} {isAr ? 'عميل' : 'customers'}</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'بحث...' : 'Search by name or company...'}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 w-64"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isAr ? 'الاسم' : 'Name'}</TableHead>
                <TableHead>{isAr ? 'الشركة' : 'Company'}</TableHead>
                <TableHead>{isAr ? 'البريد' : 'Email'}</TableHead>
                <TableHead>{isAr ? 'الهاتف' : 'Phone'}</TableHead>
                <TableHead>{isAr ? 'المدينة' : 'City'}</TableHead>
                <TableHead>{isAr ? 'تاريخ الانضمام' : 'Joined'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    {isAr ? 'لا يوجد عملاء' : 'No customers found'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.full_name ?? '-'}</TableCell>
                    <TableCell className="text-sm text-gray-500">{customer.company_name ?? '-'}</TableCell>
                    <TableCell className="text-sm text-gray-500">{customer.email ?? '-'}</TableCell>
                    <TableCell className="text-sm text-gray-500">{customer.phone ?? '-'}</TableCell>
                    <TableCell className="text-sm text-gray-500">{customer.city ?? '-'}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(customer.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
