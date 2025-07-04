import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Clock, Pin } from "lucide-react"
import { useEffect, useState } from "react"
import { getNotes } from "@/lib/supabaseApi"

interface NotesPageProps {
  projectId?: string | null
}

export function NotesPage({ projectId }: NotesPageProps) {
  const [notes, setNotes] = useState<any[]>([])

  useEffect(() => {
    setNotes([])
    if (!projectId) return
    getNotes(projectId).then(setNotes)
  }, [projectId])

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
