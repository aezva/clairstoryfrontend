"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Home,
  PenTool,
  Users,
  Globe,
  BookOpen,
  StickyNote,
  Settings,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Plus,
  FileText,
} from "lucide-react"

interface Project {
  id: string
  name: string
  createdAt: string
}

interface SidebarProps {
  onPageChange: (page: string) => void
  currentPage: string
}

const initialProjects: Project[] = [
  { id: "1", name: "Las Crónicas de Aethermoor", createdAt: "2024-01-15" },
  { id: "2", name: "El Reino Perdido", createdAt: "2024-01-10" },
  { id: "3", name: "Dragones del Norte", createdAt: "2024-01-05" },
]

export function Sidebar({ onPageChange, currentPage }: SidebarProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [currentProject, setCurrentProject] = useState<Project>(projects[0])
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [renamingProject, setRenamingProject] = useState<Project | null>(null)
  const [newProjectName, setNewProjectName] = useState("")

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "writing", label: "Escritura", icon: PenTool },
    { id: "outline", label: "Escaleta", icon: FileText },
    { id: "characters", label: "Personajes", icon: Users },
    { id: "world", label: "Mundo", icon: Globe },
    { id: "wiki", label: "Wiki", icon: BookOpen },
    { id: "notes", label: "Notas", icon: StickyNote },
    { id: "settings", label: "Configuración", icon: Settings },
  ]

  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project)
  }

  const handleRenameProject = (project: Project) => {
    setRenamingProject(project)
    setNewProjectName(project.name)
    setIsRenameDialogOpen(true)
  }

  const handleDuplicateProject = (project: Project) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: `${project.name} (Copia)`,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setProjects((prev) => [...prev, newProject])
  }

  const handleDeleteProject = (projectId: string) => {
    if (projects.length <= 1) {
      alert("No puedes eliminar el último proyecto")
      return
    }

    if (confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId))
      if (currentProject.id === projectId) {
        setCurrentProject(projects.find((p) => p.id !== projectId) || projects[0])
      }
    }
  }

  const handleSaveRename = () => {
    if (renamingProject && newProjectName.trim()) {
      setProjects((prev) => prev.map((p) => (p.id === renamingProject.id ? { ...p, name: newProjectName.trim() } : p)))
      if (currentProject.id === renamingProject.id) {
        setCurrentProject({ ...currentProject, name: newProjectName.trim() })
      }
    }
    setIsRenameDialogOpen(false)
    setRenamingProject(null)
    setNewProjectName("")
  }

  const handleNewProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "Nuevo Proyecto",
      createdAt: new Date().toISOString().split("T")[0],
    }
    setProjects((prev) => [...prev, newProject])
    setCurrentProject(newProject)
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header con selector de proyecto */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2 h-auto">
              <div className="text-left">
                <div className="font-semibold text-sm truncate">{currentProject.name}</div>
                <div className="text-xs text-gray-500">Proyecto actual</div>
              </div>
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="start">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-2">PROYECTOS</div>
              {projects.map((project) => (
                <div key={project.id} className="flex items-center justify-between group">
                  <Button
                    variant="ghost"
                    className={`flex-1 justify-start text-left p-2 ${
                      currentProject.id === project.id ? "bg-gray-100 dark:bg-gray-700 font-semibold" : ""
                    }`}
                    onClick={() => handleProjectSelect(project)}
                  >
                    <div>
                      <div className="text-sm truncate">{project.name}</div>
                      <div className="text-xs text-gray-500">{project.createdAt}</div>
                    </div>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleRenameProject(project)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Renombrar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateProject(project)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600"
                        disabled={projects.length <= 1}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
              <Button variant="ghost" className="w-full justify-start mt-2" onClick={handleNewProject}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Proyecto
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Button
                variant={currentPage === item.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onPageChange(item.id)}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">Usuario</div>
            <div className="text-xs text-gray-500">Escritor</div>
          </div>
        </div>
      </div>

      {/* Dialog para renombrar proyecto */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renombrar Proyecto</DialogTitle>
            <DialogDescription>Ingresa el nuevo nombre para tu proyecto</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="project-name">Nombre del proyecto</Label>
            <Input
              id="project-name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Nombre del proyecto"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveRename}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
