"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Calendar, BookOpen, Target, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/ui/navigation"
import { FuzzySearch } from "@/components/ui/fuzzy-search"
import { RecommendationEngine } from "@/components/ui/recommendation-engine"
import { ExternalToolsHub } from "@/components/ui/external-tools-hub"
import { TaskDetailPanel } from "@/components/ui/task-detail-panel"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function LMSDashboard() {
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [opportunitiesFilter, setOpportunitiesFilter] = useState("todas")
  const [integrationsFilter, setIntegrationsFilter] = useState("todas")
  const [activeSection, setActiveSection] = useState<"dashboard" | "opportunities" | "integrations">("dashboard")

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
      subtasks: [
        { id: 1, title: "Configurar ambiente", completed: true },
        { id: 2, title: "Implementar servidor", completed: true },
        { id: 3, title: "Implementar cliente", completed: false },
        { id: 4, title: "Testar comunicação", completed: false },
      ],
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
      subtasks: [
        { id: 1, title: "Exercício 1", completed: false },
        { id: 2, title: "Exercício 2", completed: false },
        { id: 3, title: "Exercício 3", completed: false },
      ],
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Olá, João Silva</h1>
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

        <div className="flex items-center space-x-2 mb-6">
          <Button
            variant={activeSection === "dashboard" ? "default" : "outline"}
            onClick={() => setActiveSection("dashboard")}
          >
            Dashboard
          </Button>
          <Button
            variant={activeSection === "opportunities" ? "default" : "outline"}
            onClick={() => setActiveSection("opportunities")}
          >
            Oportunidades
          </Button>
          <Button
            variant={activeSection === "integrations" ? "default" : "outline"}
            onClick={() => setActiveSection("integrations")}
          >
            Integrações
          </Button>
        </div>

        {activeSection === "dashboard" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Minhas Tarefas & Projetos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="p-4 border border-slate-200 rounded-lg bg-white cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedTask(assignment)}
                    >
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

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Meus Cursos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.map((course) => (
                    <Link key={course.id} href={`/course/${course.id}`}>
                      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div
                            className={`w-full h-32 ${course.color} rounded-lg mb-4 flex items-center justify-center`}
                          >
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
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === "opportunities" && (
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle>Oportunidades Recomendadas</CardTitle>
                    <CardDescription>
                      Sistema inteligente que cruza seu perfil acadêmico com oportunidades disponíveis
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setOpportunitiesFilter("todas")}>
                      <span className={opportunitiesFilter === "todas" ? "font-semibold" : ""}>Todas</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpportunitiesFilter("estagios")}>
                      <span className={opportunitiesFilter === "estagios" ? "font-semibold" : ""}>Estágios</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpportunitiesFilter("empregos")}>
                      <span className={opportunitiesFilter === "empregos" ? "font-semibold" : ""}>Empregos</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpportunitiesFilter("bolsas")}>
                      <span className={opportunitiesFilter === "bolsas" ? "font-semibold" : ""}>Bolsas</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <RecommendationEngine
                filter={opportunitiesFilter}
                onApply={(id) => {
                  console.log(`[v0] User applied to opportunity: ${id}`)
                }}
                onSave={(id) => {
                  console.log(`[v0] User saved opportunity: ${id}`)
                }}
              />
            </CardContent>
          </Card>
        )}

        {activeSection === "integrations" && (
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle>Hub de Integrações</CardTitle>
                    <CardDescription>Conecte e gerencie suas ferramentas favoritas em um só lugar</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIntegrationsFilter("todas")}>
                      <span className={integrationsFilter === "todas" ? "font-semibold" : ""}>Todas</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIntegrationsFilter("produtividade")}>
                      <span className={integrationsFilter === "produtividade" ? "font-semibold" : ""}>
                        Produtividade
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIntegrationsFilter("comunicacao")}>
                      <span className={integrationsFilter === "comunicacao" ? "font-semibold" : ""}>Comunicação</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIntegrationsFilter("desenvolvimento")}>
                      <span className={integrationsFilter === "desenvolvimento" ? "font-semibold" : ""}>
                        Desenvolvimento
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <ExternalToolsHub
                filter={integrationsFilter}
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
        )}
      </div>

      {selectedTask && <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  )
}
