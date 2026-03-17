"use client"

import Link from 'next/link'
import { ArrowRight, Play, Shield, Zap, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n'

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">
              {t('common.tagline')}
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {t('landing.hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            {t('landing.hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                {t('landing.hero.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Play className="mr-2 h-4 w-4" />
                {t('landing.hero.ctaSecondary')}
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">500+ Equipos</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">100% Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">Bilingue ES/PT</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Dashboard Preview */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="relative rounded-xl border border-border bg-card p-2 shadow-2xl">
            <div className="overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
              {/* Mock Dashboard Preview */}
              <div className="aspect-[16/9] p-6 md:p-8">
                <div className="grid h-full gap-4 md:grid-cols-3">
                  {/* Stats Cards */}
                  <div className="rounded-lg bg-card/80 p-4 backdrop-blur">
                    <div className="mb-2 text-sm text-muted-foreground">Partidos Jugados</div>
                    <div className="text-3xl font-bold text-foreground">45</div>
                    <div className="mt-1 text-sm text-accent">+5 este mes</div>
                  </div>
                  <div className="rounded-lg bg-card/80 p-4 backdrop-blur">
                    <div className="mb-2 text-sm text-muted-foreground">Victorias</div>
                    <div className="text-3xl font-bold text-foreground">28</div>
                    <div className="mt-1 text-sm text-accent">62% efectividad</div>
                  </div>
                  <div className="rounded-lg bg-card/80 p-4 backdrop-blur">
                    <div className="mb-2 text-sm text-muted-foreground">Ranking</div>
                    <div className="text-3xl font-bold text-foreground">#3</div>
                    <div className="mt-1 text-sm text-accent">Zona Encarnacion</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
