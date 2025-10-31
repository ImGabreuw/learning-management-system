"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Bell, GraduationCap } from "lucide-react"
import { useAuth } from "@/context/AuthContext" // 1. Importar o useAuth

export default function Navigation() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // 2. Obter o usuário e a função de logout do contexto
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", controlNavbar)
    return () => window.removeEventListener("scroll", controlNavbar)
  }, [lastScrollY])

  const notifications = [
    // ... (dados mockados de notificação permanecem por enquanto)
    {
      id: 1,
      title: "Nova atividade disponível",
      message: "Atividade de Laboratório 02 foi publicada em Computação Distribuída",
      time: "Há 2 horas",
      read: false,
    },
    // ...
  ]

  // 3. Criar a função de handleLogout
  // Ela chama a função de logout do AuthContext, que já faz tudo:
  // - Chama a API /api/auth/logout
  // - Limpa o localStorage
  // - Redireciona para /login
  const handleLogout = () => {
    logout();
  }

  return (
    <nav
      className={`bg-white/80 backdrop-blur-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">Metis</h1>
            </div>
          </Link>

          {/* 4. Só renderiza os botões da direita se o usuário estiver autenticado */}
          {isAuthenticated && user && (
            <div className="flex items-center space-x-4">
              <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                <DropdownMenuTrigger className="relative inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
                  <Bell className="h-5 w-5" />
                  {notifications.some((n) => !n.read) && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 z-[100]" align="end">
                  {/* ... (conteúdo do dropdown de notificações) ... */}
                  <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-pointer">
                        {/* ... */}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
                  <Avatar className="h-8 w-8">
                    {/* 5. Substituir dados estáticos pelos dados do usuário */}
                    <AvatarImage src={"/student-avatar.png"} alt={user.name} /> 
                    {/* (Nota: o backend não está enviando um avatar, então mantemos o mock por enquanto) */}
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 z-[100]" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      {/* 6. Substituir dados estáticos pelos dados do usuário */}
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {/* 7. Alterar o item de "Sair" */}
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="flex items-center cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}