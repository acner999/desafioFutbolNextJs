"use client"

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { useEffect } from 'react'

interface InvitesModalProps {
  trigger?: React.ReactNode
}

export default function InvitesModal({ trigger }: InvitesModalProps) {
  const [open, setOpen] = React.useState(false)
  const [invites, setInvites] = React.useState<any[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  async function load() {
    if (!user?.teamId) return
    const res = await fetch(`/api/teams/invites?teamId=${user.teamId}`)
    if (!res.ok) return
    const j = await res.json()
    setInvites(j.invites || [])
  }

  React.useEffect(() => { if (open) load() }, [open, user?.teamId])

  // simple polling for new invites
  useEffect(() => {
    let mounted = true
    let lastCount = invites.length
    const iv = setInterval(async () => {
      if (!user?.teamId) return
      const res = await fetch(`/api/teams/invites?teamId=${user.teamId}`)
      if (!res.ok) return
      const j = await res.json()
      if (!mounted) return
      const newInvites = j.invites || []
      if (newInvites.length > lastCount) {
        toast({ title: 'Nueva invitación', description: 'Tienes nuevas invitaciones al equipo' })
      }
      lastCount = newInvites.length
      setInvites(newInvites)
    }, 10000)
    return () => { mounted = false; clearInterval(iv) }
  }, [user?.teamId])

  async function respond(token: string, action: 'accept' | 'reject') {
    const res = await fetch('/api/teams/respond-invite', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token, action }) })
    const j = await res.json()
    if (res.ok) {
      toast({ title: `Invitación ${action === 'accept' ? 'aceptada' : 'rechazada'}`, description: '' })
      load()
    } else {
      toast({ variant: 'destructive', title: 'Error', description: j.error || JSON.stringify(j) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : <Button>Invitaciones</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitaciones al equipo</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {invites.map((i) => (
            <div key={i.id} className="flex items-center justify-between border p-3 rounded">
              <div>
                <div className="font-medium">{i.invitee_email}</div>
                <div className="text-sm text-muted-foreground">{i.role} — {i.status}</div>
              </div>
              <div className="flex gap-2">
                {i.status === 'pending' && (
                  <>
                    <Button size="sm" onClick={() => respond(i.token, 'accept')}>Aceptar</Button>
                    <Button size="sm" variant="outline" onClick={() => respond(i.token, 'reject')}>Rechazar</Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
