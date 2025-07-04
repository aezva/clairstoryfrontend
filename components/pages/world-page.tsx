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
  MapPin,
  Crown,
  Trees,
  Castle,
  Sparkles,
  TrashIcon as Ruins,
} from "lucide-react"
import { useState } from "react"
import { DndContext, type DragEndEvent, closestCenter, useSensor, useSensors, PointerSensor } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Tipos
interface Location {
  id: string
  name: string
  type: string
  region: string
  description: string
  image: string
  status: string
  categoryId: string
  // Campos adicionales para detalles
  history: string
  inhabitants: string
  government: string
  economy: string
  culture: string
  geography: string
  climate: string
  resources: string[]
  pointsOfInterest: string
  dangers: string
  size: string
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
    id: "cities",
    name: "Ciudades",
    description: "Centros urbanos y asentamientos principales",
    color: "bg-indigo-500",
    icon: <Castle className="h-4 w-4" />,
  },
  {
    id: "kingdoms",
    name: "Reinos",
    description: "Países, reinos y territorios políticos",
    color: "bg-purple-500",
    icon: <Crown className="h-4 w-4" />,
  },
  {
    id: "natural",
    name: "Lugares Naturales",
    description: "Bosques, montañas, ríos y formaciones naturales",
    color: "bg-green-500",
    icon: <Trees className="h-4 w-4" />,
  },
  {
    id: "magical",
    name: "Lugares Mágicos",
    description: "Sitios con propiedades mágicas especiales",
    color: "bg-pink-500",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: "ruins",
    name: "Ruinas",
    description: "Lugares antiguos, ruinas y sitios abandonados",
    color: "bg-gray-500",
    icon: <Ruins className="h-4 w-4" />,
  },
]

const initialLocations: Location[] = [
  {
    id: "1",
    name: "Valdris",
    type: "Pueblo",
    region: "Tierras Centrales",
    description: "Pequeño pueblo donde creció Lyra. Conocido por sus campos de trigo dorado y el Gran Roble sagrado.",
    image: "/placeholder.svg?height=200&width=300",
    status: "Próspero",
    categoryId: "cities",
    history:
      "Fundado hace 300 años por colonos que buscaban tierras fértiles. Se convirtió en un centro agrícola próspero.",
    inhabitants: "Principalmente humanos y algunos elfos. Población de aproximadamente 800 habitantes.",
    government: "Consejo de Ancianos dirigido por el Alcalde Tomás Hartwell.",
    economy: "Agricultura, principalmente trigo y cebada. Comercio menor con ciudades cercanas.",
    culture: "Comunidad unida con tradiciones agrícolas. Festivales de cosecha anuales.",
    geography: "Valle fértil rodeado de colinas suaves. Atravesado por el río Cristalino.",
    climate: "Templado, con veranos cálidos e inviernos suaves. Lluvias regulares.",
    resources: ["Trigo", "Cebada", "Madera", "Piedra caliza"],
    pointsOfInterest: "El Gran Roble sagrado en el centro del pueblo, la antigua fuente de piedra.",
    dangers: "Ocasionales bandidos en los caminos. Tormentas mágicas raras.",
    size: "Pequeño",
  },
  {
    id: "2",
    name: "Reino de Aethermoor",
    type: "Reino",
    region: "Continente Principal",
    description:
      "El gran reino donde se desarrolla la historia. Dividido en múltiples regiones con diferentes climas y culturas.",
    image: "/placeholder.svg?height=200&width=300",
    status: "En conflicto",
    categoryId: "kingdoms",
    history:
      "Reino milenario fundado tras la unificación de las tribus antiguas. Ha sobrevivido a múltiples guerras mágicas.",
    inhabitants: "Diverso: humanos, elfos, enanos, semielfos. Población estimada en 2 millones.",
    government: "Monarquía constitucional con el Rey Aldric III. Consejo de Nobles y representantes regionales.",
    economy: "Agricultura, minería, comercio mágico, artesanías. Moneda: Coronas de Oro de Aethermoor.",
    culture: "Rica mezcla de tradiciones. Arte, música y literatura florecientes. Academias de magia.",
    geography: "Territorio vasto con montañas, bosques, llanuras y costas. Ríos principales conectan las regiones.",
    climate: "Variado según la región. Desde templado en el centro hasta frío en las montañas del norte.",
    resources: ["Cristales mágicos", "Metales preciosos", "Madera élfica", "Gemas", "Hierbas medicinales"],
    pointsOfInterest: "Palacio Real, Academia de Magia, Biblioteca Real, Templos antiguos.",
    dangers: "Conflictos políticos, criaturas mágicas hostiles, zonas de magia inestable.",
    size: "Muy grande",
  },
  {
    id: "3",
    name: "Montañas de Cristal",
    type: "Cordillera",
    region: "Norte",
    description: "Cadena montañosa donde habitan los últimos dragones. Sus picos brillan con cristales mágicos.",
    image: "/placeholder.svg?height=200&width=300",
    status: "Peligroso",
    categoryId: "natural",
    history: "Formadas durante la Gran Ruptura Mágica hace 2000 años. Los cristales crecieron por la magia residual.",
    inhabitants: "Dragones de cristal, algunas tribus de montañeses, criaturas mágicas menores.",
    government: "Sin gobierno formal. Los dragones mantienen un territorio respetado.",
    economy: "Sin economía tradicional. Los cristales son muy valiosos pero difíciles de extraer.",
    culture: "Cultura dragónica antigua. Tradiciones orales preservadas por milenios.",
    geography: "Picos escarpados de hasta 4000 metros. Cuevas profundas con formaciones cristalinas.",
    climate: "Frío extremo en las alturas. Tormentas mágicas frecuentes.",
    resources: ["Cristales de poder", "Metales raros", "Hielo eterno", "Gemas dragónicas"],
    pointsOfInterest: "Nido del Dragón Anciano, Cavernas de Cristal, Puente de los Vientos.",
    dangers: "Dragones territoriales, avalanchas mágicas, criaturas de hielo, clima extremo.",
    size: "Grande",
  },
  {
    id: "4",
    name: "Fortaleza Sombría",
    type: "Fortaleza",
    region: "Tierras Malditas",
    description: "Bastión de Lord Malachar. Una torre negra que se alza sobre un páramo desolado.",
    image: "/placeholder.svg?height=200&width=300",
    status: "Hostil",
    categoryId: "ruins",
    history: "Construida sobre las ruinas de un templo antiguo. Corrompida por la magia oscura de Malachar.",
    inhabitants: "Lord Malachar, sus seguidores, criaturas sombras, no-muertos.",
    government: "Dictadura absoluta bajo Lord Malachar. Ley marcial constante.",
    economy: "Basada en saqueo y tributos forzados. Comercio de artefactos oscuros.",
    culture: "Cultura del miedo y la opresión. Rituales oscuros y adoración al poder.",
    geography: "Torre central de 200 metros rodeada de murallas. Páramo árido alrededor.",
    climate: "Perpetuamente nublado y frío. Niebla tóxica ocasional.",
    resources: ["Artefactos oscuros", "Metales malditos", "Energía sombría"],
    pointsOfInterest: "Torre del Señor Oscuro, Mazmorras, Altar de Sacrificios, Cementerio Maldito.",
    dangers: "Lord Malachar, criaturas sombras, trampas mágicas, corrupción ambiental.",
    size: "Mediano",
  },
  {
    id: "5",
    name: "Puerto de Mareas",
    type: "Ciudad Portuaria",
    region: "Costa Oeste",
    description: "Bulliciosa ciudad comercial donde convergen mercaderes de todos los rincones del mundo.",
    image: "/placeholder.svg?height=200&width=300",
    status: "Próspero",
    categoryId: "cities",
    history: "Fundada como puesto comercial hace 400 años. Creció hasta convertirse en el puerto más importante.",
    inhabitants: "Muy diverso: todas las razas. Población de 50,000 habitantes. Muchos extranjeros.",
    government: "Consejo Mercantil elegido por los gremios. Alcalde rotativo cada dos años.",
    economy: "Comercio marítimo, pesca, construcción naval, banca. Centro económico regional.",
    culture: "Cosmopolita y tolerante. Mezcla de tradiciones. Festivales internacionales.",
    geography: "Bahía natural protegida. Muelles extensos, almacenes, barrios comerciales.",
    climate: "Marítimo templado. Brisas constantes, lluvias moderadas.",
    resources: ["Pescado", "Sal marina", "Perlas", "Madera de barcos", "Especias importadas"],
    pointsOfInterest: "Gran Mercado, Faro de los Navegantes, Astilleros Reales, Barrio de los Gremios.",
    dangers: "Piratas ocasionales, tormentas marinas, contrabandistas, crimen organizado.",
    size: "Grande",
  },
  {
    id: "6",
    name: "Bosque Susurrante",
    type: "Bosque Encantado",
    region: "Este",
    description: "Bosque mágico habitado por elfos. Los árboles aquí guardan memorias ancestrales.",
    image: "/placeholder.svg?height=200&width=300",
    status: "Misterioso",
    categoryId: "magical",
    history: "Bosque primordial imbuido de magia élfica durante milenios. Los árboles son conscientes.",
    inhabitants: "Elfos del bosque, dríadas, unicornios, espíritus de la naturaleza.",
    government: "Consejo de Ancianos Élficos. Decisiones por consenso con los espíritus del bosque.",
    economy: "Autosuficiente. Intercambio de conocimiento mágico por bienes necesarios.",
    culture: "Armonía con la naturaleza. Arte vivo, música natural, sabiduría ancestral.",
    geography: "Árboles gigantes de hasta 100 metros. Senderos serpenteantes, claros sagrados.",
    climate: "Templado húmedo. Protegido de extremos climáticos por magia natural.",
    resources: ["Madera élfica", "Hierbas mágicas", "Frutos encantados", "Agua de manantial pura"],
    pointsOfInterest: "Árbol Madre, Círculo de Piedras Lunares, Lago de los Reflejos, Biblioteca Viviente.",
    dangers: "Protecciones mágicas contra intrusos, criaturas guardianas, laberintos naturales.",
    size: "Grande",
  },
]

// Componente para tarjeta de lugar arrastrable
function DraggableLocationCard({
  location,
  onEdit,
  onView,
}: { location: Location; onEdit: (location: Location) => void; onView: (location: Location) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: location.id,
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
                  src={location.image || "/placeholder.svg"}
                  alt={location.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=48&width=64"
                  }}
                />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{location.name}</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{location.type}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{location.region}</span>
                  </div>
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
                  <DropdownMenuItem onClick={() => onView(location)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(location)}>
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
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">{location.size}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  location.status === "Próspero"
                    ? "bg-green-100 text-green-700"
                    : location.status === "Peligroso" || location.status === "Hostil"
                      ? "bg-red-100 text-red-700"
                      : location.status === "Misterioso"
                        ? "bg-purple-100 text-purple-700"
                        : location.status === "En conflicto"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                }`}
              >
                {location.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{location.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para categoría con drop zone
function LocationCategory({
  category,
  locations,
  onEditCategory,
  onDeleteCategory,
  onEditLocation,
  onViewLocation,
}: {
  category: Category
  locations: Location[]
  onEditCategory: (category: Category) => void
  onDeleteCategory: (categoryId: string) => void
  onEditLocation: (location: Location) => void
  onViewLocation: (location: Location) => void
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
            {locations.length}
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

      <SortableContext items={locations.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[200px] p-4 border-2 border-dashed border-gray-200 rounded-lg">
          {locations.map((location) => (
            <DraggableLocationCard
              key={location.id}
              location={location}
              onEdit={onEditLocation}
              onView={onViewLocation}
            />
          ))}
          {locations.length === 0 && (
            <div className="col-span-full flex items-center justify-center text-gray-400 text-sm py-8">
              Arrastra lugares aquí o crea uno nuevo
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export function WorldPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [locations, setLocations] = useState<Location[]>(initialLocations)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isNewLocationDialogOpen, setIsNewLocationDialogOpen] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const locationId = active.id as string
    const targetCategoryId = over.id as string

    // Si se suelta sobre una categoría diferente
    if (categories.some((cat) => cat.id === targetCategoryId)) {
      setLocations((prev) =>
        prev.map((loc) => (loc.id === locationId ? { ...loc, categoryId: targetCategoryId } : loc)),
      )
    }
  }

  const handleViewLocation = (location: Location) => {
    setSelectedLocation(location)
    setIsViewDialogOpen(true)
  }

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location)
    setIsEditDialogOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setIsCategoryDialogOpen(true)
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId))
      // Mover lugares a "Ciudades"
      setLocations((prev) =>
        prev.map((loc) => (loc.categoryId === categoryId ? { ...loc, categoryId: "cities" } : loc)),
      )
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        if (editingLocation) {
          setEditingLocation({ ...editingLocation, image: imageUrl })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const saveLocation = () => {
    if (editingLocation) {
      setLocations((prev) => prev.map((loc) => (loc.id === editingLocation.id ? editingLocation : loc)))
      setIsEditDialogOpen(false)
      setEditingLocation(null)
    }
  }

  const createNewLocation = () => {
    const newLocation: Location = {
      id: Date.now().toString(),
      name: "Nuevo Lugar",
      type: "Ciudad",
      region: "Región Central",
      description: "Descripción del lugar...",
      image: "/placeholder.svg?height=200&width=300",
      status: "Próspero",
      categoryId: "cities",
      history: "",
      inhabitants: "",
      government: "",
      economy: "",
      culture: "",
      geography: "",
      climate: "",
      resources: [],
      pointsOfInterest: "",
      dangers: "",
      size: "Mediano",
    }
    setEditingLocation(newLocation)
    setIsNewLocationDialogOpen(true)
  }

  const saveNewLocation = () => {
    if (editingLocation) {
      setLocations((prev) => [...prev, editingLocation])
      setIsNewLocationDialogOpen(false)
      setEditingLocation(null)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Mundo</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
            <Button onClick={createNewLocation}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Lugar
            </Button>
          </div>
        </div>
        <p className="text-gray-600 mt-2">Explora y documenta los lugares de tu mundo fantástico</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryLocations = locations.filter((loc) => loc.categoryId === category.id)
            return (
              <LocationCategory
                key={category.id}
                category={category}
                locations={categoryLocations}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onEditLocation={handleEditLocation}
                onViewLocation={handleViewLocation}
              />
            )
          })}
        </div>
      </DndContext>

      {/* Dialog para ver detalles del lugar */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <div className="w-16 h-12 bg-gray-200 rounded-md overflow-hidden">
                <img
                  src={selectedLocation?.image || "/placeholder.svg?height=48&width=64"}
                  alt={selectedLocation?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span>{selectedLocation?.name}</span>
                <p className="text-sm text-gray-500 font-normal">
                  {selectedLocation?.type} • {selectedLocation?.region}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedLocation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Información Básica</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Tamaño:</strong> {selectedLocation.size}
                    </p>
                    <p>
                      <strong>Estado:</strong> {selectedLocation.status}
                    </p>
                    <p>
                      <strong>Descripción:</strong> {selectedLocation.description}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Historia</h4>
                  <p className="text-sm text-gray-600">{selectedLocation.history}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Habitantes</h4>
                  <p className="text-sm text-gray-600">{selectedLocation.inhabitants}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Gobierno</h4>
                  <p className="text-sm text-gray-600">{selectedLocation.government}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Economía</h4>
                  <p className="text-sm text-gray-600">{selectedLocation.economy}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Recursos</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLocation.resources.map((resource, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Cultura</h4>
                  <p className="text-sm text-gray-600">{selectedLocation.culture}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Geografía</h4>
                  <p className="text-sm text-gray-600">{selectedLocation.geography}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Clima</h4>
                  <p className="text-sm text-gray-600">{selectedLocation.climate}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Lugares de Interés</h4>
                  <p className="text-sm text-gray-600">{selectedLocation.pointsOfInterest}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Peligros</h4>
                  <p className="text-sm text-gray-600">{selectedLocation.dangers}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para editar lugar */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Lugar</DialogTitle>
            <DialogDescription>Modifica la información del lugar</DialogDescription>
          </DialogHeader>
          {editingLocation && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={editingLocation.name}
                      onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Tipo</Label>
                      <Input
                        id="type"
                        value={editingLocation.type}
                        onChange={(e) => setEditingLocation({ ...editingLocation, type: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="region">Región</Label>
                      <Input
                        id="region"
                        value={editingLocation.region}
                        onChange={(e) => setEditingLocation({ ...editingLocation, region: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="size">Tamaño</Label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={editingLocation.size}
                        onChange={(e) => setEditingLocation({ ...editingLocation, size: e.target.value })}
                      >
                        <option>Muy pequeño</option>
                        <option>Pequeño</option>
                        <option>Mediano</option>
                        <option>Grande</option>
                        <option>Muy grande</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="status">Estado</Label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={editingLocation.status}
                        onChange={(e) => setEditingLocation({ ...editingLocation, status: e.target.value })}
                      >
                        <option>Próspero</option>
                        <option>En conflicto</option>
                        <option>Peligroso</option>
                        <option>Hostil</option>
                        <option>Misterioso</option>
                        <option>Abandonado</option>
                        <option>En ruinas</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="image">Imagen del Lugar</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="w-24 h-16 bg-gray-200 rounded-md overflow-hidden">
                        <img
                          src={editingLocation.image || "/placeholder.svg?height=64&width=96"}
                          alt={editingLocation.name}
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
                    <Label htmlFor="description">Descripción</Label>
                    <textarea
                      id="description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                      value={editingLocation.description}
                      onChange={(e) => setEditingLocation({ ...editingLocation, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="history">Historia</Label>
                    <textarea
                      id="history"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                      value={editingLocation.history}
                      onChange={(e) => setEditingLocation({ ...editingLocation, history: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="inhabitants">Habitantes</Label>
                    <textarea
                      id="inhabitants"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                      value={editingLocation.inhabitants}
                      onChange={(e) => setEditingLocation({ ...editingLocation, inhabitants: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="government">Gobierno</Label>
                    <textarea
                      id="government"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-16"
                      value={editingLocation.government}
                      onChange={(e) => setEditingLocation({ ...editingLocation, government: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="economy">Economía</Label>
                    <textarea
                      id="economy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-16"
                      value={editingLocation.economy}
                      onChange={(e) => setEditingLocation({ ...editingLocation, economy: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="culture">Cultura</Label>
                    <textarea
                      id="culture"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-16"
                      value={editingLocation.culture}
                      onChange={(e) => setEditingLocation({ ...editingLocation, culture: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="geography">Geografía</Label>
                    <textarea
                      id="geography"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-16"
                      value={editingLocation.geography}
                      onChange={(e) => setEditingLocation({ ...editingLocation, geography: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="climate">Clima</Label>
                    <textarea
                      id="climate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-16"
                      value={editingLocation.climate}
                      onChange={(e) => setEditingLocation({ ...editingLocation, climate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="resources">Recursos (separados por coma)</Label>
                    <Input
                      id="resources"
                      value={editingLocation.resources.join(", ")}
                      onChange={(e) =>
                        setEditingLocation({
                          ...editingLocation,
                          resources: e.target.value.split(",").map((s) => s.trim()),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="pointsOfInterest">Lugares de Interés</Label>
                  <textarea
                    id="pointsOfInterest"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                    value={editingLocation.pointsOfInterest}
                    onChange={(e) => setEditingLocation({ ...editingLocation, pointsOfInterest: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="dangers">Peligros</Label>
                  <textarea
                    id="dangers"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                    value={editingLocation.dangers}
                    onChange={(e) => setEditingLocation({ ...editingLocation, dangers: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={saveLocation}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para nuevo lugar */}
      <Dialog open={isNewLocationDialogOpen} onOpenChange={setIsNewLocationDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Lugar</DialogTitle>
            <DialogDescription>Añade un nuevo lugar a tu mundo</DialogDescription>
          </DialogHeader>
          {editingLocation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-name">Nombre</Label>
                  <Input
                    id="new-name"
                    value={editingLocation.name}
                    onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="new-type">Tipo</Label>
                  <Input
                    id="new-type"
                    value={editingLocation.type}
                    onChange={(e) => setEditingLocation({ ...editingLocation, type: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="new-region">Región</Label>
                  <Input
                    id="new-region"
                    value={editingLocation.region}
                    onChange={(e) => setEditingLocation({ ...editingLocation, region: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="new-size">Tamaño</Label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={editingLocation.size}
                    onChange={(e) => setEditingLocation({ ...editingLocation, size: e.target.value })}
                  >
                    <option>Muy pequeño</option>
                    <option>Pequeño</option>
                    <option>Mediano</option>
                    <option>Grande</option>
                    <option>Muy grande</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="new-category">Categoría</Label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={editingLocation.categoryId}
                    onChange={(e) => setEditingLocation({ ...editingLocation, categoryId: e.target.value })}
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
                  value={editingLocation.description}
                  onChange={(e) => setEditingLocation({ ...editingLocation, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewLocationDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={saveNewLocation}>
                  <Save className="h-4 w-4 mr-2" />
                  Crear Lugar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
