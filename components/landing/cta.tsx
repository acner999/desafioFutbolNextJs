"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n'

export function CTA() {
  const { t } = useLanguage()

  return (
    <section className="bg-primary py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Title */}
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
            {t('landing.cta.title')}
          </h2>

          {/* Subtitle */}
          <p className="mb-8 text-pretty text-lg text-primary-foreground/80">
            {t('landing.cta.subtitle')}
          </p>

          {/* CTA Button */}
          <Link href="/register">
            <Button 
              size="lg" 
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {t('landing.cta.button')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-primary-foreground md:text-4xl">500+</div>
              <div className="mt-1 text-sm text-primary-foreground/70">Equipos Registrados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-foreground md:text-4xl">2,500+</div>
              <div className="mt-1 text-sm text-primary-foreground/70">Desafios Completados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-foreground md:text-4xl">50+</div>
              <div className="mt-1 text-sm text-primary-foreground/70">Torneos Activos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
