import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Importación dinámica con fallback
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div style={{ minHeight: 400, background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando editor...</div>
});

export default function WritingPage() {
  const [value, setValue] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
        <div style={{ width: '100%', maxWidth: 800, background: 'white', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 24 }}>
          <div style={{ minHeight: 400, background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Cargando editor...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
      <div style={{ width: '100%', maxWidth: 800, background: 'white', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 24 }}>
        <ReactQuill theme="snow" value={value} onChange={setValue} style={{ minHeight: 400 }} />
      </div>
    </div>
  );
}
