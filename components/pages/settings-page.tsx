import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Download, Save, Trash2 } from "lucide-react"

interface SettingsPageProps {
  projectId?: string | null
}

export function SettingsPage({ projectId }: SettingsPageProps) {
  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Ajustes del Proyecto</h1>
        <p className="text-gray-600 mt-2">Configura las opciones de tu proyecto</p>
      </div>

      <div className="space-y-6">
        {/* Información del Proyecto */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información del Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="project-title">Título del Proyecto</Label>
              <Input id="project-title" defaultValue="El Reino de Aethermoor" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="project-description">Descripción</Label>
              <Input
                id="project-description"
                defaultValue="Una épica historia de fantasía sobre el despertar de la magia"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="author">Autor</Label>
              <Input id="author" defaultValue="John Doe" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="genre">Género</Label>
              <Input id="genre" defaultValue="Fantasía Épica" className="mt-1" />
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Escritura */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configuración de Escritura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Objetivo de palabras diario</Label>
                <p className="text-sm text-gray-500">Establece tu meta de escritura diaria</p>
              </div>
              <Input type="number" defaultValue="1000" className="w-24" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Recordatorios de escritura</Label>
                <p className="text-sm text-gray-500">Recibe notificaciones para mantener tu rutina</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Autoguardado</Label>
                <p className="text-sm text-gray-500">Guarda automáticamente cada 5 minutos</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Apariencia */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Apariencia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Modo oscuro</Label>
                <p className="text-sm text-gray-500">Cambia entre tema claro y oscuro</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Tamaño de fuente del editor</Label>
                <p className="text-sm text-gray-500">Ajusta el tamaño del texto en el editor</p>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm" defaultValue="Mediano">
                <option>Pequeño</option>
                <option>Mediano</option>
                <option>Grande</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Exportación y Respaldo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Exportación y Respaldo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Respaldo automático</Label>
                <p className="text-sm text-gray-500">Crea respaldos automáticos en la nube</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar como PDF
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar como DOCX
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar como EPUB
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Zona de Peligro */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-lg text-red-700">Zona de Peligro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-red-700">Eliminar Proyecto</Label>
                <p className="text-sm text-red-500">Esta acción no se puede deshacer</p>
              </div>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline">Cancelar</Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  )
}
