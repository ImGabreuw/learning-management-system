"use client"

import { Textarea } from "@/components/ui/textarea"

import { useState } from "react"
import { X, Calendar, Users, Paperclip, Download, FileText, Tag, Book } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ProjectDetailPanelProps {
  project: {
    id: number
    title: string
    course: string
    courseColor: string
    description: string
    status: string
    progress: number
    dueDate: string
    tags: string[]
    team: string[]
    attachments: { id: number; name: string; size: string; type: string }[]
  }
  onClose: () => void
}

export function ProjectDetailPanel({ project, onClose }: ProjectDetailPanelProps) {
  const [currentStatus, setCurrentStatus] = useState(project.status)
  const [documentation, setDocumentation] = useState(
    "Este projeto visa desenvolver uma solução completa e escalável. A documentação será atualizada conforme o progresso do desenvolvimento.",
  )

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus)
  }

  const handleDownload = (attachment: { name: string; size: string }) => {
    console.log(`[v0] Downloading: ${attachment.name}`)
  }

  const statusOptions = [
    { label: "A Fazer", color: "bg-slate-200 text-slate-700 hover:bg-slate-300" },
    { label: "Em Progresso", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
    { label: "Concluído", color: "bg-green-100 text-green-700 hover:bg-green-200" },
  ]

  const getStatusColor = (status: string) => {
    const option = statusOptions.find((opt) => opt.label === status)
    return option?.color || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-200 mb-3">
          <div className="flex-1 pr-4 space-y-1.5">
            <h2 className="text-2xl font-bold text-slate-900">{project.title}</h2>
            <button
              className="inline-flex items-center px-2 py-1 rounded-md border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all w-fit"
              onClick={(e) => {
                e.stopPropagation()
                window.location.href = `/course/${project.course}`
              }}
            >
              <Book className={`h-3.5 w-3.5 mr-1.5 ${project.courseColor}`} />
              <span className="text-xs font-medium text-slate-700">{project.course}</span>
            </button>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-3">
          {/* Description Card */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-semibold">Descrição do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <p className="text-sm text-slate-700 leading-relaxed">{project.description}</p>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card className="border-slate-200">
            <CardContent className="px-4 py-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Status:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`${getStatusColor(currentStatus)} px-3 py-1 h-auto text-sm font-medium`}
                    >
                      {currentStatus}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="py-2">
                    {statusOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.label}
                        onClick={() => handleStatusChange(option.label)}
                        className={`${option.color} my-1`}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {/* Due Date Card */}
          <Card className="border-slate-200">
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-xs text-slate-600 mb-1">Prazo de Entrega</div>
                  <div className="text-sm font-medium text-slate-900">{project.dueDate}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-semibold">Progresso do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Conclusão geral</span>
                <span className="text-sm font-medium text-slate-900">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Team Card */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-semibold flex items-center">
                <Users className="h-4 w-4 mr-2 text-blue-600" />
                Equipe
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="flex flex-wrap gap-2">
                {project.team.map((member) => (
                  <Badge key={member} variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                    {member}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags Card */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-semibold flex items-center">
                <Tag className="h-4 w-4 mr-2 text-blue-600" />
                Tecnologias
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Documentation Card */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-semibold flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                Documentação
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <Textarea
                value={documentation}
                onChange={(e) => setDocumentation(e.target.value)}
                placeholder="Adicione notas, observações e documentação do projeto..."
                className="min-h-[100px] resize-none text-sm"
              />
            </CardContent>
          </Card>

          {/* Attachments Card */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-semibold flex items-center">
                <Paperclip className="h-4 w-4 mr-2 text-blue-600" />
                Arquivos do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="space-y-2">
                {project.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="p-1.5 bg-blue-50 rounded-md">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{attachment.name}</p>
                        <p className="text-xs text-slate-500">{attachment.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(attachment)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-3 bg-transparent text-sm">
                <Paperclip className="h-4 w-4 mr-2" />
                Adicionar Arquivo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
