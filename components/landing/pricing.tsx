"use client"

import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function Pricing() {
  const { t } = useLanguage()

  const plans = [
    {
      key: 'free',
      popular: false,
    },
    {
      key: 'pro',
      popular: true,
    },
    {
      key: 'premium',
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t('landing.pricing.title')}
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            {t('landing.pricing.subtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const features = t(`landing.pricing.${plan.key}.features`) as unknown as string[]
            
            return (
              <div
                key={plan.key}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg",
                  plan.popular 
                    ? "border-accent shadow-accent/20" 
                    : "border-border"
                )}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-accent-foreground">
                    Recomendado
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6 text-center">
                  <h3 className="mb-2 text-xl font-bold text-foreground">
                    {t(`landing.pricing.${plan.key}.name`)}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {t(`landing.pricing.${plan.key}.description`)}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      {t(`landing.pricing.${plan.key}.price`)}
                    </span>
                    {plan.key !== 'free' && (
                      <span className="text-sm text-muted-foreground">
                        {t(`landing.pricing.${plan.key}.period`)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <ul className="mb-6 flex-1 space-y-3">
                  {Array.isArray(features) && features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link href="/register" className="mt-auto">
                  <Button 
                    className={cn(
                      "w-full",
                      plan.popular 
                        ? "bg-accent text-accent-foreground hover:bg-accent/90" 
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    {t('landing.pricing.cta')}
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
