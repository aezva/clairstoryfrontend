"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Users,
  Crown,
  Sword,
  Shield,
} from "lucide-react"
import { useState } from "react"
import { DndContext, type DragEndEvent, closestCenter, useSensor, useSensors, PointerSensor } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Tipos
interface Character {
  id: string
  name: string
  race: string
  age: number
  role: string
  description: string
  avatar: string
  status: string
  categoryId: string
  // Campos adicionales para detalles
  backstory: string
  personality: string
  abilities: string[]
  relationships: string
  goals: string
  fears: string
  appearance: string
}

interface Category {
  id: string
  name: string
  description: string
  color: string
  icon: React.ReactNode
}

// Datos iniciales
const initialCategories: Category[] = [
  {
    id: "protagonists",
    name: "Protagonistas",
    description: "Personajes principales de la historia",
    color: "bg-indigo-500",
    icon: <Crown className="h-4 w-4" />,
  },
  {
    id: "allies",
    name: "Aliados",
    description: "Personajes que ayudan a los protagonistas",
    color: "bg-green-500",
    icon: <Shield className="h-4 w-4" />,
  },
  {
    id: "antagonists",
    name: "Antagonistas",
    description: "Personajes que se oponen a los protagonistas",
    color: "bg-red-500",
    icon: <Sword className="h-4 w-4" />,
  },
  {
    id: "secondary",
    name: "Secundarios",
    description: "Personajes de apoyo y trasfondo",
    color: "bg-gray-500",
    icon: <Users className="h-4 w-4" />,
  },
]

const initialCharacters: Character[] = [
  {
    id: "1",
    name: "Lyra Moonwhisper",
    race: "Elfa",
    age: 127,
    role: "Protagonista",
    description:
      "Una joven elfa con el don de la magia ancestral. Desconoce su verdadero linaje y el poder que lleva dentro.",
    avatar: "/images/avatar1.png",
    status: "Viva",
    categoryId: "protagonists",
    backstory:
      "Criada por su abuela en el pueblo de Valdris, desconocía su verdadero origen hasta el despertar de su magia.",
    personality: "Valiente, curiosa, a veces impulsiva. Tiene un fuerte sentido de la justicia.",
    abilities: ["Magia Lunar", "Telepatía", "Curación menor"],
    relationships: "Nieta adoptiva de Martha Hartwell, discípula de Eldrin",
    goals: "Dominar su magia y proteger Aethermoor",
    fears: "Perder el control de su poder, lastimar a sus seres queridos",
    appearance: "Cabello plateado, ojos violetas que brillan con magia, complexión delgada",
  },
  {
    id: "2",
    name: "Theron Forjacero",
    race: "Enano",
    age: 89,
    role: "Compañero",
    description: "Maestro herrero y guerrero. Guardián de los secretos de las armas mágicas de Aethermoor.",
    avatar: "/images/avatar2.png",
    status: "Vivo",
    categoryId: "allies",
    backstory: "Último de una línea de herreros legendarios, forjó las armas que sellaron la primera guerra.",
    personality: "Leal, testarudo, protector. Tiene un gran corazón bajo su exterior rudo.",
    abilities: ["Forja mágica", "Combate con hacha", "Resistencia enana"],
    relationships: "Mentor y protector de Lyra, viejo amigo de Eldrin",
    goals: "Forjar las armas necesarias para la guerra final",
    fears: "Que se repita la tragedia de la Gran Guerra",
    appearance: "Barba roja trenzada, músculos marcados por años de forja, cicatrices de batalla",
  },
  {
    id: "3",
    name: "Zephyr",
    race: "Dragón",
    age: 1200,
    role: "Aliado",
    description: "Último dragón de cristal. Protector de la sabiduría antigua y guía de Lyra en su despertar mágico.",
    avatar: "/images/avatar3.png",
    status: "Vivo",
    categoryId: "allies",
    backstory: "Sobreviviente de la extinción de su especie, guardián de los cristales de poder.",
    personality: "Sabio, paciente, a veces críptico. Carga con el peso de la historia.",
    abilities: ["Vuelo", "Aliento de cristal", "Telepatía dragónica", "Magia ancestral"],
    relationships: "Mentor espiritual de Lyra, último de su especie",
    goals: "Preservar el conocimiento ancestral y guiar a la nueva generación",
    fears: "La extinción completa de la magia antigua",
    appearance: "Escamas de cristal azul que reflejan la luz, ojos como gemas, tamaño imponente",
  },
  {
    id: "4",
    name: "Lord Malachar",
    race: "Humano",
    age: 45,
    role: "Antagonista",
    description: "Señor oscuro que busca controlar la magia de Aethermoor. Corrupto por el poder de las sombras.",
    avatar: "/images/avatar4.png",
    status: "Vivo",
    categoryId: "antagonists",
    backstory: "Antes fue un noble que perdió a su familia en un ataque mágico, lo que lo llevó por el camino oscuro.",
    personality: "Ambicioso, calculador, atormentado por su pasado. Cree que sus métodos están justificados.",
    abilities: ["Magia sombría", "Necromancia", "Manipulación mental"],
    relationships: "Enemigo de Lyra, corruptor de otros personajes",
    goals: "Controlar toda la magia de Aethermoor para 'proteger' el mundo",
    fears: "Volver a perder a quienes considera importantes",
    appearance: "Cabello negro, ojos rojos por la corrupción, túnicas oscuras con runas",
  },
  {
    id: "5",
    name: "Aria Ventoluna",
    race: "Semielfa",
    age: 34,
    role: "Aliada",
    description: "Exploradora y conocedora de los caminos secretos. Hija de un elfo y una humana.",
    avatar: "/images/avatar5.png",
    status: "Viva",
    categoryId: "allies",
    backstory:
      "Creció entre dos mundos sin pertenecer completamente a ninguno, lo que la convirtió en una exploradora.",
    personality: "Independiente, astuta, leal a sus amigos. A veces solitaria.",
    abilities: ["Rastreo", "Supervivencia", "Arquería", "Conocimiento de rutas"],
    relationships: "Guía de Lyra, amiga de Theron",
    goals: "Encontrar su lugar en el mundo y ayudar a sus amigos",
    fears: "No ser aceptada por ninguna de las dos razas",
    appearance: "Rasgos élficos suavizados, cabello castaño, ojos verdes, vestimenta de viaje",
  },
  {
    id: "6",
    name: "Maestro Eldrin",
    race: "Elfo",
    age: 890,
    role: "Mentor",
    description: "Antiguo mago y guardián de los conocimientos perdidos. Mentor de Lyra en las artes arcanas.",
    avatar: "/images/avatar6.png",
    status: "Desaparecido",
    categoryId: "secondary",
    backstory: "Uno de los últimos magos de la era dorada, ha dedicado su vida a preservar el conocimiento.",
    personality: "Sabio, paciente, misterioso. Carga con secretos del pasado.",
    abilities: ["Magia elemental", "Teletransportación", "Ilusiones", "Conocimiento ancestral"],
    relationships: "Mentor de Lyra, viejo amigo de la familia Moonwhisper",
    goals: "Preparar a Lyra para su destino",
    fears: "Que la historia se repita",
    appearance: "Barba blanca larga, túnicas azules, bastón mágico, ojos que brillan con sabiduría",
  },
]

// Componente para tarjeta de personaje arrastrable
function DraggableCharacterCard({
  character,
  onEdit,
  onView,
}: { character: Character; onEdit: (character: Character) => void; onView: (character: Character) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: character.id,
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
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={character.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {character.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{character.name}</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{character.race}</span>
                  <span>•</span>
                  <span>{character.age} años</span>
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
                  <DropdownMenuItem onClick={() => onView(character)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(character)}>
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
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  character.role === "Protagonista"
                    ? "bg-indigo-100 text-indigo-700"
                    : character.role === "Antagonista"
                      ? "bg-red-100 text-red-700"
                      : character.role === "Mentor"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-green-100 text-green-700"
                }`}
              >
                {character.role}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  character.status === "Vivo" || character.status === "Viva"
                    ? "bg-green-100 text-green-700"
                    : character.status === "Desaparecido"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                }`}
              >
                {character.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{character.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para categoría con drop zone
function CharacterCategory({
  category,
  characters,
  onEditCategory,
  onDeleteCategory,
  onEditCharacter,
  onViewCharacter,
}: {
  category: Category
  characters: Character[]
  onEditCategory: (category: Category) => void
  onDeleteCategory: (categoryId: string) => void
  onEditCharacter: (character: Character) => void
  onViewCharacter: (character: Character) => void
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
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
            {characters.length}
          </span>
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

      <SortableContext items={characters.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[200px] p-4 border-2 border-dashed border-gray-200 rounded-lg">
          {characters.map((character) => (
            <DraggableCharacterCard
              key={character.id}
              character={character}
              onEdit={onEditCharacter}
              onView={onViewCharacter}
            />
          ))}
          {characters.length === 0 && (
            <div className="col-span-full flex items-center justify-center text-gray-400 text-sm py-8">
              Arrastra personajes aquí o crea uno nuevo
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export function CharactersPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [characters, setCharacters] = useState<Character[]>(initialCharacters)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isNewCharacterDialogOpen, setIsNewCharacterDialogOpen] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const characterId = active.id as string
    const targetCategoryId = over.id as string

    // Si se suelta sobre una categoría diferente
    if (categories.some((cat) => cat.id === targetCategoryId)) {
      setCharacters((prev) =>
        prev.map((char) => (char.id === characterId ? { ...char, categoryId: targetCategoryId } : char)),
      )
    }
  }

  const handleViewCharacter = (character: Character) => {
    setSelectedCharacter(character)
    setIsViewDialogOpen(true)
  }

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter(character)
    setIsEditDialogOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setIsCategoryDialogOpen(true)
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId))
      // Mover personajes a "Secundarios"
      setCharacters((prev) =>
        prev.map((char) => (char.categoryId === categoryId ? { ...char, categoryId: "secondary" } : char)),
      )
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        if (editingCharacter) {
          setEditingCharacter({ ...editingCharacter, avatar: imageUrl })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const saveCharacter = () => {
    if (editingCharacter) {
      setCharacters((prev) => prev.map((char) => (char.id === editingCharacter.id ? editingCharacter : char)))
      setIsEditDialogOpen(false)
      setEditingCharacter(null)
    }
  }

  const createNewCharacter = () => {
    const newCharacter: Character = {
      id: Date.now().toString(),
      name: "Nuevo Personaje",
      race: "Humano",
      age: 25,
      role: "Secundario",
      description: "Descripción del personaje...",
      avatar: "/placeholder.svg",
      status: "Vivo",
      categoryId: "secondary",
      backstory: "",
      personality: "",
      abilities: [],
      relationships: "",
      goals: "",
      fears: "",
      appearance: "",
    }
    setEditingCharacter(newCharacter)
    setIsNewCharacterDialogOpen(true)
  }

  const saveNewCharacter = () => {
    if (editingCharacter) {
      setCharacters((prev) => [...prev, editingCharacter])
      setIsNewCharacterDialogOpen(false)
      setEditingCharacter(null)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Personajes</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
            <Button onClick={createNewCharacter}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Personaje
            </Button>
          </div>
        </div>
        <p className="text-gray-600 mt-2">Organiza y gestiona los personajes de tu historia</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryCharacters = characters.filter((char) => char.categoryId === category.id)
            return (
              <CharacterCategory
                key={category.id}
                category={category}
                characters={categoryCharacters}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onEditCharacter={handleEditCharacter}
                onViewCharacter={handleViewCharacter}
              />
            )
          })}
        </div>
      </DndContext>

      {/* Dialog para ver detalles del personaje */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedCharacter?.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {selectedCharacter?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <span>{selectedCharacter?.name}</span>
                <p className="text-sm text-gray-500 font-normal">
                  {selectedCharacter?.race} • {selectedCharacter?.age} años
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedCharacter && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Información Básica</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Rol:</strong> {selectedCharacter.role}
                    </p>
                    <p>
                      <strong>Estado:</strong> {selectedCharacter.status}
                    </p>
                    <p>
                      <strong>Descripción:</strong> {selectedCharacter.description}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Historia Personal</h4>
                  <p className="text-sm text-gray-600">{selectedCharacter.backstory}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Personalidad</h4>
                  <p className="text-sm text-gray-600">{selectedCharacter.personality}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Habilidades</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCharacter.abilities.map((ability, index) => (
                      <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                        {ability}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Relaciones</h4>
                  <p className="text-sm text-gray-600">{selectedCharacter.relationships}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Objetivos</h4>
                  <p className="text-sm text-gray-600">{selectedCharacter.goals}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Miedos</h4>
                  <p className="text-sm text-gray-600">{selectedCharacter.fears}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Apariencia</h4>
                  <p className="text-sm text-gray-600">{selectedCharacter.appearance}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para editar personaje */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Personaje</DialogTitle>
            <DialogDescription>Modifica la información del personaje</DialogDescription>
          </DialogHeader>
          {editingCharacter && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={editingCharacter.name}
                      onChange={(e) => setEditingCharacter({ ...editingCharacter, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="race">Raza</Label>
                      <Input
                        id="race"
                        value={editingCharacter.race}
                        onChange={(e) => setEditingCharacter({ ...editingCharacter, race: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Edad</Label>
                      <Input
                        id="age"
                        type="number"
                        value={editingCharacter.age}
                        onChange={(e) => setEditingCharacter({ ...editingCharacter, age: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="role">Rol</Label>
                      <Input
                        id="role"
                        value={editingCharacter.role}
                        onChange={(e) => setEditingCharacter({ ...editingCharacter, role: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Estado</Label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={editingCharacter.status}
                        onChange={(e) => setEditingCharacter({ ...editingCharacter, status: e.target.value })}
                      >
                        <option>Vivo</option>
                        <option>Viva</option>
                        <option>Muerto</option>
                        <option>Muerta</option>
                        <option>Desaparecido</option>
                        <option>Desaparecida</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="avatar">Imagen del Personaje</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={editingCharacter.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {editingCharacter.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
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
                    <Label htmlFor="description">Descripción</Label>
                    <textarea
                      id="description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                      value={editingCharacter.description}
                      onChange={(e) => setEditingCharacter({ ...editingCharacter, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="backstory">Historia Personal</Label>
                    <textarea
                      id="backstory"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                      value={editingCharacter.backstory}
                      onChange={(e) => setEditingCharacter({ ...editingCharacter, backstory: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="personality">Personalidad</Label>
                    <textarea
                      id="personality"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                      value={editingCharacter.personality}
                      onChange={(e) => setEditingCharacter({ ...editingCharacter, personality: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="abilities">Habilidades (separadas por coma)</Label>
                    <Input
                      id="abilities"
                      value={editingCharacter.abilities.join(", ")}
                      onChange={(e) =>
                        setEditingCharacter({
                          ...editingCharacter,
                          abilities: e.target.value.split(",").map((s) => s.trim()),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="relationships">Relaciones</Label>
                    <textarea
                      id="relationships"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                      value={editingCharacter.relationships}
                      onChange={(e) => setEditingCharacter({ ...editingCharacter, relationships: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goals">Objetivos</Label>
                    <textarea
                      id="goals"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                      value={editingCharacter.goals}
                      onChange={(e) => setEditingCharacter({ ...editingCharacter, goals: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fears">Miedos</Label>
                    <textarea
                      id="fears"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                      value={editingCharacter.fears}
                      onChange={(e) => setEditingCharacter({ ...editingCharacter, fears: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="appearance">Apariencia Física</Label>
                <textarea
                  id="appearance"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                  value={editingCharacter.appearance}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, appearance: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={saveCharacter}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para nuevo personaje */}
      <Dialog open={isNewCharacterDialogOpen} onOpenChange={setIsNewCharacterDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Personaje</DialogTitle>
            <DialogDescription>Añade un nuevo personaje a tu historia</DialogDescription>
          </DialogHeader>
          {editingCharacter && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-name">Nombre</Label>
                  <Input
                    id="new-name"
                    value={editingCharacter.name}
                    onChange={(e) => setEditingCharacter({ ...editingCharacter, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="new-race">Raza</Label>
                  <Input
                    id="new-race"
                    value={editingCharacter.race}
                    onChange={(e) => setEditingCharacter({ ...editingCharacter, race: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="new-age">Edad</Label>
                  <Input
                    id="new-age"
                    type="number"
                    value={editingCharacter.age}
                    onChange={(e) => setEditingCharacter({ ...editingCharacter, age: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="new-role">Rol</Label>
                  <Input
                    id="new-role"
                    value={editingCharacter.role}
                    onChange={(e) => setEditingCharacter({ ...editingCharacter, role: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="new-category">Categoría</Label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={editingCharacter.categoryId}
                    onChange={(e) => setEditingCharacter({ ...editingCharacter, categoryId: e.target.value })}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="new-description">Descripción</Label>
                <textarea
                  id="new-description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                  value={editingCharacter.description}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewCharacterDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={saveNewCharacter}>
                  <Save className="h-4 w-4 mr-2" />
                  Crear Personaje
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
