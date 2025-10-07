"use client"

import { useState, useMemo } from "react"
import { Target, TrendingUp, Clock, MapPin, DollarSign, Users, ExternalLink, Heart, BookmarkPlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface UserProfile {
  interests: string[]
  skills: string[]
  academicPerformance: {
    [course: string]: number
  }
  careerGoals: string[]
  location: string
  experienceLevel: "beginner" | "intermediate" | "advanced"
}

interface Opportunity {
  id: string
  title: string
  company: string
  type: "internship" | "job" | "hackathon" | "competition" | "course" | "scholarship"
  description: string
  requirements: string[]
  tags: string[]
  location: string
  salary?: string
  deadline: string
  duration?: string
  difficulty: "beginner" | "intermediate" | "advanced"
  applicationUrl?: string
  match?: number
  reasons?: string[]
}

interface RecommendationEngineProps {
  userProfile?: UserProfile
  onApply?: (opportunityId: string) => void
  onSave?: (opportunityId: string) => void
  filter?: string // Added filter prop to support external filtering
}

export function RecommendationEngine({ userProfile, onApply, onSave, filter = "todas" }: RecommendationEngineProps) {
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([])

  // Mock user profile if not provided
  const defaultProfile: UserProfile = {
    interests: ["Desenvolvimento Web", "Inteligência Artificial", "Data Science", "Mobile", "DevOps"],
    skills: ["React", "Node.js", "Python", "TypeScript", "PostgreSQL", "Docker"],
    academicPerformance: {
      Compiladores: 85,
      "Computação Distribuída": 78,
      "Teoria dos Grafos": 92,
      "Inteligência Artificial": 88,
    },
    careerGoals: ["Full-Stack Developer", "Data Scientist", "Tech Lead"],
    location: "São Paulo, SP",
    experienceLevel: "intermediate",
  }

  const profile = userProfile || defaultProfile

  // Mock opportunities database
  const mockOpportunities: Opportunity[] = [
    {
      id: "1",
      title: "Estágio em Desenvolvimento Full-Stack",
      company: "TechCorp",
      type: "internship",
      description: "Oportunidade para trabalhar com React, Node.js e PostgreSQL em projetos inovadores.",
      requirements: ["Conhecimento em React", "Experiência com APIs REST", "Inglês intermediário"],
      tags: ["React", "Node.js", "TypeScript", "PostgreSQL", "Full-Stack"],
      location: "São Paulo, SP",
      salary: "R$ 2.000 - R$ 3.000",
      deadline: "15 de Outubro",
      duration: "6 meses",
      difficulty: "intermediate",
      applicationUrl: "https://techcorp.com/careers",
    },
    {
      id: "2",
      title: "Programa de Trainee - Data Science",
      company: "DataLab",
      type: "job",
      description: "Programa completo de formação em Data Science com mentoria especializada.",
      requirements: ["Python", "Estatística", "Machine Learning", "SQL"],
      tags: ["Python", "Machine Learning", "SQL", "Data Science", "Analytics"],
      location: "São Paulo, SP",
      salary: "R$ 4.000 - R$ 6.000",
      deadline: "20 de Outubro",
      duration: "12 meses",
      difficulty: "intermediate",
      applicationUrl: "https://datalab.com/trainee",
    },
    {
      id: "3",
      title: "Hackathon de IA - Prêmio R$ 10.000",
      company: "AI Innovation",
      type: "hackathon",
      description: "Competição de 48h para desenvolver soluções inovadoras usando IA.",
      requirements: ["Python", "TensorFlow ou PyTorch", "Criatividade"],
      tags: ["Inteligência Artificial", "Python", "Deep Learning", "Computer Vision"],
      location: "Online",
      deadline: "5 de Novembro",
      duration: "48 horas",
      difficulty: "advanced",
      applicationUrl: "https://aiinnovation.com/hackathon",
    },
    {
      id: "4",
      title: "Bolsa de Estudos - Mestrado em IA",
      company: "Universidade Tech",
      type: "scholarship",
      description: "Bolsa integral para mestrado em Inteligência Artificial.",
      requirements: ["Graduação em área relacionada", "Nota mínima 8.0", "Projeto de pesquisa"],
      tags: ["Inteligência Artificial", "Pesquisa", "Mestrado", "Bolsa"],
      location: "São Paulo, SP",
      deadline: "30 de Novembro",
      duration: "24 meses",
      difficulty: "advanced",
      applicationUrl: "https://universidadetech.edu.br/bolsas",
    },
    {
      id: "5",
      title: "Desenvolvedor Mobile React Native",
      company: "MobileFirst",
      type: "job",
      description: "Vaga para desenvolvedor mobile com foco em React Native e apps híbridos.",
      requirements: ["React Native", "JavaScript", "Redux", "APIs REST"],
      tags: ["React Native", "Mobile", "JavaScript", "Redux", "iOS", "Android"],
      location: "Remoto",
      salary: "R$ 5.000 - R$ 8.000",
      deadline: "25 de Outubro",
      difficulty: "intermediate",
      applicationUrl: "https://mobilefirst.com/jobs",
    },
    {
      id: "6",
      title: "Curso Avançado de DevOps",
      company: "CloudAcademy",
      type: "course",
      description: "Curso intensivo de DevOps com certificação internacional.",
      requirements: ["Conhecimento básico de Linux", "Experiência com Git"],
      tags: ["DevOps", "Docker", "Kubernetes", "AWS", "CI/CD"],
      location: "Online",
      salary: "Gratuito",
      deadline: "10 de Outubro",
      duration: "3 meses",
      difficulty: "intermediate",
      applicationUrl: "https://cloudacademy.com/devops",
    },
  ]

  // Recommendation algorithm
  const calculateMatch = useMemo(() => {
    return (opportunity: Opportunity): { match: number; reasons: string[] } => {
      let score = 0
      const reasons: string[] = []
      const maxScore = 100

      // Skills match (40% weight)
      const skillMatches = opportunity.tags.filter((tag) =>
        profile.skills.some(
          (skill) => skill.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(skill.toLowerCase()),
        ),
      )
      const skillScore = (skillMatches.length / Math.max(opportunity.tags.length, 1)) * 40
      score += skillScore
      if (skillMatches.length > 0) {
        reasons.push(`${skillMatches.length} habilidade(s) compatível(is): ${skillMatches.slice(0, 3).join(", ")}`)
      }

      // Interest match (30% weight)
      const interestMatches = opportunity.tags.filter((tag) =>
        profile.interests.some(
          (interest) =>
            interest.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(interest.toLowerCase()),
        ),
      )
      const interestScore = (interestMatches.length / Math.max(opportunity.tags.length, 1)) * 30
      score += interestScore
      if (interestMatches.length > 0) {
        reasons.push(`Alinhado com seus interesses em ${interestMatches.slice(0, 2).join(" e ")}`)
      }

      // Experience level match (15% weight)
      const levelMatch = opportunity.difficulty === profile.experienceLevel
      if (levelMatch) {
        score += 15
        reasons.push(`Nível de dificuldade adequado (${opportunity.difficulty})`)
      }

      // Location preference (10% weight)
      const locationMatch =
        opportunity.location === profile.location ||
        opportunity.location === "Online" ||
        opportunity.location === "Remoto"
      if (locationMatch) {
        score += 10
        if (opportunity.location === profile.location) {
          reasons.push(`Localização ideal (${opportunity.location})`)
        } else if (opportunity.location === "Online" || opportunity.location === "Remoto") {
          reasons.push("Modalidade remota/online")
        }
      }

      // Academic performance boost (5% weight)
      const relevantCourses = Object.keys(profile.academicPerformance).filter((course) =>
        opportunity.tags.some(
          (tag) => course.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(course.toLowerCase()),
        ),
      )
      if (relevantCourses.length > 0) {
        const avgPerformance =
          relevantCourses.reduce((sum, course) => sum + profile.academicPerformance[course], 0) / relevantCourses.length
        if (avgPerformance > 80) {
          score += 5
          reasons.push(`Excelente desempenho em disciplinas relacionadas`)
        }
      }

      return {
        match: Math.min(Math.round(score), maxScore),
        reasons: reasons.slice(0, 3), // Limit to top 3 reasons
      }
    }
  }, [profile])

  // Calculate matches and sort opportunities
  const rankedOpportunities = useMemo(() => {
    return mockOpportunities
      .map((opportunity) => {
        const { match, reasons } = calculateMatch(opportunity)
        return { ...opportunity, match, reasons }
      })
      .sort((a, b) => (b.match || 0) - (a.match || 0))
  }, [calculateMatch])

  const filteredOpportunities = useMemo(() => {
    if (filter === "todas") return rankedOpportunities

    // Map filter values to opportunity types
    const filterMap: Record<string, string> = {
      estagios: "internship",
      empregos: "job",
      bolsas: "scholarship",
      hackathons: "hackathon",
      cursos: "course",
      competicoes: "competition",
    }

    const opportunityType = filterMap[filter] || filter
    return rankedOpportunities.filter((opp) => opp.type === opportunityType)
  }, [rankedOpportunities, filter])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "internship":
        return <Users className="h-4 w-4" />
      case "job":
        return <DollarSign className="h-4 w-4" />
      case "hackathon":
        return <TrendingUp className="h-4 w-4" />
      case "competition":
        return <Target className="h-4 w-4" />
      case "course":
        return <BookmarkPlus className="h-4 w-4" />
      case "scholarship":
        return <Heart className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "internship":
        return "bg-blue-100 text-blue-800"
      case "job":
        return "bg-green-100 text-green-800"
      case "hackathon":
        return "bg-purple-100 text-purple-800"
      case "competition":
        return "bg-orange-100 text-orange-800"
      case "course":
        return "bg-indigo-100 text-indigo-800"
      case "scholarship":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "internship":
        return "Estágio"
      case "job":
        return "Emprego"
      case "hackathon":
        return "Hackathon"
      case "competition":
        return "Competição"
      case "course":
        return "Curso"
      case "scholarship":
        return "Bolsa"
      default:
        return type
    }
  }

  const handleSave = (opportunityId: string) => {
    setSavedOpportunities((prev) =>
      prev.includes(opportunityId) ? prev.filter((id) => id !== opportunityId) : [...prev, opportunityId],
    )
    onSave?.(opportunityId)
  }

  return (
    <div className="space-y-6">
      {/* Recommendation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Oportunidades Encontradas</p>
                <p className="text-2xl font-bold text-blue-600">{filteredOpportunities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Match Médio</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredOpportunities.length > 0
                    ? Math.round(
                        filteredOpportunities.reduce((sum, opp) => sum + (opp.match || 0), 0) /
                          filteredOpportunities.length,
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Salvos</p>
                <p className="text-2xl font-bold text-red-600">{savedOpportunities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredOpportunities.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma oportunidade encontrada para este filtro.</p>
            </CardContent>
          </Card>
        ) : (
          filteredOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`p-1 rounded ${getTypeColor(opportunity.type)}`}>
                        {getTypeIcon(opportunity.type)}
                      </div>
                      <Badge className={getTypeColor(opportunity.type)}>{getTypeLabel(opportunity.type)}</Badge>
                      {opportunity.match && (
                        <Badge className="bg-green-100 text-green-800">{opportunity.match}% match</Badge>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{opportunity.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{opportunity.company}</p>
                    <p className="text-sm text-gray-700 mb-3">{opportunity.description}</p>

                    {/* Match Reasons */}
                    {opportunity.reasons && opportunity.reasons.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-600 mb-1">Por que recomendamos:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {opportunity.reasons.map((reason, index) => (
                            <li key={index} className="flex items-center space-x-1">
                              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {opportunity.tags.slice(0, 5).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {opportunity.tags.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{opportunity.tags.length - 5} mais
                        </Badge>
                      )}
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{opportunity.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Prazo: {opportunity.deadline}</span>
                      </div>
                      {opportunity.salary && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{opportunity.salary}</span>
                        </div>
                      )}
                      {opportunity.duration && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{opportunity.duration}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Match Score Visualization */}
                  {opportunity.match && (
                    <div className="ml-4 text-center">
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2"
                            strokeDasharray={`${opportunity.match}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-green-600">{opportunity.match}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => onApply?.(opportunity.id)}>
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Candidatar-se
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleSave(opportunity.id)}>
                      <Heart
                        className={`h-3 w-3 mr-1 ${savedOpportunities.includes(opportunity.id) ? "fill-current text-red-500" : ""}`}
                      />
                      {savedOpportunities.includes(opportunity.id) ? "Salvo" : "Salvar"}
                    </Button>
                  </div>

                  <Badge variant="outline" className="text-xs">
                    Dificuldade: {opportunity.difficulty}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
