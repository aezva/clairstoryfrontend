"use client"

import { useEffect, useState } from "react"
import { ThemeProvider } from "./theme-provider"
import { TopBar } from "./top-bar"
import { Sidebar } from "./sidebar"
import { WritingPage } from "./pages/writing-page"
import { CharactersPage } from "./pages/characters-page"
import { WorldPage } from "./pages/world-page"
import { WikiPage } from "./pages/wiki-page"
import { NotesPage } from "./pages/notes-page"
import { SettingsPage } from "./pages/settings-page"
import { DashboardPage } from "./pages/dashboard-page"
import { OutlinePage } from "./pages/outline-page"
import { getProjects, createProject } from "@/lib/supabaseApi"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [projects, setProjects] = useState<any[]>([])
  const [currentProject, setCurrentProject] = useState<any | null>(null)

  // Centralizar refresco de proyectos
  const refreshProjects = async (selectId?: string) => {
    const updatedProjects = await getProjects()
    setProjects(updatedProjects)
    if (updatedProjects.length === 0) {
      setCurrentProject(null)
    } else {
      let selected = updatedProjects[0]
      if (selectId) {
        const found = updatedProjects.find((p: any) => p.id === selectId)
        if (found) selected = found
      }
      setCurrentProject(selected)
    }
  }

  useEffect(() => {
    refreshProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleProjectSelect = (project: any) => {
    setCurrentProject(project)
    setActiveSection("dashboard")
  }

  const handleNewProject = async (name?: string) => {
    await createProject({ title: name || "Nuevo Proyecto", description: "" })
    await refreshProjects()
    setActiveSection("dashboard")
  }

  const renderContent = () => {
    if (!currentProject) return null
    switch (activeSection) {
      case "dashboard":
        return <DashboardPage onSectionChange={setActiveSection} projectId={currentProject.id} />
      case "outline":
        return <OutlinePage projectId={currentProject.id} />
      case "writing":
        return <WritingPage projectId={currentProject.id} />
      case "characters":
        return <CharactersPage projectId={currentProject.id} />
      case "world":
        return <WorldPage projectId={currentProject.id} />
      case "wiki":
        return <WikiPage projectId={currentProject.id} />
      case "notes":
        return <NotesPage projectId={currentProject.id} />
      case "settings":
        return <SettingsPage projectId={currentProject.id} />
      default:
        return <DashboardPage onSectionChange={setActiveSection} projectId={currentProject.id} />
    }
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="clair-story-theme">
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-950 font-['Inter',sans-serif]">
        <TopBar />
        <div className="flex flex-1">
          <Sidebar
            currentPage={activeSection}
            onPageChange={setActiveSection}
            projects={projects}
            currentProject={currentProject}
            onProjectSelect={handleProjectSelect}
            onNewProject={handleNewProject}
            refreshProjects={refreshProjects}
          />
          <main className="flex-1 bg-white dark:bg-gray-900">{renderContent()}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}
