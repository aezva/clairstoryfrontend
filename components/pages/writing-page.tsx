"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Bold,
  Italic,
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
  Edit,
  Underline as UnderlineIcon,
} from "lucide-react"
import { useState, useRef, useEffect, useCallback } from "react"
import { getChapters, createChapter, updateChapter, deleteChapter, updateProject } from "@/lib/supabaseApi"
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import FontSize from '@tiptap/extension-font-size';
import FontFamily from '@tiptap/extension-font-family';

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

interface WritingPageProps {
  projectId?: string | null
}

export function WritingPage({ projectId, projectTitle: initialProjectTitle }: WritingPageProps & { projectTitle?: string }) {
  const [fontSize, setFontSize] = useState(12)
  const [fontFamily, setFontFamily] = useState("Times New Roman")
  const [zoom, setZoom] = useState(100)
  const [content, setContent] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [paragraphCount, setParagraphCount] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [lastSaved, setLastSaved] = useState(new Date())
  const [chapters, setChapters] = useState<any[]>([])
  const [selectedChapter, setSelectedChapter] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [creatingChapter, setCreatingChapter] = useState(false)
  const [newChapterTitle, setNewChapterTitle] = useState("")
  const [viewManuscript, setViewManuscript] = useState(false);
  const [projectTitle, setProjectTitle] = useState(initialProjectTitle || "");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(projectTitle);
  const [titleLoading, setTitleLoading] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sincronizar título si cambia desde props
  useEffect(() => {
    setProjectTitle(initialProjectTitle || "");
    setTitleInput(initialProjectTitle || "");
  }, [initialProjectTitle]);

  // Renombrar proyecto
  const handleRenameProject = async () => {
    if (!projectId || !titleInput.trim() || titleInput === projectTitle) {
      setEditingTitle(false);
      setTitleInput(projectTitle);
      return;
    }
    setTitleLoading(true);
    setTitleError(null);
    try {
      await updateProject(projectId, { title: titleInput.trim() });
      setProjectTitle(titleInput.trim());
      setEditingTitle(false);
    } catch {
      setTitleError("Error al renombrar proyecto");
    } finally {
      setTitleLoading(false);
    }
  };

  // Cargar capítulos al montar o cambiar de proyecto
  useEffect(() => {
    if (!projectId) {
      setChapters([])
      setSelectedChapter(null)
      setContent("")
      return
    }
    setLoading(true)
    getChapters(projectId)
      .then((data) => {
        setChapters(data)
        if (data.length > 0) {
          setSelectedChapter(data[0])
          setContent(data[0].content || "")
        } else {
          setSelectedChapter(null)
          setContent("")
        }
      })
      .catch(() => setError("Error al cargar capítulos"))
      .finally(() => setLoading(false))
  }, [projectId])

  // Calcular estadísticas del texto
  const calculateStats = useCallback((htmlContent: string) => {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = htmlContent
    const textContent = tempDiv.textContent || tempDiv.innerText || ""
    const words = textContent.trim().split(/\s+/).filter((word) => word.length > 0).length
    const chars = textContent.length
    const paragraphs = htmlContent.split("<p>").length - 1
    setWordCount(words)
    setCharCount(chars)
    setParagraphCount(paragraphs)
  }, [])

  useEffect(() => {
    calculateStats(content)
  }, [content, calculateStats])

  // Guardar cambios en el capítulo actual
  const saveChapter = async (newContent: string) => {
    if (!selectedChapter) return
    setIsEditing(true)
    try {
      await updateChapter(selectedChapter.id, { content: newContent })
      setLastSaved(new Date())
      setIsEditing(false)
    } catch {
      setError("Error al guardar el capítulo")
    }
  }

  // Auto-guardado cada 30 segundos
  useEffect(() => {
    if (!selectedChapter) return
    const interval = setInterval(() => {
      if (isEditing) {
        saveChapter(content)
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [content, isEditing, selectedChapter])

  // Cambiar de capítulo
  const handleSelectChapter = (chapter: any) => {
    setSelectedChapter(chapter)
    // Limpiar estilos de dirección embebidos
    let cleanContent = (chapter.content || "").replace(/direction\s*:\s*rtl;?/gi, '').replace(/dir=['"]rtl['"]/gi, 'dir="ltr"');
    if (!cleanContent || cleanContent === '<br>' || cleanContent === '<div><br></div>') cleanContent = '<span style="opacity:0">_</span>';
    setContent(cleanContent)
    setError(null)
  }

  // Crear capítulo
  const handleCreateChapter = async () => {
    if (!projectId || !newChapterTitle.trim()) return
    setLoading(true)
    try {
      const newChap = await createChapter({ project_id: projectId, title: newChapterTitle.trim(), content: "", order_num: chapters.length + 1 })
      const updated = await getChapters(projectId)
      setChapters(updated)
      setSelectedChapter(newChap)
      setContent("")
      setNewChapterTitle("")
      setCreatingChapter(false)
    } catch {
      setError("Error al crear capítulo")
    } finally {
      setLoading(false)
    }
  }

  // Eliminar capítulo
  const handleDeleteChapter = async (chapterId: string) => {
    if (!window.confirm("¿Seguro que quieres eliminar este capítulo?")) return
    setLoading(true)
    try {
      await deleteChapter(chapterId)
      const updated = await getChapters(projectId)
      setChapters(updated)
      if (updated.length > 0) {
        setSelectedChapter(updated[0])
        setContent(updated[0].content || "")
      } else {
        setSelectedChapter(null)
        setContent("")
      }
    } catch {
      setError("Error al eliminar capítulo")
    } finally {
      setLoading(false)
    }
  }

  // Reemplazar handlers de formato por comandos TipTap
  const handleBold = () => tiptap?.chain().focus().toggleBold().run();
  const handleItalic = () => tiptap?.chain().focus().toggleItalic().run();
  const handleUnderline = () => tiptap?.chain().focus().toggleUnderline().run();
  const handleAlignLeft = () => tiptap?.chain().focus().setTextAlign('left').run();
  const handleAlignCenter = () => tiptap?.chain().focus().setTextAlign('center').run();
  const handleAlignRight = () => tiptap?.chain().focus().setTextAlign('right').run();
  const handleAlignJustify = () => tiptap?.chain().focus().setTextAlign('justify').run();
  const handleBulletList = () => tiptap?.chain().focus().toggleBulletList().run();
  const handleNumberedList = () => tiptap?.chain().focus().toggleOrderedList().run();
  const handleUndo = () => tiptap?.chain().focus().undo().run();
  const handleRedo = () => tiptap?.chain().focus().redo().run();
  const handleHighlight = () => tiptap?.chain().focus().toggleHighlight().run();
  const handleTextColor = () => tiptap?.chain().focus().setColor('#000000').run();
  const handleInsertLink = () => {
    const url = prompt('Ingresa la URL:');
    if (url) tiptap?.chain().focus().setLink({ href: url }).run();
  };
  const handleInsertImage = () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url) tiptap?.chain().focus().setImage({ src: url }).run();
  };

  // 4. Handlers de fuente y tamaño SOLO usan TipTap
  const handleFontSize = (size: number) => {
    tiptap?.chain().focus().setFontSize(`${size}pt`).run();
  };
  const handleFontFamily = (family: string) => {
    tiptap?.chain().focus().setFontFamily(family).run();
  };

  // Guardar manualmente
  const handleSave = () => {
    saveChapter(content)
    alert("Documento guardado exitosamente")
  }

  // Cambios en el editor
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

      if (tiptap) {
        const walker = document.createTreeWalker(tiptap.view.dom, NodeFilter.SHOW_TEXT, null)

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

  // Drag & drop handlers
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = chapters.findIndex((c) => c.id === active.id);
      const newIndex = chapters.findIndex((c) => c.id === over.id);
      const newOrder = arrayMove(chapters, oldIndex, newIndex);
      setChapters(newOrder);
      // Actualizar orden en Supabase
      for (let i = 0; i < newOrder.length; i++) {
        await updateChapter(newOrder[i].id, { order_num: i + 1 });
      }
    }
  };

  // Sortable capítulo
  function SortableChapter({ chapter, selected, onSelect, onDelete }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: chapter.id });
    return (
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.5 : 1,
        }}
        className={`p-3 rounded-md cursor-pointer border ${selected ? "bg-white border-indigo-200 shadow-sm" : "bg-white border-gray-200 hover:border-gray-300"}`}
        onClick={() => onSelect(chapter)}
        {...attributes}
        {...listeners}
      >
        <div className="font-medium text-sm text-gray-800 mb-1 flex justify-between items-center">
          <span>{chapter.title}</span>
          <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); onDelete(chapter.id) }} title="Eliminar capítulo">
            <Minus className="h-3 w-3 text-red-500" />
          </Button>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{chapter.content ? `${chapter.content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length} palabras` : "Sin contenido"}</span>
        </div>
      </div>
    );
  }

  // Renderizar contenido del manuscrito
  const renderManuscript = () => (
    <div className="flex flex-col gap-8">
      {chapters.map((chapter, idx) => (
        <div key={chapter.id} className="bg-white dark:bg-gray-900 shadow-lg border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">{chapter.title}</h2>
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: chapter.content || "" }} />
        </div>
      ))}
    </div>
  );

  // Editor TipTap
  const tiptap = useEditor({
    extensions: [
      StarterKit,
      Underline,
      LinkExtension,
      ImageExtension,
      Highlight,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      FontSize,
      FontFamily,
    ],
    content: content || '',
    editable: !!selectedChapter,
    editorProps: {
      attributes: {
        style: `font-family: ${fontFamily}; font-size: ${fontSize}pt;`,
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
      setIsEditing(true);
    },
  });

  // Sincronizar TipTap cuando cambia el capítulo
  useEffect(() => {
    if (tiptap && selectedChapter) {
      tiptap.commands.setContent(selectedChapter.content || '');
      tiptap.setEditable(true);
    } else if (tiptap) {
      tiptap.commands.setContent('');
      tiptap.setEditable(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChapter]);

  useEffect(() => {
    if (tiptap && !viewManuscript && selectedChapter) {
      tiptap.commands.setContent(selectedChapter.content || '');
      tiptap.setEditable(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewManuscript]);

  // 1. Obtener estado de la selección de TipTap
  const isBold = tiptap?.isActive('bold') || false;
  const isItalic = tiptap?.isActive('italic') || false;
  const isUnderline = tiptap?.isActive('underline') || false;
  const isHighlight = tiptap?.isActive('highlight') || false;
  const isBulletList = tiptap?.isActive('bulletList') || false;
  const isOrderedList = tiptap?.isActive('orderedList') || false;
  const align = tiptap?.isActive({ textAlign: 'center' }) ? 'center' : tiptap?.isActive({ textAlign: 'right' }) ? 'right' : tiptap?.isActive({ textAlign: 'justify' }) ? 'justify' : 'left';
  const currentFontFamily = tiptap?.getAttributes('textStyle').fontFamily || fontFamily;
  const currentFontSize = parseInt((tiptap?.getAttributes('textStyle').fontSize || '').replace('pt', '')) || fontSize;

  return (
    <div className="flex h-full">
      {/* Área principal del editor */}
      <div className="flex-1 flex flex-col items-center">
        {/* Barra de herramientas centrada */}
        <div className="border-b bg-white dark:bg-gray-900 p-2 space-y-2 w-full flex justify-center">
          <div className="w-[21cm] max-w-full flex flex-col items-center">
            {/* Título editable del proyecto */}
            <div className="text-center mb-2 flex flex-col items-center">
              {editingTitle ? (
                <div className="flex gap-2 items-center">
                  <input
                    className="text-xl font-bold text-gray-800 dark:text-gray-100 border rounded px-2 py-1"
                    value={titleInput}
                    onChange={e => setTitleInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleRenameProject(); if (e.key === 'Escape') { setEditingTitle(false); setTitleInput(projectTitle); } }}
                    autoFocus
                    disabled={titleLoading}
                  />
                  <Button size="sm" onClick={handleRenameProject} disabled={titleLoading || !titleInput.trim()}>
                    Guardar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setEditingTitle(false); setTitleInput(projectTitle); }} disabled={titleLoading}>
                    Cancelar
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <span className="text-xl font-bold text-gray-800 dark:text-gray-100">{projectTitle || "Sin título"}</span>
                  <Button size="sm" variant="ghost" onClick={() => setEditingTitle(true)} title="Renombrar proyecto">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {titleError && <div className="text-xs text-red-500 mt-1">{titleError}</div>}
              {/* Nombre del capítulo actual o manuscrito */}
              <div className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                {viewManuscript ? "Manuscrito completo" : (selectedChapter ? selectedChapter.title : "Sin capítulo")}
              </div>
            </div>
            {/* Primera fila de herramientas */}
            <div className="flex items-center space-x-1 justify-center">
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
            <div className="flex items-center space-x-1 justify-center mt-2">
              {/* Fuente */}
              <div className="flex items-center space-x-1 pr-2 border-r">
                <select
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-32"
                  value={currentFontFamily}
                  onChange={(e) => handleFontFamily(e.target.value)}
                  disabled={!selectedChapter}
                >
                  <option>Times New Roman</option>
                  <option>Arial</option>
                  <option>Calibri</option>
                  <option>Georgia</option>
                  <option>Verdana</option>
                </select>
                <select
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                  value={currentFontSize}
                  onChange={(e) => handleFontSize(Number(e.target.value))}
                  disabled={!selectedChapter}
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
                <Button variant={isBold ? "secondary" : "ghost"} size="sm" onClick={handleBold} title="Negrita" disabled={!selectedChapter}>
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant={isItalic ? "secondary" : "ghost"} size="sm" onClick={handleItalic} title="Cursiva" disabled={!selectedChapter}>
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant={isUnderline ? "secondary" : "ghost"} size="sm" onClick={handleUnderline} title="Subrayado" disabled={!selectedChapter}>
                  <UnderlineIcon className="h-4 w-4" />
                </Button>
                <div
                  className={`w-6 h-6 rounded border cursor-pointer ${isHighlight ? 'ring-2 ring-yellow-400 bg-yellow-300' : 'bg-yellow-300'}`}
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
                <Button variant={align === 'left' ? "secondary" : "ghost"} size="sm" onClick={handleAlignLeft} title="Alinear izquierda" disabled={!selectedChapter}>
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button variant={align === 'center' ? "secondary" : "ghost"} size="sm" onClick={handleAlignCenter} title="Centrar" disabled={!selectedChapter}>
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button variant={align === 'right' ? "secondary" : "ghost"} size="sm" onClick={handleAlignRight} title="Alinear derecha" disabled={!selectedChapter}>
                  <AlignRight className="h-4 w-4" />
                </Button>
                <Button variant={align === 'justify' ? "secondary" : "ghost"} size="sm" onClick={handleAlignJustify} title="Justificar" disabled={!selectedChapter}>
                  <AlignJustify className="h-4 w-4" />
                </Button>
              </div>

              {/* Listas */}
              <div className="flex items-center space-x-1 pr-2 border-r">
                <Button variant={isBulletList ? "secondary" : "ghost"} size="sm" onClick={handleBulletList} title="Lista con viñetas" disabled={!selectedChapter}>
                  <List className="h-4 w-4" />
                </Button>
                <Button variant={isOrderedList ? "secondary" : "ghost"} size="sm" onClick={handleNumberedList} title="Lista numerada" disabled={!selectedChapter}>
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
        </div>

        {/* Información del documento */}
        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-2 border-b text-sm text-gray-600 dark:text-gray-300 w-full flex justify-center">
          <div className="w-[21cm] max-w-full">
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
        </div>

        {/* Área del editor con vista de páginas */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-950 p-6 overflow-auto w-full flex justify-center">
          <div className="w-[21cm] max-w-full flex flex-col items-center">
            <Card
              className="bg-white dark:bg-gray-900 shadow-lg relative mx-auto border-none"
              style={{
                width: '21cm',
                minHeight: '29.7cm',
                maxWidth: '100%',
                margin: '0 auto',
                padding: 0,
                boxSizing: 'border-box',
              }}
            >
              {viewManuscript ? (
                <div className="p-16 prose dark:prose-invert max-w-none" style={{ minHeight: '24.7cm' }}>{renderManuscript()}</div>
              ) : (
                <div style={{ margin: '2.5cm', minHeight: '24.7cm' }}>
                  <EditorContent
                    editor={tiptap}
                    className="tiptap-editor"
                    style={{
                      lineHeight: '1.6',
                      textAlign: 'left',
                      background: !selectedChapter ? '#f3f4f6' : 'inherit',
                      color: !selectedChapter ? '#a0aec0' : 'inherit',
                      cursor: !selectedChapter ? 'not-allowed' : undefined,
                      borderRadius: '0.5rem',
                      transition: 'background 0.2s, color 0.2s',
                    }}
                  />
                </div>
              )}
              {!selectedChapter && !viewManuscript && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg font-medium pointer-events-none">
                  Crea un capítulo para comenzar a escribir
                </div>
              )}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400">1</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Sidebar de capítulos (más compacto) */}
      <div className="w-72 border-l bg-gray-50 p-4">
        {/* Botón Manuscrito arriba de todo */}
        <div className="mb-4 flex flex-col gap-2 items-center">
          <Button variant={viewManuscript ? "secondary" : "ghost"} size="sm" onClick={() => setViewManuscript(!viewManuscript)}>
            Manuscrito
          </Button>
          {/* Título editable del proyecto encima de capítulos */}
          <div className="text-center text-lg font-bold text-gray-800 dark:text-gray-100">
            {editingTitle ? (
              <div className="flex gap-2 items-center justify-center">
                <input
                  className="text-lg font-bold text-gray-800 dark:text-gray-100 border rounded px-2 py-1"
                  value={titleInput}
                  onChange={e => setTitleInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleRenameProject(); if (e.key === 'Escape') { setEditingTitle(false); setTitleInput(projectTitle); } }}
                  autoFocus
                  disabled={titleLoading}
                />
                <Button size="sm" onClick={handleRenameProject} disabled={titleLoading || !titleInput.trim()}>
                  Guardar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setEditingTitle(false); setTitleInput(projectTitle); }} disabled={titleLoading}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 items-center justify-center">
                <span>{projectTitle || "Sin título"}</span>
                <Button size="sm" variant="ghost" onClick={() => setEditingTitle(true)} title="Renombrar proyecto">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            )}
            {titleError && <div className="text-xs text-red-500 mt-1">{titleError}</div>}
          </div>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={chapters.map(c => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {chapters.length === 0 && <div className="text-gray-400 text-sm">No hay capítulos aún.</div>}
              {chapters.map((chapter) => (
                <SortableChapter
                  key={chapter.id}
                  chapter={chapter}
                  selected={selectedChapter?.id === chapter.id && !viewManuscript}
                  onSelect={() => { setViewManuscript(false); handleSelectChapter(chapter); }}
                  onDelete={handleDeleteChapter}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

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
          {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
        </div>
      </div>
    </div>
  )
}
