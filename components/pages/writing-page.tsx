"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Image,
  Save,
  Undo,
  Redo,
  Copy,
  ScissorsIcon as Cut,
  ClipboardPasteIcon as Paste,
  Search,
  Replace,
  FileText,
  Printer,
  Download,
  Plus,
  Minus,
  Eye,
  Settings,
} from "lucide-react"
import { useState, useRef, useEffect, useCallback } from "react"

const chapters = [
  { id: 1, title: "Capítulo 1: El Despertar", wordCount: 2500, status: "Completo" },
  { id: 2, title: "Capítulo 2: La Profecía", wordCount: 1800, status: "En progreso" },
  { id: 3, title: "Capítulo 3: El Viaje Comienza", wordCount: 0, status: "Borrador" },
  { id: 4, title: "Capítulo 4: Los Guardianes", wordCount: 0, status: "Pendiente" },
]

const initialContent = `<div style="text-align: center; margin-bottom: 32px;">
  <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">Capítulo 1: El Despertar</h1>
  <div style="width: 96px; height: 2px; background-color: #d1d5db; margin: 0 auto;"></div>
</div>

<p>El viento susurraba entre las hojas del Gran Roble, llevando consigo los ecos de una profecía olvidada. Lyra despertó con el corazón acelerado, las imágenes del sueño aún vívidas en su mente: dragones de cristal, torres que tocaban las nubes, y una voz que la llamaba por un nombre que no reconocía.</p>

<p>Se incorporó en su cama, observando por la ventana el amanecer que pintaba el cielo de tonos dorados y púrpuras. El pueblo de Valdris comenzaba a despertar, pero algo era diferente. El aire mismo parecía vibrar con una energía desconocida, como si el mundo hubiera cambiado durante la noche.</p>

<p>Un destello de luz azul cruzó el horizonte, seguido de un rugido que hizo temblar las ventanas. Lyra sabía que su vida tranquila había llegado a su fin. La magia había regresado a Aethermoor, y con ella, su destino.</p>

<p>Bajó las escaleras de madera que crujían bajo sus pies descalzos. Su abuela ya estaba en la cocina, preparando el desayuno con movimientos mecánicos, pero sus ojos reflejaban la misma inquietud que Lyra sentía en su pecho.</p>

<p>"¿También lo sentiste, abuela?" preguntó Lyra, acercándose a la ventana de la cocina que daba al jardín trasero.</p>

<p>La anciana asintió lentamente, sin dejar de remover la avena en la olla. "Ha comenzado, niña. Lo que tanto temíamos... y tanto esperábamos."</p>

<p>Lyra frunció el ceño. Su abuela siempre había sido misteriosa, hablando en acertijos sobre el pasado y el futuro, pero nunca había sonado tan seria, tan... asustada.</p>

<p>"¿Qué ha comenzado?" insistió, pero antes de que su abuela pudiera responder, un estruendo sacudió toda la casa.</p>`

export function WritingPage() {
  const [fontSize, setFontSize] = useState(12)
  const [fontFamily, setFontFamily] = useState("Times New Roman")
  const [zoom, setZoom] = useState(100)
  const [content, setContent] = useState(initialContent)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [paragraphCount, setParagraphCount] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [lastSaved, setLastSaved] = useState(new Date())

  const editorRef = useRef<HTMLDivElement>(null)

  // Calcular estadísticas del texto
  const calculateStats = useCallback((htmlContent: string) => {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = htmlContent
    const textContent = tempDiv.textContent || tempDiv.innerText || ""

    const words = textContent
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    const chars = textContent.length
    const paragraphs = htmlContent.split("<p>").length - 1

    setWordCount(words)
    setCharCount(chars)
    setParagraphCount(paragraphs)
  }, [])

  // Actualizar estadísticas cuando cambie el contenido
  useEffect(() => {
    calculateStats(content)
  }, [content, calculateStats])

  // Funciones de formato
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML)
    }
  }

  const handleBold = () => execCommand("bold")
  const handleItalic = () => execCommand("italic")
  const handleUnderline = () => execCommand("underline")
  const handleAlignLeft = () => execCommand("justifyLeft")
  const handleAlignCenter = () => execCommand("justifyCenter")
  const handleAlignRight = () => execCommand("justifyRight")
  const handleAlignJustify = () => execCommand("justifyFull")
  const handleBulletList = () => execCommand("insertUnorderedList")
  const handleNumberedList = () => execCommand("insertOrderedList")
  const handleUndo = () => execCommand("undo")
  const handleRedo = () => execCommand("redo")
  const handleCut = () => execCommand("cut")
  const handleCopy = () => execCommand("copy")
  const handlePaste = () => execCommand("paste")

  const handleFontSize = (size: number) => {
    setFontSize(size)
    if (editorRef.current) {
      editorRef.current.style.fontSize = `${size}pt`
    }
  }

  const handleFontFamily = (family: string) => {
    setFontFamily(family)
    if (editorRef.current) {
      editorRef.current.style.fontFamily = family
    }
  }

  const handleHighlight = () => {
    execCommand("hiliteColor", "#ffff00")
  }

  const handleTextColor = () => {
    execCommand("foreColor", "#000000")
  }

  const handleInsertLink = () => {
    const url = prompt("Ingresa la URL:")
    if (url) {
      execCommand("createLink", url)
    }
  }

  const handleInsertImage = () => {
    const url = prompt("Ingresa la URL de la imagen:")
    if (url) {
      execCommand("insertImage", url)
    }
  }

  const handleSave = () => {
    // Simular guardado
    setLastSaved(new Date())
    localStorage.setItem("chapter-content", content)
    alert("Documento guardado exitosamente")
  }

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      setContent(newContent)
      setIsEditing(true)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    const blob = new Blob([content], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "capitulo-1.html"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSearch = () => {
    const searchTerm = prompt("Buscar:")
    if (searchTerm) {
      const selection = window.getSelection()
      const range = document.createRange()

      if (editorRef.current) {
        const walker = document.createTreeWalker(editorRef.current, NodeFilter.SHOW_TEXT, null)

        let node
        while ((node = walker.nextNode())) {
          const text = node.textContent || ""
          const index = text.toLowerCase().indexOf(searchTerm.toLowerCase())
          if (index !== -1) {
            range.setStart(node, index)
            range.setEnd(node, index + searchTerm.length)
            selection?.removeAllRanges()
            selection?.addRange(range)
            break
          }
        }
      }
    }
  }

  // Auto-guardado cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (isEditing) {
        localStorage.setItem("chapter-content", content)
        setLastSaved(new Date())
        setIsEditing(false)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [content, isEditing])

  // Cargar contenido guardado al montar
  useEffect(() => {
    const savedContent = localStorage.getItem("chapter-content")
    if (savedContent) {
      setContent(savedContent)
    }
  }, [])

  return (
    <div className="flex h-full">
      {/* Área principal del editor */}
      <div className="flex-1 flex flex-col">
        {/* Barra de herramientas superior */}
        <div className="border-b bg-white p-2 space-y-2">
          {/* Primera fila de herramientas */}
          <div className="flex items-center space-x-1">
            {/* Archivo */}
            <div className="flex items-center space-x-1 pr-2 border-r">
              <Button variant="ghost" size="sm" title="Nuevo documento">
                <FileText className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSave} title="Guardar">
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handlePrint} title="Imprimir">
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleExport} title="Exportar">
                <Download className="h-4 w-4" />
              </Button>
            </div>

            {/* Deshacer/Rehacer */}
            <div className="flex items-center space-x-1 pr-2 border-r">
              <Button variant="ghost" size="sm" onClick={handleUndo} title="Deshacer">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleRedo} title="Rehacer">
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            {/* Portapapeles */}
            <div className="flex items-center space-x-1 pr-2 border-r">
              <Button variant="ghost" size="sm" onClick={handleCut} title="Cortar">
                <Cut className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCopy} title="Copiar">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handlePaste} title="Pegar">
                <Paste className="h-4 w-4" />
              </Button>
            </div>

            {/* Buscar */}
            <div className="flex items-center space-x-1 pr-2 border-r">
              <Button variant="ghost" size="sm" onClick={handleSearch} title="Buscar">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" title="Reemplazar">
                <Replace className="h-4 w-4" />
              </Button>
            </div>

            {/* Zoom */}
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))} title="Reducir zoom">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
              <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(200, zoom + 10))} title="Aumentar zoom">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" title="Vista">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Segunda fila de herramientas */}
          <div className="flex items-center space-x-1">
            {/* Fuente */}
            <div className="flex items-center space-x-1 pr-2 border-r">
              <select
                className="px-2 py-1 border border-gray-300 rounded text-sm w-32"
                value={fontFamily}
                onChange={(e) => handleFontFamily(e.target.value)}
              >
                <option>Times New Roman</option>
                <option>Arial</option>
                <option>Calibri</option>
                <option>Georgia</option>
                <option>Verdana</option>
              </select>
              <select
                className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                value={fontSize}
                onChange={(e) => handleFontSize(Number(e.target.value))}
              >
                <option>8</option>
                <option>9</option>
                <option>10</option>
                <option>11</option>
                <option>12</option>
                <option>14</option>
                <option>16</option>
                <option>18</option>
                <option>20</option>
                <option>24</option>
                <option>28</option>
                <option>32</option>
              </select>
            </div>

            {/* Formato de texto */}
            <div className="flex items-center space-x-1 pr-2 border-r">
              <Button variant="ghost" size="sm" onClick={handleBold} title="Negrita">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleItalic} title="Cursiva">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleUnderline} title="Subrayado">
                <Underline className="h-4 w-4" />
              </Button>
              <div
                className="w-6 h-6 bg-yellow-300 rounded border cursor-pointer"
                title="Resaltar"
                onClick={handleHighlight}
              ></div>
              <div
                className="w-6 h-6 bg-black rounded border cursor-pointer"
                title="Color de texto"
                onClick={handleTextColor}
              ></div>
            </div>

            {/* Alineación */}
            <div className="flex items-center space-x-1 pr-2 border-r">
              <Button variant="ghost" size="sm" onClick={handleAlignLeft} title="Alinear izquierda">
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleAlignCenter} title="Centrar">
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleAlignRight} title="Alinear derecha">
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleAlignJustify} title="Justificar">
                <AlignJustify className="h-4 w-4" />
              </Button>
            </div>

            {/* Listas */}
            <div className="flex items-center space-x-1 pr-2 border-r">
              <Button variant="ghost" size="sm" onClick={handleBulletList} title="Lista con viñetas">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleNumberedList} title="Lista numerada">
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>

            {/* Insertar */}
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={handleInsertLink} title="Insertar enlace">
                <Link className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleInsertImage} title="Insertar imagen">
                <Image className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Información del documento */}
        <div className="bg-gray-50 px-6 py-2 border-b text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Capítulo 1: El Despertar</span>
              <span className="mx-2">•</span>
              <span>{wordCount} palabras</span>
              <span className="mx-2">•</span>
              <span>Última edición: {lastSaved.toLocaleTimeString()}</span>
              {isEditing && <span className="mx-2 text-orange-600">• Sin guardar</span>}
            </div>
            <div className="flex items-center space-x-4">
              <span>Página 1 de {Math.ceil(wordCount / 250) || 1}</span>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Área del editor con vista de páginas */}
        <div className="flex-1 bg-gray-100 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Página editable */}
            <Card
              className="w-full bg-white shadow-lg min-h-[842px] relative"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
            >
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="p-16 outline-none"
                style={{
                  fontFamily: fontFamily,
                  fontSize: `${fontSize}pt`,
                  lineHeight: "1.6",
                  textAlign: "justify",
                }}
                dangerouslySetInnerHTML={{ __html: content }}
                onInput={handleContentChange}
                onBlur={handleContentChange}
              />

              {/* Número de página */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-500">1</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Sidebar de capítulos (más compacto) */}
      <div className="w-72 border-l bg-gray-50 p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-800">Capítulos</h3>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className={`p-3 rounded-md cursor-pointer border ${
                chapter.id === 1
                  ? "bg-white border-indigo-200 shadow-sm"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-sm text-gray-800 mb-1">{chapter.title}</div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {chapter.id === 1
                    ? `${wordCount} palabras`
                    : chapter.wordCount > 0
                      ? `${chapter.wordCount} palabras`
                      : "Sin contenido"}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-[10px] ${
                    chapter.status === "Completo"
                      ? "bg-green-100 text-green-700"
                      : chapter.status === "En progreso"
                        ? "bg-yellow-100 text-yellow-700"
                        : chapter.status === "Borrador"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {chapter.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Estadísticas del documento */}
        <div className="mt-6 p-3 bg-white rounded-md border">
          <h4 className="font-medium text-sm text-gray-800 mb-2">Estadísticas</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Palabras:</span>
              <span>{wordCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Caracteres:</span>
              <span>{charCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Párrafos:</span>
              <span>{paragraphCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Páginas:</span>
              <span>{Math.ceil(wordCount / 250) || 1}</span>
            </div>
            <div className="flex justify-between">
              <span>Tiempo de lectura:</span>
              <span>{Math.ceil(wordCount / 200) || 1} min</span>
            </div>
          </div>
        </div>

        {/* Indicador de guardado */}
        <div className="mt-4 p-2 bg-white rounded-md border text-center">
          <div className="text-xs text-gray-500">
            {isEditing ? (
              <span className="text-orange-600">● Cambios sin guardar</span>
            ) : (
              <span className="text-green-600">✓ Guardado automático</span>
            )}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Último guardado: {lastSaved.toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  )
}
