"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trophy, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLanguage } from '@/lib/i18n'
import { useAuth } from '@/lib/contexts/auth-context'

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { register, isLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cedula: '',
    teamName: '',
    city: '',
    country: 'PY' as 'PY' | 'BR',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.email) {
      setError(t('auth.errors.emailRequired'))
      return
    }
    if (!formData.password) {
      setError(t('auth.errors.passwordRequired'))
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.errors.passwordMismatch'))
      return
    }

    const success = await register(formData)
    
    if (success) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="grid min-h-screen overflow-hidden lg:grid-cols-2">
      {/* Left Panel - Branding (hidden on mobile) */}
      <div className="hidden bg-gradient-to-br from-primary via-primary to-primary/80 lg:flex lg:items-center lg:justify-center">
        <div className="max-w-md px-8 text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Trophy className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white">
            {t('common.appName')}
          </h2>
          <p className="text-lg text-white/80">
            {t('landing.hero.subtitle')}
          </p>
          
          {/* Features Preview */}
          <div className="mt-12 space-y-4 text-left">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
              <div className="font-medium text-white">Sistema de Desafios</div>
              <div className="text-sm text-white/70">Reta a cualquier equipo</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
              <div className="font-medium text-white">Gestion de Torneos</div>
              <div className="text-sm text-white/70">Fixture y tabla automatica</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
              <div className="font-medium text-white">Bilingue ES/PT</div>
              <div className="text-sm text-white/70">Para la frontera</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-col items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm">
          {/* Logo (mobile only) */}
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Trophy className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              {t('common.appName')}
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              {t('auth.register.title')}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('auth.register.subtitle')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.register.name')}</Label>
              <Input
                id="name"
                type="text"
                placeholder="Juan Perez"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="h-11"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.register.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="h-11"
              />
            </div>

            {/* Cedula (opcional, convierte al usuario en jugador) */}
            <div className="space-y-2">
              <Label htmlFor="cedula">{t('auth.register.cedula') || 'Cédula (opcional)'}</Label>
              <Input
                id="cedula"
                type="text"
                placeholder="12345678"
                value={formData.cedula}
                onChange={(e) => handleChange('cedula', e.target.value)}
                className="h-11"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.register.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('auth.register.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className="h-11"
              />
            </div>

            {/* Team Name */}
            <div className="space-y-2">
              <Label htmlFor="teamName">{t('auth.register.teamName')}</Label>
              <Input
                id="teamName"
                type="text"
                placeholder="FC Mi Equipo"
                value={formData.teamName}
                onChange={(e) => handleChange('teamName', e.target.value)}
                className="h-11"
              />
            </div>

            {/* City & Country */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">{t('auth.register.city')}</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Encarnacion"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">{t('auth.register.country')}</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => handleChange('country', value)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PY">Paraguay</SelectItem>
                    <SelectItem value="BR">Brasil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('auth.register.submit')
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t('auth.register.hasAccount')}{' '}
            <Link href="/login" className="font-medium text-accent hover:underline">
              {t('auth.register.loginLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
