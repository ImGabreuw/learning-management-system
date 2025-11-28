'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { uploadFile } from '@/lib/api'

interface FileUploadProps {
  subjectId?: string
  onUploadComplete?: (fileId: string) => void
  maxSizeMB?: number
  acceptedTypes?: string[]
}

export default function FileUpload({
  subjectId,
  onUploadComplete,
  maxSizeMB = 10,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.zip']
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tamanho
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setError(`Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`)
      return
    }

    // Validar tipo
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (acceptedTypes.length > 0 && !acceptedTypes.includes(fileExtension)) {
      setError(`Tipo de arquivo não permitido. Aceitos: ${acceptedTypes.join(', ')}`)
      return
    }

    setSelectedFile(file)
    setError('')
    setUploadSuccess(false)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setProgress(0)
    setError('')

    try {
      // Simular progresso (em produção, usar XMLHttpRequest para progresso real)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Criar metadados do arquivo
      const metadata = {
        title: selectedFile.name,
        fileName: selectedFile.name,
        fileType: selectedFile.type || 'application/octet-stream',
        fileSize: selectedFile.size,
        uploadedBy: 'current-user', // Será substituído no backend
        tags: subjectId ? [subjectId] : [],
        description: `Arquivo enviado: ${selectedFile.name}`
      }

      const response = await uploadFile(selectedFile, metadata)
      
      clearInterval(progressInterval)
      setProgress(100)
      setUploadSuccess(true)
      
      if (onUploadComplete && response.id) {
        onUploadComplete(response.id)
      }

      // Limpar após 2 segundos
      setTimeout(() => {
        setSelectedFile(null)
        setProgress(0)
        setUploadSuccess(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }, 2000)
    } catch (err) {
      console.error('Erro ao fazer upload:', err)
      setError('Erro ao fazer upload do arquivo. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setProgress(0)
    setUploadSuccess(false)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload de Arquivo
        </CardTitle>
        <CardDescription>
          Envie documentos, apresentações ou outros materiais (máx. {maxSizeMB}MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input de arquivo */}
        <div className="space-y-2">
          <Label htmlFor="file-upload">Selecionar arquivo</Label>
          <Input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            disabled={uploading}
            className="cursor-pointer"
          />
          <p className="text-sm text-muted-foreground">
            Formatos aceitos: {acceptedTypes.join(', ')}
          </p>
        </div>

        {/* Arquivo selecionado */}
        {selectedFile && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <File className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              {!uploading && !uploadSuccess && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {uploadSuccess && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </div>

            {/* Barra de progresso */}
            {uploading && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  Enviando... {progress}%
                </p>
              </div>
            )}

            {/* Sucesso */}
            {uploadSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Arquivo enviado com sucesso!
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Erro */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Botão de upload */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploading || uploadSuccess}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : uploadSuccess ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Enviado!
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Enviar Arquivo
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
