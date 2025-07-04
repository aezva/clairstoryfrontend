import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Usar any para evitar errores de tipado
const ReactQuill = dynamic<any>(() => import('react-quill'), { ssr: false });

export default function WritingPage() {
  const [value, setValue] = useState('');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
      <div style={{ width: '100%', maxWidth: 800, background: 'white', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 24 }}>
        <ReactQuill theme="snow" value={value} onChange={setValue} style={{ minHeight: 400 }} />
      </div>
    </div>
  );
}
