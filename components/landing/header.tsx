"use client"

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LanguageToggle } from '@/components/layout/language-toggle'
import { useLanguage } from '@/lib/i18n'

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            {t('common.appName')}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link 
            href="#features" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('landing.footer.links.features')}
          </Link>
          <Link 
            href="#how-it-works" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('landing.howItWorks.title')}
          </Link>
          <Link 
            href="#pricing" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('landing.footer.links.pricing')}
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              {t('common.login')}
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              {t('common.register')}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-border md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
            <Link 
              href="#features" 
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('landing.footer.links.features')}
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('landing.howItWorks.title')}
            </Link>
            <Link 
              href="#pricing" 
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('landing.footer.links.pricing')}
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  {t('common.login')}
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  {t('common.register')}
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
