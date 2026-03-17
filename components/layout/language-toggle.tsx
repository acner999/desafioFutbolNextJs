"use client"

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)

  // Defer rendering the interactive Radix Dropdown until we're on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render a static non-interactive button during SSR to avoid id mismatches
    return (
      <Button variant="ghost" size="sm" className="gap-1.5">
        <Globe className="h-4 w-4" />
        <span className="uppercase">{language}</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <Globe className="h-4 w-4" />
          <span className="uppercase">{language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setLanguage('es')}
          className={language === 'es' ? 'bg-accent/10' : ''}
        >
          <span className="mr-2">🇵🇾</span>
          Espanol
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('pt')}
          className={language === 'pt' ? 'bg-accent/10' : ''}
        >
          <span className="mr-2">🇧🇷</span>
          Portugues
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
