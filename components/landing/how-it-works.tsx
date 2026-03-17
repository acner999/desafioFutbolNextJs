"use client"

import { UserPlus, Search, Trophy } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

export function HowItWorks() {
  const { t } = useLanguage()

  const steps = [
    { key: 'step1', icon: UserPlus, number: '01' },
    { key: 'step2', icon: Search, number: '02' },
    { key: 'step3', icon: Trophy, number: '03' },
  ]

  return (
    <section id="how-it-works" className="bg-primary/5 py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t('landing.howItWorks.title')}
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            {t('landing.howItWorks.subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.key} className="relative">
                {/* Connector Line (hidden on mobile, visible between items on desktop) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-16 hidden h-0.5 w-full -translate-x-1/2 bg-gradient-to-r from-accent to-accent/30 md:block" />
                )}

                <div className="relative flex flex-col items-center text-center">
                  {/* Number Badge */}
                  <div className="absolute -top-3 right-1/2 translate-x-1/2 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground md:right-auto md:translate-x-0">
                    {step.number}
                  </div>

                  {/* Icon Circle */}
                  <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full border-4 border-accent/20 bg-card shadow-lg">
                    <Icon className="h-12 w-12 text-accent" />
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-semibold text-foreground">
                    {t(`landing.howItWorks.${step.key}.title`)}
                  </h3>
                  <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {t(`landing.howItWorks.${step.key}.description`)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
