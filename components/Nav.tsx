'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const NAV = [
  { href: '/offer-studio', label: 'Offer Studio', roles: ['TA', 'Admin'] },
  { href: '/records', label: 'Records', roles: ['TA', 'Admin', 'Viewer'] },
  { href: '/policy', label: 'Policy', roles: ['TA', 'Admin', 'Viewer'] },
  { href: '/reports', label: 'Reports', roles: ['TA', 'Admin', 'Viewer'] },
]

interface Props { role: string; name: string }

export default function Nav({ role, name }: Props) {
  const path = usePathname()
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <span className="font-semibold text-sm text-gray-900 mr-4">TA Tool</span>
        {NAV.filter(n => n.roles.includes(role)).map(n => (
          <Link key={n.href} href={n.href}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              path.startsWith(n.href)
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}>
            {n.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">{name} · {role}</span>
        <button onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="text-xs text-gray-400 hover:text-gray-600">Sign out</button>
      </div>
    </nav>
  )
}
