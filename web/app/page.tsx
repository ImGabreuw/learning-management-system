"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Search, Calendar, BookOpen, Target, MapPin, Clock, DollarSign, Heart, FilterIcon, Book } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Navigation from "@/components/navigation"
import { TaskDetailPanel } from "@/components/task-detail-panel"
import { FuzzySearch } from "@/components/fuzzy-search"
import { ProjectDetailPanel } from "@/components/project-detail-panel"

export default function LMSDashboard() {
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("tarefas")
  const [opportunityFilters, setOpportunityFilters] = useState<string[]>([])
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const filterMenuRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Check if click is inside the panel
      if (panelRef.current && panelRef.current.contains(target)) {
        return
      }

      // Check if click is inside a dropdown menu (portaled content)
      const clickedElement = event.target as HTMLElement
      if (clickedElement.closest('[role="menu"]') || clickedElement.closest("[data-radix-popper-content-wrapper]")) {
        return
      }

      // If click is outside panel and not in a dropdown, close the panel
      setSelectedTask(null)
      setSelectedProject(null)
    }

    if (selectedTask || selectedProject) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [selectedTask, selectedProject])

  const assignments = [
    {
      id: 1,
      title: "Atividade de Laboratório 01",
      discipline: "Computação Distribuída",
      topics: ["Tópico 1", "Tópico 2"],
      status: "Em Progresso",
      dueDate: "Quarta-feira, 13 de Setembro - 23:59",
      progress: 65,
      subtasks: [
        { id: 1, title: "Configurar ambiente", completed: true },
        { id: 2, title: "Implementar servidor", completed: true },
        { id: 3, title: "Implementar cliente", completed: false },
        { id: 4, title: "Testar comunicação", completed: false },
      ],
      attachments: [
        { id: 1, name: "especificacao.pdf", size: "2.4 MB", type: "pdf" },
        { id: 2, name: "template.zip", size: "1.1 MB", type: "zip" },
      ],
    },
    {
      id: 2,
      title: "Lista de Exercícios 01",
      discipline: "Teoria dos Grafos",
      topics: ["Tópico 3", "Tópico 4"],
      status: "A Fazer",
      dueDate: "Segunda-feira, 30 de Setembro - 23:59",
      progress: 0,
      subtasks: [
        { id: 1, title: "Exercício 1", completed: false },
        { id: 2, title: "Exercício 2", completed: false },
        { id: 3, title: "Exercício 3", completed: false },
      ],
      attachments: [{ id: 1, name: "lista01.pdf", size: "856 KB", type: "pdf" }],
    },
  ]

  const courses = [
    { id: 1, name: "Compiladores", progress: 78, nextClass: "Análise Léxica", color: "from-blue-500 to-blue-600" },
    {
      id: 2,
      name: "Computação Distribuída",
      progress: 45,
      nextClass: "Sistemas P2P",
      color: "from-green-500 to-green-600",
    },
    {
      id: 3,
      name: "Interação Humano Computador",
      progress: 92,
      nextClass: "Usabilidade",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: 4,
      name: "Teoria dos Grafos",
      progress: 34,
      nextClass: "Algoritmos de Busca",
      color: "from-orange-500 to-orange-600",
    },
    {
      id: 5,
      name: "Laboratório de Engenharia de Software",
      progress: 67,
      nextClass: "Testes Unitários",
      color: "from-red-500 to-red-600",
    },
    {
      id: 6,
      name: "Projetos Empreendedores",
      progress: 89,
      nextClass: "Pitch Final",
      color: "from-teal-500 to-teal-600",
    },
  ]

  const opportunities = [
    {
      id: 1,
      type: "Estágio",
      typeColor: "bg-blue-100 text-blue-700",
      match: 87,
      title: "Estágio em Desenvolvimento Full-Stack",
      company: "TechCorp",
      description: "Oportunidade para trabalhar com React, Node.js e PostgreSQL em projetos inovadores.",
      requirements: [
        "Conhecimento em JavaScript, React, Node.js, TypeScript",
        "Nível de dificuldade adequado (Intermediário)",
        "Localização ideal (São Paulo, SP)",
      ],
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Full-Stack"],
      location: "São Paulo, SP",
      duration: "6 meses",
      salary: "R$ 2.000 - R$ 3.000",
      difficulty: "Intermediário",
      saved: false,
    },
    {
      id: 2,
      type: "Emprego",
      typeColor: "bg-green-100 text-green-700",
      match: 91,
      title: "Programa de Trainee - Data Science",
      company: "DataLab",
      description: "Programa completo de formação em Data Science com mentoria especializada.",
      requirements: [
        "Conhecimento em Python, SQL",
        "Interesse em Data Science",
        "Nível de dificuldade adequado (Intermediário)",
      ],
      skills: ["Python", "Machine Learning", "SQL", "Data Science", "Analytics"],
      location: "São Paulo, SP",
      duration: "12 meses",
      salary: "R$ 4.000 - R$ 6.000",
      difficulty: "Intermediário",
      saved: false,
    },
    {
      id: 3,
      type: "Curso",
      typeColor: "bg-purple-100 text-purple-700",
      match: 95,
      title: "Curso Avançado de DevOps",
      company: "CloudAcademy",
      description: "Curso intensivo de DevOps com certificação internacional.",
      requirements: [
        "Conhecimento em Linux, Git, Docker",
        "Afinidade com DevOps",
        "Nível de dificuldade adequado (Avançado)",
      ],
      skills: ["Docker", "Kubernetes", "CI/CD", "AWS", "+4 mais"],
      location: "Online",
      duration: "3 meses",
      salary: "Gratuito",
      difficulty: "Avançado",
      saved: false,
    },
    {
      id: 4,
      type: "Emprego",
      typeColor: "bg-green-100 text-green-700",
      match: 91,
      title: "Desenvolvedor Mobile React Native",
      company: "MobileFirst",
      description: "Desenvolva aplicativos mobile com React Native e React Nativas.",
      requirements: [
        "Conhecimento considerável em React Native",
        "Afinidade com desenvolvimento mobile",
        "Nível de dificuldade adequado (Intermediário)",
      ],
      skills: ["React Native", "JavaScript", "Redux", "iOS", "+1 mais"],
      location: "Remoto",
      duration: "Indeterminado",
      salary: "R$ 6.000 - R$ 8.000",
      difficulty: "Intermediário",
      saved: false,
    },
    {
      id: 5,
      type: "Hackathon",
      typeColor: "bg-pink-100 text-pink-700",
      match: 93,
      title: "Hackathon de IA - Prêmio R$ 10.000",
      company: "AI Innovation",
      description: "Maratona de 48h para desenvolver soluções inovadoras usando IA.",
      requirements: [
        "Afinidade com IA e Machine Learning",
        "Conhecimento em Python, Deep Learning",
        "Modalidade remota/presencial",
      ],
      skills: ["Prova Artificial", "Python", "Deep Learning", "Computer Vision"],
      location: "Online",
      duration: "48 horas",
      salary: "R$ 10.000",
      difficulty: "Avançado",
      saved: false,
    },
    {
      id: 6,
      type: "Bolsa",
      typeColor: "bg-pink-100 text-pink-700",
      match: 73,
      title: "Bolsa de Estudos - Mestrado em IA",
      company: "Universidade Tech",
      description: "Bolsa integral para mestrado em Inteligência Artificial.",
      requirements: [
        "Afinidade com IA e pesquisa acadêmica",
        "Conhecimento em Python, Pesquisa",
        "Excelente desempenho acadêmico",
      ],
      skills: ["Inteligência Artificial", "Pesquisa", "Machine Learning", "Bolsa"],
      location: "São Paulo, SP",
      duration: "24 meses",
      salary: "R$ 3.000/mês",
      difficulty: "Avançado",
      saved: false,
    },
  ]

  const projects = [
    {
      id: 1,
      title: "Sistema de Gerenciamento de Biblioteca",
      course: "Engenharia de Software",
      courseColor: "text-blue-600",
      description:
        "Desenvolvimento de um sistema completo para gerenciamento de bibliotecas universitárias com funcionalidades de empréstimo, reserva e catalogação.",
      status: "Em Progresso",
      progress: 65,
      dueDate: "15 de Dezembro de 2024",
      tags: ["React", "Node.js", "PostgreSQL", "API REST"],
      image: "from-blue-500 to-blue-600",
      team: ["João Silva", "Maria Santos", "Pedro Costa"],
      attachments: [
        { id: 1, name: "Documentação.pdf", size: "3.2 MB", type: "pdf" },
        { id: 2, name: "Diagramas.zip", size: "1.8 MB", type: "zip" },
      ],
    },
    {
      id: 2,
      title: "Aplicativo de Mobilidade Urbana",
      course: "Projetos Empreendedores",
      courseColor: "text-green-600",
      description: "App mobile para otimização de rotas de transporte público com integração de dados em tempo real.",
      status: "A Fazer",
      progress: 20,
      dueDate: "30 de Novembro de 2024",
      tags: ["React Native", "Firebase", "Maps API", "UX Design"],
      image: "from-green-500 to-green-600",
      team: ["João Silva", "Ana Lima"],
      attachments: [{ id: 1, name: "Proposta.pdf", size: "2.1 MB", type: "pdf" }],
    },
    {
      id: 3,
      title: "Compilador para Linguagem Educacional",
      course: "Compiladores",
      courseColor: "text-purple-600",
      description:
        "Implementação de um compilador completo para uma linguagem de programação educacional com análise léxica, sintática e semântica.",
      status: "Concluído",
      progress: 100,
      dueDate: "20 de Outubro de 2024",
      tags: ["C++", "Flex", "Bison", "Compiladores"],
      image: "from-purple-500 to-purple-600",
      team: ["João Silva"],
      attachments: [
        { id: 1, name: "Código-fonte.zip", size: "5.4 MB", type: "zip" },
        { id: 2, name: "Relatório-final.pdf", size: "4.2 MB", type: "pdf" },
      ],
    },
    {
      id: 4,
      title: "Análise de Redes Sociais com IA",
      course: "Inteligência Artificial",
      courseColor: "text-orange-600",
      description:
        "Projeto de análise de sentimentos e detecção de padrões em redes sociais usando técnicas de machine learning.",
      status: "Em Progresso",
      progress: 45,
      dueDate: "10 de Dezembro de 2024",
      tags: ["Python", "TensorFlow", "NLP", "Data Science"],
      image: "from-orange-500 to-orange-600",
      team: ["João Silva", "Carlos Mendes", "Beatriz Alves"],
      attachments: [{ id: 1, name: "Dataset.csv", size: "12.5 MB", type: "csv" }],
    },
  ]

  const [savedOpportunities, setSavedOpportunities] = useState<number[]>([])
  const [taskStatuses, setTaskStatuses] = useState<{ [key: number]: string }>(
    assignments.reduce((acc, assignment) => ({ ...acc, [assignment.id]: assignment.status }), {}),
  )

  const toggleSave = (id: number) => {
    setSavedOpportunities((prev) => (prev.includes(id) ? prev.filter((oppId) => oppId !== id) : [...prev, id]))
  }

  const toggleFilter = (filter: string) => {
    setOpportunityFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const filteredOpportunities =
    opportunityFilters.length === 0
      ? opportunities
      : opportunities.filter((opp) => opportunityFilters.includes(opp.type))

  const updateTaskStatus = (taskId: number, newStatus: string) => {
    setTaskStatuses((prev) => ({ ...prev, [taskId]: newStatus }))
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Olá, João Silva</h1>
          <p className="text-slate-600">Você tem uma Prova Integrada marcada para o dia 30 de Setembro.</p>
        </div>

        {/* Advanced Search */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Search className="h-5 w-5 text-blue-600" />
              <span>Busca Avançada</span>
            </CardTitle>
            <CardDescription>
              Encontre conteúdo dentro de documentos, aulas e materiais usando busca inteligente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FuzzySearch />
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Esta Semana</p>
                  <p className="text-4xl font-bold">6</p>
                </div>
                <Calendar className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Projetos</p>
                  <p className="text-4xl font-bold">4</p>
                </div>
                <Target className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Tarefas</p>
                  <p className="text-4xl font-bold">8</p>
                </div>
                <BookOpen className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6">
          <Button
            variant={activeTab === "tarefas" ? "default" : "outline"}
            onClick={() => setActiveTab("tarefas")}
            className={
              activeTab === "tarefas" ? "bg-black hover:bg-black/90 text-white" : "border-gray-300 hover:bg-gray-50"
            }
          >
            Tarefas
          </Button>
          <Button
            variant={activeTab === "projetos" ? "default" : "outline"}
            onClick={() => setActiveTab("projetos")}
            className={
              activeTab === "projetos" ? "bg-black hover:bg-black/90 text-white" : "border-gray-300 hover:bg-gray-50"
            }
          >
            Projetos
          </Button>
          <Button
            variant={activeTab === "oportunidades" ? "default" : "outline"}
            onClick={() => setActiveTab("oportunidades")}
            className={
              activeTab === "oportunidades"
                ? "bg-black hover:bg-black/90 text-white"
                : "border-gray-300 hover:bg-gray-50"
            }
          >
            Oportunidades
          </Button>
        </div>

        {/* Main Content - Tarefas Tab */}
        {activeTab === "tarefas" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {assignments.map((assignment) => {
                    const disciplineColorMap: { [key: string]: string } = {
                      "Computação Distribuída": "text-green-600",
                      "Teoria dos Grafos": "text-orange-600",
                      "Engenharia de Software": "text-blue-600",
                      Compiladores: "text-purple-600",
                      "Inteligência Artificial": "text-orange-600",
                      "Projetos Empreendedores": "text-green-600",
                    }
                    const disciplineColor = disciplineColorMap[assignment.discipline] || "text-slate-600"
                    const currentStatus = taskStatuses[assignment.id]

                    return (
                      <div
                        key={assignment.id}
                        className="p-5 border border-slate-200 rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedTask(assignment)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-slate-900 flex-1">{assignment.title}</h3>
                          <p className="text-xs text-slate-500 ml-4 whitespace-nowrap">{assignment.dueDate}</p>
                        </div>

                        <button
                          className="inline-flex items-center px-2 py-0.5 rounded-md border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all mb-3 w-fit"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.location.href = `/course/${assignment.discipline}`
                          }}
                        >
                          <Book className={`h-3.5 w-3.5 mr-1.5 ${disciplineColor}`} />
                          <span className="text-xs font-medium text-slate-700">{assignment.discipline}</span>
                        </button>

                        <div className="flex-1 min-h-[20px]" />

                        <div className="flex flex-wrap gap-2 mb-4">
                          {assignment.topics.map((topic) => (
                            <Badge
                              key={topic}
                              variant="outline"
                              className="text-xs px-2 py-0.5 cursor-pointer hover:bg-slate-100 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log("[v0] Topic clicked:", topic)
                              }}
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center space-x-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <button
                                className={`text-xs px-2 py-0.5 rounded-md font-medium transition-colors ${
                                  currentStatus === "Em Progresso"
                                    ? "bg-black text-white hover:bg-black/90"
                                    : currentStatus === "A Fazer"
                                      ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                      : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                              >
                                {currentStatus}
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="py-2">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateTaskStatus(assignment.id, "A Fazer")
                                }}
                                className="my-1"
                              >
                                A Fazer
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateTaskStatus(assignment.id, "Em Progresso")
                                }}
                                className="my-1"
                              >
                                Em Progresso
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateTaskStatus(assignment.id, "Concluído")
                                }}
                                className="my-1"
                              >
                                Concluído
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={assignment.progress}
                              className={`h-2 w-20 ${assignment.progress === 0 ? "[&>div]:bg-gray-300" : ""}`}
                            />
                            <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
                              {assignment.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content - Projetos Tab */}
        {activeTab === "projetos" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group p-0 flex flex-col"
                  onClick={() => setSelectedProject(project)}
                >
                  <div
                    className={`w-full h-40 bg-gradient-to-br ${project.image} flex items-center justify-center relative overflow-hidden flex-shrink-0`}
                  >
                    <Target className="h-16 w-16 text-white opacity-90 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <CardContent className="pt-1 px-5 pb-5 flex flex-col flex-1">
                    <h3 className="font-bold text-slate-900 mb-3 text-lg line-clamp-2">{project.title}</h3>

                    <button
                      className="inline-flex items-center px-2 py-0.5 rounded-md border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all mb-3 w-fit"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.location.href = `/course/${project.course}`
                      }}
                    >
                      <Book className={`h-3.5 w-3.5 mr-1.5 ${project.courseColor}`} />
                      <span className="text-xs font-medium text-slate-700">{project.course}</span>
                    </button>

                    {/* Spacer to push tags and status/progress to bottom */}
                    <div className="flex-1" />

                    {/* Tags section - always above status/progress */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs px-2 py-0.5 h-6 leading-none flex items-center"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5 h-6 leading-none flex items-center">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Status and progress bar - always at bottom */}
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant="secondary"
                        className={`text-xs px-2 py-0.5 h-6 leading-none flex items-center ${
                          project.status === "Em Progresso"
                            ? "bg-yellow-100 text-yellow-700"
                            : project.status === "A Fazer"
                              ? "bg-slate-200 text-slate-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {project.status}
                      </Badge>
                      <div className="flex items-center space-x-2 flex-1">
                        <Progress
                          value={project.progress}
                          className={`h-2 w-20 ${project.progress === 0 ? "[&>div]:bg-gray-300" : ""}`}
                        />
                        <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Main Content - Oportunidades Tab */}
        {activeTab === "oportunidades" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-sm bg-white rounded-xl p-6 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-5 w-5 text-slate-700" />
                    <h2 className="text-lg font-semibold text-slate-900">Oportunidades Recomendadas</h2>
                  </div>
                  <p className="text-sm text-slate-600">
                    Sistema inteligente que cruza seu perfil acadêmico com oportunidades disponíveis
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-slate-900">{filteredOpportunities.length}</span>
                  </div>

                  <div className="flex items-center space-x-2 px-3 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">
                      {filteredOpportunities.length > 0
                        ? Math.round(
                            filteredOpportunities.reduce((acc, opp) => acc + opp.match, 0) /
                              filteredOpportunities.length,
                          )
                        : 0}
                      %
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 px-3 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                    <Heart className="h-4 w-4 text-pink-600" />
                    <span className="text-sm font-semibold text-slate-900">{savedOpportunities.length}</span>
                  </div>

                  <div className="relative" ref={filterMenuRef}>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowFilterMenu(!showFilterMenu)}
                      className="h-10 w-10"
                    >
                      <FilterIcon className="h-5 w-5" />
                    </Button>

                    {showFilterMenu && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 p-3 z-10">
                        <div className="text-sm font-medium text-slate-700 mb-3 px-2">Filtrar por tipo</div>
                        <div className="space-y-2">
                          {["Estágio", "Emprego", "Curso", "Hackathon", "Bolsa"].map((type) => (
                            <button
                              key={type}
                              onClick={() => toggleFilter(type)}
                              className={`w-full text-left px-4 py-3 rounded-md text-sm transition-colors ${
                                opportunityFilters.includes(type)
                                  ? "bg-black text-white"
                                  : "hover:bg-slate-100 text-slate-700"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                        {opportunityFilters.length > 0 && (
                          <>
                            <div className="border-t border-slate-200 my-3" />
                            <button
                              onClick={() => setOpportunityFilters([])}
                              className="w-full text-left px-4 py-3 rounded-md text-sm text-red-600 hover:bg-red-50"
                            >
                              Limpar todos os filtros
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredOpportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6 mb-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-3">
                            <Badge className={opportunity.typeColor}>{opportunity.type}</Badge>
                            <Badge variant="outline">{opportunity.difficulty}</Badge>
                          </div>

                          <h3 className="text-xl font-bold text-slate-900 mb-2">{opportunity.title}</h3>
                          <p className="text-sm text-slate-600 mb-3">{opportunity.company}</p>
                          <p className="text-slate-700 mb-4">{opportunity.description}</p>

                          <div className="mb-4">
                            <p className="text-sm font-medium text-slate-700 mb-2">Por que recomendamos:</p>
                            <ul className="space-y-1">
                              {opportunity.requirements.map((req, index) => (
                                <li key={index} className="text-sm text-slate-600 flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {opportunity.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="bg-slate-100 text-slate-700">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex-shrink-0 self-start">
                          <div className="relative w-20 h-20">
                            <svg className="w-20 h-20 transform -rotate-90">
                              <circle
                                cx="40"
                                cy="40"
                                r="32"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="none"
                                className="text-slate-200"
                              />
                              <circle
                                cx="40"
                                cy="40"
                                r="32"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray={`${(opportunity.match / 100) * 201} 201`}
                                className="text-green-500"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-lg font-bold text-slate-900">{opportunity.match}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="border-t border-slate-200" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-slate-600">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{opportunity.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>Prazo: {opportunity.duration}</span>
                            </div>
                            {opportunity.salary && (
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-4 w-4" />
                                <span>{opportunity.salary}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleSave(opportunity.id)}
                              className={savedOpportunities.includes(opportunity.id) ? "text-pink-600" : ""}
                            >
                              <Heart
                                className={`h-4 w-4 mr-1 ${savedOpportunities.includes(opportunity.id) ? "fill-pink-600" : ""}`}
                              />
                              Salvar
                            </Button>
                            <Button size="sm" className="bg-black hover:bg-black/90">
                              Candidatar-se
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Courses Section - Always visible */}
        <Card className="border-0 shadow-sm mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Meus Cursos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {courses.map((course) => (
                <Link key={course.id} href={`/course/${course.id}`}>
                  <Card className="border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group p-0 flex flex-col h-full">
                    <div
                      className={`w-full h-40 bg-gradient-to-br ${course.color} flex items-center justify-center relative overflow-hidden flex-shrink-0`}
                    >
                      <BookOpen className="h-16 w-16 text-white opacity-90 group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <CardContent className="pt-1 px-5 pb-5 flex flex-col flex-1">
                      <h3 className="font-bold text-slate-900 mb-3 text-lg line-clamp-2">{course.name}</h3>
                      <p className="text-sm text-slate-600 mb-3 flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        Próxima aula: {course.nextClass}
                      </p>
                      <div className="flex-1" />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-600">Progresso</span>
                          <span className="text-xs font-bold text-slate-900">{course.progress}%</span>
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

      {selectedTask && (
        <div ref={panelRef}>
          <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
        </div>
      )}

      {selectedProject && (
        <div ref={panelRef}>
          <ProjectDetailPanel project={selectedProject} onClose={() => setSelectedProject(null)} />
        </div>
      )}
    </div>
  )
}
