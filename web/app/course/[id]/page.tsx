"use client"
import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Calendar, FileText, Mail, CheckCircle2, Target, ChevronLeft, ChevronRight } from "lucide-react"
import { TaskDetailPanel } from "@/components/task-detail-panel"
import { ProjectDetailPanel } from "@/components/project-detail-panel"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function CoursePage() {
  const params = useParams()
  const courseId = params.id
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (panelRef.current && panelRef.current.contains(target)) {
        return
      }

      const clickedElement = event.target as HTMLElement
      if (clickedElement.closest('[role="menu"]') || clickedElement.closest("[data-radix-popper-content-wrapper]")) {
        return
      }

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

  const courseData: Record<string, any> = {
    "1": {
      name: "Compiladores",
      professor: {
        name: "Prof. Dr. Carlos Silva",
        email: "carlos.silva@mackenzie.br",
        image: "/wise-professor.png",
        bio: "Doutor em Ciência da Computação com especialização em Compiladores e Linguagens de Programação.",
        office: "Prédio 6, Sala 302",
        officeHours: "Terças e Quintas, 17h00 - 18h30",
        researchAreas: ["Compiladores", "Linguagens de Programação", "Otimização de Código"],
        publications: "15+ artigos publicados em conferências internacionais",
      },
      progress: 78,
      nextClass: "Análise Léxica",
      color: "bg-purple-500",
      colorClass: "text-purple-600",
      description:
        "Estudo dos princípios e técnicas de construção de compiladores, incluindo análise léxica, sintática, semântica e geração de código.",
      schedule: "Terças e Quintas, 19h00 - 20h40",
      tasks: [
        {
          id: 1,
          title: "Lista de Exercícios 01",
          discipline: "Compiladores",
          topics: ["Análise Léxica", "Expressões Regulares"],
          status: "Concluído",
          dueDate: "Sexta-feira, 15 de Setembro - 23:59",
          progress: 100,
          date: new Date(2024, 8, 15),
        },
        {
          id: 2,
          title: "Projeto de Analisador Léxico",
          discipline: "Compiladores",
          topics: ["Análise Léxica", "Implementação"],
          status: "Em Progresso",
          dueDate: "Domingo, 22 de Setembro - 23:59",
          progress: 65,
          date: new Date(2024, 8, 22),
        },
        {
          id: 3,
          title: "Prova 1 - Análise Léxica",
          discipline: "Compiladores",
          topics: ["Análise Léxica", "Teoria"],
          status: "A Fazer",
          dueDate: "Domingo, 29 de Setembro - 23:59",
          progress: 0,
          date: new Date(2024, 8, 29),
        },
      ],
      projects: [
        {
          id: 1,
          title: "Compilador Completo",
          course: "Compiladores",
          courseColor: "text-purple-600",
          description: "Desenvolvimento de um compilador completo para uma linguagem simplificada",
          status: "Em Progresso",
          progress: 45,
          dueDate: "30 de Novembro de 2024",
          date: new Date(2024, 10, 30),
          tags: ["C++", "Flex", "Bison", "Compiladores"],
          image: "from-purple-500 to-purple-600",
          team: ["João Silva", "Maria Santos", "Pedro Costa"],
          attachments: [
            { id: 1, name: "especificacao.pdf", size: "2.5 MB", type: "pdf" },
            { id: 2, name: "codigo-fonte.zip", size: "1.8 MB", type: "zip" },
          ],
        },
      ],
      content: [
        { id: 1, title: "Introdução a Compiladores", type: "Aula", duration: "2h", completed: true, date: "05/09" },
        { id: 2, title: "Análise Léxica", type: "Aula", duration: "2h", completed: true, date: "10/09" },
        { id: 3, title: "Análise Sintática", type: "Aula", duration: "2h", completed: false, date: "17/09" },
        { id: 4, title: "Análise Semântica", type: "Aula", duration: "2h", completed: false, date: "24/09" },
        { id: 5, title: "Geração de Código", type: "Aula", duration: "2h", completed: false, date: "01/10" },
      ],
    },
    "2": {
      name: "Computação Distribuída",
      professor: {
        name: "Profa. Dra. Maria Santos",
        email: "maria.santos@mackenzie.br",
        image: "/professor-woman.png",
        bio: "Doutora em Sistemas Distribuídos com foco em computação em nuvem e sistemas peer-to-peer.",
        office: "Prédio 6, Sala 405",
        officeHours: "Segundas e Quartas, 19h00 - 20h30",
        researchAreas: ["Sistemas Distribuídos", "Computação em Nuvem", "Blockchain"],
        publications: "20+ artigos publicados em periódicos de alto impacto",
      },
      progress: 45,
      nextClass: "Sistemas P2P",
      color: "bg-green-500",
      colorClass: "text-green-600",
      description:
        "Conceitos fundamentais de sistemas distribuídos, incluindo comunicação, sincronização, consistência e tolerância a falhas.",
      schedule: "Segundas e Quartas, 21h00 - 22h40",
      tasks: [
        {
          id: 1,
          title: "Atividade de Laboratório 01",
          discipline: "Computação Distribuída",
          topics: ["Comunicação", "Sockets"],
          status: "Em Progresso",
          dueDate: "Sexta-feira, 13 de Setembro - 23:59",
          progress: 50,
          date: new Date(2024, 8, 13),
        },
        {
          id: 2,
          title: "Seminário sobre P2P",
          discipline: "Computação Distribuída",
          topics: ["P2P", "Apresentação"],
          status: "A Fazer",
          dueDate: "Sexta-feira, 20 de Setembro - 23:59",
          progress: 0,
          date: new Date(2024, 8, 20),
        },
      ],
      projects: [
        {
          id: 1,
          title: "Sistema Distribuído de Arquivos",
          course: "Computação Distribuída",
          courseColor: "text-green-600",
          description: "Implementação de um sistema de arquivos distribuído com replicação",
          status: "A Fazer",
          progress: 30,
          dueDate: "15 de Novembro de 2024",
          date: new Date(2024, 10, 15),
          tags: ["Python", "Sockets", "Replicação", "Distribuído"],
          image: "from-green-500 to-green-600",
          team: ["Ana Paula", "Carlos Eduardo", "Fernanda Lima"],
          attachments: [
            { id: 1, name: "requisitos.pdf", size: "1.2 MB", type: "pdf" },
            { id: 2, name: "diagrama-arquitetura.png", size: "850 KB", type: "png" },
          ],
        },
      ],
      content: [
        {
          id: 1,
          title: "Introdução a Sistemas Distribuídos",
          type: "Aula",
          duration: "2h",
          completed: true,
          date: "02/09",
        },
        {
          id: 2,
          title: "Comunicação em Sistemas Distribuídos",
          type: "Aula",
          duration: "2h",
          completed: true,
          date: "09/09",
        },
        { id: 3, title: "Sistemas P2P", type: "Aula", duration: "2h", completed: false, date: "16/09" },
      ],
    },
  }

  const course = courseData[courseId as string] || courseData["1"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)

  const getDeadlinesForDate = (day: number) => {
    const deadlines: any[] = []
    const checkDate = new Date(year, month, day)

    course.tasks?.forEach((task: any) => {
      if (
        task.date &&
        task.date.getDate() === day &&
        task.date.getMonth() === month &&
        task.date.getFullYear() === year
      ) {
        deadlines.push({ type: "task", title: task.title, status: task.status })
      }
    })

    course.projects?.forEach((project: any) => {
      if (
        project.date &&
        project.date.getDate() === day &&
        project.date.getMonth() === month &&
        project.date.getFullYear() === year
      ) {
        deadlines.push({ type: "project", title: project.title, status: project.status })
      }
    })

    return deadlines
  }

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const [taskStatuses, setTaskStatuses] = useState<{ [key: number]: string }>(
    course.tasks?.reduce((acc: any, task: any) => ({ ...acc, [task.id]: task.status }), {}) || {},
  )

  const updateTaskStatus = (taskId: number, newStatus: string) => {
    setTaskStatuses((prev) => ({ ...prev, [taskId]: newStatus }))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="flex items-center space-x-4 mb-8">
          <div className={`w-16 h-16 ${course.color} rounded-xl flex items-center justify-center shadow-lg`}>
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{course.name}</h1>
            <p className="text-slate-600">{course.schedule}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-slate-200">
              <CardHeader className="pb-1 pt-3 px-4">
                <CardTitle className="text-sm font-semibold">Sobre o Curso</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3 pt-2">
                <p className="text-sm text-slate-700 leading-relaxed mb-4">{course.description}</p>
                <div className="space-y-2 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Conclusão</span>
                    <span className="text-sm font-medium text-slate-900">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="pb-1 pt-3 px-4">
                <CardTitle className="text-sm font-semibold">Cronograma de Aulas</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3 pt-2">
                <div className="space-y-2">
                  {course.content.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className={`p-1.5 rounded-md ${item.completed ? "bg-green-50" : "bg-slate-100"}`}>
                          <FileText className={`h-4 w-4 ${item.completed ? "text-green-600" : "text-slate-400"}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500">
                            {item.date} • {item.duration}
                          </p>
                        </div>
                      </div>
                      {item.completed && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="pb-1 pt-3 px-4">
                <CardTitle className="text-sm font-semibold">Tarefas</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3 pt-2">
                <div className="space-y-3">
                  {course.tasks?.map((task: any) => {
                    const currentStatus = taskStatuses[task.id]
                    return (
                      <div
                        key={task.id}
                        className="p-3 border border-slate-200 rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedTask(task)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm text-slate-900 flex-1">{task.title}</h3>
                          <p className="text-xs text-slate-500 ml-2 whitespace-nowrap">
                            {task.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {task.topics.slice(0, 2).map((topic: string) => (
                            <Badge key={topic} variant="outline" className="text-xs px-2 py-0.5">
                              {topic}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center space-x-2">
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
                                  updateTaskStatus(task.id, "A Fazer")
                                }}
                                className="my-1"
                              >
                                A Fazer
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateTaskStatus(task.id, "Em Progresso")
                                }}
                                className="my-1"
                              >
                                Em Progresso
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateTaskStatus(task.id, "Concluído")
                                }}
                                className="my-1"
                              >
                                Concluído
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Progress
                            value={task.progress}
                            className={`h-2 w-16 ${task.progress === 0 ? "[&>div]:bg-gray-300" : ""}`}
                          />
                          <span className="text-xs font-medium text-slate-600">{task.progress}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="pb-1 pt-3 px-4">
                <CardTitle className="text-sm font-semibold">Projetos</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.projects?.map((project: any) => (
                    <div
                      key={project.id}
                      className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div
                        className={`w-full h-32 bg-gradient-to-br ${project.image} flex items-center justify-center`}
                      >
                        <Target className="h-12 w-12 text-white opacity-90" />
                      </div>
                      <div className="p-3">
                        <h3 className="font-bold text-sm text-slate-900 mb-2">{project.title}</h3>
                        <p className="text-xs text-slate-600 mb-3 line-clamp-2">{project.description}</p>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {project.tags.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center space-x-2 mb-2">
                          <Badge
                            variant="secondary"
                            className={`text-xs px-2 py-0.5 ${
                              project.status === "Em Progresso"
                                ? "bg-yellow-100 text-yellow-700"
                                : project.status === "A Fazer"
                                  ? "bg-slate-200 text-slate-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {project.status}
                          </Badge>
                          <Progress
                            value={project.progress}
                            className={`h-2 w-16 ${project.progress === 0 ? "[&>div]:bg-gray-300" : ""}`}
                          />
                          <span className="text-xs font-medium text-slate-600">{project.progress}%</span>
                        </div>

                        <p className="text-xs text-slate-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {project.dueDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Calendário de Entregas</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium text-slate-700">
                      {monthNames[month]} {year}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-2">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["D", "S", "T", "Q", "Q", "S", "S"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-slate-500 py-1">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1
                    const deadlines = getDeadlinesForDate(day)
                    const hasDeadline = deadlines.length > 0

                    return (
                      <div
                        key={day}
                        className={`aspect-square flex items-center justify-center text-xs rounded-md relative ${
                          hasDeadline
                            ? `${course.color} text-white font-semibold cursor-pointer hover:opacity-90`
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                        title={deadlines.map((d) => d.title).join(", ")}
                      >
                        {day}
                        {hasDeadline && deadlines.length > 1 && (
                          <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <div className={`w-3 h-3 ${course.color} rounded`} />
                    <span>Entregas e Provas</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="pb-1 pt-3 px-4">
                <CardTitle className="text-sm font-semibold">Professor</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3 pt-2">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={course.professor.image || "/placeholder.svg"} alt={course.professor.name} />
                      <AvatarFallback>{course.professor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">{course.professor.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{course.professor.bio}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1">Sala</p>
                      <p className="text-xs text-slate-600">{course.professor.office}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1">Horário de Atendimento</p>
                      <p className="text-xs text-slate-600">{course.professor.officeHours}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1">Áreas de Pesquisa</p>
                      <div className="flex flex-wrap gap-1">
                        {course.professor.researchAreas.map((area: string) => (
                          <Badge key={area} variant="secondary" className="text-xs px-2 py-0.5">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1">Publicações</p>
                      <p className="text-xs text-slate-600">{course.professor.publications}</p>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-transparent mt-2">
                    <Mail className="h-3 w-3 mr-2" />
                    Enviar Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
