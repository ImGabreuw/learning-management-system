"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BookOpen,
  Search,
  Filter,
  Calendar,
  Clock,
  Users,
  Star,
  TrendingUp,
  GraduationCap,
  FileText,
  Video,
  Download,
  BarChart3,
  Target,
  Award,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  MapPin,
} from "lucide-react"
import Navigation from "@/components/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"

interface Assignment {
  id: string
  title: string
  type: "assignment" | "exam" | "project" | "quiz"
  dueDate: string
  status: "pending" | "submitted" | "graded" | "overdue"
  grade?: number
  maxGrade: number
}

interface Discipline {
  id: string
  name: string
  code: string
  professor: string
  professorAvatar: string
  semester: string
  credits: number
  schedule: string
  room: string
  description: string
  progress: number
  grade: number
  status: "active" | "completed" | "upcoming"
  color: string
  assignments: Assignment[]
  materials: number
  videos: number
  students: number
  rating: number
}

function DisciplinesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null)

  const disciplines: Discipline[] = [
    {
      id: "1",
      name: "Compiladores",
      code: "CC301",
      professor: "Dr. Maria Santos",
      professorAvatar: "/professor-woman.png",
      semester: "2024.2",
      credits: 4,
      schedule: "Seg/Qua 19:00-21:00",
      room: "Lab 205",
      description:
        "Estudo dos princípios e técnicas de construção de compiladores, incluindo análise léxica, sintática e semântica.",
      progress: 75,
      grade: 8.5,
      status: "active",
      color: "blue",
      materials: 12,
      videos: 8,
      students: 45,
      rating: 4.8,
      assignments: [
        {
          id: "1",
          title: "Analisador Léxico",
          type: "assignment",
          dueDate: "2024-10-15",
          status: "submitted",
          grade: 9.0,
          maxGrade: 10,
        },
        { id: "2", title: "Prova P1", type: "exam", dueDate: "2024-10-20", status: "graded", grade: 8.5, maxGrade: 10 },
        { id: "3", title: "Parser Sintático", type: "project", dueDate: "2024-11-10", status: "pending", maxGrade: 10 },
      ],
    },
    {
      id: "2",
      name: "Computação Distribuída",
      code: "CC302",
      professor: "Prof. João Silva",
      professorAvatar: "/wise-professor.png",
      semester: "2024.2",
      credits: 4,
      schedule: "Ter/Qui 21:00-23:00",
      room: "Sala 301",
      description:
        "Conceitos fundamentais de sistemas distribuídos, comunicação entre processos, sincronização e tolerância a falhas.",
      progress: 60,
      grade: 7.8,
      status: "active",
      color: "green",
      materials: 15,
      videos: 12,
      students: 38,
      rating: 4.6,
      assignments: [
        {
          id: "4",
          title: "Sistema de Mensagens",
          type: "project",
          dueDate: "2024-10-25",
          status: "submitted",
          grade: 8.0,
          maxGrade: 10,
        },
        {
          id: "5",
          title: "Quiz - Algoritmos Distribuídos",
          type: "quiz",
          dueDate: "2024-11-05",
          status: "pending",
          maxGrade: 5,
        },
      ],
    },
    {
      id: "3",
      name: "Interação Humano Computador",
      code: "CC303",
      professor: "Dra. Ana Costa",
      professorAvatar: "/placeholder-lwc3a.png",
      semester: "2024.2",
      credits: 3,
      schedule: "Sex 19:00-22:00",
      room: "Lab 102",
      description: "Princípios de design de interfaces, usabilidade, experiência do usuário e métodos de avaliação.",
      progress: 85,
      grade: 9.2,
      status: "active",
      color: "purple",
      materials: 10,
      videos: 6,
      students: 52,
      rating: 4.9,
      assignments: [
        {
          id: "6",
          title: "Protótipo de Interface",
          type: "project",
          dueDate: "2024-10-30",
          status: "graded",
          grade: 9.5,
          maxGrade: 10,
        },
        {
          id: "7",
          title: "Avaliação de Usabilidade",
          type: "assignment",
          dueDate: "2024-11-15",
          status: "pending",
          maxGrade: 8,
        },
      ],
    },
    {
      id: "4",
      name: "Teoria dos Grafos",
      code: "MAT201",
      professor: "Prof. Carlos Lima",
      professorAvatar: "/placeholder-lkdzu.png",
      semester: "2024.2",
      credits: 3,
      schedule: "Qua 21:00-23:00",
      room: "Sala 205",
      description:
        "Estudo de grafos, algoritmos em grafos, árvores, conectividade e aplicações em ciência da computação.",
      progress: 45,
      grade: 7.5,
      status: "active",
      color: "orange",
      materials: 8,
      videos: 5,
      students: 42,
      rating: 4.4,
      assignments: [
        {
          id: "8",
          title: "Algoritmos de Busca",
          type: "assignment",
          dueDate: "2024-11-08",
          status: "pending",
          maxGrade: 10,
        },
        { id: "9", title: "Prova P1", type: "exam", dueDate: "2024-11-20", status: "pending", maxGrade: 10 },
      ],
    },
    {
      id: "5",
      name: "Laboratório de Engenharia de Software",
      code: "CC304",
      professor: "Prof. Roberto Alves",
      professorAvatar: "/placeholder-isa0o.png",
      semester: "2024.2",
      credits: 2,
      schedule: "Sab 08:00-12:00",
      room: "Lab 301",
      description:
        "Desenvolvimento prático de projetos de software utilizando metodologias ágeis e ferramentas modernas.",
      progress: 90,
      grade: 9.0,
      status: "active",
      color: "teal",
      materials: 6,
      videos: 10,
      students: 35,
      rating: 4.7,
      assignments: [
        {
          id: "10",
          title: "Projeto Final - Sistema Web",
          type: "project",
          dueDate: "2024-12-01",
          status: "pending",
          maxGrade: 10,
        },
      ],
    },
    {
      id: "6",
      name: "Projetos Empreendedores",
      code: "ADM101",
      professor: "Dra. Lucia Ferreira",
      professorAvatar: "/placeholder-f8mvj.png",
      semester: "2024.2",
      credits: 2,
      schedule: "Ter 19:00-21:00",
      room: "Sala 401",
      description:
        "Desenvolvimento de competências empreendedoras e elaboração de planos de negócio para projetos inovadores.",
      progress: 70,
      grade: 8.8,
      status: "active",
      color: "pink",
      materials: 9,
      videos: 7,
      students: 48,
      rating: 4.5,
      assignments: [
        {
          id: "11",
          title: "Plano de Negócios",
          type: "project",
          dueDate: "2024-11-25",
          status: "pending",
          maxGrade: 10,
        },
        {
          id: "12",
          title: "Pitch Presentation",
          type: "assignment",
          dueDate: "2024-12-05",
          status: "pending",
          maxGrade: 8,
        },
      ],
    },
  ]

  const filteredDisciplines = useMemo(() => {
    let filtered = disciplines

    if (searchTerm) {
      filtered = filtered.filter(
        (discipline) =>
          discipline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          discipline.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          discipline.professor.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (activeTab !== "all") {
      filtered = filtered.filter((discipline) => discipline.status === activeTab)
    }

    return filtered
  }, [searchTerm, activeTab])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "submitted":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "graded":
        return "bg-green-100 text-green-800 border-green-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />
      case "submitted":
        return <CheckCircle2 className="h-3 w-3" />
      case "graded":
        return <Award className="h-3 w-3" />
      case "overdue":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const selectedDisciplineData = disciplines.find((d) => d.id === selectedDiscipline)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Component */}
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Minhas Disciplinas</h1>
          <p className="text-gray-600">Gerencie suas disciplinas, acompanhe o progresso e acesse materiais</p>
        </div>

        {/* Filters */}
        <div className="flex justify-end mb-6">
          <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar disciplinas, códigos ou professores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-white/70 backdrop-blur-sm border-0 shadow-lg"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
              <TabsTrigger value="all">Todas ({disciplines.length})</TabsTrigger>
              <TabsTrigger value="active">
                Ativas ({disciplines.filter((d) => d.status === "active").length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Concluídas ({disciplines.filter((d) => d.status === "completed").length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Próximas ({disciplines.filter((d) => d.status === "upcoming").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Disciplinas Ativas</p>
                  <p className="text-3xl font-bold">{disciplines.filter((d) => d.status === "active").length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Média Geral</p>
                  <p className="text-3xl font-bold">8.5</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Créditos</p>
                  <p className="text-3xl font-bold">18</p>
                </div>
                <GraduationCap className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Tarefas Pendentes</p>
                  <p className="text-3xl font-bold">7</p>
                </div>
                <Target className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Disciplines Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDisciplines.map((discipline) => (
            <Card
              key={discipline.id}
              className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedDiscipline(discipline.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">{discipline.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {discipline.code} • {discipline.credits} créditos
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`ml-2 ${
                      discipline.color === "blue"
                        ? "bg-blue-100 text-blue-700"
                        : discipline.color === "green"
                          ? "bg-green-100 text-green-700"
                          : discipline.color === "purple"
                            ? "bg-purple-100 text-purple-700"
                            : discipline.color === "orange"
                              ? "bg-orange-100 text-orange-700"
                              : discipline.color === "teal"
                                ? "bg-teal-100 text-teal-700"
                                : "bg-pink-100 text-pink-700"
                    }`}
                  >
                    {discipline.status === "active"
                      ? "Ativa"
                      : discipline.status === "completed"
                        ? "Concluída"
                        : "Próxima"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Professor */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={discipline.professorAvatar || "/placeholder.svg"} alt={discipline.professor} />
                    <AvatarFallback className="text-xs">
                      {discipline.professor
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{discipline.professor}</p>
                    <p className="text-xs text-gray-500">{discipline.schedule}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Progresso</span>
                    <span className="text-sm text-gray-600">{discipline.progress}%</span>
                  </div>
                  <Progress value={discipline.progress} className="h-2" />
                </div>

                {/* Grade */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Nota Atual</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-gray-900">{discipline.grade}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Materiais</p>
                    <p className="text-sm font-semibold text-gray-900">{discipline.materials}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Vídeos</p>
                    <p className="text-sm font-semibold text-gray-900">{discipline.videos}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Alunos</p>
                    <p className="text-sm font-semibold text-gray-900">{discipline.students}</p>
                  </div>
                </div>

                {/* Pending Assignments */}
                {discipline.assignments.filter((a) => a.status === "pending").length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Próximas Entregas</p>
                    <div className="space-y-1">
                      {discipline.assignments
                        .filter((a) => a.status === "pending")
                        .slice(0, 2)
                        .map((assignment) => (
                          <div key={assignment.id} className="flex items-center justify-between text-xs">
                            <span className="text-gray-700 truncate">{assignment.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {new Date(assignment.dueDate).toLocaleDateString("pt-BR")}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Discipline Detail Modal/Sidebar */}
        {selectedDisciplineData && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl bg-white">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedDisciplineData.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {selectedDisciplineData.code} • {selectedDisciplineData.professor} •{" "}
                      {selectedDisciplineData.credits} créditos
                    </CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedDiscipline(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                    <TabsTrigger value="assignments">Atividades</TabsTrigger>
                    <TabsTrigger value="materials">Materiais</TabsTrigger>
                    <TabsTrigger value="grades">Notas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Informações da Disciplina</h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{selectedDisciplineData.schedule}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{selectedDisciplineData.room}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{selectedDisciplineData.students} alunos</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{selectedDisciplineData.rating} avaliação</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{selectedDisciplineData.description}</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Progresso</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Conclusão do Curso</span>
                              <span className="text-sm text-gray-600">{selectedDisciplineData.progress}%</span>
                            </div>
                            <Progress value={selectedDisciplineData.progress} className="h-3" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <Card className="border border-blue-200 bg-blue-50/50">
                              <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-blue-700">{selectedDisciplineData.grade}</p>
                                <p className="text-xs text-blue-600">Nota Atual</p>
                              </CardContent>
                            </Card>
                            <Card className="border border-green-200 bg-green-50/50">
                              <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-green-700">
                                  {selectedDisciplineData.assignments.filter((a) => a.status === "graded").length}
                                </p>
                                <p className="text-xs text-green-600">Atividades Concluídas</p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="assignments" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Atividades e Avaliações</h3>
                      <Badge variant="secondary">{selectedDisciplineData.assignments.length} atividades</Badge>
                    </div>
                    <div className="space-y-3">
                      {selectedDisciplineData.assignments.map((assignment) => (
                        <Card key={assignment.id} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                                  <Badge variant="outline" className={getStatusColor(assignment.status)}>
                                    {getStatusIcon(assignment.status)}
                                    <span className="ml-1">
                                      {assignment.status === "pending"
                                        ? "Pendente"
                                        : assignment.status === "submitted"
                                          ? "Enviado"
                                          : assignment.status === "graded"
                                            ? "Avaliado"
                                            : "Atrasado"}
                                    </span>
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span>
                                    Tipo:{" "}
                                    {assignment.type === "assignment"
                                      ? "Tarefa"
                                      : assignment.type === "exam"
                                        ? "Prova"
                                        : assignment.type === "project"
                                          ? "Projeto"
                                          : "Quiz"}
                                  </span>
                                  <span>Entrega: {new Date(assignment.dueDate).toLocaleDateString("pt-BR")}</span>
                                  {assignment.grade && (
                                    <span className="font-medium text-green-600">
                                      Nota: {assignment.grade}/{assignment.maxGrade}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {assignment.status === "pending" && (
                                  <Button size="sm" variant="outline">
                                    Enviar
                                  </Button>
                                )}
                                <Button size="sm" variant="ghost">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="materials" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Materiais de Estudo</h3>
                      <Badge variant="secondary">
                        {selectedDisciplineData.materials + selectedDisciplineData.videos} itens
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Documents */}
                      <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>Documentos ({selectedDisciplineData.materials})</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {Array.from({ length: Math.min(5, selectedDisciplineData.materials) }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-4 w-4 text-blue-500" />
                                <span className="text-sm">Aula {i + 1} - Slides.pdf</span>
                              </div>
                              <Button size="sm" variant="ghost">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Videos */}
                      <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center space-x-2">
                            <Video className="h-4 w-4" />
                            <span>Vídeos ({selectedDisciplineData.videos})</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {Array.from({ length: Math.min(5, selectedDisciplineData.videos) }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                              <div className="flex items-center space-x-3">
                                <PlayCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm">Aula {i + 1} - Conceitos</span>
                              </div>
                              <Button size="sm" variant="ghost">
                                <PlayCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="grades" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Histórico de Notas</h3>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Média: {selectedDisciplineData.grade}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {selectedDisciplineData.assignments
                        .filter((a) => a.grade)
                        .map((assignment) => (
                          <Card key={assignment.id} className="border border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                                  <p className="text-sm text-gray-600">
                                    {new Date(assignment.dueDate).toLocaleDateString("pt-BR")}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-green-600">{assignment.grade}</p>
                                  <p className="text-sm text-gray-500">de {assignment.maxGrade}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <ProtectedRoute>
      <DisciplinesPage />
    </ProtectedRoute>
  )
}
