'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import FileUpload from '@/components/file-upload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FileText, Image, Video, File, Download, Trash2, Search, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { listFiles, downloadFile, deleteFile, FileResponse } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function FilesPage() {
  const [uploadedFiles, setUploadedFiles] = useState<FileResponse[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Carregar arquivos
  const loadFiles = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await listFiles({ title: searchQuery || undefined })
      setUploadedFiles(response.content)
    } catch (err) {
      console.error('Erro ao carregar arquivos:', err)
      setError('Não foi possível carregar os arquivos')
      setUploadedFiles([])
    } finally {
      setLoading(false)
    }
  }

  // Carregar ao montar e quando buscar
  useEffect(() => {
    loadFiles()
  }, [])

  // Buscar quando usuário para de digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== '') {
        loadFiles()
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleUploadComplete = (fileId: string) => {
    console.log('Arquivo enviado com sucesso:', fileId)
    // Recarregar lista de arquivos
    loadFiles()
  }

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const blob = await downloadFile(fileId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Erro ao baixar arquivo:', err)
      alert('Erro ao baixar arquivo')
    }
  }

  const handleDelete = async (fileId: string) => {
    if (!confirm('Tem certeza que deseja excluir este arquivo?')) return

    try {
      setDeletingId(fileId)
      await deleteFile(fileId)
      await loadFiles() // Recarregar lista
    } catch (err) {
      console.error('Erro ao excluir arquivo:', err)
      alert('Erro ao excluir arquivo')
    } finally {
      setDeletingId(null)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <Image className="h-5 w-5 text-green-600" />
    if (fileType.includes('video')) return <Video className="h-5 w-5 text-purple-600" />
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-600" />
    return <File className="h-5 w-5 text-blue-600" />
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Arquivos e Materiais</h1>
              <p className="text-muted-foreground mt-2">
                Gerencie seus documentos, apresentações e materiais de estudo
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="upload" className="space-y-6">
              <TabsList>
                <TabsTrigger value="upload">Fazer Upload</TabsTrigger>
                <TabsTrigger value="my-files">Meus Arquivos</TabsTrigger>
                <TabsTrigger value="shared">Compartilhados</TabsTrigger>
              </TabsList>

              {/* Tab: Upload */}
              <TabsContent value="upload" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Componente de Upload */}
                  <FileUpload onUploadComplete={handleUploadComplete} />

                  {/* Informações e Dicas */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Dicas de Upload</CardTitle>
                      <CardDescription>
                        Organize seus arquivos para facilitar o acesso
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Documentos</p>
                            <p className="text-xs text-muted-foreground">
                              PDF, Word, PowerPoint para materiais de estudo
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Image className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Imagens</p>
                            <p className="text-xs text-muted-foreground">
                              Diagramas, gráficos e ilustrações
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Video className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Vídeos</p>
                            <p className="text-xs text-muted-foreground">
                              Gravações de aulas e apresentações
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <File className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Código</p>
                            <p className="text-xs text-muted-foreground">
                              Projetos, exercícios e exemplos (ZIP)
                            </p>
                          </div>
                        </div>
                      </div>

                      <Alert>
                        <AlertDescription>
                          💡 Use nomes descritivos para facilitar a busca posterior
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tab: Meus Arquivos */}
              <TabsContent value="my-files" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Meus Arquivos</CardTitle>
                        <CardDescription>
                          Arquivos que você enviou
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Buscar arquivos..."
                            className="pl-8 w-[250px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {loading ? (
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))}
                      </div>
                    ) : uploadedFiles.length === 0 ? (
                      <div className="text-center py-12">
                        <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          {searchQuery ? 'Nenhum arquivo encontrado' : 'Nenhum arquivo enviado ainda'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {searchQuery ? 'Tente outro termo de busca' : 'Use a aba "Fazer Upload" para enviar seus primeiros arquivos'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {uploadedFiles.length} arquivo(s) encontrado(s)
                        </p>
                        
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>Arquivo</TableHead>
                                <TableHead>Tamanho</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {uploadedFiles.map((file) => (
                                <TableRow key={file.id}>
                                  <TableCell>
                                    {getFileIcon(file.fileType)}
                                  </TableCell>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">{file.title}</p>
                                      <p className="text-xs text-muted-foreground">{file.filename}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {formatFileSize(file.size)}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {new Date(file.uploadedAt).toLocaleDateString('pt-BR')}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDownload(file.id, file.filename)}
                                        title="Baixar arquivo"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(file.id)}
                                        disabled={deletingId === file.id}
                                        title="Excluir arquivo"
                                      >
                                        {deletingId === file.id ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <Trash2 className="h-4 w-4 text-red-600" />
                                        )}
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Compartilhados */}
              <TabsContent value="shared" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Arquivos Compartilhados</CardTitle>
                    <CardDescription>
                      Materiais compartilhados por professores e colegas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Nenhum arquivo compartilhado
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Arquivos compartilhados com você aparecerão aqui
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
