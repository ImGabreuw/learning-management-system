"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, FileText, Video, BookOpen, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SearchResult {
  id: string
  title: string
  content: string
  type: "document" | "video" | "slide" | "note"
  course: string
  relevance: number
  matchedTerms: string[]
  url?: string
}

interface FuzzySearchProps {
  onSearch?: (query: string, results: SearchResult[]) => void
}

export function FuzzySearch({ onSearch }: FuzzySearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [typeFilters, setTypeFilters] = useState<string[]>([])

  // Mock database of content for fuzzy search
  const mockContent: SearchResult[] = [
    {
      id: "1",
      title: "Introdução aos Algoritmos de Ordenação",
      content:
        "Algoritmos de ordenação são fundamentais na ciência da computação. Bubble sort, merge sort, quick sort e heap sort são exemplos clássicos. O bubble sort tem complexidade O(n²) no pior caso, enquanto merge sort mantém O(n log n) consistentemente.",
      type: "document",
      course: "Estruturas de Dados",
      relevance: 0,
      matchedTerms: [],
    },
    {
      id: "2",
      title: "Teoria dos Grafos - Algoritmos de Busca",
      content:
        "Busca em largura (BFS) e busca em profundidade (DFS) são algoritmos fundamentais para percorrer grafos. BFS utiliza uma fila e encontra o caminho mais curto em grafos não ponderados. DFS usa uma pilha e é útil para detectar ciclos.",
      type: "slide",
      course: "Teoria dos Grafos",
      relevance: 0,
      matchedTerms: [],
    },
    {
      id: "3",
      title: "Compiladores - Análise Léxica",
      content:
        "A análise léxica é a primeira fase de um compilador. Tokens são identificados através de expressões regulares e autômatos finitos. Palavras-chave, identificadores, operadores e literais são categorizados nesta etapa.",
      type: "video",
      course: "Compiladores",
      relevance: 0,
      matchedTerms: [],
    },
    {
      id: "4",
      title: "Sistemas Distribuídos - Consenso",
      content:
        "Algoritmos de consenso como Raft e PBFT são essenciais em sistemas distribuídos. O problema dos generais bizantinos ilustra os desafios de alcançar acordo em ambientes com falhas. Paxos é outro algoritmo clássico para consenso.",
      type: "document",
      course: "Computação Distribuída",
      relevance: 0,
      matchedTerms: [],
    },
    {
      id: "5",
      title: "Machine Learning - Redes Neurais",
      content:
        "Redes neurais artificiais são inspiradas no cérebro humano. Perceptrons, backpropagation e gradient descent são conceitos fundamentais. Deep learning utiliza redes neurais profundas para resolver problemas complexos.",
      type: "note",
      course: "Inteligência Artificial",
      relevance: 0,
      matchedTerms: [],
    },
    {
      id: "6",
      title: "Banco de Dados - Normalização",
      content:
        "Normalização de banco de dados elimina redundâncias e anomalias. Primeira forma normal (1NF), segunda forma normal (2NF) e terceira forma normal (3NF) são os níveis básicos. BCNF e 4NF são formas mais avançadas.",
      type: "document",
      course: "Banco de Dados",
      relevance: 0,
      matchedTerms: [],
    },
  ]

  // Simple fuzzy search implementation
  const fuzzySearch = useMemo(() => {
    return (searchQuery: string, content: SearchResult[]): SearchResult[] => {
      if (!searchQuery.trim()) return []

      const queryTerms = searchQuery.toLowerCase().split(/\s+/)

      return content
        .map((item) => {
          const titleLower = item.title.toLowerCase()
          const contentLower = item.content.toLowerCase()
          const courseLower = item.course.toLowerCase()

          let relevance = 0
          const matchedTerms: string[] = []

          queryTerms.forEach((term) => {
            // Exact matches get highest score
            if (titleLower.includes(term)) {
              relevance += 10
              matchedTerms.push(term)
            }
            if (contentLower.includes(term)) {
              relevance += 5
              matchedTerms.push(term)
            }
            if (courseLower.includes(term)) {
              relevance += 3
              matchedTerms.push(term)
            }

            // Fuzzy matching for similar terms
            const fuzzyMatches = [
              { pattern: /algoritm/i, terms: ["algorithm", "algoritmo", "algoritmos"] },
              { pattern: /graf/i, terms: ["graph", "grafo", "grafos"] },
              { pattern: /busca/i, terms: ["search", "find", "procura"] },
              { pattern: /rede/i, terms: ["network", "net", "neural"] },
              { pattern: /dados/i, terms: ["data", "database", "bd"] },
            ]

            fuzzyMatches.forEach(({ pattern, terms }) => {
              if (pattern.test(term)) {
                terms.forEach((fuzzyTerm) => {
                  if (titleLower.includes(fuzzyTerm) || contentLower.includes(fuzzyTerm)) {
                    relevance += 2
                    matchedTerms.push(fuzzyTerm)
                  }
                })
              }
            })
          })

          return {
            ...item,
            relevance,
            matchedTerms: [...new Set(matchedTerms)],
          }
        })
        .filter((item) => item.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
    }
  }, [])

  // Perform search when query changes
  useEffect(() => {
    if (query.trim()) {
      setIsSearching(true)

      // Simulate API delay
      const timeoutId = setTimeout(() => {
        let searchResults = fuzzySearch(query, mockContent)

        // Apply type filters
        if (typeFilters.length > 0) {
          searchResults = searchResults.filter((result) => typeFilters.includes(result.type))
        }

        // Apply course filters
        if (selectedFilters.length > 0) {
          searchResults = searchResults.filter((result) => selectedFilters.includes(result.course))
        }

        setResults(searchResults)
        setIsSearching(false)
        onSearch?.(query, searchResults)
      }, 300)

      return () => clearTimeout(timeoutId)
    } else {
      setResults([])
      setIsSearching(false)
    }
  }, [query, fuzzySearch, selectedFilters, typeFilters, onSearch])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "slide":
        return <BookOpen className="h-4 w-4" />
      case "note":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "document":
        return "bg-blue-100 text-blue-800"
      case "video":
        return "bg-red-100 text-red-800"
      case "slide":
        return "bg-green-100 text-green-800"
      case "note":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const highlightText = (text: string, terms: string[]) => {
    if (terms.length === 0) return text

    const regex = new RegExp(`(${terms.join("|")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) => {
      if (terms.some((term) => part.toLowerCase().includes(term.toLowerCase()))) {
        return (
          <mark key={index} className="bg-yellow-200">
            {part}
          </mark>
        )
      }
      return part
    })
  }

  const availableCourses = [...new Set(mockContent.map((item) => item.course))]
  const availableTypes = [...new Set(mockContent.map((item) => item.type))]

  const removeFilter = (filter: string, type: "course" | "type") => {
    if (type === "course") {
      setSelectedFilters((prev) => prev.filter((f) => f !== filter))
    } else {
      setTypeFilters((prev) => prev.filter((f) => f !== filter))
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar em todo o conteúdo... (ex: 'algoritmos de ordenação', 'teoria dos grafos')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Course Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Cursos {selectedFilters.length > 0 && `(${selectedFilters.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {availableCourses.map((course) => (
              <DropdownMenuCheckboxItem
                key={course}
                checked={selectedFilters.includes(course)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedFilters([...selectedFilters, course])
                  } else {
                    setSelectedFilters(selectedFilters.filter((f) => f !== course))
                  }
                }}
              >
                {course}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Tipo {typeFilters.length > 0 && `(${typeFilters.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {availableTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={typeFilters.includes(type)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setTypeFilters([...typeFilters, type])
                  } else {
                    setTypeFilters(typeFilters.filter((f) => f !== type))
                  }
                }}
              >
                {type === "document" && "Documento"}
                {type === "video" && "Vídeo"}
                {type === "slide" && "Slide"}
                {type === "note" && "Anotação"}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters */}
      {(selectedFilters.length > 0 || typeFilters.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {selectedFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  removeFilter(filter, "course")
                }}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {typeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter === "document" && "Documento"}
              {filter === "video" && "Vídeo"}
              {filter === "slide" && "Slide"}
              {filter === "note" && "Anotação"}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  removeFilter(filter, "type")
                }}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search Results */}
      {query && (
        <div className="space-y-4">
          {isSearching ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Buscando...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado
                  {results.length !== 1 ? "s" : ""} para "{query}"
                </p>
              </div>

              <div className="space-y-3">
                {results.map((result) => (
                  <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>{getTypeIcon(result.type)}</div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {highlightText(result.title, result.matchedTerms)}
                            </h3>
                            <Badge variant="outline" className="ml-2 shrink-0">
                              {result.course}
                            </Badge>
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {highlightText(result.content, result.matchedTerms)}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge className={getTypeColor(result.type)}>
                                {result.type === "document" && "Documento"}
                                {result.type === "video" && "Vídeo"}
                                {result.type === "slide" && "Slide"}
                                {result.type === "note" && "Anotação"}
                              </Badge>
                              {result.matchedTerms.length > 0 && (
                                <span className="text-xs text-gray-500">
                                  Termos encontrados: {result.matchedTerms.slice(0, 3).join(", ")}
                                  {result.matchedTerms.length > 3 && "..."}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-400">Relevância: {result.relevance}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum resultado encontrado para "{query}"</p>
              <p className="text-sm text-gray-500 mt-1">Tente termos diferentes ou remova alguns filtros</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
