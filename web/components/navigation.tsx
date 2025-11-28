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
import { useAuth } from "@/context/AuthContext"
import { getUnreadNotifications, markNotificationAsRead, markAllNotificationsAsRead, Notification } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Navigation() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(false)

  // 2. Obter o usuário e a função de logout do contexto
  const { user, isAuthenticated, logout } = useAuth();

  // Carregar notificações não lidas
  useEffect(() => {
    const loadNotifications = async () => {
      if (!isAuthenticated) return
      
      try {
        setLoadingNotifications(true)
        const unread = await getUnreadNotifications()
        setNotifications(unread)
      } catch (err) {
        console.error('Erro ao carregar notificações:', err)
        // Fallback para mock se API falhar
        setNotifications(mockNotifications)
      } finally {
        setLoadingNotifications(false)
      }
    }

    loadNotifications()
    
    // Recarregar a cada 30 segundos
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

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

  // Dados mock de notificação como fallback
  const mockNotifications: Notification[] = [
    {
      id: "1",
      userId: "user",
      title: "Nova atividade disponível",
      message: "Atividade de Laboratório 02 foi publicada em Computação Distribuída",
      type: "TASK_ASSIGNED",
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      userId: "user",
      title: "Prazo se aproximando",
      message: "A entrega da Lista de Exercícios 01 vence em 2 dias",
      type: "TASK_DUE_SOON",
      read: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
  ]

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ))
    } catch (err) {
      console.error('Erro ao marcar como lida:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error('Erro ao marcar todas como lidas:', err)
    }
  }

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return 'Agora'
    if (seconds < 3600) return `Há ${Math.floor(seconds / 60)} min`
    if (seconds < 86400) return `Há ${Math.floor(seconds / 3600)}h`
    return `Há ${Math.floor(seconds / 86400)} dias`
  }

  // 3. Criar a função de handleLogout
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

          {/* Links de navegação */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                href="/disciplines" 
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Disciplinas
              </Link>
              <Link 
                href="/files" 
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Arquivos
              </Link>
            </div>
          )}

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
                  <div className="flex items-center justify-between p-3 border-b">
                    <DropdownMenuLabel className="p-0">Notificações</DropdownMenuLabel>
                    {notifications.some(n => !n.read) && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={handleMarkAllAsRead}
                      >
                        Marcar todas como lidas
                      </Button>
                    )}
                  </div>
                  <DropdownMenuSeparator className="my-0" />
                  <ScrollArea className="h-[400px]">
                    {loadingNotifications ? (
                      <div className="p-8 text-center text-sm text-muted-foreground">
                        Carregando...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-8 text-center text-sm text-muted-foreground">
                        Nenhuma notificação
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <DropdownMenuItem 
                          key={notification.id} 
                          className={`flex flex-col items-start p-3 cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <div className="flex items-start justify-between w-full mb-1">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {getTimeAgo(notification.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                          )}
                        </DropdownMenuItem>
                      ))
                    )}
                  </ScrollArea>
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