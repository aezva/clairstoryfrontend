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
import { getProjects } from "@/lib/supabaseApi"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data)
      if (data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(data[0].id)
      }
    })
  }, [])

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardPage onSectionChange={setActiveSection} projectId={selectedProjectId} />
      case "outline":
        return <OutlinePage projectId={selectedProjectId} />
      case "writing":
        return <WritingPage projectId={selectedProjectId} />
      case "characters":
        return <CharactersPage projectId={selectedProjectId} />
      case "world":
        return <WorldPage projectId={selectedProjectId} />
      case "wiki":
        return <WikiPage projectId={selectedProjectId} />
      case "notes":
        return <NotesPage projectId={selectedProjectId} />
      case "settings":
        return <SettingsPage projectId={selectedProjectId} />
      default:
        return <DashboardPage onSectionChange={setActiveSection} projectId={selectedProjectId} />
    }
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="clair-story-theme">
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-950 font-['Inter',sans-serif]">
        <TopBar />
        <div className="flex flex-1">
          <Sidebar currentPage={activeSection} onPageChange={setActiveSection} />
          <main className="flex-1 bg-white dark:bg-gray-900">{renderContent()}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}
