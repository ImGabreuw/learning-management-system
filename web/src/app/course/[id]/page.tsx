"use client"
import { useParams } from "next/navigation"
import Navigation from "@/components/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Calendar, FileText, Target, Mail, Clock } from "lucide-react"

export default function CoursePage() {
  const params = useParams()
  const courseId = params.id

  // Mock course data
  const courseData: Record<string, any> = {
    "1": {
      name: "Compiladores",
      professor: {
        name: "Prof. Dr. Carlos Silva",
        email: "carlos.silva@mackenzie.br",
        image: "/wise-professor.png",
        bio: "Doutor em Ciência da Computação com especialização em Compiladores e Linguagens de Programação.",
      },
      progress: 78,
      nextClass: "Análise Léxica",
      color: "bg-blue-500",
      description:
        "Estudo dos princípios e técnicas de construção de compiladores, incluindo análise léxica, sintática, semântica e geração de código.",
      schedule: "Terças e Quintas, 19h00 - 20h40",
      activities: [
        { id: 1, title: "Lista de Exercícios 01", type: "Exercício", dueDate: "15/09/2024", status: "Concluída" },
        {
          id: 2,
          title: "Projeto de Analisador Léxico",
          type: "Projeto",
          dueDate: "22/09/2024",
          status: "Em Progresso",
        },
        { id: 3, title: "Prova 1 - Análise Léxica", type: "Prova", dueDate: "29/09/2024", status: "Pendente" },
      ],
      projects: [
        {
          id: 1,
          title: "Compilador Completo",
          description: "Desenvolvimento de um compilador completo para uma linguagem simplificada",
          progress: 45,
          deadline: "30/11/2024",
        },
      ],
      content: [
        { id: 1, title: "Introdução a Compiladores", type: "Aula", duration: "2h", completed: true },
        { id: 2, title: "Análise Léxica", type: "Aula", duration: "2h", completed: true },
        { id: 3, title: "Análise Sintática", type: "Aula", duration: "2h", completed: false },
        { id: 4, title: "Análise Semântica", type: "Aula", duration: "2h", completed: false },
      ],
    },
    "2": {
      name: "Computação Distribuída",
      professor: {
        name: "Profa. Dra. Maria Santos",
        email: "maria.santos@mackenzie.br",
        image: "/professor-woman.png",
        bio: "Doutora em Sistemas Distribuídos com foco em computação em nuvem e sistemas peer-to-peer.",
      },
      progress: 45,
      nextClass: "Sistemas P2P",
      color: "bg-green-500",
      description:
        "Conceitos fundamentais de sistemas distribuídos, incluindo comunicação, sincronização, consistência e tolerância a falhas.",
      schedule: "Segundas e Quartas, 21h00 - 22h40",
      activities: [
        {
          id: 1,
          title: "Atividade de Laboratório 01",
          type: "Laboratório",
          dueDate: "13/09/2024",
          status: "Em Progresso",
        },
        { id: 2, title: "Seminário sobre P2P", type: "Seminário", dueDate: "20/09/2024", status: "Pendente" },
      ],
      projects: [
        {
          id: 1,
          title: "Sistema Distribuído de Arquivos",
          description: "Implementação de um sistema de arquivos distribuído com replicação",
          progress: 30,
          deadline: "15/11/2024",
        },
      ],
      content: [
        { id: 1, title: "Introdução a Sistemas Distribuídos", type: "Aula", duration: "2h", completed: true },
        { id: 2, title: "Comunicação em Sistemas Distribuídos", type: "Aula", duration: "2h", completed: true },
        { id: 3, title: "Sistemas P2P", type: "Aula", duration: "2h", completed: false },
      ],
    },
  }

  const course = courseData[courseId as string] || courseData["1"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Dashboard", href: "/" }, { label: course.name }]} />

        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className={`w-16 h-16 ${course.color} rounded-xl flex items-center justify-center shadow-lg`}>
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{course.name}</h1>
              <p className="text-slate-600">{course.description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Progresso do Curso</span>
                  <span className="text-sm font-medium text-slate-900">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="content" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Conteúdo</TabsTrigger>
                <TabsTrigger value="activities">Atividades</TabsTrigger>
                <TabsTrigger value="projects">Projetos</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Conteúdo do Curso</CardTitle>
                    <CardDescription>Aulas e materiais disponíveis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.content.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                item.completed ? "bg-green-100" : "bg-slate-100"
                              }`}
                            >
                              <FileText className={`h-5 w-5 ${item.completed ? "text-green-600" : "text-slate-400"}`} />
                            </div>
                            <div>
                              <h3 className="font-medium text-slate-900">{item.title}</h3>
                              <p className="text-sm text-slate-500">
                                {item.type} • {item.duration}
                              </p>
                            </div>
                          </div>
                          <Button variant={item.completed ? "outline" : "default"} size="sm">
                            {item.completed ? "Revisar" : "Assistir"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities" className="space-y-4">
                <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Atividades</CardTitle>
                    <CardDescription>Exercícios, provas e trabalhos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.activities.map((activity: any) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white"
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-slate-900">{activity.title}</h3>
                              <Badge
                                variant={
                                  activity.status === "Concluída"
                                    ? "default"
                                    : activity.status === "Em Progresso"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {activity.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                              <span className="flex items-center space-x-1">
                                <FileText className="h-4 w-4" />
                                <span>{activity.type}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{activity.dueDate}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Projetos</CardTitle>
                    <CardDescription>Projetos em andamento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course.projects.map((project: any) => (
                        <div key={project.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-slate-900 mb-1">{project.title}</h3>
                              <p className="text-sm text-slate-600">{project.description}</p>
                            </div>
                            <Badge variant="outline">
                              <Calendar className="h-3 w-3 mr-1" />
                              {project.deadline}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-600">Progresso</span>
                              <span className="text-xs font-medium text-slate-900">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Professor Info */}
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Professor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={course.professor.image || "/placeholder.svg"} alt={course.professor.name} />
                    <AvatarFallback>{course.professor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-900">{course.professor.name}</h3>
                    <p className="text-sm text-slate-600 mt-2">{course.professor.bio}</p>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Course Info */}
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Horário</p>
                    <p className="text-sm text-slate-600">{course.schedule}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Próxima Aula</p>
                    <p className="text-sm text-slate-600">{course.nextClass}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
