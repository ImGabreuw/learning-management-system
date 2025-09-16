"use client"

import { useState } from "react"
import { Search, Calendar, BookOpen, Target, Settings, Bell, User, ChevronDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { FuzzySearch } from "@/components/fuzzy-search"
import { RecommendationEngine } from "@/components/recommendation-engine"
import { ExternalToolsHub } from "@/components/external-tools-hub"
import { ProfileManagement } from "@/components/profile-management"

export default function LMSDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  // Mock data
  const assignments = [
    {
      id: 1,
      title: "Atividade de Laboratório 01",
      discipline: "Computação Distribuída",
      topics: ["Tópico 1", "Tópico 2"],
      status: "Em Progresso",
      dueDate: "Quarta-feira, 13 de Setembro",
      time: "23:59",
      progress: 65,
    },
    {
      id: 2,
      title: "Lista de Exercícios 01",
      discipline: "Teoria dos Grafos",
      topics: ["Tópico 3", "Tópico 4"],
      status: "A Fazer",
      dueDate: "Segunda-feira, 30 de Setembro",
      time: "23:59",
      progress: 0,
    },
  ]

  const courses = [
    { id: 1, name: "Compiladores", progress: 78, nextClass: "Análise Léxica", color: "bg-blue-500" },
    { id: 2, name: "Computação Distribuída", progress: 45, nextClass: "Sistemas P2P", color: "bg-green-500" },
    { id: 3, name: "Interação Humano Computador", progress: 92, nextClass: "Usabilidade", color: "bg-purple-500" },
    { id: 4, name: "Teoria dos Grafos", progress: 34, nextClass: "Algoritmos de Busca", color: "bg-orange-500" },
    {
      id: 5,
      name: "Laboratório de Engenharia de Software",
      progress: 67,
      nextClass: "Testes Unitários",
      color: "bg-red-500",
    },
    { id: 6, name: "Projetos Empreendedores", progress: 89, nextClass: "Pitch Final", color: "bg-teal-500" },
  ]

  const integrations = [
    { name: "Google Calendar", status: "connected", icon: Calendar },
    { name: "Notion", status: "connected", icon: BookOpen },
    { name: "GitHub", status: "disconnected", icon: ExternalLink },
    { name: "Slack", status: "disconnected", icon: ExternalLink },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-bold text-slate-900">Mackenzie</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>UN</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">@username</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Olá, username</h1>
          <p className="text-slate-600">Você tem uma Prova Integrada marcada para o dia 30 de Setembro.</p>
        </div>

        {/* Advanced Search */}
        <Card className="mb-8 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-blue-600" />
              <span>Busca Avançada</span>
            </CardTitle>
            <CardDescription>
              Encontre conteúdo dentro de documentos, aulas e materiais usando busca inteligente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FuzzySearch
              onSearch={(query, results) => {
                console.log(`[v0] Search performed: "${query}" returned ${results.length} results`)
              }}
            />
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Esta Semana</p>
                  <p className="text-3xl font-bold">6</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Projetos</p>
                  <p className="text-3xl font-bold">4</p>
                </div>
                <Target className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Tarefas</p>
                  <p className="text-3xl font-bold">8</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Assignments & Projects */}
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Minhas Tarefas & Projetos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-900">{assignment.title}</h3>
                        <Badge variant={assignment.status === "Em Progresso" ? "default" : "secondary"}>
                          {assignment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{assignment.discipline}</p>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex space-x-1">
                          {assignment.topics.map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-sm text-slate-500">
                          {assignment.dueDate} - {assignment.time}
                        </span>
                      </div>
                      {assignment.progress > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-600">Progresso</span>
                            <span className="text-xs text-slate-600">{assignment.progress}%</span>
                          </div>
                          <Progress value={assignment.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Courses */}
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Meus Cursos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.map((course) => (
                    <Card key={course.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className={`w-full h-32 ${course.color} rounded-lg mb-4 flex items-center justify-center`}>
                          <BookOpen className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">{course.name}</h3>
                        <p className="text-sm text-slate-600 mb-3">Próxima aula: {course.nextClass}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-600">Progresso</span>
                            <span className="text-xs text-slate-600">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Oportunidades Recomendadas</span>
                </CardTitle>
                <CardDescription>
                  Sistema inteligente que cruza seu perfil acadêmico com oportunidades disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecommendationEngine
                  onApply={(id) => {
                    console.log(`[v0] User applied to opportunity: ${id}`)
                    // Here you would handle the application process
                  }}
                  onSave={(id) => {
                    console.log(`[v0] User saved opportunity: ${id}`)
                    // Here you would handle saving the opportunity
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                  <span>Hub de Integrações</span>
                </CardTitle>
                <CardDescription>Conecte e gerencie suas ferramentas favoritas em um só lugar</CardDescription>
              </CardHeader>
              <CardContent>
                <ExternalToolsHub
                  onConnect={(id) => {
                    console.log(`[v0] Connected integration: ${id}`)
                  }}
                  onDisconnect={(id) => {
                    console.log(`[v0] Disconnected integration: ${id}`)
                  }}
                  onSync={(id) => {
                    console.log(`[v0] Synced integration: ${id}`)
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileManagement
              onSave={(profile) => {
                console.log(`[v0] Profile updated:`, profile)
                // Here you would save the profile to your backend
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
