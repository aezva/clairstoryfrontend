"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Plus,
  BookOpen,
  Users,
  MapPin,
  FileText,
  StickyNote,
  TrendingUp,
  Clock,
  Target,
  Calendar,
  Edit3,
  Sparkles,
  Crown,
  Trees,
  Scroll,
  ChevronRight,
  BarChart3,
  Zap,
  Award,
} from "lucide-react"
import { useEffect, useState } from "react"
import {
  getCharacters,
  getLocations,
  getWikiEntries,
  getNotes,
} from "@/lib/supabaseApi"

// Datos simulados para el dashboard
const projectStats = {
  wordsWritten: 12750,
  dailyGoal: 1000,
  chaptersCompleted: 2,
  totalChapters: 8,
  charactersCreated: 6,
  locationsDocumented: 6,
  wikiEntries: 8,
  notesCreated: 6,
  daysActive: 15,
  averageWordsPerDay: 850,
  currentStreak: 5,
  totalWritingTime: "24h 30m",
}

const recentActivity = {
  characters: [
    {
      id: "1",
      name: "Lyra Moonwhisper",
      role: "Protagonista",
      avatar: "/images/avatar1.png",
      updatedAt: "hace 2 horas",
      status: "Viva",
    },
    {
      id: "2",
      name: "Theron Forjacero",
      role: "Compañero",
      avatar: "/images/avatar2.png",
      updatedAt: "hace 1 día",
      status: "Vivo",
    },
    {
      id: "3",
      name: "Zephyr",
      role: "Aliado",
      avatar: "/images/avatar3.png",
      updatedAt: "hace 2 días",
      status: "Vivo",
    },
  ],
  locations: [
    {
      id: "1",
      name: "Valdris",
      type: "Pueblo",
      region: "Tierras Centrales",
      updatedAt: "hace 3 horas",
      status: "Próspero",
    },
    {
      id: "2",
      name: "Montañas de Cristal",
      type: "Cordillera",
      region: "Norte",
      updatedAt: "hace 1 día",
      status: "Peligroso",
    },
    {
      id: "3",
      name: "Bosque Susurrante",
      type: "Bosque Encantado",
      region: "Este",
      updatedAt: "hace 2 días",
      status: "Misterioso",
    },
  ],
  wikiEntries: [
    {
      id: "1",
      term: "Magia de Cristal",
      category: "Magia",
      updatedAt: "hace 1 hora",
      status: "Conocido",
    },
    {
      id: "2",
      term: "Linaje Lunar",
      category: "Linajes",
      updatedAt: "hace 4 horas",
      status: "Legendario",
    },
    {
      id: "3",
      term: "Profecía del Despertar",
      category: "Profecías",
      updatedAt: "hace 1 día",
      status: "En cumplimiento",
    },
  ],
  notes: [
    {
      id: "1",
      title: "Ideas para el Capítulo 5",
      content: "Lyra descubre la verdad sobre su linaje. Posible confrontación con Theron...",
      updatedAt: "hace 30 minutos",
      pinned: true,
    },
    {
      id: "2",
      title: "Desarrollo de Zephyr",
      content: "El dragón necesita más profundidad emocional. Quizás una conexión personal...",
      updatedAt: "hace 2 horas",
      pinned: false,
    },
    {
      id: "3",
      title: "Sistema de Magia",
      content: "Definir mejor las limitaciones de la magia de cristal. ¿Qué costo tiene...",
      updatedAt: "hace 5 horas",
      pinned: true,
    },
  ],
}

const quickActions = [
  {
    id: "continue-writing",
    title: "Continuar Escribiendo",
    description: "Capítulo 2: La Profecía",
    icon: <Edit3 className="h-5 w-5" />,
    color: "bg-indigo-500",
    action: "writing",
  },
  {
    id: "new-character",
    title: "Nuevo Personaje",
    description: "Añadir personaje",
    icon: <Users className="h-5 w-5" />,
    color: "bg-green-500",
    action: "characters",
  },
  {
    id: "new-location",
    title: "Nuevo Lugar",
    description: "Documentar ubicación",
    icon: <MapPin className="h-5 w-5" />,
    color: "bg-blue-500",
    action: "world",
  },
  {
    id: "new-wiki",
    title: "Nueva Entrada Wiki",
    description: "Añadir concepto",
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-purple-500",
    action: "wiki",
  },
  {
    id: "new-note",
    title: "Nueva Nota",
    description: "Capturar idea",
    icon: <StickyNote className="h-5 w-5" />,
    color: "bg-yellow-500",
    action: "notes",
  },
  {
    id: "project-settings",
    title: "Configuración",
    description: "Ajustes del proyecto",
    icon: <Target className="h-5 w-5" />,
    color: "bg-gray-500",
    action: "settings",
  },
]

interface DashboardPageProps {
  onSectionChange: (section: string) => void
  projectId: string | null
}

export function DashboardPage({ onSectionChange, projectId }: DashboardPageProps) {
  const [characters, setCharacters] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const [wikiEntries, setWikiEntries] = useState<any[]>([])
  const [notes, setNotes] = useState<any[]>([])
  // Puedes agregar más estados para stats si lo deseas

  useEffect(() => {
    setCharacters([])
    setLocations([])
    setWikiEntries([])
    setNotes([])
    if (!projectId) return
    getCharacters(projectId).then(setCharacters)
    getLocations(projectId).then(setLocations)
    getWikiEntries(projectId).then(setWikiEntries)
    getNotes(projectId).then(setNotes)
  }, [projectId])

  const progressPercentage = (projectStats.wordsWritten / (projectStats.dailyGoal * 30)) * 100
  const dailyProgressPercentage = ((projectStats.wordsWritten % projectStats.dailyGoal) / projectStats.dailyGoal) * 100
  const chaptersProgress = (projectStats.chaptersCompleted / projectStats.totalChapters) * 100

  const handleQuickAction = (action: string) => {
    onSectionChange(action)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header con saludo y opciones de proyecto */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">¡Bienvenido de vuelta, John!</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Continuemos construyendo tu mundo fantástico</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proyecto
          </Button>
          <Button>
            <Edit3 className="h-4 w-4 mr-2" />
            Continuar Escribiendo
          </Button>
        </div>
      </div>

      {/* Proyecto actual */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white dark:from-indigo-600 dark:to-purple-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">{projectStats.wordsWritten.toLocaleString()} palabras</h2>
              <p className="text-indigo-100">Tu épica historia de fantasía está tomando forma</p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  <span className="text-sm">{projectStats.wordsWritten.toLocaleString()} palabras</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{projectStats.totalWritingTime}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">{projectStats.daysActive} días activo</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {projectStats.chaptersCompleted}/{projectStats.totalChapters}
              </div>
              <div className="text-sm text-indigo-100">Capítulos completados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Progreso Diario</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {(projectStats.wordsWritten % projectStats.dailyGoal).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  de {projectStats.dailyGoal.toLocaleString()} palabras
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(dailyProgressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Racha Actual</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{projectStats.currentStreak}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">días consecutivos</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                ¡Excelente progreso!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Promedio Diario</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{projectStats.averageWordsPerDay}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">palabras por día</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-blue-600">Por encima del objetivo</p>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Progreso General</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{Math.round(chaptersProgress)}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">del proyecto</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${chaptersProgress}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atajos rápidos */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => (
            <Card
              key={action.id}
              className="hover:shadow-md transition-shadow cursor-pointer group dark:bg-gray-800 dark:border-gray-700"
              onClick={() => handleQuickAction(action.action)}
            >
              <CardContent className="p-4 text-center">
                <div
                  className={`${action.color} h-12 w-12 rounded-full flex items-center justify-center text-white mx-auto mb-3 group-hover:scale-110 transition-transform`}
                >
                  {action.icon}
                </div>
                <h3 className="font-medium text-gray-800 dark:text-white text-sm mb-1">{action.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personajes recientes */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Crown className="h-5 w-5 mr-2 text-indigo-600" />
                Personajes Recientes
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onSectionChange("characters")}>
                Ver todos
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {characters.map((character) => (
              <div
                key={character.id}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={character.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {character.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white text-sm">{character.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {character.role} • {character.updatedAt}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    character.status === "Vivo" || character.status === "Viva"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                  }`}
                >
                  {character.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Lugares recientes */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Trees className="h-5 w-5 mr-2 text-green-600" />
                Lugares Recientes
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onSectionChange("world")}>
                Ver todos
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {locations.map((location) => (
              <div
                key={location.id}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center dark:bg-gray-700">
                  <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white text-sm">{location.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {location.type} • {location.updatedAt}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    location.status === "Próspero"
                      ? "bg-green-100 text-green-700"
                      : location.status === "Peligroso"
                        ? "bg-red-100 text-red-700"
                        : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {location.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Wiki reciente */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                Wiki Reciente
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onSectionChange("wiki")}>
                Ver todas
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {wikiEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="h-10 w-10 bg-purple-100 rounded-md flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white text-sm">{entry.term}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {entry.category} • {entry.updatedAt}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    entry.status === "Conocido"
                      ? "bg-green-100 text-green-700"
                      : entry.status === "Legendario"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {entry.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notas recientes */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Scroll className="h-5 w-5 mr-2 text-amber-600" />
                Notas Recientes
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onSectionChange("notes")}>
                Ver todas
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="h-10 w-10 bg-yellow-100 rounded-md flex items-center justify-center flex-shrink-0">
                  <StickyNote className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-800 dark:text-white text-sm truncate">{note.title}</p>
                    {note.pinned && <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{note.content}</p>
                  <p className="text-xs text-gray-400 mt-1">{note.updatedAt}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Resumen de contenido */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 dark:text-white">Resumen del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{projectStats.charactersCreated}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Personajes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{projectStats.locationsDocumented}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Lugares</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{projectStats.wikiEntries}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Entradas Wiki</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{projectStats.notesCreated}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Notas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
