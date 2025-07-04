"use client"

import React from "react"
import { useState } from "react"
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
  Eye,
  GripVertical,
  FileText,
  BookOpen,
  Camera,
  Zap,
  Users,
  Swords,
  FolderOpen,
  Search,
  Clock,
  MapPin,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Tipos de elementos de escaleta
const ELEMENT_TYPES = [
  {
    id: "act",
    label: "Acto",
    icon: BookOpen,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    id: "chapter",
    label: "Capítulo",
    icon: FileText,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    id: "scene",
    label: "Escena",
    icon: Camera,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  {
    id: "plot",
    label: "Punto de Trama",
    icon: Zap,
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  {
    id: "character",
    label: "Arco de Personaje",
    icon: Users,
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  },
  {
    id: "conflict",
    label: "Conflicto",
    icon: Swords,
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
]

const STATUS_OPTIONS = [
  { id: "planned", label: "Planificado", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
  { id: "developing", label: "En desarrollo", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  {
    id: "in-progress",
    label: "En progreso",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  { id: "completed", label: "Completado", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
]

interface OutlineElement {
  id: string
  title: string
  type: string
  status: string
  description: string
  duration?: string
  location?: string
  pov?: string
  order: number
  categoryId: string
  environment?: string
  conflict?: string
  resolution?: string
  themes?: string
  foreshadowing?: string
  notes?: string
}

interface Category {
  id: string
  name: string
  description: string
  icon: any
  color: string
}

const initialCategories: Category[] = [
  {
    id: "structure",
    name: "Estructura Principal",
    description: "Actos y estructura general de la historia",
    icon: BookOpen,
    color: "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800",
  },
  {
    id: "chapters",
    name: "Capítulos",
    description: "División por capítulos y secciones",
    icon: FileText,
    color: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
  },
  {
    id: "scenes",
    name: "Escenas",
    description: "Escenas individuales y secuencias",
    icon: Camera,
    color: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
  },
  {
    id: "plot-points",
    name: "Puntos de Trama",
    description: "Momentos clave y giros argumentales",
    icon: Zap,
    color: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
  },
]

const initialElements: OutlineElement[] = [
  {
    id: "1",
    title: "Acto I - Presentación",
    type: "act",
    status: "completed",
    description:
      "Introducción del mundo y personajes principales. Establecimiento del tono y la atmósfera de la historia.",
    duration: "25%",
    order: 1,
    categoryId: "structure",
    themes: "Descubrimiento, origen",
    notes: "Establecer el tono y la atmósfera",
  },
  {
    id: "2",
    title: "Capítulo 1 - El Despertar",
    type: "chapter",
    status: "completed",
    description: "El protagonista descubre sus poderes mágicos en un momento de crisis personal.",
    location: "Villa de Aethermoor",
    pov: "Kael",
    order: 1,
    categoryId: "chapters",
    environment: "Pueblo rural al amanecer",
    conflict: "Kael no entiende lo que le está pasando",
    resolution: "Acepta que algo ha cambiado en él",
  },
  {
    id: "3",
    title: "Escena 1 - La Revelación",
    type: "scene",
    status: "in-progress",
    description: "Kael ve las runas brillar por primera vez mientras camina por el bosque sagrado.",
    location: "Bosque Sagrado",
    pov: "Kael",
    duration: "10 min",
    order: 1,
    categoryId: "scenes",
    environment: "Bosque místico con niebla matutina",
    conflict: "Las runas reaccionan violentamente",
    resolution: "Kael huye asustado",
    foreshadowing: "Las runas predicen la llegada del mal",
  },
  {
    id: "4",
    title: "Incidente Incitante",
    type: "plot",
    status: "planned",
    description: "El ataque a la villa que cambia todo y obliga al protagonista a actuar.",
    location: "Villa de Aethermoor",
    order: 1,
    categoryId: "plot-points",
    conflict: "Fuerzas oscuras atacan el pueblo",
    resolution: "Kael debe huir y buscar ayuda",
    themes: "Pérdida, responsabilidad",
  },
  {
    id: "5",
    title: "Arco de Lyra - Crecimiento",
    type: "character",
    status: "developing",
    description: "La evolución de Lyra desde una joven insegura hasta una líder valiente.",
    order: 1,
    categoryId: "structure",
    conflict: "Inseguridad vs responsabilidad",
    resolution: "Acepta su destino como líder",
    themes: "Madurez, liderazgo",
  },
  {
    id: "6",
    title: "Conflicto Central - Luz vs Oscuridad",
    type: "conflict",
    status: "developing",
    description: "La batalla épica entre las fuerzas del bien y el mal que define toda la historia.",
    order: 1,
    categoryId: "structure",
    conflict: "Fuerzas oscuras amenazan el mundo",
    resolution: "Victoria a través del sacrificio",
    themes: "Bien vs mal, sacrificio",
  },
]

interface OutlinePageProps {
  projectId?: string | null
}

export function OutlinePage({ projectId }: OutlinePageProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [elements, setElements] = useState<OutlineElement[]>(initialElements)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedElement, setSelectedElement] = useState<OutlineElement | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [editingElement, setEditingElement] = useState<OutlineElement | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryDescription, setNewCategoryDescription] = useState("")

  // Filtrar elementos por búsqueda
  const filteredElements = elements.filter(
    (element) =>
      element.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.pov?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Agrupar elementos por categoría
  const elementsByCategory = categories.map((category) => ({
    ...category,
    elements: filteredElements
      .filter((element) => element.categoryId === category.id)
      .sort((a, b) => a.order - b.order),
  }))

  const handleViewElement = (element: OutlineElement) => {
    setSelectedElement(element)
    setIsViewDialogOpen(true)
  }

  const handleEditElement = (element: OutlineElement) => {
    setEditingElement({ ...element })
    setIsEditDialogOpen(true)
  }

  const handleDeleteElement = (elementId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este elemento?")) {
      setElements((prev) => prev.filter((element) => element.id !== elementId))
    }
  }

  const handleSaveElement = () => {
    if (editingElement) {
      setElements((prev) => prev.map((element) => (element.id === editingElement.id ? editingElement : element)))
      setIsEditDialogOpen(false)
      setEditingElement(null)
    }
  }

  const handleCreateElement = () => {
    if (editingElement) {
      const newElement: OutlineElement = {
        ...editingElement,
        id: Date.now().toString(),
        order: elements.filter((e) => e.categoryId === editingElement.categoryId).length + 1,
      }
      setElements((prev) => [...prev, newElement])
      setIsCreateDialogOpen(false)
      setEditingElement(null)
    }
  }

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim(),
        icon: FolderOpen,
        color: "bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800",
      }
      setCategories((prev) => [...prev, newCategory])
      setNewCategoryName("")
      setNewCategoryDescription("")
      setIsCategoryDialogOpen(false)
    }
  }

  const getTypeInfo = (typeId: string) => {
    return ELEMENT_TYPES.find((type) => type.id === typeId) || ELEMENT_TYPES[0]
  }

  const getStatusInfo = (statusId: string) => {
    return STATUS_OPTIONS.find((status) => status.id === statusId) || STATUS_OPTIONS[0]
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Escaleta</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
            <Button
              onClick={() => {
                setEditingElement({
                  id: "",
                  title: "",
                  type: "scene",
                  status: "planned",
                  description: "",
                  order: 1,
                  categoryId: categories[0]?.id || "",
                })
                setIsCreateDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Elemento
            </Button>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Organiza la estructura narrativa de tu historia</p>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar elementos por título, descripción, ubicación o POV..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Contenido principal */}
      <div className="space-y-8">
        {elementsByCategory.map((category) => (
          <div key={category.id}>
            {/* Header de categoría */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <category.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{category.name}</h2>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium dark:bg-gray-800 dark:text-gray-400">
                  {category.elements.length}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar categoría
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar categoría
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Grid de elementos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[200px] p-4 border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-700">
              {category.elements.length > 0 ? (
                category.elements.map((element) => {
                  const typeInfo = getTypeInfo(element.type)
                  const statusInfo = getStatusInfo(element.status)

                  return (
                    <Card key={element.id} className="group hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-md flex-shrink-0 dark:bg-gray-800">
                              <typeInfo.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg truncate">{element.title}</CardTitle>
                              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1 dark:text-gray-400">
                                <span className={cn("px-2 py-1 rounded-full text-xs font-medium", typeInfo.color)}>
                                  {typeInfo.label}
                                </span>
                                {element.duration && (
                                  <>
                                    <span>•</span>
                                    <div className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      <span>{element.duration}</span>
                                    </div>
                                  </>
                                )}
                                {element.location && (
                                  <>
                                    <span>•</span>
                                    <div className="flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      <span className="truncate max-w-20">{element.location}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GripVertical className="h-4 w-4 text-gray-400 cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleViewElement(element)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditElement(element)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteElement(element.id)}
                                  className="text-red-600"
                                >
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
                            <span className={cn("px-2 py-1 rounded-full text-xs font-medium", statusInfo.color)}>
                              {statusInfo.label}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full dark:bg-gray-800 dark:text-gray-400">
                              #{element.order}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 dark:text-gray-400">
                            {element.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            {element.pov && (
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                <span>{element.pov}</span>
                              </div>
                            )}
                            {element.themes && (
                              <div className="flex items-center">
                                <span className="truncate max-w-24">{element.themes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center text-gray-400 text-sm py-12">
                  <category.icon className="h-12 w-12 mb-4" />
                  <p className="text-center">
                    No hay elementos en esta categoría.
                    <br />
                    Arrastra elementos aquí o crea uno nuevo.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dialog para ver elemento */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-md flex items-center justify-center dark:bg-indigo-900">
                {selectedElement &&
                  React.createElement(getTypeInfo(selectedElement.type).icon, {
                    className: "h-5 w-5 text-indigo-600 dark:text-indigo-400",
                  })}
              </div>
              <div>
                <span>{selectedElement?.title}</span>
                <p className="text-sm text-gray-500 font-normal dark:text-gray-400">
                  {selectedElement && getTypeInfo(selectedElement.type).label} •{" "}
                  {selectedElement && getStatusInfo(selectedElement.status).label}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedElement && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 dark:text-gray-200">Información Básica</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Orden:</strong> #{selectedElement.order}
                    </p>
                    <p>
                      <strong>Duración:</strong> {selectedElement.duration || "No especificada"}
                    </p>
                    <p>
                      <strong>POV:</strong> {selectedElement.pov || "No especificado"}
                    </p>
                    <p>
                      <strong>Ubicación:</strong> {selectedElement.location || "No especificada"}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 dark:text-gray-200">Descripción</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedElement.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 dark:text-gray-200">Conflicto</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedElement.conflict || "No especificado"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 dark:text-gray-200">Resolución</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedElement.resolution || "No especificada"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 dark:text-gray-200">Temas</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedElement.themes || "No especificados"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 dark:text-gray-200">Ambiente</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedElement.environment || "No especificado"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 dark:text-gray-200">Presagios</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedElement.foreshadowing || "No especificados"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 dark:text-gray-200">Notas</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedElement.notes || "Sin notas adicionales"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para editar elemento */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Elemento</DialogTitle>
            <DialogDescription>Modifica los detalles del elemento de escaleta</DialogDescription>
          </DialogHeader>
          {editingElement && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-title">Título</Label>
                    <Input
                      id="edit-title"
                      value={editingElement.title}
                      onChange={(e) => setEditingElement({ ...editingElement, title: e.target.value })}
                      placeholder="Título del elemento"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-type">Tipo</Label>
                      <select
                        id="edit-type"
                        value={editingElement.type}
                        onChange={(e) => setEditingElement({ ...editingElement, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      >
                        {ELEMENT_TYPES.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="edit-order">Orden</Label>
                      <Input
                        id="edit-order"
                        type="number"
                        value={editingElement.order}
                        onChange={(e) =>
                          setEditingElement({ ...editingElement, order: Number.parseInt(e.target.value) || 1 })
                        }
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-status">Estado</Label>
                      <select
                        id="edit-status"
                        value={editingElement.status}
                        onChange={(e) => setEditingElement({ ...editingElement, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status.id} value={status.id}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="edit-duration">Duración</Label>
                      <Input
                        id="edit-duration"
                        value={editingElement.duration || ""}
                        onChange={(e) => setEditingElement({ ...editingElement, duration: e.target.value })}
                        placeholder="ej: 10 min, 25%"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-pov">Punto de Vista</Label>
                      <Input
                        id="edit-pov"
                        value={editingElement.pov || ""}
                        onChange={(e) => setEditingElement({ ...editingElement, pov: e.target.value })}
                        placeholder="Personaje POV"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-location">Ubicación</Label>
                      <Input
                        id="edit-location"
                        value={editingElement.location || ""}
                        onChange={(e) => setEditingElement({ ...editingElement, location: e.target.value })}
                        placeholder="Lugar donde ocurre"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-description">Descripción</Label>
                    <textarea
                      id="edit-description"
                      value={editingElement.description}
                      onChange={(e) => setEditingElement({ ...editingElement, description: e.target.value })}
                      placeholder="Descripción del elemento"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-environment">Ambiente</Label>
                    <Input
                      id="edit-environment"
                      value={editingElement.environment || ""}
                      onChange={(e) => setEditingElement({ ...editingElement, environment: e.target.value })}
                      placeholder="Descripción del ambiente"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-themes">Temas</Label>
                    <Input
                      id="edit-themes"
                      value={editingElement.themes || ""}
                      onChange={(e) => setEditingElement({ ...editingElement, themes: e.target.value })}
                      placeholder="Temas explorados"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-category">Categoría</Label>
                    <select
                      id="edit-category"
                      value={editingElement.categoryId}
                      onChange={(e) => setEditingElement({ ...editingElement, categoryId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="edit-conflict">Conflicto</Label>
                  <textarea
                    id="edit-conflict"
                    value={editingElement.conflict || ""}
                    onChange={(e) => setEditingElement({ ...editingElement, conflict: e.target.value })}
                    placeholder="Conflicto principal del elemento"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-resolution">Resolución</Label>
                  <textarea
                    id="edit-resolution"
                    value={editingElement.resolution || ""}
                    onChange={(e) => setEditingElement({ ...editingElement, resolution: e.target.value })}
                    placeholder="Cómo se resuelve el conflicto"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="edit-foreshadowing">Presagios</Label>
                  <textarea
                    id="edit-foreshadowing"
                    value={editingElement.foreshadowing || ""}
                    onChange={(e) => setEditingElement({ ...editingElement, foreshadowing: e.target.value })}
                    placeholder="Elementos de presagio o setup"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-notes">Notas</Label>
                  <textarea
                    id="edit-notes"
                    value={editingElement.notes || ""}
                    onChange={(e) => setEditingElement({ ...editingElement, notes: e.target.value })}
                    placeholder="Notas adicionales"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveElement}>Guardar Cambios</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para crear elemento */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Elemento</DialogTitle>
            <DialogDescription>Añade un nuevo elemento a tu escaleta</DialogDescription>
          </DialogHeader>
          {editingElement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create-title">Título</Label>
                  <Input
                    id="create-title"
                    value={editingElement.title}
                    onChange={(e) => setEditingElement({ ...editingElement, title: e.target.value })}
                    placeholder="Título del elemento"
                  />
                </div>
                <div>
                  <Label htmlFor="create-type">Tipo</Label>
                  <select
                    id="create-type"
                    value={editingElement.type}
                    onChange={(e) => setEditingElement({ ...editingElement, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  >
                    {ELEMENT_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="create-order">Orden</Label>
                  <Input
                    id="create-order"
                    type="number"
                    value={editingElement.order}
                    onChange={(e) =>
                      setEditingElement({ ...editingElement, order: Number.parseInt(e.target.value) || 1 })
                    }
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="create-status">Estado</Label>
                  <select
                    id="create-status"
                    value={editingElement.status}
                    onChange={(e) => setEditingElement({ ...editingElement, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="create-category">Categoría</Label>
                  <select
                    id="create-category"
                    value={editingElement.categoryId}
                    onChange={(e) => setEditingElement({ ...editingElement, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="create-description">Descripción</Label>
                <textarea
                  id="create-description"
                  value={editingElement.description}
                  onChange={(e) => setEditingElement({ ...editingElement, description: e.target.value })}
                  placeholder="Descripción del elemento"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create-duration">Duración</Label>
                  <Input
                    id="create-duration"
                    value={editingElement.duration || ""}
                    onChange={(e) => setEditingElement({ ...editingElement, duration: e.target.value })}
                    placeholder="ej: 10 min, 25%"
                  />
                </div>
                <div>
                  <Label htmlFor="create-location">Ubicación</Label>
                  <Input
                    id="create-location"
                    value={editingElement.location || ""}
                    onChange={(e) => setEditingElement({ ...editingElement, location: e.target.value })}
                    placeholder="Lugar donde ocurre"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateElement}>Crear Elemento</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para crear categoría */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Categoría</DialogTitle>
            <DialogDescription>Crea una nueva categoría para organizar tus elementos</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="category-name">Nombre de la categoría</Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="ej: Personajes Secundarios"
              />
            </div>
            <div>
              <Label htmlFor="category-description">Descripción</Label>
              <Input
                id="category-description"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Descripción de la categoría"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateCategory}>Crear Categoría</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
