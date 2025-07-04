"use client";
import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import FontSize from "@tiptap/extension-font-size";
import FontFamily from "@tiptap/extension-font-family";
import { getChapters, createChapter, updateChapter, deleteChapter, updateProject } from "@/lib/supabaseApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Save, Undo, Redo, Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link, Image, Highlighter } from "lucide-react";

interface ManuscriptPageProps {
  projectId?: string | null;
  projectTitle?: string;
}

export default function ManuscriptPage({ projectId, projectTitle: initialProjectTitle }: ManuscriptPageProps) {
  const [fontSize, setFontSize] = useState(12);
  const [fontFamily, setFontFamily] = useState("Times New Roman");
  const [content, setContent] = useState("");
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar capítulos al montar o cambiar de proyecto
  useEffect(() => {
    if (!projectId) {
      setChapters([]);
      setSelectedChapter(null);
      setContent("");
      return;
    }
    setLoading(true);
    getChapters(projectId)
      .then((data) => {
        setChapters(data);
        if (data.length > 0) {
          setSelectedChapter(data[0]);
          setContent(data[0].content || "");
        } else {
          setSelectedChapter(null);
          setContent("");
        }
      })
      .catch(() => setError("Error al cargar capítulos"))
      .finally(() => setLoading(false));
  }, [projectId]);

  // Guardar cambios en el capítulo actual
  const saveChapter = async (newContent: string) => {
    if (!selectedChapter) return;
    setIsEditing(true);
    try {
      await updateChapter(selectedChapter.id, { content: newContent });
      setLastSaved(new Date());
      setIsEditing(false);
    } catch {
      setError("Error al guardar el capítulo");
    }
  };

  // Auto-guardado cada 30 segundos
  useEffect(() => {
    if (!selectedChapter) return;
    const interval = setInterval(() => {
      if (isEditing) {
        saveChapter(content);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [content, isEditing, selectedChapter]);

  // Cambiar de capítulo
  const handleSelectChapter = (chapter: any) => {
    setSelectedChapter(chapter);
    setContent(chapter.content || "");
    setError(null);
  };

  // Crear capítulo
  const handleCreateChapter = async () => {
    if (!projectId || !newChapterTitle.trim()) return;
    setLoading(true);
    try {
      const newChap = await createChapter({ project_id: projectId, title: newChapterTitle.trim(), content: "", order_num: chapters.length + 1 });
      const updated = await getChapters(projectId);
      setChapters(updated);
      setSelectedChapter(newChap);
      setContent("");
      setNewChapterTitle("");
    } catch {
      setError("Error al crear capítulo");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar capítulo
  const handleDeleteChapter = async (chapterId: string) => {
    if (!window.confirm("¿Seguro que quieres eliminar este capítulo?")) return;
    setLoading(true);
    try {
      await deleteChapter(chapterId);
      const updated = await getChapters(projectId);
      setChapters(updated);
      if (updated.length > 0) {
        setSelectedChapter(updated[0]);
        setContent(updated[0].content || "");
      } else {
        setSelectedChapter(null);
        setContent("");
      }
    } catch {
      setError("Error al eliminar capítulo");
    } finally {
      setLoading(false);
    }
  };

  // Editor TipTap
  const tiptap = useEditor({
    extensions: [
      StarterKit,
      Underline,
      LinkExtension,
      ImageExtension,
      Highlight,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
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

  // Barra de herramientas reactiva
  const isBold = tiptap?.isActive('bold') || false;
  const isItalic = tiptap?.isActive('italic') || false;
  const isUnderline = tiptap?.isActive('underline') || false;
  const isHighlight = tiptap?.isActive('highlight') || false;
  const isBulletList = tiptap?.isActive('bulletList') || false;
  const isOrderedList = tiptap?.isActive('orderedList') || false;
  const align = tiptap?.isActive({ textAlign: 'center' }) ? 'center' : tiptap?.isActive({ textAlign: 'right' }) ? 'right' : tiptap?.isActive({ textAlign: 'justify' }) ? 'justify' : 'left';
  const currentFontFamily = tiptap?.getAttributes('textStyle').fontFamily || fontFamily;
  const currentFontSize = parseInt((tiptap?.getAttributes('textStyle').fontSize || '').replace('pt', '')) || fontSize;

  // Handlers de formato
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
  const handleInsertLink = () => {
    const url = prompt('Ingresa la URL:');
    if (url) tiptap?.chain().focus().setLink({ href: url }).run();
  };
  const handleInsertImage = () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url) tiptap?.chain().focus().setImage({ src: url }).run();
  };
  const handleFontSize = (size: number) => {
    tiptap?.chain().focus().setFontSize(`${size}pt`).run();
  };
  const handleFontFamily = (family: string) => {
    tiptap?.chain().focus().setFontFamily(family).run();
  };

  return (
    <div className="flex h-full w-full">
      {/* Editor centrado */}
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        {/* Barra de herramientas */}
        <div className="bg-white dark:bg-gray-900 p-2 rounded-lg shadow flex flex-wrap items-center gap-2 mb-4 w-[80%] max-w-4xl">
          <Button variant="ghost" size="sm" onClick={handleUndo} title="Deshacer"><Undo className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={handleRedo} title="Rehacer"><Redo className="h-4 w-4" /></Button>
          <Button variant={isBold ? "secondary" : "ghost"} size="sm" onClick={handleBold} title="Negrita"><Bold className="h-4 w-4" /></Button>
          <Button variant={isItalic ? "secondary" : "ghost"} size="sm" onClick={handleItalic} title="Cursiva"><Italic className="h-4 w-4" /></Button>
          <Button variant={isUnderline ? "secondary" : "ghost"} size="sm" onClick={handleUnderline} title="Subrayado"><UnderlineIcon className="h-4 w-4" /></Button>
          <Button variant={isHighlight ? "secondary" : "ghost"} size="sm" onClick={handleHighlight} title="Resaltar"><Highlighter className="h-4 w-4" /></Button>
          <Button variant={isBulletList ? "secondary" : "ghost"} size="sm" onClick={handleBulletList} title="Lista con viñetas"><List className="h-4 w-4" /></Button>
          <Button variant={isOrderedList ? "secondary" : "ghost"} size="sm" onClick={handleNumberedList} title="Lista numerada"><ListOrdered className="h-4 w-4" /></Button>
          <Button variant={align === 'left' ? "secondary" : "ghost"} size="sm" onClick={handleAlignLeft} title="Alinear izquierda"><AlignLeft className="h-4 w-4" /></Button>
          <Button variant={align === 'center' ? "secondary" : "ghost"} size="sm" onClick={handleAlignCenter} title="Centrar"><AlignCenter className="h-4 w-4" /></Button>
          <Button variant={align === 'right' ? "secondary" : "ghost"} size="sm" onClick={handleAlignRight} title="Alinear derecha"><AlignRight className="h-4 w-4" /></Button>
          <Button variant={align === 'justify' ? "secondary" : "ghost"} size="sm" onClick={handleAlignJustify} title="Justificar"><AlignJustify className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={handleInsertLink} title="Insertar enlace"><Link className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={handleInsertImage} title="Insertar imagen"><Image className="h-4 w-4" /></Button>
          <select className="px-2 py-1 border border-gray-300 rounded text-sm w-32" value={currentFontFamily} onChange={e => handleFontFamily(e.target.value)}>
            <option>Times New Roman</option>
            <option>Arial</option>
            <option>Calibri</option>
            <option>Georgia</option>
            <option>Verdana</option>
          </select>
          <select className="px-2 py-1 border border-gray-300 rounded text-sm w-16" value={currentFontSize} onChange={e => handleFontSize(Number(e.target.value))}>
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
        {/* Área del editor */}
        <Card className="bg-white dark:bg-gray-900 shadow-lg mx-auto w-[80%] max-w-4xl min-h-[600px] flex flex-col">
          <EditorContent editor={tiptap} className="tiptap-editor flex-1 px-8 py-6" />
        </Card>
        <div className="mt-2 text-right w-[80%] max-w-4xl text-xs text-gray-500">Último guardado: {lastSaved.toLocaleTimeString()} {isEditing && <span className="text-orange-600 ml-2">● Sin guardar</span>}</div>
        {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
      </div>
      {/* Sección de capítulos a la derecha */}
      <div className="w-80 min-w-[280px] max-w-xs border-l bg-gray-50 dark:bg-gray-900 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-lg text-gray-800 dark:text-gray-100">Capítulos</span>
          <Button size="sm" variant="ghost" onClick={() => handleCreateChapter()} title="Nuevo capítulo"><Plus className="h-4 w-4" /></Button>
        </div>
        <input className="w-full mb-2 px-2 py-1 border rounded text-sm" placeholder="Nuevo capítulo..." value={newChapterTitle} onChange={e => setNewChapterTitle(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleCreateChapter(); }} />
        <div className="flex-1 overflow-y-auto space-y-2">
          {chapters.length === 0 && <div className="text-gray-400 text-sm">No hay capítulos aún.</div>}
          {chapters.map((chapter) => (
            <div key={chapter.id} className={`p-3 rounded-md cursor-pointer border ${selectedChapter?.id === chapter.id ? "bg-white border-indigo-200 shadow-sm" : "bg-white border-gray-200 hover:border-gray-300"}`} onClick={() => handleSelectChapter(chapter)}>
              <div className="font-medium text-sm text-gray-800 mb-1 flex justify-between items-center">
                <span>{chapter.title}</span>
                <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); handleDeleteChapter(chapter.id); }} title="Eliminar capítulo"><span className="text-red-500">✕</span></Button>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{chapter.content ? `${chapter.content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length} palabras` : "Sin contenido"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 