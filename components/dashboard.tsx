"use client"

import { useState } from "react"
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

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardPage onSectionChange={setActiveSection} />
      case "outline":
        return <OutlinePage />
      case "writing":
        return <WritingPage />
      case "characters":
        return <CharactersPage />
      case "world":
        return <WorldPage />
      case "wiki":
        return <WikiPage />
      case "notes":
        return <NotesPage />
      case "settings":
        return <SettingsPage />
      default:
        return <DashboardPage onSectionChange={setActiveSection} />
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
