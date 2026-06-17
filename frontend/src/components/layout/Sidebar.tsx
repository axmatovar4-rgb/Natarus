'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { clsx } from 'clsx';
import {
  LayoutDashboard, FileText, Users,
  PlusCircle, LogOut, User, Search,
} from 'lucide-react';

const notariusLinks = [
  { href: '/dashboard',                    label: 'Bosh sahifa', icon: LayoutDashboard },
  { href: '/dashboard/applications',       label: 'Arizalar',    icon: FileText },
  { href: '/dashboard/clients',            label: 'Mijozlar',    icon: Users },
];

const clientLinks = [
  { href: '/dashboard',                        label: 'Bosh sahifa',       icon: LayoutDashboard },
  { href: '/dashboard/applications',           label: 'Mening arizalarim', icon: FileText },
  { href: '/dashboard/applications/new',       label: 'Yangi ariza',       icon: PlusCircle },
  { href: '/dashboard/applications/track',     label: 'Ariza kuzatish',    icon: Search },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const links = user?.role === 'NOTARIUS' ? notariusLinks : clientLinks;

  return (
    <aside className="w-64 bg-[#1a3a4a] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#2d6a7a]/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f5a623] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">Natarus</p>
            <p className="text-[#c5d9e0] text-xs mt-0.5">Notarial xizmat</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-[#2d6a7a] text-white'
                : 'text-[#c5d9e0] hover:bg-[#2d6a7a]/40 hover:text-white',
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-[#2d6a7a]/40">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-[#2d6a7a] rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.fullName}</p>
            <p className="text-[#c5d9e0] text-xs">
              {user?.role === 'NOTARIUS' ? 'Notarius' : 'Mijoz'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-[#c5d9e0] hover:text-white text-sm w-full px-2 py-2 rounded-lg hover:bg-[#2d6a7a]/40 transition-colors"
        >
          <LogOut size={16} />
          Chiqish
        </button>
      </div>
    </aside>
  );
}
