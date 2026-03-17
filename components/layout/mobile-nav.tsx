"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Swords, Trophy, Users, User } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: t('nav.home') },
    { href: '/dashboard/desafios', icon: Swords, label: t('nav.challenges') },
    { href: '/dashboard/torneos', icon: Trophy, label: t('nav.tournaments') },
    { href: '/dashboard/equipo', icon: Users, label: t('nav.team') },
    { href: '/dashboard/perfil', icon: User, label: t('nav.profile') },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors",
                isActive 
                  ? "text-accent" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-accent")} />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 h-0.5 w-12 rounded-full bg-accent" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
