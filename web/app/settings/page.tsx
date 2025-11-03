"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Navigation from "@/components/navigation" // Fixed import to use default import instead of named import
import ProtectedRoute from "@/components/ProtectedRoute"
import {
  User,
  Bell,
  Shield,
  Palette,
  Camera,
  Save,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  Award,
  Target,
} from "lucide-react"

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)

  // Profile state
  const [profile, setProfile] = useState({
    name: "João Silva",
    email: "joao.silva@mackenzie.br",
    phone: "+55 11 99999-9999",
    bio: "Estudante de Ciência da Computação apaixonado por tecnologia e inovação.",
    location: "São Paulo, SP",
    birthDate: "1995-03-15",
    course: "Ciência da Computação",
    semester: "8º Semestre",
    ra: "41234567",
    avatar: "/student-avatar.png",
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    assignmentReminders: true,
    gradeUpdates: true,
    courseAnnouncements: true,
    opportunityAlerts: false,
    weeklyDigest: true,
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    dataSharing: false,
  })

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: "light",
    language: "pt-BR",
    fontSize: "medium",
    compactMode: false,
  })

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate save process
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
          <p className="text-gray-600">Gerencie suas preferências e configurações da conta</p>
        </div>

        <div className="flex justify-end mb-6">
          <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Salvando...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Salvar Alterações</span>
              </div>
            )}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacidade</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Aparência</span>
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Acadêmico</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informações Pessoais</span>
                </CardTitle>
                <CardDescription>Atualize suas informações pessoais e de contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                      <Camera className="h-4 w-4" />
                      <span>Alterar Foto</span>
                    </Button>
                    <p className="text-sm text-gray-500">JPG, PNG ou GIF. Máximo 2MB.</p>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Localização</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="birthDate"
                        type="date"
                        value={profile.birthDate}
                        onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    placeholder="Conte um pouco sobre você..."
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Preferências de Notificação</span>
                </CardTitle>
                <CardDescription>Configure como e quando você deseja receber notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações por Email</Label>
                      <p className="text-sm text-gray-500">Receba notificações importantes por email</p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações Push</Label>
                      <p className="text-sm text-gray-500">Receba notificações no navegador</p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Lembretes de Tarefas</Label>
                      <p className="text-sm text-gray-500">Seja notificado sobre prazos de entrega</p>
                    </div>
                    <Switch
                      checked={notifications.assignmentReminders}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, assignmentReminders: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Atualizações de Notas</Label>
                      <p className="text-sm text-gray-500">Receba notificações quando novas notas forem publicadas</p>
                    </div>
                    <Switch
                      checked={notifications.gradeUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, gradeUpdates: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Anúncios do Curso</Label>
                      <p className="text-sm text-gray-500">Receba comunicados importantes dos professores</p>
                    </div>
                    <Switch
                      checked={notifications.courseAnnouncements}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, courseAnnouncements: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertas de Oportunidades</Label>
                      <p className="text-sm text-gray-500">Seja notificado sobre novas oportunidades relevantes</p>
                    </div>
                    <Switch
                      checked={notifications.opportunityAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, opportunityAlerts: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Resumo Semanal</Label>
                      <p className="text-sm text-gray-500">Receba um resumo das suas atividades semanalmente</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Configurações de Privacidade</span>
                </CardTitle>
                <CardDescription>Controle quem pode ver suas informações e como seus dados são usados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Visibilidade do Perfil</Label>
                    <Select
                      value={privacy.profileVisibility}
                      onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Público - Visível para todos</SelectItem>
                        <SelectItem value="students">Apenas Estudantes</SelectItem>
                        <SelectItem value="private">Privado - Apenas você</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mostrar Email no Perfil</Label>
                      <p className="text-sm text-gray-500">Permitir que outros vejam seu email</p>
                    </div>
                    <Switch
                      checked={privacy.showEmail}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showEmail: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mostrar Telefone no Perfil</Label>
                      <p className="text-sm text-gray-500">Permitir que outros vejam seu telefone</p>
                    </div>
                    <Switch
                      checked={privacy.showPhone}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showPhone: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Permitir Mensagens</Label>
                      <p className="text-sm text-gray-500">Outros usuários podem enviar mensagens para você</p>
                    </div>
                    <Switch
                      checked={privacy.allowMessages}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, allowMessages: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compartilhamento de Dados</Label>
                      <p className="text-sm text-gray-500">Permitir uso de dados para melhorar a experiência</p>
                    </div>
                    <Switch
                      checked={privacy.dataSharing}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, dataSharing: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Aparência e Idioma</span>
                </CardTitle>
                <CardDescription>Personalize a aparência da plataforma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Tema</Label>
                    <Select
                      value={appearance.theme}
                      onValueChange={(value) => setAppearance({ ...appearance, theme: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Idioma</Label>
                    <Select
                      value={appearance.language}
                      onValueChange={(value) => setAppearance({ ...appearance, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tamanho da Fonte</Label>
                    <Select
                      value={appearance.fontSize}
                      onValueChange={(value) => setAppearance({ ...appearance, fontSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Pequena</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="large">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Compacto</Label>
                    <p className="text-sm text-gray-500">Reduz o espaçamento para mostrar mais conteúdo</p>
                  </div>
                  <Switch
                    checked={appearance.compactMode}
                    onCheckedChange={(checked) => setAppearance({ ...appearance, compactMode: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Academic Tab */}
          <TabsContent value="academic" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Informações Acadêmicas</span>
                </CardTitle>
                <CardDescription>Suas informações acadêmicas e progresso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ra">Registro Acadêmico (RA)</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="ra"
                        value={profile.ra}
                        onChange={(e) => setProfile({ ...profile, ra: e.target.value })}
                        className="pl-10"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="course">Curso</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="course"
                        value={profile.course}
                        onChange={(e) => setProfile({ ...profile, course: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="semester">Semestre Atual</Label>
                    <Select
                      value={profile.semester}
                      onValueChange={(value) => setProfile({ ...profile, semester: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1º Semestre">1º Semestre</SelectItem>
                        <SelectItem value="2º Semestre">2º Semestre</SelectItem>
                        <SelectItem value="3º Semestre">3º Semestre</SelectItem>
                        <SelectItem value="4º Semestre">4º Semestre</SelectItem>
                        <SelectItem value="5º Semestre">5º Semestre</SelectItem>
                        <SelectItem value="6º Semestre">6º Semestre</SelectItem>
                        <SelectItem value="7º Semestre">7º Semestre</SelectItem>
                        <SelectItem value="8º Semestre">8º Semestre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Academic Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border border-blue-200 bg-blue-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Target className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-900">Média Geral</p>
                          <p className="text-2xl font-bold text-blue-700">8.7</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-green-200 bg-green-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <BookOpen className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-900">Disciplinas</p>
                          <p className="text-2xl font-bold text-green-700">6</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-purple-200 bg-purple-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Award className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-900">Créditos</p>
                          <p className="text-2xl font-bold text-purple-700">180</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Interests and Skills */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Áreas de Interesse</Label>
                    <p className="text-sm text-gray-500 mb-3">
                      Selecione suas áreas de interesse para receber recomendações personalizadas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Inteligência Artificial",
                        "Desenvolvimento Web",
                        "Mobile",
                        "Data Science",
                        "Cybersecurity",
                        "Cloud Computing",
                        "DevOps",
                        "Machine Learning",
                      ].map((interest) => (
                        <Badge key={interest} variant="secondary" className="cursor-pointer hover:bg-blue-100">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Habilidades</Label>
                    <p className="text-sm text-gray-500 mb-3">Suas principais habilidades técnicas</p>
                    <div className="flex flex-wrap gap-2">
                      {["JavaScript", "Python", "React", "Node.js", "SQL", "Git", "Docker", "AWS"].map((skill) => (
                        <Badge key={skill} variant="outline" className="cursor-pointer hover:bg-green-100">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  )
}
