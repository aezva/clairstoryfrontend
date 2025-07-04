"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Upload,
  Eye,
  Save,
  GripVertical,
  Sparkles,
  Scroll,
  Users,
  Zap,
  Gem,
  BookOpen,
  Search,
} from "lucide-react"
import { useState } from "react"
import { DndContext, type DragEndEvent, closestCenter, useSensor, useSensors, PointerSensor } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Tipos
interface WikiEntry {
  id: string
  term: string
  category: string
  briefDescription: string
  image: string
  status: string
  categoryId: string
  // Campos adicionales para detalles
  fullDefinition: string
  history: string
  applications: string
  relatedTerms: string[]
  examples: string
  references: string
  importance: string
  etymology: string
  variations: string
}

interface Category {
  id: string
  name: string
  description: string
  color: string
  icon: React.ReactNode
}

interface WikiPageProps {
  projectId?: string | null
}

// Datos iniciales
const initialCategories: Category[] = [
  {
    id: "magic",
    name: "Magia",
    description: "Sistemas mágicos, hechizos y artes arcanas",
    color: "bg-purple-500",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: "history",
    name: "Historia",
    description: "Eventos históricos, eras y cronologías",
    color: "bg-amber-500",
    icon: <Scroll className="h-4 w-4" />,
  },
  {
    id: "culture",
    name: "Cultura",
    description: "Tradiciones, costumbres y sociedades",
    color: "bg-blue-500",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "creatures",
    name: "Criaturas",
    description: "Bestias, seres mágicos y especies",
    color: "bg-green-500",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: "artifacts",
    name: "Artefactos",
    description: "Objetos mágicos, armas y reliquias",
    color: "bg-red-500",
    icon: <Gem className="h-4 w-4" />,
  },
  {
    id: "concepts",
    name: "Conceptos",
    description: "Ideas, filosofías y teorías",
    color: "bg-indigo-500",
    icon: <BookOpen className="h-4 w-4" />,
  },
]

const initialWikiEntries: WikiEntry[] = [
  {
    id: "1",
    term: "Magia de Cristal",
    category: "Magia",
    briefDescription:
      "Forma ancestral de magia que utiliza cristales como catalizadores. Los dragones de cristal son los únicos que dominan completamente esta arte.",
    image: "/placeholder.svg?height=200&width=300",
    status: "Conocido",
    categoryId: "magic",
    fullDefinition:
      "La Magia de Cristal es un sistema arcano que canaliza energía mágica a través de formaciones cristalinas especiales. Requiere una conexión profunda entre el practicante y los cristales, que actúan como amplificadores y estabilizadores de la energía mágica.",
    history:
      "Desarrollada durante la Era de los Dragones hace más de 3000 años. Los primeros dragones de cristal descubrieron que podían almacenar y manipular magia usando las formaciones cristalinas de las Montañas de Cristal.",
    applications:
      "Curación avanzada, manipulación elemental, creación de barreras protectoras, comunicación a larga distancia, almacenamiento de energía mágica.",
    relatedTerms: ["Dragones de Cristal", "Montañas de Cristal", "Cristales de Poder"],
    examples:
      "Lyra utiliza un pequeño cristal lunar para amplificar su magia natural. Los sanadores del reino emplean cristales verdes para acelerar la regeneración.",
    references: "Manuscritos de Eldrin, Crónicas Dragónicas, Tratado de Magia Elemental",
    importance: "Fundamental para entender el sistema mágico del mundo",
    etymology: "Del élfico antiguo 'Kris-tal-moor' que significa 'piedra de luz eterna'",
    variations: "Magia de Cristal Lunar, Cristalomancia, Arte Dragónico",
  },
  {
    id: "2",
    term: "Gran Roble",
    category: "Lugares Sagrados",
    briefDescription:
      "Árbol milenario en el centro de Valdris. Se dice que sus raíces conectan con la fuente primordial de magia del mundo.",
    image: "/placeholder.svg?height=200&width=300",
    status: "Sagrado",
    categoryId: "history",
    fullDefinition:
      "El Gran Roble es un árbol ancestral de más de 50 metros de altura y 2000 años de antigüedad. Sus raíces se extienden por kilómetros bajo tierra, formando una red que algunos creen conecta con las líneas de poder mágico del mundo.",
    history:
      "Plantado durante la fundación de Valdris por los primeros colonos élficos. Ha sido testigo de todas las eras importantes del reino y se considera un símbolo de continuidad y sabiduría.",
    applications:
      "Centro de ceremonias religiosas, punto de meditación, fuente de madera sagrada para bastones mágicos, lugar de juramentos importantes.",
    relatedTerms: ["Valdris", "Líneas de Poder", "Magia Primordial"],
    examples:
      "Los druidas realizan rituales de cambio de estación bajo sus ramas. Los magos novatos meditan junto a su tronco para conectar con la magia natural.",
    references: "Anales de Valdris, Tradiciones Druídicas, Leyendas del Bosque",
    importance: "Símbolo cultural y espiritual central para Valdris",
    etymology: "Llamado 'Taurë Úr' en élfico, que significa 'Árbol de Fuego Primordial'",
    variations: "Árbol Madre, Roble Sagrado, Corazón Verde",
  },
  {
    id: "3",
    term: "Forjacero",
    category: "Oficios",
    briefDescription:
      "Maestros herreros enanos especializados en crear armas y armaduras imbuidas con magia. Su conocimiento se transmite de generación en generación.",
    image: "/placeholder.svg?height=200&width=300",
    status: "Tradicional",
    categoryId: "culture",
    fullDefinition:
      "Los Forjaceros son artesanos enanos que han perfeccionado el arte de combinar metalurgia tradicional con encantamientos mágicos. Cada Forjacero debe completar un aprendizaje de 50 años antes de ser considerado maestro.",
    history:
      "La tradición comenzó hace 1500 años cuando el primer rey enano, Thorin Martillodorado, descubrió cómo infundir magia en el metal durante el proceso de forja.",
    applications:
      "Creación de armas mágicas, armaduras encantadas, herramientas especializadas, joyas protectoras, instrumentos de precisión mágica.",
    relatedTerms: ["Enanos", "Magia de Forja", "Armas Legendarias"],
    examples:
      "Theron Forjacero creó el martillo de guerra que puede romper encantamientos. Las espadas forjacero nunca se desafilan y pueden cortar materiales mágicos.",
    references: "Códice de la Forja, Genealogías Enanas, Manual del Herrero Mágico",
    importance: "Esencial para la defensa del reino y la preservación de técnicas ancestrales",
    etymology: "Combinación de 'Forja' y 'Hechicero' en el idioma enano antiguo",
    variations: "Maestro Forjador, Herrero Rúnico, Artesano de Guerra",
  },
  {
    id: "4",
    term: "Sombras Corruptas",
    category: "Magia Oscura",
    briefDescription:
      "Energía maligna que corrompe todo lo que toca. Utilizada por Lord Malachar para extender su influencia y poder.",
    image: "/placeholder.svg?height=200&width=300",
    status: "Peligroso",
    categoryId: "magic",
    fullDefinition:
      "Las Sombras Corruptas son una manifestación de magia oscura que consume y pervierte la energía vital. Se alimentan de emociones negativas y pueden infectar tanto seres vivos como objetos inanimados.",
    history:
      "Aparecieron por primera vez durante la Guerra de las Sombras hace 500 años. Lord Malachar las redescubrió y perfeccionó su uso tras años de estudio de textos prohibidos.",
    applications:
      "Control mental, corrupción de la naturaleza, creación de no-muertos, debilitamiento de defensas mágicas, espionaje a través de sombras.",
    relatedTerms: ["Lord Malachar", "Magia Oscura", "Guerra de las Sombras"],
    examples:
      "Los bosques tocados por las Sombras Corruptas se vuelven estériles y hostiles. Los animales infectados se convierten en criaturas agresivas sin voluntad propia.",
    references: "Tomos Prohibidos, Crónicas de la Guerra Sombría, Testimonios de Supervivientes",
    importance: "Amenaza principal para el equilibrio mágico del mundo",
    etymology: "Del término arcano 'Umbra Corruptus' que significa 'oscuridad que devora'",
    variations: "Magia Sombría, Corrupción Umbral, Tinieblas Vivientes",
  },
  {
    id: "5",
    term: "Linaje Lunar",
    category: "Linajes",
    briefDescription:
      "Antigua línea de sangre élfica conectada con la magia lunar. Los descendientes pueden canalizar el poder de la luna llena.",
    image: "/placeholder.svg?height=200&width=300",
    status: "Legendario",
    categoryId: "culture",
    fullDefinition:
      "El Linaje Lunar es una línea de sangre élfica que se remonta a los primeros elfos que hicieron un pacto con los espíritus lunares. Sus descendientes poseen una conexión innata con los ciclos lunares y pueden canalizar su poder.",
    history:
      "Establecido durante la Era de los Pactos hace 4000 años. La primera Matriarca Lunar, Selenea, realizó un ritual que vinculó su descendencia con la luna para siempre.",
    applications:
      "Magia nocturna amplificada, visión en la oscuridad, comunicación con espíritus lunares, predicción de mareas y ciclos naturales, curación bajo la luz lunar.",
    relatedTerms: ["Elfos", "Magia Lunar", "Espíritus Lunares"],
    examples:
      "Lyra Moonwhisper pertenece a este linaje, lo que explica su poder natural. Durante la luna llena, los miembros del linaje pueden realizar hazañas mágicas extraordinarias.",
    references: "Genealogías Élficas, Crónicas Lunares, Rituales de la Luna Llena",
    importance: "Clave para entender los poderes de Lyra y la magia élfica",
    etymology: "Del élfico 'Isil-noss' que significa 'familia de la luna'",
    variations: "Sangre Lunar, Herederos de Selenea, Hijos de la Luna",
  },
  {
    id: "6",
    term: "Profecía del Despertar",
    category: "Profecías",
    briefDescription:
      "Antigua profecía que habla del regreso de la magia a Aethermoor y del elegido que restaurará el equilibrio.",
    image: "/placeholder.svg?height=200&width=300",
    status: "En cumplimiento",
    categoryId: "history",
    fullDefinition:
      "La Profecía del Despertar es una predicción milenaria que describe el retorno de la magia primordial al mundo y la llegada de un elegido que restaurará el equilibrio entre luz y oscuridad.",
    history:
      "Pronunciada por el Oráculo de las Estrellas hace 1000 años, poco antes de la Gran Supresión Mágica. Ha sido preservada en fragmentos por diferentes culturas.",
    applications:
      "Guía para interpretar eventos actuales, base para decisiones políticas importantes, inspiración para movimientos de resistencia.",
    relatedTerms: ["Oráculo de las Estrellas", "Gran Supresión", "Elegido"],
    examples:
      "El despertar de los poderes de Lyra coincide con los eventos descritos en la profecía. Los signos celestiales mencionados han comenzado a manifestarse.",
    references: "Pergaminos del Oráculo, Interpretaciones Proféticas, Anales de los Videntes",
    importance: "Central para la trama principal y el destino de los personajes",
    etymology: "Del idioma profético antiguo 'Valar-osto' que significa 'poder que renace'",
    variations: "El Gran Despertar, Profecía de la Restauración, Visión del Equilibrio",
  },
  {
    id: "7",
    term: "Caminos Secretos",
    category: "Geografía",
    briefDescription:
      "Red de senderos ocultos que conectan diferentes regiones del reino. Solo los exploradores más experimentados conocen su ubicación.",
    image: "/placeholder.svg?height=200&width=300",
    status: "Oculto",
    categoryId: "concepts",
    fullDefinition:
      "Los Caminos Secretos son una red de rutas ocultas que atraviesan Aethermoor, creadas originalmente por los elfos para moverse sin ser detectados. Están protegidos por ilusiones y magia de ocultamiento.",
    history:
      "Construidos durante la Guerra de los Cien Años como rutas de escape y suministro. Muchos tramos han sido olvidados, pero algunos exploradores mantienen vivo el conocimiento.",
    applications:
      "Viajes rápidos y seguros, escape de perseguidores, transporte de bienes valiosos, acceso a lugares remotos.",
    relatedTerms: ["Exploradores", "Magia de Ocultamiento", "Rutas Comerciales"],
    examples:
      "Aria Ventoluna conoce varios de estos caminos y los usa para guiar a Lyra. Los contrabandistas los utilizan para evitar controles reales.",
    references: "Mapas de Exploradores, Diarios de Viaje, Códices de Navegación",
    importance: "Elemento clave para el movimiento de personajes en la historia",
    etymology: "Del término explorador 'Viae Occultae' que significa 'senderos escondidos'",
    variations: "Rutas Ocultas, Senderos Élficos, Caminos de las Sombras",
  },
  {
    id: "8",
    term: "Cristales de Poder",
    category: "Artefactos",
    briefDescription:
      "Gemas mágicas que almacenan y amplifican la energía arcana. Cada cristal tiene propiedades únicas según su color y origen.",
    image: "/placeholder.svg?height=200&width=300",
    status: "Valioso",
    categoryId: "artifacts",
    fullDefinition:
      "Los Cristales de Poder son gemas naturales que han sido expuestas a concentraciones extremas de energía mágica durante siglos. Pueden almacenar, amplificar y canalizar diferentes tipos de magia según su composición mineral.",
    history:
      "Formados durante la Gran Ruptura Mágica cuando las líneas de poder del mundo se fracturaron. Los más puros se encuentran en las Montañas de Cristal, guardados por dragones.",
    applications:
      "Amplificación de hechizos, almacenamiento de energía mágica, creación de objetos encantados, comunicación a larga distancia, iluminación mágica.",
    relatedTerms: ["Magia de Cristal", "Montañas de Cristal", "Líneas de Poder"],
    examples:
      "Los cristales azules amplifican la magia elemental, los rojos potencian hechizos de combate, los verdes facilitan la curación y los violetas conectan con la magia mental.",
    references: "Tratado de Cristalografía Mágica, Catálogo de Gemas Arcanas, Manual del Cristalomante",
    importance: "Fundamentales para el sistema mágico y la economía del mundo",
    etymology: "Del dracónico 'Sil-maril' que significa 'joya de luz pura'",
    variations: "Gemas Arcanas, Piedras de Poder, Cristales Dragónicos",
  },
]

// Componente para tarjeta de entrada arrastrable
function DraggableWikiCard({
  entry,
  onEdit,
  onView,
}: { entry: WikiEntry; onEdit: (entry: WikiEntry) => void; onView: (entry: WikiEntry) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entry.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-16 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={entry.image || "/placeholder.svg"}
                  alt={entry.term}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=48&width=64"
                  }}
                />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{entry.term}</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">{entry.category}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <div
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onView(entry)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(entry)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">{entry.importance}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  entry.status === "Conocido"
                    ? "bg-green-100 text-green-700"
                    : entry.status === "Peligroso"
                      ? "bg-red-100 text-red-700"
                      : entry.status === "Legendario"
                        ? "bg-purple-100 text-purple-700"
                        : entry.status === "Sagrado"
                          ? "bg-blue-100 text-blue-700"
                          : entry.status === "Oculto"
                            ? "bg-gray-100 text-gray-700"
                            : entry.status === "En cumplimiento"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-indigo-100 text-indigo-700"
                }`}
              >
                {entry.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{entry.briefDescription}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para categoría con drop zone
function WikiCategory({
  category,
  entries,
  onEditCategory,
  onDeleteCategory,
  onEditEntry,
  onViewEntry,
}: {
  category: Category
  entries: WikiEntry[]
  onEditCategory: (category: Category) => void
  onDeleteCategory: (categoryId: string) => void
  onEditEntry: (entry: WikiEntry) => void
  onViewEntry: (entry: WikiEntry) => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`${category.color} p-2 rounded-md text-white`}>{category.icon}</div>
          <div>
            <h3 className="font-semibold text-gray-800">{category.name}</h3>
            <p className="text-sm text-gray-500">{category.description}</p>
          </div>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">{entries.length}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onEditCategory(category)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar categoría
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteCategory(category.id)} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar categoría
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SortableContext items={entries.map((e) => e.id)} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[200px] p-4 border-2 border-dashed border-gray-200 rounded-lg">
          {entries.map((entry) => (
            <DraggableWikiCard key={entry.id} entry={entry} onEdit={onEditEntry} onView={onViewEntry} />
          ))}
          {entries.length === 0 && (
            <div className="col-span-full flex items-center justify-center text-gray-400 text-sm py-8">
              Arrastra entradas aquí o crea una nueva
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export function WikiPage({ projectId }: WikiPageProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [wikiEntries, setWikiEntries] = useState<WikiEntry[]>(initialWikiEntries)
  const [selectedEntry, setSelectedEntry] = useState<WikiEntry | null>(null)
  const [editingEntry, setEditingEntry] = useState<WikiEntry | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isNewEntryDialogOpen, setIsNewEntryDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const sensors = useSensors(useSensor(PointerSensor))

  // Filtrar entradas por búsqueda
  const filteredEntries = wikiEntries.filter(
    (entry) =>
      entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.briefDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const entryId = active.id as string
    const targetCategoryId = over.id as string

    // Si se suelta sobre una categoría diferente
    if (categories.some((cat) => cat.id === targetCategoryId)) {
      setWikiEntries((prev) =>
        prev.map((entry) => (entry.id === entryId ? { ...entry, categoryId: targetCategoryId } : entry)),
      )
    }
  }

  const handleViewEntry = (entry: WikiEntry) => {
    setSelectedEntry(entry)
    setIsViewDialogOpen(true)
  }

  const handleEditEntry = (entry: WikiEntry) => {
    setEditingEntry(entry)
    setIsEditDialogOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setIsCategoryDialogOpen(true)
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId))
      // Mover entradas a "Conceptos"
      setWikiEntries((prev) =>
        prev.map((entry) => (entry.categoryId === categoryId ? { ...entry, categoryId: "concepts" } : entry)),
      )
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        if (editingEntry) {
          setEditingEntry({ ...editingEntry, image: imageUrl })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const saveEntry = () => {
    if (editingEntry) {
      setWikiEntries((prev) => prev.map((entry) => (entry.id === editingEntry.id ? editingEntry : entry)))
      setIsEditDialogOpen(false)
      setEditingEntry(null)
    }
  }

  const createNewEntry = () => {
    const newEntry: WikiEntry = {
      id: Date.now().toString(),
      term: "Nuevo Término",
      category: "Concepto",
      briefDescription: "Descripción breve del término...",
      image: "/placeholder.svg?height=200&width=300",
      status: "Conocido",
      categoryId: "concepts",
      fullDefinition: "",
      history: "",
      applications: "",
      relatedTerms: [],
      examples: "",
      references: "",
      importance: "Menor",
      etymology: "",
      variations: "",
    }
    setEditingEntry(newEntry)
    setIsNewEntryDialogOpen(true)
  }

  const saveNewEntry = () => {
    if (editingEntry) {
      setWikiEntries((prev) => [...prev, editingEntry])
      setIsNewEntryDialogOpen(false)
      setEditingEntry(null)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Wiki</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
            <Button onClick={createNewEntry}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Entrada
            </Button>
          </div>
        </div>
        <p className="text-gray-600 mt-2">Documenta términos, conceptos y elementos únicos de tu mundo</p>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar en la wiki..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryEntries = filteredEntries.filter((entry) => entry.categoryId === category.id)
            return (
              <WikiCategory
                key={category.id}
                category={category}
                entries={categoryEntries}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onEditEntry={handleEditEntry}
                onViewEntry={handleViewEntry}
              />
            )
          })}
        </div>
      </DndContext>

      {/* Dialog para ver detalles de la entrada */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <div className="w-16 h-12 bg-gray-200 rounded-md overflow-hidden">
                <img
                  src={selectedEntry?.image || "/placeholder.svg?height=48&width=64"}
                  alt={selectedEntry?.term}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span>{selectedEntry?.term}</span>
                <p className="text-sm text-gray-500 font-normal">{selectedEntry?.category}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Información Básica</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Estado:</strong> {selectedEntry.status}
                    </p>
                    <p>
                      <strong>Importancia:</strong> {selectedEntry.importance}
                    </p>
                    <p>
                      <strong>Descripción:</strong> {selectedEntry.briefDescription}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Definición Completa</h4>
                  <p className="text-sm text-gray-600">{selectedEntry.fullDefinition}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Historia</h4>
                  <p className="text-sm text-gray-600">{selectedEntry.history}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Aplicaciones</h4>
                  <p className="text-sm text-gray-600">{selectedEntry.applications}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Términos Relacionados</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.relatedTerms.map((term, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Ejemplos</h4>
                  <p className="text-sm text-gray-600">{selectedEntry.examples}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Etimología</h4>
                  <p className="text-sm text-gray-600">{selectedEntry.etymology}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Variaciones</h4>
                  <p className="text-sm text-gray-600">{selectedEntry.variations}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Referencias</h4>
                  <p className="text-sm text-gray-600">{selectedEntry.references}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para editar entrada */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Entrada</DialogTitle>
            <DialogDescription>Modifica la información de la entrada</DialogDescription>
          </DialogHeader>
          {editingEntry && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="term">Término</Label>
                    <Input
                      id="term"
                      value={editingEntry.term}
                      onChange={(e) => setEditingEntry({ ...editingEntry, term: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Categoría</Label>
                      <Input
                        id="category"
                        value={editingEntry.category}
                        onChange={(e) => setEditingEntry({ ...editingEntry, category: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="importance">Importancia</Label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={editingEntry.importance}
                        onChange={(e) => setEditingEntry({ ...editingEntry, importance: e.target.value })}
                      >
                        <option>Menor</option>
                        <option>Moderada</option>
                        <option>Alta</option>
                        <option>Crítica</option>
                        <option>Fundamental</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="status">Estado</Label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={editingEntry.status}
                      onChange={(e) => setEditingEntry({ ...editingEntry, status: e.target.value })}
                    >
                      <option>Conocido</option>
                      <option>Peligroso</option>
                      <option>Legendario</option>
                      <option>Sagrado</option>
                      <option>Oculto</option>
                      <option>En cumplimiento</option>
                      <option>Tradicional</option>
                      <option>Valioso</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="image">Imagen</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="w-24 h-16 bg-gray-200 rounded-md overflow-hidden">
                        <img
                          src={editingEntry.image || "/placeholder.svg?height=64&width=96"}
                          alt={editingEntry.term}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button variant="outline" size="sm" asChild>
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Subir Imagen
                          </label>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="briefDescription">Descripción Breve</Label>
                    <textarea
                      id="briefDescription"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                      value={editingEntry.briefDescription}
                      onChange={(e) => setEditingEntry({ ...editingEntry, briefDescription: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fullDefinition">Definición Completa</Label>
                    <textarea
                      id="fullDefinition"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                      value={editingEntry.fullDefinition}
                      onChange={(e) => setEditingEntry({ ...editingEntry, fullDefinition: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="etymology">Etimología</Label>
                    <textarea
                      id="etymology"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-16"
                      value={editingEntry.etymology}
                      onChange={(e) => setEditingEntry({ ...editingEntry, etymology: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="history">Historia</Label>
                    <textarea
                      id="history"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                      value={editingEntry.history}
                      onChange={(e) => setEditingEntry({ ...editingEntry, history: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="applications">Aplicaciones</Label>
                    <textarea
                      id="applications"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                      value={editingEntry.applications}
                      onChange={(e) => setEditingEntry({ ...editingEntry, applications: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="examples">Ejemplos</Label>
                    <textarea
                      id="examples"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                      value={editingEntry.examples}
                      onChange={(e) => setEditingEntry({ ...editingEntry, examples: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="variations">Variaciones</Label>
                    <textarea
                      id="variations"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                      value={editingEntry.variations}
                      onChange={(e) => setEditingEntry({ ...editingEntry, variations: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="relatedTerms">Términos Relacionados (separados por coma)</Label>
                  <Input
                    id="relatedTerms"
                    value={editingEntry.relatedTerms.join(", ")}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        relatedTerms: e.target.value.split(",").map((s) => s.trim()),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="references">Referencias</Label>
                  <Input
                    id="references"
                    value={editingEntry.references}
                    onChange={(e) => setEditingEntry({ ...editingEntry, references: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={saveEntry}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para nueva entrada */}
      <Dialog open={isNewEntryDialogOpen} onOpenChange={setIsNewEntryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nueva Entrada</DialogTitle>
            <DialogDescription>Añade una nueva entrada a tu wiki</DialogDescription>
          </DialogHeader>
          {editingEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-term">Término</Label>
                  <Input
                    id="new-term"
                    value={editingEntry.term}
                    onChange={(e) => setEditingEntry({ ...editingEntry, term: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="new-category-select">Categoría</Label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={editingEntry.categoryId}
                    onChange={(e) => setEditingEntry({ ...editingEntry, categoryId: e.target.value })}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="new-category-name">Nombre Categoría</Label>
                  <Input
                    id="new-category-name"
                    value={editingEntry.category}
                    onChange={(e) => setEditingEntry({ ...editingEntry, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="new-importance">Importancia</Label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={editingEntry.importance}
                    onChange={(e) => setEditingEntry({ ...editingEntry, importance: e.target.value })}
                  >
                    <option>Menor</option>
                    <option>Moderada</option>
                    <option>Alta</option>
                    <option>Crítica</option>
                    <option>Fundamental</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="new-status">Estado</Label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={editingEntry.status}
                    onChange={(e) => setEditingEntry({ ...editingEntry, status: e.target.value })}
                  >
                    <option>Conocido</option>
                    <option>Peligroso</option>
                    <option>Legendario</option>
                    <option>Sagrado</option>
                    <option>Oculto</option>
                    <option>En cumplimiento</option>
                    <option>Tradicional</option>
                    <option>Valioso</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="new-description">Descripción Breve</Label>
                <textarea
                  id="new-description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                  value={editingEntry.briefDescription}
                  onChange={(e) => setEditingEntry({ ...editingEntry, briefDescription: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewEntryDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={saveNewEntry}>
                  <Save className="h-4 w-4 mr-2" />
                  Crear Entrada
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
