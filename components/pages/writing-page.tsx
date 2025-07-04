'use client';

import React, { useState, useEffect } from 'react';

// Componente wrapper para el editor
function QuillEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [QuillComponent, setQuillComponent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuill = async () => {
      try {
        // Importar CSS
        await import('react-quill/dist/quill.snow.css');
        // Importar componente
        const { default: ReactQuill } = await import('react-quill');
        setQuillComponent(() => ReactQuill);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading Quill:', error);
        setIsLoading(false);
      }
    };

    loadQuill();
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: 400, 
        background: '#f9fafb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid #e5e7eb',
        borderRadius: '4px'
      }}>
        Cargando editor...
      </div>
    );
  }

  if (!QuillComponent) {
    return (
      <div style={{ 
        minHeight: 400, 
        background: '#fef2f2', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid #fecaca',
        borderRadius: '4px',
        color: '#dc2626'
      }}>
        Error al cargar el editor
      </div>
    );
  }

  return (
    <QuillComponent 
      theme="snow" 
      value={value} 
      onChange={onChange}
      style={{ minHeight: 400 }}
    />
  );
}

export default function WritingPage() {
  const [value, setValue] = useState('');

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#f3f4f6',
      padding: '20px'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: 800, 
        background: 'white', 
        borderRadius: 8, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)', 
        padding: 24 
      }}>
        <QuillEditor value={value} onChange={setValue} />
      </div>
    </div>
  );
}
