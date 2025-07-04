"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { Sun, Moon, Bell, Check, Clock, Users, FileText, AlertCircle } from "lucide-react"
import { useState } from "react"

// Logo de Clair Story
const LogoClairStory = () => (
  <div className="flex items-center">
    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
      <span className="text-white font-bold text-lg">C</span>
    </div>
    <span className="font-bold text-xl text-gray-800 dark:text-white">Clair Story</span>
  </div>
)

// Datos de notificaciones simuladas
const notifications = [
  {
    id: "1",
    type: "success",
    title: "Capítulo completado",
    message: "Has terminado el Capítulo 2: La Profecía",
    time: "hace 5 minutos",
    read: false,
    icon: <Check className="h-4 w-4" />,
    color: "text-green-600",
  },
  {
    id: "2",
    type: "info",
    title: "Objetivo diario alcanzado",
    message: "¡Felicidades! Has escrito 1,200 palabras hoy",
    time: "hace 2 horas",
    read: false,
    icon: <FileText className="h-4 w-4" />,
    color: "text-blue-600",
  },
  {
    id: "3",
    type: "reminder",
    title: "Recordatorio de escritura",
    message: "Es hora de tu sesión de escritura diaria",
    time: "hace 4 horas",
    read: true,
    icon: <Clock className="h-4 w-4" />,
    color: "text-amber-600",
  },
  {
    id: "4",
    type: "social",
    title: "Nuevo personaje añadido",
    message: "Aria Ventoluna ha sido añadida a tu historia",
    time: "hace 1 día",
    read: true,
    icon: <Users className="h-4 w-4" />,
    color: "text-purple-600",
  },
  {
    id: "5",
    type: "warning",
    title: "Respaldo pendiente",
    message: "No has guardado cambios en 30 minutos",
    time: "hace 2 días",
    read: true,
    icon: <AlertCircle className="h-4 w-4" />,
    color: "text-orange-600",
  },
]

export function TopBar() {
  const { theme, setTheme } = useTheme()
  const [notificationCount, setNotificationCount] = useState(notifications.filter((n) => !n.read).length)

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const markAllAsRead = () => {
    setNotificationCount(0)
  }

  return (
    <div className="w-full h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Logo en la esquina izquierda */}
      <LogoClairStory />

      {/* Controles en la esquina derecha con espaciado uniforme */}
      <div className="flex items-center space-x-4">
        {/* Botón de tema */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          )}
          <span className="sr-only">Cambiar tema</span>
        </Button>

        {/* Notificaciones */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800 relative">
              <Bell className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
              <span className="sr-only">Notificaciones</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 dark:text-white">Notificaciones</h3>
                {notificationCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    Marcar todas como leídas
                  </Button>
                )}
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                    !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`${notification.color} mt-1`}>{notification.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm text-gray-800 dark:text-white">{notification.title}</p>
                        {!notification.read && <div className="h-2 w-2 bg-blue-500 rounded-full"></div>}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {notifications.length === 0 && (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tienes notificaciones</p>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Avatar del usuario */}
        <Avatar className="h-8 w-8">
          <AvatarImage src="/images/avatar2.png" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
