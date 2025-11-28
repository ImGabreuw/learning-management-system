"use client"

import { useState, useEffect } from "react"
import {
  Edit3,
  Save,
  X,
  Plus,
  Star,
  TrendingUp,
  Award,
  Target,
  Code,
  Mail,
  Bell,
  GraduationCap,
  Calendar,
  Upload,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/context/AuthContext"
import { getUserProfile, updateUserProfile, saveUserProfile } from "@/lib/api"

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  location: string
  course: string
  semester: number
  gpa: number
  interests: string[]
  skills: string[]
  careerGoals: string[]
  academicPerformance: {
    [subject: string]: {
      grade: number
      credits: number
      semester: string
    }
  }
  achievements: {
    id: string
    title: string
    description: string
    date: string
    type: "academic" | "project" | "competition" | "certification"
  }[]
  settings: {
    notifications: {
      email: boolean
      push: boolean
      deadlines: boolean
      opportunities: boolean
    }
  }
}

interface ProfileManagementProps {
  initialProfile?: UserProfile
  onSave?: (profile: UserProfile) => void
}

export function ProfileManagement({ initialProfile, onSave }: ProfileManagementProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [profile, setProfile] = useState<UserProfile>(
    initialProfile || {
      id: "1",
      name: "João Silva",
      email: "joao.silva@mackenzie.br",
      phone: "(11) 99999-9999",
      location: "São Paulo, SP",
      course: "Ciência da Computação",
      semester: 6,
      gpa: 8.5,
      bio: "Estudante apaixonado por tecnologia, com foco em desenvolvimento web e inteligência artificial.",
      interests: ["Desenvolvimento Web", "Inteligência Artificial", "Data Science", "Mobile", "DevOps"],
      skills: ["React", "Node.js", "Python", "TypeScript", "PostgreSQL", "Docker"],
      careerGoals: ["Full-Stack Developer", "Data Scientist", "Tech Lead"],
      academicPerformance: {
        Compiladores: { grade: 8.5, credits: 4, semester: "2024.1" },
        "Computação Distribuída": { grade: 7.8, credits: 4, semester: "2024.1" },
        "Teoria dos Grafos": { grade: 9.2, credits: 3, semester: "2024.1" },
        "Inteligência Artificial": { grade: 8.8, credits: 4, semester: "2024.2" },
        "Banco de Dados": { grade: 9.0, credits: 4, semester: "2023.2" },
      },
      achievements: [
        {
          id: "1",
          title: "1º Lugar - Hackathon Mackenzie 2024",
          description: "Desenvolveu solução inovadora para gestão acadêmica",
          date: "2024-05-15",
          type: "competition",
        },
        {
          id: "2",
          title: "Certificação AWS Cloud Practitioner",
          description: "Certificação em computação em nuvem da Amazon",
          date: "2024-03-20",
          type: "certification",
        },
        {
          id: "3",
          title: "Projeto Final - Sistema de Recomendação",
          description: "Desenvolveu sistema de recomendação usando ML",
          date: "2024-01-10",
          type: "project",
        },
      ],
      settings: {
        notifications: {
          email: true,
          push: true,
          deadlines: true,
          opportunities: true,
        },
      },
    },
  )

  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [newInterest, setNewInterest] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [newGoal, setNewGoal] = useState("")

  // Carregar perfil do usuário ao montar o componente
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user || initialProfile) return

      try {
        setLoading(true)
        setError(null)
        const userData = await getUserProfile(user.email)
        
        // Atualizar perfil com dados do backend, mantendo mock para campos não presentes
        setProfile(prev => ({
          ...prev,
          id: userData.id || user.email,
          name: userData.name,
          email: userData.email,
        }))
      } catch (err) {
        console.error('Erro ao carregar perfil:', err)
        setError('Não foi possível carregar o perfil. Usando dados locais.')
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [user, initialProfile])

  const handleSave = async (section: string) => {
    if (!user) return

    try {
      setSaving(true)
      setError(null)

      // Atualizar informações básicas do usuário
      if (section === "info") {
        await updateUserProfile(user.email, {
          name: profile.name,
        })
      }

      // Salvar perfil de interesses para recomendações
      if (section === "interests" || section === "skills" || section === "goals") {
        await saveUserProfile({
          userId: user.email,
          interests: profile.interests,
          technicalSkills: profile.skills,
          careerGoals: profile.careerGoals,
        })
      }

      setEditingSection(null)
      onSave?.(profile)
      console.log("[Profile] Seção salva:", section)
    } catch (err) {
      console.error('Erro ao salvar perfil:', err)
      setError('Não foi possível salvar as alterações.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingSection(null)
  }

  const addInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }))
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const addCareerGoal = () => {
    if (newGoal.trim() && !profile.careerGoals.includes(newGoal.trim())) {
      setProfile((prev) => ({
        ...prev,
        careerGoals: [...prev.careerGoals, newGoal.trim()],
      }))
      setNewGoal("")
    }
  }

  const removeCareerGoal = (goal: string) => {
    setProfile((prev) => ({
      ...prev,
      careerGoals: prev.careerGoals.filter((g) => g !== goal),
    }))
  }

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "academic":
        return <GraduationCap className="h-4 w-4" />
      case "project":
        return <Code className="h-4 w-4" />
      case "competition":
        return <Award className="h-4 w-4" />
      case "certification":
        return <Star className="h-4 w-4" />
      default:
        return <Award className="h-4 w-4" />
    }
  }

  const getAchievementColor = (type: string) => {
    switch (type) {
      case "academic":
        return "bg-blue-100 text-blue-800"
      case "project":
        return "bg-green-100 text-green-800"
      case "competition":
        return "bg-purple-100 text-purple-800"
      case "certification":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-600">Carregando perfil...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">⚠️ {error}</p>
        </div>
      )}
      {saving && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">💾 Salvando alterações...</p>
        </div>
      )}
      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Settings Section */}
          <Card>
            <CardHeader className="pb-1 pt-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Configurações</CardTitle>
                {editingSection !== "settings" ? (
                  <Button size="sm" variant="ghost" onClick={() => setEditingSection("settings")}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => handleSave("settings")}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancel}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-3 pt-1">
              <div className="space-y-6">
                {/* Profile Photo */}
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-slate-500">Foto de Perfil</Label>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile.avatar || "/placeholder.svg?height=80&width=80"} />
                      <AvatarFallback className="text-lg">
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {editingSection === "settings" && (
                      <div className="flex-1">
                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                          <Upload className="h-4 w-4 mr-2" />
                          Fazer Upload
                        </Button>
                        <p className="text-xs text-slate-500 mt-1">JPG, PNG ou GIF (máx. 2MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-slate-500">Biografia</Label>
                  {editingSection === "settings" ? (
                    <Textarea
                      value={profile.bio}
                      onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                      placeholder="Conte um pouco sobre você..."
                      rows={3}
                      className="text-sm"
                    />
                  ) : (
                    <p className="text-sm text-slate-900 font-medium">{profile.bio}</p>
                  )}
                </div>

                {/* Personal Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-900">Informações Pessoais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-3">
                      <Label className="text-xs font-medium text-slate-500">Nome Completo</Label>
                      {editingSection === "settings" ? (
                        <Input
                          value={profile.name}
                          onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                          className="h-9"
                        />
                      ) : (
                        <p className="text-sm text-slate-900 font-semibold">{profile.name}</p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-medium text-slate-500">Email</Label>
                      {editingSection === "settings" ? (
                        <Input
                          value={profile.email}
                          onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                          className="h-9"
                        />
                      ) : (
                        <p className="text-sm text-slate-900 font-semibold">{profile.email}</p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-medium text-slate-500">Telefone</Label>
                      {editingSection === "settings" ? (
                        <Input
                          value={profile.phone || ""}
                          onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                          className="h-9"
                        />
                      ) : (
                        <p className="text-sm text-slate-900 font-semibold">{profile.phone || "Não informado"}</p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-medium text-slate-500">Curso</Label>
                      {editingSection === "settings" ? (
                        <Input
                          value={profile.course}
                          onChange={(e) => setProfile((prev) => ({ ...prev, course: e.target.value }))}
                          className="h-9"
                        />
                      ) : (
                        <p className="text-sm text-slate-900 font-semibold">{profile.course}</p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-medium text-slate-500">Localização</Label>
                      {editingSection === "settings" ? (
                        <Input
                          value={profile.location}
                          onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                          className="h-9"
                        />
                      ) : (
                        <p className="text-sm text-slate-900 font-semibold">{profile.location}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="space-y-3 pt-2 border-t">
                  <h3 className="text-sm font-medium text-slate-900">Notificações</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-slate-500" />
                        <Label className="text-sm text-slate-700">Notificações por Email</Label>
                      </div>
                      <Switch
                        checked={profile.settings.notifications.email}
                        onCheckedChange={(checked) =>
                          setProfile((prev) => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              notifications: { ...prev.settings.notifications, email: checked },
                            },
                          }))
                        }
                        disabled={editingSection !== "settings"}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-slate-500" />
                        <Label className="text-sm text-slate-700">Notificações Push</Label>
                      </div>
                      <Switch
                        checked={profile.settings.notifications.push}
                        onCheckedChange={(checked) =>
                          setProfile((prev) => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              notifications: { ...prev.settings.notifications, push: checked },
                            },
                          }))
                        }
                        disabled={editingSection !== "settings"}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <Label className="text-sm text-slate-700">Lembretes de Prazos</Label>
                      </div>
                      <Switch
                        checked={profile.settings.notifications.deadlines}
                        onCheckedChange={(checked) =>
                          setProfile((prev) => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              notifications: { ...prev.settings.notifications, deadlines: checked },
                            },
                          }))
                        }
                        disabled={editingSection !== "settings"}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-slate-500" />
                        <Label className="text-sm text-slate-700">Novas Oportunidades</Label>
                      </div>
                      <Switch
                        checked={profile.settings.notifications.opportunities}
                        onCheckedChange={(checked) =>
                          setProfile((prev) => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              notifications: { ...prev.settings.notifications, opportunities: checked },
                            },
                          }))
                        }
                        disabled={editingSection !== "settings"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interests Section */}
          <Card>
            <CardHeader className="pb-1 pt-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Interesses</CardTitle>
                {editingSection !== "interests" ? (
                  <Button size="sm" variant="ghost" onClick={() => setEditingSection("interests")}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => handleSave("interests")}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancel}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-3 pt-1">
              <div className="space-y-4">
                {/* Areas of Interest */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-800">Áreas de Interesse</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <Badge key={interest} className="bg-blue-100 text-blue-800 flex items-center gap-1">
                        {interest}
                        {editingSection === "interests" && (
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-600"
                            onClick={() => removeInterest(interest)}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {editingSection === "interests" && (
                    <div className="flex space-x-2 mt-2">
                      <Input
                        placeholder="Nova área de interesse"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addInterest()}
                        className="h-9"
                      />
                      <Button size="sm" onClick={addInterest}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-800">Habilidades Técnicas</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="flex items-center gap-1">
                        {skill}
                        {editingSection === "interests" && (
                          <X className="h-3 w-3 cursor-pointer hover:text-red-600" onClick={() => removeSkill(skill)} />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {editingSection === "interests" && (
                    <div className="flex space-x-2 mt-2">
                      <Input
                        placeholder="Nova habilidade"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addSkill()}
                        className="h-9"
                      />
                      <Button size="sm" onClick={addSkill}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Career Goals */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-800">Objetivos de Carreira</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.careerGoals.map((goal) => (
                      <Badge key={goal} className="bg-green-100 text-green-800 flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {goal}
                        {editingSection === "interests" && (
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-600"
                            onClick={() => removeCareerGoal(goal)}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {editingSection === "interests" && (
                    <div className="flex space-x-2 mt-2">
                      <Input
                        placeholder="Novo objetivo de carreira"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addCareerGoal()}
                        className="h-9"
                      />
                      <Button size="sm" onClick={addCareerGoal}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Performance Section */}
          <Card>
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-lg">Desempenho Acadêmico</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3 pt-1">
              <div className="space-y-3">
                {Object.entries(profile.academicPerformance).map(([subject, data]) => (
                  <div key={subject} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm text-slate-900">{subject}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {data.semester}
                        </Badge>
                        <Badge
                          className={`text-xs ${data.grade >= 8 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                        >
                          {data.grade.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-600">{data.credits} créditos</span>
                      <span className="text-xs text-slate-600">
                        {data.grade >= 8 ? "Excelente" : data.grade >= 7 ? "Bom" : "Regular"}
                      </span>
                    </div>
                    <Progress value={data.grade * 10} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements Section */}
          <Card>
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-lg">Conquistas</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3 pt-1">
              <div className="space-y-3">
                {profile.achievements.map((achievement) => (
                  <div key={achievement.id} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getAchievementColor(achievement.type)}`}>
                          {getAchievementIcon(achievement.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm text-slate-900">{achievement.title}</h3>
                          <p className="text-xs text-slate-600 mt-1">{achievement.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span className="text-xs text-slate-500">
                              {new Date(achievement.date).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className={`${getAchievementColor(achievement.type)} text-xs`}>
                        {achievement.type === "academic" && "Acadêmico"}
                        {achievement.type === "project" && "Projeto"}
                        {achievement.type === "competition" && "Competição"}
                        {achievement.type === "certification" && "Certificação"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3 pt-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-slate-700">CRA</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{profile.gpa}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-slate-700">Disciplinas</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {Object.keys(profile.academicPerformance).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-slate-700">Conquistas</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{profile.achievements.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Code className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-slate-700">Habilidades</span>
                  </div>
                  <span className="text-lg font-bold text-orange-600">{profile.skills.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Completion */}
          <Card>
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-lg">Completude do Perfil</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3 pt-1">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Progresso</span>
                  <span className="text-sm font-medium text-slate-900">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                <p className="text-xs text-slate-500 mt-2">
                  Complete seu perfil para receber recomendações mais precisas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-lg">Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3 pt-1">
              <div className="space-y-3">
                <div className="text-xs text-slate-600">
                  <p className="font-medium text-slate-900">Última atualização</p>
                  <p className="mt-1">Hoje às 14:30</p>
                </div>
                <div className="text-xs text-slate-600">
                  <p className="font-medium text-slate-900">Perfil visualizado</p>
                  <p className="mt-1">23 vezes este mês</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
