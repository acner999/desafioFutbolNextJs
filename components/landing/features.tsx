"use client"

import { Swords, Trophy, Users, Wallet, MessageSquare, Languages } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

const featureIcons = {
  challenges: Swords,
  tournaments: Trophy,
  team: Users,
  finance: Wallet,
  communication: MessageSquare,
  bilingual: Languages,
}

export function Features() {
  const { t } = useLanguage()

  const features = [
    { key: 'challenges', icon: featureIcons.challenges },
    { key: 'tournaments', icon: featureIcons.tournaments },
    { key: 'team', icon: featureIcons.team },
    { key: 'finance', icon: featureIcons.finance },
    { key: 'communication', icon: featureIcons.communication },
    { key: 'bilingual', icon: featureIcons.bilingual },
  ]

  return (
    <section id="features" className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t('landing.features.title')}
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            {t('landing.features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.key}
                className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {t(`landing.features.${feature.key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`landing.features.${feature.key}.description`)}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
