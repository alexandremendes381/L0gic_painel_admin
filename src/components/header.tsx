"use client"

import { Button } from "@/components/ui/button"

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          🔍
          <span className="sr-only">Pesquisar</span>
        </Button>
        
        <Button variant="ghost" size="icon">
          🔔
          <span className="sr-only">Notificações</span>
        </Button>
        
        <Button variant="ghost" size="icon">
          👤
          <span className="sr-only">Perfil do usuário</span>
        </Button>
      </div>
    </header>
  )
}