"use client"

import type React from "react"

import { useState } from "react"
import { X, Calendar, Paperclip, Download, Upload, FileText, CheckCircle2, Book } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TaskDetailPanelProps {
  task: {
    id: number
    title: string
    discipline: string
    topics: string[]
    status: string
    dueDate: string
    time?: string
    progress: number
    description?: string
    attachments?: { name: string; size: string; url?: string }[]
    subtasks?: { id: number; title: string; completed: boolean }[]
  }
  onClose: () => void
  onUpdateTask?: (taskId: number, updates: any) => void
}

export function TaskDetailPanel({ task, onClose, onUpdateTask }: TaskDetailPanelProps) {
  const [subtasks, setSubtasks] = useState(task.subtasks || [])
  const [currentStatus, setCurrentStatus] = useState(task.status)
  const [submissionText, setSubmissionText] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const completedSubtasks = subtasks.filter((st) => st.completed).length
  const progressPercentage = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0

  const toggleSubtask = (subtaskId: number) => {
    const updatedSubtasks = subtasks.map((st) => (st.id === subtaskId ? { ...st, completed: !st.completed } : st))
    setSubtasks(updatedSubtasks)

    if (onUpdateTask) {
      onUpdateTask(task.id, { subtasks: updatedSubtasks })
    }
  }

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus)
    if (onUpdateTask) {
      onUpdateTask(task.id, { status: newStatus })
    }
  }

  const handleDownload = (attachment: { name: string; size: string; url?: string }) => {
    if (attachment.url) {
      window.open(attachment.url, "_blank")
    } else {
      console.log(`[v0] Downloading: ${attachment.name}`)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(files)])
    }
  }

  const handleSubmit = () => {
    console.log("[v0] Submitting task:", {
      taskId: task.id,
      text: submissionText,
      files: uploadedFiles,
    })
    // Here you would typically send the submission to your backend
    alert("Atividade enviada com sucesso!")
  }

  const statusOptions = [
    { label: "A Fazer", color: "bg-slate-200 text-slate-700 hover:bg-slate-300" },
    { label: "Em Progresso", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
    { label: "Concluído", color: "bg-green-100 text-green-800 hover:bg-green-200" },
  ]

  const getStatusColor = (status: string) => {
    const option = statusOptions.find((opt) => opt.label === status)
    return option?.color || "bg-gray-100 text-gray-800"
  }

  const contentFiles = [
    { id: 1, name: "Aula_01_Introducao.pdf", size: "3.2 MB", type: "pdf" },
    { id: 2, name: "Slides_Teoria.pptx", size: "5.8 MB", type: "pptx" },
    { id: 3, name: "Codigo_Exemplo.zip", size: "1.2 MB", type: "zip" },
  ]

  const topicFiles = task.topics.map((topic, index) => ({
    id: index + 1,
    name: `${topic}.pdf`,
    size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
    type: "pdf",
  }))

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-start justify-between pb-3 border-b border-slate-200 mb-3">
          <div className="flex-1 pr-4 space-y-1.5">
            <h2 className="text-2xl font-bold text-slate-900">{task.title}</h2>
            <button
              className="inline-flex items-center px-2 py-1 rounded-md border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all w-fit"
              onClick={(e) => {
                e.stopPropagation()
                window.location.href = `/course/${task.discipline}`
              }}
            >
              <Book className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
              <span className="text-xs font-medium text-slate-700">{task.discipline}</span>
            </button>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-3">
          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-semibold">Descrição da Atividade</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <p className="text-sm text-slate-700 leading-relaxed">
                {task.description ||
                  "Complete os exercícios propostos e envie o relatório detalhado com suas análises e conclusões. Certifique-se de incluir todos os arquivos necessários e documentação adequada."}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-xs text-slate-600 mb-1">Prazo de Entrega</div>
                  <div className="text-sm font-medium text-slate-900">{task.dueDate}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-semibold">Tópicos Relacionados</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="space-y-2">
                {topicFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="p-1.5 bg-blue-50 rounded-md">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{file.name}</p>
                        <p className="text-xs text-slate-500">{file.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(file)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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

          {subtasks.length > 0 && (
            <Card className="border-slate-200">
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-sm font-semibold">Progresso da Atividade</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3 space-y-2.5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      {completedSubtasks} de {subtasks.length} subtarefas concluídas
                    </span>
                    <span className="text-sm font-medium text-slate-900">{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <div className="space-y-2">
                  {subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => toggleSubtask(subtask.id)}
                    >
                      <Checkbox checked={subtask.completed} onCheckedChange={() => toggleSubtask(subtask.id)} />
                      <span
                        className={`text-sm flex-1 ${subtask.completed ? "line-through text-slate-400" : "text-slate-700"}`}
                      >
                        {subtask.title}
                      </span>
                      {subtask.completed && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-semibold flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                Material de Apoio
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="space-y-2">
                {contentFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-blue-50 rounded-md">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{file.name}</p>
                        <p className="text-xs text-slate-500">{file.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(file)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-slate-50">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-semibold flex items-center">
                <Upload className="h-4 w-4 mr-2 text-green-600" />
                Enviar Atividade
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3 space-y-2.5">
              <div>
                <label className="text-xs font-medium text-slate-700 mb-2 block">Comentários (opcional)</label>
                <Textarea
                  placeholder="Adicione comentários sobre sua entrega..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 mb-2 block">Arquivos da Entrega</label>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Paperclip className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{file.name}</p>
                          <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <label className="flex items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 hover:bg-white transition-colors cursor-pointer">
                    <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                    <div className="text-center">
                      <Upload className="h-5 w-5 text-slate-400 mx-auto mb-1" />
                      <p className="text-sm text-slate-600">Clique para adicionar arquivos</p>
                      <p className="text-xs text-slate-500 mt-0.5">PDF, ZIP, DOC, etc.</p>
                    </div>
                  </label>
                </div>
              </div>

              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleSubmit}
                disabled={uploadedFiles.length === 0}
              >
                <Upload className="h-4 w-4 mr-2" />
                Enviar Atividade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
