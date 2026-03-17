"use client"

import { User, Mail, Shield, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLanguage } from '@/lib/i18n'
import { useAuth } from '@/lib/contexts/auth-context'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const { t, language, setLanguage } = useLanguage()
  const { user, logout } = useAuth()
  const [team, setTeam] = useState<any | null>(null)

  useEffect(() => {
    async function load() {
      if (!user?.teamId) return
      try {
        const res = await fetch(`/api/teams/${user.teamId}`)
        if (res.ok) {
          const json = await res.json()
          setTeam(json.team || null)
        }
      } catch (err) {
        console.warn('[Profile] load team failed', err)
      }
    }
    load()
  }, [user?.teamId])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          {t('profile.title')}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Administra tu cuenta y preferencias
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('profile.personalInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{user?.name}</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-accent">
                    <Shield className="h-3 w-3" />
                    Presidente - {team?.name}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input 
                    id="name" 
                    defaultValue={user?.name} 
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electronico</Label>
                  <Input 
                    id="email" 
                    type="email"
                    defaultValue={user?.email} 
                    className="bg-muted/50"
                  />
                </div>
              </div>

              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                {t('common.save')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Settings Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Preferencias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Language */}
              <div className="space-y-2">
                <Label>{t('profile.language')}</Label>
                <Select value={language} onValueChange={(value) => setLanguage(value as 'es' | 'pt')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">
                      <div className="flex items-center gap-2">
                        <span>🇵🇾</span>
                        Espanol
                      </div>
                    </SelectItem>
                    <SelectItem value="pt">
                      <div className="flex items-center gap-2">
                        <span>🇧🇷</span>
                        Portugues
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Theme */}
              <div className="space-y-2">
                <Label>{t('profile.theme')}</Label>
                <Select defaultValue="light">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t('profile.themes.light')}</SelectItem>
                    <SelectItem value="dark">{t('profile.themes.dark')}</SelectItem>
                    <SelectItem value="system">{t('profile.themes.system')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Equipo Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div 
                  className="h-12 w-12 rounded-xl"
                  style={{ backgroundColor: team?.colors?.primary }}
                />
                <div>
                  <p className="font-semibold text-foreground">{team?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {team?.city ? `${team.city}, ${team.country === 'PY' ? 'Paraguay' : 'Brasil'}` : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            variant="destructive" 
            className="w-full"
            onClick={logout}
          >
            {t('common.logout')}
          </Button>
        </div>
      </div>
    </div>
  )
}
