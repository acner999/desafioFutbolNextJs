"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Trophy, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useLanguage } from '@/lib/i18n'
import { useAuth } from '@/lib/contexts/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { login, isLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError(t('auth.errors.emailRequired'))
      return
    }
    if (!password) {
      setError(t('auth.errors.passwordRequired'))
      return
    }

    const success = await login(email, password)
    if (success) {
      router.push('/dashboard')
    } else {
      setError(t('auth.errors.invalidCredentials'))
    }
  }

  return (
    <div className="grid min-h-screen overflow-hidden lg:grid-cols-2">
      {/* ── LEFT: login form ── */}
      <div className="flex flex-col items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Trophy className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">{t('common.appName')}</span>
          </Link>

          <Card className="shadow-lg">
            <CardHeader className="px-6 pt-6">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Trophy className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">{t('auth.login.title')}</CardTitle>
                  <p className="text-xs text-muted-foreground">{t('auth.login.subtitle')}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.login.email')}</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.login.password')}</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" checked={rememberMe} onCheckedChange={(c) => setRememberMe(c as boolean)} />
                    <Label htmlFor="remember" className="text-sm font-normal">{t('auth.login.rememberMe')}</Label>
                  </div>
                  <Link href="#" className="text-sm text-primary hover:underline">{t('auth.login.forgotPassword')}</Link>
                </div>

                <div className="space-y-3">
                  <Button type="submit" disabled={isLoading} className="h-11 w-full">
                    {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('common.loading')}</>) : t('auth.login.submit')}
                  </Button>

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">o</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" className="flex-1 gap-2" onClick={() => signIn('google')}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.9 0 7.2 1.4 9.7 3.9l7.2-7.2C36.2 2.4 30.4 0 24 0 14.5 0 6.4 5.6 2.6 13.6l8.5 6.6C13.9 15 18.6 9.5 24 9.5z"/></svg>
                      <span className="text-sm">Google</span>
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 gap-2" onClick={() => signIn('twitter')}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24"><path fill="#1DA1F2" d="M22 5.9c-.6.3-1.3.6-2 .7.7-.4 1.2-1.1 1.4-1.9-.6.4-1.3.6-2 .8C18.9 4.6 18 4 17 4c-1.6 0-2.9 1.3-2.9 2.9 0 .2 0 .4.1.6C11.8 7.3 9 5.8 7.1 3.9c-.3.6-.4 1.3-.4 2 0 1.3.7 2.4 1.7 3-.5 0-1-.1-1.4-.4 0 1.9 1.3 3.5 3.1 3.9-.3.1-.7.1-1 .1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3 2.3C9.9 18 8 18.6 6 18.6c-.4 0-.7 0-1-.1 1.4.9 3.1 1.4 4.9 1.4 5.8 0 9-4.8 9-8.9v-.4c.6-.4 1.2-1 1.6-1.6-.5.2-1.1.3-1.6.4z"/></svg>
                      <span className="text-sm">Twitter</span>
                    </Button>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/50 p-3 text-center text-xs text-muted-foreground">
                    Inicia sesión con tu email y contraseña o con Google/Twitter.
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t('auth.login.noAccount')}{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">{t('auth.login.registerLink')}</Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT: decorative panel (desktop only) ── */}
      <div className="hidden bg-gradient-to-br from-primary via-primary to-primary/80 lg:flex lg:items-center lg:justify-center">
        <div className="max-w-md px-8 text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Trophy className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white">{t('common.appName')}</h2>
          <p className="text-lg text-white/80">{t('landing.hero.subtitle')}</p>
        </div>
      </div>
    </div>
  )
}
