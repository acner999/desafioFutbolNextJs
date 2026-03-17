"use client"

import { Bell, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LanguageToggle } from '@/components/layout/language-toggle'
import { useLanguage } from '@/lib/i18n'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'

// Dashboard header loads current team and unread notifications from the API

interface DashboardHeaderProps {
  onMenuClick?: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [unreadNotifications, setUnreadNotifications] = useState<any[]>([])
  const [team, setTeam] = useState<any | null>(null)

  useEffect(() => {
    async function load() {
      if (!user?.teamId) return
      try {
        const [teamRes, notifRes] = await Promise.all([
          fetch(`/api/teams/${user.teamId}`),
          fetch(`/api/notifications?teamId=${user.teamId}`).catch(() => ({ ok: false })),
        ])

        if (teamRes.ok) {
          const teamJson = await teamRes.json()
          setTeam(teamJson.team || null)
        }

        if (notifRes && notifRes.ok) {
          const notifJson = await notifRes.json()
          setUnreadNotifications((notifJson.notifications || []).filter((n:any)=>!n.read))
        }
      } catch (err) {
        console.warn('[DashboardHeader] load failed', err)
      }
    }
    load()
  }, [user?.teamId])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="hidden md:block">
          <div className="flex items-center gap-3">
            <div 
              className="h-10 w-10 rounded-lg"
              style={{ backgroundColor: team?.colors?.primary || '#ccc' }}
            />
            <div>
              <div className="font-semibold text-foreground">{team?.name || 'Equipo'}</div>
              <div className="text-xs text-muted-foreground">
                {team?.city ? `${team.city}, ${team.country === 'PY' ? 'Paraguay' : 'Brasil'}` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <LanguageToggle />
        
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications.length > 0 && (
                <Badge 
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-accent p-0 text-xs text-accent-foreground"
                >
                  {unreadNotifications.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-3 py-2 font-semibold">{t('notifications.title')}</div>
              {unreadNotifications.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                {t('notifications.empty')}
              </div>
            ) : (
              unreadNotifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3">
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-xs text-muted-foreground">{notification.message}</div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
