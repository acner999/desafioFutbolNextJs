"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLanguage } from '@/lib/i18n'
import { useAuth } from '@/lib/contexts/auth-context'

export default function NuevoDesafioPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    teamId: '',
    date: '',
    time: '',
    venue: '',
    betAmount: '',
    message: '',
  })

  const { user } = useAuth()
  const [allTeams, setAllTeams] = useState<any[]>([])
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/teams')
        const json = await res.json()
        setAllTeams((json.teams || []).filter((t: any) => t.id !== user?.teamId))
      } catch (err) {
        console.warn('[NuevoDesafio] load teams failed', err)
      }
    }
    load()
  }, [user?.teamId])

  // Get available teams to challenge (exclude current team)
  const availableTeams = allTeams

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirect to challenges list
    router.push('/dashboard/desafios')
  }

  const selectedTeam = availableTeams.find(
    (t) => Number(t.id) === Number(formData.teamId)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/desafios">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {t('challenges.new')}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Envia un desafio a otro equipo
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Desafio</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Select Team */}
                <div className="space-y-2">
                  <Label htmlFor="team">{t('challenges.form.selectTeam')}</Label>
                  <Select
                    value={formData.teamId}
                    onValueChange={(value) => handleChange('teamId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar equipo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTeams.map(team => (
                        <SelectItem key={team.id} value={team.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-4 w-4 rounded"
                              style={{ backgroundColor: team.colors.primary }}
                            />
                            {team.name} ({team.city})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date and Time */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">{t('challenges.form.date')}</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">{t('challenges.form.time')}</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleChange('time', e.target.value)}
                    />
                  </div>
                </div>

                {/* Venue */}
                <div className="space-y-2">
                  <Label htmlFor="venue">{t('challenges.form.venue')}</Label>
                  <Input
                    id="venue"
                    placeholder="Cancha Municipal, Complejo Deportivo..."
                    value={formData.venue}
                    onChange={(e) => handleChange('venue', e.target.value)}
                  />
                </div>

                {/* Bet Amount (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="betAmount">{t('challenges.form.betAmount')}</Label>
                  <div className="relative">
                    <Input
                      id="betAmount"
                      type="number"
                      placeholder="0"
                      value={formData.betAmount}
                      onChange={(e) => handleChange('betAmount', e.target.value)}
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      Gs
                    </span>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">{t('challenges.form.message')}</Label>
                  <Textarea
                    id="message"
                    placeholder="Escribe un mensaje para el equipo rival..."
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={!formData.teamId || !formData.date || !formData.venue || isSubmitting}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t('challenges.form.submit')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vista Previa</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTeam ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-12 w-12 rounded-xl"
                      style={{ backgroundColor: selectedTeam.colors.primary }}
                    />
                    <div>
                      <p className="font-semibold text-foreground">{selectedTeam.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedTeam.city}, {selectedTeam.country === 'PY' ? 'Paraguay' : 'Brasil'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    <p className="mb-1 font-medium">Estadisticas del rival:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span>Partidos: {selectedTeam.stats.matchesPlayed}</span>
                      <span>Victorias: {selectedTeam.stats.wins}</span>
                      <span>Goles: {selectedTeam.stats.goalsFor}</span>
                      <span>Puntos: {selectedTeam.stats.points}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  Selecciona un equipo para ver su informacion
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
