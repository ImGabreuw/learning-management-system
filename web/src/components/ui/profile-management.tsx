"use client"

import { useState } from "react"
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
  MapPin,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

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
  preferences: {
    opportunityTypes: string[]
    workLocation: string[]
    salaryRange: string
    availableHours: number
  }
}

interface ProfileManagementProps {
  initialProfile?: UserProfile
  onSave?: (profile: UserProfile) => void
}

export function ProfileManagement({ initialProfile, onSave }: ProfileManagementProps) {
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
      preferences: {
        opportunityTypes: ["internship", "job", "hackathon"],
        workLocation: ["São Paulo", "Remoto"],
        salaryRange: "R$ 3.000 - R$ 6.000",
        availableHours: 30,
      },
    },
  )

  const [isEditing, setIsEditing] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [newInterest, setNewInterest] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [newGoal, setNewGoal] = useState("")

  const handleSave = () => {
    setIsEditing(false)
    setEditingSection(null)
    onSave?.(profile)
    console.log("[v0] Profile saved:", profile)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingSection(null)
    // Reset to initial profile if needed
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

  const calculateOverallProgress = () => {
    const subjects = Object.values(profile.academicPerformance)
    const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0)
    const weightedGrades = subjects.reduce((sum, subject) => sum + subject.grade * subject.credits, 0)
    return totalCredits > 0 ? Math.round((weightedGrades / totalCredits) * 10) : 0
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-gray-600">
                  {profile.course} - {profile.semester}º Semestre
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>CRA: {profile.gpa}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </div>

          {profile.bio && (
            <div className="mb-4">
              {isEditing ? (
                <div className="space-y-2">
                  <Label>Biografia</Label>
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Conte um pouco sobre você..."
                    rows={3}
                  />
                </div>
              ) : (
                <p className="text-gray-700">{profile.bio}</p>
              )}
            </div>
          )}

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              {isEditing ? (
                <Input
                  value={profile.email}
                  onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                  className="text-sm"
                />
              ) : (
                <span>{profile.email}</span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              {isEditing ? (
                <Input
                  value={profile.phone || ""}
                  onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Telefone"
                  className="text-sm"
                />
              ) : (
                <span>{profile.phone || "Não informado"}</span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              {isEditing ? (
                <Input
                  value={profile.location}
                  onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                  className="text-sm"
                />
              ) : (
                <span>{profile.location}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="interests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="interests">Interesses</TabsTrigger>
          <TabsTrigger value="academic">Acadêmico</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Interests & Skills */}
        <TabsContent value="interests" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interests */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Áreas de Interesse</span>
                  {isEditing && (
                    <Button size="sm" variant="outline" onClick={() => setEditingSection("interests")}>
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>Suas áreas de interesse acadêmico e profissional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <Badge key={interest} className="bg-blue-100 text-blue-800 flex items-center gap-1">
                        {interest}
                        {isEditing && (
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-600"
                            onClick={() => removeInterest(interest)}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Nova área de interesse"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addInterest()}
                      />
                      <Button size="sm" onClick={addInterest}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Habilidades Técnicas</span>
                  {isEditing && (
                    <Button size="sm" variant="outline" onClick={() => setEditingSection("skills")}>
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>Tecnologias e ferramentas que você domina</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="flex items-center gap-1">
                        {skill}
                        {isEditing && (
                          <X className="h-3 w-3 cursor-pointer hover:text-red-600" onClick={() => removeSkill(skill)} />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Nova habilidade"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addSkill()}
                      />
                      <Button size="sm" onClick={addSkill}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Career Goals */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Objetivos de Carreira</span>
                {isEditing && (
                  <Button size="sm" variant="outline" onClick={() => setEditingSection("goals")}>
                    <Edit3 className="h-3 w-3" />
                  </Button>
                )}
              </CardTitle>
              <CardDescription>Suas metas profissionais e aspirações de carreira</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {profile.careerGoals.map((goal) => (
                    <Badge key={goal} className="bg-green-100 text-green-800 flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {goal}
                      {isEditing && (
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-red-600"
                          onClick={() => removeCareerGoal(goal)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Novo objetivo de carreira"
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addCareerGoal()}
                    />
                    <Button size="sm" onClick={addCareerGoal}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Performance */}
        <TabsContent value="academic" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Desempenho Acadêmico</CardTitle>
              <CardDescription>Suas notas e progresso nas disciplinas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(profile.academicPerformance).map(([subject, data]) => (
                  <div key={subject} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{subject}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{data.semester}</Badge>
                        <Badge
                          className={data.grade >= 8 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                        >
                          {data.grade.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{data.credits} créditos</span>
                      <span className="text-sm text-gray-600">
                        {data.grade >= 8 ? "Excelente" : data.grade >= 7 ? "Bom" : "Regular"}
                      </span>
                    </div>
                    <Progress value={data.grade * 10} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Conquistas e Certificações</CardTitle>
              <CardDescription>Seus principais feitos acadêmicos e profissionais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.achievements.map((achievement) => (
                  <div key={achievement.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getAchievementColor(achievement.type)}`}>
                          {getAchievementIcon(achievement.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {new Date(achievement.date).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getAchievementColor(achievement.type)}>
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
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Preferências de Oportunidades</CardTitle>
              <CardDescription>Configure suas preferências para receber recomendações personalizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">Tipos de Oportunidade</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["internship", "job", "hackathon", "competition", "course", "scholarship"].map((type) => (
                      <Badge
                        key={type}
                        variant={profile.preferences.opportunityTypes.includes(type) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          if (isEditing) {
                            setProfile((prev) => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                opportunityTypes: prev.preferences.opportunityTypes.includes(type)
                                  ? prev.preferences.opportunityTypes.filter((t) => t !== type)
                                  : [...prev.preferences.opportunityTypes, type],
                              },
                            }))
                          }
                        }}
                      >
                        {type === "internship" && "Estágio"}
                        {type === "job" && "Emprego"}
                        {type === "hackathon" && "Hackathon"}
                        {type === "competition" && "Competição"}
                        {type === "course" && "Curso"}
                        {type === "scholarship" && "Bolsa"}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Localização Preferida</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.preferences.workLocation.map((location) => (
                        <Badge key={location} variant="outline">
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Faixa Salarial</Label>
                    <p className="text-sm text-gray-600 mt-1">{profile.preferences.salaryRange}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Horas Disponíveis por Semana</Label>
                  <p className="text-sm text-gray-600 mt-1">{profile.preferences.availableHours} horas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Progresso Geral</p>
                    <p className="text-2xl font-bold text-blue-600">{calculateOverallProgress()}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Conquistas</p>
                    <p className="text-2xl font-bold text-green-600">{profile.achievements.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Habilidades</p>
                    <p className="text-2xl font-bold text-purple-600">{profile.skills.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Resumo do Perfil</CardTitle>
              <CardDescription>Visão geral das suas informações e progresso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{profile.interests.length}</p>
                    <p className="text-sm text-gray-600">Interesses</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{profile.skills.length}</p>
                    <p className="text-sm text-gray-600">Habilidades</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{profile.careerGoals.length}</p>
                    <p className="text-sm text-gray-600">Objetivos</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      {Object.keys(profile.academicPerformance).length}
                    </p>
                    <p className="text-sm text-gray-600">Disciplinas</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Compatibilidade de Perfil</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Completude do Perfil</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
