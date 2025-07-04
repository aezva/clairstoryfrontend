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
import { useEffect } from "react"
import { getProjects, createProject, updateProject, deleteProject as deleteProjectApi } from "@/lib/supabaseApi"

interface Project {
  id: string
  name?: string
  title?: string
  description?: string
  createdAt?: string
  created_at?: string
}

interface SidebarProps {
  onPageChange: (page: string) => void
  currentPage: string
  projects: Project[]
  currentProject: Project | null
  onProjectSelect: (project: Project) => void
  onNewProject: (name?: string) => void
  refreshProjects: (selectId?: string) => Promise<void>
}

export function Sidebar({ onPageChange, currentPage, projects, currentProject, onProjectSelect, onNewProject, refreshProjects }: SidebarProps) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [renamingProject, setRenamingProject] = useState<Project | null>(null)
  const [newProjectName, setNewProjectName] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newProjectInput, setNewProjectInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleProjectSelect = (project: Project) => {
    onProjectSelect(project)
    setIsDropdownOpen(false)
  }

  const handleRenameProject = (project: Project) => {
    setRenamingProject(project)
    setNewProjectName(project.name || project.title || "")
    setIsRenameDialogOpen(true)
  }

  const handleSaveRename = async () => {
    if (renamingProject && newProjectName.trim()) {
      setLoading(true)
      try {
        await updateProject(renamingProject.id, { title: newProjectName.trim() })
        setIsRenameDialogOpen(false)
        setRenamingProject(null)
        setNewProjectName("")
        await refreshProjects(renamingProject.id)
        onProjectSelect({ ...renamingProject, name: newProjectName.trim(), title: newProjectName.trim() })
      } catch (e) {
        setError("Error al renombrar proyecto")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDuplicateProject = async (project: Project) => {
    setLoading(true)
    try {
      const newProj = await createProject({ title: `${project.name || project.title} (Copia)`, description: project.description || "" })
      await refreshProjects(newProj.id)
      onProjectSelect(newProj)
    } catch (e) {
      setError("Error al duplicar proyecto")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("¿Seguro que quieres eliminar este proyecto? Esta acción no se puede deshacer.")) return
    setLoading(true)
    try {
      await deleteProjectApi(projectId)
      await refreshProjects()
      onProjectSelect(null as any)
    } catch (e) {
      setError("Error al eliminar proyecto")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async () => {
    if (newProjectInput.trim()) {
      setLoading(true)
      try {
        const newProj = await createProject({ title: newProjectInput.trim(), description: "" })
        setNewProjectInput("")
        setIsCreating(false)
        setIsDropdownOpen(false)
        await refreshProjects(newProj.id)
        onProjectSelect(newProj)
      } catch (e) {
        setError("Error al crear proyecto")
      } finally {
        setLoading(false)
      }
    }
  }

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

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header con selector de proyecto */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2 h-auto" title={currentProject?.name || currentProject?.title || "Sin proyecto"}>
              <div className="text-left w-full">
                <div className="font-semibold text-sm truncate w-full" style={{maxWidth:'180px'}}>{currentProject?.name || currentProject?.title || "Sin proyecto"}</div>
                <div className="text-xs text-gray-500">Proyecto actual</div>
              </div>
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 flex flex-col justify-between min-h-[300px] max-h-[400px]" align="start">
            <div className="p-2 flex-1 overflow-y-auto">
              <div className="text-xs font-medium text-gray-500 mb-2">PROYECTOS</div>
              {loading && <div className="text-xs text-blue-500 mb-2">Cargando...</div>}
              {error && <div className="text-xs text-red-500 mb-2">{error}</div>}
              {projects.length === 0 && !loading && <div className="text-xs text-gray-400">No tienes proyectos aún.</div>}
              {projects.map((project) => (
                <div key={project.id} className="flex items-center justify-between group">
                  <Button
                    variant="ghost"
                    className={`flex-1 justify-start text-left p-2 ${currentProject?.id === project.id ? "bg-gray-100 dark:bg-gray-700 font-semibold" : ""}`}
                    onClick={() => handleProjectSelect(project)}
                    title={project.name || project.title}
                  >
                    <div>
                      <div className="text-sm truncate max-w-[140px]">{project.name || project.title}</div>
                      <div className="text-xs text-gray-500">{project.createdAt || project.created_at}</div>
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
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
            {/* Formulario de creación abajo */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              {isCreating ? (
                <div className="flex flex-col gap-2 mt-2">
                  <Input
                    autoFocus
                    value={newProjectInput}
                    onChange={e => setNewProjectInput(e.target.value)}
                    placeholder="Nombre del proyecto"
                    className="flex-1"
                    onKeyDown={e => { if (e.key === 'Enter') handleCreateProject() }}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleCreateProject} disabled={loading}>
                      Crear
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setIsCreating(false); setNewProjectInput("") }} disabled={loading}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="ghost" className="w-full justify-start mt-2" onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Proyecto
                </Button>
              )}
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

      {/* Dialogo para renombrar */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renombrar Proyecto</DialogTitle>
          </DialogHeader>
          <Input
            value={newProjectName}
            onChange={e => setNewProjectName(e.target.value)}
            placeholder="Nuevo nombre"
            onKeyDown={e => { if (e.key === 'Enter') handleSaveRename() }}
          />
          <DialogFooter>
            <Button onClick={handleSaveRename}>Guardar</Button>
            <Button variant="ghost" onClick={() => setIsRenameDialogOpen(false)}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
