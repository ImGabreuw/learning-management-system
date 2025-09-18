/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Calendar,
  BookOpen,
  Github,
  MessageSquare,
  FileText,
  Video,
  Zap,
  Settings,
  Plus,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Send as Sync,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  status: "connected" | "disconnected" | "error" | "syncing"
  category: "productivity" | "communication" | "development" | "storage" | "calendar"
  features: string[]
  lastSync?: string
  syncFrequency?: "realtime" | "hourly" | "daily" | "manual"
  settings?: Record<string, any>
  data?: any
}

interface ExternalToolsHubProps {
  onConnect?: (integrationId: string) => void
  onDisconnect?: (integrationId: string) => void
  onSync?: (integrationId: string) => void
}

export function ExternalToolsHub({ onConnect, onDisconnect, onSync }: ExternalToolsHubProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Mock integrations data
  const mockIntegrations: Integration[] = [
    {
      id: "google-calendar",
      name: "Google Calendar",
      description: "Sincronize suas aulas, prazos e eventos acadêmicos",
      icon: Calendar,
      status: "connected",
      category: "calendar",
      features: ["Sincronização de eventos", "Lembretes automáticos", "Calendário compartilhado"],
      lastSync: "2 minutos atrás",
      syncFrequency: "realtime",
      settings: {
        autoCreateEvents: true,
        reminderTime: 15,
        calendarId: "primary",
      },
      data: {
        upcomingEvents: 5,
        totalEvents: 23,
      },
    },
    {
      id: "notion",
      name: "Notion",
      description: "Organize suas anotações e projetos acadêmicos",
      icon: BookOpen,
      status: "connected",
      category: "productivity",
      features: ["Sincronização de páginas", "Templates acadêmicos", "Colaboração em tempo real"],
      lastSync: "5 minutos atrás",
      syncFrequency: "hourly",
      settings: {
        workspaceId: "academic-workspace",
        autoSync: true,
        templateSync: true,
      },
      data: {
        pages: 12,
        databases: 3,
      },
    },
    {
      id: "github",
      name: "GitHub",
      description: "Gerencie seus projetos de código e colaborações",
      icon: Github,
      status: "disconnected",
      category: "development",
      features: ["Repositórios de projetos", "Issues e Pull Requests", "Estatísticas de commits"],
      syncFrequency: "daily",
    },
    {
      id: "slack",
      name: "Slack",
      description: "Comunicação com colegas e professores",
      icon: MessageSquare,
      status: "disconnected",
      category: "communication",
      features: ["Canais de disciplinas", "Mensagens diretas", "Notificações de tarefas"],
      syncFrequency: "realtime",
    },
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Acesse e organize seus documentos acadêmicos",
      icon: FileText,
      status: "error",
      category: "storage",
      features: ["Sincronização de arquivos", "Compartilhamento", "Backup automático"],
      lastSync: "Erro há 2 horas",
      syncFrequency: "hourly",
    },
    {
      id: "zoom",
      name: "Zoom",
      description: "Integração com aulas online e reuniões",
      icon: Video,
      status: "syncing",
      category: "communication",
      features: ["Gravações de aulas", "Agendamento automático", "Relatórios de presença"],
      syncFrequency: "manual",
    },
  ]

  useEffect(() => {
    setIntegrations(mockIntegrations)
    // disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "disconnected":
        return <AlertCircle className="h-4 w-4 text-gray-400" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "syncing":
        return <Sync className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "disconnected":
        return "bg-gray-100 text-gray-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "syncing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "connected":
        return "Conectado"
      case "disconnected":
        return "Desconectado"
      case "error":
        return "Erro"
      case "syncing":
        return "Sincronizando"
      default:
        return "Desconhecido"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "productivity":
        return <Zap className="h-4 w-4" />
      case "communication":
        return <MessageSquare className="h-4 w-4" />
      case "development":
        return <Github className="h-4 w-4" />
      case "storage":
        return <FileText className="h-4 w-4" />
      case "calendar":
        return <Calendar className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const handleConnect = async (integration: Integration) => {
    setIsConnecting(integration.id)

    // Simulate connection process
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((int) => (int.id === integration.id ? { ...int, status: "connected", lastSync: "Agora" } : int)),
      )
      setIsConnecting(null)
      onConnect?.(integration.id)
    }, 2000)
  }

  const handleDisconnect = (integration: Integration) => {
    setIntegrations((prev) =>
      prev.map((int) => (int.id === integration.id ? { ...int, status: "disconnected", lastSync: undefined } : int)),
    )
    onDisconnect?.(integration.id)
  }

  const handleSync = (integration: Integration) => {
    setIntegrations((prev) => prev.map((int) => (int.id === integration.id ? { ...int, status: "syncing" } : int)))

    // Simulate sync process
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((int) => (int.id === integration.id ? { ...int, status: "connected", lastSync: "Agora" } : int)),
      )
    }, 3000)

    onSync?.(integration.id)
  }

  const filteredIntegrations =
    selectedCategory === "all" ? integrations : integrations.filter((int) => int.category === selectedCategory)

  const connectedCount = integrations.filter((int) => int.status === "connected").length
  const totalCount = integrations.length

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Conectadas</p>
                <p className="text-2xl font-bold text-green-600">{connectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Total</p>
                <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Sync className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Sincronizando</p>
                <p className="text-2xl font-bold text-purple-600">
                  {integrations.filter((int) => int.status === "syncing").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Com Erro</p>
                <p className="text-2xl font-bold text-red-600">
                  {integrations.filter((int) => int.status === "error").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="productivity">Produtividade</TabsTrigger>
          <TabsTrigger value="communication">Comunicação</TabsTrigger>
          <TabsTrigger value="development">Desenvolvimento</TabsTrigger>
          <TabsTrigger value="storage">Armazenamento</TabsTrigger>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {filteredIntegrations.length === 0 ? (
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma integração encontrada nesta categoria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIntegrations.map((integration) => (
                <Card key={integration.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <integration.icon className="h-6 w-6 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                          <p className="text-sm text-gray-600">{integration.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {getStatusIcon(integration.status)}
                        <Badge className={getStatusColor(integration.status)}>
                          {getStatusLabel(integration.status)}
                        </Badge>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-600 mb-2">Recursos:</p>
                      <div className="flex flex-wrap gap-1">
                        {integration.features.slice(0, 3).map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {integration.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{integration.features.length - 3} mais
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Connection Info */}
                    {integration.status === "connected" && integration.lastSync && (
                      <div className="mb-4 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-green-700">Última sincronização:</span>
                          <span className="text-green-600 font-medium">{integration.lastSync}</span>
                        </div>
                        {integration.data && (
                          <div className="mt-2 text-xs text-green-600">
                            {integration.id === "google-calendar" &&
                              `${integration.data.upcomingEvents} eventos próximos`}
                            {integration.id === "notion" &&
                              `${integration.data.pages} páginas, ${integration.data.databases} databases`}
                          </div>
                        )}
                      </div>
                    )}

                    {integration.status === "error" && (
                      <div className="mb-4 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700">Erro na sincronização. Verifique as configurações.</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {integration.status === "disconnected" ? (
                          <Button
                            size="sm"
                            onClick={() => handleConnect(integration)}
                            disabled={isConnecting === integration.id}
                          >
                            {isConnecting === integration.id ? (
                              <>
                                <Sync className="h-3 w-3 mr-1 animate-spin" />
                                Conectando...
                              </>
                            ) : (
                              <>
                                <Plus className="h-3 w-3 mr-1" />
                                Conectar
                              </>
                            )}
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSync(integration)}
                              disabled={integration.status === "syncing"}
                            >
                              <Sync
                                className={`h-3 w-3 mr-1 ${integration.status === "syncing" ? "animate-spin" : ""}`}
                              />
                              Sincronizar
                            </Button>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Settings className="h-3 w-3 mr-1" />
                                  Configurar
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Configurações - {integration.name}</DialogTitle>
                                  <DialogDescription>
                                    Ajuste as configurações de sincronização e recursos
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Frequência de Sincronização</Label>
                                    <Select defaultValue={integration.syncFrequency}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="realtime">Tempo Real</SelectItem>
                                        <SelectItem value="hourly">A cada hora</SelectItem>
                                        <SelectItem value="daily">Diariamente</SelectItem>
                                        <SelectItem value="manual">Manual</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {integration.settings && (
                                    <div className="space-y-3">
                                      {Object.entries(integration.settings).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between">
                                          <Label className="text-sm capitalize">
                                            {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                                          </Label>
                                          {typeof value === "boolean" ? (
                                            <Switch checked={value} />
                                          ) : (
                                            <Input defaultValue={value.toString()} className="w-32" />
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  <div className="flex justify-between pt-4">
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleDisconnect(integration)}
                                    >
                                      <Trash2 className="h-3 w-3 mr-1" />
                                      Desconectar
                                    </Button>
                                    <Button size="sm">Salvar Configurações</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                      </div>

                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        {getCategoryIcon(integration.category)}
                        <span className="capitalize">{integration.category}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          <CardDescription>Gerencie todas as suas integrações de uma vez</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                integrations.filter((int) => int.status === "connected").forEach((int) => handleSync(int))
              }}
            >
              <Sync className="h-3 w-3 mr-1" />
              Sincronizar Todas
            </Button>

            <Button variant="outline" size="sm">
              <Plus className="h-3 w-3 mr-1" />
              Adicionar Nova Integração
            </Button>

            <Button variant="outline" size="sm">
              <ExternalLink className="h-3 w-3 mr-1" />
              Explorar Marketplace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
