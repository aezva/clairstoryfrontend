import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Clock, Pin } from "lucide-react"

const notes = [
  {
    id: 1,
    title: "Ideas para el Capítulo 5",
    content:
      "Lyra descubre la verdad sobre su linaje. Posible confrontación con Theron sobre ocultar información. Introducir el concepto de los Guardianes Antiguos.",
    createdAt: "hace 2 horas",
    pinned: true,
    color: "bg-yellow-100",
  },
  {
    id: 2,
    title: "Desarrollo de Zephyr",
    content:
      "El dragón necesita más profundidad emocional. Quizás una conexión personal con la familia de Lyra. ¿Conoció a sus padres?",
    createdAt: "hace 1 día",
    pinned: false,
    color: "bg-blue-100",
  },
  {
    id: 3,
    title: "Sistema de Magia",
    content:
      "Definir mejor las limitaciones de la magia de cristal. ¿Qué costo tiene para el usuario? ¿Cómo se recargan los cristales?",
    createdAt: "hace 2 días",
    pinned: true,
    color: "bg-purple-100",
  },
  {
    id: 4,
    title: "Geografía de Aethermoor",
    content:
      "Crear mapa detallado. Distancias entre ciudades, clima de cada región, recursos naturales. El Bosque Susurrante está al este de Valdris.",
    createdAt: "hace 3 días",
    pinned: false,
    color: "bg-green-100",
  },
  {
    id: 5,
    title: "Motivaciones de Malachar",
    content:
      "¿Por qué busca controlar la magia? Trasfondo personal - quizás perdió a alguien importante por falta de poder mágico.",
    createdAt: "hace 5 días",
    pinned: false,
    color: "bg-red-100",
  },
  {
    id: 6,
    title: "Diálogos pendientes",
    content:
      "Conversación entre Lyra y Eldrin sobre la responsabilidad del poder. Aria contando sobre su herencia mixta.",
    createdAt: "hace 1 semana",
    pinned: false,
    color: "bg-pink-100",
  },
]

interface NotesPageProps {
  projectId?: string | null
}

export function NotesPage({ projectId }: NotesPageProps) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Notas</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Nota
          </Button>
        </div>
        <p className="text-gray-600 mt-2">Captura ideas rápidas y pensamientos sobre tu historia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <Card
            key={note.id}
            className={`${note.color} border-0 hover:shadow-md transition-shadow cursor-pointer relative`}
          >
            {note.pinned && (
              <div className="absolute top-3 right-3">
                <Pin className="h-4 w-4 text-gray-600" />
              </div>
            )}
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-gray-800 pr-6">{note.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-700 leading-relaxed mb-3 line-clamp-4">{note.content}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>{note.createdAt}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
