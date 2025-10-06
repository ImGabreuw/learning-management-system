"use client"

import { X, Calendar, Clock, Paperclip, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface TaskDetailPanelProps {
  task: {
    id: number
    title: string
    discipline: string
    topics: string[]
    status: string
    dueDate: string
    time: string
    progress: number
    description?: string
    attachments?: { name: string; size: string }[]
    subtasks?: { id: number; title: string; completed: boolean }[]
  }
  onClose: () => void
}

export function TaskDetailPanel({ task, onClose }: TaskDetailPanelProps) {
  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{task.title}</h2>
            <p className="text-slate-600">{task.discipline}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <Badge variant={task.status === "Em Progresso" ? "default" : "secondary"} className="text-sm">
            {task.status}
          </Badge>
        </div>

        {/* Due Date */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center space-x-3 text-slate-700">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span className="font-medium">{task.dueDate}</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-700">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="font-medium">{task.time}</span>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Topics */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Tópicos</h3>
          <div className="flex flex-wrap gap-2">
            {task.topics.map((topic) => (
              <Badge key={topic} variant="outline">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Descrição</h3>
          <p className="text-slate-600 leading-relaxed">
            {task.description ||
              "Complete os exercícios propostos e envie o relatório detalhado com suas análises e conclusões."}
          </p>
        </div>

        <Separator className="my-6" />

        {/* Progress */}
        {task.progress > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Progresso</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Conclusão</span>
                <span className="text-sm font-medium text-slate-900">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-2" />
            </div>
          </div>
        )}

        {/* Subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Subtarefas</h3>
            <div className="space-y-2">
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50">
                  <CheckCircle2 className={`h-5 w-5 ${subtask.completed ? "text-green-600" : "text-slate-300"}`} />
                  <span className={`text-sm ${subtask.completed ? "line-through text-slate-400" : "text-slate-700"}`}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-6" />

        {/* Attachments */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Anexos</h3>
          <div className="space-y-2">
            {task.attachments && task.attachments.length > 0 ? (
              task.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  <div className="flex items-center space-x-3">
                    <Paperclip className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{attachment.name}</p>
                      <p className="text-xs text-slate-500">{attachment.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg">
                <Paperclip className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Enunciado.pdf</p>
                  <p className="text-xs text-slate-500">2.4 MB</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button className="flex-1">Marcar como Concluída</Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            Editar
          </Button>
        </div>
      </div>
    </div>
  )
}
